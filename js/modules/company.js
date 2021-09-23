const Company = (function () {
    "use strict"
    
    //-----------------------------------------------------------------
    let version = "1.0.0"
    let obj = "Company"
    
    const _button_save_company_name = document.getElementById("button_save_company_name")
    const _button_edit_company_name = document.getElementById("button_edit_company_name")
    const _button_cancel_company_name = document.getElementById("button_cancel_company_name")
    const _button_submit_form_edit_company = document.getElementById("button_submit_form_edit_company")
    const _company_email = document.getElementById("company_email")
    const _company_website = document.getElementById("company_website")
    const _company_fax = document.getElementById("company_fax")
    const _company_phone_2 = document.getElementById("company_phone_2")
    const _company_phone_1 = document.getElementById("company_phone_1")
    const _company_enabled = document.getElementById("company_enabled")
    const _company_name = document.getElementById("company_name")
    const _company_id = document.getElementById("company_id")
    const _form_edit_company = document.getElementById("form_edit_company")
    
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    let temp_company_name = ""
    let temp_company_id = ""
    let validated = false
    let globalSelectedCompany = false
    let suggestionsTempCompany = []
    let phoneIT = false
    let phoneUS = false
    let form_rules = {
        rules: {
            
            company_phone_1: {
                phoneUS: phoneUS,
                phoneIT: phoneIT,
            },
            company_name: {
                required: true,
            },
            company_phone_2: {
                phoneUS: phoneUS,
                phoneIT: phoneIT,
            },
            company_fax: {
                phoneUS: phoneUS,
                phoneIT: phoneIT,
            },
            company_email: {
                email: true,
            },
            company_website: {
                url: true,
            },
        },
        messages: {
            
            company_name: {
                required: "Field Required",
            },
            company_phone_1: {
                phoneUS: "Field Invalid",
                phoneIT: "Field Invalid",
            },
            company_phone_2: {
                phoneUS: "Field Invalid",
                phoneIT: "Field Invalid",
            },
            company_fax: {
                phoneUS: phoneUS,
                phoneIT: phoneIT,
            },
            company_email: {
                email: "Field Invalid",
            },
            company_website: {
                url: "Field Invalid",
            },
        },
    }
    
    //------------------------------------------------------------------
    
    //------------------------------------------------------------------
    
    $(_company_id)
      .on("change", function () {
      
      })
    $(_company_name)
      .on("click", function () {
          $(this).select()
      })
      .on("keyup", function () {
          globalSelectedCompany = false
          if (validate_name_form()) {
              reset_name_edit()
          }
      })
      .on("change", function () {
          setTimeout(function () {
              let company_name = _company_name.value
              if (globalSelectedCompany === false) {
                  if (company_name === "") {
                      _company_name.value = ""
                      _company_id.value = ""
                      globalSelectedCompany = false
                  } else {
                      Company.company_exists(company_name, function (data) {
                          console.log("data", data)
                          if (data) {
                              _company_name.value = data.company_name
                              _company_id.value = data.company_id
                              globalSelectedCompany = true
                          } else {
                              globalSelectedCompany = false
                              add_to_company_list(_company_name)
                          }
                      })
                  }
              }
              
          }, 250)
      })
      .autocomplete({
          serviceUrl: "/autocomplete/companies",
          minChars: 2,
          cache: false,
          dataType: "json",
          triggerSelectOnValidInput: false,
          paramName: "st",
          onSelect: function (suggestion) {
              globalSelectedCompany = true
              Company.set_detail(suggestion.data)
              _company_id.value = Company.detail.id
              _company_name.value = Company.detail.name
          },
      })
    
    $(_button_save_company_name)
      .on("click", function () {
          save()
      })
    
    $(_button_cancel_company_name)
      .on("click", function () {
          _company_name.value = temp_company_name
          _company_id.value = temp_company_id
          temp_company_name = ""
          temp_company_id = ""
          unload_name_edit()
      })
    
    $(_button_edit_company_name)
      .on("click", function () {
          temp_company_name = _company_name.value
          temp_company_id = _company_id.value
          load_name_edit()
      })
    
    $(_button_submit_form_edit_company)
      .on("click", function () {
          save()
          
      })
    
    //------------------------------------------------------------------
    
    const clear_form = function () {
        console.log("-- clear_form() --")
        _company_email.value = ""
        _company_website.value = ""
        _company_fax.value = ""
        _company_phone_2.value = ""
        _company_phone_1.value = ""
        _company_enabled.checked = true
    }
    
    const load_form = function () {
        console.log("-- load_form() --")
        clear_form()
        _company_id.value = Company.detail.id
        _company_email.value = Company.detail.email
        _company_website.value = Company.detail.website
        _company_fax.value = Company.detail.fax
        _company_phone_2.value = Company.detail.phone_2
        _company_phone_1.value = Company.detail.phone_1
        _company_enabled.checked = (!(Company.detail.enabled && Company.detail.enabled === 0))
    }
    
    const disable_form = function () {
        if (_form_edit_company) {
            unload_name_edit()
            _company_name.disabled = true
            $(_company_name).attr("readonly", true)
            _company_enabled.disabled = true
            _company_phone_1.disabled = true
            _company_phone_2.disabled = true
            _company_fax.disabled = true
            _company_email.disabled = true
            _company_website.disabled = true
            _button_submit_form_edit_company.disabled = true
        }
    }
    
    const enable_form = function () {
        if (_form_edit_company) {
            _company_name.disabled = false
            _company_enabled.disabled = false
            _company_phone_1.disabled = false
            _company_phone_2.disabled = false
            _company_fax.disabled = false
            _company_email.disabled = false
            _company_website.disabled = false
            _button_submit_form_edit_company.disabled = false
            $(_company_name).attr("readonly", false)
        }
    }
    
    const on_click_outside = (e) => {
        let tar = $(e.target).parents("div.edit_company_name")
        let auto = $("div.autocomplete-suggestion")
        if (!tar[0] && !auto) {
            _company_name.value = temp_company_name
            _company_id.value = temp_company_id
            temp_company_name = ""
            temp_company_id = ""
            unload_name_edit()
        }
    }
    
    const add_to_company_list = function (obj) {
        if (globalSelectedCompany === false) {
            if ((obj.value.length > 0 && suggestionsTempCompany.length === 0 && globalSelectedCompany === false) ||
              (obj.value.length > 0 && suggestionsTempCompany.length > 0 && !globalSelectedCompany)
            ) {
                if (confirm(obj.value + " is not on the list. Would you like to add it to the list?.")) {
                    let params = {
                        "name": obj.value,
                    }
                    try {
                        sendPostRequest("/companies/update", params, function (data, status, xhr) {
                            console.log(data)
                            if (data) {
                                _company_id.value = data[0].company_id
                                _company_name.value = data[0].company_name
                                set_detail(data[0])
                                Company.load_name_edit()
                                Company.unload_name_edit()
                                toastr.success("Record Added.")
                            } else {
                                _company_name.value = ""
                                _company_id.value = ""
                                toastr.error("Unable to add record.")
                            }
                        })
                    } catch (e) {
                        toastr.error("Unable to add record.")
                        console.log(e)
                    }
                    
                } else {
                    obj.value = ""
                    if (_company_id) {
                        _company_id.value = ""
                    }
                    suggestionsTempCompany = []
                }
            }
        }
    }
    
    const company_exists = function (name, callback) {
        console.log("globalSelectedCompany", globalSelectedCompany)
        if (globalSelectedCompany === true) {
            return
        }
        
        if (name && name !== "") {
            
            try {
                let url = "/autocomplete/validate/company"
                let dataToSend = {
                    name: name,
                }
                
                sendGetRequest(url, dataToSend, function (data, status, xhr) {
                    console.dir("data", data)
                    if (data && data[0]) {
                        globalSelectedCompany = true
                        return callback(data[0])
                    } else {
                        return callback()
                    }
                })
                
            } catch (e) {
                console.log(e)
                return handle_company_error("Error Validating Company")
            }
        } else {
            //console.log("Missing: Company Name")
            //return handle_company_error("Missing: Company Name")
        }
    }
    
    const handle_company_error = function (msg) {
        toastr.error(msg)
        console.log(msg)
    }
    
    const update_company_record = function (dataToSend, callback) {
        if (dataToSend) {
            try {
                sendPostRequest("/companies/update", dataToSend, function (data, status, xhr) {
                    console.log("update_company_record(): data", data)
                    if (data && data[0]) {
                        unload_name_edit()
                        toastr.success("Company: " + data[0].company_id + " updated")
                    } else {
                        return handle_company_error("Error: 1")
                    }
                })
            } catch (e) {
                console.log(e)
                handle_company_error("Error: Validating Company")
            }
        } else {
            console.log("Error: Missing Data")
            handle_company_error("Error: Missing Data")
        }
    }
    
    const validate_name_form = function () {
        return (_company_name.value !== "" && !isNaN(parseInt(_company_id.value)))
    }
    
    const validate_form = function () {
        Company.validator = validator_init(form_rules)
        let is_valid = $(_form_edit_company).valid()
        
        //console.log("Submit Errors", Company.validator)
        
        if (!is_valid) {
            console.log(get_errors(Company.validator))
        }
        
        return is_valid
    }
    
    //------------------------------------------------------------------
    
    const reset_name_edit = function () {
        $(_company_name).removeClass("is-invalid")
        $("#company_name-error").html("")
    }
    
    const load_name_edit = function () {
        reset_name_edit()
        $(_button_save_company_name).show()
        $(_button_cancel_company_name).show()
        $(_button_edit_company_name).hide()
        $(_company_name).attr("readonly", false)
        _company_name.disabled = false
        $(_company_name).select()
        window.addEventListener("click", on_click_outside)
    }
    
    const unload_name_edit = function () {
        reset_name_edit()
        $(_button_save_company_name).hide()
        $(_button_cancel_company_name).hide()
        $(_button_edit_company_name).show()
        $(_company_name).attr("readonly", true)
        _company_name.disabled = true
        //$(_button_edit_company_name).focus()
        window.removeEventListener("click", on_click_outside)
    }
    
    //
    //------------------------------------------------------------------
    
    const clear_detail = function () {
        return {
            id: null,
            name: null,
            phone_1: null,
            phone_2: null,
            fax: null,
            website: null,
            email: null,
            enabled: 1,
            created_by: user_id,
            date_created: formatDateMySQL(),
            modified_by: user_id,
            date_modified: formatDateMySQL(),
            status: 6,
            note: null,
        }
    }
    
    const set_detail = function (company) {
        let details = clear_detail()
        if (company) {
            details = {
                
                id: validInt(company.company_id),
                name: (company.company_name) ? company.company_name : "",
                phone_1: (company.company_phone_1) ? company.company_phone_1 : "",
                phone_2: (company.company_phone_2) ? company.company_phone_2 : "",
                fax: (company.company_fax) ? company.company_fax : "",
                website: (company.company_website) ? company.company_website : "",
                email: (company.company_email) ? company.company_email : "",
                enabled: (company.company_enabled) ? company.company_enabled : 0,
                created_by: user_id,
                date_created: (company.company_date_created) ? company.company_date_created : formatDateMySQL(),
                modified_by: user_id,
                date_modified: (company.company_date_modified) ? company.company_date_modified : formatDateMySQL(),
                status: (company.company_status) ? company.company_status : 6,
                note: null,
            }
        }
        
        Company.detail = details
        
    }
    
    //------------------------------------------------------------------
    
    const save = function () {
        validated = true
        
        let dataToSend = {
            id: (!isNaN(parseInt(_company_id.value))) ? parseInt(_company_id.value) : null,
            name: (_company_name.value !== "") ? (_company_name.value) : null,
            phone_1: (_company_phone_1.value !== "") ? (_company_phone_1.value) : null,
            phone_2: (_company_phone_2.value !== "") ? (_company_phone_2.value) : null,
            fax: (_company_fax.value !== "") ? (_company_fax.value) : null,
            email: (_company_email.value !== "") ? (_company_email.value) : null,
            website: (_company_website.value !== "") ? (_company_website.value) : null,
            created_by: (isNaN(parseInt(_company_id.value))) ? user_id : null,
            modified_by: user_id,
            enabled: 1,
            date_created: (isNaN(parseInt(_company_id.value))) ? formatDateMySQL() : null,
            date_modified: formatDateMySQL(),
            note: null,
        }
        
        if (validate_name_form()) {
            reset_name_edit()
            let r = confirm("Are you sure you want to edit this record?")
            if (r === true) {
                update_company_record(remove_nulls(dataToSend))
            }
        } else {
            $(_company_name).addClass("is-invalid")
            $("#company_name-error").html("<span id=\"location_name-error\" class=\"error\">ssfield required</span>")
        }
    }
    
    //------------------------------------------------------------------
    
    const init = function (settings) {
        set_detail(settings)
        load_form()
        load_name_edit()
        if (settings) {
            unload_name_edit()
        } else {
            $(_button_save_company_name).hide()
            $(_button_cancel_company_name).hide()
        }
        
    }
    
    //------------------------------------------------------------------
    
    return {
        validator: null,
        detail: {
            id: null,
            created_by: null,
            modified_by: null,
            name: null,
            contact_name: null,
            contact_phone: null,
            users_id: null,
            status: null,
            enabled: null,
            date_created: null,
            date_modified: null,
            note: null,
        },
        
        all: new Map(),
        save: function () {
            save()
        },
        set_detail: function (company) {
            set_detail(company)
        },
        unload_name_edit: function () {
            unload_name_edit()
        },
        load_name_edit: function () {
            load_name_edit()
        },
        company_exists: function (name, callback) {
            company_exists(name, callback)
        },
        disable_form: function () {
            disable_form()
        },
        validate_form: function () {
            return validate_form()
        },
        enable_form: function () {
            enable_form()
        },
        init: function (settings) {
            //console.log("-- Company.init() --")
            Company.validator = validator_init(form_rules)
            init(settings)
        },
    }
    
})()
