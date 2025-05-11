const demoMap = {
  '/getting-started': {
    comp: () => import('./getting-started/index.vue'),
    height: 'auto',
    codeTabs: [
      {
        title: 'index.vue',
        code: () => import('./getting-started/index.vue?raw'),
      },
    ],
  },
}

export default demoMap
