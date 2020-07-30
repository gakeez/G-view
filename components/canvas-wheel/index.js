// components/svg-wheel/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    colors: ["#AE3EFF", "#4D3FFF", "#FC262C", "#3A8BFF", "#EE7602", "#FE339F"],
    title: ['三等奖', '四等奖', '五等奖', '六等奖', '一等奖', '二等奖'],
    isStart: false,
    singleAngle: 60,
    speed: 16,
    awardNumer: 1,
    deg: 0
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // createSelectorQuery(): 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。
      const query = this.createSelectorQuery();
      query.select('#wheel') // 在当前页面下选择第一个匹配选择器 selector 的节点。返回一个 NodesRef 对象实例，可以用于获取节点信息。
        .fields({ node: true, size: true }) // 获取节点的相关信息。需要获取的字段在fields中指定。返回值是 nodesRef 对应的 selectorQuery。node：是否返回节点对应的 Node 实例；size：是否返回节点尺寸（width height）
        .exec((res) => { // 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
          // const canvas = res[0].node // 获取 Node 节点实例。目前支持 Canvas 的获取。
          // const ctx = canvas.getContext('2d') // 该方法返回 Canvas 的绘图上下文
          // canvas.width = res[0].width // 设置画布的宽度
          // canvas.height = res[0].height // 设置画布的高度
          // const r = canvas.width / 2; //设置半径
          // const rem = canvas.width / 200; // 设置尺寸比例。以后缩小或者放大都可以自适应显示

          this.draw(res);

          // this.drawOuterRing(ctx, r, rem);
          // this.drawTurnplate(ctx, r, rem, res[0].width, res[0].height);
          // this.drawPrize(ctx, r, rem);
          // this.drawPointer(ctx, r, rem);
        });

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 画外环
     * @param {上下文} ctx 
     * @param {半径} r 
     * @param {尺寸比例} rem 
     */
    drawOuterRing(ctx, r, rem) {
      ctx.save();
      ctx.translate(r, r);//把坐标原点设置到中心
      ctx.beginPath(); //开始创建路径
      ctx.strokeStyle = '#ffa500'
      ctx.lineWidth = 14 * rem; //定义路径的宽度（type="2d"时直接赋值，否则ctx.lineWidth(5)）
      ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI, false) //画圆
      ctx.stroke(); // 画出当前路径的边框。默认颜色色为黑色
      //ctx.restore();
    },

    /**
     * 画转盘
     * @param {上下文} ctx 
     * @param {半径} r 
     * @param {尺寸比例} rem 
     */
    drawTurnplate(ctx, r, rem) {
      let { colors } = this.data;
      //计算每个奖项所占弧度数
      let baseAngle = Math.PI * 2 / 6;
      ctx.save();
      //ctx.translate(r, r);//把坐标原点设置到中心
      //ctx.font = '26px Microsoft YaHei';//设置字号字体
      for (let index = 0; index < 6; index++) {
        let angle = index * baseAngle;
        ctx.fillStyle = colors[index];//设置每个扇形区域的颜色
        ctx.beginPath();//开始绘制
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r - 14 * rem, angle, angle + baseAngle, false);
        ctx.fill();//填充颜色
      }
      ctx.restore();
    },

    /**
     * 画扇形区域
     * @param {上下文} ctx 
     * @param {半径} r 
     * @param {比例} rem 
     */
    drawPrize(ctx, r, rem) {
      //计算每个奖项所占角度数
      let baseAngle = Math.PI / 6;
      let { title } = this.data;
      ctx.save();
      for (let index = 0; index < 6; index++) {
        let angle = (2 * index + 1) * baseAngle;
        ctx.beginPath();
        ctx.font = '16px Microsoft YaHei';
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        let x = Math.cos(angle) * (r - 44 * rem); // 计算x轴坐标
        let y = Math.sin(angle) * (r - 44 * rem); // 计算y轴坐标
        ctx.fillText(title[index], x, y);
      }
      ctx.restore();
    },

    /**
     * 画指针
     * @param {上下文} ctx 
     * @param {半径} r 
     * @param {尺寸比例} rem 
     * @param {当前旋转角度} deg
     */
    drawPointer(ctx, r, rem, deg) {
      ctx.save();
      ctx.beginPath();
      ctx.rotate(deg)
      ctx.fillStyle = '#ffa500';
      ctx.moveTo(-14 * rem, 0);
      ctx.lineTo(14 * rem, 0);
      ctx.lineTo(0, -r + 70 * rem);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 20 * rem, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      ctx.font = '16px Microsoft YaHei';
      ctx.fillStyle = '#fff';
      ctx.fillText('点击', -16, -5);
      ctx.fillText('抽奖', -16, 12);
      ctx.restore();
    },

    draw(res, deg = 0) {
      const canvas = res[0].node // 获取 Node 节点实例。目前支持 Canvas 的获取。
      const ctx = canvas.getContext('2d') // 该方法返回 Canvas 的绘图上下文
      canvas.width = res[0].width // 设置画布的宽度
      canvas.height = res[0].height // 设置画布的高度
      const r = canvas.width / 2; //设置半径
      const rem = canvas.width / 200; // 设置尺寸比例。以后缩小或者放大都可以自适应显示
      ctx.clearRect(0, 0, res[0].width, res[0].height)// 清除画布上在该矩形区域内的内容
      this.drawOuterRing(ctx, r, rem);
      this.drawTurnplate(ctx, r, rem, res[0].width, res[0].height);
      this.drawPrize(ctx, r, rem);
      this.drawPointer(ctx, r, rem, deg);
    },

    /**
     * 用户点击
     * @param {对象} event 
     */
    start(event) {
      let { award } = this.data;
      // 获得点击时的坐标
      let x = event.changedTouches[0].x;
      let y = event.changedTouches[0].y;
      let min_x, max_x, min_y, max_y;
      const query = this.createSelectorQuery();
      query.select('#wheel')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const r = canvas.width / 2;
          const rem = canvas.width / 200;

          // 中间点击抽奖按钮的半径是20，但是为了用户更容易点击，故而点击时间范围设大了一点（32+32）
          let cr = 32;
          min_x = res[0].width / 2 - cr; // 最小x轴
          max_x = res[0].width / 2 + cr; // 最大x轴
          min_y = res[0].height / 2 - cr; // 最小y轴
          max_y = res[0].height / 2 + cr; // 最大y轴\
          // 判断用户点击坐标，坐标在点击抽奖按钮的坐标内时触发旋转
          if (x > min_x && x < max_x && y > min_y && y < max_y) {
            this.setData({
              /* Math.floor 返回小于或等于一个给定数字的最大整数 */
              /* Math.random 返回介于 0（包含） ~ 1（不包含） 之间的一个随机数： */
              awardNumer: Math.floor(Math.random() * 6) //生成1到6随机。注意：安全起见生成奖项应该由后端完成
            })
            this.turn(res);
          }
        });
    },

    /**
     * 旋转转盘
     * @param {canvas对象} res 
     */
    turn(res) {
      let { deg, awardNumer, singleAngle, speed, isStart, title } = this.data;
      if (isStart) return
      // 执行前，用isStart上锁
      this.data.isStart = true;
      let endAddAngle = 0;
      let cAngle;
      endAddAngle = awardNumer * singleAngle + (2 * singleAngle); // 中奖角度
      let rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止
      this.timer = setInterval(() => {
        // 如果deg小于任意旋转的角度，则增加speed
        if (deg < rangeAngle) {
          deg += speed;
        } else {
          /* deg大于任意旋转角度后，则开始减速 */
          cAngle = (endAddAngle + rangeAngle - deg) / speed;
          // 如果cAngle比原来的speed还快，就设置为speed；如果比speed慢，比1快就设置cAngle；如果比1慢则设为1
          cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
          deg += cAngle
          /* 如果旋转大于总旋转角度（中奖角度+随机转圈角度），则停止 */
          if (deg >= endAddAngle + rangeAngle) {
            /* 角度为中奖角度+随机转圈角度 */
            deg = endAddAngle + rangeAngle;
            // 解锁
            this.data.isStart = false;
            // 终止setInterval()
            clearInterval(this.timer);
            console.log(title[awardNumer]);
            // 弹窗
            wx.showToast({
              title: `恭喜你获得${title[awardNumer]}`,
              icon: 'none'
            })
          }
        };
        // 把度数转为弧度再传值
        this.draw(res, deg * Math.PI / 180)
      }, 1000 / 60);
    }
  }
})
