export class InputSystem {
  pressedKeys = new Set();
  justPressedKeys = new Set();

  handleKeyDown = (event) => {
    if (!this.pressedKeys.has(event.code)) {
      this.justPressedKeys.add(event.code);
    }

    this.pressedKeys.add(event.code);

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
      event.preventDefault();
    }
  };

  handleKeyUp = (event) => {
    this.pressedKeys.delete(event.code);
  };

  attach() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  snapshot() {
    const snapshot = {
      accelerate: this.isPressed('KeyW') || this.isPressed('ArrowUp'),
      brake: this.isPressed('KeyS') || this.isPressed('ArrowDown'),
      steerLeft: this.isPressed('KeyA') || this.isPressed('ArrowLeft'),
      steerRight: this.isPressed('KeyD') || this.isPressed('ArrowRight'),
      parkingBrake: this.isPressed('Space'),
      serviceStopPressed: this.wasPressed('KeyE'),
      cameraPressed: this.wasPressed('KeyC'),
      resetPressed: this.wasPressed('KeyR'),
    };

    this.justPressedKeys.clear();
    return snapshot;
  }

  isPressed(code) {
    return this.pressedKeys.has(code);
  }

  wasPressed(code) {
    return this.justPressedKeys.has(code);
  }
}
