#define PI 3.1415926538

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uViewHeight;
uniform float uSize;

in float position;
in float aSize;
in float aRandom;

out vec3 vColor;

void main()
{
    // float outerProgress = ;
    float concentration = 0.05;
    float outerProgress = smoothstep(0.0, 1.0, position);
    outerProgress = mix(concentration, outerProgress, pow(aRandom, 1.7));
    float radius = 1.0 + outerProgress * 5.0;
    
    float angle = outerProgress - uTime * (1.0 - outerProgress) * 3.0;
    vec3 newPosition = vec3(
        sin(angle) * radius,
        0.0,
        cos(angle) * radius
    );
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;

    gl_PointSize = aSize * uSize * uViewHeight;
    gl_PointSize *= (1.0 / - modelViewPosition.z);

    vColor = mix(uInnerColor, uOuterColor, outerProgress);
}