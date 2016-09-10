const fs = require('fs')

var tokenizer = function (input) {
  let pos = 0
  let tokens = []

  tokens.push(input)

  while (pos < input.length) {
    let char = input[pos]
    let parens = /[()]/
    if (parens.test(char)) {
      tokens.push({
        type: 'paren',
        value: char
      })
      pos++
      continue
    }
    let whitespace = /[;\s]/
    if (whitespace.test(char)) {
      if (char === ';') {
        comment = ''
        while (char !== '\n') {
          comment += char
          char = input[++pos]
        }
      } else {
        pos++
      }
      continue
    }
    let numbers = /[0-9]/
    if (numbers.test(char)) {
      let numberString = ''
      while (numbers.test(char)) {
        numberString += char
        char = input[++pos]
      }
      tokens.push({
        type: 'number',
        value: numberString
      })
      continue
    }
    let characters = /[a-zA-Z_]/
    if (characters.test(char)) {
      let name = ''
      while (characters.test(char)) {
        name += char
        char = input[++pos]
      }
      tokens.push({
        type: 'name',
        value: name
      })
      continue
    }
    let dollar = /[$]/
    if (dollar.test(char)) {
      let name = ''
      char = input[++pos]
      if (numbers.test(char)) {
        while (numbers.test(char)) {
          name += char
          char = input[++pos]
        }
      } else {
        console.error("Compiler Error: $ must be followed by a digit [0-9]")
        process.exit(1);
      }
      tokens.push({
        type: 'dollar',
        value: name
      })
      continue
    }
    throw new TypeError("I'm not sure what you are telling me :( Ask my creator to teach me what a: " + char + " is.")
  }
  return tokens
}

var parser = function (input) {
  let pos = 1

  function walk() {
    let token = input[pos]

    if (token.type === 'number') {
      pos++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }

    if (token.type === 'name') {
      pos++
      return {
        type: 'VariableReference',
        value: token.value
      }
    }

    if (token.type === 'dollar') {
      pos++
      return {
        type: 'DollarVar',
        value: token.value
      }
    }

    if (token.type === 'paren' && token.value == '(') {
      token = input[++pos]
      if (token.type !== 'name') {
        throw {
          name: 'Compiler Error',
          message: 'FunctionCall may only be type "name" not "' + token.type + '".'
        }
      }
      let node = {
        type: 'FunctionCall',
        value: token.value,
        params: []
      }
      token = input[++pos]
      while ((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk())
        token = input[pos]
      }
      pos++
      return node
    }

    throw new TypeError(token.type)
  }

  let ast = {
    type: 'Prog',
    body: []
  }
  while (pos < input.length) {
    ast.body.push(walk())
  }
  return ast
}

var traverser = function (ast, visitor) {

  function traverseArray(array, parent) {
    array.forEach(function (child) {
      traverseNode(child, parent)
    })
  }

  function traverseNode(node, parent) {
    const method = visitor[node.type]
    
    if (method) {
      method(node, parent)
    }

    switch (node.type) {
      case 'Prog':
        traverseArray(node.body, node)
        break
      case 'FunctionCall':
        traverseArray(node.params, node)
        break
      case 'VariableReference':
        break
      case 'NumberLiteral':
        break
      case 'DollarVar':
        break
      default:
        throw {
          name: 'Compiler Error',
          message: 'Unknown leaf in AST: ' + node.type
        }
    }
  }

  traverseNode(ast, null)
}

var transformer = function (ast) {

  let newAst = {
    type: 'Prog',
    body: []
  }

  ast._context = newAst.body

  traverser(ast, {
    NumberLiteral: function (node, parent) {
      parent._context.push({
        type: 'NumberLiteral',
        value: node.value
      })
    },
    VariableReference: function (node, parent) {
      parent._context.push({
        type: 'VariableReference',
        value: node.value
      })
    },
    DollarVar: function (node, parent) {
      parent._context.push({
        type: 'DollarVar',
        value: node.value
      })
    },
    FunctionCall: function (node, parent) {
      let expression = {
        type: 'FunctionCall',
        callee: {
          type: 'FunctionName',
          name: node.value
        },
        args: []
      }
      node._context = expression.args
      if (parent.type !== 'FunctionCall') {
        expression = {
          type: 'Statement',
          expr: expression
        }
      }

      parent._context.push(expression)
    }
  })

  return newAst
}


var generator = function (node) {

  switch (node.type) {
    case 'Prog':
      let program = node.body.map(generator)
      program.unshift('var _ = require("./stdlib.js")')
      return program.join('\n')
      break
    case 'Statement':
      return (generator(node.expr) + ';')
      break
    case 'FunctionCall':
      if (node.callee.name !== 'def') {
        return (generator(node.callee) + '(' + node.args.map(generator).join(', ') + ')')
      } else {
        return (generator(node.callee) + '(' + node.args.map((v, i) => {
          if (i === 0) {
            return generator(v) + ', '
          } else {
            if (i === 1) {
              return "'" + generator(v) + '; '
            } else {
              return generator(v) + '; '
            }
          }
        }).join('') + "')")
      }
      break;
    case 'DollarVar':
      return '$' + node.value
      break
    case 'FunctionName':
      return '_.' + node.name
      break
    case 'VariableReference':
      return '_.ref("' + node.value + '")'
      break
    case 'NumberLiteral':
      return '{value: ' + node.value + '}'
      break
    default:
      throw {
        name: 'Compiler Error',
        message: 'Unexpected leaf in transformed AST: ' + node.type
      }
      break
  }

}


// const myInput = '(assign twelve 12) (assign myvar (add twelve (subtract 6 2))) (log myvar)'
const myInput = fs.readFileSync(process.argv[2], { encoding: 'utf-8' })
const myTokens = tokenizer(myInput)
const parsedTree = parser(myTokens)
const transformedTree = transformer(parsedTree)
//console.log(JSON.stringify(transformedTree,null,2))
const output = generator(transformedTree)
fs.writeFileSync('output.js', output)
