const Type = (function () {
    const base_url = "/types";


    const get = function () {

    }

    const init = function (settings) {
        console.log('---- init --');
        console.log(settings);
        //----
        

    }

    const $this = {
        all: new Map(),
        init: function (settings) {
            init(settings);
        }
    }
    return $this;
})();
