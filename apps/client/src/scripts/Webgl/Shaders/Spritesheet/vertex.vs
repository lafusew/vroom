precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform vec3 uScale;

varying vec2 vUv;

void main() {
    vUv = uv;

    float rotation = 0.0;

    vec3 alignedPosition = position * uScale;

    vec2 pos = alignedPosition.xy;

    vec2 rotatedPosition = vec2(
        cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y,
        sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y
    );

    vec4 finalPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    finalPosition.xy += rotatedPosition;
    finalPosition = projectionMatrix * finalPosition;

    gl_Position = finalPosition;
}