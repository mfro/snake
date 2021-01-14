export class Vec {
  static zero = new Vec(0, 0);

  constructor(
    readonly x: number,
    readonly y: number,
  ) { }

  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get dir() {
    return Math.atan2(this.y, this.x);
  }

  static norm(a: Vec) {
    return Vec.polar(1, a.dir);
  }

  static scale(a: Vec, scalar: number) {
    return new Vec(a.x * scalar, a.y * scalar);
  }

  static add(a: Vec, b: Vec) {
    return new Vec(a.x + b.x, a.y + b.y);
  }

  static dot(a: Vec, b: Vec) {
    return a.x * b.x + a.y * b.y;
  }

  static eq(a: Vec, b: Vec) {
    return a.x == b.x && a.y == b.y;
  }

  static delta(a: Vec, b: Vec) {
    let dot = Vec.dot(a, b);
    let abs = Math.acos(dot / a.len / b.len);
    if (a.y * b.x > a.x * b.y)
      return -abs;
    return abs;
  }

  static polar(len: number, dir: number) {
    return new Vec(
      Math.cos(dir) * len,
      Math.sin(dir) * len
    );
  }
}
