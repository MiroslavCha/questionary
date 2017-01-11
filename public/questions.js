"use strict";
$.ajax ({
  type: "GET",
  url: "quest",
  data: { id: getParameterByName("param")} ,
  contentType: 'application/json; charset=utf-8',
  success: function(data) {
    console.log("Asking data " + data.questions.length);
    for (var i = 1; i <= data.questions.length; i++) {
      appendQuestion(data.questions[i - 1], i);
    }

    addComments();
  }
});

$('#upload').click(function() {
  $.ajax ({
    type: "POST",
    url: "/quest"
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function() {
       //data was sent dialog
    }
  })


}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function appendQuestion(question, counter) {
  var newQuestion = "<div class='question-container'>" +
     "<div class='question-body'>" + counter + ": " + question.text + "</div>" +
      "<div class=radio-btn>" +

        "<input type='radio' name='editList' value='always'>" + "Always  " +
        "<input type='radio' name='editList' value='never'>" +  "Never  " +
        "<input type='radio' name='editList' value='costChange'>" + "Cost Change  " +
      "</div>" +
     "</div>";


  $('#question-target').append(newQuestion);
}

function addComments() {
  var comment =  "<div class='question-container'>" +
    "<div class='question-body'>" + "What is good?" + "</div>" +
    "<textarea class='quest-input' id='comment-good'>" + "</textarea>"
    "</div>";

  $('#question-target').append(comment);

  comment =  "<div class='question-container'>" +
    "<div class='question-body'>" + "What is bad?" + "</div>" +
    "<textarea class='quest-input' id='comment-bad'>" + "</textarea>"
    "</div>";

  $('#question-target').append(comment);
}
