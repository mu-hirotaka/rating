$(function() {
  
  var socket = io.connect('http://localhost:3000');

  function initializePlayerView (data) {
    var players = data.players;

    _.each(players, function(item) {
      $('.player-list').append('<li class="player-id-' + item.id + '">'
        + '<div class="row">'
          + '<div class="col-xs-2">'
            + '<div class="player-info">'
              + '<div class="player-img-' + item.id + '"></div>'
              + '<div class="player-name">' + item.name + '</div>'
            + '</div>'
          + '</div>'
          + '<div class="col-xs-10">'
            + '<div class="input-area">'
              + '<form>'
                + '<textarea name="opinion" rows="4" cols="40"></textarea>'
                + '<div class="btn-area">'
                  + '<select class="selectbox" name="text">'
                    + '<option value="10">10</option>'
                    + '<option value="9.5">9.5</option>'
                    + '<option value="9.0">9.0</option>'
                    + '<option value="8.5">8.5</option>'
                    + '<option value="8.0">8.0</option>'
                    + '<option value="7.5">7.5</option>'
                    + '<option value="7.0">7.0</option>'
                    + '<option value="6.5">6.5</option>'
                    + '<option value="6.0" selected>6.0</option>'
                    + '<option value="5.5">5.5</option>'
                    + '<option value="5.0">5.0</option>'
                    + '<option value="4.5">4.5</option>'
                    + '<option value="4.0">4.0</option>'
                    + '<option value="3.5">3.5</option>'
                    + '<option value="3.0">3.0</option>'
                    + '<option value="2.5">2.5</option>'
                    + '<option value="2.0">2.0</option>'
                    + '<option value="1.5">1.5</option>'
                    + '<option value="1.0">1.0</option>'
                    + '<option value="0.5">0.5</option>'
                    + '<option value="0">0</option>'
                  + '</select>'
                  + '<input type="hidden" name="id" value="' + item.id + '">'
                  + '<button type="button" class="btn-send">送信</button>'
                + '</div>'
              + '</form>'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</li>');

      $('.player-img-' + item.id).css("background-image", "url('/images/" + item.img + ".png')");
      $('.player-img-' + item.id).width(100);
      $('.player-img-' + item.id).height(100);
      $('.player-img-' + item.id).css("background-size", "contain");
      
    });
    $('.btn-send').on('click', function() {
      var $input = $(this).prev('input');
      var $select = $(this).prevAll('select');

      localStorage.setItem('player-id' + $input.val(), $select.val());
      socket.emit('rating', {
        id: $input.val(),
        rating: $select.val(),
      });

      $('.player-id-' + $input.val()).fadeOut('normal');
    });

  }

  function updateSummaryView(data) {
    var $table = $('.table');
    $table.empty();
    $table.append('<thead><tr><th>順位</th><th>Name</th><th>平均</th><th>あなたの評価</th></tr></thead>');
    $table.append('<tbody></tbody>');
    var $tableInner = $('.table > tbody');
    var sorted = [];
      console.log(data);
    _.each(data, function(val, key, list) {
      sorted.push(val);
    });
    sorted = _.sortBy(sorted, function(item) {
      if (item.num == 0) {
        return 0;
      }
      else {
        return - item.sum / item.num;
      }
    });
    var i = 1;
    _.each(sorted, function(item) {
      var avg = 0;
      if (item.num != 0) {
        avg = (item.sum / item.num).toFixed(1);
      }
      var myRating = localStorage.getItem('player-id' + item.id);
      var diff = (myRating - avg).toFixed(1);
      var diffStr = '';
      if (diff > 0) {
        diffStr = '<span style="color:#DC143C;">(+' + diff + ')</span>';
      }
      else if (diff < 0 ) {
        diffStr = '<span style="color:#0000CD;">(' + diff + ')</span>';
      }
      $tableInner.append('<tr><td>' + i + '</td>' + '<td>' + item.name + '</td><td>' + avg + '</td><td>' + myRating + diffStr + '</td></tr>');
      i++;
    });
  }
  
  socket.on('login', function(data) {
    initializePlayerView(data);
    updateSummaryView(data.summary)
  });

  socket.on('summary view', function(data) {
    updateSummaryView(data.summary)
  });
});
