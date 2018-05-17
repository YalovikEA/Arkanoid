'use strict';
window.onhashchange=switchToStateFromURLHash;

var SPAState={};

function switchToStateFromURLHash() {
  var URLHash=window.location.hash;

  var stateStr=URLHash.substr(1);
  if ( stateStr!="" ) { // если закладка непустая, читаем из неё состояние и отображаем
    var parts=stateStr.split("_")
    SPAState={ pagename: parts[0] }; // первая часть закладки - номер страницы
  }
  else
    SPAState={ pagename:'Main'}; // иначе показываем главную страницу

  var pageHTML="";
  switch ( SPAState.pagename ) {
    case 'Main':
      loadPage('../main.html','html', mainSuccess)
      break;
    case 'Game':
      loadPage('../game.html', 'html', gameSuccess);
      break;
    case 'Score':
      loadPage('../score.html', 'html', mainSuccess);
      break;
  }
  document.getElementById('page-main').innerHTML=pageHTML;
}

function loadPage(src,dType,success) {
  $.ajax(src,
    {type: 'GET', dataType: dType, cache:false,
    success: success, complete:complete, error: Error, 
    xhrFields: { onprogress: progress }}
  );
}

function mainSuccess(data) {
  document.getElementById('page-main').innerHTML= data;

  removeScripts();

  function removeScripts() {
    var head = document.getElementsByTagName('head')[0];
    var scripts = head.getElementsByTagName('script');

    for(var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      head.removeChild(script);
      removeScripts();
    }
  }
}

function gameSuccess(data) {
  document.getElementById('page-main').innerHTML= data;

  var scripts = ["js/canvas.js","js/ball.js","js/player.js","js/controls.js","js/map.js","js/main.js"];
  getScripts();

  function getScripts(){

    var counter = 0;

    function getNextScript() {
      if ( counter < scripts.length ) {
        $.ajax(scripts[counter],
          { type:'GET', dataType:'script',
            success: function() {  
              var script=document.createElement('script');
              script.src = scripts[counter];
              document.getElementsByTagName('head')[0].appendChild(script);
              counter ++;
              getNextScript();
            }, 
            error: Error }
          );
        return;
      }
    }
    getNextScript();
  }
}

function switchToState(newState) {
  var stateStr=newState.pagename;
  location.hash=stateStr;
}

function switchToMainPage() {
  switchToState( { pagename:'Main' } );
}

function switchToGamePage() {
  switchToState( { pagename:'Game' } );
}

function switchToScorePage() {
  switchToState( { pagename:'Score' } );
}

function progress(EO) {
  if ( EO.lengthComputable ) {
      var perc=Math.round(EO.loaded/EO.total*100);
      document.getElementById('IProgress').style.display="block";
      document.getElementById('IProgressPerc').style.width=perc+"%";
  }
}

function complete() {
  document.getElementById('IProgress').style.display="none"; 
}
// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
switchToStateFromURLHash();
