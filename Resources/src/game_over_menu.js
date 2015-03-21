var GameOverMenu = cc.Layer.extend({
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.score = g_sharedGameManager.score;
    this.distance = g_sharedGameManager.distance;
    this.combo = g_sharedGameManager.maxCombo;
    this.coin = g_sharedGameManager.coin;

    this.initContainer();
    this.initFields();
    this.initMenu();

    return true;
  },
  initContainer:function() {
    var mask = cc.Sprite.create('res/game_pause_mask.png');
    this.addChild(mask, 0, 1);
    mask.setPosition(winSize.width / 2, winSize.height / 2);

    var container = cc.Sprite.create('res/game_over_container.png');
    this.addChild(container, 1, 1);
    container.setPosition(winSize.width / 2, winSize.height / 2);

    var yourScore = cc.Sprite.create('res/game_over_your_score.png');
    this.addChild(yourScore, 1, 1);
    yourScore.setPosition(winSize.width / 2, winSize.height / 2 + 458);

    if (g_sharedGameManager.newRecord) {
      var newRecord = cc.Sprite.create('res/game_over_new_record.png');
      this.addChild(newRecord, 1, 1);
      newRecord.setPosition(winSize.width / 2 + 170, winSize.height / 2 + 286);
    }

    if (g_sharedGameManager.has2xGold()) {
      var goldX2 = cc.Sprite.create('res/game_over_gold_x2.png');
      this.addChild(goldX2, 1, 1);
      goldX2.setPosition(winSize.width / 2 - 96, 428);
    }
  },
  initFields:function() {
    var topScoreLabel = cc.LabelTTF.createWithFontDefinition(this.score, g_gameOverTopScoreFontDef);
    topScoreLabel.setPosition(winSize.width / 2, winSize.height / 2 + 284);

    var scoreCaption = cc.LabelTTF.createWithFontDefinition("分数", g_gameOverCaptionFontDef);
    scoreCaption.setPosition(150, 720);
    scoreCaption.setAnchorPoint(cc.p(0, 0.5));

    var distanceCaption = cc.LabelTTF.createWithFontDefinition("路程", g_gameOverCaptionFontDef);
    distanceCaption.setPosition(150, 640);
    distanceCaption.setAnchorPoint(cc.p(0, 0.5));

    var comboCaption = cc.LabelTTF.createWithFontDefinition("连续击怪", g_gameOverCaptionFontDef);
    comboCaption.setPosition(150, 560);
    comboCaption.setAnchorPoint(cc.p(0, 0.5));

    var scoreLabel = cc.LabelTTF.createWithFontDefinition(this.score, g_gameOverFieldFontDef);
    scoreLabel.setPosition(500, 720);
    scoreLabel.setAnchorPoint(cc.p(1, 0.5));

    var distanceLabel = cc.LabelTTF.createWithFontDefinition(this.distance + " m", g_gameOverFieldFontDef);
    distanceLabel.setPosition(500, 640);
    distanceLabel.setAnchorPoint(cc.p(1, 0.5));

    var comboLabel = cc.LabelTTF.createWithFontDefinition(this.combo, g_gameOverFieldFontDef);
    comboLabel.setPosition(500, 560);
    comboLabel.setAnchorPoint(cc.p(1, 0.5));

    var coinLabel = cc.LabelTTF.createWithFontDefinition(this.coin, g_gameOverCoinFontDef);
    coinLabel.setPosition(508, 422);
    coinLabel.setAnchorPoint(cc.p(1, 0.5));

    this.addChild(topScoreLabel, 2, 2);
    this.addChild(scoreCaption, 2, 2);
    this.addChild(distanceCaption, 2, 2);
    this.addChild(comboCaption, 2, 2);
    this.addChild(scoreLabel, 2, 2);
    this.addChild(distanceLabel, 2, 2);
    this.addChild(comboLabel, 2, 2);
    this.addChild(coinLabel, 2, 2);
  },
  initMenu:function() {
    var okBtnNormal = cc.Sprite.create('res/game_over_btn_ok_normal.png')
    var okBtnSelected = cc.Sprite.create('res/game_over_btn_ok_selected.png')
    var okBtn = cc.MenuItemSprite.create(okBtnNormal, okBtnSelected, this.onConfirm, this);

    var menu = cc.Menu.create(okBtn);
    this.addChild(menu, 1, 2);
    menu.setPosition(winSize.width / 2, winSize.height / 2 - 280);
  },
  onConfirm:function() {
    g_sharedAudioManager.playButtonEffect();
    this.confirmHandler();
  }
});

GameOverMenu.create = function(score, distance, combo, coin) {
  var layer = new GameOverMenu();
  if (layer && layer.init(score, distance, combo, coin)) {
    return layer;
  }
  return null;
};

g_gameOverTopScoreFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 52, 
  fontFillColor: cc.c3b(255, 255, 255),
  shadowEnabled: false
};

g_gameOverCaptionFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 32, 
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_gameOverFieldFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 32, 
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_gameOverCoinFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 40, 
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};
