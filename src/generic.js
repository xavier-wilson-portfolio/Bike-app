/* ============ bikes without factory diagrams in the app yet ============
   The diagrams page links out to the official parts fiche instead of showing an empty list. */
if (!HAS_CAT && !X.handDiagrams) {
  const FICHE = [["fiche", "Factory parts diagrams", "Exploded diagrams and part numbers for the " + BIKE.name + "."], ["partzilla", "Partzilla", "Original parts diagrams, shipped from the US."], ["cmsnl", "CMSNL", "Original parts diagrams, shipped from the Netherlands."]]
    .filter(([k]) => BIKE.links && BIKE.links[k]).filter(([k], i, a) => a.findIndex(([k2]) => BIKE.links[k2] === BIKE.links[k]) === i);
  VIEWS.diagrams = {
    render() {
      return `<div class="ph" data-own="1"><div class="eyebrow">Learn</div><h1>Parts diagrams</h1><p>Revora doesn't have the factory parts diagrams for the ${esc(BIKE.name)} built in yet. Until it does, the official diagrams are one click away.</p></div>
        ${FICHE.length ? `<div class="shops">${FICHE.map(([k, t, d]) => `<a class="shop" href="${esc(BIKE.links[k])}" target="_blank" rel="noopener"><span class="shop-ic">${ic("layers")}</span><b>${esc(t)}</b><span class="muted">${esc(d)}</span><span class="linkbtn">Open the diagrams ${ic("next")}</span></a>`).join("")}</div>` : ""}
        <div class="panel stack" style="max-width:760px;margin:0 auto"><b>How to use them with your project</b>
          <ol style="margin:0;padding-left:20px;line-height:1.6"><li>Find the diagram for the area you're working on (for example the brakes or the cooling system).</li><li>Note the reference number and the part number for anything you need.</li><li>Open that part in <button class="linkbtn" data-go="inventory">Parts</button> and type the part number in, so it's saved with your project and the whole team sees it.</li><li>Add it to the <button class="linkbtn" data-go="purchasing">Shopping list</button> when you're ready to order.</li></ol></div>`;
    },
    bind(root) { $$("[data-go]", root).forEach(b => b.onclick = () => go(b.dataset.go)); }
  };
}
