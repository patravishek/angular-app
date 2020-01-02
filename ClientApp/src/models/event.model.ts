import { DEFAULTIMAGES } from '../constants/constants';
import { config } from '../config/config';

export class EventModel {
    public EventId: number;
    public EventOwnerId: string;
    public EventName: string;
    public EventPicture: string;
    public FileName: string;
    public EventHeadline: string;
    public EventDate: string;
    public EventStartTime: string;
    public EventEndTime: string;
    public AllDayEvent: boolean;
    public EventStreet: string;
    public EventCity: string;
    public EventState: string;
    public EventZip: string;
    public EventDescription: string;
    public EventIntrestCount: number;

    constructor(obj?: any) {
        if (obj != null) {
            this.EventId = obj["eventId"] != null ? obj["eventId"] : 0,
                this.EventOwnerId = obj["eventOwnerId"] != null ? obj["eventOwnerId"] : "",
                this.EventName = obj["eventName"] != null ? obj["eventName"] : "",
                this.EventPicture = obj["eventPicture"] != null ? (config.imgPath + obj["eventPicture"]) : "";
            this.FileName = obj["fileName"] != null ? obj["fileName"] : "",
                this.EventHeadline = obj["eventHeadline"] != null ? obj["eventHeadline"] : "",
                this.EventDate = obj["eventDate"] != null ? obj["eventDate"] : "",
                this.EventStartTime = obj["eventStartTime"] != null ? obj["eventStartTime"] : "",
                this.EventEndTime = obj["eventEndTime"] != null ? obj["eventEndTime"] : "",
                this.AllDayEvent = obj["allDayEvent"] != null ? obj["allDayEvent"] : false,
                this.EventStreet = obj["eventStreet"] != null ? obj["eventStreet"] : "";
            this.EventCity = obj["eventCity"] != null ? obj["eventCity"] : "";
            this.EventState = obj["eventState"] != null ? obj["eventState"] : "";
            this.EventZip = obj["eventZip"] != null ? obj["eventZip"] : "";
            this.EventDescription = obj["eventDescription"] != null ? obj["eventDescription"] : "";
            this.EventIntrestCount = obj["eventIntrestCount"] != null ? obj["eventIntrestCount"] : 0;
        }
    }
}

