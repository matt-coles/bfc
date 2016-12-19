(include str maths)
(def fizzbuzz
  (assign i 1)
  (repeat $1
    (assign result "")
    (if (eq (maths::modulo i 3) 0) (assign result (str::concat result "Fizz")))
    (if (eq (maths::modulo i 5) 0) (assign result (str::concat result "Buzz")))
    (if (eq result "") (assign result i))
    (log result)
    (assign i (maths::add i 1))
  )
1)

(log {0})

(if (eq {1} "")
  (fizzbuzz 25) | (fizzbuzz {1}))
