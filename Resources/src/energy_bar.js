var EnergyBar = cc.Sprite.extend({
  _value:0,
  _maxValue:5,
  ctor:function() {
    this._super();
    this.init("res/game_energy_bar.png");
    this.stars = cc.Sprite.create('res/game_energy_bar_star.png');
    this.stars.setAnchorPoint(cc.p(0, 0));
    this.addChild(this.stars);
    this.setValue(0);
    this.setOpacity(0);
  },
  setValue:function(value) {
    this._value = Math.max(Math.min(value, this._maxValue), 0);
    this.stars.setTextureRect(cc.rect(0, 0, 140 + 62 * this._value, 72));
  },
  show:function() {
    this.stopAllActions();
    this.stars.stopAllActions();
    this.runAction(cc.Sequence.create(cc.FadeIn.create(0.5),
                                      cc.DelayTime.create(1),
                                      cc.FadeOut.create(0.5)));
    this.stars.runAction(cc.Sequence.create(cc.FadeIn.create(0.5),
                                            cc.DelayTime.create(1),
                                            cc.FadeOut.create(0.5)));
  }
});
