var NearWeapon = cc.Sprite.extend({
  active:true,
  weaponId:0,
  level:0,
  weapon:null,
  stripeSprite:null,
  ctor:function(weaponId, level) {
    var name = "weapon_near.png";
//  cc.log("CREATE NEAR WEAPON " + weaponId + "-" + level);
    this._super();
    this.weaponId = weaponId;
    this.level = level;
    this.weapon = KS.WEAPONS[weaponId - 1];
    this.initWithSpriteFrameName(name);
    this.setAnchorPoint(cc.p(0.5, 0));
  },
  destroy:function() {
    this.active = false;
    this.setVisible(false);
    this.stopAllActions();
  },
  show:function(p, ep) {
    var showAndHide = cc.Sequence.create(cc.FadeIn.create(0.05), cc.DelayTime.create(0.1), cc.EaseOut.create(cc.FadeOut.create(0.25), 5.0));
    this.runAction(showAndHide);

    Effect.getOrCreateEffect("weapon_near_efx", ep);
  },
  setDirection:function(p, ep) {
    var dist = cc.pDistance(p, ep) - 30;
    var angleVec = cc.pSub(p, ep);
    var angleInRadians = -Math.atan2(angleVec.y, angleVec.x) - Math.PI / 2;
    var angle = angleInRadians / Math.PI * 180;
    this.setScaleY(dist / 600);
    this.setRotation(angle);
    this.setPosition(p.x - 3, p.y);
  }
});

NearWeapon.getOrCreate = function(weaponId, level) {
  var bullet;
  for (var j = 0; j < KS.CONTAINER.NEAR_WEAPONS.length; j++) {
    bullet = KS.CONTAINER.NEAR_WEAPONS[j];
    if (!bullet.active && bullet.weaponId == weaponId) { // ignore bullet.level == level
      bullet.active = true;
      bullet.setVisible(true);
      return bullet;
    }
  }
  bullet = NearWeapon.create(weaponId, level);
  return bullet;
};

NearWeapon.create = function(weaponId, level) {
  var bullet = new NearWeapon(weaponId, level);
  g_sharedGameLayer.addBullet(bullet);
  KS.CONTAINER.NEAR_WEAPONS.push(bullet);
  return bullet;
};

NearWeapon.preSet = function() {
  var bullet;
  for (var count = 0; count < 1; count++) {
    bullet = NearWeapon.create(4, 1);
    bullet.setVisible(false);
    bullet.active = false;
  }
};


