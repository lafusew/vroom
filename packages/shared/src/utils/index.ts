import { Vector3 } from "three/src/math/Vector3.js";
const VEC1 = new Vector3();
const VEC2 = new Vector3();

function utility() {
    return "🌈 I'm a utility function from the shared package !";
}

function deepEqual(x: Record<string, any>, y: Record<string, any>): boolean {
    const ok = Object.keys,
        tx = typeof x,
        ty = typeof y;
    return x && y && tx === "object" && tx === ty ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key])) : x === y;
}

function isDistanceDifferenceAcceptable(threshold: number, v1: [number, number, number], v2: [number, number, number]): boolean {
    console.log("DISTANCE ACCEPTABLE", VEC1.fromArray(v1).distanceTo(VEC2.fromArray(v2)));

    return VEC1.fromArray(v1).distanceTo(VEC2.fromArray(v2)) < threshold;
}

function mod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export { deepEqual, isDistanceDifferenceAcceptable, utility, mod };
