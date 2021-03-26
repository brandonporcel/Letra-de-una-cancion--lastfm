const d = document;

const $ul = d.getElementById('ul');
const $artistUserValue = d.getElementById('artist-input');
const $songUserValue = d.getElementById('song-input');
const $form = d.getElementById('form');
const $submitBtn = d.getElementById('submitBtn');
const $lyrics = d.getElementById('lyrics');
const LASTFM_KEY = 'f0ad510d53e346996bede562a182ab55';
const LASTFM_ALBUM_URL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}`;
const NO_CONTENT_ERROR = 204;
const noContentErrorText =
	'Por favor revisa el casillero artista,cancion y album. Gracias';
const $select = d.getElementById('info-select');

const getLyrics = async () => {};
const getAlbum = async () => {
	try {
		const artistName = $artistUserValue.value;
		const songName = $songUserValue.value;
		// loader
		const res = await fetch(
			`${LASTFM_ALBUM_URL}&artist=${artistName}&album=${songName}&format=json`
		);
		const data = await res.json();
		console.log(res);
		console.log(data);
		if (
			$select.value === 'undefined' ||
			$artistUserValue.value === '' ||
			$songUserValue.value === ''
		) {
			drawError({
				status: `${NO_CONTENT_ERROR}`,
				statusText: `${noContentErrorText}`,
			});
			console.log('le falto escreibirii algogogo');
		} else {
			if (data.error === 6) {
				drawError({
					status: data.error,
					statusText: data.message,
				});
			} else {
				if (d.getElementById('error-message')) {
					d.getElementById('error-message').innerHTML = '';
				}
			}
		}
	} catch (err) {
		console.log(err, 'ereoreoroea');
		drawError(err);
	}
};
const albumOrSongCheck = () => {
	$form.addEventListener('submit', (e) => {
		if (
			$select.value === 'undefined' ||
			$artistUserValue.value === '' ||
			$songUserValue.value === ''
		) {
			drawError({
				status: `${NO_CONTENT_ERROR}`,
				statusText: `${noContentErrorText}`,
			});
		}
		if ($select.value === 'album') {
			getAlbum();
		} else {
			getLyrics();
		}
		e.preventDefault();
	});
};

const drawError = (error) => {
	if (d.getElementById('error-message')) {
		d.getElementById('error-message').innerHTML = '';
	}
	const $errorMessage = d.createElement('h3');
	$errorMessage.id = 'error-message';
	let message =
		error.statusText ||
		'Ocurrio un error al buscar el disco. Es posible que no hayamos encontrado un resultado';
	$errorMessage.innerHTML = `Error ${error.status} : ${message}`;
	d.querySelector('.home-form').insertAdjacentElement(
		'afterend',
		$errorMessage
	);
};
const disableFirstOption = () => {
	$select.addEventListener('change', () => {
		$select.firstElementChild.disabled = true;
	});
};

d.addEventListener('DOMContentLoaded', () => {
	disableFirstOption();
	albumOrSongCheck();
});
