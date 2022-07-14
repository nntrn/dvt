#!/usr/bin/env node

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const args = process.argv.slice(2)

function reduce(html, raw) {
  const code = raw
    .replace(/this/g, 'document')
    .replace(/\$\$\(["']([^\)"']+)["']\)/,
      'Array.from(document.querySelectorAll(\'$1\'))')
    .replace(/\$\(["']([^\)"']+)["']\)/,
      'document.querySelector(\'$1\')')

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

// copied from eslint
function readStdin() {
  return new Promise((resolve, reject) => {
    let content = ''
    let chunk = ''
    process.stdin.setEncoding('utf8').on('readable', () => {
      while((chunk = process.stdin.read()) !== null) { content += chunk } })
      .on('end', () => resolve(content))
      .on('error', reject)
  })
}

function print(input) {
  const lines = [input].flat(2).map(e => e.split(/\r?\n/)).flat(2)
  for(let line of lines) {
    process.stdout.write(`${line}\n`)
  }
  return lines.join
}

void async function main() {
  const htmlCode = await readStdin()
  // Temporary solution to bypass error from parsing CSS @import
  let dom = new JSDOM(htmlCode.replace(/@import/g, '&40;import'))
  for(let i of args) {
    print(reduce(dom, i))
  }
}()
