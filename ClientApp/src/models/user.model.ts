export class User {
 
  public FirstName: string;
  public LastName: string;
  public UserName: string;
  public Password: string;
  public Email: string;
  public Phone: string;
  public Street: string;
  public City: string;
  public State: string;
  public Zip: string;
  public Education: string;
  public Hobbies: string;
  public Bio: string;
  public UserImageUrl: string;
  public FileName: string;
  public Birthday: Date;
  public IsSubscribed: boolean;
  public NewPassword: string;
  public IsSocialLogin: boolean;
  public Providername: string;
  public Profileurl: string;
  public FarmName:string;
  public AnimalName:Array<string>;
  public OperatingSince:string;
    public FarmOverview: string;
    public Country: string;
    public Id :string;
  constructor(obj?: any) {
    (<any>Object).assign(this, obj);
  }
}

export class UserDetails extends User {
  public Birthdate: Date;
  public UserLookingFor: UserLookingFor[];
  public UserInterests: UserInterest[];
  public Id :string;
  public followedbyCount:number;
  public followingCount:number;

  constructor(obj?: any) {
    super();

    if (obj != null) {
      if (obj["profilePicture"] != null)
        this.UserImageUrl = '/Upload/' + obj["profilePicture"].fileName;
      else
        this.UserImageUrl = 'http://via.placeholder.com/100x100';
      this.FirstName = obj['firstName'] != null ? obj['firstName'] : "";
      this.LastName = obj['lastName'] != null ? obj['lastName'] : "";
      this.Bio = obj['bio'] != null ? obj['bio'] : "";
      this.City = obj['city'] != null ? obj['city'] : "";
      this.Education = obj['education'] != null ? obj['education'] : "";
      this.Email = obj['email'] != null ? obj['email'] : "";
      this.Hobbies = obj['hobbies'] != null ? obj['hobbies'] : "";
      this.Phone = obj['phone'] != null ? obj['phone'] : "";
      this.State = obj['state'] != null ? obj['state'] : "";
      this.Street = obj['street'] != null ? obj['street'] : "";
      this.UserName = obj['username'] != null ? obj['username'] : '';
      this.Zip = obj['zip'] != null ? obj['zip'] : '';
      this.Country = obj['country'] != null ? obj['country'] : '';
      this.UserLookingFor = obj['userLookingFor'] != null ?
        obj['userLookingFor'].map(a => new UserLookingFor(a)) : [];
      this.NewPassword = obj["NewPassword"] != null ? obj["NewPassword"] : "";
      this.Id = obj["id"] != null ? obj["id"] : "";
      this.Birthday = obj["birthday"] != null ? obj["birthday"] : "";
      this.followedbyCount = obj["followedbyCount"] != null ? obj["followedbyCount"] : 0;
      this.followingCount = obj["followingCount"] != null ? obj["followingCount"] :0;
    }
  }
}

export class UserLookingFor {
  public Id: number;
  public LookupType: string;
  public IsSelected: boolean;

  constructor(obj?: any) {
    this.Id = obj['id'] != null ? obj['id'] : 0;
    this.IsSelected = obj['isSelected'] != null && obj['isSelected'] == true ? true : false;
    this.LookupType = obj['lookupType'] != null ? obj['lookupType'] : "";
  }
}
export class UserInterest {
  public Id: number;
  public InterestName: string;
  public IsSelected: boolean;
  constructor(obj?: any) {
    this.Id = obj['id'] != null ? obj['id'] : 0;
    this.IsSelected = obj['isSelected'] != null ? obj['isSelected'] : false;
    this.InterestName = obj['interestName'] != null ? obj['interestName'] : "";
  }
}
