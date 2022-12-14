precision highp float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {

	gl_FragColor = vec4((abs(vPosition + sin(uTime * .001) * .5)), 1.);
}
