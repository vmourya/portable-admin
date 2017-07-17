<?php 
define("URL","http://localhost/admin/");
// define("DBHOST", (getenv("DBHOST")) ? getenv("DBHOST") :  "localhost");
// define("DBUSER", (getenv("DBUSER")) ? getenv("DBUSER") :  "root");
// define("DBPASS", (getenv("DBPASS")) ? getenv("DBPASS") :  "root");
// define("DBNAME", (getenv("DBNAME")) ? getenv("DBNAME") : "nsi_feeback");
define("DBHOST", (getenv("DBHOST")) ? getenv("DBHOST") :  "localhost");
define("DBUSER", (getenv("DBUSER")) ? getenv("DBUSER") :  "root");
define("DBPASS", (getenv("DBPASS")) ? getenv("DBPASS") :  "root");
define("DBNAME", "portable_admin");

define("TABLE_FILE","tables.php");
define("DEBUG",true);