const d = document;

const $ul = d.getElementById('ul');
const $artistUserValue = d.getElementById('artist-input');
const $songUserValue = d.getElementById('song-input');
const $form = d.getElementById('form');
const $submitBtn = d.getElementById('submitBtn');
const $lyrics = d.getElementById('lyrics');
const LASTFM_KEY = 'f0ad510d53e346996bede562a182ab55';
const LASTFM_ALBUM_URL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}`;

const $select = d.getElementById('info-select');
const drawInfo = (data) => {};

const getLyrics = async () => {
	try {
	} catch {}
};
const getAlbum = async () => {
	try {
		const artistName = $artistUserValue.value;
		const songName = $songUserValue.value;
		if ($select.value === 'album') {
			const res = await fetch(
				`${LASTFM_ALBUM_URL}&artist=${artistName}&album=${songName}&format=json`
			);
			const data = await res.json();
			console.log(data);
		}
	} catch (error) {
		console.log(error, 'error------------');
	}
};
const checkQuery = () => {
	if ($select.value !== 'album') {
		getLyrics();
	} else {
		getAlbum();
	}
};
const drawError = () => {
	console.log(
		'hubo un error,revisa que hayas elegido un disco o que hayas puesto el artista'
	);
};
const disableFirstOption = () => {
	$select.addEventListener('change', () => {
		$select.firstElementChild.disabled = true;
	});
};
$form.addEventListener('submit', (e) => {
	if ($select.value === 'undefined' || $artistUserValue.value === '') {
		drawError();
	}
	e.preventDefault();
	getAlbum();
});

d.addEventListener('DOMContentLoaded', () => {
	disableFirstOption();
});
