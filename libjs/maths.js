var fs = require("fs")

const builtins = {
  min: function() {
    let argArr = [...arguments]
    return {
      value: Math.min.apply(null, argArr.map((arg) => arg.value))
    }
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
  multiply: function (arg1, arg2) {
    return {
      value: (arg1.value * arg2.value)
    }
  },
  modulo: function (arg1, arg2) {
    return {
      value: (arg1.value % arg2.value)
    }
  }
}

const my_handler = {
  get: function (target, prop) {
    let methods = Object.keys(builtins)
    if (methods.includes(prop)) {
      return builtins[prop]
    } else {
      console.error("Undefined function call! No such function: ", prop)
    }
  }, 
}

const proxy_obj = new Proxy({}, my_handler)
let _

module.exports = function (self) {
  _ = self
  return proxy_obj
}
