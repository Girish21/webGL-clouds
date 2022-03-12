uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vAplha;
varying vec3 vPosition;

void main() {
  vec3 color = vec3(.835, 0., .564);
  vec4 map = texture2D(uTexture, vUv);
  float opacity = smoothstep(.5, 1., length(vPosition.xy));

  if (map.r < 0.1) {
    discard;
  }

  vec3 final = mix(vec3(1.), color, map.r);

  gl_FragColor = vec4(final, vAplha * opacity);
  // gl_FragColor = vec4(opacity);
  // gl_FragColor = vec4(vUv, sin(uTime) + 1., vAplha);
}
