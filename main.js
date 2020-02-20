const shell = require( 'gl2-now' )({ clearColor:[0,0,0,0] })
const glslify = require( 'glslify' )
const createBuffer = require( 'gl-buffer' )
const createShader = require( 'gl-shader' )
 
const frag = glslify.file( './frag.glsl' ),
      vert = glslify.file( './vert.glsl' )

let posBuffer1, posBuffer2, velBuffer1, velBuffer2,
    particleCount = 1024,
    shader
 
shell.on("gl-init", function() {
  const gl = shell.gl
  const w = gl.drawingBufferWidth
  const h = gl.drawingBufferHeight
  
  // has to be floats for position data
  const posData = new Float32Array( particleCount * 4 )
  for( let i = 0; i < particleCount * 4; i+= 4 ) {
    posData[ i ] = -1
    posData[ i + 1 ] = -1 + Math.random() * 2
  }
  
  const velData = new Float32Array( particleCount * 2 )
  for( let i = 0; i < particleCount * 2; i+= 2 ) {
    velData[ i ] = Math.random() * .025
    velData[ i + 1 ] = -.025 + Math.random() * .05
  }
  
  posBuffer1 = createBuffer( gl, posData )
  posBuffer2 = createBuffer( gl, new Float32Array( particleCount * 4 ) )
  
  velBuffer1 = createBuffer( gl, velData )
  velBuffer2 = createBuffer( gl, new Float32Array( particleCount * 2 ) )
  
  shader = createShader( gl, vert, frag )
  
  transformFeedback = gl.createTransformFeedback()
  gl.bindTransformFeedback( gl.TRANSFORM_FEEDBACK, transformFeedback )      
  gl.transformFeedbackVaryings( shader.program, [ 'gl_Position' ], gl.SEPARATE_ATTRIBS )
  
  // have to re-link program now that transforms have been added
  gl.linkProgram( shader.program )
  gl.useProgram( shader.program )
  
  gl.enable( gl.BLEND )
  gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA )
})
 
shell.on("gl-render", function(t) {
  const gl = shell.gl
  gl.clearColor( 0,0,0,1 )
  gl.clear( gl.COLOR_BUFFER_BIT )
  
  shader.bind()
  posBuffer1.bind()
  shader.attributes.a_pos.pointer()
  
  velBuffer1.bind()
  shader.attributes.a_vel.pointer()
  
  shader.uniforms.resolution = [ gl.drawingBufferWidth, gl.drawingBufferHeight ]
  
  gl.bindBufferBase( gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBuffer2.handle )
  gl.beginTransformFeedback( gl.POINTS )
  gl.drawArrays(gl.POINTS, 0, particleCount ) 
  gl.endTransformFeedback()
  
  let tmp = posBuffer1; posBuffer1 = posBuffer2; posBuffer2 = tmp
  tmp = velBuffer1; velBuffer1 = velBuffer2; velBuffer2 = tmp
})