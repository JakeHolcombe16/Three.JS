// modelMatrix apply transformations relative to the mesh(position, rotation, and scale)
// viewMatrix apply transformation relative to the camera (position, rotation, field of view, near,far )
// projectionMatrix transform the coordinates into the clipe space coordinates


/** 
The vertex shader position the vertices on the render.

The fragment shader color each visible fragment (or pixel) of that geometry.

The fragment shader is executed after the vertex shader.

Data that changes between each vertices (like their position) is called ATTRIBUTE and can only be used in the vertex shader.

Data that doesn't change between vertices (like the mesh position or a color) is called UNIFORM and can be use in both the vertex shader and the fragment shader.

We can send data from the vertex shader to the fragment shader using VARYING.
    
**/

// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;
// attribute float aRandom;

// varying float vRandom;

void main()
{
    vec4 modelPositon = modelMatrix * vec4(position, 1.0);
    // Since we are multiplying it by 0.1 the min and max for the sin is -0.1 to 0.1
    float elevation = sin(modelPositon.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPositon.y * uFrequency.y - uTime) * 0.1;

    modelPositon.z += elevation;
    // modelPositon.z += aRandom * 0.1;

    


    vec4 viewPosition = viewMatrix * modelPositon;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;


    vUv = uv;
    vElevation = elevation;
    // vRandom = aRandom;
}
