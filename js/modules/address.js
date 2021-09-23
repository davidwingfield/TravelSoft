const Address = (function () {
    "use strict"
    
    //------------------------------------------------------------------
    
    const _table_provider_addresses = document.getElementById("table_provider_addresses")
    const _table_company_addresses = document.getElementById("table_company_addresses")
    const _modal_address = document.getElementById("modal_address")
    const _modal_button_submit_edit_address = document.getElementById("modal_button_submit_edit_address")
    const _modal_button_cancel_edit_address = document.getElementById("modal_button_cancel_edit_address")
    const _address_types_list = document.getElementById("address_types_list")
    const _form_address_edit = document.getElementById("form_address_edit")
    const _address_id = document.getElementById("address_id")
    const _address_street = document.getElementById("address_street")
    const _address_street2 = document.getElementById("address_street2")
    const _address_street3 = document.getElementById("address_street3")
    const _address_city_id = document.getElementById("address_city_id")
    const _address_postal_code = document.getElementById("address_postal_code")
    const _address_province_id = document.getElementById("address_province_id")
    const _address_country_id = document.getElementById("address_country_id")
    const _address_enabled = document.getElementById("address_enabled")
    
    const form_rules = {
        rules: {
            address_types_list: "required",
            address_country_id: "required",
            address_province_id: "required",
            address_city_id: "required",
        },
        messages: {
            address_types_list: "Address type is required",
            address_country_id: "Country type is required",
            address_province_id: "Province is required",
            address_city_id: "City type is required",
        },
    }
    
    let validator
    
    //------------------------------------------------------------------
    
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    let $address_table
    
    //------------------------------------------------------------------
    
    $(_modal_button_submit_edit_address).on("click", function () {
        save()
    })
    
    $(_modal_button_cancel_edit_address)
      .on("click", function () {
          close_modal()
      })
    
    $(_modal_address).on("shown.bs.modal", function () {
        let dropdownParent = $(_modal_address)
        $(_address_country_id).select2({
            dropdownParent: dropdownParent,
        })
        $(_address_province_id).select2({
            dropdownParent: dropdownParent,
        })
        $(_address_city_id).select2({
            dropdownParent: dropdownParent,
        })
    })
    
    //-------------------------------------------------------------------
    
    const format_types = function (types_list) {
        let formatted_type_list = "<p>"
        let name = "<p>"
        let counter = 0
        if (typeof types_list === "string" || types_list instanceof String) {
            types_list = types_list.split(",")
        }
        
        $.each(types_list, function (i, id) {
            let type = Address.types.get(id)
            let br = ""
            if ((counter + 1) % 2 === 0) {
                br = "</br>"
            }
            let spacer = ""
            if (counter > 0) {
                spacer = ", "
            }
            if (type) {
                name += "<span class='m-1' style='white-space: nowrap'>" + type.address_types_name + spacer + "</span>" + br
                formatted_type_list += spacer + type.address_types_name + ""
            }
            
            counter++
            
        })
        formatted_type_list += "</p>"
        name += "</p>"
        
        return name
    }
    
    const format_address = function (address, format) {
        
        let postal = (address.postal_code) ? address.postal_code : ""
        let street_1 = (address.street_1) ? address.street_1 : ""
        let street_2 = (address.street_2) ? address.street_2 : ""
        let street_3 = (address.street_3) ? address.street_3 : ""
        let city_name = (address.city_name) ? address.city_name : ""
        let country_iso2 = (address.country_iso2) ? address.country_iso2 : ""
        let country_iso3 = (address.country_iso3) ? address.country_iso3 : ""
        let country_name = (address.country_name) ? address.country_name : ""
        let province_iso2 = (address.province_iso2) ? address.province_iso2 : ""
        let province_iso3 = (address.province_iso3) ? address.province_iso3 : ""
        let province_name = (address.province_name) ? address.province_name : ""
        
        let long_format = "<address class=\"mb-0\">"
        let medium_format = "<address class=\"mb-0\">"
        let short_format = "<address class=\"mb-0\">"
        
        let street = []
        
        if (street_1 !== "") {
            street.push(street_1)
        }
        if (street_2 !== "") {
            //street.push(street_2)
        }
        if (street_3 !== "") {
            //street.push(street_3)
        }
        
        long_format += street.join("</br>")
        medium_format += street.join("</br>")
        short_format += street.join("</br>")
        
        let line_2_short = []
        let line_2_medium = []
        let line_2_long = []
        
        if (city_name !== "") {
            line_2_medium.push("<span class=''>" + city_name.toUpperCase() + "</span>")
        }
        
        if (province_iso2 !== "") {
            line_2_medium.push("<span class=''>" + province_iso2.toUpperCase() + "</span>")
        }
        
        if (postal !== "") {
            line_2_medium.push("<span class=''>" + postal + "</span>")
        }
        
        let line_2 = line_2_medium.join(" ")
        medium_format += "</br>" + line_2
        if (country_name !== "") {
            long_format += "</br>" + country_name.toUpperCase()
            medium_format += "</br>" + country_name.toUpperCase()
            short_format += "</br>" + country_name.toUpperCase()
        }
        
        long_format += "</address>"
        medium_format += "</address>"
        short_format += "</address>"
        
        /*
        if (format) {
            if (format === 'short') {
                return short_format
            } else if (format === 'long') {
                return long_format
            }
        }
        //*/
        
        return medium_format
    }
    
    //------------------------------------------------------------------
    
    const build_provider_address_table = function () {
        if (_table_provider_addresses) {
            $address_table = $(_table_provider_addresses).table({
                table_type: "display_list",
                columnDefs: [
                    {
                        title: "Address",
                        targets: 0,
                        data: "street_1",
                        render: function (data, type, row, meta) {
                            return format_address(row)
                        },
                    },
                    {
                        title: "Types",
                        targets: 1,
                        data: "address_types_id",
                        render: function (data, type, row, meta) {
                            return format_types(data)
                        },
                    },
                ],
                rowClick: Address.edit,
            })
        }
    }
    
    const build_company_address_table = function () {
        if (_table_company_addresses) {
            $address_table = $(_table_company_addresses).table({
                table_type: "display_list",
                columnDefs: [
                    {
                        title: "Address",
                        targets: 0,
                        data: "street_1",
                        render: function (data, type, row, meta) {
                            return format_address(row)
                        },
                    },
                    {
                        title: "Types",
                        targets: 1,
                        data: "address_types_id",
                        render: function (data, type, row, meta) {
                            return format_types(data)
                        },
                    },
                ],
                rowClick: Address.edit,
            })
        }
    }
    
    const update_row = function (row_data) {
        //console.log("row_data", row_data)
        if (row_data.id) {
            let id = row_data.id
        }
        if (row_data.address_id) {
            let id = row_data.address_id
        }
        
        $(_table_company_addresses).DataTable().row("#table_company_addresses_tr_" + row_data.id).data(row_data).draw(false)
    }
    
    //------------------------------------------------------------------
    
    const handle_address_error = function (msg) {
        toastr.error(msg)
    }
    
    const update_address_record = function (dataToSend) {
        if (dataToSend) {
            try {
                sendPostRequest("/addresses/update", dataToSend, function (data, status, xhr) {
                    if (data && data[0]) {
                        let address = data[0]
                        
                        let detail = set_detail(data[0])
                        if (dataToSend.id) {
                            update_row(detail)
                        } else {
                            $address_table.insertRow(detail)
                        }
                        
                        Address.all.set(Address.detail.id, Address.detail)
                        toastr.success("Contact: " + address.address_id + " updated")
                        close_modal()
                    } else {
                        console.log("Error: 1")
                        return handle_address_error("Error: 1")
                    }
                })
            } catch (e) {
                console.log(e)
                return handle_address_error("Error: 2")
            }
        } else {
            console.log("Error: 3")
            return handle_address_error("Error: 3")
        }
    }
    
    const set_detail = function (address) {
        let details = clear_detail()
        
        if (address) {
            details = {
                formatted_types: format_types(getListOfIds(address.address_types_id)),
                formatted_address: format_address(address, "short"),
                city_id: validInt(address.address_city_id),
                country_id: validInt(address.address_country_id),
                id: validInt(address.address_id),
                postal_code: (address.address_postal_code) ? address.address_postal_code : null,
                province_id: validInt(address.address_province_id),
                street_1: (address.address_street_1) ? address.address_street_1 : null,
                street_2: (address.address_street_2) ? address.address_street_2 : null,
                street_3: (address.address_street_3) ? address.address_street_3 : null,
                address_types_id: (address.address_types_id) ? getListOfIds(address.address_types_id) : [],
                city_name: (address.city_name) ? address.city_name : null,
                country_iso2: (address.country_iso2) ? address.country_iso2 : null,
                country_iso3: (address.country_iso3) ? address.country_iso3 : null,
                country_name: (address.country_name) ? address.country_name : null,
                province_iso2: (address.province_iso2) ? address.province_iso2 : null,
                province_iso3: (address.province_iso3) ? address.province_iso3 : null,
                province_name: (address.province_name) ? address.province_name : null,
                enabled: (address.address_enabled) ? address.address_enabled : 1,
                created_by: (address.address_created_by) ? address.address_created_by : user_id,
                modified_by: (address.address_modified_by) ? address.address_modified_by : user_id,
                date_created: (address.address_date_created) ? address.address_date_created : formatDateMySQL(),
                date_modified: (address.address_date_modified) ? address.address_date_modified : formatDateMySQL(),
                note: (address.address_note) ? address.address_note : null,
            }
        }
        
        Address.detail = details
        return details
    }
    
    const clear_detail = function () {
        return {
            formatted_address: "",
            formatted_types: "",
            city_id: null,
            country_id: null,
            id: null,
            postal_code: null,
            province_id: null,
            street_1: null,
            street_2: null,
            street_3: null,
            address_types_id: [],
            city_name: null,
            country_iso2: null,
            country_iso3: null,
            country_name: null,
            provider_id: null,
            province_iso2: null,
            province_iso3: null,
            province_name: null,
            enabled: 1,
            note: null,
            created_by: user_id,
            modified_by: user_id,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
        }
    }
    
    //------------------------------------------------------------------
    
    const load = function (addresses) {
        Address.all = new Map()
        
        $.each(addresses, function (i, address) {
            let detail = set_detail(address)
            /*
            console.log("address", address)
            console.log("Address.detail")
            console.log("Address.detail", Address.detail)
            //*/
            Address.all.set(Address.detail.id, Address.detail)
            $address_table.insertRow(detail)
        })
        
        //console.log("address", Address.all)
    }
    
    const edit = function (address) {
        if (address) {
            //console.log("address", address)
            load_modal(address)
        }
    }
    
    const save = function () {
        if (!validate_form()) {
            return
        }
        let address_detail = Address.all.get(parseInt(_address_id.value))
        if (!address_detail) {
            address_detail = {
                note: null,
                date_created: formatDateMySQL(),
                created_by: user_id,
            }
        } else {
            address_detail.id = (!isNaN(parseInt(_address_id.value))) ? parseInt(_address_id.value) : null
        }
        address_detail.modified_by = user_id
        if (document.getElementById("company_id") && document.getElementById("company_id").value !== "" && !isNaN(parseInt(document.getElementById("company_id").value))) {
            address_detail.company_id = parseInt(document.getElementById("company_id").value)
        }
        address_detail.date_modified = formatDateMySQL()
        address_detail.address_types_id = getListOfIds($(_address_types_list).val().join(","))
        address_detail.enabled = (_address_enabled.checked) ? 1 : 0
        address_detail.street_1 = (_address_street.value !== "") ? _address_street.value : null
        address_detail.street_2 = (_address_street2.value !== "") ? _address_street2.value : null
        address_detail.street_3 = (_address_street3.value !== "") ? _address_street3.value : null
        address_detail.postal_code = (_address_postal_code.value !== "") ? _address_postal_code.value : null
        address_detail.city_id = validInt(_address_city_id.value)
        address_detail.province_id = validInt(_address_province_id.value)
        address_detail.country_id = validInt(_address_country_id.value)
        
        let r = confirm("Are you sure you want to edit this record?")
        if (r === true) {
            update_address_record(remove_nulls(address_detail))
        }
        
    }
    
    //------------------------------------------------------------------
    
    const load_modal = function (address) {
        reset_form()
        populate_form(address)
        if (_modal_address) {
            $(_modal_address).modal("show")
        }
        
    }
    
    const reset_form = function () {
        _address_id.value = ""
        $(_address_types_list).val([])
        _address_enabled.checked = true
        _address_street.value = ""
        _address_street2.value = ""
        _address_street3.value = ""
        _address_country_id.value = ""
        _address_province_id.value = ""
        _address_city_id.value = ""
        _address_postal_code.value = ""
    }
    
    const populate_form = function (detail) {
        /*
        console.log("detail", detail)
        console.log("Address.detail", Address.detail)
        //*/
        if (!detail) {
            Province.get(null, _address_province_id)
            Country.id = null
            City.id = null
        } else {
            _address_id.value = (detail.id) ? detail.id : null
            $(_address_types_list).val((detail.address_types_id) ? detail.address_types_id : [])
            _address_enabled.checked = (detail.enabled === 1)
            _address_street.value = (detail.street_1) ? detail.street_1 : null
            _address_street2.value = (detail.street_2) ? detail.street_2 : null
            _address_street3.value = (detail.street_3) ? detail.street_3 : null
            Province.id = (detail.province_id) ? detail.province_id : null
            Country.id = (detail.country_id) ? detail.country_id : null
            City.id = (detail.city_id) ? detail.city_id : null
            
            $(_address_country_id).val((Address.detail.country_id) ? Address.detail.country_id : "").trigger("change")
            
            _address_postal_code.value = (Address.detail.postal_code) ? Address.detail.postal_code : null
        }
        
    }
    
    const validate_form = function () {
        validator_init(form_rules)
        validator = $(_form_address_edit).validate()
        return $(_form_address_edit).valid()
    }
    
    const close_modal = function () {
        clear_detail()
        if (_modal_address) {
            $(_modal_address).modal("hide")
        }
        
    }
    
    //------------------------------------------------------------------
    
    const init = function (settings) {
        Address.types = new Map()
        if (settings && settings.types && settings.types.address_types) {
            Address.types = buildMap(settings.types.address_types, "address_types_id")
        }
        
        $(_address_types_list).BuildDropDown({
            data: Array.from(Address.types.values()),
            id_field: "address_types_id",
            text_field: "address_types_name",
            type: "multiple",
            first_selectable: true,
        })
        $(_address_country_id).BuildDropDown({
            data: Array.from(Country.all.values()),
            title: "Country",
            id_field: "country_id",
            text_field: "country_name",
            first_selectable: false,
        })
        $(_address_province_id).BuildDropDown({
            data: Array.from(Province.all.values()),
            title: "Province",
            id_field: "province_id",
            text_field: "province_name",
            first_selectable: false,
        })
        $(_address_city_id).BuildDropDown({
            data: Array.from(City.all.values()),
            title: "City",
            id_field: "city_id",
            text_field: "city_name",
            first_selectable: false,
        })
        
        Country.init({
            dropdowns: [
                "address_country_id",
            ],
        })
        Province.init({
            dropdowns: [
                "address_province_id",
            ],
        })
        City.init({
            dropdowns: [
                "address_city_id",
            ],
        })
        
    }
    
    //------------------------------------------------------------------
    
    return {
        detail: {
            formatted_types: "",
            formatted_address: "",
            city_id: null,
            country_id: null,
            id: null,
            postal_code: null,
            province_id: null,
            street_1: null,
            street_2: null,
            street_3: null,
            address_types_id: [],
            city_name: null,
            country_iso2: null,
            country_iso3: null,
            country_name: null,
            province_iso2: null,
            province_iso3: null,
            province_name: null,
            enabled: null,
            note: null,
            created_by: null,
            modified_by: null,
            date_created: null,
            date_modified: null,
            
        },
        types: new Map(),
        all: new Map(),
        load_modal: function (address) {
            load_modal(address)
        },
        format_address: function (address) {
            return format_address(address)
        },
        load: function (addresses) {
            load(addresses)
        },
        edit: function (address) {
            edit(address)
        },
        build_provider_address_table: function () {
            build_provider_address_table()
        },
        build_company_address_table: function () {
            build_company_address_table()
        },
        init: function (settings) {
            init(settings)
        },
    }
    
})()
