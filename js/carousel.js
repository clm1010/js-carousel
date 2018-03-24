;
(function($) {

  // 定义构造函数
  var Carousel = function(poster) {
    // 保存单个实例对象
    this.poster = poster;
    // 保存ul.poster-list
    this.posterItemMain = poster.find("ul.poster-list");
    // 保存上一张
    this.prevBtn = poster.find("div.poster-prev-btn");
    // 保存下一张
    this.nextBtn = poster.find("div.poster-next-btn");
    // 保存图片第一帧位置
    this.posterFirstItem = this.posterItemMain.find("li").first();
    console.log(this.posterFirstItem);

    // 默认配置参数
    this.setting = {
      "width": 1000, //幻灯片宽度
      "height": 270, //幻灯片高度
      "posterWidth": 640, //幻灯片第一帧宽度
      "posterHeight": 270, //幻灯片第一帧高度
      "scale": 0.9, //透明度
      "speed": 500, //速度
      "verticalAlign": "middle" //居中方式
    };
    // $.extend 合并扩展对象
    $.extend(this.setting, this.getSetting());

    // console.log(this.setting);

    // 设置配置参数值
    this.setSettingValue();
  };

  // Carousel原型扩展属性
  Carousel.prototype = {
    //设置配置参数值去控制基本的宽度高度
    setSettingValue: function() {
      this.poster.css({
        width: this.setting.width,
        height: this.setting.height
      });
      this.posterItemMain.css({
        width: this.setting.width,
        height: this.setting.height
      });
      //计算上下切换按钮的宽度
      var prev_next_Width = (this.setting.width - this.setting.posterWidth) / 2;
      this.prevBtn.css({
        width: prev_next_Width,
        height:this.setting.height
      });
      this.nextBtn.css({
        width: prev_next_Width,
        height:this.setting.height
      });
      // 设置第一帧图片左右left和right值
      this.posterFirstItem.css({
        left:prev_next_Width
      });
    },
    // 获取人工配置参数
    getSetting: function() {
      // console.log(this);
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
