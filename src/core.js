import { TIMEOUT } from './config'
import { ERROR_FETCH_TIMEOUT } from './errors'
// eslint-disable-next-line
const globalInstance = typeof window === 'object' ? window : Function('return this')()

export function exportToGlobal (key, value) {
  globalInstance[key] = value
}
// TODO: Using web at core bridge
export default class CoreBridge {
  constructor () {
    this.bridge = globalInstance
    this.instanceOnMessage = null
    this.defaultOption = {
      method: 'get'
    }
  }
  sendMessage (message) {
    this.bridge.postMessage(JSON.stringify(message), '*')
  }
  onMessage (onMessage) {
    if (this.instanceOnMessage) {
      this.bridge.removeEventListener('message', this.instanceOnMessage)
      this.instanceOnMessage = null
    }
    this.instanceOnMessage = this.bridge.addEventListener('message', (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data) {
          onMessage(true, data)
        }
        onMessage(false, 'Invalid return')
      } catch (e) {
        onMessage(null, e.message)
        /* handle error */
      }
    })
  }
  appendFetchOption (option) {
    this.defaultOption = {
      ...this.defaultOption,
      ...option
    }
  }
  fetch (url, options = {}) {
    return Promise.race([
      // eslint-disable-next-line
      fetch(url, {
        ...this.defaultOption,
        options
      })
        .then(res => res.json()),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(ERROR_FETCH_TIMEOUT)
        }, TIMEOUT)
      })
    ])
  }
}
