'use strict';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var W = canvas.width;
var H = canvas.height;
var PLAYER_W = W*0.15;
var PLAYER_H = W*0.02;
var OFFSET = W*0.02;

var fillAll = function() {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0,0,W,H)
}

var clearAll = function() {
  ctx.clearRect(0,0,W,H)
}
