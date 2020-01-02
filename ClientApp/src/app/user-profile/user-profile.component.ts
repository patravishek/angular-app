import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { config } from '../../config/config';
import * as moment from 'moment'
import { Post } from '../../models/post.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import { DEFAULTIMAGES } from '../../constants/constants';
import { FarmProfile } from '../../models/farmprofile.model';
import { SuggestedFarmersComponent } from '../suggested-farmers/suggested-farmers.component';
//import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userid: any;
  userProfileDetail: any = {};
  IsFollowed = false;
  imgPath: any = config.imgPath;
  public farmProfile = new FarmProfile(null);
  public post = new Post(null);
  public posts: Post[] = [];
  postid: any;
  previewPhoto = 'http://via.placeholder.com/600x400';
  FarmAnimals = "";
  @ViewChild(SuggestedFarmersComponent) suggestedComponent: SuggestedFarmersComponent;
  public selectedFile: File;
  postFormGroup: FormGroup;
  isSubmitted = false;
  validImage = true;
  isPosted = false;
  defaultUserImg = DEFAULTIMAGES.UserImage;
  IsFarmDetShow = false;
  defaultFarmImg = DEFAULTIMAGES.FarmImage;
  loggedInUserId: any = localStorage.getItem('id');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  rootImgPath: any = config.imgPath;
  public countryPrivacy: any = {};
  public statePrivacy: any = {};
  public cityPrivacy: any = {};
  public streetPrivacy: any = {};
  public sharepostmodel:any = {};

  constructor(private router: ActivatedRoute, private http: HttpClient,
    private formBuilder: FormBuilder, public _loaderService: LoaderService) {
    this.router.params.subscribe(params => {
      this.userid = params['id'];

      if (this.userid)
        this.GetUserFarmProfilePrivacyDetails();
    })
  }

  ngOnInit() {
    this.GetProfileDetail();
    this.post.PostImgstr = [];
    this.postFormGroup = this.formBuilder.group({
      postText: ['', Validators.required],
    });
  }

  GetProfileDetail() {
    this._loaderService.show();
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });

    var payload = "?Searchuserid=" + this.userid + "&loginuserid=" + this.loggedInUserId;
    this._loaderService.show();
    this.http.get(config.ServiceUrl + '/api/gateway/GetuserprofileByUsernameForSearch' + payload, { headers: httpOptions }).subscribe(data => {
      this.userProfileDetail = data;
      this.GetFarmProfile();
      this.CheckUserFollow();
      // this.userProfileDetail.farmName = "JK Farm";
      var profilePic = this.userProfileDetail.profilePicture;
      this.userProfileDetail.UserImageUrl = (profilePic.fileName) ? (this.imgPath + profilePic.fileName) : this.defaultUserImg;

      if (this.userProfileDetail.birthday)
        this.userProfileDetail.birthday = moment(new Date()).format("MM-DD-YYYY");
      //this.userProfileDetail.birthday = moment(new Date()).format("MM-DD-YYYY");
      var oldPostList = this.posts;
      var oldPosts = oldPostList.filter(function (item: any) { return item.isCommentsShow });

      this.posts = this.userProfileDetail.userPosts != null ? this.userProfileDetail.userPosts.map(a => new Post(a)) : [];

      var oldPostIds = oldPosts.map(function (item) { return item.Id; });
      var newCommentedPosts = this.posts.filter(function (item) { return oldPostIds.includes(item.Id) });
      newCommentedPosts.forEach(function (item: any) {
        item.isCommentsShow = true;
      });

      setTimeout(() => {
        this._loaderService.hide();

      }, 300);
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 300);
      });
  }

  GetFarmProfile() {
    this._loaderService.show();
    var payload = "?userid=" + this.userid;
    this.http.get<FarmProfile>(config.ServiceUrl + '/api/gateway/GetfarmProfilebyUserid' + payload, this.httpOptions).subscribe(data => {
      this.farmProfile = new FarmProfile(data);
      if (this.farmProfile.Animals && this.farmProfile.Animals.length > 0) {
        var animals = this.farmProfile.Animals.filter(function (el) { return el.length > 0; });
        this.FarmAnimals = animals.join(",");
      }
      this.farmProfile.FarmLogoPath = (this.farmProfile.FarmLogoPath) ? (this.rootImgPath + this.farmProfile.FarmLogoPath) : this.defaultFarmImg;
      this._loaderService.hide();
    });
  }

  CheckUserFollow() {
    this._loaderService.show();
    var payload = "?searchuserid=" + this.userid;
    this.http.get(config.ServiceUrl + '/api/gateway/checkuserfollow' + payload, this.httpOptions).subscribe((data: any) => {
      this.IsFollowed = data;
      setTimeout(() => {
        this._loaderService.hide();
      }, 300);
    });
  }

  likeUnlikePost(post: any, isLike) {
    this._loaderService.show();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    var paramPost = { postid: post.Id, islike: isLike };

    this.http.post(config.ServiceUrl + '/api/Gateway/likeunlikePost', JSON.stringify(paramPost), httpOptions).subscribe(data => {
      //refresh comments/posts
      setTimeout(() => {
        this._loaderService.hide();

      }, 300);
      this.GetProfileDetail();
      post.Likes = post.IsLiked ? --post.Likes : ++post.Likes;
      post.IsLiked = !post.IsLiked;
    }, error => {
      setTimeout(() => {
        this._loaderService.hide();

      }, 300);
    });
  }

  //Add comment
  addComment(post, event, isButtonClicked) {
    if (post.CommentText && (event.key === "Enter" || isButtonClicked)) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
      };

      var objPost = { postid: post.Id, commenttext: post.CommentText };


      this._loaderService.show();
      this.http.post(config.ServiceUrl + '/api/Gateway/addcomment', JSON.stringify(objPost), httpOptions).subscribe((data: any) => {
        //refresh comments/posts

        post.CommentText = null;


        setTimeout(() => {
          this._loaderService.hide();

        }, 300);
        this.GetProfileDetail();

      }, error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 300);
      });
    }
  }

  //Add post
  createPost() {
    if (this.postFormGroup.invalid || !this.validImage) {
      this.isSubmitted = true;
      return;
    }

    this._loaderService.show();
    this.isSubmitted = false;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    this.post.PostText = this.postFormGroup.value.postText;
    this.post.PostonotherUserId = this.loggedInUserId;
    this.post.CreatedDate = moment(new Date()).format("YYYY-MM-DD HH:mm");

    this.http.post(config.ServiceUrl + '/api/Gateway/me/posts/new', JSON.stringify(this.post), httpOptions).subscribe(data => {
      this.postFormGroup.value.postText = null;
      this.postFormGroup.reset();
      this.isPosted = true;
      this.previewPhoto = 'http://via.placeholder.com/600x400';
      this.post.PostImgstr = [];
      //refresh comments/posts
      setTimeout(() => {
        this._loaderService.hide();

      }, 3000);
      this.ngOnInit();
    }, error => {
      setTimeout(() => {
        this._loaderService.hide();

      }, 3000);
    });
  }

  removePhoto() {
    var result = confirm("Are you sure you want to delete this photo?");

    if (result) {
      $(this).closest('.photo-post-thumbnail').remove();
      this.isPosted = true;
      this.previewPhoto = 'http://via.placeholder.com/600x400';
      this.post.PostImgstr = [];
    }
  }

  public onSelectedFileName(event) {
    this.selectedFile = <File>event.target.files[0];
    this.validImage = true;

    if (this.selectedFile) {
      let extension = this.selectedFile.name.split('.').pop();

      if (extension.toLowerCase() != 'png' && extension.toLowerCase() != 'jpg' && extension.toLowerCase() != 'jpeg') {
        // this.fileErrorMsg = MESSAGES.UPLOADFILEVALIDATION;
        alert("Please upload valid image.");
        this.validImage = false;
      }
      this.readURL();
    }
  }

  //preview image after upload image
  readURL() {
    var reader = new FileReader();
    let parentThis = this;

    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    //reader.readAsBinaryString(this.selectedFile);
    reader.readAsDataURL(parentThis.selectedFile);
  }

  _handleReaderLoaded(readerEvt) {
    this.previewPhoto = readerEvt.target.result;
    this.post.PostImgstr.push((this.previewPhoto.split(',')[1]));
  }

  public openfileDialogue(event) {
    this.isPosted = false;
    event.preventDefault();
    let element: HTMLElement = document.getElementById('photoUpdate') as HTMLElement;
    element.click();
  }

  //Like unlike comment
  likeUnlikeComment(comment: any, isLike, postId) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    var LoginUserId = window.localStorage.getItem('id')
    var paramPostommentLike = {
      CommentId: comment.CommentId, islike: isLike,
      Userid: LoginUserId, postId: postId
    };
    this._loaderService.show();
    this.http.post(config.ServiceUrl + '/api/Gateway/LikeCommentbyId', JSON.stringify(paramPostommentLike), httpOptions).subscribe(data => {
      //refresh comments/posts
      comment.likes = comment.IsLiked ? --comment.Likes : ++comment.Likes;
      comment.IsLiked = !comment.IsLiked;
      //  this.ngOnInit();
      this._loaderService.hide();
    }, error => {
      this._loaderService.hide();
    });
  }

  userFollowfun() {
    this._loaderService.show();
    if (this.IsFollowed)
      this.userProfileDetail.IsFollow = false
    else
      this.userProfileDetail.IsFollow = true;

    var user = { OwnerUserId: this.loggedInUserId, FollowerUserId: this.userid, IsFollow: this.userProfileDetail.IsFollow };
    this.http.post(config.ServiceUrl + '/api/Gateway/Post/userFollowfun', JSON.stringify(user), this.httpOptions).subscribe(data => {
      this.userProfileDetail.IsFollow = !this.userProfileDetail.IsFollow;
      this.IsFollowed=this.userProfileDetail.IsFollow;
      this._loaderService.hide();
      this.ngOnInit();
      this.suggestedComponent.ngOnInit();
    }, error => {
      this._loaderService.hide();
    });
  }

  GetUserFarmProfilePrivacyDetails() {
    this.http.get(config.ServiceUrl + '/api/gateway/GetUserPrivacybyuserid?userid=' + this.userid, this.httpOptions).subscribe((data: any) => {
      this.countryPrivacy = data.find(function (item) { return item.fieldname == "Country" });
      this.statePrivacy = data.find(function (item) { return item.fieldname == "State" });
      this.cityPrivacy = data.find(function (item) { return item.fieldname == "City" });
      this.streetPrivacy = data.find(function (item) { return item.fieldname == "Street" });
      this._loaderService.hide();
    },
      error => {
      }
    );
    // }
  }

  OpenSharePost(post: any) {
    this.sharepostmodel=post;
    $("#share-post").modal('show');
  }

  SharePost() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    var currentdate=new Date()
    var paramPost = { PostId: this.sharepostmodel.Id, PostOwnerId: this.sharepostmodel.AuthorUserId,SharebyOwnerId:this.loggedInUserId,CreatedOn:currentdate };
    this._loaderService.show();
    this.http.post(config.ServiceUrl + '/api/Gateway/PostShareByPostId', JSON.stringify(paramPost), httpOptions).subscribe(data => {
      $("#share-post").modal('hide');
      this.ngOnInit();
    
      this._loaderService.hide();
    }, error => {
      this._loaderService.hide();
    });
  }
}
