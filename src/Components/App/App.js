import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: [], playlistName: null, playlistTracks: []};
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
      let playlist = this.state.playlistTracks;
      console.log("Before adding song ");
      console.log(playlist);
      if (playlist.length === 0) {playlist.push(track);
      } else {
          let hasId = false;
          for(let i=0; i< playlist.length; i++) {
            if (playlist[i].id === track.id ) {
               hasId = true;
               console.log("has id ?" + hasId);
               break;
            }
          }
          hasId === false ? playlist.push(track) : console.log(" This track already in your list!");
      }
       console.log("After adding song ");
       console.log(playlist);
      this.setState({playlistTracks: playlist});
    }

  removeTrack(track) {
      let playlist = this.state.playlistTracks;
      for(let i=0; i< playlist.length; i++) {
        if (playlist[i].id === track.id ) {
          playlist.splice(i, 1);
        }
      }
      this.setState({playlistTracks: playlist});
    }

  updatePlaylistName(name) {
      this.setState({playlistName: name});
    }

  savePlaylist() {
    let trackURIs = [];
    let playlist = this.state.playlistTracks;
    for(let i=0; i< playlist.length; i++) {
      trackURIs.push(playlist[i].uri)
    };
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistTracks: [], playlistName: "New Playlist"});
  }

  search(term) {
     Spotify.getAccessToken();
     Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
     });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
