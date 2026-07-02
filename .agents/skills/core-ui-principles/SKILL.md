---
name: core-ui-principles
description: "Core Design Principles covering Component Architecture, UI Standardization, Responsive/Adaptive Design, Fluid Layouts, Visual Hierarchy, Spatial Design, and Fluid Typography."
---

# Core Design Principles

The following UI/UX principles must be strictly followed when designing or refactoring the frontend:

## 1. Design Systems & Component Architecture
- Maintain a single source of truth for styles.
- Components must be reusable, decoupled, and encapsulate their own layout logic.
- Avoid inline styles. Prefer utility classes and CSS variables.

## 2. UI Standardization
- Apply consistent interaction states across all interactive elements (hover, active, focus, disabled).
- Standardize border radii, shadow depths, and animation timings globally.

## 3. Responsive & Adaptive UI Design
- Employ mobile-first approaches using standard breakpoints (e.g., `sm:`, `md:`, `lg:`, `xl:`).
- UI should gracefully reflow, rather than merely shrink.

## 4. Fluid Layouts
- Use relative units (`%`, `vw`, `vh`, `rem`) for structural elements.
- Implement CSS Grid and Flexbox to create flexible, stretching containers.
- Avoid hardcoded pixel widths/heights for layout containers.

## 5. Visual Hierarchy & Spatial Design
- Use spacing (padding/margins) deliberately to separate concerns.
- Embrace negative space (whitespace) to create a clean, uncluttered aesthetic.
- Group related items tightly and space unrelated items further apart.

## 6. Fluid Typography
- Implement typography that scales seamlessly across viewports using `clamp()` or viewport relative units, e.g., `font-size: clamp(1rem, 2vw, 1.5rem);`.
- Maintain correct heading hierarchies (`h1` through `h6`) and adequate line heights.
