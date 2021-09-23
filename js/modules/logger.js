Object.defineProperty(window, "__stack", {
    get: function () {
        var orig = Error.prepareStackTrace
        Error.prepareStackTrace = function (_, stack) {
            return stack
        }
        var err = new Error
        Error.captureStackTrace(err, arguments.callee)
        var stack = err.stack
        Error.prepareStackTrace = orig
        return stack
    },
})

Object.defineProperty(window, "__line", {
    get: function () {
        return __stack[1].getLineNumber()
    },
})

Object.defineProperty(window, "__function", {
    get: function () {
        return __stack[1].getFunctionName()
    },
})

Object.defineProperty(window, "__file", {
    get: function () {
        return __stack[1].getFileName()
    },
})

Object.defineProperty(window, "__logLineDetails", {
    get: function () {
        return {
            "columnNumber": __stack[1].getColumnNumber(),
            "functionName": __stack[1].getFunctionName(),
            "lineNumber": __stack[1].getLineNumber(),
            "fileName": __stack[1].getFileName(),
            "typeName": __stack[1].getTypeName(),
            "isEval": __stack[1].isEval(),
            "this": __stack[1].getThis(),
        }
    },
})

const Logger = (function () {
    "use strict"
    const log_scheme = {
        "trace": {
            color: "white",
            background: "transparent",
        },
        "debug": {
            color: "blue",
            background: "transparent",
        },
        "info": {
            color: "cyan",
            background: "transparent",
        },
        "warn": {
            color: "yellow",
            background: "transparent",
        },
        "error": {
            color: "red",
            background: "transparent",
        },
        "fatal": {
            color: "white",
            background: "red",
        },
    }
    let version = "1.00"
    let containerDiv = null
    let tabDiv = null
    let logDiv = null
    let visible = true     // flag for visibility
    let opened = false     // flag for toggle on/off
    let enabled = true     // does not accept log messages any more if it is false
    let logHeight = 215    // 204 + 2*padding + border-top
    let tabHeight = 20
    // for animation
    let animTime = 0
    let animDuration = 200 // ms
    let animFrameTime = 16  // ms
    
    let getTime = function () {
        let now = new Date()
        let hour = "0" + now.getHours()
        hour = hour.substring(hour.length - 2)
        let minute = "0" + now.getMinutes()
        minute = minute.substring(minute.length - 2)
        let second = "0" + now.getSeconds()
        second = second.substring(second.length - 2)
        return hour + ":" + minute + ":" + second
    }
    let getDate = function () {
        let now = new Date()
        let year = "" + now.getFullYear()
        let month = "0" + (now.getMonth() + 1)
        month = month.substring(month.length - 2)
        let date = "0" + now.getDate()
        date = date.substring(date.length - 2)
        return year + "-" + month + "-" + date
    }
    let getRequestAnimationFrameFunction = function () {
        let requestAnimationFrame = window.requestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.webkitRequestAnimationFrame
        if (requestAnimationFrame) {
            return function (callback) { return requestAnimationFrame(callback) }
        } else {
            return function (callback) { return setTimeout(callback, 16) }
        }
    }
    
    return {
        init: function () {
            // avoid redundant call
            if (containerDiv) {
                return true
            }
            
            // check if DOM is ready
            if (!document || !document.createElement || !document.body || !document.body.appendChild) {
                return false
            }
            
            // constants
            let CONTAINER_DIV = "loggerContainer"
            let TAB_DIV = "loggerTab"
            let LOG_DIV = "logger"
            let Z_INDEX = 9999
            
            // create logger DOM element
            containerDiv = document.getElementById(CONTAINER_DIV)
            if (!containerDiv) {
                // container
                containerDiv = document.createElement("div")
                containerDiv.id = CONTAINER_DIV
                containerDiv.setAttribute("style", "width:100%;" +
                  "margin:0;" +
                  "padding:0;" +
                  "text-align:left;" +
                  "box-sizing:border-box;" +
                  "position:fixed;" +
                  "left:0;" +
                  "z-index:" + Z_INDEX + ";" +
                  "bottom:" + (-logHeight) + "px;")  /* hide it initially */
                
                // tab
                tabDiv = document.createElement("div")
                tabDiv.id = TAB_DIV
                tabDiv.appendChild(document.createTextNode("LOG"))
                tabDiv.setAttribute("style", "width:40px;" +
                  "box-sizing:border-box;" +
                  "overflow:hidden;" +
                  "font:bold 10px verdana,helvetica,sans-serif;" +
                  "line-height:" + (tabHeight - 1) + "px;" +  /* subtract top-border */
                  "color:#fff;" +
                  "position:absolute;" +
                  "left:20px;" +
                  "top:" + -tabHeight + "px;" +
                  "margin:0; padding:0;" +
                  "text-align:center;" +
                  "border:1px solid #aaa;" +
                  "border-bottom:none;" +
                  /*"background:#333;" + */
                  "background:rgba(0,0,0,0.8);" +
                  "border-top-right-radius:8px;" +
                  "border-top-left-radius:8px;")
                // add mouse event handlers
                tabDiv.onmouseover = function () {
                    this.style.cursor = "pointer"
                    this.style.textShadow = "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0"
                }
                tabDiv.onmouseout = function () {
                    this.style.cursor = "auto"
                    this.style.textShadow = "none"
                }
                tabDiv.onclick = function () {
                    Logger.toggle()
                    this.style.textShadow = "none"
                }
                
                // log message
                logDiv = document.createElement("div")
                logDiv.id = LOG_DIV
                logDiv.setAttribute("style", "font:12px monospace;" +
                  "height: " + logHeight + "px;" +
                  "box-sizing:border-box;" +
                  "color:#fff;" +
                  "overflow-x:hidden;" +
                  "overflow-y:scroll;" +
                  "visibility:hidden;" +
                  "position:relative;" +
                  "bottom:0px;" +
                  "margin:0px;" +
                  "padding:5px;" +
                  /*"background:#333;" + */
                  "background:rgba(0,0,0,0.8);" +
                  "border-top:1px solid #aaa;")
                
                // style for log message
                let span = document.createElement("span")  // for coloring text
                span.style.color = "#afa"
                span.style.fontWeight = "bold"
                
                // the first message in log
                let msg = "===== Log Started at " +
                  getDate() + ", " + getTime() + ", " +
                  "(Logger version " + version + ") " +
                  "====="
                
                span.appendChild(document.createTextNode(msg))
                logDiv.appendChild(span)
                logDiv.appendChild(document.createElement("br"))   // blank line
                logDiv.appendChild(document.createElement("br"))   // blank line
                
                // add divs to document
                containerDiv.appendChild(tabDiv)
                containerDiv.appendChild(logDiv)
                document.body.appendChild(containerDiv)
            }
            
            return true
        },
        
        print: function (title, msg, loginline, level) {
            
            if (!level) {
                level = "debug"
            }
            let type = typeof msg
            
            if (!enabled) {
                return
            }
            
            if (!title) {
                title = ""
            }
            
            if (!containerDiv) {
                let ready = this.init()
                if (!ready) {
                    return
                }
            }
            
            if (!msg) {
                msg = ""
            }
            
            let level_text = `[${loginline.lineNumber}] `
            
            let msgDefined = true
            
            // convert non-string type to string
            if (type === "object") {
                msg = JSON.stringify(msg, null, 4)
            } else if (type === "undefined") {
                msg = "undefined"
                msgDefined = false
            } else if (type === "function") {
                msg = "function"
                msgDefined = false
            } else if (msg === null) {
                msg = "null"
                msgDefined = false
            }
            
            if (msg instanceof Array) {
                msg = this.arrayToString(msg)
            } else if (type === "object") {
                msg = `[${loginline.functionName}:${loginline.lineNumber}] [${level.toUpperCase()}] [${loginline.fileName}] "${title}" (object)\n ${msg}`
            } else if (type === "number") {
                msg = `[${level.toUpperCase()}] "${title}" (number)\n ${msg}`
            } else if (type === "string") {
                msg = `'${title}' (string) ${msg}`
            } else if (type === "boolean") {
                msg = `'${title}' (bool) ${msg}`
            } else {
                msg += ""
            }
            
            let lines = msg.split(/\r\n|\r|\n/)
            
            for (let i = 0, c = lines.length; i < c; ++i) {
                // format time and put the text node to inline element
                let timeDiv = document.createElement("div")            // color for time
                timeDiv.setAttribute("style", "color:#999;" +
                  "float:left;")
                let mLeft = "0"
                if (i === 0) {
                    let timeNode = document.createTextNode(getDate() + " " + getTime() + "\u00a0")
                    timeDiv.appendChild(timeNode)
                    mLeft = "6.0em"
                }
                
                // create message span
                let msgDiv = document.createElement("div")
                msgDiv.setAttribute("style", "word-wrap:break-word;" +  // wrap msg
                  "margin-left:" + mLeft + ";")
                if (!msgDefined) {
                    msgDiv.style.color = "#afa"
                }
                
                // put message into a text node
                let line = lines[i].replace(/ /g, "\u00a0")
                let msgNode = document.createTextNode(line)
                msgDiv.appendChild(msgNode)
                
                // new line div with clearing css float property
                let newLineDiv = document.createElement("div")
                newLineDiv.setAttribute("style", "clear:both;")
                
                logDiv.appendChild(timeDiv)
                logDiv.appendChild(msgDiv)
                logDiv.appendChild(newLineDiv)
                
                logDiv.scrollTop = logDiv.scrollHeight
            }
        },
        trace: function (title, msg, loginline) {
            if (arguments.length === 0) {
                Logger.print("")
            }// print a blank line
            else {
                Logger.print(title, msg, loginline, "trace")
            }
        },
        debug: function (title, msg, loginline) {
            if (arguments.length === 0) {
                Logger.print("")
            }// print a blank line
            else {
                Logger.print(title, msg, loginline, "debug")
            }
        },
        info: function (title, msg, loginline) {
            if (arguments.length === 0) {
                Logger.print("")
            }// print a blank line
            else {
                Logger.print(title, msg, loginline, "info")
            }
        },
        warn: function (title, msg, loginline) {
            if (arguments.length === 0) {
                Logger.print("")
            }// print a blank line
            else {
                Logger.print(title, msg, loginline, "info")
            }
        },
        error: function (title, msg, loginline) {
            if (arguments.length === 0) {
                Logger.print("")
            }// print a blank line
            else {
                Logger.print(title, msg, loginline, "info")
            }
        },
        toggle: function () {
            if (opened)  // if opened, close the window
            {
                this.close()
            } else        // if closed, open the window
            {
                this.open()
            }
        },
        open: function () {
            if (!this.init()) {
                return
            }
            if (!visible) {
                return
            }
            if (opened) {
                return
            }
            
            logDiv.style.visibility = "visible"
            animTime = Date.now()
            let requestAnimationFrame = getRequestAnimationFrameFunction()
            requestAnimationFrame(slideUp)
            
            
            function slideUp () {
                let duration = Date.now() - animTime
                if (duration >= animDuration) {
                    containerDiv.style.bottom = 0
                    opened = true
                    return
                }
                let y = Math.round(-logHeight * (1 - 0.5 * (1 - Math.cos(Math.PI * duration / animDuration))))
                containerDiv.style.bottom = "" + y + "px"
                requestAnimationFrame(slideUp)
            }
        },
        close: function () {
            if (!this.init()) {
                return
            }
            if (!visible) {
                return
            }
            if (!opened) {
                return
            }
            
            animTime = Date.now()
            let requestAnimationFrame = getRequestAnimationFrameFunction()
            requestAnimationFrame(slideDown)
            
            
            function slideDown () {
                let duration = Date.now() - animTime
                if (duration >= animDuration) {
                    containerDiv.style.bottom = "" + -logHeight + "px"
                    logDiv.style.visibility = "hidden"
                    opened = false
                    return
                }
                let y = Math.round(-logHeight * 0.5 * (1 - Math.cos(Math.PI * duration / animDuration)))
                containerDiv.style.bottom = "" + y + "px"
                requestAnimationFrame(slideDown)
            }
        },
        show: function () {
            if (!this.init()) {
                return
            }
            
            containerDiv.style.display = "block"
            visible = true
        },
        hide: function () {
            if (!this.init()) {
                return
            }
            
            containerDiv.style.display = "none"
            visible = false
        },
        enable: function () {
            if (!this.init()) {
                return
            }
            
            enabled = true
            tabDiv.style.color = "#fff"
            logDiv.style.color = "#fff"
        },
        disable: function () {
            if (!this.init()) {
                return
            }
            
            enabled = false
            tabDiv.style.color = "#666"
            logDiv.style.color = "#666"
        },
        clear: function () {
            if (!this.init()) {
                return
            }
            
            logDiv.innerHTML = ""
        },
        arrayToString: function (array) {
            let str = "["
            for (let i = 0, c = array.length; i < c; ++i) {
                if (array[i] instanceof Array) {
                    str += this.arrayToString(array[i])
                } else {
                    str += array[i]
                }
                
                if (i < c - 1) {
                    str += ", "
                }
            }
            str += "]"
            return str
        },
    }
    
})()
