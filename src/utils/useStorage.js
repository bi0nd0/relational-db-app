import { reactive } from "vue"



class StorageManager {
    
    key
    
    constructor(key) {
        this.key = key
    }

    get() {
        try {
            const stored = localStorage.getItem(this.key)
            if(typeof stored === 'string' || stored instanceof String) return JSON.parse(stored)
        } catch (error) {
            // fail silently if cannot convert to a value
            return
        }
    }

    set(value) {
        const toString = JSON.stringify(value)
        localStorage.setItem(this.key, toString)
    }

    remove() {
        localStorage.removeItem(this.key)
    }
}

const useStorage = (key) => {
    return new StorageManager(key)
}

export { useStorage }