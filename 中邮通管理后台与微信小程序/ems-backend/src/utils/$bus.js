import mitt from 'mitt'

const $bus = {}

const emitter = mitt()

$bus.on = emitter.on

$bus.emit = emitter.emit

$bus.off = emitter.off

export default $bus
