; This is a test program
(include str)
(assign twelve 12) ; This assigns the variable twelve, to the number literal 12
(assign myvar (add twelve (subtract 6 2))) ; This assigns the variable myvar, to the result of adding the variable twelve to the result of subtracting 2 from 6
(log myvar) ; This logs the value of myvar
(log 6) ; This logs the number literal 6
(assign twelve myvar) ; This reassigns the variable twelve to the value of the variable myvar
(log twelve) ; This logs the new value of the variable twelve
; An example function definition
(def myF ; Anywhere is a valid position for a comment!
  (log 0) 
  (log twelve) 
  (log 6) 
  (log 6) 
  (assign scopelol (add twelve 5)) 
  (log scopelol)
)
(def argTest (log $1) (log $2)) ; Functions take an unlimited number of arguments that can be referred to by $n
(myF) ; Calling an argument-less function
(log 0)
(log 0)
(log 0)
(log 0)
(log 0)
(argTest 43 scopelol) ; Custom functions with arguments are called like any other
(log "We got a string!")
(argTest "You can call functions with strings!" "Yay!")
(log "It supports multiline stri
ngs without stupid escape 

characters")
(repeat 5 (log 10))
(log scopelol)
(repeat scopelol (log 10))
(if (eq 2 scopelol) (log "2 == scopelol") | (log "2 != scopelol"))
(log (str::concat "Hello " "World!"))
