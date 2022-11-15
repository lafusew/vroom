import { Vector3 } from "three";

function utility() {
  return '🌈 I\'m a utility function from the shared package !';
}

function deepEqual(x: Record<string, any>, y: Record<string, any>): boolean {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
    ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
}

function isDistanceDifferenceAcceptable(threshold: number, v1: Vector3, v2: Vector3): boolean {
  return v1.distanceTo(v2) < threshold;
}

function isSpeedDifferenceAcceptable(threshold: number, s1: number, s2: number): boolean {
  return Math.abs(s1 - s2) < threshold;
}

export { deepEqual, isDistanceDifferenceAcceptable, isSpeedDifferenceAcceptable, utility };
