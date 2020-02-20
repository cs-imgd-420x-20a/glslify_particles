#version 300 es
precision mediump float;
in vec4 a_pos;
in vec2 a_vel;
out vec2 o_vel;

void main() {
  float x = a_pos.x + a_vel.x;
  if( x >= 1. ) x= -1.;
  
  o_vel = a_vel;
  
  gl_PointSize = 10.;
  gl_Position = vec4( x, a_pos.y, 0., 1. );
}