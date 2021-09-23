const Location = (function () {
    "use strict"
    
    //------------------------------------------------------------------
    
    const _form_edit_location = document.getElementById("form_edit_location")
    const _form_location_details = document.getElementById("form_location_details")
    const _location_types_id = document.getElementById("location_types_id")
    const _location_name_filter = document.getElementById("location_name_filter")
    const _location_city_id = document.getElementById("location_city_id")
    const _location_country_id = document.getElementById("location_country_id")
    const _location_province_id = document.getElementById("location_province_id")
    const _location_id = document.getElementById("location_id")
    const _location_street = document.getElementById("location_street")
    const _location_street2 = document.getElementById("location_street2")
    const _location_zipcode = document.getElementById("location_zipcode")
    const _location_name = document.getElementById("location_name")
    const _temp_location_id = document.getElementById("temp_location_id")
    // -- Buttons
    const _button_close_location_edit = document.getElementById("button_close_location_edit")
    const _button_submit_form_edit_location = document.getElementById("button_submit_form_edit_location")
    const _button_edit_location = document.getElementById("button_edit_location")
    const _button_add_location_edit = document.getElementById("button_add_location_edit")
    
    //------------------------------------------------------------------
    
    let validator
    let validated = false
    let default_display = default_address_view
    
    //------------------------------------------------------------------
    
    const form_rules = {
        rules: {
            location_types_id: {
                required: true,
                digits: true,
            },
            location_city_id: {
                required: true,
                digits: true,
            },
            location_country_id: {
                required: true,
                digits: true,
            },
            location_province_id: {
                required: true,
                digits: true,
            },
            location_name: { required: true },
        },
        messages: {
            location_types_id: {
                required: "field required",
                digits: "invalid",
            },
            location_city_id: {
                required: "field required",
                digits: "invalid",
            },
            location_country_id: {
                required: "field required",
                digits: "invalid",
            },
            location_province_id: {
                required: "field required",
                digits: "invalid",
            },
            location_id: {
                required: "field required",
                digits: "invalid",
            },
            location_name: { required: "field required" },
        },
    }
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    
    //------------------------------------------------------------------
    
    $(_button_close_location_edit)
      .on("click", function () {
          hide_form()
      })
    
    $(_button_add_location_edit)
      .on("click", function () {
          set_detail()
          reset_form()
          populate_form()
      })
    
    $(_location_name_filter)
      .on("click", function () {
          $(this).select()
      })
      .on("change", function () {
          if ($(this).val() === "") {
              set_detail()
              reset_form()
              populate_form()
          }
      })
      .on("search", function () {
          set_detail()
          reset_form()
          populate_form()
      })
    
    $("input[name='location_display']")
      .on("change", function () {
          let selected_value = $("input[name='location_display']:checked").val()
          default_display = selected_value
          init_autocomplete()
          if (Location.detail["location_" + selected_value] !== null) {
              _location_name_filter.value = Location.detail["location_" + selected_value]
          }
      })
    
    $(_button_edit_location)
      .on("click", function () {
          if (_location_id.value === "") {
              set_detail()
              reset_form()
              populate_form()
          } else {
          
          }
          
          show_form()
          
      })
    
    $(_button_submit_form_edit_location)
      .on("click", function () {
          Location.save()
      })
    
    $(_location_country_id)
      .on("change", function () {
          if (validated) {
              validate_form()
          }
      })
    
    $(_location_province_id)
      .on("change", function () {
          if (validated) {
              validate_form()
          }
      })
    
    $(_location_types_id)
      .on("change", function () {
          if (validated) {
              validate_form()
          }
      })
    
    $(_location_city_id)
      .on("change", function () {
          if (validated) {
              validate_form()
          }
      })
    
    //------------------------------------------------------------------
    
    const init_autocomplete = function () {
        $(_location_name_filter)
          .autocomplete({
              serviceUrl: "/autocomplete/locations",
              minChars: 2,
              cache: false,
              dataType: "json",
              triggerSelectOnValidInput: false,
              paramName: "st",
              params: { "default_display": default_display },
              onSelect: function (suggestion) {
                  Province.set_detail(suggestion.data)
                  Country.set_detail(suggestion.data)
                  City.set_detail(suggestion.data)
                  Location.set_detail(suggestion.data)
                  populate_form(suggestion.data)
                  clear_validation(_form_edit_location)
                  /*
                  console.log("----")
                  console.log(Country.detail)
                  console.log(Province.detail)
                  console.log(City.detail)
                  //console.log(suggestion.data)
                  //console.log(Location.detail)
                  console.log("----")
                  //*/
              },
              onSearchComplete: function (query, suggestions) {
              },
          })
    }
    
    //------------------------------------------------------------------
    
    const handle_location_error = function (msg) {
        toastr.error(msg)
    }
    
    const update_location_record = function (dataToSend) {
        if (dataToSend) {
            try {
                
                sendPostRequest("/locations/update", dataToSend, function (data, status, xhr) {
                    //console.log(data)
                    if (data) {
                        if (data.location_id) {
                            _location_id.value = data.location_id
                            validated = false
                            Province.set_detail(data)
                            Country.set_detail(data)
                            City.set_detail(data)
                            Location.set_detail(data)
                            populate_form(data)
                            hide_form()
                            toastr.success("Location: " + data.location_id + " created")
                        }
                        
                    } else {
                        return handle_location_error("Error: 1")
                    }
                })
                
            } catch (e) {
                console.log(e)
                return handle_location_error("Error: Validating Location")
            }
        } else {
            return handle_location_error("Error: Loading Location - Missing Data")
        }
    }
    
    const disable = function () {
        let location_displays = document.getElementsByName("location_display")
        $.each(location_displays, function (i, elem) {
            elem.disabled = true
        })
        _location_name_filter.disabled = true
        _button_edit_location.disabled = true
    }
    
    const enable = function () {
        let location_displays = document.getElementsByName("location_display")
        $.each(location_displays, function (i, elem) {
            elem.disabled = false
        })
        _location_name_filter.disabled = false
        _button_edit_location.disabled = false
    }
    
    //------------------------------------------------------------------
    
    const show_form = function () {
        disable()
        $(_form_location_details).show()
    }
    
    const hide_form = function () {
        enable()
        $(_form_location_details).hide()
    }
    
    const reset_form = function () {
        validated = false
        validator.resetForm()
        _location_name.value = ""
        _location_name_filter.value = ""
        _location_id.value = ""
        _location_types_id.value = ""
        _location_street.value = ""
        _location_street2.value = ""
        _location_zipcode.value = ""
        _location_country_id.value = ""
        _location_province_id.value = ""
        _location_city_id.value = ""
        Province.set_detail()
        Country.set_detail()
        City.id = null
        $(_location_country_id).val("").trigger("change")
        
        document.getElementById("location_display_medium").checked = true
        
    }
    
    const populate_form = function (location) {
        
        if (location) {
            Province.set_detail(location)
            Country.set_detail(location)
            City.set_detail(location)
        }
        
        _location_name_filter.value = Location.detail.location
        _location_name.value = Location.detail.name
        _location_id.value = Location.detail.id
        $(_location_types_id).val(Location.detail.location_types_id).trigger("change")
        _location_street.value = Location.detail.street
        _location_street2.value = Location.detail.street2
        _location_zipcode.value = Location.detail.zipcode
        $(_location_country_id).val((Location.detail.country_id) ? Location.detail.country_id : "").trigger("change")
        $(_temp_location_id).val(Location.detail.id).trigger("change")
    }
    
    const validate_form = function () {
        return $(_form_edit_location).valid()
    }
    
    //------------------------------------------------------------------
    
    const clear_detail = function () {
        return {
            id: null,
            location_long: null,
            location_short: null,
            location_medium: null,
            location: null,
            city_id: null,
            province_id: null,
            country_id: null,
            location_types_id: null,
            created_by: null,
            modified_by: null,
            name: null,
            street: null,
            street2: null,
            zipcode: null,
            enabled: null,
            date_created: null,
            date_modified: null,
            note: null,
        }
    }
    
    const set_detail = function (location) {
        let details = clear_detail()
        
        if (location) {
            details.location_long = (location.location_long) ? location.location_long : null
            details.location_medium = (location.location_medium) ? location.location_medium : null
            details.location_short = (location.location_short) ? location.location_short : null
            details.location = (location.location) ? location.location : null
            details.id = (location.location_id) ? location.location_id : null
            details.city_id = (location.location_city_id) ? location.location_city_id : null
            details.province_id = (location.location_province_id) ? location.location_province_id : null
            details.country_id = (location.location_country_id) ? location.location_country_id : null
            details.location_types_id = (location.location_types_id) ? location.location_types_id : null
            details.created_by = (location.location_created_by) ? location.location_created_by : null
            details.modified_by = (location.location_modified_by) ? location.location_modified_by : null
            details.name = (location.location_name) ? location.location_name : null
            details.street = (location.location_street) ? location.location_street : null
            details.street2 = (location.location_street2) ? location.location_street2 : null
            details.zipcode = (location.location_zipcode) ? location.location_zipcode : null
            details.enabled = (location.location_enabled) ? location.location_enabled : null
            details.date_created = (location.location_date_created) ? location.location_date_created : null
            details.date_modified = (location.location_date_modified) ? location.location_date_modified : null
            details.note = (location.location_note) ? location.location_note : null
            Province.set_detail(location)
            Country.set_detail(location)
            City.set_detail(location)
        }
        
        Location.detail = details
    }
    
    //------------------------------------------------------------------
    
    const set = function (settings) {
        set_detail(settings)
        reset_form()
        populate_form(settings)
    }
    
    const save = function () {
        validated = true
        
        let dataToSend = {
            id: (!isNaN(parseInt(_location_id.value))) ? parseInt(_location_id.value) : null,
            city_id: (!isNaN(parseInt(_location_city_id.value))) ? parseInt(_location_city_id.value) : null,
            province_id: (!isNaN(parseInt(_location_province_id.value))) ? parseInt(_location_province_id.value) : null,
            country_id: (!isNaN(parseInt(_location_province_id.value))) ? parseInt(_location_country_id.value) : null,
            location_types_id: (!isNaN(parseInt(_location_types_id.value))) ? parseInt(_location_types_id.value) : null,
            
            name: (_location_name && _location_name.value !== "") ? _location_name.value : null,
            street: (_location_street && _location_street.value !== "") ? _location_street.value : null,
            street2: (_location_street2 && _location_street2.value !== "") ? _location_street2.value : null,
            zipcode: (_location_zipcode && _location_zipcode.value !== "") ? _location_zipcode.value : null,
            
            created_by: (isNaN(parseInt(_location_id.value))) ? user_id : null,
            modified_by: user_id,
            enabled: 1,
            date_created: (!isNaN(parseInt(_location_id.value))) ? null : formatDateMySQL(),
            date_modified: (!isNaN(parseInt(_location_id.value))) ? formatDateMySQL() : null,
            note: null,
        }
        
        if (validate_form()) {
            let r = confirm("Are you sure you want to edit this record?")
            if (r === true) {
                update_location_record(remove_nulls(dataToSend))
            }
        }
        
    }
    
    //------------------------------------------------------------------
    
    const init = function (settings) {
        validator_init(form_rules)
        validator = $(_form_edit_location).validate()
        
        if (settings) {
            if (settings.types.location_types) {
                Location.types = buildMap(settings.types.location_types, "location_types_id")
            }
            
        }
        
        if (_form_edit_location) {
            
            $(_location_types_id).BuildDropDown({
                data: Array.from(Location.types.values()),
                title: "Location Types",
                id_field: "location_types_id",
                text_field: "location_types_name",
                first_selectable: false,
            })
            
            $(_location_country_id).BuildDropDown({
                data: Array.from(Country.all.values()),
                title: "Country",
                id_field: "country_id",
                text_field: "country_name",
                first_selectable: false,
            })
            
            $(_location_province_id).BuildDropDown({
                data: Array.from(Province.all.values()),
                title: "Province",
                id_field: "province_id",
                text_field: "province_name",
                first_selectable: false,
            })
            
            $(_location_city_id).BuildDropDown({
                data: Array.from(Province.all.values()),
                title: "City",
                id_field: "city_id",
                text_field: "city_name",
                first_selectable: false,
            })
            
            Country.init({
                dropdowns: [
                    "location_country_id",
                ],
            })
            Province.init({
                dropdowns: [
                    "location_province_id",
                ],
            })
            City.init({
                dropdowns: [
                    "location_city_id",
                ],
            })
            
        }
        
        init_autocomplete()
        hide_form()
        
    }
    
    //------------------------------------------------------------------
    
    return {
        detail: {
            id: null,
            city_id: null,
            province_id: null,
            country_id: null,
            location_types_id: null,
            created_by: null,
            modified_by: null,
            name: null,
            street: null,
            street2: null,
            zipcode: null,
            enabled: null,
            date_created: null,
            date_modified: null,
            note: null,
        },
        all: [],
        types: [],
        types_detail: {
            id: null,
            created_by: null,
            modified_by: null,
            name: null,
            icon: null,
            enabled: null,
            date_created: null,
            date_modified: null,
            note: null,
        },
        save: function () {
            save()
        },
        set: function (settings) {
            set(settings)
        },
        set_detail (location) {
            set_detail(location)
        },
        init: function (settings) {
            init(settings)
        },
    }
    
})()
