const Season = (function () {
    "use strict"
    ///////////////////////////////////////////////
    const _table_product_seasons = document.getElementById("table_product_seasons")
    const _select_season_assign_type = document.getElementById("select_season_assign_type")
    const _block_edit = document.getElementById("block_edit")
    const _show_titles = document.getElementById("show_titles")
    const _background_color = document.getElementById("background_color")
    const _background_color_display = document.getElementById("background_color_display")
    const _border_color = document.getElementById("border_color")
    const _border_color_display = document.getElementById("border_color_display")
    const _text_color = document.getElementById("text_color")
    const _text_color_display = document.getElementById("text_color_display")
    const _button_edit_product_clear_season = document.getElementById("button_edit_product_clear_season")
    const _season_name = document.getElementById("season_name")
    const _season_id = document.getElementById("season_id")
    const _button_edit_product_delete_selected = document.getElementById("button_edit_product_delete_selected")
    const _button_edit_product_new_season_toggle = document.getElementById("button_edit_product_new_season_toggle")
    const _enable_all_seasons = document.getElementById("enable_all_seasons")
    const _enable_season_sunday = document.getElementById("enable_season_sunday")
    const _enable_season_monday = document.getElementById("enable_season_monday")
    const _enable_season_tuesday = document.getElementById("enable_season_tuesday")
    const _enable_season_wednesday = document.getElementById("enable_season_wednesday")
    const _enable_season_thursday = document.getElementById("enable_season_thursday")
    const _enable_season_friday = document.getElementById("enable_season_friday")
    const _enable_season_saturday = document.getElementById("enable_season_saturday")
    const _season_enabled = document.getElementById("season_enabled")
    const _product_season_edit_form = document.getElementById("product_season_edit_form")
    const _calendar_season = document.getElementById("calendar_season")
    const _category_id = document.getElementById("category_id")
    const _button_product_edit_add_dates_to_season = document.getElementById("button_product_edit_add_dates_to_season")
    ///////////////////////////////////////////////
    let $product_edit_table = $(_table_product_seasons)
    let months_shown = 6
    let disabled_dow = []
    let event_limit = 3
    let start = moment(moment().year() + "-01-01").format("YYYY-MM-DD")
    let block_edit_mode = false
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    let calendars = [
        $("#season_calendar_0"), $("#season_calendar_1"), $("#season_calendar_2"), $("#season_calendar_3"), $("#season_calendar_4"), $("#season_calendar_5"),
        $("#season_calendar_6"), $("#season_calendar_7"), $("#season_calendar_8"), $("#season_calendar_9"), $("#season_calendar_10"), $("#season_calendar_11"),
        $("#season_calendar_12"), $("#season_calendar_13"), $("#season_calendar_14"), $("#season_calendar_15"), $("#season_calendar_16"), $("#season_calendar_17"),
        $("#season_calendar_18"), $("#season_calendar_19"), $("#season_calendar_20"), $("#season_calendar_21"), $("#season_calendar_22"), $("#season_calendar_23"),
        $("#season_calendar_24"), $("#season_calendar_25"), $("#season_calendar_26"), $("#season_calendar_27"), $("#season_calendar_28"), $("#season_calendar_29"),
        $("#season_calendar_30"), $("#season_calendar_31"), $("#season_calendar_32"), $("#season_calendar_33"), $("#season_calendar_34"), $("#season_calendar_35"),
    ]
    let active_calendars = []
    ///////////////////////////////////////////////
    $(_button_edit_product_new_season_toggle)
      .on("click", function () {
          clear()
          $product_edit_table.clearSelectedRows()
      })
    
    $(_background_color)
      .colorpicker({
          format: "hex",
          fallbackColor: "#fff",
          color: "#fff",
          colorSelectors: {
              "grey": "#777",
              "blue": "#337ab7",
              "success": "#5cb85c",
              "info": "#5bc0de",
              "warning": "#f0ad4e",
              "red": "#d9534f",
          },
      })
      .change(function () {
          let newColor = $(this).val()
          $(_background_color_display).css("background", newColor)
      })
    
    $(_border_color)
      .colorpicker({
          format: "hex",
          fallbackColor: "#999",
          color: "#999",
          
      })
      .change(function () {
          let newColor = $(this).val()
          $(_border_color_display).css("background", newColor)
      })
    
    $(_text_color)
      .colorpicker({
          format: "hex",
          fallbackColor: "#000",
          color: "#000",
          
      })
      .change(function () {
          let newColor = $(this).val()
          $(_text_color_display).css("background", newColor)
      })
    
    $(_enable_all_seasons)
      .on("click", function () {
          alert("click")
      })
    ///////////////////////////////////////////////
    const trim_obj_name = function (obj) {
        let temp = {}
        if (obj) {
            $.each(obj, function (ind, val) {
                let str = ind.replace("product_season_", "")
                str = str.replace("season_", "")
                temp[str] = val
                
            })
        }
        
        return temp
    }
    ///////////////////////////////////////////////
    const clear = function () {
        $(_background_color).val("#fff").trigger("change")
        $(_text_color).val("#000").trigger("change")
        $(_border_color).val("#999").trigger("change")
        disabled_dow = []
        _season_enabled.checked = true
        _enable_season_sunday.checked = true
        _enable_season_monday.checked = true
        _enable_season_tuesday.checked = true
        _enable_season_wednesday.checked = true
        _enable_season_thursday.checked = true
        _enable_season_friday.checked = true
        _enable_season_saturday.checked = true
        _enable_all_seasons.checked = true
        _season_id.value = ""
        _season_name.value = ""
    }
    ///////////////////////////////////////////////
    const unset_active_calendars = function () {
        $.each(calendars, function (index, cal) {
            if (cal.fullCalendar) {
                cal.fullCalendar("destroy")
            }
            cal.hide()
        })
        return true
    }
    const set_active_calendars = function () {
        active_calendars = []
        for (let n = 0; n < calendars.length; n++) {
            if (n < months_shown) {
                active_calendars.push(calendars[n])
                calendars[n].show()
            }
        }
        return active_calendars
    }
    
    const set_calendar_display = function () {
        return moment(start).year() + " - " + moment(start).add(months_shown, "months").year()
    }
    
    const set_block_edit_mode = function () {
        
        if (block_edit_mode) {
            //$("#seasonsCalendarBlock div.fc-toolbar.fc-header-toolbar").addClass("block_edit_mode")
        } else {
            //$("div.fc-toolbar.fc-header-toolbar").removeClass("block_edit_mode")
        }
    }
    ///////////////////////////////////////////////
    const set = function (season) {
        if (!season) {
            season = {}
        }
        season = trim_obj_name(season)
        Season.detail = {
            id: (season.id) ? season.id : null,
            name: (season.name) ? season.name : null,
            class: (season.class) ? season.class : null,
            category_id: (season.category_id) ? season.category_id : null,
            background_color: (season.background_color) ? season.background_color : "#fff",
            text_color: (season.text_color) ? season.text_color : "#000",
            border_color: (season.border_color) ? season.border_color : "#999",
            view_product_index: (season.view_product_index) ? season.view_product_index : 1,
            view_product_index_filter: (season.view_product_index_filter) ? season.view_product_index_filter : 1,
            view_product_index_search: (season.view_product_index_search) ? season.view_product_index_search : 1,
            view_product_edit: (season.view_product_edit) ? season.view_product_edit : 1,
            view_product_package_edit: (season.view_product_package_edit) ? season.view_product_package_edit : 1,
            view_product_package_index: (season.view_product_package_index) ? season.view_product_package_index : 1,
            enabled: (season.enabled) ? season.enabled : 1,
            date_created: (season.date_created) ? season.date_created : formatDateMySQL(),
            disabled_dow: (season.disabled_dow) ? season.disabled_dow.replace(/\s+/g, "").split(",") : [],
            created_by: (season.created_by) ? season.created_by : user_id,
            date_modified: (season.date_modified) ? season.date_modified : formatDateMySQL(),
            modified_by: (season.modified_by) ? season.modified_by : user_id,
        }
    }
    
    const set_autocomplete = function () {
        $(_season_name)
          .on("click", function () {
              $(this).select()
          })
    }
    const days = [
        "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
    ]
    const set_enabled_dow = function (disabled_dow) {
        if (!disabled_dow) {
            disabled_dow = []
        }
        if (disabled_dow.length === 0) {
            $(_enable_all_seasons).trigger("click")
        }
        $.each(disabled_dow, function (i, dow) {
            console.log(days[dow])
        })
    }
    
    const edit = function (season) {
        if (season) {
            clear()
            console.log("season", season)
            let disabled_dow = season.disabled_dow.map(function (x) {
                return parseInt(x, 10)
            })
            set_enabled_dow(disabled_dow)
            console.log("disabled", disabled_dow)
            $(_background_color).val(season.background_color).trigger("change")
            $(_border_color).val(season.border_color).trigger("change")
            $(_text_color).val(season.text_color).trigger("change")
            _season_name.value = season.name
            _season_id.value = season.id
            /*
                background_color: "#ffebee"
                border_color: "#000"
                category_id: 1
                class: "default-color white-text"
                created_by: 8
                date_created: "2020-10-20 11:17:35"
                date_modified: "2020-10-20 11:17:35"
                enabled: 1
                id: 1
                modified_by: 8
                name: "Year-Round"
                text_color: "#000"
                view_product_edit: 1
                view_product_index: 1
                view_product_index_filter: 1
                view_product_index_search: 1
                view_product_package_edit: 1
                view_product_package_index: 1
             */
        } else {
            //alert("add")
        }
        
    }
    
    const build_product_edit_table = function () {
        if (_table_product_seasons) {
            $product_edit_table = $(_table_product_seasons).table({
                table_type: "display_list",
                data: Array.from(Season.all.values()),
                columnDefs: [
                    {
                        title: "Id",
                        targets: 0,
                        data: "id",
                    },
                    {
                        title: "Name",
                        targets: 1,
                        data: "name",
                        render: function (data, type, row, meta) {
                            return `<span class='' style='white-space: nowrap'>${data}</span>`
                        },
                    },
                ],
                rowClick: Season.edit,
            })
        }
    }
    
    const build_calendar = function () {
        let active_calendars = set_active_calendars()
        let display_range = set_calendar_display()
        //*
        console.log("active_calendars", active_calendars)
        console.log("display_range", display_range)
        //*/
        $.each(active_calendars, function (index, cal) {
            cal.fullCalendar({
                header: {
                    left: "title",
                    center: "",
                    right: "",
                },
            })
        })
        
    }
    
    //////
    const init = function (settings) {
        clear()
        set_block_edit_mode()
        if (_border_color) {
            $(_border_color).val("#eee").trigger("change")
        }
        
        if (_background_color) {
            $(_background_color).val("#fff").trigger("change")
        }
        
        if (_text_color) {
            $(_text_color).val("#000").trigger("change")
        }
        
        if (_button_product_edit_add_dates_to_season) {
            _button_product_edit_add_dates_to_season.disabled = true
        }
        
        if (_button_edit_product_delete_selected) {
            $(_button_edit_product_delete_selected).hide()
        }
        
        if (_button_edit_product_delete_selected) {
            $(_button_edit_product_delete_selected).hide()
        }
        
        if (_table_product_seasons) {
            build_product_edit_table()
        }
        
        if (_season_name && _category_id) {
            set_autocomplete()
        }
        
        if (_calendar_season) {
            build_calendar()
        }
    }
    
    const load = function (seasons) {
        Season.all = new Map()
        if (seasons) {
            $.each(seasons, function (ind, season) {
                //console.log("season", season)
                set(season)
                Season.all.set(Season.detail.id, Season.detail)
                $product_edit_table.insertRow(Season.detail)
            })
        }
        
        console.log("Season.all", Season.all)
        console.log("Season.detail", Season.detail)
    }
    
    const init_product_edit = function (seasons) {
        if (seasons) {
            load(seasons)
        }
        
    }
    /////
    return {
        all: new Map(),
        types: new Map(),
        types_detail: {},
        detail: {
            disabled_dow: [],
            id: null,
            name: null,
            class: null,
            category_id: null,
            background_color: null,
            text_color: null,
            border_color: null,
            view_product_index: 1,
            view_product_index_filter: 1,
            view_product_index_search: 1,
            view_product_edit: 1,
            view_product_package_edit: 1,
            view_product_package_index: 1,
            enabled: 1,
            date_created: formatDateMySQL(),
            created_by: null,
            date_modified: formatDateMySQL(),
            modified_by: null,
        },
        edit: function (season) {
            edit(season)
        },
        set_autocomplete: function () {
            set_autocomplete()
        },
        init_product_edit: function (seasons) {
            init_product_edit(seasons)
        },
        init: function (settings) {
            init(settings)
        },
    }
    
})()

Season.init()
