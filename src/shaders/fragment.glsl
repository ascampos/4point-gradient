precision mediump float;

varying vec2 vUV;

uniform vec2 u_resolution;

// 4 color points (normalized 0-1 coordinates)
uniform vec2 u_point1;
uniform vec2 u_point2;
uniform vec2 u_point3;
uniform vec2 u_point4;

// 4 colors (RGB, 0-1 range)
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;

// Blend control (0-1)
uniform float u_blend;

void main() {
    // Current pixel position in UV space (0-1)
    vec2 pos = vUV / u_resolution;
    
    // Calculate distances to each point
    float d1 = distance(pos, u_point1);
    float d2 = distance(pos, u_point2);
    float d3 = distance(pos, u_point3);
    float d4 = distance(pos, u_point4);
    
    // Prevent division by zero when point is exactly on a color anchor
    d1 = max(d1, 0.0001);
    d2 = max(d2, 0.0001);
    d3 = max(d3, 0.0001);
    d4 = max(d4, 0.0001);
    
    // Map blend to power exponent
    float k = mix(0.5, 4.0, u_blend);
    
    // Calculate weights (inverse distance weighting)
    float w1 = 1.0 / pow(d1, k);
    float w2 = 1.0 / pow(d2, k);
    float w3 = 1.0 / pow(d3, k);
    float w4 = 1.0 / pow(d4, k);
    
    // Normalize weights
    float totalWeight = w1 + w2 + w3 + w4;
    w1 /= totalWeight;
    w2 /= totalWeight;
    w3 /= totalWeight;
    w4 /= totalWeight;
    
    // Blend colors
    vec3 color = w1 * u_color1 + 
                 w2 * u_color2 + 
                 w3 * u_color3 + 
                 w4 * u_color4;
    
    gl_FragColor = vec4(color, 1.0);
}
