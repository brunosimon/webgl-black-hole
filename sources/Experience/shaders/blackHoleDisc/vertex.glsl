uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

in vec3 position;
in vec2 uv;

out vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
}