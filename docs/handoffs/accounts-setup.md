# Accounts setup: Rami's checklist (Nov 4, 2026)

The game side is built and the `player_saves` table is live (each player can only read and write their own row). Sign-in stays **hidden from players** until these steps are done. You can test anytime by adding `?accounts=1` to the game's address.

All clicks are in the Supabase dashboard for the Midlife Survivors project unless noted.

## 1. Where sign-ins come back to (2 min)
**Authentication > URL Configuration**
- **Site URL:** `https://ramidaud.github.io/midlife-survivors/`
- **Redirect URLs > Add URL:** `https://ramidaud.github.io/midlife-survivors/**`

## 2. Put the 6-digit code in the emails (after step 3)
> **Found Nov 4:** on the free plan, Supabase won't let you edit email templates until a custom email sender (SMTP) is set up. Until then the default email sends a **sign-in link** instead of a code, and the game accepts that (open the link on the same device and browser). So do step 3 first, then come back here.

**Authentication > Emails** (Templates). Edit **both** "Magic Link" and "Confirm signup" (new players get the second one).

- **Subject:** `Your Midlife Survivors code: {{ .Token }}`
- **Body:**
```html
<h2>Clock in to Midlife Survivors</h2>
<p>Your code is:</p>
<p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
<p>Type it in the game. It works for a few minutes. If you didn't ask for this, you can ignore it.</p>
```

**Test it:** open `https://ramidaud.github.io/midlife-survivors/?accounts=1`, tap **Clock in** on your employee file, and use your own email.

## 3. Email for real players (needs a decision)
Supabase's built-in email only delivers to **members of your Supabase team** (that's you), a few times an hour. Friends won't get codes until a real email sender is connected.
- **Easiest:** [Resend](https://resend.com) has a free tier. It needs a domain you own: **ramidaud.com** works (sender like `noreply@ramidaud.com`).
- Then: **Project Settings > Authentication > SMTP Settings**, turn on custom SMTP, and paste Resend's host, port, username and password.
- **No domain?** Google sign-in (step 4) works for everyone without any email setup.

## 4. Google sign-in (about 20 min, free)
1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a project called "Midlife Survivors".
2. **APIs & Services > OAuth consent screen:** External, app name "Midlife Survivors", your email for support and contact. Publish it.
3. **APIs & Services > Credentials > Create credentials > OAuth client ID:** type "Web application".
   - Authorized JavaScript origins: `https://ramidaud.github.io`
   - Authorized redirect URIs: `https://pgxmvhabcgxvdnjtiect.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client secret**.
5. In Supabase: **Authentication > Sign In / Providers > Google:** turn it on and paste both. Save.
6. Tell Claude. Claude flips `google: true` in `src/data/account.js`.

## 5. Apple sign-in (needs a paid Apple Developer account, $99 a year)
Skip this until you decide it's worth it. When you're ready:
1. [developer.apple.com](https://developer.apple.com) > **Certificates, Identifiers & Profiles**.
2. Make a **Services ID** with "Sign in with Apple" on. Domain: `pgxmvhabcgxvdnjtiect.supabase.co`. Return URL: `https://pgxmvhabcgxvdnjtiect.supabase.co/auth/v1/callback`.
3. Make a **Key** with "Sign in with Apple". Download the `.p8` file, and note the Key ID and your Team ID.
4. In Supabase: **Authentication > Sign In / Providers > Apple:** paste the Services ID, Team ID, Key ID and the key. Apple's secret expires every 6 months, so put a reminder on your calendar.
5. Tell Claude. Claude flips `apple: true`.

## 6. Go live
When step 2 works for you and either step 3 or step 4 is done, tell Claude to set `enabled: true`. Then the **Clock in** badge shows for everyone.
