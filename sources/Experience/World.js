import BlackHole from './BlackHole.js'
import Experience from './Experience.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scenes = this.experience.scenes
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.blackHole = new BlackHole()
            }
        })
    }

    resize()
    {
        if(this.blackHole)
            this.blackHole.resize()
    }

    update()
    {
        if(this.blackHole)
            this.blackHole.update()
    }

    destroy()
    {
    }
}