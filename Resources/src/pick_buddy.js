var PickBuddy = cc.Sprite.extend({
  appearPosition:cc.p(320, 1200),
  speed:300,
  active:true,
  ctor:function() {
    this._super();
    this.initWithSpriteFrameName("pick_buddy_1.png");
    this.setPosition(this.appearPosition);
    var animFrames = [];
    for (var i = 1; i <= 8; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("pick_buddy_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 0.3/8);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
    this.born();
  },
  update:function(dt) {
    var p = this.getPosition();
    p.y -= this.speed * dt * g_speedFactor;
    this.setPosition(p);
    if (p.y + this.getContentSize().height < 0) {
      this.destroy();
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
  },
  pick:function() {
    this.destroy();
    g_sharedAudioManager.playPickBuddyEffect();
    g_sharedGameLayer.pickBuddy();
  },
  collideRect:function(p) {
    var a = this.getContentSize();
    return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
  },
  born:function() {
    this.setPosition(this.appearPosition);
  }
});

PickBuddy.getOrCreate = function() {
  var b;
  for (var j = 0; j < KS.CONTAINER.PICK_BUDDIES.length; j++) {
    b = KS.CONTAINER.PICK_BUDDIES[j];
    if (!b.active) {
      b.active = true;
      b.setVisible(true);
      b.born();
      return b;
    }
  }
  b = PickBuddy.create();
  return b;
};

PickBuddy.create = function() {
  var b = new PickBuddy();
  g_sharedGameLayer.addPickBuddy(b);
  KS.CONTAINER.PICK_BUDDIES.push(b);
  return b;
};

PickBuddy.preSet = function() {
  var b;
  for (var i = 0; i < 1; i++) {
    b = PickBuddy.create();
    b.setVisible(false);
    b.active = false;
  }
};

