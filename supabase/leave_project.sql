-- Revora: lets someone take a bike that was shared with them out of their own garage.
-- The owner's bike and records are untouched. Run once. Safe to run again.
drop policy if exists "members leave" on public.project_members;
create policy "members leave" on public.project_members for delete
  using (user_id = auth.uid() and role <> 'owner');
select 'Shared bikes can now be removed from a garage' as done;
