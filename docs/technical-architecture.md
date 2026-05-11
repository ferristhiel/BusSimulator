# Technical Architecture

## Architectural Goals

The architecture should support a local-first browser bus simulator with clean long-term structure, modular systems, and room for future features such as NPCs, quests, traffic, economy, route editing, and PWA packaging.

## Recommended Stack

| Area | Recommended Tool | Reason |
| --- | --- | --- |
| Language | TypeScript | Strong typing for simulation systems and data models. |
| Build tool | Vite | Fast local development and browser bundling. |
| 3D engine | Babylon.js | Browser-focused 3D engine with cameras, scene management, materials, loaders, GUI, and optional physics integrations. |
| Persistence | Dexie.js over IndexedDB | Friendly local database API for multi-save data, settings, and future editor data. |
| State machines | XState | Explicit state handling for quests, passengers, buses, and game flow. |
| Audio | Howler.js or engine audio first | Dedicated audio library can be added when richer sound management is needed. |
| Physics | Start custom/simple, later Rapier or Babylon physics | A simple bus model is faster for the prototype; heavier physics can be integrated after gameplay is proven. |
| PWA | Vite PWA plugin or custom service worker | Enables installable local app behavior later. |

## Local-First Runtime Model

The game should not require a backend. All gameplay data is bundled with the app or created locally by the player. Save data is stored in IndexedDB through Dexie.js.

Local data categories:

- Static game data: buses, route templates, stop definitions, quest templates.
- Runtime save data: player profile, economy, owned buses, route progress, settings.
- Future user-generated data: edited routes, custom lines, local mod packs.

## Proposed Source Layout

```text
src/
  app/
    bootstrap.ts
    pwa.ts
  game/
    Game.ts
    GameLoop.ts
    systems/
      AudioSystem.ts
      CameraSystem.ts
      EconomySystem.ts
      InputSystem.ts
      NpcSystem.ts
      PhysicsSystem.ts
      QuestSystem.ts
      RouteSystem.ts
      SaveSystem.ts
      TrafficSystem.ts
      VehicleSystem.ts
    entities/
      Bus.ts
      BusStop.ts
      Passenger.ts
      TrafficVehicle.ts
    data/
      busTypes.ts
      city.ts
      quests.ts
      routes.ts
    save/
      database.ts
      migrations.ts
      saveTypes.ts
    ui/
      Hud.ts
      MainMenu.ts
      PauseMenu.ts
  assets/
    models/
    textures/
    audio/
```

## System Responsibilities

### Game

Owns high-level startup and shutdown. It creates the renderer, loads the initial scene, starts the game loop, and wires systems together.

### GameLoop

Runs update ticks and render frames. It should keep simulation updates explicit and avoid hiding gameplay logic inside rendering code.

### InputSystem

Maps browser keyboard/mouse input to game actions. Later, it should include gamepad mappings without changing vehicle or UI systems.

Example actions:

- Accelerate.
- Brake.
- Steer left/right.
- Open doors.
- Toggle lights.
- Toggle camera.
- Pause.

### VehicleSystem

Owns bus movement, controls, and state. The first version can use simplified kinematic movement before moving to a more detailed physics model.

### RouteSystem

Tracks active routes, stops, route progress, stop arrival detection, missed stops, and route completion.

### QuestSystem

Owns mission definitions and active quest state. It should use a data-driven model so quests can be added without changing core engine code.

### NpcSystem

Owns passengers and future pedestrians. In the earliest prototype, passengers can be represented as counts at stops; later they can become 3D characters with pathfinding.

### TrafficSystem

Owns non-player vehicles and traffic rules. It should start with simple waypoint cars and later expand to traffic lights, lanes, and avoidance.

### EconomySystem

Calculates route rewards, penalties, reputation changes, unlocks, and operating costs.

### SaveSystem

Owns local persistence through Dexie.js/IndexedDB. It should expose versioned save slots and hide database implementation details from gameplay systems.

### CameraSystem

Manages third-person, cockpit, and free camera modes. It should allow smooth switching and future controller support.

## Data-Driven Design

Gameplay content should be represented as typed data wherever possible.

Examples:

```ts
export interface BusDefinition {
  id: string;
  name: string;
  category: 'standard' | 'articulated' | 'electric' | 'doubleDecker' | 'coach';
  capacity: number;
  purchasePrice: number;
  maxSpeedKmh: number;
  acceleration: number;
  braking: number;
}
```

```ts
export interface RouteDefinition {
  id: string;
  name: string;
  stopIds: string[];
  targetDurationSeconds: number;
  baseReward: number;
}
```

## Save Model Draft

```ts
export interface SaveSlot {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  profile: PlayerProfile;
  economy: EconomyState;
  ownedBusIds: string[];
  unlockedRouteIds: string[];
  questStates: Record<string, QuestSaveState>;
  settings: PlayerSettings;
}
```

## First Prototype Implementation Plan

1. Create a Vite + TypeScript app.
2. Add Babylon.js rendering and create a simple scene.
3. Add an input system for keyboard controls.
4. Add a simple bus entity with acceleration, braking, and steering.
5. Add a third-person camera following the bus.
6. Add route and stop data.
7. Detect stop arrival zones.
8. Add a simple HUD for route progress.
9. Add Dexie.js save slots for progress and settings.
10. Add a first route completion score.

## Performance Principles

- Keep the first city small and handmade.
- Use low to medium polygon assets at first.
- Prefer glTF/GLB assets.
- Avoid spawning many animated NPCs before the route gameplay works.
- Keep traffic counts configurable.
- Use object pooling for frequently created entities later.
- Keep save data compact and versioned.

## PWA Strategy

PWA support should be added after the first playable browser version works. The PWA should include:

- Web app manifest.
- App icons.
- Offline-capable asset caching.
- Install prompt support.
- Save data stored through IndexedDB, not service worker cache.

## Future Editor/Modding Strategy

Route editor and modding should use the same data structures as built-in content. This keeps built-in routes and player-created routes compatible.

Future mod data can be imported as JSON files with optional references to local assets. The first safe step is route import/export without arbitrary executable code.
