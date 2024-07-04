function annotateAllMeetings() {

  const dryrun = false;
  // Define current date and next month's end date
  const today = new Date();
  // const nextDays = new Date();
  // nextDays.setDate(nextDays.getDate() + 21);
  const nextDays = getEndOfWeekThreeWeeksFromNow();
  console.log(`${nextDays.getDate()}`)

  // Get all events between today and next month's end
  const events = CalendarApp.getDefaultCalendar().getEvents(today, nextDays);

  // Define color codes
  // see colors here https://lukeboyle.com/blog/posts/google-calendar-api-color-id
  const colorMap = {
    "One-on-One": "10",
    "Team": "5",
    "External": "3",
    "Block": "8",
    "Uncategorized": "7"
  };

  // Define domain name and ignored emails
  const domainName = "nexla.com";
  const ignoredEmails = ["nexla@assistant.gong.io", "c_1883q59a1dh1mjifm844hqn333bcc@resource.calendar.google.com", "c_188dno8hkhd1oiv9l11jo0n76n9s6@resource.calendar.google.com", "c_18891arfptr4ch70mgl1at0b06ree@resource.calendar.google.com"];


    events.forEach(event => {
      const attendees = event.getGuestList(true);
      if(dryrun) {
        console.log(`event : ${event.getTitle()}\n`)
        attendees.forEach( attendee=>{
            console.log(`${attendee.getEmail()}`)
        })
      };
        
      const filteredAttendees = attendees.filter(a => a.getEmail() !== Session.getActiveUser().getEmail() && !ignoredEmails.includes(a.getEmail()));
  
      // Check for meeting type based on attendee count and domain
      let meetingType;
      if (filteredAttendees.length === 0) {
        meetingType = "Block";
      } else if (filteredAttendees.length === 1 && filteredAttendees.every(a => a.getEmail().endsWith(domainName))) {
        meetingType = "One-on-One";
      } else if (filteredAttendees.length > 1 && filteredAttendees.every(a => a.getEmail().endsWith(domainName))) {
         meetingType = "Team";
      } else if (filteredAttendees.length > 1 && filteredAttendees.some(a => !a.getEmail().endsWith(domainName))) { 
        meetingType = "External";
      } else {
        meetingType = "Uncategorized";
      }
  
      // Update event color based on meeting type
      if (meetingType) {
        if(dryrun)
          console.log(`${meetingType} - ${event.getTitle()} : ${event.getColor()}: ${event.getVisibility()}\n\n`); // Log meeting details
        else
          
          if(event.getVisibility() != "PUBLIC")
            event.setColor(colorMap[meetingType]);
          console.log(`${meetingType} - ${event.getTitle()} : ${colorMap[meetingType]} : ${event.getColor()}: ${event.getVisibility()}\n\n`);
      }
    });
}

function getEndOfWeekThreeWeeksFromNow() {
  // Get the current date
  var today = new Date();
  
  // Calculate the date three weeks from now
  var threeWeeksFromNow = new Date(today);
  threeWeeksFromNow.setDate(today.getDate() + 21);
  
  // Calculate the day of the week (0 = Sunday, 6 = Saturday)
  var dayOfWeek = threeWeeksFromNow.getDay();
  
  // Calculate the difference to the next Sunday
  var daysToEndOfWeek = 6 - dayOfWeek;
  
  // Get the date of the next Sunday
  var endOfWeek = new Date(threeWeeksFromNow);
  endOfWeek.setDate(threeWeeksFromNow.getDate() + daysToEndOfWeek);
  
  // Return the end of the week date
  return endOfWeek;
}
