var Coin = cc.Sprite.extend({
  active:true,
  collected:false,
  scrolling:true,
  speed:300,
  ctor:function() {
    this._super();
    this.initWithSpriteFrameName("coin_1.png");
    var animFrames = [];
    for (var i = 1; i <= 7; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("coin_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/15);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
    this.born();
  },
  update:function(dt) {
    if (this.collected || !this.scrolling) {
      return;
    }
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
  collect:function() {
    if (this.collected) {
      return;
    }
    g_sharedAudioManager.playCoinEffect();
    this.collected = true;
    var duration = 0.8 / g_speedFactor * (g_sharedGameLayer._feverMode ? 2 : 1);
    var moveAction = cc.MoveTo.create(duration, cc.p(40, 1136 - 100));
    var easeMoveAction = cc.EaseOut.create(moveAction, 2.0);
    var scaleAction = cc.ScaleTo.create(duration, 1.25);
    var fadeAction = cc.FadeOut.create(duration);
    var easeFadeAction = cc.EaseOut.create(fadeAction, 8.0);
    var action = cc.Spawn.create(easeMoveAction, scaleAction);//, easeFadeAction);
    var callFunc = cc.CallFunc.create(this.afterCollect);
    var sequence = cc.Sequence.create(action, callFunc);
    this.runAction(sequence);
  },
  afterCollect:function(sender) {
    g_sharedGameManager.collectCoin();
    sender.destroy();
    sender.born();
  },
  collideRect:function(p) {
    var cs = this.getContentSize();
    return cc.rect(p.x - cs.width / 2, p.y - cs.height / 2, cs.width, cs.height);
  },
  born:function() {
    this.setPosition(0, 0);
    this.setScale(1);
    this.setOpacity(255);
    this.collected = false;
  },
  setScrolling:function() {
    this.scrolling = true;
  }
});

Coin.getOrCreate = function() {
  var coin;
  for (var j = 0; j < KS.CONTAINER.COINS.length; j++) {
    coin = KS.CONTAINER.COINS[j];
    if (!coin.active) {
      coin.active = true;
      coin.setVisible(true);
      return coin;
    }
  }
  coin = Coin.create();
  return coin;
};

Coin.create = function() {
//cc.log("CREATE COIN");
  var coin = new Coin();
  g_sharedGameLayer.addCoin(coin);
  KS.CONTAINER.COINS.push(coin);
  return coin;
};

Coin.preSet = function() {
  var coin;
  for (var i = 0; i < 30; i++) {
    coin = Coin.create();
    coin.setVisible(false);
    coin.active = false;
  }
};

