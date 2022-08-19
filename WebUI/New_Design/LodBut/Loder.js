(function ($) {

    var lod = '<i class="fa fa-spinner fa-spin lod  "></i>';

    let lod_Old = '';
    let id = '';
    $('button').mousedown(function () {
        if (id == '') {
            id = this.getAttribute('id');
            lod_Old = $(this).html();
            $(this).append(lod);

        }
        setTimeout(function () {
            $('#' + id + '').removeAttr("disabled");
            $('#' + id + '').html(lod_Old);
            lod_Old = '';
            id = '';
        }, 500);
    });


})(jQuery);