(def fizzbuzz
  (assign i 1)
  (repeat $1
    (if (eq (modulo i 3) 0) (if (eq (modulo i 5) 0) (log "FizzBuzz") | (log "Fizz")))
    (if (eq (modulo i 5) 0) (log "Buzz") | (log i))
    (assign i (add i 1))
  )
)

(fizzbuzz 100)
