jQuery(function ($) {
    var SideNav2 =
      /*#__PURE__*/
      function () {
          function SideNav2 (element, options) {
              this.settings = {
                  menuLeftMinBorder: 0.3,
                  menuLeftMaxBorder: -0.5,
                  menuRightMinBorder: -0.3,
                  menuRightMaxBorder: 0.5,
                  menuVelocityOffset: 10,
              }
              this.defaults = {
                  menuWidth: 240,
                  edge: "left",
                  closeOnClick: false,
                  breakpoint: 1440,
                  timeDurationOpen: 500,
                  timeDurationClose: 500,
                  timeDurationOverlayOpen: 200,
                  timeDurationOverlayClose: 200,
                  easingOpen: "easeInOutQuad",
                  easingClose: "easeInOutQuad",
                  showOverlay: true,
                  showCloseButton: false,
                  slim: false,
                  onOpen: null,
                  onClose: null,
                  // side, push, over
                  mode: "over",
              }
              this.$element = element
              this.$elementCloned = element.clone().css({
                  display: "inline-block",
                  lineHeight: "24px",
              }).html("<i class=\"fas fa-times\"></i>")
              this.options = this.assignOptions(options)
              this.menuOut = false
              this.lastTouchVelocity = {
                  x: {
                      startPosition: 0,
                      startTime: 0,
                      endPosition: 0,
                      endTime: 0,
                  },
              }
              this.$body = $("body")
              this.$menu = $("#" + this.$element.attr("data-activates"))
              this.$sidenavOverlay = $("#sidenav-overlay")
              this.$dragTarget = $("<div class=\"drag-target\"></div>")
              this.isTouchDevice = "ontouchstart" in document.documentElement
              this.$body.append(this.$dragTarget)
          }
          
          
          var _proto = SideNav2.prototype
          
          _proto.assignOptions = function assignOptions (newOptions) {
              return $.extend({}, this.defaults, newOptions)
          }
          
          _proto.init = function init () {
              this.setMenuWidth()
              this.setMenuTranslation()
              this.closeOnClick()
              this.openOnClick()
              this.bindTouchEvents()
              this.bindKeydownEvents()
              this.showCloseButton()
              this.inputOnClick()
              this.setTabTrap()
              this.handleSlim()
              
              if (this.options.slim === true) {
                  $("#toggle").trigger("click")
              }
              
              this.onOpen()
              this.onClose()
              
              if (this.options[0] + this.options[1] + this.options[2] + this.options[3] === "show" && this.menuOut === false) {
                  this.$element.trigger("click")
              }
              
              if (this.options[0] + this.options[1] + this.options[2] + this.options[3] === "hide" && this.menuOut === true) {
                  this.removeMenu()
              }
              
              if (this.options.mode === "push" || this.options.mode === "side") {
                  $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css({
                      transition: "all 0.5s ease-in-out",
                  })
              }
          }
          
          _proto.setMenuWidth = function setMenuWidth () {
              var $sidenavBg = $("#" + this.$menu.attr("id")).find("> .sidenav-bg")
              this.$menu.css("width", this.options.menuWidth)
              $sidenavBg.css("width", this.options.menuWidth)
          }
          
          _proto.setMenuTranslation = function setMenuTranslation () {
              var _this = this
              
              if (this.options.edge === "left") {
                  this.$menu.css("transform", "translateX(-100%)")
                  this.$dragTarget.css({
                      left: 0,
                  })
              } else {
                  this.$menu.addClass("right-aligned").css("transform", "translateX(100%)")
                  this.$dragTarget.css({
                      right: 0,
                  })
              }
              
              if (!this.$menu.hasClass("side")) {
                  return
              }
              
              if (window.innerWidth > this.options.breakpoint) {
                  this.menuOut = true
                  this.$menu.css("transform", "translateX(0)")
              } else {
                  this.menuOut = false
              }
              
              this.$menu.find("input[type=text]").on("touchstart", function () {
                  _this.$menu.addClass("transform-fix-input")
              })
              $(window).on("resize", function () {
                  if (!_this.isTouchDevice) {
                      $(".fixed-sn main, .fixed-sn footer").css("padding-left", _this.options.menuWidth)
                  }
                  
                  if (window.innerWidth > _this.options.breakpoint) {
                      if (_this.$sidenavOverlay.length) {
                          _this.removeMenu(true)
                          
                          $(".fixed-sn main, .fixed-sn footer").css("padding-left", _this.options.menuWidth)
                      } else {
                          if (_this.menuOut === false) {
                              $(_this).trigger("sidenav_open", [_this.options.onOpen])
                          }
                          
                          _this.$menu.css("transform", "translateX(0%)")
                          
                          _this.menuOut = true
                      }
                  } else if (_this.menuOut === false && !_this.isTouchDevice) {
                      var xValue = _this.options.edge === "left" ? "-100" : "100"
                      
                      _this.$menu.css("transform", "translateX(" + xValue + "%)")
                      
                      _this.removeMenu(true)
                  } else if (!_this.isTouchDevice) {
                      _this.menuOut = false
                      
                      _this.removeMenu(true)
                  }
              })
          }
          
          _proto.closeOnClick = function closeOnClick () {
              var _this2 = this
              
              if (this.options.closeOnClick === true) {
                  this.$menu.on("click", "a:not(.collapsible-header)", function () {
                      return _this2.removeMenu()
                  })
                  
                  if (this.$menu.css("transform") === "translateX(0)") {
                      this.$menu.on("click", function () {
                          return _this2.removeMenu()
                      })
                  }
              }
          }
          
          _proto.onOpen = function onOpen (callback) {
              $(this).on("sidenav_open", function (event, callback) {
                  if (typeof callback === "function") {
                      callback()
                  }
              })
          }
          
          _proto.onClose = function onClose (callback) {
              $(this).on("sidenav_close", function (event, callback) {
                  if (typeof callback === "function") {
                      callback()
                  }
              })
          }
          
          _proto.openOnClick = function openOnClick () {
              var _this3 = this
              
              // eslint-disable-next-line consistent-return
              this.$element.on("click", function (e) {
                  e.preventDefault()
                  
                  if (_this3.menuOut === true) {
                      return _this3.removeMenu()
                  } else {
                      $(_this3).trigger("sidenav_open", [_this3.options.onOpen])
                      _this3.menuOut = true
                  }
                  
                  if (_this3.options.showOverlay === true) {
                      if (!$("#sidenav-overlay").length) {
                          _this3.showSidenavOverlay()
                      }
                  } else {
                      _this3.showCloseButton()
                  }
                  
                  var translateX = []
                  
                  if (_this3.options.edge === "left") {
                      translateX = [0, -1 * _this3.options.menuWidth]
                  } else {
                      translateX = [0, _this3.options.menuWidth]
                  }
                  
                  if (_this3.$menu.css("transform") !== "matrix(1, 0, 0, 1, 0, 0)") {
                      _this3.$menu.velocity({
                          translateX: translateX,
                      }, {
                          duration: _this3.options.timeDurationOpen,
                          queue: false,
                          easing: _this3.options.easingOpen,
                      })
                  } // this.$sidenavOverlay.on('click', () => this.removeMenu());
                  
                  _this3.$sidenavOverlay.on("touchmove", _this3.touchmoveEventHandler.bind(_this3))
                  
                  _this3.$menu.on("touchmove", function (e) {
                      e.preventDefault()
                      
                      _this3.$menu.find(".custom-scrollbar").css("padding-bottom", "30px")
                  })
                  
                  if (_this3.options.showOverlay === false) {
                      _this3.menuOut = true
                  }
                  
                  if (_this3.options.mode === "push") {
                      var sidePadding
                      
                      if (!_this3.$menu.hasClass("slim")) {
                          sidePadding = _this3.options.edge === "left" ? {
                              marginLeft: _this3.options.menuWidth + "px",
                          } : {
                              marginLeft: "-" + _this3.options.menuWidth + "px",
                          }
                      } else {
                          sidePadding = _this3.options.edge === "left" ? {
                              marginLeft: "3.75rem",
                          } : {
                              marginLeft: "-3.75rem",
                          }
                      }
                      
                      $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(sidePadding)
                  }
                  
                  if (_this3.options.mode === "side") {
                      var elWidth = $(".main").width() - _this3.options.menuWidth
                      
                      var _sidePadding
                      
                      if (!_this3.$menu.hasClass("slim")) {
                          _sidePadding = _this3.options.edge === "left" ? {
                              marginLeft: _this3.options.menuWidth + "px",
                              width: elWidth + "px",
                          } : {
                              marginRight: _this3.options.menuWidth + "px",
                              width: elWidth + "px",
                          }
                      } else {
                          _sidePadding = _this3.options.edge === "left" ? {
                              marginLeft: "3.75rem",
                              width: "",
                          } : {
                              marginLeft: "-3.75rem",
                              width: "",
                          }
                      }
                      
                      $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(_sidePadding)
                  }
              })
          }
          
          _proto.bindTouchEvents = function bindTouchEvents () {
              var _this4 = this
              
              this.$dragTarget.on("click", function () {
                  if (_this4.menuOut) {
                      _this4.removeMenu()
                  }
              })
              this.$dragTarget.on("touchstart", function (e) {
                  _this4.lastTouchVelocity.x.startPosition = e.touches[0].clientX
                  _this4.lastTouchVelocity.x.startTime = Date.now()
              })
              this.$dragTarget.on("touchmove", this.touchmoveEventHandler.bind(this))
              this.$dragTarget.on("touchend", this.touchendEventHandler.bind(this))
          }
          
          _proto.showCloseButton = function showCloseButton () {
              if (this.options.showCloseButton === true) {
                  this.$menu.prepend(this.$elementCloned)
                  this.$menu.find(".logo-wrapper").css({
                      borderTop: "1px solid rgba(153,153,153,.3)",
                  })
              }
          }
          
          _proto.inputOnClick = function inputOnClick () {
              var _this5 = this
              
              this.$menu.find("input[type=text]").on("touchstart", function () {
                  return _this5.$menu.css("transform", "translateX(0)")
              })
          }
          
          _proto.removeMenu = function removeMenu (restoreMenu) {
              var _this6 = this
              
              if (this.options.mode === "push") {
                  $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css({
                      marginLeft: "0",
                  })
              }
              
              if (this.options.mode === "side") {
                  var elWidth = $(".main").width() + this.options.menuWidth
                  $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css({
                      marginLeft: "0",
                      width: "100%",
                  })
              }
              
              this.$body.css({
                  overflow: "",
                  width: "",
              })
              this.$menu.velocity({
                  translateX: this.options.edge === "left" ? "-100%" : "100%",
              }, {
                  duration: this.options.timeDurationClose,
                  queue: false,
                  easing: this.options.easingClose,
                  complete: function complete () {
                      if (restoreMenu === true) {
                          _this6.$menu.removeAttr("style")
                          
                          _this6.$menu.css("width", _this6.options.menuWidth)
                      }
                  },
              })
              this.$menu.removeClass("transform-fix-input")
              this.hideSidenavOverlay()
              this.menuOut = false
              $(".fixed-sn .double-nav").css("padding-left", "unset")
              $(".fixed-sn main, .fixed-sn footer").css({
                  "padding-left": "0",
              })
              $(this).trigger("sidenav_close", [this.options.onClose])
          }
          
          _proto.handleSlim = function handleSlim () {
              var _this7 = this
              
              var $toggle = $("#toggle")
              $toggle.on("click", function () {
                  if (_this7.$menu.hasClass("slim")) {
                      _this7.$menu.removeClass("slim")
                      
                      $(".sv-slim-icon").removeClass("fa-angle-double-right").addClass("fa-angle-double-left")
                      $(".fixed-sn .double-nav").css({
                          transition: "all .3s ease-in-out",
                          "padding-left": "15.9rem",
                      })
                      
                      if (_this7.options.mode === "push") {
                          var sidePadding = _this7.options.edge === "left" ? {
                              marginLeft: "15rem",
                          } : {
                              marginRight: "15rem",
                              marginLeft: "-15rem",
                          }
                          $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(sidePadding)
                      }
                      
                      if (_this7.options.mode === "side") {
                          // const elWidth = $('.main').width() - this.options.menuWidth;
                          var _sidePadding2 = _this7.options.edge === "left" ? {
                              marginLeft: "15rem",
                              width: "",
                          } : {
                              marginRight: "15rem",
                              width: "",
                          }
                          
                          $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(_sidePadding2)
                      }
                      
                      $(".fixed-sn main, .fixed-sn footer").css({
                          transition: "all .3s ease-in-out",
                          "padding-left": "15rem",
                      })
                  } else {
                      _this7.$menu.addClass("slim")
                      
                      if (_this7.options.edge === "right") {
                          _this7.$menu.css({
                              right: "0",
                          })
                      }
                      
                      if (_this7.options.mode === "push") {
                          var _sidePadding3 = _this7.options.edge === "left" ? {
                              marginLeft: "3.75rem",
                          } : {
                              marginRight: "3.75rem",
                              marginLeft: "0",
                          }
                          
                          $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(_sidePadding3)
                      }
                      
                      if (_this7.options.mode === "side") {
                          var elWidth = $(".main").width() - _this7.options.menuWidth
                          
                          var _sidePadding4 = _this7.options.edge === "left" ? {
                              marginLeft: "3.75rem",
                              width: "",
                          } : {
                              marginRight: "3.75rem",
                              width: "",
                          }
                          
                          $(".fixed-sn .main, .fixed-sn footer, .fixed-sn header").css(_sidePadding4)
                      }
                      
                      $(".sv-slim-icon").removeClass("fa-angle-double-left").addClass("fa-angle-double-right")
                      $(".fixed-sn .double-nav").css("padding-left", "4.6rem")
                      $(".fixed-sn main, .fixed-sn footer").css({
                          "padding-left": "3.7rem",
                      })
                  }
              })
          }
          
          _proto.touchmoveEventHandler = function touchmoveEventHandler (e) {
              if (e.type !== "touchmove") {
                  return
              }
              
              var _e$touches = e.touches,
                touch = _e$touches[0]
              var touchX = touch.clientX // calculate velocity every 20ms
              
              if (Date.now() - this.lastTouchVelocity.x.startTime > 20) {
                  this.lastTouchVelocity.x.startPosition = touch.clientX
                  this.lastTouchVelocity.x.startTime = Date.now()
              }
              
              this.disableScrolling()
              var overlayExists = this.$sidenavOverlay.length !== 0
              
              if (!overlayExists) {
                  this.buildSidenavOverlay()
              } // Keep within boundaries
              
              if (this.options.edge === "left") {
                  if (touchX > this.options.menuWidth) {
                      touchX = this.options.menuWidth
                  } else if (touchX < 0) {
                      touchX = 0
                  }
              }
              
              this.translateSidenavX(touchX)
              this.updateOverlayOpacity(touchX)
          }
          
          _proto.setTabTrap = function setTabTrap () {
              this.$menu.find(".collapsible-header").each(function (i, el) {
                  $(el).attr("tabIndex", "0")
              })
              this.$menu.find("#toggle").attr("tabIndex", "0")
              var tabTrapElements = this.$menu.find("a[tabindex=0]")
              var numberOfElements = tabTrapElements.length
              var firstElement = this.$menu.find("li").get(0)
              var lastElement = tabTrapElements.get(numberOfElements - 1)
              var tabKey = 9
              $(lastElement).on("keydown", function (e) {
                  if (e.keyCode === tabKey) {
                      e.preventDefault()
                      
                      if (!e.shiftKey) {
                          $(firstElement).find("a").focus()
                      }
                      
                      if (e.shiftKey) {
                          $(lastElement).focus()
                      }
                  }
              })
          }
          
          _proto.bindKeydownEvents = function bindKeydownEvents () {
              var space = 32
              var enter = 13
              this.$menu.find(".collapsible-accordion a").on("keydown", function (e) {
                  if (e.keyCode === space || e.keyCode === enter) {
                      $(e.currentTarget).trigger("click")
                  }
              })
          }
          
          _proto.calculateTouchVelocityX = function calculateTouchVelocityX () {
              var distance = Math.abs(this.lastTouchVelocity.x.endPosition - this.lastTouchVelocity.x.startPosition)
              var time = Math.abs(this.lastTouchVelocity.x.endTime - this.lastTouchVelocity.x.startTime)
              return distance / time
          }
          
          _proto.touchendEventHandler = function touchendEventHandler (e) {
              if (e.type !== "touchend") {
                  return
              }
              
              var touch = e.changedTouches[0]
              this.lastTouchVelocity.x.endTime = Date.now()
              this.lastTouchVelocity.x.endPosition = touch.clientX
              var velocityX = this.calculateTouchVelocityX()
              var touchX = touch.clientX
              var leftPos = touchX - this.options.menuWidth
              var rightPos = touchX - this.options.menuWidth / 2
              
              if (leftPos > 0) {
                  leftPos = 0
              }
              
              if (rightPos < 0) {
                  rightPos = 0
              }
              
              if (this.options.edge === "left") {
                  // If velocityX <= 0.3 then the user is flinging the menu closed so ignore this.menuOut
                  if (this.menuOut || velocityX <= this.settings.menuLeftMinBorder || velocityX < this.options.menuLeftMaxBorder) {
                      if (leftPos !== 0) {
                          this.translateMenuX([0, leftPos], "300")
                      }
                      
                      this.showSidenavOverlay()
                  } else if (!this.menuOut || velocityX > this.settings.menuLeftMinBorder) {
                      this.enableScrolling()
                      this.translateMenuX([-1 * this.options.menuWidth - this.options.menuVelocityOffset, leftPos], "200")
                      this.hideSidenavOverlay()
                  }
                  
                  this.$dragTarget.css({
                      width: "10px",
                      right: "",
                      left: 0,
                  })
              } else if (this.menuOut && velocityX >= this.settings.menuRightMinBorder || velocityX > this.settings.menuRightMaxBorder) {
                  this.translateMenuX([0, rightPos], "300")
                  this.showSidenavOverlay()
                  this.$dragTarget.css({
                      width: "50%",
                      right: "",
                      left: 0,
                  })
              } else if (!this.menuOut || velocityX < this.settings.menuRightMinBorder) {
                  this.enableScrolling()
                  this.translateMenuX([this.options.menuWidth + this.options.menuVelocityOffset, rightPos], "200")
                  this.hideSidenavOverlay()
                  this.$dragTarget.css({
                      width: "10px",
                      right: 0,
                      left: "",
                  })
              }
          }
          
          _proto.buildSidenavOverlay = function buildSidenavOverlay () {
              var _this8 = this
              
              if (this.options.showOverlay === true) {
                  this.$sidenavOverlay = $("<div id=\"sidenav-overlay\"></div>")
                  this.$sidenavOverlay.css("opacity", 0).on("click", function () {
                      return _this8.removeMenu()
                  })
                  this.$body.append(this.$sidenavOverlay)
              }
          }
          
          _proto.disableScrolling = function disableScrolling () {
              var oldWidth = this.$body.innerWidth()
              this.$body.css("overflow", "hidden")
              this.$body.width(oldWidth)
          }
          
          _proto.enableScrolling = function enableScrolling () {
              this.$body.css({
                  overflow: "",
                  width: "",
              })
          }
          
          _proto.translateMenuX = function translateMenuX (fromTo, duration) {
              this.$menu.velocity({
                  translateX: fromTo,
              }, {
                  duration: typeof duration === "string" ? Number(duration) : duration,
                  queue: false,
                  easing: this.options.easingOpen,
              })
          }
          
          _proto.translateSidenavX = function translateSidenavX (touchX) {
              if (this.options.edge === "left") {
                  var isRightDirection = touchX >= this.options.menuWidth / 2
                  this.menuOut = isRightDirection
                  this.$menu.css("transform", "translateX(" + (touchX - this.options.menuWidth) + "px)")
              } else {
                  var isLeftDirection = touchX < window.innerWidth - this.options.menuWidth / 2
                  this.menuOut = isLeftDirection
                  var rightPos = touchX - this.options.menuWidth / 2
                  
                  if (rightPos < 0) {
                      rightPos = 0
                  }
                  
                  this.$menu.css("transform", "translateX(" + rightPos + "px)")
              }
          }
          
          _proto.updateOverlayOpacity = function updateOverlayOpacity (touchX) {
              var overlayPercentage
              
              if (this.options.edge === "left") {
                  overlayPercentage = touchX / this.options.menuWidth
              } else {
                  overlayPercentage = Math.abs((touchX - window.innerWidth) / this.options.menuWidth)
              }
              
              this.$sidenavOverlay.velocity({
                  opacity: overlayPercentage,
              }, {
                  duration: 10,
                  queue: false,
                  easing: this.options.easingOpen,
              })
          }
          
          _proto.showSidenavOverlay = function showSidenavOverlay () {
              if (this.options.showOverlay === true && !$("#sidenav-overlay").length) {
                  this.buildSidenavOverlay()
              }
              
              this.$sidenavOverlay.velocity({
                  opacity: 1,
              }, {
                  duration: this.options.timeDurationOverlayOpen,
                  queue: false,
                  easing: this.options.easingOpen,
              })
          }
          
          _proto.hideSidenavOverlay = function hideSidenavOverlay () {
              this.$sidenavOverlay.velocity({
                  opacity: 0,
              }, {
                  duration: this.options.timeDurationOverlayClose,
                  queue: false,
                  easing: this.options.easingOpen,
                  complete: function complete () {
                      $(this).remove()
                  },
              })
          }
          
          return SideNav2
      }()
    
    $.fn.sideNav2 = function (options) {
        $(this).each(function () {
            var sidenav2 = new SideNav2($(this), options)
            sidenav2.init()
        })
    }
    //
    $(".side-nav").on("touchmove", function (e) {
        e.stopPropagation()
    }, false)
})
