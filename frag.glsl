#version 300 es
precision mediump float;

uniform float time;
uniform vec2 resolution;

out vec4 frag;

void main() {
  frag = vec4(.5,.1,.1,.1);
}