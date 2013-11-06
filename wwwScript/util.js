module.exports = {
  mixin: function(base, keyValues, defaults) {
    function getValue(valueA, valueB) {
      return (valueA !== undefined) ? valueA : valueB;
    }

    defaults = defaults || {};

    Object.keys(keyValues)
      .concat(Object.keys(defaults))
      .reduce(function(prev, curr) {
        if (prev.indexOf(curr) === -1) { prev.push(curr); }
        return prev;
      }, [])
      .forEach(function(key) {
        base[key] = getValue(keyValues[key], defaults[key]);
      });

    return base;
  }
};