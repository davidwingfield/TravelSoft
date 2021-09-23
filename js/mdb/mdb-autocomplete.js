(function ($) {
  var MdbAutocomplete =
  /*#__PURE__*/
  function () {
    function MdbAutocomplete(input, options) {
      this.defaults = {
        data: {},
        dataColor: '',
        closeColor: '#4285f4',
        closeBlurColor: '#ced4da',
        inputFocus: '1px solid #4285f4',
        inputBlur: '1px solid #ced4da',
        inputFocusShadow: '0 1px 0 0 #4285f4',
        inputBlurShadow: '',
        visibleOptions: 5
      };
      this.enterCharCode = 13;
      this.homeCharCode = 36;
      this.endCharCode = 35;
      this.arrowUpCharCode = 38;
      this.arrowDownCharCode = 40;
      this.tabCharCode = 9;
      this.shiftCharCode = 16;
      this.count = -1;
      this.nextScrollHeight = -45;
      this.$input = input;
      this.options = this.assignOptions(options);
      this.$clearButton = this.$input.next('.mdb-autocomplete-clear');
      this.$autocompleteWrap = $('<ul class="mdb-autocomplete-wrap"></ul>');
    }

    var _proto = MdbAutocomplete.prototype;

    _proto.init = function init() {
      this.handleEvents();
    };

    _proto.handleEvents = function handleEvents() {
      this.setData();
      this.inputFocus();
      this.inputBlur();
      this.inputKeyupData();
      this.inputTabPrevent();
      this.inputLiClick();
      this.clearAutocomplete();
      this.setAutocompleteWrapHeight();
    };

    _proto.assignOptions = function assignOptions(options) {
      return $.extend({}, this.defaults, options);
    };

    _proto.setAutocompleteWrapHeight = function setAutocompleteWrapHeight() {
      this.$autocompleteWrap.css('max-height', this.options.visibleOptions * 45 + "px");
    };

    _proto.setData = function setData() {
      if (Object.keys(this.options.data).length) {
        this.$autocompleteWrap.insertAfter(this.$input);
      }
    };

    _proto.inputFocus = function inputFocus() {
      var _this = this;

      this.$input.on('focus', function () {
        _this.changeSVGcolors();

        _this.$input.css('border-bottom', _this.options.inputFocus);

        _this.$input.css('box-shadow', _this.options.inputFocusShadow);
      });
    };

    _proto.inputBlur = function inputBlur() {
      var _this2 = this;

      this.$input.on('blur', function () {
        _this2.$input.css('border-bottom', _this2.options.inputBlur);

        _this2.$input.css('box-shadow', _this2.options.inputBlurShadow);

        _this2.$autocompleteWrap.empty();
      });
    };

    _proto.inputTabPrevent = function inputTabPrevent() {
      var _this3 = this;

      var keys = {};
      this.$input.on("keydown keyup", function (e) {
        if (e.type == "keydown" && _this3.$input.val()) {
          keys[e.which] = true;

          if (keys[_this3.shiftCharCode] && keys[_this3.tabCharCode]) {
            e.preventDefault();

            _this3.$clearButton.focus();
          } else if (keys[_this3.tabCharCode] && !keys[_this3.shiftCharCode]) {
            e.preventDefault();

            _this3.$clearButton.focus();
          }
        } else if (e.type == "keyup") {
          keys = {};
        }
      });
      this.$clearButton.on("keydown keyup", function (e) {
        if (e.type == "keydown" && _this3.$input.val()) {
          keys[e.which] = true;

          if (keys[_this3.shiftCharCode] && keys[_this3.tabCharCode]) {
            e.preventDefault();

            _this3.$input.focus();
          } else if (keys[_this3.tabCharCode] && !keys[_this3.shiftCharCode]) {
            e.preventDefault();

            _this3.$input.focus();
          }
        } else if (e.type == "keyup") {
          keys = {};
        }
      });
    };

    _proto.inputKeyupData = function inputKeyupData() {
      var _this4 = this;

      this.$input.on('focus input  keyup', function (e) {
        if (e.which === _this4.enterCharCode) {
          if (!_this4.options.data.includes(_this4.$input.val())) {
            _this4.options.data.push(_this4.$input.val());
          }

          _this4.$autocompleteWrap.find('.selected').trigger('mousedown');

          _this4.$autocompleteWrap.empty();

          _this4.inputBlur();

          _this4.count = -1;
          _this4.nextScrollHeight = -45;
          return _this4.count;
        }

        var $inputValue = _this4.$input.val();

        _this4.$autocompleteWrap.empty();

        if ($inputValue.length) {
          _this4.appendOptions(_this4.options.data, $inputValue);

          var $ulList = _this4.$autocompleteWrap;

          var $ulItems = _this4.$autocompleteWrap.find('li');

          var nextItemHeight = $ulItems.eq(_this4.count).outerHeight();
          var previousItemHeight = $ulItems.eq(_this4.count - 1).outerHeight();

          if (e.which === _this4.homeCharCode) {
            _this4.homeHandler($ulList, $ulItems);
          }

          if (e.which === _this4.endCharCode) {
            _this4.endHandler($ulList, $ulItems);
          }

          if (e.which === _this4.arrowDownCharCode) {
            _this4.arrowDownHandler($ulList, $ulItems, nextItemHeight);
          } else if (e.which === _this4.arrowUpCharCode) {
            _this4.arrowUpHandler($ulList, $ulItems, nextItemHeight, previousItemHeight);
          }

          if ($inputValue.length === 0) {
            _this4.$clearButton.css('visibility', 'hidden');
          } else {
            _this4.$clearButton.css('visibility', 'visible');
          }

          _this4.$autocompleteWrap.children().css('color', _this4.options.dataColor);
        } else {
          _this4.$clearButton.css('visibility', 'hidden');
        }
      });
    };

    _proto.endHandler = function endHandler($ulList, $ulItems) {
      this.count = $ulItems.length - 1;
      this.nextScrollHeight = $ulItems.length * 45 - 45;
      $ulList.scrollTop($ulItems.length * 45);
      $ulItems.eq(-1).addClass('selected');
    };

    _proto.homeHandler = function homeHandler($ulList, $ulItems) {
      this.count = 0;
      this.nextScrollHeight = -45;
      $ulList.scrollTop(0);
      $ulItems.eq(0).addClass('selected');
    };

    _proto.arrowDownHandler = function arrowDownHandler($ulList, $ulItems, nextItemHeight) {
      if (this.count > $ulItems.length - 2) {
        this.count = -1;
        $ulItems.scrollTop(0);
        this.nextScrollHeight = -45;
        return;
      } else {
        this.count++;
      }

      this.nextScrollHeight += nextItemHeight;
      $ulList.scrollTop(this.nextScrollHeight);
      $ulItems.eq(this.count).addClass('selected');
    };

    _proto.arrowUpHandler = function arrowUpHandler($ulList, $ulItems, nextItemHeight, previousItemHeight) {
      if (this.count < 1) {
        this.count = $ulItems.length;
        $ulList.scrollTop($ulList.prop('scrollHeight'));
        this.nextScrollHeight = $ulList.prop('scrollHeight') - nextItemHeight;
      } else {
        this.count--;
      }

      this.nextScrollHeight -= previousItemHeight;
      $ulList.scrollTop(this.nextScrollHeight);
      $ulItems.eq(this.count).addClass('selected');
    };

    _proto.appendOptions = function appendOptions(data, $inputValue) {
      for (var item in data) {
        if (data[item].toLowerCase().indexOf($inputValue.toLowerCase()) !== -1) {
          var option = $("<li>" + data[item] + "</li>");
          this.$autocompleteWrap.append(option);
        }
      }
    };

    _proto.inputLiClick = function inputLiClick() {
      var _this5 = this;

      this.$autocompleteWrap.on('mousedown', 'li', function (e) {
        e.preventDefault();

        _this5.$input.val($(e.target).text());

        _this5.$autocompleteWrap.empty();
      });
    };

    _proto.clearAutocomplete = function clearAutocomplete() {
      var _this6 = this;

      this.$clearButton.on('click', function (e) {
        e.preventDefault();
        _this6.count = -1;
        _this6.nextScrollHeight = -45;
        var $this = $(e.currentTarget);
        $this.parent().find('.mdb-autocomplete').val('');
        $this.css('visibility', 'hidden');

        _this6.$autocompleteWrap.empty();

        $this.parent().find('label').removeClass('active');
      });
    };

    _proto.changeSVGcolors = function changeSVGcolors() {
      var _this7 = this;

      if (this.$input.hasClass('mdb-autocomplete')) {
        this.$input.on('keyup', function (e) {
          _this7.fillSVG(e, _this7.options.closeColor);
        });
        this.$input.on('blur', function (e) {
          _this7.fillSVG(e, _this7.options.closeBlurColor);
        });
      }
    };

    _proto.fillSVG = function fillSVG(e, color) {
      e.preventDefault();
      $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', color);
    };

    return MdbAutocomplete;
  }();

  $.fn.mdbAutocomplete = function (options) {
    return this.each(function () {
      var mdbAutocomplete = new MdbAutocomplete($(this), options);
      mdbAutocomplete.init();
    });
  };
})(jQuery);