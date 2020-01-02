"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SuggestedFarmer = /** @class */ (function () {
    function SuggestedFarmer(obj) {
        if (obj != null) {
            this.FarmId = obj['id'] != null ? obj['id'] : '';
            this.FirstName = obj['firstName'] != null ? obj['firstName'] : '';
            this.LastName = obj['lastName'] != null ? obj['lastName'] : '';
            this.City = obj['city'] != null ? obj['city'] : '';
        }
    }
    return SuggestedFarmer;
}());
exports.SuggestedFarmer = SuggestedFarmer;
//# sourceMappingURL=SuggestedFarmer.model.js.map