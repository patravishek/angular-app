import { Component, OnInit, ViewChild,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
// import { ChangeDetectorRef } from '@angular/core';
import { UserDetails, UserLookingFor } from '../../models/user.model';
import { SuggestedFarmer } from '../../models/SuggestedFarmer.model';
import { Post } from '../../models/post.model';
import { config } from '../../config/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { _ } from 'underscore';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/delay';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge } from 'rxjs/observable/merge';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DEFAULTIMAGES } from '../../constants/constants';
import * as signalR from '@aspnet/signalr';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType,JsonHubProtocol } from '@aspnet/signalr';
declare var $: any;
@Component({
  selector: 'app-feed-page',
  templateUrl: './feed.component.html'
})
export class FeedComponent implements OnInit {
  public _httpClient: HttpClient;
  public userDetails = new UserDetails();
  public suggestedFarmers: SuggestedFarmer[];
  postFormGroup: FormGroup;
  public posts: Post[] = [];
  public photos: string[];
  public post = new Post(null);
  isSubmitted = false;
  public selectedFile: File;
  previewPhoto = 'http://via.placeholder.com/600x400';
  rootImgPath: any = config.imgPath;
  isPosted = false;
  validImage = true;
  loggedInUserId: any = localStorage.getItem('id');
  userDet: any = {};
  defaultUserImg = DEFAULTIMAGES.UserImage;
  searchText: null;
  public sharepostmodel:any={};
  //Search autocomplete
  UserList: any = [];
  @ViewChild('instance') instance: NgbTypeahead;
  focusSearchUser$ = new Subject<string>();
  clickSearchUser$ = new Subject<string>();
  SelectedUser: any;
  //End search autocomplete

  Loginuserid: any;
  Token: any;
  public _hubConnection: HubConnection;
  public NotificationList:any=[];
  public IsHubConnected:boolean=false;
  connectionEstablished = new EventEmitter<Boolean>();

  constructor(http: HttpClient, private formBuilder: FormBuilder, private router: Router
    , public _loaderService: LoaderService,private dataservice:DataService) {
    this._httpClient = http;
  }

  ngOnInit() {

    this.Loginuserid=window.localStorage.getItem('id');
    this.Token=window.localStorage.getItem('token');
  //   if (this.Token && this.Loginuserid) {
  //     this.createConnection();
  //     this.startConnection();
  // }

    this.getSearchUserList();

    this.post.PostImgstr = [];
    this.postFormGroup = this.formBuilder.group({
      postText: ['', Validators.required],
      IsPublicOrMutual: [''],
    });

    this.postFormGroup.controls['IsPublicOrMutual'].setValue("true", {onlySelf: true});
    
    this.previewPhoto = 'http://via.placeholder.com/600x400';
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    });

    //Get posts
    this._loaderService.show();
    this._httpClient.get<Post[]>(config.ServiceUrl + '/api/gateway/Post/GetAllActivityFeed?userid = ' + this.loggedInUserId, { headers: httpOptions }).subscribe(data => {
      this.posts = data != null ? data.map(a => new Post(a)) : [];
      setTimeout(() => {
        this._loaderService.hide();

      }, 5000);
    },
      error => {
        setTimeout(() => {
          this._loaderService.hide();

        }, 5000);
      });

    this.getUser();

    this._loaderService.show();
    this._httpClient.get<UserDetails>(config.ServiceUrl + '/api/gateway/userprofile', { headers: httpOptions }).subscribe((data: any) => {
      this.userDetails = new UserDetails(data);
      setTimeout(() => {
        this._loaderService.hide();

      }, 5000);
      var profilePic = data.profilePicture;
      this.userDetails.UserImageUrl = (profilePic.fileName) ? (this.rootImgPath + profilePic.fileName) : this.defaultUserImg;

      //if (data["profilePicture"] != null)
      //  this.userDetails.UserImageUrl = '/Upload/' + data["profilePicture"].fileName;
      //else
      //  this.userDetails.UserImageUrl = 'http://via.placeholder.com/100x100';
      //this.userDetails.FirstName = data["firstName"];
      //this.userDetails.LastName = data["lastName"];
      //this.userDetails.Street = data["street"];
      //this.userDetails.Birthday = data["birthday"];
      //this.userDetails.City = data["city"];
      //this.userDetails.Bio = data["bio"];
      //this.userDetails.Education = data["education"];
      //this.userDetails.Hobbies = data["hobbies"];
      //this.userDetails.State = data["state"];
      //this.userDetails.UserIntrests = data["userIntrests"];
      console.log(this.userDetails);
      //Map the response
    }, error => {
      console.log(JSON.stringify(error.json()));
    });

    // this._loaderService.show();
    // this._httpClient.get<SuggestedFarmer[]>(config.ServiceUrl + '/api/gateway/suggestedfarmers', { headers: httpOptions }).subscribe(data => {
    //   this.suggestedFarmers = data.map(a => new SuggestedFarmer(a));
    //   this._loaderService.hide();
    // },
    //   error => {
    //     this._loaderService.hide();
    //   });

  }

  // //Like/unlike post
  // LikeUnllike(post: Post) {
  //   const httpOptions = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + window.localStorage.getItem('token')
  //   });

  //   post.Likes = post.IsLiked ? --post.Likes : ++post.Likes;
  //   this._loaderService.show();
  //   this._httpClient.post('api/gateway/likeunlike', { isLike: !post.IsLiked }, { headers: httpOptions }).subscribe(data => {
  //     post.IsLiked = !post.IsLiked;
  //     this._loaderService.hide();
  //     //this.ngOnInit(); 
  //   },
  //     error => {
  //       this._loaderService.hide();
  //     });
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
    this.post.IsPublicOrMutual = this.postFormGroup.value.IsPublicOrMutual;
    this._loaderService.show();
    this.post.CreatedDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
    this.post.PostonotherUserId = this.loggedInUserId;
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/me/posts/new', JSON.stringify(this.post), httpOptions).subscribe(data => {
      this.postFormGroup.value.postText = null;
      this.postFormGroup.reset();
      this.isPosted = true;
      this.previewPhoto = 'http://via.placeholder.com/600x400';
      this.post.PostImgstr = [];
      //refresh comments/posts
      this.ngOnInit();
      this._loaderService.hide();
    }, error => {
      this._loaderService.hide();
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
      post.Likes = post.IsLiked ? --post.Likes : ++post.Likes;
      post.IsLiked = !post.IsLiked;
      //  this.ngOnInit();
      this._loaderService.hide();
          this.GetNotification();
       
    //   if (this.Token && this.Loginuserid) {
    //     this.createConnection();
    //     this.startConnection();
    // }
    // if (this.IsHubConnected && this.Loginuserid) {
    //     this._hubConnection.invoke('GetNotificationForUser', this.Loginuserid).then(data => {
    //         console.log(data);
    //       this._hubConnection.on('SenNotificationTouser', (data) => {
    //         console.log(data);
    //         })
    //     });
    //     // .catch(err => {
    //     //   console.log('Error while establishing connection, retrying...');
    //     //   setTimeout(() => this.startConnection(), 5000);
    //     //   });
    //     }

    }, error => {
      this._loaderService.hide();
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
      this._httpClient.post(config.ServiceUrl + '/api/Gateway/addcomment', JSON.stringify(objPost), httpOptions).subscribe(data => {
        //refresh comments/posts
        post.CommentText = null;

        var oldPostList = this.posts;
        var oldPosts = oldPostList.filter(function (item: any) { return item.isCommentsShow });
        this._loaderService.hide();

        //Get posts
        this._loaderService.show();
        this._httpClient.get<Post[]>(config.ServiceUrl + '/api/gateway/Post/GetAllActivityFeed?userid = ' + this.loggedInUserId, httpOptions).subscribe(data => {
          this.posts = data != null ? data.map(a => new Post(a)) : [];
          var oldPostIds = oldPosts.map(function (item) { return item.Id; });
          var newCommentedPosts = this.posts.filter(function (item) { return oldPostIds.includes(item.Id) });
          newCommentedPosts.forEach(function (item: any) {
            item.isCommentsShow = true;
          });
          this._loaderService.hide();
        },
          error => {
            this._loaderService.hide();
          });
      }, error => {
        this._loaderService.hide();
      });
    }
  }

  //Search
  searchActivityFeed() {
    if (this.searchText) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        })
      };

      this._loaderService.show();
      this._httpClient.get<Post[]>(config.ServiceUrl + '/api/Gateway/Post/SearchActivityFeed?searchtext=' + this.searchText, httpOptions).subscribe(data => {
        //refresh comments
        this.posts = data != null ? data.map(a => new Post(a)) : [];
        this._loaderService.hide();

        //this.searchText = null;
      }, error => {
        this._loaderService.hide();
      });
    }
  }

  //get logged in user details
  getUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/userprofile', httpOptions).subscribe((data: any) => {
      this.userDet = {
        userImageUrl: data.userImageUrl,
        FarmName: data.FarmName,
        FirstName: data.firstName,
        LastName: data.lastName,
        FollowerCount: data.followedbyCount,
        FollowingCount: data.followingCount
      };

      var profilePic = data.profilePicture;
      this.userDet.UserImageUrl = (profilePic.fileName) ? (this.rootImgPath + profilePic.fileName) : this.defaultUserImg;

      this._loaderService.hide();
    },
      error => {
        this._loaderService.hide();
      });
  }

  //Get user list for search
  getSearchUserList() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
      })
    };
    this._loaderService.show();
    this._httpClient.get(config.ServiceUrl + '/api/gateway/GetUserListBySearchString', httpOptions).subscribe((data: any) => {
      this._loaderService.hide();
      this.UserList = data;
    },
      error => {
        this._loaderService.hide();
      });

  }

  //Search user autocomplete start
  searchUser = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    //const clicksWithClosedPopup$ = this.clickSearchUser$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusSearchUser$; //clicksWithClosedPopup$
    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? this.UserList
        : this.UserList.filter(v => v.fullName.toLowerCase().indexOf(term != null ? term.toLowerCase() : "") > -1)).slice(0, 10))
    );
  }
  formatterUser = (x: { fullName: string }) => x.fullName;

  selectedUser(item) {
    this.SelectedUser = item.item;
  }

  //Search user autocomplete start

  //view User Profile
  viewUserProfile(id) {
    if (this.SelectedUser && this.SelectedUser.userId) {
      this.router.navigate(['/userProfile/' + this.SelectedUser.userId]);
    }
    else {
      if (id)
        this.router.navigate(['/userProfile/' + id]);
    }
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
    this.loggedInUserId=window.localStorage.getItem('id');
    var paramPostommentLike = {
      CommentId: comment.CommentId, islike: isLike,
      Userid: LoginUserId, postId: postId
    };
    this._loaderService.show();
    this._httpClient.post(config.ServiceUrl + '/api/Gateway/LikeCommentbyId', JSON.stringify(paramPostommentLike), httpOptions).subscribe(data => {
      //refresh comments/posts
      comment.likes = comment.IsLiked ? --comment.Likes : ++comment.Likes;
      comment.IsLiked = !comment.IsLiked;
      //  this.ngOnInit();
      this._loaderService.hide();
    }, error => {
      this._loaderService.hide();
    });
  }

 

   createConnection() {
    this._hubConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
        })
        .configureLogging(LogLevel.Debug)
        .build();
        this._hubConnection.serverTimeoutInMilliseconds = 9999999999999;

        this._hubConnection.invoke('GetNotificationForUser', this.Loginuserid).then(data => {
          this._hubConnection.on('AppNotifications', (data: string) => {
            console.log('AppNotifications data');
            console.log(data);
        });
        });

       
}
 startConnection(): void {
  this._hubConnection
  .start()
  .then(data => {
      console.log('Hub connection started');
      this.IsHubConnected=true;
      this.connectionEstablished.next(true);
      this.GetNotification();
      // if (this.Token && this.Loginuserid) {
      //   this._hubConnection.invoke('GetNotificationForUser', this.Loginuserid).then(data => {
      //       console.log(data);
      //     this._hubConnection.on('SenNotificationTouser', (data) => {
      //       console.log(data);
      //       })
      //   });
      //   // .catch(err => {
      //   //   console.log('Error while establishing connection, retrying...');
      //   //   setTimeout(() => this.startConnection(), 5000);
      //   //   });
      //   }
      });
      
  // .catch(err => {
  //     console.log('Error while establishing connection, retrying...');
  //     setTimeout(() => this.startConnection(), 5000);
  // });
}

GetNotification(){
//   .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token, {
//     skipNegotiation: true,
//     transport: HttpTransportType.WebSockets
// })
const protocol = new JsonHubProtocol();
  this._hubConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:44391/MyChatHub?UserID=" + this.Loginuserid + "&token=" + this.Token,
        {skipNegotiation: true,
       transport: HttpTransportType.WebSockets})
       // .configureLogging(signalR.LogLevel.Information)
        .configureLogging({
          log: function(logLevel, message) {
              console.log(new Date().toISOString() + ": " + message);
          }
      })
        .withHubProtocol(protocol)
        .build();
        this._hubConnection.serverTimeoutInMilliseconds = 9999999999999;
  this._hubConnection
        .start()
        .then(data => {
            console.log('Hub connection started');
            this.IsHubConnected=true;
            if (this.Loginuserid) {
              this._hubConnection.invoke('GetNotificationForUser', this.Loginuserid).then(data => {
                  //console.log(data);
                this._hubConnection.on('SenNotificationTouser', (data) => {
                      this.dataservice.getNotificationList(data);
                  //console.log(data);
                  })
              }) 
              .catch(err => {
                console.log('Error while establishing connection, retrying...');
                setTimeout(() => this.GetNotification(), 5000);
                });
              }
           // })
            
        // .catch(err => {
        //     console.log('Error while establishing connection, retrying...');
        //     setTimeout(() => this.startConnection(), 5000);
        });
  
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
  var currentdate = new Date();
  var paramPost = { PostId: this.sharepostmodel.Id, PostOwnerId: this.sharepostmodel.AuthorUserId,SharebyOwnerId:this.loggedInUserId,CreatedOn:currentdate };
  this._loaderService.show();
  this._httpClient.post(config.ServiceUrl + '/api/Gateway/PostShareByPostId', JSON.stringify(paramPost), httpOptions).subscribe(data => {
    $("#share-post").modal('hide');
    this.ngOnInit();
  
    this._loaderService.hide();
  }, error => {
    this._loaderService.hide();
  });
}

}
