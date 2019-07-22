/**
 * VueRouter 增强
 *
 * 扩展方法：
 * - setRoutes      为路由实例设置 routes 配置对象
 * - findRoute      根据 key、value 获取对应的配置对象
 * - filterRoutes   遍历传入的 routes，将会剔除返回值为 false 的路由（用于权限控制，只有在调用 setRoutes 之前删除才有效）
 * - getMetaMatched 传入 vue-router 的路由对象，返回一个数组，表示从根路由开始到该路由结束，所经过的所有路由的 meta 对象组成的数组（用于生成面包屑）
 *
 * 扩展属性：
 * - routes      指向路由的配置对象 routes
 *
 * 注意，每一个路由配置对象都会挂载到对应的 vue-router 路由信息对象的 meta 属性下
 */
import VueRouter from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import _get from 'lodash/get'
import RouterView from './RouterView'

const slashStartReg = new RegExp('^/+')
const slashEndReg = new RegExp('/+$')

function pathCorrect(path, parentPath) {
  if (parentPath && !slashStartReg.test(path)) {
    // 处理相对路径
    return parentPath.replace(slashEndReg, '') + '/' + path.replace(slashStartReg, '')
  } else {
    return '/' + path.replace(slashStartReg, '')
  }
}

export default class Router extends VueRouter {
  setRoutes (routes) {
    routes = this.initRoutes(routes)
    this.routes = (this.routes || []).concat(routes)
    this.addRoutes(this.toVueRoutes(routes))
  }

  initRoutes (routes, parentPath) {
    return routes.map(route => {
      // 如果 parent 是对象，就存在循环引用，在SSR中将不能被序列化而报错
      route.meta = Object.assign({}, route.meta, { parentPath })

      if (!route.component) {
        route.meta.empty = true
      }

      if (route.path === undefined) {
        route.path = route.name || ''
      }

      if (typeof route.path === 'string') {
        route.path = pathCorrect(route.path, parentPath)
      }

      if (typeof route.redirect === 'string') {
        route.redirect = pathCorrect(route.redirect, parentPath)
      }

      if (route.children && route.children.length) {
        route.children = this.initRoutes(route.children, route.path)
      }

      return route
    })
  }

  toVueRoutes (routes) {
    return routes.map(route => {
      const vueRoute = Object.assign({}, route)

      if (vueRoute.children && vueRoute.children.length) {
        const children = vueRoute.children.concat()

        if (vueRoute.component) {
          children.unshift({
            path: '',
            name: vueRoute.name,
            meta: vueRoute.meta,
            component: vueRoute.component
          })

          delete vueRoute.name
          delete vueRoute.component
        }

        if (!vueRoute.component) {
          vueRoute.component = vueRoute.layout || RouterView
        }

        vueRoute.children = this.toVueRoutes(children)
      }

      return vueRoute
    })
  }

  findRoute (key, value, routes = null) {
    routes = routes || this.routes || []
    let targetRoute

    routes.some(route => {
      if (_get(route, key) === value ||
        (key === 'path' &&
        pathToRegexp(route[key]).exec(value))) {
        targetRoute = route
        return targetRoute
      } else if (route.children && route.children.length) {
        targetRoute = this.findRoute(key, value, route.children)
        return targetRoute
      }
    })

    return targetRoute
  }

  filterRoutes (routes, callback) {
    routes = routes || []
    const newRoutes = []
    for (const route of routes) {
      const returnValue = callback(route)
      if (!returnValue) continue
      if (route.children && route.children.length) {
        route.children = this.filterRoutes(route.children, callback)
      }
      newRoutes.push(route)
    }
    return newRoutes
  }

  getMetaMatched (route = null) {
    route = route || this.currentRoute
    const fullPath = route.fullPath

    // 解析路径中的参数
    const keys = []
    const result = pathToRegexp(route.path, keys).exec(fullPath)
    const params = route.params || {}
    if (result) {
      keys.forEach((item, i) => {
        params[item.name] = result[i + 1]
      })
    }

    let meta = Object.assign({}, route.meta, {
      path: fullPath
    })
    if (route.name) meta.name = route.name
    if (route.redirect) meta.redirect = route.redirect
    const matched = [meta]

    while (meta.parentPath) {
      const route = this.findRoute('path', meta.parentPath)
      if (!route) break
      meta = Object.assign({}, route.meta, {
        path: pathToRegexp.compile(route.path)(params)
      })
      if (route.name) meta.name = route.name
      if (route.redirect) meta.redirect = route.redirect
      matched.push(meta)
    }

    return matched.reverse()
  }
}
