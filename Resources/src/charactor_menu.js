var CharactorMenu = PopupMenu.extend({
  ctor:function() {
    this._super();
  },
  init:function(charactorModel) {
    this._super();
    winSize = cc.Director.getInstance().getWinSize();

    this.model = charactorModel;

    this.initMenu();
    this.initCharactorFields();
    this.initCharactorInfo();

    return true;
  },
  initMenu:function() {
    var upgradeBtnNormal = cc.Sprite.create('res/menu_charactor_upgrade_btn_normal.png');
    var upgradeBtnSelected = cc.Sprite.create('res/menu_charactor_upgrade_btn_selected.png');
    var upgradeBtn = cc.MenuItemSprite.create(upgradeBtnNormal, upgradeBtnSelected, this.onUpgrade, this);
    
    var priceLabel = cc.LabelTTF.create(this.model.upgradeCost(), 'FZDHTJW--GB1-0.ttf', 32);
    upgradeBtn.addChild(priceLabel);
    priceLabel.setPosition(90, 52);
    priceLabel.setAnchorPoint(cc.p(0.5, 0.5));
    priceLabel.setColor(cc.c3b(0, 0, 0));
    this.priceLabel = priceLabel;

    var bottomMenu = cc.Menu.create(upgradeBtn);
    bottomMenu.setPosition(winSize.width / 2, winSize.height / 2 - 300);
    this.addChild(bottomMenu, 1, 2);
    this.upgradeMenu = bottomMenu;
  },
  initCharactorFields:function() {
    var levelFieldBackgroud = cc.Sprite.create('res/menu_charactor_info_level_field_bg.png');
    levelFieldBackgroud.setPosition(winSize.width / 2, winSize.height / 2 + 30);
    this.addChild(levelFieldBackgroud);
    this.levelFieldBackgroud = levelFieldBackgroud;

    var levelLabel = cc.LabelTTF.createWithFontDefinition('', g_charactorInfoLevelFontDef);
    levelLabel.setPosition(100, levelFieldBackgroud.getContentSize().height / 2 - 4);
    levelLabel.setAnchorPoint(cc.p(0, 0.5));
    levelFieldBackgroud.addChild(levelLabel);
    this.levelLabel = levelLabel;

    var attributesFieldBackground = cc.Sprite.create('res/menu_charactor_info_attributes_field_bg.png');
    attributesFieldBackground.setPosition(winSize.width / 2, winSize.height / 2 - 100);
    this.addChild(attributesFieldBackground);
    this.attributesFieldBackground = attributesFieldBackground;

    var weaponNameLabel = cc.LabelTTF.createWithFontDefinition('', g_charactorInfoAttributesFontDef);
    weaponNameLabel.setPosition(37, 118);
    weaponNameLabel.setAnchorPoint(cc.p(0, 0.5));
    attributesFieldBackground.addChild(weaponNameLabel);
    this.weaponNameLabel = weaponNameLabel;

    var attackLabel = cc.LabelTTF.createWithFontDefinition('', g_charactorInfoAttributesFontDef);
    attackLabel.setPosition(37, 75);
    attackLabel.setAnchorPoint(cc.p(0, 0.5));
    attributesFieldBackground.addChild(attackLabel);
    this.attackLabel = attackLabel;

    var featureLabel = cc.LabelTTF.createWithFontDefinition('', g_charactorInfoAttributesFontDef);
    featureLabel.setPosition(37, 32);
    featureLabel.setAnchorPoint(cc.p(0, 0.5));
    attributesFieldBackground.addChild(featureLabel);
    this.featureLabel = featureLabel;
  },
  initCharactorInfo:function() {
    var model = this.model;
    var filename = 'res/cat' + model.charactor + '-' + model.level + '_full.png';
    if (this.charactorImage) {
      this.charactorImage.removeFromParent();
    }
    var charactorImage = cc.Sprite.create(filename);
    this.addChild(charactorImage, 3, 3);
    charactorImage.setPosition(winSize.width / 2, winSize.height / 2 + 200);
    this.charactorImage = charactorImage;
    
    filename = 'res/claw' + model.level + '.png';
    if (this.clawImage) {
      this.clawImage.removeFromParent();
    }
    var clawImage = cc.Sprite.create(filename);
    this.levelFieldBackgroud.addChild(clawImage);
    clawImage.setPosition(50, this.levelFieldBackgroud.getContentSize().height / 2);
    this.clawImage = clawImage;

    this.levelLabel.setString('LV.' + model.subLevel);
    this.weaponNameLabel.setString('武器：' + model.weapon.name);
    this.attackLabel.setString('攻击力：' + model.attack);
    this.featureLabel.setString('特技：' + model.featureDescription);

    if (model.level == 3 && model.subLevel == 9) {
      this.upgradeMenu.setVisible(false);
    }
  },
  onUpgrade:function() {
    if (g_sharedGameData.tryConsumeGold(this.model.upgradeCost())) {
      this.updateGoldLabel();
      var bRet = this.model.upgrade();
      if (bRet) {
        this.initCharactorInfo();
        this.onUpgradeSuccess();
      }
    } else {
      var detailPopup = UpgradeConfirmPopup.create();
      this.showPopupLayer(detailPopup);
    }
 },
  onUpgradeSuccess:function() {
    g_sharedAudioManager.playUpgradeEffect();
    this.levelFieldBackgroud.setVisible(false);
    this.upgradeMenu.setVisible(false);
    this.priceLabel.setString(this.model.upgradeCost());
    var upgradeSuccessHint = cc.Sprite.create('res/menu_charactor_upgrade_success_hint.png');
    upgradeSuccessHint.setPosition(this.levelFieldBackgroud.getPosition());
    this.addChild(upgradeSuccessHint, 3, 3);
    this.scheduleOnce(function() {
      this.levelFieldBackgroud.setVisible(true);
      upgradeSuccessHint.removeFromParent();
      upgradeSuccessHint = null;
      this.upgradeMenu.setVisible(true);
    }, 2);
    
    cc.SpriteFrameCache.getInstance().addSpriteFrames("res/menu_effect_pack.plist");
    var spinEfx = cc.Sprite.createWithSpriteFrameName('charactor_upgrade_efx_1.png');
    spinEfx.setPosition(this.charactorImage.getPosition());
    this.addChild(spinEfx, 2, 2);
    var animFrames = [];
    var name;
    for (var i = 0; i < 10; i++) {
      name = "charactor_upgrade_efx_" + (i%5+1) + ".png";
      var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(name);
      animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 0.15);
    var spin = cc.Animate.create(animation);
    var fadeInAndRemove = cc.Sequence.create(cc.FadeIn.create(0.3), cc.DelayTime.create(1.5), cc.FadeOut.create(0.2), cc.CallFunc.create(function() { spinEfx.removeFromParent() }));
    var fadeInAndSpinAndRemove = cc.Spawn.create(fadeInAndRemove, spin);
    spinEfx.runAction(fadeInAndSpinAndRemove);

    if (this.onTeamChanged) {
      this.onTeamChanged(null);
    }
  },
  showPopupLayer:function(popup) {
    if (!this.activePopupLayer) {
      this.addChild(popup, 100, 100);
      this.activePopupLayer = popup;
      popup.onHide = this.hidePopupLayer.bind(this);
    }
  },
  hidePopupLayer:function() {
    if (this.activePopupLayer) {
      this.activePopupLayer.removeFromParent();
      this.activePopupLayer = null;
    }
  }
});

CharactorMenu.create = function(charactorModel) {
  var layer = new CharactorMenu();
  if (layer && layer.init(charactorModel)) {
    return layer;
  }
  return null;
};

g_charactorInfoLevelFontDef = {
  fontName: "366-CAI978.ttf",
  fontSize: 26,
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

g_charactorInfoAttributesFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 24,
  fontFillColor: cc.c3b(248, 182, 45),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};

