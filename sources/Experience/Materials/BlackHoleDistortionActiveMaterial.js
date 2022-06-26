import * as THREE from 'three'

import vertexShader from '../shaders/blackHoleDistortionActive/vertex.glsl'
import fragmentShader from '../shaders/blackHoleDistortionActive/fragment.glsl'

function BlackHoleDistortionActiveMaterial()
{
    const material = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        side: THREE.DoubleSide,
        // blending: THREE.AdditiveBlending,
        // depthWrite: false,
        // depthTest: false,
        transparent: true,
        uniforms:
        {
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

export default BlackHoleDistortionActiveMaterial