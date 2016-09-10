const global_obj = {}
const function_defs = {}
const warnings = {}
const builtins = {
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
  },
  def: function (prop, body) {
    let methods = Object.keys(function_defs)
    if (methods.includes(prop.name)) {
      console.warn("Warning! Redefining function, did you mean to do this?")
    }
    function_defs[prop.name] = body;
  },
  repeat: function (amount, body) {
    for (i = 0 ; i < amount.value; i++) {
        body() 
    }
  },
  eQ: function (arg1, arg2) {
    return {
      value: arg1.value === arg2.value
    }
  },
  eq: function (arg1, arg2) {
    return {
      value: arg1.value == arg2.value
    }
  },
  if: function (pred, body_true, body_false) {
    if (pred.value) {
      body_true()
    } else {
      if (body_false) {
        body_false()
      }
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
      methods = Object.keys(function_defs)
      if (methods.includes(prop)) {
        //return (function () { eval(function_defs[prop].replace(/\$(\d+)/g, (m, n) => JSON.stringify(arguments[(+n-1)]))) })
        return function_defs[prop]
      } else {
        console.error("Undefined function call! No such function: ", prop)
      }
    }
  }, 
  set: function (target, prop, data) {
    if (prop === 'w') data.map((w) => warnings.w = true)
    else console.error("Attempting to set unknown property on interpreter! How did you do that?")
  }
}

const _ = new Proxy({}, my_handler)

module.exports = _
