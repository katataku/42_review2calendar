const MY_QUERY = 'subject:(You have a new booking) ';

function main() {
  pickUpMessage(MY_QUERY, function (message) {
    parseFortyTow(message);
  });
}F

function pickUpMessage(query, callback) {
  const messages = getMail(query);

  for (var i in messages) {
    for (var j in messages[i]) {
      const message = messages[i][j];
      // starは処理済みとする
      if (message.isStarred()) break;

      callback(message);

      message.star()
    }
  }
}

function getMail(query) {
  var threads = GmailApp.search(query, 0, 5);
  return GmailApp.getMessagesForThreads(threads);
}

function createEvent(title, description, location, year, month, dayOfMonth,
  startTimeHour, startTimeMinutes, endTimeHour, endTimeMinutes) {

  const calendar = CalendarApp.getDefaultCalendar();
  const startTime = new Date(year, month - 1, dayOfMonth, startTimeHour, startTimeMinutes, 0);
  const endTime = new Date(year, month - 1, dayOfMonth, endTimeHour, endTimeMinutes, 0);
  const option = {
    description: description,
    location: location,
  }

  console.log("start time: " + startTime);
  console.log("end time: " + endTime);
  //カレンダーに登録
  const event = calendar.createEvent(title, startTime, endTime, option);
	//カレンダーに登録するときの色の設定
  event.setColor(CalendarApp.EventColor.PALE_BLUE);
}

// review日時取得
function parseFortyTow(message) {
  const strDate = message.getDate();
  const strMessage = message.getPlainBody();
  const strMessageSub = strMessage.split('\n');
  const strWord = strMessageSub[4].split(' ');

  //console.log(strMessage);
  //console.log(strMessageSub[4]);
  //console.log(strWord);
  
  var indexOfFrom = strWord.findIndex((element) => element == "from");
  var dataMonth = {January:1, February:2, March:3, April:4, May:5, June:6, July:7, August:8, September:9, October:10, November:11, December:12};
  const year = new Date().getFullYear();
  const month = dataMonth[strWord[indexOfFrom + 1]];
  const dayOfMonth = parseInt(strWord[indexOfFrom + 2], 10);
  var startTimeHour = parseInt(strWord[indexOfFrom + 4], 10);
  var startTimeMinutes = parseInt(strWord[indexOfFrom + 4].substr(3), 10);
  var needMinutes = parseInt(strWord[indexOfFrom + 6]) + 30;
  var endTimeHour;
  var endTimeMinutes;
  if (startTimeHour == 23 && startTimeMinutes + needMinutes >= 60){
    endTimeHour = 0;
    endTimeMinutes = startTimeMinutes + needMinutes - 60;
    }
  else if (startTimeMinutes + needMinutes >= 60){
    endTimeHour =  startTimeHour + 1;
    endTimeMinutes = startTimeMinutes + needMinutes - 60;
  }
  else
  {
    endTimeHour = startTimeHour;
    endTimeMinutes = startTimeMinutes + needMinutes;
  }

  createEvent("42review", "mailDate: " + strDate,
   "", year, month, dayOfMonth, startTimeHour, startTimeMinutes, endTimeHour, endTimeMinutes);
}
