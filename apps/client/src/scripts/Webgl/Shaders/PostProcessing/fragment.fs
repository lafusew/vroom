precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;

uniform float uRatio;
uniform float uTime;
uniform float uPixelSize;
uniform float uRocketSpeed;

uniform vec2 uResolution;


varying vec2 vUv;



void main() {
	vec2 fUv = (vUv - .5) * (1. - smoothstep(.3, .7, length(vUv - .5)) * (abs(uRocketSpeed) * 1.)) + .5;

	// PIXELATION
	vec2 dxy = uPixelSize / uResolution;
	vec2 coord = dxy * floor(fUv / dxy);

	gl_FragColor = texture2D(tDiffuse, coord);
}
