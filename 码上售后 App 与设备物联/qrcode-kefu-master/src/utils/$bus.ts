import mitt from 'mitt'

const emitter = mitt()

const $bus = {
  on: emitter.on,
  emit: emitter.emit,
  off: emitter.off,
}

export default $bus
