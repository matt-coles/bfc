(include str maths)

;
; def: fizzbuzz(1)
;
; Takes an argument and prints the numbers up to and including the argument
; replacing numbers that are divisible by 3, with Fizz, numbers
; divisible by 5 with Buzz, and numbers that are divisible by both,
; with FizzBuzz
;
(def fizzbuzz
  (assign i 1)
  (repeat $1
    (assign result "")
    (if (eq (maths::modulo i 3) 0) (assign result "Fizz"))
    (if (eq (maths::modulo i 5) 0) (assign result (str::concat result "Buzz")))
    (if (eq result "") (assign result i))
    (log result)
    (assign i (maths::add i 1))
  )
1)

(if (eq {1} "")
  (fizzbuzz 25) | (fizzbuzz {1}))
