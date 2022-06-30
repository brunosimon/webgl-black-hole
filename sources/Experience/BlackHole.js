import * as THREE from 'three'
import Experience from './Experience.js'
import Noises from './Noises.js'
import BlackHoleDiscMaterial from './Materials/BlackHoleDiscMaterial.js'
import BlackHoleParticlesMaterial from './Materials/BlackHoleParticlesMaterial.js'
import BlackHoleDistortionActiveMaterial from './Materials/BlackHoleDistortionActiveMaterial.js'
import BlackHoleDistortionMaskMaterial from './Materials/BlackHoleDistortionMaskMaterial.js'

export default class BlackHole
{
    constructor()
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scenes = this.experience.scenes
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer

        this.noises = new Noises()

        this.setCommonUniforms()
        this.setParticles()
        this.setDisc()
        this.setDistortion()
    }

    setCommonUniforms()
    {
        this.commonUniforms = {}
        this.commonUniforms.uInnerColor = { value: new THREE.Color('#ff8080') }
        this.commonUniforms.uOuterColor = { value: new THREE.Color('#3633ff') }

        // Debug
        if(this.debug.active)
        {
            const folder = this.debug.ui.getFolder('blackhole')
            
            folder
                .addColor(
                    this.commonUniforms.uInnerColor,
                    'value'
                )
                
            folder
                .addColor(
                    this.commonUniforms.uOuterColor,
                    'value'
                )
        }
    }

    setDisc()
    {
        this.disc = {}

        this.disc.geometry = new THREE.CylinderGeometry(5, 1, 0, 64, 10, true)

        this.disc.noiseTexture = this.noises.create(128, 128)
        this.disc.material = new BlackHoleDiscMaterial()
        this.disc.material.uniforms.uNoiseTexture.value = this.disc.noiseTexture
        this.disc.material.uniforms.uInnerColor = this.commonUniforms.uInnerColor
        this.disc.material.uniforms.uOuterColor = this.commonUniforms.uOuterColor
        
        this.disc.mesh = new THREE.Mesh(
            this.disc.geometry,
            this.disc.material
        )
        this.scenes.space.add(this.disc.mesh)
    }

    setParticles()
    {
        this.particles = {}
        this.particles.count = 50000

        // Geometry
        const distanceArray = new Float32Array(this.particles.count)
        const sizeArray = new Float32Array(this.particles.count)
        const randomArray = new Float32Array(this.particles.count)
        for(let i = 0; i < this.particles.count; i++)
        {
            distanceArray[i] = Math.random()
            sizeArray[i] = Math.random()
            randomArray[i] = Math.random()
        }

        this.particles.geometry = new THREE.BufferGeometry()
        this.particles.geometry.setAttribute('position', new THREE.Float32BufferAttribute(distanceArray, 1))
        this.particles.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
        this.particles.geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randomArray, 1))

        // Material
        // this.particles.material = new THREE.PointsMaterial()
        this.particles.material = new BlackHoleParticlesMaterial()
        this.particles.material.uniforms.uViewHeight.value = this.renderer.composition.space.height
        this.particles.material.uniforms.uInnerColor = this.commonUniforms.uInnerColor
        this.particles.material.uniforms.uOuterColor = this.commonUniforms.uOuterColor

        // Mesh
        this.particles.points = new THREE.Points(
            this.particles.geometry,
            this.particles.material
        )
        this.particles.points.frustumCulled = false

        this.scenes.space.add(this.particles.points)
    }

    setDistortion()
    {
        this.distortion = {}
        
        this.distortion.active = {}
        this.distortion.active.geometry = new THREE.PlaneBufferGeometry(1, 1)
        this.distortion.active.material = new BlackHoleDistortionActiveMaterial()
        this.distortion.active.mesh = new THREE.Mesh(this.distortion.active.geometry, this.distortion.active.material)
        this.distortion.active.mesh.scale.set(10, 10, 10)
        this.scenes.distortion.add(this.distortion.active.mesh)

        this.distortion.mask = {}
        this.distortion.mask.geometry = new THREE.PlaneBufferGeometry(1, 1)
        this.distortion.mask.material = new BlackHoleDistortionMaskMaterial()
        this.distortion.mask.mesh = new THREE.Mesh(this.distortion.mask.geometry, this.distortion.mask.material)
        this.distortion.mask.mesh.scale.set(10, 10, 10)
        this.distortion.mask.mesh.rotation.x = Math.PI * 0.5
        this.scenes.distortion.add(this.distortion.mask.mesh)
    }

    resize()
    {
        this.particles.material.uniforms.uViewHeight.value = this.sizes.height
    }

    update()
    {
        const screenPosition = new THREE.Vector3(0, 0, 0)
        screenPosition.project(this.camera.instance)
        screenPosition.x = screenPosition.x * 0.5 + 0.5
        screenPosition.y = screenPosition.y * 0.5 + 0.5

        this.disc.material.uniforms.uTime.value = this.time.elapsed
        this.particles.material.uniforms.uTime.value = this.time.elapsed + 9999.0

        this.distortion.active.mesh.lookAt(this.camera.instance.position)

        this.renderer.composition.final.material.uniforms.uBlackHolePosition.value.set(
            screenPosition.x,
            screenPosition.y
        )
    }
}