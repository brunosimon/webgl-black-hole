import * as THREE from 'three'
import Experience from './Experience.js'
import StarsParticlesMaterial from './Materials/StarsParticlesMaterial.js'

export default class Stars
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

        this.setParticles()
    }

    setParticles()
    {
        this.particles = {}
        this.particles.count = 50000

        // Geometry
        const positionArray = new Float32Array(this.particles.count * 3)
        const sizeArray = new Float32Array(this.particles.count)
        const colorArray = new Float32Array(this.particles.count * 3)

        for(let i = 0; i < this.particles.count; i++)
        {
            const iStride3 = i * 3

            const theta = 2 * Math.PI * Math.random()
            const phi = Math.acos(2 * Math.random() - 1.0);
            const x = Math.cos(theta) * Math.sin(phi) * 400
            const y = Math.sin(theta) * Math.sin(phi) * 400
            const z = Math.cos(phi) * 400

            positionArray[iStride3 + 0] = x
            positionArray[iStride3 + 1] = y
            positionArray[iStride3 + 2] = z

            sizeArray[i] = Math.random()

            const color = new THREE.Color(`hsl(${Math.round(360 * Math.random())}, 100%, 80%)`)
            colorArray[iStride3 + 0] = color.r
            colorArray[iStride3 + 1] = color.g
            colorArray[iStride3 + 2] = color.b
        }

        this.particles.geometry = new THREE.BufferGeometry()
        this.particles.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
        this.particles.geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
        this.particles.geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colorArray, 3))

        // Material
        // this.particles.material = new THREE.PointsMaterial()
        this.particles.material = new StarsParticlesMaterial()
        this.particles.material.uniforms.uViewHeight.value = this.renderer.composition.space.height

        // Mesh
        this.particles.points = new THREE.Points(
            this.particles.geometry,
            this.particles.material
        )
        this.particles.points.frustumCulled = false

        this.scenes.space.add(this.particles.points)
    }

    resize()
    {
        this.particles.material.uniforms.uViewHeight.value = this.sizes.height
    }

    update()
    {
    }
}