jQuery(function ($) {
    var WOW =
      /*#__PURE__*/
      
      function () {
          function WOW () {
          }
          
          
          var _proto = WOW.prototype
          
          _proto.init = function init () {
              $(".wow").wow()
          }
          
          return WOW
      }()
    var MDBWow =
      /*#__PURE__*/
      function () {
          function MDBWow ($wowElement, customization) {
              this.$wowElement = $wowElement
              this.customization = customization
              this.animated = true
              this.options = this.assignElementCustomization()
          }
          
          
          var _proto2 = MDBWow.prototype
          
          _proto2.init = function init () {
              var _this = this
              
              $(window).scroll(function () {
                  if (_this.animated) {
                      _this.hide()
                  } else {
                      _this.mdbWow()
                  }
              })
              this.appear()
          }
          
          _proto2.assignElementCustomization = function assignElementCustomization () {
              return {
                  animationName: this.$wowElement.css("animation-name"),
                  offset: 100,
                  iteration: this.fallback().or(this.$wowElement.data("wow-iteration")).or(1).value(),
                  duration: this.fallback().or(this.$wowElement.data("wow-duration")).or(1000).value(),
                  delay: this.fallback().or(this.$wowElement.data("wow-delay")).or(0).value(),
              }
          }
          
          _proto2.mdbWow = function mdbWow () {
              var _this2 = this
              
              if (this.$wowElement.css("visibility") === "visible") {
                  return
              }
              
              if (this.shouldElementBeVisible(true)) {
                  setTimeout(function () {
                      return _this2.$wowElement.removeClass("animated")
                  }, this.countRemoveTime())
                  this.appear()
              }
          }
          
          _proto2.appear = function appear () {
              this.$wowElement.addClass("animated")
              this.$wowElement.css({
                  visibility: "visible",
                  "animation-name": this.options.animationName,
                  "animation-iteration-count": this.options.iteration,
                  "animation-duration": this.options.duration,
                  "animation-delay": this.options.delay,
              })
          }
          
          _proto2.hide = function hide () {
              var _this3 = this
              
              if (this.shouldElementBeVisible(false)) {
                  this.$wowElement.removeClass("animated")
                  this.$wowElement.css({
                      "animation-name": "none",
                      visibility: "hidden",
                  })
              } else {
                  setTimeout(function () {
                      _this3.$wowElement.removeClass("animated")
                  }, this.countRemoveTime())
              }
              
              this.mdbWow()
              this.animated = !this.animated
          }
          
          _proto2.shouldElementBeVisible = function shouldElementBeVisible (state) {
              var thisElementOffset = this.getOffset(this.$wowElement[0])
              var thisElementHeight = this.$wowElement.height()
              var documentHeight = $(document).height()
              var windowHeight = window.innerHeight
              var scroll = window.scrollY
              var isElementTopVisible = windowHeight + scroll - this.options.offset > thisElementOffset
              var isElementBottomVisible = windowHeight + scroll - this.options.offset > thisElementOffset + thisElementHeight
              var isScrolledToTop = scroll < thisElementOffset
              var isScrolledToBottom = scroll < thisElementOffset + thisElementHeight
              var isDocumentHeightEqual = windowHeight + scroll === documentHeight
              var isOffsetHigherThanDocument = thisElementOffset + this.options.offset > documentHeight
              var isElementBottomHidden = windowHeight + scroll - this.options.offset < thisElementOffset
              var isScrolledOverTop = scroll > thisElementOffset + this.options.offset
              var isNotScrolledToTop = scroll < thisElementOffset + this.options.offset
              var isScrolledOverElement = thisElementOffset + thisElementHeight > documentHeight - this.options.offset
              var returnLogic = false
              
              if (state) {
                  returnLogic = isElementTopVisible && isScrolledToTop || isElementBottomVisible && isScrolledToBottom || isDocumentHeightEqual && isOffsetHigherThanDocument
              } else {
                  returnLogic = isElementTopVisible && isScrolledOverTop || isElementBottomHidden && isNotScrolledToTop || isScrolledOverElement
              }
              
              return returnLogic
          }
          
          _proto2.countRemoveTime = function countRemoveTime () {
              var defaultAnimationTime = this.$wowElement.css("animation-duration").slice(0, -1) * 1000
              var removeTime = 0
              
              if (this.options.duration) {
                  removeTime = defaultAnimationTime + this.checkOptionsStringFormat(this.options.duration)
              }
              
              if (this.options.delay) {
                  removeTime += this.checkOptionsStringFormat(this.options.delay)
              }
              
              return removeTime
          }
          
          _proto2.checkOptionsStringFormat = function checkOptionsStringFormat (element) {
              var valueToReturn
              
              if (element.toString().slice(-1) === "s") {
                  valueToReturn = element.toString().slice(0, -1)
              } else if (!isNaN(element.toString().slice(-1))) {
                  valueToReturn = element
              } else {
                  return console.log("Not supported animation customization format.")
              }
              
              return valueToReturn
          }
          
          _proto2.getOffset = function getOffset (element) {
              var box = element.getBoundingClientRect()
              var body = document.body
              var docEl = document.documentElement
              var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
              var clientTop = docEl.clientTop || body.clientTop || 0
              var top = box.top + scrollTop - clientTop
              return Math.round(top)
          }
          
          _proto2.fallback = function fallback () {
              return {
                  _value: undefined,
                  or: function or (value) {
                      if (typeof value !== "undefined" && typeof this._value === "undefined") {
                          this._value = value
                      }
                      
                      return this
                  },
                  value: function value () {
                      return this._value
                  },
              }
          }
          
          return MDBWow
      }()
    
    $.fn.wow = function (options) {
        this.each(function () {
            var mdbWow = new MDBWow($(this), options)
            mdbWow.init()
        })
    }
    
    window.WOW = WOW
})
