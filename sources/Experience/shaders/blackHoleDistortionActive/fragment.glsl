precision highp float;
precision highp int;

in vec2 vUv;

layout(location = 0) out vec4 pc_FragColor;

float inverseLerp(float v, float minValue, float maxValue)
{
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax)
{
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

void main()
{
    float strength = 1.0 - length(vUv - 0.5) * 2.0;
    strength = smoothstep(0.0, 1.0, strength);
    // pc_FragColor.r = strength;
    pc_FragColor = vec4(strength, 1.0, 1.0, 1.0 );
}