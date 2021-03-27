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
const $select = d.getElementById('song-album-select');
const $errorMessage = d.getElementById('error-message');
const getLyrics = async () => {};
const getAlbum = async () => {
	try {
		const artistName = $artistUserValue.value.trim();
		const songName = $songUserValue.value.trim();
		// loader
		const res = await fetch(
			`${LASTFM_ALBUM_URL}&artist=${artistName}&album=${songName}&format=json`
		);
		const data = await res.json();
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
		} else {
			if (data.error === 6) {
				drawError({
					status: data.error,
					statusText: data.message,
				});
			} else {
				$errorMessage.innerHTML = '';
				$errorMessage.classList.add('none');

				// showInfo
			}
		}
	} catch (err) {
		// i think than the function never will come here cuz i delete el throw
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
	let message =
		error.statusText ||
		'Ocurrio un error al buscar el disco. Es posible que no hayamos encontrado un resultado';
	$errorMessage.innerHTML = `Error ${error.status} : ${message}`;
	$errorMessage.classList.remove('none');
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
