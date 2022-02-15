const transform = (obj, predicate) => {
  return Object.keys(obj).reduce((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

const omit = (obj, items) =>
  transform(obj, (value, key) => !items.includes(key));

module.exports = omit;
