var pandora = require('pandora')

var async   = pandora(require('./async'))
var core    = pandora(require('./core'))
var ho      = pandora(require('./higher-order'))

module.exports = pandora.merge(core, ho, async)
