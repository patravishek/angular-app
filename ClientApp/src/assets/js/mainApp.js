// Dropdown plugin
/* ============================================================
 * bootstrap-dropdown.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


 !function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
 * ========================= */

 var toggle = '[data-toggle="dropdown"]'
 , Dropdown = function (element) {
  var $el = $(element).on('click.dropdown.data-api', this.toggle)
  $('html').on('click.dropdown.data-api', function () {
    $el.parent().removeClass('open')
  })
}

Dropdown.prototype = {

  constructor: Dropdown

  , toggle: function (e) {
    var $this = $(this)
    , $parent
    , selector
    , isActive

    if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

        return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
  * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
        if (typeof option == 'string') data[option].call($this)
      })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
  * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
    .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);



$(document).ready(function() {
 $('input[type="radio"]').click(function() {
   if($(this).attr('id') == 'repeat-selected') {
    $('#repeated').fadeIn('slow');         
  }

  else {
    $('#repeated').hide();   
  }
});
  /*Suggested farmers box: Make refresh icon spin on hover*/
  $(".refresh-suggestions").mouseenter(function(){
    $(".refresh-suggestions").addClass("fa-spin");
  });

  $(".refresh-suggestions").mouseleave(function(){
    $(".refresh-suggestions").removeClass("fa-spin");
  });


  /*Toggle between follow buttons on a user profile*/
  $( ".followUser" ).click(function() {
    $(this).parent().siblings(".following-user-dropdown").show();
    $(this).parent(".follow-user-dropdown").hide();
  });


  $('.unfollow-button').click(function(){
    $(this).parents().siblings(".follow-user-dropdown").show();
    $(this).parents(".muted-user-dropdown").hide();
    $(this).parents(".following-user-dropdown").hide();
  });

  $('.block-button').click(function(){
   $(this).parents(".follow-user-dropdown").hide();
   $(this).parents(".following-user-dropdown").hide();
   $(this).parents(".muted-user-dropdown").hide();
   $(this).parents().siblings(".following-user-dropdown").hide();
   $(this).parents().siblings(".blocked-user-dropdown").show();
   $(this).parents().siblings(".muted-user-dropdown").hide();

 });

  $('.unblock-button').click(function(){
   $(this).parents(".blocked-user-dropdown").hide();
   $(this).parents().siblings(".follow-user-dropdown").show();
   $(this).parents().siblings(".following-user-dropdown").hide();
 });

  $('.mute-button').click(function(){
   $(this).parents(".following-user-dropdown").hide();
   $(this).parents().siblings(".muted-user-dropdown").show();
 });

  $('.unmute-button').click(function(){
   $(this).parents().siblings(".following-user-dropdown").show();
   $(this).parents(".muted-user-dropdown").hide();
 });

 //Added to component side feed
  // $(".delete-photo").click(function(event) {
  //   event.preventDefault();
  //   var result = confirm("Are you sure you want to delete this photo?");
  //   if (result) {
  //   $(this).closest('.photo-post-thumbnail').remove();
  // }
  // });


  $(".delete-record-item").click(function(event) {
    event.preventDefault();
    var result = confirm("Are you sure you want to delete this record?");
    if (result) {

    $(this).closest('.record-item').remove();
  }
});

  $(".delete-record-profile-photo").click(function(event) {
    event.preventDefault();
        var result = confirm("Are you sure you want to delete this photo?");
    if (result) {
    $(this).closest('.photo-post-thumbnail').remove();
    $(".record-profile-photo").append('<a class="post-photo-update"><div class="record-profile-photo-placeholder"><i class="fa fa-image add-record-photo"></i></div></a>');
    }
  });

  $(".delete-record-photo").click(function(event) {
    event.preventDefault();
    var result = confirm("Are you sure you want to delete this photo?");
    if (result) {
    $(this).closest('.photo-post-thumbnail').remove();
    $(".photo-post-thumbnails").append('<a class="post-photo-update"><div class="record-photo-placeholder"><i class="fa fa-image add-record-photo"></i></div></a>');
    }
  });

  $(".like-button").click(function(event){
    if($(this).hasClass("liked"))
     $(this).removeClass("liked").empty().append("<i class='fa fa-thumbs-up' aria-hidden='true'></i> Like");
   else
    $(this).addClass("liked").append("d");
});

  $(".share-button").click(function(event){
    event.preventDefault();
    $(this).addClass("shared").append("d");
  });

  // $('.comment-button').on('click', function(event) { 
  //   event.preventDefault();
  //   $(this).parent().siblings(".comments-section").show();
  // });


  // $('.show-comments').on('click', function(event) { 
  //   event.preventDefault();
  //   $(this).parent().siblings(".comments-section").show();
  // });

  $(".post-box").mouseenter(function(event){
    $(this).find(".post-options").show();
  });

  $(".post-box").mouseleave(function(event){
    $(this).find(".post-options").hide();
  });

  $(".user-reply").mouseenter(function(event){
    $(this).find(".delete-comment").show();
  });

  $(".user-reply").mouseleave(function(event){
    $(this).find(".delete-comment").hide();
  });

  $(".user-comment").mouseenter(function(event){
    $(this).find(".delete-comment").show();
  });

  $(".user-comment").mouseleave(function(event){
    $(this).find(".delete-comment").hide();
  });

  $('.reply-button').on('click', function(event) { 
    event.preventDefault();
    $(this).parent().siblings(".comment-reply").show();
  });

  $('.show-replies').on('click', function(event) { 
    event.preventDefault();
    $(this).parents().siblings(".replies").show();
  });

  $('.two-user-chat-preview').click(function() {
    $('.msg-inbox').addClass('col-md-4').removeClass('col-md-10'); 
    $('.two-user-chat').show();
    $('.group-chat').hide();
  });
  
   $('.group-chat-preview').click(function() {
    $('.msg-inbox').addClass('col-md-4').removeClass('col-md-10'); 
    $('.group-chat').show();
    $('.two-user-chat').hide();
  });
  
   $('.collapse-chat').on('click', function() { 
    $('.msg-inbox').addClass('col-md-10').removeClass('col-md-4');
    $('.two-user-chat').hide();
     $('.group-chat').hide();
  });
  
   $('#mailboxes-button').click(function() {
    $('.inbox-page-menu').show();
    $('.msg-inbox').addClass('col-md-10').removeClass('col-md-4').hide();
    $('.two-user-chat').hide();
     $('.group-chat').hide();
    $('.inbox-page-menu').addClass('col-xs-12').removeClass('affix').removeClass('hidden-xs').removeClass('hidden-sm').removeClass('col-lg-2');
    $('.mailbox-categories').removeClass('list-group-sm').addClass('full-width');
    $('#mailboxes-button').hide();
    $('#hide-mobile').hide();
  });
  
   $('#inbox-button').click(function() {
    $('.msg-inbox').show();
    $('.inbox-page-menu').removeClass('col-xs-12').addClass('affix').addClass('hidden-xs').addClass('hidden-sm').addClass('col-lg-2');
    $('.mailbox-categories').removeClass('full-width').addClass('80-width');
    $('#mailboxes-button').show();
    $('#hide-mobile').show();
  });
  
   $(".post-photo-update").click(function(){
    $('.photoUpdate').trigger('click'); 
  });
  
   $(".delete-btn").click(function(){
    if(confirm("Are you sure you want to delete this?")){
     return false;
   }
   else{
    return false;
  }
  });
});

$(document).ready(function() {
 $('input[type="radio"]').click(function() {
   if($(this).attr('id') == 'once-selected') {
    $('#once').fadeIn('slow');        
  }

  else {
    $('#once').hide();   
  }
});
});

     //Sign Up Page
     $('#signup-1').on('click', function(event) { 
      event.preventDefault();
      document.getElementById("signup-section-1").style.display= "block";
      document.getElementById("signup-section-2").style.display= "none";
      var elem = document.getElementById("progress-orange");
      elem.style.width = "0%";

    });

     $('#signup-2').on('click', function(event) { 
      event.preventDefault();
      document.getElementById("signup-section-2").style.display= "block";
      document.getElementById("signup-section-1").style.display= "none";
      var elem = document.getElementById("progress-orange");
      elem.style.width = "33%";

    });

     $('#signup-2-back').on('click', function(event) { 
      event.preventDefault();
      document.getElementById("signup-section-2").style.display= "block";
      document.getElementById("signup-section-3").style.display= "none";
      var elem = document.getElementById("progress-orange");
      elem.style.width = "66%";

    });

     $('#signup-3').on('click', function(event) { 
      event.preventDefault();
      document.getElementById("signup-section-3").style.display= "block";
      document.getElementById("signup-section-2").style.display= "none";
      var elem = document.getElementById("progress-orange");
      elem.style.width = "100%";

    });






//FEED
$('#search-keywords').on('keyup', function() {
 $('#search-results').show();
});

$(document).mouseup(function(e) 
{
  var container = $("#search-results");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
      container.hide();
    }
  });

//EDIT PROFILE 
/*
$('#animal-types').on('keyup', function() {
 $('#animal-types-list').show();
});

$(document).mouseup(function(e) 
{
  var container = $("#animal-types-list");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
      container.hide();
    }
  }); */

//Daniel's scripts

//$(function() {

// Extension Function for Animate.css

$.fn.extend({
  animateCss: function(animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});


// Listener for hamburger icon animation 

$(".navbar-toggle").on("click", function () {
  $(this).toggleClass("active");
});


// for making dropdown menu push other content out of the way?

$(".dropdown1").click(function() {
  $("#dropdownMenuButton").toggleClass("open");
  
});

$('#dropdownMenuButton').on('click',function(){
  if($(this).hasClass('grey') && $('#disabledalertrow').length == false){
    $('.top-area').append('<div class = "row" id = "disabledalertrow">');
    $('#disabledalertrow').append('<div class = "col-xs-12" id = "bulkdisabledalert"> Please Select An Animal First</div>');
  }
});
$('#dropdownMenuButton').on('click',function(){
  if($(this).hasClass('grey') && $('#disabledalertrow').length == false){
    $('.product-btn-row').append('<div class = "row" id = "disabledalertrow">');
    $('#disabledalertrow').append('<div class = "col-xs-12" id = "bulkdisabledalert"> Please Select A Product First</div>');
  }
});

// Menu Toggle Script from Herd.html

$('#list').on('click', function(event) { 
  event.preventDefault();
  $('.item').addClass('list-group-item').removeClass('grid-group-item');
  $('.item-img-clicked').parent('.list-group-item').addClass('item-row-clicked');
});



$('#grid').click(function(event) { 
  event.preventDefault();
  $('.item-row-clicked').children('.item-img').addClass('item-img-clicked');
  $('.item').addClass('grid-group-item').removeClass('list-group-item item-row-clicked');
  $('.animal-options').removeClass('');

});

$('#active').click(function(event) { 
  event.preventDefault();
  $('#active').hide();
  $('#inactive').show();

});

$('#inactive').click(function(event) { 
  event.preventDefault();
  $('#inactive').hide();
  $('#active').show();

});



//Prevent animal options button click from propagating up

/*$('.animal-options-btn').click(function (evt) {
    evt.stopPropagation();
    $(this).next('.animal-options-menu').toggle();
});
*/


    //Orange border for Animal Rows on Click.
$('.item-img-container').on('click','.list-group-item',function(event){

  $(this).toggleClass('item-row-clicked');
  bulkOptionsBtnCheck('.list-group-item', 'item-row-clicked');
});


// Orange border of Animal Icons on click, removed on click again
$('.item-img').on('click',function(event){
  $(this).toggleClass('item-img-clicked');
  bulkOptionsBtnCheck('.item-img', 'item-img-clicked');
});



//Select all button
$('.select-all').on('click',function(event){
  $('.item-img').addClass('item-img-clicked');
    $('.item-img-clicked').parent('.list-group-item').addClass('item-row-clicked');

});

//Clear all button
$('.clear-all').on('click',function(event){
  $('.item-img').removeClass('item-img-clicked');
  $('.item').addClass('grid-group-item').removeClass('item-row-clicked');
});

//Activate/deactivate Bulk Options Button dependent on animal selection
function bulkOptionsBtnCheck(id, check){
  if ($(id).hasClass(check)){
    $('#dropdownMenuButton').removeClass('grey');
    $('#dropdownMenuButton').removeAttr('disabled');
    $('#bulkOptionsDiv').addClass('dropdown');
    $('div').remove('#disabledalertrow');

  } else {
    $('#dropdownMenuButton').addClass('grey');
    $('#dropdownMenuButton').attr('disabled');
    $('#bulkOptionsDiv').removeClass('dropdown');
  }

};




var alterClass = function() {
  var ww = document.body.clientWidth;
  if (ww <= 768) {
    $('#add-records-btn').removeClass('pull-right');
      // $('.grid-or-list').removeClass('pull-right');
      // why does the below script not remove class 'text-right'?
      // $('#date-degrees').removeClass('text-right');

    } else if (ww > 768) {
      $('#add-records-btn').addClass('pull-right');
      // $('.grid-or-list').addClass('pull-right');
    };

  };

  $(window).resize(function(){
    alterClass();
  });
  //Fire it when the page first loads:
  alterClass();




$('body').on('click', 'span.post-photo-update', function() {
    $(".photo-post-thumbnails").show();
    $('.photoUpdate').trigger('click'); 
});




  $(".thumbnail-add-photo").click(function(){
    $('.photoUpdate').trigger('click'); 
  });








  function doOpen(event){
    event = event || window.event;
    if(event.target.id != 'photoUpdate'){
      $('#photoUpdate').click();
    }
  };

  function toggleProfile() {
    var x = document.getElementById("user-profile");
    var y = document.getElementById("farm-profile");
    var up = document.getElementById("profile-photo");
    var u = document.getElementById("user");
    var f = document.getElementById("farm");   
    var fp = document.getElementById("farm-logo");    
    x.style.display = "block";
    y.style.display = "none";
    u.classList.remove("inactive");
    f.classList.add("inactive");
    up.style.display = "block";
    fp.style.display = "none";
  }; 
  function toggleFarm() {
    var x = document.getElementById("user-profile");
    var y = document.getElementById("farm-profile"); 
    var u = document.getElementById("user");
    var f = document.getElementById("farm");    
    y.style.display = "block";
    x.style.display = "none";
    u.classList.add("inactive");
    f.classList.remove("inactive");
    var u = document.getElementById("profile-photo");
    var f = document.getElementById("farm-logo");  
    f.style.display = "block";
    u.style.display = "none";
  }; 

  /* For animal profile / to do*/
  $('#medication').hide();

  $('#todo-type').change(function () {
    var selected = $('#todo-type option:selected').text();
    $('#medication').toggle(selected == "Injection");
  });

  $(document).ready(function(){
    $('#reminder-checked').change(function(){
      if(this.checked)
        $('#reminder').fadeIn('slow');
      else
        $('#reminder').fadeOut('slow');

    });
  });

  $('.tabAll').on('click',function(){
    $(this).parent().addClass('active');  
    $(this).parents('.nav-pills').siblings('.tab-content').find('.tab-pane').addClass('active in');
    $('[data-toggle="tab"]').parent().removeClass('active');
  });

  /*Show all tabs when resizing to smaller window*/
  var mediaQueryList = window.matchMedia(' (max-width: 400px) ');
  mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
      $('#tabAll').click();
    } else {
      console.log('The viewport is more than 600 pixels wide');
    }
  });

  /* Hide navigation tabs when printing*/
  window.onbeforeprint = function() {
    $('#tabAll').click();
    $('.nav-pills').hide();
  };

  window.onafterprint = function() {
    $('.nav-pills').show();
  };


  /*Show all tabs when viewing on small screen*/
  if ($(window).width() < 960) {
   $('#tabAll').click();
 }



 $(document).ready(function() {
   $('input[type="radio"]').click(function() {
     if($(this).attr('id') == 'repeat-selected') {
      $('#repeated').fadeIn('slow');         
    }

    else {
      $('#repeated').hide();   
    }
  });
 });

 $(document).ready(function() {
   $('input[type="radio"]').click(function() {
     if($(this).attr('id') == 'once-selected') {
      $('#once').fadeIn('slow');        
    }

    else {
      $('#once').hide();   
    }
  });
 });

 /*Range slider for price range on shopping pages*/

  $( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 1000,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  } );


  /*Add product page*/

 $('#sell-nonfood').on('click', function(event) { 
    event.preventDefault();
    document.getElementById("add-nonfood").style.display= "block";
    document.getElementById("add-food").style.display= "none";
    document.getElementById("application-received").style.display= "none";

});
  $('#sell-food').on('click', function(event) { 
    event.preventDefault();
    document.getElementById("add-food").style.display= "block";
    document.getElementById("add-nonfood").style.display= "none";

});

   $('#submit-app').on('click', function(event) { 
    event.preventDefault();
    document.getElementById("application-received").style.display= "block";
    document.getElementById("add-food").style.display= "none";

});


         // Wait for window load

$(window).on("load", function() {
        $(".se-pre-con").fadeOut("slow");
});

//Show shipping cost input box when needed
$(".shipping-product").change(function(){
   if($(this).val()=="enter-shipping")
   {    
       $(".shipping-cost").show();
   }
    else
    {
        $(".shipping-cost").hide();
    }
});


