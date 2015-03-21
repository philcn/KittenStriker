var DetailPopup = cc.Layer.extend({
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.initContainer();

    return true;
  },
  initContainer:function() {
    var container = cc.Sprite.create('res/menu_detail_popup_container.png');
    this.addChild(container, 0, 1);
    container.setPosition(winSize.width / 2, winSize.height / 2);
  }
});

DetailPopup.create = function() {
  var layer = new DetailPopup();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

