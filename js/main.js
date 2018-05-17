'use strict';

var RAF =
// находим, какой метод доступен
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
// ни один не доступен
// будем работать просто по таймеру
function(callback) {
  window.setTimeout(callback, 1000 / 60);
};

// **********************************************************
var clickAudio = new Audio;
  if ( clickAudio.canPlayType("audio/mpeg")=="probably" )
      clickAudio.src="http://fe.it-academy.by/Examples/Sounds/button-16.mp3";
  else
      clickAudio.src="http://fe.it-academy.by/Examples/Sounds/button-16.ogg";

function clickSoundInit() {
  clickAudio.play(); // запускаем звук
  clickAudio.pause(); // и сразу останавливаем
}

function clickSound() {
  clickAudio.currentTime=0; // в секундах
  clickAudio.play();
}
// **********************************************************

var game = function() {
  clearAll();
  fillAll();

  if(SPAState.pagename !== 'Game') {
    player.play = false;
  }

  if(player.dx) {
    player.collision();
    player.move();    
  }
  if(ball.dx || ball.dy) {
    ball.collision();
    ball.move();    
  }

  grid.draw();
  ball.draw();
  player.draw();
}

var tick = function() {
  game();
  if( player.play ) {
    RAF(tick);
  }
}

function init() {
  
  grid.create(level1)
  player.init();
  ball.init(player.x + player.w / 2, player.y - ball.r);

  fillAll();
  player.draw();
  grid.draw();
  ball.draw();

}

init();