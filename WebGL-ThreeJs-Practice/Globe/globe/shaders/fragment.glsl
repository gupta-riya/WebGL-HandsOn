// to get a texture map image
uniform sampler2D globeTexture;

varying vec2 vertexUV;  // eg: [0,0.24]
varying vec3 vertexNormal;

void main(){
    // atmospheric glow for every pixel
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0,1.0));
    
                    // shade of color of atmosphere
    vec3 atmosphere = vec3(0.3,0.6,1.0)*pow(intensity,1.5);
    // param -> samplerObj, uv coord
    // texture2D(globeTexture,vertexUV)
    // adding atmosphere is creating a great effect
    gl_FragColor = vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz, 1.0);
}