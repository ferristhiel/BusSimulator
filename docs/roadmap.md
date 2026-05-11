# Development Roadmap

## Current Repository State

The repository currently contains only a minimal README. There is no application source code, build setup, package manifest, or test setup yet. The first implementation step should therefore be project scaffolding rather than refactoring existing code.

## Phase 0: Planning Baseline

Status: In progress.

Goals:

- Capture the game vision.
- Define the target stack.
- Define milestones.
- Establish a shared scope for the first playable prototype.

Deliverables:

- Game Design Document.
- Technical Architecture document.
- Development Roadmap.

## Phase 1: Project Foundation

Goals:

- Create a Vite + TypeScript project.
- Add Babylon.js.
- Add basic lint/build scripts.
- Create the initial source layout.
- Render a simple 3D scene in the browser.

Acceptance criteria:

- `npm install` installs dependencies.
- `npm run dev` starts the local browser app.
- `npm run build` creates a production build.
- A basic scene renders without gameplay systems.

## Phase 2: Drivable Bus Prototype

Goals:

- Add keyboard input.
- Add a simple bus entity.
- Add acceleration, braking, steering, and reverse.
- Add a third-person follow camera.
- Add a small test road.

Acceptance criteria:

- The player can drive a bus in a browser scene.
- The camera follows the bus.
- The simulation is playable with keyboard input.

## Phase 3: Route and Stops

Goals:

- Add route definitions.
- Add bus stop entities.
- Add stop arrival detection.
- Add route progress HUD.
- Add completion scoring.

Acceptance criteria:

- The player can follow a route with three to five stops.
- The game detects arrivals at stops.
- The route can be completed and scored.

## Phase 4: Local Persistence

Goals:

- Add Dexie.js and IndexedDB save slots.
- Store player profile, settings, route progress, and economy state.
- Support multiple local save slots.

Acceptance criteria:

- The player can create and load a save slot.
- Route completion persists after page reload.
- Settings persist locally.

## Phase 5: Early Simulation Systems

Goals:

- Add basic passenger counts at stops.
- Add boarding/unboarding logic.
- Add penalties for missed stops, collisions, harsh braking, and red lights.
- Add simple traffic placeholders.

Acceptance criteria:

- Stops can have waiting passengers.
- Route reward changes based on service quality.
- Basic traffic objects exist in the world.

## Phase 6: Quests and Economy

Goals:

- Add a data-driven quest framework.
- Add initial quest types.
- Add money and reputation rewards.
- Add bus unlock flow.

Acceptance criteria:

- The player can accept and complete a route quest.
- Rewards and penalties update local save data.
- At least one unlock is tied to progression.

## Phase 7: PWA and Console-Like Polish

Goals:

- Add PWA manifest and service worker.
- Add fullscreen support.
- Add pause menu.
- Add gamepad input mapping.
- Improve UI, audio, and camera switching.

Acceptance criteria:

- The app is installable as a PWA.
- The game remains playable offline after first load.
- Controller input works for core driving actions.

## Phase 8: Expansion Systems

Goals:

- Improve traffic AI.
- Add 3D passenger NPCs.
- Add route editor foundations.
- Add import/export for saves and routes.
- Add additional buses and customization.

Acceptance criteria:

- The game supports at least one user-created route.
- Save export/import works.
- Additional bus types can be added through data definitions.
