var UpgradeConfirmPopup = DetailPopup.extend({
  ctor:function() {
    this._super();
  },
  init:function() {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.initContent();
    this.initMenu();

    return true;
  },
  initContent:function() {
    var content = cc.Sprite.create('res/menu_charactor_upgrade_topup_content.png');
    this.addChild(content, 1, 2);
    content.setPosition(winSize.width / 2, winSize.height / 2 + 100);
  },
  initMenu:function() {
    var topupBtnNormal = cc.Sprite.create('res/menu_charactor_upgrade_topup_btn_normal.png');
    var topupBtnSelected = cc.Sprite.create('res/menu_charactor_upgrade_topup_btn_selected.png');
    var topupBtn = cc.MenuItemSprite.create(topupBtnNormal, topupBtnSelected, this.onTopup, this);
    var cancelBtnNormal = cc.Sprite.create('res/menu_charactor_upgrade_cancel_btn_normal.png');
    var cancelBtnSelected = cc.Sprite.create('res/menu_charactor_upgrade_cancel_btn_selected.png');
    var cancelBtn = cc.MenuItemSprite.create(cancelBtnNormal, cancelBtnSelected, this.onCancel, this);
    var menu = cc.Menu.create(topupBtn, cancelBtn);
    menu.alignItemsHorizontallyWithPadding(30);
    menu.setPosition(winSize.width / 2, winSize.height / 2 - 210);
    this.addChild(menu, 1, 2);
  },
  onTopup:function() {
    var charactorMenu = this.getParent();
    if (charactorMenu) {
      charactorMenu.hidePopupLayer();
      var mainMenu = charactorMenu.getParent();
      if (mainMenu) {
        mainMenu.hidePopupLayer();
        mainMenu.onShop();
      }
    }
  },
  onCancel:function() {
    if (this.getParent()) {
      this.getParent().hidePopupLayer();
    }
  }
});

UpgradeConfirmPopup.create = function() {
  var layer = new UpgradeConfirmPopup();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
};

