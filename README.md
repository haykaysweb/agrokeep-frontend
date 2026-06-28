# Agrokeep Frontend

A modern frontend built with React, Vite, Tailwind CSS v4, and Framer Motion.

## Overview

This project is a responsive, performant user interface for Agrokeep. It is built to be modular, maintainable, and easy to extend.

## Tech Stack

- React 18+
- Vite
- Tailwind CSS v4
- Framer Motion
- TypeScript (if applicable)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd agrokeep-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Available Scripts

- `npm run dev`
  - Starts the Vite development server.
- `npm run build`
  - Builds the production assets.
- `npm run preview`
  - Serves the production build locally for testing.
- `npm run lint`
  - Runs code quality checks if configured.

## Frontend Architecture Style Guide

### Layout Constraints

- Use consistent page containers and spacing.
- Wrap main content in a centered container with `max-w-7xl`.
- Keep page width constrained to improve readability and maintain visual balance.
- Use Tailwind helpers like `mx-auto`, `px-4`, `sm:px-6`, `lg:px-8` to manage horizontal padding.

Example:
```jsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* page content */}
</div>
```

### DRY Reusable Components

- Build small, focused components.
- Reuse buttons, cards, sections, and layout wrappers across pages.
- Avoid duplicating markup and styling.
- Keep animation variants and motion wrappers reusable with Framer Motion.

Example reusable component structure:

- `components/`
  - `Button.jsx`
  - `Card.jsx`
  - `SectionContainer.jsx`
  - `PageHeader.jsx`

Example:
```jsx
export function SectionContainer({ children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}
```

### Motion and Interaction

- Use Framer Motion for page transitions and subtle UI motion.
- Keep motion definitions centralized for reuse.
- Prefer simple animation variants for consistency.

Example:
```jsx
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div initial="hidden" animate="visible" variants={fadeIn}>
  {/* animated content */}
</motion.div>
```

## Best Practices

- Keep styles in Tailwind utility classes and avoid custom CSS unless necessary.
- Use semantic HTML elements.
- Organize components by feature or domain.
- Create reusable utility components for repeated layout patterns.
- Use descriptive class names with Tailwind shortcuts when needed.

## Notes

This project is designed for rapid frontend development with a clean architecture and an emphasis on reusable components, consistent layout constraints, and motion-enhanced user experiences.
