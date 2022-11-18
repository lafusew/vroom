precision highp float;

uniform sampler2D tSpritesheet;
uniform float uSpritesCount;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = vec2(fract((vUv.x / uSpritesCount + (1. / uSpritesCount) * floor(uTime * 0.01))), vUv.y);

  vec4 tex = texture2D(tSpritesheet, uv);

  if (tex.a < 0.5 || uv.x < 0.0001 || uv.x > 0.9999) discard;

  gl_FragColor = vec4(tex);
}