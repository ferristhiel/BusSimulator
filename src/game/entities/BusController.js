export class BusController {
  position = { x: -430, y: -180 };
  speedMetersPerSecond = 0;
  headingRadians = Math.PI / 2;
  harshBrakeCooldownSeconds = 0;

  update(input, deltaSeconds) {
    const acceleration = input.accelerate ? 5.8 : 0;
    const brakeForce = input.brake ? 8.5 : 0;
    const parkingBrakeForce = input.parkingBrake ? 16 : 0;
    const drag = this.speedMetersPerSecond * 0.8;
    const previousSpeed = this.speedMetersPerSecond;

    this.speedMetersPerSecond += (acceleration - brakeForce - parkingBrakeForce - drag) * deltaSeconds;
    this.speedMetersPerSecond = Math.max(-5, Math.min(18, this.speedMetersPerSecond));

    if (!input.accelerate && !input.brake && Math.abs(this.speedMetersPerSecond) < 0.08) {
      this.speedMetersPerSecond = 0;
    }

    const steeringInput = (input.steerRight ? 1 : 0) - (input.steerLeft ? 1 : 0);
    const steeringStrength = Math.min(Math.abs(this.speedMetersPerSecond) / 8, 1);
    this.headingRadians += steeringInput * steeringStrength * 1.35 * deltaSeconds * Math.sign(this.speedMetersPerSecond || 1);

    this.position.x += Math.sin(this.headingRadians) * this.speedMetersPerSecond * 24 * deltaSeconds;
    this.position.y += Math.cos(this.headingRadians) * this.speedMetersPerSecond * 24 * deltaSeconds;

    const deceleration = (previousSpeed - this.speedMetersPerSecond) / Math.max(deltaSeconds, 0.001);
    this.harshBrakeCooldownSeconds = Math.max(0, this.harshBrakeCooldownSeconds - deltaSeconds);
    const harshBrake = deceleration > 9 && this.harshBrakeCooldownSeconds === 0;

    if (harshBrake) {
      this.harshBrakeCooldownSeconds = 1.25;
    }

    return { harshBrake };
  }

  reset() {
    this.position = { x: -430, y: -180 };
    this.speedMetersPerSecond = 0;
    this.headingRadians = Math.PI / 2;
  }

  telemetry() {
    return {
      speedKmh: Math.abs(this.speedMetersPerSecond) * 3.6,
      position: { ...this.position },
      headingRadians: this.headingRadians,
    };
  }
}
