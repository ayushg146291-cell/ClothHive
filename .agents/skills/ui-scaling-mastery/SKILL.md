---
name: ui-scaling-mastery
description: "Comprehensive scaling and sizing design system encompassing: ui-sizing-pro-max, fluid-ui-mastery, pixel-perfect-core, supreme-scaling-system, fluid-design-system, adaptive-ui-engine, dynamic-sizing-architecture, scalable-component-library, and responsive-sizing-tokens."
---

# UI Scaling Mastery & Adaptive Engine

This skill installs the comprehensive scaling architecture rules for the workspace. When building or refactoring UI components, the following modules must be applied:

## 1. ui-sizing-pro-max & responsive-sizing-tokens
- Never use hardcoded pixel values for layout padding, margins, or widths.
- Use a defined token system (e.g., Tailwind's `p-4`, `m-2`) mapped to `rem` units.

## 2. fluid-ui-mastery & fluid-design-system
- Utilize `clamp()` for font sizes, paddings, and margins so they scale fluidly between mobile and desktop viewports.
- Avoid abrupt layout snapping; prefer smooth scaling curves.

## 3. pixel-perfect-core
- Ensure SVG icons and vector assets align perfectly on the pixel grid.
- Borders and 1px dividers must remain crisp across all pixel densities.

## 4. supreme-scaling-system & scalable-component-library
- Build components in isolation.
- A component must scale to fill its parent container rather than dictating its own absolute width.

## 5. adaptive-ui-engine & dynamic-sizing-architecture
- Use CSS Grid and Flexbox with `fr` units and `flex-grow`/`flex-shrink`.
- The UI must adapt to any screen size (mobile, tablet, desktop, ultrawide) dynamically without breaking.
