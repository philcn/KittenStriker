K_INIT_KEY = "GameData";
K_INITIAL_CHARACTORS = ["411", "111", "211", "311"];

var GameData = cc.Class.extend({
  _gold: 0,
  _highestScore: 0,
  _charactors: [],
  _sound: true,
  _music: true,
  _ls: null,
  ctor:function() {
    this._ls = sys.localStorage;
    if (this._ls.getItem(K_INIT_KEY) == "") {
//    cc.log("INIT FIRST TIME");
      this.initForFirstTime();
    } else {
//    cc.log("INIT WITH DB");
      this._gold = parseInt(this._ls.getItem("gold"));
      this._highestScore = parseInt(this._ls.getItem("highestScore"));
      for (var i = 0; i < 4; i++) {
        var key = "char" + i;
        var value = this._ls.getItem(key);
        this._charactors[i] = value;
      }
      this._sound = this._ls.getItem("sound") == "true";
      this._music = this._ls.getItem("music") == "true";
    }
  },
  getHighestScore:function() {
    return this._highestScore;
  },
  setHighestScore:function(score) {
    this._highestScore = score;
    this._ls.setItem("highestScore", this._highestScore);
  },
  getGold:function() {
    return this._gold;
  },
  incGold:function(delta) {
    this._gold += delta;
    this._ls.setItem("gold", this._gold);
  },
  checkGold:function(price) {
    return this._gold >= price;
  },
  tryConsumeGold:function(price) {
    if (this._gold < price) {
      return false;
    } else {
      this._gold -= price;
      this._ls.setItem("gold", this._gold);
      return true;
    }
  },
  initForFirstTime:function() {
    this._gold = 2000;
    this._highestScore = 0;
    this._sound = true;
    this._music = true;
    this._ls.setItem("gold", this._gold);
    this._ls.setItem("highestScore", this._highestScore);
    this._ls.setItem(K_INIT_KEY, "KS");
    this._charactors = K_INITIAL_CHARACTORS;
    this._ls.setItem("char0", this._charactors[0]);
    this._ls.setItem("char1", this._charactors[1]);
    this._ls.setItem("char2", this._charactors[2]);
    this._ls.setItem("char3", this._charactors[3]);
    this._ls.setItem("sound", this._sound);
    this._ls.setItem("music", this._music);
  },
  getCharactorModels:function() {
    var models = [];
    for (var i = 0; i < this._charactors.length; i++) {
      var model = CharactorModel.createWithString(this._charactors[i]);
      models.push(model);
    }
    return models;
  },
  updateCharactorModels:function(models) {
    for (var i = 0; i < 4; i++) {
      if (models[i]) {
        var key = "char" + i.toString();
        var value = models[i].toEncodingString();
        this._charactors[i] = value;
        this._ls.setItem(key, value);
//      cc.log("KEY " + key + ", VALUE " + value);
      }
    }
  },
  getSound:function() {
    return this._sound;
  },
  setSound:function(sound) {
    this._sound = sound;
    this._ls.setItem("sound", this._sound);
  },
  getMusic:function() {
    return this._music;
  },
  setMusic:function(music) {
    this._music = music;
    this._ls.setItem("music", this._music);
  },
  onExit:function() {
  }
});

GameData.getInstance = function() {
  this._sGameData || (this._sGameData = new GameData());
  return this._sGameData;
};

