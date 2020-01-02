import { DEFAULTIMAGES } from '../constants/constants';
import { config } from '../config/config';

export class SuggestedFarmer {
  public FarmId: string;
  public FirstName: string;
  public LastName: string;
  public City: string;
  public Email:string;
  public profileurl:string;

  constructor(obj?: any) {
    if (obj != null) {
      this.FarmId = obj['id'] != null ? obj['id'] : '';
      this.FirstName = obj['firstName'] != null ? obj['firstName'] : '';
      this.LastName = obj['lastName'] != null ? obj['lastName'] : '';
      this.City = obj['city'] != null ? obj['city'] : '';
      this.Email = obj['email'] != null ? obj['email'] : '';
      this.profileurl = obj['profileurl'] != null ? (config.imgPath + obj['profileurl']) : DEFAULTIMAGES.UserImage;;
    }
  }
}
