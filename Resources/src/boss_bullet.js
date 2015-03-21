var BossBullet = cc.Sprite.extend({
  active:true,
  boss:null,
  speed:0,
  power:0,
  type:0,
  canBeAttacked:false,
  hp:0,
  ctor:function(charactor) {
    var name = "weapon_boss" + charactor + ".png";
//  cc.log("CREATE BOSS BULLET: " + name);
    this._super();
    this.type = charactor;
    this.boss = KS.BOSSES[charactor - 1];
    this.power = this.boss.attack;
    this.speed = this.boss.bulletSpeed;
    this.initWithSpriteFrameName(name);
    if (charactor == 2) {
      this.canBeAttacked = true;
      this.hp = this.boss.bulletHp;
    }
  },
  update:function(dt) {
    var p = this.getPosition();
    p.y -= this.speed * dt;
    this.setPosition(p);
    if (p.x < 0 || p.x > winSize.width || p.y < 0 || p.y > winSize.height) {
      this.destroy();
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
  },
  hurt:function() {
    this.hp--;
    if (this.hp <= 0) {
      this.destroy();
    }
  },
  born:function() {
    if (this.type == 2) {
      this.hp = this.boss.bulletHp;
    }
  },
  collideRect:function(p) {
    var radius = [45, 21, 15, 0, 0][this.type - 1];
    return cc.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
  }
});

var BossFireball = cc.Node.extend({
  active:true,
  boss:null,
  speed:0,
  power:0,
  type:0,
  canBeAttacked:false,
  _emitter:null,
  ctor:function(charactor) {
//  cc.log("CREATE BOSS FIREBALL");
    this._super();
    this.type = charactor;
    this.boss = KS.BOSSES[charactor - 1];
    this.power = this.boss.attack;
    this.speed = this.boss.bulletSpeed;

    var texture = cc.TextureCache.getInstance().addImage('res/fire.png');
    this._emitter = cc.ParticleSun.create();
    this._emitter.setTexture(texture);
    this._emitter.setPosition(0, 0);
    this.addChild(this._emitter);
  },
  update:function(dt) {
    var p = this.getPosition();
    p.y -= this.speed * dt;
    this.setPosition(p);
    if (p.x < 0 || p.x > winSize.width || p.y < -winSize.height || p.y > winSize.height) {
      this.destroy();
    }
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
    this.setPosition(cc.p(320, -320));
  },
  hurt:function() {
    this.destroy();
  },
  born:function() {
  },
  collideRect:function(p) {
    var radius = 10;
    return cc.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
  }
});

BossBullet.getOrCreateBullet = function(charactor) {
  var bullet;
  for (var j = 0; j < KS.CONTAINER.BOSS_BULLETS.length; j++) {
    bullet = KS.CONTAINER.BOSS_BULLETS[j];
    if (!bullet.active && bullet.type == charactor) {
      bullet.active = true;
      bullet.setVisible(true);
      bullet.born();
      return bullet;
    }
  }
  bullet = BossBullet.create(charactor);
  return bullet;
};

BossBullet.create = function(charactor) {
  if (charactor == 4) {
    var bullet = new BossFireball(charactor);
    g_sharedGameLayer.addParticle(bullet);
  } else {
    var bullet = new BossBullet(charactor);
    g_sharedGameLayer.addBullet(bullet);
  }
  KS.CONTAINER.BOSS_BULLETS.push(bullet);
  return bullet;
};

BossBullet.preSet = function(type) {
  var bullet;
  if (type == undefined) {
    type = 1; // 1, 2, 3, 4
  }
  for (var count = 0; count < 3; count++) {
    bullet = BossBullet.create(type);
    bullet.setVisible(false);
    bullet.active = false;
  }
};

