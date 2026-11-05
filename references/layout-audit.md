# Repeatable layout checks for browser demos

This protocol raises the baseline for the common heading/button and evenly spaced shortcut/card problems. It does not replace visual judgment or guarantee that a weaker model will produce a good design. The numeric thresholds below are **this skill's review heuristics in CSS pixels**, not Apple HIG rules; use user/project standards instead where specified. Do not infer physical points or claim native Apple compliance from a browser measurement.

## Required process

1. Choose representative screens and use the actual preview server URL. For a PC layout inspect both a wide viewport (e.g. 1280 × 800) and a narrower PC viewport (e.g. 768 × 800). For mobile inspect a typical viewport (390 × 844) and a narrow viewport (320 × 780). If an expected target size differs, include it; do not force all categories onto every page.
2. Identify visible page-level title group and primary action, equal-purpose card/shortcut groups and their shared container, and mobile interactive hit targets. Base selectors on the actual DOM and verify their role and visibility. Do not include decorative icons alone as touch targets. If the design has intentional horizontal scrolling, identify its container and test its visible controls and interaction separately; don't automatically force a grid to fit.
3. Gather actual CSS-pixel bounding rectangles (`left`, `top`, `right`, `bottom`) using an available browser's **read-only** DOM measurement API, and write a JSON file in a temporary directory. Use viewport width/height and document scroll width from the same rendered page and the same viewport. For headings, `group` is the shared bounding box containing both the title group and button (not just the text column); `title` is the title element, `action` the primary button. For a row/grid, `container` is its common parent and `items` are the complete clickable elements, not their icons or label spans. Mark deliberately uneven designs `equalSize:false` and explain why.
4. Run `node <skill-directory>/scripts/audit-layout.mjs <measurements.json>`. Address each `review` or record an intentional, justified exception. Rerun after a change. If Node or browser DOM measurement is unavailable, do not claim this audit passed: use available visual checks, report the skipped checks, and continue with whatever useful testing is possible.
5. Independently inspect screenshots at the same sizes: check actual text clipping, line wrapping, contrast, focus outline, correct reading order, fixed bars covering content, content hierarchy and an appropriate first screen. A numerical pass does not certify appearance or accessibility. Exercise buttons, search, forms and state changes separately; check visible copy against behavior.
6. In the response report tested viewports, any exceptions and what was not tested. An H5 viewport check is not an iOS, Android, or WeChat device acceptance test.

## Default numeric review rules

- Entire page: review if `documentWidth` exceeds viewport width by more than 2 px. This does not prohibit an intentional internal horizontally scrolling table; check the page itself and allow the table's explicit scroll region.
- PC heading: primary action stays within heading group, and either its vertical center is within 12 px of the group center or its top is within 8 px of the title top. Only apply to a horizontal title/action group, not intentionally stacked narrow layouts.
- Same-purpose grid: every visible item stays inside its container within 2 px, without overlapping; the script compares each pair in a supplied group, including different rows. In the same row top alignment, width spread and height spread should each be at most 2 px and gap spread at most 4 px. For intentionally different sizes set `equalSize:false` and describe intent. Wrapping into multiple rows is acceptable. The CLI's numerical thresholds are fixed; review justified exceptions manually.
- Mobile clickable control: visible hit area at least 44 × 44 CSS px by default; this is a browser-demo heuristic based on the Apple recommendation for 44 × 44 points and is not a conversion of physical device dimensions. An alternate validated design standard can override it.
- A main task/list beginning below the first PC viewport is a review warning, not an automatic failure: the design may intentionally prioritize another task.

## JSON shape

```json
{
  "viewportWidth": 390, "viewportHeight": 844, "documentWidth": 390,
  "headings": [{"name":"page header","group":{"left":16,"top":20,"right":374,"bottom":80},"title":{"left":16,"top":28,"right":150,"bottom":56},"action":{"left":270,"top":28,"right":374,"bottom":72}}],
  "groups": [{"name":"shortcuts","container":{"left":16,"top":100,"right":374,"bottom":188},"equalSize":true,"items":[{"name":"first","rect":{"left":20,"top":104,"right":100,"bottom":184}},{"name":"second","rect":{"left":110,"top":104,"right":190,"bottom":184}}]}],
  "touchTargets":[{"name":"first shortcut","rect":{"left":20,"top":104,"right":100,"bottom":184}}],
  "mainTask":{"name":"main list","rect":{"left":16,"top":220,"right":374,"bottom":600}}
}
```

Omit non-applicable arrays; never invent a measurement. The CLI only evaluates provided fields and reports `checkCount`; `status: incomplete` means no checks were supplied, and `no-findings-in-supplied-checks` means only those supplied checks had no findings, never a full acceptance pass. For elements inside internally scrolling regions, measure their visible relevant state and flag the intentional scroll separately. Note the exceptions in the final result.

## Browser measurement example

First inspect the actual page and replace selectors; the example illustrates the shape, not selectors to assume in other projects. Run through the available browser tool's read-only page-evaluation API; never inject this into production pages or use it to change page state. It returns data for one equal-purpose group and its click targets. Add a heading or main task only when present and applicable.

```js
() => {
  const box = (element) => {
    const r = element.getBoundingClientRect();
    return {left:r.left, top:r.top, right:r.right, bottom:r.bottom};
  };
  const container = document.querySelector('.actual-shortcut-container');
  const items = [...container.querySelectorAll('.actual-clickable-shortcut')]
    .filter(element => element.getClientRects().length > 0);
  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    documentWidth: document.documentElement.scrollWidth,
    groups: [{name:'shortcuts', container:box(container),
      items:items.map((element, i) => ({name:String(i+1), rect:box(element)}))}],
    touchTargets:items.map((element, i) => ({name:`shortcut ${i+1}`, rect:box(element)}))
  };
}
```

If selectors do not resolve, the page is not yet loaded, a component uses shadow DOM, or an element is not actually the clickable control, correct the observation before continuing. Do not turn missing measurements into zero or report a pass. For viewport settings, use the browser tool's documented API; reset any temporary viewport override afterward.

For maintainers changing the checker, run `node --test <skill-directory>/scripts/test-audit-layout.mjs`. Passing its synthetic rectangle tests verifies only those cases, not a real page or visual quality.
