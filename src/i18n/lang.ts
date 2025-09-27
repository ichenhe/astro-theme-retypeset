import { getRelativeLocaleUrl } from 'astro:i18n'
import themeConfig, { allLocales, defaultLocale, moreLocales } from '@/config'
import { normalizePath } from '@/utils/path'

/**
 * Gets the language code from the current path
 *
 * @param path Current page path
 * @returns Language code detected from path or default locale or `undefined` if no pattern matches
 */
export function getLangFromPath(path: string): string | undefined {
  const pathWithBase = normalizePath(path, { includeBase: true })

  if (themeConfig.global.prefixDefaultLocale) {
    return allLocales.find(lang =>
      pathWithBase.startsWith(getRelativeLocaleUrl(lang, '')))
  }
  else {
    return moreLocales.find(lang =>
      pathWithBase.startsWith(getRelativeLocaleUrl(lang, ''))) ?? defaultLocale
  }
}
