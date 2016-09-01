# babys-first-compiler

A basic compiler based off of @thejameskyle's super-tiny-compiler, compiles a simple LISP-esque syntax into runnable JS.

Currently supports a few built-ins, `add`, `subtract`, `assign` and `log`. Hopefully these are self-explanatory, or at least 
they should be from `example.mc`.

The compiler runs like `node compiler.js file.mc` where `file.mc` is the file you wish to compile, and this will produce an
`output.js` which requires `stdlib.js` to be in the same directory when running for now at least.
