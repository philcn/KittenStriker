var MenuScene = cc.Scene.extend({
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Scene);
    var layer = MainMenu.create();
    this.addChild(layer, 1, 1);
  },
  onEnter:function() {
    this._super();
  }
});
