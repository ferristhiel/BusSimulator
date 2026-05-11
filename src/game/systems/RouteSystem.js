export class RouteSystem {
  activeStopIndex = 0;
  passengersOnBoard = 0;
  servedPassengers = 0;
  elapsedSeconds = 0;
  routeCompleted = false;
  penaltyCount = 0;
  message = 'Starte am Hauptbahnhof und bediene die erste Haltestelle.';

  constructor(route) {
    this.route = route;
  }

  update(busPosition, deltaSeconds) {
    if (!this.routeCompleted) {
      this.elapsedSeconds += deltaSeconds;
    }

    const canServiceStop = this.isBusAtActiveStop(busPosition);

    if (canServiceStop && !this.routeCompleted) {
      this.message = `Haltestelle erreicht: ${this.activeStop().name}. Drücke E zum Bedienen.`;
    }

    return this.status(canServiceStop);
  }

  serviceActiveStop(busPosition) {
    const canServiceStop = this.isBusAtActiveStop(busPosition);

    if (!canServiceStop || this.routeCompleted) {
      this.message = 'Du bist nicht nah genug an der aktiven Haltestelle.';
      return this.status(canServiceStop);
    }

    const stop = this.activeStop();
    this.passengersOnBoard += stop.waitingPassengers;
    this.servedPassengers += stop.waitingPassengers;
    this.message = `${stop.name}: ${stop.waitingPassengers} Fahrgäste eingestiegen.`;
    this.activeStopIndex += 1;

    if (this.activeStopIndex >= this.route.stops.length) {
      this.completeRoute();
    }

    return this.status(false);
  }

  registerHarshBrakePenalty() {
    if (this.routeCompleted) {
      return;
    }

    this.penaltyCount += 1;
    this.message = 'Strafe: Zu stark gebremst. Fahrgäste beschweren sich.';
  }

  reset() {
    this.activeStopIndex = 0;
    this.passengersOnBoard = 0;
    this.servedPassengers = 0;
    this.elapsedSeconds = 0;
    this.routeCompleted = false;
    this.penaltyCount = 0;
    this.message = 'Route zurückgesetzt. Fahre zum Hauptbahnhof.';
  }

  currentScore() {
    const timePenalty = Math.max(0, this.elapsedSeconds - this.route.targetDurationSeconds) * 1.4;
    const penalties = this.penaltyCount * 35;
    const passengerBonus = this.servedPassengers * 8;
    return Math.max(0, Math.round(this.route.baseReward + passengerBonus - penalties - timePenalty));
  }

  completeRoute() {
    this.routeCompleted = true;
    this.passengersOnBoard = 0;
    this.message = `Route abgeschlossen! Belohnung: ${this.currentScore()} €.`;
  }

  activeStop() {
    return this.route.stops[Math.min(this.activeStopIndex, this.route.stops.length - 1)];
  }

  isBusAtActiveStop(busPosition) {
    if (this.routeCompleted) {
      return false;
    }

    const stop = this.activeStop();
    const distance = Math.hypot(busPosition.x - stop.position.x, busPosition.y - stop.position.y);
    return distance <= 58;
  }

  status(canServiceStop) {
    return {
      routeCompleted: this.routeCompleted,
      activeStopName: this.routeCompleted ? 'Route abgeschlossen' : this.activeStop().name,
      activeStopIndex: Math.min(this.activeStopIndex + 1, this.route.stops.length),
      totalStops: this.route.stops.length,
      passengersOnBoard: this.passengersOnBoard,
      servedPassengers: this.servedPassengers,
      elapsedSeconds: this.elapsedSeconds,
      score: this.currentScore(),
      penaltyCount: this.penaltyCount,
      message: this.message,
      canServiceStop,
    };
  }
}
