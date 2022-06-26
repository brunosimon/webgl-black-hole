import * as THREE from 'three'

import vertexShader from '../shaders/blackHoleDistortionMask/vertex.glsl'
import fragmentShader from '../shaders/blackHoleDistortionMask/fragment.glsl'

function BlackHoleDistortionMaskMaterial()
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

export default BlackHoleDistortionMaskMaterial