# Revora reminders worker

Sends the service reminder emails once a day.

1. Run `supabase/reminders.sql` once in the Supabase SQL editor.
2. Make a Resend account (resend.com) and verify the domain the emails come from.
3. In Cloudflare, create a Worker named `revora-reminders`, paste `worker.js`, and add a cron trigger (for example `0 13 * * *`, 9am Eastern).
4. Add secrets in the Worker's settings: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (Supabase, Project settings, API keys, service role), `RESEND_API_KEY`.
   Add plain variables: `FROM_EMAIL` (for example `Revora <reminders@yourdomain.com>`) and `APP_URL`.
The owner enters the secret values directly in the dashboard. They are never put in this repo.
