$(document).ready(function() {
    $('.b-label-icon_help').hover(function(){
        var title = $(this).attr('title');
        $(this).data('tipText', title).removeAttr('title');
        $('<p class="b-label-icon_help-tooltip"></p>')
        .text(title)
        .appendTo('body')
        .fadeIn('fast');
    }, function() {
        $(this).attr('title', $(this).data('tipText'));
        $('.b-label-icon_help-tooltip').remove();
    }).mousemove(function(e) {
        var mousex = e.pageX + 20;
        var mousey = e.pageY - 20;
        $('.b-label-icon_help-tooltip')
        .css({ top: mousey, left: mousex })
    });
});