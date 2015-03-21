var Shield = cc.Sprite.extend({
  ctor:function() {
    this._super();
    this.initWithSpriteFrameName("shield_1.png");
    var animFrames = [];
    for (var i = 1; i <= 30; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("shield_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/10);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
  }
});

