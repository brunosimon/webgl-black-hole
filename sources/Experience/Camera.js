import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scenes = this.experience.scenes

        // Set up
        this.mode = 'debug' // default \ debug

        this.setInstance()
        this.setModes()

        // Debug
        if(this.debug.active)
        {
            const folder = this.debug.ui.getFolder('camera')
            
            folder
                .add(
                    this,
                    'mode',
                    {
                        debug: 'debug',
                        default: 'default'
                    }
                )
        }
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(45, this.config.width / this.config.height, 0.1, 1000)
        this.instance.rotation.reorder('YXZ')

        this.scenes.space.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(5, 2, 5)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        const source = this.modes[this.mode].instance
        // this.instance.position.copy(source.position)
        // this.instance.quaternion.copy(source.quaternion)
        // this.instance.updateMatrixWorld() // To be used in projection

        source.updateWorldMatrix(true, false)

        this.instance.position.set(0, 0, 0)
        this.instance.quaternion.set(0, 0, 0, 0)
        this.instance.scale.set(1, 1, 1)
        this.instance.applyMatrix4(source.matrixWorld)
        this.instance.scale.set(1, 1, 1)
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
