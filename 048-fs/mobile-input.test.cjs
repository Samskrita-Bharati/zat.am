const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createGame(pointerEvents = true) {
  const elements = new Map();
  const windowEvents = {};
  const documentEvents = {};
  let nextFrame;
  const makeElement = () => ({
    style: {}, textContent: '', innerText: '', hidden: false, listeners: {},
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener(type, listener) { this.listeners[type] = listener; },
    focus() {}
  });
  const ctx = new Proxy({}, {
    get(target, key) {
      if (key === 'createRadialGradient') return () => ({ addColorStop() {} });
      return target[key] || (() => {});
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  const canvas = Object.assign(makeElement(), {
    parentElement: { clientWidth: 400, clientHeight: 600 },
    getContext: () => ctx,
    getBoundingClientRect: () => ({ left: 100, top: 100 }),
    setPointerCapture() {}
  });
  const document = {
    hidden: false,
    body: makeElement(),
    querySelector(selector) {
      if (selector === '#c') return canvas;
      if (!elements.has(selector)) elements.set(selector, makeElement());
      return elements.get(selector);
    },
    querySelectorAll: () => Array.from({ length: 5 }, makeElement),
    addEventListener(type, listener) { documentEvents[type] = listener; }
  };
  const window = {
    devicePixelRatio: 1,
    addEventListener(type, listener) { windowEvents[type] = listener; }
  };
  if (pointerEvents) window.PointerEvent = function PointerEvent() {};
  const context = vm.createContext({
    window, document, localStorage: { getItem() { return null; }, setItem() {} },
    requestAnimationFrame(callback) { nextFrame = callback; },
    setTimeout() { return 1; }, clearTimeout() {}, console, Math
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'gameLogic.js'), 'utf8'), context);
  return { canvas, context, document, documentEvents, runFrame: time => nextFrame(time) };
}

function putTargetInCentre(game) {
  vm.runInContext(`
    setActiveMenu(null);
    resetGame();
    spawnTime = 100000;
    const testTarget = getTarget();
    testTarget.x = 0; testTarget.y = 0; testTarget.z = 0;
    testTarget.xD = 0; testTarget.yD = 0; testTarget.zD = 0;
    testTarget.transform(); testTarget.project();
    targets.push(testTarget);
  `, game.context);
}

test('a complete touch swipe between frames smashes an object', () => {
  const game = createGame();
  putTargetInCentre(game);
  const pointer = (x, y) => ({ isPrimary: true, pointerId: 1, pointerType: 'touch', clientX: x, clientY: y });
  game.canvas.listeners.pointerdown(pointer(260, 400));
  game.canvas.listeners.pointermove(pointer(300, 400));
  game.canvas.listeners.pointerup(pointer(340, 400));
  game.runFrame(16);
  assert.equal(vm.runInContext('state.game.cubeCount', game.context), 1);
  assert.equal(vm.runInContext('state.game.score', game.context), 10);
  assert.equal(game.document.querySelector('.smash-vocabulary-card').hidden, false);
});

test('the touch fallback preserves a quick swipe and suppresses page gestures', () => {
  const game = createGame(false);
  putTargetInCentre(game);
  let prevented = false;
  const event = x => ({ changedTouches: [{ identifier: 7, clientX: x, clientY: 400 }], preventDefault() { prevented = true; } });
  game.canvas.listeners.touchstart(event(260));
  game.canvas.listeners.touchmove(event(300));
  game.canvas.listeners.touchend(event(340));
  game.runFrame(16);
  assert.equal(prevented, true);
  assert.equal(vm.runInContext('state.game.cubeCount', game.context), 1);
});

test('a stationary tap does not award points or smash an object', () => {
  const game = createGame();
  putTargetInCentre(game);
  const pointer = { isPrimary: true, pointerId: 1, pointerType: 'touch', clientX: 300, clientY: 400 };
  game.canvas.listeners.pointerdown(pointer);
  game.canvas.listeners.pointerup(pointer);
  game.runFrame(16);
  assert.equal(vm.runInContext('state.game.cubeCount', game.context), 0);
  assert.equal(vm.runInContext('state.game.score', game.context), 0);
});

test('switching away pauses a round and clears any unfinished swipe', () => {
  const game = createGame();
  putTargetInCentre(game);
  const pointer = (x) => ({ isPrimary: true, pointerId: 1, pointerType: 'touch', clientX: x, clientY: 400 });
  game.canvas.listeners.pointerdown(pointer(260));
  game.canvas.listeners.pointermove(pointer(300));
  game.document.hidden = true;
  game.documentEvents.visibilitychange();
  assert.equal(vm.runInContext('isPaused()', game.context), true);
  assert.equal(vm.runInContext('pointerSegments.length', game.context), 0);
  assert.equal(vm.runInContext('pointerIsDown', game.context), false);
});
