import moment from 'moment';

function calculateTimeDifference(startDateTime, endDateTime) {
  const diffMilliseconds = endDateTime.diff(startDateTime);

  const duration = moment.duration(diffMilliseconds);

  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;

  return { hours, minutes };
}

function computeResolutionTime({
  businessHours,
  ticketCreatedOn,
  ticketClosedOn
}) {
  const startDateTime = moment(ticketCreatedOn, 'YYYY-MM-DD, h:mm A');
  const endDateTime = moment(ticketClosedOn, 'YYYY-MM-DD, h:mm A');

  let currentDateTime = startDateTime.clone();

  let hours = 0,
    minutes = 0;

  while (currentDateTime.isSameOrBefore(endDateTime, 'date')) {
    const day = currentDateTime.format('dddd').toUpperCase();
    const todayDate = currentDateTime.format('YYYY-MM-DD');
    if (Object.keys(businessHours).includes(day)) {
      const businessStartTime = moment(
        `${todayDate}, ${businessHours[day].startTime}`,
        'YYYY-MM-DD, HH:mm'
      );
      const businessEndTime = moment(
        `${todayDate}, ${businessHours[day].endTime}`,
        'YYYY-MM-DD, HH:mm'
      );

      const date1 = moment.min(businessEndTime, endDateTime);
      const date2 = moment.max(businessStartTime, startDateTime);

      const { hours: hrs, minutes: mins } = calculateTimeDifference(
        date2,
        date1
      );

      hours += hrs;
      minutes += mins;
    }

    currentDateTime.add(1, 'day');
  }

  console.log('Hours:', hours, '& Minutes:', minutes);
}

let businessHours = {
  MONDAY: {
    startTime: '9:00',
    endTime: '17:00'
  },
  TUESDAY: {
    startTime: '9:00',
    endTime: '17:00'
  },
  WEDNESDAY: {
    startTime: '9:00',
    endTime: '17:00'
  },
  THURSDAY: {
    startTime: '9:00',
    endTime: '17:00'
  },
  FRIDAY: {
    startTime: '9:00',
    endTime: '17:00'
  }
};

computeResolutionTime({
  businessHours,
  ticketCreatedOn: '2024-03-01, 10:20 AM',
  ticketClosedOn: '2024-03-07, 4:00 PM'
});
