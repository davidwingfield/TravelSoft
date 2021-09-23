const Contact = (function () {
    "use strict"
    const base_url = "/contacts"
    const _form_contact_edit = document.getElementById("form_contact_edit")
    const _table_provider_contacts = document.getElementById("table_provider_contacts")
    const _table_company_contacts = document.getElementById("table_company_contacts")
    const _modalContact = document.getElementById("modalEditContactForm")
    const _button_add_provider_contact = document.getElementById("button_add_provider_contact")
    const _button_modal_cancel = document.getElementById("buttonCancelSaveContactModal")
    const _button_modal_save = document.getElementById("buttonSaveContactModal")
    const _modal_contact_name_first = document.getElementById("contact_name_first")
    const _modal_contact_phone = document.getElementById("contact_phone")
    const _modal_contact_email = document.getElementById("contact_email")
    const _modal_contact_name_last = document.getElementById("contact_name_last")
    const _modal_contact_enabled = document.getElementById("contact_enabled")
    const _modal_contact_id = document.getElementById("contact_id")
    const _modal_contact_types_list = document.getElementById("contact_types_list")
    
    let $contact_table, validator
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    
    //------------------------------------------------------------------
    
    const form_rules = {
        rules: {
            contact_types_list: {
                required: true,
            },
            contact_name_first: {
                required: true,
            },
            contact_name_last: {
                required: true,
            },
            contact_email: {
                email: true,
            },
        },
        messages: {
            contact_types_list: {
                required: "required",
            },
            contact_name_first: {
                required: "required",
            },
            contact_name_last: {
                required: "required",
            },
            contact_email: {
                email: "invalid",
            },
        },
    }
    
    //------------------------------------------------------------------
    
    $(_button_modal_save)
      .on("click", function () {
          save()
      })
    
    $(_button_modal_cancel)
      .on("click", function () {
          close_modal()
      })
    
    //------------------------------------------------------------------
    
    const clear_detail = function () {
        return {
            email: null,
            id: null,
            name_first: null,
            name_last: null,
            phone: null,
            contact_types_id: null,
            enabled: 1,
            created_by: user_id,
            modified_by: user_id,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
            note: null,
        }
    }
    
    const set_detail = function (contact) {
        
        let details = clear_detail()
        
        if (contact) {
            details = {
                email: (contact.email) ? contact.email : null,
                id: validInt(contact.id),
                name_first: (contact.name_first) ? contact.name_first : null,
                name_last: (contact.name_last) ? contact.name_last : null,
                phone: (contact.phone) ? contact.phone : null,
                contact_types_id: getListOfIds(contact.contact_types_id),
                enabled: (typeof contact.enabled !== "undefined") ? contact.enabled : 1,
                created_by: (contact.created_by) ? contact.created_by : user_id,
                modified_by: (contact.modified_by) ? contact.modified_by : user_id,
                date_created: (contact.date_created) ? contact.date_created : formatDateMySQL(),
                date_modified: (contact.date_modified) ? contact.date_modified : formatDateMySQL(),
                note: (contact.note) ? contact.note : null,
            }
        }
        
        Contact.detail = details
    }
    
    //------------------------------------------------------------------
    
    const handle_contact_error = function (msg) {
        toastr.error(msg)
        console.log(msg)
    }
    
    const update_contact_record = function (dataToSend) {
        if (dataToSend) {
            try {
                sendPostRequest("/contacts/update", dataToSend, function (data, status, xhr) {
                    if (data && data[0]) {
                        set_detail({
                            contact_types_id: data[0].contact_contact_types_id,
                            created_by: data[0].contact_created_by,
                            date_created: data[0].contact_date_created,
                            date_modified: data[0].contact_date_modified,
                            email: data[0].contact_email,
                            enabled: data[0].contact_enabled,
                            id: data[0].contact_id,
                            modified_by: data[0].contact_modified_by,
                            name_first: data[0].contact_name_first,
                            name_last: data[0].contact_name_last,
                            note: data[0].contact_note,
                            phone: data[0].contact_phone,
                        })
                        
                        if (dataToSend.id) {
                            update_row(dataToSend)
                        } else {
                            $contact_table.insertRow(Contact.detail)
                        }
                        
                        Contact.all.set(data[0].contact_id, Contact.detail)
                        toastr.success("Contact: " + data[0].contact_id + " updated")
                        close_modal()
                    }
                })
            } catch (e) {
                console.log(e)
                handle_contact_error("Error: Validating Contact")
            }
        } else {
            console.log("Error: Missing Data")
            handle_contact_error("Error: Missing Data")
        }
    }
    
    //------------------------------------------------------------------
    
    const build_provider_contact_table = function () {
        if (_table_provider_contacts) {
            
            $contact_table = $(_table_provider_contacts).table({
                table_type: "display_list",
                columnDefs: [
                    {
                        title: "First Name",
                        targets: 0,
                        data: "name_first",
                        render: function (data, type, row, meta) {
                            return data
                        },
                    },
                    {
                        title: "Last Name",
                        targets: 1,
                        data: "name_last",
                        render: function (data, type, row, meta) {
                            return data
                        },
                    },
                    {
                        title: "Types",
                        targets: 2,
                        data: "contact_types_id",
                        render: function (data, type, row, meta) {
                            let name = ""
                            let myArr
                            
                            if (typeof data === "string" || data instanceof String) {
                                myArr = data.split(",")
                            } else {
                                myArr = data
                            }
                            
                            $.each(myArr, function (i, contact_type_id) {
                                if (!isNaN(parseInt(contact_type_id))) {
                                    let contact_type = Contact.types.get(parseInt(contact_type_id))
                                    if (contact_type) {
                                        name += "<p class='m-0 mb-1' style='white-space: nowrap'>" + contact_type.contact_types_name.substr(0, (tableCellMaxChars - 3)) + "</p>"
                                    }
                                }
                            })
                            
                            return name
                        },
                    },
                ],
                rowClick: Contact.edit,
            })
            
        }
    }
    
    const build_company_contact_table = function () {
        if (_table_company_contacts) {
            
            $contact_table = $(_table_company_contacts).table({
                table_type: "display_list",
                columnDefs: [
                    {
                        title: "First Name",
                        targets: 0,
                        data: "name_first",
                        render: function (data, type, row, meta) {
                            return data
                        },
                    },
                    {
                        title: "Last Name",
                        targets: 1,
                        data: "name_last",
                        render: function (data, type, row, meta) {
                            return data
                        },
                    },
                    {
                        title: "Types",
                        targets: 2,
                        data: "contact_types_id",
                        render: function (data, type, row, meta) {
                            let name = ""
                            let myArr
                            
                            if (typeof data === "string" || data instanceof String) {
                                myArr = data.split(",")
                            } else {
                                myArr = data
                            }
                            
                            $.each(myArr, function (i, contact_type_id) {
                                if (!isNaN(parseInt(contact_type_id))) {
                                    let contact_type = Contact.types.get(parseInt(contact_type_id))
                                    if (contact_type) {
                                        name += "<p class='m-0 mb-1' style='white-space: nowrap'>" + contact_type.contact_types_name.substr(0, (tableCellMaxChars - 3)) + "</p>"
                                    }
                                }
                            })
                            
                            return name
                        },
                    },
                ],
                rowClick: Contact.edit,
            })
            
        }
    }
    
    const update_row = function (row_data) {
        $(_table_provider_contacts).DataTable().row("#table_provider_contacts_tr_" + row_data.id).data(row_data).draw(false)
    }
    
    //------------------------------------------------------------------
    
    const reset_form = function () {
        _modal_contact_name_first.value = ""
        _modal_contact_phone.value = ""
        _modal_contact_email.value = ""
        _modal_contact_name_last.value = ""
        _modal_contact_enabled.checked = true
        _modal_contact_id.value = ""
        $(_modal_contact_types_list).val([])
    }
    
    const validate_form = function () {
        validator_init(form_rules)
        validator = validator_init(form_rules)
        return $(_form_contact_edit).valid()
    }
    
    const populate_form = function () {
        _modal_contact_name_first.value = Contact.detail.name_first
        _modal_contact_phone.value = Contact.detail.phone
        _modal_contact_email.value = Contact.detail.email
        _modal_contact_name_last.value = Contact.detail.name_last
        _modal_contact_enabled.checked = (Contact.detail.enabled === 1)
        _modal_contact_id.value = Contact.detail.id
        $(_modal_contact_types_list).val(Contact.detail.contact_types_id)
    }
    
    //------------------------------------------------------------------
    
    const load_modal = function (contact) {
        if (_modalContact) {
            $(_modalContact).modal("show")
        }
    }
    
    const close_modal = function () {
        clear_detail()
        if (_modalContact) {
            $(_modalContact).modal("hide")
        }
        
    }
    
    //------------------------------------------------------------------
    
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
        if (document.getElementById("company_id") && document.getElementById("company_id").value !== "" && !isNaN(parseInt(document.getElementById("company_id").value))) {
            contact_detail.company_id = parseInt(document.getElementById("company_id").value)
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
            update_contact_record(remove_nulls(contact_detail))
        }
        
    }
    
    const edit = function (contact) {
        reset_form()
        set_detail(contact)
        populate_form(contact)
        load_modal(contact)
    }
    
    const load = function (contacts) {
        Contact.all = new Map()
        
        $.each(contacts, function (i, contact) {
            set_detail({
                contact_types_id: contact.contact_contact_types_id,
                created_by: contact.contact_created_by,
                date_created: contact.contact_date_created,
                date_modified: contact.contact_date_modified,
                email: contact.contact_email,
                enabled: contact.contact_enabled,
                id: contact.contact_id,
                modified_by: contact.contact_modified_by,
                name_first: contact.contact_name_first,
                name_last: contact.contact_name_last,
                note: contact.contact_note,
                phone: contact.contact_phone,
            })
            Contact.all.set(parseInt(Contact.detail.id), Contact.detail)
            $contact_table.insertRow(Contact.detail)
        })
        
    }
    
    //------------------------------------------------------------------
    
    const init = function (settings) {
        Contact.types = new Map()
        if (settings && settings.types && settings.types.contact_types) {
            Contact.types = buildMap(settings.types.contact_types, "contact_types_id")
        }
        
        $(_modal_contact_types_list).BuildDropDown({
            data: Array.from(Contact.types.values()),
            first_selectable: true,
            id_field: "contact_types_id",
            text_field: "contact_types_name",
            type: "multiple",
        })
    }
    
    //------------------------------------------------------------------
    
    return {
        detail: {
            email: null,
            id: null,
            name_first: null,
            name_last: null,
            phone: null,
            contact_types_id: null,
            enabled: null,
        },
        types: new Map(),
        types_detail: {
            id: null,
            name: null,
            date_created: null,
            created_by: null,
            date_modified: null,
            modified_by: null,
            enabled: null,
        },
        all: new Map(),
        save: function () {
            save()
        },
        build_provider_contact_table: function () {
            build_provider_contact_table()
        },
        build_company_contact_table: function () {
            build_company_contact_table()
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
        
    }
    
})()
