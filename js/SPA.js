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

  restoreInfo();

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

// Progress-bar
function progress(EO) {
  if ( EO.lengthComputable ) {
      var perc=Math.round(EO.loaded/EO.total*100);
      document.getElementById('IProgressPerc').style.width=perc+"%";
  }
}

function complete() {
  document.getElementById('IProgress').style.display="none"; 
}
// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
switchToStateFromURLHash();

//              Таблица рекордов
//************************************************
var ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
var updatePassword;
var stringName='YALOVIK_ARKANOID_INFO';
var records;
var playerName;

function storeInfo() {
//запрашиваем имя у игрока
  playerName=window.localStorage.getItem('name');
  if ( playerName )
    document.querySelector('input').value = playerName;

  updatePassword=Math.random();
  $.ajax( {
      url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
      data : { f : 'LOCKGET', n : stringName, p : updatePassword },
      success : lockGetReady, error : errorHandler
    }
  );
}

function lockGetReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
    else {
        records=[];
        if( callresult.result!="" ) { // либо строка пустая - сообщений нет
          // либо в строке - JSON-представление массива сообщений
          records=JSON.parse(callresult.result); 
          // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
          if ( !Array.isArray(records) )
              records=[];
      } 

      records.push( { name:playerName, age:player.total } );

        $.ajax( {
                url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                data : { f : 'UPDATE', n : stringName, v : JSON.stringify(records), p : updatePassword },
                success : updateReady, error : errorHandler
            }
        );
    }
}

function updateReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
}

function restoreInfo() {
    $.ajax(
        {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName },
            success : readReady, error : errorHandler
        }
    );
}

function readReady(callresult) {
    if ( callresult.error!=undefined )
        alert(callresult.error); 
    else {
      records=[];
      if ( callresult.result!="" ) {

        records=JSON.parse(callresult.result);

        if ( !Array.isArray(records) )
                records=[];
      }

      records.sort(function(a,b) {
        return b.age - a.age;
      });

      showTable(records)
    }
}

function showTable(records) {
  var PageHTML="";
  PageHTML+='<table>';
  PageHTML+='<caption>Таблица рекордов</caption>';		
  PageHTML+='<tr><th>Имя игрока</th><th>Очки</th></tr>';

  var recordsCount = records.length;
  if (recordsCount > 10) recordsCount = 10;
  for (var i=0; i < recordsCount; i++) {
    PageHTML += '<tr><td>' + records[i].name +'</td><td class="Name">'+ records[i].age + '</td></td></tr>';
  }		

  PageHTML += '</table>';
  $('.table').empty().append(PageHTML);
}

function errorHandler(jqXHR,statusStr,errorStr) {
    alert(statusStr+' '+errorStr);
}

restoreInfo();

//************************************************ 


//Popup
var popUp = document.createElement('div');
popUp.classList.add('popUp');

var messageContainer = document.createElement('div');
messageContainer.classList.add('messageContainer');
popUp.appendChild(messageContainer);

var message = document.createElement('p');
message.classList.add('message');
messageContainer.appendChild(message);

var input = document.createElement('input'); 
input.classList.add('input');
messageContainer.appendChild(input);

var btn = document.createElement('button');
btn.classList.add('btn__popup');
btn.innerHTML = 'Save & Reload';
messageContainer.appendChild(btn);

var initPopup = function(msg) {  
  message.innerHTML = msg;
  document.body.appendChild(popUp);
  storeInfo();
  player.play = false;
  btn.addEventListener('click', removePopup, false);
}

var removePopup = function() {  
  window.localStorage.setItem('name',document.querySelector('input').value);
  storeInfo();
  grid.bricks=[];
  init();  
  document.body.removeChild(popUp);
}