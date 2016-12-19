# big-friendly-compiler

A basic compiler based off of @thejameskyle's super-tiny-compiler, compiles a simple LISP-esque syntax into runnable JS.

Currently supports quite a few builtins, which you can mostly see in the examples for now, documentation is in the works if you're interested. Hopefully most of these are self-explanatory from `example.mc` and `fizzbuzz.mc`. A `;` denotes that the rest of the line (until the compiler sees `\n`) as a comment and 
means that it will not be compiled.

Arguments for a function do not need to be specified in the function definition, however it is convention - because that is what I do - to put the function arity as the final statement in any function as a number literal as this is not evaluated as any meaningful code. To then access these function arguments from within the function one can simple use `$n` where n is a number that refers to which function argument you would like to access. If you wish to access arguments to the original program, BFC provides an argv literal format, which is `{n}` again where n is a number which refers to which argument you want to access.

In addition to the regular include, there is a preprocessing directive called `` `source <filename> `` which can be used 
to just directly insert the contents of `<filename>` into the file. -Instead of wasting the compilers energy checking for circular sources, you have two options, to not be so stupid or wait for the call stack to overflow.- Yay now the compiler protects you against circular sources, or sourcing the same file more than once by skipping these when it encounters them, this means that order is now important. Although it always was.

The compiler runs like `node compiler.js file.mc` where `file.mc` is the file you wish to compile, and this will produce a
`file.mc.js` which requires the `libjs` directory to be present in the same directory when running for now at least.

Functions and variables are in different scopes, so variables can have the same names as functions - even builtins -
thus making `(assign assign 5)` a totally okay thing to do. However note that builtins and defined functions are in the same scope no matter what and attempting to define a function with the same name as a builtin will not work properly.

Note that this compiler is not only totally useless, but also horrendously inefficient. Either way it's a fun exercise :)
