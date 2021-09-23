<?php
    const DEV = 0;
    const PRODUCTION = 1;

#development_mode : DEV / PRODUCTION
    $development_mode = DEV;

    $app_path = 'http://local.traveldev.trips2italy.com/';

    if (file_exists(ROOT_PATH . "/app.ini")) {
        $ini = parse_ini_file(ROOT_PATH . "/app.ini");
    } else {
        $ini = parse_ini_file("./app.ini");
    }

    if (isset($ini["db_pass"], $ini["db_host"], $ini["db_name"], $ini["db_user"], $ini["db_persistent"], $ini["db_loginattempts"], $ini["expire_time"], $ini["app_error_location"], $ini["app_image_location"])) {
        define("PRODUCT_PATH", ROOT_PATH . "/repository/product");
        define("USER_PATH", ROOT_PATH . "/repository/user");
        define("COMPANY_PATH", ROOT_PATH . "/repository/company");
        define("FILEMANAGER_PATH", ROOT_PATH . "/filemanager");
        
        define("DBPASS", $ini["db_pass"]);
        define("DBHOST", $ini["db_host"]);
        define("DBNAME", $ini["db_name"]);
        define("DBUSER", $ini["db_user"]);
        define("DBPORT", $ini["db_port"]);
        define("DBPERSISTENT", $ini["db_persistent"]);
        define("DBLOGINATTEMPTS", $ini["db_loginattempts"]);
        define("EXPIRETIME", $ini["expire_time"]);
        define("ERRORPATH", $ini["app_error_location"]);
        define("IMAGEPATH", $ini["app_image_location"]);
    } else {
        exit;
    }


    //require "helpers/MysqlidDb.php";
    //require_once "helpers/functions.php";


    /*
    class LOGERROR
    {

        const TRACE = 0;
        const DEBUG = 1;
        const INFO = 2;
        const WARN = 3;
        const ERROR = 4;
        const FATAL = 5;

    }

    //*/
    /*
        require "helpers/log4php-2.3.0/Logger.php";

        if (isset($_SERVER["REMOTE_ADDR"])) {
            LoggerMDC::put("ip", $_SERVER["REMOTE_ADDR"]);
        }

        Logger::configure(array(
            "rootLogger" => array(
                "appenders" => array("default"),
            ),
            "loggers" => array(
                "MAIN" => array(
                    "level" => "warn",
                    "appenders" => array("default"),
                ),
                "ACCESS" => array(
                    "level" => "trace",
                    "appenders" => array("access"),
                ),
                "DEBUG" => array(
                    "level" => "trace",
                    "appenders" => array("debug"),
                ),
                "IMAGE" => array(
                    "level" => "trace",
                    "appenders" => array("image"),
                ),
                "BATCH" => array(
                    "level" => "trace",
                    "appenders" => array("batch"),
                ),
            ),
            "appenders" => array(

                "debug" => array(
                    "class" => "LoggerAppenderRollingFile",
                    "layout" => array(
                        "class" => "LoggerLayoutPattern",
                        "params" => array(
                            //"conversionPattern" => "%d{m/d/Y H:i:s.u} %p [%c] %m [%F:%L][IP:%X{ip}]%n"
                            "conversionPattern" => "%d{m/d/Y H:i:s.u} [%method:%pid] [%p] [IP:%X{ip}] [%F:%L] %m%n",
                        ),
                    ),
                    "params" => array(
                        "file" => $_SERVER["DOCUMENT_ROOT"] . "/var/logs/debug.log",
                        "maxBackupIndex" => 3,
                        "maxFileSize" => "2MB",
                        "compress" => TRUE,
                    ),
                ),

                "access" => array(
                    "class" => "LoggerAppenderRollingFile",
                    "layout" => array(
                        "class" => "LoggerLayoutPattern",
                        "params" => array(
                            "conversionPattern" => "%d{m/d/Y H:i:s.u} [%method:%pid] [%p] [IP:%X{ip}] [%F:%L] %m%n",
                        ),
                    ),
                    "params" => array(
                        "file" => $_SERVER["DOCUMENT_ROOT"] . "/var/logs/access.log",
                        "maxBackupIndex" => 3,
                        "maxFileSize" => "2MB",
                        "compress" => TRUE,
                    ),
                ),

                "image" => array(
                    "class" => 'LoggerAppenderFile',
                    "layout" => array(
                        "class" => "LoggerLayoutPattern",
                        "params" => array(
                            "conversionPattern" => "%d{m/d/Y H:i:s.u} %-5p [%c] %m [%F:%L][IP:%X{ip}]%n",
                        ),
                    ),
                    "params" => array(
                        "file" => $_SERVER["DOCUMENT_ROOT"] . "/var/logs/image.log",
                        "append" => TRUE,
                    ),
                ),

                "batch" => array(
                    "class" => 'LoggerAppenderFile',
                    "layout" => array(
                        "class" => "LoggerLayoutPattern",
                        "params" => array(
                            "conversionPattern" => "%d{m/d/Y H:i:s.u} [%-5p] [%F:%L] [%method] %m%n",
                        ),
                    ),
                    "params" => array(
                        "file" => $_SERVER["DOCUMENT_ROOT"] . "/var/logs/batch.log",
                        "append" => TRUE,
                    ),
                ),

                "default" => array(
                    "class" => "LoggerAppenderRollingFile",
                    "layout" => array(
                        "class" => "LoggerLayoutPattern",
                        "params" => array(
                            "conversionPattern" => "%d{m/d/Y H:i:s.u} [%c] %m [%F:%L][IP:%X{ip}]%n",
                        ),
                    ),
                    "params" => array(
                        "file" => $_SERVER["DOCUMENT_ROOT"] . "/var/logs/event.log",
                        "maxBackupIndex" => 3,
                        "maxFileSize" => "2MB",
                        "compress" => TRUE,
                    ),
                ),


            ),
        ));

        $MAIN_API_FILE_LOGGER = NULL;
        $MAIN_API_FILE_LOGGER = Logger::getLogger("MAIN");
        $ACCESS_LOGGER = Logger::getLogger("ACCESS");
        $DEBUG_LOGGER = Logger::getLogger("DEBUG");
        $IMAGE_LOGGER = Logger::getLogger("IMAGE");
        $BATCH_LOGGER = Logger::getLogger("BATCH");
    //*/
    ini_set("display_errors", 1);
    ini_set("error_reporting", E_ALL);
    //set_error_handler("error_handler_logger");
    //register_shutdown_function("fatal_handler_logger");
