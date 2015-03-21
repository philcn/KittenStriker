var PopupMenu = cc.Layer.extend({
  coinLabel:null,
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.initContainer();
    this.initCoinField();
    this.initBackMenu();

    return true;
  },
  initContainer:function() {
    var container = cc.Sprite.create('res/menu_popup_container.png');
    this.addChild(container, 0, 1);
    container.setPosition(winSize.width / 2, winSize.height / 2);
  },
  initCoinField:function() {
    var coinField = cc.Sprite.create('res/menu_coin_field.png');
    var label = cc.LabelTTF.createWithFontDefinition(g_sharedGameData.getGold(), g_coinFontDef);
    this.coinLabel = label;
    label.setAnchorPoint(cc.p(1, 0));
    coinField.addChild(label);
    label.setPosition(200, 10);

    this.addChild(coinField, 1, 2);
    coinField.setAnchorPoint(cc.p(0, 1));
    coinField.setPosition(winSize.width / 2 - 250, winSize.height / 2 + 450);
  },
  initBackMenu:function() {
    var backBtnNormal = cc.Sprite.create('res/menu_popup_btn_back_normal.png');
    var backBtnSelected = cc.Sprite.create('res/menu_popup_btn_back_selected.png');
    var backBtn = cc.MenuItemSprite.create(backBtnNormal, backBtnSelected, this.onBack, this);
    var backMenu = cc.Menu.create(backBtn);
    this.addChild(backMenu, 1, 2);
    backMenu.setPosition(winSize.width / 2 - 250, winSize.height / 2 - 450);
  },
  onBack:function() {
    this.onButtonEffect();
    this.onHide();
  },
  onButtonEffect:function() {
    g_sharedAudioManager.playButtonEffect();
  },
  updateGoldLabel:function() {
    this.coinLabel.setString(g_sharedGameData.getGold());
  }
});
    
PopupMenu.create = function() {
  var layer = new PopupMenu();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

