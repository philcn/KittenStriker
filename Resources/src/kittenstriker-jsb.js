require("jsb.js");

var KS = KS || {};

var appFiles = [
  'src/config.js',
  'src/game_scene.js',
  'src/game_layer.js',
  'src/cat.js',
  'src/enemy.js',
  'src/bullet.js',
  'src/coin.js',
  'src/obstacle.js',
  'src/effect.js',
  'src/background.js',
  'src/shield.js',
  'src/energy_bar.js',
  'src/energy_star.js',
  'src/map_manager.js',
  'src/menu_scene.js',
  'src/main_menu.js',
  'src/team_show_layer.js',
  'src/charactor_show.js',
  'src/popup_menu.js',
  'src/shop_menu.js',
  'src/setting_menu.js',
  'src/pause_menu.js',
  'src/game_over_menu.js',
  'src/boss.js',
  'src/game_manager.js',
  'src/detail_popup.js',
  'src/charactor_menu.js',
  'src/upgrade_confirm_popup.js',
  'src/charactor_model.js',
  'src/game_data.js',
  'src/near_weapon.js',
  'src/props_cell.js',
  'src/pick_buddy.js',
  'src/boss_bullet.js',
  'src/audio_manager.js',
];

for (var i = 0; i < appFiles.length; i++) {
  require(appFiles[i]);
}

//cc.log("ADD PLISTS");
cc.SpriteFrameCache.getInstance().addSpriteFrames('res/texture_opaque_pack.plist');
cc.SpriteFrameCache.getInstance().addSpriteFrames("res/boss_pack_1.plist");
cc.SpriteFrameCache.getInstance().addSpriteFrames("res/boss_pack_2.plist");
//cc.log("DONE");
BossSprite.createSharedAnimations();

var director = cc.Director.getInstance();
director.setDisplayStats(false);
director.setAnimationInterval(1.0 / 60);
var menuScene = new MenuScene();
director.runWithScene(menuScene);

g_preSetDone = false;
