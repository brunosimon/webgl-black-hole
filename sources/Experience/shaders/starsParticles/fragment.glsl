precision highp float;
precision highp int;

layout(location = 0) out vec4 pc_FragColor;

in vec3 vColor;

void main()
{
    // vec4 color = vec4(gl_PointCoord, 1.0, 1.0);
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if(distanceToCenter > 0.5)
        discard;

    pc_FragColor = vec4(vColor, 1.0);
    // pc_FragColor = color;
}