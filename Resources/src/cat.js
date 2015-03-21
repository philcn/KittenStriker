var CatSprite = cc.Sprite.extend({
  isHero:false,
  isTopBuddy:false,
  canBeAttacked:true,
  active:true,
  appearPosition:cc.p(320, 180),
  charactor:0,
  level:0,
  shooting:false,
  model:null,
  weapon:null,
  ctor:function(model) {
//  cc.log("CREATE CAT SPRITE: " + model.charactor + "-" + model.level);
    this._super();
    this.model = model;
    this.charactor = model.charactor;
    this.level = model.level;
    var prefix = "cat" + this.charactor + "-" + this.level + "_";
    var suffix = ".png";
    this.initWithSpriteFrameName(prefix + "1" + suffix);
    this.setPosition(this.appearPosition);
    var animFrames = [];
    for (var i = 1; i <= 8; i++) {
      var name = prefix + i + suffix;
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name);
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/20);
    var animate = cc.Animate.create(animation);
    this.runAction(cc.RepeatForever.create(animate));
    this.weapon = KS.WEAPONS[this.charactor - 1];
    this.born();
  },
  setShooting:function(shooting) {
    this.shooting = shooting;
    if (shooting) {
      if (this.weapon.type == 'bullet' || this.weapon.type == 'bomb') {
        var interval = this.weapon.intervals[this.level - 1] / g_sharedGameManager.freqFactor;
        this.schedule(this.shoot, interval);
      } else if (this.weapon.type == 'near') {
        this.initNearWeapon();
        this.schedule(this.attackNear);
      }
    } else {
      if (this.weapon.type == 'bullet' || this.weapon.type == 'bomb') {
        this.unschedule(this.shoot);
      } else if (this.weapon.type == 'near') {
        this.unschedule(this.attackNear);
      }
    }
  },
  shoot:function(dt) {
    if (this.weapon.type == 'bullet' || this.weapon.type == 'bomb') {
      var offset = 10;
      var p = this.getPosition();
      var b = Bullet.getOrCreateBullet(this.charactor, this.level);
      b.setPosition(p.x, p.y + offset);
    }
  },
  initNearWeapon:function() {
    if (!this.nearWeapon) {
      this.nearWeapon = NearWeapon.getOrCreate(this.charactor, this.level);
    }
    this.nearWeapon.setOpacity(0);
    this.coolingDown = false;
  },
  attackNear:function(dt) {
    if (g_sharedGameLayer._feverMode || !this.nearWeapon) {
      return;
    }
    var nearestEnemy = null;
    var minDist = 2000;
    var range = this.weapon.range
    var p = this.getPosition();
    KS.CONTAINER.ALL_ENEMIES_DO(function(enemy) {
      if (enemy.getPositionY() > p.y) {
        var dist = cc.pDistance(p, enemy.getPosition());
        if (dist < minDist && dist <= range) {
          minDist = dist;
          nearestEnemy = enemy;
        }
      }
    }, g_sharedGameLayer._bossMode);

    if (nearestEnemy == null || this.coolingDown) {
      return;
    }

    g_sharedAudioManager.playNearEffect();
    var ep = nearestEnemy.getPosition();
    ep = cc.pSub(ep, cc.p(0, 40));
    this.nearWeapon.setDirection(p, ep);
    this.nearWeapon.show(p, ep);
    nearestEnemy.hurt(this.weapon.powers[this.level - 1]);

    this.coolingDown = true;
    this.unschedule(this.coolDown);
    var coolDownInterval = this.weapon.coolDowns[this.level - 1] / g_sharedGameManager.freqFactor;
    this.schedule(this.coolDown, coolDownInterval);
  },
  coolDown:function() {
    this.coolingDown = false;
  },
  destroy:function() {
    this.setVisible(false);
    this.active = false;
  },
  hurt:function() {
    if (KS.INVINCIBLE || g_sharedGameLayer._feverMode) {
      return;
    }
    this.die();
  },
  die:function() {
    this.setShooting(false);
    g_sharedGameLayer.shock();
    if (this.isHero) {
      g_sharedGameLayer.onHeroDied();
    } else {
      g_sharedAudioManager.playBuddyDieEffect();
    }
    if (this.isTopBuddy) {
      g_sharedGameLayer.removeBuddy(this);
    }
    this.destroy();
  },
  collideRect:function(p) {
    var width = 80 - 10;
    var height = 92 - 10;
    return cc.rect(p.x - width / 2, p.y - height / 2, width, height);
  },
  born:function() {
    this.active = true;
    this.canBeAttacked = true;
    this.setShooting(true);
    this.setVisible(true);
  },
  reborn:function() {
    this.setVisible(true);
    var that = this;
    this.runAction(cc.Sequence.create(cc.Blink.create(1.5, 5), cc.CallFunc.create(function() {
      that.born();
    })));
  }
});

