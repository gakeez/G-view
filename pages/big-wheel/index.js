// pages/big-wheel/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
      award: 1,
      mode: 2, // 旋转模式
      awardList: [
          { title: '10个金币' },
          { title: '20个金币' },
          { title: '30个金币' },
          { title: '50个金币' },
          { title: '80个金币' },
          { title: '200个金币' }
      ] // 顺时针对应每个奖项
  },
  onLoad: function(options) {},
  // 用户点击开始抽奖
  wheelStart() {
      // 设置奖项
      this.setData({
          /* Math.floor 返回小于或等于一个给定数字的最大整数 */
          /* Math.random 返回介于 0（包含） ~ 1（不包含） 之间的一个随机数： */
          award: Math.floor(Math.random() * 6 + 1) //生成1到6随机。注意：安全起见生成奖项应该由后端完成
          // 个人觉得可以不加1
      })
      
      // 触发组件开始方法
      /* 可在父组件里调用 this.selectComponent ，获取子组件的实例对象。（插件的自定义组件将返回 null） */
      this.selectComponent('#wheel').begin()
  },
  // 抽奖完成后操作
  wheelSuccess() {
      /* 获得中奖区域的序号 */
      const index = this.data.award - 1
      console.log('bind:success', this.data.awardList[index])
      /* 显示消息提示框 */
      wx.showToast({
          title: `恭喜你获得${this.data.awardList[index].title}`,
          icon: 'none'
      })
  },
  // 切换模式
  switchMode(e) {
      const { type } = e.currentTarget.dataset
      this.setData({
          mode: type
      })
  },
  /* 转发*/
  /* 
      在页面的js文件中定义了 onShareAppMessage 函数时，页面可以表示改页面可以转发。可以在函数中设置页面转发的信息。

          1. 只有定义了该函数，小程序右上角的菜单中才会有转发按钮
          2. 用户点击转发按钮的时候回调用该函数
          3. 该函数内需要 return 一个 Object，Object中包含转发的信息（可自定义转发的内容）

  页面中有可以触发转发时间的地方有两个：
　　    1. 一个是右上角菜单中的转发按钮
　　    2. 另一个是页面中具有属性open-type且其值为share的button。（注：必须是button组件，其他组件中设置 open-type="share" 无效）
  */
  /* onShareAppMessage: function(ops) {
      return {
          title: '大转盘组件',
          path: '/pages/big-wheel/index'
      }
  } */
})