g_initKSContainer = function() {
  KS.CONTAINER = {
    HEROES:[],
    PLAYER_BULLETS:[],
    NEAR_WEAPONS:[],
    BOSS:null,
    BOSS_BULLETS:[],
    ENEMIES:[[], [], [], [], []],
    EFFECTS:[],
    COINS:[],
    STARS:[],
    OBSTACLES:[],
    PICK_BUDDIES:[],
    FOREGROUNDS:[],
    BACKGROUNDS:[],
    BACKGROUNDS_MENU:[],
    MENU_EFFECTS:[]
  };

  KS.CONTAINER.ALL_ENEMIES_DO = function(cb, bossMode) {
    KS.CONTAINER.ENEMIES.forEach(function(array) {
      array.forEach(function(enemy) {
        if (enemy && enemy.active) {
          cb(enemy);
        }
      });
    });
    if (bossMode) {
      if (KS.CONTAINER.BOSS && KS.CONTAINER.BOSS.active) {
        cb(KS.CONTAINER.BOSS);
      }
    }
  };
};

g_initKSContainer();

g_initKSGameConfig = function() {
  KS.GAMECONFIG = {
    PROPS:[false, false, false],
    ATTACK_FACTOR_1:1.0,
    ATTACK_FACTOR_2:1.0,
    FREQ_FACTOR_1:1.0,
    FREQ_FACTOR_2:1.0,
    GOLD_2X:false,
    PROPS_TOTAL_PRICE:0,
    LEADER_GOLD_X2:false,
    LEADER_REVIVAL:false
  };
};

KS.MAP_SPAWN_DISTANCE = 35.5; // in metre
KS.FEVER_MODE_SPEED_FACTOR = 7;
KS.MAX_NORMAL_SPEED_FACTOR = 2.5;
KS.ENERGY_STAR_PROBABILITY = 0.15;
KS.PICK_BUDDY_PROBABILITY = 0.0164; // 2 out of 122 (1000m)
KS.GAME_STAGE_DISTANCES = [1000, 3000, 5000, 8000, 10000];
//KS.INVINCIBLE = true;
//KS.GAME_STAGE_DISTANCES = [300, 1300, 2300, 3300, 4300];

KS.ENEMIES = [
  {
    charactor: 1,
    hp: 30
  },
  {
    charactor: 2,
    hp: 40
  },
  {
    charactor: 3,
    hp: 50
  },
  {
    charactor: 4,
    hp: 60
  },
  {
    charactor: 5,
    hp: 70
  }
];

KS.ENEMY_HP_CYCLE_ADDITION = 50;

KS.BOSSES = [
  {
    charactor: 1,
    hp: 1000,
    attack: 1,
    rush: true,
    attackMode: 'axe',
    bulletSpeed: 600,
    collideRect: [156, 212]
  },
  {
    charactor: 2,
    hp: 1500,
    attack: 1,
    bulletHp: 3,
    rush: false,
    attackMode: 'bubbles',
    bulletSpeed: 100,
    collideRect: [164, 205]
  },
  {
    charactor: 3,
    hp: 2000,
    attack: 1,
    rush: false,
    attackMode: 'bullet',
    bulletSpeed: 1000,
    collideRect: [148, 214]
  },
  {
    charactor: 4,
    hp: 2500,
    attack: 1,
    rush: false,
    attackMode: 'bullet',
    bulletSpeed: 800,
    collideRect: [154, 192]
  },
  {
    charactor: 5,
    hp: 3000,
    attack: 1,
    rush: true,
    attackMode: 'collide',
    collideRect: [264, 198]
  }
];

KS.BOSS_HP_CYCLE_ADDITION = 5000;

KS.WEAPONS = [
  {
    name: "弓箭",
    type: 'bullet',
    bulletSpeed: 1200,
    powers: [15, 20, 25],
    intervals: [1/4, 1/4, 1/4]
  },
  {
    name: "飞镖",
    type: 'bullet',
    bulletSpeed: 1000,
    powers: [10, 15, 20],
    intervals: [1/5, 1/5, 1/5]
  },
  {
    name: "炸弹",
    type: 'bomb',
    radius: 200,
    bulletSpeed: 600,
    powers: [40, 60, 90],
    intervals: [2, 1.5, 1]
  },
  {
    name: "宝剑",
    type: 'near',
    range: 600,
    powers: [30, 40, 50],
    coolDowns: [1, 0.75, 0.5]
  },
  {
    name: "魔杖",
    type: 'near',
    range: 600,
    powers: [25, 25, 25],
    coolDowns: [1, 0.75, 0.5]
  }
];

KS.PROPS = [
  {
    name: "幸运罐头",
    textureName: "prop_can.png",
    price: 600
  },
  {
    name: "勇往直前800m",
    textureName: "prop_initial_flight.png",
    price: 1200
  },
  {
    name: "死后飞行1000m",
    textureName: "prop_death_flight.png",
    price: 1500
  },
  {
    name: "复活药水",
    textureName: "prop_revival.png",
    price: 2000
  }
];

KS.CAN_BONUS = [
  {
    name: "攻击力+10%",
    type: "attack",
    value: 1.1
  },
  {
    name: "攻击力+20%",
    type: "attack",
    value: 1.2
  },
  {
    name: "攻击力+30%",
    type: "attack",
    value: 1.3
  },
  {
    name: "攻击力+40%",
    type: "attack",
    value: 1.4
  },
  {
    name: "攻击力+50%",
    type: "attack",
    value: 1.5
  },
  {
    name: "攻击频率+10%",
    type: "frequency",
    value: 1.1
  },
  {
    name: "攻击频率+20%",
    type: "frequency",
    value: 1.2
  },
  {
    name: "攻击频率+30%",
    type: "frequency",
    value: 1.3
  },
  {
    name: "攻击频率+40%",
    type: "frequency",
    value: 1.4
  },
  {
    name: "攻击频率+50%",
    type: "frequency",
    value: 1.5
  },
  {
    name: "双倍金币",
    type: "gold"
  }
];

KS.LEADER_FEATURES = [
  {
    type: "revival",
    placeholder: "无(升至金爪开启神秘特技)",
    text: "死后可使团队复活1次"
  },
  {
    type: "frequency",
    values: [1.1, 1.2, 1.3],
    text: "所有成员攻击速率增加",
    value_texts: ["10%", "20%", "30%"]
  },
  {
    type: "attack",
    values: [1.1, 1.2, 1.3],
    text: "团队总攻击力增加",
    value_texts: ["10%", "20%", "30%"]
  },
  {
    type: "gold",
    placeholder: "无(升至金爪开启神秘特技)",
    text: "双倍金币奖励"
  }
];

KS.TASKS = [
  {
    type: 'distance',
    value: 100000,
    title: '完成100000m。'
  },
  {
    type: 'score',
    value: 20000,
    title: '在一局游戏中达到20000分。'
  },
  {
    type: 'limit_props',
    title: '在前1500m中不使用任何道具。'
  }
];

KS.TASK_ICONS = {
  'distance'    : 'res/menu_task_icon_distance.png',
  'score'       : 'res/menu_task_icon_score.png',
  'limit_props' : 'res/menu_task_icon_limit_props.png'
};

KS.COIN_PATTERNS = [
  [[320, 1084],
   [283, 1021], [357, 1021],
   [ 98, 958], [172, 958], [246, 958], [320, 958], [394, 958], [468, 958], [542, 958],
   [135, 895], [209, 895], [431, 895], [505, 895],
   [172, 832], [468, 832],
   [135, 769], [209, 769], [431, 769], [505, 769],
   [ 98, 706], [172, 706], [246, 706], [320, 706], [394, 706], [468, 706], [542, 706],
   [283, 643], [357, 643],
   [320, 580]]
];

KS.IAP_IDENTIFIERS = [
  'kittenstriker.goldpack1',
  'kittenstriker.goldpack2',
  'kittenstriker.goldpack3',
  'kittenstriker.goldpack4'
];
