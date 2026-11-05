# Mobile page patterns

Choose based on the demo's requested journey and content, not a fixed template. Apply design-baseline.md and target-platform conventions. Use an existing component library where appropriate.

- Commerce home: make search/category access, a small number of relevant promotional items, product list, and primary navigation easy to find. Use consistent product imagery, honest prices and meaningful categories. Make category selection or search change actual visible sample items.
- Product detail: show a representative image, name, price, variant or availability, and a clear add-to-cart action. Keep important information and the action accessible without obscuring safe areas; handle long names and content scrolling.
- Cart/checkout preview: show quantities, prices and total that actually agree. Make quantity or removal work if visible. Label any simulated order completion clearly; do not imply a real transaction.
- Profile/account: show identity and the few relevant navigation items with clear hierarchy. Keep text and tap targets readable; distinguish navigation from switches and actions.
- Adapt navigation and controls to iOS and Android when appropriate; a responsive web mockup in a phone frame is not a native app or device validation. Default to a mobile-browser implementation; for an explicitly requested or existing Flutter, uni-app or native project, use that target's compatible widgets and safe-area APIs.
