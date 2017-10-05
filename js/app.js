var Main = (function() {

  var socket, timer, fn = {

    // 鏈接到伺服器
    connect: function(roomID, server, callback) {
      var _tips = document.getElementById('connectStat');
      // SocketIO 初始化
      socket = io.connect(server);
      // SocketIO 連接事件監聽
      socket.on('connect', function() {
        _tips.innerHTML = '正在連線...';
        socket.emit('join', { room: String(roomID) });
        socket.emit('action', { time_limit: 'negotiation' });
      });
      // SocketIO 接收事件監聽
      socket.on('response', function(data) {
        var result = JSON.parse(data.toString());
        if(typeof(result['time_limit']) !== 'undefined'){
          _tips.innerHTML = '連線成功...';
          callback(true);
        }
      });
      // SocketIO 斷線事件監聽
      socket.on('disconnect', function() {
        _tips.innerHTML = '已與伺服器斷開連線...';
      });
    },

    // 發送震動強度
    sendVibe: function(level) {
      socket.emit('action', { motor_level: level });
    },

    // 調教開始|ω・´)
    SMTune: function(){
      var random = parseInt(Math.random() * 100);
      fn.sendVibe(random);
    },

    // 停一下|ω・´)
    SMTunePause: function() {
      console.log(timer);
    }

  },

  init = function() {

    var _room = document.getElementById('roomID'),
        _start = document.getElementById('start'),
        _pause = document.getElementById('pause'),
        server = 'game.magicmotion.cn';

    _start.addEventListener('click', function() {
      var roomID = _room.value;
      if(roomID != '') {
        fn.connect(roomID, server, function() {
          // 設置暫停按鈕爲可用狀態
          _pause.disabled = false;
          // 誒嘿嘿|ω・´)
          timer = setInterval(function() {
            fn.SMTune();
          }, 500);
        });
      } else {
        alert('房間號不能爲空~');
      }
    });

    _pause.addEventListener('click', function() {
      fn.sendVibe(0);
      clearInterval(timer);
      socket.disconnect();
      if(this.disabled == false) this.disabled = 'disabled';
    });

  };

  return {
    fn: fn,
    init: init
  }

})();

window.onload = function() {
  Main.init();
}