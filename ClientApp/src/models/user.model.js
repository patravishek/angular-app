"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User(obj) {
        Object.assign(this, obj);
    }
    return User;
}());
exports.User = User;
var UserDetails = /** @class */ (function (_super) {
    __extends(UserDetails, _super);
    function UserDetails(obj) {
        var _this = _super.call(this) || this;
        if (obj != null) {
            if (obj["profilePicture"] != null)
                _this.UserImageUrl = '/Upload/' + obj["profilePicture"].fileName;
            else
                _this.UserImageUrl = 'http://via.placeholder.com/100x100';
            _this.FirstName = obj['firstName'] != null ? obj['firstName'] : "";
            _this.Bio = obj['bio'] != null ? obj['bio'] : "";
            _this.City = obj['city'] != null ? obj['city'] : "";
            _this.Education = obj['education'] != null ? obj['education'] : "";
            _this.Email = obj['email'] != null ? obj['email'] : "";
            _this.Hobbies = obj['hobbies'] != null ? obj['hobbies'] : "";
            _this.LastName = obj['lastName'] != null ? obj['lastName'] : "";
            _this.Phone = obj['phone'] != null ? obj['phone'] : "";
            _this.State = obj['state'] != null ? obj['state'] : "";
            _this.Street = obj['street'] != null ? obj['street'] : "";
            _this.UserName = obj['userName'] != null ? obj['userName'] : '';
            _this.Birthdate = obj['birthday'] != null ? obj['birthday'] : '';
            _this.UserLookingFor = obj['userLookingFor'] != null ?
                obj['userLookingFor'].map(function (a) { return new UserLookingFor(a); }) : [];
        }
        return _this;
    }
    return UserDetails;
}(User));
exports.UserDetails = UserDetails;
var UserLookingFor = /** @class */ (function () {
    function UserLookingFor(obj) {
        this.Id = obj['id'] != null ? obj['id'] : 0;
        this.IsSelected = obj['isSelected'] != null && obj['isSelected'] == 'true' ? true : false;
        this.LookupType = obj['lookupType'] != null ? obj['lookupType'] : "";
    }
    return UserLookingFor;
}());
exports.UserLookingFor = UserLookingFor;
var UserInterest = /** @class */ (function () {
    function UserInterest(obj) {
        this.Id = obj['id'] != null ? obj['id'] : 0;
        this.IsSelected = obj['isSelected'] != null ? obj['isSelected'] : false;
        this.InterestName = obj['interestName'] != null ? obj['interestName'] : "";
    }
    return UserInterest;
}());
exports.UserInterest = UserInterest;
//# sourceMappingURL=user.model.js.map