import React, { Component } from 'react';
import { connect } from 'react-redux';

export class EditStations extends Component {

  render() {
    const stations = Object.keys(this.props.stations).map((stationId,i)=>{
      return (<div key={i}>{this.props.stations[stationId].name}</div>)
    })

    return (
      <div>
        <h1>Edit Stations!!!</h1>
        {stations}
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    team: state.team,
    stations: state.stations
  }
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStations);
