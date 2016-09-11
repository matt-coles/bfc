const global_obj = {}
const function_defs = {}
const warnings = {}
const builtins = {
  concat: function () {
    let str = ""
    for (let i = 0; i < arguments.length; i++) {
      str += arguments[i].value
    }
    return {
      value: str
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
  set: function (target, prop, data) {
    if (prop === 'w') data.map((w) => warnings.w = true)
    else console.error("Attempting to set unknown property on interpreter! How did you do that?")
  }
}

const proxy_obj = new Proxy({}, my_handler)
let _

module.exports = function (self) {
  _ = self
  return proxy_obj
}
