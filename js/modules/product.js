const Product = (function ($) {
    "use strict"
    ///////////////////////////////////////////////
    const _category_id = document.getElementById("category_id")
    const _product_id = document.getElementById("product_id")
    const _product_name = document.getElementById("product_name")
    const _product_sku = document.getElementById("product_sku")
    const _product_rating_id = document.getElementById("product_rating_id")
    const _pricing_strategy_id = document.getElementById("pricing_strategy_id")
    const _currency_id = document.getElementById("currency_id")
    const _product_description_short = document.getElementById("product_description_short")
    const _product_description_long = document.getElementById("product_description_long")
    const _view_all = document.getElementById("view_all")
    const _view_sales = document.getElementById("view_sales")
    const _view_ops = document.getElementById("view_ops")
    const _view_management = document.getElementById("view_management")
    const _table_product_index = document.getElementById("table_product_index")
    const _product_edit_form = document.getElementById("product_edit_form")
    const _product_edit = document.getElementById("product_edit")
    const _product_unit_edit_form = document.getElementById("product_unit_edit_form")
    const _product_vendor_edit_form = document.getElementById("product_vendor_edit_form")
    const _product_type_sort = document.getElementById("product_type_sort")
    const _button_product_edit_save_detail = document.getElementById("button_product_edit_save_detail")
    const _product_enabled = document.getElementById("product_enabled")
    
    ///////////////////////////////////////////////
    const _tab_product_edit_meta = document.getElementById("tab_product_edit_meta")
    const _tab_product_edit_season = document.getElementById("tab_product_edit_season")
    const _tab_product_edit_unit = document.getElementById("tab_product_edit_unit")
    const _tab_product_edit_variant = document.getElementById("tab_product_edit_variant")
    const _tab_product_edit_inventory = document.getElementById("tab_product_edit_inventory")
    const _tab_product_edit_pricing = document.getElementById("tab_product_edit_pricing")
    ///////////////////////////////////////////////
    let is_new = true
    let $index_table = $(_table_product_index)
    let user_id = (document.getElementById("user_id")) ? (!isNaN(parseInt(document.getElementById("user_id").value))) ? parseInt(document.getElementById("user_id").value) : 4 : 4
    ///////////////////////////////////////////////
    $(_button_product_edit_save_detail)
      .on("click", function () {
          alert("Product Save")
      })
    $(_product_type_sort)
      .on("change", function () {
          alert("Product Filter by Category")
      })
    $(_view_all)
      .on("change", function () {
          set_all_viewable_options(this.checked)
      })
    $(_view_management)
      .on("change", function () {
          if (this.checked === true) {
              if (_view_ops.checked === true && _view_sales.checked === true) {
                  _view_all.checked = true
              }
          } else if (this.checked === false) {
              if (_view_ops.checked === false && _view_sales.checked === false) {
                  _view_all.checked = false
              }
          } else {
              _view_all.checked = false
          }
      })
    $(_view_ops)
      .on("change", function () {
          if (this.checked === true) {
              if (_view_management.checked === true && _view_sales.checked === true) {
                  _view_all.checked = true
              }
          } else if (this.checked === false) {
              if (_view_management.checked === false && _view_sales.checked === false) {
                  _view_all.checked = false
              }
          } else {
              _view_all.checked = false
          }
      })
    $(_view_sales)
      .on("change", function () {
          if (this.checked === true) {
              if (_view_management.checked === true && _view_ops.checked === true) {
                  _view_all.checked = true
              }
          } else if (this.checked === false) {
              if (_view_management.checked === false && _view_ops.checked === false) {
                  _view_all.checked = false
              }
          } else {
              _view_all.checked = false
          }
      })
    ///////////////////////////////////////////////
    const set_all_viewable_options = function (option) {
        _view_sales.checked = option
        _view_ops.checked = option
        _view_management.checked = option
    }
    const validate_form = function () {
        Provider.validator = validator_init(form_rules)
        let tabs = $("#provider_edit_tabs>div.panel-heading.panel-heading-tab>ul.nav.nav-tabs>li.nav-item>a.nav-link")
        let panels = $("#provider_edit_tabs > div.panel-body > div.tab-content > div.tab-pane")
        let is_valid = $(_form_edit_product).valid()
        
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
    const validate = function () {
        if (_product_id) {
            if (_product_id.value === "") {
                $(_tab_product_edit_season).addClass("disabled")
                $(_tab_product_edit_unit).addClass("disabled")
                $(_tab_product_edit_variant).addClass("disabled")
                $(_tab_product_edit_inventory).addClass("disabled")
                $(_tab_product_edit_pricing).addClass("disabled")
                $(_tab_product_edit_meta).addClass("disabled")
            } else {
                $(_tab_product_edit_season).removeClass("disabled")
                $(_tab_product_edit_unit).removeClass("disabled")
                $(_tab_product_edit_variant).removeClass("disabled")
            }
        }
        
    }
    
    const trim_obj_name = function (obj) {
        let temp = {}
        if (obj) {
            $.each(obj, function (ind, val) {
                let str = ind.replace("product_product_", "")
                str = str.replace("product_", "")
                temp[str] = val
            })
        }
        
        return temp
    }
    
    const populate_form = function () {
        clear()
        $(_category_id).val(Product.detail.category_id).trigger("change")
        $(_product_id).val(Product.detail.id).trigger("change")
        _product_name.value = Product.detail.name
        _product_enabled.checked = (Product.detail.enabled === 1)
        $(_product_sku).val(Product.detail.sku).trigger("change")
        $(_product_rating_id).val(Product.detail.rating).trigger("change")
        $(_pricing_strategy_id).val(Product.detail.pricing_strategy_types_id).trigger("change")
        $(_currency_id).val(Product.detail.currency_id).trigger("change")
        $(_product_description_short).val(Product.detail.description_short).trigger("change")
        $(_product_description_long).val(Product.detail.description_long).trigger("change")
        _view_all.checked = (Product.detail.view_all === 1)
        _view_sales.checked = (Product.detail.view_sales === 1)
        _view_ops.checked = (Product.detail.view_ops === 1)
        _view_management.checked = (Product.detail.view_management === 1)
    }
    
    const clear = function () {
        _category_id.value = ""
        _product_id.value = ""
        _product_name.value = ""
        _product_sku.value = ""
        _product_rating_id.value = ""
        _pricing_strategy_id.value = ""
        _currency_id.value = ""
        _product_description_short.value = ""
        _product_description_long.value = ""
        _view_all.checked = true
        _view_sales.checked = true
        _view_ops.checked = true
        _view_management.checked = true
    }
    
    const set = function (product) {
        if (!product) {
            product = {}
        }
        product = trim_obj_name(product)
        
        Product.detail = {
            api_id: (product.api_id) ? product.api_id : null,
            arrive_time: (product.arrive_time) ? product.arrive_time : null,
            arrive_to: (product.arrive_to) ? product.arrive_to : null,
            category_id: (product.category_id) ? product.category_id : null,
            child: (product.child) ? product.child : null,
            city_id: (product.city_id) ? product.city_id : null,
            cover_image: (product.cover_image) ? product.cover_image : "/assets/img/placeholder.jpg",
            created_by: (product.created_by) ? product.created_by : user_id,
            currency_id: (product.currency_id) ? product.currency_id : null,
            date_created: (product.date_created) ? product.date_created : formatDateMySQL(),
            date_modified: (product.date_modified) ? product.date_modified : formatDateMySQL(),
            day_span: (product.day_span) ? product.day_span : null,
            depart_from: (product.depart_from) ? product.depart_from : null,
            depart_time: (product.depart_time) ? product.depart_time : null,
            description_long: (product.description_long) ? product.description_long : null,
            description_short: (product.description_short) ? product.description_short : null,
            enabled: (product.enabled) ? product.enabled : 1,
            from_api: (product.from_api) ? product.from_api : null,
            hotel_code: (product.hotel_code) ? product.hotel_code : null,
            id: (product.id) ? product.id : null,
            infant: (product.infant) ? product.infant : null,
            location_id: (product.location_id) ? product.location_id : null,
            modified_by: (product.modified_by) ? product.modified_by : user_id,
            name: (product.name) ? product.name : null,
            phone: (product.phone) ? product.phone : null,
            pricing_strategy_types_id: (product.pricing_strategy_types_id) ? product.pricing_strategy_types_id : null,
            provider_id: (product.provider_id) ? product.provider_id : null,
            provider_vendor_match: (product.provider_vendor_match) ? product.provider_vendor_match : 1,
            rating: (product.rating) ? product.rating : null,
            sku: (product.sku) ? product.sku : null,
            status_types_id: (product.status_types_id) ? product.status_types_id : 4,
            teen: (product.teen) ? product.teen : null,
        }
        populate_form()
        /*
        console.log("Product.detail", Product.detail)
        //*/
    }
    
    const build_index_table = function () {
        if (_table_product_index) {
            $index_table = $(_table_product_index).table({
                table_type: "display_list",
                data: Array.from(Product.all.values()),
                columnDefs: [
                    {
                        title: "Id",
                        targets: 0,
                        data: "product_id",
                    },
                    {
                        title: "Category",
                        targets: 1,
                        data: "category_name",
                        render: function (data, type, row, meta) {
                            return `<span class='' style='white-space: nowrap'>${data}</span>`
                        },
                    },
                    {
                        title: "Name",
                        targets: 2,
                        data: "product_table_display",
                        render: function (data, type, row, meta) {
                            return `<span class='' style='white-space: nowrap'>${data}</span>`
                        },
                    },
                    {
                        title: "Provider",
                        targets: 3,
                        data: "provider_name",
                        render: function (data, type, row, meta) {
                            return `<span class='' style='white-space: nowrap'>${data}</span>`
                        },
                    },
                    {
                        title: "Enabled",
                        targets: 4,
                        data: "product_enabled",
                        render: function (data, type, row, meta) {
                            let text = `<span class='text-primary' style='white-space: nowrap'>Enabled</span>`
                            if (data === 0 || data === false) {
                                text = `<span class='text-danger' style='white-space: nowrap'>Disabled</span>`
                            }
                            return text
                        },
                    },
                ],
                rowClick: Product.navigate,
            })
        }
    }
    
    const navigate = function (product_id) {
        if (!product_id) {
            return
        }
        window.location.href = `/products/${product_id}`
    }
    
    const load_products = function (products) {
        $.each(products, function (i, product) {
            Product.all.set(product.product_id, product)
            /*
            console.log("product: ", product)
            //*/
        })
        /*
        console.log("Product.all", Product.all)
        //*/
    }
    
    const handle_product_error = function (error) {
        console.log("-- handle_product_error() --", error)
        toastr.error(error)
    }
    
    const set_autocomplete = function (category_id) {
        console.log("category_id", category_id)
        $(_product_name)
          .autocomplete({
              serviceUrl: "/autocomplete/products",
              minChars: 2,
              noCache: true,
              triggerSelectOnValidInput: false,
              dataType: "json",
              paramName: "st",
              params: { "categoryId": parseInt(category_id) },
              onSelect: function (suggestion) {
                  //console.log("-- productName:autocomplete - suggestion --")
                  //$("#productName").val(suggestion.data.product_name)
                  console.log("suggestion", suggestion.data)
              },
          })
    }
    ///////////////////////////////////////////////
    const init_index = function (settings) {
        console.log("settings", settings)
        Product.all = new Map()
        if (settings) {
            if (settings.products_list) {
                load_products(settings.products_list)
            }
        }
        build_index_table()
        
    }
    
    const init_edit = function (settings) {
        //*
        console.log("Product.init_edit", settings)
        //*/
        if (settings) {
            clear()
            if (settings.product) {
                set(settings.product)
                Provider.load_product_edit(settings)
                if (settings.product_seasons) {
                    Season.init_product_edit(settings.product_seasons)
                    $(_tab_product_edit_season).removeClass("disabled")
                }
                
            }
            
            if (settings.categories) {
                Category.load(settings.categories)
            }
            validate()
        }
        
    }
    ///////////////////////////////////////////////
    return {
        detail: {
            api_id: null,
            arrive_time: null,
            arrive_to: null,
            category_id: null,
            child: null,
            city_id: null,
            cover_image: "/assets/img/placeholder.jpg",
            created_by: user_id,
            currency_id: null,
            date_created: formatDateMySQL(),
            date_modified: formatDateMySQL(),
            day_span: null,
            depart_from: null,
            depart_time: null,
            description_long: null,
            description_short: null,
            enabled: null,
            from_api: null,
            hotel_code: null,
            id: null,
            infant: null,
            location_id: null,
            modified_by: user_id,
            name: null,
            phone: null,
            pricing_strategy_types_id: null,
            provider_id: null,
            provider_vendor_match: 1,
            rating: null,
            sku: null,
            status_types_id: 4,
            teen: null,
            
        },
        types: new Map(),
        all: new Map(),
        navigate: function (product) {
            if (product.product_id) {
                if (product.product_id) {
                    navigate(product.product_id)
                }
            }
            
        },
        init_edit: function (settings) {
            init_edit(settings)
        },
        init_index: function (settings) {
            init_index(settings)
        },
        set_autocomplete: function (category_id) {
            set_autocomplete(category_id)
        },
        init: function () {
            validate()
        },
    }
    ///////////////////////////////////////////////
})(jQuery)
