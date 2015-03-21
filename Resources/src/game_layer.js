K_BG_SPEED_TAG = 1;
K_COMBO_FADE_IN_ACTION_TAG = 1;
// threshold for ignoring collision rect calculation
MAX_CONTAINT_WIDTH = 100;
MAX_CONTAINT_HEIGHT = 100;
PTM = 32;

var g_speedFactor;
var g_oldSpeedFactor;
var g_sharedGameLayer;
var winSize;

var GameLayer = cc.Layer.extend({
  _energy:0,
  _paused:false,
  _started:false,
  _gameOver:false,
  _feverMode:false,
  _bossMode:false,
  _bossModeInBattle:false,
  _feverModeMask:null,
  _feverModeSplash:null,
  _feverModeSheild:null,
  _hero:null,
  _buddies:[],
  _topBuddies:[],
  _bg:null,
  _bgAlt:null,
  _bgHeight:null,
  _effectLayer:null,
  _mapManager:null,
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function(models) {
    this._super();
    this._effectLayer = cc.Layer.create();
    this.addChild(this._effectLayer, 100);
    this.initBatches();
    this.models = models;
    
    this._speedUpCount = 0;
    this._spawnMapCount = 0;
    g_oldSpeedFactor = 0;
    g_sharedGameLayer = this;
    winSize = cc.Director.getInstance().getWinSize();
    this._mapManager = new MapManager();

    Background.preSet(1);
    Background.preSet(0);
    Coin.preSet();
    Enemy.preSet();
    Bullet.preSet();
    Obstacle.preSet();
    PickBuddy.preSet();
    EnergyStar.preSet();
    NearWeapon.preSet();
    Effect.preSet();
    BossBullet.preSet();

    this.setTouchEnabled(true);
    this.initMovingBackground();
    this.initHero(models);
    this.initUI();

    this.setSpeedFactor(1.2);

    this.scheduleUpdate();
    this.schedule(this.slowUpdate.bind(this), 1/40);
    this.scheduleOnce(this.onGameStart, 1.0);

    return true;
  },
  onEnter:function() {
    this._super();
    this.scheduleOnce(function() {
      g_sharedAudioManager.playBackgroundMusic();
    }, 0.8);
  },
  initBatches:function() {
    var texOpaque = cc.TextureCache.getInstance().addImage('res/texture_opaque_pack.png');
    this._texOpaqueBatch = cc.SpriteBatchNode.createWithTexture(texOpaque);
    this.addChild(this._texOpaqueBatch, 99);
  },
  initUI:function() {
    this._scoreLabel = cc.LabelTTF.createWithFontDefinition('', g_gameScoreFontDef);
    this._scoreLabel.setAnchorPoint(cc.p(0, 0));
    this._scoreLabel.setPosition(20, 1060);
    this.addChild(this._scoreLabel, 999);

    this._distanceLabel = cc.LabelTTF.createWithFontDefinition('', g_gameDistanceFontDef);
    this._distanceLabel.setAnchorPoint(cc.p(0, 0));
    this._distanceLabel.setPosition(20, 1000);
    this.addChild(this._distanceLabel, 999);
    
    this._coinLabel = cc.LabelTTF.createWithFontDefinition('4567', g_gameCoinFontDef)
    this._coinLabel.setAnchorPoint(cc.p(0, 0));
    this._coinLabel.setPosition(56, 940);
    this.addChild(this._coinLabel, 999);

    var coinIcon = cc.Sprite.create('res/game_icon_coin.png');
    coinIcon.setAnchorPoint(cc.p(0, 0));
    coinIcon.setPosition(14, 944);
    this.addChild(coinIcon, 999);

    this._energyBar = new EnergyBar();
    this.addChild(this._energyBar, 999);
    this._energyBar.setPosition(winSize.width / 2, 280);

    var pauseBtnNormal = cc.Sprite.create('res/game_btn_pause_normal.png');
    var pauseBtnSelected = cc.Sprite.create('res/game_btn_pause_selected.png');
    var pauseBtn = cc.MenuItemSprite.create(pauseBtnNormal, pauseBtnSelected, this.onPause, this);
    var pauseMenu = cc.Menu.create(pauseBtn);
    this.addChild(pauseMenu, 999);
    pauseMenu.setPosition(winSize.width - 60, winSize.height - 60);

    var comboSprite = cc.Sprite.create('res/combo.png');
    this.addChild(comboSprite, 999, 999);
    comboSprite.setPosition(winSize.width - 78, winSize.height - 184);
    var comboLabel = cc.LabelTTF.createWithFontDefinition('', g_gameComboFontDef);
    comboLabel.setAnchorPoint(cc.p(0.5, 0.5));
    comboLabel.setPosition(comboSprite.getPositionX(), comboSprite.getPositionY() + 44);
    this.addChild(comboLabel, 999, 999);
    comboLabel.setOpacity(0);
    comboSprite.setOpacity(0);
    this.comboSprite = comboSprite;
    this.comboLabel = comboLabel;
  },
  initHero:function(models) {
    if (models[0]) {
      var hero = new CatSprite(models[0]);
      this._texOpaqueBatch.addChild(hero, 15, 15);
      hero.isHero = true;
      this._hero = hero; 
      KS.CONTAINER.HEROES.push(hero);
    }
    var that = this;
    var upperBound = Math.min(3, models.length - 1);
    for (var i = 0; i < upperBound; i++) {
      var buddy = new CatSprite(models[i + 1]);
      this._buddies[i] = buddy;
    }
    this._buddies.forEach(function(buddy) {
      buddy.setPositionY(hero.getPositionY() - 80);
      that._texOpaqueBatch.addChild(buddy, 20, 20);
      KS.CONTAINER.HEROES.push(buddy);
    });
    this._topBuddies = [];
  },
  initMovingBackground:function() {
    this._bg = Background.getOrCreate(1);
    this._bgHeight = this._bg.getContentSize().height;
    this._bgAlt = Background.getOrCreate(1);
    this._bgAlt.setPositionY(this._bgHeight - 2);
    var moveBackground = cc.MoveBy.create(this._bgHeight / 300, cc.p(0, -this._bgHeight));
    var resetBackground = cc.MoveBy.create(0, cc.p(0, this._bgHeight));
    var moveAndReset = cc.Sequence.create(moveBackground, resetBackground);
    var moveForever = cc.RepeatForever.create(moveAndReset);
    var speededMoveForever = cc.Speed.create(moveForever, 1.0);
    speededMoveForever.setTag(K_BG_SPEED_TAG);

    this._bg.runAction(speededMoveForever);
    this._bgAlt.runAction(speededMoveForever.clone());
  },
  switchBackground:function(toId) {
    var newBg = Background.getOrCreate(toId);
    var newBgAlt = Background.getOrCreate(toId);
    newBg.setPositionY(0);
    newBgAlt.setPositionY(this._bgHeight - 2);
    newBg.setOpacity(0);
    newBgAlt.setOpacity(0);

    var moveBackground = cc.MoveBy.create(this._bgHeight / 300, cc.p(0, -this._bgHeight));
    var resetBackground = cc.MoveBy.create(0, cc.p(0, this._bgHeight));
    var moveAndReset = cc.Sequence.create(moveBackground, resetBackground);
    var moveForever = cc.RepeatForever.create(moveAndReset);
    var speededMoveForever = cc.Speed.create(moveForever, 1.0);
    speededMoveForever.setTag(K_BG_SPEED_TAG);
    speededMoveForever.setSpeed(g_speedFactor);

    newBg.runAction(speededMoveForever);
    newBgAlt.runAction(speededMoveForever.clone());

    var that = this;
    this._bgAlt.runAction(cc.FadeOut.create(1));
    this._bg.runAction(cc.Sequence.create(cc.FadeOut.create(1), cc.CallFunc.create(function() {
      that._bg.destroy();
      that._bgAlt.destroy();
    })));

    newBgAlt.runAction(cc.FadeIn.create(1));
    newBg.runAction(cc.Sequence.create(cc.FadeIn.create(1), cc.CallFunc.create(function() {
      that._bg = newBg;
      that._bgAlt = newBgAlt;
    })));
  },
  onTouchesMoved:function(touches, event) {
    if (!this._paused) {
      this.processEvent(touches[0]);
    }
  },
  processEvent:function(event) {
    var delta = event.getDelta();
    var curPos = this._hero.getPosition();
    delta.y = 0;
//  delta.x *= 1.2;
    curPos = cc.pAdd(curPos, delta);
    curPos = cc.pClamp(curPos, cc.p(40, 0), cc.p(winSize.width - 40, winSize.height));
    this._hero.runAction(cc.MoveTo.create(0.1, curPos));
  },
  update:function(dt) {
    this.leaderFollow(dt);
    this.updateUnits(dt);
    this.updateUI();
  },
  slowUpdate:function(dt) {
    if (this._paused) {
      return;
    }
    var movingDist = 300 * dt * g_speedFactor;
    g_sharedGameManager.incDistance(movingDist / PTM);
    g_sharedGameManager.incScore(movingDist / PTM * 10);
    this._speedUpCount += movingDist / PTM;
    this._spawnMapCount += movingDist / PTM;
    // Gradually increase game speed.
    if (this._speedUpCount >= 250 && !this._feverMode && g_speedFactor < KS.MAX_NORMAL_SPEED_FACTOR) {
      this.incSpeedFactor(0.15);
      this._speedUpCount = 0;
    }
    // Trigger map update.
    if (this._started && !this._bossMode && this._spawnMapCount >= KS.MAP_SPAWN_DISTANCE) {
      this._spawnMapCount = 0;
      this._mapManager.update();
    }
    if (this._bossModeInBattle) {
      this.checkIsCollideBossMode();
    } else {
      this.checkIsCollide();
    }
  },
  incSpeedFactor:function(inc) {
    this.setSpeedFactor(g_speedFactor + inc);
  },
  setSpeedFactor:function(factor) {
    g_speedFactor = factor;
    this._bg.getActionByTag(K_BG_SPEED_TAG).setSpeed(g_speedFactor);
    this._bgAlt.getActionByTag(K_BG_SPEED_TAG).setSpeed(g_speedFactor);
  },
  checkIsCollide:function() {
    var that = this;

    KS.CONTAINER.ALL_ENEMIES_DO(function(enemy) {
      if (!enemy.active) {
        return;
      } // enemies get attacked
      KS.CONTAINER.PLAYER_BULLETS.forEach(function(bullet) {
        if (bullet.active && bullet.type == 'bullet' && that.collide(enemy, bullet)) {
          enemy.hurt(bullet.power);
          bullet.hurt();
        }
      });
    });
    KS.CONTAINER.HEROES.forEach(function(hero) {
      if (!hero.active) {
        return;
      } // heroes get collided
      KS.CONTAINER.ALL_ENEMIES_DO(function(enemy) {
        if (enemy.active && that.collide(hero, enemy)) {
          hero.hurt();
          enemy.die();
        }
      });
      KS.CONTAINER.OBSTACLES.forEach(function(obstacle) {
        if (obstacle.active && that.collide(hero, obstacle)) {
          hero.hurt();
          obstacle.hurt();
        }
      });
      KS.CONTAINER.COINS.forEach(function(coin) {
        if (coin.active && !coin.collected && that.collide(hero, coin)) {
          coin.collect();
        }
      });
      KS.CONTAINER.PICK_BUDDIES.forEach(function(buddy) {
        if (buddy.active && that.collide(hero, buddy)) {
          buddy.pick();
        }
      });
      if (!that._feverMode) {
        KS.CONTAINER.STARS.forEach(function(star) {
          if (star.active && !star.collected && that.collide(hero, star)) {
            star.collect();
          }
        });
      }
    });
  },
  checkIsCollideBossMode:function() {
    var that = this;
    KS.CONTAINER.PLAYER_BULLETS.forEach(function(bullet) {
      if (!bullet.active || bullet.type != 'bullet') {
        return;
      }
      KS.CONTAINER.BOSS_BULLETS.forEach(function(bossBullet) {
        if (bossBullet.active && bossBullet.canBeAttacked && that.collide(bossBullet, bullet)) {
          bossBullet.hurt();
          bullet.hurt();
        }
      });
      var boss = KS.CONTAINER.BOSS;
      if (boss && boss.active && that.collide(boss, bullet)) {
        boss.hurt(bullet.power);
        bullet.hurt();
      }
    });

    KS.CONTAINER.HEROES.forEach(function(hero) {
      if (!hero.active) {
        return;
      }
      KS.CONTAINER.BOSS_BULLETS.forEach(function(bossBullet) {
        if (bossBullet.active && that.collide(bossBullet, hero)) {
          bossBullet.hurt();
          hero.hurt();
        }
      });
      KS.CONTAINER.COINS.forEach(function(coin) {
        if (coin.active && !coin.collected && that.collide(hero, coin)) {
          coin.collect();
        }
      });
      var boss = KS.CONTAINER.BOSS;
      if (boss && boss.active && that.collide(boss, hero)) {
        hero.hurt();
      }
    });
  },
  collide:function(a, b, debug) {
    var pos1 = a.getPosition();
    var pos2 = b.getPosition();
    if (!this._bossModeInBattle &&
        (Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || 
         Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)) {
      return false;
    }
    var aRect = a.collideRect(pos1);
    var bRect = b.collideRect(pos2);
    return cc.rectIntersectsRect(aRect, bRect);
  },
  updateUnits:function (dt) {
    var child;
    [this._texOpaqueBatch, this._effectLayer].forEach(function(layer) {
      var children = layer.getChildren();
      for (var i in children) {
        child = children[i];
        if (child && child.active) {
          child.update(dt);
        }
      }
    });
  },
  updateUI:function () {
    this._coinLabel.setString(g_sharedGameManager.coin);
    this._distanceLabel.setString(Math.round(g_sharedGameManager.distance) + " m");
    this._scoreLabel.setString(g_sharedGameManager.score);
  },
  leaderFollow:function(dt) {
    var buddy;
    var dx, dy, offsetX, d, v, curPosX;

    for (var i = 0; i < this._buddies.length; i++) {
      buddy = this._buddies[i];
      if (buddy) {
        offsetX = -80 + 80 * i;
        dx = this._hero.getPositionX() - buddy.getPositionX() + offsetX;
        dy = this._hero.getPositionY() - buddy.getPositionY();
        d = Math.sqrt(dx * dx + dy * dy);
        v = 1000 + Math.abs(dx) * 10;
        if (d > 1) {
          curPosX = buddy.getPositionX() + dx / d * v * dt;
        } else {
          curPosX = buddy.getPositionX();
        }
        buddy.setPositionX(curPosX);
      }
    }
    for (var i = 0; i < this._topBuddies.length; i++) {
      buddy = this._topBuddies[i];
      if (buddy) {
        offsetX = -80 + 80 * i;
        dx = this._hero.getPositionX() - buddy.getPositionX() + offsetX;
        dy = this._hero.getPositionY() - buddy.getPositionY();
        d = Math.sqrt(dx * dx + dy * dy);
        v = 1000 + Math.abs(dx) * 10;
        if (d > 1) {
          curPosX = buddy.getPositionX() + dx / d * v * dt;
        } else {
          curPosX = buddy.getPositionX();
        }
        buddy.setPositionX(curPosX);
      }
    }
  },
  gainEnergy:function() {
    this._energy++;
    this._energyBar.setValue(this._energy);
    this._energyBar.show();
    if (this._energy >= this._energyBar._maxValue) {
      this.beginFeverMode();
      this.scheduleOnce(this.endFeverMode, 10);
    } 
  },
  beginFeverMode:function() {
//  cc.log("BEGIN FEVER MODE at " + g_sharedGameManager.distance);
    g_sharedAudioManager.playFeverModeEffect();
    this._feverMode = true;
    g_oldSpeedFactor = g_speedFactor;
    this.schedule(this.feverModeAccelerator);
    if (!this._feverModeSplash || !this._feverModeMask) {
      this._feverModeSplash = cc.Sprite.create("res/fever_mode_effect.png");
      this._feverModeSplash.setAnchorPoint(cc.p(0, 0));
      this._feverModeMask = cc.Sprite.create("res/fever_mode_mask.png");
      this._feverModeMask.setAnchorPoint(cc.p(0, 0));
      this._feverModeMask.setOpacity(0);
      this.addChild(this._feverModeMask, 3);
      this.addChild(this._feverModeSplash, 5);
    }
    if (!this._shield) {
      this._shield = new Shield();
      this._shield.setOpacity(0);
      this._shield.setPosition(winSize.width / 2, this._hero.getPositionY() + 80);
      this.addChild(this._shield, 4);
    }
    this._shield.setVisible(true);
    this._feverModeSplash.setVisible(true);
    this._feverModeMask.runAction(cc.FadeIn.create(0.5));
    this._shield.runAction(cc.FadeIn.create(0.5));
    this.schedule(this.feverModeSplash);
  },
  endFeverMode:function() {
    this._energy = 0;
    this.schedule(this.feverModeDecelerator);
//  cc.log("END FEVER MODE at " + g_sharedGameManager.distance);
  },
  feverModeAccelerator:function(dt) {
    if (g_speedFactor >= KS.FEVER_MODE_SPEED_FACTOR) {
      this.unschedule(this.feverModeAccelerator);
    } else {
      this.incSpeedFactor(0.1);
    }
  },
  feverModeDecelerator:function(dt) {
    if (g_speedFactor <= g_oldSpeedFactor) {
      this.unschedule(this.feverModeDecelerator);
      this._feverMode = false;
      this.setSpeedFactor(g_oldSpeedFactor);
      this._feverModeMask.runAction(cc.FadeOut.create(0.5));
      this._shield.runAction(cc.FadeOut.create(0.5));
    } else {
      this.incSpeedFactor(-0.1);
    }
  },
  feverModeSplash:function() {
    if (!this._feverMode) {
      this.unschedule(this.feverModeSplash);
      this._feverModeSplash.setVisible(false);
      this._shield.setVisible(false);
    } else {
      var curPosY = this._feverModeSplash.getPositionY();
      curPosY -= 30;
      if (curPosY + 1136 <= 0) {
        curPosY = 0;
      }
      this._feverModeSplash.setPositionY(curPosY);
    }
  },
  addBullet:function(bullet) {
    this._texOpaqueBatch.addChild(bullet, 13);
  },
  addEnemy:function(enemy) {
    this._texOpaqueBatch.addChild(enemy, 11);
  },
  addCoin:function(coin) {
    this._texOpaqueBatch.addChild(coin, 12);
  },
  addStar:function(star) {
    this._texOpaqueBatch.addChild(star, 12);
  },
  addObstacle:function(obstacle) {
    this._texOpaqueBatch.addChild(obstacle, 10);
  },
  addPickBuddy:function(buddy) {
    this._texOpaqueBatch.addChild(buddy, 10);
  },
  addEffect:function(effect) {
    this._effectLayer.addChild(effect);
  },
  addParticle:function(particle) {
    this._effectLayer.addChild(particle);
  },
  shock:function() {
    this.runAction(cc.Sequence.create(
      cc.MoveBy.create(0.05, cc.p(-20, 0)),
      cc.MoveBy.create(0.05, cc.p(30, 0)),
      cc.MoveBy.create(0.05, cc.p(-20, 0)),
      cc.MoveBy.create(0.05, cc.p(16, 0)),
      cc.MoveBy.create(0.05, cc.p(-12, 0)),
      cc.MoveBy.create(0.05, cc.p(6, 0))
    ));
  },
  onGameStart:function() {
    if (!this._started) {
      Effect.getOrCreateEffect("ready_go", cc.p(winSize.width / 2, winSize.height / 2));
      this.scheduleOnce(function() { 
        this._started = true 
        if (g_sharedGameManager.hasInitialFlight()) {
          this.initialFlight();
        }
      }, 5.0);
    }
  },
  onPause:function() {
    if (!this._paused) {
      g_sharedAudioManager.playPauseEffect();
      this._paused = true;
      this.setTouchEnabled(false);
      cc.Director.getInstance().pause();
      var pauseMenu = PauseMenu.create();
      this.addChild(pauseMenu, 1000, 1000);
      this.pauseMenu = pauseMenu;
      pauseMenu.resumeHandler = this.onResume.bind(this);
      pauseMenu.restartHandler = this.onRestart.bind(this);
      pauseMenu.backHandler = this.onBack.bind(this);
    }
  },
  onResume:function() {
    if (this._paused) {
      this._paused = false;
      this.setTouchEnabled(true);
      cc.Director.getInstance().resume();
      if (this.pauseMenu) {
        this.pauseMenu.removeFromParent();
        this.pauseMenu = null;
      }
    }
  },
  onRestart:function() {
    var menuScene = this.showMenuScene();
    var menuLayer = menuScene.getChildByTag(1);
    if (menuLayer) {
      menuLayer.onNewGame();
    }
  },
  onBack:function() {
    this.onGameOver();
  },
  onGameOver:function() {
    g_sharedAudioManager.playGameOverEffect();
    g_sharedGameManager.gameOver();
    this._paused = true;
    this.setSpeedFactor(0);
    this.setTouchEnabled(false);
    var gameOverMenu = GameOverMenu.create();
    this.addChild(gameOverMenu, 1000, 1000);
    this.gameOverMenu = gameOverMenu;
    gameOverMenu.confirmHandler = this.onGameOverConfirm.bind(this);
    if (KS.CONTAINER.BOSS) {
      KS.CONTAINER.BOSS.destroy();
    }
  },
  onGameOverConfirm:function() {
    this.showMenuScene();
  },
  showMenuScene:function() {
    g_sharedAudioManager.stopBackgroundMusic();
    var menuScene = new MenuScene();
    cc.Director.getInstance().resume();
    cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, menuScene));
    return menuScene;
  },
  onHeroDied:function() {
    this._buddies.forEach(function(buddy) { buddy.die(); });
    if (g_sharedGameManager.hasRevival()) {
      this.prepareForDeathProps();
      this.revival();
      g_sharedGameManager.useRevival();
    } else if (g_sharedGameManager.hasLeaderRevival()) {
      this.prepareForDeathProps();
      this.revival();
      g_sharedGameManager.useLeaderRevival();
    } else if (g_sharedGameManager.hasDeathFlight()) {
      this.prepareForDeathProps();
      this.deathFlight();
      g_sharedGameManager.useDeathFlight();
    } else {
      this.onGameOver();
    }
  },
  onCombo:function(combo) {
    this.comboLabel.setString('' + combo);
    this.comboSprite.stopAllActions();
    this.comboLabel.stopAllActions();
    var action = cc.Sequence.create(cc.FadeIn.create(0.15),
                                    cc.DelayTime.create(1),
                                    cc.FadeOut.create(0.3));
    this.comboSprite.runAction(action);
    this.comboLabel.runAction(action.clone());
  },
  onComboBreak:function() {
    this.comboSprite.stopAllActions();
    this.comboLabel.stopAllActions();
    this.comboLabel.setOpacity(0);
    this.comboSprite.setOpacity(0);
  },
  showPropsHint:function(name) {
    var hint = cc.Sprite.createWithSpriteFrameName('game_prop_' + name + '.png');
    hint.setPosition(winSize.width / 2, winSize.height * 2 / 3);
    hint.runAction(cc.Sequence.create(cc.Blink.create(3.0, 3), cc.CallFunc.create(function() {
      hint.removeFromParent(); 
    })));
    this.addChild(hint, 999);
  },
  prepareForDeathProps:function() {
    this._paused = true;
    this._started = false;
    g_oldSpeedFactor = g_speedFactor;
    this.setSpeedFactor(0);

    this._hero.reborn();
    this._buddies.forEach(function(buddy) { buddy.reborn(); });
    KS.CONTAINER.ALL_ENEMIES_DO(function(enemy) { enemy.die(); });
    KS.CONTAINER.OBSTACLES.forEach(function(obs) { if (obs.active) { obs.die(); } });
  },
  revival:function() {
    this.scheduleOnce(function() {
      g_sharedAudioManager.playRevivalEffect();
      this.showPropsHint('revival');
    }, 0.5);
    this.scheduleOnce(function() {
      this._paused = false;
      this.setSpeedFactor(g_oldSpeedFactor);
    }, 0.5 + 3.0);
    this.scheduleOnce(function() {
      this._started = true;
    }, 4.0 + 3.0);
  },
  deathFlight:function() {
    this.scheduleOnce(function() {
      g_sharedAudioManager.playPropsEffect();
      this.showPropsHint('death_flight');
    }, 1.0);
    this.scheduleOnce(function() {
      this._paused = false;
      this.setSpeedFactor(g_oldSpeedFactor);
      this.beginFeverMode();
      this._started = true;
      this.scheduleOnce(function() {
        this.endFeverMode();
        this.scheduleOnce(this.onGameOver, 2.0);
      }, 15.0); // 1000m
    }, 3.0);
  },
  initialFlight:function() {
    g_sharedAudioManager.playPropsEffect();
    this.showPropsHint('initial_flight');
    this.scheduleOnce(function() {
      this.beginFeverMode();
      this.scheduleOnce(function() { this.endFeverMode(); }, 12.0); // 800m
    }, 2.0);
  },
  pickBuddy:function() {
    for (var i = 0; i < 3; i++) {
      if (!this._topBuddies[i] || !this._topBuddies[i].active) {
        var buddy = new CatSprite(CharactorModel.randomPick());
        buddy.isTopBuddy = true;
        KS.CONTAINER.HEROES.push(buddy);
        buddy.setPositionY(this._hero.getPositionY() + 80);
        this._texOpaqueBatch.addChild(buddy, 14, 14);
        this._topBuddies[i] = buddy;
        break;
      }
    }
  },
  removeBuddy:function(buddy) {
    var i = KS.CONTAINER.HEROES.indexOf(buddy);
    if (i != -1) {
      KS.CONTAINER.HEROES.splice(i, 1);
    }
  },
  beginBossMode:function() {
    this._bossMode = true;
    this.scheduleOnce(function() {
      g_sharedAudioManager.playBossAppearEffect();
    }, 1.5);
    this.scheduleOnce(function() {
      var boss = new BossSprite(this._mapManager.stage + 1);
      this.addChild(boss, 10, 10);
      KS.CONTAINER.BOSS = boss;
      this._bossModeInBattle = true;
      this._mapManager.bossModeDidBegin();
    }, 3.0);
    this.switchBackground(0);
  },
  endBossMode:function() {
    KS.CONTAINER.BOSS.removeFromParent();
    delete KS.CONTAINER.BOSS;
    this._mapManager.bossModeDidEnd();
    this._bossModeInBattle = false;
    Background.preSet(this._mapManager.stage + 1);
    this.scheduleOnce(function() {
      this._bossMode = false;
      this.switchBackground(this._mapManager.stage + 1);
    }, 3.0);
  }
});

g_gameScoreFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 34,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentH: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(255, 255, 255),
  strokeEnabled: true,
  strokeColor: cc.c3b(255, 255, 255),
  strokeSize: 0.5,
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_gameDistanceFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 34,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentH: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(46, 167, 224),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_gameCoinFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 34,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentH: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_gameComboFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 52,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontFillColor: cc.c3b(237, 28, 36),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

