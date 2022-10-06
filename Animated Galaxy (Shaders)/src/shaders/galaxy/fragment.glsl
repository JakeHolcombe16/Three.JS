varying vec3 vColor;

void main()
{
    // Distance
    // Vec2 because we need to know the distance between the x and y coordinates
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // // Turns the center into black so we invert it so we just have circles
    // // strength = step(0.5, strength);
    // strength = 1.0 - step(0.5, strength);

    // // Diffuse Point
    // // Using a diffuse point we will make it fade into brighter colors near the center
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // Light Point pattern
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color
    vec3 color = mix(vec3(0.0), vColor, strength);


    gl_FragColor = vec4(color, 1.0);

}