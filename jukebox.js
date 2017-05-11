/* globals $, SC */
var Jukebox = {
	activeSong: null,
	volume: 100,
	isPlaying: false,
	dom: {},
	currentIndex: 0,
	songs: [],

	start: function() {
		SC.initialize({ client_id: "fd4e76fc67798bfa742089ed619084a6" });

		this.dom = {
			back: $(".back"),
			play: $(".play"),
			pause: $(".pause"),
			stop: $(".stop"),
			forward: $(".forward"),
			sound: $(".sound"),
			songs: $(".display"),
			upload: $(".upload input"),
			input: $(".input"),
			add: $(".add"),
		};
		this.addSong("01_nikes.mp3", {
			title: "This is Nikes",
			artist: "Frank Ocean",
		});
		this.addSong("02._have_some_love.mp3", {
			title: "Have Some Love",
			artist: "Donald",
		});
		this.change(this.songs[0]);

		this.render();
		this.hearing();
	},

	addSong: function(file, meta) {
		var song = new FileSong(file, meta);
		this.songs.push(song);
		this.render();
		return song;
	},


	hearing: function() {
		this.dom.back.on("click", function() {
			this.back();
		}.bind(this));
		this.dom.stop.on("click", this.stop.bind(this));
		this.dom.play.on("click", function(event) {
			this.play();
		}.bind(this));
		this.dom.pause.on("click", this.pause.bind(this));
		this.dom.forward.on("click", function() {
			this.forward();
		}.bind(this));
		this.dom.add.on("click", function() {
			var url = this.dom.input.val();
			var song = new CloudSong(url);
			console.log("loading soundcloud music");
			this.songs.push(song);
			var $song = song.render();
			this.dom.songs.append($song);
			this.render();
			return song;
		}.bind(this));
		this.dom.sound.on("click", function() {
			this.setVolume(0);
		}.bind(this));

		this.dom.upload.on("change", function() {
			var files = this.dom.upload.prop("files");
			console.log(files);

			for (var i = 0; i < files.length; i++) {
				var file = URL.createObjectURL(files[i]);
				this.addSong(file, {
					title: "Uploaded song",
					artist: "Unknown",
				});
			}
		}.bind(this));
	},

	render: function() {
	 		for (var i = 0; i < this.songs.length; i++) {
	 			var $song = this.songs[i].render();
	 			this.dom.songs.append($song);
			}
	},


	change: function(song) {
		if (this.activeSong) {
			this.activeSong.stop();
		}
		this.activeSong = song;
	},

	play: function(song) {
		console.log("its playing");
		if (song) {
			this.change(song);
		}
		if (!this.activeSong) {
			return false;
		}
		this.isPlaying = true;
		this.activeSong.play();
		this.activeSong.render();

		return this.activeSong;
	},


	pause: function() {
		console.log("Music paused");
		this.activeSong.pause();
	},

	stop: function() {
		console.log("Music stopped");
		this.activeSong.stop();
	},

	forward: function() {
		console.log("you are skipping");
		var id = this.songs.indexOf(this.activeSong);
		return this.change(this.songs[id + 1 % this.songs.length]);
	},
	back: function() {
		console.log("you are replaying song");
		var id = this.songs.indexOf(this.activeSong);
		return this.change(this.songs[id + 1 % this.songs.length]);
	},
	shuffle: function() {
		console.log("you are shuffling");
	},
};


class Song {
	constructor(file,meta) {
		this.file = file;
		this.meta = {};
		this.audio = null;
		this.$song = $("<div class='display-song'></div>");
	}
	render() {
		this.$song.html("");
		this.$song.append('<div class="display-song-title">' + this.meta.title + '</div>');
		this.$song.append('<div class="display-song-artist">'  + '<a href= ' + this.meta.user + '>' + this.meta.artist + '</div>');
		this.$song.append('<img class "soundcloud-image" src = ' + this.meta.image + '>');



		return this.$song;
	}
	play() {
		this.audio.play();
	}
	pause() {
		this.audio.pause();
	}
	stop() {
		this.audio.pause();
		this.audio.currentTime = 0;
	}
}

class CloudSong extends Song {
	constructor(url) {
		super ();
		SC.resolve(url)
		.then(function(song) {
			this.meta = {
				title: song.title,
				artist: song.user.username,
				image: song.artwork_url,
				user: song.permalink_url,
			};
			return song;
		}.bind(this))

				.then(function(song) {
					this.audio = new Audio(song.uri +
					"/stream?client_id=fd4e76fc67798bfa742089ed619084a6");
					this.render();
				}.bind(this))

				.catch(function(err) {
					if (err.status === 404)
						alert("Cant find this song");
					else {
						console.error(err);
						alert ("There is an Error with the system");
					}
				});
	}

}

class FileSong extends Song {
	constructor(file, meta) {
		super();
		this.file = file;
		this.meta = meta || {
			title: "Unknown title",
			artist: "Unknown artist",
		};
		this.audio = new Audio(file);
	}
}


$(document).ready(function() {
	Jukebox.start();
});
