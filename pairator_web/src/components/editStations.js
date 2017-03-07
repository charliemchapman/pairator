import React, { Component } from 'react';
import { connect } from 'react-redux';

export class EditStations extends Component {

  render() {
    const stations = Object.keys(this.props.stations).map((stationId,i)=>{
      return (
        <tr className="station-row" key={i}>
          <td>{this.props.stations[stationId].name}</td>
          <td>{this.props.stations[stationId].description}</td>
        </tr>)
    })

    return (
      <div>
        <h1>Stations</h1>
        <div className="edit-station">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {stations}
            </tbody>
          </table>
        </div>
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
