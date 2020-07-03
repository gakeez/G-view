Component({
  properties: {
      // 划分区域
      areaNumber: {
          type: Number,
          value: 6
      },
      // 中奖区域 从1开始
      awardNumer: {
          type: Number,
          value: 1
      },
      // 速度
      speed: {
          type: Number,
          value: 16
      },
      // 抽奖模式:1:盘转,2:指针旋转
      mode: {
          type: Number,
          value: 2,
          observer(newVal, oldVal) {
              // 切换模式的时候重置
              this.setData({
                  deg: 0
              })
          }
      }
  },
  data: {
      deg: 0,
      singleAngle: '', // 每片扇形的角度
      isStart: false
  },
  methods: {
      // 初始化转盘分区
      init() {
          let { areaNumber } = this.data
          const singleAngle = 360 / areaNumber
          this.setData({
              singleAngle: singleAngle
          })
      },
      // 点击开始抽奖
      start() {
          // 在对组件进行封装时 在当前页面想要获取组件中的某一状态，需要使用到this.triggerEvent(' ',{},{}),第一个参数是自定义事件名称，这个名称是在页面调用组件时bind的名称，第二个对象就可以将想要的属性拿到，第三个参数是事件选项
          // 让父组件监听start
          this.triggerEvent('start')
      },
      begin() {
          // 点击开始抽奖
          let { deg, awardNumer, singleAngle, speed, isStart, mode } = this.data
          /* 如果isStart为true，则表示正在抽奖，直接中断 */
          if (isStart) return
          // 执行前，用isStart上锁
          this.data.isStart = true
          let endAddAngle = 0
          if (mode == 2) {
              /* 因为走的方向是反的，所以最后要用360减去，获取纠正后的角度 */
              endAddAngle = 360 - ((awardNumer - 1) * singleAngle + singleAngle / 2) // 中奖角度
          } else {
              endAddAngle = (awardNumer - 1) * singleAngle + singleAngle / 2 // 中奖角度
          }
          const rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止
          console.log('中奖区域：'+awardNumer)
          console.log('中奖角度：'+endAddAngle)
          console.log('随机转圈总角度：'+rangeAngle)
          let cAngle
          deg = 0
          /* setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。etInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。 */
          this.timer = setInterval(() => {
              // 如果deg小于任意旋转的角度，则增加speed
              if (deg < rangeAngle) {
                  deg += speed
                  console.log('当前旋转角度：'+deg)
              } else {
                  /* deg大于任意旋转角度后，则开始减速 */
                  cAngle = (endAddAngle + rangeAngle - deg) / speed
                  console.log('cAngle：'+cAngle)
                  // 如果cAngle比原来的speed还快，就设置为speed；如果比speed慢，比1快就设置cAngle；如果比1慢则设为1
                  cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
                  console.log('cAngle：'+cAngle)
                  deg += cAngle
                  console.log('当前旋转角度：'+deg)
                  /* 如果旋转大于总旋转角度（中奖角度+随机转圈角度），则停止 */
                  if (deg >= endAddAngle + rangeAngle) {
                      /* 角度为中奖角度+随机转圈角度 */
                      deg = endAddAngle + rangeAngle
                      console.log('当前旋转角度：'+deg)
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
                  deg,
                  mode
              })
          }, 1000 / 60)
      }
  },

  //attached() 在组件实例进入页面节点树时执行
  attached() {
      this.init()
  }

  /* 
      页面和组件初始化执行顺序
      ①created（组件）> ②attached（组件）> ③onLoad（页面）> ④onShow（页面）> ⑤ready（组件）> ⑥onReady（页面） 
  */
})
