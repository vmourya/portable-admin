var TableData = React.TableData;
var TableConfigForm = React.TableConfigForm;
var Admin = React.createClass({
  getInitialState: function(){
    return {
      tables: [],
      currentTable: "",
      loading: true,
      ajaxUrl: "lib/main.php",
      tables_config: true,
      cancel_config: false
    }
  },
  componentDidMount: function(){
   this.getAllTables();
  },
  checkTables: function(res){
    this.setState({
      loading: false,
      cancel_config: true
    });
    this.setTables(res.tables);
  },
  ajax: function(data,success){
    $.ajax({
      type: "POST",
      url: this.state.ajaxUrl,
      data: data,
      success: success,
      error: function(error){
        console.log(error)
      }
    })        
  },
  getAllTables: function(){
    this.setState({
      loading: true
    });
    this.ajax({action: "getAllTables"},this.checkTables);
  },
  setTables: function(tables){
    this.setState({
      tables: tables,
      tables_config: true
    });
  },
  setTable: function(table){
    this.setState({
      currentTable: {table}
    });
  },
  resetTableData: function(){
    this.setState({
      currentTable: ""
    });
  },
  reConfigTables: function(){
    this.setState({
      tables_config: false,
      cancel_config: true
    })
  },
  cancelConfig: function(){
    this.setState({
      tables_config: true
    })
  },
  renderTables: function(){
    if(this.state.loading){
      return (<span className="loader-wrapper"><img src="assets/images/loader.gif" alt="loading..." title="loading..." /></span>)
    }else if(!this.state.tables_config){
      return(<TableConfigForm setTables={this.setTables} cancel={this.state.cancel_config} cancelConfig={this.cancelConfig}/>)
    }else if(this.state.tables.length>0){
      return(
        <div className="tables">
          <h1>Portable Admin <a href="javascript:void(0)" onClick={this.reConfigTables.bind(this)}>Re-configuration of tables</a></h1>
          <table>
            <thead>
              <tr><th>table name</th><th>rows</th><th></th></tr>
            </thead>
            <tbody>
            {
              this.state.tables.map((function(table){
                return(
                  <tr key={table.name}>
                    <td>{table.name}</td>
                    <td><a href="javascript:void(0)" onClick={this.setTable.bind(this,table)}>{table.rows}</a></td>
                    <td>
                      <a href="javascript:void(0)" onClick={this.setTable.bind(this,table)}>View</a>
                    </td>
                  </tr>                 
                );
              }).bind(this))
            }
            </tbody>
          </table>
          {this.showTablesData()}
        </div>
      )
    }else{
      return (<span className="loader-wrapper"><h1>No Table Found.<a href="javascript:void(0)" onClick={this.reConfigTables.bind(this)}>Re-configuration of tables</a></h1></span>)
    }
  },
  showTablesData: function(){
    if(this.state.currentTable != ""){
      return(<TableData data={this.state.currentTable} resetTableData={this.resetTableData} />)
    }
  },
  render: function(){
    return (
      <div className="admin-wrapper">
        {this.renderTables()}
      </div>
    )
  }
  
})

ReactDOM.render(
  React.createElement(Admin), 
  document.getElementById('admindata')
);