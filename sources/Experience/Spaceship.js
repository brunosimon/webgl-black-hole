import * as THREE from 'three'
import Experience from './Experience.js'
import Cupola from './Cupola.js'

export default class Spaceship
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scenes = this.experience.scenes
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.camera = this.experience.camera

        this.group = new THREE.Group()
        this.group.position.y = 1
        this.group.scale.set(0.1, 0.1, 0.1)
        this.scenes.overlay.add(this.group)

        
        this.cupola = new Cupola()
        this.group.add(this.cupola.group)
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
        this.group.add(ambientLight)
        
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
        // directionalLight.position 
        this.group.add(this.directionalLight)

        this.setCursor()
        this.setView()
    }

    setCursor()
    {
        this.cursor = {}
        this.cursor.x = this.sizes.width * 0.5
        this.cursor.y = this.sizes.height * 0.5
        this.cursor.normalisedX = 0
        this.cursor.normalisedY = 0

        window.addEventListener('mousemove', (_event) =>
        {
            this.cursor.x = _event.clientX
            this.cursor.y = _event.clientY
            
            this.cursor.normalisedX = this.cursor.x / this.sizes.width - 0.5
            this.cursor.normalisedY = this.cursor.y / this.sizes.height - 0.5
        })
    }

    setView()
    {
        this.view = {}
        
        this.view.camera = this.camera.modes.default.instance
        this.group.add(this.view.camera)

        this.view.rotation = new THREE.Euler(0, 0, 0, 'YXZ')
        this.view.targetRotation = new THREE.Euler(0, 0, 0, 'YXZ')
    }

    update()
    {
        this.view.targetRotation.x = - this.cursor.normalisedY
        this.view.targetRotation.y = - this.cursor.normalisedX

        this.view.rotation.x += (this.view.targetRotation.x - this.view.rotation.x) * this.time.delta * 2
        this.view.rotation.y += (this.view.targetRotation.y - this.view.rotation.y) * this.time.delta * 2

        // this.view.targetRotation.x 

        this.view.camera.position.set(0, 0, 2)
        this.view.camera.rotation.copy(this.view.rotation)

        this.group.position.z = Math.sin(this.time.elapsed * 0.5) * 2 + 5
        this.group.rotation.y = 0.5

        this.directionalLight.position.copy(this.group.position)
        this.directionalLight.position.negate()

        // console.log(this.directionalLight.position)
    }

    destroy()
    {
    }
}
