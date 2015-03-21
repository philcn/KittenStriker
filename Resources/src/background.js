var Background = cc.Sprite.extend({
  active:true,
  id:null,
  ctor:function(id) {
    this._super();
    this.init("res/background" + id + ".png");
    this.setAnchorPoint(cc.p(0, 0));
    this.getTexture().setAliasTexParameters();
    this.id = id;
  },
  destroy:function() {
    this.setVisible(false);
    this.active = false;
    this.stopAllActions();
  }
});

Background.create = function(id) {
  var background = new Background(id);
  background.retain();
  g_sharedGameLayer.addChild(background, 1);
  KS.CONTAINER.BACKGROUNDS.push(background);
  return background;
};

Background.getOrCreate = function(id) {
//cc.log("GET OR CREATE GAME " + id);
  if (id == undefined) {
    id = 1;
  }
  var background;
  for (var j = 0; j < KS.CONTAINER.BACKGROUNDS.length; j++) {
    background = KS.CONTAINER.BACKGROUNDS[j];
    if (!background.active && background.id == id) {
      background.setVisible(true);
      background.active = true;
      return background;
    }
  }
  background = Background.create(id);
  return background;
};

Background.preSet = function(id) {
  var background;
  if (id == undefined) {
    id = 1;
  }
  for (var i = 0; i < 2; i++) {
    background = Background.getOrCreate(id);
    background.setVisible(false);
    background.active = false;
  }
};

Background.createMenu = function() {
  var background = new Background(Background.menuBackgroundId || 1);
  background.retain();
  g_sharedMenuLayer.addChild(background, -1, -1);
  KS.CONTAINER.BACKGROUNDS_MENU.push(background);
  return background;
};

Background.getOrCreateMenu = function() {
//cc.log("GET OR CREATE MENU");
  var background;
  for (var j = 0; j < KS.CONTAINER.BACKGROUNDS_MENU.length; j++) {
    background = KS.CONTAINER.BACKGROUNDS_MENU[j];
    if (!background.active) {
      background.setVisible(true);
      background.active = true;
      return background;
    }
  }
  background = Background.createMenu();
  return background;
};

Background.preSetMenu = function(id) {
  var background;
  Background.menuBackgroundId = id;
  for (var i = 0; i < 2; i++) {
    background = Background.createMenu();
    background.setVisible(false);
    background.active = false;
  }
};

//
// Deprecated
//

var Foreground = cc.Sprite.extend({
  active:true,
  ctor:function() {
    this._super();
    this.init("res/foreground.png");
    this.setAnchorPoint(cc.p(0, 0));
  },
  destroy:function() {
    this.setVisible(false);
    this.active = false;
  }
});

Foreground.create = function() {
  var foreground = new Foreground();
  g_sharedGameLayer.addChild(foreground, 2);
  KS.CONTAINER.FOREGROUNDS.push(foreground);
  return foreground;
};

Foreground.getOrCreate = function() {
  var foreground;
  for (var j = 0; j < KS.CONTAINER.FOREGROUNDS.length; j++) {
    foreground = KS.CONTAINER.FOREGROUNDS[j];
    if (!foreground.active) {
      foreground.setVisible(true);
      foreground.active = true;
      return foreground;
    }
  }
  foreground = Foreground.create();
  return foreground;
};

Foreground.preSet = function() {
  var foreground;
  for (var i = 0; i < 2; i++) {
    foreground = Foreground.create();
    foreground.setVisible(false);
    foreground.active = false;
  }
};


