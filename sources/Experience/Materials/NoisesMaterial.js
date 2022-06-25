import * as THREE from 'three'

import vertexShader from '../shaders/noises/vertex.glsl'
import fragmentShader from '../shaders/noises/fragment.glsl'

function NoisesMaterial()
{
    const material = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms:
        {
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

export default NoisesMaterial