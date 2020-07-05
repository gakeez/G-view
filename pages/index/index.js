//index.js
//获取应用实例
//通过getApp获取全局对象，然后进行全局变量和全局方法的使用。
const app = getApp()

Page({
  data: {
    components: [
      {
          title: '营销组件',
          children: [
              {
                  url: '/pages/big-wheel/index',
                  name: '图片版大转盘动画',
                  show: true
              },
              {
                url: '/pages/css-wheel/index',
                name: 'css版大转盘动画',
                show: true
              },
              {
                url: '/pages/svg-wheel/index',
                name: 'svg版大转盘动画',
                show: true
              },
              /* {
                  id: 'packet-rain',
                  url: '/pages/packet-rain/index',
                  name: '红包雨动画',
                  show: false
              },
              {
                  id: 'grid-card',
                  url: '/pages/grid-card/index',
                  name: '九宫格翻牌动画',
                  show: true
              },
              {
                  id: 'slot-machine',
                  url: '/pages/slot-machine/index',
                  name: '老虎机动画',
                  show: false
              } */
          ]
      },
      /* {
          title: '业务组件',
          children: [
              {
                  id: 'scoll-nav',
                  url: '/pages/scoll-nav/index',
                  name: '滚动导航条',
                  show: false
              },
              {
                id: 'share-sheet',
                url: '/pages/painter/index',
                name: '微信分享组件(转发好友/分享图)',
                show: false
              },
              {
                id: 'float-icon',
                url: '/pages/float-icon/index',
                name: '悬浮按钮',
                show: true
              }
          ]
      }, */
  ],
  },
})
