(function ($) {

    var lod = '<i class="fa fa-spinner fa-spin lod  "></i>';

    let lod_Old = '';
    $('button').mousedown(function () {
         
            lod_Old = $(this).html();


        $(this).append(lod); 
        let id = this.getAttribute('id');
   
        setTimeout(function () {
            $('#' + id + '').removeAttr("disabled");
            $('#' + id + '').html(lod_Old); 
        }, 500);
         
    });

    //$('button').click(function () {

    //    debugger

    //    $(this).attr("disabled", "disabled");
        

    //});



})(jQuery); 