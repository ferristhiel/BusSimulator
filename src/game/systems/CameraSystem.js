export class CameraSystem {
  modes = ['follow', 'cockpit', 'free'];
  modeIndex = 0;
  freeOffset = { x: 0, y: 0 };

  toggle() {
    this.modeIndex = (this.modeIndex + 1) % this.modes.length;
    return this.currentMode();
  }

  currentMode() {
    return this.modes[this.modeIndex];
  }

  worldToScreen(point, busPosition, canvas) {
    const mode = this.currentMode();
    const scale = mode === 'cockpit' ? 1.25 : mode === 'free' ? 0.78 : 0.95;
    const cameraX = mode === 'free' ? this.freeOffset.x : busPosition.x;
    const cameraY = mode === 'free' ? this.freeOffset.y : busPosition.y;

    return {
      x: canvas.width / 2 + (point.x - cameraX) * scale,
      y: canvas.height / 2 + (point.y - cameraY) * scale,
      scale,
    };
  }
}
