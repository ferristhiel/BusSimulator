import './styles.css.js';
import { BusSimulatorGame } from './game/BusSimulatorGame.js';

const canvas = document.querySelector('#game-canvas');
const hud = document.querySelector('#hud');

if (!(canvas instanceof HTMLCanvasElement) || !(hud instanceof HTMLElement)) {
  throw new Error('BusSimulator konnte Canvas oder HUD nicht initialisieren.');
}

const game = new BusSimulatorGame(canvas, hud);
await game.start();

window.addEventListener('beforeunload', () => {
  game.save();
  game.dispose();
});
