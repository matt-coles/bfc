(include str)
(def fizzbuzz
  (assign i 1)
  (repeat $1
    (assign result "")
    (if (eq (modulo i 3) 0) (assign result (str::concat result "Fizz")))
    (if (eq (modulo i 5) 0) (assign result (str::concat result "Buzz")))
    (if (eq result "") (assign result i))
    (log result)
    (assign i (add i 1))
  )
1)

(fizzbuzz 100)
