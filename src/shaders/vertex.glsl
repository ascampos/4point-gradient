attribute vec2 aVertexPosition;
uniform mat3 projectionMatrix;
varying vec2 vUV;

void main() {
    vUV = aVertexPosition;
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
}
