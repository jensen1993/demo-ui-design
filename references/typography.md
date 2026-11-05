# Apple-informed typography for browser demos

Use a calm, clear, legible hierarchy inspired by [Apple typography guidance](https://developer.apple.com/design/human-interface-guidelines/typography): favor system fonts, a small number of typefaces, regular-to-bold weights, and text that adapts to user size preferences. Apple gives platform-specific point sizes and native text styles, not a universal CSS pixel scale for web pages. The table below is this skill's default for new browser demos, **not an Apple-mandated specification**. Preserve an explicit user style, accessible project typography, brand identity and target platform conventions when they differ; adjust for the actual content and explain significant deviations. Apple-like clarity does not require Apple branding, a fixed color palette, identical layouts, or a native-iOS claim.

## Font and semantic tokens

- Use a system sans-serif stack by default: `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;`. The system will resolve fonts differently across macOS, Windows, Android and browsers; verify Chinese glyphs and punctuation on the available target. Do not assume SF or PingFang exists on every platform, download or redistribute Apple fonts by default, or claim that `system-ui` reproduces iOS Dynamic Type.
- Define semantic tokens or equivalent component theme styles for page title, section heading, card title, body, secondary information, caption, control, price and numeric emphasis. Reuse tokens across components; component-library defaults may be adjusted via its supported theme API. Avoid one-off arbitrary sizes and a different font per section. Fonts supplied or requested by the user may replace the stack when their availability and licensing permit.
- Use weights 400 for body, 500 for controls and selected labels, 600 for section/card headings and key numbers, 700 sparingly for major titles or price emphasis. Prefer legibility over thin 100–300 weights; do not make every label bold. Some Chinese fallback fonts lack intermediate weights: inspect the actual rendering and avoid synthesized heavy weights where they harm readability.

## Default type scale

Values are CSS px at 100% browser zoom; line height is unitless. These are adjustable starting tokens, not fixed heights or physical device points. Use relative units where appropriate so browser/user text settings can scale; never disable zoom. PC data tables may start at 14 px for density, but do not shrink text merely to squeeze columns.

| Semantic role | Mobile browser: size / weight / line height | PC browser: size / weight / line height |
| --- | --- | --- |
| Page title | 26 / 700 / 1.25 | 28 / 700 / 1.25 |
| Section heading | 20 / 600 / 1.35 | 20 / 600 / 1.35 |
| Card or list title | 16 / 600 / 1.4 | 16 / 600 / 1.4 |
| Body and primary data | 16 / 400 / 1.5 | 14–16 / 400 / 1.5 |
| Buttons, inputs, navigation | 16 / 500 / 1.4 | 14 / 500 / 1.4 |
| Secondary details | 14 / 400 / 1.45 | 14 / 400 / 1.45 |
| Supporting caption or metadata | 13 / 400 / 1.4 | 13 / 400 / 1.4 |
| Key price or metric | 20 / 600 / 1.25 | 20 / 600 / 1.25 |

Use captions only for noncritical support; important prices, units, error messages, actions and status labels must remain easy to read and not depend solely on muted color. Avoid text below 13 px by default; use a larger size when context or audience requires it. Avoid forced letter spacing on Chinese body text. Align prices and units on a baseline; use tabular numerals for comparable columns where supported. For long passages, use at least around 1.5 line height; for titles use a shorter but unclipped line height. No fixed row height should clip glyphs or descenders.

## Apply hierarchy to real content

- Use size, weight, position and verified contrast together: page title → section heading → item title → price or important status → secondary description. Price may be the strongest element when the task calls for it; currency/unit remain legible and visibly associated. In a product card, title and specification identify the product, price and unit belong together, and supplier/region are secondary. Avoid making all text the same size, all metadata faint, or every number a large heading.
- Prefer wrapping Chinese item names and important labels; do not break meaning in the middle of numbers, units, prices or key identifiers where avoidable. Let cards and rows grow. If truncation is needed for dense layouts, provide the full content via an accessible visible detail view or an accessible interaction that works on keyboard and touch; do not rely only on hover or a `title` tooltip. Preserve consistent row alignment without hiding important information.
- Apply the chosen system to real and long sample content, including Chinese, Latin, currencies, units, statuses, error copy and mixed scripts. Confirm form labels, placeholders, disabled states and badges remain readable, and product images do not contain the only copy of important text.

## Required review before delivery

1. At the actual preview URL, inspect at least one representative list/card screen and one detail/form screen when present, at the wide/narrow desktop or typical/narrow mobile sizes in `layout-audit.md`. Observe at normal 100% zoom; inspect computed `font-family`, `font-size`, `font-weight`, `line-height`, foreground/background colors on representative title, body, caption, control and price elements. Compare them with the semantic tokens and record intentionally different uses. Computed CSS family lists do not prove the actual rendered fallback font; inspect rendered glyphs or platform font tools when available.
2. Check text and meaningful control contrast against the actual background, including cards, disabled states where applicable, images and overlays. Aim for WCAG 2.2 AA: normal text 4.5:1, large text 3:1, meaningful control boundaries/states 3:1; large text is at least 18 pt regular or 14 pt bold (approximately 24 CSS px or 18.67 CSS px bold). Do not treat muted text, image backgrounds or anti-aliasing as proof of sufficient contrast; measure the actual color pairs and disclose if measurement is unavailable. Disabled/inactive controls have WCAG exceptions, but should remain distinguishable when practical.
3. Test text resize up to 200% with a browser-supported text scaling mechanism where available; verify the full text, controls and workflow remain available. Also inspect an enlarged-text or zoom view at a narrow width, checking long Chinese names, card wrapping, overlay/buttons and fixed bars. WCAG text resize and browser page zoom are related but not identical; if only page zoom was tested say so. If feasible, test user-overridden text spacing (line height 1.5, paragraph spacing 2× font size, letter spacing 0.12em and word spacing 0.16em where applicable) for no lost content or functionality. These are override test values, not required default styling. See [W3C resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) and [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).
4. Fix observed clipping, low contrast or confusing hierarchy and recheck affected screens. Report viewport/zoom or text resize method, representative text and contrast checks, exceptions and any checks not performed. A passing screenshot or numerical check alone is not proof of WCAG, Apple HIG or real-device compliance.
