var Enemy = cc.Sprite.extend({
  appearPosition:cc.p(320, 1200),
  charactor:1,
  speed:350,
  active:true,
  ctor:function(charactor) {
    this._super();
    this.charactor = charactor;
    this.hp = KS.ENEMIES[charactor - 1].hp;
    this.initWithSpriteFrameName("enemy" + charactor + "_1.png");
    this.setPosition(this.appearPosition);
    var animFrames = [];
    for (var i = 1; i <= 8; i++) {
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("enemy" + charactor
          + "_" + i + ".png");
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/10);
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
      g_sharedGameManager.breakCombo();
    }
    if (g_sharedGameLayer._feverMode && p.y <= winSize.height * 3 / 4) {
      this.die();
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
  },
  hurt:function(power) {
    if (!this.active) {
      return;
    }
    if (power === undefined) {
      var power = 1;
    }
    this.hp -= power;
    if (this.hp <= 0) {
      this.die();
    }
  },
  die:function() {
    var diedPosition = this.getPosition();
    diedPosition.y -= 40;
    Effect.getOrCreateEffect("enemy_hit", diedPosition);
    this.destroy();
    this.scheduleOnce(function() {
      if (Math.random() < KS.PICK_BUDDY_PROBABILITY && !g_sharedGameLayer._feverMode) {
        g_sharedGameLayer._mapManager.spawnPickBuddy(diedPosition.x, diedPosition.y);
      } else if (Math.random() < KS.ENERGY_STAR_PROBABILITY && !g_sharedGameLayer._feverMode) {
        g_sharedGameLayer._mapManager.spawnStar(diedPosition.x, diedPosition.y);
      } else {
        g_sharedGameLayer._mapManager.spawnCoin(diedPosition.x, diedPosition.y);
      }
    }, 0.3);
    g_sharedGameManager.accumulateCombo();
  },
  collideRect:function(p) {
    var a = this.getContentSize();
    return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height);
  },
  born:function() {
    this.setPosition(this.appearPosition);
    this.hp = KS.ENEMIES[this.charactor - 1].hp;
    var cycle = g_sharedGameLayer._mapManager ? g_sharedGameLayer._mapManager.cycle : 1;
    this.hp += KS.ENEMY_HP_CYCLE_ADDITION * cycle;
  }
});

Enemy.getOrCreate = function(charactor) {
  var enemy;
  for (var j = 0; j < KS.CONTAINER.ENEMIES[charactor - 1].length; j++) {
    enemy = KS.CONTAINER.ENEMIES[charactor - 1][j];
    if (!enemy.active && enemy.charactor == charactor) {
      enemy.active = true;
      enemy.setVisible(true);
      enemy.born();
      return enemy;
    }
  }
  enemy = Enemy.create(charactor);
  return enemy;
};

Enemy.create = function(charactor) {
//cc.log("CREATE ENEMY " + charactor);
  var enemy = new Enemy(charactor);
  g_sharedGameLayer.addEnemy(enemy);
  KS.CONTAINER.ENEMIES[charactor - 1].push(enemy);
  return enemy;
};

Enemy.preSet = function(type) {
  var enemy;
  if (type == undefined) {
    type = 1; // 1, 2, 3, 4
  }
  for (var i = 0; i < 5; i++) {
    enemy = Enemy.create(type);
    enemy.setVisible(false);
    enemy.active = false;
  }
};


