var AudioManager = cc.Class.extend({
  _audioEngine:null,
  ctor:function() {
    this._audioEngine = cc.AudioEngine.getInstance();
    this._audioEngine.setEffectsVolume(0.4);
    this._audioEngine.setMusicVolume(0.6);
    if (cc.Application.getInstance().getTargetPlatform() == cc.TARGET_PLATFORM.ANDROID) {
      this._postfix = 'ogg';
    } else {
      this._postfix = 'caf';
    }
  },
  disableMusic:function() {
    this._audioEngine.setMusicVolume(0);
    this.pauseBackgroundMusic();
  },
  enableMusic:function() {
    this._audioEngine.setMusicVolume(0.6);
    this.playBackgroundMusic();
  },
  disableEffect:function() {
    this._audioEngine.setEffectsVolume(0);
  },
  enableEffect:function() {
    this._audioEngine.setEffectsVolume(0.4);
  },
  playBackgroundMusic:function() {
    this._audioEngine.playMusic('res/sound/bgm.' + this._postfix, true);
  },
  stopBackgroundMusic:function() {
    this._audioEngine.stopMusic();
  },
  pauseBackgroundMusic:function() {
    this._audioEngine.pauseMusic();
  },
  resumeBackgroundMusic:function() {
    this._audioEngine.resumeMusic();
  },
  playButtonEffect:function() {
    this.playEffect('menu_button');
  },
  playStartEffect:function() {
    this.playEffect('menu_start');
  },
  playUpgradeEffect:function() {
    this.playEffect('menu_upgrade');
  },
  playPauseEffect:function() {
    this.playEffect('pause');
  },
  playCoinEffect:function() {
    this.playEffect('coin');
  },
  playStarEffect:function() {
    this.playEffect('star');
  },
  playPickBuddyEffect:function() {
    this.playEffect('pick_buddy');
  },
  playBuddyDieEffect:function() {
    this.playEffect('buddy_die');
  },
  playBombEffect:function() {
    this.playEffect('bomb');
  },
  playNearEffect:function() {
    this.playEffect('near');
  },
  playFeverModeEffect:function() {
    this.playEffect('fever_mode');
  },
  playBossAppearEffect:function() {
    this.playEffect('boss_appear');
  },
  playBossAttackEffect:function(idx) {
    this.playEffect('boss_attack' + idx);
  },
  playBossHitEffect:function() {
    this.playEffect('boss_hit');
  },
  playBossDieEffect:function() {
    this.playEffect('boss_die');
  },
  playPropsEffect:function() {
    this.playEffect('props');
  },
  playRevivalEffect:function() {
    this.playEffect('revival');
  },
  playGameOverEffect:function() {
    this.playEffect('game_over');
  },
  playEffect:function(name) {
    this._audioEngine.playEffect('res/sound/' + name + '.' + this._postfix);
  }
});

AudioManager.getInstance = function() {
  this._sAudioManager || (this._sAudioManager = new AudioManager());
  return this._sAudioManager;
};
