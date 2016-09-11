# babys-first-compiler

A basic compiler based off of @thejameskyle's super-tiny-compiler, compiles a simple LISP-esque syntax into runnable JS.

Currently supports a few built-ins, `add`, `subtract`, `assign`, `def` and `log`. Hopefully these are self-explanatory, or at least 
they should be from `example.mc`. A `;` denotes that the rest of the line (until the compiler sees `\n`) as a comment and 
means that it will not be compiled.

In addition to the regular include(coming soon), there is also a preprocessing directive called `` `source <filename> `` which can be used 
to just directly insert the contents of `<filename>` into the file. Instead of wasting the compilers energy checking for circular
sources, you have two options, to not be so stupid or wait for the call stack to overflow.

The compiler runs like `node compiler.js file.mc` where `file.mc` is the file you wish to compile, and this will produce a
`file.mc.js` which requires the `lib` to be present in the same directory when running for now at least.

Functions and variables are in different scopes, so variables can have the same names as functions - even builtins,
thus making `(assign assign 5)` a totally okay thing to do.

Note that this compiler is not only totally useless, but also horrendously inefficient. Either way it's a fun exercise :)
