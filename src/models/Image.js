import File from "./File"

/**
 * single image
 */
export default class extends File {
    type = 'image'
    cropToFit = true
    fit = 'contain'
    width = 100
    height = 100
    quality = 80

    constructor(params) {
        super(params)
        if(params?.cropToFit) this.cropToFit = Boolean(params.cropToFit)
        if(params?.fit) this.fit = params.fit
        if(params?.width) this.width = parseInt(params.width)
        if(params?.height) this.height = parseInt(params.height)
        if(params?.quality) this.quality = parseInt(params.quality)
    }

}