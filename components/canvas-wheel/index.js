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
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      // createSelectorQuery(): 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。
      const query = this.createSelectorQuery();
      query.select('#wheel') // 在当前页面下选择第一个匹配选择器 selector 的节点。返回一个 NodesRef 对象实例，可以用于获取节点信息。
        .fields({ node: true, size: true }) // 获取节点的相关信息。需要获取的字段在fields中指定。返回值是 nodesRef 对应的 selectorQuery。node：是否返回节点对应的 Node 实例；size：是否返回节点尺寸（width height）
        .exec((res) => { // 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
          const canvas = res[0].node // 获取 Node 节点实例。目前支持 Canvas 的获取。
          const ctx = canvas.getContext('2d') // 该方法返回 Canvas 的绘图上下文
          canvas.width = res[0].width // 设置画布的宽度
          canvas.height = res[0].height // 设置画布的高度
          const r = canvas.width / 2; //设置半径
          const rem = canvas.width / 200; // 设置尺寸比例。以后缩小或者放大都可以自适应显示

          this.drawOuterRing(ctx, r, rem);
          this.drawTurnplate(ctx, r, rem, res[0].width, res[0].height);
          this.drawPointer(ctx, r, rem);
        })
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
      //计算每个奖项所占角度数
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
        ctx.beginPath();
        //ctx.translate(r, r);
        ctx.rotate(angle + 30);
        ctx.font = '16px Microsoft YaHei';
        ctx.fillStyle = '#fff';
        ctx.fillText('点击', r - 44 * rem, angle + baseAngle);
        ctx.restore();
        ctx.save();//保存当前环境的状态
      }
      ctx.restore();
    },

    drawPointer(ctx, r, rem) {
      ctx.save();
      ctx.beginPath();
      ctx.rotate(20 * Math.PI / 180)
      ctx.fillStyle = '#ffa500';
      ctx.moveTo(-14 * rem, 0);
      ctx.lineTo(14 * rem, 0);
      ctx.lineTo(0, -r + 70 * rem);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 18 * rem, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.beginPath();
      ctx.font = '16px Microsoft YaHei';
      ctx.fillStyle = '#fff';
      ctx.fillText('点击', -16, -5);
      ctx.fillText('抽奖', -16, 12);
      ctx.restore();
    },
  }
})
