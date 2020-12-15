//starter code from https://api-university.com/blog/api-review-series-spotify-api-how-to-get-a-playlist/

var request = require("request");
//var userID = "pp";
var token = "Bearer";
var playlistUrl = "https://api.spotify.com/v1/me/playlists";


const spotifyConfig = require('./configs/spotifyAPI')
const apiKey = spotifyConfig.key


request({url:playlistUrl, headers:{"Authorization":token}}, function(err, res){
    if (res){
        var playlist = JSON.parse(res.body);
        console.log(playlist);
        var playlistUrl = playlist.items[0].href
        request({url:playlistUrl, headers:{"Authorization":token}}, function(err, res){
            if (res){
                var playlist = JSON.parse(res.body);
                playlist.tracks.foreach(function(track){
                    console.log(track.track.name);
                });
            }
        }       
    )}
})
