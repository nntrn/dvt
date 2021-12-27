const jsdom = require('jsdom')
const { JSDOM } = jsdom

function reduce(html, raw) {
  const code = raw
    .replace(/this/g, 'document')
    .replace(/\$\$\(["']([^\)"']+)["']\)/, 'Array.from(document.querySelectorAll(\'$1\'))')
    .replace(/\$\(["']([^\)"']+)["']\)/, 'document.querySelector(\'$1\')')

  var document = (html.window && html.window.document) || html

  if(typeof html === 'string') {
    let dom = new JSDOM(html)
    document = dom.window.document
  }

  if('.' === code) {
    return document
  }

  if(/^(\.\w*)+\[]/.test(code)) {
    function fold(s) {
      if(s.length === 1) {
        return 'x => x' + s[0]
      }
      let obj = s.shift()
      obj = obj === '.' ? 'x' : 'x' + obj
      return `x => Object.values(${obj}).flatMap(${fold(s)})`
    }
    code = fold(code.split('[]'))
  }

  if(/^\.\[/.test(code)) {
    return eval(`function fn() {
      return this${code.substring(1)}
    }; fn`).call(document)
  }

  if(/^\./.test(code)) {
    return eval(`function fn() {
      return this${code}
    }; fn`).call(document)
  }

  var fn = eval(`function fn() {
    return ${code}
  }; fn`).call(document)

  if(typeof fn === 'function') {
    return fn(document)
  }
  return fn
}

module.exports = reduce

