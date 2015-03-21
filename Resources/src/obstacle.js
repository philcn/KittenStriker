var Obstacle = cc.Sprite.extend({
  appearPosition:cc.p(320, 1200),
  type:1,
  speed:300,
  active:true,
  ctor:function(type) {
    this._super();
    this.type = type;
    this.initWithSpriteFrameName("obstacle" + type + "_1.png");
    this.setPosition(this.appearPosition);
    var animFrames = [];
    for (var i = 1; i <= 2; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("obstacle" + type + 
          "_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/4);
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
    if (g_sharedGameLayer._feverMode && p.y <= winSize.height * 3 / 4) {
      this.die();
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
  },
  hurt:function() {
    this.destroy();
  },
  die:function() {
    Effect.getOrCreateEffect("enemy_hit", this.getPosition());
    this.destroy();
  },
  collideRect:function(p) {
    var a = this.getContentSize();
    return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
  },
  born:function() {
    this.setPosition(this.appearPosition);
  }
});

Obstacle.getOrCreate = function() {
  var obstacle;
  for (var j = 0; j < KS.CONTAINER.OBSTACLES.length; j++) {
    obstacle = KS.CONTAINER.OBSTACLES[j];
    if (!obstacle.active) {
      obstacle.active = true;
      obstacle.setVisible(true);
      obstacle.born();
      return obstacle;
    }
  }
  obstacle = Obstacle.create(1);
  return obstacle;
};

Obstacle.create = function(type) {
//cc.log("CREATE OBSTACLE");
  var obstacle = new Obstacle(type);
  g_sharedGameLayer.addObstacle(obstacle);
  KS.CONTAINER.OBSTACLES.push(obstacle);
  return obstacle;
};

Obstacle.preSet = function() {
  var obstacle;
  for (var i = 0; i < 12; i++) {
    obstacle = Obstacle.create(1);
    obstacle.setVisible(false);
    obstacle.active = false;
  }
};

