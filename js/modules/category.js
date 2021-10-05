const Category = (function () {
    "use strict"
    ///////////////////////////////////////////////
    const _category_id = document.getElementById("category_id")
    const _product_id = document.getElementById("product_id")
    const _product_edit_form = document.getElementById("product_edit_form")
    const _product_rating_id = document.getElementById("product_rating_id")
    const _pricing_strategy_id = document.getElementById("pricing_strategy_id")
    const _product_name = document.getElementById("product_name")
    const _depart_time = document.getElementById("depart_time")
    const _arrive_time = document.getElementById("arrive_time")
    const _day_span = document.getElementById("day_span")
    ///////////////////////////////////////////////
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    ///////////////////////////////////////////////
    $(_category_id)
      .on("change", function () {
          if (_product_edit_form) {
              if (!isNaN(parseInt($(this).val()))) {
                  validate()
                  Season.set_autocomplete(parseInt($(this).val()))
                  Product.set_autocomplete(parseInt($(this).val()))
              }
          }
          
      })
    ///////////////////////////////////////////////
    const showNone = function () {
        //Rail.showRails(false);
        //Flight.showFlights(false);
        //Car.showCars(false)
        //Tour.showTours(false)
        //showTransport(false)
    }
    
    const set_product_edit_defaults = function () {
        if (_product_id) {
            let new_product = (!isNaN(_product_id.value))
            /*
            console.log("new_product", new_product)
            //*/
            switch (_category_id.value) {
              // Hotel
                case "1" || 1:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = ""
                        //_arrive_time.value = ""
                        //_depart_time.value = ""
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    break
              // Flight
                case "2" || 2:
                    showNone()
                    //Flight.init(details)
                    
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = "2"
                        _product_rating_id.value = ""
                        //_day_span_flight.value = "0"
                        //_day_span.value = "0"
                        //_arrive_time.value = "00:00"
                        //_depart_time.value = "00:00"
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = true
                    break
              // Cars
                case "3" || 3:
                    showNone()
                    //Car.init(details)
                    //_min_age.labels[0].innerHTML = "Min Days:"
                    //_max_age.labels[0].innerHTML = "Max Days:"
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = "3"
                        _product_rating_id.value = ""
                        //_day_span_car.value = "0"
                        //_day_span.value = "0"
                        //_arrive_time.value = "00:00"
                        //_depart_time.value = "00:00"
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = true
                    break
              // Rail
                case "4" || 4:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = "2"
                        _product_rating_id.value = ""
                        //_day_span_rail.value = "0"
                        //_day_span.value = "0"
                        //_arrive_time.value = "00:00"
                        //_depart_time.value = "00:00"
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = true
                    showNone()
                    //Rail.init(details)
                    break
              // Transport
                case "5" || 5:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = ""
                        //_arrive_time.value = ""
                        //_depart_time.value = ""
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    //Car.init(details)
                    break
              // Tours
                case "6" || 6:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = "2"
                        _product_rating_id.value = ""
                        //_day_span_tour.value = "0"
                        //_day_span.value = "0"
                        //_arrive_time.value = "00:00"
                        //_depart_time.value = "00:00"
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = true
                    showNone()
                    //Tour.init(details)
                    break
              // Cruises
                case "7" || 7:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = "0"
                        //_arrive_time.value = "00:00"
                        //_depart_time.value = "00:00"
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    break
              // Packages
                case "8" || 8:
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = ""
                        //_arrive_time.value = ""
                        //_depart_time.value = ""
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    break
              // Other
                case "9" || 9:
                    console.log("other")
                    if (new_product) {
                        _product_name.disabled = false
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = ""
                        //_arrive_time.value = ""
                        //_depart_time.value = ""
                    } else {
                        _product_name.disabled = true
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    break
                default:
                    _product_name.disabled = true
                    if (new_product) {
                        _pricing_strategy_id.value = ""
                        _product_rating_id.value = ""
                        //_day_span.value = ""
                        //_arrive_time.value = ""
                        //_depart_time.value = ""
                    }
                    _product_rating_id.disabled = false
                    showNone()
                    break
            }
        }
        
    }
    
    const init = function () {
        validate()
    }
    
    const validate = function () {
        set_product_edit_defaults()
        if (_category_id) {
            if (isNaN(parseInt(_category_id.value))) {
                //$(_tab_product_edit_season).addClass("disabled")
            } else {
                //$(_tab_product_edit_season).removeClass("disabled")
            }
        }
        
    }
    
    const reset = function () {
        
        Category.detail = {
            id: null,
            pricing_strategy_types_id: null,
            name: null,
            icon: null,
            view_product_index: 1,
            view_product_index_filter: 1,
            view_product_index_search: 1,
            view_product_edit: 1,
            view_product_package_edit: 1,
            view_product_package_index: 1,
            all_day: 1,
            display: 1,
            overlap: 1,
            editable: 1,
            duration_editable: 1,
            start_editable: 1,
            background_color: "#fff",
            text_color: "#000",
            border_color: "#eee",
            enabled: null,
            date_created: formatDateMySQL(),
            created_by: null,
            date_modified: formatDateMySQL(),
            modified_by: null,
            note: null,
        }
    }
    
    const trim_obj_name = function (obj, tr) {
        let temp = {}
        if (obj) {
            $.each(obj, function (ind, val) {
                let str = ind.replace("category_", "")
                temp[str] = val
                
            })
        }
        
        return temp
    }
    
    const handle_category_error = function (msg) {
        toastr.error(msg)
    }
    
    const insert_row = function (category) {
        if (category) {
        
        }
    }
    
    const set = function (category) {
        
        if (!category) {
            category = {}
        }
        category = trim_obj_name(category)
        Category.detail = {
            all_day: (category.all_day) ? category.all_day : 1,
            background_color: (category.background_color) ? category.background_color : "#fff",
            border_color: (category.border_color) ? category.border_color : "#999",
            created_by: (category.created_by) ? category.created_by : user_id,
            date_created: (category.date_created) ? category.date_created : formatDateMySQL(),
            date_modified: (category.date_modified) ? category.date_modified : formatDateMySQL(),
            display: (category.display) ? category.display : "",
            duration_editable: (category.duration_editable) ? category.duration_editable : 1,
            editable: (category.editable) ? category.editable : 1,
            enabled: (category.enabled) ? category.enabled : 1,
            icon: (category.icon) ? category.icon : "",
            id: (category.id) ? category.id : null,
            modified_by: (category.modified_by) ? category.modified_by : user_id,
            name: (category.name) ? category.name : "",
            overlap: (category.overlap) ? category.overlap : 1,
            pricing_strategy_types_id: (category.pricing_strategy_types_id) ? category.pricing_strategy_types_id : null,
            start_editable: (category.start_editable) ? category.start_editable : 1,
            text_color: (category.text_color) ? category.text_color : "#000",
            view_product_edit: (category.view_product_edit) ? category.view_product_edit : 1,
            view_product_index: (category.view_product_index) ? category.view_product_index : 1,
            view_product_index_filter: (category.view_product_index_filter) ? category.view_product_index_filter : 1,
            view_product_index_search: (category.view_product_index_search) ? category.view_product_index_search : 1,
            view_product_package_edit: (category.view_product_package_edit) ? category.view_product_package_edit : 1,
        }
    }
    
    const load = function (categories) {
        Category.all = new Map()
        
        if (categories) {
            $.each(categories, function (ind, category) {
                set(category)
                Category.all.set(Category.detail.id, Category.detail)
            })
        }
        
        console.log("Category.all", Category.all)
    }
    ///////////////////////////////////////////////
    return {
        detail: {},
        all: new Map(),
        init: function () {
            init()
        },
        load: function (categories) {
            load(categories)
        },
    }
    
})()

Category.init()
