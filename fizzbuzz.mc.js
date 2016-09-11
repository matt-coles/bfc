var _ = require("./lib/stdlib.js")(this)
var _str = require("./lib/str.js")(this);
_.def(_.ref('fizzbuzz'), function() { 
_.assign(_.ref('i'), {value: 1});
_.repeat(arguments[0], function() { 
_.assign(_.ref('result'), { value: '' });
_.if(_.eq(_.modulo(_.ref('i'), {value: 3}), {value: 0}), function() { 
_.assign(_.ref('result'), _str.concat(_.ref('result'), { value: 'Fizz' }));
});
_.if(_.eq(_.modulo(_.ref('i'), {value: 5}), {value: 0}), function() { 
_.assign(_.ref('result'), _str.concat(_.ref('result'), { value: 'Buzz' }));
});
_.if(_.eq(_.ref('result'), { value: '' }), function() { 
_.assign(_.ref('result'), _.ref('i'));
});
_.log(_.ref('result'));
_.assign(_.ref('i'), _.add(_.ref('i'), {value: 1}));
});
});
_.fizzbuzz({value: 100});