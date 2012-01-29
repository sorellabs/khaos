function count() {
  var n = 0
  return function counter(f) {
    return arguments.length == 0?    n
    :      /* otherwise */         ++n }}

function always() { return true }
function never()  { return false }



module.exports = { count:  count
                 , always: always
                 , never:  never
                 }