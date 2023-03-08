$(document).ready(function(){
$('.btn-gallery-pop').magnificPopup({
	type: 'image',
  mainClass: 'mfp-with-zoom', 
  gallery:{
			enabled:true
		},

  zoom: {
    enabled: true, 
    opener: function(openerElement) {

      return openerElement.is('img') ? openerElement : openerElement.find('img');
  }
}

});

});