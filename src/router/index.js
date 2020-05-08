import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let HuiZong = () => import('../pages/huizong/indexrest');
// let HuiZong = () =>import('../pages/huizong');//弃用
let GuiJi = () => import('../pages/guiji');//高德地图
let BigMap = () => import('../pages/map/index.vue');//离线地图
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
// import Login from '../pages/login'
let Login=()=>import('../pages/login')
let LoginPut = () => import('../pages/login/index2');
let RenYuan = () => import('../pages/renyuanguanli');
let PersonMessage = () => import('../pages/personmessage');
let GunMessage = () => import('../pages/gunmessage');

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

let Item4Top = () => import('../pages/huizong/item4top')
let Item5XQ = () => import('../pages/huizong/item5xq/index.vue')
let Item5XQ_LX = () => import('../pages/huizong/item5xq-lixian/index.vue')
let Item6XQ = () => import('../pages/huizong/item6xq/index.vue')
let Item7XQ = () => import('../pages/huizong/item7xq/index.vue')
let Item8XQ = () => import('../pages/huizong/item8xq/index.vue')
let Item9XQ = () => import('../pages/huizong/item9xq/index.vue')
let Item10XQ = () => import('../pages/huizong/item10xq/index.vue')
let Item14XQ = () => import('../pages/huizong/item14xq/index.vue')
let CenterXQ = () => import('../pages/huizong/centerxq/index.vue')

// let GlobalScreem =()=>import('../pages/globalscreem/index.vue')
// let DaPing =()=>import('../pages/daping/index.vue')
let PeiZhi = ()=>import('../pages/peizhi')

let mapMarkers =()=>import('../pages/mapmarkers')
let EchartMap=()=>import('../pages/echarts-map')
let router = new Router({
  // mode:'history',
  linkActiveClass: 'active',
  routes: [{
    path: '/indexg',
    component: IndexG,
    children: [{
      path: 'huizong',
      name: 'HuiZong',
      component: HuiZong,
      meta: {
        keepAlive: true
      }
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
      path: 'item4top',
      name: 'Item4Top',
      component: Item4Top
    },
    {
      path: 'item5xq',
      name: 'Item5XQ',
      component: Item5XQ
    },
    {
      path:"item5xq-lixian",
      name:"Item5XQ_LX",
      component:Item5XQ_LX
    },
    {
      path: 'item6xq',
      name: 'Item6XQ',
      component: Item6XQ
    },
    {
      path: 'item7xq',
      name: 'Item7XQ',
      component: Item7XQ
    },
    {
      path: 'item8xq',
      name: 'Item8XQ',
      component: Item8XQ
    },
    {
      path: 'item9xq',
      name: 'Item9XQ',
      component: Item9XQ
    },
    {
      path: 'item10xq',
      name: 'Item10XQ',
      component: Item10XQ
    },
    {
      path: 'item14xq',
      name: 'Item14XQ',
      component: Item14XQ
    },
    {
      path: 'centerxq',
      name: 'CenterXQ',
      component: CenterXQ
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
    },
    {
      path:'peizhi',
      name:'PeiZhi',
      component:PeiZhi
    }
    // {
    //   path:'echartsmap',
    //   name:'EchartMap',
    //   component:EchartMap
    // }
    ]
  },
  
  {
    path:'/mapmarkers',
    name:"mapMarkers",
    component:mapMarkers
  },
  // {
  //   path:'/globalscreem',
  //   name:'GlobalScreem',
  //   component:GlobalScreem
  // },
  // {
  //   path:'/daping',
  //   name:'DaPing',
  //   component:DaPing
  // },
  {
    path:'/dapingnew',
    name:'DaPingnew',
    component:()=>import('@/pages/dapingnew/index.vue')
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
