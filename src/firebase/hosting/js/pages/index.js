import { logStartButtonClickEvent } from '../common/firebase.js';

const messengerUrl = 'https://m.me/vogadubot';

$('.start-button').click(function () {
	const id = $(this).attr('id');
	logStartButtonClickEvent(id);

	window.open(messengerUrl, '_blank');
});