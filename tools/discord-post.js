#!/usr/bin/env node
// Posts Midlife Survivors news to Discord through webhooks.
// Run by .github/workflows/discord.yml. Usage: node tools/discord-post.js <changelog|memos|stats|test|backfill|art>
// Webhook URLs come from environment variables (GitHub secrets) and are never printed.
// What has already been posted is remembered in .github/discord-state.json.
// "backfill" is a one-time catch-up: every old build, by day, then every published memo, oldest first.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const STATE_FILE = path.join(ROOT, ".github/discord-state.json");
const STATS_FILE = path.join(ROOT, "reports/discord-stats.md");
const PLAY_URL = "https://ramidaud.github.io/midlife-survivors/";
const DEVLOG_URL = PLAY_URL + "devlog/";
const COLORS = { changelog: 0x2f8f83, memo: 0xc8743a, stats: 0x5b6f7a, test: 0x8fae8b, art: 0xBFA8CF };
const DESCRIPTION_LIMIT = 3900; // Discord allows 4096 per embed; leave room

function readState() { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
function writeState(state) { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n"); }

function loadVersion() {
  const code = fs.readFileSync(path.join(ROOT, "src/data/version.js"), "utf8");
  return vm.runInNewContext(code + "\n;GAME_VERSION", { window: {}, console });
}
function loadPosts() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "devlog/posts.js"), "utf8"), sandbox);
  return sandbox.window.DEVLOG_POSTS;
}

async function send(envName, payload) {
  const url = process.env[envName];
  if (!url) throw new Error(`Missing secret ${envName}`);
  const body = JSON.stringify({ username: "Midlife Survivors", allowed_mentions: { parse: [] }, ...payload });
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url + "?wait=true", { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (res.ok) return;
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get("retry-after")) || attempt + 1;
      await new Promise(r => setTimeout(r, wait * 1000));
      continue;
    }
    // Discord's error text is safe to show; the URL is not included.
    throw new Error(`${envName}: Discord answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  throw new Error(`${envName}: Discord kept refusing after 4 tries`);
}

// Everything newer than the last version we announced. Newest first in version.js.
function newChangelogEntries(entries, lastVer) {
  const i = entries.findIndex(e => e.ver === lastVer);
  if (i === -1) return entries.slice(0, 1); // unknown marker: announce only the latest, never flood
  return entries.slice(0, i);
}

function changelogPayload(fresh) {
  const newest = fresh[0], oldest = fresh[fresh.length - 1];
  let description;
  if (fresh.length === 1) {
    description = [newest.teaser, "", ...(newest.highlights || []).map(h => `- ${h}`)].filter(x => x !== undefined).join("\n");
  } else {
    const lines = [];
    let used = 0, shown = 0;
    for (const e of fresh) {
      const line = `**${e.ver}:** ${e.teaser || (e.highlights || [])[0] || e.title}`;
      if (used + line.length + 1 > DESCRIPTION_LIMIT - 40) break;
      lines.push(line); used += line.length + 1; shown++;
    }
    if (shown < fresh.length) lines.push(`...and ${fresh.length - shown} earlier updates.`);
    description = lines.join("\n");
  }
  const title = fresh.length === 1 ? `New build: ${newest.ver}` : `${fresh.length} new builds: ${oldest.ver} to ${newest.ver}`;
  return { embeds: [{ title, url: PLAY_URL, description: description.slice(0, 4000), color: COLORS.changelog, footer: { text: "Play the latest at ramidaud.github.io/midlife-survivors" } }] };
}

async function postChangelog(state) {
  const entries = loadVersion().changelog;
  const fresh = newChangelogEntries(entries, state.changelogVersion);
  if (!fresh.length) return console.log("Changelog: nothing new");
  await send("DISCORD_WEBHOOK_CHANGELOG", changelogPayload(fresh));
  state.changelogVersion = entries[0].ver;
  writeState(state);
  console.log(`Changelog: posted ${fresh.length} build(s)`);
}

function memoPayload(post, label = "New memo") {
  const link = `${DEVLOG_URL}${post.slug}/`;
  const embed = { title: post.title, url: link, description: (post.teaser || post.blurb || "A new memo is up.").slice(0, 1000), color: COLORS.memo, footer: { text: [post.version, "Midlife Survivors devlog"].filter(Boolean).join(" · ") } };
  if (post.cover) embed.image = { url: `${DEVLOG_URL}${post.cover}` };
  return { content: `${label}: ${link}`, embeds: [embed] };
}

async function postMemos(state, labelFor = () => "New memo") {
  const published = loadPosts().filter(p => p.draft === false);
  const fresh = published.filter(p => !state.memosPosted.includes(p.slug)).reverse(); // oldest first
  if (!fresh.length) return console.log("Memos: nothing new");
  for (const post of fresh) {
    if (JSON.stringify(post).includes("[RAMI:")) { console.log(`Memos: skipped ${post.slug}, it still has [RAMI: ...] placeholders`); continue; }
    await send("DISCORD_WEBHOOK_DEVLOG", memoPayload(post, labelFor(post)));
    state.memosPosted.push(post.slug);
    writeState(state); // save after each, so a later failure can't double-post
    console.log(`Memos: posted ${post.slug}`);
  }
}

async function postStats(state) {
  if (!fs.existsSync(STATS_FILE)) return console.log("Stats: no summary file yet");
  const text = fs.readFileSync(STATS_FILE, "utf8").trim();
  const hash = crypto.createHash("sha256").update(text).digest("hex");
  if (hash === state.statsHash) return console.log("Stats: already posted");
  const [first, ...rest] = text.split("\n");
  await send("DISCORD_WEBHOOK_STATS", { embeds: [{ title: first.replace(/^#+\s*/, "").slice(0, 250), description: rest.join("\n").trim().slice(0, 4000), color: COLORS.stats }] });
  state.statsHash = hash;
  writeState(state);
  console.log("Stats: posted");
}

// Old builds, oldest first, split into messages by day (and into parts on busy days).
function changelogHistoryMessages(entries) {
  const seen = new Set();
  const unique = entries.filter(e => !seen.has(e.ver) && seen.add(e.ver)).reverse();
  const titleCount = {};
  for (const e of unique) titleCount[e.title] = (titleCount[e.title] || 0) + 1;
  const describe = e => {
    if (e.teaser) return e.teaser;
    if (e.title && titleCount[e.title] === 1) return e.title;
    const h = (e.highlights || [])[0] || e.title || "";
    return h.length > 180 ? h.slice(0, 177).trimEnd() + "..." : h;
  };
  const days = [];
  for (const e of unique) {
    if (!days.length || days[days.length - 1].date !== e.date) days.push({ date: e.date, lines: [] });
    days[days.length - 1].lines.push(`**${e.ver}:** ${describe(e)}`);
  }
  const messages = [];
  for (const day of days) {
    const parts = [[]];
    let used = 0;
    for (const line of day.lines) {
      if (used + line.length + 1 > DESCRIPTION_LIMIT) { parts.push([]); used = 0; }
      parts[parts.length - 1].push(line);
      used += line.length + 1;
    }
    parts.forEach((lines, i) => messages.push({
      key: `${day.date}#${i + 1}`,
      payload: { embeds: [{ title: `${day.date}: ${day.lines.length} builds${parts.length > 1 ? ` (part ${i + 1} of ${parts.length})` : ""}`, url: PLAY_URL, description: lines.join("\n"), color: COLORS.changelog }] }
    }));
  }
  return messages;
}

async function backfill(state) {
  const progress = state.backfill || (state.backfill = { changelogDone: [], memosReset: false });
  if (progress.finished) return console.log("Backfill: already finished");
  const entries = loadVersion().changelog;
  const messages = changelogHistoryMessages(entries);
  for (const m of messages) {
    if (progress.changelogDone.includes(m.key)) continue;
    await send("DISCORD_WEBHOOK_CHANGELOG", m.payload);
    progress.changelogDone.push(m.key);
    writeState(state); // save after each, so a rerun picks up where it stopped
    console.log(`Backfill: posted ${m.key}`);
    await new Promise(r => setTimeout(r, 1500));
  }
  state.changelogVersion = entries[0].ver;
  if (!progress.memosReset) { state.memosPosted = []; progress.memosReset = true; writeState(state); }
  const dateLabel = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  await postMemos(state, post => `From the archive, ${dateLabel(post.date)}`);
  progress.finished = true;
  writeState(state);
  console.log("Backfill: finished");
}

async function postTests() {
  const v = loadVersion().displayVersion;
  const targets = [["DISCORD_WEBHOOK_CHANGELOG", "changelog", "New builds land here once a day."], ["DISCORD_WEBHOOK_DEVLOG", "devlog", "New memos land here when they're published."], ["DISCORD_WEBHOOK_STATS", "stats", "Morning play stats land here."]];
  for (const [env, name, line] of targets) {
    await send(env, { embeds: [{ title: `Test post: #${name}`, description: `${line}\nThe game is on ${v}.`, url: PLAY_URL, color: COLORS.test }] });
    console.log(`Test: posted to ${name}`);
  }
}

// #art-and-ideas: the gallery in tools/discord-art.json. Each post goes out once (ids remembered in the state file).
async function postArt(state) {
  const { posts } = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/discord-art.json"), "utf8"));
  const done = state.artPosted || (state.artPosted = []);
  for (const p of posts) {
    if (done.includes(p.id)) continue;
    const embeds = p.images.slice(0, 10).map(([title, file], i) => ({ title, url: PLAY_URL + "#art-" + p.id + "-" + i, color: COLORS.art, image: { url: PLAY_URL + file } }));
    // (each embed gets its own link: Discord merges embeds that share one)
    await send("DISCORD_WEBHOOK_ART", { content: p.intro, embeds });
    done.push(p.id); writeState(state);
    console.log(`Art: posted ${p.id}`);
    await new Promise(r => setTimeout(r, 1500));
  }
}

async function main() {
  const action = process.argv[2];
  const state = readState();
  if (action === "changelog") await postChangelog(state);
  else if (action === "memos") await postMemos(state);
  else if (action === "stats") await postStats(state);
  else if (action === "test") await postTests();
  else if (action === "backfill") await backfill(state);
  else if (action === "art") await postArt(state);
  else throw new Error("Usage: discord-post.js <changelog|memos|stats|test|backfill|art>");
}
main().catch(err => { console.error(err.message); process.exit(1); });
