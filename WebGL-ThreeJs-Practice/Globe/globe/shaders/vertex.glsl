// glsl is a typed language , we need to define return type and all

varying vec2 vertexUV;
varying vec3 vertexNormal;

// we our creating our own mesh material
void main(){
    vertexUV = uv;  // uv is provided by threejs by default
    vertexNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    // vec4 same as (1,0,0,1)
}


