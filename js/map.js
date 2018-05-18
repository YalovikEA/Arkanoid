var Brick = function(x,y,w,h,color,status) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.status = status;

  this.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.closePath();
  }
}

// Карта уровня
var level1 = {
  // brickWidth: W*0.06,
  brickWidth: W*1,
  
  brickHeight: H*0.03,
  offset: W*0.02,

  map: [
    [1]
    // [1,1,1,0,1,1,1,0,1,1,1],
    // [1,0,1,0,1,0,1,0,1,0,1],
    // [1,0,0,0,1,0,0,0,1,0,0],
    // [1,0,0,0,1,1,1,0,1,1,1],
    // [1,0,0,0,0,0,1,0,0,0,1],
    // [1,0,1,0,1,0,1,0,1,0,1],
    // [1,1,1,0,1,1,1,0,1,1,1]    
  ]
}

var level2 = {
  brickWidth: W*0.06,
  brickHeight: H*0.03,
  offset: W*0.02,

  map: [
    [0,0,2,2,2,0,0,2,2,0],
    [0,0,0,2,0,0,2,0,0,2],
    [0,0,0,2,0,0,2,0,0,0],
    [0,0,0,2,0,0,0,2,2,0],
    [2,0,0,2,0,0,0,0,0,2],
    [2,0,0,2,0,0,2,0,0,2],
    [0,2,2,0,0,0,0,2,2,0]
  ]
}

var level3 = {
  brickWidth: 50,
  brickHeight: 15,
  offset: 10,

  map: [
    [1,1,0,1,1,0,0,1,1],
    [1,0,0,1,0,0,0,1,0],
    [1,0,0,0,1,0,0,0,1],
    [1,0,0,0,1,0,0,0,1],
    [1,1,0,1,0,0,0,1,0]
  ]
}

var grid = {
  bricks: [],

  add: function(x,y,w,h,color,status){
    var brick = new Brick(x,y,w,h,color,status);
    this.bricks.push(brick);
  },

  create: function(level) {
    var offsetX = (W - (level.map[0].length * (level.brickWidth + level.offset)))/2;
    var offsetY = level.offset*1.5;
    
    for(var col in level.map) {
      for(var row in level.map[col]) {
        var brick = level.map[col][row];
        var brickX = offsetX + row * (level.brickWidth + level.offset);
        var brickY = offsetY + col * (level.brickHeight + level.offset);
        if(brick == 1) {
          this.add(brickX, brickY, level.brickWidth, level.brickHeight, 'blue',1);
        }
        if(brick == 2) {
          this.add(brickX, brickY, level.brickWidth, level.brickHeight, 'green',2);
        }
        if(brick == 3) {
          this.add(brickX, brickY, level.brickWidth, level.brickHeight, 'yellow',3);
        }
      }
    }
  },

  // Разрушение кирпичей
  destroy: function(id) {
    this.bricks.splice(id, 1)
  },

  // Рисуем кирпичи
  draw: function() {
    for(brick in this.bricks) {
      this.bricks[brick].draw();
    }
  },

  // Столкновение с кирпичами
  collision: function() {
    for ( var i in this.bricks ) {
      var brick = this.bricks[i];

      if ( brick.status == 2 ) {
        brick.color = 'green';
      }
      if ( brick.status == 1 ) {
        brick.color = 'blue';
      }

      if ( brick.status == 0 ) {
        this.destroy(i);

        player.total++;
        player.updateTotal();
      }

      if (this.bricks.length == 0 ) {
        player.levelUp();

        player.init();
        player.play = false; 

        ball.init( player.x + player.w / 2, player.y - ball.r );

        this.create(eval('level' + player.level + ' '));        
      }
    }
  }
}