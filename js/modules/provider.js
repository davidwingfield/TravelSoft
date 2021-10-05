const Provider = (function () {
    "use strict"
    ///////////////////////////////////////////////
    const base_url = "/providers"
    ///////////////////////////////////////////////
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    const _button_product_edit_save_provider = document.getElementById("button_product_edit_save_provider")
    const _provider_index = document.getElementById("provider_index")
    const _provider_edit = document.getElementById("provider_edit")
    const _provider_name = document.getElementById("provider_name")
    const _provider_id = document.getElementById("provider_id")
    const _provider_company_id = document.getElementById("provider_company_id")
    const _provider_enabled = document.getElementById("provider_enabled")
    const _table_provider_index = document.getElementById("table_provider_index")
    ///////////////////////////////////////////////
    let providerIndexPage, providerEditPage
    let globalSelectedProvider = false
    let $index_table = $(_table_provider_index)
    ///////////////////////////////////////////////
    $(_button_product_edit_save_provider)
      .on("click", function () {
          alert("Save Provider")
      })
    ///////////////////////////////////////////////
    const set_autocomplete = function () {
        
        $(_provider_name)
          .on("change", function () {
          
          })
          .autocomplete({
              serviceUrl: "/autocomplete/provider",
              minChars: 2,
              cache: false,
              dataType: "json",
              triggerSelectOnValidInput: false,
              paramName: "st",
              onSelect: function (suggestion) {
                  console.log("suggestion", suggestion.data)
                  globalSelectedProvider = true
                  _provider_company_id.value = suggestion.data.company_id
                  _provider_id.value = suggestion.data.provider_id
                  _provider_name.value = suggestion.data.company_name
              },
          })
    }
    
    const navigate = function (provider) {
        if (provider && provider.provider_id) {
            window.location.replace(base_url + "/" + provider.provider_id)
        }
    }
    
    const load_product_edit = function (settings) {
        if (settings) {
            let provider = {
                provider_id: (settings.provider_id),
                provider_company_id: (settings.provider_company_id),
                provider_location_id: (settings.provider_location_id),
                provider_code_direct_id: (settings.provider_code_direct_id),
                provider_provider_vender: (settings.provider_provider_vender),
                provider_enabled: (settings.provider_enabled),
                provider_note: (settings.provider_note),
                provider_created_by: (settings.provider_created_by) ? settings.provider_created_by : user_id,
                provider_modified_by: (settings.provider_modified_by) ? settings.provider_modified_by : user_id,
                provider_date_created: (settings.provider_date_created) ? settings.provider_date_created : formatDateMySQL(),
                provider_date_modified: (settings.provider_date_modified) ? settings.provider_date_modified : formatDateMySQL(),
                provider_addresses: [],
                provider_contacts: [],
            }
            set(provider)
        }
    }
    
    const set = function (provider) {
        let details = clear_detail()
        if (provider) {
            details = {
                id: validInt(provider.provider_id),
                company_id: validInt(provider.provider_company_id),
                location_id: validInt(provider.provider_location_id),
                code_direct_id: (provider.provider_code_direct_id) ? provider.provider_code_direct_id : null,
                provider_vendor: (provider.provider_provider_vendor) ? provider.provider_provider_vendor : 1,
                enabled: (provider.provider_enabled) ? provider.provider_enabled : null,
                note: (provider.provider_note) ? provider.provider_note : null,
                created_by: (provider.provider_created_by) ? parseInt(provider.provider_created_by) : user_id,
                modified_by: (provider.provider_modified_by) ? parseInt(provider.provider_modified_by) : user_id,
                date_created: (provider.provider_date_created) ? provider.provider_date_created : formatDateMySQL(),
                date_modified: (provider.provider_date_modified) ? provider.provider_date_modified : formatDateMySQL(),
                addresses: (provider.provider_addresses) ? provider.provider_addresses : [],
                contacts: (provider.provider_contacts) ? provider.provider_contacts : [],
            }
            Provider.detail = details
        }
    }
    
    const load_product_edit_form = function (settings) {
        console.log("load_product_edit_form", settings)
    }
    
    const clear_detail = function () {
        return {
            id: null,
            company_id: null,
            location_id: null,
            code_direct_id: null,
            provider_vendor: 1,
            enabled: 1,
            note: null,
            addresses: new Map(),
            contacts: new Map(),
            created_by: user_id,
            modified_by: user_id,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
        }
    }
    
    const build_index_table = function () {
        $index_table = $(_table_provider_index).table({
            table_type: "display_list",
            data: Provider.all,
            columnDefs: [
                {
                    title: "Id",
                    targets: 0,
                    data: "provider_id",
                },
                {
                    title: "Name",
                    targets: 1,
                    data: "company_name",
                    render: function (data, type, row, meta) {
                        let name = ""
                        if (data) {
                            name = data
                        } else {
                            return ""
                        }
                        
                        return type === "display" && data.length > tableCellMaxChars ?
                          "<span style='white-space: nowrap'>" + name.substr(0, (tableCellMaxChars - 3)) + "</span></span>" :
                          "<span style='white-space: nowrap'>" + name + "</span></span>"
                    },
                },
                {
                    title: "Location",
                    targets: 2,
                    data: "location",
                    render: function (data, type, row, meta) {
                        return data
                    },
                },
            ],
            rowClick: Provider.navigate,
        })
    }
    
    const set_defaults = function () {
        return {
            provider_list: [],
        }
    }
    
    const load_index_providers = function (providers) {
        Provider.all = new Map()
        console.log("populate_index_table", providers)
        $.each(providers, function (i, provider) {
            //console.log("provider", provider)
            let detail = {
                id: (provider.provider_id) ? provider.provider_id : null,
                company_id: (provider.provider_company_id) ? provider.provider_company_id : null,
                location_id: (provider.provider_id) ? provider.provider_id : null,
                code_direct_id: (provider.provider_id) ? provider.provider_id : null,
                provider_vendor: (provider.provider_id) ? provider.provider_id : null,
                enabled: (provider.provider_id) ? provider.provider_id : null,
                created_by: (provider.provider_id) ? provider.provider_id : null,
                date_created: (provider.provider_id) ? provider.provider_id : null,
                modified_by: (provider.provider_modified_by) ? provider.provider_id : null,
                date_modified: (provider.provider_date_modified) ? provider.provider_id : null,
                note: (provider.provider_note) ? provider.provider_id : null,
            }
            console.log("detail", detail)
            Provider.all.set(provider.provider_id, provider)
        })
        //console.log("Provider.all", Provider.all)
    }
    ///////////////////////////////////////////////
    const provider_index = function (settings) {
        console.log("provider_index", settings)
        if (!settings) {
            settings = set_defaults()
        }
        if (settings.provider_list) {
            load_index_providers(settings.provider_list)
        }
        
        console.log("Provider.all", Provider.all)
    }
    
    $.fn.providerEdit = function (settings) {
        const _provider_vender_details = document.getElementById("provider_vender_details")
        const _form_edit_provider = document.getElementById("form_edit_provider")
        const _provider_id = document.getElementById("provider_id")
        const _provider_code_direct_id = document.getElementById("provider_code_direct_id")
        const _provider_enabled = document.getElementById("provider_enabled")
        const _company_name = document.getElementById("company_name")
        const _company_id = document.getElementById("company_id")
        const _provider_location_id = document.getElementById("provider_location_id")
        const _button_submit_form_edit_provider = document.getElementById("button_submit_form_edit_provider")
        const _button_add_provider_address = document.getElementById("button_add_provider_address")
        const _button_add_provider_contact = document.getElementById("button_add_provider_contact")
        const _button_provider_add_contact = document.getElementById("button_provider_add_contact")
        const _button_provider_add_address = document.getElementById("button_provider_add_address")
        const _provider_vendor = document.getElementById("provider_vendor")
        const _temp_location_id = document.getElementById("temp_location_id")
        const $nav_tab_contacts = $("[aria-controls='panel_tab_contacts']")
        const $nav_tab_addresses = $("[aria-controls='panel_tab_addresses']")
        const $panel_tab_vendor_detail = $("[aria-controls='panel_tab_vendor_detail']")
        ////
        let form_rules = {
            rules: {
                provider_location_id: {
                    required: true,
                },
                provider_code_direct_id: {
                    required: true,
                },
            },
            messages: {
                provider_location_id: {
                    required: "Field Required",
                },
                provider_code_direct_id: {
                    required: "Field Required",
                },
            },
        }
        ////
        $(_button_submit_form_edit_provider)
          .on("click", function () {
              /*
              console.log("-- _button_submit_form_edit_provider: click() --")
              //*/
              
              Provider.save()
              
          })
        $(_button_provider_add_address)
          .on("click", function () {
              if (provider_id.value === "") {
                  return
              }
              Address.load_modal()
          })
        $(_button_add_provider_address)
          .on("click", function () {
              if (provider_id.value === "") {
                  return
              }
              Address.load_modal()
          })
        $(_button_provider_add_contact)
          .on("click", function () {
              if (_provider_id && _provider_id.value === "") {
                  return
              }
              
              Contact.edit()
          })
        $(_button_add_provider_contact)
          .on("click", function () {
              if (_provider_id && _provider_id.value === "") {
                  
                  return
              }
              
              Contact.edit()
          })
        $(_temp_location_id)
          .on("change", function () {
              _provider_location_id.value = _temp_location_id.value
          })
        $(_provider_vendor)
          .on("change", function () {
              if (_provider_vendor.checked === true) {
                  show_vendor_details_form()
              } else {
                  close_vendor_details_form()
              }
          })
        
        //------------------------------------------------------------------
        
        const close_vendor_details_form = function () {
            clear_vender_details()
            $(_provider_vender_details).hide()
            $panel_tab_vendor_detail.addClass("disabled")
        }
        
        const show_vendor_details_form = function () {
            clear_vender_details()
            $panel_tab_vendor_detail.removeClass("disabled")
            $(_provider_vender_details).show()
            
        }
        
        const clear_vender_details = function () {
            //_vendor_sku.value = ""
            //_vendor_id.value = ""
        }
        
        const handle_provider_error = function (msg) {
            toastr.error(msg)
        }
        
        const update_provider_record = function (dataToSend) {
            if (dataToSend) {
                /*
                console.log("provider:dataToSend", dataToSend)
                //*/
                try {
                    sendPostRequest("/providers/update", dataToSend, function (data, status, xhr) {
                        if (data) {
                            console.log("data", data)
                            if (_provider_id && _provider_id.value === "") {
                                history.replaceState({}, "", data.provider_detail.provider_id)
                            }
                            
                            if (_provider_vendor.checked) {
                                Vendor.save_provider_vendor(data.provider_detail)
                            }
                            
                            Provider.load(data)
                            
                        } else {
                            return handle_provider_error("Error: 1")
                        }
                    })
                } catch (e) {
                    console.log(e)
                    return handle_provider_error("Error: 2")
                }
            } else {
                return handle_provider_error("Error: 3")
            }
        }
        
        //------------------------------------------------------------------
        
        const validate_form = function () {
            Provider.validator = validator_init(form_rules)
            let tabs = $("#provider_edit_tabs>div.panel-heading.panel-heading-tab>ul.nav.nav-tabs>li.nav-item>a.nav-link")
            let panels = $("#provider_edit_tabs > div.panel-body > div.tab-content > div.tab-pane")
            let is_valid = $(_form_edit_provider).valid()
            
            if (!is_valid) {
                
                $.each(panels, function (index, item) {
                    
                    if ($(this).find(".invalid").length > 0) {
                        let nav_tab = $("body").find("[aria-controls='" + $(this).attr("id") + "']")
                        tabs.removeClass("active")
                        panels.removeClass("active")
                        $(this).addClass("active")
                        nav_tab.addClass("active")
                        return false
                    }
                })
                
            }
            
            return is_valid
        }
        
        const clear_form = function () {
            _provider_id.value = ""
            _provider_code_direct_id.value = ""
            _provider_enabled.value = ""
            _provider_enabled.checked = true
            _provider_location_id.value = ""
            $(_company_name).attr("readonly", false)
            
        }
        
        const load_form = function (settings) {
            _provider_id.value = Provider.detail.id
            _provider_vendor.checked = (Provider.detail.provider_vendor === 1)
            _provider_enabled.checked = (Provider.detail.enabled) ? (Provider.detail.enabled === 1) : false
            _provider_code_direct_id.value = Provider.detail.code_direct_id
            _company_id.value = Company.detail.id
            _company_name.value = Company.detail.name
            $(_provider_vendor).trigger("change")
        }
        
        //------------------------------------------------------------------
        
        const load = function (settings) {
            if (settings) {
                
                Vendor.clear_provider_vendor_form()
                
                if (settings.provider_detail) {
                    set(settings.provider_detail)
                    Vendor.init(settings.provider_detail)
                    Company.init(settings.provider_detail)
                    if (Provider.detail.contacts) {
                        Contact.load(Provider.detail.contacts)
                    }
                    if (Provider.detail.addresses) {
                        Address.load(Provider.detail.addresses)
                    }
                    Location.set(settings.provider_detail)
                    Vendor.populate_provider_vendor_form()
                } else {
                    _provider_vendor.checked = true
                    _provider_vendor.disabled = false
                    $(_provider_vender_details).show()
                    Company.init()
                    Vendor.init()
                    Vendor.clear_provider_vendor_form()
                }
                
                load_form()
                
            }
            
            $(".autocomplete-suggestions").hide()
        }
        
        const save = function () {
            
            let company_addresses = Array.from(Address.all.values())
            let company_contacts = Array.from(Contact.all.values())
            let company_data = Company.validate_form()
            let provider_data = Provider.validate_form()
            let vendor_data = Vendor.validate_form()
            
            $.each(company_addresses, function (i, address) {
                let address_id = address.id
                $.each(address.address_types_id, function (ind, address_type) {
                    console.log({
                        address_id: address_id,
                        address_types_id: address_type,
                    })
                })
            })
            
            $.each(company_contacts, function (i, contact) {
                let contact_id = contact.id
                $.each(contact.contact_types_id, function (ind, contact_type) {
                    console.log({
                        contact_id: contact_id,
                        contact_types_id: contact_type,
                    })
                })
            })
            
            let dataToSend = {
                id: (!isNaN(parseInt(_provider_id.value))) ? parseInt(_provider_id.value) : null,
                company_id: (!isNaN(parseInt(Company.detail.id))) ? parseInt(Company.detail.id) : null,
                location_id: (!isNaN(parseInt(Location.detail.id))) ? parseInt(Location.detail.id) : null,
                provider_vendor: (_provider_vendor.checked === true) ? 1 : 0,
                code_direct_id: (_provider_code_direct_id.value !== "") ? (_provider_code_direct_id.value) : null,
                enabled: (_provider_enabled.checked === true) ? 1 : 0,
                created_by: (isNaN(parseInt(_provider_id.value))) ? user_id : null,
                date_created: (isNaN(parseInt(_provider_id.value))) ? formatDateMySQL() : null,
                modified_by: user_id,
                date_modified: formatDateMySQL(),
                note: null,
                company_contacts: company_contacts,
                company_addresses: company_addresses,
            }
            if (!company_data) {
                console.log("provider: company_data", "Missing")
                return
            }
            
            if (!provider_data) {
                console.log("provider: provider_data", "Missing")
                return
            }
            if (_provider_vendor.checked === true) {
                if (!vendor_data) {
                    console.log("provider: vendor_data", "Missing")
                    return
                }
            }
            
            let r = confirm("Are you sure you want to edit this record?")
            if (r === true) {
                update_provider_record(remove_nulls(dataToSend))
            }
            
        }
        
        //------------------------------------------------------------------
        
        const init = function (settings) {
            
            if (_provider_vender_details) {
                $(_provider_vender_details).hide()
            }
            
            Contact.build_company_contact_table()
            Address.build_company_address_table()
            
            clear_form()
            set()
            
            if (settings.types) {
                
                if (settings.countries) {
                    Country.all = settings.countries
                }
                
                Address.init(settings)
                Location.init(settings)
                Contact.init(settings)
                
            }
            
            load(settings)
            
            Provider.validator = validator_init(form_rules)
            
            if (!settings.provider_detail) {
                $nav_tab_contacts.addClass("disabled")
                $nav_tab_addresses.addClass("disabled")
            } else {
                $nav_tab_contacts.removeClass("disabled")
                $nav_tab_addresses.removeClass("disabled")
            }
            
        }
        
        //------------------------------------------------------------------
        
        return {
            address_view: function (address) {
            },
            contact_view: function (contact) {
            },
            save: function () {
                save()
            },
            validate_form: function () {
                return validate_form()
            },
            set: function (provider) {
                set(provider)
            },
            load: function (settings) {
                load(settings)
            },
            init: function (settings) {
                init(settings)
            },
        }
        
        //------------------------------------------------------------------
        
    }
    
    const init = function () {
        Provider.all = new Map()
        if (_provider_name) {
            set_autocomplete()
        }
        if (_table_provider_index) {
            build_index_table()
        }
    }
    ///////////////////////////////////////////////
    return {
        validator: null,
        detail: {
            id: null,
            company_id: null,
            location_id: null,
            code_direct_id: null,
            provider_vender: 1,
            enabled: null,
            note: null,
            created_by: user_id,
            modified_by: user_id,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
            addresses: [],
            contacts: [],
        },
        all: [],
        index_table: null,
        save: function () {
            if (_provider_edit) {
                console.log("-- _provider_edit --")
                providerEditPage.save()
            }
        },
        load: function (settings) {
            providerEditPage.load(settings)
        },
        contact_view: function (contact) {
            providerEditPage.contact_view(contact)
        },
        address_view: function (address) {
            providerEditPage.address_view(address)
        },
        validate_form: function () {
            return providerEditPage.validate_form()
        },
        navigate: function (provider) {
            navigate(provider)
        },
        load_product_edit: function (settings) {
            load_product_edit(settings)
        },
        index: function (settings) {
            if (_provider_index) {
                provider_index(settings)
            }
        },
        edit: function (settings) {
            if (_provider_edit) {
                providerEditPage = $(_provider_edit).providerEdit()
                providerEditPage.init(settings)
            }
            
        },
        init: function () {
            init()
        },
    }
    
})()
///////////////////////////////////////////////
Provider.init()
