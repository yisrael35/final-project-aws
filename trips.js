// Yisrael Bar, Lidor Eliyahu Shelef

let tripsArray = []
const br = $('<br>')
let saveId = -1

let loadPage = function () {
  $('#editTrip').hide()
  getTrips()
}
$(document).ready(loadPage)

//make an ajax call to get from the server all the trips
const getTrips = async () => {
  tripsArray = await getDataFromServer()
  displayTrips()
}
//display on screen all the trips in a list with buttons that display/edit
const displayTrips = () => {
  $('#displayTrips').empty()
  $('#displayTrip').empty()
  closeUpdate()
  let allTrips = $('<table></table>')
  for (const trip of tripsArray) {
    const { id, title, start_date } = trip
    let singleTrip = $('<tr></tr>').attr('class', 'singleTrip')
    const tripClass = id
    let tripName = $('<td></td>')
      .attr('class', tripClass)
      .text(title + '  ')
    let tripDate = $('<td></td>')
      .attr('class', tripClass)
      .text(start_date + '  ')
    let tdDisplayTrip = $('<td></td>')
    let displayTripBt = $('<button></button>').text("Display trip").attr('class', tripClass).attr('name', 'custom-btn').attr('id', 'btn-screen-down')
    tdDisplayTrip.append(displayTripBt)
    let tdTripBt = $('<td></td>')
    let editTripBt = $('<button></button>').text('Edit').attr('class', tripClass).attr('name', 'custom-btn').attr('id', 'btn-slide-right')
    tdDisplayTrip.append(editTripBt)
    displayTripBt.click(displayTrip)
    editTripBt.click(editTrip)

    singleTrip.append(tripName)
    singleTrip.append(tripDate)
    singleTrip.append(tdDisplayTrip)
    singleTrip.append(tdTripBt)
    allTrips.append(singleTrip)
  }
  $('#displayTrips').append(allTrips)
}

//when clicking on a trip - display on screen the trip details
const displayTrip = (event) => {
  let hideDetails = $('<button></button>').text('Hide Details').attr('name', 'custom-btn').attr('id', 'btn-screen-down')
  hideDetails.click(hideTripDetails)
  $('#displayTrip').empty()
  closeUpdate()

  let tripId = event.target.className
  const trip = tripsArray.find((e) => e.id == tripId)
  const { id, title, start_date, duration, price, guide_name, guide_email, guide_phone, site_name, site_country } = trip

  let displaySingleTrip = $('<div></div>').attr('class', 'displaySingleTrip')

  let br = $('<br>')
  let tripName = $('<br><div></div><br>').text('Trip title: ' + title)
  let startDate = $('<div></div>').text('Start date: ' + start_date)
  let tripDuration = $('<div></div>').text('Duration: ' + duration + ' Days')
  let tripPrice = $('<div></div>').text('Price: ' + price)
  let guideName = $('<div></div>').text('Guide name: ' + guide_name)
  let guideEmail = $('<div></div>').text('Guide email: ' + guide_email)
  let guidePhone = $('<div></div>').text('Guide phone: ' + guide_phone)
  let siteName = $('<div></div>').text('Site name: ' + site_name)
  let siteCountry = $('<div></div>').text('Site country: ' + site_country)

  displaySingleTrip.append(br)
  displaySingleTrip.append(tripName)
  displaySingleTrip.append(startDate)
  displaySingleTrip.append(tripDuration)
  displaySingleTrip.append(tripPrice)
  displaySingleTrip.append(br)
  displaySingleTrip.append(guideName)
  displaySingleTrip.append(guideEmail)
  displaySingleTrip.append(guidePhone)
  displaySingleTrip.append(br)
  displaySingleTrip.append(siteName)
  displaySingleTrip.append(siteCountry)
  displaySingleTrip.append(br)
  displaySingleTrip.append(hideDetails)

  $('#displayTrip').append(displaySingleTrip)
}

//hide the edit trip fields when not needed
const closeUpdate = () => {
  $('#editTrip').hide()
}
//put in the edit trip fields the trip content
const editTrip = (event) => {
  let tripId = event.target.className
  const trip = tripsArray.find((e) => e.id == tripId)
  const { id, title, start_date, duration, price, guide_name, guide_email, guide_phone, site_name, site_country } = trip

  $('#displayTrip').empty()
  $('#displayDate').empty()
  $('#editTrip').show()
  $('#id_field').text(id)
  $('#title').text(title)
  $('#start_date').val(start_date)
  $('#duration').val(duration)
  $('#price').val(price)
  $('#guide_name').val(guide_name)
  $('#guide_email').val(guide_email)
  $('#guide_phone').val(guide_phone)
  $('#site_name').val(site_name)
  $('#site_country').val(site_country)
}

//make an ajax call type put to update a trip
const updateTripRequest = () => {
  $('#trip_form').submit(async function (event) {
    if (!$('#trip_form').valid()) return

    const updatedTrip = {
      id: $('#id_field').text(),
      title: $('#title').text(),
      start_date: $('#start_date').val(),
      duration: $('#duration').val(),
      price: $('#price').val(),
      guide_name: $('#guide_name').val(),
      guide_email: $('#guide_email').val(),
      guide_phone: $('#guide_phone').val(),
      site_name: $('#site_name').val(),
      site_country: $('#site_country').val(),
    }
    updateTripInServer(updatedTrip)

    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault()
  })
}

//hide the trip details section
const hideTripDetails = () => {
  $('#displayTrip').empty()
}

// https://final-project.auth.eu-west-3.amazoncognito.com/login?client_id=25qrckh5ur16ob6uf2hh1c3hvg&response_type=code&scope=openid&redirect_uri=https://final-prject-shay-tavor.yisraelbar.xyz/
const end_point_url = ` https://e9qlqol48c.execute-api.eu-west-3.amazonaws.com/v0`
const getDataFromServer = async () => {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(xhttp.responseText)
        return resolve(res.items)
      }
    }
    xhttp.open('GET', end_point_url, true)
    xhttp.send()
  })
}

const updateTripInServer = async (data) => {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = async function () {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(xhttp.responseText)
        alert(res.message)
        getTrips()
        closeUpdate()
        return resolve(res)
      }
    }
    xhttp.open('PUT', end_point_url, true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(data))
  })
}

const createTripRequest = () => {
  $('#trip_form').submit(async function (event) {
    const createTripData = {
      title: $('#title').val(),
      start_date: $('#start_date').val(),
      duration: $('#duration').val(),
      price: $('#price').val(),
      guide_name: $('#guide_name').val(),
      guide_email: $('#guide_email').val(),
      guide_phone: $('#guide_phone').val(),
      site_name: $('#site_name').val(),
      site_country: $('#site_country').val(),
    }
    createTripInServer(createTripData)
    // stop the form from submitting the normal way and refreshing the page
    event.preventDefault()
  })
}

const createTripInServer = async (data) => {
  data.id = tripsArray.length + 1
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = async function () {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(xhttp.responseText)
        alert(res.message)
        getTrips()
        location.href = "/index.html";
        return resolve(res)
      }
    }
    xhttp.open('POST', end_point_url, true)
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(data))
  })
}
