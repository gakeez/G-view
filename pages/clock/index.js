// pages/clock/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.createSelectorQuery(): 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。
    const query = wx.createSelectorQuery();
    
    query.select('#clock') // 在当前页面下选择第一个匹配选择器 selector 的节点。返回一个 NodesRef 对象实例，可以用于获取节点信息。
      .fields({ node: true, size: true }) // 获取节点的相关信息。需要获取的字段在fields中指定。返回值是 nodesRef 对应的 selectorQuery。node：是否返回节点对应的 Node 实例；size：是否返回节点尺寸（width height）
      .exec((res) => { // 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
        const canvas = res[0].node // 获取 Node 节点实例。目前支持 Canvas 的获取。
        const ctx = canvas.getContext('2d') // 该方法返回 Canvas 的绘图上下文
        canvas.width = res[0].width // 设置画布的宽度
        canvas.height = res[0].height // 设置画布的高度
        const r = canvas.width / 2; //设置半径
        const rem = canvas.width / 200; // 设置尺寸比例。以后缩小或者放大都可以自适应显示
        this.draw(ctx, r, rem, res[0].width, res[0].height); // 第一次要先主动生成指针，不然计时器会慢一秒生成
        // 每隔一秒生成一次指针
        setInterval(this.draw, 1000, ctx, r, rem, res[0].width, res[0].height);
      })
  },

  /* 
    生成时钟的背景
  */
  drawBackground(ctx, r, rem) {
    ctx.save();
    ctx.translate(r, r);//把坐标原点设置到中心
    ctx.beginPath(); //开始创建路径
    ctx.lineWidth = 5 * rem; //定义路径的宽度（type="2d"时直接赋值，否则ctx.lineWidth(5)）
    ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2*Math.PI, false) //画圆
    ctx.stroke(); // 画出当前路径的边框。默认颜色色为黑色

    const hourNumbers = [3, 4 ,5 ,6 ,7 ,8 ,9 ,10, 11 ,12, 1, 2]; //设置时钟数字
    ctx.font = 18 * rem + 'px Arial'; // 设置字体样式
    ctx.textAlign = 'center'; // 设置文字的对齐
    ctx.textBaseline = 'middle'; // 设置文字的竖直对齐
    // 遍历小时数，设置位置
    hourNumbers.forEach((number, i) => {
      let rad = 2 * Math.PI / 12 * i; //计算弧度
      let x = Math.cos(rad) * (r - 30 * rem); // 计算x轴坐标
      let y = Math.sin(rad) * (r - 30 * rem); // 计算y轴坐标
      ctx.fillText(number, x, y); // 在画布上绘制被填充的文本
    })

    // 绘制分钟的点
    for (let i = 0; i < 60; i++){
      let rad = 2 * Math.PI / 60 * i;
      let x = Math.cos(rad) * (r - 15 * rem);
      let y = Math.sin(rad) * (r - 15 * rem); 
      ctx.beginPath();
      // 如果是整点的点是黑色，否则为灰色
      if (i % 5 === 0){
        ctx.fillStyle = '#000';
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
      }else{
        ctx.fillStyle = '#ccc';
        ctx.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
      };
      ctx.fill(); //实心的点
    }
  },

  /* 
    时针
  */
 drawHour(ctx, r, hour, minute, rem) {
  ctx.save(); // 保存绘图上下文
  ctx.beginPath();
  let rad = 2 * Math.PI / 12 * hour; // 计算当前时针弧度
  let mrad = 2 * Math.PI / 12 / 60 * minute; // 计算当前时针弧度的偏移
  ctx.rotate(rad + mrad); // 旋转时针
  ctx.lineWidth = 6 * rem;
  ctx.lineCap = 'round'; // 设置线条的端点样式
  ctx.moveTo(0, 10 * rem); // 把路径移动到画布中的指定点，不创建线条。用 stroke 方法来画线条
  ctx.lineTo(0, -r / 2); // 增加一个新点，然后创建一条从上次指定点到目标点的线。用 stroke 方法来画线条
  ctx.stroke();
  ctx.restore(); // 恢复之前保存的绘图上下文
 },

 /* 
    分针
  */
 drawMinute(ctx, r, minute, rem) {
  ctx.save();
  ctx.beginPath();
  let rad = 2 * Math.PI / 60 * minute; // 计算当前时针弧度
  ctx.rotate(rad); // 旋转时针
  ctx.lineWidth = 3 * rem;
  ctx.lineCap = 'round'; // 设置线条的端点样式
  ctx.moveTo(0, 10 * rem); // 把路径移动到画布中的指定点，不创建线条。用 stroke 方法来画线条
  ctx.lineTo(0, -r + 30 * rem); // 增加一个新点，然后创建一条从上次指定点到目标点的线。用 stroke 方法来画线条
  ctx.stroke();
  ctx.restore();
 },

 /* 
    秒针
  */
 drawSecond(ctx, r, second, rem) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = '#c14543' // 设置颜色
  let rad = 2 * Math.PI / 60 * second; // 计算当前时针弧度
  ctx.rotate(rad); // 旋转时针
  ctx.moveTo(-2 * rem, 20 * rem); // 把路径移动到画布中的指定点，不创建线条。用 stroke 方法来画线条
  // 画粗一根针
  ctx.lineTo(2 * rem, 20 * rem);
  ctx.lineTo(1, -r + 18 * rem);
  ctx.lineTo(-1, -r + 18 * rem);
  ctx.fill();
  ctx.restore();
 },

 /* 
  中间圆点
 */
 drawDot(ctx) {
   ctx.beginPath();
   ctx.fillStyle = '#fff';
   ctx.arc(0, 0, 3, 0, 2 * Math.PI, false);
   ctx.fill();
 },

 /* 
  生成指针
 */
 draw (ctx, r, rem, width, height) {
   // 每次生成都要清楚上次留下的内容
   ctx.clearRect(0, 0, width, height)// 清除画布上在该矩形区域内的内容
   // 获取时间
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds(); 

  this.drawBackground(ctx, r, rem); // 生成背景
  // 生成指针
  this.drawHour(ctx, r, hour, minute, rem);
  this.drawMinute(ctx, r, minute, rem);
  this.drawSecond(ctx, r, second, rem);
  this.drawDot(ctx); // 生成圆点
  ctx.restore();
 }
})