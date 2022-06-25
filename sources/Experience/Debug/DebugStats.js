import StatsJs from 'stats.js'

export default class DebugStats
{
    constructor()
    {
        this.instance = new StatsJs()
        this.instance.showPanel(3)

        this.active = false
        this.max = 120
        this.ignoreMaxed = true

        this.activate()
    }

    activate()
    {
        this.active = true

        document.body.appendChild(this.instance.dom)
    }

    deactivate()
    {
        this.active = false

        document.body.removeChild(this.instance.dom)
    }

    setRenderPanel(_context)
    {
        this.experience = {}
        this.experience.context = _context
        this.experience.extension = this.experience.context.getExtension('EXT_disjoint_timer_query_webgl2')
        this.experience.panel = this.instance.addPanel(new StatsJs.Panel('Render (ms)', '#f8f', '#212'))

        const webGL2 = typeof WebGL2RenderingContext !== 'undefined' && _context instanceof WebGL2RenderingContext

        if(!webGL2 || !this.experience.extension)
        {
            this.deactivate()
        }
    }

    beforeRender()
    {
        if(!this.active)
        {
            return
        }

        // Setup
        this.queryCreated = false
        let queryResultAvailable = false

        // Test if query result available
        if(this.experience.query)
        {
            queryResultAvailable = this.experience.context.getQueryParameter(this.experience.query, this.experience.context.QUERY_RESULT_AVAILABLE)
            const disjoint = this.experience.context.getParameter(this.experience.extension.GPU_DISJOINT_EXT)
                
            if(queryResultAvailable && !disjoint)
            {
                const elapsedNanos = this.experience.context.getQueryParameter(this.experience.query, this.experience.context.QUERY_RESULT)
                const panelValue = Math.min(elapsedNanos / 1000 / 1000, this.max)

                if(panelValue === this.max && this.ignoreMaxed)
                {
                    
                }
                else
                {
                    this.experience.panel.update(panelValue, this.max)
                }
            }
        }

        // If query result available or no query yet
        if(queryResultAvailable || !this.experience.query)
        {
            // Create new query
            this.queryCreated = true
            this.experience.query = this.experience.context.createQuery()
            this.experience.context.beginQuery(this.experience.extension.TIME_ELAPSED_EXT, this.experience.query)
        }

    }

    afterRender()
    {
        if(!this.active)
        {
            return
        }
        
        // End the query (result will be available "later")
        if(this.queryCreated)
        {
            this.experience.context.endQuery(this.experience.extension.TIME_ELAPSED_EXT)
        }
    }

    update()
    {
        if(!this.active)
        {
            return
        }

        this.instance.update()
    }

    destroy()
    {
        this.deactivate()
    }
}