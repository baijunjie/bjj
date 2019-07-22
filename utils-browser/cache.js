/**
 * Persistence cache
 */

const IS_PRO = process.env.NODE_ENV === 'production'
const PRO_PREFIX = 'PRO_'
const DEV_PREFIX = 'DEV_'
const PREFIX = IS_PRO ? PRO_PREFIX : DEV_PREFIX

function get (key) {
  if (!key) {
    console.error(`The parameter key cannot be empty.`)
    return null
  }

  let data = localStorage.getItem(PREFIX + key)

  try {
    data = JSON.parse(data)
  } catch (err) {
    return null
  }

  data = overdueValidate(data)

  if (data) {
    return data.value
  } else {
    del(key)
    return null
  }
}

function set (key, value, validTime) {
  if (!key) {
    console.error(`The parameter key cannot be empty.`)
    return
  }

  if (value === undefined) {
    console.error(`When setting the cache, the key<${key}> must have an explicit value.`)
    return
  }

  const data = JSON.stringify({
    value,
    expire: validTime ? Date.now() + validTime : null
  })

  try {
    return localStorage.setItem(PREFIX + key, data)
  } catch (err) {
    // 如果写入失败，可能是因为文件超出可写入的大小
    // 那么现将该缓存清除后，再重新写入
    del(key)
    return localStorage.setItem(PREFIX + key, data)
  }
}

function del (key) {
  return localStorage.removeItem(PREFIX + key)
}

function has (key) {
  return !!localStorage.getItem(PREFIX + key)
}

function keys () {
  const reg = new RegExp(`^${PREFIX}`)
  return Object.keys(localStorage)
    .filter(key => reg.test(key))
    .map(key => key.replace(reg, ''))
}

// overdue validate
function overdueValidate (data) {
  if (data && (
    !data.expire ||
    data.expire > Date.now())) {
    return data
  } else {
    return null
  }
}

export default {
  get,
  set,
  del,
  has,
  keys
}
