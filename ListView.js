/*
 * ListView
 * 功能：生成列表、上拉刷新、下拉刷新
 */

var ListView = function ( opts ) {
  this.canUpdate      = false;
  this.isLoading      = false;
  this.pullDownOffset = opts.offset;     // 上拉刷新的距离
  this.$containter    = opts.containter; // 渲染的容器
  this.itemList       = opts.itemList;   // 列表数据源
  this.renderTpl      = opts.renderTpl || '';
  this.renderNoTpl    = opts.renderNoTpl || '';
  this.callback       = opts.callback;
  this.init();
}

ListView.prototype = {
  TIP_MAP: {
    ready: '松开刷新',
    pulling: '下拉刷新',
    onLoading: '正在加载...',
    loaded: '加载完成'
  },

  // 初始化组件，
  init: function () {
    this.initPullElement();
    this.renderString();
    this.render();
    this.bindTouchEvent();
  },

  // 生成下拉提示框
  initPullElement: function () {
    this.$containter.prepend('<div class="pulling-tip">下拉刷新</div>')
  },

  // 创建视图模板
  renderString: function () {
    var string = '<ul class="item-list">';
    $.each(this.itemList, function ( index, item ) {
      string += '<li>' + item + '-item' + '</li>';
    });
    string += '</ul>';
    this.willRenderString = string;
  },

  render: function () {
    $(this.$containter).append( this.willRenderString );
  },

  bindTouchEvent: function () {
    var that = this;
    var touchStartY = 0;
    // 1、第一次点击的时候，记录此时的坐标位置
    this.$containter.on('touchstart', function ( e ) {
      touchStartY = e.touches[0].clientY;
    }).on('touchmove', function ( e ) {
      // 2、当移动的时候，计算移动的点距离初始点位置的高度差
      var touchMoveY = e.touches[0].clientY;
      var diffY = touchMoveY - touchStartY;
      // 3、如果高度差小于0，或者当前视图在卷动范围内，则什么也不做
      if ( diffY <= 0 || $(window).scrollTop() !== 0 ) return;
      // 4、如果高度差大于0，当大于指定的偏移高度时，是可以加载状态，为ready，
      // 其余状态是正在pulling状态
      that.pullStatus = diffY > that.pullDownOffset ? 'ready' : 'pulling';
      // 5、滑动的同时更新视图状态
      that.updateView( diffY );
    }).on('touchend', function ( e ) {
      // 6、当手指离开屏幕时，如果状态为ready，则触发相应回调
      if ( that.pullStatus === 'ready' ) {
        that.pullStatus = 'onLoading';
        // 如果拉动过大，则缓慢收起
        that.$containter.addClass('transition');
        that.updateView( that.pullDownOffset ).refresh();
      // 7、如果状态不是ready，则收起提示区
      } else {
        that.hidePullTip();
      }
    // 动画结束之后，移除动画属性，回到初始状态
    }).on('webkitTransitionEnd', function ( e ) {
      $(e.currentTarget).removeClass('transition');
    });
  },

  // 加载内容
  refresh: function () {
    var timer = null;
    var that = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      that.callback();
      // ajax成功回调后执行
      that.hidePullTip( true );
    }, 1000);
    return this;
  },

  // isAfterRefresh
  hidePullTip: function ( isAfterRefresh ) {
    var timer = null;
    var that = this;
    if ( isAfterRefresh ) {
      this.pullStatus = 'loaded';
      this.$containter.addClass('transition').find('.pulling-tip').text(this._getPullingTip(this.pullStatus));
      clearTimeout(timer);
      timer = setTimeout(function () {
        that.updateView(0);
      }, 500);
    } else {
      this.updateView(0);
    }
  },

  // 更新滚动视图
  updateView: function ( dis ) {
    var $tip = this.$containter.find('.pulling-tip');
    var tip = this._getPullingTip();
    // 提示文字居中显示
    $tip.text( tip ).css({height: dis + 'px', lineHeight: dis + 'px', top: -dis + 'px'});
    this.$containter.css('transform', 'translateY(' + dis + 'px)');
    return this;
  },

  // 获取提示文字
  _getPullingTip: function () {
    return this.TIP_MAP[ this.pullStatus ];
  },

  consturctor: ListView
}
