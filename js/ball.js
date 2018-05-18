'use strict';

var ball = {
  x: 0,
  y: 0,
  r: W*0.01,
  dx: 0,
  dy: 0,
  speed: 2,
  color: 'red',

  draw: function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  },

  init: function(x,y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.speed = 2;
  },

  run: function() {
    this.dx = -this.speed;
    this.dy = -this.speed;
  },

  move: function() {
    this.x += this.dx;
    this.y += this.dy;  
  },
 
  collision: function() {
    // Столкновение с кирпичами
    for(var i in grid.bricks) {
      var brick = grid.bricks[i];

      if (this.x-this.r + this.dx < brick.x + brick.w &&
          this.x-this.r + this.dx + this.r*2 > brick.x &&
          this.y-this.r + this.dy < brick.y + brick.h &&
          this.y-this.r + this.dy + this.r*2 > brick.y) 
        {
          if ( this.y + this.r > brick.y) {
            this.dy *= -1;              
          }
          if ( this.x - this.r < brick.x + brick.w ) {
            this.dx *= -1;              
          }
          if ( this.x + this.r > brick.x ) {
            this.dx *= -1;              
          }
          if ( this.y - this.r < brick.y + brick.h ) {
            this.dy *= -1;              
          }            
        
        // this.speed += 0.1;
        // this.run()
        player.speed += 0.1;
        brick.status--;
        grid.collision();
        player.initSound();
      }        
    }
    // Столкновение с левой стеной
    if( this.x - this.r <= 0) {
      this.dx *= -1;
      player.initSound()
    }
    // Столкновение с правой стеной
    if( this.x + this.r >= W) {
      this.dx *= -1;
      player.initSound();
    }
    // Столкновение с потолком
    if( this.y - this.r <= 0) {
      this.dy *= -1;
      player.initSound();
    }
    // Столкновение с ракеткой
    if (this.x-this.r + this.dx < player.x + player.w &&
        this.x-this.r + this.dx + this.r*2 > player.x &&
        this.y-this.r + this.dy < player.y + player.h &&
        this.y-this.r + this.dy + this.r*2 > player.y) 
      {
      if ( this.x - this.r < player.x + player.w ) {
        this.dx *= -1;              
      }
      if ( this.x + this.r > player.x ) {
        this.dx *= -1;              
      }
      this.dy *= -1;
      this.dx = player.dx || this.dx;
      player.initSound();
    }
    // Столкновение с полом
    if ( this.y + this.r >= H ) {
      player.init();
      player.hp--;
      player.updateHp();
      player.play = false;
      initPopup('К сожалению вы проиграли. Попробуйте еще раз!');
      

      if( player.hp < 1) {
        storeInfo();
        initPopup('К сожалению вы проиграли. Попробуйте еще раз!'); 
      } 

      this.init(player.x + player.w / 2, player.y - ball.r);     
    }
  }
}