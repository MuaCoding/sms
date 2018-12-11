function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

//转数组对象
function getRandomArr(n, o) {
  let result = {
    list: [],
    pname: ''
  }
  for (let i in o) {
    for (let j = 0; j < o[i].list.length; j++) {
      if (Number(n) == Number(o[i].list[j].id)) {
        result.pname = o[i].pname;
        result.list[result.list.length] = {
          name: o[i].list[j].name
        };
      }
    }
  }
  return result
}



//深拷贝
export function DeepCopy(arr) {
  return arr.map((e) => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}

//返回对象
export function FormatObject(tar, value, arr) {

  let array = [];
  if (value && value.length != 0) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result[result.length] = getRandomArr(value[i], arr);
    }
    const target = result.reduce((res, obj) => {
      if (res[obj.pname]) {
        res[obj.pname].list = res[obj.pname].list.concat(obj.list);
      } else {
        res[obj.pname] = obj;
      }
      return res;
    }, {});
    array = Object.values(target);
    return array;
  } else if (!value || value.length === 0) {
    console.log(tar)
    for (let i = 0; i < tar.length;i++) {
      array[array.length] = {
        pname: tar[i],
        list: []
      }
    }
    return array
  } else {
    for (let i in arr) {
      arr[i].list = [];
    }
    return arr
  }
}


//计算（产品代号，通道，短信）总数
export function ComputeTotal(arr) {
  let _arr = arr.slice(), s = 0, f = 0, u = 0;
  for (let i = 0; i < _arr.length; i++) {
    s += parseInt(_arr[i].success)
    f += parseInt(_arr[i].fail)
    u += parseInt(_arr[i].unknown)
  }
  _arr[_arr.length] = {
    name: '总计',
    success: s,
    fail: f,
    unknown: u
  }
  return _arr
}
//独立计算回执原因总数
export function ComputeSum(arr) {
  let _arr = arr.slice(), c = 0;
  for (let i = 0; i < _arr.length; i++) {
    c += parseInt(_arr[i].count)
  }
  _arr[_arr.length] = {
    _id: '总计',
    count: c,
  }
  return _arr
}
