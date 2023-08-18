<div align="center">
<h1>dvt</h1>
<a href="https://github.com/nntrn/dvt">
<img width=80 src="assets/icon.svg">
</a>
<br><br>

[![npm version](https://img.shields.io/npm/v/dvt.svg)](https://npm.im/dvt)

A browser console tool for inspecting, wrangling, and manipulating DOM and HTML in command line / terminal.

</div>

## Install

```sh
npm install -g dvt
```

## Examples

```html
<div>
  <p>lorem</p>
  <ul>
    <li id="one">ipsum</li>
    <li id="one">dolor</li>
    <li id="one">sit</li>
  </ul>
  <span>annie</span>
</div>
```

Select what you want

```console
$ cat example.html | dvt '$$("li").map(e=>e.textContent)'
ipsum
dolor
sit
```

Remove what you don't

```console
$ cat example.html | dvt '$$("li").forEach(e=>e.remove())'
<div>
  <p>lorem</p>
  <ul>
  </ul>
  <span>annie</span>
</div>
```
