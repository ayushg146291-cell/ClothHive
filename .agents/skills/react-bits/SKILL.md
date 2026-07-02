---
name: react-bits
description: Guidelines and best practices for integrating and using React Bits (reactbits.dev) components in the project.
---

# React Bits (reactbits.dev)

React Bits is a collection of animated, interactive, and highly customizable UI components designed specifically for React. It is used to add visual depth, polish, and fluid animations to the project without having to write complex `framer-motion` variants from scratch.

## Guidelines for Integration

### 1. Integration Method
React Bits follows a copy-paste methodology (similar to shadcn/ui). Instead of installing a monolithic npm package, you bring the specific component code directly into the codebase.
- **Placement**: Place downloaded or copied React Bits components in an appropriate UI folder, such as `frontend/src/components/ui/` or `frontend/src/components/magic/`.
- **Dependencies**: React Bits heavily relies on `framer-motion` for animations and Tailwind CSS for styling. Ensure these are installed and configured.

### 2. Usage Patterns
- **Text Animations**: Use components like `SplitText`, `BlurText`, or `ShinyText` for headings and important typographic elements.
- **Backgrounds**: Use animated backgrounds (e.g., `GridBackground`, `AuroraBackground`) to add depth to landing pages or hero sections.
- **Interactive Elements**: Use hover effects, magnetic buttons, or dynamic layouts to increase user engagement.

### 3. Customization
- **Props-first**: Use the exposed props to customize the component's behavior (e.g., timing, stagger delays, colors).
- **Direct Modification**: Since you own the code, you can directly modify the Framer Motion `variants` inside the component to perfectly match the ClothHive design language.
- **Tailwind Integration**: Use `className` props to pass additional Tailwind classes, ensuring the component merges them correctly using `twMerge` and `clsx`.

### 4. Best Practices
- **Performance**: Do not overuse heavy animated backgrounds on a single page as it can impact performance. 
- **Accessibility**: Ensure that text animations do not compromise readability or screen reader accessibility. Add `aria-hidden` to decorative animated spans if necessary and provide a screen-reader-only fallback.
- **Consistency**: Keep the animation spring configurations (stiffness, damping) consistent with the rest of the application's design system (`src/lib/animations.ts`).
