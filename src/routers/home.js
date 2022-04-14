export default [{
    path: "/",
    name: "init",
    components: {
      default: import('@/pages/page/page'),
    },
    meta: {
      keepAlive: true
    }
  },
  {
    path: '*',
    redirect: {
      name: 'init'
    }
  }
]