# dvt

A command line tool for working with DOM using JavaScript

Inspired by [fx](https://github.com/antonmedv/fx)

## Install

```sh
npm install -g dvt
```

## Usage

### Get title of HTML page

```sh
$ curl -s https://gist.github.com/nntrn | dvt 'this.title'
nntrn’s gists · GitHub
```

### Query select all h3 elements and return textContent

```sh
$ curl -s 'https://docs.github.com/en' | dvt '$$("h3").map(e=>e.textContent)'
Get started
Collaborative coding
CI/CD and DevOps
Security
Client apps
Project management
Developers
Enterprise and Teams
Community
Getting started
Popular
```
