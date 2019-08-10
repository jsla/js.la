const html = require('nanohtml')
const find = require('lodash.find')

window.videoCards = function (target, events) {
  window.addEventListener('hashchange', () => render(target, events))

  render(target, events)
}

function render (target, events) {
  target.innerHTML = ''

  const route = window.location.hash.replace('#/', '')
  if (!route) return renderMenu(target, events)

  const [eventDate, cardType, i] = route.split('/')
  const event = find(events, event => event.date === eventDate)

  console.log('eventDate', eventDate)
  console.log('cardType', cardType)
  if (cardType === 'sponsors') return renderSponsors(target, event)
  if (cardType === 'speakers') return renderSpeaker(target, event.speakers[i])

  renderMenu(target, events)
}

function renderMenu (target, events) {
  const menu = events
    .sort((a, b) => a.date < b.date ? 1 : -1)
    .map(eventToLinks)

  target.appendChild(html`
    <div>
      <ul>
        ${menu.map(link => html`<li>${link}</li>`)}
      </ul>
    </div>
  `)
}

function renderSponsors (target, event) {
  const sponsors = [event.host].concat(event.sponsors)
  target.appendChild(html`
    <div class='card'>
      ${sponsors.map(s => html`
        <div class='sponsor' style='
          width: 500px;
          height: 200px;
          background: white;
          background-repeat: no-repeat;
          background-image: url(${s.logo});
          background-position: center;
          background-size: contain;
        '></div>
      `)}
    </div>
  `)
}

function renderSpeaker (target, speaker) {
  target.appendChild(html`
    <div class='card'>
        <div class='avatar' style='background-image: url(${speaker.avatar});'
        ></div>
        <div class='info'>
          <h1>${speaker.name}</h1>
          <h2>${speaker.title}</h2>

          <div class='twitter'>
            <div class='icon'><img src='twitter.svg' /></div>
             ${speaker.twitter.replace('@', '')}
          </div>
          <div class='github'>
            <div class='icon'><img src='github.svg' /></div>
            ${speaker.github.replace('@', '')}
          </div>
        </div>
    </div>
  `)
}

function eventToLinks (event) {
  return html`
    <div>
      <h3>${dateToReadable(new Date(event.date))}</h3>
      <ul>
        ${event.speakers.map((s, i) => html`
          <li><a href='#/${event.date}/speakers/${i}'>${s.name}</a></li>
        `)}
        <li><a href='#/${event.date}/sponsors'>Sponsors</a></li>
      </ul>

    </div>

  `
}

function dateToReadable (d) {
  var date = d.getUTCDate()

  var suffixes = { 1: 'st', 2: 'nd', 3: 'rd' }
  var suffix =
    date > 3 && date < 21
      ? 'th'
      : suffixes[parseFloat(date.toString().slice(-1)[0])] || 'th'

  return (
    getDOWs()[d.getUTCDay()] +
    ' ' +
    getMonths()[d.getUTCMonth()] +
    ' ' +
    date +
    suffix +
    ', ' +
    (1900 + d.getYear()) +
    ' 7PM'
  )
}

function getDOWs () {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
}

function getMonths () {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
}
