var buttonGo = document.getElementById('go');
var buttonStop = document.getElementById('stop');
var buttonSound = document.getElementById('sound');

buttonStop.addEventListener('click', pause, false);
buttonGo.addEventListener('click', play, false);
buttonSound.addEventListener('click', sound, false);
document.addEventListener('mousemove', mousemove, false);
document.addEventListener("touchmove", touchmove, false);
document.addEventListener('keydown', keydown, false);
document.addEventListener('keyup', keyup, false);

var play = function() {
  if(!player.play) {
    player.play = true;
    tick();
    player.runBall();
  }
}

var pause = function() {
  player.play = false;
}

var sound = function() {
  if(player.sound) {
    player.sound = false;
  } else {
    player.sound = true;
  }
}

var mousemove = function(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    player.x = relativeX - player.w/2;
    player.collision();
    if(player.ball) {
      ball.x = relativeX;
    }
  }
}

var touchmove = function(e) {
  e.preventDefault();
  var touch = e.targetTouches[0];
  var relativeX = touch.pageX - canvas.offsetLeft;

  if(relativeX > 0 && relativeX < canvas.width) {
    player.x = relativeX - player.w/2;
    player.collision(); 
    if(player.ball) {
      ball.x = player.x + player.w/2;
    }
  }
}

var keydown = function(e) {
  // Left-влево
  if(e.keyCode === 37) {
    player.dx = -player.speed;   
  }
  // Right-вправо
  if(e.keyCode === 39) {
    player.dx = player.speed;
  }
  // Space-запустить шарик
  if(e.keyCode === 32) {
    play();
    buttonGo.focus();
  }
}

var keyup = function(e) {
  // Left-влево
  if(e.keyCode === 37) {
    player.dx = 0;
    if(player.ball) {
      ball.dx = 0;
    }  
  }
  // Right-вправо
  if(e.keyCode === 39) {
    player.dx = 0;
    if(player.ball) {
      ball.dx = 0;
    }
  }
}