var Effect = cc.Sprite.extend({
  key:null,
  active:true,
  animation:null,
  ctor:function(key) {
    this._super();
    this.initWithSpriteFrameName(key + "_1.png");
    this.animation = cc.AnimationCache.getInstance().getAnimation(key);
  },
  play:function(){
    this.runAction(cc.Sequence.create(
      cc.Animate.create(this.animation),
      cc.CallFunc.create(this.destroy, this)
    ));
  },
  destroy:function () {
    this.setVisible(false);
    this.active = false;
  }
});

Effect.createEffect = function(basename, count, time) {
  var animFrames = [];
  var name;
  for (var i = 1; i <= count; i++) {
    name = basename + "_" + i + ".png";
    var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name);
    animFrames.push(frame);
  }
  var animation = cc.Animation.create(animFrames, time);
  cc.AnimationCache.getInstance().addAnimation(animation, basename);
};

Effect.createSharedEffect = function () {
  Effect.createEffect("ready_go", 5, 1.0);
  Effect.createEffect("enemy_hit", 5, 0.3/5);
  Effect.createEffect("weapon_near_efx", 4, 0.3/4);
};

Effect.getOrCreateEffect = function(key, pos) {
  var effect;
  for (var j = 0; j < KS.CONTAINER.EFFECTS.length; j++) {
    effect = KS.CONTAINER.EFFECTS[j];
    if (!effect.active && effect.key == key) {
      effect.setVisible(true);
      effect.active = true;
      effect.setPosition(pos);
      effect.play();
      return effect;
    }
  }
  effect = Effect.create(key);
  effect.setPosition(pos);
  effect.play();
  return effect;
};

Effect.create = function(key) {
  var effect = new Effect(key);
  g_sharedGameLayer.addEffect(effect);
  KS.CONTAINER.EFFECTS.push(effect);
  return effect;
};

Effect.preSet = function() {
  this.createSharedEffect();
  var effect;
  
  for (var i = 0; i < 5; i++) {
    effect = Effect.create("enemy_hit");
    effect.setVisible(false);
    effect.active = false;
  }
};
