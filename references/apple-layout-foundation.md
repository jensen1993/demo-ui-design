# Apple-informed layout foundation for demos

Use Apple's Human Interface Guidelines (HIG) as a foundational reference for layout, hierarchy, controls and adaptability across demo types. Apply the principles in context: an interactive browser demo is not an Apple-native app, and PC business tables, Android, and mini-program conventions need their own appropriate controls. Explicit user, brand, existing design system, target-platform and accessibility requirements take precedence. Do not label custom UI as Apple-certified or HIG-compliant without actual evaluation.

## Sources and what they actually say

- [Layout](https://developer.apple.com/design/human-interface-guidelines/layout): organize by importance; align and group related items; adapt to window size, text size, orientation and safe areas. It does not prescribe one universal spacing grid or button position for every app.
- [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): make controls easy to find and use; a button generally needs at least a 44 × 44 pt hit region in touch contexts; give custom buttons press feedback; use prominence to identify primary actions.
- [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles/): establish hierarchy, keep related controls predictable, support appropriate input methods and design inclusively.
- [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): account for different text sizes, contrast and assistive input. Check actual platform capabilities rather than assuming browser simulation reproduces native settings.
- [Apple Design Resources](https://developer.apple.com/design/resources/): official platform UI kits and templates as references. They have their own terms; do not bundle or redistribute assets by default.

## Practical layout rules for browser demos

These are actionable demo conventions inspired by the principles above, not Apple-mandated pixel values. Use existing project tokens and the chosen component library; adjust for content, available width and device.

### Page heading and actions

- Treat the title, description and page-level action as a deliberate group. In PC layouts, align the action with the heading area consistently (often vertically centered with the title/description group, or aligned to the title row); use a shared content boundary. Avoid leaving the button isolated at the bottom of a tall, mostly empty heading area. Keep page actions separate from table-level filters and row-level actions.
- Prefer one clear primary action for a context. Keep related secondary actions next to it with consistent spacing; avoid making all controls equally prominent. On narrow widths wrap or stack action groups instead of clipping them; keep the reading and focus order logical.

### Spacing and alignment

- Use shared left and right content edges; align titles, section headers, cards, tables and controls to the same grid unless hierarchy or content justifies an inset. Keep space inside a group visibly smaller than space between groups. Use a small spacing scale and tune it visually; 8/12/16/24/32 CSS px are adjustable starting tokens, not Apple requirements.
- In equal-purpose rows or grids, use consistent card dimensions, gutters, inner padding and aligned icon/label baselines. Allow longer text to wrap, and let card heights grow together. Entire clickable cards need clear interactive affordance and a sufficiently large target.
- Mobile shortcut groups should remain within page padding, distribute items predictably and leave enough space between hit areas. At narrow widths, reduce columns or wrap if labels would clip; do not hide the outer edge of the final card. Ensure focus outlines and pressed states remain visible.

### Density and responsive behavior

- Use space to communicate hierarchy, not decoration alone. On operational PC screens, keep the main task (for example a table or queue) discoverable in the first screen when reasonable; avoid oversized decorative banners or summary cards pushing all meaningful work below the fold.
- Determine breakpoints from available content width, not screenshot pixels or physical display size. Test a wide desktop viewport and a narrower PC window; test a typical phone viewport and a narrower phone viewport for mobile. Do not equate a browser viewport with an actual device test. Verify browser zoom and long localized text when relevant.
- For mobile, respect browser safe-area insets where available and avoid fixed controls covering scrollable content. For touch-oriented controls use the 44 × 44 pt Apple recommendation as a design reference and appropriate CSS hit areas; verify the real input target rather than equating screen pixels to points. For PC ensure mouse targets, keyboard order and visible focus are usable.

## Concrete visual review

Inspect representative screenshots and interact with the real browser preview, at the stated viewport sizes when possible:

1. Does the heading action visibly align with its heading group and sit on the same content grid? Is it still reachable and readable after narrowing the window?
2. Do grouped buttons and shortcut cards have consistent gaps, equal alignment, clear click targets, enough label space and no clipped outer edges, horizontal overflow or overlapping focus outlines?
3. Do heading, search, banner, shortcuts, section title and list have a clear spacing hierarchy? Does a row of cards waste space or push the main task needlessly below the fold?
4. Do long Chinese labels, error messages, keyboard focus and larger text cause wrapping, overflow, misalignment or overlap? Verify by observation; do not claim a measurement or device acceptance that was not performed.

Record any visible issues and correct the layout, then recheck the affected view. If visual inspection is unavailable, report that limit explicitly.
