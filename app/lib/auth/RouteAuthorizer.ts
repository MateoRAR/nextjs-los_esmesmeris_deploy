export class RouteAuthorizer {
  private static readonly routes: Map<string, string[]> = new Map([
    ['admin', ['/home', '/users', '/users/*', '/suppliers', '/suppliers/*']],
    ['employee', ['/home', '/employee/*']],
    ['public', ['/', '/login']],
  ])

  static isAllowed(role: string, path: string): boolean {
    const allowedRoutes = this.routes.get(role) || []

    return allowedRoutes.some((pattern) => {
      if (pattern === '*') return true
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1)
        return path.startsWith(prefix)
      }
      return path === pattern
    })
  }

  static isPublic(path: string): boolean {
    const publicRoutes = this.routes.get('public') || []
    return this.isAllowed('public', path)
  }
}
