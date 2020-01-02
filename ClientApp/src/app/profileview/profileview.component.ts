import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { UserDetails, UserLookingFor } from '../../models/user.model';
import { SuggestedFarmer } from '../../models/SuggestedFarmer.model';
import { Post } from '../../models/post.model';
import { NgForm } from '@angular/forms';
import { config } from '../../config/config';
import { Router } from '@angular/router'
import { PhotoAlbum } from '../../models/photoalbum.model';
import * as moment from 'moment'
import { LoaderService } from '../services/loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DEFAULTIMAGES } from '../../constants/constants';
import { FarmProfile } from '../../models/farmprofile.model';


@Component({
  selector: 'app-profileview',
  templateUrl: './profileview.component.html',
})

export class ProfileViewComponent implements OnInit {
  public _httpClient: HttpClient;
  public userDetails: any = {}; //= new UserDetails();
  public suggestedFarmers: SuggestedFarmer[];
  public posts: Post[] = [];
  public post = new Post(null);
  public photos: string[];
  imgPath: any = config.imgPath;
  previewPhoto = 'http://via.placeholder.com/600x400';
  public selectedFile: File;
  postFormGroup: FormGroup;
  isSubmitted = false;
  validImage = true;
  isPosted = false;
  defaultFarmImg = DEFAULTIMAGES.FarmImage;
  loggedInUserId: any = localStorage.getItem('id');
  public farmProfile = new FarmProfile(null);
  FarmAnimals = "";
  IsFarmDetShow = false;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    })
  };
  rootImgPath: any = config.imgPath;
  postid: any;
  defaultUserImg = DEFAULTIMAGES.UserImage;

  constructor(http: HttpClient, private router: Router, private formBuilder: FormBuilder,
    public _loaderService: LoaderService) {
    this._httpClient = http;

  }

  ngOnInit() {

    this.post.PostImgstr = [];
    this.postFormGroup = this.formBuilder.group({
      postText: ['', Validators.required],
    });

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    var payload = "?userid=" + window.localStorage.getItem('id');

    this._loaderService.show()
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetuserprofileByUsername' + payload, { headers: httpOptions }).subscribe(data => {

      this.userDetails = data;
      var profilePic = this.userDetails.profilePicture;
      this.userDetails.UserImageUrl = (profilePic.fileName) ? (this.imgPath + profilePic.fileName) : this.defaultUserImg;

      if (this.userDetails.birthday)
        this.userDetails.birthday = moment(new Date()).format("MM-DD-YYYY");
      var oldPostList = this.posts;
      var oldPosts = oldPostList.filter(function (item: any) { return item.isCommentsShow });

      this.posts = this.userDetails.userPosts != null ? this.userDetails.userPosts.map(a => new Post(a)) : [];

      var oldPostIds = oldPosts.map(function (item) { return item.Id; });
      var newCommentedPosts = this.posts.filter(function (item) { return oldPostIds.includes(item.Id) });
      newCommentedPosts.forEach(function (item: any) {
        item.isCommentsShow = true;
      });
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
      this.GetFarmProfile();
    }, error => {
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
    });

    // this.getPhotoAlbum();
  }

  getPhotoAlbum() {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });

    this._loaderService.show();
    this._httpClient.get<PhotoAlbum[]>(config.ServiceUrl + '/api/gateway/Album/GetAlbums', { headers: httpOptions }).subscribe(data => {
      let albumList = data;
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();
        }, 3000);
      });
  }

  GetFarmProfile() {
    this._loaderService.show();
    this._httpClient.get<FarmProfile>(config.ServiceUrl + '/api/gateway/farmProfile', this.httpOptions).subscribe(data => {
      this.farmProfile = new FarmProfile(data);
      if (this.farmProfile.Animals && this.farmProfile.Animals.length > 0){
       // var animals = this.farmProfile.Animals;
        var animals = this.farmProfile.Animals.filter(function(el) { return el.length > 0; });
        this.FarmAnimals =animals.join(",");
      }
      this.farmProfile.FarmLogoPath = (this.farmProfile.FarmLogoPath) ? (this.rootImgPath + this.farmProfile.FarmLogoPath) : this.defaultFarmImg;
      this._loaderService.hide();
    });
  }

  LikeUnllike(post: Post) {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    if (post.IsLiked) {
      post.Likes = --post.Likes;
    }
    else {
      post.Likes = ++post.Likes;

    }

    this._loaderService.show();
    this._httpClient.post('api/gateway/likeunlike', { isLike: !post.IsLiked }, { headers: httpOptions }).subscribe(data => {
      post.IsLiked = !post.IsLiked;
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
    },
      error => {

      });

  }

  followerUser(follower) {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });
    var loginid = window.localStorage.getItem('id');
    var data = {
      "ownerUserId": loginid,
      "followerUserId": follower.FarmId,
      "isFollow": true
    }
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + 'api/gateway/Post/userFollowfun', JSON.stringify(data), { headers: httpOptions }).subscribe(data => {
      alert("Follow Successfuly!");
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
    },
      error => {
      });
  }

  viewUserProfile(id) {
    if (id) {
      this.router.navigate(['/userProfile/' + id])
    }
  }


  likeUnlikePost(post: any, isLike) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };

    var paramPost = { postid: post.Id, islike: isLike };
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/likeunlikePost', JSON.stringify(paramPost), httpOptions).subscribe(data => {
      //refresh comments/posts
      setTimeout(() => {
        this._loaderService.hide();

      }, 3000);
      // this.ngOnInit();
      post.Likes = post.IsLiked ? --post.Likes : ++post.Likes;
      post.IsLiked = !post.IsLiked;
    }, error => {
    });
  }

  //Add comment
  addComment(post: any, event, isButtonClicked) {
    if (post.CommentText && (event.key === "Enter" || isButtonClicked)) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
      };

      var objPost = { postid: post.Id, commenttext: post.CommentText };

      this._loaderService.show();
      this._httpClient.post(config.ServiceUrl + '/api/Gateway/addcomment', JSON.stringify(objPost), httpOptions).subscribe((data: any) => {
        //refresh comments/posts
        post.CommentText = null;

        setTimeout(() => {
          this._loaderService.hide();
        }, 3000);
        //this.ShowComment(this.post);
        this.ngOnInit();

      }, error => {
      });
    }
  }

  // //Show hide comment

  // ShowComment(item){
  //   item.isCommentsShow = !item.isCommentsShow;
  //   this.post=item;
  //   this.postid=item.id;
  // }

  //Add post
  createPost() {
    if (this.postFormGroup.invalid || !this.validImage) {
      this.isSubmitted = true;
      return;
    }

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

    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/me/posts/new', JSON.stringify(this.post), httpOptions).subscribe(data => {
      this.postFormGroup.value.postText = null;
      setTimeout(() => {
        this._loaderService.hide();
      }, 3000);
      this.postFormGroup.reset();
      this.isPosted = true;
      this.previewPhoto = 'http://via.placeholder.com/600x400';
      this.post.PostImgstr = [];
      //refresh comments/posts
      this.ngOnInit();
    }, error => {
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
      CommentId: comment.commentId, islike: isLike,
      Userid: LoginUserId, postId: postId
    };
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/LikeCommentbyId', JSON.stringify(paramPostommentLike), httpOptions).subscribe(data => {
      //refresh comments/posts
      comment.likes = comment.isLiked ? --comment.likes : ++comment.likes;
      comment.isLiked = !comment.isLiked;
      //  this.ngOnInit();
      this._loaderService.hide();
    }, error => {
      this._loaderService.hide();
    });
  }

}
