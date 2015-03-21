var CharactorShow = cc.Node.extend({
  avatar:null,
  model:null,
  ctor:function() {
    this._super();
  },
  init:function(model) {
    this._super();
    this.model = model;
    var name = "res/cat" + model.charactor + "-" + model.level + ".png";
    var avatar = cc.Sprite.create(name);
    this.avatar = avatar;
    this.addChild(avatar);
    // level labels

    return true;
  },
  setSelected:function(selected) {
    if (selected) {
      this.avatar.setOpacity(0.75*255);
      this.avatar.setScale(1.2);
    } else {
      this.avatar.setOpacity(255);
      this.avatar.setScale(1.0);
    }
  }
});

CharactorShow.create = function(model) {
  var show = new CharactorShow();
  if (show && show.init(model)) {
    return show;
  }
  return null;
};
