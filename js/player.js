'use strict';

var player = {
  w: PLAYER_W,
  h: PLAYER_H,
  x: W/2-PLAYER_W/2,
  y: H-PLAYER_H-OFFSET,
  color: 'blue',
  speed: 2,
  dx: 0,
  hp: 3,
  level: 1,
  total: 0,
  play: false,
  sound: true,
  ball: undefined,

  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.closePath();
  },

  reload: function() {
    this.x = W/2-PLAYER_W/2;
    this.y = H-PLAYER_H-OFFSET;
    this.ball = true;
    this.speed = 2;
    this.hp = 3;
    this.level = 1;
    this.total = 0; 
    this.updateHp();
    this.updateLevel();
    this.updateTotal();
  },

  init: function() {
    this.ball = true;
    this.speed = 2;
    this.x = W/2-PLAYER_W/2;
    this.y = H-PLAYER_H-OFFSET;
  },

  updateHp: function() {
    var hp = document.getElementById('hp');
    hp.innerHTML = 'Колличество HP : ' + this.hp;
  },

  updateTotal: function() {
    var total = document.getElementById('total');
    total.innerHTML = this.total;
  },

  updateLevel: function() {
    var level = document.getElementById('level');
    level.innerHTML = 'Level : ' + this.level;
  },

  levelUp: function() {
    this.level ++;
    this.updateLevel();
  },
  

  runBall: function() {
    if( this.ball ) {
      ball.run();
      this.ball = false;
    }
  },

  move: function() {
    this.x += this.dx;

    if( this.ball ) {      
      ball.x += this.dx;
    }
  },

  collision: function() {
    // Вышла ли ракетка левее стены?
    if( this.x<=0 ) {
      this.x = 0;
      if( this.ball ) {
        ball.x = this.x + this.w / 2;
      } 
    }
    // Вышла ли ракетка правее стены?
    if ( this.x + this.w > W ) {
      this.x = W - this.w;
      if( this.ball ) {
        ball.x = this.x + this.w / 2;
      }
    }
  },

  initSound: function() {
    if( this.sound ) 
      clickSound();
  }
}