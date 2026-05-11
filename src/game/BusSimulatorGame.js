import { starterRoute } from './data/routes.js';
import { BusController } from './entities/BusController.js';
import { SaveRepository } from './save/SaveRepository.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { InputSystem } from './systems/InputSystem.js';
import { RouteSystem } from './systems/RouteSystem.js';

export class BusSimulatorGame {
  constructor(canvas, hud) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.hud = hud;
    this.input = new InputSystem();
    this.saveRepository = new SaveRepository();
    this.bus = new BusController();
    this.routeSystem = new RouteSystem(starterRoute);
    this.cameraSystem = new CameraSystem();
    this.lastFrameTime = performance.now();
    this.animationFrame = 0;
    this.hasPersistedRouteCompletion = false;

    if (!this.context) {
      throw new Error('2D-Rendering konnte nicht initialisiert werden.');
    }
  }

  async start() {
    this.saveSlot = this.saveRepository.loadDefaultSlot();
    this.input.attach();
    this.resize();
    window.addEventListener('resize', this.handleResize);
    this.animationFrame = requestAnimationFrame(this.tick);
  }

  save() {
    if (this.saveSlot) {
      this.saveSlot = this.saveRepository.saveSlot(this.saveSlot);
    }
  }

  dispose() {
    cancelAnimationFrame(this.animationFrame);
    this.input.detach();
    window.removeEventListener('resize', this.handleResize);
  }

  tick = (timestamp) => {
    const deltaSeconds = Math.min((timestamp - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = timestamp;

    const input = this.input.snapshot();

    if (input.cameraPressed) {
      this.cameraSystem.toggle();
    }

    if (input.resetPressed) {
      this.bus.reset();
      this.routeSystem.reset();
      this.hasPersistedRouteCompletion = false;
    }

    const busEvents = this.bus.update(input, deltaSeconds);

    if (busEvents.harshBrake) {
      this.routeSystem.registerHarshBrakePenalty();
    }

    const telemetry = this.bus.telemetry();
    const status = input.serviceStopPressed
      ? this.routeSystem.serviceActiveStop(telemetry.position)
      : this.routeSystem.update(telemetry.position, deltaSeconds);

    if (status.routeCompleted && !this.hasPersistedRouteCompletion) {
      this.persistRouteCompletion(status);
      this.hasPersistedRouteCompletion = true;
    }

    this.draw(status, telemetry);
    this.renderHud(status, telemetry.speedKmh);
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  persistRouteCompletion(status) {
    if (!this.saveSlot) {
      return;
    }

    const currentProgress = this.saveSlot.routeProgress[starterRoute.id] ?? {
      routeId: starterRoute.id,
      completions: 0,
      bestScore: 0,
      lastReward: 0,
    };

    this.saveSlot = this.saveRepository.saveSlot({
      ...this.saveSlot,
      profile: {
        ...this.saveSlot.profile,
        money: this.saveSlot.profile.money + status.score,
        reputation: Math.min(100, this.saveSlot.profile.reputation + 1),
      },
      routeProgress: {
        ...this.saveSlot.routeProgress,
        [starterRoute.id]: {
          routeId: starterRoute.id,
          completions: currentProgress.completions + 1,
          bestScore: Math.max(currentProgress.bestScore, status.score),
          lastReward: status.score,
        },
      },
    });
  }

  draw(status, telemetry) {
    const context = this.context;
    const { width, height } = this.canvas;
    context.clearRect(0, 0, width, height);

    this.drawBackground(context, width, height);
    this.drawRoads(context, telemetry.position);
    this.drawBuildings(context, telemetry.position);
    this.drawStops(context, telemetry.position, status);
    this.drawBus(context, telemetry);
    this.drawCockpitOverlay(context);
  }

  drawBackground(context, width, height) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#7dd3fc');
    gradient.addColorStop(0.45, '#bfdbfe');
    gradient.addColorStop(0.46, '#3f8f45');
    gradient.addColorStop(1, '#166534');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  drawRoads(context, busPosition) {
    const roads = [
      { x: 0, y: -180, width: 980, height: 100 },
      { x: 85, y: 85, width: 100, height: 620 },
      { x: -230, y: 260, width: 680, height: 90 },
    ];

    for (const road of roads) {
      const point = this.cameraSystem.worldToScreen({ x: road.x, y: road.y }, busPosition, this.canvas);
      context.save();
      context.fillStyle = '#18181b';
      context.strokeStyle = '#3f3f46';
      context.lineWidth = 4;
      context.fillRect(point.x - (road.width * point.scale) / 2, point.y - (road.height * point.scale) / 2, road.width * point.scale, road.height * point.scale);
      context.strokeRect(point.x - (road.width * point.scale) / 2, point.y - (road.height * point.scale) / 2, road.width * point.scale, road.height * point.scale);
      context.restore();
    }

    context.save();
    context.strokeStyle = '#facc15';
    context.setLineDash([26, 22]);
    context.lineWidth = 4;
    this.drawWorldLine(context, { x: -480, y: -180 }, { x: 480, y: -180 }, busPosition);
    this.drawWorldLine(context, { x: 85, y: -220 }, { x: 85, y: 390 }, busPosition);
    this.drawWorldLine(context, { x: -560, y: 260 }, { x: 100, y: 260 }, busPosition);
    context.restore();
  }

  drawBuildings(context, busPosition) {
    const buildings = [
      { x: -180, y: -330, width: 90, height: 80, color: '#64748b' },
      { x: 0, y: -340, width: 120, height: 90, color: '#94a3b8' },
      { x: 240, y: -330, width: 110, height: 70, color: '#64748b' },
      { x: 420, y: -60, width: 110, height: 100, color: '#94a3b8' },
      { x: -420, y: 40, width: 140, height: 85, color: '#475569' },
      { x: 250, y: 350, width: 130, height: 80, color: '#64748b' },
    ];

    for (const building of buildings) {
      const point = this.cameraSystem.worldToScreen({ x: building.x, y: building.y }, busPosition, this.canvas);
      context.fillStyle = building.color;
      context.fillRect(point.x - (building.width * point.scale) / 2, point.y - (building.height * point.scale) / 2, building.width * point.scale, building.height * point.scale);
      context.fillStyle = '#7f1d1d';
      context.fillRect(point.x - (building.width * point.scale) / 2 - 4, point.y - (building.height * point.scale) / 2 - 10, building.width * point.scale + 8, 12);
    }
  }

  drawStops(context, busPosition, status) {
    starterRoute.stops.forEach((stop, index) => {
      const point = this.cameraSystem.worldToScreen(stop.position, busPosition, this.canvas);
      const completed = index < this.routeSystem.activeStopIndex;
      const active = index === this.routeSystem.activeStopIndex && !status.routeCompleted;
      context.beginPath();
      context.arc(point.x, point.y, 26 * point.scale, 0, Math.PI * 2);
      context.fillStyle = completed ? '#22c55e' : active ? '#facc15' : '#2563eb';
      context.globalAlpha = active ? 0.95 : 0.72;
      context.fill();
      context.globalAlpha = 1;
      context.strokeStyle = '#f8fafc';
      context.lineWidth = 2;
      context.stroke();
      context.fillStyle = '#f8fafc';
      context.font = `${Math.max(12, 14 * point.scale)}px sans-serif`;
      context.fillText(stop.name, point.x + 32 * point.scale, point.y - 6 * point.scale);
    });
  }

  drawBus(context, telemetry) {
    const point = this.cameraSystem.worldToScreen(telemetry.position, telemetry.position, this.canvas);
    const busWidth = 38 * point.scale;
    const busLength = 86 * point.scale;

    context.save();
    context.translate(point.x, point.y);
    context.rotate(-telemetry.headingRadians);
    context.fillStyle = '#dc2626';
    context.strokeStyle = '#7f1d1d';
    context.lineWidth = 3;
    context.roundRect(-busWidth / 2, -busLength / 2, busWidth, busLength, 8);
    context.fill();
    context.stroke();
    context.fillStyle = '#bae6fd';
    context.fillRect(-busWidth / 2 + 4, -busLength / 2 + 7, busWidth - 8, 15);
    context.fillStyle = '#111827';
    context.fillRect(-busWidth / 2 + 4, busLength / 2 - 14, busWidth - 8, 8);
    context.restore();
  }

  drawCockpitOverlay(context) {
    if (this.cameraSystem.currentMode() !== 'cockpit') {
      return;
    }

    context.fillStyle = 'rgb(2 6 23 / 0.62)';
    context.fillRect(0, this.canvas.height - 150, this.canvas.width, 150);
    context.fillStyle = '#e2e8f0';
    context.font = '700 18px sans-serif';
    context.fillText('Cockpit-Prototyp · Spiegel/Kameras und Dashboard folgen später', 24, this.canvas.height - 92);
  }

  drawWorldLine(context, from, to, busPosition) {
    const start = this.cameraSystem.worldToScreen(from, busPosition, this.canvas);
    const end = this.cameraSystem.worldToScreen(to, busPosition, this.canvas);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  renderHud(status, speedKmh) {
    const money = this.saveSlot ? `${this.saveSlot.profile.money.toLocaleString('de-DE')} €` : 'lädt...';
    const reputation = this.saveSlot ? `${this.saveSlot.profile.reputation}/100` : 'lädt...';
    const minutes = Math.floor(status.elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = Math.floor(status.elapsedSeconds % 60).toString().padStart(2, '0');

    this.hud.innerHTML = `
      <div class="hud-title">
        <span>${starterRoute.line} · ${starterRoute.name}</span>
        <span class="hud-pill">${status.routeCompleted ? 'Abgeschlossen' : status.canServiceStop ? 'Halt' : 'Unterwegs'}</span>
      </div>
      <div class="hud-grid">
        <div class="hud-card"><span class="hud-label">Geschwindigkeit</span><span class="hud-value">${speedKmh.toFixed(0)} km/h</span></div>
        <div class="hud-card"><span class="hud-label">Nächster Halt</span><span class="hud-value">${status.activeStopName}</span></div>
        <div class="hud-card"><span class="hud-label">Fortschritt</span><span class="hud-value">${status.activeStopIndex}/${status.totalStops}</span></div>
        <div class="hud-card"><span class="hud-label">Fahrgäste</span><span class="hud-value">${status.passengersOnBoard} im Bus · ${status.servedPassengers} bedient</span></div>
        <div class="hud-card"><span class="hud-label">Zeit</span><span class="hud-value">${minutes}:${seconds}</span></div>
        <div class="hud-card"><span class="hud-label">Aktueller Score</span><span class="hud-value">${status.score} €</span></div>
        <div class="hud-card"><span class="hud-label">Geld</span><span class="hud-value">${money}</span></div>
        <div class="hud-card"><span class="hud-label">Ruf</span><span class="hud-value">${reputation}</span></div>
      </div>
      <div class="hud-message">${status.message} Kamera: ${this.cameraSystem.currentMode()} · Strafen: ${status.penaltyCount}</div>
    `;
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  };

  handleResize = () => {
    this.resize();
  };
}
