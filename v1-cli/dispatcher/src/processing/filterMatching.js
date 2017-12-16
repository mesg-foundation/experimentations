const CONDITIONS = {
  eq: (x, y) => x == y,
  gt: (x, y) => x > y,
  gte: (x, y) => x >= y,
  lt: (x, y) => x < y,
  lte: (x, y) => x <= y,
  include: (x, y) => (x || '').indexOf(y) >= 0
}

const valueOf = (data, key) => {
  if (!data) { return undefined }
  if (key.indexOf('.') < 0) { return (data || {})[key] }
  const split = key.split('.')
  return valueOf(data[split[0]], split.slice(1).join('.'))
}

module.exports = (filters, data) => Object.keys(filters || [])
  .every(testKey => filters[testKey].every(condition => Object.keys(condition)
    .every(x => CONDITIONS[x](valueOf(data, testKey), condition[x]))
  ))

