$("a.panel-action")
  .on("click", function () {
      let $this = $(this)
      if ($(this).data("toggle")) {
          
          let data_toggle = $(this).data("toggle")
          
          switch (data_toggle) {
              case "panel-button":
                  break
              case "panel-filter":
                  let $target = $(this).data("target")
                  let filter_box = $("#" + $target)
                  console.log("this", $target)
                  let display = "hidden"
                  if (filter_box) {
                      if (filter_box.data("display")) {
                          display = filter_box.data("display")
                      }
                      console.log("display", display)
                      if (display === "hidden") {
                          filter_box.data("display", "shown")
                          filter_box.show("fast", function () {
                              $this.addClass("active")
                          })
                      } else if (display === "shown") {
                          filter_box.data("display", "hidden")
                          filter_box.hide("fast", function () {
                              $this.removeClass("active")
                          })
                      }
                  } else {
                      console.log("filter_box", filter_box)
                  }
                  
                  break
              case "panel-fullscreen":
                  Panel.go_fullscreen($(this))
                  break
              default:
                  break
          }
      } else {
          Panel.compress_all()
      }
      
  })

const Panel = (function () {
    "use strict"
    
    const init = function () {
    
    }
    
    const compress_all = function () {
        $(".is-fullscreen").each(function () {
            $(this).removeClass("is-fullscreen")
        })
        $("a.panel-action.fas.fa-compress").each(function () {
            $(this)
              .removeClass("fa-compress")
              .addClass("fa-expand")
        })
    }
    
    const expand = function ($this) {
        $this.removeClass("fa-expand")
        $this.addClass("fa-compress")
        $this.closest("section.panel").addClass("is-fullscreen")
    }
    
    const compress = function ($this) {
        $this.removeClass("fa-compress")
        $this.addClass("fa-expand")
        $this.closest("section.panel").removeClass("is-fullscreen")
    }
    
    const go_fullscreen = function ($this) {
        if ($this) {
            if ($this.hasClass("fa-expand")) {
                expand($this)
            } else if ($this.hasClass("fa-compress")) {
                compress($this)
            }
        }
    }
    
    return {
        go_fullscreen: function ($this) {
            go_fullscreen($this)
        },
        compress_all: function () {
            compress_all()
        },
        init: function (settings) {
            init(settings)
        },
    }
    
})()
