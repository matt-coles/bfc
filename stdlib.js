const global_obj = {}
module.exports = {
  assign: function (ref, value) {
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
