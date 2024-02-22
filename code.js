function annotateAllMeetings() {
    const dryrun = false;
    // Define current date and next month's end date
    const today = new Date();
    const nextDays = new Date();
    nextDays.setDate(nextDays.getDate() + 14);

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
    // Define domain name and ignored emails
    const domainName = "example.com";

    //ignore auto added meeting AI, recording or notetaking Bots like gong etc.
    const ignoredEmails = ["example@assistant.gong.io", /* ... other ignored emails */];

    events.forEach(event => {
        const attendees = event.getGuestList(true);
        if (dryrun) {
            console.log(`event : ${event.getTitle()}\n`)
            attendees.forEach(attendee => {
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
            if (dryrun)
                console.log(`${meetingType} - ${event.getTitle()}\n\n`); // Log meeting details
            else
                event.setColor(colorMap[meetingType]);
        }
    });
}