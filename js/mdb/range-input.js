jQuery(function ($) {
  var rangeWrapper = '.range-field';
  var rangeType = 'input[type=range]:not(.custom-range):not(.multi-range)';
  var thumbHtml = '<span class="thumb" style="margin-left: 7px"><span class="value"></span></span>';
  var rangeMousedown = false;

  function addThumb() {
    var $thumb = $(thumbHtml);
    $(rangeType).after($thumb);
  }

  $(document).on('change', rangeType, function () {
    var $thumb = $(this);
    var $thumbValue = $thumb.siblings('.thumb').find('.value');
    $thumbValue.html($thumb.val());
  });
  $(document).on('mousedown touchstart contextmenu', rangeType, function (e) {
    var $this = $(this);
    var noThumb = !$this.siblings('.thumb').length;
    var isRightClick = e.type === 'contextmenu';

    if (noThumb) {
      addThumb();
    } // this must be here. if you define $thumb before it's create $thumb be empty element.


    var $thumb = $this.siblings('.thumb'); // prevent show thumb when mousemove after right click;

    if (isRightClick) {
      rangeMousedown = false;
    } else {
      rangeMousedown = true;
    }

    $this.addClass('active');

    if (!$thumb.hasClass('active')) {
      showThumb($thumb);
    }

    updateThumbPosition($(this), $thumb); // Set indicator value

    $thumb.find('.value').html($this.val());
  });
  $(document).on('mouseup touchend', rangeWrapper, function () {
    var $thumb = $(this).children('.thumb');
    rangeMousedown = false;

    if ($thumb.hasClass('active')) {
      hideThumb($thumb);
    }

    $thumb.removeClass('active');
  });
  $(document).on('input mousemove touchmove', rangeWrapper, function () {
    var $thumb = $(this).children('.thumb');

    if (rangeMousedown) {
      if (!$thumb.hasClass('active')) {
        showThumb($thumb);
      }

      updateThumbPosition($(this).children(rangeType), $thumb);
      $thumb.find('.value').html($thumb.siblings(rangeType).val());
    }
  });
  $(document).on('mouseout touchleave', rangeWrapper, function () {
    if (!rangeMousedown) {
      var $thumb = $(this).children('.thumb');

      if ($thumb.hasClass('active')) {
        hideThumb($thumb);
      }

      $thumb.removeClass('active');
    }
  });

  function updateThumbPosition($this, $thumb) {
    var minValue = $this.attr('min');
    var maxValue = $this.attr('max');
    var widthThumb = $this.width() - 13.5;
    var oneStep = widthThumb / (maxValue - minValue);
    var leftPosition = oneStep * $this.val() - oneStep * minValue;

    if (leftPosition < 0) {
      leftPosition = 0;
    } else if (leftPosition > widthThumb) {
      leftPosition = widthThumb;
    }

    $thumb.addClass('active').css('left', leftPosition);
  }

  function thumbAnimation($thumb, tHeight, tWidth, tTop, tMarginLeft, tDuration, tEasing) {
    $thumb.velocity({
      height: tHeight,
      width: tWidth,
      top: tTop,
      marginLeft: tMarginLeft
    }, {
      duration: tDuration,
      easing: tEasing ? tEasing : 'swing'
    });
  }

  function showThumb($thumb) {
    thumbAnimation($thumb, '30px', '30px', '-27px', '-7px', 200, 'easeOutExpo');
  }

  function hideThumb($thumb) {
    thumbAnimation($thumb, '0', '0', '10px', '7px', 200);
  }
});