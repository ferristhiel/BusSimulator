# Bus Simulator Game Design Document

## Vision

This project is a modern, realistic, but relaxed bus simulator that runs completely in the local browser. The game should feel like a small console-style simulator while remaining performant, accessible, and expandable for future systems such as NPCs, quests, economy, modding, and a route editor.

## Design Pillars

1. **Realistic but relaxed driving**: The bus should feel heavy and believable, but the player should not need expert simulation hardware to enjoy a route.
2. **Local-first browser game**: The game runs without a server, login, or cloud dependency. Progress is stored locally in the browser.
3. **Expandable simulation**: Traffic, passengers, quests, economy, and vehicle systems should be designed as modular systems that can grow over time.
4. **Console-like experience**: The presentation should support fullscreen play, clean UI, flexible cameras, and later gamepad controls.
5. **Fictional but believable world**: The game uses an original city with a mixture of urban, suburban, and rural routes.

## Target Platform

- Primary platform: Desktop browser.
- Runtime mode: Fully local, no backend required.
- Future packaging: Progressive Web App support for installable desktop/mobile-like usage.
- Primary input: Keyboard and mouse.
- Future input: Gamepad/controller support.

## Visual Style

The visual target is modern and realistic, but optimized for browser performance. The first versions should use clean placeholder assets and simple materials, then gradually move toward higher-quality models, lighting, environmental detail, and weather effects.

## Camera Modes

The camera system should be flexible and eventually support:

- Third-person follow camera behind the bus.
- Cockpit camera from the driver seat.
- Free camera for inspection and screenshots.
- Optional mirror/camera views for cockpit gameplay.

## World Design

The game world is a fictional city with realistic atmosphere. It should combine:

- Dense city streets.
- Suburban districts.
- Rural roads.
- Depots and service areas.
- Schools, tourist areas, transit hubs, and roadwork zones.

Routes and line plans are original to the game. The first playable map should be intentionally small and designed around a short route with a few stops.

## Core Gameplay Loop

1. Choose a save slot and player profile.
2. Select a bus and route.
3. Drive from stop to stop while following traffic rules.
4. Pick up and drop off passengers.
5. Earn money and reputation based on performance.
6. Unlock or buy buses, upgrades, skins, and route improvements.
7. Accept missions or dynamic route events.
8. Save progress locally and continue later.

## Driving Gameplay

The driving model should begin as a simplified vehicle simulation and become more realistic over time.

Initial driving features:

- Acceleration and braking.
- Steering with speed-sensitive response.
- Reverse gear.
- Handbrake or parking brake.
- Basic collision handling.
- Simple speedometer and route UI.

Future driving features:

- Bus weight and suspension tuning.
- Door interlocks.
- Kneeling.
- Regenerative braking for electric buses.
- Damage and maintenance.
- Weather-dependent handling.

## Bus Types

Planned bus categories:

1. Standard city bus.
2. Articulated bus.
3. Electric bus.
4. Later: double-decker bus.
5. Later: coach/intercity bus.

Each bus should eventually support:

- Purchase price.
- Operating cost.
- Capacity.
- Acceleration/braking profile.
- Visual skins.
- Upgrades.
- Maintenance state.

## Cockpit Interactions

Cockpit systems should be introduced gradually.

Planned interactions:

- Doors.
- Indicators/blinkers.
- Lights.
- Kneeling.
- Ticket printer.
- Mirrors or camera monitors.
- Dashboard indicators.

## Rules, Penalties, and Scoring

The simulation should encourage careful driving without becoming frustrating.

Penalized events:

- Collisions.
- Red-light violations.
- Harsh braking.
- Missed stops.
- Late arrival, with light penalties.

Positive scoring:

- On-time arrival.
- Smooth driving.
- Safe driving.
- Complete passenger service.
- Route completion.

## Economy and Progression

The game should include light management elements.

Initial economy:

- Earn money after completing routes.
- Track reputation.
- Unlock route improvements.

Future economy:

- Buy buses.
- Upgrade buses.
- Apply skins.
- Pay for maintenance and repairs.
- Improve lines and stops.
- Hire or assign staff/NPC drivers.

## NPCs

Initial NPC behavior should be simple and data-driven. NPCs can begin as abstract passengers at stops, then become animated characters later.

Planned NPC types:

- Regular passengers.
- Students.
- Tourists.
- Ticket inspectors.
- Employees.

Initial passenger states:

- Waiting at stop.
- Boarding.
- Riding.
- Leaving at destination.

Future passenger behavior:

- Text bubbles/subtitles.
- Complaints and compliments.
- Ticket checks.
- Group travel.
- Special needs, such as ramp usage.

## Quests and Dynamic Events

Quest content should support both authored missions and dynamic events.

Planned quest types:

- Drive route X on time.
- Replacement service due to roadwork.
- Night route.
- School trip.
- Defective bus must return to depot.
- Dynamic traffic situations.

Quest delivery:

- First version: text-based mission panels and subtitles.
- Future version: voiced dialogue optional.

## Persistence

The game should support multiple local save slots with no account requirement.

Saved data should include:

- Player profile.
- Money and reputation.
- Owned buses.
- Route unlocks and improvements.
- Quest progress.
- Settings.
- Current save version.

Future persistence features:

- Import/export save files.
- Route editor data.
- Modding metadata.

## Modding and Editor Goals

Editor and modding support are future goals, but the architecture should prepare for them.

Planned editor capabilities:

- Create or edit routes.
- Place bus stops.
- Define schedules.
- Adjust simple city data.
- Export/import local route packs.

## Minimum Playable Prototype

The first prototype should include:

- One small 3D scene.
- One drivable standard city bus.
- One simple route.
- Three to five bus stops.
- Basic third-person camera.
- Keyboard controls.
- Simple route objective.
- Local save slot with progress.

## Milestones

### Milestone 1: Technical foundation

- Project tooling.
- Rendering engine setup.
- Main game loop.
- Basic asset loading.
- Save database foundation.

### Milestone 2: Drivable prototype

- Bus entity.
- Keyboard input.
- Camera switching foundation.
- Simple road/test map.

### Milestone 3: Route gameplay

- Stops.
- Route markers.
- Arrival detection.
- Basic scoring.
- Save progress.

### Milestone 4: Simulation systems

- Basic traffic.
- Abstract passengers.
- Doors and stop service.
- Simple quest framework.

### Milestone 5: Progression

- Economy.
- Bus unlocks.
- Route improvements.
- Multiple save slots.

### Milestone 6: Polish and platform features

- PWA support.
- Fullscreen mode.
- Controller support.
- Improved UI/audio.
- Import/export saves.
