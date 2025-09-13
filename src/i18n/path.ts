import { getRelativeLocaleUrl } from 'astro:i18n'
import { defaultLocale, moreLocales } from '@/config'
import { getLangFromPath, getNextGlobalLang } from '@/i18n/lang'
import { normalizePath } from '@/utils/path'

/**
 * Get path to a specific tag page with language support
 *
 * @param tagName Tag name
 * @param lang Current language code
 * @returns Path to tag page
 */
export function getTagPath(tagName: string, lang: string): string {
  // this api already takes base into account
  return getRelativeLocaleUrl(lang, `tags/${tagName}`)
}

/**
 * Get path to a specific post page with language support
 *
 * @param slug Post slug
 * @param lang Current language code
 * @returns Path to post page
 */
export function getPostPath(slug: string, lang: string): string {
  return getRelativeLocaleUrl(lang, `posts/${slug}`)
}

/**
 * Build path for next language
 *
 * @param currentPath Current page path
 * @param currentLang Current language code
 * @param nextLang Next language code to switch to
 * @returns Path for next language
 */
export function getNextLangPath(currentPath: string, currentLang: string, nextLang: string): string {
  const normalizedPath = normalizePath(currentPath)
  const pathWithCurrentLang = normalizePath(getRelativeLocaleUrl(currentLang, ''))

  if (!normalizedPath.startsWith(pathWithCurrentLang)) {
    throw new Error(`The given path "${currentPath}" doesn't mathch the lang "${currentLang}".`)
  }

  const pagePath = normalizedPath.substring(pathWithCurrentLang.length)
  return getRelativeLocaleUrl(nextLang, pagePath)
}

/**
 * Get next language path from global language list
 *
 * @param currentPath Current page path
 * @returns Path for next supported language
 */
export function getNextGlobalLangPath(currentPath: string): string {
  const currentLang = getLangFromPath(currentPath)
  const nextLang = getNextGlobalLang(currentLang)
  return getNextLangPath(currentPath, currentLang, nextLang)
}

/**
 * Get next language path from supported language list
 *
 * @param currentPath Current page path
 * @param supportedLangs List of supported language codes
 * @returns Path for next supported language
 */
export function getNextSupportedLangPath(currentPath: string, supportedLangs: string[]): string {
  if (supportedLangs.length === 0) {
    return getNextGlobalLangPath(currentPath)
  }

  // Sort supported languages by global priority
  const langPriority = new Map(
    [defaultLocale, ...moreLocales].map((lang, index) => [lang, index]),
  )
  const sortedLangs = [...supportedLangs].sort(
    (a, b) => (langPriority.get(a) ?? 0) - (langPriority.get(b) ?? 0),
  )

  // Get current language and next in cycle
  const currentLang = getLangFromPath(currentPath)
  const currentIndex = sortedLangs.indexOf(currentLang)
  const nextLang = sortedLangs[(currentIndex + 1) % sortedLangs.length]

  return getNextLangPath(currentPath, currentLang, nextLang)
}
