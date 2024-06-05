import { logStartButtonClickEvent, logReadMoreButtonClickEvent } from '../common/analytics.js';

function animateText(selector, textArray, itemIndex, characterIndex, callback) {
  const speed = 80;

  if (itemIndex == textArray.length) {
    $(`${selector} .cursor`).hide()

    callback();

    return;
  }

  if (characterIndex == textArray[itemIndex].text.length) {
    animateText(selector, textArray, itemIndex + 1, 0, callback);

    return;
  }

  let character = textArray[itemIndex].text.charAt(characterIndex);

  if (textArray[itemIndex].isBold) {
    character = `<span class="bold">${character}</span>`
  }

  $(`${selector} .cursor`).before(character);

  setTimeout(animateText, speed, selector, textArray, itemIndex, characterIndex + 1, callback);
}

$(document).ready(function () {
  const text = [
    {
      text: 'Hi there! This is ',
      isBold: false
    },
    {
      text: 'Vogadu',
      isBold: true
    },
    {
      text: '!',
      isBold: false
    }
  ]

  animateText('.hero .animation-container h1', text, 0, 0, function () {
    const speed = 2000;

    $('.hero h2').fadeIn(speed);
    $('.hero p').fadeIn(speed);
    $('.hero .start-button').fadeIn(speed);

    setTimeout(function () {
      $('.hero .read-more-button').fadeTo(0, 1);
    }, speed / 2);
  });
});

$('.start-button').click(function () {
  const buttonId = $(this).attr('id');
  logStartButtonClickEvent(buttonId);

  const messengerUrl = 'https://m.me/vogadubot?text=Get%20started%21';
  window.open(messengerUrl, '_blank');
});

$('.read-more-button').click(function () {
  logReadMoreButtonClickEvent();

  const $featuresSection = $('#features');

  if ($featuresSection.length) {
    $featuresSection[0].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});