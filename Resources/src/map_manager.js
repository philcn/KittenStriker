var MapManager = cc.Class.extend({
  stage       : 0,
  cycle       : 0,
  xs          : [80, 200, 320, 440, 560],
  ys          : [],
  enemyTypes  : [[1], [1, 2], [2, 3], [3, 4], [4, 5]],
  patterns    : [],
  pattern     : 0,
  dir         : 0, // 0 - normal, 1 - reversed
  times       : 0, // single pattern repeat time
  currentEnemyType:null,
  currentEnemyTypes:null,
  ctor:function() {
    this.patterns = [
      this.patternCoins1,
      this.patternEnemy1,
      this.patternEnemy2,
      this.patternEnemy3,
      this.patternEnemy4,
      this.patternEnemy5,
      this.patternEnemy6,
      this.patternEnemy7,
      this.patternEnemy8,
      this.patternEnemy9,
      this.patternEnemyObstacle1,
      this.patternEnemyObstacle2,
      this.patternObstacleCoins1,
      this.patternObstacleCoins2,
      this.patternEnemy10,
      this.patternObstacle1,
      this.patternEnemyObstacle3,
      this.patternEnemyObstacle4,
      this.patternEnemyObstacle5,
      this.patternEnemyObstacle6,
      this.patternEnemyObstacle7,
      this.patternEnemyObstacle8,
    ];
    this.currentEnemyTypes = this.enemyTypes[this.stage];
    for (var i = 0; i < 10; i++) {
      this.ys[i] = i * 120;
    }
  },
  update:function() {
    if (this.stage < 5 && g_sharedGameManager.bossDistance > KS.GAME_STAGE_DISTANCES[this.stage]) {
      g_sharedGameLayer.beginBossMode();
    } 
    // random enemy type
    this.currentEnemyType = this.currentEnemyTypes[Math.floor(Math.random() * this.currentEnemyTypes.length)];
    // spawn pattern
    this.patterns[this.pattern].bind(this)();
    this.times += 1;
    // change to next pattern
    if (this.times == 4) {
      this.pattern += 1;
      this.pattern %= this.patterns.length;
      this.times = 0;
    }
    // reverse direction
    this.dir = 1 - this.dir;
  },
  bossModeDidBegin:function() {
    this.cleanUpEnemies();
  },
  bossModeDidEnd:function() {
    this.cleanUpBossBullet();
    this.stage += 1;
    if (this.stage >= 5) {
      this.stage = 0;
      this.cycle += 1;
      g_sharedGameManager.bossDistance = 0;
    }
//  cc.log("STAGE INCREASED TO " + this.cycle + ", " + this.stage);
    this.currentEnemyTypes = this.enemyTypes[this.stage];
  },
  cleanUpEnemies:function() {
    var types = this.enemyTypes[this.stage]; 
    var typesToClean = [1, 2, 3, 4, 5].filter(function(i) { return types.indexOf(i) < 0; }); 
    typesToClean.forEach(function(i) {
      KS.CONTAINER.ENEMIES[i - 1].forEach(function(e) {
        e.removeFromParent();
      });
      KS.CONTAINER.ENEMIES[i - 1] = [];
    });
  },
  cleanUpBossBullet:function() {
    KS.CONTAINER.BOSS_BULLETS.forEach(function(b) {
      b.removeFromParent();
    });
    KS.CONTAINER.BOSS_BULLETS = [];
  },
  spawnEnemyXY:function(x_idx, y_idx) {
    x_idx = Math.abs(this.dir * 4 - x_idx);
    this.spawnEnemy(this.xs[x_idx], 1136 + 60 + this.ys[y_idx], this.currentEnemyType);
  },
  spawnObstacleXY:function(x_idx, y_idx) {
    x_idx = Math.abs(this.dir * 4 - x_idx);
    this.spawnObstacle(this.xs[x_idx], 1136 + 60 + this.ys[y_idx]);
  },
  spawnCoinX:function(x_idx, y, type) {
    x_idx = Math.abs(this.dir * 4 - x_idx);
    this.spawnCoin(this.xs[x_idx], 1136 + 60 + y);
  },
  spawnEnemy:function(x, y, type) {
    Enemy.getOrCreate(type).setPosition(x, y);
  },
  spawnObstacle:function(x, y) {
    Obstacle.getOrCreate().setPosition(x, y);
  },
  spawnCoin:function(x, y) {
    var coin = Coin.getOrCreate();
    coin.setPosition(x, y);
    return coin;
  },
  spawnStar:function(x, y) {
    EnergyStar.getOrCreate().setPosition(x, y);
  },
  spawnPickBuddy:function(x, y) {
    PickBuddy.getOrCreate().setPosition(x, y);
  },
  //////////////////////////PATTERNS////////////////////////////
  patternCoins1:function() {
    for (var j = 0; j < 12; j++) {
      this.spawnCoinX(1, 70 * j);
    }
  },
  patternEnemy1:function() {
    this.spawnEnemyXY(4, 0);
    this.spawnEnemyXY(3, 0);
    this.spawnEnemyXY(3, 4);
    this.spawnEnemyXY(2, 4);
  },
  patternEnemy2:function() {
    this.spawnEnemyXY(4, 0);
    this.spawnEnemyXY(3, 0);
    this.spawnEnemyXY(2, 0);
    this.spawnEnemyXY(2, 4);
    this.spawnEnemyXY(1, 4);
    this.spawnEnemyXY(0, 4);
  },
  patternEnemy3:function() {
    this.spawnEnemyXY(0, 2);
    this.spawnEnemyXY(1, 1);
    this.spawnEnemyXY(2, 0);
    this.spawnEnemyXY(3, 1);
    this.spawnEnemyXY(4, 2);
  },
  patternEnemy4:function() {
    for (var i = 0; i < 5; i++) {
      this.spawnEnemyXY(i, 0);
    }
  },
  patternEnemy5:function() {
    this.spawnEnemyXY(0, 0);
    this.spawnEnemyXY(1, 1);
    this.spawnEnemyXY(2, 0);
    this.spawnEnemyXY(3, 1);
    this.spawnEnemyXY(4, 0);
  },
  patternEnemy6:function() {
    this.spawnEnemyXY(4, 0);
    this.spawnEnemyXY(3, 1);
    this.spawnEnemyXY(2, 2);
  },
  patternEnemy7:function() {
    this.spawnEnemyXY(1, 0);
    this.spawnEnemyXY(1, 1);
    this.spawnEnemyXY(1, 2);
  },
  patternEnemy8:function() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 2; j++) {
        this.spawnEnemyXY(1 + i, j);
      }
    }
  },
  patternEnemy9:function() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 2; j++) {
        this.spawnEnemyXY(i, j);
      }
    }
  },
  patternEnemy10:function() {
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 4; j++) {
        this.spawnEnemyXY(i, j);
      }
    }
  },
  patternEnemyObstacle1:function() {
    this.spawnEnemyXY(0, 0);
    this.spawnEnemyXY(1, 0);
    this.spawnObstacleXY(3, 0);
    this.spawnObstacleXY(4, 0);
  },
  patternEnemyObstacle2:function() {
    this.spawnEnemyXY(0, 1);
    this.spawnEnemyXY(1, 1);
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 3; j++) {
        this.spawnObstacleXY(2 + i, j)
      }
    }
  },
  patternEnemyObstacle3:function() {
    for (var i = 0; i < 2; i++) {
      this.spawnObstacleXY(i, 0);
    }
    for (var i = 2; i < 5; i++) {
      this.spawnEnemyXY(i, 0);
    }
  },
  patternEnemyObstacle4:function() {
    for (var i = 0; i < 3; i++) {
      this.spawnObstacleXY(i, 0);
    }
    for (var i = 3; i < 5; i++) {
      this.spawnEnemyXY(i, 0);
    }
  },
  patternEnemyObstacle5:function() {
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 3; j++) {
        this.spawnObstacleXY(i, j);
      }
    }
    for (var i = 2; i < 5; i++) {
      this.spawnEnemyXY(i, 1);
    }
  },
  patternEnemyObstacle6:function() {
    for (var i = 0; i < 2; i++) {
      this.spawnObstacleXY(i, 0);
    }
    for (var i = 3; i < 5; i++) {
      this.spawnEnemyXY(i, 0);
    }
  },
  patternEnemyObstacle7:function() {
    for (var i = 0; i < 3; i++) {
      this.spawnObstacleXY(i, 1);
    }
    for (var j = 0; j < 3; j++) {
      this.spawnEnemyXY(3, j);
    }
  },
  patternEnemyObstacle8:function() {
    for (var j = 0; j < 2; j++) {
      this.spawnObstacleXY(1, j);
    }
    for (var i = 2; i < 5; i++) {
      this.spawnEnemyXY(i, 0);
    }
  },
  patternObstacleCoins1:function() {
    this.spawnObstacleXY(4, 0);
    this.spawnObstacleXY(3, 0);
    for (var i = 0; i < 12; i++) {
      this.spawnCoinX(1, 70 * i);
    }
  },
  patternObstacleCoins2:function() {
    this.spawnObstacleXY(2, 2);
    this.spawnObstacleXY(2, 3);
    for (var i = 0; i < 12; i++) {
      this.spawnCoinX(1, 70 * i);
    }
  },
  patternObstacle1:function() {
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 3; j++) {
        this.spawnObstacleXY(i, j);
      }
    }
  },
});
