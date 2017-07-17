<?php

include('../admin-config.php');

class dbCon{
  var $con;
  var $query = '';
  var $table = '';
  var $data = array();
  var $condition = array();
  var $groupby = '';
  var $orderby = '';
  var $order = '';
  var $limit = '';
  var $extracondition = ''; 
  public function __construct(){
    $this->con = new PDO('mysql:host='. DBHOST.';dbname=' . DBNAME . ';charset=utf8mb4', DBUSER, DBPASS, array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
  }
  
  public function helloWorld(){
    echo "Hello World !";
  }
  
  public function result(){
    $result=array();
    $columns = '';
    $where='';
    $whereTrue = '';
    $orderby = '';
    $limit = '';
    $groupby = '';
    if(!empty($this->data)):
      foreach($this->data as $key => $value):
        $columns = ($columns=="") ? "$value " : $columns . " , $value " ;
      endforeach;
    else:
      $columns = " * ";
    endif;
    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $where = ($where == '') ? " $key = :" . $key : $where . " AND $key = :" . $key ;
      endforeach;
    else:
      $where = '';
    endif;

    $whereTrue = ($where || $this->extracondition) ? " WHERE " : '' ;
    if(!$this->groupby=="")
      $groupby = " GROUP BY  ". $this->groupby;
    
    if(!$this->orderby=="")
      $orderby = " ORDER BY  " . $this->orderby . " " . $this->order;
    
    if(!$this->limit=="")
      $limit = " LIMIT  " . $this->limit;
    
    if($this->query != ""):
      $query = $this->con->prepare("SELECT $columns FROM " . $this->table . $this->query);      
    else:
      $query = $this->con->prepare("SELECT $columns FROM " . $this->table . $whereTrue . $where . " " . $this->extracondition . " " . $groupby . " " . $orderby . " " . $limit);
    endif;
    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $query->bindValue(":" . $key , htmlentities($value));
      endforeach;
    endif;
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    return $result;
  }
  
  public function add(){
    $columns = '';
    $values = '';
    foreach($this->data as $key => $value):
      $columns .= ($columns=="") ? $key : ' , ' . $key ;
      $values .= ($values=="") ? ':' . $key : ' , ' .':' . $key ;
    endforeach;

    $query = $this->con->prepare('INSERT INTO ' . $this->table .  '(' . $columns .  ') VALUES (' . $values . ')' );

    foreach($this->data as $key => $value):
      $query->bindValue(":" . $key , htmlentities($value) , PDO::PARAM_STR);
    endforeach; 
    if($query->execute()):
      return true;
    else:
      return false;
    endif;
  }

  public function update(){
    $columns = '';
    $where ='';
    foreach($this->data as $key => $value):
      $columns = ($columns=="") ? " $key = :" . $key : $columns . " , $key = :" . $key ;
    endforeach;
    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $where = ($where=='') ? " WHERE $key = :" . $key : $where . " AND $key = :" . $key ;
      endforeach;
    endif;
    
    $query = $this->con->prepare('UPDATE ' . $this->table .  ' SET ' . $columns . $where);
    
    foreach($this->data as $key => $value):
      $query->bindValue(":" . $key , htmlentities($value) , PDO::PARAM_STR);
    endforeach; 
    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $query->bindValue(":" . $key , htmlentities($value));
      endforeach;
    endif;  
    if($query->execute()):
      return true;
    else:
      return false;
    endif;
  }
  
  public function delete(){
    $where='';
    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $where = ($where == '') ? "WHERE $key = :" . $key : $where . " AND $key = :" . $key ;
      endforeach;
    else:
      $where = '';
    endif;

    $query = $this->con->prepare('DELETE FROM ' . $this->table . ' ' . $where) ;

    if(!empty($this->condition)):
      foreach($this->condition as $key => $value):
        $query->bindValue(":" . $key , htmlentities($value));
      endforeach;
    endif;    

    if($query->execute()):
      return true;
    else:
      return false;
    endif;  
  }

  public function getAllTables($tables){
    $result = array();
    if(empty($tables)):
      $tables = $this->getAllTablesName(); 
    endif;
    for ($i =0; $i<count($tables); $i++):
      $this->table = $tables[$i]["table"];
      if($this->tableExists($this->table)):
        $query = $this->con->prepare('SELECT COUNT(*) as rows FROM ' . $this->table);
        $query->execute();
        $result[] = array("name" => $this->table, "rows" => $query->fetchAll(PDO::FETCH_ASSOC)[0]['rows'], "table" => $tables[$i]);
      endif;
    endfor;
    return $result;
  }
  public function getAllTablesName($tables=array()){
    $query = $this->con->prepare('SHOW TABLES');
    $query->execute();
    $t = $query->fetchAll(PDO::FETCH_ASSOC);
    for($i=0;$i<count($t); $i++):
      $tables[] = array("table" => $t[$i]["Tables_in_".DBNAME]);
    endfor;
    return $tables;
  }
  public function tableExists($table = "") {
    try {
      $result = $this->con->query("SELECT 1 FROM $table LIMIT 1");
    } catch (Exception $e) {
      return FALSE;
    }
    return $result !== FALSE;
  }
  public function columnExists($table="",$column=""){
    $query = $this->con->prepare('SHOW COLUMNS FROM ' . $table . ' LIKE "'. $column .'"');
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    return (count($result) > 0) ? true : false;     
  }
  public function getColumns(){
    $table =  $this->table;
    $query = $this->con->prepare('SHOW COLUMNS FROM ' . $table);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }
}
