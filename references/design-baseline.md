# Practical design baseline

Apply these as adjustable starting points for new demos without established brand or system tokens; use platform conventions, user requirements and existing design systems when they differ. Avoid treating values as a substitute for visual judgment or a promise of accessibility compliance.

## Foundations
- Define semantic tokens for background, surface, text, muted text, border, primary, success, warning and danger; use one primary accent plus restrained status colors. Check contrast: aim for WCAG 2.2 AA, generally 4.5:1 for normal text, 3:1 for large text and meaningful UI boundaries or states. Verify actual color pairs.
- Start with a 4 px spacing scale (4, 8, 12, 16, 24, 32, 48); keep related items closer together than unrelated groups. Use one consistent border/radius and shadow language; reserve strong elevation for overlays.
- Use the semantic type scale, font stack and verification process in [typography.md](typography.md) for PC and mobile browser demos; check Chinese copy, line heights, long names, numeric units and truncation.
- Align icon weight, size and baseline. Let labels clarify actions and do not rely on color alone for status. Provide recognizable focus and disabled states. Avoid emoji in place of product UI icons.

## Layout and controls
- PC admin: use a stable navigation area, page title and clear primary action, contextual filters, and a scannable table or content area. Keep related filter controls together. Align currency and numeric columns and handle narrow screens with an intentional overflow strategy.
- Mobile: start at a 360–430 CSS/logical px viewport and test narrower and longer content; respect notches, bottom insets, scrolling, and on-screen keyboard. Start with 16–20 px horizontal page padding; use platform-recommended touch sizes (roughly 44 pt on iOS and 48 dp on Android), adjusted for the target platform. Do not force platform units directly into unrelated runtimes.
- Forms and buttons: visible labels, understandable error feedback, consistent height and state. Identify one primary action per context; use secondary/tertiary treatment for other actions. Dialogs need a clear close or cancel path.
- Responsive web: test at least one desktop and one narrow viewport; choose breakpoints based on content, not on a fixed device catalog. Native app screen sizes are logical pixels/points, not browser CSS pixels.

## Visual and behavior review
1. Preview the first screen and full scroll at representative sizes; check clipping, overlap, line breaks, excessive whitespace, hierarchy, and safe-area/keyboard behavior where the target can be tested. Avoid fixed-height marketing banners that clip translated or wrapped content. Confirm zero-count badges are truly hidden when intended, including when CSS defines a display property.
2. Use realistic and coherent sample data: currency, dates, status and totals should agree; mark simulated actions honestly. Provide meaningful empty and interaction states for the flow rather than lots of dead controls.
3. Verify controls with mouse/keyboard or touch as applicable, visible focus and readable contrast. Check that displayed product claims and calls to action match the implemented demo. Use the preview server's actual assigned URL, not a guessed port; confirm the page title or content belongs to this demo before testing. Inspect with a browser, simulator or actual device only where available; record which one. If visual review is unavailable, say so and do not call it complete.
4. Avoid unverifiable claims of production readiness or accessibility compliance. Do not require backend infrastructure for a local prototype.
