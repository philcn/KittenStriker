var EnergyStar = cc.Sprite.extend({
  active:true,
  collected:false,
  speed:300,
  ctor:function() {
    this._super();
    this.initWithSpriteFrameName("energy_star_1.png");
    var animFrames = [];
    for (var i = 1; i <= 2; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("energy_star_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/4);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
    this.born();
  },
  update:function(dt) {
    if (this.collected) {
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
    g_sharedAudioManager.playStarEffect();
    this.collected = true;
    g_sharedGameLayer.gainEnergy();
    this.destroy();
    this.born();
  },
  collideRect:function(p) {
    var cs = this.getContentSize();
    return cc.rect(p.x - cs.width / 2, p.y - cs.height / 2, cs.width, cs.height);
  },
  born:function() {
    this.collected = false;
  }
});

EnergyStar.getOrCreate = function() {
  var star;
  for (var j = 0; j < KS.CONTAINER.STARS.length; j++) {
    star = KS.CONTAINER.STARS[j];
    if (!star.active) {
      star.active = true;
      star.setVisible(true);
      return star;
    }
  }
  star = EnergyStar.create();
  return star;
};

EnergyStar.create = function() {
  var star = new EnergyStar();
  g_sharedGameLayer.addStar(star);
  KS.CONTAINER.STARS.push(star);
  return star;
};

EnergyStar.preSet = function() {
  var star;
  for (var i = 0; i < 2; i++) {
    star = EnergyStar.create();
    star.setVisible(false);
    star.active = false;
  }
};

