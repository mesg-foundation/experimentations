const assert = require('assert')
const filterMatching = require('./filterMatching')

describe('FilterMatching', () => {
  it ('should accept equal filter', () => {
    assert.equal(true, filterMatching({
      foo: [{ eq: 'bar' }]
    }, { foo: 'bar' }))

    assert.equal(false, filterMatching({
      foo: [{ eq: 'barz' }]
    }, { foo: 'bar' }))
  })

  it ('should accept comparaison filters', () => {
    const data = { value: 4 }
    assert.equal(true, filterMatching({
      value: [{ gt: 3 }]
    }, data))
    assert.equal(true, filterMatching({
      value: [{ gte: 4 }]
    }, data))
    assert.equal(false, filterMatching({
      value: [{ lt: 4 }]
    }, data))
  })

  it ('should accept include filter', () => {
    const data = { array: ['hello', 'world'], string: 'hello world' }
    assert.equal(true, filterMatching({
      array: [{ include: 'hello' }]
    }, data))
    assert.equal(true, filterMatching({
      string: [{ include: 'hello' }]
    }, data))
    assert.equal(false, filterMatching({
      array: [{ include: 'hello world' }]
    }, data))
  })

  it ('should accept object nested values', () => {
    const data = { obj: { nested: { nested2: 42 } } }
    assert.equal(true, filterMatching({
      'obj.nested.nested2': [{ eq: 42 }]
    }, data))

    assert.equal(false, filterMatching({
      'obj.nested2.a': [{ eq: 42 }]
    }, data))
  })

  it ('should accept array nested values', () => {
    const data = { array: [1, 2, 3, 4, 5], arrayWithObj: [{ a: 2 }, { b: 4 }] }
    assert.equal(true, filterMatching({
      'array.2': [{ eq: 3 }],
      'arrayWithObj.1.b': [{ eq: 4 }]
    }, data))

    assert.equal(false, filterMatching({
      'array.2': [{ eq: 3 }],
      'arrayWithObj.1.a': [{ eq: 4 }]
    }, data))
  })

  it('should accept complex object', () => {
    assert.equal(true, filterMatching({
      foo: [
        { eq: 'bar' },
        { include: 'ar' }
      ],
      test: [
        { gt: 10 },
        { lte: 100 }
      ],
      array: [
        { include: 'hello' }
      ],
      ['array.1']: [
        { eq: 'world' }
      ],
      ['list.2.c']: [
        { gte: 5 },
        { lt: 6 }
      ]
    }, {
      foo: 'bar',
      test: 50,
      array: ['hello', 'world'],
      list: [
        { a: 1 },
        { b: 3 },
        { c: 5 }
      ]
    }))
  })
})
