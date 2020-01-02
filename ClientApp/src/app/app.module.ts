import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { RouterModule } from '@angular/router';
import { WebcamModule } from 'ngx-webcam';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxMaskModule } from 'ngx-mask';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { EventPageComponent } from './events/eventPage.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { FooterComponent } from './footer/footer.component';
import { SignUpPopupComponent } from './signup-popup/signup-popup.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileViewComponent } from './profileview/profileview.component';
import { DataService } from './services/data.service';
import { EventDataService } from './services/eventData.service';
import { LoginService } from './services/login.service';
import { ProfileEditComponent } from './profileeditview/profileedit.component';
import { SingleEventComponent } from './events/singleEvent.component';
import { NewEventComponent } from './events/newEvent.component';
import { FeedComponent } from './feed/feed.component';
import { DirectoryComponent } from './directory/directory.component';
import { DirectoryDetailsComponent } from './directory/directorydetails.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderService } from './services/loader.service';
import { CommonService } from './Common/Commonservice';
import { JwtInterceptor } from './Common/JwtInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './Common/AuthGuard';
import { SuggestedFarmersComponent } from './suggested-farmers/suggested-farmers.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ToastrModule } from 'ngx-toastr';
import { ServiceComponent } from './service/service.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FollowedUnfollowingComponent } from './followed-unfollowing/followed-unfollowing.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxCaptchaModule } from 'ngx-captcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignalRService } from './signalR/signalRService';
import { MessagesComponent } from './messages/messages.component';
import { MyOfficeComponent } from './myoffice/myoffice.component';
import { ProductComponent } from './product/product.component';
import { StoreEditComponent } from './storeedit/storeedit.component';
import { AddProductComponent } from './addproduct/addproduct.component';
import { TagsInputModule } from 'ngx-tags-input/dist';
import { SalesComponent } from './sales/sales.component';
import { ShopComponent } from './shop/shop.component';
import { FarmStoreComponent } from './farmstore/farmstore.component';

import { ShareModule } from '@ngx-share/core';
import { AccountverificationComponent } from './accountverification/accountverification.component';
import { PressComponent } from './press/press.component';
import { NotificationComponent } from './notification/notification.component';
import { HertComponent } from './hert/hert.component';
import { AddEditHerdComponent } from './hert/add-edit-herd/add-edit-herd.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AuctionComponent } from './auction/auction.component';
import { NewlistingComponent } from './newlisting/newlisting.component';
import { BidComponent } from './bid/bid.component';
import { CartCheckoutComponent } from './cart-checkout/cart-checkout.component';
import { BidOfferComponent } from './bid-offer/bid-offer.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { HealthIssueComponent } from './health-issue/health-issue.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    //provider: new GoogleLoginProvider("84384583545-mo797j8pruhtsgtc8e7rd62a3p2pgprq.apps.googleusercontent.com")  //Production
    provider: new GoogleLoginProvider("103770249833-7c0g9t85kcbt39k63itbsi6qp94gmu4r.apps.googleusercontent.com") //Staging
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    //provider: new FacebookLoginProvider("1016128518568470") //production
    provider: new FacebookLoginProvider("369019620512770")  // staging
  }
]);
export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    FooterComponent,
    SignUpPopupComponent,
    SignupComponent,
    ProfileViewComponent,
    ProfileEditComponent,
    EventPageComponent,
    SingleEventComponent,
    NewEventComponent,
    FeedComponent,
    DirectoryComponent,
    DirectoryDetailsComponent,
    SuggestedFarmersComponent,
    UserProfileComponent,
    ServiceComponent,
    AboutComponent,
    ContactComponent,
    TermsAndConditionComponent,
    PrivacyPolicyComponent,
    FollowedUnfollowingComponent,
    MessagesComponent,
    ProductComponent,
    AddProductComponent,
    StoreEditComponent,
    MyOfficeComponent,
    SalesComponent,
    ShopComponent,
    FarmStoreComponent,
    AccountverificationComponent,
    PressComponent,
    NotificationComponent,
    HertComponent,
    AddEditHerdComponent,
    CheckoutComponent,
    AuctionComponent,
    NewlistingComponent,
    BidComponent,
    CartCheckoutComponent,
    BidOfferComponent,
    ProductDetailsComponent,
    HealthIssueComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule, ReactiveFormsModule, WebcamModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    SocialLoginModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
    }),
    NgbModule.forRoot(),
    ShareModule.forRoot(),
    TagsInputModule.forRoot(),
    UiSwitchModule,
    ImageCropperModule,
    ModalModule,
    NgxCaptchaModule.forRoot({
      //reCaptcha2SiteKey: '6Ld08WYUAAAAAKGqtwyhrU7EsGto9bra76wdmMPc', // optional, can be overridden with 'siteKey' component property
      reCaptcha2SiteKey: '6Lfv8YoUAAAAADc3d-eQjdtSNgl7Lii_SZ1RFQkB',
    }),

    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'sign-up', component: SignupComponent },
      { path: 'feed', component: FeedComponent },
      { path: 'myprofile', component: ProfileViewComponent, canActivate: [AuthGuard] },
      { path: 'editprofile', component: ProfileEditComponent, canActivate: [AuthGuard] },
      { path: 'eventPage', component: EventPageComponent, canActivate: [AuthGuard] },
      { path: 'directory', component: DirectoryComponent },
      { path: 'directory/:id', component: DirectoryDetailsComponent },
      { path: 'newEvent', component: NewEventComponent, canActivate: [AuthGuard] },
      { path: 'userProfile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'services', component: ServiceComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'term', component: TermsAndConditionComponent },
      { path: 'privacy', component: PrivacyPolicyComponent },
      { path: 'followers', component: FollowedUnfollowingComponent, canActivate: [AuthGuard] },
      { path: 'singleEvent/:id', component: SingleEventComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'product', component: ProductComponent },
      { path: 'addproduct/:id', component: AddProductComponent },
      { path: 'storeedit', component: StoreEditComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'farmstore', component: FarmStoreComponent },
      { path: 'myoffice', component: MyOfficeComponent },
      { path: 'ValidateAccount', component: AccountverificationComponent },
      { path: 'press', component: PressComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: 'herd', component: HertComponent },
      { path: 'herd/AddEdit/:Id', component: AddEditHerdComponent },
      { path: 'checkout/:id', component: CheckoutComponent },
      { path: 'auction', component: AuctionComponent },
      { path: 'newListing', component: NewlistingComponent },
      { path: 'bid/:id', component: BidComponent },
      { path: 'cartCheckout', component: CartCheckoutComponent },
      { path: 'bidOffer', component: BidOfferComponent },
      { path: 'productDetails/:id', component: ProductDetailsComponent }
    ])
  ],
  providers: [DataService, EventDataService, LoaderService, LoginService, CommonService, AuthGuard,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    SignalRService,
    BsModalService
  ],
  entryComponents: [
    HealthIssueComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

