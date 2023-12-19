const testBlock = (name: string): void => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

type Primitive = number | string | boolean | undefined | symbol | bigint
type Comparable = Primitive | Primitive[] | Primitive[][]

const areEqual = (a: Comparable, b: Comparable) => {
    if (a === b) return true
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
        return false
    }
    for (let i = 0; i < a.length; i++) {
        if (!areEqual(a[i], b[i])) {
            return false;
        }
    }
    return true;
};

const test = (whatWeTest: string, 
    actualResult: Comparable,
    expectedResult: Comparable) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value: unknown) => {
    return typeof value;
};

const getTypesOfItems = (arr: unknown[]) => {
    return arr.map(getType)
};

const allItemsHaveTheSameType = (arr: unknown[]) => {
    return new Set(getTypesOfItems(arr)).size === 1
};

const getRealType = (value: unknown) => {
    if (Number.isNaN(value)) return 'NaN'
    if (value === null) return 'null'
    if (value === Infinity || value === -Infinity) return 'Infinity'
    const type = getType(value)
    if (type !== 'object') return type
    if (value instanceof Date) return 'date'
    if (value instanceof RegExp) return 'regexp'
    if (value instanceof Set) return 'set'
    if (value instanceof Map) return 'map'
    return type
};

const getRealTypesOfItems = (arr: unknown[]) => {
    return arr.map(getRealType)
};

const everyItemHasAUniqueRealType = (arr: unknown[]) => {
    return new Set(getRealTypesOfItems(arr)).size === arr.length
};

const countRealTypes = (arr: unknown[]) => {
    const counts: Record<string, number> = {}
    for (const item of arr) {
        const type = getRealType(item)
        counts[type] = (counts[type] || 0) + 1
    }
    return Object.entries(counts).sort((a, b) => a[0] > b[0] ? 1 : -1)
};

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test(
    'All values are strings but wait',
    allItemsHaveTheSameType(['11', new String('12'), '13']),
    false
);

test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / ('a' as any), 1 / 0]),
    true
);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    'asd',
    13.1,
    BigInt('987654321987654321'),
    true,
    Symbol(),
    undefined,
    {},
    () => {},
    NaN,
    null,
    Infinity,
    new Date(),
    /\w+/,
    new Set(),
    new Map()
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol',
    'undefined',
    'object',
    'function',
    'number',
    'object',
    'number',
    'object',
    'object',
    'object',
    'object'
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol',
    'undefined',
    'object',
    'function',
    'NaN',
    'null',
    'Infinity',
    'date',
    'regexp',
    'set',
    'map'
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, ('123' as any) === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);



