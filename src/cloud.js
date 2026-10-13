/* ============ cloud store ============
   Makes Supabase look like the small database interface the app already uses:
   db.collection(c).onSnapshot(cb), .orderBy(k, dir).limit(n), .doc(id).set(body), .doc(id).delete().
   Every record of a project lives in one table (records: project_id, coll, rec_id, data). */
function rvCloudDb(sb, pid) {
  const cache = {}, subs = {};
  let loading = null;
  const coll = c => cache[c] || (cache[c] = new Map());
  const errOf = e => { const code = !e ? "network" : e.code === "42501" ? "permission_denied" : /fetch|network|timeout/i.test(e.message || "") ? "unavailable" : (e.code || "error"); return Object.assign(new Error(e && e.message || code), { code }); };
  async function loadAll() {
    const page = 1000;
    for (let from = 0; ; from += page) {
      const { data, error } = await sb.from("records").select("coll,rec_id,data").eq("project_id", pid).order("coll").order("rec_id").range(from, from + page - 1);
      if (error) throw errOf(error);
      data.forEach(r => coll(r.coll).set(r.rec_id, r.data));
      if (data.length < page) break;
    }
  }
  function snap(c, opt) {
    let docs = [...coll(c).entries()].map(([id, v]) => ({ id, data: () => v }));
    if (opt.order) { const [k, dir] = opt.order, s = dir === "desc" ? -1 : 1; docs.sort((a, b) => (String(a.data()[k] ?? "") > String(b.data()[k] ?? "") ? 1 : -1) * s); }
    if (opt.limit) docs = docs.slice(0, opt.limit);
    return { docs };
  }
  const fire = c => (subs[c] || []).forEach(s => s.cb(snap(c, s.opt)));
  sb.channel("project-" + pid)
    .on("postgres_changes", { event: "*", schema: "public", table: "records", filter: "project_id=eq." + pid }, ev => {
      const row = ev.eventType === "DELETE" ? ev.old : ev.new; if (!row || !row.coll) return;
      if (ev.eventType === "DELETE") coll(row.coll).delete(row.rec_id); else coll(row.coll).set(row.rec_id, row.data);
      fire(row.coll);
    })
    .subscribe();
  function query(c, opt) {
    return {
      orderBy: (k, dir) => query(c, Object.assign({}, opt, { order: [k, dir] })),
      limit: n => query(c, Object.assign({}, opt, { limit: n })),
      onSnapshot(cb, err) {
        const s = { cb, opt }; (subs[c] || (subs[c] = [])).push(s);
        (loading || (loading = loadAll())).then(() => cb(snap(c, opt)), e => err && err(errOf(e)));
        return () => { subs[c] = (subs[c] || []).filter(x => x !== s); };
      },
      doc: id => ({
        async set(body) {
          const { error } = await sb.from("records").upsert({ project_id: pid, coll: c, rec_id: id, data: body, updated_at: new Date().toISOString() });
          if (error) throw errOf(error); coll(c).set(id, body);
        },
        async delete() {
          const { error } = await sb.from("records").delete().match({ project_id: pid, coll: c, rec_id: id });
          if (error) throw errOf(error); coll(c).delete(id);
        }
      })
    };
  }
  return { collection: c => query(c, {}) };
}
