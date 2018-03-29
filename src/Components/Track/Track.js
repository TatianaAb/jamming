import React from 'react';
// import ReactDOM from 'react-dom';
import './Track.css';

class Track extends React.Component {

  constructor(props) {
    super(props);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    if (this.props.isRemoval === true) {
      return <a className="Track-action" onClick={this.removeTrack}> - </a>;
    } else {
      return <a className="Track-action" onClick={this.addTrack.bind(this)}> + </a>;
    }
  }


  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  render() {
    return (
        <div className="Track">
          <div className="Track-information">
            <h3>{this.props.track.name}</h3>
            <p>{this.props.track.artist} | {this.props.track.album}</p>
          </div>
            {this.renderAction()}
        </div>
    );
  }
}

export default Track;