const jsdom = require('jsdom')
const { JSDOM } = jsdom

const emptyHtml = '<html><head></head><body></body></html>'

class DevTools {
  constructor(htmlString = emptyHtml) {
    this.__htmlString__ = function () {
      return htmlString
    }
    this.dom = new JSDOM(`<wrapper id="dvt">${htmlString}</wrapper>`)
    this.index = 0
  }

  get html() {
    return this.__htmlString__()
  }

  getDom() {
    return this.dom
  }

  getDocument() {
    return this.getDom().window.document
  }

  execute(raw) {
    const document = this.getDocument()

    const code = raw
      .replace(/this\./g, 'document.')
      .replace(/\$\$\(["']([^\)]+)["']\)/g, "Array.from(document.querySelectorAll('$1'))")
      .replace(/\$\(["']([^\)]+)["']\)/g, "document.querySelector('$1')")

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

    return fn || document.documentElement.querySelector('wrapper#dvt').innerHTML
  }
}

module.exports = DevTools
