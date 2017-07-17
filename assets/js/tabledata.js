var TableHeader = React.TableHeader;
var TableBody = React.TableBody;
var JoinedTableData = React.JoinedTableData;
var TableData = React.createClass({
	getInitialState: function(){
		return {
			dataHeader: [],
			dataRows: [],
			table: this.props.data.table.name,
			columns: [],
			jointable: this.props.data.table.table.jointable || "",
			joinColumnFrom: this.props.data.table.table.columnfrom || "",
			joinColumnTo: this.props.data.table.table.columnto || "",
			joinedTable: "",
			joinedColumnValue: []
		}
	},
	resetTableData: function(){
		this.props.resetTableData();
	},
	componentDidMount: function(){
		$.ajax({
			type: "POST",
			url: "lib/main.php",
			data: {action: "getTableData", table: this.state.table, jointable: this.state.jointable, columnfrom: this.state.joinColumnFrom, columnto: this.state.joinColumnTo},
			success: this.setTableData,
			error: function(error){
				console.log(error)
			}
		});
	},
	setTableData: function(data){
		this.setState({
			dataHeader: data.columns,
			dataRows: data.rows
		})
	},
	setJoinedTable: function(column,dataindex){
		this.setState({
			joinedTable: column,
			joinedColumnValue: {row: this.state.dataRows[dataindex]}
		})
	},
	getJoinedTableData: function(){
		if(this.state.joinedTable){
			return(
					<JoinedTableData data={this.state.joinedTable} joinedColumnValue={this.state.joinedColumnValue} resetJoinedData={this.resetJoinedData} joinColumnFrom={this.state.joinColumnFrom} joinColumnTo={this.state.joinColumnTo} />
			)
		}
	},
	resetJoinedData: function(){
		this.setState({
			joinedTable: "",
			joinedColumnValue: []
		})
	},
	render: function(){
		return(
			<div className="pop-up-wrapper">
				<div className="table-data-popup">
				<div className="overlay overlay-first"></div>
					<div className="table-data-header">
						<h1>{this.state.table}<a href="javascript:void(0)" onClick={this.resetTableData} title="Close">x</a></h1>
					</div>
					<div className="table-data-rows">
						<table>
							<thead>
								<TableHeader data={this.state.dataHeader} />
							</thead>
							<TableBody data={this.state.dataHeader} dataRows={this.state.dataRows} jointable={this.state.jointable.split(",")} setJoinedTable={this.setJoinedTable} />
						</table>
					</div>
				</div>
				{this.getJoinedTableData()}
			</div>
		)
	}
})

React.TableData = TableData;