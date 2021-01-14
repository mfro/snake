export const
  SPACE = 32,
  ENTER = 13,
  SHIFT = 16,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  A = 65,
  Z = 90,
  S = 83,
  X = 88,
  C = 67,
  R = 82;

let down = new Set<number>();
let listeners = new Map<number, (() => void)[]>();

window.addEventListener('keydown', e => {
  if (down.has(e.keyCode))
    return;

  // console.log(e.keyCode);
  down.add(e.keyCode);

  let list = listeners.get(e.keyCode);
  if (!list) return;

  for (let item of list) {
    item();
  }
});

window.addEventListener('keyup', e => {
  down.delete(e.keyCode);
});

export function isKeyDown(k: number) {
  return down.has(k);
}

export function onKeyDown(key: number, handler: () => void) {
  let list = listeners.get(key);
  if (!list) listeners.set(key, list = []);
  list.push(handler);
}
