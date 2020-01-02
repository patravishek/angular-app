import { and } from "@angular/router/src/utils/collection";

export class FarmProfile {
  public FarmProfileId: number;

  public UserId: string

  public FarmLogoUrl: string;
  public FarmName: string;
  public OperatingSince: string;
  public Overview: string;
  public Street: string;
  public City: string;
  public State: string;
  public Zip: string;
  public Country: string;
  public IsTransportationProvider: boolean;
  public Animals: string[];
  public FarmLogo: string;
  public FarmLogoPath: string;
  public FarmDisplayLogoPath: string;

  constructor(obj?: any) {
    if (obj != null) {
      this.FarmProfileId = obj != null && obj['farmProfileId'] != null ? obj['farmProfileId'] : '';
      this.UserId = obj != null && obj['userId'] != null ? obj['userId'] : '';
      this.FarmName = obj != null && obj['farmName'] != null ? obj['farmName'] : '';
      this.OperatingSince = obj != null && obj['operatingSince'] != null ? obj['operatingSince'] : '';
      this.Overview = obj != null && obj['overview'] != null ? obj['overview'] : '';
      this.Street = obj != null && obj['street'] != null ? obj['street'] : '';
      this.City = obj != null && obj['city'] != null ? obj['city'] : '';
      this.State = obj != null && obj['state'] != null ? obj['state'] : '';
      this.Country = obj != null && obj['country'] != null ? obj['country'] : '';
      this.Zip = obj != null && obj['zip'] != null ? obj['zip'] : '';
      this.IsTransportationProvider = obj["isTransportationProvider"] != null ? obj["isTransportationProvider"] : false;
      this.Animals = obj != null && obj['animals'] != null ? obj['animals'] : null;
      this.FarmLogo = obj != null && obj['farmLogo'] != null ? obj['farmLogo'] : '';
      this.FarmProfileId = obj != null && obj['farmProfileId'] != null ? obj['farmProfileId'] : '';
      this.FarmLogoPath = obj != null && obj['farmLogoPath'] != null ? obj['farmLogoPath'] : '';
    }
    else {
      this.IsTransportationProvider = false;
    }
  }



}

export class Animal {
  Id: number;
  AnimalName: string;
  constructor(obj?: any) {
    if (obj != null) {
      this.Id = obj['id'] != null ? obj['id'] : 0;
      this.AnimalName = obj['animalName'] != null ? obj['animalName'] : '';
    }

  }
}
