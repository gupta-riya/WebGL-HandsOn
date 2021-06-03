// glsl is a typed language , we need to define return type and all

varying vec2 vertexUV;

// we our creating our own mesh material
void main(){
    vertexUV = uv;  // uv is provided by threejs by default
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);    // vec4 same as (1,0,0,1)
}


