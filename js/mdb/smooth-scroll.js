jQuery(function () {
  var SMOOTH_SCROLL_DURATION = 700;
  $('.smooth-scroll').on('click', 'a', function (e) {
    e.preventDefault();
    var $this = $(this);
    var elAttr = $this.attr('href');

    if (typeof elAttr !== undefined && elAttr.indexOf('#') === 0) {
      var offset = $(this).attr('data-offset') || 0;
      $('body,html').animate({
        scrollTop: $(elAttr).offset().top - offset
      }, SMOOTH_SCROLL_DURATION);
      var setHash = $this.parentsUntil('.smooth-scroll').last().parent().attr('data-allow-hashes');

      if (typeof setHash !== undefined && setHash !== false) {
        history.replaceState(null, null, elAttr);
      }
    }
  });
});