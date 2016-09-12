var fs = require("fs")

const builtins = {
  readIn: function (path) {
    let str = fs.readFileSync(path.value, { encoding: 'utf-8' })
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
}

const proxy_obj = new Proxy({}, my_handler)
let _

module.exports = function (self) {
  _ = self
  return proxy_obj
}
