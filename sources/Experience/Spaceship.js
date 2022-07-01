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
        
        const ambientLight = new THREE.AmbientLight(0xb98aff, 0.05)
        this.group.add(ambientLight)

        this.setDirectionalLight()
        this.setCursor()
        this.setView()
    }

    setDirectionalLight()
    {
        this.directionalLight = {}

        this.directionalLight.instance = new THREE.DirectionalLight(0xb98aff, 5)
        this.directionalLight.instance.position.set(0, 0, 0)
        this.directionalLight.instance.castShadow = true
        this.directionalLight.instance.shadow.camera.near = 0
        this.directionalLight.instance.shadow.camera.far = 1
        this.directionalLight.instance.shadow.camera.top = 0.5
        this.directionalLight.instance.shadow.camera.right = 0.5
        this.directionalLight.instance.shadow.camera.bottom = -0.5
        this.directionalLight.instance.shadow.camera.left = -0.5
        this.directionalLight.instance.shadow.mapSize.set(1024, 1024)
        this.directionalLight.instance.shadow.bias = 0
        this.directionalLight.instance.shadow.normalBias = 0.00252
        this.scenes.overlay.add(this.directionalLight.instance)
        this.scenes.overlay.add(this.directionalLight.instance.target)

        this.directionalLight.helper = new THREE.DirectionalLightHelper(this.directionalLight.instance, 5)
        // this.scenes.overlay.add(this.directionalLight.helper)

        this.directionalLight.cameraHelper = new THREE.CameraHelper(this.directionalLight.instance.shadow.camera)
        // this.scenes.overlay.add(this.directionalLight.cameraHelper)
        
        // Debug
        if(this.debug.active)
        {
            const folder = this.debug.ui.getFolder('spaceship/directionalLight')
                
            folder
                .addColor(
                    this.directionalLight.instance,
                    'color'
                )                
                
            folder
                .add(
                    this.directionalLight.instance,
                    'intensity'
                )
                .min(0)
                .max(10)
                
            folder
                .add(
                    this.directionalLight.instance.shadow,
                    'bias'
                )
                .min(-0.005)
                .max(0.005)
                .step(0.00001)
                
            folder
                .add(
                    this.directionalLight.instance.shadow,
                    'normalBias'
                )
                .min(-0.005)
                .max(0.005)
                .step(0.00001)

            folder
                .add(
                    this.directionalLight.instance.target.position,
                    'x'
                )
                .min(-5)
                .max(5)

            folder
                .add(
                    this.directionalLight.instance.target.position,
                    'y'
                )
                .min(-5)
                .max(5)

            folder
                .add(
                    this.directionalLight.instance.target.position,
                    'z'
                )
                .min(-5)
                .max(5)
        }
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

        this.group.position.x = - 1
        this.group.position.y = 1
        this.group.position.z = Math.sin(this.time.elapsed * 0.5) * 6

        this.group.rotation.y = 0.5

        const centerToSpaceship = this.group.position.clone()
        // centerToSpaceship.normalize()

        this.directionalLight.instance.position.copy(centerToSpaceship)
        this.directionalLight.instance.position.setLength(centerToSpaceship.length() - 0.5)
        this.directionalLight.instance.target.position.copy(centerToSpaceship)
        // this.directionalLight.instance.target.position.negate()

        // console.log(this.directionalLight.instance.position)
        this.directionalLight.helper.update()
        this.directionalLight.cameraHelper.update()
    }

    destroy()
    {
    }
}
