<template>
    <transition>
        <div data-modal v-if="_visible" @click.self="onBackdropClicked">
            <div data-dialog>
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
    </transition>
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

[data-modal] {
    --modal-margin: 1.75rem;
    --modal-width: 500px;
    --modal-color: rgb(0 0 0);
    --modal-bg: rgb(255 255 255);
    --modal-border-width: 1px;
    --modal-border-color: rgb(0 0 0 / 0.15);
    --modal-border-radius: 0.5rem;
    --modal-zindex: 1055;
    --modal-padding: 1rem;
    --modal-footer-gap: 0.5rem;

    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--modal-zindex);
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    outline: 0;
    background-color: rgba(0 0 0 / 0.5);
}
[data-dialog] {
    max-width: var(--modal-width);
    margin: var(--modal-margin);
    margin-right: auto;
    margin-left: auto;
}
[data-content] {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--modal-color);
    pointer-events: auto;
    background-color: var(--modal-bg);
    background-clip: padding-box;
    border: var(--modal-border-width) solid var(--modal-border-color);
    border-radius: var(--modal-border-radius);
    outline: 0;
}
[data-header] {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: var(--modal-padding);
    border-bottom: var(--modal-border-width) solid var(--modal-border-color);
    border-top-left-radius: var(--modal-border-radius);
    border-top-right-radius: var(--modal-border-radius);
}
[data-close] {
    /* padding: calc(var(--modal-padding)/4); */
    cursor: pointer;
    color: rgb(0 0 0 /.5);
    font-size: 2rem;
    line-height: 2rem;
}
[data-body] {
    position: relative;
    flex: 1 1 auto;
    padding: var(--modal-padding);
}
[data-footer] {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: var(--modal-footer-gap);
    padding: calc(var(--modal-padding) - var(--modal-footer-gap) * .5);
    background-color: var(--modal-bg);
    border-top: var(--modal-border-width) solid var(--border-color);
    border-bottom-right-radius: var(--modal-border-radius);
    border-bottom-left-radius: var(--modal-border-radius);
}
</style>