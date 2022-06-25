import * as THREE from 'three'
import Experience from './Experience.js'
import Noises from './Noises.js'
import DiscMaterial from './Materials/DiscMaterial.js'

export default class BlackHole
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug

        this.noises = new Noises()

        this.setDiscs()
    }

    setDiscs()
    {
        this.discs = {}

        this.discs.geometry = new THREE.CylinderGeometry(5, 1, 0, 64, 10, true)

        this.discs.noiseTexture = this.noises.create(128, 128)
        this.discs.material = new DiscMaterial()
        this.discs.material.uniforms.uNoiseTexture.value = this.discs.noiseTexture
        
        this.discs.mesh = new THREE.Mesh(
            this.discs.geometry,
            this.discs.material
        )
        this.scene.add(this.discs.mesh)

        // Debug
        if(this.debug.active)
        {
            const folder = this.debug.ui.getFolder('blackhole/discs')
            
            folder
                .addColor(
                    this.discs.material.uniforms.uInnerColor,
                    'value'
                )
                
            folder
                .addColor(
                    this.discs.material.uniforms.uOuterColor,
                    'value'
                )
        }
    }

    update()
    {
        this.discs.material.uniforms.uTime.value = this.time.elapsed
    }
}