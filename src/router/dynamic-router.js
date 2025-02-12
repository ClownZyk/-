/* 需要权限判断的路由 */
const dynamicRoutes = [
  // home页面
  {
    path: '/home',
    component: (resolve) => require(['pages/home/index'], resolve),
    name: 'home',
    meta: {
      name: 'home',
      icon: 'icon-gaikuangtongji',
      hidden: true,
      hideChildren: true
    },
    children: [{
      path: '/more-product-sort',
      name: 'more-product-sort',
      component: (resolve) => require(['pages/home/more-product-sort'], resolve),
      meta: {
        name: '售卖机产品当日销量排行'
      }
    }]
  },
  // GEMBI
  {
    path: '/gemBI',
    name: 'GemBI',
    component: (resolve) => require(['pages/gemBI'], resolve),
    meta: {
      name: 'GemBI',
      icon: 'icon-xiaoshoutongji'
    },
    children: [{
      path: '/sale-count',
      name: 'sale-count',
      component: (resolve) => require(['pages/gemBI/sale-count/sale-count'], resolve),
      meta: {
        name: '概况统计',
        icon: 'icon-gaikuangtongji',
        hideChildren: true
      },
      children: [{
        path: '/more-machine-product-sort',
        name: 'more-machine-product-sort',
        component: (resolve) => require(['pages/gemBI/sale-count/more-machine-product-sort'], resolve),
        meta: {
          name: '售卖机产品当日销量排行'
        }
      }]
    },
    {
      path: '/face-recognition',
      name: 'face-recognition',
      component: (resolve) => require(['pages/gemBI/face-recognition/face-recognition'], resolve),
      meta: {
        name: '人脸识别',
        icon: 'icon-renlianshibie',
        hideChildren: true
      }
    },
    {
      path: '/store-manage',
      name: 'store-manage',
      component: (resolve) => require(['pages/gemBI/store-manage/store-manage'], resolve),
      meta: {
        name: '门店管理',
        icon: 'icon-mendianguanli',
        hideChildren: true
      },
      children: [
        {
          path: '/card-shop-setting',
          name: 'card-shop-setting',
          component: (resolve) => require(['pages/gemBI/store-manage/card-shop-setting/card-shop-setting'], resolve),
          meta: {
            name: '云点卡门店限制配置'
          }
        },
        {
          path: '/shop-groupon-manage',
          name: 'shop-groupon-manage',
          component: (resolve) => require(['pages/gemBI/store-manage/shop-groupon-manage/shop-groupon-manage'], resolve),
          meta: {
            name: '拼团管理人员设置'
          }
        },
        {
          path: '/store-detail',
          name: 'store-detail',
          component: (resolve) => require(['pages/gemBI/store-manage/store-detail/store-detail'], resolve),
          meta: {
            name: '门店信息',
            hideChildren: true
          },
          children: [{
            path: '/store-data-detail',
            name: 'store-data-detail',
            component: (resolve) => require(['pages/gemBI/store-manage/store-data-detail/store-data-detail'], resolve),
            meta: {
              name: '店铺数据'
            }
          },
          {
            path: '/product-sale-list',
            name: 'product-sale-list',
            component: (resolve) => require(['pages/gemBI/store-manage/store-detail/product-sale-list/product-sale-list'], resolve),
            meta: {
              name: '产品列表'
            }
          },
          {
            path: '/machine-product-sale-list',
            name: 'machine-product-sale-list',
            component: (resolve) => require(['pages/gemBI/store-manage/store-detail/product-sale-list/machine-product-sale-list'], resolve),
            meta: {
              name: '售卖柜产品列表'
            }
          },
          {
            path: '/member-list',
            name: 'member-list',
            component: (resolve) => require(['pages/gemBI/store-manage/store-detail/member-list/member-list'], resolve),
            meta: {
              name: '会员列表'
            }
          },
          {
            path: '/store-vending-machine-detail',
            name: 'store-vending-machine-detail',
            component: (resolve) => require(['pages/gemBI/store-manage/store-detail/store-vending-machine/store-vending-machine-detail'], resolve),
            meta: {
              name: '售卖机详情'
            }
          }
          ]
        },
        {
          path: '/data-count',
          name: 'data-count',
          component: (resolve) => require(['pages/gemBI/store-manage/data-count/data-count'], resolve),
          meta: {
            name: '数据统计',
            hideChildren: true
          },
          children: [{
            path: '/shop-data-detail',
            name: 'shop-data-detail',
            component: (resolve) => require(['pages/gemBI/store-manage/store-data-detail/store-data-detail'], resolve),
            meta: {
              name: '店铺数据'
            }
          }]
        },
        {
          path: '/store-monitor',
          name: 'store-monitor',
          component: (resolve) => require(['pages/gemBI/store-manage/store-monitor/store-monitor'], resolve),
          meta: {
            name: '门店监控',
            hideChildren: true
          },
          children: [{
            path: '/monitor-setting',
            name: 'monitor-setting',
            component: (resolve) => require(['pages/gemBI/store-manage/store-monitor/monitor-setting'], resolve),
            meta: {
              name: '监控设置'
            }
          }]
        }
      ]
    },
    {
      path: '/store-count',
      name: 'store-count',
      component: (resolve) => require(['pages/gemBI/store-count/store-count'], resolve),
      meta: {
        name: '经营概况',
        icon: 'icon-jingyinggaikuang',
        hideChildren: true
      },
      children: [
        {
          path: '/store-count-detail',
          name: 'store-count-detail',
          component: (resolve) => require(['pages/gemBI/store-count/store-count-detail'], resolve),
          meta: {
            name: '订单详情',
            hideChildren: true
          }
        }
      ]
    },
    {
      path: '/all-profit-loss',
      name: 'all-profit-loss',
      component: (resolve) => require(['pages/gemBI/all-profit-loss/all-profit-loss'], resolve),
      meta: {
        name: '浮动盈亏',
        icon: 'icon-fudongyingkui',
        hideChildren: true
      }
    }
    ]
  },
  // 合伙人管理
  {
    path: '/partner-manage',
    name: 'partner-manage',
    component: (resolve) => require(['pages/partner-manage'], resolve),
    meta: {
      name: '合伙人管理',
      icon: 'icon-hehuorenguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/partner-list',
        name: 'partner-list',
        component: (resolve) => require(['pages/partner-manage/partner-list/partner-list'], resolve),
        meta: {
          name: '合伙人列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [{
          path: '/partner-detail',
          name: 'partner-detail',
          component: (resolve) => require(['pages/partner-manage/partner-detail/partner-detail'], resolve),
          meta: {
            name: '合伙人详情'
          }
        }]
      }
    ]
  },
  // 订单管理
  {
    path: '/orders-manage',
    name: 'orders-manage',
    component: (resolve) => require(['pages/orders-manage'], resolve),
    meta: {
      name: '订单管理',
      icon: 'icon-kucunguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/all-order-list',
        name: 'all-order-list',
        component: (resolve) => require(['pages/orders-manage/all-order/all-order-list'], resolve),
        meta: {
          name: '整单订单',
          icon: 'icon-neirongguanli',
          hideChildren: true
        },
        children: [{
          path: '/all-order-detail',
          name: 'all-order-detail',
          component: (resolve) => require(['pages/orders-manage/all-order/all-order-detail'], resolve),
          meta: {
            name: '订单详情'
          }
        }]
      },
      {
        path: '/shop-orders-list',
        name: 'shop-orders-list',
        component: (resolve) => require(['pages/orders-manage/shop-orders-list/shop-orders-list'], resolve),
        meta: {
          name: '商品订单',
          icon: 'icon-neirongguanli',
          hideChildren: true
        },
        children: [{
          path: '/shop-orders-detail',
          name: 'shop-orders-detail',
          component: (resolve) => require(['pages/orders-manage/shop-orders-detail/shop-orders-detail'], resolve),
          meta: {
            name: '订单详情'
          }
        }]
      },
      {
        path: '/meals-order-list',
        name: 'meals-order-list',
        component: (resolve) => require(['pages/orders-manage/meals-order/meals-order-list'], resolve),
        meta: {
          name: '自制餐食订单',
          icon: 'icon-zizhicanshi',
          hideChildren: true
        },
        children: [{
          path: '/meals-order-detail',
          name: 'meals-order-detail',
          component: (resolve) => require(['pages/orders-manage/meals-order/meals-order-detail'], resolve),
          meta: {
            name: '订单详情'
          }
        }]
      },
      {
        path: '/drink-order-list',
        name: 'drink-order-list',
        component: (resolve) => require(['pages/orders-manage/drink-order/drink-order-list'], resolve),
        meta: {
          name: '自制饮品订单',
          icon: 'icon-zizhiyinpin',
          hideChildren: true
        },
        children: [{
          path: '/drink-order-detail',
          name: 'drink-order-detail',
          component: (resolve) => require(['pages/orders-manage/drink-order/drink-order-detail'], resolve),
          meta: {
            name: '订单详情'
          }
        }]
      },
      {
        path: '/vip-buy-list',
        name: 'vip-buy-list',
        component: (resolve) => require(['pages/financial-center/vip-buy-list/vip-buy-list'], resolve),
        meta: {
          name: 'vip购买记录',
          icon: 'icon-vipgoumaijilu',
          hideChildren: true
        }
      },
      {
        path: '/transfer-orders-list',
        name: 'transfer-orders-list',
        component: (resolve) => require(['pages/orders-manage/transfer-orders-list'], resolve),
        meta: {
          name: '调拨管理',
          icon: 'icon-tiaoboguanli'
        },
        children: [{
          path: '/allot-in',
          name: 'allot-in',
          component: (resolve) => require(['pages/orders-manage/transfer-orders-list/allot-in/allot-in'], resolve),
          meta: {
            name: '调拨入库',
            icon: 'icon-tiaoboruku',
            hideChildren: true
          }
        },
        {
          path: '/allot-out',
          name: 'allot-out',
          component: (resolve) => require(['pages/orders-manage/transfer-orders-list/allot-out/allot-out'], resolve),
          meta: {
            name: '调拨出库',
            icon: 'icon-tiaobochuku',
            hideChildren: true
          },
          children: [{
            path: '/allot-out-detail',
            name: 'allot-out-detail',
            component: (resolve) => require(['pages/orders-manage/transfer-orders-list/allot-out/allot-out-detail/allot-out-detail'], resolve),
            meta: {
              name: '批量调拨',
              hideChildren: true
            }
          }]
        },
        {
          path: '/inside-allot',
          name: 'inside-allot',
          component: (resolve) => require(['pages/orders-manage/transfer-orders-list/inside-allot/inside-allot'], resolve),
          meta: {
            name: '内部调拨',
            icon: 'icon-neibutiaobo',
            hideChildren: true
          }
        }
        ]
      },
      {
        path: '/check-manage',
        name: 'check-manage',
        component: (resolve) => require(['pages/orders-manage/check-manage'], resolve),
        meta: {
          name: '盘点管理',
          icon: 'icon-pandianguanli'
        },
        children: [
          // {
          //       path: '/allot-in',
          //       name: 'allot-in',
          //       component: (resolve) => require(['pages/orders-manage/check-manage/allot-in/allot-in'], resolve),
          //       meta: {
          //           name: '调拨入库',
          //           icon: 'icon-tiaoboruku',
          //           hideChildren: true
          //       }
          //   },
          {
            path: '/check-list',
            name: 'check-list',
            component: (resolve) => require(['pages/orders-manage/check-manage/allot-out/allot-out'], resolve),
            meta: {
              name: '盘点记录',
              icon: 'icon-pandianjilu',
              hideChildren: true
            }
          }
        ]
      },
      {
        path: '/meal-order-list',
        name: 'meal-order-list',
        component: (resolve) => require(['pages/meal-manage/meal-order-list'], resolve),
        meta: {
          name: '餐食订单',
          icon: 'icon-canshidingdan',
          hideChildren: true
        },
        children: [{
          path: '/meal-order-detail',
          name: 'meal-order-detail',
          component: (resolve) => require(['pages/orders-manage/meal-order-detail'], resolve),
          meta: {
            name: '餐食订单详情',
            icon: 'icon-miaosha1',
            hideChildren: true
          }
        }]
      }
    ]
  },
  // 商城
  {
    path: '/shop',
    name: 'shop',
    component: (resolve) => require(['pages/shop'], resolve),
    meta: {
      name: '商城',
      icon: 'icon-shangcheng'
    },
    children: [{
      path: '/product-list',
      name: 'product-list',
      component: (resolve) => require(['pages/shop/product/product-list'], resolve),
      meta: {
        name: '商品列表',
        icon: 'icon-neirongliebiao',
        hideChildren: true
      },
      children: [{
        path: '/product-detail',
        name: 'product-detail',
        component: (resolve) => require(['pages/shop/product-detail/product-detail'], resolve),
        meta: {
          name: '商品信息'
        }
      },
      {
        path: '/product-purchase',
        name: 'product-purchase',
        component: (resolve) => require(['pages/shop/product-purchase/product-purchase'], resolve),
        meta: {
          name: '商品采购'
        }
      },
      {
        path: '/v8-category',
        name: 'v8-category',
        component: (resolve) => require(['pages/shop/product/v8-category/category-main'], resolve),
        meta: {
          name: 'V8产品分类'
        }
      },
      {
        path: '/product-snapshot',
        name: 'product-snapshot',
        component: (resolve) => require(['pages/shop/product/product-snapshot'], resolve),
        meta: {
          name: '商品库存快照列表'
        }
      }
      ]
    },
    {
      path: '/product-category',
      name: 'product-category',
      component: (resolve) => require(['pages/shop/product-category/product-category'], resolve),
      meta: {
        name: '商品分类',
        icon: 'icon-caidanguanli',
        hideChildren: true
      }
    },
    // {
    //     path: '/service',
    //     name: 'service',
    //     component: (resolve) => require(['pages/shop/service/service-category'], resolve),
    //     meta: {
    //         name: '管家服务',
    //         icon: 'icon-guanjiafuwu',
    //         hideChildren: true
    //     }
    // },
    {
      path: '/shop-setting',
      name: 'shop-setting',
      component: (resolve) => require(['pages/shop/shop-setting/shop-setting'], resolve),
      meta: {
        name: '商城设置',
        icon: 'icon-shangchengshezhi',
        hideChildren: true
      },
      children: [{
        path: '/build-template',
        name: 'build-template',
        component: (resolve) => require(['pages/shop/build-template/build-template'], resolve),
        meta: {
          name: '新建模版',
          hideChildren: true
        }
      }]
    },
    {
      path: '/shop-activity',
      name: 'shop-activity',
      component: (resolve) => require(['pages/shop/shop-activity/shop-activity'], resolve),
      meta: {
        name: '商城活动',
        icon: 'icon-renwuanpai',
        hideChildren: true
      },
      children: [{
        path: '/shop-activity-category',
        name: 'shop-activity-category',
        component: (resolve) => require(['pages/shop/shop-activity/shop-activity-category/shop-activity-category'], resolve),
        meta: {
          name: '活动商品分类'
        }
      }]
    },
    {
      path: '/goods-label',
      name: 'goods-label',
      component: (resolve) => require(['pages/shop/goods-label/goods-label'], resolve),
      meta: {
        name: '商品标签',
        icon: 'icon-yinpinbiaoqian',
        hideChildren: true
      }
    },
    {
      path: '/return-goods',
      name: 'return-goods',
      component: (resolve) => require(['pages/shop/return-goods/return-goods'], resolve),
      meta: {
        name: '退款管理',
        icon: 'icon-refund',
        hideChildren: true
      },
      children: [{
        path: '/return-goods-detail',
        name: 'return-goods-detail',
        component: (resolve) => require(['pages/shop/return-goods-detail/return-goods-detail'], resolve),
        meta: {
          name: '退款详情'
        }
      }]
    },
    {
      path: '/evaluation-list',
      name: 'evaluation-list',
      component: (resolve) => require(['pages/shop/evaluation-list/evaluation-list'], resolve),
      meta: {
        name: '评价管理',
        icon: 'icon-shangpinpingjia',
        hideChildren: true
      }
    },
    {
      path: '/oldman-sales',
      name: 'oldman-sales',
      component: (resolve) => require(['pages/shop/oldman-sales/oldman-sales'], resolve),
      meta: {
        name: '老年人折扣规则',
        icon: 'icon-laonianrenzhekou',
        hideChildren: true
      }
    }
    ]
  },
  // 自制餐食产品库
  {
    path: '/homemade-product',
    name: 'homemade-product',
    component: (resolve) => require(['pages/homemade-product'], resolve),
    meta: {
      name: '自制餐食产品',
      icon: 'icon-zizhicanshi'
    },
    children: [
      {
        path: '/homemade-product-list',
        name: 'homemade-product-list',
        component: (resolve) => require(['pages/homemade-product/homemade-product-list/homemade-product-list'], resolve),
        meta: {
          name: '餐食产品列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/homemade-product-detail',
            name: 'homemade-product-detail',
            component: (resolve) => require(['pages/homemade-product/homemade-product-list/homemade-product-detail'], resolve),
            meta: {
              name: '产品详情'
            }
          }
        ]
      },
      {
        path: '/homemade-product-category',
        name: 'homemade-product-category',
        component: (resolve) => require(['pages/homemade-product/homemade-product-category/homemade-product-category'], resolve),
        meta: {
          name: '餐食产品分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      },
      {
        path: '/raw-product',
        name: 'raw-product',
        component: (resolve) => require(['pages/homemade-product/raw-product/raw-product'], resolve),
        meta: {
          name: '餐食原料产品',
          icon: 'icon-chanpinyuanliao',
          hideChildren: true
        },
        children: [
          {
            path: '/raw-product-detail',
            name: 'raw-product-detail',
            component: (resolve) => require(['pages/homemade-product/raw-product/raw-product-detail'], resolve),
            meta: {
              name: '原料详情'
            }
          }
        ]
      },
      {
        path: '/raw-product-category',
        name: 'raw-product-category',
        component: (resolve) => require(['pages/homemade-product/raw-product/raw-product-category'], resolve),
        meta: {
          name: '餐食原料分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      },
      {
        path: '/choose-meal',
        name: 'choose-meal',
        component: (resolve) => require(['pages/homemade-product/choose-meal/choose-meal'], resolve),
        meta: {
          name: '自制餐食套餐',
          icon: 'icon-canshitaocan',
          hideChildren: true
        },
        children: [
          {
            path: '/choose-meal-detail',
            name: 'choose-meal-detail',
            component: (resolve) => require(['pages/homemade-product/choose-meal/choose-meal-detail'], resolve),
            meta: {
              name: '选购详情'
            }
          }
        ]
      },
      {
        path: '/homemade-zone',
        name: 'homemade-zone',
        component: (resolve) => require(['pages/homemade-product/homemade-zone/homemade-zone'], resolve),
        meta: {
          name: '餐食分工区域',
          icon: 'icon-fengongquyu',
          hideChildren: true
        }
      }
    ]
  },
  // 自制饮品产品库
  {
    path: '/drink-product',
    name: 'drink-product',
    component: (resolve) => require(['pages/drink-product'], resolve),
    meta: {
      name: '自制饮品产品',
      icon: 'icon-zizhiyinpin'
    },
    children: [
      {
        path: '/drink-product-list',
        name: 'drink-product-list',
        component: (resolve) => require(['pages/drink-product/drink-product-list/drink-product-list'], resolve),
        meta: {
          name: '饮品产品列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/drink-product-detail',
            name: 'drink-product-detail',
            component: (resolve) => require(['pages/drink-product/drink-product-list/drink-product-detail'], resolve),
            meta: {
              name: '产品详情'
            }
          }
        ]
      },
      {
        path: '/drink-product-category',
        name: 'drink-product-category',
        component: (resolve) => require(['pages/drink-product/drink-product-category/drink-product-category'], resolve),
        meta: {
          name: '饮品产品分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      },
      {
        path: '/drink-raw-product',
        name: 'drink-raw-product',
        component: (resolve) => require(['pages/drink-product/drink-raw-product/drink-raw-product'], resolve),
        meta: {
          name: '饮品原料产品',
          icon: 'icon-chanpinyuanliao',
          hideChildren: true
        },
        children: [
          {
            path: '/drink-raw-product-detail',
            name: 'drink-raw-product-detail',
            component: (resolve) => require(['pages/drink-product/drink-raw-product/drink-raw-product-detail'], resolve),
            meta: {
              name: '原料详情'
            }
          }
        ]
      },
      {
        path: '/drink-raw-product-category',
        name: 'drink-raw-product-category',
        component: (resolve) => require(['pages/drink-product/drink-raw-product/drink-raw-product-category'], resolve),
        meta: {
          name: '饮品原料分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      },
      {
        path: '/drink-zone',
        name: 'drink-zone',
        component: (resolve) => require(['pages/drink-product/drink-zone/drink-zone'], resolve),
        meta: {
          name: '饮品分工区域',
          icon: 'icon-fengongquyu',
          hideChildren: true
        }
      },
      {
        path: '/drink-product-label',
        name: 'drink-product-label',
        component: (resolve) => require(['pages/drink-product/drink-product-label/drink-product-label'], resolve),
        meta: {
          name: '饮品产品标签',
          icon: 'icon-yinpinbiaoqian',
          hideChildren: true
        }
      }
    ]
  },
  // 耗材产品
  {
    path: '/material-product',
    name: 'material-product',
    component: (resolve) => require(['pages/material-product'], resolve),
    meta: {
      name: '耗材产品',
      icon: 'icon-haocaichanpin'
    },
    children: [
      {
        path: '/material-product-list',
        name: 'material-product-list',
        component: (resolve) => require(['pages/material-product/material-product-list/material-product-list'], resolve),
        meta: {
          name: '耗材产品列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/material-product-detail',
            name: 'material-product-detail',
            component: (resolve) => require(['pages/material-product/material-product-list/material-product-detail'], resolve),
            meta: {
              name: '耗材产品详情'
            }
          }
        ]
      },
      {
        path: '/material-product-category',
        name: 'material-product-category',
        component: (resolve) => require(['pages/material-product/material-product-category'], resolve),
        meta: {
          name: '耗材产品分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      },
      {
        path: '/material-use-record',
        name: 'material-use-record',
        component: (resolve) => require(['pages/material-product/material-use-record/material-use-record'], resolve),
        meta: {
          name: '产品领用记录',
          icon: 'icon-haocaichanpin',
          hideChildren: true
        },
        children: [
          {
            path: '/material-use-record-detail',
            name: 'material-use-record-detail',
            component: (resolve) => require(['pages/material-product/material-use-record/material-use-record-detail'], resolve),
            meta: {
              name: '产品领用记录详情'
            }
          }
        ]
      }
    ]
  },
  // 散称产品库
  {
    path: '/weigh-product',
    name: 'weigh-product',
    component: (resolve) => require(['pages/weigh-product'], resolve),
    meta: {
      name: '散称产品',
      icon: 'icon-sanchengchanpin'
    },
    children: [
      {
        path: '/weigh-product-list',
        name: 'weigh-product-list',
        component: (resolve) => require(['pages/weigh-product/weigh-product-list/weigh-product-list'], resolve),
        meta: {
          name: '散称产品列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/v8-category-list',
            name: 'v8-category-list',
            component: (resolve) => require(['pages/weigh-product/weigh-product-list/v8-category-list/category-main'], resolve),
            meta: {
              name: 'v8产品分类'
            }
          },
          {
            path: '/weigh-product-detail',
            name: 'weigh-product-detail',
            component: (resolve) => require(['pages/weigh-product/weigh-product-list/weigh-product-detail'], resolve),
            meta: {
              name: '产品详情'
            }
          }
        ]
      },
      {
        path: '/weigh-product-category',
        name: 'weigh-product-category',
        component: (resolve) => require(['pages/weigh-product/weigh-product-category/weigh-product-category'], resolve),
        meta: {
          name: '散称产品分类',
          icon: 'icon-caidanguanli',
          hideChildren: true
        }
      }
    ]
  },
  // 点餐管理
  {
    path: '/order-meal-manage',
    name: 'order-meal-manage',
    component: (resolve) => require(['pages/order-meal-manage'], resolve),
    meta: {
      name: '点餐管理',
      icon: 'icon-diancanguanli'
    },
    children: [
      {
        path: '/order-meal-product',
        name: 'order-meal-product',
        component: (resolve) => require(['pages/order-meal-manage/order-meal-product'], resolve),
        meta: {
          name: '菜品管理',
          icon: 'icon-zizhicanshi'
        },
        children: [
          {
            path: '/meal-product-category',
            name: 'meal-product-category',
            component: (resolve) => require(['pages/order-meal-manage/order-meal-product/meal-product/meal-product-category'], resolve),
            meta: {
              name: '菜品分类',
              icon: 'icon-caidanguanli'
            }
          },
          {
            path: '/meal-product-list',
            name: 'meal-product-list',
            component: (resolve) => require(['pages/order-meal-manage/order-meal-product/meal-product/meal-product-list'], resolve),
            meta: {
              name: '菜品列表',
              icon: 'icon-neirongliebiao',
              hideChildren: true
            },
            children: [
              {
                path: '/meal-product-detail',
                name: 'meal-product-detail',
                component: (resolve) => require(['pages/order-meal-manage/order-meal-product/meal-product/meal-product-detail'], resolve),
                meta: {
                  name: '菜品详情'
                }
              }
            ]
          },
          {
            path: '/setMeal-product-list',
            name: 'setMeal-product-list',
            component: (resolve) => require(['pages/order-meal-manage/order-meal-product/setMeal-product/setMeal-product-list'], resolve),
            meta: {
              name: '菜品套餐',
              icon: 'icon-canshitaocan',
              hideChildren: true
            },
            children: [
              {
                path: '/setMeal-product-detail',
                name: 'setMeal-product-detail',
                component: (resolve) => require(['pages/order-meal-manage/order-meal-product/setMeal-product/setMeal-product-detail'], resolve),
                meta: {
                  name: '菜品套餐详情'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/table-area',
        name: 'table-area',
        component: (resolve) => require(['pages/order-meal-manage/table-area-manage/table-area'], resolve),
        meta: {
          name: '桌台区域',
          icon: 'icon-fengongquyu'
        }
      },
      {
        path: '/table-list',
        name: 'table-list',
        component: (resolve) => require(['pages/order-meal-manage/table-manage/table-list'], resolve),
        meta: {
          name: '桌台管理',
          icon: 'icon-zhuotai'
        }
      },
      {
        path: '/default-dishes',
        name: 'default-dishes',
        component: (resolve) => require(['pages/order-meal-manage/default-dishes-plan/default-dishes'], resolve),
        meta: {
          name: '必点菜方案',
          icon: 'icon-zizhicanshi',
          hideChildren: true
        },
        children: [
          {
            path: '/default-dishes-detail',
            name: 'default-dishes-detail',
            component: (resolve) => require(['pages/order-meal-manage/default-dishes-plan/default-dishes-detail'], resolve),
            meta: {
              name: '必点菜方案详情'
            }
          }
        ]
      },
      {
        path: '/order-meal-setting',
        name: 'order-meal-setting',
        component: (resolve) => require(['pages/order-meal-manage/order-meal-setting/order-meal-setting'], resolve),
        meta: {
          name: '点餐设置',
          icon: 'icon-xitongshezhi'
        }
      }
    ]
  },
  // 售卖机管理
  {
    path: '/vending-machine',
    name: 'vending-machine',
    component: (resolve) => require(['pages/vending-machine'], resolve),
    meta: {
      name: '售卖机管理',
      icon: 'icon-shoumaijiguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/product-template-list',
        name: 'product-template-list',
        component: (resolve) => require(['pages/vending-machine/vending-machine-product-template/product-template-list'], resolve),
        meta: {
          name: '产品模板',
          icon: 'icon-canshitaocan',
          hideChildren: true
        },
        children: [
          {
            path: '/product-template-detail',
            name: 'product-template-detail',
            component: (resolve) => require(['pages/vending-machine/vending-machine-product-template/product-template-detail'], resolve),
            meta: {
              name: '模板包含产品详情'
            }
          }
        ]
      },
      {
        path: '/new-product-apply',
        name: 'new-product-apply',
        component: (resolve) => require(['pages/vending-machine/new-product-apply/new-product-apply'], resolve),
        meta: {
          name: '新品申请',
          icon: 'icon-renwushenhe',
          hideChildren: true
        },
        children: [
          {
            path: '/third-product-list',
            name: 'third-product-list',
            component: (resolve) => require(['pages/vending-machine/new-product-apply/third-product-list'], resolve),
            meta: {
              name: '第三方基础库产品列表'
            }
          }
        ]
      },
      {
        path: '/vending-machine-bind-list',
        name: 'vending-machine-bind-list',
        component: (resolve) => require(['pages/vending-machine/vending-machine-bind/vending-machine-bind-list'], resolve),
        meta: {
          name: '售卖机绑定',
          icon: 'icon-canshitaocan',
          hideChildren: true
        },
        children: [
          {
            path: '/vending-machine-bind-detail',
            name: 'vending-machine-bind-detail',
            component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-machine-detail'], resolve),
            meta: {
              name: '售卖机绑定详情'
            }
          }
        ]
      },
      {
        path: '/vending-machine-list',
        name: 'vending-machine-list',
        component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-machine-list'], resolve),
        meta: {
          name: '售卖机列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/vending-machine-detail',
            name: 'vending-machine-detail',
            component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-machine-detail'], resolve),
            meta: {
              name: '售卖机详情'
            }
          },
          {
            path: '/vending-machine-prod',
            name: 'vending-machine-prod',
            component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-machine-prod/vending-machine-prod'], resolve),
            meta: {
              name: '产品绑定详情'
            },
            children: [
              {
                path: '/vending-machine-prod-detail',
                name: 'vending-machine-prod-detail',
                component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-machine-prod/vending-machine-prod-detail'], resolve),
                meta: {
                  name: '产品详情'
                }
              }
            ]
          },
          {
            path: '/vending-prod-record',
            name: 'vending-prod-record',
            component: (resolve) => require(['pages/vending-machine/vending-machine-list/vending-prod-record'], resolve),
            meta: {
              name: '补货记录'
            }
          }
        ]
      },
      {
        path: '/vending-machine-order',
        name: 'vending-machine-order',
        component: (resolve) => require(['pages/vending-machine/vending-order/vending-machine-order'], resolve),
        meta: {
          name: '售卖机订单',
          icon: 'icon-neirongguanli',
          hideChildren: true
        },
        children: [
          {
            path: '/vending-order-detail',
            name: 'vending-order-detail',
            component: (resolve) => require(['pages/vending-machine/vending-order/vending-order-detail'], resolve),
            meta: {
              name: '订单详情'
            }
          }
        ]
      },
      {
        path: '/abnormal-vending-order',
        name: 'abnormal-vending-order',
        component: (resolve) => require(['pages/vending-machine/abnormal-order/abnormal-vending-order'], resolve),
        meta: {
          name: '异常订单处理',
          icon: 'icon-yichangdingdan',
          hideChildren: true
        },
        children: [
          {
            path: '/abnormal-order-detail',
            name: 'abnormal-order-detail',
            component: (resolve) => require(['pages/vending-machine/abnormal-order/abnormal-order-detail'], resolve),
            meta: {
              name: '异常订单详情'
            }
          }
        ]
      },
      {
        path: '/pay-score-order',
        name: 'pay-score-order',
        component: (resolve) => require(['pages/vending-machine/pay-score/pay-score-order'], resolve),
        meta: {
          name: '支付分订单',
          icon: 'icon-zhifufendingdan',
          hideChildren: true
        },
        children: [
          {
            path: '/wx-order-detail',
            name: 'wx-order-detail',
            component: (resolve) => require(['pages/vending-machine/pay-score/wx-pay-score/wx-order-detail'], resolve),
            meta: {
              name: '微信支付分订单详情'
            }
          },
          {
            path: '/ali-order-detail',
            name: 'ali-order-detail',
            component: (resolve) => require(['pages/vending-machine/pay-score/ali-pay-score/ali-order-detail'], resolve),
            meta: {
              name: '支付宝支付分订单详情'
            }
          },
          {
            path: '/pay-score-refund-order',
            name: 'pay-score-refund-order',
            component: (resolve) => require(['pages/vending-machine/pay-score/pay-score-refund-order'], resolve),
            meta: {
              name: '支付分退款订单'
            }
          },
          {
            path: '/pay-score-abnormal-order-detail',
            name: 'pay-score-abnormal-order-detail',
            component: (resolve) => require(['pages/vending-machine/abnormal-order/abnormal-order-detail'], resolve),
            meta: {
              name: '异常订单详情'
            }
          }
        ]
      },
      {
        path: '/vending-purchase-orders',
        name: 'vending-purchase-orders',
        component: (resolve) => require(['pages/vending-machine/purchase-orders/index'], resolve),
        meta: {
          name: '采购单管理',
          icon: 'icon-zhifufendingdan'
        }
      },
      {
        path: '/vending-purchase-orders-detail',
        name: 'vending-purchase-orders-detail',
        component: (resolve) => require(['pages/vending-machine/purchase-orders/detail'], resolve),
        meta: {
          name: '采购单详情',
          hidden: true
        }
      },
      {
        path: '/machine-advert-material',
        name: 'machine-advert-material',
        component: (resolve) => require(['pages/vending-machine/vending-machine-advert/machine-advert-material'], resolve),
        meta: {
          name: '售卖机广告素材',
          icon: 'icon-chanpinyuanliao',
          hideChildren: true
        },
        children: [
          {
            path: '/machine-advert-material-detail',
            name: 'machine-advert-material-detail',
            component: (resolve) => require(['pages/vending-machine/vending-machine-advert/machine-advert-material-detail'], resolve),
            meta: {
              name: '售卖机广告素材申请'
            }
          }
        ]
      },
      {
        path: '/vending-machine-advert',
        name: 'vending-machine-advert',
        component: (resolve) => require(['pages/vending-machine/vending-machine-advert/vending-machine-advert'], resolve),
        meta: {
          name: '自助售卖机广告',
          icon: 'icon-dianshiguanggao',
          hideChildren: true
        },
        children: [
          {
            path: '/vending-machine-advert-detail',
            name: 'vending-machine-advert-detail',
            component: (resolve) => require(['pages/vending-machine/vending-machine-advert/vending-machine-advert-detail'], resolve),
            meta: {
              name: '自助售卖机广告详情'
            }
          },
          {
            path: '/machine-advert-bind',
            name: 'machine-advert-bind',
            component: (resolve) => require(['pages/vending-machine/vending-machine-advert/machine-advert-bind'], resolve),
            meta: {
              name: '广告关联设备信息'
            }
          }
        ]
      }
    ]
  },
  // 团购管理
  {
    path: '/groupon',
    name: 'groupon',
    component: (resolve) => require(['pages/groupon'], resolve),
    meta: {
      name: '团购管理',
      icon: 'icon-pintuanguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/groupon-template',
        name: 'groupon-template',
        component: (resolve) => require(['pages/groupon/groupon-template/groupon-template'], resolve),
        meta: {
          name: '团购模板',
          icon: 'icon-canshitaocan',
          hideChildren: true
        },
        children: [{
          path: '/groupon-template-detail',
          name: 'groupon-template-detail',
          component: (resolve) => require(['pages/groupon/groupon-template/groupon-template-detail'], resolve),
          meta: {
            name: '团购模板详情'
          }
        }]
      },
      {
        path: '/groupon-list',
        name: 'groupon-list',
        component: (resolve) => require(['pages/groupon/groupon-list/groupon-list'], resolve),
        meta: {
          name: '团购活动',
          icon: 'icon-pintuanchanpin',
          hideChildren: true
        },
        children: [{
          path: '/groupon-detail',
          name: 'groupon-detail',
          component: (resolve) => require(['pages/groupon/groupon-detail/groupon-detail'], resolve),
          meta: {
            name: '团购活动详情',
            hideChildren: true
          }
        }]
      },
      {
        path: '/groupon-orders-list',
        name: 'groupon-orders-list',
        component: (resolve) => require(['pages/groupon/orders-list/orders-list'], resolve),
        meta: {
          name: '团购订单',
          icon: 'icon-dingdan',
          hideChildren: true
        },
        children: [{
          path: '/groupon-orders-detail',
          name: 'groupon-orders-detail',
          component: (resolve) => require(['pages/groupon/orders-detail/orders-detail'], resolve),
          meta: {
            name: '团购订单详情'
          }
        }]
      },
      {
        path: '/groupon-return-goods',
        name: 'groupon-return-goods',
        component: (resolve) => require(['pages/groupon/return-goods/return-goods'], resolve),
        meta: {
          name: '团购退款',
          icon: 'icon-refund',
          hideChildren: true
        }
      }
    ]
  },
  // scrm
  {
    path: '/scrm',
    name: 'scrm',
    component: (resolve) => require(['pages/scrm'], resolve),
    meta: {
      name: 'SCRM管理',
      icon: 'icon-scrmguanli'
    },
    children: [{
      path: '/scrm-list',
      name: 'scrm-list',
      component: (resolve) => require(['pages/scrm/scrm-list/scrm-list'], resolve),
      meta: {
        name: '会员信息',
        icon: 'icon-huiyuanxinxi',
        hideChildren: true
      },
      children: [{
        path: '/scrm-detail',
        name: 'scrm-detail',
        component: (resolve) => require(['pages/scrm/scrm-detail/scrm-detail'], resolve),
        meta: {
          name: '会员详情',
          icon: 'icon-categoryselected'
        }
      },
      {
        path: '/scrm-order-detail',
        name: 'scrm-order-detail',
        component: (resolve) => require(['pages/scrm/scrm-order-detail/scrm-order-detail'], resolve),
        meta: {
          name: '会员订单详情'
        }
      }
      ]
    },
    {
      path: '/level-list',
      name: 'level-list',
      component: (resolve) => require(['pages/scrm/level-list/level-list'], resolve),
      meta: {
        name: '等级制度',
        icon: 'icon-jifendengji',
        hideChildren: true
      }
    },
    {
      path: '/identity-manage',
      name: 'identity-mamange',
      component: (resolve) => require(['pages/scrm/identity-mamange/index'], resolve),
      meta: {
        name: '用户身份管理',
        icon: 'icon-yonghshenfenguanli',
        hideChildren: false
      },
      children: [
        {
          path: '/identity-rule',
          name: 'identity-rule',
          component: (resolve) => require(['pages/scrm/identity-mamange/identity-rule/identity-rule-list'], resolve),
          meta: {
            name: '规则管理',
            icon: 'icon-fenrunguize',
            hideChildren: true
          },
          children: [
            {
              path: '/identity-rule-detail',
              name: 'identity-rule-detail',
              component: (resolve) => require(['pages/scrm/identity-mamange/identity-rule/identity-rule-detail'], resolve),
              meta: {
                name: '规则详情',
                hideChildren: true
              }
            },
            {
              path: '/identity-rule-category',
              name: 'identity-rule-category',
              component: (resolve) => require(['pages/scrm/identity-mamange/identity-rule/identity-rule-category'], resolve),
              meta: {
                name: '分类规则',
                icon: 'icon-fenrunguize',
                hideChildren: true
              }
              // children: [
              //   {
              //     path: '/identity-category-detail',
              //     name: 'identity-category-detail',
              //     component: (resolve) => require(['pages/scrm/identity-mamange/identity-rule/identity-category-detail'], resolve),
              //     meta: {
              //       name: '规则详情'
              //     }
              //   }
              // ]
            }
          ]
        },
        {
          path: '/identity-type-list',
          name: 'identity-type-list',
          component: (resolve) => require(['pages/scrm/identity-mamange/identity-type-list/identity-type-list'], resolve),
          meta: {
            name: '用户身份类型',
            icon: 'icon-shenfenleixing',
            hideChildren: true
          }
        }
      ]
    },
    {
      path: '/scrm-integral-level',
      name: 'scrm-integral-level',
      component: (resolve) => require(['pages/scrm/scrm-integral-level/scrm-integral-level'], resolve),
      meta: {
        name: '用户积分等级',
        icon: 'icon-jifendengji',
        hideChildren: true
      },
      children: [
        {
          path: '/scrm-integral-detail',
          name: 'scrm-integral-detail',
          component: (resolve) => require(['pages/scrm/scrm-integral-level/scrm-integral-detail'], resolve),
          meta: {
            name: '积分等级详情'
          }
        }
      ]
    },
    {
      path: '/integral-add-activity',
      name: 'integral-add-activity',
      component: (resolve) => require(['pages/scrm/integral-add-activity/integral-add-activity'], resolve),
      meta: {
        name: '消费积分换算',
        icon: 'icon-jifenxiaofeihuansuan',
        hideChildren: true
      }
    }
    ]
  },
  // 店员管理
  {
    path: '/staff-manage',
    name: 'staff-manage',
    component: (resolve) => require(['pages/staff-manage'], resolve),
    meta: {
      name: '店员管理',
      icon: 'icon-dianyuanguanli'
    },
    children: [
      {
        path: '/staff-list',
        name: 'staff-list',
        component: (resolve) => require(['pages/staff-manage/staff-list/staff-list'], resolve),
        meta: {
          name: '员工管理',
          icon: 'icon-yuangongguanli',
          hideChildren: true
        },
        children: [
          {
            path: '/staff-task',
            name: 'staff-task',
            component: (resolve) => require(['pages/staff-manage/staff-list/staff-task'], resolve),
            meta: {
              name: '员工任务'
            }
          }
        ]
      },
      {
        path: '/task-arrange',
        name: 'task-arrange',
        component: (resolve) => require(['pages/staff-manage/task-arrange/task-arrange'], resolve),
        meta: {
          name: '任务安排',
          icon: 'icon-renwuanpai',
          hideChildren: true
        },
        children: [
          {
            path: '/task-detail',
            name: 'task-detail',
            component: (resolve) => require(['pages/staff-manage/task-arrange/task-detail'], resolve),
            meta: {
              name: '任务详情'
            }
          }
        ]
      },
      {
        path: '/task-check',
        name: 'task-check',
        component: (resolve) => require(['pages/staff-manage/task-check/task-check'], resolve),
        meta: {
          name: '任务审核',
          icon: 'icon-renwushenhe',
          hideChildren: true
        },
        children: [
          {
            path: '/check-detail',
            name: 'check-detail',
            component: (resolve) => require(['pages/staff-manage/task-check/check-detail'], resolve),
            meta: {
              name: '审核详情'
            }
          }
        ]
      }
    ]
  },
  // 营销中心
  {
    path: '/marketing-center',
    name: 'marketing-center',
    component: (resolve) => require(['pages/marketing-center'], resolve),
    meta: {
      name: '营销中心',
      icon: 'icon-yingxiaozhongxin'
    },
    children: [
      {
        path: '/activity-enroll',
        name: 'activity-enroll',
        component: (resolve) => require(['pages/marketing-center/activity-enroll/activity-enroll'], resolve),
        meta: {
          name: '活动报名',
          icon: 'icon-huodongbaoming',
          hideChildren: true
        },
        children: [{
          path: '/activity-enroll-detail',
          name: 'activity-enroll-detail',
          component: (resolve) => require(['pages/marketing-center/activity-enroll-detail/activity-enroll-detail'], resolve),
          meta: {
            name: '报名信息'
          }
        },
        {
          path: '/activity-enroll-category',
          name: 'activity-enroll-category',
          component: (resolve) => require(['pages/marketing-center/activity-enroll-category/activity-enroll-category'], resolve),
          meta: {
            name: '活动分类'
          }
        }
        ]
      },
      {
        path: '/remark',
        name: 'remark',
        component: (resolve) => require(['pages/marketing-center/remark'], resolve),
        meta: {
          name: '任务活动',
          icon: 'icon-renwuhuodong',
          hideChildren: false
        },
        children: [{
          path: '/remark-list',
          name: 'remark-list',
          component: (resolve) => require(['pages/marketing-center/remark/remark-list/remark-list'], resolve),
          meta: {
            name: '任务列表',
            icon: 'icon-neirongliebiao',
            hideChildren: true
          },
          children: [{
            path: '/remark-detail',
            name: 'remark-detail',
            component: (resolve) => require(['pages/marketing-center/remark/remark-detail/remark-detail'], resolve),
            meta: {
              name: '任务详情',
              hideChildren: true
            }
          }]
        }]
      },
      {
        path: '/vote-list',
        name: 'vote-list',
        component: (resolve) => require(['pages/marketing-center/vote-list/vote-list'], resolve),
        meta: {
          name: '在线投票',
          icon: 'icon-zaixiantoupiao',
          hideChildren: true
        },
        children: [{
          path: '/vote-detail',
          name: 'vote-detail',
          component: (resolve) => require(['pages/marketing-center/vote-detail/vote-detail'], resolve),
          meta: {
            name: '投票详情'
          }
        },
        {
          path: '/vote-item-detail',
          name: 'vote-item-detail',
          component: (resolve) => require(['pages/marketing-center/vote-item-detail/vote-item-detail'], resolve),
          meta: {
            name: '投票项详情'
          }
        }
        ]
      },
      {
        path: '/cards-send',
        name: 'cards-send',
        component: (resolve) => require(['pages/marketing-center/cards-send'], resolve),
        meta: {
          name: '卡劵赠送',
          icon: 'icon-kaquanzengsong',
          hideChildren: true
        },
        children: [
          {
            path: '/cards-send-detail',
            name: 'cards-send-detail',
            component: (resolve) => require(['pages/marketing-center/cards-send/cards-send-detail'], resolve),
            meta: {
              name: '赠送详情'
            }
          }
        ]
      },
      {
        path: '/card-activity',
        name: 'card-activity',
        component: (resolve) => require(['pages/marketing-center/cards-send/card-activity/card-activity'], resolve),
        meta: {
          name: '领劵中心',
          icon: 'icon-lingquanzhongxin',
          hideChildren: true
        },
        children: [{
          path: '/card-activity-detail',
          name: 'card-activity-detail',
          component: (resolve) => require(['pages/marketing-center/cards-send/card-activity-detail/card-activity-detail'], resolve),
          meta: {
            name: '领劵中心详情'
          }
        }]
      },
      {
        path: '/share-card',
        name: 'share-card',
        component: (resolve) => require(['pages/marketing-center/share-card/share-card-activity'], resolve),
        meta: {
          name: '卡券分享活动',
          icon: 'icon-kaquanfenxiang',
          hideChildren: true
        },
        children: [{
          path: '/share-card-detail',
          name: 'share-card-detail',
          component: (resolve) => require(['pages/marketing-center/share-card/share-card-detail'], resolve),
          meta: {
            name: '卡券分享详情'
          }
        }]
      },
      {
        path: '/mission-medal',
        name: 'mission-medal',
        component: (resolve) => require(['pages/marketing-center/mission-medal/mission-medal'], resolve),
        meta: {
          name: '任务勋章',
          icon: 'icon-renwuxunzhang',
          hideChildren: false
        },
        children: [{
          path: '/mission-rules',
          name: 'mission-rules',
          component: (resolve) => require(['pages/marketing-center/mission-medal/mission-rules/mission-rules'], resolve),
          meta: {
            name: '勋章规则',
            icon: 'icon-xunzhangguize',
            hideChildren: true
          }
        },
        {
          path: '/mission-center',
          name: 'mission-center',
          component: (resolve) => require(['pages/marketing-center/mission-medal/mission-center/mission-center'], resolve),
          meta: {
            name: '勋章中心',
            icon: 'icon-xunzhangzhongxin',
            hideChildren: true
          },
          children: [{
            path: '/mission-center-category',
            name: 'mission-center-category',
            component: (resolve) => require(['pages/marketing-center/mission-medal/mission-center-category/mission-center-category'], resolve),
            meta: {
              name: '勋章分类'
            }
          }]
        }
        ]
      },
      {
        path: '/intergral-mall',
        name: 'intergral-mall',
        component: (resolve) => require(['pages/intergral-mall'], resolve),
        meta: {
          name: '积分商城',
          icon: 'icon-jifenshangcheng1',
          hideChildren: false
        },
        children: [{
          path: '/intergral-product-list',
          name: 'intergral-product-list',
          component: (resolve) => require(['pages/intergral-mall/intergral-product-list/intergral-product-list'], resolve),
          meta: {
            name: '积分产品库',
            icon: 'icon-jifenchanpinku',
            hideChildren: true
          },
          children: [{
            path: '/intergral-product-detail',
            name: 'intergral-product-detail',
            component: (resolve) => require(['pages/intergral-mall/intergral-product-detail/intergral-product-detail'], resolve),
            meta: {
              name: '积分产品库详情',
              hideChildren: true
            }
          }]
        },
        {
          path: '/intergral-giving',
          name: 'intergral-giving',
          component: (resolve) => require(['pages/intergral-mall/intergral-giving/intergral-giving'], resolve),
          meta: {
            name: '积分赠送',
            icon: 'icon-jifenzengsong',
            hideChildren: true
          }
        },
        {
          path: '/intergral-order-list',
          name: 'intergral-order-list',
          component: (resolve) => require(['pages/intergral-mall/intergral-order-list/intergral-order-list'], resolve),
          meta: {
            name: '积分订单',
            icon: 'icon-dingdan',
            hideChildren: true
          },
          children: [{
            path: '/intergral-order-detail',
            name: 'intergral-order-detail',
            component: (resolve) => require(['pages/intergral-mall/intergral-order-detail/intergral-order-detail'], resolve),
            meta: {
              name: '积分订单详情',
              hideChildren: true
            }
          }]
        }
          // {
          //   path: '/intergral-use-rule',
          //   name: 'intergral-use-rule',
          //   component: (resolve) => require(['pages/intergral-mall/intergral-use-rule/intergral-use-rule'], resolve),
          //   meta: {
          //     name: '积分使用规则',
          //     icon: 'icon-fenrunguize',
          //     hideChildren: true
          //   }
          // }
        ]
      },
      {
        path: '/points-rule',
        name: 'points-rule',
        component: (resolve) => require(['pages/marketing-center/points-rule/points-rule'], resolve),
        meta: {
          name: '积分规则',
          icon: 'icon-fenrunguize',
          hideChildren: true
        }
      },
      {
        path: '/card-list',
        name: 'card-list',
        component: (resolve) => require(['pages/card-list'], resolve),
        meta: {
          name: '营销卡劵',
          icon: 'icon-yundiankachongzhi',
          hideChildren: false
        },
        children: [{
          path: '/card-exchange',
          name: 'card-exchange',
          component: (resolve) => require(['pages/card-list/card-exchange/card-exchange'], resolve),
          meta: {
            name: '兑换劵',
            icon: 'icon-duihuanquan',
            hideChildren: true
          },
          children: [{
            path: '/card-exchange-detail',
            name: 'card-exchange-detail',
            component: (resolve) => require(['pages/card-list/card-exchange/card-exchange-detail'], resolve),
            meta: {
              name: '兑换券详情'
            }
          }]
        },
        {
          path: '/cash-card',
          name: 'cash-card',
          component: (resolve) => require(['pages/card-list/cash-card/cash-card'], resolve),
          meta: {
            name: '代金券',
            icon: 'icon-daijinquan',
            hideChildren: true
          },
          children: [{
            path: '/cash-card-detail',
            name: 'cash-card-detail',
            component: (resolve) => require(['pages/card-list/cash-card/cash-card-detail'], resolve),
            meta: {
              name: '代金券详情'
            }
          }]
        },
        {
          path: '/discount-card',
          name: 'discount-card',
          component: (resolve) => require(['pages/card-list/discount-card/discount-card'], resolve),
          meta: {
            name: '折扣券',
            icon: 'icon-zhekouquan',
            hideChildren: true
          },
          children: [{
            path: '/discount-card-detail',
            name: 'discount-card-detail',
            component: (resolve) => require(['pages/card-list/discount-card/discount-card-detail'], resolve),
            meta: {
              name: '折扣券详情'
            }
          }]
        },
        {
          path: '/small-card',
          name: 'small-card',
          component: (resolve) => require(['pages/card-list/small-card/small-card'], resolve),
          meta: {
            name: '大小劵',
            icon: 'icon-daxiaoquan',
            hideChildren: true
          },
          children: [{
            path: '/small-card-detail',
            name: 'small-card-detail',
            component: (resolve) => require(['pages/card-list/small-card/small-card-detail'], resolve),
            meta: {
              name: '大小券详情'
            }
          }]
        }
        ]
      },
      {
        path: '/manual-send-card',
        name: 'manual-send-card',
        component: (resolve) => require(['pages/marketing-center/manual-send-card/manual-send-card'], resolve),
        meta: {
          name: '手动赠券',
          icon: 'icon-shoudongzengquan',
          hideChildren: false
        }
      },
      {
        path: '/spike-list',
        name: 'spike-list',
        component: (resolve) => require(['pages/marketing-center/spike-list/spike-list'], resolve),
        meta: {
          name: '秒杀',
          icon: 'icon-miaoshaguanli',
          hideChildren: true
        },
        children: [{
          path: '/spike-detail',
          name: 'spike-detail',
          component: (resolve) => require(['pages/marketing-center/spike-detail/spike-detail'], resolve),
          meta: {
            name: '秒杀详情',
            hideChildren: true
          }
        }]
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        component: (resolve) => require(['pages/marketing-center/sign-in'], resolve),
        meta: {
          name: '签到管理',
          icon: 'icon-qiandaoguanli',
          hideChildren: false
        },
        children: [{
          path: '/continue-sign',
          name: 'continue-sign',
          component: (resolve) => require(['pages/marketing-center/sign-in/continue-sign/continue-sign'], resolve),
          meta: {
            name: '连续签到',
            icon: 'icon-lianxuqiandao',
            hideChildren: true
          }
        }]
      },
      {
        path: '/arrange-manage',
        name: 'arrange-manage',
        component: (resolve) => require(['pages/marketing-center/arrange-manage'], resolve),
        meta: {
          name: '预约管理',
          icon: 'icon-yuyueguanli',
          hideChildren: false
        },
        children: [{
          path: '/arrange-type',
          name: 'arrange-type',
          component: (resolve) => require(['pages/marketing-center/arrange-manage/arrange-type/arrange-type'], resolve),
          meta: {
            name: '预约场景',
            icon: 'icon-yuyuechangjing',
            hideChildren: true
          },
          children: [{
            path: '/arrange-list',
            name: 'arrange-list',
            component: (resolve) => require(['pages/marketing-center/arrange-manage/arrange-list/arrange-list'], resolve),
            meta: {
              name: '预约列表'
            }
          }]
        }]
      },
      {
        path: '/sales-promotion',
        name: 'sales-promotion',
        component: (resolve) => require(['pages/marketing-center/sales-promotion'], resolve),
        meta: {
          name: '促销活动',
          icon: 'icon-cuxiaohuodong',
          hideChildren: false
        },
        children: [{
          path: '/acitvity-list',
          name: 'acitvity-list',
          component: (resolve) => require(['pages/marketing-center/sales-promotion/acitvity-list/acitvity-list'], resolve),
          meta: {
            name: '活动列表',
            icon: 'icon-neirongliebiao',
            hideChildren: true
          },
          children: [{
            path: '/single-activity',
            name: 'single-activity',
            component: (resolve) => require(['pages/marketing-center/sales-promotion/single-activity/single-activity'], resolve),
            meta: {
              name: '单品活动'
            },
            children: [{
              path: '/single-activity-detail',
              name: 'single-activity-detail',
              component: (resolve) => require(['pages/marketing-center/sales-promotion/single-activity-detail/single-activity-detail'], resolve),
              meta: {
                name: '单品活动详情'
              }
            }]
          },
          {
            path: '/muliti-activity',
            name: 'muliti-activity',
            component: (resolve) => require(['pages/marketing-center/sales-promotion/muliti-activity/muliti-activity'], resolve),
            meta: {
              name: '组合套餐'
            },
            children: [{
              path: '/muliti-activity-detail',
              name: 'muliti-activity-detail',
              component: (resolve) => require(['pages/marketing-center/sales-promotion/muliti-activity-detail/muliti-activity-detail'], resolve),
              meta: {
                name: '组合套餐详情'
              }
            }]
          },
          {
            path: '/choose-activity',
            name: 'choose-activity',
            component: (resolve) => require(['pages/marketing-center/sales-promotion/choose-activity/choose-activity'], resolve),
            meta: {
              name: '选购组合套餐'
            },
            children: [{
              path: '/choose-activity-detail',
              name: 'choose-activity-detail',
              component: (resolve) => require(['pages/marketing-center/sales-promotion/choose-activity-detail/choose-activity-detail'], resolve),
              meta: {
                name: '选购组合套餐详情'
              }
            }]
          }
          ]
        }]
      },
      {
        path: '/lucky-pan',
        name: 'lucky-pan',
        component: (resolve) => require(['pages/marketing-center/lucky-pan'], resolve),
        meta: {
          name: '大转盘',
          icon: 'icon-dazhuanpan',
          hideChildren: true
        },
        children: [
          {
            path: '/lucky-pan-build',
            name: 'lucky-pan-build',
            component: (resolve) => require(['pages/marketing-center/lucky-pan/lucky-pan-build'], resolve),
            meta: {
              name: '创建大转盘',
              hideChildren: false
            }
          },
          {
            path: '/lucky-pan-edit',
            name: 'lucky-pan-edit',
            component: (resolve) => require(['pages/marketing-center/lucky-pan/lucky-pan-edit'], resolve),
            meta: {
              name: '编辑大转盘',
              hideChildren: false
            }
          }
        ]
      }
    ]
  },
  // 餐食管理
  {
    path: '/meal-manage',
    name: 'meal-manage',
    component: (resolve) => require(['pages/meal-manage'], resolve),
    meta: {
      name: '餐食管理',
      icon: 'icon-canshiku',
      hideChildren: false
    },
    children: [{
      path: '/meal-category',
      name: 'meal-category',
      component: (resolve) => require(['pages/meal-manage/meal-category'], resolve),
      meta: {
        name: '餐食分类',
        icon: 'icon-caidanguanli',
        hideChildren: true
      }
    },
    {
      path: '/meal-list',
      name: 'meal-list',
      component: (resolve) => require(['pages/meal-manage/meal-list'], resolve),
      meta: {
        name: '餐食库',
        icon: 'icon-canshiku',
        hideChildren: true
      },
      children: [{
        path: '/meal-list-detail',
        name: 'meal-list-detail',
        component: (resolve) => require(['pages/meal-manage/meal-list-detail/meal-list-detail'], resolve),
        meta: {
          name: '餐食库详情',
          icon: 'icon-miaosha1',
          hideChildren: true
        }
      }]
    },
    {
      path: '/meal-day-list',
      name: 'meal-day-list',
      component: (resolve) => require(['pages/meal-manage/meal-day-list'], resolve),
      meta: {
        name: '每日美食单',
        icon: 'icon-dingdan',
        hideChildren: true
      },
      children: [{
        path: '/meal-day-detail',
        name: 'meal-day-detail',
        component: (resolve) => require(['pages/meal-manage/meal-day-detail'], resolve),
        meta: {
          name: '每日美食单详情',
          icon: 'icon-miaosha1',
          hideChildren: true
        }
      },
      {
        path: '/meal-day-product-detail',
        name: 'meal-day-product-detail',
        component: (resolve) => require(['pages/meal-manage/meal-day-product-detail'], resolve),
        meta: {
          name: '每日美食单产品详情',
          icon: 'icon-miaosha1',
          hideChildren: true
        }
      }
      ]
    },
    {
      path: '/meal-add',
      name: 'meal-add',
      component: (resolve) => require(['pages/meal-manage/meal-add'], resolve),
      meta: {
        name: '餐食订单添加',
        icon: 'icon-canshidingdanadd',
        hideChildren: true
      }
    }
    ]
  },
  // 供应链模块
  {
    path: '/supply-chain',
    name: 'supply-chain',
    component: (resolve) => require(['pages/supply-chain'], resolve),
    meta: {
      name: '供应链模块',
      icon: 'icon-gongyinglianguanli'
    },
    children: [{
      path: '/supply-purchase',
      name: 'supply-purchase',
      component: (resolve) => require(['pages/supply-chain/purchase/purchase'], resolve),
      meta: {
        name: '自营采购',
        icon: 'icon-ziyingcaigou',
        hideChildren: true
      },
      children: [{
        path: '/supply-purchase-detail',
        name: 'supply-purchase-detail',
        component: (resolve) => require(['pages/supply-chain/purchase/purchase-detail/purchase-detail'], resolve),
        meta: {
          name: '采购单详情',
          hideChildren: true
        }
      }]
    },
    {
      path: '/supply-purchase-sup',
      name: 'supply-purchase-sup',
      component: (resolve) => require(['pages/supply-chain/purchase-sup/purchase'], resolve),
      meta: {
        name: '供应商采购',
        icon: 'icon-ziyingcaigou',
        hideChildren: true
      },
      children: [{
        path: '/supply-purchase-sup-detail',
        name: 'supply-purchase-sup-detail',
        component: (resolve) => require(['pages/supply-chain/purchase-sup/purchase-detail/purchase-detail'], resolve),
        meta: {
          name: '采购单详情',
          hideChildren: true
        }
      }]
    },
    {
      path: '/supply-supplier-list',
      name: 'supply-supplier-list',
      component: (resolve) => require(['pages/supply-chain/supplier/supplier-list'], resolve),
      meta: {
        name: '供应商管理',
        icon: 'icon-gongyingshangguanli',
        hideChildren: true
      },
      children: [{
        path: '/supply-supplier-detail',
        name: 'supply-supplier-detail',
        component: (resolve) => require(['pages/supply-chain/supplier/supplier-detail/supplier-detail'], resolve),
        meta: {
          name: '供应商详情',
          hideChildren: true
        }
      }]
    },
    {
      path: '/supply-stock',
      name: 'supply-stock',
      component: (resolve) => require(['pages/supply-chain/stock/stock'], resolve),
      meta: {
        name: '库存管理',
        icon: 'icon-kucunguanli',
        hideChildren: false
      },
      children: [{
        path: '/supply-not-stock',
        name: 'supply-not-stock',
        component: (resolve) => require(['pages/supply-chain/stock/not-stock/not-stock'], resolve),
        meta: {
          name: '待入库的采购单',
          icon: 'icon-dairuku',
          hideChildren: true
        },
        children: [{
          path: '/supply-not-stock-detail',
          name: 'supply-not-stock-detail',
          component: (resolve) => require(['pages/supply-chain/stock/not-stock/not-stock-detail/not-stock-detail'], resolve),
          meta: {
            name: '采购单详情',
            hideChildren: true
          }
        }]
      },
      {
        path: '/supply-in-stock',
        name: 'supply-in-stock',
        component: (resolve) => require(['pages/supply-chain/stock/in-stock/in-stock'], resolve),
        meta: {
          name: '已入库产品',
          icon: 'icon-yiruku',
          hideChildren: true
        }
      }
      ]
    },
    {
      path: '/supply-expiring',
      name: 'supply-expiring',
      component: (resolve) => require(['pages/supply-chain/expiring/expiring'], resolve),
      meta: {
        name: '临期产品管理',
        icon: 'icon-linqichanpin',
        hideChildren: true
      }
    }
    ]
  },
  // 电视广告
  {
    path: '/advert-tv',
    name: 'advert-tv',
    component: (resolve) => require(['pages/advert-tv'], resolve),
    meta: {
      name: '电视广告',
      icon: 'icon-dianshiguanggao'
    },
    children: [
      {
        path: '/advert-tv-list',
        name: 'advert-tv-list',
        component: (resolve) => require(['pages/advert-tv/advert-tv-list'], resolve),
        meta: {
          name: '内容管理',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/advert-tv-detail',
            name: 'advert-tv-detail',
            component: (resolve) => require(['pages/advert-tv/advert-tv-detail'], resolve),
            meta: {
              name: '电视广告内容详情'
            }
          }
        ]
      }
    ]
  },
  // cms
  {
    path: '/cms',
    name: 'cms',
    component: (resolve) => require(['pages/CMS'], resolve),
    meta: {
      name: 'CMS管理',
      icon: 'icon-neirongguanli'
    },
    children: [{
      path: '/cms-list',
      name: 'cms-list',
      component: (resolve) => require(['pages/CMS/list/list'], resolve),
      meta: {
        name: '内容管理',
        icon: 'icon-neirongliebiao',
        hideChildren: true
      },
      children: [{
        path: '/cms-detail',
        name: 'cms-detail',
        component: (resolve) => require(['pages/CMS/detail/detail'], resolve),
        meta: {
          name: '内容详情'
        }
      }]
    },
    {
      path: '/cms-category',
      name: 'cms-category',
      component: (resolve) => require(['pages/CMS/category/category'], resolve),
      meta: {
        name: '栏目类别',
        icon: 'icon-lanmuliebie'
      }
    },
    {
      path: '/comments-list',
      name: 'comments-list',
      component: (resolve) => require(['pages/CMS/comments-list/comments-list'], resolve),
      meta: {
        name: '留言评论',
        icon: 'icon-liuyanpinglun',
        hideChildren: true
      },
      children: [{
        path: '/comments-detail',
        name: 'comments-detail',
        component: (resolve) => require(['pages/CMS/comments-detail/comments-detail'], resolve),
        meta: {
          name: '评论详情'
        }
      }]
    },
    {
      path: '/cms-fix-list',
      name: 'cms-fix-list',
      component: (resolve) => require(['pages/CMS/fixList/list'], resolve),
      meta: {
        name: '信息发布',
        icon: 'icon-xinxifabu',
        hideChildren: true
      },
      children: [{
        path: '/cms-fix-detail',
        name: 'cms-fix-detail',
        component: (resolve) => require(['pages/CMS/fixDetail/detail'], resolve),
        meta: {
          name: '信息详情',
          icon: 'icon-categoryselected'
        }
      }]
    }
    ]
  },
  // 渠道管理
  {
    path: '/channel',
    name: 'channel',
    component: (resolve) => require(['pages/channel'], resolve),
    meta: {
      name: '渠道管理',
      icon: 'icon-qudaoguanli'
    },
    children: [{
      path: '/channel-list',
      name: 'channel-list',
      component: (resolve) => require(['pages/channel/channel-list/channel-list'], resolve),
      meta: {
        name: '渠道专员管理',
        icon: 'icon-qudaozhuanyuan',
        hideChildren: true
      },
      children: [{
        path: '/channel-detail',
        name: 'channel-detail',
        component: (resolve) => require(['pages/channel/channel-detail/channel-detail'], resolve),
        meta: {
          name: '渠道专员信息'
        }
      }]
    },
    {
      path: '/sales-list',
      name: 'sales-list',
      component: (resolve) => require(['pages/channel/sales-list/sales-list'], resolve),
      meta: {
        name: '业务员管理',
        icon: 'icon-yewuyuanguanli',
        hideChildren: true
      },
      children: [{
        path: '/sales-detail',
        name: 'sales-detail',
        component: (resolve) => require(['pages/channel/sales-detail/sales-detail'], resolve),
        meta: {
          name: '业务员信息'
        }
      }]
    },
    {
      path: '/benefit-rule',
      name: 'benefit-rule',
      component: (resolve) => require(['pages/channel/benefit-rule/benefit-rule'], resolve),
      meta: {
        name: '分润规则',
        icon: 'icon-fenrunguize',
        hideChildren: true
      }
    },
    {
      path: '/only-channel-category',
      name: 'only-channel-category',
      component: (resolve) => require(['pages/channel/only-channel/only-channel-category'], resolve),
      meta: {
        name: '渠道分类',
        icon: 'icon-caidanguanli',
        hideChildren: true
      }
    },
    {
      path: '/only-channel-list',
      name: 'only-channel-list',
      component: (resolve) => require(['pages/channel/only-channel/only-channel-list'], resolve),
      meta: {
        name: '渠道列表',
        icon: 'icon-neirongliebiao',
        hideChildren: true
      },
      children: [{
        path: '/only-channel-detail',
        name: 'only-channel-detail',
        component: (resolve) => require(['pages/channel/only-channel/only-channel-detail/only-channel-detail'], resolve),
        meta: {
          name: '渠道信息'
        }
      }]
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: (resolve) => require(['pages/channel/withdraw/withdraw'], resolve),
      meta: {
        name: '提现管理',
        icon: 'icon-tixianguanli',
        hideChildren: true
      }
    }
    ]
  },
  // 云点卡管理
  {
    path: '/value-card-manage',
    name: 'value-card-manage',
    component: (resolve) => require(['pages/value-card-manage'], resolve),
    meta: {
      name: '云点卡管理',
      icon: 'icon-yundiankachongzhi'
    },
    children: [
      {
        path: '/value-card-cate',
        name: 'value-card-cate',
        component: (resolve) => require(['pages/value-card-manage/value-card-cate/value-card-cate'], resolve),
        meta: {
          name: '云点卡面类型',
          icon: 'icon-kamianleixing',
          hideChildren: true
        }
      },
      {
        path: '/value-card-list',
        name: 'value-card-list',
        component: (resolve) => require(['pages/value-card-manage/value-card-list/value-card-list'], resolve),
        meta: {
          name: '云点卡列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/value-card-flow-record',
            name: 'value-card-flow-record',
            component: (resolve) => require(['pages/value-card-manage/value-card-list/value-card-flow-record'], resolve),
            meta: {
              name: '流水记录'
            }
          }
        ]
      },
      {
        path: '/recharge-limit',
        name: 'recharge-limit',
        component: (resolve) => require(['pages/value-card-manage/recharge-limit/recharge-limit'], resolve),
        meta: {
          name: '办卡充值优惠',
          icon: 'icon-kamianchongzhi',
          hideChildren: true
        }
      }
    ]
  },
  // 预付卡管理
  {
    path: '/prepay-card-manage',
    name: 'prepay-card-manage',
    component: (resolve) => require(['pages/prepay-card-manage'], resolve),
    meta: {
      name: '预付卡管理',
      icon: 'icon-yundiankachongzhi'
    },
    children: [
      {
        path: '/prepay-card-list',
        name: 'prepay-card-list',
        component: (resolve) => require(['pages/prepay-card-manage/prepay-card-list'], resolve),
        meta: {
          name: '预付卡列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/prepay-card-detail',
            name: 'prepay-card-detail',
            component: (resolve) => require(['pages/prepay-card-manage/prepay-card-detail'], resolve),
            meta: {
              name: '预付卡详情',
              hideChildren: true
            }
          }
        ]
      }
    ]
  },
  // 企微营销
  {
    path: '/wx-marketing',
    name: 'wx-marketing',
    component: (resolve) => require(['pages/wx-marketing'], resolve),
    meta: {
      name: '企微营销',
      icon: 'icon-weixinguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/group-welcome-msg',
        name: 'group-welcome-msg',
        component: (resolve) => require(['pages/wx-marketing/group-welcome-msg'], resolve),
        meta: {
          name: '入群欢迎语',
          icon: 'icon-gongzhonghaoshezhi',
          hideChildren: true
        }
      }
    ]
  },
  // 资产管理
  {
    path: '/property-manage',
    name: 'property-manage',
    component: (resolve) => require(['pages/property-manage'], resolve),
    meta: {
      name: '资产管理',
      icon: 'icon-zichanguanli'
    },
    children: [
      {
        path: '/property-list',
        name: 'property-list',
        component: (resolve) => require(['pages/property-manage/property-list'], resolve),
        meta: {
          name: '资产列表',
          icon: 'icon-neirongliebiao',
          hideChildren: true
        },
        children: [
          {
            path: '/property-detail',
            name: 'property-detail',
            component: (resolve) => require(['pages/property-manage/property-detail'], resolve),
            meta: {
              name: '资产详情'
            }
          }
        ]
      },
      {
        path: '/property-category',
        name: 'property-category',
        component: (resolve) => require(['pages/property-manage/property-category'], resolve),
        meta: {
          name: '资产类别',
          icon: 'icon-caidanguanli'
        }
      }
    ]
  },
  // 财务中心
  {
    path: '/financial-center',
    name: 'financial-center',
    component: (resolve) => require(['pages/financial-center'], resolve),
    meta: {
      name: '财务中心',
      icon: 'icon-caiwuzhongxin'
    },
    children: [
      {
        path: '/vip-manage',
        name: 'vip-manage',
        component: (resolve) => require(['pages/financial-center/vip-manage/vip-manage'], resolve),
        meta: {
          name: 'vip套餐管理',
          icon: 'icon-viptaocanguanli',
          hideChildren: true
        }
      },
      {
        path: '/recharge-list',
        name: 'recharge-list',
        component: (resolve) => require(['pages/financial-center/recharge-list/recharge-list'], resolve),
        meta: {
          name: '充值记录',
          icon: 'icon-chongzhijilu',
          hideChildren: true
        },
        children: [
          {
            path: '/recharge-refund-order',
            name: 'recharge-refund-order',
            component: (resolve) => require(['pages/financial-center/recharge-list/recharge-refund-order'], resolve),
            meta: {
              name: '充值退款记录'
            }
          }
        ]
      },
      {
        path: '/recharge-discount',
        name: 'recharge-discount',
        component: (resolve) => require(['pages/financial-center/recharge-discount/recharge-discount'], resolve),
        meta: {
          name: '充值优惠',
          icon: 'icon-chongzhiyouhui',
          hideChildren: true
        }
      },
      {
        path: '/finance-count',
        name: 'finance-count',
        component: (resolve) => require(['pages/financial-center/finance-count/finance-count'], resolve),
        meta: {
          name: '销售统计',
          icon: 'icon-xiaoshoutongji',
          hideChildren: true
        }
      },
      // {
      //     path: '/cost-statistics',
      //     name: 'cost-statistics',
      //     component: (resolve) => require(['pages/financial-center/cost-statistics/cost-statistics'], resolve),
      //     meta: {
      //         name: '店铺成本统计',
      //         icon: 'icon-chengbentongji',
      //         hideChildren: true
      //     },
      //     children: [{
      //         path: '/cost-statistics-detail',
      //         name: 'cost-statistics-detail',
      //         component: (resolve) => require(['pages/financial-center/cost-statistics-detail/cost-statistics-detail'], resolve),
      //         meta: {
      //             name: '店铺成本统计详情',
      //             hideChildren: true
      //         }
      //     }]
      // },
      {
        path: '/daily-statement',
        name: 'daily-statement',
        component: (resolve) => require(['pages/financial-center/daily-statement/daily-statement'], resolve),
        meta: {
          name: '日结单',
          icon: 'icon-rijiedan',
          hideChildren: true
        },
        children: [{
          path: '/daily-statement-detail',
          name: 'daily-statement-detail',
          component: (resolve) => require(['pages/financial-center/daily-statement-detail/daily-statement-detail'], resolve),
          meta: {
            name: '日结单详情',
            icon: '',
            hideChildren: true
          }
        }]
      },
      {
        path: '/profit-loss',
        name: 'profit-loss',
        component: (resolve) => require(['pages/financial-center/profit-loss/profit-loss'], resolve),
        meta: {
          name: '浮动盈亏',
          icon: 'icon-fudongyingkui',
          hideChildren: true
        }
      },
      {
        path: '/recharge-card',
        name: 'recharge-card',
        component: (resolve) => require(['pages/financial-center/rechargeCard/rechargeCard'], resolve),
        meta: {
          name: '充值卡',
          icon: 'icon-chongzhika',
          hideChildren: true
        }
      },
      {
        path: '/store-statistics',
        name: 'store-statistics',
        component: (resolve) => require(['pages/financial-center/store-statistics/store-statistics'], resolve),
        meta: {
          name: '门店数据',
          icon: 'icon-mendianshuju',
          hideChildren: true
        }
      },
      {
        path: '/month-report-check',
        name: 'month-report-check',
        component: (resolve) => require(['@/pages/financial-center/month-report-check/month-report-check.vue'], resolve),
        meta: {
          name: '月报审账',
          icon: 'icon-chongzhiyouhui',
          hideChildren: true
        },
        children: [
          {
            path: ':reportId',
            name: 'month-report-check-detail',
            component: (resolve) => require(['@/pages/financial-center/month-report-check-detail/month-report-check-detail.vue'], resolve),
            meta: {
              name: '月报详情',
              hideChildren: true
            }
          }
        ]
      }
    ]
  },
  // 通知中心
  {
    path: '/notice-center',
    name: 'notice-center',
    component: (resolve) => require(['pages/notice-center'], resolve),
    meta: {
      name: '通知中心',
      icon: 'icon-tongzhizhongxin',
      hideChildren: false
    },
    children: [
      {
        path: '/notice-list',
        name: 'notice-list',
        component: (resolve) => require(['pages/notice-center/notice-list'], resolve),
        meta: {
          name: '消息列表',
          icon: 'icon-message',
          hideChildren: true
        }
      }
    ]
  },
  // 企业管理
  {
    path: '/enterprise-manage',
    name: 'enterprise-manage',
    component: (resolve) => require(['pages/enterprise-manage'], resolve),
    meta: {
      name: '企业管理',
      icon: 'icon-qiyeguanli',
      hideChildren: false
    },
    children: [
      {
        path: '/enterprise-list',
        name: 'enterprise-list',
        component: (resolve) => require(['pages/enterprise-manage/enterprise-list/enterprise-list'], resolve),
        meta: {
          name: '企业信息',
          icon: 'icon-qiyexinxi',
          hideChildren: true
        },
        children: [
          {
            path: '/enterprise-detail',
            name: 'enterprise-detail',
            component: (resolve) => require(['pages/enterprise-manage/enterprise-detail/enterprise-detail'], resolve),
            meta: {
              name: '企业详情',
              hideChildren: true
            },
            children: [
              {
                path: '/order-detail',
                name: 'order-detail',
                component: (resolve) => require(['pages/enterprise-manage/enterprise-detail/order-detail/order-detail'], resolve),
                meta: {
                  name: '订单详情'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  // 微信设置
  {
    path: '/wx-config',
    name: 'wx-config',
    component: (resolve) => require(['pages/wx-config'], resolve),
    meta: {
      name: '微信管家',
      icon: 'icon-weixinguanli'
    },
    children: [{
      path: '/wx-main-config',
      name: 'wx-main-config',
      component: (resolve) => require(['pages/wx-config/wx-main-config/wx-main-config'], resolve),
      meta: {
        name: '公众号设置',
        icon: 'icon-gongzhonghaoshezhi',
        hideChildren: true
      }
    },
    {
      path: '/wx-menu-setting',
      name: 'wx-menu-setting',
      component: (resolve) => require(['pages/wx-config/wx-menu-setting/wx-menu-setting'], resolve),
      meta: {
        name: '菜单设置',
        icon: 'icon-caidanguanli',
        hideChildren: true
      }
    }
    ]
  },
  // 拉卡拉分账
  {
    path: '/lakala-ledger-manage',
    name: 'lakala-ledger-manage',
    component: (resolve) => require(['pages/lakala-ledger-manage'], resolve),
    meta: {
      name: '拉卡拉分账',
      icon: 'icon-fenzhangguanli'
    },
    children: [
      {
        path: '/merchangt-ledger-list',
        name: 'merchangt-ledger-list',
        component: (resolve) => require(['pages/lakala-ledger-manage/merchangt-ledger/merchangt-ledger-list'], resolve),
        meta: {
          name: '商户分账业务',
          icon: 'icon-shanghufenzhang',
          hideChildren: true
        },
        children: [
          {
            path: '/merchangt-ledger-detail',
            name: 'merchangt-ledger-detail',
            component: (resolve) => require(['pages/lakala-ledger-manage/merchangt-ledger/merchangt-ledger-detail'], resolve),
            meta: {
              name: '商户分账业务信息详情'
            }
          }
        ]
      },
      {
        path: '/ledger-receiver-list',
        name: 'ledger-receiver-list',
        component: (resolve) => require(['pages/lakala-ledger-manage/ledger-receiver/ledger-receiver-list'], resolve),
        meta: {
          name: '分账接收方',
          icon: 'icon-jieshoufang',
          hideChildren: true
        },
        children: [
          {
            path: '/ledger-receiver-detail',
            name: 'ledger-receiver-detail',
            component: (resolve) => require(['pages/lakala-ledger-manage/ledger-receiver/ledger-receiver-detail'], resolve),
            meta: {
              name: '分账接收方详情'
            }
          }
        ]
      }
    ]
  },
  // 系统设置
  {
    path: '/system',
    component: (resolve) => require(['pages/system'], resolve),
    name: 'system',
    meta: {
      name: '系统管理',
      icon: 'icon-xitongshezhi'
    },
    children: [
      {
        path: '/printer-setting',
        name: 'printer-setting',
        component: resolve => require(['pages/system/printer-setting/printer-setting'], resolve),
        meta: {
          name: '打印设置',
          icon: 'icon-printer',
          hideChildren: true
        }
      },
      {
        path: '/payment-setting',
        name: 'payment-setting',
        component: (resolve) => require(['pages/system/payment-setting/payment-setting'], resolve),
        meta: {
          name: '支付设置',
          icon: 'icon-zhifushezhi',
          hideChildren: true
        }
      },
      {
        path: '/menu-list',
        name: 'menu-list',
        component: (resolve) => require(['pages/system/menu/index'], resolve),
        meta: {
          name: '菜单管理',
          icon: 'icon-caidanguanli'
        }
      },
      {
        path: '/organization-list',
        name: 'organization-list',
        component: (resolve) => require(['pages/system/organization/index'], resolve),
        meta: {
          name: '组织机构管理',
          icon: 'icon-organization'
        }
      },
      {
        path: '/admin-permission',
        name: 'admin-permission',
        component: (resolve) => require(['pages/system/adminpermission/index'], resolve),
        meta: {
          name: '管理员分配权限',
          icon: 'icon-jiaoseguanli'
        }
      },
      {
        path: '/user-list',
        name: 'user-list',
        component: (resolve) => require(['pages/system/user/index'], resolve),
        meta: {
          name: '用户管理',
          icon: 'icon-yonghuguanli',
          hideChildren: true
        },
        children: [
          {
            path: '/user-store-detail',
            name: 'user-store-detail',
            component: (resolve) => require(['pages/system/user/user-store-detail'], resolve),
            meta: {
              name: '门店修改详情'
            }
          }
        ]
      }
    ]
  }
]

export default dynamicRoutes
