const demoMap = {
  'getting-started': {
    comp: () => import('./getting-started/index.vue'),
    height: '300px',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./getting-started/index.vue?raw'),
      },
    ],
  },
  'custom-toolbar': {
    comp: () => import('./custom-toolbar/index.vue'),
    height: '300px',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./custom-toolbar/index.vue?raw'),
      },
      {
        title: 'HelloWorldBtn.vue',
        code: () => import('./custom-toolbar/HelloWorldBtn.vue?raw'),
      },
    ],
  },
  'auto-height': {
    comp: () => import('./auto-height/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./auto-height/index.vue?raw'),
      },
    ],
  },
  size: {
    comp: () => import('./size/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./size/index.vue?raw'),
      },
    ],
  },
  html: {
    comp: () => import('./html/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./html/index.vue?raw'),
      },
    ],
  },
  json: {
    comp: () => import('./json/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./json/index.vue?raw'),
      },
    ],
  },
  markdown: {
    comp: () => import('./markdown/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./markdown/index.vue?raw'),
      },
    ],
  },
  lang: {
    comp: () => import('./lang/index.vue'),
    height: '300px',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./lang/index.vue?raw'),
      },
      {
        title: 'jp.js',
        code: () => import('./lang/jp.js?raw'),
      },
    ],
  },
  chinese: {
    comp: () => import('./chinese/index.vue'),
    height: '300px',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./chinese/index.vue?raw'),
      },
    ],
  },
}

export default demoMap
