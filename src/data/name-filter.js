// Leaderboard name filter (Nov 5, Kevin's Discord tip). Rami's call: block swears, slurs and hate terms;
// mild joke names ("Semore Butts", "Hugh Jass") are allowed.
// The same lists live in Supabase (function public.name_ok) so a name sent straight to the database is refused too.
// If you change a list here, tell Claude so the database copy gets the same change.
//
// How matching works: the name is lowercased, number/symbol swaps are undone (5h1t -> shit, @ -> a),
// then everything that isn't a letter is removed.
//   anywhere: blocked if it shows up inside the name at all ("xXfuckXx").
//   word:     blocked only as its own word, because it hides inside normal words or names
//             (cock/Hancock, dick/Dickens, spic/spice, anal/analyst, nazi/Nazir, rapist/therapist, pedo/torpedo).
window.NAME_FILTER = {
  anywhere: [
    "fuck", "shit", "cunt", "bitch", "pussy", "whore", "slut", "twat", "jizz", "porn", "penis", "vagina",
    "dildo", "blowjob", "handjob", "rimjob", "cumshot", "bukkake", "hentai", "milf",
    "nigg", "niga", "nigr", "faggot", "fagot", "retard", "tranny", "wetback", "beaner", "kike",
    "hitler", "kkk", "pedophile", "molest", "incest"
  ],
  word: [
    "cock", "dick", "dicks", "cum", "tit", "tits", "rape", "fag", "fags", "spic", "chink", "dyke", "coon",
    "gook", "wank", "wanker", "negro", "kys", "nig", "anal", "nazi", "nazis", "pedo", "pedos", "rapist", "fuk"
  ],
  replacement: "Anonymous Retiree" // what the board shows if a bad name ever gets through
};

// True if a name is fine to show. Mirrors public.name_ok() in Supabase. Used by the game, the devlog and the about page.
window.nameOk = function (raw) {
  const F = window.NAME_FILTER; if (!F) return true;
  const swapped = String(raw || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[0134578@$!|+9]/g, c => ({ 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", 8: "b", 9: "g", "@": "a", $: "s", "!": "i", "|": "i", "+": "t" })[c]);
  const squash = swapped.replace(/[^a-z]/g, ""), once = squash.replace(/(.)\1+/g, "$1"); // "fuuuck" -> "fuck"
  const collapse = w => w.replace(/(.)\1+/g, "$1");
  if (F.anywhere.some(w => squash.includes(w) || (collapse(w).length >= 4 && once.includes(collapse(w))))) return false;
  const words = swapped.split(/[^a-z]+/).filter(Boolean);
  return !words.some(t => F.word.includes(t) || F.word.includes(collapse(t)));
};
