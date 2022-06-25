import * as THREE from 'three'

import vertexShader from '../shaders/disc/vertex.glsl'
import fragmentShader from '../shaders/disc/fragment.glsl'

function DiscMaterial()
{
    const material = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms:
        {
            uTime: { value: 0 },
            uNoiseTexture: { value: null },
            uInnerColor: { value: new THREE.Color('#ff8080') },
            uOuterColor: { value: new THREE.Color('#3633ff') }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    return material
}

export default DiscMaterial