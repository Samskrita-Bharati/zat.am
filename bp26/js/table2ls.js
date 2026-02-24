var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
var weekdays   = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
weekdays = ["सोमवासरः", "मङ्गलवासरः", "बुधवासरः", "गुरुवासरः", "शुक्रवासरः", "शनिवासरः", "रविवासरः"]
var symbols = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९','१०', '११', '१२', '१३', '१४', '१५', '१६', '१७', '१८', '१९','२०', '२१', '२२', '२३', '२४', '२५', '२६', '२७', '२८', '२९','३०','३१'];
const urlParams = new URLSearchParams(window.location.search);
var o = urlParams.get('oks');
if (o!="aam")
{
var today  = new Date()
}
else
{
var today = new Date(2026,09,30,00,00,00);
}
var months = []

function generateCalendar (eventData) {
	var mydata = eventData.data
mydata = mydata.sort(function(a, b) { return (new Date(a.startdate)) - (new Date(b.startdate)) })
  generateAllTheMonths(mydata)
  mydata.forEach(function (event) {
    appendEvent(event)
  })

  // Highlight today
  $('#' + formattedDate(today)).removeClass('no-event').addClass('today')
  $(".no-event").hide();
  $("a:contains(शब्दावली)").css("background-color","yellow");
  addMonthMenu()
}

function addMonthMenu() {
	// return false; //hht - for july only - just one month hence
  $('#calendar-goes-here').prepend('<li id="cal-controls">')
  $('.month-table').each(function(_, table) {
    var month = $(table).data('month')
    $('#cal-controls').append('<a class="month-menuitem" data-target="' + month + '" href="#' + month + '">' + month + '</a>')
  })

  $(document).on('click', '.month-menuitem', function(e) {
    $('[data-month]').hide()
    $('[data-month="' + $(this).data('target') + '"]').show()
    $(this).addClass('active').siblings().removeClass('active')
    e.preventDefault()
  })

  // Get current month and click it
  var currentMonth = $('[data-target=' + (new Date()).getFullYear() + "-"  + monthNames[(new Date()).getMonth()] + ']')
  if( currentMonth.length ) {
    currentMonth.click()
  } else {
    $('[data-target]').first().click()
  }
}

function appendEvent( event ) {
  var eventStartDate = new Date(event.startdate)
  var eventEndDate   = new Date(event.enddate)
  if (event.weekday =="s")
  {
	  if( o == "aam")
  {
	  var eventElement   = $('<li class="event pastd oks"><a target="bp26" href="' + event.tickets + event.location + '">' + event.name + " - " + event.time + '</a></li>');
	    $('#' + formattedDate(eventStartDate)).removeClass('no-event').append(eventElement)
  }
  }
    else {
	if (eventStartDate < today)
	{
	  var eventElement = $('<li class="event pastd"><a target="bp26" href="' + event.tickets + event.location + '">' + event.name + " - " + event.time + '</a></li>')
	}
	  else
	  {
		var eventElement = $('<li class="event">' + event.name + " - " + event.time + '</li>')
	  }
	}


  $('#' + formattedDate(eventStartDate)).removeClass('no-event').append(eventElement)
}

function generateAllTheMonths( eventData ) {
  var dates = []
  var months = []

  eventData.forEach(function(event) {
    if (event.startdate) dates.push(event.startdate)
    if (event.enddate) dates.push(event.enddate)
  })

  dates.forEach(function (date) {
    date = new Date(date)
    if(months.indexOf(date.getFullYear().toString() + date.getMonth()) < 0) {
      months.push(date.getFullYear().toString() + date.getMonth())
      generateMonthTable(date)
    } else {
    }
  })
}

function generateMonthTable( date ) {
  var eventMonthName = monthNames[date.getMonth()]
  var monthTable     = $('<ul cellspacing=0 class="month-table" data-month="' + date.getFullYear() + "-"  + eventMonthName + '" id="month-' + date.getMonth() + '"></ul>')
  var monthTableBody = monthTable.append('<tbody>')
  // var today          = new Date()
  var endOfToday     = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 00, 00, 00)
  var firstDay       = new Date(date.getFullYear(), date.getMonth(), 1)
  var numberOfDays   = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  var weekDayNumber  = firstDay.getDay()

  $('#calendar-goes-here').append(monthTable)
  monthTable.before('<h2 data-month="' + date.getFullYear() + '-' + eventMonthName + '">' + eventMonthName + ' ' + date.getFullYear() + '</h2>')

/*
  // Add month calendar header
  monthTableBody.append('<tr class="header"></tr>')
  var headerRow = monthTableBody.find('.header')
  loopForTimes( 7, function(i) {
    
//	if ((i+1)%7==0) 
//		headerRow.append('<td class="sun"><strong>' + weekdays[i] + '<strong></td>')
//	else 
			headerRow.append('<td><strong>' + weekdays[i] + '<strong></td>')
  })
*/
  // Add empty days from previous month
/*
  var times = weekDayNumber == 0 ? 6 : weekDayNumber - 1
  loopForTimes( times, function() {
    getFirstAvailableRow(monthTable).append('<td class="empty"></td>')
 })
*/
  // Filling the month with days
  loopForTimes( numberOfDays, function(daynumber) {
    var thisDay = new Date(date.getFullYear(), date.getMonth(), (daynumber + 1))
    var id = formattedDate(thisDay)
    var pastClass = endOfToday > thisDay ? "past" : ""
    getFirstAvailableRow(monthTableBody).append('<ul class="no-event ' + pastClass + '" id=' + id + '><li class=day>'+ symbols[daynumber + 1] +'</li></ul>')
  })

/*
  // Add empty days from next month
  var lastRow = monthTable.find('tr:last')
  var cellsInLastRow = lastRow.find('td').length
  // Check if this is necessary
  if ( cellsInLastRow < 7 ) {
    loopForTimes( (7 - cellsInLastRow), function() {
      lastRow.append('<td class="empty"></td>')
    })
  }
*/
}

// Because I don't like ot write for()
function loopForTimes( times, callback ) {
  for( var i=0; i < times; i++ ){
    callback(i)
  }
}

// This is handy: getting the first row with available cell space
function getFirstAvailableRow( table ) {
  var row = table.find('tr.days').filter(function(i, thisRow) {
    return ($(thisRow).find('td').length) < 7
  })
  // If no available row, create a new one
  if( row.length == 0 ) {
    table.append('<tr class=days>')
    var row = table.find('tr').last()
  }
  return row
}

// Create an unique date string for cell lookup
function formattedDate( date ) {
  return date.getFullYear() + '-' + monthNames[date.getMonth()] + '-' + date.getDate()
}
