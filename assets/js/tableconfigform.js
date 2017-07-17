var TableConfigForm = React.createClass({
	getInitialState: function(){
		return{
			laoder: true,
			tablesConfig: [],
			cancel: this.props.cancel,
			ajaxUrl: "lib/main.php",
			tables: [] 
		}
	},
	changeTableProperty: function(tableIndex,e){
		var tablesConfig = []
		tablesConfig = this.state.tablesConfig
		tablesConfig[tableIndex][e.target.name] = e.target.value
		if(e.target.name == "table"){
			tablesConfig[tableIndex]['columnfrom'] = ""
			tablesConfig[tableIndex]['columnto'] = ""
		}
		this.setState({
			tablesConfig: tablesConfig
		})  
	},
	changeJoinedTableProperty: function(tableIndex,e){
		var tablesConfig =  this.state.tablesConfig
		var options = e.target.options
  		var value = ""
  		for (var i = 0, l = options.length; i < l; i++) {
    		if (options[i].selected) {
      			value = (value) ? value + "," +options[i].value : options[i].value // value.push();
    		}
  		}
		tablesConfig[tableIndex][e.target.name] = value
		if(tablesConfig[tableIndex]['table']){
			tablesConfig[tableIndex]['columnto'] = tablesConfig[tableIndex]['table'].substring(0,tablesConfig[tableIndex]['table'].length-1) + "_id"
			tablesConfig[tableIndex]['columnfrom'] = "id"
		}
		this.setState({
			tablesConfig: tablesConfig
		}) 
	},
	removeTable: function(index){
		var tabs = this.state.tablesConfig.filter(function(table,i ){
			 			if(i!=index){return table;}
			 	})
		this.setState({
			tablesConfig: tabs
		})		
	},
	getFieldset: function(){
		return(
			this.state.tablesConfig.map((function(table,i){
				return(
					<fieldset key={"fieldset-"+i + 1 }>
						<h2 key={"tablenumber-"+i}>Table {i+1} <a className="delete-icon" href="javascript:void(0)" onClick={this.removeTable.bind(this,i)}>x</a></h2>
						<div key={"tablenamediv" + i}>
							<label htmlFor={"table" + i+1}>Table name</label>
							<select name="table" id={"table" +i+1} onChange={this.changeTableProperty.bind(this,i)} defaultValue={table.table} >
								<option value="">--Select--</option>
								{
									this.state.tables.map((function(tb){
										return (
											<option value={tb.table} key={"table"+tb.table}>{tb.table}</option>
										)
									}).bind(this))
								}
							</select>
						</div>
						<div key={"jointablenamediv" + i}>
							<label htmlFor={"jointable" + i+1}>Join Table(s) name<span>(CTRL + select)</span></label>
							<select multiple name="jointable" id={"jointable" +i+1} onChange={this.changeJoinedTableProperty.bind(this,i)} defaultValue={table.jointable.split(",")} >
								<option value="">--Select--</option>
								{
									this.state.tables.map((function(tb){
										return (
											<option value={tb.table} key={"jointable"+tb.table}>{tb.table}</option>
										)
									}).bind(this))
								}
							</select>
						</div>
						<div key={"columnfromdiv" + i}>
							<label htmlFor={"columnfrom" + i+1}>Join column from</label>
							<input name="columnfrom" id={"columnfrom" +i+1} onChange={this.changeTableProperty.bind(this,i)} value={table.columnfrom} />
						</div>
						<div key={"columntodiv" + i}>
							<label htmlFor={"columnto" + i+1}>Join column to</label>
							<input name="columnto" id={"columnto" +i+1} onChange={this.changeTableProperty.bind(this,i)} value={table.columnto} />
						</div>
					</fieldset>
				)
			}).bind(this))
		)
	},
	addTable: function(){
		var table = {table: "", jointable: "" , columnfrom: "", columnto: ""}
		var tables = this.state.tablesConfig
		tables.push(table)
		this.setState({
			tablesConfig: tables
		})
	},
	tablesConfigSuccess: function(res){
		this.props.setTables(res.tables);
	},
	saveTableConfig: function(){
		var data = {action: "createTableConfig" , tables: JSON.stringify(this.state.tablesConfig)}
		$.ajax({
			type: "POST",
			data: data,
			url: "lib/main.php",
			dataType: "json",
			success: this.tablesConfigSuccess,
			error: function(error){
				console.log(error)
			}
		})
	},
	cancelConfig:function(){
		if(this.state.cancel){
			this.props.cancelConfig()
		}
	},
	setTableConfig: function(res){
		this.setState({
			tablesConfig: res.tableConfig,
			tables: res.tables
		})
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
	getTableConfig: function(){
		this.ajax({action: "getTableConfig"}, this.setTableConfig)
	},
	componentDidMount: function(){
		debugger
		this.getTableConfig();
	},
	render: function(){
		return(
			<div className="table-config-form">
				<h1>Table(s) Configuration</h1>
				<form>
					{this.getFieldset()}
					<fieldset>
						<a href="javascript:void(0)" onClick={this.addTable.bind(this)}>Add Table</a> 
						<a href="javascript:void(0)" onClick={this.saveTableConfig.bind(this)}>Save</a> 
						<a href="javascript:void(0)" onClick={this.cancelConfig.bind(this)}>Cancel</a>
					</fieldset>
					<span className="table-config-note">NOTE: If no table defined then it will show all tables data without any join.</span>
				</form>
			</div>
		)
	}	 
});

React.TableConfigForm = TableConfigForm;