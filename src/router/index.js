import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let HuiZong = () => import('../pages/huizong/indexrest');
// let HuiZong = () =>import('../pages/huizong');//弃用
let GuiJi = () => import('../pages/guiji');
let QiangMiao = () => import('../pages/qiangmiao');
let JiGouGuanLi = () => import('../pages/jigouguanli');
let QiangZhi = () => import('../pages/qiangzhi');
let BaoJing = () => import('../pages/baojing');
let ZaiKu = () => import('../pages/zaiku');
let XiaoHao = () => import('../pages/xiaohao');
let QiangGui = () => import('../pages/qianggui');
let ChiQiang = () => import('../pages/chiqiangrenyuan');
let QiangKu = () => import('../pages/qiangku');
let Vidio = () => import('../pages/vidio');
import Login from '../pages/login'
let LoginPut = () => import('../pages/login/index2');
let RenYuan = () => import('../pages/renyuanguanli');
let PersonMessage = () => import('../pages/personmessage');
let GunMessage = () => import('../pages/gunmessage');
let BigMap = () => import('../pages/map/index.vue');
//弃用，由NewXiangQing代替
// let XiangQing = () => import('../pages/huizong/xiangqing');
let List = () => import('../pages/huizong/list');
//弃用item2
// let Item2 = () => import('../pages/huizong/item2/index.vue');
let List2 = () => import('../pages/huizong/item2/list2');
let Pub = () => import('../pages/huizong/pub');
let Next = () => import('../pages/huizong/pub/next.vue');
let IndexG = () => import('../pages');
//代替原来的XiangQing
let NewXiangQing = () => import('../pages/huizong/xiangqingnew')
let RightBottomXQ1 = () => import('../pages/huizong/right-bottom1-xq')
//代替原先的Item2
let item1right = () => import('../pages/huizong/item1right')

let XiangQingList = () => import('../pages/huizong/xiangqingnew-list')

let router = new Router({
  // mode:'history',
  linkActiveClass: 'active',
  routes: [{
    path: '/indexg',
    component: IndexG,
    children: [{
      path: 'huizong',
      name: 'HuiZong',
      component: HuiZong

    },
    {
      path: 'jigouguanli',
      name: 'JiGouGuanLi',
      component: JiGouGuanLi
    },
    {
      path: 'guiji',
      name: 'GuiJi',
      component: GuiJi,
      meta: {
        keepAlive: true
      }
    },
    {
      path: 'map',
      name: 'Map',
      component: BigMap,
      meta: {
        keepAlive: true
      }
    },
    {
      path: 'qiangmiao',
      name: 'QiangMiao',
      component: QiangMiao

    },
    {
      path: 'qiangzhiguanli',
      name: 'QiangZhi',
      component: QiangZhi
    },
    {
      path: 'baojingguanli',
      name: 'BaoJing',
      component: BaoJing
    },
    {
      path: 'danyaozaiku',
      name: 'ZaiKu',
      component: ZaiKu

    },
    {
      path: 'danyaoxiaohao',
      name: 'XiaoHao',
      component: XiaoHao

    },
    {
      path: 'qianggui',
      name: 'QiangGui',
      component: QiangGui

    },
    {
      path: 'chiqiangrenyuan',
      name: 'ChiQiang',
      component: ChiQiang

    },
    {
      path: 'qiangku',
      name: 'QiangKu',
      component: QiangKu

    },
    {
      path: 'vidio',
      name: 'Vidio',
      component: Vidio

    },
    {
      path: 'renyuan',
      name: 'RenYuan',
      component: RenYuan

    },
    {
      path: 'personmessage',
      name: 'PersonMessage',
      component: PersonMessage
    },
    {
      path: 'gunmessage',
      name: 'GunMessage',
      component: GunMessage
    },
    // {
    //   path: 'xiangqing',
    //   name: 'XiangQing',
    //   component: XiangQing,
    //   // meta: {
    //   //   keepAlive: true
    //   // }
    // },
    {
      path: 'xiangqingnew',
      name: 'NewXiangQing',
      component: NewXiangQing
    },
    {
      path: 'xiangqingnew-list',
      name: 'XiangQingList',
      component: XiangQingList
    },
    {
      path: 'right-bottom1-xq',
      name: 'RightBottomXQ1',
      component: RightBottomXQ1
    },
    // {
    //   //弃用
    //   path: 'item2',
    //   name: 'Item2',
    //   component: Item2
    //   // meta: {
    //   //   keepAlive: true
    //   // }
    // },
    {
      path: 'item1right',
      name: 'Item1Right',
      component: item1right
    },
    {
      path: 'pub',
      name: 'Pub',
      component: Pub

    },
    {
      path: 'next',
      name: 'Next',
      component: Next
    },
    {
      path: 'list2',
      name: 'List2',
      component: List2,
      meta: {
        keepAlive: true
      }
    },
    {
      path: 'list',
      name: 'List',
      component: List
      // meta:{
      //   keepAlive:true
      // }
    }
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/loginput',
    name: 'LoginPut',
    component: LoginPut
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  }
  ]
})



export default router
