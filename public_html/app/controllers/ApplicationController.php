<?php

    /**
     * Base controller for the application.
     * Add general things in this controller.
     */
    class ApplicationController extends Controller
    {


        public function loginAction()
        {
            $this->view->users = UserModel::getUserById();
            $this->view->message = "hello from test::index";
        }


        public function indexAction()
        {
            $this->view->users = UserModel::getUserById();
            $this->view->message = "hello from test::index";
        }

    }
