/* globals $ */
var Jukebox = {
	songs: [],
	activeSong: null,
	volume: 100,
	isPlaying: false,
	dom: {},
	currentIndex: 0,

	start: function() {
		this.dom = {
			back: $(".back"),
			play: $(".play"),
			pause: $(".pause"),
			stop: $(".stop"),
			forward: $(".forward"),
			sound: $(".sound"),
			songs: $(".display"),
			upload: $(".upload input"),
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

	addSong: function(path) {
		var song = new Song(path);
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
		console.log("you are pausing");
		this.activeSong.pause();
	},

	stop: function() {
		console.log("you are stopping");
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
	constructor(file, meta) {
		this.file = file;
		this.audio = new Audio(file);
	}
	render() {
		return $("<div class='display-song'>" + this.file + "</div>");
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

$(document).ready(function() {
	Jukebox.start();
});
