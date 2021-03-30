const d = document;

const $queryAlbumSongResult = d.getElementById('query-result');
const $songTemplate = d.getElementById('lyrics-template').content;
const $albumTemplate = d.getElementById('query-result-template').content;
const $artistUserValue = d.getElementById('artist-input');
const $songUserValue = d.getElementById('song-input');
const $form = d.getElementById('form');
const $submitBtn = d.getElementById('submitBtn');
const $lyrics = d.getElementById('lyrics');
const LASTFM_KEY = 'f0ad510d53e346996bede562a182ab55';
const LASTFM_ALBUM_URL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}`;
const NO_CONTENT_ERROR = 204;
const noContentErrorText =
	'Por favor revisa el casillero artista,cancion y album.';
const $select = d.getElementById('song-album-select');
const $errorMessage = d.getElementById('error-message');
// draw lyrics info-api.lyrics.ovh
const drawLyrics = (data) => {
	const $fragment = d.createDocumentFragment();

	$songTemplate.querySelector('.lyrics').innerHTML = data.lyrics;
	$fragment.appendChild($songTemplate);
	$queryAlbumSongResult.appendChild($fragment);
};
// draw album info-lastfm api
const drawArtistInfo = (data) => {
	// stop duplicate template
	if (d.querySelector('.query-result')) {
		document.querySelector('.query-result').remove();
	}
	const info = data.album;
	let tracks = '';
	let tags = '';
	const fragment = d.createDocumentFragment();

	$albumTemplate.querySelector('.artist-img').src = `${info.image[3]['#text']}`;
	$albumTemplate.querySelector('.song-album-wiki').innerHTML =
		info.wiki.content;
	info.tracks.track.forEach((el) => {
		const trackDuration = `${Math.floor(el.duration / 60)}:${(
			'0' +
			(el.duration % 60)
		).slice(-2)}`;

		tracks += `
			<li> 
				<div class="album-track-ctn">
					<a href=${el.url} target="_blank">${el.name}</a>
					<span>${trackDuration}</span>
				</div>
			</li>`;
	});
	$albumTemplate.querySelector('.song-album-tracks').innerHTML = tracks;
	info.tags.tag.forEach((el) => {
		tags += `
			<li class="tag-li"> 
				<a href=${el.url} target="_blank">- ${el.name} -</a>
			</li>`;
	});
	$albumTemplate.querySelector('.tags').innerHTML = tags;
	$albumTemplate.querySelector(
		'.song-album-title-a'
	).innerHTML = `${info.name} - ${info.artist}`;
	$albumTemplate.querySelector('.song-album-title-a').href = info.url;
	$albumTemplate.querySelector('.song-album-title-a').target = '_blank';

	const $clone = $albumTemplate.cloneNode(true);
	fragment.appendChild($clone);
	$queryAlbumSongResult.appendChild(fragment);
};
const getLyrics = async () => {
	try {
		const artistName = $artistUserValue.value.trim();
		const songName = $songUserValue.value.trim();
		$queryAlbumSongResult.insertAdjacentHTML(
			'afterbegin',
			'<img class="loader" alt="loader" src="../img/loader.svg"></img>'
		);
		const res = await fetch(
			`https://api.lyrics.ovh/v1/${artistName}/${songName}`
		);
		const data = await res.json();
		d.querySelector('.loader').remove();
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
			$errorMessage.innerHTML = '';
			$errorMessage.classList.add('none');

			drawLyrics(data);
			saveLastQueryLS(artistName, songName, $select.value);
		}
	} catch (err) {
		if (d.querySelector('.loader')) {
			d.querySelector('.loader').remove();
		}
		drawError(err);
		console.log(err);
	}
};
const saveLastQueryLS = (artist, album, selection) => {
	localStorage.setItem('artist', artist);
	localStorage.setItem('album', album);
	localStorage.setItem('selection', selection);
};
const setLastQueryLS = () => {
	if (
		localStorage.getItem('artist') ||
		localStorage.getItem('album') ||
		localStorage.getItem('selection')
	) {
		$artistUserValue.value = localStorage.getItem('artist') || '';
		$songUserValue.value = localStorage.getItem('album') || '';
		$select.value = localStorage.getItem('selection') || 'undefined';
	}
};

const getAlbum = async () => {
	try {
		const artistName = $artistUserValue.value.trim();
		const albumName = $songUserValue.value.trim();
		$queryAlbumSongResult.insertAdjacentHTML(
			'afterbegin',
			'<img class="loader" alt="loader" src="../img/loader.svg"></img>'
		);

		const res = await fetch(
			`${LASTFM_ALBUM_URL}&artist=${artistName}&album=${albumName}&format=json`
		);
		const data = await res.json();

		d.querySelector('.loader').remove();
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

				drawArtistInfo(data);
				saveLastQueryLS(artistName, albumName, $select.value);
			}
		}
	} catch (err) {
		console.log(err);

		// i think than the function never will come here cuz i delete el throw
		// res will always respond ok. it may not bring any album but a object with 'Not found album' :|
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
		'Ocurrio un error al buscar el disco/cancion. Es posible que no hayamos encontrado un resultado';
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
	setLastQueryLS();
});
