import { createApp } from 'vue'
import { framework } from '@mfro/vue-ui';

import root from './main.vue'

createApp(root)
  .use(framework)
  .mount('#app')
