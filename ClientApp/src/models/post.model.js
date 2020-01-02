"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Post = /** @class */ (function () {
    function Post(obj) {
        if (obj != null) {
            this.AuthorName = obj["authorName"] != null ? obj["authorName"] : "",
                this.AuthorFarm = obj["authorFarm"] != null ? obj["authorFarm"] : "",
                this.Timespan = obj["timespan"] != null ? obj["timespan"] : new TimeRanges(),
                this.PostText = obj["postText"] != null ? obj["postText"] : "",
                this.PostImageUrl = obj["postImageUrl"] != null ? obj["postImageUrl"] : "",
                this.Likes = obj["likes"] != null ? obj["likes"] : 0,
                this.IsLiked = obj["isLiked"] != null ? obj["isLiked"] : false,
                this.Id = obj["id"] != null ? obj["id"] : false,
                this.PostComments = obj["postComments"] != null ? obj["postComments"].map(function (a) { return new PostComment(a); }) : []
                
        }
    }
    return Post;
}());
exports.Post = Post;
var PostComment = /** @class */ (function () {
    function PostComment(obj) {
        if (obj != null) {
            this.CommentId = obj["commentId"] != null ? obj["commentId"] : "",
                this.Comment = obj["comment"] != null ? obj["comment"] : "",
                this.Author = obj["author"] != null ? obj["author"] : "",
                this.Likes = obj["likes"] != null ? obj["likes"] : 0,
                this.TimeStamp = obj["timeStamp"] != null ? obj["timeStamp"] : new Date();
            //this.CommentId = obj[""] != null ? obj[""] : "",
        }
    }
    return PostComment;
}());
exports.PostComment = PostComment;

var PostImage = /** @class */ (function () {
    function PostImage(obj) {
        if (obj != null) {
            this.Id = obj["id"] != null ? obj["id"] : 0,
                this.PostId = obj["postId"] != null ? obj["postId"] : 0,
                this.FileName = obj["fileName"] != null ? obj["fileName"] : ""
        }
    }
    return PostImage;
}());
exports.PostImage = PostImage;

var PostCommentReply = /** @class */ (function () {
    function PostCommentReply() {
    }
    return PostCommentReply;
}());
exports.PostCommentReply = PostCommentReply;
//# sourceMappingURL=post.model.js.map