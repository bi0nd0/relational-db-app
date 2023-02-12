<template>

    <div data-drawer v-if="_visible" @click.self="onBackdropClicked">
        <div data-wrapper>
            <div data-content>
                <div data-header>
                    <slot name="header">
                        <p>{{title}}</p>
                    </slot>
                    <span data-close @click="onCloseClicked">×</span>
                </div>
                <div data-body>
                    <slot>{{body}}</slot>
                </div>
                <div data-footer>
                    <slot name="footer">
                        <slot name="secondary-button">
                            <template v-if="!hideCancel">
                                <button class="btn btn-sm btn-secondary" type="button" data-button-cancel @click="onCancelClicked" v-html="cancelText"></button>
                            </template>
                        </slot>
                        <slot name="primary-button">
                            <button class="btn btn-sm btn-primary" type="button" data-button-ok @click="onOkClicked" v-html="okText"></button>
                        </slot>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BodyStyleManager from './BodyStyleManager'
    const bodyStyleManager = new BodyStyleManager()

    const RETURN_VALUE = Object.freeze({
        OK: 1,
        CANCEL: 0,
        ERROR: -1
    })

    // global reference to the resolve/reject in the show() promise
    let showResolve, showReject = null

    export default {
        data() {
            return {
                _visible: false,
            }
        },
        props: {
            visible: { type: Boolean, default: false },
            backdrop: { type: Boolean, default: false },
            disableOutsideClick: { type: Boolean, default: false },
            hideCancel: { type: Boolean, default: false },
            okText: { type: String, default: 'Ok' },
            cancelText: { type: String, default: 'Cancel' },
            closeText: { type: String, default: '&times;' },
            title: { type: String, default: '' },
            body: { type: String, default: '' },
        },
        methods: {
            show() {
                if(!this._visible) {
                    this._visible = true
                    this.$emit('show', this)
                    bodyStyleManager.applyStyle({overflow: 'hidden'})
                }
                const promise = new Promise((resolve, reject) => {
                    // set a global reference to resolve and reject
                    showResolve = resolve
                    showReject = reject
                })
                return promise
            },
            hide(status=RETURN_VALUE.CANCEL) {
                if(!this._visible) return
                this._visible = false
                this.$emit('hide', this, status)
                bodyStyleManager.restoreStyle()

                if(!showResolve || !showReject) return
                switch (status) {
                    case RETURN_VALUE.OK:
                        showResolve(true)
                        break;
                    case RETURN_VALUE.CANCEL:
                        showResolve(false)
                        break;
                    case RETURN_VALUE.ERROR:
                        showReject(true)
                        break;
                    default:
                        break;
                }
                // reset resolve and reject
                showResolve = showReject = null
            },
            toggle() {
                return this._visible ? this.hide() : this.show()
            },
            /**
             * hide if the user clicks on the outside mask
             */
            cancel() { this.hide(RETURN_VALUE.CANCEL) },
            onBackdropClicked(e) { if(!this.disableOutsideClick) this.cancel() },
            onCloseClicked(e) { this.cancel() },
            onCancelClicked(e) { this.cancel() },
            onOkClicked(e) { this.hide(RETURN_VALUE.OK) },
        },
        watch: {
            visible: {
                immediate: true,
                handler(value) {
                    if(value===true) this.show()
                    else this.hide()
                }
            }
        }
    }

    export { RETURN_VALUE }
</script>

<style scoped>
[data-drawer] {
    --drawer-margin: 1.75rem;
    --drawer-width: 70vw;
    --drawer-color: rgb(0 0 0);
    --drawer-bg: rgb(255 255 255);
    --drawer-border-width: 1px;
    --drawer-border-color: rgb(0 0 0 / 0.15);
    --drawer-border-radius: 0.5rem;
    --drawer-zindex: 1055;
    --drawer-padding: 1rem;
    --drawer-footer-gap: 0.5rem;

    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--drawer-zindex);
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
    background-color: rgba(0 0 0 / 0.5);
}
[data-wrapper] {
    max-width: var(--drawer-width);
    margin: 0;
    margin-left: auto;
}
[data-content] {
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--drawer-color);
    pointer-events: auto;
    background-clip: padding-box;
    border: var(--drawer-border-width) solid var(--drawer-border-color);
    /* border-radius: var(--drawer-border-radius); */
    outline: 0;
}
[data-header] {
    background-color: var(--drawer-bg);
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: var(--drawer-padding);
    border-bottom: var(--drawer-border-width) solid var(--drawer-border-color);
    border-top-left-radius: var(--drawer-border-radius);
    border-top-right-radius: 0;
}
[data-close] {
    /* padding: calc(var(--drawer-padding)/4); */
    cursor: pointer;
    color: rgb(0 0 0 /.5);
    font-size: 2rem;
    line-height: 2rem;
}
[data-body] {
    background-color: var(--drawer-bg);
    position: relative;
    flex: 1 1 auto;
    padding: var(--drawer-padding);
}
[data-footer] {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--drawer-footer-gap);
    padding: calc(var(--drawer-padding) - var(--drawer-footer-gap) * .5);
    background-color: var(--drawer-bg);
    border-top: var(--drawer-border-width) solid var(--border-color);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: var(--drawer-border-radius);
}
</style>