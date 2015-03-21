var GameManager = cc.Class.extend({
  paused              : false,
  p_revival           : false,
  p_revivalUsed       : false,
  p_deathFlight       : false,
  p_deathFlightUsed   : false,
  p_initialFlight     : false,
  p_initialFlightUsed : false,
  p_leaderRevival     : false,
  p_leaderRevivalUsed : false,
  p_2xGold            : false,
  attackFactor        : 1.0,
  freqFactor          : 1.0,
  score : 0,
  distance : 0,
  bossDistance : 0,
  coin : 0,
  combo : 0,
  maxCombo : 0,
  newRecord : false,
  ctor:function() {
  },
  hasRevival:function() {
    return this.p_revival && !this.p_revivalUsed;
  },
  getRevival:function() {
    this.p_revival = true;
    this.p_revivalUsed = false;
  },
  useRevival:function() {
    if (this.p_revival && !this.p_revivalUsed) {
      this.p_revivalUsed = true;
    }
  },
  hasDeathFlight:function() {
    return this.p_deathFlight && !this.p_deathFlightUsed;
  },
  getDeathFlight:function() {
    this.p_deathFlight = true;
    this.p_deathFlightUsed = false;
  },
  useDeathFlight:function() {
    if (this.p_deathFlight && !this.p_deathFlightUsed) {
      this.p_deathFlightUsed = true;
    }
  },
  hasInitialFlight:function() {
    return this.p_initialFlight && !this.p_initialFlightUsed;
  },
  getInitialFlight:function() {
    this.p_initialFlight = true;
    this.p_initialFlightUsed = false;
  },
  useInitialFlight:function() {
    if (this.p_initialFlight && !this.p_initialFlightUsed) {
      this.p_initialFlightUsed = true;
    }
  },
  hasLeaderRevival:function() {
    return this.p_leaderRevival && !this.p_leaderRevivalUsed;
  },
  getLeaderRevival:function() {
    this.p_leaderRevival = true;
    this.p_leaderRevivalUsed = false;
  },
  useLeaderRevival:function() {
    if (this.p_leaderRevival && !this.p_leaderRevivalUsed) {
      this.p_leaderRevivalUsed = true;
    }
  },
  has2xGold:function() {
    return this.p_2xGold;
  },
  get2xGold:function() {
    this.p_2xGold = true;
  },
  getIncAttack:function(value) {
    this.attackFactor = value;
  },
  getIncFreq:function(value) {
    this.freqFactor = value;
  },
  accumulateCombo:function() {
    this.combo += 1;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
    if (this.combo < 2) {
      return false;
    }
    g_sharedGameLayer.onCombo(this.combo);
    return true;
  },
  breakCombo:function() {
    if (this.combo > 1) {
      g_sharedGameLayer.onComboBreak();
    }
    this.combo = 0;
  },
  collectCoin:function() {
    this.coin++;
  },
  incDistance:function(dist) {
    this.distance += dist;
    this.bossDistance += dist;
  },
  incScore:function(score) {
    this.score += score;
    this.score = Math.round(this.score);
  },
  normalizeReadings:function() {
    this.score = Math.round(this.score);
    this.distance = Math.round(this.distance);
  },
  gameOver:function() {
    this.normalizeReadings();
    this.score += this.maxCombo * 100;
    if (this.has2xGold()) {
      this.coin *= 2;
    }
    if (this.score > g_sharedGameData.getHighestScore()) {
      g_sharedGameData.setHighestScore(this.score);
      this.newRecord = true;
    }
    g_sharedGameData.incGold(this.coin);
  }
});

