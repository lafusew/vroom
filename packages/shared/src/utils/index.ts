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

function isDistanceDifferenceAcceptable(threshold: number, v1: [number, number], v2: [number, number]): boolean {
  const [x1, y1] = v1;
  const [x2, y2] = v2;

  var dx = x1 - x2;
  var dy = y1 - y2;

  return dx * dx + dy * dy < threshold * threshold
}

export { deepEqual, isDistanceDifferenceAcceptable, utility };