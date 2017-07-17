var TableBody = React.createClass({
  getInitialState: function(){
    return {
      jointable: this.props.jointable || []
    }
  },
  tableData: function(){
    if(this.props.dataRows.length){
      return(
        this.props.dataRows.map((function(row,key){
          return(
                this.buildRow(row,key)
            )
        }).bind(this))
      )
    }
  },
  setJoinedTable: function(column,dataindex){
    this.props.setJoinedTable(column,dataindex)
  },
  printData: function(data,column,key){
    if(this.state.jointable.includes(column)){
      return(
        <a href="javascript:void(0)" onClick={this.setJoinedTable.bind(this,column,key)}>
          {data}
        </a>
        );
    }else{
      return(data);
    }
  },
  buildRow: function(row,key){
    return(
      <tr key={key}>
        {
          this.props.data.map((function(column,i){
            return(
              <td key={i + key}>
                {this.printData(row[column.Field],column.Field,key)}
              </td>
            )
          }).bind(this))
        }
      </tr>
    )
  },  
  render: function(){
    return(
        <tbody>
          {this.tableData()}
        </tbody>
    )
  }

});

React.TableBody = TableBody;