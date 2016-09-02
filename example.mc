# This is a test program
(assign twelve 12) # This assigns the variable twelve, to the number literal 12
(assign myvar (add twelve (subtract 6 2))) # This assigns the variable myvar, to the result of adding the variable twelve to the result of subtracting 2 from 6
(log myvar) # This logs the value of myvar
(log 6) # This logs the number literal 6
(assign twelve myvar) # This reassigns the variable twelve to the value of the variable myvar
(log twelve) # This logs the new value of the variable twelve
