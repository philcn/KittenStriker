var positions = {
  'triangle': [cc.p(0, 80), cc.p(-152, -80), cc.p(0, -80), cc.p(152, -80)],
  'linear': [cc.p(-210, 0), cc.p(-70, 0), cc.p(70, 0), cc.p(210, 0)]
};

var TeamShowLayer = cc.Layer.extend({
  shows:[],
  frames:[],
  activePosition:-1,
  lastTouchPosition:null,
  showType:null,
  onTeamChanged:null,
  ctor:function() {
    this._super();
    cc.associateWithNative(this, cc.Layer);
  },
  init:function(type, models) {
    this._super();
    this.showType = type
    var pos = positions[type];

    var leaderFrame = cc.Sprite.create('res/menu_leader_frame.png');
    var leaderBadge = cc.Sprite.create('res/menu_leader_badge.png');
    var buddyFrame1 = cc.Sprite.create('res/menu_buddy_frame.png');
    var buddyFrame2 = cc.Sprite.create('res/menu_buddy_frame.png');
    var buddyFrame3 = cc.Sprite.create('res/menu_buddy_frame.png');
    var buddyAdd = cc.Sprite.create('res/menu_buddy_add.png');
    var leaderBadge = cc.Sprite.create('res/menu_leader_badge.png');
    leaderFrame.addChild(leaderBadge, 10);
    leaderBadge.setPosition(leaderFrame.getContentSize().width - 8, leaderFrame.getContentSize().height - 8);
    
    this.addChild(leaderFrame);
    this.addChild(buddyFrame1);
    this.addChild(buddyFrame2);
    this.addChild(buddyFrame3);
    leaderFrame.setPosition(pos[0]);
    buddyFrame1.setPosition(pos[1]);
    buddyFrame2.setPosition(pos[2]);
    buddyFrame3.setPosition(pos[3]);
    this.frames = [leaderFrame, buddyFrame1, buddyFrame2, buddyFrame3];

    this.initModels(models);
    this.setTouchEnabled(true);

    return true;
  },
  initModels:function(models) {
    var upperBound = Math.min(4, models.length);
    for (var i = 0; i < upperBound; i++) {
      var model = models[i];
      var show = CharactorShow.create(model);
      this.addShowToFrame(show, this.frames[i]);
      if (this.shows[i]) {
        this.shows[i].removeFromParent();
      }
      this.shows[i] = show;
      show.retain();
    }
  },
  onTouchesBegan:function(touches, event) {
    var loc = this.convertToNodeSpace(touches[0].getLocation());
    this.lastTouchPosition = loc;
    this.intendedMove = false;
    // judge if touch begins within the bound of layer
    if (Math.abs(loc.x) < 220 && Math.abs(loc.y) < 170) {
      for (var i = 0; i < 4; i++) {
        var frame = this.frames[i];
        if (cc.rectContainsPoint(frame.getBoundingBox(), loc)) {
            this.activePosition = i;
        }
      }
      return true;
    }
    return false;
  },
  onTouchesMoved:function(touches, event) {
    if (this.activePosition == -1) {
      return;
    }
    var loc = this.convertToNodeSpace(touches[0].getLocation());
    var beganLoc = this.lastTouchPosition;
    var tol = 20;
    var rect = cc.rect(beganLoc.x - tol, beganLoc.y - tol, 2 * tol, 2 * tol);
    if (!cc.rectContainsPoint(rect, loc)) {
      var show = this.shows[this.activePosition];
      var touchLoc = this.convertToNodeSpace(touches[0].getLocation());
      show.setPosition(touchLoc);
//    cc.log(show.getPositionX(), show.getPositionY());
      show.setSelected(true);
      this.intendedMove = true;
      this.reorderChild(show, 9);
    }
  },
  onTouchesEnded:function(touches, event) {
    if (this.activePosition == -1) {
      return;
    }
    var loc = this.convertToNodeSpace(touches[0].getLocation());
    var beganLoc = this.lastTouchPosition;
    var tol = 20;
    var rect = cc.rect(beganLoc.x - tol, beganLoc.y - tol, 2 * tol, 2 * tol);
    var show = this.shows[this.activePosition];
    if (cc.rectContainsPoint(rect, loc) && !this.intendedMove) {
      this.onShowTapped(this.activePosition);
    } else {
      var noTarget = true;
      show.setSelected(false);
      // get the charactor frame touch probably ends
      for (var i = 0; i < 4; i++) {
        var targetFrame = this.frames[i];
        if (cc.rectContainsPoint(targetFrame.getBoundingBox(), loc)) {
          noTarget = false;
          var targetShow = this.shows[i];
          if (targetShow) {
            this.moveShowToPosition(targetShow, this.activePosition);
            this.shows[this.activePosition] = targetShow;
          } else {
            this.shows[this.activePosition] = null;
          }
          this.moveShowToPosition(show, i);
          this.shows[i] = show;
        }
      }
      if (noTarget) {
        this.moveShowToPosition(show, this.activePosition);
      }
      if (this.onTeamChanged) {
        this.onTeamChanged(this.shows.map(function(s) { return s.model; }));
      }
    }
    this.activePosition = -1;
  },
  onShowTapped:function(index) {
    if (this.showType === 'triangle') {
      this.getParent().getParent().onCharactorTapped(index);
    } else {
      var show = this.shows[index];
      show.runAction(cc.Blink.create(0.3, 2));
    }
  },
  addShowToFrame:function(show, frame) {
    this.addChild(show);
    show.setPosition(frame.getPosition());
  },
  moveShowToPosition:function(show, pos) {
    show.setPosition(this.frames[pos].getPosition());
  },
  removeCharactorAtPosition:function(pos) {
    this.shows[pos].removeFromParent();
    var buddyAdd = cc.Sprite.create('res/menu_buddy_add.png');
    this.addShowToFrame(buddyAdd, this.frames[pos]);
    this.shows[pos] = buddyAdd;
  },
});

TeamShowLayer.create = function(type, models) {
  var layer = new TeamShowLayer();
  if (layer && layer.init(type, models)) {
    return layer;
  }
  return null;
};

