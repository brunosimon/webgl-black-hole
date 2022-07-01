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

        this.model = this.resources.items.cupolaModel.scene
        this.model.traverse((_child) =>
        {
            if(_child instanceof THREE.Mesh)
            {
                _child.castShadow = true
                _child.receiveShadow = true
            }
        })

        this.group = new THREE.Group()
        this.group.add(this.model)
    }

    update()
    {
        this.cupola.update()
    }

    destroy()
    {
    }
}
