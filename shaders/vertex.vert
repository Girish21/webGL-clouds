uniform float uTime;

varying vec2 vUv;
varying float vAplha;
varying vec3 vPosition;

attribute vec3 translate;
attribute float rotate;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate_glsl(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {
  float factor = 5.;
  vec3 newposition = position;
  newposition = rotate_glsl(newposition, vec3(0.,0.,1.), rotate);
  newposition += translate;
  newposition.z = mod(newposition.z + uTime * 0.08, factor);
  vPosition = newposition;

  vAplha = smoothstep(0., 8., newposition.z);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.);
  vUv = (uv - vec2(0.5)) / 3. + vec2(.5, .5 + .33);
}
