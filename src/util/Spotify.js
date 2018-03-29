
let userToken;
const CLIENT_ID = '352ec2b5a578472899f07156a34b76f2';
const REDIRECT_URI = 'http://my-playlist.surge.sh/';


let Spotify = {

  getAccessToken() {
    let href = window.location.href;
    if(userToken) {
      console.log("in user token");
      return userToken;
    }else if(href.match("access_token")) {
      console.log("in acc token");
      userToken = (href.match(/access_token=([^&]*)/))[1];
      let expiresIn = (href.match(/expires_in=([^&]*)/))[1];
      window.setTimeout(() => userToken = '', expiresIn * 100);
      window.history.pushState('Access Token', null, '/');
      return userToken;
    }// add else if for access denied!!
    else{
      console.log(REDIRECT_URI);
      window.location.assign(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=playlist-modify-public&response_type=token`);
    }
  },

  search(term) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
       {headers: { Authorization: `Bearer ${userToken}` }
       }
      ).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.tracks) {
           return jsonResponse.tracks.items.map(track => (
             {
             id: track.id,
             name: track.name,
             artist: track.artists[0].name,
             album: track.album.name,
             uri: track.uri
             })
          ); // map
         }; // if
    });
  },

  savePlaylist(playListName, tracks) {

    let access_token = userToken;
    let data = {name: playListName};
    let headers = { Authorization: `Bearer ${access_token}`
       };

    fetch(`https://api.spotify.com/v1/me`, {headers: headers}
      ).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.id) {
          return jsonResponse.id;
        } else { console.log("Error getting User Id") }
    }).then( userId => {
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        { method: 'POST',
          body: JSON.stringify(data),
          headers:
          { Authorization: `Bearer ${access_token}` ,
            'Content-type': 'application/json'
          }
        }
      ).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.id) {
         let playListId = jsonResponse.id;
         let userId = jsonResponse.owner.id;
         return [userId, playListId];
        }else { console.log("Error getting Playlist Id") }
      }).then( playListRef  => {
        fetch(`https://api.spotify.com/v1/users/${playListRef[0]}/playlists/${playListRef[1]}/tracks`,
        { method: 'POST',
          body: JSON.stringify({uris: tracks}),
          headers:
          { Authorization: `Bearer ${access_token}` ,
            'Content-type': 'application/json'
          }
        }
      ).then(response => {
        return response.json();
      }).then(jsonResponse => {
        console.log(jsonResponse);
        if (jsonResponse.snapshot_id) {
         console.log("Song are succesfully added to the playlist!");
         }
        })
      })

    })


  },


};



export default Spotify;

// https://accounts.spotify.com/authorize?client_id=352ec2b5a578472899f07156a34b76f2&redirect_uri=http://localhost:3000/&scope=user-read-private%20user-read-email&&response_type=token