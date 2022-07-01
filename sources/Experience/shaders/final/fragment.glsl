#define PI 3.1415926538

precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D uSpaceTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uBlackHolePosition;
uniform float uRGBShiftRadius;

layout(location = 0) out vec4 pc_FragColor;

vec3 getRGBShiftedColor(sampler2D _texture, vec2 _uv, float _radius)
{
    vec3 angle = vec3(
        PI * 2.0 / 3.0,
        PI * 4.0 / 3.0,
        0
    );
    vec3 color = vec3(0.0);
    color.r = texture(_texture, _uv + vec2(sin(angle.r) * _radius, cos(angle.r) * _radius)).r;
    color.g = texture(_texture, _uv + vec2(sin(angle.g) * _radius, cos(angle.g) * _radius)).g;
    color.b = texture(_texture, _uv + vec2(sin(angle.b) * _radius, cos(angle.b) * _radius)).b;

    return color;
}

void main()
{
    vec4 distortionColor = texture(uDistortionTexture, vUv);
    float distortionIntensity = distortionColor.r;
    // distortionIntensity /= 4.0;
    vec2 towardCenter = vUv - uBlackHolePosition;
    towardCenter *= - distortionIntensity * 2.0;
    // towardCenter *= 0.0;

    vec2 distoredUv = vUv + towardCenter;
    vec3 outColor = getRGBShiftedColor(uSpaceTexture, distoredUv, uRGBShiftRadius);

    // // Gamma corection
    // outColor.rgb = pow(outColor.rgb, vec3(1.0 / 2.2));

    pc_FragColor = vec4(outColor, 1.0);
    // pc_FragColor = distortionColor;
}