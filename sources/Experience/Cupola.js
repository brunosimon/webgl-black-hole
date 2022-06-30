import * as THREE from 'three'
import Experience from './Experience.js'

export default class Cupola
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.scenes = this.experience.scenes

        this.group = new THREE.Group()
        this.group.add(this.resources.items.cupolaModel.scene)
    }

    update()
    {
        this.cupola.update()
    }

    destroy()
    {
    }
}
