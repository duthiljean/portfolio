import {localeString} from './localeString'
import {localeText} from './localeText'
import {profile} from './profile'
import {about} from './about'
import {skillsSection} from './skillsSection'
import {education} from './education'
import {experience} from './experience'

export const schemaTypes = [
  // i18n helpers
  localeString,
  localeText,
  // singletons
  profile,
  about,
  skillsSection,
  education,
  // collections
  experience,
]
