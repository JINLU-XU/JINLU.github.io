export const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/daohangbox',
    name: 'DaohangBox',
    component: () => import('../views/DaohangBox.vue'),
    children: [
      {
        path: '/shouye',
        name: 'Shouye',
        component: () => import('../views/Daohang/Shouye.vue'),
      },
      {
        path: '/caidan',
        name: 'Caidan',
        component: () => import('../views/Daohang/Caidan.vue'),
      },
      {
        path: '/gouwudai',
        name: 'Gouwudai',
        component: () => import('../views/Daohang/Gouwudai.vue'),
      },
      {
        path: '/wode',
        name: 'Wode',
        component: () => import('../views/Daohang/Wode.vue'),
      },

    ]
  },
  // 详情页
  {
    path: '/detailpage',
    name: 'Detailpage',
    component: () => import('../views/Detailpage.vue'),
  },

  // 喜欢
  {
    path: '/likes',
    name: 'Likes',
    component: () => import('../views/Likes.vue'),
  },


  // 收货地址
  {
    path: '/shouhuodizhi',
    name: 'Shouhuodizhi',
    component: () => import('../views/Shouhuodizhi.vue'),
  },

  // 提交页
  {
    path: '/tijiao',
    name: 'Tijiao',
    component: () => import('../views/Tijiao.vue'),
  },

  // 我的订单
  {
    path: '/wodedingdan',
    name: 'Wodedingdan',
    component: () => import('../views/Wodedingdan.vue'),
  },

  // 个人资料
  {
    path: '/gerenziliao',
    name: 'Gerenziliao',
    component: () => import('../views/Gerenziliao.vue'),
  },

  // 安全中心
  {
    path: '/anquan',
    name: 'Anquan',
    component: () => import('../views/Anquan.vue'),
  },

  // 新增地址
  {
    path: '/xinzeng',
    name: 'Xinzeng',
    component: () => import('../views/Xinzeng.vue'),
  },

  // 忘记密码
  {
    path: '/wangjimima',
    name: 'Wangjimima',
    component: () => import('../views/Wangjimima.vue'),
  },
  // 默认初始页面
  {
    path: '*',
    redirect: {
      name: 'Main'
    }
  }
]