precision highp float;
precision highp int;

in vec2 vUv;

out vec4 gl_FragColor;
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

    // float gradientStrength = abs(vUv.y - 0.5) * 20.0;
    // gradientStrength = smoothstep(0.0, 1.0, gradientStrength);

    float strength = radialStrength;
    // pc_FragColor.r = strength;
gl_FragColor = vec4(strength, 1.0, 1.0, 1.0);}
