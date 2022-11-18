precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

void main() {
    vUv = uv;

    float rotation = 0.0;

    vec2 pos = position.xy;

    vec2 rotatedPosition = vec2(
        cos(rotation) * position.x - sin(rotation) * position.y,
        sin(rotation) * position.x + cos(rotation) * position.y
    );

    vec4 finalPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    finalPosition.xy += rotatedPosition;
    finalPosition = projectionMatrix * finalPosition;

    gl_Position = finalPosition;
}