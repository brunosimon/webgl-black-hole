precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uSpaceTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uBlackHolePosition;

layout(location = 0) out vec4 pc_FragColor;

void main()
{
    vec4 distortionColor = texture(uDistortionTexture, vUv);
    float distortionIntensity = distortionColor.r;
    // distortionIntensity /= 4.0;
    vec2 towardCenter = vUv - uBlackHolePosition;
    towardCenter *= - distortionIntensity * 2.0;
    // towardCenter *= 0.0;

    vec2 distoredUv = vUv + towardCenter;
    vec3 spaceColor = texture(uSpaceTexture, distoredUv).rgb;

    pc_FragColor = vec4(spaceColor, 1.0);
    // pc_FragColor = distortionColor;
}