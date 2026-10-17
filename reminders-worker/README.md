# Revora reminders worker

Sends the service reminder emails once a day through Resend, from reminders@revoragarage.com.

1. Run `supabase/reminders_email.sql` once in the Supabase SQL editor.
2. In Cloudflare, create a Worker named `revora-reminders` and paste `worker.js`.
3. Settings > Variables and Secrets, both type Secret: `RESEND_API_KEY` (from resend.com) and `WORKER_SECRET` (same value as BILLING_SECRET).
4. Settings > Trigger events > Cron trigger: `0 13 * * *` (9am Eastern, 8am in winter).
No Supabase service key is used. Visiting `/run` sends anything due right now.
