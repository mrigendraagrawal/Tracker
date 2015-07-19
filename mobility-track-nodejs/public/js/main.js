function createTracker() {
  $('.dup-warn').hide();

  dname = $('#devicename').val();
  var dmac = '';
  $( ".devicemac" ).find('input').each(function(i,o){
    dmac = dmac + $(this).val().toUpperCase();
  });

  // Check whether MAC already exists in the db if not create a new Tracker
  if (validateMAC() === true) {
    $.get('/api/tracker/findmac/' + dmac).done(function(res){
      if (res.length === 0) {
        $.post('/api/tracker/create', { name: dname, device: {mac: dmac} });
      } else {
        $('.dup-warn').show();}
    });
  }
}

function validateMAC() {
  var regex = /^[0-9A-Fa-f]{2}$/;
  var valid = true;

  $( ".devicemac" ).find('input').each(function(i,o){
    var validmac = regex.test($(this).val());
    if (!validmac){
      $(this).addClass("incorrect-mac");
      valid = valid && false;
    } else {
      $(this).removeClass("incorrect-mac");
    }
  });
  return valid;
}

function initialize() {
  var mylatlng = new google.maps.LatLng(6.9344, 79.8428);
  var mapProp = {
    center: mylatlng,
    zoom:7,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"), mapProp);

  $.get('api/tracker/locations').done(function(res){
    for(var i=0; i<res.length; i++){
      console.log(res[i]);
      var latLng = new google.maps.LatLng(res[i].path[0], res[i].path[1]);
      var marker = new google.maps.Marker({
          position: latLng,
          map: map
      });
    }
  });

}
google.maps.event.addDomListener(window, 'load', initialize);
