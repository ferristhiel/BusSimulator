# BusSimulator

A local-first browser bus simulator with a modern, realistic, but relaxed gameplay direction.

## Project Direction

The goal is to build a console-like bus simulator that runs completely in the local browser without a backend or account system. The game should eventually include drivable buses, custom routes, passengers, NPCs, quests, economy, local persistent saves, PWA support, and editor/modding capabilities.

## Current State

This repository now includes an initial runnable browser prototype. The first implementation is dependency-free so it can run in restricted local environments, while the long-term architecture still targets Babylon.js, TypeScript, Dexie.js, and XState as the simulation grows.

## Documentation

- [Game Design Document](docs/game-design-document.md)
- [Technical Architecture](docs/technical-architecture.md)
- [Development Roadmap](docs/roadmap.md)

## Prototype Quick Start

```bash
npm run dev
```

Open <http://localhost:5173> in a browser. The current prototype uses native browser APIs, Canvas rendering, ES modules, and `localStorage` for the first save slot.

## Planned Technical Stack

- Current prototype: dependency-free JavaScript, Canvas, ES modules, localStorage
- Later foundation: TypeScript
- Later build tool: Vite
- Later 3D engine: Babylon.js
- Later persistence: Dexie.js / IndexedDB
- Later state machines: XState
- Optional later: Howler.js, Rapier or Babylon physics, PWA tooling

## First Prototype Target

The first playable prototype should include:

- A canvas-rendered playable city prototype.
- One drivable standard city bus.
- Keyboard controls.
- Follow, cockpit, and free camera modes.
- One route with four bus stops.
- Basic passenger service, route progress, scoring, and harsh-braking penalties.
- Local save data in the browser.
