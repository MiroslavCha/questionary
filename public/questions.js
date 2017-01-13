"use strict";
$.ajax ({
  type: "GET",
  url: "quest",
  data: { id1: getParameterByName("param1"), id2: getParameterByName("param2")} ,
  contentType: 'application/json; charset=utf-8',
  success: function(data) {
    createTitle(data);
    for (var i = 1; i <= data.questions.length; i++) {
      appendQuestion(data.questions[i - 1], i);
    }

    addComments();
  }
});

$('#upload').click(function() {
  $.ajax ({
    type: "POST",
    url: "/quest",
    contentType: 'application/json',
    data: prepareData(),
    success: function(data) {
      alert("All OK");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     alert("Some error");
   }
  })
});

function prepareData()
{
  var rec = [];

  for (var i = 1; i <= 2; i++ ) {
      var id = 'input[name=editList' + i +']:checked';
      var value = $(id).val();
      var responce = {'id': i, 'val': value };
      rec.push(responce);
  }

  var ret = JSON.stringify({record: rec});
  return ret;
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

function createTitle(data) {
  var roleName = data.questions.pop();
  var feedbackName = data.questions.pop();

  var table = new Object();
  table["marianboda"] = "Marian Boda";
  table["rudolfdobrovic"] = "Rudolf Dobrovic";
  table["radokokula"] = "Rado Kokula";
  table["jurajandris"] = "Juraj Andris";
  table["petergejgus"] = "Peter Gejgus";
  table["lukasondriga"] = "Lukas Ondriga";
  table["michalsvoboda"] = "Michal Svoboda";

  var name = table[feedbackName.feedback_name];
  $('#title').append(name);

  if (roleName.role_name == "selffeedback")
  {
      $('#title').append(" from himself");
  }
  else {
    $('#title').append(" from his ");
    $('#title').append(roleName.role_name);
  }
}


function appendQuestion(question, counter) {
  var newQuestion = "<div class='question-container'>" +
     "<div class='question-body' id='" + counter + "'>" + counter + ": " + question.text + "</div>" +
      "<div class=radio-btn>" +

        "<input type='radio' name='editList" + counter + "' value='1'>" + "Always  " +
        "<input type='radio' name='editList" + counter + "' value='2'>" +  "Never  " +
        "<input type='radio' name='editList" + counter + "' value='3'>" + "Cost Change  " +
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
