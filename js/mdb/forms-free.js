jQuery(function ($) {
  var Forms =
  /*#__PURE__*/
  function () {
    function Forms() {
      this.inputSelector = ['text', 'password', 'email', 'url', 'tel', 'number', 'search', 'search-md', 'date'].map(function (selector) {
        return "input[type=" + selector + "]";
      }).join(', ') + ", textarea";
      this.textAreaSelector = '.materialize-textarea';
      this.$text = $('.md-textarea-auto');
      this.$body = $('body');
      this.$document = $(document);
    }

    var _proto = Forms.prototype;

    _proto.init = function init() {
      var _this = this;

      if (this.$text.length) {
        var observe;

        if (window.attachEvent) {
          observe = function observe(element, event, handler) {
            element.attachEvent("on" + event, handler);
          };
        } else {
          observe = function observe(element, event, handler) {
            element.addEventListener(event, handler, false);
          };
        }

        this.$text.each(function () {
          var self = this;

          function resize() {
            self.style.height = 'auto';
            self.style.height = self.scrollHeight + "px";
          }

          function delayedResize() {
            window.setTimeout(resize, 0);
          }

          observe(self, 'change', resize);
          observe(self, 'cut', delayedResize);
          observe(self, 'paste', delayedResize);
          observe(self, 'drop', delayedResize);
          observe(self, 'keydown', delayedResize);
          resize();
        });
      }

      $(this.inputSelector).each(function (index, input) {
        var $this = $(input);
        var isNotValid = input.validity.badInput;

        _this.updateTextFields($this);

        if (isNotValid) {
          _this.toggleActiveClass($this, 'add');
        }
      });
      this.addOnFocusEvent();
      this.addOnBlurEvent();
      this.addOnChangeEvent();
      this.addOnResetEvent();
      this.appendHiddenDiv();
      this.makeActiveAutofocus();
      $(this.textAreaSelector).each(this.textAreaAutoResize);
      this.$body.on('keyup keydown', this.textAreaSelector, this.textAreaAutoResize);
    };

    _proto.makeActiveAutofocus = function makeActiveAutofocus() {
      this.toggleActiveClass($('input[autofocus]'), 'add');
    };

    _proto.toggleActiveClass = function toggleActiveClass($this, action) {
      var selectors;
      action = action + "Class";

      if ($this.parent().hasClass('timepicker')) {
        selectors = 'label';
      } else {
        selectors = 'label, i, .input-prefix';
      }

      $this.siblings(selectors)[action]('active');
    };

    _proto.addOnFocusEvent = function addOnFocusEvent() {
      var _this2 = this;

      this.$document.on('focus', this.inputSelector, function (e) {
        _this2.toggleActiveClass($(e.target), 'add');

        if ($(e.target).attr("type") == "date") {
          $(e.target).css("color", "#495057");
        }
      });
    };

    _proto.addOnBlurEvent = function addOnBlurEvent() {
      var _this3 = this;

      this.$document.on('blur', this.inputSelector, function (e) {
        var $this = $(e.target);
        var noValue = !$this.val();
        var isValid = !e.target.validity.badInput;
        var noPlaceholder = $this.attr('placeholder') === undefined;

        if (noValue && isValid && noPlaceholder) {
          _this3.toggleActiveClass($this, 'remove');

          if ($this.attr("type") == "date") {
            $this.css("color", "transparent");
          }
        }

        if (!noValue && isValid && noPlaceholder) {
          $this.siblings('i, .input-prefix').removeClass('active');

          if ($this.attr("type") == "date") {
            $this.css("color", "#495057");
          }
        }

        _this3.validateField($this);
      });
    };

    _proto.addOnChangeEvent = function addOnChangeEvent() {
      var _this4 = this;

      this.$document.on('change', this.inputSelector, function (e) {
        var $this = $(e.target);

        _this4.updateTextFields($this);

        _this4.validateField($this);
      });
    };

    _proto.addOnResetEvent = function addOnResetEvent() {
      var _this5 = this;

      this.$document.on('reset', function (e) {
        var $formReset = $(e.target);

        if ($formReset.is('form')) {
          var $formInputs = $formReset.find(_this5.inputSelector);
          $formInputs.removeClass('valid invalid').each(function (index, input) {
            var $this = $(input);
            var noDefaultValue = !$this.val();
            var noPlaceholder = !$this.attr('placeholder');

            if (noDefaultValue && noPlaceholder) {
              _this5.toggleActiveClass($this, 'remove');
            }
          });
          $formReset.find('select.initialized').each(function (index, select) {
            var $select = $(select);
            var $visibleInput = $select.siblings('input.select-dropdown');
            var defaultValue = $select.children('[selected]').val();
            $select.val(defaultValue);
            $visibleInput.val(defaultValue);
          });
        }
      });
    };

    _proto.appendHiddenDiv = function appendHiddenDiv() {
      if (!$('.hiddendiv').first().length) {
        var $hiddenDiv = $('<div class="hiddendiv common"></div>');
        this.$body.append($hiddenDiv);
      }
    };

    _proto.updateTextFields = function updateTextFields($input) {
      var hasValue = Boolean($input.val());
      var hasPlaceholder = Boolean($input.attr('placeholder'));
      var addOrRemove = hasValue || hasPlaceholder ? 'add' : 'remove';

      if ($input.attr("type") !== "date") {
        this.toggleActiveClass($input, addOrRemove);
      }

      if ($input.attr("type") == "date" && !hasValue) {
        $input.css("color", "transparent");
      } else if ($input.attr("type") == "date" && hasValue) {
        this.toggleActiveClass($input, addOrRemove);
      }
    };

    _proto.validateField = function validateField($input) {
      if ($input.hasClass('validate')) {
        var value = $input.val();
        var noValue = !value.length;
        var isValid = !$input[0].validity.badInput;

        if (noValue && isValid) {
          $input.removeClass('valid').removeClass('invalid');
        } else {
          var valid = $input[0].validity.valid;
          var length = Number($input.attr('length')) || 0;

          if (valid && (!length || length > value.length)) {
            $input.removeClass('invalid').addClass('valid');
          } else {
            $input.removeClass('valid').addClass('invalid');
          }
        }
      }
    };

    _proto.textAreaAutoResize = function textAreaAutoResize() {
      var $textarea = $(this);

      if ($textarea.val().length) {
        var $hiddenDiv = $('.hiddendiv');
        var fontFamily = $textarea.css('font-family');
        var fontSize = $textarea.css('font-size');

        if (fontSize) {
          $hiddenDiv.css('font-size', fontSize);
        }

        if (fontFamily) {
          $hiddenDiv.css('font-family', fontFamily);
        }

        if ($textarea.attr('wrap') === 'off') {
          $hiddenDiv.css('overflow-wrap', 'normal').css('white-space', 'pre');
        }

        $hiddenDiv.text($textarea.val() + "\n");
        var content = $hiddenDiv.html().replace(/\n/g, '<br>');
        $hiddenDiv.html(content); // When textarea is hidden, width goes crazy.
        // Approximate with half of window size

        $hiddenDiv.css('width', $textarea.is(':visible') ? $textarea.width() : $(window).width() / 2);
        $textarea.css('height', $hiddenDiv.height());
      }
    };

    return Forms;
  }(); //auto init Forms


  var forms = new Forms();
  forms.init();
});