import { DEFAULTIMAGES } from '../constants/constants';
import { config } from '../config/config';

export class Post {
  public AuthorProfilePicture: string;
  public AuthorName: string;
  public Timespan: Date;
  public AuthorFarm: string;
  public PostText: string;
  public PostImageUrl: string[];
  public Likes: number;
  public PostComments: PostComment[];
  public IsLiked: boolean;
  public PostImgstr: string[];
  public Id: number;
  public PostImages: PostImage[];
  public AuthorProfilePicUrl: string;
  public CreatedDate: string;
  public PostonotherUserId: string;
  public AuthorUserId: string;
  public IsPublicOrMutual:boolean;
  public PostShares:PostShares[];
  constructor(obj?: any) {
    if (obj != null) {
      this.AuthorName = obj["authorName"] != null ? obj["authorName"] : "",
        this.AuthorFarm = obj["authorFarm"] != null ? obj["authorFarm"] : "",
        this.Timespan = obj["timespan"] != null ? obj["timespan"] : new TimeRanges(),
        this.PostText = obj["postText"] != null ? obj["postText"] : "",
        this.PostImageUrl = obj["postImageUrl"] != null ? obj["postImageUrl"].map(a => new String(a)) : [],
        this.Likes = obj["likes"] != null ? obj["likes"] : 0,
        this.IsLiked = obj["isLiked"] != null ? obj["isLiked"] : false,
        this.PostComments = obj["postComments"] != null ? obj["postComments"].map(a => new PostComment(a)) : [],
        this.PostImgstr = obj["PostImgstr"] != null ? obj["PostImgstr"].map(a => new String(a)) : [],
        this.Id = obj["id"] != null ? obj["id"] : 0,
        this.PostImages = obj["postImages"] != null ? obj["postImages"].map(function (a) { return new PostImage(a); }) : [];
      this.AuthorProfilePicUrl = obj["authorProfilePicUrl"] != null ? (config.imgPath + obj["authorProfilePicUrl"]) : DEFAULTIMAGES.UserImage;
      this.CreatedDate = obj["createdDate"] != null ? obj["createdDate"] : "";
      this.PostonotherUserId = obj["postonotherUserId"] != null ? obj["postonotherUserId"] : "";
      this.AuthorUserId = obj["authourId"] != null ? obj["authourId"] : "";
      this.IsPublicOrMutual = obj["IsPublicOrMutual"] != null ? obj["IsPublicOrMutual"].map(a=>new String(a)) : "";
      this.PostShares=obj["postShares"]!=null?obj["postShares"]:[]
    }
  }
}
export class PostComment {
  public CommentId: string;
  public Comment: string;
  public Author: string;
  public TimeStamp: Date;
  public Likes: number;
  public IsLiked: boolean;
  public Replies: PostCommentReply[];
  constructor(obj?: any) {

    if (obj != null) {
      this.CommentId = obj["commentId"] != null ? obj["commentId"] : "",
        this.Comment = obj["comment"] != null ? obj["comment"] : "",
        this.Author = obj["author"] != null ? obj["author"] : "",
        this.Likes = obj["likes"] != null ? obj["likes"] : 0,
        this.TimeStamp = obj["timeStamp"] != null ? obj["timeStamp"] : new Date()
      this.IsLiked = obj["isLiked"] != null ? obj["isLiked"] : false
      //this.CommentId = obj[""] != null ? obj[""] : "",
    }
  }
}

export class PostImage {
  public Id: number;
  public PostId: number;
  public FileName: string;

  constructor(obj?: any) {

    if (obj != null) {
      this.Id = obj["id"] != null ? obj["id"] : 0,
        this.PostId = obj["postId"] != null ? obj["postId"] : "",
        this.FileName = obj["fileName"] != null ? obj["fileName"] : ""
    }
  }
}

export class PostCommentReply {
  public ReplyId: string;
  public ReplyText: string;
  public Author: string;
  public TimeStamp: string;
  public Likes: number;
}

export class PostShares{
  public PostId:string;
  public SharedBy: string;
  public SharedDateTime:string;

}  
