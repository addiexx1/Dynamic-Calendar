//date = current date
const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//set each cell in the calendar with an id = (year-monthIndex-day) and use idArr to collect the data
let idArr = [];
const eventArray = [];

function Calendar(){

  document.querySelector(".monthYear h1").innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
  document.querySelector(".monthYear p").innerHTML = new Date().toDateString();
  //prev month properties
  const prev =  new Date(date.getFullYear(), date.getMonth(), 0);
  const prevLastDay = prev.getDate();
  const prevMonth = prev.getMonth();
  const prevMonthYear = prev.getFullYear();

  //the last day of the current month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
 
  //+= additional assignment to days
  let days = "";
  //the weekday of the 1st day of current month to determine # of days in the prev month
  date.setDate(1);
  const firstDayIndex = date.getDay();

  idArr = [];

  //days in the prev month
  for (let d = firstDayIndex-1; d >= 0; d--) {
    days += `<div class="prev-date day"><a href="#" id ="${prevMonthYear}-${prevMonth}-${prevLastDay - d}" onclick = "addEventList(this)">${prevLastDay - d}</a></div>`;
    idArr.push(`${prevMonthYear}-${prevMonth}-${prevLastDay - d}`);
  }

  //days in the current month
  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
      days += `<div class="today day"><a href="#" id ="${date.getFullYear()}-${date.getMonth()}-${i}" onclick="addEventList(this)">${i}</a></div>`;
    } 
    else {
      days += `<div class="day"><a href="#" id ="${date.getFullYear()}-${date.getMonth()}-${i}" onclick="addEventList(this)">${i}</a></div>`;

    }
    
    idArr.push(`${date.getFullYear()}-${date.getMonth()}-${i}`); 
  }

  //days in the next month
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const nextMonth = next.getMonth();
  const nextMonthYear = next.getFullYear();
  const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  const nextDays = 7 - 1 - lastDayIndex;

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date day"><a href="#" id ="${nextMonthYear}-${nextMonth}-${j}" onclick="addEventList(this)">${j}</a></div>`;
    idArr.push(`${nextMonthYear}-${nextMonth}-${j}`); 
  }
  const monthDays = document.querySelector(".days");
  monthDays.innerHTML = days;

  asterisk();

};

document.querySelector(".monthYear p").addEventListener("click", () => {
  date.setMonth(new Date().getMonth())
  date.setFullYear(new Date().getFullYear());
  Calendar();
});

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  Calendar();
});

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  Calendar();
});


Calendar();

let currentLink = "";
let dayDiv = document.querySelector(".today");

//when clicking the date on the calendar will allow user to add & view event(s)
function addEventList (lnk){
  viewEventList (lnk);
  //remove border from last selected date
  dayDiv.style.border ="";
  currentLink = lnk;
  dayDiv = lnk.parentNode;

  //show border for selected date
  dayDiv.style.border ="2px solid #888";

  //display the selected date and the event input
  const idArray = currentLink.id.split("-");
  const selectDate = new Date(idArray[0],idArray[1],idArray[2]);
  document.getElementById("dateDisplay").innerHTML = "Add an event for " + selectDate.toDateString();
  document.getElementById("inputContainer").style.display = "block";

}

let cell = document.getElementById(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);

function addEventTxt(){
  linkID = currentLink.id; //year-month-day
  const eventList = new Object();

  //eventList Object with keys as year-month-day, each one is an obejct with 3 keys
  eventList[linkID]={
    startTime: document.querySelector("#eventTimeStart").value,
    endTime: document.querySelector("#eventTimeEnd").value,
    desc: document.querySelector("#descTxt").value
  };
  //store into event Array
  eventArray.push(eventList);

  document.querySelector("#eventTimeStart").value = "";
  document.querySelector("#eventTimeEnd").value = "";
  document.querySelector("#descTxt").value = "";

  asterisk();
  viewEventList (currentLink);

}

// add an underline for the date that has at least one event
function asterisk(){

  for (let i = 0; i<idArr.length;i++){

    for (let j = 0; j<eventArray.length; j++){
      var keyNames = Object.keys(eventArray[j]);

      if (idArr[i] == keyNames[0]){
        document.getElementById(`${idArr[i]}`).style.textDecoration = "underline" ;
      }
    }
  }

}

function doneEvent(){
	currentLink = "";
	document.querySelector("#inputContainer").style.display = "none";
	
}

function viewEventList (lnk){
  linkID = lnk.id;
  const idArray = linkID.split("-");
  const selectDate = new Date(idArray[0],idArray[1],idArray[2]);

  //repalce the old event list
  var showEvent = document.querySelector(".showEvent");
  var oldEvent = document.querySelector(".eventList");
  var eventList = document.createElement("DIV");
  eventList.className = "eventList";
  showEvent.appendChild(eventList);
  showEvent.replaceChild(eventList,oldEvent);

  //show selected date
  var dateDiv = document.createElement("H1");
  dateDiv.className = "showDate";
  var dateTxt = document.createTextNode(selectDate.toDateString());
  dateDiv.appendChild(dateTxt);
  eventList.appendChild(dateDiv);

  //show event count
  let eventCount = 0;
  for (let i = 0; i<eventArray.length; i++){
    var keyNames = Object.keys(eventArray[i]);
    if (keyNames[0] == linkID){
      eventCount++;
    }
  }
  var eventCountTxt = document.createTextNode(`You have ${eventCount} event(s)`);
  eventList.appendChild(eventCountTxt);
  

  //show events
  for (let i = 0; i<eventArray.length; i++){
    var keyNames = Object.keys(eventArray[i]);
    if (keyNames[0] == linkID){
      var eventObj = eventArray[i][linkID];
      var eventKeys = Object.keys(eventObj);
      var eventDivTxt = document.createTextNode(`From ${eventObj[eventKeys[0]]} to ${eventObj[eventKeys[1]]} :  ${eventObj[eventKeys[2]]}`);
      var eventDiv = document.createElement("DIV");
      eventDiv.appendChild(eventDivTxt);
      eventList.appendChild(eventDiv);
    }
  }
}
