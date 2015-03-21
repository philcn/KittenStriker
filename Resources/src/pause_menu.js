var PauseMenu = cc.Layer.extend({
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.initContainer();
    this.initControls();
    this.initMenu();

    return true;
  },
  initContainer:function() {
    var mask = cc.Sprite.create('res/game_pause_mask.png');
    this.addChild(mask, 0, 1);
    mask.setPosition(winSize.width / 2, winSize.height / 2);

    var container = cc.Sprite.create('res/game_pause_container.png');
    this.addChild(container, 1, 1);
    container.setPosition(winSize.width / 2, winSize.height / 2);
  },
  initControls:function() {
    var settingLayer = new SettingLayer();
    settingLayer.init();
    this.addChild(settingLayer, 2, 2);
  },
  initMenu:function() {
    var resumeBtnNormal = cc.Sprite.create('res/game_pause_btn_resume_normal.png')
    var resumeBtnSelected = cc.Sprite.create('res/game_pause_btn_resume_selected.png')
    var resumeBtn = cc.MenuItemSprite.create(resumeBtnNormal, resumeBtnSelected, this.onResume, this);
    var resumeLabel = cc.LabelTTF.createWithFontDefinition("继续游戏", g_buttonCaptionFontDef);
    resumeBtn.addChild(resumeLabel);
    resumeLabel.setPosition(64, -20);

    var restartBtnNormal = cc.Sprite.create('res/game_pause_btn_restart_normal.png')
    var restartBtnSelected = cc.Sprite.create('res/game_pause_btn_restart_selected.png')
    var restartBtn = cc.MenuItemSprite.create(restartBtnNormal, restartBtnSelected, this.onRestart, this);
    var restartLabel = cc.LabelTTF.createWithFontDefinition("重新开始", g_buttonCaptionFontDef);
    restartBtn.addChild(restartLabel);
    restartLabel.setPosition(64, -20);

    var backBtnNormal = cc.Sprite.create('res/game_pause_btn_back_normal.png')
    var backBtnSelected = cc.Sprite.create('res/game_pause_btn_back_selected.png')
    var backBtn = cc.MenuItemSprite.create(backBtnNormal, backBtnSelected, this.onBack, this);
    var backLabel = cc.LabelTTF.createWithFontDefinition("返回首页", g_buttonCaptionFontDef);
    backBtn.addChild(backLabel);
    backLabel.setPosition(64, -20);

    var menu = cc.Menu.create(resumeBtn, restartBtn, backBtn);
    menu.alignItemsHorizontallyWithPadding(30);
    this.addChild(menu, 1, 2);
    menu.setPosition(winSize.width / 2, winSize.height / 2 - 200);
  },
  onResume:function() {
    g_sharedAudioManager.playPauseEffect();
    this.resumeHandler();
  },
  onRestart:function() {
    g_sharedAudioManager.playPauseEffect();
    this.restartHandler();
  },
  onBack:function() {
    g_sharedAudioManager.playPauseEffect();
    this.backHandler();
  }
});

PauseMenu.create = function() {
  var layer = new PauseMenu();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

g_buttonCaptionFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 26, 
  fontFillColor: cc.c3b(106, 57, 7),
  shadowEnabled: false
};

g_pauseSettingCaptionFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 32, 
  fontFillColor: cc.c3b(251, 176, 59),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};
