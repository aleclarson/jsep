import jsep from '../src/jsep.js';

export const binOps = {
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'%': (a, b) => a % b,
};

export const unOps = {
	'-': a => -a,
	'+': a => +a,
};

/* eslint-enable brace-style */

export function doEval(node) {
	if (node.type === 'BinaryExpression') {
		return binOps[node.operator](doEval(node.left), doEval(node.right));
	}
	else if (node.type === 'UnaryExpression') {
		return unOps[node.operator](doEval(node.argument));
	}
	else if (node.type === 'Literal') {
		return node.value;
	}
}

export function testOpExpression(str, assert) {
	assert.equal(doEval(jsep(str)), eval(str));
}

export function filterProps(larger, smaller) {
	const rv = (typeof larger.length === 'number') ? [] : {};
	for (let propName in smaller) {
		let propVal = smaller[propName];
		if (typeof propVal === 'string' || typeof propVal === 'number') {
			rv[propName] = larger[propName];
		}
		else {
			rv[propName] = filterProps(larger[propName], propVal);
		}
	}
	return rv;
}

export function testParser(inp, out, assert) {
	const parsedVal = jsep(inp);
	return assert.deepEqual(filterProps(parsedVal, out), out);
}

export function esprimaComparisonTest(str, assert) {
	const parsedVal = jsep(str);
	const esprimaVal = esprima.parse(str);
	return assert.deepEqual(parsedVal, esprimaVal.body[0].expression);
}
