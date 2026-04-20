import {createClient} from '@sanity/client'

const isBrowser = typeof window !== 'undefined'
const isPreview = isBrowser && window.parent !== window
const isLocal = isBrowser && window.location.hostname === 'localhost'
const STUDIO_URL = isLocal ? 'http://localhost:3333' : 'https://duthiljean.sanity.studio'

export const sanityClient = createClient({
  projectId: 'yh6ixjbc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: !isPreview,
  stega: isPreview ? {studioUrl: STUDIO_URL} : false,
})

/* ---------- i18n ---------- */

export type Lang = 'fr' | 'en'
export type LocaleString = {_type?: 'localeString'; fr?: string; en?: string}
export type LocaleText = {_type?: 'localeText'; fr?: string; en?: string}

export const pickLocale = (
  value: LocaleString | LocaleText | undefined | null,
  lang: Lang,
): string => {
  if (!value) return ''
  return value[lang] || value.fr || value.en || ''
}

/* ---------- Types ---------- */

export type BadgeItem = {
  _key?: string
  label: string
  link?: string
}

export type Experience = {
  _id: string
  title: string
  company: string
  type: string
  dates: string
  location: string
  description: string
  badges: BadgeItem[]
  logo?: {asset?: {url?: string}}
  siteUrl?: string
  image?: {asset?: {url?: string}}
  order: number
}

export type Social = {
  _key?: string
  platform: 'linkedin' | 'github' | 'x' | 'email' | 'phone'
  url: string
}

export type Profile = {
  name: string
  photo?: string
  badge?: LocaleString
  dateline?: LocaleString
  roles?: LocaleString[]
  ctaPrimary?: {label?: LocaleString; href?: string}
  ctaSecondary?: {label?: LocaleString; href?: string}
  socials?: Social[]
}

export type AboutStat = {
  _key?: string
  value: string
  label?: LocaleString
  trend?: LocaleString
}

export type NowItem = {
  _key?: string
  title: string
  description?: LocaleString
  href?: string
}

export type About = {
  kicker?: LocaleString
  dateline?: LocaleString
  headlines?: LocaleString[]
  bio?: LocaleText
  description?: LocaleText
  location?: LocaleString
  phone?: string
  rhythm?: LocaleString
  languages?: LocaleString
  stats?: AboutStat[]
  nowLabel?: LocaleString
  nowItems?: NowItem[]
}

export type SkillPill = {
  _key?: string
  name: string
  tooltipType?: 'daily' | 'project' | 'operational'
}

export type SkillCategory = {
  _key?: string
  kicker?: string
  icon?: 'sparkles' | 'rocket' | 'lineChart' | 'badgeCheck'
  title?: LocaleString
  description?: LocaleString
  pills?: SkillPill[]
}

export type DailyTool = {
  _key?: string
  name: string
  use?: LocaleString
  logo?: string
}

export type SkillsSection = {
  kicker?: LocaleString
  title?: LocaleString
  dateline?: LocaleString
  subtitle?: LocaleText
  legend?: LocaleString
  categories?: SkillCategory[]
  dailyStack?: DailyTool[]
}

export type Degree = {
  kicker?: LocaleString
  schoolName?: string
  schoolLogo?: string
  name?: LocaleString
  datesLabel?: string
  durationLabel?: LocaleString
  location?: string
  bdeLabel?: LocaleString
  startDate?: string
  endDate?: string
}

export type SubCert = {
  _key?: string
  title: string
  url: string
}

export type Certification = {
  _key?: string
  kind: 'anthropic' | 'mooc' | 'simple'
  name: string
  org?: LocaleString
  logo?: string
  verified?: boolean
  subCerts?: SubCert[]
  certImage?: string
  order?: number
}

export type Education = {
  title?: LocaleString
  dateline?: LocaleString
  degree?: Degree
  certsLabel?: LocaleString
  certifications?: Certification[]
}

/* ---------- Queries ---------- */

const EXPERIENCES_QUERY = `*[_type == "experience"] | order(order asc) {
  _id,
  title,
  company,
  type,
  dates,
  location,
  description,
  badges,
  "logo": logo{asset->{url}},
  siteUrl,
  "image": image{asset->{url}},
  order
}`

const PROFILE_QUERY = `*[_type == "profile" && _id == "profile"][0] {
  name,
  "photo": photo.asset->url,
  badge,
  dateline,
  roles,
  ctaPrimary,
  ctaSecondary,
  socials
}`

const ABOUT_QUERY = `*[_type == "about" && _id == "about"][0] {
  kicker,
  dateline,
  headlines,
  bio,
  description,
  location,
  phone,
  rhythm,
  languages,
  stats,
  nowLabel,
  nowItems
}`

const SKILLS_QUERY = `*[_type == "skillsSection" && _id == "skillsSection"][0] {
  kicker,
  title,
  dateline,
  subtitle,
  legend,
  categories,
  "dailyStack": dailyStack[]{
    _key,
    name,
    use,
    "logo": logo.asset->url
  }
}`

const EDUCATION_QUERY = `*[_type == "education" && _id == "education"][0] {
  title,
  dateline,
  "degree": degree{
    ...,
    "schoolLogo": schoolLogo.asset->url
  },
  certsLabel,
  "certifications": certifications[]{
    ...,
    "logo": logo.asset->url,
    "certImage": certImage.asset->url
  } | order(order asc)
}`

/* ---------- Fetchers ---------- */

export const fetchExperiences = (): Promise<Experience[]> =>
  sanityClient.fetch(EXPERIENCES_QUERY)

export const fetchProfile = (): Promise<Profile | null> =>
  sanityClient.fetch(PROFILE_QUERY)

export const fetchAbout = (): Promise<About | null> =>
  sanityClient.fetch(ABOUT_QUERY)

export const fetchSkills = (): Promise<SkillsSection | null> =>
  sanityClient.fetch(SKILLS_QUERY)

export const fetchEducation = (): Promise<Education | null> =>
  sanityClient.fetch(EDUCATION_QUERY)
