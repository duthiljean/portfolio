import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'yh6ixjbc',
    dataset: 'production'
  },
  deployment: {
    appId: 'fzm9amsic3adldnyg08y038m',
    autoUpdates: true,
  }
})
