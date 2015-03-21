var ShopMenu = PopupMenu.extend({
  prices:[6, 12, 30, 68],
  counts:[3600, 7800, 21000, 54000],
  iap:null,
  ctor:function() {
    this._super();
  },
  init:function() {
    this._super();

    this.initGolds();
    this.initIAP();
    return true;
  },
  initIAP:function() {
    var that = this;
    this.iap = IAPBinding.IOSiAP();
    this.iap.onRequestProductsFinish = function () {
//    cc.log("iap request finish");
      this.setButtonsEnabled(true);
    }.bind(this);
    this.iap.onRequestProductsError = function (code) {
//    cc.log("iap request error:" + code);
      this.setButtonsEnabled(true);
    }.bind(this);
    this.iap.onPaymentEvent = function(identifier, eventCode, quantity) {
      var eventString = "";
      switch (eventCode) {
        case 0:
          eventString = "purchasing";
          break;
        case 1:
          eventString = "purchase success";
          that.onBuyGoldSuccess(identifier);
          break;
        case 2:
          eventString = "purchase Failed";
          break;
        case 3:
          eventString = "purchase restored";
          break;
        case 4:
          eventString = "purchase removed";
          this.setButtonsEnabled(true);
          break;
      }
//    cc.log(eventString);
    }.bind(this);

    this.iap.requestProducts(KS.IAP_IDENTIFIERS);
    this.setButtonsEnabled(false);
  },
  initGolds:function() {
//  var catmint = cc.Sprite.create('res/menu_shop_catmint.png');
    var gold1 = cc.Sprite.create('res/menu_shop_gold1.png');
    var gold2 = cc.Sprite.create('res/menu_shop_gold2.png');
    var gold3 = cc.Sprite.create('res/menu_shop_gold3.png');
    var gold4 = cc.Sprite.create('res/menu_shop_gold4.png');
    this.addChild(gold1);
    this.addChild(gold2);
    this.addChild(gold3);
    this.addChild(gold4);
    gold1.setPosition(192, 788);
    gold2.setPosition(448, 788);
    gold3.setPosition(192, 436);
    gold4.setPosition(448, 426);

    var btnN = 'res/menu_shop_btn_normal.png';
    var btnS = 'res/menu_shop_btn_selected.png';
    var btnD = 'res/menu_shop_btn_disabled.png';
//  var btnGoldNormalFile = 'res/menu_shop_btn_gold_normal.png';
//  var btnGoldSelectedFile = 'res/menu_shop_btn_gold_selected.png';
//  var btn1 = cc.MenuItemSprite.create(cc.Sprite.create(btnGoldNormalFile), cc.Sprite.create(btnGoldSelectedFile), this.onBuyMint.bind(this), this);
    var btn1 = cc.MenuItemSprite.create(cc.Sprite.create(btnN), cc.Sprite.create(btnS), cc.Sprite.create(btnD), this.onBuyGold.bind(this, 1), this);
    var btn2 = cc.MenuItemSprite.create(cc.Sprite.create(btnN), cc.Sprite.create(btnS), cc.Sprite.create(btnD), this.onBuyGold.bind(this, 2), this);
    var btn3 = cc.MenuItemSprite.create(cc.Sprite.create(btnN), cc.Sprite.create(btnS), cc.Sprite.create(btnD), this.onBuyGold.bind(this, 3), this);
    var btn4 = cc.MenuItemSprite.create(cc.Sprite.create(btnN), cc.Sprite.create(btnS), cc.Sprite.create(btnD), this.onBuyGold.bind(this, 4), this);
    var upperMenu = cc.Menu.create(btn1, btn2);
    upperMenu.alignItemsHorizontallyWithPadding(56);
    this.addChild(upperMenu);
    upperMenu.setPosition(winSize.width / 2, 610);
    var lowerMenu = cc.Menu.create(btn3, btn4);
    lowerMenu.alignItemsHorizontallyWithPadding(56);
    this.addChild(lowerMenu);
    lowerMenu.setPosition(winSize.width / 2, 248);

    this.createPriceLabel(0, btn1);
    this.createPriceLabel(1, btn2);
    this.createPriceLabel(2, btn3);
    this.createPriceLabel(3, btn4);

    this.createCountLabel(0, btn1);
    this.createCountLabel(1, btn2);
    this.createCountLabel(2, btn3);
    this.createCountLabel(3, btn4);

    this.btn1 = btn1;
    this.btn2 = btn2;
    this.btn3 = btn3;
    this.btn4 = btn4;
  },
  createPriceLabel:function(index, btn) {
    var text = this.prices[index];
    var x = 98; // 108 for mint label
    var y = 42;
    text = "￥" + text;
    var label = cc.LabelTTF.create(text, 'FZDHTJW--GB1-0.ttf', 40);
    btn.addChild(label);
    label.setPosition(x, y);
    label.setAnchorPoint(cc.p(0.5, 0.5));
    label.setColor(cc.c3b(0, 0, 0));
    return label;
  },
  createCountLabel:function(index, btn) {
    var label = cc.LabelTTF.createWithFontDefinition(this.counts[index], g_shopCountLabelFontDef);
    btn.addChild(label);
    label.setAnchorPoint(cc.p(0.5, 0));
    label.setPosition(98, 84+8);
    return label;
  },
  setButtonsEnabled:function(enabled) {
    this.btn1.setEnabled(enabled);
    this.btn2.setEnabled(enabled);
    this.btn3.setEnabled(enabled);
    this.btn4.setEnabled(enabled);
  },
  onBuyGold:function(index) {
    this.onButtonEffect();
    var identifier = KS.IAP_IDENTIFIERS[index - 1];
    var product = this.iap.iOSProductByIdentifier(identifier);
    this.iap.paymentWithProduct(product, 1);
    this.setButtonsEnabled(false);
  },
  onBuyGoldSuccess:function(identifier) {
    var index = KS.IAP_IDENTIFIERS.indexOf(identifier);
    if (index != -1) {
      g_sharedGameData.incGold(this.counts[index]);
      g_sharedMenuLayer.updateGoldLabel();
      this.updateGoldLabel();
    } else {
//    cc.log("payment identifier error");
    }
  },
  onBuyMint:function() {
  }
});

ShopMenu.create = function() {
  var layer = new ShopMenu();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
}

g_shopCountLabelFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 32, 
  fontFillColor: cc.c3b(255, 255, 255),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};
