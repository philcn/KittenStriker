var SettingLayer = cc.Layer.extend({
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function() {
    this._super();

    var switchMaskFile = 'res/menu_setting_switch_mask.png';
    var switchOnFile = 'res/menu_setting_switch_on.png';
    var switchOffFile = 'res/menu_setting_switch_off.png';
    var switchThumbFile = 'res/menu_setting_switch_thumb.png';
/*
    var vibrationSwitch = cc.ControlSwitch.create(
      cc.Sprite.create(switchMaskFile),
      cc.Sprite.create(switchOnFile),
      cc.Sprite.create(switchOffFile),
      cc.Sprite.create(switchThumbFile),
      cc.LabelTTF.create("ON", "Arial-BoldMT", 24),
      cc.LabelTTF.create("OFF", "Arial-BoldMT", 24)
    );
*/
    var musicSwitch = cc.ControlSwitch.create(
      cc.Sprite.create(switchMaskFile),
      cc.Sprite.create(switchOnFile),
      cc.Sprite.create(switchOffFile),
      cc.Sprite.create(switchThumbFile),
      cc.LabelTTF.create("ON", "Arial-BoldMT", 24),
      cc.LabelTTF.create("OFF", "Arial-BoldMT", 24)
    );
    var soundSwitch = cc.ControlSwitch.create(
      cc.Sprite.create(switchMaskFile),
      cc.Sprite.create(switchOnFile),
      cc.Sprite.create(switchOffFile),
      cc.Sprite.create(switchThumbFile),
      cc.LabelTTF.create("ON", "Arial-BoldMT", 24),
      cc.LabelTTF.create("OFF", "Arial-BoldMT", 24)
    );   
    
//    this.addChild(vibrationSwitch);
    this.addChild(musicSwitch);
    this.addChild(soundSwitch);
//    vibrationSwitch.setPosition(380, 764);
    musicSwitch.setPosition(380, 705);
    soundSwitch.setPosition(380, 587);
    musicSwitch.setOn(g_sharedGameData.getMusic());
    soundSwitch.setOn(g_sharedGameData.getSound());

//    vibrationSwitch.addTargetWithActionForControlEvents(this, this.onVibrationChanged, cc.CONTROL_EVENT_VALUECHANGED);
    musicSwitch.addTargetWithActionForControlEvents(this, this.onMusicChanged, cc.CONTROL_EVENT_VALUECHANGED);
    soundSwitch.addTargetWithActionForControlEvents(this, this.onSoundChanged, cc.CONTROL_EVENT_VALUECHANGED);

//    var label1 = cc.LabelTTF.createWithFontDefinition("振动", g_titleLabelFontDef);
    var label2 = cc.LabelTTF.createWithFontDefinition("音乐", g_titleLabelFontDef);
    var label3 = cc.LabelTTF.createWithFontDefinition("音效", g_titleLabelFontDef);
//    this.addChild(label1);
    this.addChild(label2);
    this.addChild(label3);
//    label1.setPosition(252, 764);
    label2.setPosition(252, 705);
    label3.setPosition(252, 587);

    return true;
  },
  onVibrationChanged:function(sender, controlEvent) {
    g_sharedAudioManager.playPauseEffect();
    if (sender.isOn()) {
    } else {
    }
  },
  onMusicChanged:function(sender, controlEvent) {
    g_sharedAudioManager.playPauseEffect();
    if (sender.isOn()) {
      g_sharedAudioManager.enableMusic();
    } else {
      g_sharedAudioManager.disableMusic();
    }
    g_sharedGameData.setMusic(sender.isOn());
  },
  onSoundChanged:function(sender, controlEvent) {
    g_sharedAudioManager.playPauseEffect();
    if (sender.isOn()) {
      g_sharedAudioManager.enableEffect();
    } else {
      g_sharedAudioManager.disableEffect();
    }
    g_sharedGameData.setSound(sender.isOn());
  }
});

var SettingMenu = PopupMenu.extend({
  ctor:function() {
    this._super();
  },
  init:function() {
    this._super();

    this.initControls();

    return true;
  },
  initControls:function() {
    var settingLayer = new SettingLayer();
    settingLayer.init();
    this.addChild(settingLayer);
  }
});

SettingMenu.create = function() {
  var layer = new SettingMenu();
  if (layer && layer.init()) {
    return layer;
  }
  return null;
}

g_titleLabelFontDef = {
  fontName: "FZDHTJW--GB1-0.ttf",
  fontSize: 32, 
  fontFillColor: cc.c3b(251, 176, 59),
  shadowEnabled: true,
  shadowOffset: cc.size(0, -2)
};
