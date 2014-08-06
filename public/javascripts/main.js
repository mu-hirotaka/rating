$(function() {
  
  var socket = io.connect('http://localhost:3000');

  function initializePlayerView (data) {
    var players = data.players;

    _.each(players, function(item) {
      $('.player-list').append('<li class="player-id-' + item.id + '">'
        + '<div class="row">'
          + '<div class="col-xs-3">'
            + '<div class="player-img-' + item.id + '"></div>'
            + '<div class="player-name">' + item.name + '</div>'
          + '</div>'
          + '<div class="col-xs-9">'
            + '<div class="input-area">'
              + '<form>'
                + '<input type="text" name="opinion" size="28">'
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
      $('.player-img-' + item.id).height(50);
      $('.player-img-' + item.id).css("background-size", "contain");
      $('.player-img-' + item.id).css("background-repeat", "no-repeat");
      
    });
    $('.btn-send').on('click', function() {
      var playerId = $(this).prev('input').val();
      var rating = $(this).prevAll('select').val();
      var $input = $(this).parent().prev();

      localStorage.setItem('player-id' + playerId, rating);
      socket.emit('rating', {
        id: playerId,
        rating: rating,
        opinion: $input.val(),
      });

      $('.player-id-' + playerId).fadeOut('normal');
    });

  }

  function updateSummaryView(data) {
    var $table = $('.table');
    $table.empty();
    $table.append('<thead><tr><th>順位</th><th>Name</th><th>平均</th><th>投票数</th><th>あなた</th></tr></thead>');
    $table.append('<tbody></tbody>');
    var $tableInner = $('.table > tbody');
    var sorted = [];
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
      $tableInner.append('<tr><td>' + i + '</td>' + '<td>' + item.name + '</td><td>' + avg + '</td><td>' + item.num + '</td><td>' + myRating + diffStr + '</td></tr>');
      i++;
    });

    var $div = $('.player-opinion');
    $div.empty();
    _.each(sorted, function(item) {
      if (item.opinion.length > 0) {
        $div.append('<h3>' + item.name + '</h3>');
        $div.append('<ul>');
        _.each(item.opinion, function(comment) {
          $div.append('<li>' + comment + '</li>');
        });
        $div.append('</ul>');
      }
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
