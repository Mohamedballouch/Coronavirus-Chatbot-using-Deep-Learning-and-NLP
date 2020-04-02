var me = {};
me.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUsoakftmf6A5PVKLwpeG-yfLmlXgdMzQeJw-N4dxi0UmYt4bB";

var you = {};
you.avatar = "https://pbs.twimg.com/profile_images/1081178168139173888/gu-s0K9T_400x400.jpg";

function insert_chat(who,text){
  var control = ''
  if (who == 'me'){
    control = '<li class="message right appeared">'+
                  '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /> </div>'+
                  '<div class="text_wrapper">'+
                  '<div class="text">'+text+'</div>'+
                  '</div>'+
                  '</li>'
  }
  else{
    control = '<li class="message left appeared">'+
                  '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ you.avatar +'" /> </div>'+
                  '<div class="text_wrapper">'+
                  '<div class="text">'+text+'</div>'+
                  '</div>'+
                  '</li>';
  }
  setTimeout(
        function(){                        
            $("#ul_input").append(control).scrollTop($("#ul_input").prop('scrollHeight'));
        });
}


function interact(message){
console.log("STARTING");
$.ajax({
  type: 'POST',
  url: '/test',
  contentType: 'application/json',
  dataType: 'json',
  data:message,
 success: function(data){
  insert_chat("you",data['text'])
 }
  });
}


function get_message(){
var message = document.getElementById("text_message").value;
var json_data = {"msg":message}
var sender = JSON.stringify(json_data)
console.log(sender)
console.log(message);
insert_chat('me',message);
interact(sender);
 }



var socket = io.connect( 'http://' + document.domain + ':' + location.port )
    // broadcast a message
socket.on( 'connect', function() {
  socket.emit( 'my event', {
    data: 'User Connected'
  } )
  var form = $( 'form' ).on( 'submit', function( e ) {
    e.preventDefault()
    
    let user_input = $( 'input.message' ).val()

    socket.emit( 'my eventes', {
      
      message : user_input
    } )
    // empty the input field
    $( 'input.message' ).val( '' ).focus()
  } )
} )



// capture message
socket.on( 'my response', function( msg ) {
  console.log( msg )
  if( typeof msg.user_name !== 'undefined' ) {
    $( 'h1' ).remove()
    $( 'div.message_holder' ).append( '<div class="alert alert-info"><b style="color: #000">'+msg.bot+'</b> '+msg.answer+'</div>' )
  }
} )
