// to get a texture map image
uniform sampler2D globeTexture;

varying vec2 vertexUV;  // eg: [0,0.24]
void main(){
    // param -> samplerObj, uv coord
    // texture2D(globeTexture,vertexUV)
    gl_FragColor = texture2D(globeTexture,vertexUV);
}