import { DEFAULTIMAGES } from '../constants/constants';
import { config } from '../config/config';

export class DirectoryModel {
    public id: number;
    public name: string;
    public profilePic: string;
    public CreatedBy: string;
    public UpdatedBy: string;

    constructor(obj?: any) {
        if (obj != null) {
            this.id = obj["id"] != null ? obj["id"] : 0;
            this.name = obj["name"] != null ? obj["name"] : "";
            this.profilePic = obj["profilePic"] != null ? (config.imgPath + obj["profilePic"]) : "";
            this.CreatedBy = obj["CreatedBy"] != null ? obj["CreatedBy"] : "";
        }
    }
}

