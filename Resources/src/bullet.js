var Bullet = cc.Sprite.extend({
  active:true,
  weapon:null,
  weaponId:0,
  level:0,
  speed:0,
  power:0,
  type:null,
  ctor:function(weaponId, level) {
    var name = "weapon" + weaponId + "-" + level + ".png";
//  cc.log("CREATE BULLET: " + name);
    this._super();
    this.weaponId = weaponId;
    this.level = level;
    this.weapon = KS.WEAPONS[weaponId - 1];
    this.type = this.weapon.type;
    this.speed = this.weapon.bulletSpeed;
    this.power = this.weapon.powers[level - 1] * g_sharedGameManager.attackFactor;
    this.initWithSpriteFrameName(name);
  },
  update:function(dt) {
    var p = this.getPosition();
    p.y += this.speed * dt;
    this.setPosition(p);
    if (p.x < 0 || p.x > winSize.width || p.y < 0 || p.y > winSize.height) {
      this.destroy();
    }
    if (this.type == 'bomb' && p.y > winSize.height * 2 / 3) {
      this.destroy();
      this.bombExplode(p);
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
    this.stopAllActions();
  },
  hurt:function() {
    if (this.type == 'bullet') {
      this.destroy();
    }
  },
  bombExplode:function(p) {
    var that = this;
    var emitter = this.sharedEmitter || cc.ParticleSystem.create('res/ExplodingRing.plist');
    g_sharedAudioManager.playBombEffect();
    g_sharedGameLayer.addParticle(emitter);
    emitter.setAutoRemoveOnFinish(true);
    emitter.setPosition(p);

    // hurt all enemies in range
    var that = this;
    KS.CONTAINER.ALL_ENEMIES_DO(function(enemy) {
      var dist = cc.pDistance(p, enemy.getPosition());
      if (dist < that.weapon.radius) {
        enemy.hurt(that.power);
      }
    }, true);
  },
  collideRect:function(p) {
    return cc.rect(p.x - 3, p.y - 3, 6, 6);
  }
});

Bullet.getOrCreateBullet = function(weaponId, level) {
  var bullet;
  for (var j = 0; j < KS.CONTAINER.PLAYER_BULLETS.length; j++) {
    bullet = KS.CONTAINER.PLAYER_BULLETS[j];
    if (!bullet.active && bullet.weaponId == weaponId && bullet.level == level) {
      bullet.active = true;
      bullet.setVisible(true);
      return bullet;
    }
  }
  bullet = Bullet.create(weaponId, level);
  return bullet;
};

Bullet.create = function(weaponId, level) {
  var bullet = new Bullet(weaponId, level);
  g_sharedGameLayer.addBullet(bullet);
  KS.CONTAINER.PLAYER_BULLETS.push(bullet);
  return bullet;
};

Bullet.preSet = function() {
  var bullet;
  for (var i = 1; i <= 3; i++) {
    for (var j = 1; j <= 3; j++) {
      for (var count = 0; count < 4; count++) {
        bullet = Bullet.create(i, j);
        bullet.setVisible(false);
        bullet.active = false;
      }
    }
  }
  var emitter = cc.ParticleSystem.create('res/ExplodingRing.plist');
  this.sharedEmitter = emitter;
};


