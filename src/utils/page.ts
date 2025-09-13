import { getRelativeLocaleUrl } from 'astro:i18n'
import { allLocales } from '@/config'
import { getLangFromPath } from '@/i18n/lang'
import { normalizePath } from './path'

// Checks if normalized path matches a specific page type
function isPageType(path: string, prefix: string = '') {
  // include base for convenience since `getRelativeLocaleUrl` does have it
  const pathWithBase = normalizePath(path, { includeBase: true })

  // any url can start with empty prefix, so check them separately
  if (prefix === '') {
    return allLocales.some(lang => pathWithBase === getRelativeLocaleUrl(lang, prefix))
  }

  return allLocales.some(lang => pathWithBase.startsWith(getRelativeLocaleUrl(lang, prefix)))
}

export function isHomePage(path: string) {
  return isPageType(path)
}

export function isPostPage(path: string) {
  return isPageType(path, 'posts')
}

export function isTagPage(path: string) {
  return isPageType(path, 'tags')
}

export function isAboutPage(path: string) {
  return isPageType(path, 'about')
}

// Returns page context with language, page types and localization helper
export function getPageInfo(path: string) {
  const currentLang = getLangFromPath(path)
  const isHome = isHomePage(path)
  const isPost = isPostPage(path)
  const isTag = isTagPage(path)
  const isAbout = isAboutPage(path)

  return {
    currentLang,
    isHome,
    isPost,
    isTag,
    isAbout,
    getLocalizedPath: (targetPath: string) =>
      getRelativeLocaleUrl(currentLang, targetPath),
  }
}
