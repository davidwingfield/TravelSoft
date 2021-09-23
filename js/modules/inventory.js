const Inventory = (function () {
    "use strict"
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
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
        
    }
    
})()
