export const locales = ['ko', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ko'

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    ko: '한국어',
    en: 'English',
  }
  return labels[locale]
}
