var g_sharedMenuLayer;
var g_sharedGameManager;
var g_sharedGameData;
var g_sharedAudioManager;

var MainMenu = cc.Layer.extend({
  coinLabel:null,
  attackLabel:null,
  leaderFeatureLabel:null,
  mainMenuLayer:null,
  activePopupLayer:null,
  teamShow:null,
  leaderFeature:null,
  _lockTouches:false,
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    g_initKSGameConfig();

    g_sharedMenuLayer = this;
    g_sharedGameData = GameData.getInstance();
    g_sharedAudioManager = AudioManager.getInstance();
    Background.preSetMenu(1);
    this.initMovingBackground();

    this.mainMenuLayer = cc.Layer.create();
    this.addChild(this.mainMenuLayer, 10, 10);
    this.models = g_sharedGameData.getCharactorModels();

    this.initTopMenu();
    this.initBottonMenu();
    this.initCoinField();
    this.initTeamShow();
    this.initPropsView();
    this.initLeaderFeatureView();
    this.onTeamChanged();

    return true;
  },
  onEnter:function() {
    this._super();
    if (g_sharedGameData.getMusic()) {
      this.scheduleOnce(function() {
        g_sharedAudioManager.enableMusic();
      }, 0.8);
    } else {
      g_sharedAudioManager.disableMusic();
    }
    if (g_sharedGameData.getSound()) {
      g_sharedAudioManager.enableEffect();
    } else {
      g_sharedAudioManager.disableEffect();
    }
  },
  initMovingBackground:function() {
    this._bg = Background.getOrCreateMenu();
    this._bgHeight = this._bg.getContentSize().height;
    this._bgAlt = Background.getOrCreateMenu();
    this._bgAlt.setPositionY(this._bgHeight - 2);
    var moveBackground = cc.MoveBy.create(this._bgHeight / 300, cc.p(0, -this._bgHeight));
    var resetBackground = cc.MoveBy.create(0, cc.p(0, this._bgHeight));
    var moveAndReset = cc.Sequence.create(moveBackground, resetBackground);
    var moveForever = cc.RepeatForever.create(moveAndReset);
    var speededMoveForever = cc.Speed.create(moveForever, 1.0);
    speededMoveForever.setTag(9999);

    this._bg.runAction(speededMoveForever);
    this._bgAlt.runAction(speededMoveForever.clone());
  },
  initTopMenu:function() {
    var shopBtnNormal = cc.Sprite.create('res/menu_btn_shop_normal.png');
//  var taskBtnNormal = cc.Sprite.create('res/menu_btn_task_normal.png');
    var settingBtnNormal = cc.Sprite.create('res/menu_btn_setting_normal.png');
    var shopBtnSelected = cc.Sprite.create('res/menu_btn_shop_selected.png');
//  var taskBtnSelected = cc.Sprite.create('res/menu_btn_task_selected.png');
    var settingBtnSelected = cc.Sprite.create('res/menu_btn_setting_selected.png');

    var shopBtn = cc.MenuItemSprite.create(shopBtnNormal, shopBtnSelected, this.onShop, this);
//  var taskBtn = cc.MenuItemSprite.create(taskBtnNormal, taskBtnSelected, this.onTask, this);
    var settingBtn = cc.MenuItemSprite.create(settingBtnNormal, settingBtnSelected, this.onSetting, this);

//  var topMenu = cc.Menu.create(shopBtn, taskBtn, settingBtn);
    var topMenu = cc.Menu.create(shopBtn, settingBtn);
    topMenu.alignItemsHorizontallyWithPadding(10);
    this.mainMenuLayer.addChild(topMenu, 1, 2);
//  topMenu.setPosition(winSize.width - 180, winSize.height - 60);
    topMenu.setPosition(winSize.width - 120, winSize.height - 60);
  },
  initBottonMenu:function() {
    var startBtnNormal = cc.Sprite.create('res/menu_btn_start_normal.png');
    var startBtnSelected = cc.Sprite.create('res/menu_btn_start_selected.png');
    var startBtn = cc.MenuItemSprite.create(startBtnNormal, startBtnSelected, this.onNewGame, this);

/*
    var synthesisBtnNormal = cc.Sprite.create('res/menu_btn_synthesis_normal.png');
    var recruitBtnNormal = cc.Sprite.create('res/menu_btn_recruit_normal.png');
    var synthesisBtnSelected = cc.Sprite.create('res/menu_btn_synthesis_selected.png');
    var recruitBtnSelected = cc.Sprite.create('res/menu_btn_recruit_selected.png');
    var synthesisBtn = cc.MenuItemSprite.create(synthesisBtnNormal, synthesisBtnSelected, this.onSynthesis, this);
    var recruitBtn = cc.MenuItemSprite.create(recruitBtnNormal, recruitBtnSelected, this.onRecruit, this);

    var bottomMenu = cc.Menu.create(recruitBtn, startBtn, synthesisBtn);
*/
    var bottomMenu = cc.Menu.create(startBtn);
    bottomMenu.alignItemsHorizontallyWithPadding(30);
    this.mainMenuLayer.addChild(bottomMenu, 10, 10);
    bottomMenu.setPosition(winSize.width / 2, 100);
  },
  initCoinField:function() {
    var coinField = cc.Sprite.create('res/menu_coin_field.png');
    var label = cc.LabelTTF.createWithFontDefinition(g_sharedGameData.getGold(), g_coinFontDef);
    this.coinLabel = label;
    label.setAnchorPoint(cc.p(1, 0));
    coinField.addChild(label);
    label.setPosition(200 - 28, 10);

    var addBtnNormal = cc.Sprite.create('res/menu_coin_field_add_normal.png');
    var addBtnSelected = cc.Sprite.create('res/menu_coin_field_add_selected.png');
    var addBtn = cc.MenuItemSprite.create(addBtnNormal, addBtnSelected, this.onAddCoin, this);
    var menu = cc.Menu.create(addBtn);

    coinField.addChild(menu);
    menu.setPosition(224-20, 28);

    this.mainMenuLayer.addChild(coinField, 1, 2);
    coinField.setAnchorPoint(cc.p(0, 1));
    coinField.setPosition(16, winSize.height - 16);
  },
  initTeamShow:function() {
    var teamShow = TeamShowLayer.create('triangle', this.models);
    this.teamShow = teamShow;
    teamShow.onTeamChanged = this.onTeamChanged.bind(this);

    var attackTitle = cc.Sprite.create('res/menu_attack_title.png');
    teamShow.addChild(attackTitle);
    attackTitle.setPosition(-44, -184);

    var attackLabel = cc.LabelTTF.createWithFontDefinition('', g_coinFontDef);
    this.attackLabel = attackLabel;
    teamShow.addChild(attackLabel);
    attackLabel.setPosition(44, -188);

    this.mainMenuLayer.addChild(teamShow, 2, 2);
    teamShow.setPosition(winSize.width / 2, winSize.height - 310);
  },
  initLeaderFeatureView:function() {
    var background = cc.Sprite.create('res/menu_leader_feature_background.png');

    var label = cc.LabelTTF.createWithFontDefinition('', g_descLabelFontDef);
    this.leaderFeatureLabel = label;
    background.addChild(label);
    label.setPosition(background.getContentSize().width / 2, background.getContentSize().height / 2);

    this.mainMenuLayer.addChild(background);
    background.setPosition(winSize.width / 2, winSize.height / 2);
  },
  initPropsView:function() {
    var background = cc.Sprite.create('res/menu_props_background.png');

    this.mainMenuLayer.addChild(background);
    background.setPosition(winSize.width / 2, winSize.height / 2 - 134 - 30 - 16);

    var tableView = cc.TableView.create(this, cc.size(564, 232));
    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
    tableView.setPosition(38, 270);
    tableView.setDelegate(this);
    this.mainMenuLayer.addChild(tableView, 10, 10);
    tableView.reloadData();

    var canBackground = cc.Sprite.create('res/menu_can_background.png');
    this.mainMenuLayer.addChild(canBackground, 9, 9);
    canBackground.setPosition(winSize.width / 2, 100);
    canBackground.setAnchorPoint(cc.p(0.5, 0));
    this.canBackground = canBackground;

    var canResultBottomLabel = cc.LabelTTF.createWithFontDefinition('', g_canResultBottomLabelFontDef);
    canBackground.addChild(canResultBottomLabel);
    canResultBottomLabel.setPosition(canBackground.getContentSize().width / 2, canBackground.getContentSize().height / 2 + 14);
    this.canResultBottomLabel = canResultBottomLabel;

    this.canBackground.setVisible(false);
  },
  numberOfCellsInTableView:function(tableView) {
    return KS.PROPS.length;
  },
  tableCellAtIndex:function(tableView, idx) {
    var cell = tableView.dequeueCell();
    var prop = KS.PROPS[idx];
    if (!cell) {
      cell = new PropsTableViewCell();
      cell.init(prop);
    } else {
      cell.setProp(prop);
    }
    return cell;
  },
  tableCellSizeForIndex:function(tableView, idx) {
    return cc.size(184, 232);
  },
  tableCellTouched:function(tableView, cell) {
    if (this._lockTouches) {
      return;
    }
    if (cell.getIdx() == 0) {
      this.openCan();
      g_sharedAudioManager.playUpgradeEffect();
    } else {
      this.onButtonEffect();
      this.toggleProps(cell);
    }
  },
  toggleProps:function(cell) {
    var idx = cell.getIdx();
    var price = KS.PROPS[idx].price;
    if (!cell._isSelected) {
      if (g_sharedGameData.checkGold(KS.GAMECONFIG.PROPS_TOTAL_PRICE + price)) {
        KS.GAMECONFIG.PROPS_TOTAL_PRICE += price;
        KS.GAMECONFIG.PROPS[idx - 1] = true;
        cell.toggleSelected();
      } else {
        this.showBuyPropsInsufficientGold();
      }
    } else {
      KS.GAMECONFIG.PROPS_TOTAL_PRICE -= price;
      KS.GAMECONFIG.PROPS[idx - 1] = false;
      cell.toggleSelected();
    }
  },
  openCan:function() {
    // check money and prompt or consume
    if (!g_sharedGameData.tryConsumeGold(KS.PROPS[0].price)) {
      this.showBuyPropsInsufficientGold();
      return;
    }

    // random and show result
    var range = KS.CAN_BONUS.length;
    if (KS.GAMECONFIG.LEADER_GOLD_X2) {
      range -= 1;
    }
    var idx = Math.floor(Math.random() * range);
    var bonus = KS.CAN_BONUS[idx];

    var canResult = cc.Sprite.create('res/menu_can_result_background.png');
    canResult.setPosition(winSize.width / 2, winSize.height / 2);
    this.addChild(canResult, 100, 100);
    var canResultLabel = cc.LabelTTF.createWithFontDefinition(bonus.name, g_canResultLabelFontDef);
    canResult.addChild(canResultLabel);
    canResultLabel.setPosition(winSize.width / 2, winSize.height / 2 + 100);
    this._lockTouches = true;

    this.scheduleOnce(function() { canResult.removeFromParent(); this._lockTouches = false; }, 2.5);

    this.canResultBottomLabel.setString(bonus.name);
    this.canBackground.setVisible(true);
    this.updateGoldLabel();

    KS.GAMECONFIG.GOLD_X2 = false;
    KS.GAMECONFIG.ATTACK_FACTOR_1 = 1.0;
    KS.GAMECONFIG.FREQ_FACTOR_1 = 1.0;
    if (bonus.type == "gold") {
      KS.GAMECONFIG.GOLD_X2 = true;
    } else if (bonus.type == "attack") {
      KS.GAMECONFIG.ATTACK_FACTOR_1 = bonus.value;
    } else if (bonus.type == "frequency") {
      KS.GAMECONFIG.FREQ_FACTOR_1 = bonus.value;
    }
    this.updateAttackLabel();
  },
  showBuyPropsInsufficientGold:function() {
    if (!this.insufficientGoldHud) {
      var sprite = cc.Sprite.create('res/menu_insufficient_gold_hud.png');
      sprite.setOpacity(0);
      sprite.setPosition(winSize.width / 2, winSize.height / 2);
      this.addChild(sprite, 100, 100);
      this.insufficientGoldHud = sprite;
      var that = this;
      sprite.runAction(cc.Sequence.create(
            cc.FadeIn.create(0.2), 
            cc.DelayTime.create(1.5), 
            cc.FadeOut.create(0.2), 
            cc.CallFunc.create(function() { 
              that.insufficientGoldHud.removeFromParent();
              that.insufficientGoldHud = null;
            })
      ));
    }
  },
  onTeamChanged:function(models) {
    if (models) {
      this.models = models;
    }
    g_sharedGameData.updateCharactorModels(this.models);
    KS.GAMECONFIG.ATTACK_FACTOR_2 = 1.0;
    KS.GAMECONFIG.FREQ_FACTOR_2 = 1.0;
    KS.GAMECONFIG.LEADER_REVIVAL = false;
    KS.GAMECONFIG.LEADER_GOLD_X2 = false;
    if (this.models[0]) {
      this.leaderFeatureLabel.setString("队长特技：" + this.models[0].featureDescription);
      this.leaderFeature = this.models[0].feature;
      if (this.leaderFeature) {
        switch (this.leaderFeature.type) {
          case 'attack':
            KS.GAMECONFIG.ATTACK_FACTOR_2 = this.leaderFeature.value;
            break;
          case 'frequency':
            KS.GAMECONFIG.FREQ_FACTOR_2 = this.leaderFeature.value;
            break;
          case 'revival':
            KS.GAMECONFIG.LEADER_REVIVAL = true;
            break;
          case 'gold':
            KS.GAMECONFIG.LEADER_GOLD_X2 = true;
            break;
        }
      }
    }
    this.updateAttackLabel();
    this.teamShow.initModels(this.models);
  },
  updateAttackLabel:function() {
    var attack = 0;
    for (var i = 0; i < Math.min(4, this.models.length); i++) {
      attack += this.models[i].attack;
    }
    attack *= KS.GAMECONFIG.ATTACK_FACTOR_1 * KS.GAMECONFIG.ATTACK_FACTOR_2;
    this.attackLabel.setString(Math.floor(attack).toString());
  },
  initGameManager:function() {
    if (g_sharedGameManager) {
      delete g_sharedGameManager;
      g_sharedGameManager = null;
    }
    g_sharedGameManager = new GameManager();
    if (KS.GAMECONFIG.PROPS[0]) {
      g_sharedGameManager.getInitialFlight();
    }
    if (KS.GAMECONFIG.PROPS[1]) {
      g_sharedGameManager.getDeathFlight();
    }
    if (KS.GAMECONFIG.PROPS[2]) {
      g_sharedGameManager.getRevival();
    }
    if (KS.GAMECONFIG.LEADER_REVIVAL) {
      g_sharedGameManager.getLeaderRevival();
    }
    if (KS.GAMECONFIG.GOLD_X2 || KS.GAMECONFIG.LEADER_GOLD_X2) {
      g_sharedGameManager.get2xGold();
    }
    g_sharedGameManager.getIncFreq(KS.GAMECONFIG.FREQ_FACTOR_1 * KS.GAMECONFIG.FREQ_FACTOR_2);
    g_sharedGameManager.getIncAttack(KS.GAMECONFIG.ATTACK_FACTOR_1 * KS.GAMECONFIG.ATTACK_FACTOR_2);
  /*
  cc.log("FF1:"+KS.GAMECONFIG.FREQ_FACTOR_1+", FF2:"+KS.GAMECONFIG.FREQ_FACTOR_2);
  cc.log("AF1:"+KS.GAMECONFIG.ATTACK_FACTOR_1+", AF2:"+KS.GAMECONFIG.ATTACK_FACTOR_2);
  cc.log("LR:"+KS.GAMECONFIG.LEADER_REVIVAL);
  cc.log("LG:"+KS.GAMECONFIG.LEADER_GOLD_X2);
  */
  },
  onNewGame:function(sender) {
    if (!g_sharedGameData.tryConsumeGold(KS.GAMECONFIG.PROPS_TOTAL_PRICE)) {
      this.onButtonEffect();
      this.showBuyPropsInsufficientGold();
    } else {
      g_sharedAudioManager.playStartEffect();
      g_sharedAudioManager.stopBackgroundMusic();
      this.initGameManager();
      g_initKSContainer();
      cc.Loader.preload([], function() {
        var gameScene = new GameScene(this.models);
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, gameScene));
      }, this);
    }
  },
  /*
  onSynthesis:function(sender) {
    this.onButtonEffect();
    var popup = SynthesisMenu.create();
    this.showPopupLayer(popup);
  },
  onRecruit:function(sender) {
    this.onButtonEffect();
    var popup = RecruitMenu.create();
    this.showPopupLayer(popup);
  },
  */
  onCharactorTapped:function(index) {
    this.onButtonEffect();
    if (this.models[index]) {
      var popup = CharactorMenu.create(this.models[index]);

      popup.onTeamChanged = this.onTeamChanged.bind(this);
      this.showPopupLayer(popup);
    }
  },
  onShop:function(sender) {
    this.onButtonEffect();
    var popup = ShopMenu.create();
    this.showPopupLayer(popup);
  },
  /*
  onTask:function(sender) {
    this.onButtonEffect();
    var popup = TaskMenu.create();
    this.showPopupLayer(popup);
  },
  */
  onSetting:function(sender) {
    this.onButtonEffect();
    var popup = SettingMenu.create();
    this.showPopupLayer(popup);
  },
  onAddCoin:function(sender) {
    this.onButtonEffect();
    this.onShop();
  },
  onButtonEffect:function() {
    g_sharedAudioManager.playButtonEffect();
  },
  updateGoldLabel:function() {
    this.coinLabel.setString(g_sharedGameData.getGold());
  },
  showPopupLayer:function(popup) {
    this.mainMenuLayer.setVisible(false);
    this.mainMenuLayer.setTouchEnabled(false);
    this.teamShow.setTouchEnabled(false);
    this.addChild(popup, 100, 100);
    this.activePopupLayer = popup;
    popup.onHide = this.hidePopupLayer.bind(this);
    this._lockTouches = true;
  },
  hidePopupLayer:function() {
    this.mainMenuLayer.setVisible(true);
    this.mainMenuLayer.setTouchEnabled(true);
    this.teamShow.setTouchEnabled(true);
    if (this.activePopupLayer) {
      this.activePopupLayer.removeFromParent();
      this.activePopupLayer = null;
    }
    this.updateGoldLabel();
    this._lockTouches = false;
  }
});

MainMenu.create = function() {
  var layer = new MainMenu();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

g_coinFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 26,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentH: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(247, 181, 44),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_propGoldFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 22,
  alignment: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentH: cc.TEXT_ALIGNMENT_LEFT,
  fontAlignmentV: cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(247, 181, 44),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_canResultLabelFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 36,
  alignment: cc.TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(145, 38, 143),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_canResultBottomLabelFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 22,
  alignment: cc.TEXT_ALIGNMENT_CENTER,
  fontFillColor: cc.c3b(255, 255, 255),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_descLabelFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 24, 
  fontFillColor: cc.c3b(255, 255, 255),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};
