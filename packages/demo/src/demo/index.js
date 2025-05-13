const demoMap = {
  'getting-started': {
    comp: () => import('./getting-started/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./getting-started/index.vue?raw'),
      },
    ],
  },
  'custom-toolbar': {
    comp: () => import('./custom-toolbar/index.vue'),
    height: 'auto',
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
}

export default demoMap
