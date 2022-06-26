import * as THREE from 'three'

import vertexShader from '../shaders/starsParticles/vertex.glsl'
import fragmentShader from '../shaders/starsParticles/fragment.glsl'

function BlackHoleParticlesMaterial()
{
    const material = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        // blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        // transparent: true,
        uniforms:
        {
            uViewHeight: { value: 1024 },
            uSize: { value: 0.001 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

export default BlackHoleParticlesMaterial