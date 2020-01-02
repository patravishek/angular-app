import { Injectable } from '@angular/core';

@Injectable()
export class EventDataService {

getEvents(): any[] {
    return [{
        'evantName': 'Livestock City Launch Party',
        'evantDesc': 'Help us Celebrate LiveStock Citys Web and Mobile Apps',
        'eventTimeLoc': 'Charlottesville, VA',
        'eventType': 'All day',
        'eventDay': '15',
        'eventMonth': 'May',
        'eventYear' : '2017'
      },
      {
      'evantName': 'Memorial Day BBQ',
      'evantDesc': 'Burgers, dogs, and beers for all!',
      'eventTimeLoc': 'Carthage, SD',
      'eventType': 'All day',
      'eventDay': '15',
      'eventMonth': 'May',
      'eventYear' : '2017'
      },
      {
      'evantName': 'Farmers Market Trip',
      'evantDesc': 'Join us as we stroll the smog-filled streets and wish we were in the countryside',
      'eventTimeLoc': 'Los Angeles, CA',
      'eventType': '10:00AM - 2:00PM PT',
      'eventDay': '15',
      'eventMonth': 'May',
      'eventYear' : '2017'
      }];
}

}

