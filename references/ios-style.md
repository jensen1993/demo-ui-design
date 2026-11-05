# iOS-oriented demo baseline

Use for the default style of a new mobile App demo without a specified visual direction, or when the user requests an iOS look or an app targets iOS; this is a flexible product-design starting point, not an exact copy of Apple system controls or a claim of HIG compliance. Follow the platform's current system components, the user's existing design and the exact OS and framework where they take precedence. On Android, use the same product identity while applying appropriate Android navigation, touch and system behavior.

## Apple guidance to preserve

- Apple's button guidance recommends a hit region of at least 44 × 44 points for iOS buttons. The visible symbol can be smaller; keep the interactive area large enough and adequately separated. Use press feedback. Source: https://developer.apple.com/design/human-interface-guidelines/buttons
- Respect safe-area insets, status bar, home indicator, large text, contrast and platform navigation. Prefer framework/platform safe-area APIs and platform semantic colors and text styles when available; test light/dark or enlarged text when relevant. Do not position fixed bottom actions over system controls.
- Design in iOS logical points, not physical device pixels. Map to the framework's logical units; for uni-app validate rpx scaling and safe-area behavior instead of assuming 1 px is always 1 pt.

## Adjustable demo defaults — NOT Apple prescribed values

When there is no established design system, start with these values in logical units/points and adapt to content and available width:

- Screen side inset: 16–20; 8/12/16/24/32 spacing steps; section gap 24–32, related item gap 8–12.
- Primary button height 48–52, button corner radius 10–14 (or capsule when visually appropriate). Ensure at least a 44 × 44 hit region for smaller icon buttons; do not force every visible icon to be 44 wide.
- Cards: 12–16 radius and 16 internal padding; grouped list rows: 48–56 minimum height, expanded to fit labels, subtitles and accessibility text sizes. Inputs: 48–52 height with a visible label and clear focus/error states.
- Body text ~16–17, secondary text ~13–14, screen title ~24–28 and section heading ~18–20. Use platform text styles/Dynamic Type when supported; allow wrapping and scaling, rather than clipping text at fixed row heights.
- Limit shadows and borders; use surface hierarchy and whitespace. Choose a single visual system for the app. Material UI libraries are not automatically iOS-native; customize only where feasible and preserve accessible interactions.

## Review

Check a typical narrow screen and a larger screen, long localized strings and increased text sizes; verify notches, bottom safe area, keyboard, navigation, actionable states and modal dismissal on the available target. Explicitly distinguish a mobile browser preview, simulator and real-device test. Do not claim native iOS appearance or device validation based only on an H5 preview.
