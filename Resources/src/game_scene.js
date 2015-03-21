var GameScene = cc.Scene.extend({
  ctor:function(models) {
    this._super();
    this.models = models;
    cc.associateWithNative(this, cc.Scene);
  },
  onEnter:function () {
    this._super();
    var layer = new GameLayer();
    this.addChild(layer);
    layer.init(this.models);
  },
  onExit:function() {
    this._super();
  }
});
