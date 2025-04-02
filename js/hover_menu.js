var times;
$(".b-header_menu").mouseenter(function() {
	times = window.setTimeout(function() {
		$(".b-level_one").addClass('hover');
	}, 200);

}).mouseleave(function(){
	window.clearTimeout(times);
	$(".b-level_one").removeClass('hover');
});
