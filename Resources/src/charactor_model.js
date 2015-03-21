var CharactorModel = cc.Class.extend({
  charactor           : 0,
  level               : 0,
  subLevel            : 0,
  weapon              : 0,
  attack              : 0,
  feature             : null,
  featureDescription  : "无",
  ctor:function(charactor, level, subLevel) {
    this.charactor = charactor;
    this.level = level;
    this.subLevel = subLevel;
    this.init();
  },
  init:function() {
    this.weapon = KS.WEAPONS[this.charactor - 1];
    this.attack = this.weapon.powers[this.level - 1];
    this.initFeature();
  },
  initFeature:function() {
    var feature = KS.LEADER_FEATURES[this.charactor - 1];
    switch (feature.type) {
      case 'revival':
      case 'gold':
        if (this.level < 3) {
          this.featureDescription = feature.placeholder;
          this.feature = null;
        } else {
          this.featureDescription = feature.text;
          this.feature = { type: feature.type };
        }
        break;
      case 'attack':
      case 'frequency':
        this.featureDescription = feature.text + feature.value_texts[this.level - 1];
        this.feature = {
          type: feature.type,
          value: feature.values[this.level - 1]
        }
    }
  },
  upgrade:function() {
    if (this.subLevel < 9) {
      this.subLevel += 1;
      return true;
    } else {
      if (this.level < 3) {
        this.subLevel = 1;
        this.level += 1;
        this.attack = this.weapon.powers[this.level - 1];
        this.initFeature();
        return true;
      }
    }
    return false;
  },
  upgradeCost:function() {
    var basePrice = [1000, 2000, 4000][this.level - 1];
    var subPrice = [100, 200, 400][this.level - 1] * (this.subLevel - 1);
    return basePrice + subPrice;
  },
  toEncodingString:function() {
    return "" + this.charactor + this.level + this.subLevel;
  }
});

CharactorModel.createWithString = function(string) {
//  cc.Assert(string.length == 3);
  var charactor = parseInt(string[0]);
  var level = parseInt(string[1]);
  var subLevel = parseInt(string[2]);
//  cc.Assert(charactor >= 1 && charactor <= 5);
//  cc.Assert(level >= 1 && level <= 3);
//  cc.Assert(subLevel >= 1 && subLevel <= 9);
  var model = new CharactorModel(charactor, level, subLevel);
  return model;
};

CharactorModel.randomPick = function() {
  var charactor = Math.floor(Math.random() * 4) + 1;
  var level = Math.floor(Math.random() * 2) + 1;
  return new CharactorModel(charactor, level, 1);
};

