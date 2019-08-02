/**
 * VueRouter 增强
 *
 * 扩展方法：
 * - setRoutes      为路由实例设置 routes 配置对象
 * - findRoute      根据 key、value 获取对应的配置对象
 * - filterRoutes   遍历传入的 routes，将会剔除返回值为 false 的路由（用于权限控制，只有在调用 setRoutes 之前删除才有效）
 * - getMatched     传入 vue-router 的路由对象，返回一个数组，表示从根路由开始到该路由结束，所经过的所有路由对象组成的数组（用于生成面包屑）
 * - replaceRouter  传入一个新的 router 实例，用于重置当前的 router 实例
 *
 * 扩展属性：
 * - routes      指向路由的配置对象 routes
 *
 * 注意，每一个路由配置对象都会挂载到对应的 vue-router 路由信息对象的 meta 属性下
 */
import VueRouter from 'vue-router'
import pathToRegexp from 'path-to-regexp'
import _get from 'lodash/get'
import _isArray from 'lodash/isArray'
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
      route = clone(route)
      route.meta = clone(route.meta, { parentPath })

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
      const vueRoute = clone(route)
      const isLayout = vueRoute.meta && vueRoute.meta.layout
      const hasChildren = vueRoute.children && vueRoute.children.length

      if (vueRoute.layout || hasChildren) {
        const children = hasChildren ? vueRoute.children.concat() : []

        if (vueRoute.component && !isLayout) {
          children.unshift({
            path: '',
            name: vueRoute.name,
            meta: vueRoute.meta,
            component: vueRoute.component
          })

          delete vueRoute.name
          delete vueRoute.meta
          delete vueRoute.component
        }

        if (!vueRoute.component && !vueRoute.layout) {
          vueRoute.layout = RouterView
        }

        vueRoute.children = this.toVueRoutes(children)
      }

      if (!vueRoute.component) {
        if (vueRoute.layout) {
          vueRoute.meta = clone(vueRoute.meta, { layout: true })
          vueRoute.component = vueRoute.layout
        } else {
          vueRoute.meta = clone(vueRoute.meta, { empty: true })
        }
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
    for (let route of routes) {
      route = clone(route)
      const returnValue = callback(route)
      if (!returnValue) continue
      if (route.children && route.children.length) {
        route.children = this.filterRoutes(route.children, callback)
      }
      newRoutes.push(route)
    }
    return newRoutes
  }

  getMatched (route = null) {
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

    route = clone(route)
    const matched = [ route ]
    let parentPath = route.meta.parentPath

    while (parentPath) {
      route = this.findRoute('path', parentPath)
      if (!route) break
      parentPath = route.meta.parentPath
      route = clone(route, {
        path: pathToRegexp.compile(route.path)(params)
      })
      matched.push(route)
    }

    return matched.reverse()
  }

  reset (...args) {
    const router = Router.create(...args)
    // reset router
    this.matcher = router.matcher
    this.routes = router.routes || []
    return this
  }

  /**
   * Override
   * 方法可被重写
   */
  static create (routes = null, options = null) {
    if (!options && routes && !_isArray(routes)) {
      options = routes
      routes = null
    }

    const router = new Router(options || {})

    if (routes) {
      router.setRoutes(routes)
    }

    return router
  }
}

function clone (...args) {
  return Object.assign({}, ...args)
}

