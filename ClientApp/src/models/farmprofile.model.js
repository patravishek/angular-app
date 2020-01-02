"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FarmProfile = /** @class */ (function () {
    function FarmProfile(obj) {
        if (obj != null) {
            this.UserId = obj != null && obj['userId'] != null ? obj['userId'] : '';
            this.FarmName = obj != null && obj['farmName'] != null ? obj['farmName'] : '';
            this.OperatingSince = obj != null && obj['operatingSince'] != null ? obj['operatingSince'] : '';
            this.Overview = obj != null && obj['overview'] != null ? obj['overview'] : '';
            this.Street = obj != null && obj['street'] != null ? obj['street'] : '';
            this.City = obj != null && obj['city'] != null ? obj['city'] : '';
            this.State = obj != null && obj['state'] != null ? obj['state'] : '';
            this.Zip = obj != null && obj['zip'] != null ? obj['zip'] : '';
            this.IsTransportationProvider = obj != null && obj['isTransportationProvider'] != null
                && obj['isTransportationProvider'] == 'true' ? true : false;
            this.Animals = obj != null && obj['animals'] != null ? obj['animals'].map(function (a) { return new Animal(a); }) : null;
        }
        else {
            this.IsTransportationProvider = false;
        }
    }
    return FarmProfile;
}());
exports.FarmProfile = FarmProfile;
var Animal = /** @class */ (function () {
    function Animal(obj) {
        if (obj != null) {
            this.Id = obj['id'] != null ? obj['id'] : 0;
            this.Id = obj['animalName'] != null ? obj['AnimalName'] : '';
        }
    }
    return Animal;
}());
exports.Animal = Animal;
//# sourceMappingURL=farmprofile.model.js.map