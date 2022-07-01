import * as THREE from 'three'
import Experience from './Experience.js'
import FinalMaterial from './Materials/FinalMaterial.js'

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scenes = this.experience.scenes
        this.camera = this.experience.camera
     
        this.setInstance()
        this.setComposition()
    }

    setInstance()
    {
        this.clearColor = '#000000'

        // Renderer
        this.instance = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instance.domElement.style.position = 'absolute'
        this.instance.domElement.style.top = 0
        this.instance.domElement.style.left = 0
        this.instance.domElement.style.width = '100%'
        this.instance.domElement.style.height = '100%'

        this.instance.setClearColor(this.clearColor, 1)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        this.instance.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.shadowMap.enabled = true
        this.instance.toneMapping = THREE.NoToneMapping
        this.instance.toneMappingExposure = 1

        this.context = this.instance.getContext()

        // Add stats panel
        if(this.debug.stats)
        {
            this.debug.stats.setRenderPanel(this.context)
        }
        
        // Debug
        if(this.debug.active)
        {
            const folder = this.debug.ui.getFolder('renderer')
            
            folder
                .addColor(
                    this,
                    'clearColor'
                )
                .onChange(() =>
                {
                    this.instance.setClearColor(this.clearColor)
                })

            folder
                .add(
                    this.instance,
                    'toneMapping',
                    {
                        'NoToneMapping': THREE.NoToneMapping,
                        'LinearToneMapping': THREE.LinearToneMapping,
                        'ReinhardToneMapping': THREE.ReinhardToneMapping,
                        'CineonToneMapping': THREE.CineonToneMapping,
                        'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
                    }
                )
                .onChange(() =>
                {
                    this.scenes.traverse((_child) =>
                    {
                        if(_child instanceof THREE.Mesh)
                            _child.material.needsUpdate = true
                    })
                })
                
            folder
                .add(
                    this.instance,
                    'toneMappingExposure'
                )
                .min(0)
                .max(10)
        }
    }

    setComposition()
    {
        this.composition = {}

        this.composition.space = new THREE.WebGLRenderTarget(
            this.sizes.width * 2,
            this.sizes.height * 2,
            {
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter
            }
        )
        
        this.composition.distortion = new THREE.WebGLRenderTarget(
            this.sizes.width * 0.5,
            this.sizes.height * 0.5,
            {
                magFilter: THREE.LinearFilter,
                minFilter: THREE.LinearFilter,
                format: THREE.RedFormat,
                type: THREE.FloatType
            }
        )
        
        this.composition.final = {}
        this.composition.final.material = new FinalMaterial()
        this.composition.final.material.uniforms.uSpaceTexture.value = this.composition.space.texture
        this.composition.final.material.uniforms.uDistortionTexture.value = this.composition.distortion.texture
        this.composition.final.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            this.composition.final.material
        )
        this.composition.final.plane.frustumCulled = false
        this.composition.final.scene = new THREE.Scene()
        this.composition.final.scene.add(this.composition.final.plane)
    }

    resize()
    {
        // Instance
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.debug.stats)
        {
            this.debug.stats.beforeRender()
        }

        this.instance.autoClearColor = true
        this.instance.setRenderTarget(this.composition.space)
        this.instance.render(this.scenes.space, this.camera.instance)

        this.instance.setRenderTarget(this.composition.distortion)
        this.instance.render(this.scenes.distortion, this.camera.instance)

        this.instance.setRenderTarget(null)
        this.instance.render(this.composition.final.scene, this.camera.instance)

        this.instance.autoClearColor = false
        this.instance.setRenderTarget(null)
        this.instance.render(this.scenes.overlay, this.camera.instance)

        if(this.debug.stats)
        {
            this.debug.stats.afterRender()
        }
    }

    destroy()
    {
        this.instance.renderLists.dispose()
        this.instance.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}