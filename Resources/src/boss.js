K_BOSS_IDLE_ACTION_TAG = 1;
K_BOSS_ATTACK_ACTION_TAG = 2;
K_BOSS_SEEK_ACTION_TAG = 3;
K_BOSS_EMIT_ACTION_TAG = 4;
K_BOSS_RUSH_ACTION_TAG = 5;

var BossSprite = cc.Sprite.extend({
  active:true,
  state:"idle",
  appearPosition:cc.p(320, 1500),
  charactor:0,
  boss:null,
  hp:0,
  attack:0,
  attackMode:null,
  idleAnimation:null,
  attackAnimation:null,
  blinkAnimation:null,
  canBeAttacked:false,
  attackCount:4,
  ctor:function(charactor) {
    this._super();
    this.charactor = charactor;
    this.boss = KS.BOSSES[charactor - 1];
    this.hp = this.boss.hp;
    this.attack = this.boss.attack;
    this.attackMode = this.boss.attackMode;
    this.initWithSpriteFrameName("boss" + charactor + "-idle_1.png");
    this.setPosition(this.appearPosition);
    this.idleAnimation = cc.AnimationCache.getInstance().getAnimation("boss" + charactor + "-idle");
    if (charactor != 4) {
      this.attackAnimation = cc.AnimationCache.getInstance().getAnimation("boss" + charactor + "-attack");
    }
    if (charactor != 5) {
      this.blinkAnimation = cc.AnimationCache.getInstance().getAnimation("boss" + charactor + "-blink");
    }
    this.born();
  },
  update:function(dt) {
  },
  destroy:function() {
    this.setVisible(false);
    this.active = false;
    this.stopAllActions();
    this.stopAttacking();
    g_sharedGameLayer.endBossMode();
  },
  hurt:function(power) {
    if (!this.active || !this.canBeAttacked) {
      return;
    }
    g_sharedAudioManager.playBossHitEffect();
    this.hp -= power;
    if (this.hp <= 0) {
      this.die();
    }
  },
  die:function() {
    var diedPosition = this.getPosition();
    this.spawnCoins(diedPosition);
    this.destroy();
    g_sharedAudioManager.playBossDieEffect();
  },
  born:function() {
    this.active = true;
    this.hp = this.boss.hp;
    var cycle = g_sharedGameLayer._mapManager ? g_sharedGameLayer._mapManager.cycle : 1;
    this.hp += KS.BOSS_HP_CYCLE_ADDITION * cycle;
    this.startActions();
  },
  startActions:function() {
    this.idleAndBlink();
    this.joinBattle();
  },
  joinBattle:function() {
    this.runAction(cc.Sequence.create(
          cc.MoveTo.create(2.0, cc.p(320, 900)), 
          cc.DelayTime.create(2.0),
          cc.CallFunc.create(this.startSeeking.bind(this)),
          cc.DelayTime.create(2.0),
          cc.CallFunc.create(this.startAttacking.bind(this))
    ));
  },
  leaveBattle:function() {
    this.canBeAttacked = false;
    this.stopSeeking();
    this.stopActionByTag(K_BOSS_ATTACK_ACTION_TAG);
    this.stopActionByTag(K_BOSS_EMIT_ACTION_TAG);
    this.stopActionByTag(K_BOSS_RUSH_ACTION_TAG);
    var y = 1136 + 500;
    var selfY = this.getPositionY();
    var x = this.getPositionX();
    var dist = Math.abs(y - selfY);
    var duration = 1.0 / 300 * dist;
    var action = cc.MoveTo.create(duration, cc.p(x, y));
    this.runAction(cc.Sequence.create(action, cc.CallFunc.create(this.destroy.bind(this))));
  },
  startSeeking:function() {
    this.schedule(this.seek, 0.2);
  },
  seek:function() {
    this.stopActionByTag(K_BOSS_SEEK_ACTION_TAG);
    var x = Math.min(Math.max(g_sharedGameLayer._hero.getPositionX(), 80), 640 - 80)
    var selfX = this.getPositionX();
    var y = this.getPositionY();
    var dist = Math.abs(x - selfX);
    var duration = 1.0 / 300 * dist;
    var action = cc.MoveTo.create(duration, cc.p(x, y));
    action.setTag(K_BOSS_SEEK_ACTION_TAG);
    this.runAction(action);
  },
  stopSeeking:function() {
    this.unschedule(this.seek);
    this.stopActionByTag(K_BOSS_SEEK_ACTION_TAG);
  },
  startAttacking:function() {
    this.canBeAttacked = true;
    switch (this.attackMode) {
      case 'axe':
        this.scheduleAttackAxe(); break;
      case 'bubbles':
        this.scheduleAttackBubbles(); break;
      case 'bullet':
        this.scheduleAttackBullet(); break;
    }
    if (this.boss.rush) {
      this.rush();
    }
  },
  stopAttacking:function() {
    this.stopSeeking();
    this.stopActionByTag(K_BOSS_RUSH_ACTION_TAG);
    this.stopActionByTag(K_BOSS_ATTACK_ACTION_TAG);
    this.stopActionByTag(K_BOSS_EMIT_ACTION_TAG);
  },
  idleAndBlink:function() {
    this.stopActionByTag(K_BOSS_ATTACK_ACTION_TAG);
    var idleAnimate = cc.Animate.create(this.idleAnimation);
    var action;
    if (!this.blinkAnimation) {
      action = cc.RepeatForever.create(idleAnimate);
    } else {
      var blinkAnimate = cc.Animate.create(this.blinkAnimation);
      action = cc.RepeatForever.create(cc.Sequence.create(idleAnimate, idleAnimate.clone(), blinkAnimate));
    }
    action.setTag(K_BOSS_IDLE_ACTION_TAG);
    this.runAction(action);
  },
  playAttackAnimation:function() {
    if (this.charactor != 5 && this.attackCount <= 0) {
      this.leaveBattle();
      return;
    }
    this.attackCount -= 1;
    if (!this.attackAnimation) {
      return;
    }
    this.stopActionByTag(K_BOSS_IDLE_ACTION_TAG);
    var animate = cc.Animate.create(this.attackAnimation);
    var action = cc.Sequence.create(animate, cc.CallFunc.create(this.idleAndBlink, this));
    action.setTag(K_BOSS_ATTACK_ACTION_TAG);
    this.runAction(action);
  },
  rush:function() {
    var runDownDist = 700;
    var action = cc.Sequence.create(
            cc.CallFunc.create(this.stopSeeking.bind(this)),
            cc.CallFunc.create(this.playAttackAnimation.bind(this)),
            cc.MoveBy.create(0.8, cc.p(0, -runDownDist)),
            cc.MoveBy.create(0.8, cc.p(0, runDownDist)),
            cc.CallFunc.create(this.startSeeking.bind(this)),
            cc.DelayTime.create(3.4),
            cc.CallFunc.create(this.rush.bind(this))
        );
    action.setTag(K_BOSS_RUSH_ACTION_TAG);
    this.runAction(action);
    if (this.charactor == 5) {
      this.scheduleOnce(function() {
        this.playEffect();
      }, 0.7);
    }
  },
  scheduleAttackAxe:function() {
    var action = cc.RepeatForever.create(cc.Sequence.create(
          cc.DelayTime.create(1.3),
          cc.CallFunc.create(this.shootBullet.bind(this)),
          cc.DelayTime.create(3.7)
        ));
    action.setTag(K_BOSS_EMIT_ACTION_TAG);
    this.runAction(action);
  },
  scheduleAttackBullet:function() {
    var action = cc.RepeatForever.create(cc.Sequence.create(
          cc.DelayTime.create(2.0),
          cc.CallFunc.create(this.playAttackAnimation.bind(this)),
          cc.DelayTime.create(0.3),
          cc.CallFunc.create(this.shootBullet.bind(this)),
          cc.DelayTime.create(0.1),
          cc.CallFunc.create(this.shootBullet.bind(this)),
          cc.DelayTime.create(0.1),
          cc.CallFunc.create(this.shootBullet.bind(this)),
          cc.DelayTime.create(0.1)
        ));
    action.setTag(K_BOSS_EMIT_ACTION_TAG);
    this.runAction(action);
  },
  scheduleAttackBubbles:function() {
    var action = cc.RepeatForever.create(cc.Sequence.create(
          cc.DelayTime.create(2.0),
          cc.CallFunc.create(this.playAttackAnimation.bind(this)),
          cc.CallFunc.create(this.playEffect.bind(this)),
          cc.DelayTime.create(0.4),
          cc.CallFunc.create(this.emitBubbles.bind(this)),
          cc.DelayTime.create(0.2),
          cc.CallFunc.create(this.emitBubbles.bind(this)),
          cc.DelayTime.create(0.2),
          cc.CallFunc.create(this.emitBubbles.bind(this)),
          cc.DelayTime.create(0.2),
          cc.CallFunc.create(this.emitBubbles.bind(this)),
          cc.DelayTime.create(0.2),
          cc.CallFunc.create(this.emitBubbles.bind(this)),
          cc.DelayTime.create(0.2),
          cc.CallFunc.create(this.emitBubbles.bind(this))
        ));
    action.setTag(K_BOSS_EMIT_ACTION_TAG);
    this.runAction(action);
  },
  shootBullet:function() {
    var p = this.getPosition();
    var b = BossBullet.getOrCreateBullet(this.charactor);
    var offset = [20, 0, 50, 50, 0][this.charactor - 1];
    b.setPosition(p.x, p.y - offset);
    b.runAction(cc.MoveBy.create(3.0, cc.p(Math.random() * 640 - 320, 0)));
    this.playEffect();
  },
  emitBubbles:function() {
    var p = this.getPosition();
    var b = BossBullet.getOrCreateBullet(this.charactor);
    var offset = 50;
    b.setPosition(p.x, p.y - offset);
    b.runAction(cc.MoveBy.create(8.0, cc.p(Math.random() * 640 - 320, 0)));
  },
  playEffect:function() {
    g_sharedAudioManager.playBossAttackEffect(this.charactor);
  },
  collideRect:function(p) {
    var width = this.boss.collideRect[0];
    var height = this.boss.collideRect[1];
    return cc.rect(p.x - width / 2, p.y - height / 2, width, height);
  },
  spawnCoins:function(dp) {
    var pattern = KS.COIN_PATTERNS[Math.floor(Math.random() * KS.COIN_PATTERNS.length)];
    pattern.forEach(function(p) {
      var coin = g_sharedGameLayer._mapManager.spawnCoin(dp.x, dp.y);
      coin.setScale(0.5);
      coin.scrolling = false;
      coin.runAction(cc.Spawn.create(
          cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(p[0], p[1] + 200)), 2),
          cc.Sequence.create(cc.ScaleTo.create(0.3, 1.3), cc.ScaleTo.create(0.2, 1.0), cc.CallFunc.create(coin.setScrolling.bind(coin)))
      ));
    });
  }
});

BossSprite.createSharedAnimations = function() {
//cc.log("create shared boss animation");
  for (var i = 1; i <= 5; i++) {
    this.createAnimationForCharactor(i);
  }
};

BossSprite.createAnimationForCharactor = function(charactor) {
  var stateFrameCounts = {"idle": 16, "blink": 16, "attack": 32};
  for (var state in stateFrameCounts) {
    if ((charactor == 4 && state == "attack") || (charactor == 5 && state == "blink")) {
      continue;
    }
    var count = stateFrameCounts[state];
//  cc.log("CREATE BOSS ANIMATION " + charactor + ", " + state + ", " + count);
    var animFrames = [];
    var prefix = "boss" + charactor + "-";
    var sep = "_";
    var suffix = ".png";
    for (var i = 1; i <= count; i++) {
      var name = prefix + state + sep + i + suffix;
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name);
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 1/24);
    cc.AnimationCache.getInstance().addAnimation(animation, prefix + state);
  }
};

