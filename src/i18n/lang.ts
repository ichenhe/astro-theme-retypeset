import { getRelativeLocaleUrl } from 'astro:i18n'
import { allLocales, defaultLocale, moreLocales } from '@/config'
import { normalizePath } from '@/utils/path'

/**
 * Gets the language code from the current path
 *
 * @param path Current page path
 * @returns Language code detected from path or default locale
 */
export function getLangFromPath(path: string) {
  const pathWithBase = normalizePath(path, { includeBase: true })

  return moreLocales.find(lang =>
    pathWithBase.startsWith(getRelativeLocaleUrl(lang, ''))) ?? defaultLocale
}

/**
 * Get the next language code in the global language cycle
 *
 * @param currentLang Current language code
 * @returns Next language code in the global cycle
 */
export function getNextGlobalLang(currentLang: string): string {
  // Get index of current language
  const currentIndex = allLocales.indexOf(currentLang)
  if (currentIndex === -1) {
    return defaultLocale
  }

  // Calculate and return next language in cycle
  const nextIndex = (currentIndex + 1) % allLocales.length
  return allLocales[nextIndex]
}
