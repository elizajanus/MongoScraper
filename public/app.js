$(document).ready(function(){


// Grab the articles as a json
$.getJSON("/articles", function(data) {
  $("#articles").empty();
 
  // For each one
  for (var i = 0; i < data.length; i++) {
   console.log(data[i].summary);
   console.log(data[i]);
   
    // Display the apropos information on the page
    $("#articles").append(`<div class="well"><p data-id=${data[i]._id} id="article"><b>${data[i].title}</b><br/>${data[i].summary}<br/><a href="${data[i].link}">${data[i].link}</a></p></div><button class="btn btn-default" id="savearticle" data-id=${data[i]._id}>Save</button><button class="btn btn-default" data-target="#itsanotemodal" data-toggle="modal" data-id=${data[i]._id} id="opennote">Add/Delete Note</button>
    <div class="modal fade bs-example-modal-lg" id="itsanotemodal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" data-id=${data[i].id}>
        <div class="modal-dialog modal-lg">
          <div class="modal-content" id="contentofmodal">
            
          </div>
        </div>
      </div>
    </div>`);
  }
});



$(document).on("click", "#opennote", function() {
console.log("hello");


  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      // The title of the article
      $("#contentofmodal").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#contentofmodal").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#contentofmodal").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#contentofmodal").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#contentofmodal").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>")

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
 
    });
});

$(document).on("click", "#saved", function() {
  $.getJSON("/articles/saved", function(data) {
    $("#articles").empty();
    // For each one
    for (var i = 0; i < data.length; i++) {
     console.log(data);
      // Display the apropos information on the page
      $("#articles").append(`<div class="well"><p data-id=${data[i]._id} id="article"><b>${data[i].title}</b><br/>${data[i].summary}<br/><a href="${data[i].link}">${data[i].link}</a></p></div><button class="btn btn-default" id="savearticle" data-id=${data[i]._id}>Save</button><button class="btn btn-default" data-target="#itsanotemodal" data-toggle="modal" data-id=${data[i]._id} id="opennote">Add/Delete Note</button>
      <div class="modal fade bs-example-modal-lg" id="itsanotemodal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" data-id=${data[i].id}>
          <div class="modal-dialog modal-lg">
            <div class="modal-content" id="contentofmodal">
              
            </div>
          </div>
        </div>
      </div>`);
    }
  })
});


// When you click the savenote button
$(document).on("click", "#savenote", function() {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
     
    
    });
  });
//save article
$(document).on("click", "#savearticle", function() {
  console.log("hello");
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId
  }).done(function(data) {
    console.log(data);
      window.location = "/"
  })
});
//delete article
$(document).on("click","#deletearticle", function() {
  console.log("hello");
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId
  }).done(function(data) {
      window.location = "/"
  })
});
//delete note
$(document).on("click", "#deletenote", function() {
  var noteId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/deletenote/" + noteId
  })
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
   
  });
}); 


  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");

});