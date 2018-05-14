import resizilla from 'resizilla';
// require('resizilla')

class SizeSnapper {

    constructor(config) {

        this.portionWidth = 342;
        this.initialSize = -2;
        this.timeout = 15

        // state
        this.currentScale = 0;
        this.currentWidth = 0;


        // override
        if (config != null) {
            if (config.portionWidth != null && typeof config.portionWidth == "number") {
                this.portionWidth = config.portionWidth
            }
            if (config.initialSize != null && typeof config.initialSize == "number") {
                this.initialSize = config.initialSize
            }
            if (config.timeout != null && typeof config.timeout == "number") {
                this.timeout = config.timeout
            }
        }

        this.halfPortionWidth = Math.floor(this.portionWidth/2);
        this.checkViewport();

        resizilla(
            this.snapSize.bind(this),
            this.timeout,
            false,
            false,
            true
        )

        setTimeout(this.snapSize.bind(this),this.timeout)

        this.onSnapSize = () => {}
    }

    checkViewport() {
        this.viewportElm = document.head.querySelector("meta[name=viewport]")
        if (this.viewportElm == null) {
            this.viewportElm = this.createViewportMeta();
        }
    }

    createViewportMeta() {
        var meta = document.createElement("meta")
        meta.setAttribute("name", "viewport")
        meta.setAttribute("content", "width=device-width")
        document.head.appendChild(meta)
        return meta
    }

    applyScaleToMetaViewport() {
        this.checkViewport();
        let contentStr = "width=device-width";
        contentStr += ", minimum-scale="+this.currentScale;
        contentStr += ", maximum-scale="+this.currentScale;
        contentStr += ", user-scalable=no";
        this.viewportElm.setAttribute("content", contentStr);
    }

    updateScale(windowWidth) {
        if (windowWidth < this.halfPortionWidth) {
            windowWidth = this.halfPortionWidth;
        }
        // let offset = (windowWidth - this.initialSize - this.halfPortionWidth) % this.portionWidth - this.halfPortionWidth;
        this.currentWidth = Math.ceil(windowWidth / this.portionWidth) * this.portionWidth + this.initialSize
        this.currentScale = windowWidth / this.currentWidth;
        console.log(windowWidth, this.currentWidth, this.currentScale)
    }

    snapSize() {
        this.updateScale(window.outerWidth);
        this.applyScaleToMetaViewport();
        this.onSnapSize();
    }

}

export default SizeSnapper