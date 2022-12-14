attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uSize;
uniform float uScale;

varying vec4 vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uScale;
    gl_PointSize *= uSize;
    gl_PointSize *= (1. / - viewPosition.z);
    
    vPosition = projectedPosition;
}