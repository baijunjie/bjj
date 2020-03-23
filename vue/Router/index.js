/**
 * VueRouter 增强
 *
 * 扩展属性：
 * - routes                  指向路由的配置对象 routes
 *
 * 扩展静态方法：
 * - filterRoutes            遍历传入的 routes，将会剔除返回值为 false 的路由（用于权限控制，只有在调用 setRoutes 之前删除才有效）
 * - mapRoutes               遍历传入的 routes，如果返回一个新的 route，将会替换掉原有的 route（用于权限控制，只有在调用 setRoutes 之前替换才有效）
 *
 * 扩展实例方法：
 * - setRoutes               为路由实例设置 routes 配置对象
 * - findRoute               根据 key、value 获取对应的配置对象
 * - findFirstAvailableRoute 获取第一个可访问的路由对象（一般在路由被过滤后，重新设置登陆页面时使用）
 * - getMatched              传入 vue-router 的路由对象，返回一个数组，表示从根路由开始到该路由结束，所经过的所有路由对象组成的数组（用于生成面包屑）
 * - reset                   传入一个新的 router 实例，用于重置当前的 router 实例
 *
 * 注意，每一个路由配置对象都会挂载到对应的 vue-router 路由信息对象的 meta 属性下
 */
import VueRouter from 'vue-router'
import { pathToRegexp, compile } from 'path-to-regexp'
import _get from 'lodash/get'
import _isArray from 'lodash/isArray'
import RouterView from './RouterView'

const slashStartReg = new RegExp('^/+')
const slashEndReg = new RegExp('/+$')

function pathCorrect (path, parentPath) {
  if (parentPath && !slashStartReg.test(path)) {
    // 处理相对路径
    return parentPath.replace(slashEndReg, '') + '/' + path.replace(slashStartReg, '')
  } else {
    return '/' + path.replace(slashStartReg, '')
  }
}

export default class Router extends VueRouter {
  setRoutes (routes) {
    routes = Router.initRoutes(routes)
    this.routes = (this.routes || []).concat(routes)
    this.addRoutes(Router.toVueRoutes(routes))
  }

  findRoute (key, value, routes = null) {
    routes = routes || this.routes || []
    let targetRoute = null

    routes.some(route => {
      if (_get(route, key) === value ||
        (key === 'path' &&
        pathToRegexp(route[key]).exec(value))) {
        targetRoute = route
      } else if (route.children && route.children.length) {
        targetRoute = this.findRoute(key, value, route.children)
      }
      return !!targetRoute
    })

    return targetRoute ? clone(targetRoute) : null
  }

  findFirstAvailableRoute (routes = null) {
    routes = routes || this.routes || []
    let targetRoute = null

    routes.some(route => {
      if (this.isAvailableRoute(route)) {
        targetRoute = route
      } else if (route.children && route.children.length) {
        targetRoute = this.findFirstAvailableRoute(route.children)
      }
      return !!targetRoute
    })

    return targetRoute ? clone(targetRoute) : null
  }

  /**
   * Override
   * 方法可被重写
   * 判断路由对象是否可被访问
   */
  isAvailableRoute (route) {
    if (!route) return false

    if (route.redirect) {
      return this.isAvailableRoute(this.findRoute('path', route.redirect))
    }

    return true
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

    route = this.findRoute('path', route.path) || { meta: {} }
    route.fullPath = fullPath
    const matched = [ route ]
    let parentPath = route.meta.parentPath

    while (parentPath) {
      route = this.findRoute('path', parentPath)
      if (!route) break
      parentPath = route.meta.parentPath
      route.fullPath = compile(route.path)(params)
      matched.unshift(route)
    }

    return matched
  }

  reset (...args) {
    const router = Router.create(...args)
    // reset router
    this.matcher = router.matcher
    this.routes = router.routes || []
    return this
  }

  static initRoutes (routes, parentPath) {
    return routes.map(route => {
      route = clone(route)
      route.meta = clone(route.meta, { parentPath })

      // 这里假定被初始化的 route 对象的子路由也被初始化过
      if (route.__initRoutes) return route
      route.__initRoutes = true

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
        route.children = Router.initRoutes(route.children, route.path)
      }

      return route
    })
  }

  static toVueRoutes (routes) {
    return routes.map(route => {
      const vueRoute = clone(route)

      // 这里假定被转化的 route 对象的子路由也被转化过
      if (vueRoute.__toVueRoutes) return vueRoute
      vueRoute.__toVueRoutes = true

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

        vueRoute.children = Router.toVueRoutes(children)
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

  static filterRoutes (routes, callback) {
    routes = routes || []
    const newRoutes = []
    for (let route of routes) {
      route = clone(route)
      const returnValue = callback(route)
      if (!returnValue) continue
      if (route.children && route.children.length) {
        route.children = Router.filterRoutes(route.children, callback)
      }
      newRoutes.push(route)
    }
    return newRoutes
  }

  static mapRoutes (routes, callback) {
    routes = routes || []
    const newRoutes = []
    for (let route of routes) {
      route = clone(route)
      let newRoute = callback(route)
      if (!newRoute) newRoute = route
      if (newRoute.children && newRoute.children.length) {
        newRoute.children = Router.mapRoutes(newRoute.children, callback)
      }
      newRoutes.push(newRoute)
    }
    return newRoutes
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
