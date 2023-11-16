(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.Y.I === region.aj.I)
	{
		return 'on line ' + region.Y.I;
	}
	return 'on lines ' + region.Y.I + ' through ' + region.aj.I;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bo,
		impl.bF,
		impl.bB,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		u: func(record.u),
		Z: record.Z,
		T: record.T
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.u;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.Z;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.T) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bo,
		impl.bF,
		impl.bB,
		function(sendToApp, initialModel) {
			var view = impl.bG;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bo,
		impl.bF,
		impl.bB,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.W && impl.W(sendToApp)
			var view = impl.bG;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bd);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bC) && (_VirtualDom_doc.title = title = doc.bC);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bv;
	var onUrlRequest = impl.bw;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		W: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aI === next.aI
							&& curr.as === next.as
							&& curr.aE.a === next.aE.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bo: function(flags)
		{
			return A3(impl.bo, flags, _Browser_getUrl(), key);
		},
		bG: impl.bG,
		bF: impl.bF,
		bB: impl.bB
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bl: 'hidden', be: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bl: 'mozHidden', be: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bl: 'msHidden', be: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bl: 'webkitHidden', be: 'webkitvisibilitychange' }
		: { bl: 'hidden', be: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aO: _Browser_getScene(),
		a5: {
			a7: _Browser_window.pageXOffset,
			a8: _Browser_window.pageYOffset,
			a6: _Browser_doc.documentElement.clientWidth,
			aq: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		a6: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aq: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aO: {
				a6: node.scrollWidth,
				aq: node.scrollHeight
			},
			a5: {
				a7: node.scrollLeft,
				a8: node.scrollTop,
				a6: node.clientWidth,
				aq: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aO: _Browser_getScene(),
			a5: {
				a7: x,
				a8: y,
				a6: _Browser_doc.documentElement.clientWidth,
				aq: _Browser_doc.documentElement.clientHeight
			},
			bj: {
				a7: x + rect.left,
				a8: y + rect.top,
				a6: rect.width,
				aq: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.f) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.h);
		} else {
			var treeLen = builder.f * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.i) : builder.i;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.f);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.h) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.h);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{i: nodeList, f: (len / $elm$core$Array$branchFactor) | 0, h: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {an: fragment, as: host, aB: path, aE: port_, aI: protocol, aJ: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Types$Config = function (deckId) {
	return function (deckTitle) {
		return function (landingPage) {
			return function (initialScript) {
				return function (scriptCanBeSet) {
					return function (groupCanBeSet) {
						return function (groupDisplay) {
							return function (showTooltipsForOtherScript) {
								return function (showDescriptionWithUrNameQuiz) {
									return function (showAudioWithUrNameQuiz) {
										return function (showAudioWithUrnameQuizAnswers) {
											return function (showDescriptionWithLocalNameQuiz) {
												return function (showAudioWithLocalNameQuiz) {
													return function (showDescription) {
														return function (showAudio) {
															return function (trainingModes) {
																return function (sortReviewBy) {
																	return function (pluralSubjectName) {
																		return function (copyrightNotice) {
																			return function (numChoices) {
																				return function (trainModeDisplay) {
																					return function (scriptHeading) {
																						return function (mainPartFontSize) {
																							return function (allSubjects) {
																								return {ba: allSubjects, af: copyrightNotice, ah: deckId, ai: deckTitle, ao: groupCanBeSet, ap: groupDisplay, bp: initialScript, br: landingPage, ay: mainPartFontSize, bu: numChoices, aD: pluralSubjectName, aP: scriptCanBeSet, aQ: scriptHeading, X: showAudio, aS: showAudioWithLocalNameQuiz, aT: showAudioWithUrNameQuiz, aU: showAudioWithUrnameQuizAnswers, aV: showDescription, aW: showDescriptionWithLocalNameQuiz, aX: showDescriptionWithUrNameQuiz, aY: showTooltipsForOtherScript, bz: sortReviewBy, bD: trainModeDisplay, a3: trainingModes};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Types$Description = 3;
var $author$project$Types$Latin = 0;
var $author$project$Types$LatinName = 0;
var $author$project$Types$LocalName = 2;
var $author$project$Types$Review = 0;
var $author$project$Types$Subject = F8(
	function (subjectId, imageUrl, audioUrl, unicode, latin, localNames, description, group) {
		return {bc: audioUrl, bh: description, H: group, bm: imageUrl, bs: latin, Q: localNames, a_: subjectId, bE: unicode};
	});
var $author$project$Types$SubjectId = 2;
var $author$project$Types$Unicode = 1;
var $author$project$Types$UnicodeName = 1;
var $author$project$Types$Urname = 1;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$fail = _Json_fail;
var $mgold$elm_nonempty_list$List$Nonempty$Nonempty = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $mgold$elm_nonempty_list$List$Nonempty$fromList = function (ys) {
	if (ys.b) {
		var x = ys.a;
		var xs = ys.b;
		return $elm$core$Maybe$Just(
			A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $mgold$elm_nonempty_list$List$Nonempty$singleton = function (x) {
	return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, _List_Nil);
};
var $author$project$Types$invalidSubject = A8(
	$author$project$Types$Subject,
	-1,
	$elm$core$Maybe$Nothing,
	$elm$core$Maybe$Nothing,
	'invalid',
	'invalid',
	$mgold$elm_nonempty_list$List$Nonempty$singleton('invalid'),
	'invalid',
	$elm$core$Maybe$Nothing);
var $author$project$Types$invalidSubjectList = A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, $author$project$Types$invalidSubject, _List_Nil);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $jjant$unwrap$Unwrap$boom1 = function (_v1) {
	return $jjant$unwrap$Unwrap$boom2(0);
};
var $jjant$unwrap$Unwrap$boom2 = function (_v0) {
	return $jjant$unwrap$Unwrap$boom1(0);
};
var $jjant$unwrap$Unwrap$maybe = function (ma) {
	if (!ma.$) {
		var a = ma.a;
		return a;
	} else {
		return $jjant$unwrap$Unwrap$boom1(0);
	}
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Config$configDecoder = function () {
	var trainModeDecoder = A2(
		$elm$json$Json$Decode$map,
		function (s) {
			switch (s) {
				case 'Review':
					return 0;
				case 'Urname':
					return 1;
				case 'LocalName':
					return 2;
				case 'Description':
					return 3;
				default:
					return 0;
			}
		},
		$elm$json$Json$Decode$string);
	var subjectFieldDecoder = A2(
		$elm$json$Json$Decode$map,
		function (s) {
			return $jjant$unwrap$Unwrap$maybe(
				function () {
					switch (s) {
						case 'LatinName':
							return $elm$core$Maybe$Just(0);
						case 'UnicodeName':
							return $elm$core$Maybe$Just(1);
						case 'SubjectId':
							return $elm$core$Maybe$Just(2);
						default:
							return $elm$core$Maybe$Nothing;
					}
				}());
		},
		$elm$json$Json$Decode$string);
	var subjectDecoder = A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'group',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		$elm$core$Maybe$Nothing,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'description',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'localNames',
				A2(
					$elm$json$Json$Decode$andThen,
					function (lst) {
						var _v1 = $mgold$elm_nonempty_list$List$Nonempty$fromList(lst);
						if (!_v1.$) {
							var ne = _v1.a;
							return $elm$json$Json$Decode$succeed(ne);
						} else {
							return $elm$json$Json$Decode$fail('Requires at least one localName');
						}
					},
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'latin',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'unicode',
						$elm$json$Json$Decode$string,
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'audioUrl',
							$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
							$elm$core$Maybe$Nothing,
							A4(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
								'imageUrl',
								$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
								$elm$core$Maybe$Nothing,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'subjectId',
									$elm$json$Json$Decode$int,
									$elm$json$Json$Decode$succeed($author$project$Types$Subject)))))))));
	var scriptDecoder = A2(
		$elm$json$Json$Decode$map,
		function (s) {
			switch (s) {
				case 'Latin':
					return 0;
				case 'Unicode':
					return 1;
				default:
					return 0;
			}
		},
		$elm$json$Json$Decode$string);
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'allSubjects',
		A2(
			$elm$json$Json$Decode$map,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Maybe$withDefault($author$project$Types$invalidSubjectList),
				$mgold$elm_nonempty_list$List$Nonempty$fromList),
			$elm$json$Json$Decode$list(subjectDecoder)),
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'mainPartFontSize',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			$elm$core$Maybe$Nothing,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'scriptHeading',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'trainModeDisplay',
					$elm$json$Json$Decode$dict($elm$json$Json$Decode$string),
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'numChoices',
						$elm$json$Json$Decode$int,
						4,
						A4(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'copyrightNotice',
							$elm$json$Json$Decode$string,
							'',
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'pluralSubjectName',
								$elm$json$Json$Decode$string,
								A4(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
									'sortReviewBy',
									subjectFieldDecoder,
									2,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'trainingModes',
										$elm$json$Json$Decode$list(trainModeDecoder),
										A4(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
											'showAudio',
											$elm$json$Json$Decode$bool,
											true,
											A4(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
												'showDescription',
												$elm$json$Json$Decode$bool,
												true,
												A4(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
													'showAudioWithLocalNameQuiz',
													$elm$json$Json$Decode$bool,
													true,
													A4(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
														'showDescriptionWithLocalNameQuiz',
														$elm$json$Json$Decode$bool,
														true,
														A4(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
															'showAudioWithUrnameQuizAnswers',
															$elm$json$Json$Decode$bool,
															true,
															A4(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																'showAudioWithUrNameQuiz',
																$elm$json$Json$Decode$bool,
																true,
																A4(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																	'showDescriptionWithUrNameQuiz',
																	$elm$json$Json$Decode$bool,
																	true,
																	A4(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																		'showTooltipsForOtherScript',
																		$elm$json$Json$Decode$bool,
																		true,
																		A4(
																			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																			'groupDisplay',
																			$elm$json$Json$Decode$string,
																			'',
																			A4(
																				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																				'groupCanBeSet',
																				$elm$json$Json$Decode$bool,
																				false,
																				A4(
																					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																					'scriptCanBeSet',
																					$elm$json$Json$Decode$bool,
																					false,
																					A4(
																						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																						'initialScript',
																						scriptDecoder,
																						0,
																						A4(
																							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
																							'landingPage',
																							$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
																							$elm$core$Maybe$Nothing,
																							A3(
																								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																								'deckTitle',
																								$elm$json$Json$Decode$string,
																								A3(
																									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																									'deckId',
																									$elm$json$Json$Decode$string,
																									$elm$json$Json$Decode$succeed($author$project$Types$Config)))))))))))))))))))))))));
}();
var $author$project$Types$defaultConfig = {ba: $author$project$Types$invalidSubjectList, af: '', ah: 'invalid deck', ai: 'invalid deck', ao: false, ap: '', bp: 0, br: $elm$core$Maybe$Nothing, ay: $elm$core$Maybe$Nothing, bu: 0, aD: '', aP: true, aQ: '', X: true, aS: true, aT: true, aU: true, aV: true, aW: true, aX: true, aY: true, bz: 2, bD: $elm$core$Dict$empty, a3: _List_Nil};
var $author$project$Types$MultipleChoice = 0;
var $author$project$Types$emptyCard = {bf: _List_Nil, bA: $author$project$Types$invalidSubject};
var $author$project$Types$invalidCards = A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, $author$project$Types$emptyCard, _List_Nil);
var $author$project$Types$defaultModel = {
	B: $author$project$Types$defaultConfig,
	at: true,
	J: _List_Nil,
	r: $author$project$Types$invalidCards,
	U: 0,
	e: {H: $elm$core$Maybe$Nothing, O: 0, V: 0, E: 0},
	X: true,
	a1: 0,
	a4: $elm$core$Maybe$Nothing,
	_: ''
};
var $author$project$Model$initialModel = function (cfg) {
	var mdl = $author$project$Types$defaultModel;
	return _Utils_update(
		mdl,
		{B: cfg});
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Model$initWithModel = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $author$project$Model$processSelectedDeck = function (model) {
	var sttgs = model.e;
	var newModel = _Utils_update(
		model,
		{
			e: _Utils_update(
				sttgs,
				{V: model.B.bp})
		});
	return $author$project$Model$initWithModel(newModel);
};
var $author$project$Main$init = function (configValue) {
	var mdl = $author$project$Model$initialModel(
		function () {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Config$configDecoder, configValue);
			if (!_v0.$) {
				var cfg = _v0.a;
				return cfg;
			} else {
				return $author$project$Types$defaultConfig;
			}
		}());
	return $author$project$Model$processSelectedDeck(mdl);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Types$ControlKeyDown = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$keyDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Types$ControlKeyDown,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aC: pids, a$: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {ak: event, ax: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aC,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.ax;
		var event = _v0.ak;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.a$);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$Main$keyDecoder)
			]));
};
var $author$project$Types$Next = {$: 0};
var $author$project$Types$Previous = {$: 1};
var $author$project$Types$Settings = F4(
	function (trainMode, script, group, quizType) {
		return {H: group, O: quizType, V: script, E: trainMode};
	});
var $author$project$Types$ShowAudio = {$: 2};
var $author$project$Types$Shuffle = function (a) {
	return {$: 11, a: a};
};
var $author$project$Types$Start = {$: 6};
var $author$project$Types$SubmitAnswer = {$: 9};
var $author$project$Types$TextField = 1;
var $mgold$elm_nonempty_list$List$Nonempty$cons = F2(
	function (y, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return A2(
			$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
			y,
			A2($elm$core$List$cons, x, xs));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $mgold$elm_nonempty_list$List$Nonempty$filter = F3(
	function (p, d, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		if (p(x)) {
			return A2(
				$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
				x,
				A2($elm$core$List$filter, p, xs));
		} else {
			var _v1 = A2($elm$core$List$filter, p, xs);
			if (!_v1.b) {
				return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, d, _List_Nil);
			} else {
				var y = _v1.a;
				var ys = _v1.b;
				return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, y, ys);
			}
		}
	});
var $author$project$Types$NoOp = {$: 17};
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Main$focusElement = function (htmlId) {
	return A2(
		$elm$core$Task$attempt,
		function (_v0) {
			return $author$project$Types$NoOp;
		},
		$elm$browser$Browser$Dom$focus(htmlId));
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$random$Random$maxInt = 2147483647;
var $elm$random$Random$minInt = -2147483648;
var $elm_community$random_extra$Random$List$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0;
		var genB = _v1;
		var genC = _v2;
		return function (seed0) {
			var _v3 = genA(seed0);
			var a = _v3.a;
			var seed1 = _v3.b;
			var _v4 = genB(seed1);
			var b = _v4.a;
			var seed2 = _v4.b;
			var _v5 = genC(seed2);
			var c = _v5.a;
			var seed3 = _v5.b;
			return _Utils_Tuple2(
				A3(func, a, b, c),
				seed3);
		};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = function (seed0) {
	var makeIndependentSeed = F3(
		function (state, b, c) {
			return $elm$random$Random$next(
				A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
		});
	var gen = A2($elm$random$Random$int, 0, 4294967295);
	return A2(
		$elm$random$Random$step,
		A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
		seed0);
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$List$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$List$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						list).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$random_extra$Random$List$get = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm_community$random_extra$Random$List$choose = function (list) {
	if ($elm$core$List$isEmpty(list)) {
		return $elm$random$Random$constant(
			_Utils_Tuple2($elm$core$Maybe$Nothing, list));
	} else {
		var lastIndex = $elm$core$List$length(list) - 1;
		var gen = A2($elm$random$Random$int, 0, lastIndex);
		var front = function (i) {
			return A2($elm$core$List$take, i, list);
		};
		var back = function (i) {
			return A2($elm$core$List$drop, i + 1, list);
		};
		return A2(
			$elm$random$Random$map,
			function (index) {
				return _Utils_Tuple2(
					A2($elm_community$random_extra$Random$List$get, index, list),
					A2(
						$elm$core$List$append,
						front(index),
						back(index)));
			},
			gen);
	}
};
var $elm$random$Random$lazy = function (callback) {
	return function (seed) {
		var _v0 = callback(0);
		var gen = _v0;
		return gen(seed);
	};
};
var $elm_community$random_extra$Random$List$choices = F2(
	function (count, list) {
		return (count < 1) ? $elm$random$Random$constant(
			_Utils_Tuple2(_List_Nil, list)) : A2(
			$elm$random$Random$andThen,
			function (_v0) {
				var choice = _v0.a;
				var remaining = _v0.b;
				var genRest = $elm$random$Random$lazy(
					function (_v3) {
						return A2($elm_community$random_extra$Random$List$choices, count - 1, remaining);
					});
				var addToChoices = F2(
					function (elem, _v2) {
						var chosen = _v2.a;
						var unchosen = _v2.b;
						return _Utils_Tuple2(
							A2($elm$core$List$cons, elem, chosen),
							unchosen);
					});
				if (choice.$ === 1) {
					return $elm$random$Random$constant(
						_Utils_Tuple2(_List_Nil, list));
				} else {
					var elem = choice.a;
					return A2(
						$elm$random$Random$map,
						addToChoices(elem),
						genRest);
				}
			},
			$elm_community$random_extra$Random$List$choose(list));
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $mgold$elm_nonempty_list$List$Nonempty$toList = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return A2($elm$core$List$cons, x, xs);
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$uniqueBy = F2(
	function (f, list) {
		return A4($elm_community$list_extra$List$Extra$uniqueHelp, f, _List_Nil, list, _List_Nil);
	});
var $author$project$Card$generateChoices = F3(
	function (numChoices, allSubjects, correctSubject) {
		var wrongSubjects = A2(
			$elm_community$list_extra$List$Extra$uniqueBy,
			function (subj) {
				return subj.Q;
			},
			A2(
				$elm$core$List$filter,
				function (a) {
					return (!_Utils_eq(a.a_, correctSubject.a_)) && (!_Utils_eq(a.Q, correctSubject.Q));
				},
				$mgold$elm_nonempty_list$List$Nonempty$toList(allSubjects)));
		var choicesGenerator = A2(
			$elm$random$Random$map,
			$elm$core$Tuple$first,
			A2($elm_community$random_extra$Random$List$choices, numChoices - 1, wrongSubjects));
		return A2(
			$elm$random$Random$andThen,
			function (correctPos) {
				return A2(
					$elm$random$Random$map,
					function (selected) {
						return _Utils_ap(
							A2($elm$core$List$take, correctPos, selected),
							A2(
								$elm$core$List$cons,
								correctSubject,
								A2($elm$core$List$drop, correctPos, selected)));
					},
					choicesGenerator);
			},
			A2($elm$random$Random$int, 0, numChoices - 1));
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $elm_community$random_extra$Random$Extra$sequence = A2(
	$elm$core$List$foldr,
	$elm$random$Random$map2($elm$core$List$cons),
	$elm$random$Random$constant(_List_Nil));
var $elm_community$random_extra$Random$Extra$traverse = function (f) {
	return A2(
		$elm$core$Basics$composeL,
		$elm_community$random_extra$Random$Extra$sequence,
		$elm$core$List$map(f));
};
var $author$project$Card$subjects2CardsGenerator = F2(
	function (numChoices, allSubjects) {
		return $elm_community$random_extra$Random$Extra$traverse(
			function (subj) {
				return A2(
					$elm$random$Random$map,
					function (chs) {
						return {bf: chs, bA: subj};
					},
					A3($author$project$Card$generateChoices, numChoices, allSubjects, subj));
			});
	});
var $author$project$Card$generateDeck = F2(
	function (numChoices, allSubjects) {
		return A3(
			$elm$core$Basics$apL,
			$elm$random$Random$andThen,
			A2($author$project$Card$subjects2CardsGenerator, numChoices, allSubjects),
			$elm_community$random_extra$Random$List$shuffle(
				$mgold$elm_nonempty_list$List$Nonempty$toList(allSubjects)));
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Model$getCorrectAnswers = F2(
	function (_v0, subj) {
		var trainMode = _v0.E;
		var script = _v0.V;
		switch (trainMode) {
			case 0:
				return $mgold$elm_nonempty_list$List$Nonempty$singleton('N/A');
			case 1:
				return (!script) ? $mgold$elm_nonempty_list$List$Nonempty$singleton(subj.bs) : $mgold$elm_nonempty_list$List$Nonempty$singleton(subj.bE);
			case 2:
				return subj.Q;
			default:
				return $mgold$elm_nonempty_list$List$Nonempty$singleton(subj.bh);
		}
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Model$listTraverse = function (f) {
	var listApply = F2(
		function (gs, xs) {
			return A2(
				$elm$core$List$concatMap,
				function (g) {
					return A2(
						$elm$core$List$concatMap,
						function (x) {
							return _List_fromArray(
								[
									g(x)
								]);
						},
						xs);
				},
				gs);
		});
	var listLift2 = F2(
		function (g, x) {
			return listApply(
				A2($elm$core$List$map, g, x));
		});
	var consF = F2(
		function (x, ys) {
			return A3(
				listLift2,
				$elm$core$List$cons,
				f(x),
				ys);
		});
	return A2(
		$elm$core$List$foldr,
		consF,
		_List_fromArray(
			[_List_Nil]));
};
var $miniBill$elm_unicode$Unicode$MarkNonSpacing = 3;
var $miniBill$elm_unicode$Unicode$MarkSpacingCombining = 4;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $miniBill$elm_unicode$Unicode$LetterLowercase = 1;
var $miniBill$elm_unicode$Unicode$LetterModifier = 17;
var $miniBill$elm_unicode$Unicode$LetterOther = 18;
var $miniBill$elm_unicode$Unicode$LetterTitlecase = 2;
var $miniBill$elm_unicode$Unicode$LetterUppercase = 0;
var $miniBill$elm_unicode$Unicode$MarkEnclosing = 5;
var $miniBill$elm_unicode$Unicode$NumberDecimalDigit = 6;
var $miniBill$elm_unicode$Unicode$NumberLetter = 7;
var $miniBill$elm_unicode$Unicode$NumberOther = 8;
var $miniBill$elm_unicode$Unicode$OtherControl = 12;
var $miniBill$elm_unicode$Unicode$OtherFormat = 13;
var $miniBill$elm_unicode$Unicode$OtherPrivateUse = 15;
var $miniBill$elm_unicode$Unicode$OtherSurrogate = 14;
var $miniBill$elm_unicode$Unicode$PunctuationClose = 22;
var $miniBill$elm_unicode$Unicode$PunctuationConnector = 19;
var $miniBill$elm_unicode$Unicode$PunctuationDash = 20;
var $miniBill$elm_unicode$Unicode$PunctuationFinalQuote = 24;
var $miniBill$elm_unicode$Unicode$PunctuationInitialQuote = 23;
var $miniBill$elm_unicode$Unicode$PunctuationOpen = 21;
var $miniBill$elm_unicode$Unicode$PunctuationOther = 25;
var $miniBill$elm_unicode$Unicode$SeparatorLine = 10;
var $miniBill$elm_unicode$Unicode$SeparatorParagraph = 11;
var $miniBill$elm_unicode$Unicode$SeparatorSpace = 9;
var $miniBill$elm_unicode$Unicode$SymbolCurrency = 27;
var $miniBill$elm_unicode$Unicode$SymbolMath = 26;
var $miniBill$elm_unicode$Unicode$SymbolModifier = 28;
var $miniBill$elm_unicode$Unicode$SymbolOther = 29;
var $elm$core$Basics$modBy = _Basics_modBy;
var $miniBill$elm_unicode$Unicode$getCategory = function (c) {
	var code = $elm$core$Char$toCode(c);
	var e = function (hex) {
		return _Utils_eq(hex, code);
	};
	var l = function (hex) {
		return _Utils_cmp(code, hex) < 0;
	};
	var r = F2(
		function (from, to) {
			return (_Utils_cmp(from, code) < 1) && (_Utils_cmp(code, to) < 1);
		});
	return l(256) ? (l(160) ? (l(59) ? (l(41) ? ((code <= 31) ? $elm$core$Maybe$Just(12) : (e(32) ? $elm$core$Maybe$Just(9) : ((A2(r, 33, 35) || A2(r, 37, 39)) ? $elm$core$Maybe$Just(25) : (e(36) ? $elm$core$Maybe$Just(27) : (e(40) ? $elm$core$Maybe$Just(21) : $elm$core$Maybe$Nothing))))) : (e(41) ? $elm$core$Maybe$Just(22) : ((((e(42) || e(44)) || A2(r, 46, 47)) || e(58)) ? $elm$core$Maybe$Just(25) : (e(43) ? $elm$core$Maybe$Just(26) : (e(45) ? $elm$core$Maybe$Just(20) : (A2(r, 48, 57) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(94) ? (((e(59) || A2(r, 63, 64)) || e(92)) ? $elm$core$Maybe$Just(25) : (A2(r, 60, 62) ? $elm$core$Maybe$Just(26) : (A2(r, 65, 90) ? $elm$core$Maybe$Just(0) : (e(91) ? $elm$core$Maybe$Just(21) : (e(93) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing))))) : ((e(94) || e(96)) ? $elm$core$Maybe$Just(28) : (e(95) ? $elm$core$Maybe$Just(19) : (A2(r, 97, 122) ? $elm$core$Maybe$Just(1) : (e(123) ? $elm$core$Maybe$Just(21) : ((e(124) || e(126)) ? $elm$core$Maybe$Just(26) : (e(125) ? $elm$core$Maybe$Just(22) : (A2(r, 127, 159) ? $elm$core$Maybe$Just(12) : $elm$core$Maybe$Nothing))))))))) : (l(177) ? (l(169) ? (e(160) ? $elm$core$Maybe$Just(9) : ((e(161) || e(167)) ? $elm$core$Maybe$Just(25) : (A2(r, 162, 165) ? $elm$core$Maybe$Just(27) : (e(166) ? $elm$core$Maybe$Just(29) : (e(168) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))) : (((e(169) || e(174)) || e(176)) ? $elm$core$Maybe$Just(29) : (e(170) ? $elm$core$Maybe$Just(18) : (e(171) ? $elm$core$Maybe$Just(23) : (e(172) ? $elm$core$Maybe$Just(26) : (e(173) ? $elm$core$Maybe$Just(13) : (e(175) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))))) : (l(186) ? (e(177) ? $elm$core$Maybe$Just(26) : ((A2(r, 178, 179) || e(185)) ? $elm$core$Maybe$Just(8) : ((e(180) || e(184)) ? $elm$core$Maybe$Just(28) : (e(181) ? $elm$core$Maybe$Just(1) : (A2(r, 182, 183) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (e(186) ? $elm$core$Maybe$Just(18) : (e(187) ? $elm$core$Maybe$Just(24) : (A2(r, 188, 190) ? $elm$core$Maybe$Just(8) : (e(191) ? $elm$core$Maybe$Just(25) : ((A2(r, 192, 214) || A2(r, 216, 222)) ? $elm$core$Maybe$Just(0) : ((e(215) || e(247)) ? $elm$core$Maybe$Just(26) : ((A2(r, 223, 246) || A2(r, 248, 255)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))))))) : (l(9311) ? (l(3132) ? (l(1168) ? (l(489) ? (l(357) ? (l(304) ? (l(279) ? (l(266) ? (((((e(256) || e(258)) || e(260)) || e(262)) || e(264)) ? $elm$core$Maybe$Just(0) : (((((e(257) || e(259)) || e(261)) || e(263)) || e(265)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(271) ? (((e(266) || e(268)) || e(270)) ? $elm$core$Maybe$Just(0) : ((e(267) || e(269)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(271) || e(273)) || e(275)) || e(277)) ? $elm$core$Maybe$Just(1) : ((((e(272) || e(274)) || e(276)) || e(278)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(290) ? ((((((e(279) || e(281)) || e(283)) || e(285)) || e(287)) || e(289)) ? $elm$core$Maybe$Just(1) : (((((e(280) || e(282)) || e(284)) || e(286)) || e(288)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(296) ? (((e(290) || e(292)) || e(294)) ? $elm$core$Maybe$Just(0) : (((e(291) || e(293)) || e(295)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(296) || e(298)) || e(300)) || e(302)) ? $elm$core$Maybe$Just(0) : ((((e(297) || e(299)) || e(301)) || e(303)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))) : (l(330) ? (l(316) ? ((((((e(304) || e(306)) || e(308)) || e(310)) || e(313)) || e(315)) ? $elm$core$Maybe$Just(0) : (((((e(305) || e(307)) || e(309)) || A2(r, 311, 312)) || e(314)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(321) ? (((e(316) || e(318)) || e(320)) ? $elm$core$Maybe$Just(1) : ((e(317) || e(319)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(321) || e(323)) || e(325)) || e(327)) ? $elm$core$Maybe$Just(0) : ((((e(322) || e(324)) || e(326)) || A2(r, 328, 329)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(342) ? ((((((e(330) || e(332)) || e(334)) || e(336)) || e(338)) || e(340)) ? $elm$core$Maybe$Just(0) : ((((((e(331) || e(333)) || e(335)) || e(337)) || e(339)) || e(341)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(348) ? (((e(342) || e(344)) || e(346)) ? $elm$core$Maybe$Just(0) : (((e(343) || e(345)) || e(347)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((((e(348) || e(350)) || e(352)) || e(354)) || e(356)) ? $elm$core$Maybe$Just(0) : ((((e(349) || e(351)) || e(353)) || e(355)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))) : (l(425) ? (l(381) ? (l(367) ? (((((e(357) || e(359)) || e(361)) || e(363)) || e(365)) ? $elm$core$Maybe$Just(1) : (((((e(358) || e(360)) || e(362)) || e(364)) || e(366)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(372) ? (((e(367) || e(369)) || e(371)) ? $elm$core$Maybe$Just(1) : ((e(368) || e(370)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(372) || e(374)) || A2(r, 376, 377)) || e(379)) ? $elm$core$Maybe$Just(0) : ((((e(373) || e(375)) || e(378)) || e(380)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(404) ? (l(389) ? (((e(381) || A2(r, 385, 386)) || e(388)) ? $elm$core$Maybe$Just(0) : ((A2(r, 382, 384) || e(387)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(389) || e(392)) || A2(r, 396, 397)) || e(402)) ? $elm$core$Maybe$Just(1) : ((((A2(r, 390, 391) || A2(r, 393, 395)) || A2(r, 398, 401)) || e(403)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : (l(416) ? ((((e(404) || A2(r, 406, 408)) || A2(r, 412, 413)) || e(415)) ? $elm$core$Maybe$Just(0) : (((e(405) || A2(r, 409, 411)) || e(414)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(416) || e(418)) || e(420)) || A2(r, 422, 423)) ? $elm$core$Maybe$Just(0) : ((((e(417) || e(419)) || e(421)) || e(424)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))) : (l(461) ? (l(442) ? ((((((e(425) || e(428)) || A2(r, 430, 431)) || A2(r, 433, 435)) || e(437)) || A2(r, 439, 440)) ? $elm$core$Maybe$Just(0) : ((((((A2(r, 426, 427) || e(429)) || e(432)) || e(436)) || e(438)) || e(441)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(453) ? ((e(442) || A2(r, 445, 447)) ? $elm$core$Maybe$Just(1) : ((e(443) || A2(r, 448, 451)) ? $elm$core$Maybe$Just(18) : ((e(444) || e(452)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : (((e(453) || e(456)) || e(459)) ? $elm$core$Maybe$Just(2) : (((e(454) || e(457)) || e(460)) ? $elm$core$Maybe$Just(1) : ((e(455) || e(458)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(473) ? ((((((e(461) || e(463)) || e(465)) || e(467)) || e(469)) || e(471)) ? $elm$core$Maybe$Just(0) : ((((((e(462) || e(464)) || e(466)) || e(468)) || e(470)) || e(472)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(480) ? (((e(473) || e(475)) || e(478)) ? $elm$core$Maybe$Just(0) : (((e(474) || A2(r, 476, 477)) || e(479)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((((e(480) || e(482)) || e(484)) || e(486)) || e(488)) ? $elm$core$Maybe$Just(0) : ((((e(481) || e(483)) || e(485)) || e(487)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))))) : (l(879) ? (l(541) ? (l(515) ? (l(500) ? (((((e(489) || e(491)) || e(493)) || A2(r, 495, 496)) || e(499)) ? $elm$core$Maybe$Just(1) : ((((e(490) || e(492)) || e(494)) || e(497)) ? $elm$core$Maybe$Just(0) : (e(498) ? $elm$core$Maybe$Just(2) : $elm$core$Maybe$Nothing))) : (l(507) ? (((e(500) || A2(r, 502, 504)) || e(506)) ? $elm$core$Maybe$Just(0) : ((e(501) || e(505)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(507) || e(509)) || e(511)) || e(513)) ? $elm$core$Maybe$Just(1) : ((((e(508) || e(510)) || e(512)) || e(514)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(527) ? ((((((e(515) || e(517)) || e(519)) || e(521)) || e(523)) || e(525)) ? $elm$core$Maybe$Just(1) : ((((((e(516) || e(518)) || e(520)) || e(522)) || e(524)) || e(526)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(533) ? (((e(527) || e(529)) || e(531)) ? $elm$core$Maybe$Just(1) : (((e(528) || e(530)) || e(532)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(533) || e(535)) || e(537)) || e(539)) ? $elm$core$Maybe$Just(1) : ((((e(534) || e(536)) || e(538)) || e(540)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(574) ? (l(553) ? ((((((e(541) || e(543)) || e(545)) || e(547)) || e(549)) || e(551)) ? $elm$core$Maybe$Just(1) : ((((((e(542) || e(544)) || e(546)) || e(548)) || e(550)) || e(552)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(559) ? (((e(553) || e(555)) || e(557)) ? $elm$core$Maybe$Just(1) : (((e(554) || e(556)) || e(558)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(559) || e(561)) || A2(r, 563, 569)) || e(572)) ? $elm$core$Maybe$Just(1) : ((((e(560) || e(562)) || A2(r, 570, 571)) || e(573)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(590) ? ((((((e(574) || e(577)) || A2(r, 579, 582)) || e(584)) || e(586)) || e(588)) ? $elm$core$Maybe$Just(0) : ((((((A2(r, 575, 576) || e(578)) || e(583)) || e(585)) || e(587)) || e(589)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(721) ? (e(590) ? $elm$core$Maybe$Just(0) : ((A2(r, 591, 659) || A2(r, 661, 687)) ? $elm$core$Maybe$Just(1) : (e(660) ? $elm$core$Maybe$Just(18) : ((A2(r, 688, 705) || A2(r, 710, 720)) ? $elm$core$Maybe$Just(17) : (A2(r, 706, 709) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))) : ((((e(721) || A2(r, 736, 740)) || e(748)) || e(750)) ? $elm$core$Maybe$Just(17) : ((((A2(r, 722, 735) || A2(r, 741, 747)) || e(749)) || A2(r, 751, 767)) ? $elm$core$Maybe$Just(28) : (A2(r, 768, 878) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))))) : (l(1011) ? (l(977) ? (l(894) ? (e(879) ? $elm$core$Maybe$Just(3) : (((e(880) || e(882)) || e(886)) ? $elm$core$Maybe$Just(0) : ((((e(881) || e(883)) || e(887)) || A2(r, 891, 893)) ? $elm$core$Maybe$Just(1) : ((e(884) || e(890)) ? $elm$core$Maybe$Just(17) : (e(885) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))) : (l(909) ? ((e(894) || e(903)) ? $elm$core$Maybe$Just(25) : ((((e(895) || e(902)) || A2(r, 904, 906)) || e(908)) ? $elm$core$Maybe$Just(0) : (A2(r, 900, 901) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))) : ((((A2(r, 910, 911) || A2(r, 913, 929)) || A2(r, 931, 939)) || e(975)) ? $elm$core$Maybe$Just(0) : (((e(912) || A2(r, 940, 974)) || e(976)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(993) ? ((((((e(977) || A2(r, 981, 983)) || e(985)) || e(987)) || e(989)) || e(991)) ? $elm$core$Maybe$Just(1) : ((((((A2(r, 978, 980) || e(984)) || e(986)) || e(988)) || e(990)) || e(992)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(999) ? (((e(993) || e(995)) || e(997)) ? $elm$core$Maybe$Just(1) : (((e(994) || e(996)) || e(998)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(999) || e(1001)) || e(1003)) || e(1005)) || A2(r, 1007, 1010)) ? $elm$core$Maybe$Just(1) : ((((e(1000) || e(1002)) || e(1004)) || e(1006)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(1135) ? (l(1121) ? (((((e(1011) || e(1013)) || e(1016)) || A2(r, 1019, 1020)) || A2(r, 1072, 1119)) ? $elm$core$Maybe$Just(1) : (((((e(1012) || e(1015)) || A2(r, 1017, 1018)) || A2(r, 1021, 1071)) || e(1120)) ? $elm$core$Maybe$Just(0) : (e(1014) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))) : (l(1127) ? (((e(1121) || e(1123)) || e(1125)) ? $elm$core$Maybe$Just(1) : (((e(1122) || e(1124)) || e(1126)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(1127) || e(1129)) || e(1131)) || e(1133)) ? $elm$core$Maybe$Just(1) : ((((e(1128) || e(1130)) || e(1132)) || e(1134)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(1148) ? (l(1140) ? (((e(1135) || e(1137)) || e(1139)) ? $elm$core$Maybe$Just(1) : ((e(1136) || e(1138)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(1140) || e(1142)) || e(1144)) || e(1146)) ? $elm$core$Maybe$Just(0) : ((((e(1141) || e(1143)) || e(1145)) || e(1147)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))) : (l(1154) ? (((e(1148) || e(1150)) || e(1152)) ? $elm$core$Maybe$Just(0) : (((e(1149) || e(1151)) || e(1153)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (e(1154) ? $elm$core$Maybe$Just(29) : (A2(r, 1155, 1159) ? $elm$core$Maybe$Just(3) : (A2(r, 1160, 1161) ? $elm$core$Maybe$Just(5) : (((e(1162) || e(1164)) || e(1166)) ? $elm$core$Maybe$Just(0) : (((e(1163) || e(1165)) || e(1167)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))))))))) : (l(1758) ? (l(1269) ? (l(1217) ? (l(1191) ? (l(1178) ? (((((e(1168) || e(1170)) || e(1172)) || e(1174)) || e(1176)) ? $elm$core$Maybe$Just(0) : (((((e(1169) || e(1171)) || e(1173)) || e(1175)) || e(1177)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(1183) ? (((e(1178) || e(1180)) || e(1182)) ? $elm$core$Maybe$Just(0) : ((e(1179) || e(1181)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(1183) || e(1185)) || e(1187)) || e(1189)) ? $elm$core$Maybe$Just(1) : ((((e(1184) || e(1186)) || e(1188)) || e(1190)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(1203) ? ((((((e(1191) || e(1193)) || e(1195)) || e(1197)) || e(1199)) || e(1201)) ? $elm$core$Maybe$Just(1) : ((((((e(1192) || e(1194)) || e(1196)) || e(1198)) || e(1200)) || e(1202)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(1209) ? (((e(1203) || e(1205)) || e(1207)) ? $elm$core$Maybe$Just(1) : (((e(1204) || e(1206)) || e(1208)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(1209) || e(1211)) || e(1213)) || e(1215)) ? $elm$core$Maybe$Just(1) : ((((e(1210) || e(1212)) || e(1214)) || e(1216)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(1242) ? (l(1228) ? ((((((e(1217) || e(1219)) || e(1221)) || e(1223)) || e(1225)) || e(1227)) ? $elm$core$Maybe$Just(0) : (((((e(1218) || e(1220)) || e(1222)) || e(1224)) || e(1226)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(1234) ? (((e(1228) || A2(r, 1230, 1231)) || e(1233)) ? $elm$core$Maybe$Just(1) : ((e(1229) || e(1232)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(1234) || e(1236)) || e(1238)) || e(1240)) ? $elm$core$Maybe$Just(0) : ((((e(1235) || e(1237)) || e(1239)) || e(1241)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(1254) ? ((((((e(1242) || e(1244)) || e(1246)) || e(1248)) || e(1250)) || e(1252)) ? $elm$core$Maybe$Just(0) : ((((((e(1243) || e(1245)) || e(1247)) || e(1249)) || e(1251)) || e(1253)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(1260) ? (((e(1254) || e(1256)) || e(1258)) ? $elm$core$Maybe$Just(0) : (((e(1255) || e(1257)) || e(1259)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((((e(1260) || e(1262)) || e(1264)) || e(1266)) || e(1268)) ? $elm$core$Maybe$Just(0) : ((((e(1261) || e(1263)) || e(1265)) || e(1267)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))) : (l(1319) ? (l(1293) ? (l(1280) ? ((((((e(1269) || e(1271)) || e(1273)) || e(1275)) || e(1277)) || e(1279)) ? $elm$core$Maybe$Just(1) : (((((e(1270) || e(1272)) || e(1274)) || e(1276)) || e(1278)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(1285) ? (((e(1280) || e(1282)) || e(1284)) ? $elm$core$Maybe$Just(0) : ((e(1281) || e(1283)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(1285) || e(1287)) || e(1289)) || e(1291)) ? $elm$core$Maybe$Just(1) : ((((e(1286) || e(1288)) || e(1290)) || e(1292)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(1305) ? ((((((e(1293) || e(1295)) || e(1297)) || e(1299)) || e(1301)) || e(1303)) ? $elm$core$Maybe$Just(1) : ((((((e(1294) || e(1296)) || e(1298)) || e(1300)) || e(1302)) || e(1304)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(1311) ? (((e(1305) || e(1307)) || e(1309)) ? $elm$core$Maybe$Just(1) : (((e(1306) || e(1308)) || e(1310)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(1311) || e(1313)) || e(1315)) || e(1317)) ? $elm$core$Maybe$Just(1) : ((((e(1312) || e(1314)) || e(1316)) || e(1318)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(1487) ? (l(1416) ? (l(1324) ? (((e(1319) || e(1321)) || e(1323)) ? $elm$core$Maybe$Just(1) : ((e(1320) || e(1322)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((e(1324) || e(1326)) || A2(r, 1329, 1366)) ? $elm$core$Maybe$Just(0) : (((e(1325) || e(1327)) || A2(r, 1376, 1415)) ? $elm$core$Maybe$Just(1) : (e(1369) ? $elm$core$Maybe$Just(17) : (A2(r, 1370, 1375) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (l(1470) ? (e(1416) ? $elm$core$Maybe$Just(1) : (e(1417) ? $elm$core$Maybe$Just(25) : (e(1418) ? $elm$core$Maybe$Just(20) : (A2(r, 1421, 1422) ? $elm$core$Maybe$Just(29) : (e(1423) ? $elm$core$Maybe$Just(27) : (A2(r, 1425, 1469) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))) : (e(1470) ? $elm$core$Maybe$Just(20) : ((((e(1471) || A2(r, 1473, 1474)) || A2(r, 1476, 1477)) || e(1479)) ? $elm$core$Maybe$Just(3) : (((e(1472) || e(1475)) || e(1478)) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (l(1567) ? (l(1546) ? ((A2(r, 1488, 1514) || A2(r, 1519, 1522)) ? $elm$core$Maybe$Just(18) : ((A2(r, 1523, 1524) || e(1545)) ? $elm$core$Maybe$Just(25) : (A2(r, 1536, 1541) ? $elm$core$Maybe$Just(13) : (A2(r, 1542, 1544) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing)))) : ((((e(1546) || A2(r, 1548, 1549)) || e(1563)) || A2(r, 1565, 1566)) ? $elm$core$Maybe$Just(25) : (e(1547) ? $elm$core$Maybe$Just(27) : (A2(r, 1550, 1551) ? $elm$core$Maybe$Just(29) : (A2(r, 1552, 1562) ? $elm$core$Maybe$Just(3) : (e(1564) ? $elm$core$Maybe$Just(13) : $elm$core$Maybe$Nothing)))))) : (l(1645) ? ((e(1567) || A2(r, 1642, 1644)) ? $elm$core$Maybe$Just(25) : ((A2(r, 1568, 1599) || A2(r, 1601, 1610)) ? $elm$core$Maybe$Just(18) : (e(1600) ? $elm$core$Maybe$Just(17) : (A2(r, 1611, 1631) ? $elm$core$Maybe$Just(3) : (A2(r, 1632, 1641) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : ((e(1645) || e(1748)) ? $elm$core$Maybe$Just(25) : (((A2(r, 1646, 1647) || A2(r, 1649, 1747)) || e(1749)) ? $elm$core$Maybe$Just(18) : ((e(1648) || A2(r, 1750, 1756)) ? $elm$core$Maybe$Just(3) : (e(1757) ? $elm$core$Maybe$Just(13) : $elm$core$Maybe$Nothing))))))))) : (l(2562) ? (l(2274) ? (l(2038) ? (l(1806) ? (((e(1758) || e(1769)) || A2(r, 1789, 1790)) ? $elm$core$Maybe$Just(29) : (((A2(r, 1759, 1764) || A2(r, 1767, 1768)) || A2(r, 1770, 1773)) ? $elm$core$Maybe$Just(3) : (A2(r, 1765, 1766) ? $elm$core$Maybe$Just(17) : (((A2(r, 1774, 1775) || A2(r, 1786, 1788)) || e(1791)) ? $elm$core$Maybe$Just(18) : (A2(r, 1776, 1785) ? $elm$core$Maybe$Just(6) : (A2(r, 1792, 1805) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))) : (e(1807) ? $elm$core$Maybe$Just(13) : (((((e(1808) || A2(r, 1810, 1839)) || A2(r, 1869, 1957)) || e(1969)) || A2(r, 1994, 2026)) ? $elm$core$Maybe$Just(18) : ((((e(1809) || A2(r, 1840, 1866)) || A2(r, 1958, 1968)) || A2(r, 2027, 2035)) ? $elm$core$Maybe$Just(3) : (A2(r, 1984, 1993) ? $elm$core$Maybe$Just(6) : (A2(r, 2036, 2037) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))))) : (l(2095) ? (l(2069) ? (e(2038) ? $elm$core$Maybe$Just(29) : (A2(r, 2039, 2041) ? $elm$core$Maybe$Just(25) : (e(2042) ? $elm$core$Maybe$Just(17) : (e(2045) ? $elm$core$Maybe$Just(3) : (A2(r, 2046, 2047) ? $elm$core$Maybe$Just(27) : (A2(r, 2048, 2068) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))) : (e(2069) ? $elm$core$Maybe$Just(18) : ((((A2(r, 2070, 2073) || A2(r, 2075, 2083)) || A2(r, 2085, 2087)) || A2(r, 2089, 2093)) ? $elm$core$Maybe$Just(3) : (((e(2074) || e(2084)) || e(2088)) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))) : (l(2183) ? ((A2(r, 2096, 2110) || e(2142)) ? $elm$core$Maybe$Just(25) : (((A2(r, 2112, 2136) || A2(r, 2144, 2154)) || A2(r, 2160, 2182)) ? $elm$core$Maybe$Just(18) : (A2(r, 2137, 2139) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : (((e(2183) || A2(r, 2185, 2190)) || A2(r, 2208, 2248)) ? $elm$core$Maybe$Just(18) : (e(2184) ? $elm$core$Maybe$Just(28) : (A2(r, 2192, 2193) ? $elm$core$Maybe$Just(13) : ((A2(r, 2200, 2207) || A2(r, 2250, 2273)) ? $elm$core$Maybe$Just(3) : (e(2249) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))))))) : (l(2450) ? (l(2383) ? (l(2363) ? (e(2274) ? $elm$core$Maybe$Just(13) : ((A2(r, 2275, 2306) || e(2362)) ? $elm$core$Maybe$Just(3) : (e(2307) ? $elm$core$Maybe$Just(4) : (A2(r, 2308, 2361) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : ((((e(2363) || A2(r, 2366, 2368)) || A2(r, 2377, 2380)) || e(2382)) ? $elm$core$Maybe$Just(4) : (((e(2364) || A2(r, 2369, 2376)) || e(2381)) ? $elm$core$Maybe$Just(3) : (e(2365) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (l(2415) ? (e(2383) ? $elm$core$Maybe$Just(4) : ((e(2384) || A2(r, 2392, 2401)) ? $elm$core$Maybe$Just(18) : ((A2(r, 2385, 2391) || A2(r, 2402, 2403)) ? $elm$core$Maybe$Just(3) : (A2(r, 2404, 2405) ? $elm$core$Maybe$Just(25) : (A2(r, 2406, 2414) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (e(2415) ? $elm$core$Maybe$Just(6) : (e(2416) ? $elm$core$Maybe$Just(25) : (e(2417) ? $elm$core$Maybe$Just(17) : (((A2(r, 2418, 2432) || A2(r, 2437, 2444)) || A2(r, 2447, 2448)) ? $elm$core$Maybe$Just(18) : (e(2433) ? $elm$core$Maybe$Just(3) : (A2(r, 2434, 2435) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))))) : (l(2523) ? (l(2493) ? ((((A2(r, 2451, 2472) || A2(r, 2474, 2480)) || e(2482)) || A2(r, 2486, 2489)) ? $elm$core$Maybe$Just(18) : (e(2492) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)) : ((e(2493) || e(2510)) ? $elm$core$Maybe$Just(18) : ((((A2(r, 2494, 2496) || A2(r, 2503, 2504)) || A2(r, 2507, 2508)) || e(2519)) ? $elm$core$Maybe$Just(4) : ((A2(r, 2497, 2500) || e(2509)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (l(2547) ? (((A2(r, 2524, 2525) || A2(r, 2527, 2529)) || A2(r, 2544, 2545)) ? $elm$core$Maybe$Just(18) : (A2(r, 2530, 2531) ? $elm$core$Maybe$Just(3) : (A2(r, 2534, 2543) ? $elm$core$Maybe$Just(6) : (e(2546) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing)))) : ((e(2547) || e(2555)) ? $elm$core$Maybe$Just(27) : (A2(r, 2548, 2553) ? $elm$core$Maybe$Just(8) : (e(2554) ? $elm$core$Maybe$Just(29) : (e(2556) ? $elm$core$Maybe$Just(18) : (e(2557) ? $elm$core$Maybe$Just(25) : ((e(2558) || e(2561)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))))))) : (l(2857) ? (l(2702) ? (l(2630) ? (((e(2562) || e(2620)) || A2(r, 2625, 2626)) ? $elm$core$Maybe$Just(3) : ((e(2563) || A2(r, 2622, 2624)) ? $elm$core$Maybe$Just(4) : (((((((A2(r, 2565, 2570) || A2(r, 2575, 2576)) || A2(r, 2579, 2600)) || A2(r, 2602, 2608)) || A2(r, 2610, 2611)) || A2(r, 2613, 2614)) || A2(r, 2616, 2617)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (l(2671) ? (((A2(r, 2631, 2632) || A2(r, 2635, 2637)) || e(2641)) ? $elm$core$Maybe$Just(3) : ((A2(r, 2649, 2652) || e(2654)) ? $elm$core$Maybe$Just(18) : (A2(r, 2662, 2670) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))) : (e(2671) ? $elm$core$Maybe$Just(6) : (((A2(r, 2672, 2673) || e(2677)) || A2(r, 2689, 2690)) ? $elm$core$Maybe$Just(3) : ((A2(r, 2674, 2676) || A2(r, 2693, 2701)) ? $elm$core$Maybe$Just(18) : (e(2678) ? $elm$core$Maybe$Just(25) : (e(2691) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(2767) ? (l(2748) ? (((((A2(r, 2703, 2705) || A2(r, 2707, 2728)) || A2(r, 2730, 2736)) || A2(r, 2738, 2739)) || A2(r, 2741, 2745)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing) : ((((e(2748) || A2(r, 2753, 2757)) || A2(r, 2759, 2760)) || e(2765)) ? $elm$core$Maybe$Just(3) : (e(2749) ? $elm$core$Maybe$Just(18) : (((A2(r, 2750, 2752) || e(2761)) || A2(r, 2763, 2764)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))) : (l(2808) ? ((e(2768) || A2(r, 2784, 2785)) ? $elm$core$Maybe$Just(18) : (A2(r, 2786, 2787) ? $elm$core$Maybe$Just(3) : (A2(r, 2790, 2799) ? $elm$core$Maybe$Just(6) : (e(2800) ? $elm$core$Maybe$Just(25) : (e(2801) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing))))) : ((((e(2809) || A2(r, 2821, 2828)) || A2(r, 2831, 2832)) || A2(r, 2835, 2856)) ? $elm$core$Maybe$Just(18) : ((A2(r, 2810, 2815) || e(2817)) ? $elm$core$Maybe$Just(3) : (A2(r, 2818, 2819) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))) : (l(2968) ? (l(2902) ? (l(2878) ? ((((A2(r, 2858, 2864) || A2(r, 2866, 2867)) || A2(r, 2869, 2873)) || e(2877)) ? $elm$core$Maybe$Just(18) : (e(2876) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)) : ((((e(2878) || e(2880)) || A2(r, 2887, 2888)) || A2(r, 2891, 2892)) ? $elm$core$Maybe$Just(4) : ((((e(2879) || A2(r, 2881, 2884)) || e(2893)) || e(2901)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : (l(2928) ? ((e(2902) || A2(r, 2914, 2915)) ? $elm$core$Maybe$Just(3) : (e(2903) ? $elm$core$Maybe$Just(4) : ((A2(r, 2908, 2909) || A2(r, 2911, 2913)) ? $elm$core$Maybe$Just(18) : (A2(r, 2918, 2927) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : (e(2928) ? $elm$core$Maybe$Just(29) : (((((e(2929) || e(2947)) || A2(r, 2949, 2954)) || A2(r, 2958, 2960)) || A2(r, 2962, 2965)) ? $elm$core$Maybe$Just(18) : (A2(r, 2930, 2935) ? $elm$core$Maybe$Just(8) : (e(2946) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))) : (l(3030) ? (l(3005) ? ((((((A2(r, 2969, 2970) || e(2972)) || A2(r, 2974, 2975)) || A2(r, 2979, 2980)) || A2(r, 2984, 2986)) || A2(r, 2990, 3001)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing) : ((((A2(r, 3006, 3007) || A2(r, 3009, 3010)) || A2(r, 3014, 3016)) || A2(r, 3018, 3020)) ? $elm$core$Maybe$Just(4) : ((e(3008) || e(3021)) ? $elm$core$Maybe$Just(3) : (e(3024) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (l(3071) ? (e(3031) ? $elm$core$Maybe$Just(4) : (A2(r, 3046, 3055) ? $elm$core$Maybe$Just(6) : (A2(r, 3056, 3058) ? $elm$core$Maybe$Just(8) : ((A2(r, 3059, 3064) || e(3066)) ? $elm$core$Maybe$Just(29) : (e(3065) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing))))) : ((e(3072) || e(3076)) ? $elm$core$Maybe$Just(3) : (A2(r, 3073, 3075) ? $elm$core$Maybe$Just(4) : ((((A2(r, 3077, 3084) || A2(r, 3086, 3088)) || A2(r, 3090, 3112)) || A2(r, 3114, 3129)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))))))) : (l(7700) ? (l(4968) ? (l(3783) ? (l(3401) ? (l(3260) ? (l(3190) ? ((((((e(3132) || A2(r, 3134, 3136)) || A2(r, 3142, 3144)) || A2(r, 3146, 3149)) || A2(r, 3157, 3158)) || A2(r, 3170, 3171)) ? $elm$core$Maybe$Just(3) : ((((e(3133) || A2(r, 3160, 3162)) || e(3165)) || A2(r, 3168, 3169)) ? $elm$core$Maybe$Just(18) : (A2(r, 3137, 3140) ? $elm$core$Maybe$Just(4) : (A2(r, 3174, 3183) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : ((e(3191) || e(3204)) ? $elm$core$Maybe$Just(25) : (A2(r, 3192, 3198) ? $elm$core$Maybe$Just(8) : (e(3199) ? $elm$core$Maybe$Just(29) : ((((((e(3200) || A2(r, 3205, 3212)) || A2(r, 3214, 3216)) || A2(r, 3218, 3240)) || A2(r, 3242, 3251)) || A2(r, 3253, 3257)) ? $elm$core$Maybe$Just(18) : (e(3201) ? $elm$core$Maybe$Just(3) : (A2(r, 3202, 3203) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(3301) ? (l(3270) ? ((e(3260) || e(3263)) ? $elm$core$Maybe$Just(3) : (e(3261) ? $elm$core$Maybe$Just(18) : ((e(3262) || A2(r, 3264, 3268)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))) : (((e(3270) || A2(r, 3276, 3277)) || A2(r, 3298, 3299)) ? $elm$core$Maybe$Just(3) : (((A2(r, 3271, 3272) || A2(r, 3274, 3275)) || A2(r, 3285, 3286)) ? $elm$core$Maybe$Just(4) : ((A2(r, 3293, 3294) || A2(r, 3296, 3297)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (l(3341) ? (A2(r, 3302, 3311) ? $elm$core$Maybe$Just(6) : ((A2(r, 3313, 3314) || A2(r, 3332, 3340)) ? $elm$core$Maybe$Just(18) : ((e(3315) || A2(r, 3330, 3331)) ? $elm$core$Maybe$Just(4) : (A2(r, 3328, 3329) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (((A2(r, 3342, 3344) || A2(r, 3346, 3386)) || e(3389)) ? $elm$core$Maybe$Just(18) : ((A2(r, 3387, 3388) || A2(r, 3393, 3396)) ? $elm$core$Maybe$Just(3) : ((A2(r, 3390, 3392) || A2(r, 3398, 3400)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))) : (l(3557) ? (l(3449) ? ((A2(r, 3402, 3404) || e(3415)) ? $elm$core$Maybe$Just(4) : ((e(3405) || A2(r, 3426, 3427)) ? $elm$core$Maybe$Just(3) : (((e(3406) || A2(r, 3412, 3414)) || A2(r, 3423, 3425)) ? $elm$core$Maybe$Just(18) : (e(3407) ? $elm$core$Maybe$Just(29) : ((A2(r, 3416, 3422) || A2(r, 3440, 3448)) ? $elm$core$Maybe$Just(8) : (A2(r, 3430, 3439) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(3516) ? (e(3449) ? $elm$core$Maybe$Just(29) : ((((A2(r, 3450, 3455) || A2(r, 3461, 3478)) || A2(r, 3482, 3505)) || A2(r, 3507, 3515)) ? $elm$core$Maybe$Just(18) : (e(3457) ? $elm$core$Maybe$Just(3) : (A2(r, 3458, 3459) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))) : ((e(3517) || A2(r, 3520, 3526)) ? $elm$core$Maybe$Just(18) : (((e(3530) || A2(r, 3538, 3540)) || e(3542)) ? $elm$core$Maybe$Just(3) : ((A2(r, 3535, 3537) || A2(r, 3544, 3551)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(3673) ? (l(3635) ? (A2(r, 3558, 3567) ? $elm$core$Maybe$Just(6) : (A2(r, 3570, 3571) ? $elm$core$Maybe$Just(4) : (e(3572) ? $elm$core$Maybe$Just(25) : ((A2(r, 3585, 3632) || e(3634)) ? $elm$core$Maybe$Just(18) : (e(3633) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))) : ((e(3635) || A2(r, 3648, 3653)) ? $elm$core$Maybe$Just(18) : ((A2(r, 3636, 3642) || A2(r, 3655, 3662)) ? $elm$core$Maybe$Just(3) : (e(3647) ? $elm$core$Maybe$Just(27) : (e(3654) ? $elm$core$Maybe$Just(17) : (e(3663) ? $elm$core$Maybe$Just(25) : (A2(r, 3664, 3672) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))))) : (l(3750) ? (e(3673) ? $elm$core$Maybe$Just(6) : (A2(r, 3674, 3675) ? $elm$core$Maybe$Just(25) : (((((A2(r, 3713, 3714) || e(3716)) || A2(r, 3718, 3722)) || A2(r, 3724, 3747)) || e(3749)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : ((((A2(r, 3751, 3760) || A2(r, 3762, 3763)) || e(3773)) || A2(r, 3776, 3780)) ? $elm$core$Maybe$Just(18) : ((e(3761) || A2(r, 3764, 3772)) ? $elm$core$Maybe$Just(3) : (e(3782) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing))))))) : (l(4158) ? (l(3912) ? (l(3881) ? ((A2(r, 3784, 3790) || A2(r, 3864, 3865)) ? $elm$core$Maybe$Just(3) : ((A2(r, 3792, 3801) || A2(r, 3872, 3880)) ? $elm$core$Maybe$Just(6) : ((A2(r, 3804, 3807) || e(3840)) ? $elm$core$Maybe$Just(18) : ((((A2(r, 3841, 3843) || e(3859)) || A2(r, 3861, 3863)) || A2(r, 3866, 3871)) ? $elm$core$Maybe$Just(29) : ((A2(r, 3844, 3858) || e(3860)) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (l(3896) ? (e(3881) ? $elm$core$Maybe$Just(6) : (A2(r, 3882, 3891) ? $elm$core$Maybe$Just(8) : ((e(3892) || e(3894)) ? $elm$core$Maybe$Just(29) : ((e(3893) || e(3895)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (e(3896) ? $elm$core$Maybe$Just(29) : (e(3897) ? $elm$core$Maybe$Just(3) : ((e(3898) || e(3900)) ? $elm$core$Maybe$Just(21) : ((e(3899) || e(3901)) ? $elm$core$Maybe$Just(22) : (A2(r, 3902, 3903) ? $elm$core$Maybe$Just(4) : (A2(r, 3904, 3911) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))))) : (l(4045) ? ((A2(r, 3913, 3948) || A2(r, 3976, 3980)) ? $elm$core$Maybe$Just(18) : ((((((A2(r, 3953, 3966) || A2(r, 3968, 3972)) || A2(r, 3974, 3975)) || A2(r, 3981, 3991)) || A2(r, 3993, 4028)) || e(4038)) ? $elm$core$Maybe$Just(3) : (e(3967) ? $elm$core$Maybe$Just(4) : (e(3973) ? $elm$core$Maybe$Just(25) : ((A2(r, 4030, 4037) || A2(r, 4039, 4044)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))) : (l(4140) ? ((A2(r, 4046, 4047) || A2(r, 4053, 4056)) ? $elm$core$Maybe$Just(29) : ((A2(r, 4048, 4052) || A2(r, 4057, 4058)) ? $elm$core$Maybe$Just(25) : (A2(r, 4096, 4138) ? $elm$core$Maybe$Just(18) : (e(4139) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))) : ((((e(4140) || e(4145)) || e(4152)) || A2(r, 4155, 4156)) ? $elm$core$Maybe$Just(4) : ((((A2(r, 4141, 4144) || A2(r, 4146, 4151)) || A2(r, 4153, 4154)) || e(4157)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))) : (l(4253) ? (l(4198) ? (((e(4158) || A2(r, 4184, 4185)) || A2(r, 4190, 4192)) ? $elm$core$Maybe$Just(3) : (((((e(4159) || A2(r, 4176, 4181)) || A2(r, 4186, 4189)) || e(4193)) || e(4197)) ? $elm$core$Maybe$Just(18) : (A2(r, 4160, 4169) ? $elm$core$Maybe$Just(6) : (A2(r, 4170, 4175) ? $elm$core$Maybe$Just(25) : ((A2(r, 4182, 4183) || A2(r, 4194, 4196)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(4228) ? (((e(4198) || A2(r, 4206, 4208)) || A2(r, 4213, 4225)) ? $elm$core$Maybe$Just(18) : ((A2(r, 4199, 4205) || e(4227)) ? $elm$core$Maybe$Just(4) : ((A2(r, 4209, 4212) || e(4226)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : ((((e(4228) || A2(r, 4231, 4236)) || e(4239)) || A2(r, 4250, 4252)) ? $elm$core$Maybe$Just(4) : ((A2(r, 4229, 4230) || e(4237)) ? $elm$core$Maybe$Just(3) : (e(4238) ? $elm$core$Maybe$Just(18) : (A2(r, 4240, 4249) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(4697) ? (l(4346) ? (e(4253) ? $elm$core$Maybe$Just(3) : (A2(r, 4254, 4255) ? $elm$core$Maybe$Just(29) : (((A2(r, 4256, 4293) || e(4295)) || e(4301)) ? $elm$core$Maybe$Just(0) : (A2(r, 4304, 4345) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : ((e(4346) || A2(r, 4349, 4351)) ? $elm$core$Maybe$Just(1) : (e(4347) ? $elm$core$Maybe$Just(25) : (e(4348) ? $elm$core$Maybe$Just(17) : ((((A2(r, 4352, 4680) || A2(r, 4682, 4685)) || A2(r, 4688, 4694)) || e(4696)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(4801) ? (((((((A2(r, 4698, 4701) || A2(r, 4704, 4744)) || A2(r, 4746, 4749)) || A2(r, 4752, 4784)) || A2(r, 4786, 4789)) || A2(r, 4792, 4798)) || e(4800)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing) : (((((A2(r, 4802, 4805) || A2(r, 4808, 4822)) || A2(r, 4824, 4880)) || A2(r, 4882, 4885)) || A2(r, 4888, 4954)) ? $elm$core$Maybe$Just(18) : (A2(r, 4957, 4959) ? $elm$core$Maybe$Just(3) : (A2(r, 4960, 4967) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))))) : (l(6799) ? (l(6154) ? (l(5940) ? (l(5760) ? ((e(4968) || e(5742)) ? $elm$core$Maybe$Just(25) : (A2(r, 4969, 4988) ? $elm$core$Maybe$Just(8) : (((A2(r, 4992, 5007) || A2(r, 5121, 5740)) || A2(r, 5743, 5759)) ? $elm$core$Maybe$Just(18) : ((A2(r, 5008, 5017) || e(5741)) ? $elm$core$Maybe$Just(29) : (A2(r, 5024, 5109) ? $elm$core$Maybe$Just(0) : (A2(r, 5112, 5117) ? $elm$core$Maybe$Just(1) : (e(5120) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))))))) : (l(5869) ? (e(5760) ? $elm$core$Maybe$Just(9) : ((A2(r, 5761, 5786) || A2(r, 5792, 5866)) ? $elm$core$Maybe$Just(18) : (e(5787) ? $elm$core$Maybe$Just(21) : (e(5788) ? $elm$core$Maybe$Just(22) : (A2(r, 5867, 5868) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (e(5869) ? $elm$core$Maybe$Just(25) : (A2(r, 5870, 5872) ? $elm$core$Maybe$Just(7) : (((A2(r, 5873, 5880) || A2(r, 5888, 5905)) || A2(r, 5919, 5937)) ? $elm$core$Maybe$Just(18) : ((A2(r, 5906, 5908) || A2(r, 5938, 5939)) ? $elm$core$Maybe$Just(3) : (e(5909) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(6086) ? (((e(5940) || e(6070)) || A2(r, 6078, 6085)) ? $elm$core$Maybe$Just(4) : (A2(r, 5941, 5942) ? $elm$core$Maybe$Just(25) : ((((A2(r, 5952, 5969) || A2(r, 5984, 5996)) || A2(r, 5998, 6000)) || A2(r, 6016, 6067)) ? $elm$core$Maybe$Just(18) : ((((A2(r, 5970, 5971) || A2(r, 6002, 6003)) || A2(r, 6068, 6069)) || A2(r, 6071, 6077)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (l(6107) ? ((e(6086) || A2(r, 6089, 6099)) ? $elm$core$Maybe$Just(3) : (A2(r, 6087, 6088) ? $elm$core$Maybe$Just(4) : ((A2(r, 6100, 6102) || A2(r, 6104, 6106)) ? $elm$core$Maybe$Just(25) : (e(6103) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))) : (e(6107) ? $elm$core$Maybe$Just(27) : (e(6108) ? $elm$core$Maybe$Just(18) : (e(6109) ? $elm$core$Maybe$Just(3) : (A2(r, 6112, 6121) ? $elm$core$Maybe$Just(6) : (A2(r, 6128, 6137) ? $elm$core$Maybe$Just(8) : ((A2(r, 6144, 6149) || A2(r, 6151, 6153)) ? $elm$core$Maybe$Just(25) : (e(6150) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing)))))))))) : (l(6479) ? (l(6319) ? (l(6210) ? (e(6154) ? $elm$core$Maybe$Just(25) : ((A2(r, 6155, 6157) || e(6159)) ? $elm$core$Maybe$Just(3) : (e(6158) ? $elm$core$Maybe$Just(13) : (A2(r, 6160, 6169) ? $elm$core$Maybe$Just(6) : (A2(r, 6176, 6209) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (((((e(6210) || A2(r, 6212, 6264)) || A2(r, 6272, 6276)) || A2(r, 6279, 6312)) || e(6314)) ? $elm$core$Maybe$Just(18) : (e(6211) ? $elm$core$Maybe$Just(17) : ((A2(r, 6277, 6278) || e(6313)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (l(6447) ? ((A2(r, 6320, 6389) || A2(r, 6400, 6430)) ? $elm$core$Maybe$Just(18) : ((A2(r, 6432, 6434) || A2(r, 6439, 6440)) ? $elm$core$Maybe$Just(3) : ((A2(r, 6435, 6438) || A2(r, 6441, 6443)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))) : ((A2(r, 6448, 6449) || A2(r, 6451, 6456)) ? $elm$core$Maybe$Just(4) : ((e(6450) || A2(r, 6457, 6459)) ? $elm$core$Maybe$Just(3) : (e(6464) ? $elm$core$Maybe$Just(29) : (A2(r, 6468, 6469) ? $elm$core$Maybe$Just(25) : (A2(r, 6470, 6478) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))))) : (l(6687) ? (l(6617) ? ((e(6479) || A2(r, 6608, 6616)) ? $elm$core$Maybe$Just(6) : ((((A2(r, 6480, 6509) || A2(r, 6512, 6516)) || A2(r, 6528, 6571)) || A2(r, 6576, 6601)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (e(6617) ? $elm$core$Maybe$Just(6) : (e(6618) ? $elm$core$Maybe$Just(8) : (A2(r, 6622, 6655) ? $elm$core$Maybe$Just(29) : (A2(r, 6656, 6678) ? $elm$core$Maybe$Just(18) : ((A2(r, 6679, 6680) || e(6683)) ? $elm$core$Maybe$Just(3) : (A2(r, 6681, 6682) ? $elm$core$Maybe$Just(4) : (e(6686) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))))) : (l(6752) ? (e(6687) ? $elm$core$Maybe$Just(25) : (A2(r, 6688, 6740) ? $elm$core$Maybe$Just(18) : ((e(6741) || e(6743)) ? $elm$core$Maybe$Just(4) : ((e(6742) || A2(r, 6744, 6750)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : (((((e(6752) || e(6754)) || A2(r, 6757, 6764)) || A2(r, 6771, 6780)) || e(6783)) ? $elm$core$Maybe$Just(3) : (((e(6753) || A2(r, 6755, 6756)) || A2(r, 6765, 6770)) ? $elm$core$Maybe$Just(4) : (A2(r, 6784, 6793) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))))) : (l(7226) ? (l(7039) ? (l(6965) ? (A2(r, 6800, 6809) ? $elm$core$Maybe$Just(6) : ((A2(r, 6816, 6822) || A2(r, 6824, 6829)) ? $elm$core$Maybe$Just(25) : (e(6823) ? $elm$core$Maybe$Just(17) : ((((A2(r, 6832, 6845) || A2(r, 6847, 6862)) || A2(r, 6912, 6915)) || e(6964)) ? $elm$core$Maybe$Just(3) : (e(6846) ? $elm$core$Maybe$Just(5) : (e(6916) ? $elm$core$Maybe$Just(4) : (A2(r, 6917, 6963) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))))) : (l(6980) ? ((((e(6965) || e(6971)) || A2(r, 6973, 6977)) || e(6979)) ? $elm$core$Maybe$Just(4) : (((A2(r, 6966, 6970) || e(6972)) || e(6978)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)) : (e(6980) ? $elm$core$Maybe$Just(4) : (A2(r, 6981, 6988) ? $elm$core$Maybe$Just(18) : (A2(r, 6992, 7001) ? $elm$core$Maybe$Just(6) : ((A2(r, 7002, 7008) || A2(r, 7037, 7038)) ? $elm$core$Maybe$Just(25) : ((A2(r, 7009, 7018) || A2(r, 7028, 7036)) ? $elm$core$Maybe$Just(29) : (A2(r, 7019, 7027) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))))) : (l(7142) ? ((((A2(r, 7040, 7041) || A2(r, 7074, 7077)) || A2(r, 7080, 7081)) || A2(r, 7083, 7085)) ? $elm$core$Maybe$Just(3) : ((((e(7042) || e(7073)) || A2(r, 7078, 7079)) || e(7082)) ? $elm$core$Maybe$Just(4) : (((A2(r, 7043, 7072) || A2(r, 7086, 7087)) || A2(r, 7098, 7141)) ? $elm$core$Maybe$Just(18) : (A2(r, 7088, 7097) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : (l(7153) ? ((((e(7142) || A2(r, 7144, 7145)) || e(7149)) || A2(r, 7151, 7152)) ? $elm$core$Maybe$Just(3) : (((e(7143) || A2(r, 7146, 7148)) || e(7150)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)) : (((e(7153) || A2(r, 7212, 7219)) || A2(r, 7222, 7223)) ? $elm$core$Maybe$Just(3) : (((A2(r, 7154, 7155) || A2(r, 7204, 7211)) || A2(r, 7220, 7221)) ? $elm$core$Maybe$Just(4) : (A2(r, 7164, 7167) ? $elm$core$Maybe$Just(25) : (A2(r, 7168, 7203) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))))) : (l(7467) ? (l(7378) ? (((A2(r, 7227, 7231) || A2(r, 7294, 7295)) || A2(r, 7360, 7367)) ? $elm$core$Maybe$Just(25) : ((A2(r, 7232, 7241) || A2(r, 7248, 7257)) ? $elm$core$Maybe$Just(6) : ((A2(r, 7245, 7247) || A2(r, 7258, 7287)) ? $elm$core$Maybe$Just(18) : (A2(r, 7288, 7293) ? $elm$core$Maybe$Just(17) : (A2(r, 7296, 7304) ? $elm$core$Maybe$Just(1) : ((A2(r, 7312, 7354) || A2(r, 7357, 7359)) ? $elm$core$Maybe$Just(0) : (A2(r, 7376, 7377) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))))) : (l(7405) ? (((e(7378) || A2(r, 7380, 7392)) || A2(r, 7394, 7400)) ? $elm$core$Maybe$Just(3) : (e(7379) ? $elm$core$Maybe$Just(25) : (e(7393) ? $elm$core$Maybe$Just(4) : (A2(r, 7401, 7404) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (((e(7405) || e(7412)) || A2(r, 7416, 7417)) ? $elm$core$Maybe$Just(3) : (((A2(r, 7406, 7411) || A2(r, 7413, 7414)) || e(7418)) ? $elm$core$Maybe$Just(18) : (e(7415) ? $elm$core$Maybe$Just(4) : (A2(r, 7424, 7466) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))) : (l(7685) ? (((((e(7467) || A2(r, 7531, 7543)) || A2(r, 7545, 7578)) || e(7681)) || e(7683)) ? $elm$core$Maybe$Just(1) : (((A2(r, 7468, 7530) || e(7544)) || A2(r, 7579, 7615)) ? $elm$core$Maybe$Just(17) : (A2(r, 7616, 7679) ? $elm$core$Maybe$Just(3) : (((e(7680) || e(7682)) || e(7684)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(7691) ? (((e(7685) || e(7687)) || e(7689)) ? $elm$core$Maybe$Just(1) : (((e(7686) || e(7688)) || e(7690)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(7691) || e(7693)) || e(7695)) || e(7697)) || e(7699)) ? $elm$core$Maybe$Just(1) : ((((e(7692) || e(7694)) || e(7696)) || e(7698)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))))))) : (l(7910) ? (l(7800) ? (l(7749) ? (l(7723) ? (l(7710) ? (((((e(7700) || e(7702)) || e(7704)) || e(7706)) || e(7708)) ? $elm$core$Maybe$Just(0) : (((((e(7701) || e(7703)) || e(7705)) || e(7707)) || e(7709)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(7715) ? (((e(7710) || e(7712)) || e(7714)) ? $elm$core$Maybe$Just(0) : ((e(7711) || e(7713)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(7715) || e(7717)) || e(7719)) || e(7721)) ? $elm$core$Maybe$Just(1) : ((((e(7716) || e(7718)) || e(7720)) || e(7722)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(7735) ? ((((((e(7723) || e(7725)) || e(7727)) || e(7729)) || e(7731)) || e(7733)) ? $elm$core$Maybe$Just(1) : ((((((e(7724) || e(7726)) || e(7728)) || e(7730)) || e(7732)) || e(7734)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(7741) ? (((e(7735) || e(7737)) || e(7739)) ? $elm$core$Maybe$Just(1) : (((e(7736) || e(7738)) || e(7740)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(7741) || e(7743)) || e(7745)) || e(7747)) ? $elm$core$Maybe$Just(1) : ((((e(7742) || e(7744)) || e(7746)) || e(7748)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))) : (l(7773) ? (l(7760) ? ((((((e(7749) || e(7751)) || e(7753)) || e(7755)) || e(7757)) || e(7759)) ? $elm$core$Maybe$Just(1) : (((((e(7750) || e(7752)) || e(7754)) || e(7756)) || e(7758)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(7765) ? (((e(7760) || e(7762)) || e(7764)) ? $elm$core$Maybe$Just(0) : ((e(7761) || e(7763)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(7765) || e(7767)) || e(7769)) || e(7771)) ? $elm$core$Maybe$Just(1) : ((((e(7766) || e(7768)) || e(7770)) || e(7772)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(7785) ? ((((((e(7773) || e(7775)) || e(7777)) || e(7779)) || e(7781)) || e(7783)) ? $elm$core$Maybe$Just(1) : ((((((e(7774) || e(7776)) || e(7778)) || e(7780)) || e(7782)) || e(7784)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(7791) ? (((e(7785) || e(7787)) || e(7789)) ? $elm$core$Maybe$Just(1) : (((e(7786) || e(7788)) || e(7790)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(7791) || e(7793)) || e(7795)) || e(7797)) || e(7799)) ? $elm$core$Maybe$Just(1) : ((((e(7792) || e(7794)) || e(7796)) || e(7798)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))))) : (l(7858) ? (l(7824) ? (l(7811) ? ((((((e(7800) || e(7802)) || e(7804)) || e(7806)) || e(7808)) || e(7810)) ? $elm$core$Maybe$Just(0) : (((((e(7801) || e(7803)) || e(7805)) || e(7807)) || e(7809)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(7816) ? (((e(7811) || e(7813)) || e(7815)) ? $elm$core$Maybe$Just(1) : ((e(7812) || e(7814)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(7816) || e(7818)) || e(7820)) || e(7822)) ? $elm$core$Maybe$Just(0) : ((((e(7817) || e(7819)) || e(7821)) || e(7823)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(7844) ? ((((((e(7824) || e(7826)) || e(7828)) || e(7838)) || e(7840)) || e(7842)) ? $elm$core$Maybe$Just(0) : ((((((e(7825) || e(7827)) || A2(r, 7829, 7837)) || e(7839)) || e(7841)) || e(7843)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(7850) ? (((e(7844) || e(7846)) || e(7848)) ? $elm$core$Maybe$Just(0) : (((e(7845) || e(7847)) || e(7849)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(7850) || e(7852)) || e(7854)) || e(7856)) ? $elm$core$Maybe$Just(0) : ((((e(7851) || e(7853)) || e(7855)) || e(7857)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))) : (l(7883) ? (l(7869) ? ((((((e(7858) || e(7860)) || e(7862)) || e(7864)) || e(7866)) || e(7868)) ? $elm$core$Maybe$Just(0) : (((((e(7859) || e(7861)) || e(7863)) || e(7865)) || e(7867)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(7875) ? (((e(7869) || e(7871)) || e(7873)) ? $elm$core$Maybe$Just(1) : (((e(7870) || e(7872)) || e(7874)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(7875) || e(7877)) || e(7879)) || e(7881)) ? $elm$core$Maybe$Just(1) : ((((e(7876) || e(7878)) || e(7880)) || e(7882)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(7895) ? ((((((e(7883) || e(7885)) || e(7887)) || e(7889)) || e(7891)) || e(7893)) ? $elm$core$Maybe$Just(1) : ((((((e(7884) || e(7886)) || e(7888)) || e(7890)) || e(7892)) || e(7894)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(7901) ? (((e(7895) || e(7897)) || e(7899)) ? $elm$core$Maybe$Just(1) : (((e(7896) || e(7898)) || e(7900)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(7901) || e(7903)) || e(7905)) || e(7907)) || e(7909)) ? $elm$core$Maybe$Just(1) : ((((e(7902) || e(7904)) || e(7906)) || e(7908)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))))) : (l(8303) ? (l(8126) ? (l(7934) ? (l(7921) ? ((((((e(7910) || e(7912)) || e(7914)) || e(7916)) || e(7918)) || e(7920)) ? $elm$core$Maybe$Just(0) : (((((e(7911) || e(7913)) || e(7915)) || e(7917)) || e(7919)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(7926) ? (((e(7921) || e(7923)) || e(7925)) ? $elm$core$Maybe$Just(1) : ((e(7922) || e(7924)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(7926) || e(7928)) || e(7930)) || e(7932)) ? $elm$core$Maybe$Just(0) : ((((e(7927) || e(7929)) || e(7931)) || e(7933)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(8039) ? (l(7975) ? (((e(7934) || A2(r, 7944, 7951)) || A2(r, 7960, 7965)) ? $elm$core$Maybe$Just(0) : (((A2(r, 7935, 7943) || A2(r, 7952, 7957)) || A2(r, 7968, 7974)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((((e(7975) || A2(r, 7984, 7991)) || A2(r, 8000, 8005)) || A2(r, 8016, 8023)) || A2(r, 8032, 8038)) ? $elm$core$Maybe$Just(1) : ((((A2(r, 7976, 7983) || A2(r, 7992, 7999)) || A2(r, 8008, 8013)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && A2(r, 8025, 8031))) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : (l(8095) ? ((((e(8039) || A2(r, 8048, 8061)) || A2(r, 8064, 8071)) || A2(r, 8080, 8087)) ? $elm$core$Maybe$Just(1) : (A2(r, 8040, 8047) ? $elm$core$Maybe$Just(0) : ((A2(r, 8072, 8079) || A2(r, 8088, 8094)) ? $elm$core$Maybe$Just(2) : $elm$core$Maybe$Nothing))) : (((e(8095) || A2(r, 8104, 8111)) || e(8124)) ? $elm$core$Maybe$Just(2) : (((A2(r, 8096, 8103) || A2(r, 8112, 8116)) || A2(r, 8118, 8119)) ? $elm$core$Maybe$Just(1) : (A2(r, 8120, 8123) ? $elm$core$Maybe$Just(0) : (e(8125) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))))) : (l(8218) ? (l(8167) ? ((((((e(8126) || A2(r, 8130, 8132)) || A2(r, 8134, 8135)) || A2(r, 8144, 8147)) || A2(r, 8150, 8151)) || A2(r, 8160, 8166)) ? $elm$core$Maybe$Just(1) : (((A2(r, 8127, 8129) || A2(r, 8141, 8143)) || A2(r, 8157, 8159)) ? $elm$core$Maybe$Just(28) : ((A2(r, 8136, 8139) || A2(r, 8152, 8155)) ? $elm$core$Maybe$Just(0) : (e(8140) ? $elm$core$Maybe$Just(2) : $elm$core$Maybe$Nothing)))) : (l(8188) ? (((e(8167) || A2(r, 8178, 8180)) || A2(r, 8182, 8183)) ? $elm$core$Maybe$Just(1) : ((A2(r, 8168, 8172) || A2(r, 8184, 8187)) ? $elm$core$Maybe$Just(0) : (A2(r, 8173, 8175) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))) : (e(8188) ? $elm$core$Maybe$Just(2) : (A2(r, 8189, 8190) ? $elm$core$Maybe$Just(28) : (A2(r, 8192, 8202) ? $elm$core$Maybe$Just(9) : (A2(r, 8203, 8207) ? $elm$core$Maybe$Just(13) : (A2(r, 8208, 8213) ? $elm$core$Maybe$Just(20) : (A2(r, 8214, 8215) ? $elm$core$Maybe$Just(25) : (e(8216) ? $elm$core$Maybe$Just(23) : (e(8217) ? $elm$core$Maybe$Just(24) : $elm$core$Maybe$Nothing)))))))))) : (l(8250) ? ((e(8218) || e(8222)) ? $elm$core$Maybe$Just(21) : (((A2(r, 8219, 8220) || e(8223)) || e(8249)) ? $elm$core$Maybe$Just(23) : (e(8221) ? $elm$core$Maybe$Just(24) : ((A2(r, 8224, 8231) || A2(r, 8240, 8248)) ? $elm$core$Maybe$Just(25) : (e(8232) ? $elm$core$Maybe$Just(10) : (e(8233) ? $elm$core$Maybe$Just(11) : (A2(r, 8234, 8238) ? $elm$core$Maybe$Just(13) : (e(8239) ? $elm$core$Maybe$Just(9) : $elm$core$Maybe$Nothing)))))))) : (l(8262) ? (e(8250) ? $elm$core$Maybe$Just(24) : ((A2(r, 8251, 8254) || A2(r, 8257, 8259)) ? $elm$core$Maybe$Just(25) : (A2(r, 8255, 8256) ? $elm$core$Maybe$Just(19) : (e(8260) ? $elm$core$Maybe$Just(26) : (e(8261) ? $elm$core$Maybe$Just(21) : $elm$core$Maybe$Nothing))))) : (e(8262) ? $elm$core$Maybe$Just(22) : (((A2(r, 8263, 8273) || e(8275)) || A2(r, 8277, 8286)) ? $elm$core$Maybe$Just(25) : (e(8274) ? $elm$core$Maybe$Just(26) : (e(8276) ? $elm$core$Maybe$Just(19) : (e(8287) ? $elm$core$Maybe$Just(9) : ((A2(r, 8288, 8292) || A2(r, 8294, 8302)) ? $elm$core$Maybe$Just(13) : $elm$core$Maybe$Nothing)))))))))) : (l(8511) ? (l(8458) ? (l(8335) ? (e(8303) ? $elm$core$Maybe$Just(13) : (((e(8304) || A2(r, 8308, 8313)) || A2(r, 8320, 8329)) ? $elm$core$Maybe$Just(8) : ((e(8305) || e(8319)) ? $elm$core$Maybe$Just(17) : ((A2(r, 8314, 8316) || A2(r, 8330, 8332)) ? $elm$core$Maybe$Just(26) : ((e(8317) || e(8333)) ? $elm$core$Maybe$Just(21) : ((e(8318) || e(8334)) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))))) : (A2(r, 8336, 8348) ? $elm$core$Maybe$Just(17) : (A2(r, 8352, 8384) ? $elm$core$Maybe$Just(27) : (((A2(r, 8400, 8412) || e(8417)) || A2(r, 8421, 8432)) ? $elm$core$Maybe$Just(3) : ((A2(r, 8413, 8416) || A2(r, 8418, 8420)) ? $elm$core$Maybe$Just(5) : (((A2(r, 8448, 8449) || A2(r, 8451, 8454)) || A2(r, 8456, 8457)) ? $elm$core$Maybe$Just(29) : ((e(8450) || e(8455)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))))) : (l(8485) ? (((e(8458) || A2(r, 8462, 8463)) || e(8467)) ? $elm$core$Maybe$Just(1) : (((((A2(r, 8459, 8461) || A2(r, 8464, 8466)) || e(8469)) || A2(r, 8473, 8477)) || e(8484)) ? $elm$core$Maybe$Just(0) : (((e(8468) || A2(r, 8470, 8471)) || A2(r, 8478, 8483)) ? $elm$core$Maybe$Just(29) : (e(8472) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing)))) : (l(8494) ? (((e(8485) || e(8487)) || e(8489)) ? $elm$core$Maybe$Just(29) : (((e(8486) || e(8488)) || A2(r, 8490, 8493)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((e(8494) || A2(r, 8506, 8507)) ? $elm$core$Maybe$Just(29) : ((((e(8495) || e(8500)) || e(8505)) || A2(r, 8508, 8509)) ? $elm$core$Maybe$Just(1) : ((A2(r, 8496, 8499) || e(8510)) ? $elm$core$Maybe$Just(0) : (A2(r, 8501, 8504) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))))) : (l(8621) ? (l(8580) ? (((e(8511) || e(8517)) || e(8579)) ? $elm$core$Maybe$Just(0) : ((A2(r, 8512, 8516) || e(8523)) ? $elm$core$Maybe$Just(26) : ((A2(r, 8518, 8521) || e(8526)) ? $elm$core$Maybe$Just(1) : (((e(8522) || A2(r, 8524, 8525)) || e(8527)) ? $elm$core$Maybe$Just(29) : (A2(r, 8528, 8543) ? $elm$core$Maybe$Just(8) : (A2(r, 8544, 8578) ? $elm$core$Maybe$Just(7) : $elm$core$Maybe$Nothing)))))) : (l(8603) ? (e(8580) ? $elm$core$Maybe$Just(1) : (A2(r, 8581, 8584) ? $elm$core$Maybe$Just(7) : (e(8585) ? $elm$core$Maybe$Just(8) : ((A2(r, 8586, 8587) || A2(r, 8597, 8601)) ? $elm$core$Maybe$Just(29) : ((A2(r, 8592, 8596) || e(8602)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))))) : ((((e(8603) || e(8608)) || e(8611)) || e(8614)) ? $elm$core$Maybe$Just(26) : ((((A2(r, 8604, 8607) || A2(r, 8609, 8610)) || A2(r, 8612, 8613)) || A2(r, 8615, 8620)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing)))) : (l(8970) ? (l(8658) ? (((e(8621) || A2(r, 8623, 8653)) || A2(r, 8656, 8657)) ? $elm$core$Maybe$Just(29) : ((e(8622) || A2(r, 8654, 8655)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing)) : (((e(8658) || e(8660)) || A2(r, 8692, 8959)) ? $elm$core$Maybe$Just(26) : (((e(8659) || A2(r, 8661, 8691)) || A2(r, 8960, 8967)) ? $elm$core$Maybe$Just(29) : (e(8968) ? $elm$core$Maybe$Just(21) : (e(8969) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing))))) : (l(9002) ? ((e(8970) || e(9001)) ? $elm$core$Maybe$Just(21) : (e(8971) ? $elm$core$Maybe$Just(22) : ((A2(r, 8972, 8991) || A2(r, 8994, 9000)) ? $elm$core$Maybe$Just(29) : (A2(r, 8992, 8993) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing)))) : (e(9002) ? $elm$core$Maybe$Just(22) : (((((A2(r, 9003, 9083) || A2(r, 9085, 9114)) || A2(r, 9140, 9179)) || A2(r, 9186, 9254)) || A2(r, 9280, 9290)) ? $elm$core$Maybe$Just(29) : (((e(9084) || A2(r, 9115, 9139)) || A2(r, 9180, 9185)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))))))))))) : (l(65114) ? (l(42594) ? (l(11490) ? (l(11381) ? (l(10630) ? (l(10099) ? (l(9839) ? ((A2(r, 9312, 9371) || A2(r, 9450, 9471)) ? $elm$core$Maybe$Just(8) : (((((A2(r, 9372, 9449) || A2(r, 9472, 9654)) || A2(r, 9656, 9664)) || A2(r, 9666, 9719)) || A2(r, 9728, 9838)) ? $elm$core$Maybe$Just(29) : (((e(9655) || e(9665)) || A2(r, 9720, 9727)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))) : (l(10091) ? (e(9839) ? $elm$core$Maybe$Just(26) : (A2(r, 9840, 10087) ? $elm$core$Maybe$Just(29) : ((e(10088) || e(10090)) ? $elm$core$Maybe$Just(21) : (e(10089) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))) : ((((e(10091) || e(10093)) || e(10095)) || e(10097)) ? $elm$core$Maybe$Just(22) : ((((e(10092) || e(10094)) || e(10096)) || e(10098)) ? $elm$core$Maybe$Just(21) : $elm$core$Maybe$Nothing)))) : (l(10216) ? ((((e(10099) || e(10101)) || e(10182)) || e(10215)) ? $elm$core$Maybe$Just(22) : (((e(10100) || e(10181)) || e(10214)) ? $elm$core$Maybe$Just(21) : (A2(r, 10102, 10131) ? $elm$core$Maybe$Just(8) : (A2(r, 10132, 10175) ? $elm$core$Maybe$Just(29) : ((A2(r, 10176, 10180) || A2(r, 10183, 10213)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))))) : (l(10222) ? (((e(10216) || e(10218)) || e(10220)) ? $elm$core$Maybe$Just(21) : (((e(10217) || e(10219)) || e(10221)) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)) : (((e(10222) || e(10627)) || e(10629)) ? $elm$core$Maybe$Just(21) : ((e(10223) || e(10628)) ? $elm$core$Maybe$Just(22) : ((A2(r, 10224, 10239) || A2(r, 10496, 10626)) ? $elm$core$Maybe$Just(26) : (A2(r, 10240, 10495) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))))) : (l(10747) ? (l(10641) ? ((((((e(10630) || e(10632)) || e(10634)) || e(10636)) || e(10638)) || e(10640)) ? $elm$core$Maybe$Just(22) : (((((e(10631) || e(10633)) || e(10635)) || e(10637)) || e(10639)) ? $elm$core$Maybe$Just(21) : $elm$core$Maybe$Nothing)) : (l(10647) ? (((e(10641) || e(10643)) || e(10645)) ? $elm$core$Maybe$Just(21) : (((e(10642) || e(10644)) || e(10646)) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)) : (((e(10647) || e(10712)) || e(10714)) ? $elm$core$Maybe$Just(21) : (((e(10648) || e(10713)) || e(10715)) ? $elm$core$Maybe$Just(22) : ((A2(r, 10649, 10711) || A2(r, 10716, 10746)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))))) : (l(11359) ? (l(11076) ? (((e(10747) || A2(r, 10750, 11007)) || A2(r, 11056, 11075)) ? $elm$core$Maybe$Just(26) : (e(10748) ? $elm$core$Maybe$Just(21) : (e(10749) ? $elm$core$Maybe$Just(22) : (A2(r, 11008, 11055) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing)))) : ((e(11076) || A2(r, 11079, 11084)) ? $elm$core$Maybe$Just(26) : ((((A2(r, 11077, 11078) || A2(r, 11085, 11123)) || A2(r, 11126, 11157)) || A2(r, 11159, 11263)) ? $elm$core$Maybe$Just(29) : (A2(r, 11264, 11311) ? $elm$core$Maybe$Just(0) : (A2(r, 11312, 11358) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))) : (l(11368) ? (((e(11359) || e(11361)) || A2(r, 11365, 11366)) ? $elm$core$Maybe$Just(1) : (((e(11360) || A2(r, 11362, 11364)) || e(11367)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(11368) || e(11370)) || e(11372)) || e(11377)) || A2(r, 11379, 11380)) ? $elm$core$Maybe$Just(1) : ((((e(11369) || e(11371)) || A2(r, 11373, 11376)) || e(11378)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))))) : (l(11438) ? (l(11412) ? (l(11399) ? (((((e(11381) || A2(r, 11390, 11392)) || e(11394)) || e(11396)) || e(11398)) ? $elm$core$Maybe$Just(0) : ((((A2(r, 11382, 11387) || e(11393)) || e(11395)) || e(11397)) ? $elm$core$Maybe$Just(1) : (A2(r, 11388, 11389) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing))) : (l(11404) ? (((e(11399) || e(11401)) || e(11403)) ? $elm$core$Maybe$Just(1) : ((e(11400) || e(11402)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(11404) || e(11406)) || e(11408)) || e(11410)) ? $elm$core$Maybe$Just(0) : ((((e(11405) || e(11407)) || e(11409)) || e(11411)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(11424) ? ((((((e(11412) || e(11414)) || e(11416)) || e(11418)) || e(11420)) || e(11422)) ? $elm$core$Maybe$Just(0) : ((((((e(11413) || e(11415)) || e(11417)) || e(11419)) || e(11421)) || e(11423)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(11430) ? (((e(11424) || e(11426)) || e(11428)) ? $elm$core$Maybe$Just(0) : (((e(11425) || e(11427)) || e(11429)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(11430) || e(11432)) || e(11434)) || e(11436)) ? $elm$core$Maybe$Just(0) : ((((e(11431) || e(11433)) || e(11435)) || e(11437)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))) : (l(11463) ? (l(11449) ? ((((((e(11438) || e(11440)) || e(11442)) || e(11444)) || e(11446)) || e(11448)) ? $elm$core$Maybe$Just(0) : (((((e(11439) || e(11441)) || e(11443)) || e(11445)) || e(11447)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(11455) ? (((e(11449) || e(11451)) || e(11453)) ? $elm$core$Maybe$Just(1) : (((e(11450) || e(11452)) || e(11454)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(11455) || e(11457)) || e(11459)) || e(11461)) ? $elm$core$Maybe$Just(1) : ((((e(11456) || e(11458)) || e(11460)) || e(11462)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(11475) ? ((((((e(11463) || e(11465)) || e(11467)) || e(11469)) || e(11471)) || e(11473)) ? $elm$core$Maybe$Just(1) : ((((((e(11464) || e(11466)) || e(11468)) || e(11470)) || e(11472)) || e(11474)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(11481) ? (((e(11475) || e(11477)) || e(11479)) ? $elm$core$Maybe$Just(1) : (((e(11476) || e(11478)) || e(11480)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(11481) || e(11483)) || e(11485)) || e(11487)) || e(11489)) ? $elm$core$Maybe$Just(1) : ((((e(11482) || e(11484)) || e(11486)) || e(11488)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))))))) : (l(12308) ? (l(11808) ? (l(11703) ? (l(11517) ? ((((e(11490) || e(11499)) || e(11501)) || e(11506)) ? $elm$core$Maybe$Just(0) : ((((A2(r, 11491, 11492) || e(11500)) || e(11502)) || e(11507)) ? $elm$core$Maybe$Just(1) : (A2(r, 11493, 11498) ? $elm$core$Maybe$Just(29) : (A2(r, 11503, 11505) ? $elm$core$Maybe$Just(3) : (A2(r, 11513, 11516) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (l(11630) ? (e(11517) ? $elm$core$Maybe$Just(8) : (A2(r, 11518, 11519) ? $elm$core$Maybe$Just(25) : (((A2(r, 11520, 11557) || e(11559)) || e(11565)) ? $elm$core$Maybe$Just(1) : (A2(r, 11568, 11623) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (e(11631) ? $elm$core$Maybe$Just(17) : (e(11632) ? $elm$core$Maybe$Just(25) : (e(11647) ? $elm$core$Maybe$Just(3) : ((((A2(r, 11648, 11670) || A2(r, 11680, 11686)) || A2(r, 11688, 11694)) || A2(r, 11696, 11702)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))) : (l(11784) ? (((((A2(r, 11704, 11710) || A2(r, 11712, 11718)) || A2(r, 11720, 11726)) || A2(r, 11728, 11734)) || A2(r, 11736, 11742)) ? $elm$core$Maybe$Just(18) : (A2(r, 11744, 11775) ? $elm$core$Maybe$Just(3) : ((A2(r, 11776, 11777) || A2(r, 11782, 11783)) ? $elm$core$Maybe$Just(25) : ((e(11778) || e(11780)) ? $elm$core$Maybe$Just(23) : ((e(11779) || e(11781)) ? $elm$core$Maybe$Just(24) : $elm$core$Maybe$Nothing))))) : (l(11798) ? (((e(11784) || e(11787)) || A2(r, 11790, 11797)) ? $elm$core$Maybe$Just(25) : ((e(11785) || e(11788)) ? $elm$core$Maybe$Just(23) : ((e(11786) || e(11789)) ? $elm$core$Maybe$Just(24) : $elm$core$Maybe$Nothing))) : ((((e(11798) || A2(r, 11800, 11801)) || e(11803)) || A2(r, 11806, 11807)) ? $elm$core$Maybe$Just(25) : ((e(11799) || e(11802)) ? $elm$core$Maybe$Just(20) : (e(11804) ? $elm$core$Maybe$Just(23) : (e(11805) ? $elm$core$Maybe$Just(24) : $elm$core$Maybe$Nothing))))))) : (l(11864) ? (l(11823) ? (e(11808) ? $elm$core$Maybe$Just(23) : (e(11809) ? $elm$core$Maybe$Just(24) : ((((e(11810) || e(11812)) || e(11814)) || e(11816)) ? $elm$core$Maybe$Just(21) : ((((e(11811) || e(11813)) || e(11815)) || e(11817)) ? $elm$core$Maybe$Just(22) : (A2(r, 11818, 11822) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (l(11841) ? (e(11823) ? $elm$core$Maybe$Just(17) : ((A2(r, 11824, 11833) || A2(r, 11836, 11839)) ? $elm$core$Maybe$Just(25) : ((A2(r, 11834, 11835) || e(11840)) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))) : (((e(11841) || A2(r, 11843, 11855)) || A2(r, 11858, 11860)) ? $elm$core$Maybe$Just(25) : (((e(11842) || e(11861)) || e(11863)) ? $elm$core$Maybe$Just(21) : (A2(r, 11856, 11857) ? $elm$core$Maybe$Just(29) : (e(11862) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))))) : (l(12292) ? (((e(11864) || e(11866)) || e(11868)) ? $elm$core$Maybe$Just(22) : ((e(11865) || e(11867)) ? $elm$core$Maybe$Just(21) : (e(11869) ? $elm$core$Maybe$Just(20) : ((((A2(r, 11904, 11929) || A2(r, 11931, 12019)) || A2(r, 12032, 12245)) || A2(r, 12272, 12283)) ? $elm$core$Maybe$Just(29) : (e(12288) ? $elm$core$Maybe$Just(9) : (A2(r, 12289, 12291) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))) : (l(12298) ? (e(12292) ? $elm$core$Maybe$Just(29) : (e(12293) ? $elm$core$Maybe$Just(17) : (e(12294) ? $elm$core$Maybe$Just(18) : (e(12295) ? $elm$core$Maybe$Just(7) : (e(12296) ? $elm$core$Maybe$Just(21) : (e(12297) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))))) : ((((e(12298) || e(12300)) || e(12302)) || e(12304)) ? $elm$core$Maybe$Just(21) : ((((e(12299) || e(12301)) || e(12303)) || e(12305)) ? $elm$core$Maybe$Just(22) : (A2(r, 12306, 12307) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))))) : (l(12991) ? (l(12442) ? (l(12320) ? (((((e(12308) || e(12310)) || e(12312)) || e(12314)) || e(12317)) ? $elm$core$Maybe$Just(21) : (((((e(12309) || e(12311)) || e(12313)) || e(12315)) || A2(r, 12318, 12319)) ? $elm$core$Maybe$Just(22) : (e(12316) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))) : (l(12343) ? ((e(12320) || e(12342)) ? $elm$core$Maybe$Just(29) : (A2(r, 12321, 12329) ? $elm$core$Maybe$Just(7) : (A2(r, 12330, 12333) ? $elm$core$Maybe$Just(3) : (A2(r, 12334, 12335) ? $elm$core$Maybe$Just(4) : (e(12336) ? $elm$core$Maybe$Just(20) : (A2(r, 12337, 12341) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))))) : ((e(12343) || A2(r, 12350, 12351)) ? $elm$core$Maybe$Just(29) : (A2(r, 12344, 12346) ? $elm$core$Maybe$Just(7) : (e(12347) ? $elm$core$Maybe$Just(17) : ((e(12348) || A2(r, 12353, 12438)) ? $elm$core$Maybe$Just(18) : (e(12349) ? $elm$core$Maybe$Just(25) : (e(12441) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))))) : (l(12693) ? (l(12538) ? (e(12442) ? $elm$core$Maybe$Just(3) : (A2(r, 12443, 12444) ? $elm$core$Maybe$Just(28) : (A2(r, 12445, 12446) ? $elm$core$Maybe$Just(17) : ((e(12447) || A2(r, 12449, 12537)) ? $elm$core$Maybe$Just(18) : (e(12448) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))))) : ((((e(12538) || e(12543)) || A2(r, 12549, 12591)) || A2(r, 12593, 12686)) ? $elm$core$Maybe$Just(18) : (e(12539) ? $elm$core$Maybe$Just(25) : (A2(r, 12540, 12542) ? $elm$core$Maybe$Just(17) : (A2(r, 12688, 12689) ? $elm$core$Maybe$Just(29) : (A2(r, 12690, 12692) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing)))))) : (l(12841) ? ((e(12693) || A2(r, 12832, 12840)) ? $elm$core$Maybe$Just(8) : (((A2(r, 12694, 12703) || A2(r, 12736, 12771)) || A2(r, 12800, 12830)) ? $elm$core$Maybe$Just(29) : ((A2(r, 12704, 12735) || A2(r, 12784, 12799)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (((((e(12841) || A2(r, 12872, 12879)) || A2(r, 12881, 12895)) || A2(r, 12928, 12937)) || A2(r, 12977, 12990)) ? $elm$core$Maybe$Just(8) : ((((A2(r, 12842, 12871) || e(12880)) || A2(r, 12896, 12927)) || A2(r, 12938, 12976)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))) : (l(42566) ? (l(42237) ? (e(12991) ? $elm$core$Maybe$Just(8) : (((A2(r, 12992, 13311) || A2(r, 19904, 19967)) || A2(r, 42128, 42182)) ? $elm$core$Maybe$Just(29) : ((((((e(13312) || e(19903)) || e(19968)) || A2(r, 40959, 40980)) || A2(r, 40982, 42124)) || A2(r, 42192, 42231)) ? $elm$core$Maybe$Just(18) : ((e(40981) || A2(r, 42232, 42236)) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))) : (l(42537) ? ((e(42237) || e(42508)) ? $elm$core$Maybe$Just(17) : ((A2(r, 42238, 42239) || A2(r, 42509, 42511)) ? $elm$core$Maybe$Just(25) : ((A2(r, 42240, 42507) || A2(r, 42512, 42527)) ? $elm$core$Maybe$Just(18) : (A2(r, 42528, 42536) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : (e(42537) ? $elm$core$Maybe$Just(6) : (A2(r, 42538, 42539) ? $elm$core$Maybe$Just(18) : (((e(42560) || e(42562)) || e(42564)) ? $elm$core$Maybe$Just(0) : (((e(42561) || e(42563)) || e(42565)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))) : (l(42579) ? (l(42571) ? (((e(42566) || e(42568)) || e(42570)) ? $elm$core$Maybe$Just(0) : ((e(42567) || e(42569)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(42571) || e(42573)) || e(42575)) || e(42577)) ? $elm$core$Maybe$Just(1) : ((((e(42572) || e(42574)) || e(42576)) || e(42578)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : (l(42585) ? (((e(42579) || e(42581)) || e(42583)) ? $elm$core$Maybe$Just(1) : (((e(42580) || e(42582)) || e(42584)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(42585) || e(42587)) || e(42589)) || e(42591)) || e(42593)) ? $elm$core$Maybe$Just(1) : ((((e(42586) || e(42588)) || e(42590)) || e(42592)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))))))) : (l(42965) ? (l(42832) ? (l(42725) ? (l(42629) ? (l(42605) ? ((((((e(42594) || e(42596)) || e(42598)) || e(42600)) || e(42602)) || e(42604)) ? $elm$core$Maybe$Just(0) : (((((e(42595) || e(42597)) || e(42599)) || e(42601)) || e(42603)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(42621) ? (e(42605) ? $elm$core$Maybe$Just(1) : (e(42606) ? $elm$core$Maybe$Just(18) : ((e(42607) || A2(r, 42612, 42620)) ? $elm$core$Maybe$Just(3) : (A2(r, 42608, 42610) ? $elm$core$Maybe$Just(5) : (e(42611) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : (e(42621) ? $elm$core$Maybe$Just(3) : (e(42622) ? $elm$core$Maybe$Just(25) : (e(42623) ? $elm$core$Maybe$Just(17) : (((e(42624) || e(42626)) || e(42628)) ? $elm$core$Maybe$Just(0) : ((e(42625) || e(42627)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))))) : (l(42641) ? ((((((e(42629) || e(42631)) || e(42633)) || e(42635)) || e(42637)) || e(42639)) ? $elm$core$Maybe$Just(1) : ((((((e(42630) || e(42632)) || e(42634)) || e(42636)) || e(42638)) || e(42640)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(42647) ? (((e(42641) || e(42643)) || e(42645)) ? $elm$core$Maybe$Just(1) : (((e(42642) || e(42644)) || e(42646)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((e(42647) || e(42649)) || e(42651)) ? $elm$core$Maybe$Just(1) : ((e(42648) || e(42650)) ? $elm$core$Maybe$Just(0) : (A2(r, 42652, 42653) ? $elm$core$Maybe$Just(17) : (A2(r, 42654, 42655) ? $elm$core$Maybe$Just(3) : (A2(r, 42656, 42724) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))))) : (l(42805) ? (l(42790) ? (e(42725) ? $elm$core$Maybe$Just(18) : (A2(r, 42726, 42735) ? $elm$core$Maybe$Just(7) : (A2(r, 42736, 42737) ? $elm$core$Maybe$Just(3) : (A2(r, 42738, 42743) ? $elm$core$Maybe$Just(25) : ((A2(r, 42752, 42774) || A2(r, 42784, 42785)) ? $elm$core$Maybe$Just(28) : (A2(r, 42775, 42783) ? $elm$core$Maybe$Just(17) : ((e(42786) || e(42788)) ? $elm$core$Maybe$Just(0) : ((e(42787) || e(42789)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))))) : (l(42795) ? (((e(42790) || e(42792)) || e(42794)) ? $elm$core$Maybe$Just(0) : ((e(42791) || e(42793)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(42795) || e(42797)) || A2(r, 42799, 42801)) || e(42803)) ? $elm$core$Maybe$Just(1) : ((((e(42796) || e(42798)) || e(42802)) || e(42804)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (l(42817) ? ((((((e(42805) || e(42807)) || e(42809)) || e(42811)) || e(42813)) || e(42815)) ? $elm$core$Maybe$Just(1) : ((((((e(42806) || e(42808)) || e(42810)) || e(42812)) || e(42814)) || e(42816)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (l(42823) ? (((e(42817) || e(42819)) || e(42821)) ? $elm$core$Maybe$Just(1) : (((e(42818) || e(42820)) || e(42822)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : (((((e(42823) || e(42825)) || e(42827)) || e(42829)) || e(42831)) ? $elm$core$Maybe$Just(1) : ((((e(42824) || e(42826)) || e(42828)) || e(42830)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))))) : (l(42891) ? (l(42856) ? (l(42843) ? ((((((e(42832) || e(42834)) || e(42836)) || e(42838)) || e(42840)) || e(42842)) ? $elm$core$Maybe$Just(0) : (((((e(42833) || e(42835)) || e(42837)) || e(42839)) || e(42841)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(42848) ? (((e(42843) || e(42845)) || e(42847)) ? $elm$core$Maybe$Just(1) : ((e(42844) || e(42846)) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)) : ((((e(42848) || e(42850)) || e(42852)) || e(42854)) ? $elm$core$Maybe$Just(0) : ((((e(42849) || e(42851)) || e(42853)) || e(42855)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(42875) ? (((((e(42856) || e(42858)) || e(42860)) || e(42862)) || e(42873)) ? $elm$core$Maybe$Just(0) : ((((((e(42857) || e(42859)) || e(42861)) || e(42863)) || A2(r, 42865, 42872)) || e(42874)) ? $elm$core$Maybe$Just(1) : (e(42864) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing))) : (l(42882) ? (((e(42875) || A2(r, 42877, 42878)) || e(42880)) ? $elm$core$Maybe$Just(0) : (((e(42876) || e(42879)) || e(42881)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((e(42882) || e(42884)) || e(42886)) ? $elm$core$Maybe$Just(0) : (((e(42883) || e(42885)) || e(42887)) ? $elm$core$Maybe$Just(1) : (e(42888) ? $elm$core$Maybe$Just(17) : (A2(r, 42889, 42890) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing))))))) : (l(42918) ? (l(42904) ? (((((e(42891) || e(42893)) || e(42896)) || e(42898)) || e(42902)) ? $elm$core$Maybe$Just(0) : (((((e(42892) || e(42894)) || e(42897)) || A2(r, 42899, 42901)) || e(42903)) ? $elm$core$Maybe$Just(1) : (e(42895) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (l(42910) ? (((e(42904) || e(42906)) || e(42908)) ? $elm$core$Maybe$Just(0) : (((e(42905) || e(42907)) || e(42909)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(42910) || e(42912)) || e(42914)) || e(42916)) ? $elm$core$Maybe$Just(0) : ((((e(42911) || e(42913)) || e(42915)) || e(42917)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(42938) ? ((((((e(42918) || e(42920)) || A2(r, 42922, 42926)) || A2(r, 42928, 42932)) || e(42934)) || e(42936)) ? $elm$core$Maybe$Just(0) : ((((((e(42919) || e(42921)) || e(42927)) || e(42933)) || e(42935)) || e(42937)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(42944) ? (((e(42938) || e(42940)) || e(42942)) ? $elm$core$Maybe$Just(0) : (((e(42939) || e(42941)) || e(42943)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((((e(42944) || e(42946)) || A2(r, 42948, 42951)) || e(42953)) || e(42960)) ? $elm$core$Maybe$Just(0) : (((((e(42945) || e(42947)) || e(42952)) || e(42954)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && A2(r, 42961, 42964))) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))))) : (l(43738) ? (l(43391) ? (l(43064) ? (l(43010) ? (((e(42966) || e(42968)) || e(42997)) ? $elm$core$Maybe$Just(0) : (((((e(42967) || e(42969)) || e(42998)) || e(43002)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && e(42965))) ? $elm$core$Maybe$Just(1) : ((A2(r, 42994, 42996) || A2(r, 43000, 43001)) ? $elm$core$Maybe$Just(17) : ((e(42999) || A2(r, 43003, 43009)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (l(43042) ? (((e(43010) || e(43014)) || e(43019)) ? $elm$core$Maybe$Just(3) : (((A2(r, 43011, 43013) || A2(r, 43015, 43018)) || A2(r, 43020, 43041)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (e(43042) ? $elm$core$Maybe$Just(18) : ((A2(r, 43043, 43044) || e(43047)) ? $elm$core$Maybe$Just(4) : ((A2(r, 43045, 43046) || e(43052)) ? $elm$core$Maybe$Just(3) : ((A2(r, 43048, 43051) || A2(r, 43062, 43063)) ? $elm$core$Maybe$Just(29) : (A2(r, 43056, 43061) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing))))))) : (l(43258) ? (l(43187) ? (e(43064) ? $elm$core$Maybe$Just(27) : (e(43065) ? $elm$core$Maybe$Just(29) : ((A2(r, 43072, 43123) || A2(r, 43138, 43186)) ? $elm$core$Maybe$Just(18) : (A2(r, 43124, 43127) ? $elm$core$Maybe$Just(25) : (A2(r, 43136, 43137) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : ((e(43187) || A2(r, 43250, 43255)) ? $elm$core$Maybe$Just(18) : (A2(r, 43188, 43203) ? $elm$core$Maybe$Just(4) : ((A2(r, 43204, 43205) || A2(r, 43232, 43249)) ? $elm$core$Maybe$Just(3) : ((A2(r, 43214, 43215) || A2(r, 43256, 43257)) ? $elm$core$Maybe$Just(25) : (A2(r, 43216, 43225) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(43301) ? ((e(43258) || e(43260)) ? $elm$core$Maybe$Just(25) : (((e(43259) || A2(r, 43261, 43262)) || A2(r, 43274, 43300)) ? $elm$core$Maybe$Just(18) : (e(43263) ? $elm$core$Maybe$Just(3) : (A2(r, 43264, 43273) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : (((e(43301) || A2(r, 43312, 43334)) || A2(r, 43360, 43388)) ? $elm$core$Maybe$Just(18) : ((A2(r, 43302, 43309) || A2(r, 43335, 43345)) ? $elm$core$Maybe$Just(3) : ((A2(r, 43310, 43311) || e(43359)) ? $elm$core$Maybe$Just(25) : (A2(r, 43346, 43347) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(43583) ? (l(43485) ? ((((A2(r, 43392, 43394) || e(43443)) || A2(r, 43446, 43449)) || A2(r, 43452, 43453)) ? $elm$core$Maybe$Just(3) : ((((e(43395) || A2(r, 43444, 43445)) || A2(r, 43450, 43451)) || A2(r, 43454, 43456)) ? $elm$core$Maybe$Just(4) : (A2(r, 43396, 43442) ? $elm$core$Maybe$Just(18) : (A2(r, 43457, 43469) ? $elm$core$Maybe$Just(25) : (e(43471) ? $elm$core$Maybe$Just(17) : (A2(r, 43472, 43481) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(43513) ? (A2(r, 43486, 43487) ? $elm$core$Maybe$Just(25) : ((A2(r, 43488, 43492) || A2(r, 43495, 43503)) ? $elm$core$Maybe$Just(18) : (e(43493) ? $elm$core$Maybe$Just(3) : (e(43494) ? $elm$core$Maybe$Just(17) : (A2(r, 43504, 43512) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (e(43513) ? $elm$core$Maybe$Just(6) : ((A2(r, 43514, 43518) || A2(r, 43520, 43560)) ? $elm$core$Maybe$Just(18) : (((A2(r, 43561, 43566) || A2(r, 43569, 43570)) || A2(r, 43573, 43574)) ? $elm$core$Maybe$Just(3) : ((A2(r, 43567, 43568) || A2(r, 43571, 43572)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))) : (l(43643) ? (((((A2(r, 43584, 43586) || A2(r, 43588, 43595)) || A2(r, 43616, 43631)) || A2(r, 43633, 43638)) || e(43642)) ? $elm$core$Maybe$Just(18) : ((e(43587) || e(43596)) ? $elm$core$Maybe$Just(3) : (e(43597) ? $elm$core$Maybe$Just(4) : (A2(r, 43600, 43609) ? $elm$core$Maybe$Just(6) : (A2(r, 43612, 43615) ? $elm$core$Maybe$Just(25) : (e(43632) ? $elm$core$Maybe$Just(17) : (A2(r, 43639, 43641) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))))) : (l(43700) ? ((e(43643) || e(43645)) ? $elm$core$Maybe$Just(4) : (((e(43644) || e(43696)) || A2(r, 43698, 43699)) ? $elm$core$Maybe$Just(3) : ((A2(r, 43646, 43695) || e(43697)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : ((((e(43700) || A2(r, 43703, 43704)) || A2(r, 43710, 43711)) || e(43713)) ? $elm$core$Maybe$Just(3) : ((((A2(r, 43701, 43702) || A2(r, 43705, 43709)) || e(43712)) || e(43714)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))) : (l(64297) ? (l(44002) ? (l(43776) ? (((A2(r, 43739, 43740) || A2(r, 43744, 43754)) || e(43762)) ? $elm$core$Maybe$Just(18) : ((e(43741) || A2(r, 43763, 43764)) ? $elm$core$Maybe$Just(17) : ((A2(r, 43742, 43743) || A2(r, 43760, 43761)) ? $elm$core$Maybe$Just(25) : (((e(43755) || A2(r, 43758, 43759)) || e(43765)) ? $elm$core$Maybe$Just(4) : ((A2(r, 43756, 43757) || e(43766)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))) : (l(43866) ? (((((A2(r, 43777, 43782) || A2(r, 43785, 43790)) || A2(r, 43793, 43798)) || A2(r, 43808, 43814)) || A2(r, 43816, 43822)) ? $elm$core$Maybe$Just(18) : (A2(r, 43824, 43865) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (((e(43866) || A2(r, 43872, 43880)) || A2(r, 43888, 43967)) ? $elm$core$Maybe$Just(1) : ((e(43867) || A2(r, 43882, 43883)) ? $elm$core$Maybe$Just(28) : ((A2(r, 43868, 43871) || e(43881)) ? $elm$core$Maybe$Just(17) : (A2(r, 43968, 44001) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))) : (l(55242) ? (l(44010) ? (e(44002) ? $elm$core$Maybe$Just(18) : (((A2(r, 44003, 44004) || A2(r, 44006, 44007)) || e(44009)) ? $elm$core$Maybe$Just(4) : ((e(44005) || e(44008)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : ((e(44010) || e(44012)) ? $elm$core$Maybe$Just(4) : (e(44011) ? $elm$core$Maybe$Just(25) : (e(44013) ? $elm$core$Maybe$Just(3) : (A2(r, 44016, 44025) ? $elm$core$Maybe$Just(6) : (((e(44032) || e(55203)) || A2(r, 55216, 55238)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))) : (l(63743) ? (A2(r, 55243, 55291) ? $elm$core$Maybe$Just(18) : ((((e(55296) || A2(r, 56191, 56192)) || A2(r, 56319, 56320)) || e(57343)) ? $elm$core$Maybe$Just(14) : (A2(r, 57344, 63742) ? $elm$core$Maybe$Just(15) : $elm$core$Maybe$Nothing))) : (e(63743) ? $elm$core$Maybe$Just(15) : ((((A2(r, 63744, 64109) || A2(r, 64112, 64217)) || e(64285)) || A2(r, 64287, 64296)) ? $elm$core$Maybe$Just(18) : ((A2(r, 64256, 64262) || A2(r, 64275, 64279)) ? $elm$core$Maybe$Just(1) : (e(64286) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))))) : (l(65074) ? (l(64913) ? (l(64325) ? (e(64297) ? $elm$core$Maybe$Just(26) : (((((A2(r, 64298, 64310) || A2(r, 64312, 64316)) || e(64318)) || A2(r, 64320, 64321)) || A2(r, 64323, 64324)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (((A2(r, 64326, 64433) || A2(r, 64467, 64829)) || A2(r, 64848, 64911)) ? $elm$core$Maybe$Just(18) : (A2(r, 64434, 64450) ? $elm$core$Maybe$Just(28) : (e(64830) ? $elm$core$Maybe$Just(22) : (e(64831) ? $elm$core$Maybe$Just(21) : (A2(r, 64832, 64847) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing)))))) : (l(65039) ? ((A2(r, 64914, 64967) || A2(r, 65008, 65019)) ? $elm$core$Maybe$Just(18) : ((e(64975) || A2(r, 65021, 65023)) ? $elm$core$Maybe$Just(29) : (e(65020) ? $elm$core$Maybe$Just(27) : (A2(r, 65024, 65038) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : ((e(65039) || A2(r, 65056, 65071)) ? $elm$core$Maybe$Just(3) : (((A2(r, 65040, 65046) || e(65049)) || e(65072)) ? $elm$core$Maybe$Just(25) : (e(65047) ? $elm$core$Maybe$Just(21) : (e(65048) ? $elm$core$Maybe$Just(22) : (e(65073) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))))))) : (l(65087) ? (e(65074) ? $elm$core$Maybe$Just(20) : (A2(r, 65075, 65076) ? $elm$core$Maybe$Just(19) : (((((e(65077) || e(65079)) || e(65081)) || e(65083)) || e(65085)) ? $elm$core$Maybe$Just(21) : (((((e(65078) || e(65080)) || e(65082)) || e(65084)) || e(65086)) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))) : (l(65094) ? (((e(65087) || e(65089)) || e(65091)) ? $elm$core$Maybe$Just(21) : (((e(65088) || e(65090)) || e(65092)) ? $elm$core$Maybe$Just(22) : (e(65093) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))) : ((((e(65094) || A2(r, 65097, 65100)) || A2(r, 65104, 65106)) || A2(r, 65108, 65111)) ? $elm$core$Maybe$Just(25) : ((e(65095) || e(65113)) ? $elm$core$Maybe$Just(21) : (e(65096) ? $elm$core$Maybe$Just(22) : (A2(r, 65101, 65103) ? $elm$core$Maybe$Just(19) : (e(65112) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing)))))))))))) : (l(72002) ? (l(69460) ? (l(66511) ? (l(65437) ? (l(65295) ? (l(65135) ? (((e(65114) || e(65116)) || e(65118)) ? $elm$core$Maybe$Just(22) : ((e(65115) || e(65117)) ? $elm$core$Maybe$Just(21) : (((A2(r, 65119, 65121) || e(65128)) || A2(r, 65130, 65131)) ? $elm$core$Maybe$Just(25) : ((e(65122) || A2(r, 65124, 65126)) ? $elm$core$Maybe$Just(26) : (e(65123) ? $elm$core$Maybe$Just(20) : (e(65129) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing)))))) : (l(65287) ? ((A2(r, 65136, 65140) || A2(r, 65142, 65276)) ? $elm$core$Maybe$Just(18) : (e(65279) ? $elm$core$Maybe$Just(13) : ((A2(r, 65281, 65283) || A2(r, 65285, 65286)) ? $elm$core$Maybe$Just(25) : (e(65284) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing)))) : ((((e(65287) || e(65290)) || e(65292)) || e(65294)) ? $elm$core$Maybe$Just(25) : (e(65288) ? $elm$core$Maybe$Just(21) : (e(65289) ? $elm$core$Maybe$Just(22) : (e(65291) ? $elm$core$Maybe$Just(26) : (e(65293) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))))))) : (l(65370) ? (l(65338) ? (((e(65295) || A2(r, 65306, 65307)) || A2(r, 65311, 65312)) ? $elm$core$Maybe$Just(25) : (A2(r, 65296, 65305) ? $elm$core$Maybe$Just(6) : (A2(r, 65308, 65310) ? $elm$core$Maybe$Just(26) : (A2(r, 65313, 65337) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (e(65338) ? $elm$core$Maybe$Just(0) : (e(65339) ? $elm$core$Maybe$Just(21) : (e(65340) ? $elm$core$Maybe$Just(25) : (e(65341) ? $elm$core$Maybe$Just(22) : ((e(65342) || e(65344)) ? $elm$core$Maybe$Just(28) : (e(65343) ? $elm$core$Maybe$Just(19) : (A2(r, 65345, 65369) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))))) : (l(65376) ? (e(65370) ? $elm$core$Maybe$Just(1) : ((e(65371) || e(65375)) ? $elm$core$Maybe$Just(21) : ((e(65372) || e(65374)) ? $elm$core$Maybe$Just(26) : (e(65373) ? $elm$core$Maybe$Just(22) : $elm$core$Maybe$Nothing)))) : ((e(65376) || e(65379)) ? $elm$core$Maybe$Just(22) : ((e(65377) || A2(r, 65380, 65381)) ? $elm$core$Maybe$Just(25) : (e(65378) ? $elm$core$Maybe$Just(21) : ((A2(r, 65382, 65391) || A2(r, 65393, 65436)) ? $elm$core$Maybe$Just(18) : (e(65392) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))))))) : (l(65846) ? (l(65512) ? ((((((e(65437) || A2(r, 65440, 65470)) || A2(r, 65474, 65479)) || A2(r, 65482, 65487)) || A2(r, 65490, 65495)) || A2(r, 65498, 65500)) ? $elm$core$Maybe$Just(18) : (A2(r, 65438, 65439) ? $elm$core$Maybe$Just(17) : ((A2(r, 65504, 65505) || A2(r, 65509, 65510)) ? $elm$core$Maybe$Just(27) : (e(65506) ? $elm$core$Maybe$Just(26) : (e(65507) ? $elm$core$Maybe$Just(28) : (e(65508) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing)))))) : (l(65575) ? (((e(65512) || A2(r, 65517, 65518)) || A2(r, 65532, 65533)) ? $elm$core$Maybe$Just(29) : (A2(r, 65513, 65516) ? $elm$core$Maybe$Just(26) : (A2(r, 65529, 65531) ? $elm$core$Maybe$Just(13) : ((A2(r, 65536, 65547) || A2(r, 65549, 65574)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (((((A2(r, 65576, 65594) || A2(r, 65596, 65597)) || A2(r, 65599, 65613)) || A2(r, 65616, 65629)) || A2(r, 65664, 65786)) ? $elm$core$Maybe$Just(18) : (A2(r, 65792, 65794) ? $elm$core$Maybe$Just(25) : (A2(r, 65799, 65843) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing))))) : (l(66272) ? ((((((A2(r, 65847, 65855) || A2(r, 65913, 65929)) || A2(r, 65932, 65934)) || A2(r, 65936, 65948)) || e(65952)) || A2(r, 66000, 66044)) ? $elm$core$Maybe$Just(29) : (A2(r, 65856, 65908) ? $elm$core$Maybe$Just(7) : ((A2(r, 65909, 65912) || A2(r, 65930, 65931)) ? $elm$core$Maybe$Just(8) : (e(66045) ? $elm$core$Maybe$Just(3) : ((A2(r, 66176, 66204) || A2(r, 66208, 66256)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(66377) ? (e(66272) ? $elm$core$Maybe$Just(3) : ((A2(r, 66273, 66299) || A2(r, 66336, 66339)) ? $elm$core$Maybe$Just(8) : (((A2(r, 66304, 66335) || A2(r, 66349, 66368)) || A2(r, 66370, 66376)) ? $elm$core$Maybe$Just(18) : (e(66369) ? $elm$core$Maybe$Just(7) : $elm$core$Maybe$Nothing)))) : (((((e(66377) || A2(r, 66384, 66421)) || A2(r, 66432, 66461)) || A2(r, 66464, 66499)) || A2(r, 66504, 66510)) ? $elm$core$Maybe$Just(18) : (e(66378) ? $elm$core$Maybe$Just(7) : (A2(r, 66422, 66426) ? $elm$core$Maybe$Just(3) : (e(66463) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))))) : (l(68049) ? (l(67505) ? (l(66927) ? ((((e(66511) || A2(r, 66640, 66717)) || A2(r, 66816, 66855)) || A2(r, 66864, 66915)) ? $elm$core$Maybe$Just(18) : (e(66512) ? $elm$core$Maybe$Just(25) : (A2(r, 66513, 66517) ? $elm$core$Maybe$Just(7) : ((A2(r, 66560, 66599) || A2(r, 66736, 66771)) ? $elm$core$Maybe$Just(0) : ((A2(r, 66600, 66639) || A2(r, 66776, 66811)) ? $elm$core$Maybe$Just(1) : (A2(r, 66720, 66729) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(66994) ? (e(66927) ? $elm$core$Maybe$Just(25) : ((((A2(r, 66928, 66938) || A2(r, 66940, 66954)) || A2(r, 66956, 66962)) || A2(r, 66964, 66965)) ? $elm$core$Maybe$Just(0) : ((A2(r, 66967, 66977) || A2(r, 66979, 66993)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))) : ((A2(r, 66995, 67001) || A2(r, 67003, 67004)) ? $elm$core$Maybe$Just(1) : (((A2(r, 67072, 67382) || A2(r, 67392, 67413)) || A2(r, 67424, 67431)) ? $elm$core$Maybe$Just(18) : ((A2(r, 67456, 67461) || A2(r, 67463, 67504)) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing))))) : (l(67750) ? (l(67646) ? (A2(r, 67506, 67514) ? $elm$core$Maybe$Just(17) : (((((A2(r, 67584, 67589) || e(67592)) || A2(r, 67594, 67637)) || A2(r, 67639, 67640)) || e(67644)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (((A2(r, 67647, 67669) || A2(r, 67680, 67702)) || A2(r, 67712, 67742)) ? $elm$core$Maybe$Just(18) : (e(67671) ? $elm$core$Maybe$Just(25) : ((A2(r, 67672, 67679) || A2(r, 67705, 67711)) ? $elm$core$Maybe$Just(8) : (A2(r, 67703, 67704) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))))) : (l(67870) ? (((A2(r, 67751, 67759) || A2(r, 67835, 67839)) || A2(r, 67862, 67867)) ? $elm$core$Maybe$Just(8) : (((A2(r, 67808, 67826) || A2(r, 67828, 67829)) || A2(r, 67840, 67861)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : ((e(67871) || e(67903)) ? $elm$core$Maybe$Just(25) : (((A2(r, 67872, 67897) || A2(r, 67968, 68023)) || A2(r, 68030, 68031)) ? $elm$core$Maybe$Just(18) : ((A2(r, 68028, 68029) || A2(r, 68032, 68047)) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing)))))) : (l(68415) ? (l(68191) ? ((A2(r, 68050, 68095) || A2(r, 68160, 68168)) ? $elm$core$Maybe$Just(8) : ((((e(68096) || A2(r, 68112, 68115)) || A2(r, 68117, 68119)) || A2(r, 68121, 68149)) ? $elm$core$Maybe$Just(18) : (((((A2(r, 68097, 68099) || A2(r, 68101, 68102)) || A2(r, 68108, 68111)) || A2(r, 68152, 68154)) || e(68159)) ? $elm$core$Maybe$Just(3) : (A2(r, 68176, 68184) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))) : (l(68295) ? (((A2(r, 68192, 68220) || A2(r, 68224, 68252)) || A2(r, 68288, 68294)) ? $elm$core$Maybe$Just(18) : ((A2(r, 68221, 68222) || A2(r, 68253, 68255)) ? $elm$core$Maybe$Just(8) : (e(68223) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))) : (((e(68295) || A2(r, 68297, 68324)) || A2(r, 68352, 68405)) ? $elm$core$Maybe$Just(18) : (e(68296) ? $elm$core$Maybe$Just(29) : (A2(r, 68325, 68326) ? $elm$core$Maybe$Just(3) : (A2(r, 68331, 68335) ? $elm$core$Maybe$Just(8) : ((A2(r, 68336, 68342) || A2(r, 68409, 68414)) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))))) : (l(68899) ? (l(68504) ? (e(68415) ? $elm$core$Maybe$Just(25) : (((A2(r, 68416, 68437) || A2(r, 68448, 68466)) || A2(r, 68480, 68497)) ? $elm$core$Maybe$Just(18) : ((A2(r, 68440, 68447) || A2(r, 68472, 68479)) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing))) : (A2(r, 68505, 68508) ? $elm$core$Maybe$Just(25) : ((A2(r, 68521, 68527) || A2(r, 68858, 68863)) ? $elm$core$Maybe$Just(8) : ((A2(r, 68608, 68680) || A2(r, 68864, 68898)) ? $elm$core$Maybe$Just(18) : (A2(r, 68736, 68786) ? $elm$core$Maybe$Just(0) : (A2(r, 68800, 68850) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))))) : (l(69295) ? ((e(68899) || A2(r, 69248, 69289)) ? $elm$core$Maybe$Just(18) : ((A2(r, 68900, 68903) || A2(r, 69291, 69292)) ? $elm$core$Maybe$Just(3) : (A2(r, 68912, 68921) ? $elm$core$Maybe$Just(6) : (A2(r, 69216, 69246) ? $elm$core$Maybe$Just(8) : (e(69293) ? $elm$core$Maybe$Just(20) : $elm$core$Maybe$Nothing))))) : ((((A2(r, 69296, 69297) || A2(r, 69376, 69404)) || e(69415)) || A2(r, 69424, 69445)) ? $elm$core$Maybe$Just(18) : ((A2(r, 69373, 69375) || A2(r, 69446, 69456)) ? $elm$core$Maybe$Just(3) : ((A2(r, 69405, 69414) || A2(r, 69457, 69459)) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing)))))))) : (l(70464) ? (l(70018) ? (l(69810) ? (l(69687) ? ((e(69460) || A2(r, 69573, 69579)) ? $elm$core$Maybe$Just(8) : ((A2(r, 69461, 69465) || A2(r, 69510, 69513)) ? $elm$core$Maybe$Just(25) : ((((A2(r, 69488, 69505) || A2(r, 69552, 69572)) || A2(r, 69600, 69622)) || A2(r, 69635, 69686)) ? $elm$core$Maybe$Just(18) : ((A2(r, 69506, 69509) || e(69633)) ? $elm$core$Maybe$Just(3) : ((e(69632) || e(69634)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(69744) ? (e(69687) ? $elm$core$Maybe$Just(18) : (A2(r, 69688, 69702) ? $elm$core$Maybe$Just(3) : (A2(r, 69703, 69709) ? $elm$core$Maybe$Just(25) : (A2(r, 69714, 69733) ? $elm$core$Maybe$Just(8) : (A2(r, 69734, 69743) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (((e(69744) || A2(r, 69747, 69748)) || A2(r, 69759, 69761)) ? $elm$core$Maybe$Just(3) : (((A2(r, 69745, 69746) || e(69749)) || A2(r, 69763, 69807)) ? $elm$core$Maybe$Just(18) : ((e(69762) || A2(r, 69808, 69809)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(69926) ? (l(69821) ? ((e(69810) || A2(r, 69815, 69816)) ? $elm$core$Maybe$Just(4) : ((A2(r, 69811, 69814) || A2(r, 69817, 69818)) ? $elm$core$Maybe$Just(3) : (A2(r, 69819, 69820) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))) : ((e(69821) || e(69837)) ? $elm$core$Maybe$Just(13) : (A2(r, 69822, 69825) ? $elm$core$Maybe$Just(25) : ((e(69826) || A2(r, 69888, 69890)) ? $elm$core$Maybe$Just(3) : ((A2(r, 69840, 69864) || A2(r, 69891, 69925)) ? $elm$core$Maybe$Just(18) : (A2(r, 69872, 69881) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(69956) ? (e(69926) ? $elm$core$Maybe$Just(18) : ((A2(r, 69927, 69931) || A2(r, 69933, 69940)) ? $elm$core$Maybe$Just(3) : (e(69932) ? $elm$core$Maybe$Just(4) : (A2(r, 69942, 69951) ? $elm$core$Maybe$Just(6) : (A2(r, 69952, 69955) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))) : ((((e(69956) || e(69959)) || A2(r, 69968, 70002)) || e(70006)) ? $elm$core$Maybe$Just(18) : (A2(r, 69957, 69958) ? $elm$core$Maybe$Just(4) : ((e(70003) || A2(r, 70016, 70017)) ? $elm$core$Maybe$Just(3) : (A2(r, 70004, 70005) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))))))) : (l(70199) ? (l(70105) ? ((((e(70018) || A2(r, 70067, 70069)) || A2(r, 70079, 70080)) || e(70094)) ? $elm$core$Maybe$Just(4) : ((A2(r, 70019, 70066) || A2(r, 70081, 70084)) ? $elm$core$Maybe$Just(18) : (((A2(r, 70070, 70078) || A2(r, 70089, 70092)) || e(70095)) ? $elm$core$Maybe$Just(3) : ((A2(r, 70085, 70088) || e(70093)) ? $elm$core$Maybe$Just(25) : (A2(r, 70096, 70104) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (l(70162) ? (e(70105) ? $elm$core$Maybe$Just(6) : (((e(70106) || e(70108)) || A2(r, 70144, 70161)) ? $elm$core$Maybe$Just(18) : ((e(70107) || A2(r, 70109, 70111)) ? $elm$core$Maybe$Just(25) : (A2(r, 70113, 70132) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing)))) : (A2(r, 70163, 70187) ? $elm$core$Maybe$Just(18) : (((A2(r, 70188, 70190) || A2(r, 70194, 70195)) || e(70197)) ? $elm$core$Maybe$Just(4) : (((A2(r, 70191, 70193) || e(70196)) || e(70198)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))) : (l(70367) ? (((e(70199) || e(70206)) || e(70209)) ? $elm$core$Maybe$Just(3) : ((A2(r, 70200, 70205) || e(70313)) ? $elm$core$Maybe$Just(25) : (((((((A2(r, 70207, 70208) || A2(r, 70272, 70278)) || e(70280)) || A2(r, 70282, 70285)) || A2(r, 70287, 70301)) || A2(r, 70303, 70312)) || A2(r, 70320, 70366)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (l(70414) ? (((e(70367) || A2(r, 70371, 70378)) || A2(r, 70400, 70401)) ? $elm$core$Maybe$Just(3) : ((A2(r, 70368, 70370) || A2(r, 70402, 70403)) ? $elm$core$Maybe$Just(4) : (A2(r, 70384, 70393) ? $elm$core$Maybe$Just(6) : (A2(r, 70405, 70412) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : ((((((A2(r, 70415, 70416) || A2(r, 70419, 70440)) || A2(r, 70442, 70448)) || A2(r, 70450, 70451)) || A2(r, 70453, 70457)) || e(70461)) ? $elm$core$Maybe$Just(18) : (A2(r, 70459, 70460) ? $elm$core$Maybe$Just(3) : (A2(r, 70462, 70463) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(71228) ? (l(70831) ? (l(70711) ? (((e(70464) || A2(r, 70502, 70508)) || A2(r, 70512, 70516)) ? $elm$core$Maybe$Just(3) : ((((((A2(r, 70465, 70468) || A2(r, 70471, 70472)) || A2(r, 70475, 70477)) || e(70487)) || A2(r, 70498, 70499)) || A2(r, 70709, 70710)) ? $elm$core$Maybe$Just(4) : (((e(70480) || A2(r, 70493, 70497)) || A2(r, 70656, 70708)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (l(70730) ? (((e(70711) || A2(r, 70720, 70721)) || e(70725)) ? $elm$core$Maybe$Just(4) : (((A2(r, 70712, 70719) || A2(r, 70722, 70724)) || e(70726)) ? $elm$core$Maybe$Just(3) : (A2(r, 70727, 70729) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (((e(70730) || A2(r, 70751, 70753)) || A2(r, 70784, 70830)) ? $elm$core$Maybe$Just(18) : (((A2(r, 70731, 70735) || A2(r, 70746, 70747)) || e(70749)) ? $elm$core$Maybe$Just(25) : (A2(r, 70736, 70745) ? $elm$core$Maybe$Just(6) : (e(70750) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))))) : (l(71039) ? (l(70846) ? (e(70831) ? $elm$core$Maybe$Just(18) : (((A2(r, 70832, 70834) || e(70841)) || A2(r, 70843, 70845)) ? $elm$core$Maybe$Just(4) : ((A2(r, 70835, 70840) || e(70842)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : ((e(70846) || e(70849)) ? $elm$core$Maybe$Just(4) : ((A2(r, 70847, 70848) || A2(r, 70850, 70851)) ? $elm$core$Maybe$Just(3) : ((A2(r, 70852, 70853) || e(70855)) ? $elm$core$Maybe$Just(18) : (e(70854) ? $elm$core$Maybe$Just(25) : (A2(r, 70864, 70873) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(71104) ? (A2(r, 71040, 71086) ? $elm$core$Maybe$Just(18) : (((A2(r, 71087, 71089) || A2(r, 71096, 71099)) || e(71102)) ? $elm$core$Maybe$Just(4) : (((A2(r, 71090, 71093) || A2(r, 71100, 71101)) || e(71103)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : (((e(71104) || A2(r, 71132, 71133)) || A2(r, 71219, 71226)) ? $elm$core$Maybe$Just(3) : (A2(r, 71105, 71127) ? $elm$core$Maybe$Just(25) : ((A2(r, 71128, 71131) || A2(r, 71168, 71215)) ? $elm$core$Maybe$Just(18) : ((A2(r, 71216, 71218) || e(71227)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))))) : (l(71481) ? (l(71343) ? (l(71247) ? ((e(71228) || e(71230)) ? $elm$core$Maybe$Just(4) : ((e(71229) || A2(r, 71231, 71232)) ? $elm$core$Maybe$Just(3) : (A2(r, 71233, 71235) ? $elm$core$Maybe$Just(25) : (e(71236) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))) : (A2(r, 71248, 71257) ? $elm$core$Maybe$Just(6) : (A2(r, 71264, 71276) ? $elm$core$Maybe$Just(25) : (A2(r, 71296, 71338) ? $elm$core$Maybe$Just(18) : ((e(71339) || e(71341)) ? $elm$core$Maybe$Just(3) : ((e(71340) || e(71342)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))) : (l(71423) ? ((e(71343) || e(71350)) ? $elm$core$Maybe$Just(4) : ((A2(r, 71344, 71349) || e(71351)) ? $elm$core$Maybe$Just(3) : (e(71352) ? $elm$core$Maybe$Just(18) : (e(71353) ? $elm$core$Maybe$Just(25) : (A2(r, 71360, 71369) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (A2(r, 71424, 71450) ? $elm$core$Maybe$Just(18) : (((A2(r, 71453, 71455) || A2(r, 71458, 71461)) || A2(r, 71463, 71467)) ? $elm$core$Maybe$Just(3) : ((A2(r, 71456, 71457) || e(71462)) ? $elm$core$Maybe$Just(4) : (A2(r, 71472, 71480) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))))) : (l(71913) ? (l(71726) ? (e(71481) ? $elm$core$Maybe$Just(6) : (A2(r, 71482, 71483) ? $elm$core$Maybe$Just(8) : (A2(r, 71484, 71486) ? $elm$core$Maybe$Just(25) : (e(71487) ? $elm$core$Maybe$Just(29) : ((A2(r, 71488, 71494) || A2(r, 71680, 71723)) ? $elm$core$Maybe$Just(18) : (A2(r, 71724, 71725) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing)))))) : ((e(71726) || e(71736)) ? $elm$core$Maybe$Just(4) : ((A2(r, 71727, 71735) || A2(r, 71737, 71738)) ? $elm$core$Maybe$Just(3) : (e(71739) ? $elm$core$Maybe$Just(25) : (A2(r, 71840, 71871) ? $elm$core$Maybe$Just(0) : (A2(r, 71872, 71903) ? $elm$core$Maybe$Just(1) : (A2(r, 71904, 71912) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))))) : (l(71983) ? (e(71913) ? $elm$core$Maybe$Just(6) : (A2(r, 71914, 71922) ? $elm$core$Maybe$Just(8) : (((((A2(r, 71935, 71942) || e(71945)) || A2(r, 71948, 71955)) || A2(r, 71957, 71958)) || A2(r, 71960, 71982)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (((e(71983) || e(71999)) || e(72001)) ? $elm$core$Maybe$Just(18) : ((((A2(r, 71984, 71989) || A2(r, 71991, 71992)) || e(71997)) || e(72000)) ? $elm$core$Maybe$Just(4) : ((A2(r, 71995, 71996) || e(71998)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))))))) : (l(119969) ? (l(73727) ? (l(72849) ? (l(72272) ? (l(72161) ? (((e(72002) || A2(r, 72145, 72147)) || A2(r, 72156, 72159)) ? $elm$core$Maybe$Just(4) : ((((e(72003) || A2(r, 72148, 72151)) || A2(r, 72154, 72155)) || e(72160)) ? $elm$core$Maybe$Just(3) : (A2(r, 72004, 72006) ? $elm$core$Maybe$Just(25) : (A2(r, 72016, 72025) ? $elm$core$Maybe$Just(6) : ((A2(r, 72096, 72103) || A2(r, 72106, 72144)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(72202) ? (((e(72161) || e(72163)) || e(72192)) ? $elm$core$Maybe$Just(18) : (e(72162) ? $elm$core$Maybe$Just(25) : (e(72164) ? $elm$core$Maybe$Just(4) : (A2(r, 72193, 72201) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing)))) : ((((e(72202) || A2(r, 72243, 72248)) || A2(r, 72251, 72254)) || e(72263)) ? $elm$core$Maybe$Just(3) : ((A2(r, 72203, 72242) || e(72250)) ? $elm$core$Maybe$Just(18) : (e(72249) ? $elm$core$Maybe$Just(4) : (A2(r, 72255, 72262) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))) : (l(72703) ? (l(72342) ? ((e(72272) || A2(r, 72284, 72329)) ? $elm$core$Maybe$Just(18) : (((A2(r, 72273, 72278) || A2(r, 72281, 72283)) || A2(r, 72330, 72341)) ? $elm$core$Maybe$Just(3) : (A2(r, 72279, 72280) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))) : ((e(72342) || A2(r, 72344, 72345)) ? $elm$core$Maybe$Just(3) : (e(72343) ? $elm$core$Maybe$Just(4) : (((A2(r, 72346, 72348) || A2(r, 72350, 72354)) || A2(r, 72448, 72457)) ? $elm$core$Maybe$Just(25) : ((e(72349) || A2(r, 72368, 72440)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(72766) ? ((A2(r, 72704, 72712) || A2(r, 72714, 72750)) ? $elm$core$Maybe$Just(18) : (e(72751) ? $elm$core$Maybe$Just(4) : ((A2(r, 72752, 72758) || A2(r, 72760, 72765)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : (e(72766) ? $elm$core$Maybe$Just(4) : (e(72767) ? $elm$core$Maybe$Just(3) : ((e(72768) || A2(r, 72818, 72847)) ? $elm$core$Maybe$Just(18) : ((A2(r, 72769, 72773) || A2(r, 72816, 72817)) ? $elm$core$Maybe$Just(25) : (A2(r, 72784, 72793) ? $elm$core$Maybe$Just(6) : (A2(r, 72794, 72812) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing))))))))) : (l(73110) ? (l(73019) ? ((((((A2(r, 72850, 72871) || A2(r, 72874, 72880)) || A2(r, 72882, 72883)) || A2(r, 72885, 72886)) || A2(r, 73009, 73014)) || e(73018)) ? $elm$core$Maybe$Just(3) : (((e(72873) || e(72881)) || e(72884)) ? $elm$core$Maybe$Just(4) : (((A2(r, 72960, 72966) || A2(r, 72968, 72969)) || A2(r, 72971, 73008)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (((((A2(r, 73020, 73021) || A2(r, 73023, 73029)) || e(73031)) || A2(r, 73104, 73105)) || e(73109)) ? $elm$core$Maybe$Just(3) : ((((e(73030) || A2(r, 73056, 73061)) || A2(r, 73063, 73064)) || A2(r, 73066, 73097)) ? $elm$core$Maybe$Just(18) : (A2(r, 73040, 73049) ? $elm$core$Maybe$Just(6) : ((A2(r, 73098, 73102) || A2(r, 73107, 73108)) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(73523) ? (l(73460) ? (e(73110) ? $elm$core$Maybe$Just(4) : ((e(73111) || e(73459)) ? $elm$core$Maybe$Just(3) : ((e(73112) || A2(r, 73440, 73458)) ? $elm$core$Maybe$Just(18) : (A2(r, 73120, 73129) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : ((e(73460) || A2(r, 73472, 73473)) ? $elm$core$Maybe$Just(3) : ((A2(r, 73461, 73462) || e(73475)) ? $elm$core$Maybe$Just(4) : (A2(r, 73463, 73464) ? $elm$core$Maybe$Just(25) : (((e(73474) || A2(r, 73476, 73488)) || A2(r, 73490, 73522)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(73538) ? (e(73523) ? $elm$core$Maybe$Just(18) : (((A2(r, 73524, 73525) || A2(r, 73534, 73535)) || e(73537)) ? $elm$core$Maybe$Just(4) : ((A2(r, 73526, 73530) || e(73536)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))) : (e(73538) ? $elm$core$Maybe$Just(3) : (A2(r, 73539, 73551) ? $elm$core$Maybe$Just(25) : (A2(r, 73552, 73561) ? $elm$core$Maybe$Just(6) : (e(73648) ? $elm$core$Maybe$Just(18) : (A2(r, 73664, 73684) ? $elm$core$Maybe$Just(8) : ((A2(r, 73685, 73692) || A2(r, 73697, 73713)) ? $elm$core$Maybe$Just(29) : (A2(r, 73693, 73696) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing))))))))))) : (l(101631) ? (l(92987) ? (l(82943) ? (((e(73727) || A2(r, 74864, 74868)) || A2(r, 77809, 77810)) ? $elm$core$Maybe$Just(25) : (((((A2(r, 73728, 74649) || A2(r, 74880, 75075)) || A2(r, 77712, 77808)) || A2(r, 77824, 78895)) || A2(r, 78913, 78918)) ? $elm$core$Maybe$Just(18) : (A2(r, 74752, 74862) ? $elm$core$Maybe$Just(7) : (A2(r, 78896, 78911) ? $elm$core$Maybe$Just(13) : ((e(78912) || A2(r, 78919, 78933)) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))) : (l(92863) ? ((((A2(r, 82944, 83526) || A2(r, 92160, 92728)) || A2(r, 92736, 92766)) || A2(r, 92784, 92862)) ? $elm$core$Maybe$Just(18) : (A2(r, 92768, 92777) ? $elm$core$Maybe$Just(6) : (A2(r, 92782, 92783) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing))) : (A2(r, 92864, 92873) ? $elm$core$Maybe$Just(6) : ((A2(r, 92880, 92909) || A2(r, 92928, 92975)) ? $elm$core$Maybe$Just(18) : ((A2(r, 92912, 92916) || A2(r, 92976, 92982)) ? $elm$core$Maybe$Just(3) : ((e(92917) || A2(r, 92983, 92986)) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))) : (l(93951) ? (l(93018) ? ((e(92987) || e(92996)) ? $elm$core$Maybe$Just(25) : ((A2(r, 92988, 92991) || e(92997)) ? $elm$core$Maybe$Just(29) : (A2(r, 92992, 92995) ? $elm$core$Maybe$Just(17) : (A2(r, 93008, 93017) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : ((A2(r, 93019, 93025) || A2(r, 93824, 93846)) ? $elm$core$Maybe$Just(8) : ((A2(r, 93027, 93047) || A2(r, 93053, 93071)) ? $elm$core$Maybe$Just(18) : (A2(r, 93760, 93791) ? $elm$core$Maybe$Just(0) : (A2(r, 93792, 93823) ? $elm$core$Maybe$Just(1) : (A2(r, 93847, 93850) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))) : (l(94177) ? ((A2(r, 93952, 94026) || e(94032)) ? $elm$core$Maybe$Just(18) : ((e(94031) || A2(r, 94095, 94098)) ? $elm$core$Maybe$Just(3) : (A2(r, 94033, 94087) ? $elm$core$Maybe$Just(4) : ((A2(r, 94099, 94111) || e(94176)) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)))) : ((e(94177) || e(94179)) ? $elm$core$Maybe$Just(17) : (e(94178) ? $elm$core$Maybe$Just(25) : (e(94180) ? $elm$core$Maybe$Just(3) : (A2(r, 94192, 94193) ? $elm$core$Maybe$Just(4) : (((e(94208) || e(100343)) || A2(r, 100352, 101589)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)))))))) : (l(119142) ? (l(113791) ? (l(110897) ? (((e(101632) || e(101640)) || A2(r, 110592, 110882)) ? $elm$core$Maybe$Just(18) : (((A2(r, 110576, 110579) || A2(r, 110581, 110587)) || A2(r, 110589, 110590)) ? $elm$core$Maybe$Just(17) : $elm$core$Maybe$Nothing)) : (((((((e(110898) || A2(r, 110928, 110930)) || e(110933)) || A2(r, 110948, 110951)) || A2(r, 110960, 111355)) || A2(r, 113664, 113770)) || A2(r, 113776, 113788)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (l(118527) ? ((A2(r, 113792, 113800) || A2(r, 113808, 113817)) ? $elm$core$Maybe$Just(18) : (e(113820) ? $elm$core$Maybe$Just(29) : (A2(r, 113821, 113822) ? $elm$core$Maybe$Just(3) : (e(113823) ? $elm$core$Maybe$Just(25) : (A2(r, 113824, 113827) ? $elm$core$Maybe$Just(13) : $elm$core$Maybe$Nothing))))) : ((A2(r, 118528, 118573) || A2(r, 118576, 118598)) ? $elm$core$Maybe$Just(3) : ((((A2(r, 118608, 118723) || A2(r, 118784, 119029)) || A2(r, 119040, 119078)) || A2(r, 119081, 119140)) ? $elm$core$Maybe$Just(29) : (e(119141) ? $elm$core$Maybe$Just(4) : $elm$core$Maybe$Nothing))))) : (l(119364) ? (l(119170) ? ((e(119142) || A2(r, 119149, 119154)) ? $elm$core$Maybe$Just(4) : ((A2(r, 119143, 119145) || A2(r, 119163, 119169)) ? $elm$core$Maybe$Just(3) : (A2(r, 119146, 119148) ? $elm$core$Maybe$Just(29) : (A2(r, 119155, 119162) ? $elm$core$Maybe$Just(13) : $elm$core$Maybe$Nothing)))) : ((((e(119170) || A2(r, 119173, 119179)) || A2(r, 119210, 119213)) || A2(r, 119362, 119363)) ? $elm$core$Maybe$Just(3) : ((((A2(r, 119171, 119172) || A2(r, 119180, 119209)) || A2(r, 119214, 119274)) || A2(r, 119296, 119361)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))) : (l(119833) ? (e(119364) ? $elm$core$Maybe$Just(3) : ((e(119365) || A2(r, 119552, 119638)) ? $elm$core$Maybe$Just(29) : (((A2(r, 119488, 119507) || A2(r, 119520, 119539)) || A2(r, 119648, 119672)) ? $elm$core$Maybe$Just(8) : (A2(r, 119808, 119832) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing)))) : (((((e(119833) || A2(r, 119860, 119885)) || A2(r, 119912, 119937)) || e(119964)) || A2(r, 119966, 119967)) ? $elm$core$Maybe$Just(0) : ((((A2(r, 119834, 119859) || A2(r, 119886, 119892)) || A2(r, 119894, 119911)) || A2(r, 119938, 119963)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing))))))) : (l(124908) ? (l(120712) ? (l(120275) ? (l(120076) ? (((((((e(119970) || A2(r, 119973, 119974)) || A2(r, 119977, 119980)) || A2(r, 119982, 119989)) || A2(r, 120016, 120041)) || A2(r, 120068, 120069)) || A2(r, 120071, 120074)) ? $elm$core$Maybe$Just(0) : (((((A2(r, 119990, 119993) || e(119995)) || A2(r, 119997, 120003)) || A2(r, 120005, 120015)) || A2(r, 120042, 120067)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : (l(120133) ? (((((A2(r, 120077, 120084) || A2(r, 120086, 120092)) || A2(r, 120120, 120121)) || A2(r, 120123, 120126)) || A2(r, 120128, 120132)) ? $elm$core$Maybe$Just(0) : (A2(r, 120094, 120119) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)) : ((((e(120134) || A2(r, 120138, 120144)) || A2(r, 120172, 120197)) || A2(r, 120224, 120249)) ? $elm$core$Maybe$Just(0) : (((A2(r, 120146, 120171) || A2(r, 120198, 120223)) || A2(r, 120250, 120274)) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing)))) : (l(120539) ? ((((((e(120275) || A2(r, 120302, 120327)) || A2(r, 120354, 120379)) || A2(r, 120406, 120431)) || A2(r, 120458, 120485)) || A2(r, 120514, 120538)) ? $elm$core$Maybe$Just(1) : (((((A2(r, 120276, 120301) || A2(r, 120328, 120353)) || A2(r, 120380, 120405)) || A2(r, 120432, 120457)) || A2(r, 120488, 120512)) ? $elm$core$Maybe$Just(0) : (e(120513) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing))) : (l(120603) ? (((e(120539) || e(120571)) || e(120597)) ? $elm$core$Maybe$Just(26) : (((A2(r, 120540, 120545) || A2(r, 120572, 120596)) || A2(r, 120598, 120602)) ? $elm$core$Maybe$Just(1) : (A2(r, 120546, 120570) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : ((((e(120603) || A2(r, 120630, 120654)) || A2(r, 120656, 120661)) || A2(r, 120688, 120711)) ? $elm$core$Maybe$Just(1) : ((A2(r, 120604, 120628) || A2(r, 120662, 120686)) ? $elm$core$Maybe$Just(0) : (((e(120629) || e(120655)) || e(120687)) ? $elm$core$Maybe$Just(26) : $elm$core$Maybe$Nothing)))))) : (l(122660) ? (l(121398) ? (l(120770) ? (((e(120712) || A2(r, 120714, 120719)) || A2(r, 120746, 120769)) ? $elm$core$Maybe$Just(1) : ((e(120713) || e(120745)) ? $elm$core$Maybe$Just(26) : (A2(r, 120720, 120744) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing))) : (((e(120770) || A2(r, 120772, 120777)) || e(120779)) ? $elm$core$Maybe$Just(1) : (e(120771) ? $elm$core$Maybe$Just(26) : (e(120778) ? $elm$core$Maybe$Just(0) : (A2(r, 120782, 120831) ? $elm$core$Maybe$Just(6) : (A2(r, 120832, 121343) ? $elm$core$Maybe$Just(29) : (A2(r, 121344, 121397) ? $elm$core$Maybe$Just(3) : $elm$core$Maybe$Nothing))))))) : (l(121476) ? (((e(121398) || A2(r, 121403, 121452)) || e(121461)) ? $elm$core$Maybe$Just(3) : (((A2(r, 121399, 121402) || A2(r, 121453, 121460)) || A2(r, 121462, 121475)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing)) : (((e(121476) || A2(r, 121499, 121503)) || A2(r, 121505, 121519)) ? $elm$core$Maybe$Just(3) : (A2(r, 121477, 121478) ? $elm$core$Maybe$Just(29) : (A2(r, 121479, 121483) ? $elm$core$Maybe$Just(25) : ((A2(r, 122624, 122633) || A2(r, 122635, 122654)) ? $elm$core$Maybe$Just(1) : (e(122634) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))))) : (l(123214) ? (A2(r, 122661, 122666) ? $elm$core$Maybe$Just(1) : (((((((A2(r, 122880, 122886) || A2(r, 122888, 122904)) || A2(r, 122907, 122913)) || A2(r, 122915, 122916)) || A2(r, 122918, 122922)) || e(123023)) || A2(r, 123184, 123190)) ? $elm$core$Maybe$Just(3) : ((A2(r, 122928, 122989) || A2(r, 123191, 123197)) ? $elm$core$Maybe$Just(17) : (A2(r, 123136, 123180) ? $elm$core$Maybe$Just(18) : (A2(r, 123200, 123209) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))) : (l(123646) ? (((e(123214) || A2(r, 123536, 123565)) || A2(r, 123584, 123627)) ? $elm$core$Maybe$Just(18) : (e(123215) ? $elm$core$Maybe$Just(29) : ((e(123566) || A2(r, 123628, 123631)) ? $elm$core$Maybe$Just(3) : (A2(r, 123632, 123641) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing)))) : (e(123647) ? $elm$core$Maybe$Just(27) : (((A2(r, 124112, 124138) || A2(r, 124896, 124902)) || A2(r, 124904, 124907)) ? $elm$core$Maybe$Just(18) : (e(124139) ? $elm$core$Maybe$Just(17) : (A2(r, 124140, 124143) ? $elm$core$Maybe$Just(3) : (A2(r, 124144, 124153) ? $elm$core$Maybe$Just(6) : $elm$core$Maybe$Nothing))))))))) : (l(127461) ? (l(126515) ? (l(126123) ? (((A2(r, 124909, 124910) || A2(r, 124912, 124926)) || A2(r, 124928, 125124)) ? $elm$core$Maybe$Just(18) : ((A2(r, 125127, 125135) || A2(r, 126065, 126122)) ? $elm$core$Maybe$Just(8) : ((A2(r, 125136, 125142) || A2(r, 125252, 125258)) ? $elm$core$Maybe$Just(3) : (A2(r, 125184, 125217) ? $elm$core$Maybe$Just(0) : (A2(r, 125218, 125251) ? $elm$core$Maybe$Just(1) : (e(125259) ? $elm$core$Maybe$Just(17) : (A2(r, 125264, 125273) ? $elm$core$Maybe$Just(6) : (A2(r, 125278, 125279) ? $elm$core$Maybe$Just(25) : $elm$core$Maybe$Nothing)))))))) : (l(126254) ? ((((e(126123) || A2(r, 126125, 126127)) || A2(r, 126129, 126132)) || A2(r, 126209, 126253)) ? $elm$core$Maybe$Just(8) : (e(126124) ? $elm$core$Maybe$Just(29) : (e(126128) ? $elm$core$Maybe$Just(27) : $elm$core$Maybe$Nothing))) : (e(126254) ? $elm$core$Maybe$Just(29) : (A2(r, 126255, 126269) ? $elm$core$Maybe$Just(8) : ((((((A2(r, 126464, 126467) || A2(r, 126469, 126495)) || A2(r, 126497, 126498)) || e(126500)) || e(126503)) || A2(r, 126505, 126514)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))))) : (l(126602) ? (l(126563) ? (((((((A2(r, 126516, 126519) || e(126530)) || A2(r, 126541, 126543)) || A2(r, 126545, 126546)) || e(126548)) || A2(r, 126561, 126562)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && ((A2(r, 126521, 126523) || A2(r, 126535, 126539)) || A2(r, 126551, 126559)))) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing) : (((((((e(126564) || A2(r, 126567, 126570)) || A2(r, 126572, 126578)) || A2(r, 126580, 126583)) || A2(r, 126585, 126588)) || e(126590)) || A2(r, 126592, 126601)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing)) : (l(127023) ? ((((A2(r, 126603, 126619) || A2(r, 126625, 126627)) || A2(r, 126629, 126633)) || A2(r, 126635, 126651)) ? $elm$core$Maybe$Just(18) : (A2(r, 126704, 126705) ? $elm$core$Maybe$Just(26) : (A2(r, 126976, 127019) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))) : ((((((A2(r, 127024, 127123) || A2(r, 127136, 127150)) || A2(r, 127153, 127167)) || A2(r, 127169, 127183)) || A2(r, 127185, 127221)) || A2(r, 127245, 127405)) ? $elm$core$Maybe$Just(29) : (A2(r, 127232, 127244) ? $elm$core$Maybe$Just(8) : $elm$core$Maybe$Nothing))))) : (l(129726) ? (l(128991) ? (((((((((((A2(r, 127462, 127490) || A2(r, 127504, 127547)) || A2(r, 127552, 127560)) || A2(r, 127568, 127569)) || A2(r, 127584, 127589)) || A2(r, 127744, 127994)) || A2(r, 128000, 128727)) || A2(r, 128732, 128748)) || A2(r, 128752, 128764)) || A2(r, 128768, 128886)) || A2(r, 128891, 128985)) ? $elm$core$Maybe$Just(29) : (A2(r, 127995, 127999) ? $elm$core$Maybe$Just(28) : $elm$core$Maybe$Nothing)) : (l(129167) ? ((((((A2(r, 128992, 129003) || e(129008)) || A2(r, 129024, 129035)) || A2(r, 129040, 129095)) || A2(r, 129104, 129113)) || A2(r, 129120, 129159)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing) : (((((((A2(r, 129168, 129197) || A2(r, 129200, 129201)) || A2(r, 129280, 129619)) || A2(r, 129632, 129645)) || A2(r, 129648, 129660)) || A2(r, 129664, 129672)) || A2(r, 129680, 129725)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing))) : (l(178207) ? (l(130031) ? ((((((A2(r, 129727, 129733) || A2(r, 129742, 129755)) || A2(r, 129760, 129768)) || A2(r, 129776, 129784)) || A2(r, 129792, 129938)) || A2(r, 129940, 129994)) ? $elm$core$Maybe$Just(29) : $elm$core$Maybe$Nothing) : (A2(r, 130032, 130041) ? $elm$core$Maybe$Just(6) : ((((((e(131072) || e(173791)) || e(173824)) || e(177977)) || e(177984)) || e(178205)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing))) : (l(201545) ? ((((((e(178208) || e(183969)) || e(183984)) || e(191456)) || A2(r, 194560, 195101)) || e(196608)) ? $elm$core$Maybe$Just(18) : $elm$core$Maybe$Nothing) : (((e(201546) || e(201552)) || e(205743)) ? $elm$core$Maybe$Just(18) : ((e(917505) || A2(r, 917536, 917631)) ? $elm$core$Maybe$Just(13) : (A2(r, 917760, 917999) ? $elm$core$Maybe$Just(3) : (A2(r, 983040, 1114109) ? $elm$core$Maybe$Just(15) : $elm$core$Maybe$Nothing)))))))))))));
};
var $miniBill$elm_unicode$Unicode$isAlpha = function (c) {
	var code = $elm$core$Char$toCode(c);
	var e = function (hex) {
		return _Utils_eq(hex, code);
	};
	var l = function (hex) {
		return _Utils_cmp(code, hex) < 0;
	};
	var r = F2(
		function (from, to) {
			return (_Utils_cmp(from, code) < 1) && (_Utils_cmp(code, to) < 1);
		});
	return l(256) ? (((((((A2(r, 65, 90) || A2(r, 97, 122)) || e(170)) || e(181)) || e(186)) || A2(r, 192, 214)) || A2(r, 216, 246)) || A2(r, 248, 255)) : (l(43587) ? (l(4255) ? (l(2808) ? (l(2143) ? (l(1567) ? (l(907) ? (((((((((A2(r, 256, 705) || A2(r, 710, 721)) || A2(r, 736, 740)) || A2(r, 880, 884)) || A2(r, 886, 887)) || A2(r, 890, 893)) || e(895)) || e(902)) || A2(r, 904, 906)) || ((!A2($elm$core$Basics$modBy, 2, code)) && A2(r, 748, 750))) : (((((((((e(908) || A2(r, 910, 929)) || A2(r, 931, 1013)) || A2(r, 1015, 1153)) || A2(r, 1162, 1327)) || A2(r, 1329, 1366)) || e(1369)) || A2(r, 1376, 1416)) || A2(r, 1488, 1514)) || A2(r, 1519, 1522))) : (l(1868) ? (((((((((A2(r, 1568, 1610) || A2(r, 1646, 1647)) || A2(r, 1649, 1747)) || e(1749)) || A2(r, 1765, 1766)) || A2(r, 1774, 1775)) || A2(r, 1786, 1788)) || e(1791)) || e(1808)) || A2(r, 1810, 1839)) : (((((((((A2(r, 1869, 1957) || e(1969)) || A2(r, 1994, 2026)) || A2(r, 2036, 2037)) || e(2042)) || A2(r, 2048, 2069)) || e(2074)) || e(2084)) || e(2088)) || A2(r, 2112, 2136)))) : (l(2555) ? (l(2446) ? (((((((((A2(r, 2144, 2154) || A2(r, 2160, 2183)) || A2(r, 2185, 2190)) || A2(r, 2208, 2249)) || A2(r, 2308, 2361)) || e(2365)) || e(2384)) || A2(r, 2392, 2401)) || A2(r, 2417, 2432)) || A2(r, 2437, 2444)) : (((((((((A2(r, 2447, 2448) || A2(r, 2451, 2472)) || A2(r, 2474, 2480)) || e(2482)) || A2(r, 2486, 2489)) || e(2493)) || e(2510)) || A2(r, 2524, 2525)) || A2(r, 2527, 2529)) || A2(r, 2544, 2545))) : (l(2673) ? (((((((((e(2556) || A2(r, 2565, 2570)) || A2(r, 2575, 2576)) || A2(r, 2579, 2600)) || A2(r, 2602, 2608)) || A2(r, 2610, 2611)) || A2(r, 2613, 2614)) || A2(r, 2616, 2617)) || A2(r, 2649, 2652)) || e(2654)) : (((((((((A2(r, 2674, 2676) || A2(r, 2693, 2701)) || A2(r, 2703, 2705)) || A2(r, 2707, 2728)) || A2(r, 2730, 2736)) || A2(r, 2738, 2739)) || A2(r, 2741, 2745)) || e(2749)) || e(2768)) || A2(r, 2784, 2785))))) : (l(3331) ? (l(2989) ? (l(2928) ? (((((((((e(2809) || A2(r, 2821, 2828)) || A2(r, 2831, 2832)) || A2(r, 2835, 2856)) || A2(r, 2858, 2864)) || A2(r, 2866, 2867)) || A2(r, 2869, 2873)) || e(2877)) || A2(r, 2908, 2909)) || A2(r, 2911, 2913)) : (((((((((e(2929) || e(2947)) || A2(r, 2949, 2954)) || A2(r, 2958, 2960)) || A2(r, 2962, 2965)) || A2(r, 2969, 2970)) || e(2972)) || A2(r, 2974, 2975)) || A2(r, 2979, 2980)) || A2(r, 2984, 2986))) : (l(3199) ? (((((((((A2(r, 2990, 3001) || e(3024)) || A2(r, 3077, 3084)) || A2(r, 3086, 3088)) || A2(r, 3090, 3112)) || A2(r, 3114, 3129)) || e(3133)) || A2(r, 3160, 3162)) || e(3165)) || A2(r, 3168, 3169)) : (((((((((e(3200) || A2(r, 3205, 3212)) || A2(r, 3214, 3216)) || A2(r, 3218, 3240)) || A2(r, 3242, 3251)) || A2(r, 3253, 3257)) || e(3261)) || A2(r, 3293, 3294)) || A2(r, 3296, 3297)) || A2(r, 3313, 3314)))) : (l(3748) ? (l(3506) ? (((((((((A2(r, 3332, 3340) || A2(r, 3342, 3344)) || A2(r, 3346, 3386)) || e(3389)) || e(3406)) || A2(r, 3412, 3414)) || A2(r, 3423, 3425)) || A2(r, 3450, 3455)) || A2(r, 3461, 3478)) || A2(r, 3482, 3505)) : (((((((((A2(r, 3507, 3515) || e(3517)) || A2(r, 3520, 3526)) || A2(r, 3585, 3632)) || A2(r, 3634, 3635)) || A2(r, 3648, 3654)) || A2(r, 3713, 3714)) || e(3716)) || A2(r, 3718, 3722)) || A2(r, 3724, 3747))) : (l(3975) ? (((((((((e(3749) || A2(r, 3751, 3760)) || A2(r, 3762, 3763)) || e(3773)) || A2(r, 3776, 3780)) || e(3782)) || A2(r, 3804, 3807)) || e(3840)) || A2(r, 3904, 3911)) || A2(r, 3913, 3948)) : (((((((((A2(r, 3976, 3980) || A2(r, 4096, 4138)) || e(4159)) || A2(r, 4176, 4181)) || A2(r, 4186, 4189)) || e(4193)) || A2(r, 4197, 4198)) || A2(r, 4206, 4208)) || A2(r, 4213, 4225)) || e(4238)))))) : (l(8177) ? (l(6313) ? (l(4887) ? (l(4703) ? ((((((((A2(r, 4256, 4293) || e(4295)) || e(4301)) || A2(r, 4304, 4346)) || A2(r, 4348, 4680)) || A2(r, 4682, 4685)) || A2(r, 4688, 4694)) || e(4696)) || A2(r, 4698, 4701)) : (((((((((A2(r, 4704, 4744) || A2(r, 4746, 4749)) || A2(r, 4752, 4784)) || A2(r, 4786, 4789)) || A2(r, 4792, 4798)) || e(4800)) || A2(r, 4802, 4805)) || A2(r, 4808, 4822)) || A2(r, 4824, 4880)) || A2(r, 4882, 4885))) : (l(5918) ? (((((((((A2(r, 4888, 4954) || A2(r, 4992, 5007)) || A2(r, 5024, 5109)) || A2(r, 5112, 5117)) || A2(r, 5121, 5740)) || A2(r, 5743, 5759)) || A2(r, 5761, 5786)) || A2(r, 5792, 5866)) || A2(r, 5873, 5880)) || A2(r, 5888, 5905)) : (((((((((A2(r, 5919, 5937) || A2(r, 5952, 5969)) || A2(r, 5984, 5996)) || A2(r, 5998, 6000)) || A2(r, 6016, 6067)) || e(6103)) || e(6108)) || A2(r, 6176, 6264)) || A2(r, 6272, 6276)) || A2(r, 6279, 6312)))) : (l(7356) ? (l(6916) ? (((((((((e(6314) || A2(r, 6320, 6389)) || A2(r, 6400, 6430)) || A2(r, 6480, 6509)) || A2(r, 6512, 6516)) || A2(r, 6528, 6571)) || A2(r, 6576, 6601)) || A2(r, 6656, 6678)) || A2(r, 6688, 6740)) || e(6823)) : (((((((((A2(r, 6917, 6963) || A2(r, 6981, 6988)) || A2(r, 7043, 7072)) || A2(r, 7086, 7087)) || A2(r, 7098, 7141)) || A2(r, 7168, 7203)) || A2(r, 7245, 7247)) || A2(r, 7258, 7293)) || A2(r, 7296, 7304)) || A2(r, 7312, 7354))) : (l(8015) ? (((((((((A2(r, 7357, 7359) || A2(r, 7401, 7404)) || A2(r, 7406, 7411)) || A2(r, 7413, 7414)) || e(7418)) || A2(r, 7424, 7615)) || A2(r, 7680, 7957)) || A2(r, 7960, 7965)) || A2(r, 7968, 8005)) || A2(r, 8008, 8013)) : ((((((((((A2(r, 8016, 8023) || A2(r, 8032, 8061)) || A2(r, 8064, 8116)) || A2(r, 8118, 8124)) || e(8126)) || A2(r, 8130, 8132)) || A2(r, 8134, 8140)) || A2(r, 8144, 8147)) || A2(r, 8150, 8155)) || A2(r, 8160, 8172)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && A2(r, 8025, 8031)))))) : (l(12539) ? (l(11558) ? (l(8489) ? ((((((((((A2(r, 8178, 8180) || A2(r, 8182, 8188)) || e(8305)) || e(8319)) || A2(r, 8336, 8348)) || e(8450)) || e(8455)) || A2(r, 8458, 8467)) || e(8469)) || A2(r, 8473, 8477)) || ((!A2($elm$core$Basics$modBy, 2, code)) && A2(r, 8484, 8488))) : (((((((((A2(r, 8490, 8493) || A2(r, 8495, 8505)) || A2(r, 8508, 8511)) || A2(r, 8517, 8521)) || e(8526)) || A2(r, 8579, 8580)) || A2(r, 11264, 11492)) || A2(r, 11499, 11502)) || A2(r, 11506, 11507)) || A2(r, 11520, 11557))) : (l(11719) ? (((((((((e(11559) || e(11565)) || A2(r, 11568, 11623)) || e(11631)) || A2(r, 11648, 11670)) || A2(r, 11680, 11686)) || A2(r, 11688, 11694)) || A2(r, 11696, 11702)) || A2(r, 11704, 11710)) || A2(r, 11712, 11718)) : (((((((((A2(r, 11720, 11726) || A2(r, 11728, 11734)) || A2(r, 11736, 11742)) || e(11823)) || A2(r, 12293, 12294)) || A2(r, 12337, 12341)) || A2(r, 12347, 12348)) || A2(r, 12353, 12438)) || A2(r, 12445, 12447)) || A2(r, 12449, 12538)))) : (l(42965) ? (l(42239) ? (((((((((A2(r, 12540, 12543) || A2(r, 12549, 12591)) || A2(r, 12593, 12686)) || A2(r, 12704, 12735)) || A2(r, 12784, 12799)) || e(13312)) || e(19903)) || e(19968)) || A2(r, 40959, 42124)) || A2(r, 42192, 42237)) : ((((((((((A2(r, 42240, 42508) || A2(r, 42512, 42527)) || A2(r, 42538, 42539)) || A2(r, 42560, 42606)) || A2(r, 42623, 42653)) || A2(r, 42656, 42725)) || A2(r, 42775, 42783)) || A2(r, 42786, 42888)) || A2(r, 42891, 42954)) || A2(r, 42960, 42961)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && A2(r, 42963, 42964)))) : (l(43273) ? ((((((((((A2(r, 42966, 42969) || A2(r, 42994, 43009)) || A2(r, 43011, 43013)) || A2(r, 43015, 43018)) || A2(r, 43020, 43042)) || A2(r, 43072, 43123)) || A2(r, 43138, 43187)) || A2(r, 43250, 43255)) || e(43259)) || A2(r, 43261, 43262)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && e(42965))) : (((((((((A2(r, 43274, 43301) || A2(r, 43312, 43334)) || A2(r, 43360, 43388)) || A2(r, 43396, 43442)) || e(43471)) || A2(r, 43488, 43492)) || A2(r, 43494, 43503)) || A2(r, 43514, 43518)) || A2(r, 43520, 43560)) || A2(r, 43584, 43586))))))) : (l(71235) ? (l(67455) ? (l(65141) ? (l(55202) ? (l(43761) ? (((((((((A2(r, 43588, 43595) || A2(r, 43616, 43638)) || e(43642)) || A2(r, 43646, 43695)) || e(43697)) || A2(r, 43701, 43702)) || A2(r, 43705, 43709)) || A2(r, 43739, 43741)) || A2(r, 43744, 43754)) || ((!A2($elm$core$Basics$modBy, 2, code)) && A2(r, 43712, 43714))) : (((((((((A2(r, 43762, 43764) || A2(r, 43777, 43782)) || A2(r, 43785, 43790)) || A2(r, 43793, 43798)) || A2(r, 43808, 43814)) || A2(r, 43816, 43822)) || A2(r, 43824, 43866)) || A2(r, 43868, 43881)) || A2(r, 43888, 44002)) || e(44032))) : (l(64311) ? (((((((((e(55203) || A2(r, 55216, 55238)) || A2(r, 55243, 55291)) || A2(r, 63744, 64109)) || A2(r, 64112, 64217)) || A2(r, 64256, 64262)) || A2(r, 64275, 64279)) || e(64285)) || A2(r, 64287, 64296)) || A2(r, 64298, 64310)) : (((((((((A2(r, 64312, 64316) || e(64318)) || A2(r, 64320, 64321)) || A2(r, 64323, 64324)) || A2(r, 64326, 64433)) || A2(r, 64467, 64829)) || A2(r, 64848, 64911)) || A2(r, 64914, 64967)) || A2(r, 65008, 65019)) || A2(r, 65136, 65140)))) : (l(66383) ? (l(65575) ? (((((((((A2(r, 65142, 65276) || A2(r, 65313, 65338)) || A2(r, 65345, 65370)) || A2(r, 65382, 65470)) || A2(r, 65474, 65479)) || A2(r, 65482, 65487)) || A2(r, 65490, 65495)) || A2(r, 65498, 65500)) || A2(r, 65536, 65547)) || A2(r, 65549, 65574)) : (((((((((A2(r, 65576, 65594) || A2(r, 65596, 65597)) || A2(r, 65599, 65613)) || A2(r, 65616, 65629)) || A2(r, 65664, 65786)) || A2(r, 66176, 66204)) || A2(r, 66208, 66256)) || A2(r, 66304, 66335)) || A2(r, 66349, 66368)) || A2(r, 66370, 66377))) : (l(66939) ? (((((((((A2(r, 66384, 66421) || A2(r, 66432, 66461)) || A2(r, 66464, 66499)) || A2(r, 66504, 66511)) || A2(r, 66560, 66717)) || A2(r, 66736, 66771)) || A2(r, 66776, 66811)) || A2(r, 66816, 66855)) || A2(r, 66864, 66915)) || A2(r, 66928, 66938)) : (((((((((A2(r, 66940, 66954) || A2(r, 66956, 66962)) || A2(r, 66964, 66965)) || A2(r, 66967, 66977)) || A2(r, 66979, 66993)) || A2(r, 66995, 67001)) || A2(r, 67003, 67004)) || A2(r, 67072, 67382)) || A2(r, 67392, 67413)) || A2(r, 67424, 67431))))) : (l(69599) ? (l(68120) ? (l(67711) ? (((((((((A2(r, 67456, 67461) || A2(r, 67463, 67504)) || A2(r, 67506, 67514)) || A2(r, 67584, 67589)) || e(67592)) || A2(r, 67594, 67637)) || A2(r, 67639, 67640)) || e(67644)) || A2(r, 67647, 67669)) || A2(r, 67680, 67702)) : (((((((((A2(r, 67712, 67742) || A2(r, 67808, 67826)) || A2(r, 67828, 67829)) || A2(r, 67840, 67861)) || A2(r, 67872, 67897)) || A2(r, 67968, 68023)) || A2(r, 68030, 68031)) || e(68096)) || A2(r, 68112, 68115)) || A2(r, 68117, 68119))) : (l(68735) ? (((((((((A2(r, 68121, 68149) || A2(r, 68192, 68220)) || A2(r, 68224, 68252)) || A2(r, 68288, 68295)) || A2(r, 68297, 68324)) || A2(r, 68352, 68405)) || A2(r, 68416, 68437)) || A2(r, 68448, 68466)) || A2(r, 68480, 68497)) || A2(r, 68608, 68680)) : (((((((((A2(r, 68736, 68786) || A2(r, 68800, 68850)) || A2(r, 68864, 68899)) || A2(r, 69248, 69289)) || A2(r, 69296, 69297)) || A2(r, 69376, 69404)) || e(69415)) || A2(r, 69424, 69445)) || A2(r, 69488, 69505)) || A2(r, 69552, 69572)))) : (l(70302) ? (l(70005) ? (((((((((A2(r, 69600, 69622) || A2(r, 69635, 69687)) || A2(r, 69745, 69746)) || e(69749)) || A2(r, 69763, 69807)) || A2(r, 69840, 69864)) || A2(r, 69891, 69926)) || e(69956)) || e(69959)) || A2(r, 69968, 70002)) : ((((((((((e(70006) || A2(r, 70019, 70066)) || A2(r, 70081, 70084)) || A2(r, 70144, 70161)) || A2(r, 70163, 70187)) || A2(r, 70207, 70208)) || A2(r, 70272, 70278)) || e(70280)) || A2(r, 70282, 70285)) || A2(r, 70287, 70301)) || ((!A2($elm$core$Basics$modBy, 2, code)) && A2(r, 70106, 70108)))) : (l(70492) ? (((((((((A2(r, 70303, 70312) || A2(r, 70320, 70366)) || A2(r, 70405, 70412)) || A2(r, 70415, 70416)) || A2(r, 70419, 70440)) || A2(r, 70442, 70448)) || A2(r, 70450, 70451)) || A2(r, 70453, 70457)) || e(70461)) || e(70480)) : (((((((((A2(r, 70493, 70497) || A2(r, 70656, 70708)) || A2(r, 70727, 70730)) || A2(r, 70751, 70753)) || A2(r, 70784, 70831)) || A2(r, 70852, 70853)) || e(70855)) || A2(r, 71040, 71086)) || A2(r, 71128, 71131)) || A2(r, 71168, 71215)))))) : (l(119972) ? (l(77711) ? (l(72367) ? (l(71956) ? (((((((((e(71236) || A2(r, 71296, 71338)) || e(71352)) || A2(r, 71424, 71450)) || A2(r, 71488, 71494)) || A2(r, 71680, 71723)) || A2(r, 71840, 71903)) || A2(r, 71935, 71942)) || e(71945)) || A2(r, 71948, 71955)) : ((((((((((A2(r, 71957, 71958) || A2(r, 71960, 71983)) || A2(r, 72096, 72103)) || A2(r, 72106, 72144)) || e(72192)) || A2(r, 72203, 72242)) || e(72250)) || e(72272)) || A2(r, 72284, 72329)) || e(72349)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && (A2(r, 71999, 72001) || A2(r, 72161, 72163))))) : (l(73062) ? (((((((((A2(r, 72368, 72440) || A2(r, 72704, 72712)) || A2(r, 72714, 72750)) || e(72768)) || A2(r, 72818, 72847)) || A2(r, 72960, 72966)) || A2(r, 72968, 72969)) || A2(r, 72971, 73008)) || e(73030)) || A2(r, 73056, 73061)) : (((((((((A2(r, 73063, 73064) || A2(r, 73066, 73097)) || e(73112)) || A2(r, 73440, 73458)) || e(73474)) || A2(r, 73476, 73488)) || A2(r, 73490, 73523)) || e(73648)) || A2(r, 73728, 74649)) || A2(r, 74880, 75075)))) : (l(100351) ? (l(93026) ? (((((((((A2(r, 77712, 77808) || A2(r, 77824, 78895)) || A2(r, 78913, 78918)) || A2(r, 82944, 83526)) || A2(r, 92160, 92728)) || A2(r, 92736, 92766)) || A2(r, 92784, 92862)) || A2(r, 92880, 92909)) || A2(r, 92928, 92975)) || A2(r, 92992, 92995)) : (((((((((A2(r, 93027, 93047) || A2(r, 93053, 93071)) || A2(r, 93760, 93823)) || A2(r, 93952, 94026)) || e(94032)) || A2(r, 94099, 94111)) || A2(r, 94176, 94177)) || e(94179)) || e(94208)) || e(100343))) : (l(110947) ? (((((((((A2(r, 100352, 101589) || e(101632)) || e(101640)) || A2(r, 110576, 110579)) || A2(r, 110581, 110587)) || A2(r, 110589, 110590)) || A2(r, 110592, 110882)) || e(110898)) || A2(r, 110928, 110930)) || e(110933)) : (((((((((A2(r, 110948, 110951) || A2(r, 110960, 111355)) || A2(r, 113664, 113770)) || A2(r, 113776, 113788)) || A2(r, 113792, 113800)) || A2(r, 113808, 113817)) || A2(r, 119808, 119892)) || A2(r, 119894, 119964)) || A2(r, 119966, 119967)) || e(119970))))) : (l(125183) ? (l(120629) ? (l(120122) ? (((((((((A2(r, 119973, 119974) || A2(r, 119977, 119980)) || A2(r, 119982, 119993)) || e(119995)) || A2(r, 119997, 120003)) || A2(r, 120005, 120069)) || A2(r, 120071, 120074)) || A2(r, 120077, 120084)) || A2(r, 120086, 120092)) || A2(r, 120094, 120121)) : (((((((((A2(r, 120123, 120126) || A2(r, 120128, 120132)) || e(120134)) || A2(r, 120138, 120144)) || A2(r, 120146, 120485)) || A2(r, 120488, 120512)) || A2(r, 120514, 120538)) || A2(r, 120540, 120570)) || A2(r, 120572, 120596)) || A2(r, 120598, 120628))) : (l(123190) ? (((((((((A2(r, 120630, 120654) || A2(r, 120656, 120686)) || A2(r, 120688, 120712)) || A2(r, 120714, 120744)) || A2(r, 120746, 120770)) || A2(r, 120772, 120779)) || A2(r, 122624, 122654)) || A2(r, 122661, 122666)) || A2(r, 122928, 122989)) || A2(r, 123136, 123180)) : (((((((((A2(r, 123191, 123197) || e(123214)) || A2(r, 123536, 123565)) || A2(r, 123584, 123627)) || A2(r, 124112, 124139)) || A2(r, 124896, 124902)) || A2(r, 124904, 124907)) || A2(r, 124909, 124910)) || A2(r, 124912, 124926)) || A2(r, 124928, 125124)))) : (l(126591) ? (l(126540) ? ((((((((((A2(r, 125184, 125251) || e(125259)) || A2(r, 126464, 126467)) || A2(r, 126469, 126495)) || A2(r, 126497, 126498)) || e(126500)) || e(126503)) || A2(r, 126505, 126514)) || A2(r, 126516, 126519)) || e(126530)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && (A2(r, 126521, 126523) || A2(r, 126535, 126539)))) : ((((((((((A2(r, 126541, 126543) || A2(r, 126545, 126546)) || e(126548)) || A2(r, 126561, 126562)) || e(126564)) || A2(r, 126567, 126570)) || A2(r, 126572, 126578)) || A2(r, 126580, 126583)) || A2(r, 126585, 126588)) || e(126590)) || ((A2($elm$core$Basics$modBy, 2, code) === 1) && A2(r, 126551, 126559)))) : (l(178204) ? (((((((((A2(r, 126592, 126601) || A2(r, 126603, 126619)) || A2(r, 126625, 126627)) || A2(r, 126629, 126633)) || A2(r, 126635, 126651)) || e(131072)) || e(173791)) || e(173824)) || e(177977)) || e(177984)) : (((((((((e(178205) || e(178208)) || e(183969)) || e(183984)) || e(191456)) || A2(r, 194560, 195101)) || e(196608)) || e(201546)) || e(201552)) || e(205743))))))));
};
var $miniBill$elm_unicode$Unicode$isDigit = function (c) {
	var code = $elm$core$Char$toCode(c);
	var e = function (hex) {
		return _Utils_eq(hex, code);
	};
	var l = function (hex) {
		return _Utils_cmp(code, hex) < 0;
	};
	var r = F2(
		function (from, to) {
			return (_Utils_cmp(from, code) < 1) && (_Utils_cmp(code, to) < 1);
		});
	return l(256) ? (((A2(r, 48, 57) || A2(r, 178, 179)) || e(185)) || A2(r, 188, 190)) : (l(66272) ? (l(7231) ? (l(3557) ? (l(2917) ? (((((((A2(r, 1632, 1641) || A2(r, 1776, 1785)) || A2(r, 1984, 1993)) || A2(r, 2406, 2415)) || A2(r, 2534, 2543)) || A2(r, 2548, 2553)) || A2(r, 2662, 2671)) || A2(r, 2790, 2799)) : (((((((A2(r, 2918, 2927) || A2(r, 2930, 2935)) || A2(r, 3046, 3058)) || A2(r, 3174, 3183)) || A2(r, 3192, 3198)) || A2(r, 3302, 3311)) || A2(r, 3416, 3422)) || A2(r, 3430, 3448))) : (l(6111) ? (((((((A2(r, 3558, 3567) || A2(r, 3664, 3673)) || A2(r, 3792, 3801)) || A2(r, 3872, 3891)) || A2(r, 4160, 4169)) || A2(r, 4240, 4249)) || A2(r, 4969, 4988)) || A2(r, 5870, 5872)) : ((((((((A2(r, 6112, 6121) || A2(r, 6128, 6137)) || A2(r, 6160, 6169)) || A2(r, 6470, 6479)) || A2(r, 6608, 6618)) || A2(r, 6784, 6793)) || A2(r, 6800, 6809)) || A2(r, 6992, 7001)) || A2(r, 7088, 7097)))) : (l(12871) ? (l(9449) ? (((((((A2(r, 7232, 7241) || A2(r, 7248, 7257)) || e(8304)) || A2(r, 8308, 8313)) || A2(r, 8320, 8329)) || A2(r, 8528, 8578)) || A2(r, 8581, 8585)) || A2(r, 9312, 9371)) : (((((((A2(r, 9450, 9471) || A2(r, 10102, 10131)) || e(11517)) || e(12295)) || A2(r, 12321, 12329)) || A2(r, 12344, 12346)) || A2(r, 12690, 12693)) || A2(r, 12832, 12841))) : (l(43263) ? (((((((A2(r, 12872, 12879) || A2(r, 12881, 12895)) || A2(r, 12928, 12937)) || A2(r, 12977, 12991)) || A2(r, 42528, 42537)) || A2(r, 42726, 42735)) || A2(r, 43056, 43061)) || A2(r, 43216, 43225)) : ((((((((A2(r, 43264, 43273) || A2(r, 43472, 43481)) || A2(r, 43504, 43513)) || A2(r, 43600, 43609)) || A2(r, 44016, 44025)) || A2(r, 65296, 65305)) || A2(r, 65799, 65843)) || A2(r, 65856, 65912)) || A2(r, 65930, 65931))))) : (l(70735) ? (l(68252) ? (l(67750) ? (((((((A2(r, 66273, 66299) || A2(r, 66336, 66339)) || e(66369)) || e(66378)) || A2(r, 66513, 66517)) || A2(r, 66720, 66729)) || A2(r, 67672, 67679)) || A2(r, 67705, 67711)) : (((((((A2(r, 67751, 67759) || A2(r, 67835, 67839)) || A2(r, 67862, 67867)) || A2(r, 68028, 68029)) || A2(r, 68032, 68047)) || A2(r, 68050, 68095)) || A2(r, 68160, 68168)) || A2(r, 68221, 68222))) : (l(69404) ? (((((((A2(r, 68253, 68255) || A2(r, 68331, 68335)) || A2(r, 68440, 68447)) || A2(r, 68472, 68479)) || A2(r, 68521, 68527)) || A2(r, 68858, 68863)) || A2(r, 68912, 68921)) || A2(r, 69216, 69246)) : ((((((((A2(r, 69405, 69414) || A2(r, 69457, 69460)) || A2(r, 69573, 69579)) || A2(r, 69714, 69743)) || A2(r, 69872, 69881)) || A2(r, 69942, 69951)) || A2(r, 70096, 70105)) || A2(r, 70113, 70132)) || A2(r, 70384, 70393)))) : (l(93823) ? (l(73039) ? (((((((A2(r, 70736, 70745) || A2(r, 70864, 70873)) || A2(r, 71248, 71257)) || A2(r, 71360, 71369)) || A2(r, 71472, 71483)) || A2(r, 71904, 71922)) || A2(r, 72016, 72025)) || A2(r, 72784, 72812)) : ((((((((A2(r, 73040, 73049) || A2(r, 73120, 73129)) || A2(r, 73552, 73561)) || A2(r, 73664, 73684)) || A2(r, 74752, 74862)) || A2(r, 92768, 92777)) || A2(r, 92864, 92873)) || A2(r, 93008, 93017)) || A2(r, 93019, 93025))) : (l(125126) ? (((((((A2(r, 93824, 93846) || A2(r, 119488, 119507)) || A2(r, 119520, 119539)) || A2(r, 119648, 119672)) || A2(r, 120782, 120831)) || A2(r, 123200, 123209)) || A2(r, 123632, 123641)) || A2(r, 124144, 124153)) : ((((((((A2(r, 125127, 125135) || A2(r, 125264, 125273)) || A2(r, 126065, 126123)) || A2(r, 126125, 126127)) || A2(r, 126129, 126132)) || A2(r, 126209, 126253)) || A2(r, 126255, 126269)) || A2(r, 127232, 127244)) || A2(r, 130032, 130041))))));
};
var $author$project$Model$stdReplacements = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('I', '1'),
			_Utils_Tuple2('II', '2'),
			_Utils_Tuple2('III', '3'),
			_Utils_Tuple2('IV', '4')
		]));
var $elm_community$list_extra$List$Extra$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				if (!list.b) {
					return $elm$core$List$reverse(memo);
				} else {
					var x = list.a;
					var xs = list.b;
					if (predicate(x)) {
						var $temp$memo = A2($elm$core$List$cons, x, memo),
							$temp$list = xs;
						memo = $temp$memo;
						list = $temp$list;
						continue takeWhileMemo;
					} else {
						return $elm$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(_List_Nil);
};
var $elm$core$String$toUpper = _String_toUpper;
var $elm$core$String$words = _String_words;
var $author$project$Model$sanitize = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				A2(
					$elm$core$Basics$composeL,
					A2(
						$elm$core$Basics$composeL,
						A2(
							$elm$core$Basics$composeL,
							$elm$core$String$join(' '),
							$elm$core$List$map(
								function (wrd) {
									var _v0 = A2($elm$core$Dict$get, wrd, $author$project$Model$stdReplacements);
									if (!_v0.$) {
										var w = _v0.a;
										return w;
									} else {
										return wrd;
									}
								})),
						$elm$core$List$filter(
							function (wrd) {
								return wrd !== 'POSE';
							})),
					$elm_community$list_extra$List$Extra$takeWhile(
						function (wrd) {
							return wrd !== '/';
						})),
				$elm$core$String$words),
			A2(
				$elm$core$String$foldr,
				F2(
					function (ch, acc) {
						if ($miniBill$elm_unicode$Unicode$isAlpha(ch) || ($miniBill$elm_unicode$Unicode$isDigit(ch) || A2(
							$elm$core$List$member,
							$miniBill$elm_unicode$Unicode$getCategory(ch),
							_List_fromArray(
								[
									$elm$core$Maybe$Just(3),
									$elm$core$Maybe$Just(4)
								])))) {
							return A2($elm$core$String$cons, ch, acc);
						} else {
							switch (ch) {
								case '-':
									return A2($elm$core$String$cons, ' ', acc);
								case '—':
									return A2($elm$core$String$cons, ' ', acc);
								case ' ':
									return A2($elm$core$String$cons, ' ', acc);
								case '\n':
									return A2($elm$core$String$cons, ' ', acc);
								case '/':
									return ' / ' + acc;
								default:
									return acc;
							}
						}
					}),
				'')),
		$elm$core$String$toUpper),
	function (str) {
		return (A2($elm$core$String$startsWith, '[', str) && A2($elm$core$String$endsWith, ']', str)) ? '' : str;
	});
var $author$project$Model$wordToList = function (w) {
	return (A2($elm$core$String$startsWith, '(', w) && A2($elm$core$String$endsWith, ')', w)) ? _List_fromArray(
		[
			A3($elm$core$String$slice, 1, -1, w),
			''
		]) : _List_fromArray(
		[w]);
};
var $author$project$Model$getScrubbedAnswers = F2(
	function (settings, subj) {
		var listOfNames = $mgold$elm_nonempty_list$List$Nonempty$toList(
			A2($author$project$Model$getCorrectAnswers, settings, subj));
		var listsOfWords = A2($elm$core$List$map, $elm$core$String$words, listOfNames);
		var traversedListsOfLists = A2(
			$elm$core$List$map,
			$author$project$Model$listTraverse($author$project$Model$wordToList),
			listsOfWords);
		var joinedStringLists = A2(
			A2($elm$core$Basics$composeL, $elm$core$List$map, $elm$core$List$map),
			$elm$core$String$join(' '),
			traversedListsOfLists);
		var joinedLists = $elm$core$List$concat(joinedStringLists);
		var sanitizedList = A2($elm$core$List$map, $author$project$Model$sanitize, joinedLists);
		var _v0 = $mgold$elm_nonempty_list$List$Nonempty$fromList(sanitizedList);
		if (!_v0.$) {
			var nel = _v0.a;
			return nel;
		} else {
			return $mgold$elm_nonempty_list$List$Nonempty$singleton('invalid');
		}
	});
var $mgold$elm_nonempty_list$List$Nonempty$head = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return x;
};
var $elm_community$maybe_extra$Maybe$Extra$isJust = function (m) {
	if (m.$ === 1) {
		return false;
	} else {
		return true;
	}
};
var $author$project$Model$isAnswered = function (model) {
	return $elm_community$maybe_extra$Maybe$Extra$isJust(model.a4);
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $mgold$elm_nonempty_list$List$Nonempty$map = F2(
	function (f, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return A2(
			$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
			f(x),
			A2($elm$core$List$map, f, xs));
	});
var $mgold$elm_nonempty_list$List$Nonempty$member = F2(
	function (y, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return _Utils_eq(x, y) || A2($elm$core$List$member, y, xs);
	});
var $mgold$elm_nonempty_list$List$Nonempty$isSingleton = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return $elm$core$List$isEmpty(xs);
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Model$nextEnabled = function (model) {
	var notEnd = !$mgold$elm_nonempty_list$List$Nonempty$isSingleton(model.r);
	var inReview = !model.e.E;
	return (!model.at) && (notEnd && (inReview || $author$project$Model$isAnswered(model)));
};
var $mgold$elm_nonempty_list$List$Nonempty$pop = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	if (!xs.b) {
		return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, xs);
	} else {
		var y = xs.a;
		var ys = xs.b;
		return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, y, ys);
	}
};
var $author$project$Model$prevEnabled = function (model) {
	return (!model.e.E) && (!$elm$core$List$isEmpty(model.J));
};
var $author$project$Config$readScript = function (s) {
	switch (s) {
		case 'Latin':
			return 0;
		case 'Unicode':
			return 1;
		default:
			return 0;
	}
};
var $author$project$Config$readTrainMode = function (s) {
	switch (s) {
		case 'Review':
			return 0;
		case 'Urname':
			return 1;
		case 'LocalName':
			return 2;
		case 'Description':
			return 3;
		default:
			return 0;
	}
};
var $elm$core$Process$sleep = _Process_sleep;
var $elm$core$List$sortWith = _List_sortWith;
var $mgold$elm_nonempty_list$List$Nonempty$insertWith = F3(
	function (cmp, hd, aList) {
		if (aList.b) {
			var x = aList.a;
			var xs = aList.b;
			return (!A2(cmp, x, hd)) ? A2(
				$mgold$elm_nonempty_list$List$Nonempty$Nonempty,
				x,
				A2(
					$elm$core$List$sortWith,
					cmp,
					A2($elm$core$List$cons, hd, xs))) : A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, hd, aList);
		} else {
			return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, hd, _List_Nil);
		}
	});
var $mgold$elm_nonempty_list$List$Nonempty$sortBy = F2(
	function (f, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return A3(
			$mgold$elm_nonempty_list$List$Nonempty$insertWith,
			F2(
				function (a, b) {
					return A2(
						$elm$core$Basics$compare,
						f(a),
						f(b));
				}),
			x,
			A2($elm$core$List$sortBy, f, xs));
	});
var $elm_community$maybe_extra$Maybe$Extra$withDefaultLazy = F2(
	function (_default, m) {
		if (m.$ === 1) {
			return _default(0);
		} else {
			var a = m.a;
			return a;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			var sleepThenShowAudio = function (_v10) {
				return A2(
					$elm$core$Task$perform,
					function (_v9) {
						return $author$project$Types$ShowAudio;
					},
					$elm$core$Process$sleep(100));
			};
			var prevCard = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Types$emptyCard,
				$elm$core$List$head(model.J));
			var nextKeyPressed = function (s) {
				return function (_v8) {
					return model.at ? A2($author$project$Main$update, $author$project$Types$Start, model) : (((s === 'ArrowRight') && $author$project$Model$nextEnabled(model)) ? A2($author$project$Main$update, $author$project$Types$Next, model) : (((s === 'Enter') && ((!$author$project$Model$isAnswered(model)) && ((model.e.O === 1) && (model.e.E !== 3)))) ? A2($author$project$Main$update, $author$project$Types$SubmitAnswer, model) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none)));
				};
			};
			var nextCard = $mgold$elm_nonempty_list$List$Nonempty$head(model.r);
			var filteredSubjects = function (mdl) {
				var subjFilter = function (subj) {
					var _v7 = mdl.e.H;
					if (_v7.$ === 1) {
						return true;
					} else {
						var maybeGrp = _v7;
						return _Utils_eq(subj.H, maybeGrp);
					}
				};
				return A3($mgold$elm_nonempty_list$List$Nonempty$filter, subjFilter, $author$project$Types$invalidSubject, mdl.B.ba);
			};
			var buildSortedDeckForReview = A2(
				$mgold$elm_nonempty_list$List$Nonempty$map,
				function (subj) {
					return {bf: _List_Nil, bA: subj};
				},
				function () {
					var _v6 = model.B.bz;
					switch (_v6) {
						case 0:
							return $mgold$elm_nonempty_list$List$Nonempty$sortBy(
								function ($) {
									return $.bs;
								});
						case 1:
							return $mgold$elm_nonempty_list$List$Nonempty$sortBy(
								function ($) {
									return $.bE;
								});
						default:
							return $mgold$elm_nonempty_list$List$Nonempty$sortBy(
								function ($) {
									return $.a_;
								});
					}
				}()(
					filteredSubjects(model)));
			var buildShuffledDeckCmdForQuiz = function (mdl) {
				return A2(
					$elm$random$Random$generate,
					$author$project$Types$Shuffle,
					A2(
						$author$project$Card$generateDeck,
						mdl.B.bu,
						filteredSubjects(mdl)));
			};
			var answerNewModel = function (str) {
				var sanitizedAnswer = $author$project$Model$sanitize(str);
				return _Utils_update(
					model,
					{
						U: A2(
							$mgold$elm_nonempty_list$List$Nonempty$member,
							sanitizedAnswer,
							A2(
								$author$project$Model$getScrubbedAnswers,
								model.e,
								$mgold$elm_nonempty_list$List$Nonempty$head(model.r).bA)) ? (model.U + 1) : model.U,
						a1: model.a1 + 1,
						a4: $elm$core$Maybe$Just(sanitizedAnswer)
					});
			};
			var newModel = function () {
				switch (msg.$) {
					case 6:
						return _Utils_update(
							model,
							{
								at: false,
								r: (!model.e.E) ? buildSortedDeckForReview : model.r
							});
					case 11:
						var shuffledDeck = msg.a;
						return _Utils_update(
							model,
							{
								r: A2(
									$elm_community$maybe_extra$Maybe$Extra$withDefaultLazy,
									function (_v3) {
										return $author$project$Types$invalidCards;
									},
									$mgold$elm_nonempty_list$List$Nonempty$fromList(shuffledDeck))
							});
					case 3:
						var trainMode = msg.a;
						return _Utils_update(
							model,
							{
								e: A4(
									$author$project$Types$Settings,
									$author$project$Config$readTrainMode(trainMode),
									model.e.V,
									model.e.H,
									model.e.O)
							});
					case 4:
						var groupLabel = msg.a;
						return _Utils_update(
							model,
							{
								e: A4(
									$author$project$Types$Settings,
									model.e.E,
									model.e.V,
									function () {
										if (groupLabel === 'All') {
											return $elm$core$Maybe$Nothing;
										} else {
											var grpLbl = groupLabel;
											return $elm$core$Maybe$Just(grpLbl);
										}
									}(),
									model.e.O)
							});
					case 5:
						var script = msg.a;
						return _Utils_update(
							model,
							{
								e: A4(
									$author$project$Types$Settings,
									model.e.E,
									$author$project$Config$readScript(script),
									model.e.H,
									model.e.O)
							});
					case 15:
						var quizTypeString = msg.a;
						var newQuizType = function () {
							switch (quizTypeString) {
								case 'MultipleChoice':
									return 0;
								case 'TextField':
									return 1;
								default:
									return 0;
							}
						}();
						return _Utils_update(
							model,
							{
								e: A4($author$project$Types$Settings, model.e.E, model.e.V, model.e.H, newQuizType)
							});
					case 7:
						var mdl = $author$project$Types$defaultModel;
						return _Utils_update(
							mdl,
							{B: model.B, e: model.e});
					case 8:
						var s = msg.a;
						return answerNewModel(s);
					case 9:
						return answerNewModel(model._);
					case 10:
						var str = msg.a;
						return _Utils_update(
							model,
							{_: str});
					case 2:
						return _Utils_update(
							model,
							{X: true});
					case 0:
						return _Utils_update(
							model,
							{
								J: A2($elm$core$List$cons, nextCard, model.J),
								r: $mgold$elm_nonempty_list$List$Nonempty$pop(model.r),
								X: false,
								a4: $elm$core$Maybe$Nothing,
								_: ''
							});
					case 1:
						var remaining = A2($mgold$elm_nonempty_list$List$Nonempty$cons, prevCard, model.r);
						var newPrevDeck = A2($elm$core$List$drop, 1, model.J);
						return _Utils_update(
							model,
							{J: newPrevDeck, r: remaining, X: false});
					default:
						return model;
				}
			}();
			_v0$10:
			while (true) {
				switch (msg.$) {
					case 6:
						return _Utils_Tuple2(
							newModel,
							(!(!newModel.e.E)) ? buildShuffledDeckCmdForQuiz(newModel) : $elm$core$Platform$Cmd$none);
					case 7:
						return $author$project$Model$initWithModel(newModel);
					case 16:
						var htmlId = msg.a;
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$focusElement(htmlId));
					case 12:
						switch (msg.a) {
							case 'ArrowRight':
								return A2(nextKeyPressed, 'ArrowRight', 0);
							case 'ArrowLeft':
								if ($author$project$Model$prevEnabled(model)) {
									var $temp$msg = $author$project$Types$Previous,
										$temp$model = model;
									msg = $temp$msg;
									model = $temp$model;
									continue update;
								} else {
									return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
								}
							case 'Enter':
								return A2(nextKeyPressed, 'Enter', 0);
							default:
								break _v0$10;
						}
					case 0:
						return _Utils_Tuple2(
							newModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$focusElement('answerTextField'),
										sleepThenShowAudio(nextCard.bA)
									])));
					case 1:
						return _Utils_Tuple2(
							newModel,
							sleepThenShowAudio(prevCard.bA));
					case 14:
						return _Utils_Tuple2(
							newModel,
							function () {
								var _v1 = model.B.br;
								if (!_v1.$) {
									var homePage = _v1.a;
									return $elm$browser$Browser$Navigation$load(homePage);
								} else {
									return $elm$core$Platform$Cmd$none;
								}
							}());
					case 11:
						return _Utils_Tuple2(
							newModel,
							$author$project$Main$focusElement('answerTextField'));
					default:
						break _v0$10;
				}
			}
			return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Types$GoLanding = {$: 14};
var $author$project$Types$Reset = {$: 7};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$html$Html$Attributes$autoplay = $elm$html$Html$Attributes$boolProperty('autoplay');
var $elm$html$Html$Attributes$controls = $elm$html$Html$Attributes$boolProperty('controls');
var $elm$html$Html$source = _VirtualDom_node('source');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$View$playAudio = F2(
	function (model, maybeUrl) {
		if (model.B.X) {
			if (model.X) {
				if (!maybeUrl.$) {
					var url = maybeUrl.a;
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('audio')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$audio,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$controls(true),
											$elm$html$Html$Attributes$autoplay(true)
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$source,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$src(url),
													$elm$html$Html$Attributes$type_('audio/mpeg')
												]),
											_List_Nil),
											$elm$html$Html$text('Your browser does not support the audio element')
										]))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('audio')
								]),
							_List_Nil)
						]);
				}
			} else {
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('audio')
							]),
						_List_Nil)
					]);
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$View$showDescriptionInCard = F2(
	function (model, card) {
		var descriptionHtml = function (subject) {
			return $elm$core$String$isEmpty(subject.bh) ? _List_Nil : _List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('descriptionText')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('\"' + (subject.bh + '\"'))
						]))
				]);
		};
		return model.B.aV ? _List_fromArray(
			[
				A2(
				$elm$html$Html$tr,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('minorPart')
					]),
				descriptionHtml(card.bA))
			]) : _List_Nil;
	});
var $author$project$Config$showTrainMode = F2(
	function (cfg, trainMode) {
		var modeAsString = function () {
			switch (trainMode) {
				case 0:
					return 'Review';
				case 1:
					return 'Urname';
				case 2:
					return 'LocalName';
				default:
					return 'Description';
			}
		}();
		return A2(
			$elm$core$Maybe$withDefault,
			'invalid',
			A2($elm$core$Dict$get, modeAsString, cfg.bD));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm_community$maybe_extra$Maybe$Extra$unwrap = F3(
	function (_default, f, m) {
		if (m.$ === 1) {
			return _default;
		} else {
			var a = m.a;
			return f(a);
		}
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$View$viewImage = function (maybeUrl) {
	if (!maybeUrl.$) {
		var url = maybeUrl.a;
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(url)
					]),
				_List_Nil)
			]);
	} else {
		return _List_fromArray(
			[
				A2($elm$html$Html$br, _List_Nil, _List_Nil)
			]);
	}
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $author$project$View$displayAnswer = function (localNames) {
	return $elm$core$String$concat(
		A2(
			$elm$core$List$intersperse,
			' / ',
			$mgold$elm_nonempty_list$List$Nonempty$toList(localNames)));
};
var $author$project$View$viewLocalName = function (subject) {
	return A2(
		$elm$html$Html$p,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('localNameText')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				$author$project$View$displayAnswer(subject.Q))
			]));
};
var $author$project$Types$Answer = function (a) {
	return {$: 8, a: a};
};
var $author$project$Types$TypeAnswer = function (a) {
	return {$: 10, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$colspan = function (n) {
	return A2(
		_VirtualDom_attribute,
		'colspan',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$viewQuiz = F3(
	function (legendLabel, model, card) {
		var isCorrect = function (val) {
			return A2(
				$mgold$elm_nonempty_list$List$Nonempty$member,
				$author$project$Model$sanitize(val),
				A2($author$project$Model$getScrubbedAnswers, model.e, card.bA));
		};
		var incorrectAttributes = _List_fromArray(
			[
				$elm$html$Html$Attributes$class('incorrect')
			]);
		var correctAttributes = _List_fromArray(
			[
				$elm$html$Html$Attributes$class('correct')
			]);
		var correctnessAttributes = function (val) {
			return $author$project$Model$isAnswered(model) ? (isCorrect(val) ? correctAttributes : incorrectAttributes) : _List_Nil;
		};
		var labelAttributes = function (val) {
			return _Utils_ap(
				(model.e.E === 3) ? _List_fromArray(
					[
						$elm$html$Html$Attributes$class('italic')
					]) : _List_Nil,
				correctnessAttributes(val));
		};
		var toInputView = F2(
			function (i, subject) {
				var isChecked = function (val) {
					return _Utils_eq(
						model.a4,
						$elm$core$Maybe$Just(
							$author$project$Model$sanitize(val)));
				};
				var audioButton = function (url) {
					return A2(
						$elm$html$Html$audio,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$controls(true),
								$elm$html$Html$Attributes$autoplay(false),
								A2($elm$html$Html$Attributes$style, 'width', '100')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$source,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(url),
										$elm$html$Html$Attributes$type_('audio/mpeg')
									]),
								_List_Nil),
								$elm$html$Html$text('Your browser does not support the audio element')
							]));
				};
				var answerChoiceI = $author$project$View$displayAnswer(
					A2($author$project$Model$getCorrectAnswers, model.e, subject));
				return A2(
					$elm$html$Html$tr,
					_List_Nil,
					_Utils_ap(
						(model.B.X && ((model.e.E === 1) && model.B.aU)) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz audioInQuiz')
									]),
								function () {
									if (model.X) {
										var _v4 = subject.bc;
										if (!_v4.$) {
											var url = _v4.a;
											return _List_fromArray(
												[
													audioButton(url)
												]);
										} else {
											return _List_Nil;
										}
									} else {
										return _List_Nil;
									}
								}())
							]) : _List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz'),
										A2($elm$html$Html$Attributes$style, 'width', '15px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('w3-radio radio'),
												$elm$html$Html$Attributes$id(
												'choice' + $elm$core$String$fromInt(i)),
												$elm$html$Html$Attributes$name('choice'),
												$elm$html$Html$Attributes$placeholder(answerChoiceI),
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$value(answerChoiceI),
												$elm$html$Html$Events$onInput($author$project$Types$Answer),
												$elm$html$Html$Attributes$checked(
												isChecked(answerChoiceI)),
												$elm$html$Html$Attributes$disabled(
												$author$project$Model$isAnswered(model))
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$td,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class('quiz'),
									($author$project$Model$isAnswered(model) && isCorrect(answerChoiceI)) ? correctAttributes : _List_Nil),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										A2(
											$elm$core$List$cons,
											$elm$html$Html$Attributes$for(
												'choice' + $elm$core$String$fromInt(i)),
											labelAttributes(answerChoiceI)),
										_List_fromArray(
											[
												$elm$html$Html$text(answerChoiceI)
											]))
									]))
							])));
			});
		var getChoices = function () {
			var _v2 = model.e.O;
			if (!_v2) {
				return A2($elm$core$List$indexedMap, toInputView, card.bf);
			} else {
				var styleClasses = (model.e.E === 3) ? 'textAnswer description' : 'textAnswer';
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								A2(
									$elm$core$List$cons,
									$elm$html$Html$Attributes$class(styleClasses),
									correctnessAttributes(model._)),
								_List_fromArray(
									[
										function () {
										var _v3 = model.e.E;
										if (_v3 === 3) {
											return A2(
												$elm$html$Html$textarea,
												A2(
													$elm$core$List$cons,
													$elm$html$Html$Attributes$class('w3-input ' + styleClasses),
													_Utils_ap(
														correctnessAttributes(model._),
														_List_fromArray(
															[
																$elm$html$Html$Events$onInput($author$project$Types$TypeAnswer),
																$elm$html$Html$Attributes$disabled(
																$author$project$Model$isAnswered(model)),
																$elm$html$Html$Attributes$id('answerTextField'),
																$elm$html$Html$Attributes$value(model._)
															]))),
												_List_Nil);
										} else {
											return A2(
												$elm$html$Html$input,
												A2(
													$elm$core$List$cons,
													$elm$html$Html$Attributes$class('w3-input ' + styleClasses),
													_Utils_ap(
														correctnessAttributes(model._),
														_List_fromArray(
															[
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model._),
																$elm$html$Html$Events$onInput($author$project$Types$TypeAnswer),
																$elm$html$Html$Attributes$disabled(
																$author$project$Model$isAnswered(model)),
																$elm$html$Html$Attributes$id('answerTextField')
															]))),
												_List_Nil);
										}
									}()
									]))
							])),
						$author$project$Model$isAnswered(model) ? (isCorrect(model._) ? A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Correct!'),
								A2($elm$html$Html$br, _List_Nil, _List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('correct localNameText')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$View$displayAnswer(
											A2($author$project$Model$getCorrectAnswers, model.e, card.bA)))
									]))
							])) : A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The correct answer is:'),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('correct localNameText')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$View$displayAnswer(
											A2($author$project$Model$getCorrectAnswers, model.e, card.bA)))
									]))
							]))) : A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(styleClasses)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('w3-btn submit'),
												$elm$html$Html$Attributes$class(styleClasses),
												$elm$html$Html$Events$onClick($author$project$Types$SubmitAnswer)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Submit')
											]))
									]))
							]))
					]);
			}
		}();
		return A2(
			$elm$html$Html$div,
			function () {
				var _v0 = model.e.E;
				if (_v0 === 3) {
					var _v1 = model.e.O;
					if (!_v1) {
						return _List_fromArray(
							[
								$elm$html$Html$Attributes$class('descriptionQuiz multipleChoice')
							]);
					} else {
						return _List_fromArray(
							[
								$elm$html$Html$Attributes$class('descriptionQuiz textField')
							]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$fieldset,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('quiz')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('quiz')
								]),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$colspan(2),
											$elm$html$Html$Attributes$class('quizHeader')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(legendLabel)
										])),
								getChoices))
						])),
					A2($elm$html$Html$br, _List_Nil, _List_Nil)
				]));
	});
var $mgold$elm_nonempty_list$List$Nonempty$length = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return $elm$core$List$length(xs) + 1;
};
var $elm$core$Basics$round = _Basics_round;
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$View$viewScore = function (model) {
	var total = $elm$core$List$length(model.J) + $mgold$elm_nonempty_list$List$Nonempty$length(model.r);
	var soFar = $elm$core$List$length(model.J) + (($author$project$Model$isAnswered(model) || (!model.e.E)) ? 1 : 0);
	var score = $elm$core$Basics$round(
		(!model.a1) ? 0.0 : ((100 * model.U) / model.a1));
	var scorePercent = $elm$core$String$fromInt(score) + '%';
	var remaining = $mgold$elm_nonempty_list$List$Nonempty$length(model.r) - (((!model.e.E) || $author$project$Model$isAnswered(model)) ? 1 : 0);
	var progressFgClasses = function () {
		var _v1 = model.e.E;
		if (!_v1) {
			return 'progress-fg review';
		} else {
			return 'progress-fg';
		}
	}();
	var progress = $elm$core$Basics$round((100 * soFar) / total);
	var progressPercent = $elm$core$String$fromInt(progress) + '%';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w3-container cardWidth')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('score')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('score-remaining-container')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('score-remaining-layer1')
									]),
								function () {
									var _v0 = model.e.E;
									if (!_v0) {
										return _List_fromArray(
											[
												$elm$html$Html$text('Progress:')
											]);
									} else {
										return _List_fromArray(
											[
												$elm$html$Html$text('Score: '),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('score-fg')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$elm$core$String$fromInt(model.U) + ('/' + ($elm$core$String$fromInt(model.a1) + (' (' + (scorePercent + ')')))))
													]))
											]);
									}
								}()),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('score-remaining-layer2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Remaining: ' + $elm$core$String$fromInt(remaining))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('progress-bg')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(progressFgClasses),
										A2($elm$html$Html$Attributes$style, 'width', progressPercent)
									]),
								(!model.e.E) ? _List_Nil : _List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												'score-fg' + ((!progress) ? ' low-progress' : '')),
												A2($elm$html$Html$Attributes$style, 'width', scorePercent)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(scorePercent)
											]))
									]))
							]))
					]))
			]));
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$View$attrsForUrname = F3(
	function (subject, settings, config) {
		if (!config.aY) {
			return _List_Nil;
		} else {
			var _v0 = settings.V;
			if (!_v0) {
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$title(subject.bE)
					]);
			} else {
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$title(subject.bs)
					]);
			}
		}
	});
var $author$project$View$viewUrname = F3(
	function (subject, settings, config) {
		var attrs = A3($author$project$View$attrsForUrname, subject, settings, config);
		var _v0 = settings.V;
		if (!_v0) {
			return A2(
				$elm$html$Html$p,
				attrs,
				_List_fromArray(
					[
						$elm$html$Html$text(subject.bs)
					]));
		} else {
			return A2(
				$elm$html$Html$p,
				attrs,
				_List_fromArray(
					[
						$elm$html$Html$text(subject.bE)
					]));
		}
	});
var $author$project$View$viewCard = F2(
	function (model, card) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			function () {
				var startOver = A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w3-btn'),
								$elm$html$Html$Events$onClick($author$project$Types$Reset)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Start Over')
							])),
					$elm_community$maybe_extra$Maybe$Extra$isJust(model.B.br) ? _List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w3-btn end-button'),
									$elm$html$Html$Events$onClick($author$project$Types$GoLanding)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Change Deck')
								]))
						]) : _List_Nil);
				var prevButton = A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w3-btn'),
							$elm$html$Html$Attributes$disabled(
							!$author$project$Model$prevEnabled(model)),
							$elm$html$Html$Events$onClick($author$project$Types$Previous)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('⇦ Prev')
						]));
				var nextButton = A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w3-btn'),
							$elm$html$Html$Attributes$disabled(
							!$author$project$Model$nextEnabled(model)),
							$elm$html$Html$Events$onClick($author$project$Types$Next)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Next ⇨')
						]));
				var mainPartAttributes = A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('mainPart'),
					A3(
						$elm_community$maybe_extra$Maybe$Extra$unwrap,
						_List_Nil,
						function (fs) {
							return _List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', fs)
								]);
						},
						model.B.ay));
				var contentViews = _Utils_ap(
					$author$project$View$viewImage(card.bA.bm),
					function () {
						var _v1 = model.e.E;
						switch (_v1) {
							case 0:
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$table,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('maxWidth')
											]),
										_Utils_ap(
											_List_fromArray(
												[
													A2(
													$elm$html$Html$tr,
													mainPartAttributes,
													_List_fromArray(
														[
															A3($author$project$View$viewUrname, card.bA, model.e, model.B)
														])),
													A2(
													$elm$html$Html$tr,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('minorPart')
														]),
													_List_fromArray(
														[
															$author$project$View$viewLocalName(card.bA)
														]))
												]),
											_Utils_ap(
												A2($author$project$View$showDescriptionInCard, model, card),
												A2($author$project$View$playAudio, model, card.bA.bc))))
									]);
							case 1:
								var descriptionHtml = model.B.aX ? A2($author$project$View$showDescriptionInCard, model, card) : _List_Nil;
								var audioHtml = model.B.aT ? A2($author$project$View$playAudio, model, card.bA.bc) : _List_Nil;
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$table,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('maxWidth')
											]),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$tr,
												mainPartAttributes,
												_List_fromArray(
													[
														$author$project$View$viewLocalName(card.bA)
													])),
											_Utils_ap(descriptionHtml, audioHtml))),
										A3(
										$author$project$View$viewQuiz,
										A2($author$project$Config$showTrainMode, model.B, 1),
										model,
										card)
									]);
							case 2:
								var descriptionHtml = model.B.aW ? A2($author$project$View$showDescriptionInCard, model, card) : _List_Nil;
								var audioHtml = model.B.aS ? A2($author$project$View$playAudio, model, card.bA.bc) : _List_Nil;
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$table,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('maxWidth')
											]),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$tr,
												mainPartAttributes,
												_List_fromArray(
													[
														A3($author$project$View$viewUrname, card.bA, model.e, model.B)
													])),
											_Utils_ap(
												descriptionHtml,
												_Utils_ap(
													audioHtml,
													_List_fromArray(
														[
															A3(
															$author$project$View$viewQuiz,
															A2($author$project$Config$showTrainMode, model.B, 2),
															model,
															card)
														])))))
									]);
							default:
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$table,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('maxWidth')
											]),
										_Utils_ap(
											_List_fromArray(
												[
													A2(
													$elm$html$Html$tr,
													mainPartAttributes,
													_List_fromArray(
														[
															A3($author$project$View$viewUrname, card.bA, model.e, model.B)
														])),
													A2(
													$elm$html$Html$tr,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('minorPart')
														]),
													_List_fromArray(
														[
															$author$project$View$viewLocalName(card.bA)
														]))
												]),
											A2($author$project$View$playAudio, model, card.bA.bc))),
										A3(
										$author$project$View$viewQuiz,
										A2($author$project$Config$showTrainMode, model.B, 3),
										model,
										card)
									]);
						}
					}());
				var allFinished = A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w3-btn end-button'),
								$elm$html$Html$Events$onClick($author$project$Types$Reset)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('All Finished! Train Again?')
							])),
					$elm_community$maybe_extra$Maybe$Extra$isJust(model.B.br) ? _List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w3-btn end-button'),
									$elm$html$Html$Events$onClick($author$project$Types$GoLanding)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Change Deck')
								]))
						]) : _List_Nil);
				var endButtons = A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('buttons')
						]),
					(!model.e.E) ? _Utils_ap(
						_List_fromArray(
							[
								prevButton,
								nextButton,
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							]),
						allFinished) : ($elm_community$maybe_extra$Maybe$Extra$isJust(model.a4) ? _Utils_ap(
						_List_fromArray(
							[
								nextButton,
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							]),
						allFinished) : _Utils_ap(
						_List_fromArray(
							[
								nextButton,
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							]),
						startOver)));
				var allButtons = _Utils_ap(
					_List_fromArray(
						[
							prevButton,
							nextButton,
							A2($elm$html$Html$br, _List_Nil, _List_Nil)
						]),
					startOver);
				var midwayButtons = function () {
					var _v0 = model.e.E;
					if (!_v0) {
						return allButtons;
					} else {
						return A2($elm$core$List$drop, 1, allButtons);
					}
				}();
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w3-card card')
							]),
						contentViews),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('center')
							]),
						_List_fromArray(
							[
								$mgold$elm_nonempty_list$List$Nonempty$isSingleton(model.r) ? endButtons : A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('buttons')
									]),
								midwayButtons),
								$author$project$View$viewScore(model)
							]))
					]);
			}());
	});
var $author$project$Types$SetGroup = function (a) {
	return {$: 4, a: a};
};
var $mgold$elm_nonempty_list$List$Nonempty$foldl = F3(
	function (f, b, _v0) {
		var x = _v0.a;
		var xs = _v0.b;
		return A3(
			$elm$core$List$foldl,
			f,
			b,
			A2($elm$core$List$cons, x, xs));
	});
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm_community$maybe_extra$Maybe$Extra$isNothing = function (m) {
	if (m.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $mgold$elm_nonempty_list$List$Nonempty$sort = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	return A3(
		$mgold$elm_nonempty_list$List$Nonempty$insertWith,
		$elm$core$Basics$compare,
		x,
		$elm$core$List$sort(xs));
};
var $mgold$elm_nonempty_list$List$Nonempty$reverse = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	var revapp = function (_v1) {
		revapp:
		while (true) {
			var ls = _v1.a;
			var c = _v1.b;
			var rs = _v1.c;
			if (!rs.b) {
				return A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, c, ls);
			} else {
				var r = rs.a;
				var rss = rs.b;
				var $temp$_v1 = _Utils_Tuple3(
					A2($elm$core$List$cons, c, ls),
					r,
					rss);
				_v1 = $temp$_v1;
				continue revapp;
			}
		}
	};
	return revapp(
		_Utils_Tuple3(_List_Nil, x, xs));
};
var $mgold$elm_nonempty_list$List$Nonempty$uniq = function (_v0) {
	var x = _v0.a;
	var xs = _v0.b;
	var unique = F3(
		function (seen, done, next) {
			unique:
			while (true) {
				if (!next.b) {
					return done;
				} else {
					var y = next.a;
					var ys = next.b;
					if (A2($elm$core$List$member, y, seen)) {
						var $temp$seen = seen,
							$temp$done = done,
							$temp$next = ys;
						seen = $temp$seen;
						done = $temp$done;
						next = $temp$next;
						continue unique;
					} else {
						var $temp$seen = A2($elm$core$List$cons, y, seen),
							$temp$done = A2($mgold$elm_nonempty_list$List$Nonempty$cons, y, done),
							$temp$next = ys;
						seen = $temp$seen;
						done = $temp$done;
						next = $temp$next;
						continue unique;
					}
				}
			}
		});
	return $mgold$elm_nonempty_list$List$Nonempty$reverse(
		A3(
			unique,
			_List_fromArray(
				[x]),
			A2($mgold$elm_nonempty_list$List$Nonempty$Nonempty, x, _List_Nil),
			xs));
};
var $author$project$View$groupSelect = function (model) {
	var groupOption = function (group) {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(group),
					$elm$html$Html$Attributes$selected(
					function () {
						if (group === 'All') {
							return $elm_community$maybe_extra$Maybe$Extra$isNothing(model.e.H);
						} else {
							var grp = group;
							return _Utils_eq(
								model.e.H,
								$elm$core$Maybe$Just(grp));
						}
					}())
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(group)
				]));
	};
	var discoveredGroups = A2(
		$mgold$elm_nonempty_list$List$Nonempty$cons,
		'All',
		$mgold$elm_nonempty_list$List$Nonempty$sort(
			$mgold$elm_nonempty_list$List$Nonempty$uniq(
				A2(
					$mgold$elm_nonempty_list$List$Nonempty$map,
					$elm$core$Maybe$withDefault('err: unexpected Nothing'),
					A3(
						$mgold$elm_nonempty_list$List$Nonempty$filter,
						$elm_community$maybe_extra$Maybe$Extra$isJust,
						$elm$core$Maybe$Just('err: must have at least one subject with group'),
						A2(
							$mgold$elm_nonempty_list$List$Nonempty$map,
							function ($) {
								return $.H;
							},
							model.B.ba))))));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w3-container w3-card')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Select ' + (model.B.ap + '…'))
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w3-select w3-border settings-select'),
						$elm$html$Html$Attributes$name('group'),
						$elm$html$Html$Events$onInput($author$project$Types$SetGroup)
					]),
				A3(
					$mgold$elm_nonempty_list$List$Nonempty$foldl,
					F2(
						function (grp, acc) {
							return _Utils_ap(
								acc,
								_List_fromArray(
									[
										groupOption(grp)
									]));
						}),
					_List_Nil,
					discoveredGroups))
			]));
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Types$SetQuizType = function (a) {
	return {$: 15, a: a};
};
var $author$project$View$quizTypeSelect = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w3-container w3-card')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Select Quiz Type…')
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w3-select w3-border settings-select'),
						$elm$html$Html$Attributes$name('quizType'),
						$elm$html$Html$Events$onInput($author$project$Types$SetQuizType),
						$elm$html$Html$Attributes$disabled(!model.e.E)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('MultipleChoice'),
								$elm$html$Html$Attributes$selected(!model.e.O)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Multiple Choice')
							])),
						A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('TextField'),
								$elm$html$Html$Attributes$selected(model.e.O === 1)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Text Field')
							]))
					]))
			]));
};
var $author$project$Types$SetScript = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $elm$html$Html$b = _VirtualDom_node('b');
var $author$project$View$radioScriptLabelHtml = function (script) {
	if (script === 1) {
		return _List_fromArray(
			[
				$elm$html$Html$text(' Devanagari — the \"divine script\", e.g. '),
				A2(
				$elm$html$Html$b,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('योग')
					]))
			]);
	} else {
		return _List_fromArray(
			[
				$elm$html$Html$text(' ISO 15919 — transliterated to Latin letters, e.g. '),
				A2(
				$elm$html$Html$b,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('yōga')
					]))
			]);
	}
};
var $author$project$Config$scriptHeading = 'Sanskrit Script';
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$View$scriptFieldSet = function (model) {
	return A2(
		$elm$html$Html$fieldset,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$legend,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text($author$project$Config$scriptHeading)
							]))
					])),
				A2(
				$elm$html$Html$table,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('w3-radio radio'),
												$elm$html$Html$Attributes$id('unicode'),
												$elm$html$Html$Attributes$name('script'),
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$value('Unicode'),
												$elm$html$Html$Events$onInput($author$project$Types$SetScript),
												$elm$html$Html$Attributes$checked(model.e.V === 1)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('unicode')
											]),
										$author$project$View$radioScriptLabelHtml(1))
									]))
							])),
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('w3-radio radio'),
												$elm$html$Html$Attributes$id('latin'),
												$elm$html$Html$Attributes$name('script'),
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$value('Latin'),
												$elm$html$Html$Events$onInput($author$project$Types$SetScript),
												$elm$html$Html$Attributes$checked(!model.e.V)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$td,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('quiz')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('latin')
											]),
										$author$project$View$radioScriptLabelHtml(0))
									]))
							]))
					]))
			]));
};
var $author$project$Types$SetTrainMode = function (a) {
	return {$: 3, a: a};
};
var $author$project$View$trainModeSelect = function (model) {
	var trainModeOption = function (_v0) {
		var mode = _v0.a;
		var modeString = _v0.b;
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$option,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(modeString),
						$elm$html$Html$Attributes$selected(
						_Utils_eq(model.e.E, mode))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2($author$project$Config$showTrainMode, model.B, mode))
					]))
			]);
	};
	var filterConfig = F2(
		function (trainMode, htmlElements) {
			return A2($elm$core$List$member, trainMode, model.B.a3) ? htmlElements : _List_Nil;
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w3-container w3-card')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Select Training Mode…')
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w3-select w3-border settings-select'),
						$elm$html$Html$Attributes$name('trainMode'),
						$elm$html$Html$Events$onInput($author$project$Types$SetTrainMode)
					]),
				A3(
					$elm$core$List$foldl,
					F2(
						function (modeAndName, acc) {
							return _Utils_ap(
								acc,
								A2(
									filterConfig,
									modeAndName.a,
									trainModeOption(modeAndName)));
						}),
					_List_Nil,
					_List_fromArray(
						[
							_Utils_Tuple2(0, 'Review'),
							_Utils_Tuple2(1, 'Urname'),
							_Utils_Tuple2(2, 'LocalName'),
							_Utils_Tuple2(3, 'Description')
						])))
			]));
};
var $author$project$View$viewSettings = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w3-container w3-card-4 card')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.B.ai)
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Settings')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A2(
					$elm$core$List$cons,
					$author$project$View$trainModeSelect(model),
					A2(
						$elm$core$List$cons,
						A2($elm$html$Html$br, _List_Nil, _List_Nil),
						A2(
							$elm$core$List$cons,
							$author$project$View$quizTypeSelect(model),
							A2(
								$elm$core$List$cons,
								A2($elm$html$Html$br, _List_Nil, _List_Nil),
								_Utils_ap(
									model.B.aP ? _List_fromArray(
										[
											$author$project$View$scriptFieldSet(model)
										]) : _List_Nil,
									model.B.ao ? _List_fromArray(
										[
											$author$project$View$groupSelect(model)
										]) : _List_Nil)))))),
				A2($elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('center')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w3-btn startButton'),
								$elm$html$Html$Events$onClick($author$project$Types$Start)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Start')
							])),
					$elm_community$maybe_extra$Maybe$Extra$isJust(model.B.br) ? _List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('w3-btn end-button'),
									$elm$html$Html$Events$onClick($author$project$Types$GoLanding)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Change Deck')
								]))
						]) : _List_Nil))
			]));
};
var $author$project$View$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				model.at ? $author$project$View$viewSettings(model) : A2(
				$author$project$View$viewCard,
				model,
				$mgold$elm_nonempty_list$List$Nonempty$head(model.r)),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('copyright')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.B.af)
					]))
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{bo: $author$project$Main$init, bB: $author$project$Main$subscriptions, bF: $author$project$Main$update, bG: $author$project$View$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));