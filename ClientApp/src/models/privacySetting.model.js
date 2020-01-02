"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PrivacySetting = /** @class */ (function () {
    function PrivacySetting() {
    }
    return PrivacySetting;
}());
exports.PrivacySetting = PrivacySetting;
var PrivacyOptions = /** @class */ (function () {
    function PrivacyOptions(obj) {
        if (obj != null) {
            this.PostPrivacyOptions = obj['postPrivacyOptions'] != null ?
                obj['postPrivacyOptions'].map(function (obj) { return new PrivacyOptionModel(obj); }) : [];
            this.OnLineStatusOptions = obj['onlineStatusPrivacyOptions'] != null ?
                obj['onlineStatusPrivacyOptions'].map(function (obj) { return new PrivacyOptionModel(obj); }) : [];
            this.ProfileDetailsOptions = obj['profilePrivacyOptions'] != null ?
                obj['profilePrivacyOptions'].map(function (obj) { return new PrivacyOptionModel(obj); }) : [];
        }
    }
    return PrivacyOptions;
}());
exports.PrivacyOptions = PrivacyOptions;
var PrivacyOptionModel = /** @class */ (function () {
    function PrivacyOptionModel(obj) {
        if (obj != null) {
            this.Id = obj['id'] != null ? obj['id'] : 0;
            this.OptionDescription = obj['optionDescription'] != null ? obj['optionDescription'] : '';
            this.IsSelected = obj['isSelected'] != null ? obj['isSelected'] : false;
        }
    }
    return PrivacyOptionModel;
}());
exports.PrivacyOptionModel = PrivacyOptionModel;
var PostPrivacy;
(function (PostPrivacy) {
    PostPrivacy[PostPrivacy["PublicPost"] = 0] = "PublicPost";
    PostPrivacy[PostPrivacy["MutualFollowers"] = 1] = "MutualFollowers";
    PostPrivacy[PostPrivacy["Private"] = 2] = "Private";
})(PostPrivacy = exports.PostPrivacy || (exports.PostPrivacy = {}));
var OnLineStatus;
(function (OnLineStatus) {
    OnLineStatus[OnLineStatus["Public"] = 0] = "Public";
    OnLineStatus[OnLineStatus["MutualFollowers"] = 1] = "MutualFollowers";
    OnLineStatus[OnLineStatus["None"] = 2] = "None";
})(OnLineStatus = exports.OnLineStatus || (exports.OnLineStatus = {}));
var ProfileDetails;
(function (ProfileDetails) {
    ProfileDetails[ProfileDetails["Public"] = 0] = "Public";
    ProfileDetails[ProfileDetails["MutualFollowers"] = 1] = "MutualFollowers";
})(ProfileDetails = exports.ProfileDetails || (exports.ProfileDetails = {}));
//# sourceMappingURL=privacySetting.model.js.map