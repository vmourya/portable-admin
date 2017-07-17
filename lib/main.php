<?php
header("Content-type: application/json");
include("db.php");
if(file_exists(TABLE_FILE)):
  include(TABLE_FILE);
endif;
/* SET ERROR REPORTS */
setError();
function setError(){
    ini_set("display_errors", "1");
    if(DEBUG){
        error_reporting(E_ALL);
    }else{
        error_reporting(0);
    }
}

$action = $_POST['action'];
$action($_POST);

function getAllTables($params=array()){
  $tables = array();
  if(isset($params['tables'])):
    $db = new dbCon();
    $tables = $db->getAllTables($params['tables']);    
  else:
    $db = new dbCon();
    $tables = $db->getAllTables(json_decode(TABLES, true));
  endif;
  echo json_encode(array("tables"=> $tables));
}

function getTableData($params=array()){
  $db = new dbCon();
  $db->table = $params['table'];
  $columns = $db->getColumns();
  if($params['jointable'] && $params['columnfrom'] && $params['columnto']):
    $result =  $db->result();
    $jointables = explode(",", $params['jointable']);
    for($i=0; $i<count($jointables); $i++):
      $jointable = $jointables[$i];
      if($jointable && $db->tableExists($jointable) && $db->columnExists($jointable,$params['columnto']) && $db->columnExists($params['table'],$params['columnfrom'])):
        $columns[] = array("Field" => $jointable);
        for($j=0;$j<count($result);$j++):
          $db->table = $jointable;
          $db->data[] = "count({$params['columnto']}) as {$jointable}";
          $db->condition[$params['columnto']] = $result[$j][$params['columnfrom']];
          $rowCount = $db->result()[0];
          $result[$j][$jointable] = $rowCount[$jointable];
        endfor;
      endif;
    endfor;
  else:
    $result =  $db->result();
  endif;

  echo json_encode(array("columns" => $columns, "rows" => $result));
}
function getJoinedTableData($params=array()){
  $db=  new dbCon();
  $db->table = $params['table'];
  $join = $params['join']['row'];
  $joinColumnFrom = $params['joincolumnfrom'];
  $joinColumnTo = $params['joincolumnto'];
  $db->condition[$joinColumnTo] = $join[$joinColumnFrom];
  echo json_encode(array("columns" => $db->getColumns(), "rows" => $db->result()));
}

function createTableConfig($params = array()){
  $tableConfig = array();
  $tables = json_decode($params['tables']);
  for($i=0; $i<count($tables); $i++):
    if($tables[$i]->table):
      $tableConfig[] = get_object_vars($tables[$i]);
    endif;
  endfor;
  $file = fopen(TABLE_FILE, "w+");
  $fileContent = '<?php $tables=\'' . json_encode($tableConfig) . '\'; define("TABLES", $tables);?>'; 
  fwrite($file, $fileContent);
  rewind($file);
  fflush($file);
  fclose($file);
  getAllTables(array("tables" => $tableConfig));
}

function getTableConfig($params=array()){
  $tableConfig = json_decode(TABLES, true);
  $db = new dbCon();
  $tablesName = $db->getAllTablesName();
  echo json_encode(array('tables' => $tablesName, 'tableConfig' => $tableConfig ));
}