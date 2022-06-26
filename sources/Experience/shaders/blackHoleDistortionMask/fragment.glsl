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
    float distanceToCenter = length(vUv - 0.5);
    float radialStrength = remap(distanceToCenter, 0.0, 0.15, 1.0, 0.0);
    radialStrength = smoothstep(0.0, 1.0, radialStrength);

    float alpha = smoothstep(0.0, 1.0, remap(distanceToCenter, 0.4, 0.5, 1.0, 0.0));

    pc_FragColor = vec4(radialStrength, 0.0, 0.0, alpha);
}