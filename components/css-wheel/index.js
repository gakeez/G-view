// components/css-wheel/index.js
Component({
  data: {
    deg: 0,
    singleAngle: 60, // 每片扇形的角度
    isStart: false,
    awardNumer: 1,
    speed: 16,
  },


  methods: {
    // 点击开始抽奖
    start() {
      // 设置奖项
      this.setData({
        /* Math.floor 返回小于或等于一个给定数字的最大整数 */
        /* Math.random 返回介于 0（包含） ~ 1（不包含） 之间的一个随机数： */
        awardNumer: Math.floor(Math.random() * 6) //生成1到6随机。注意：安全起见生成奖项应该由后端完成
      })

      this.roll();
    },

    // 滚动转盘
    roll() {
      let { deg, awardNumer, singleAngle, speed, isStart } = this.data;
      if (isStart) return
      // 执行前，用isStart上锁
      this.data.isStart = true
      let endAddAngle = 0
      /* 因为走的方向是反的，所以最后要用360减去，获取纠正后的角度 */
      endAddAngle = 360 - (awardNumer * singleAngle) // 中奖角度
      const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止
      let cAngle
      deg = 0
      /* setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。etInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。 */
      this.timer = setInterval(() => {
        // 如果deg小于任意旋转的角度，则增加speed
        if (deg < rangeAngle) {
          deg += speed
          console.log('当前旋转角度：' + deg)
        } else {
          /* deg大于任意旋转角度后，则开始减速 */
          cAngle = (endAddAngle + rangeAngle - deg) / speed
          console.log('cAngle：' + cAngle)
          // 如果cAngle比原来的speed还快，就设置为speed；如果比speed慢，比1快就设置cAngle；如果比1慢则设为1
          cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
          console.log('cAngle：' + cAngle)
          deg += cAngle
          console.log('当前旋转角度：' + deg)
          /* 如果旋转大于总旋转角度（中奖角度+随机转圈角度），则停止 */
          if (deg >= endAddAngle + rangeAngle) {
            /* 角度为中奖角度+随机转圈角度 */
            deg = endAddAngle + rangeAngle
            console.log('当前旋转角度：' + deg)
            // 解锁
            this.data.isStart = false
            // 终止setInterval()
            clearInterval(this.timer)
            // 触发成功的函数
            this.triggerEvent('success')
          }
        }
        this.setData({
          singleAngle,
          deg
        })
      }, 1000 / 60)
    }
  }
})