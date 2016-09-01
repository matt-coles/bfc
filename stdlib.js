const global_obj = {}
module.exports = {
  assign: function (ref, value) {
    if (!ref.name) {
      console.error('Argument 1 of assign must always be a VariableReference')
      process.exit(1)
    }
    global_obj[ref.name] = value.value
  },
  add: function (arg1, arg2) {
    return {
      value: (arg1.value + arg2.value)
    }
  },
  subtract: function (arg1, arg2) {
    return {
      value: (arg1.value - arg2.value)
    }
  },
  log: function (ref) {
    console.log(ref.value)
  },
  ref: function (refname) {
    return {
      name: refname,
      value: global_obj[refname]
    }
  }
}
