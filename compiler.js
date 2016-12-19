const fs = require('fs')
const sourcedFiles = []

var preprocess = function (fileNameIn, input) {
  let inputArr = input.split('\n')
  sourcedFiles.push(fileNameIn)
  for (i = 0; i < inputArr.length; i++) {
    line = inputArr[i]
    if (line.startsWith('`source')) {
      let fileName = line.split(' ')[1]
      if (!~sourcedFiles.indexOf(fileName)) {
        line = fs.readFileSync(fileName, { encoding: 'utf-8' })
        inputArr[i] = preprocess(fileName, line)
      } else {
        inputArr[i] = '\n'
        console.log('Already sourced file: ' + fileName + '; Skipping!')
      }
    }
  }
  return inputArr.join('\n')
}

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
    if (char === '|') {
      tokens.push({
        type: 'bar',
        value: char
      })
      pos++
      continue
    }
    let whitespace = /[;\s]/ // Include comments as a whitespace character as they are ignored
    if (whitespace.test(char)) {
      if (char === ';') { // Rest of line is ignored
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
    let stringChars = /['"]/
    if (stringChars.test(char)) {
      let myDelim = char
      let stringString = ''
      char = input[++pos]
      while (char !== myDelim) {
        if (char !== '\n') {
          stringString += char
        }
        char = input[++pos]
      }
      pos++
      tokens.push({
        type: 'string',
        value: stringString
      })
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
    let characters = /[a-zA-Z_:]/
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
    let argv = /[{}]/
    if (argv.test(char)) {
      tokens.push({
        type: 'argv',
        value: char
      })
      pos++
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

    if (token.type === 'bar') {
      pos++
      return {
        type: 'BarLiteral',
        value: token.value
      }
    }

    if (token.type === 'string') {
      pos++
      return {
        type: 'StringLiteral',
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

    if (token.type === 'argv' && token.value == '{') {
      token = input[++pos]
      if (token.type !== 'number') {
        throw {
          name: 'Compiler Error',
          message: 'argv may only take integer values.'
        }
      }
      let node = {
        type: 'ArgvLiteral',
        value: token.value
      }
      token = input[++pos]
      if (token.type !== 'argv' || token.value !== '}') {
        throw {
          name: 'Compiler Error',
          message: 'argv literals take one integer value and nothing else.'
        }
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
      case 'StringLiteral':
        break
      case 'DollarVar':
        break
      case 'BarLiteral':
        break
      case 'ArgvLiteral':
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
    StringLiteral: function (node, parent) {
      parent._context.push({
        type: 'StringLiteral',
        value: node.value
      })
    },
    BarLiteral: function (node, parent) {
      parent._context.push({
        type: 'BarLiteral',
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
    ArgvLiteral: function (node, parent) {
      parent._context.push({
        type: 'ArgvLiteral',
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

var escapeDepth = 0
var generator = function (node) {

  switch (node.type) {
    case 'Prog':
      let program = node.body.map(generator)
      program.unshift('var _ = require("' + libjsPath + '/stdlib.js")(this)')
      return program.join('\n')
      break
    case 'Statement':
      return (generator(node.expr) + ';')
      break
    case 'FunctionCall':
      if (!node.callee.name.match('(def|if|repeat)')) {
        if (node.callee.name.match('include')) {
          // Include is a special function and we will write the generation ourselves
          return node.args.map((arg) => {
            let lib = libjsPath + '/' + arg.value + '.js'
            return ('var _' + arg.value + ' = require("' + lib + '")(this)')
          }).join("\n")
        } else {
          return (generator(node.callee) + '(' + node.args.map(generator).join(', ') + ')')
        }
      } else {
        return (generator(node.callee) + '(' + node.args.map((v, i) => {
          if (i === 0) {
            return generator(v) + ', '
          } else {
            if (i === 1) {
              return 'function() { \n' + generator(v) + ';\n'
            } else {
              return generator(v) + ';\n'
            }
          }
        }).join('') + '})')
      }
      break;
    case 'DollarVar':
      return 'arguments[' + (+node.value-1) + ']'
      break
    case 'BarLiteral':
      return '}, function() {'
      break
    case 'FunctionName':
      if (node.name.match("::")) {
        let [namespace, func] = node.name.split("::")
        return "_" + namespace + "." + func
      } else {
        return '_.' + node.name
      }
      break
    case 'VariableReference':
      return '_.ref(\'' + node.value + '\')'
      break
    case 'NumberLiteral':
      return '{value: ' + node.value + '}'
      break
    case 'StringLiteral':
      return '{ value: \'' + node.value + '\' }'
      break
    case 'ArgvLiteral':
      if (node.value === '0') {
        return '{ value: process.argv.slice(2).join(\' \') }'
      } else {
        return '_.__get_arg(' + (+node.value+1) + ')'
      }
      break
    default:
      throw {
        name: 'Compiler Error',
        message: 'Unexpected leaf in transformed AST: ' + node.type
      }
      break
  }

}

let libjsPath = process.env['LIBJS_PATH']
const fileNameIn = process.argv[2]
const fileNameOut = fileNameIn + '.js'
const myInput = fs.readFileSync(process.argv[2], { encoding: 'utf-8' })

if (libjsPath === '') {
  libjsPath = './libjs'
}
const preProcessedInput = preprocess(fileNameIn, myInput) // Run the preprocessor to evaluate any `source's
const myTokens = tokenizer(preProcessedInput) // Convert our input into individual tokens
const parsedTree = parser(myTokens) // Convert these tokens into a syntax tree
const transformedTree = transformer(parsedTree) // Now put the tree into an easily traversable format for our generator
const output = generator(transformedTree) // Generate the final JS code

fs.writeFileSync(fileNameOut, output)
