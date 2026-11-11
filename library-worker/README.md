# Revora library worker

Builds a bike's library entry (specs, torque values, factory diagram links) the first time a paying member adds a bike that isn't in the library yet.

How it works:
1. The bike page calls `POST /build` with the member's sign-in token.
2. The worker queues the bike in Supabase (`lib_request`). Free members' bikes wait in the queue until they upgrade.
3. Claude Haiku finds the owner's manual and pulls each number with its page. Claude Sonnet opens the same manual and keeps only the numbers it can confirm.
4. The entry is saved to `bike_library`. Everyone who adds that bike afterwards gets it instantly.

## Setup (Cloudflare, Xavier's account)
1. Run `supabase/bike_library.sql`, then `supabase/bike_library_seed.sql`, in the Supabase SQL editor.
2. Workers & Pages > Create > Worker, name it `revora-library`, paste `worker.js`, Deploy.
3. Settings > Variables and secrets:
   - `WORKER_SECRET` (secret): run `select secret from public.library_keys;` in Supabase and paste the result.
   - `ANTHROPIC_API_KEY` (secret): from console.anthropic.com > API keys. Set a monthly spend limit there first.
   - `MAX_PER_DAY` (text, optional): new bikes per day, default 40.
4. Settings > Triggers > Cron: `* * * * *` (picks up anything the instant build didn't finish).

Without `ANTHROPIC_API_KEY` the worker does nothing except queue bikes, so it's safe to deploy before paying.
`/health` shows whether the key is set.
