# MiniMind

A minimalist, open-source mind-mapping web app built with React, TypeScript, Vite, React Flow, Zustand, and Tailwind CSS.

## Features
- Create draggable nodes with inline label editing
- Connect nodes with edges (drag to connect)
- Pan and zoom the canvas with grid background
- Save/Load from localStorage
- Export current map to JSON

## Tech Stack
- React + TypeScript + Vite
- React Flow for canvas, nodes, and edges
- Zustand for state management
- Tailwind CSS for styling

## Getting Started

1) Install dependencies:
```bash
npm install
```

2) Run the dev server:
```bash
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

## Usage
- Toolbar at the top:
  - Add Node: creates a new node
  - Save: stores nodes and edges to localStorage
  - Load: loads previously saved map
  - Export JSON: downloads a `.json` file of the current map
- Drag nodes around; click a node to edit its label inline.
- Create an edge by dragging from a node handle to another node.

## Project Structure
```
src/
 ├── components/
 │    ├── MindMapCanvas.tsx
 │    ├── Toolbar.tsx
 │    └── NodeEditor.tsx
 ├── store/
 │    └── useMindMapStore.ts
 ├── utils/
 │    ├── storage.ts
 │    ├── export.ts
 │    └── nanoid.ts
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

## Styling
Tailwind is configured via `tailwind.config.js` and `postcss.config.js`. Global styles and utilities are in `src/index.css`.

## Notes
- This MVP uses localStorage for persistence. Consider Firebase or a backend for collaboration and sharing.
- Future ideas: AI-based auto-generation, real-time collaboration, PNG export.
