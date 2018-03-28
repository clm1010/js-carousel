;(function($) {

  // 定义构造函数
  var Carousel = function(poster) {
    var self = this;
    // 保存单个实例对象
    this.poster = poster;
    // 保存ul.poster-list
    this.posterItemMain = poster.find("ul.poster-list");
    // 保存上一张
    this.prevBtn = poster.find("div.poster-prev-btn");
    // 保存下一张
    this.nextBtn = poster.find("div.poster-next-btn");
    //保存幻灯片的个数
    this.posterItems = poster.find("li.poster-item");

    // 判断图片奇偶设置
    // 如果是偶数那么就将第一张图片复制插入posterItemMain
    if(this.posterItems.length % 2 === 0){
      this.posterItemMain.append(this.posterItems.first().clone());
      this.posterItems = this.posterItemMain.children();
    }

    // 保存图片第一帧位置
    this.posterFirstItem = this.posterItems.first();
    // 保存图片最后一帧位置
    this.posterLastItem = this.posterItems.last();
    // 旋转标识解决点击过快bug
    this.rotateFlag = true;

    // 默认配置参数
    this.setting = {
      "width": 1000, //幻灯片宽度
      "height": 270, //幻灯片高度
      "posterWidth": 640, //幻灯片第一帧宽度
      "posterHeight": 270, //幻灯片第一帧高度
      "scale": 0.9, //比例
      "speed": 500, //速度,
      "autoPlay":false, //自动播放
      "delay":5000,// 播放的间隔时间
      "verticalAlign": "middle" //垂直对齐方式 top bottom
    };
    // $.extend 合并扩展对象
    $.extend(this.setting, this.getSetting());

    // console.log(this.setting);

    // 设置配置参数值
    this.setSettingValue();

    // 设置剩余帧的位置关系
    this.setPosterPost();

    // 绑定切换上一个事件
    this.prevBtn.click(function(event) {
      event.preventDefault();
      event.stopPropagation();

      if(self.rotateFlag){
        self.rotateFlag = false;
        self.carouselRotate("right");
      }
    });

    // 绑定切换下一个事件
    this.nextBtn.click(function(event) {
      event.preventDefault();
      event.stopPropagation();

      if(self.rotateFlag){
        self.rotateFlag = false;
        self.carouselRotate("left");
      }
    });

    // 是否开启自动播放
    if(this.setting.autoPlay){
      this.autoPlay();
      // 绑定移入移出事件
      this.poster.hover(
        function(){
          window.clearInterval(self.timer);
        },function(){
          self.autoPlay();
        });
    }
  };

  // Carousel原型扩展属性
  Carousel.prototype = {
    // 设置自动播放
    autoPlay:function(){
      var self = this;
      this.timer = window.setInterval(function(){
        self.nextBtn.click();
      },this.setting.delay);
    },

    // 设置旋转
    carouselRotate: function(dir) {
      var _this_ = this;
      var zIndexArr = [];
      if (dir === "left") {
        this.posterItems.each(function() {
          // 保存当前
          var self = $(this);
          var prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem;
          var width = prev.width();
          var height = prev.height();
          var zIndex = prev.css("zIndex");
          var opacity = prev.css("opacity");
          var left = prev.css("left");
          var top = prev.css("top");
          zIndexArr.push(zIndex);

          self.animate({
            width: width,
            height: height,
            opacity: opacity,
            left: left,
            top: top
          },_this_.setting.speed,function(){
              _this_.rotateFlag = true;
          });

        });

        // 循环设置ZIndex
        this.posterItems.each(function(i) {
          $(this).css("zIndex",zIndexArr[i]);
        });
      } else if (dir === "right") {
        this.posterItems.each(function() {
          // 保存当前
          var self = $(this);
          var next = self.next().get(0) ? self.next() : _this_.posterFirstItem;
          var width = next.width();
          var height = next.height();
          var zIndex = next.css("zIndex");
          var opacity = next.css("opacity");
          var left = next.css("left");
          var top = next.css("top");
          zIndexArr.push(zIndex);

          self.animate({
            width: width,
            height: height,
            opacity: opacity,
            left: left,
            top: top
          },_this_.setting.speed,function(){
            _this_.rotateFlag = true;
          });

        });

        // 循环设置ZIndex
        this.posterItems.each(function(i) {
          $(this).css("zIndex",zIndexArr[i]);
        });
      }
    },

    // 设置剩余帧的位置关系
    setPosterPost: function() {
      var self = this;

      var sliceItems = this.posterItems.slice(1);
      var sliceSize = sliceItems.length / 2;
      var rightSlice = sliceItems.slice(0, sliceSize);
      var level = Math.floor(this.posterItems.length / 2);
      var leftSlice = sliceItems.slice(sliceSize);

      var rw = this.setting.posterWidth;
      var rh = this.setting.posterHeight;
      var gap = ((this.setting.width - this.setting.posterWidth) / 2) / level;
      var firstLeft = (this.setting.width - this.setting.posterWidth) / 2;
      // 变化的left值
      var fixOffsetLeft = firstLeft + rw;
      // 设置右边帧的位置关系和宽度高度top
      rightSlice.each(function(i) {
        level--;
        rw = rw * self.setting.scale;
        rh = rh * self.setting.scale;
        var j = i;
        $(this).css({
          zIndex: level,
          width: rw,
          height: rh,
          opacity: 1 / (++i),
          left: fixOffsetLeft + (++j) * gap - rw,
          top: self.setVerticalAlign(rh)
        })
      });

      var lw = rightSlice.last().width();
      var lh = rightSlice.last().height();
      var oloop = Math.floor(this.posterItems.length / 2);
      // 设置左边帧的位置关系和宽度高度top
      leftSlice.each(function(i) {
        $(this).css({
          zIndex: i,
          width: lw,
          height: lh,
          opacity: 1 / oloop,
          left: i * gap,
          top: self.setVerticalAlign(lh)
        });

        lw = lw / self.setting.scale;
        lh = lh / self.setting.scale;
        oloop--;
      });
    },

    // 设置垂直排列对齐
    setVerticalAlign: function(height) {
      // 保存垂直对齐
      var verticalType = this.setting.verticalAlign;
      var top = 0;
      if (verticalType === "middle") {
        top = (this.setting.height - height) / 2;
      } else if (verticalType === "top") {
        top = 0;
      } else if (verticalType === "bottom") {
        top = this.setting.height - height;
      } else {
        top = (this.setting.height - height) / 2;
      }
      return top;
    },

    //设置配置参数值去控制基本的宽度高度
    setSettingValue: function() {
      this.poster.css({width: this.setting.width, height: this.setting.height});
      this.posterItemMain.css({width: this.setting.width, height: this.setting.height});
      //计算上下切换按钮的宽度
      var prev_next_Width = (this.setting.width - this.setting.posterWidth) / 2;
      this.prevBtn.css({
        width: prev_next_Width,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2) //取整数
      });
      this.nextBtn.css({
        width: prev_next_Width,
        height: this.setting.height,
        zIndex: Math.ceil(this.posterItems.length / 2) //取整数
      });
      // 设置第一帧图片左右left和right值
      // 第一帧设置z-index 所有帧数的大小 / 2 向下取舍
      this.posterFirstItem.css({
        width: this.setting.posterWidth,
        height: this.setting.posterHeight,
        left: prev_next_Width,
        zIndex: Math.floor(this.posterItems.length / 2) //向下取舍
      });
    },
    // 获取人工配置参数
    getSetting: function() {
      var setting = this.poster.attr('data-setting');

      if (setting && setting !== "") {
        // 转换JSON对象
        return $.parseJSON(setting);
      } else {
        return {};
      }
    }
  };

  // 初始化
  // 循环new对象
  //当前this就是Carousel
  Carousel.init = function(posters) {
    var _this_ = this;
    posters.each(function(index, element) {
      // 这里的this就是posters中的每一个,这里也可以用element
      // 将this包装成jquery对象
      // new _this_($(element));
      new _this_($(this));
    })
  }

  //注册到全局
  window.Carousel = Carousel;

})(jQuery);
