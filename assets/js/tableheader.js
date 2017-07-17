var TableHeader = React.createClass({
  getInitialState: function(){
    return{}
  },
  render: function(){
    if(this.props.data.length){
      return(
        <tr>
          {
            this.props.data.map((function(column){
              return(
                <th key={column.Field}>{column.Field}</th>
              )
            }).bind(this))
          }
        </tr>
        )
    }else{
      return(<tr><th className="center-text">No column found.</th></tr>)
    }
  }

});

React.TableHeader = TableHeader;