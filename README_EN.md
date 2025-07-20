[🇨🇳 中文 | 🇺🇸 English](README.md | README_EN.md)

# SvelteKit 2048 Game

A classic 2048 number puzzle game built with SvelteKit and TypeScript.

## Features

- 🎮 Classic 2048 gameplay
- ⌨️ Keyboard control (arrow keys or WASD)
- 🎨 Beautiful UI design and animations
- 📱 Responsive design for all screen sizes
- 🏆 Score tracking and game state management
- 🔄 Restart game functionality
- ✨ Win and lose state notifications

## Game Rules

1. Use arrow keys or WASD to move number tiles
2. Tiles with the same number merge into a bigger number when they collide
3. After each move, a new tile (2 or 4) appears randomly
4. Win by creating a 2048 tile
5. Game over when no moves are possible

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Full-stack web framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Fast build tool

## Development Guide

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm run dev

# Or start the server and open in browser
pnpm run dev -- --open
```

### Project Structure

```
src/
├── lib/
│   ├── game.ts              # Game core logic
│   ├── index.ts             # Library entry
│   └── components/
│       ├── GameBoard.svelte # Game board component
│       └── GameCell.svelte  # Game cell component
├── routes/
│   ├── +layout.svelte       # Global layout
│   ├── +page.svelte         # Main page
│   └── +page.ts             # Page data loader
├── app.css                  # Global styles
├── app.d.ts                 # TypeScript declarations
└── app.html                 # HTML template
```

## Build & Deploy

### Create production build

```bash
pnpm run build
```

### Preview production build

```bash
pnpm run preview
```

### Type checking

```bash
pnpm run check

# Or enable watch mode
pnpm run check:watch
```

## Game Controls

- **Arrow keys** ↑ ↓ ← → or **WASD** to move tiles
- **New Game** button to restart
- After reaching 2048, you can choose to continue or start a new game

## License

MIT License

## Contributing

Feel free to submit Issues and Pull Requests to improve this project!

> To deploy to a specific environment, you may need to install the appropriate [adapter](https://svelte.dev/docs/kit/adapters).
