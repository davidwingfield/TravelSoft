<?php

    class UserModel
    {

        public static function getUserById(): array
        {

            $result = Model::fetchOne("SELECT * FROM user;");

            //$this->::$db->rawQuery("SELECT * FROM user;");
            return $result;
        }

    }
