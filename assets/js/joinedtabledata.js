var TableHeader = React.TableHeader;
var TableBody = React.TableBody;
var JoinedTableData = React.createClass({
  getInitialState: function(){
    return{
      table: this.props.data,
      dataHeader: [],
      dataRows: [],
      joinedColumnValue: this.props.joinedColumnValue,
      joinColumnFrom: this.props.joinColumnFrom,
      joinColumnTo: this.props.joinColumnTo
    }

  },
  resetTableData: function(){
    this.props.resetJoinedData()
  },
  setTableData: function(res){
    var header = res.columns.filter((function(column){
      if(column.Field != this.props.joinColumnTo){
        return column;
      }
    }).bind(this))
    this.setState({
      dataHeader: header,
      dataRows: res.rows
    })
  },
  componentDidMount: function(){
    $.ajax({
      type: "POST",
      url: "lib/main.php",
      data: {action: "getJoinedTableData", table: this.state.table, join: this.state.joinedColumnValue, joincolumnfrom: this.state.joinColumnFrom, joincolumnto: this.state.joinColumnTo},
      success: this.setTableData,
      error: function(error){console.log(error)}
    })
  },
  render: function(){
    return(
      <div className="table-data-popup">
        <div className="overlay overlay-second"></div>
        <div className="table-data-header">
          <h1>{this.state.table}<a href="javascript:void(0)" onClick={this.resetTableData} title="Close">x</a></h1>
        </div>
        <div className="table-data-rows">
          <table>
            <thead>
              <TableHeader data={this.state.dataHeader} />
            </thead>
            <TableBody data={this.state.dataHeader} dataRows={this.state.dataRows} />
          </table>
        </div>
      </div>
    )
  }
})

React.JoinedTableData = JoinedTableData;