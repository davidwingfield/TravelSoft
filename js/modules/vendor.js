const Vendor = (function () {
    "use strict"
    const base_url = "/vendors"
    //
    const _provider_vendor_edit_form = document.getElementById("provider_vendor_edit_form")
    const _vendor_id = document.getElementById("vendor_id")
    const _vendor_enabled = document.getElementById("vendor_enabled")
    const _show_online = document.getElementById("show_online")
    const _show_sales = document.getElementById("show_sales")
    const _show_ops = document.getElementById("show_ops")
    const _vendor_sku = document.getElementById("vendor_sku")
    const _button_submit_form_edit_vendor = document.getElementById("button_submit_form_edit_vendor")
    const _table_vendor_index = document.getElementById("table_vendor_index")
    let $index_table = $(_table_vendor_index)
    
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    
    //------------------------------------------------------------------
    
    const provider_vendor_form_rules = {
        rules: {
            vendor_sku: {
                required: true,
            },
        },
        messages: {
            vendor_sku: {
                required: "Field Required",
            },
        },
    }
    
    const form_rules = {
        rules: {
            vendor_sku: {
                required: true,
            },
        },
        messages: {
            vendor_sku: {
                required: "Field Required",
            },
        },
    }
    
    //------------------------------------------------------------------
    
    $(_button_submit_form_edit_vendor)
      .on("click", function () {
          Vendor.save()
      })
    
    const clear_detail = function () {
        return {
            id: null,
            company_id: null,
            status_id: 9,
            sku: null,
            show_online: null,
            show_sales: null,
            show_ops: null,
            is_provider: null,
            phone_1: null,
            phone_2: null,
            fax: null,
            website: null,
            email: null,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
            enabled: 1,
            created_by: user_id,
            note: null,
            modified_by: user_id,
        }
    }
    
    const set_detail = function (vendor) {
        let details = clear_detail()
        if (vendor) {
            details.id = (vendor.vendor_id) ? vendor.vendor_id : null
            details.company_id = (vendor.vendor_company_id) ? vendor.vendor_company_id : null
            details.status_id = (vendor.vendor_status_id) ? vendor.vendor_status_id : 9
            details.sku = (vendor.vendor_sku) ? vendor.vendor_sku : null
            details.show_online = (vendor.vendor_show_online) ? (vendor.vendor_show_online === 1) ? 1 : 0 : null
            details.show_sales = (vendor.vendor_show_sales) ? (vendor.vendor_show_sales === 1) ? 1 : 0 : null
            details.show_ops = (vendor.vendor_show_ops) ? (vendor.vendor_show_ops === 1) ? 1 : 0 : null
            details.is_provider = (vendor.vendor_is_provider) ? vendor.vendor_is_provider : null
            details.phone_1 = (vendor.vendor_phone_1) ? vendor.vendor_phone_1 : null
            details.phone_2 = (vendor.vendor_phone_2) ? vendor.vendor_phone_2 : null
            details.fax = (vendor.vendor_fax) ? vendor.vendor_fax : null
            details.website = (vendor.vendor_website) ? vendor.vendor_website : null
            details.email = (vendor.vendor_email) ? vendor.vendor_email : null
            details.date_created = (vendor.vendor_date_created) ? vendor.vendor_date_created : formatDateMySQL()
            details.created_by = (vendor.vendor_created_by) ? vendor.vendor_created_by : user_id
            details.date_modified = (vendor.vendor_date_modified) ? vendor.vendor_date_modified : formatDateMySQL()
            details.modified_by = (vendor.vendor_modified_by) ? vendor.vendor_modified_by : user_id
            details.enabled = (vendor.vendor_enabled) ? vendor.vendor_enabled : 1
            details.note = (vendor.vendor_note) ? vendor.vendor_note : null
        }
        
        Vendor.detail = details
    }
    
    //------------------------------------------------------------------
    
    const handle_vendor_error = function (msg) {
        toastr.error(msg)
        console.log(msg)
    }
    
    const update_vendor_record = function (dataToSend) {
        console.log("-- update_vendor_record(): dataToSend:", dataToSend)
        if (dataToSend) {
            try {
                sendPostRequest("/vendors/update", dataToSend, function (data, status, xhr) {
                    if (data) {
                        console.log("-- update_vendor_record(): data:", data)
                        load(data)
                        populate_provider_vendor_form()
                        clear_validation(_provider_vendor_edit_form)
                        toastr.success("Vendor: " + data.vendor_id + " updated")
                    }
                })
            } catch (e) {
                console.log(e)
                handle_vendor_error("Error: Validating Contact")
            }
        } else {
            console.log("Error: Missing Data")
            handle_vendor_error("Error: Missing Data")
        }
    }
    
    //------------------------------------------------------------------
    
    const validate_provider_vendor = function () {
        Vendor.validator = validator_init(provider_vendor_form_rules)
        return $(_provider_vendor_edit_form).valid()
    }
    
    const reset_form = function () {
    
    }
    
    const validate_form = function () {
        Vendor.validator = validator_init(form_rules)
        return $(_provider_vendor_edit_form).valid()
    }
    
    const clear_provider_vendor_form = function () {
        _vendor_id.value = ""
        _vendor_sku.value = ""
        _vendor_enabled.checked = true
        _show_online.checked = true
        _show_sales.checked = true
        _show_ops.checked = true
    }
    
    const populate_provider_vendor_form = function () {
        clear_provider_vendor_form()
        _vendor_id.value = Vendor.detail.id
        _vendor_sku.value = Vendor.detail.sku
        _vendor_enabled.checked = (Vendor.detail.enabled === 1)
        _show_online.checked = (Vendor.detail.show_online === 1)
        _show_sales.checked = (Vendor.detail.show_sales === 1)
        _show_ops.checked = (Vendor.detail.show_ops === 1)
    }
    
    const populate_form = function () {
    
    }
    
    //------------------------------------------------------------------
    
    const save_provider_vendor = function (provider_details) {
        console.log("-- save_provider_vendor(): provider_details:", provider_details)
        
        const _provider_vendor = document.getElementById("provider_vendor")
        const _company_id = document.getElementById("company_id")
        
        let dataToSend = {
            id: (!isNaN(parseInt(_vendor_id.value))) ? parseInt(_vendor_id.value) : null,
            company_id: (!isNaN(parseInt(_company_id.value))) ? parseInt(_company_id.value) : null,
            status_id: null,
            sku: (_vendor_sku) ? _vendor_sku.value : null,
            show_online: (_show_online) ? (_show_online.checked) ? 1 : 0 : 0,
            show_sales: (_show_sales) ? (_show_sales.checked) ? 1 : 0 : 0,
            show_ops: (_show_ops) ? (_show_ops.checked) ? 1 : 0 : 0,
            is_provider: (_provider_vendor) ? (_provider_vendor.checked) ? 1 : 0 : 0,
            date_created: (Vendor.detail.date_created) ? Vendor.detail.date_created : formatDateMySQL(),
            created_by: (Vendor.detail.created_by) ? Vendor.detail.created_by : user_id,
            date_modified: formatDateMySQL(),
            modified_by: user_id,
            enabled: (_vendor_enabled.checked) ? 1 : 0,
            note: (Vendor.detail.note) ? Vendor.detail.note : null,
        }
        /*
        console.log("-- dataToSend --")
        console.log(dataToSend)
        return
        //*/
        update_vendor_record(remove_nulls(dataToSend))
        
    }
    
    const save = function () {
        if (!validate_form()) {
            return
        }
        let contact_detail = Contact.all.get(parseInt(_modal_contact_id.value))
        if (!contact_detail) {
            contact_detail = {
                note: null,
                date_created: formatDateMySQL(),
                created_by: user_id,
            }
        } else {
            contact_detail.id = (!isNaN(parseInt(_modal_contact_id.value))) ? parseInt(_modal_contact_id.value) : null
        }
        contact_detail.modified_by = user_id
        if (document.getElementById("provider_id") && document.getElementById("provider_id").value !== "" && !isNaN(parseInt(document.getElementById("provider_id").value))) {
            contact_detail.provider_id = parseInt(document.getElementById("provider_id").value)
        }
        
        if (document.getElementById("vendor_id") && document.getElementById("vendor_id").value !== "" && !isNaN(parseInt(document.getElementById("vendor_id").value))) {
            contact_detail.vendor_id = parseInt(document.getElementById("vendor_id").value)
        }
        contact_detail.date_modified = formatDateMySQL()
        contact_detail.contact_types_id = getListOfIds($(_modal_contact_types_list).val().join(","))
        contact_detail.enabled = (_modal_contact_enabled.checked) ? 1 : 0
        contact_detail.name_first = (_modal_contact_name_first.value !== "") ? _modal_contact_name_first.value : null
        contact_detail.name_last = (_modal_contact_name_last.value !== "") ? _modal_contact_name_last.value : null
        contact_detail.phone = (_modal_contact_phone.value !== "") ? _modal_contact_phone.value : null
        contact_detail.email = (_modal_contact_email.value !== "") ? _modal_contact_email.value : null
        
        let r = confirm("Are you sure you want to edit this record?")
        if (r === true) {
            //update_contact_record(remove_nulls(contact_detail))
        }
        
    }
    
    const edit = function (vendor) {
    
    }
    
    const load = function (settings) {
        if (settings) {
            set_detail(settings)
        }
        /*
        console.log("-- Vendor.detail --")
        console.log(Vendor.detail)
        //*/
    }
    
    //------------------------------------------------------------------
    
    const init = function (settings) {
        
        load(settings)
        
    }
    
    //------------------------------------------------------------------
    
    const index = function (settings) {
        Vendor.all = new Map()
        
        if (settings) {
            if (settings.vendor_list) {
                $.each(settings.vendor_list, function (i, vendor) {
                    set_detail(vendor)
                    Vendor.all.set(Vendor.detail.id, Vendor.detail)
                    console.log(Vendor.detail)
                })
            }
        }
        
        if (_table_vendor_index) {
            
            $index_table = $(_table_vendor_index).table({
                table_type: "display_list",
                data: Array.from(Vendor.all.values()),
                columnDefs: [
                    {
                        title: "Id",
                        targets: 0,
                        data: "id",
                    },
                    {
                        title: "Name",
                        targets: 1,
                        data: "company_id",
                        render: function (data, type, row, meta) {
                            return data
                        },
                    },
                    {
                        title: "Is Provider",
                        targets: 2,
                        data: "is_provider",
                        render: function (data, type, row, meta) {
                            if (data && data === 1) {
                                return "<span class='text-success'>Yes</span>"
                            }
                            return "<span class='text-warning'>No</span>"
                        },
                    },
                ],
                rowClick: Vendor.navigate,
            })
        }
    }
    
    const init_provider_vendor = function (vendor) {
    
    }
    
    const navigate = function (vendor) {
        if (vendor) {
            console.log(vendor)
        }
        
    }
    
    return {
        detail: {
            id: null,
            company_id: null,
            status_id: null,
            sku: null,
            show_online: null,
            show_sales: null,
            show_ops: null,
            is_provider: null,
            phone_1: null,
            phone_2: null,
            fax: null,
            website: null,
            email: null,
            date_created: formatDateMySQL(),
            created_by: user_id,
            date_modified: formatDateMySQL(),
            modified_by: user_id,
            enabled: 1,
            note: null,
        },
        all: new Map(),
        validator: null,
        save: function () {
            save()
        },
        save_provider_vendor: function (provider_details) {
            save_provider_vendor(provider_details)
        },
        edit: function (contact) {
            edit(contact)
        },
        load: function (contacts) {
            load(contacts)
        },
        init: function (settings) {
            init(settings)
        },
        init_provider_vendor: function (vendor) {
            init_provider_vendor(vendor)
        },
        populate_provider_vendor_form: function () {
            populate_provider_vendor_form()
        },
        validate_provider_vendor: function () {
            return validate_provider_vendor()
        },
        validate_form: function () {
            return validate_form()
        },
        clear_provider_vendor_form: function () {
            clear_provider_vendor_form()
        },
        navigate: function (vendor) {
            navigate(vendor)
        },
        index: function (settings) {
            index(settings)
        },
    }
    
})()
