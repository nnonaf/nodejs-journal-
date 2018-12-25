var { set, omit, get, forEach, split, reduce, map, indexOf, first, isNumber, isString, isArray, isObject, replace } = require('lodash');
var { DocumentQuery, Types } = require('mongoose');
var EJSON = require('mongodb-extended-json');

var parseQuery = (data) => {
  // console.log('parse data => ', data);
  forEach(data, (val, key) => {
    if (val && val.match && val.match(/\/.*\/.*/)) {
      // match for regex values
      try {
        eval(val);
        data[key] = eval(val);
      } catch (error) {
      }
    } else if (val && val.match && (val.match(/\{.*\}/) || val.match(/(true|false)/))) {
      // match for object values
      try {
        data[key] = EJSON.parse(val);
      } catch (error) {
      }
    }
    // cast string to relevant ObjectId
    let v = data[key];
    if (typeof v === 'string' && Types.ObjectId.isValid(v)) data[key] = Types.ObjectId(v);
  });
  return data;
}

var getSumData = (data, query) => {
  let regex = /(\w{1,})\[(.*)\]/g;
  let match = regex.exec(query);
  if (match && match.length > 1) {
    let parts = split(match[2], ',');
    switch (parts.length) {
      case 1:
        if (regex.test(parts[0])) {
          return getSumData(data, parts[0]);
        }
        return reduce(get(data, match[1]), (prev, curr) => {
          return prev + get(curr, parts[0], 0);
        }, 0);
      case 3:
        return reduce(get(data, match[1]), (prev, curr) => {
          if (get(curr, parts[0]) == parts[1]) {
            return prev + get(curr, parts[2], 0);
          }
          return prev;
        }, 0);
      default:
        return 0;
    }
  }
  return get(data, query, 0);
}

var filterArray = (data, condition, props, others) => {
  return map(data, (d) => filterProperties(d, condition, props, others));
}

var filterObject = (data, condition, props, others) => {
  if (condition(data)) {
    forEach(data, (val, key) => {
      if (indexOf(props, key) >= 0) {
        delete data[key];
        return;
      }
      data[key] = filterProperties(val, condition, props, others);
    });
  } else {
    forEach(data, (val, key) => {
      if (indexOf(others, key) >= 0) {
        delete data[key];
        return;
      }
      data[key] = filterProperties(val, condition, props, others);
    });
  }
  return data;
}

var filterProperties = (data, condition, props, others) => {
  if (!data) {
    return data;
  }

  if (isNumber(data)) {
    return data;
  }

  if (isString(data)) {
    return data;
  }

  if (isArray(data)) {
    return filterArray(data, condition, props, others);
  }

  if (isObject(data)) {
    return filterObject(data, condition, props, others);
  }

  return data;
}

var getPopulateObject = (path) => {
  let parts = split(path, '.');
  let obj = {};
  let currentPath = 'populate';
  forEach(parts, (p) => {
    set(obj, `${currentPath}.path`, replace(p, ':', '.'));
    currentPath += '.populate';
  });
  return obj.populate;
}

module.exports = {
  getPopulateObject,
  parseQuery,
  generateGetSingleQuery: async (model, cond, options) => {
    let search = undefined;
    switch (typeof cond) {
      case 'string':
        search = model.findById(cond);
        break;
      default:
        search = model.findOne(cond);
    }
    if (options && options._select) {
      search.select(replace(options._select, /,/g, ' '));
    }
    if (options && options._populate) {
      try {
        let split = options._populate.split(',');
        for (var i = 0; i < split.length; i++) {
          search.populate(getPopulateObject(split[i]));
        }
      } catch (error) { }
    }
    return await search.exec();
  },
  generateSearchQuery: async (model, cond) => {
    let data = omit(cond, '_sort', '_skip', '_limit', '_count', '_sum', '_populate', '_or', '_and', '_select');
    data = parseQuery(data);
    /**
     * @type {DocumentQuery}
     */
    let search = model.find(data);
    if (cond._or) {
      let or = JSON.parse(cond._or);
      forEach(or, (val, key) => {
        or[key] = parseQuery(val);
      });
      search.or(or);
    }
    if (cond._and) {
      let and = JSON.parse(cond._and);
      forEach(and, (val, key) => {
        and[key] = parseQuery(val);
      });
      search.and(and)
    }
    if (cond._sort) {
      let sort = {};
      try {
        let sortString = cond._sort.split(',');
        forEach(sortString, (s) => {
          let split = s.split(':');
          sort[split[0]] = split[1];
        })
      } catch (error) { }
      search.sort(sort);
    }
    if (cond._skip) {
      search.skip(Number.parseInt(cond._skip));
    }
    if (cond._limit && Number.parseInt(cond._limit) <= 500) {
      search.limit(Number.parseInt(cond._limit));
    } else {
      search.limit(500);
    }
    if (cond._select) {
      search.select(replace(cond._select, /,/g, ' '));
    }
    if (cond._count) {
      return await search.count();
    } else if (cond._sum) {
      let list = await search.exec();
      return list.reduce((prev, curr) => {
        return prev + Number(getSumData(curr, cond._sum));
      }, 0);
    } else {
      if (cond._populate) {
        try {
          let split = cond._populate.split(',');
          for (var i = 0; i < split.length; i++) {
            search.populate(getPopulateObject(split[i]));
          }
        } catch (error) { }
      }
      return await search.exec();
    }
  },
  filterProperties: (data, condition, props = ['password', 'isAdmin', 'documents'], others = ['password']) => {
    try {
      if (data && data._doc) {
        data = data._doc;
      }
      else if (first(data) && first(data)._doc) {
        data = map(data, (d) => d._doc);
      }
      return filterProperties(JSON.parse(JSON.stringify(data)), condition, props, others);
    } catch (error) {
      return data;
    }
  },
  /**
   * @returns {Date}
   */
  getNextDayOfWeek: (date, dayOfWeek) => {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)

    var resultDate = new Date(date.getTime());

    if (date.getDay() == dayOfWeek) {
      resultDate.setDate(date.getDate() + 7);
    }
    if (date.getDay() < dayOfWeek) {
      resultDate.setDate(date.getDate() + dayOfWeek);
    }
    if (date.getDay() > dayOfWeek) {
      resultDate.setDate(date.getDate() + 7 - dayOfWeek);
    }

    return resultDate;
  }
}
