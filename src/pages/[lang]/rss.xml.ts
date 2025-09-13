import type { APIContext } from 'astro'
import { allLocales } from '@/config'
import { generateRSS } from '@/utils/feed'

export function getStaticPaths() {
  return allLocales.map(lang => ({
    params: { lang },
  }))
}

export async function GET(context: APIContext) {
  return generateRSS(context)
}
