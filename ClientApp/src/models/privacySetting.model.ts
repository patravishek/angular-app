export class PrivacySetting {
  public PostPrivacy: PostPrivacy;
  public OnLineStatus: OnLineStatus;
  public ProfileDetails: ProfileDetails;
}

export class PrivacyOptions {

  public PostPrivacy: PrivacyOptionModel[];
  public OnlineStatus: PrivacyOptionModel[];
  public ProfileDetails: PrivacyOptionModel[];

  constructor(obj?: any) {
    if (obj != null) {
      this.PostPrivacy = obj['postPrivacy'] != null ?
        obj['postPrivacy'].map(obj => new PrivacyOptionModel(obj)) : [];
      this.OnlineStatus = obj['onlineStatus'] != null ?
        obj['onlineStatus'].map(obj => new PrivacyOptionModel(obj)) : [];
      this.ProfileDetails = obj['profileDetails'] != null ?
        obj['profileDetails'].map(obj => new PrivacyOptionModel(obj)) : [];
    }
  }
}
export class PrivacyOptionModel {
  public Id: number;
  public Description: string;
  public IsSelected: boolean;
  constructor(obj?: any) {
    if (obj != null) {
      this.Id = obj['id'] != null ? obj['id'] as number : 0;
      this.Description = obj['description'] != null ? obj['description'] : '';
      this.IsSelected = obj['isSelected'] != null ? obj['isSelected'] : false;
    }
  }
}


export enum PostPrivacy {
  PublicPost = 0,
  MutualFollowers,
  Private
}
export enum OnLineStatus {
  Public = 0,
  MutualFollowers,
  None
}
export enum ProfileDetails {
  Public = 0,
  MutualFollowers
}
