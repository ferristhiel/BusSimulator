# BusSimulator

A local-first browser bus simulator with a modern, realistic, but relaxed gameplay direction.

## Project Direction

The goal is to build a console-like bus simulator that runs completely in the local browser without a backend or account system. The game should eventually include drivable buses, custom routes, passengers, NPCs, quests, economy, local persistent saves, PWA support, and editor/modding capabilities.

## Current State

This repository is in the planning and foundation stage. It currently contains project documentation and does not yet include the runnable browser application.

## Documentation

- [Game Design Document](docs/game-design-document.md)
- [Technical Architecture](docs/technical-architecture.md)
- [Development Roadmap](docs/roadmap.md)

## Planned Technical Stack

- TypeScript
- Vite
- Babylon.js
- Dexie.js / IndexedDB
- XState
- Optional later: Howler.js, Rapier or Babylon physics, PWA tooling

## First Prototype Target

The first playable prototype should include:

- A small 3D scene.
- One drivable standard city bus.
- Keyboard controls.
- A third-person follow camera.
- One route with three to five bus stops.
- Basic route progress and scoring.
- Local save data in the browser.
