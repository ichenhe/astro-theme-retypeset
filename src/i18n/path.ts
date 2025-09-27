import { getRelativeLocaleUrl } from 'astro:i18n'
import { allLocales, defaultLocale, moreLocales } from '@/config'
import { getLangFromPath } from '@/i18n/lang'
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
 * @throws {Error} The given path doesn't match the current lang.
 */
export function getAlternativeLangPath(currentPath: string, currentLang: string, nextLang: string): string {
  const normalizedPath = normalizePath(currentPath)
  const pathWithCurrentLang = normalizePath(getRelativeLocaleUrl(currentLang, ''))

  if (!normalizedPath.startsWith(pathWithCurrentLang)) {
    throw new Error(`The given path "${currentPath}" doesn't mathch the lang "${currentLang}".`)
  }

  const pagePath = normalizedPath.substring(pathWithCurrentLang.length)
  return getRelativeLocaleUrl(nextLang, pagePath)
}

/**
 * Get next language path from supported language list. If the current lang is
 * not in the list, the first available lang will be selected.
 *
 * @param currentPath Current localized page path.
 * @param supportedLangs List of supported language codes, defaults to all.
 * @returns Path for next supported language
 * @throws {Error} The given path is not localized.
 */
export function getNextLangPath(currentPath: string, supportedLangs?: string[]): string {
  const currentLang = getLangFromPath(currentPath)
  if (!currentLang) {
    // We won't apply default lange subjectively here,
    // because in the case where prefixDefaultLocale=true, pages can be "unlocalized",
    // adding lang code to the path will result in 404 or unexpected page.
    // Prefering throwing error to expose the probelm in the early stage.
    throw new Error(`The given path "${currentPath}" is not localized.`)
  }
  const langPriority = new Map(
    [defaultLocale, ...moreLocales].map((lang, index) => [lang, index]),
  )
  const candidates = (supportedLangs ?? allLocales).sort(
    (a, b) => (langPriority.get(a) ?? 0) - (langPriority.get(b) ?? 0),
  )
  if (candidates.length === 0) {
    throw new Error(`No available languages, did you pass an empty supportedLangs?`)
  }

  const currentIndex = candidates.indexOf(currentLang)
  const nextLang = candidates[(currentIndex + 1) % candidates.length]
  return getAlternativeLangPath(currentPath, currentLang, nextLang)
}
