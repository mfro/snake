import { Ref } from 'vue';

import { DOWN_ARROW, LEFT_ARROW, onKeyDown, R, RIGHT_ARROW, UP_ARROW } from './input';
import { assert } from './util';
import { Vec } from './vec';

interface Direction {
  id: number;
  value: Vec;
}

const
  UP: Direction = { id: -1, value: new Vec(0, -1) },
  DOWN: Direction = { id: 1, value: new Vec(0, 1) },
  LEFT: Direction = { id: -2, value: new Vec(-1, 0) },
  RIGHT: Direction = { id: 2, value: new Vec(1, 0) };

interface GameRules {
  // size of the visible playfield
  field_size: Vec;

  // milliseconds between the snake moving
  step_delay: number;

  // initial tail and direction
  initial_tail: Vec[];
  initial_facing: Direction;
}

interface GameState {
  tail: Vec[];
  facing: Direction;
  input_queue: Direction[];

  food: Vec | null;
  step_delay: number;
}

/** generate a new food */
function new_food(rules: GameRules, game: GameState) {
  let pos: Vec;
  do {
    let x = Math.floor(Math.random() * rules.field_size.x);
    let y = Math.floor(Math.random() * rules.field_size.y);
    pos = new Vec(x, y);
  } while (!game.tail.every(v => !Vec.eq(v, pos)));

  return pos;
}

/** create a new game */
function new_game(rules: GameRules): GameState {
  return {
    tail: rules.initial_tail.slice(),
    facing: rules.initial_facing,
    input_queue: [],

    food: null,
    step_delay: rules.step_delay,
  }
}

export function snake(canvas: HTMLCanvasElement, score: Ref<number>) {
  const unit_size = 10;

  const rules: GameRules = {
    field_size: new Vec(50, 40),

    step_delay: 1,

    initial_tail: [new Vec(0, 4), new Vec(1, 4), new Vec(2, 4), new Vec(3, 4), new Vec(4, 4)],
    initial_facing: RIGHT,
  };

  canvas.width = rules.field_size.x * unit_size - 1;
  canvas.height = rules.field_size.y * unit_size - 1;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  const context = canvas.getContext('2d')!;
  assert(context != null, 'no context');

  let game = new_game(rules);
  game.step_delay = 200;
  game.food = new_food(rules, game);
  let dead = false;

  onKeyDown(UP_ARROW, () => { game.input_queue.push(UP); console.log('UP'); });
  onKeyDown(DOWN_ARROW, () => { game.input_queue.push(DOWN); console.log('DOWN'); });
  onKeyDown(LEFT_ARROW, () => { game.input_queue.push(LEFT); console.log('LEFT'); });
  onKeyDown(RIGHT_ARROW, () => { game.input_queue.push(RIGHT); console.log('RIGHT'); });
  onKeyDown(R, () => {
    dead = false;
    game = new_game(rules);
    game.step_delay = 200;
    game.food = new_food(rules, game);
    score.value = 0;
  });

  function update() {
    let dir = game.facing;

    while (game.input_queue.length > 0) {
      let next = game.input_queue.shift()!;
      if (next == game.facing || next.id == -game.facing.id) {
        continue;
      }

      dir = next;
      break;
    }

    game.facing = dir;

    let next = Vec.add(game.tail[game.tail.length - 1], game.facing.value);

    if (game.food && Vec.eq(next, game.food)) {
      game.food = new_food(rules, game);
      score.value += 1;
    } else {
      game.tail.shift();
    }

    let collide = next.x < 0 || next.x >= rules.field_size.x
      || next.y < 0 || next.y >= rules.field_size.y
      || !game.tail.every(v => !Vec.eq(v, next));

    if (collide) {
      return true;
    }

    game.tail.push(next);

    return false;
  }

  /** draw a single tile */
  function draw_tile(position: Vec) {
    context.fillStyle = 'black';
    context.fillRect(
      position.x * unit_size, position.y * unit_size,
      unit_size - 1, unit_size - 1
    );
  }

  let previous = 0;
  requestAnimationFrame(tick);
  function tick(time: number) {
    let delta = previous ? time - previous : 0;
    previous = time;

    if (!dead) {
      game.step_delay -= delta;
      if (game.step_delay < 0) {
        game.step_delay += 1000 / 30;
        dead = update();
      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let v of game.tail) {
      draw_tile(v);
    }

    if (game.food) {
      draw_tile(game.food);
    }

    requestAnimationFrame(tick);
  }
}
