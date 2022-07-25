# dvt

[![npm version](https://img.shields.io/npm/v/dvt.svg)](https://npm.im/dvt)

A browser console tool for inspecting, wrangling, and manipulating DOM and HTML in command line / terminal.


## Install

```sh
npm install -g dvt
```

## Examples

### Get title of HTML page

```console
$ echo '<html>
<head>
<meta charset="utf-8">
<title>hello world</title>
</head>
<body></body>
</html>' | dvt 'document.title'

hello world
```

### Get html for meta tags with property

```console
$ curl -s https://developer.mozilla.org/en-US/ |
   dvt '$$("meta[property]").map(e=>e.outerHTML).join("\n")'

<meta property="og:url" content="https://developer.mozilla.org">
<meta property="og:title" content="MDN Web Docs">
<meta property="og:description" content="The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.">
<meta property="og:locale" content="en-US">
<meta property="og:image" content="https://developer.mozilla.org/mdn-social-share.cd6c4a5a.png">
<meta property="twitter:card" content="summary_large_image">
```

### Extract code blocks from multiple html files

This example uses openssl

```console
$ ls

asn1parse.html  enc.html      pkcs8.html      sess_id.html
ca.html         engine.html   pkey.html       smime.html
CA.pl.html      errstr.html   pkeyparam.html  speed.html
ciphers.html    gendsa.html   pkeyutl.html    spkac.html
cms.html        genpkey.html  prime.html      srp.html
crl.html        genrsa.html   rand.html       storeutl.html
crl2pkcs7.html  list.html     rehash.html     ts.html
dgst.html       nseq.html     req.html        tsget.html
dhparam.html    ocsp.html     rsa.html        verify.html

$ cat *.html | dvt '$$("pre")
  .map(e=>[`# ${e.previousElementSibling.textContent}`,e.textContent]
  .filter(f=>f.trim().length>0).join("\n"))
  .flat(2).join("\n\n")'
```

Output:
```
[...]
# Convert a private key to PKCS#8 format using default parameters (AES with 256 bit key and hmacWithSHA256):
 openssl pkcs8 -in key.pem -topk8 -out enckey.pem

# Convert a private key to PKCS#8 unencrypted format:
 openssl pkcs8 -in key.pem -topk8 -nocrypt -out enckey.pem

# Convert a private key to PKCS#5 v2.0 format using triple DES:
 openssl pkcs8 -in key.pem -topk8 -v2 des3 -out enckey.pem

# Convert a private key to PKCS#5 v2.0 format using AES with 256 bits in CBC mode and hmacWithSHA512 PRF:
 openssl pkcs8 -in key.pem -topk8 -v2 aes-256-cbc -v2prf hmacWithSHA512 -out enckey.pem

# Convert a private key to PKCS#8 using a PKCS#5 1.5 compatible algorithm (DES):
 openssl pkcs8 -in key.pem -topk8 -v1 PBE-MD5-DES -out enckey.pem

# Convert a private key to PKCS#8 using a PKCS#12 compatible algorithm (3DES):
 openssl pkcs8 -in key.pem -topk8 -out enckey.pem -v1 PBE-SHA1-3DES

# Read a DER unencrypted PKCS#8 format private key:
 openssl pkcs8 -inform DER -nocrypt -in key.der -out key.pem
...
```

