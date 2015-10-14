var quiz_num = 10; //number of question
var choice_num = 4; //number of choice
var len = 17;
var current = 0;
var right = 0;
var data;
var flg = false;

var quiz_ind;

var main = function() {

  my_json_reader();
  quiz_ind = myrange(len);

  $('#in_quiz').hide();//conceal in_quiz stuff
  $('#show_result').hide();
  $('#control').hide();

  $('#startbtn').click(game_start);

  $('.choice').click(function(){
    answer_check($(this).text());
  });

  $('#quiz').click(function(){
    to_next_quiz();
  });

}

var game_start = function(){
  $('#start').hide(); //conceal opening stuff
  $('#in_quiz').show(); //show in_quiz stuff
  $('.sign').hide();

  shuffle(quiz_ind); //for random question

  quiz();
}

function shuffle(array) {
  var n = array.length, t, i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    t = array[n];
    array[n] = array[i];
    array[i] = t;
  }

  return array;
}

function myrange(max){
  var ary = [];
  for(var i=0;i < max;i++){
    ary[i] = i;
  }

  return ary;
}

function my_json_reader(){
  $.getJSON("./quiz.json",function(quiz){
    data = quiz;
  });
}

var quiz = function(){

  var index = quiz_ind[current];

  $('#quizboard').html('<p id="question">' + data[index].q + '</p>');

  var choices = data[index].a.concat(); //concat for call by value
  shuffle(choices);
  for(var i=0;i < choice_num;i++){
    $('.choice span').eq(i).text(choices[i]);
  }
}

var answer_check = function(answer){

  $('.choice').attr("disabled",true);
  $('.choice').hide();

  if(answer === data[quiz_ind[current]].a[0]){ //quiz_ind[current] mean index
    right++;
    $('#in_quiz').append('<img id="maru" class="sign" src="./maru.png" />');
    sounds("#maru_audio");
  }else{
    $('#in_quiz').append('<img id="batsu" class="sign" src="./batsu.png" />');
    sounds("#batsu_audio");
  }
}

var sounds = function(id){
  if(!$(id).ended){
    $(id).get(0).pause();
    $(id).get(0).currentTime = 0;
  }
  $(id).get(0).play();
}

var to_next_quiz = function(){
  if($('.choice').prop("disabled") === true){
    if(flg === false){
      flg = true;
    }else{
      flg = false;
      $('.choice').removeAttr('disabled');
      $('.choice').show();
      $('.sign').remove();

      if(current < quiz_num - 1){
        current++;
      }else{
        show_result();
      }

      quiz();
    }
  }
}

var show_result = function(){
  $("#in_quiz").hide();
  $("#show_result").show();
  $("#control").show();
  var text = '<p id="result_text">' + quiz_num + '問中' + right + '問正解！</p>'
  $("#show_result").append(text);

  var word = "あなたの知能は<br /><span class='result'>";
  var picture = "./chinpan.jpg";
  switch(right){
    case 0: word += "ちゃんみわ"; picture="./chinpan.jpg"; break;
    case 1: word += "宮内れんげ"; picture="./ikenuma.jpg"; break;
    case 2: word += "まろみ"; picture="./car.jpg"; break;
    case 3: word += "ちゃんなな"; picture="./ikenuma2.png"; break;
    case 4: word += "あのYoutuber"; picture="./youtuber.jpg"; break;
    case 5: word += "野口さんの兄"; picture="./hujio.jpg"; break;
    case 6: word += "上司"; picture="./joushi.jpg"; break;
    case 7: word += "るるも"; picture="./338.png"; break;
    case 8: word += "八岐大蛇"; picture="./yamata.jpg"; break;
    case 9: word += "譽田真純"; picture="./theman.png"; break;
    case 10: word += "人間"; picture="./human.jpg"; break;
    default: word += "判定不能";
  }

  word += "</span>レベルです";

  $("#show_result").append('<p id="word">' + word + '</p>');
  $("#show_result").append('<p><img id="picture" src=' + picture + ' /></p>');

  $("#control").append('<p><button id="reset" class="btn btn-danger btn-lg">やりなおす</button></p>');
  var tweet = '<a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-text="' + $('<div>').html(word).text() + '"></a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script>';
  $("#control").append('<div id="tweet">' + tweet + '</div>');

  $('#reset').click(function(){
    my_reset();
  });
}

var my_reset = function(){
  $('#show_result').empty();
  $('#show_result').hide();
  $('#control').empty();
  $('#control').hide();
  current = 0;
  right = 0;
  $('#start').show();
}

$(document).ready(main);
