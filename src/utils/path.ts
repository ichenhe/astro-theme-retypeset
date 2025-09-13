/**
 * Remove all trailing slashes from the given string. Typically, the leading /
 * will not be removed, i.e. `removeTrailingSlash('/') === '/'`.
 */
export function removeTrailingSlash(str: string): string {
  return str.replace(/(?<=[^/])\/+$/, '')
}

/**
 * Normalize the given path (without host) to the required format.
 * @param path The path that will be normalized
 * @param ops The normalization options, for default values see below
 * @param ops.leadingSlash Default is `true`
 * @param ops.trailingSlash Default is `true`
 * @param ops.includeBase Default is `false`
 * @returns Normalized path
 */
export function normalizePath(
  path: string,
  ops?: {
    leadingSlash?: boolean
    trailingSlash?: boolean
    includeBase?: boolean
  },
): string {
  const { leadingSlash = true, trailingSlash = true, includeBase = false } = ops ?? {}

  // make sure with leading /
  let result = path.startsWith('/') ? path : `/${path}`

  // must start with /, without trailing /
  const base = removeTrailingSlash(import.meta.env.BASE_URL)
  if (base !== '/' && includeBase !== result.startsWith(base)) {
    if (includeBase) {
      result = base + result
    }
    else {
      result = result.substring(base.length)
    }
  }

  if (leadingSlash !== result.startsWith('/')) {
    if (leadingSlash) {
      result = `/${result}`
    }
    else {
      result = result.replace(/^\/+/, '')
    }
  }
  if (trailingSlash !== result.endsWith('/')) {
    if (trailingSlash) {
      result = `${result}/`
    }
    else {
      result = removeTrailingSlash(result)
    }
  }
  return result
}
