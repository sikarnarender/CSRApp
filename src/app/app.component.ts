import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ModalController,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalStorageService } from 'angular-2-local-storage';
import { BoschApi, GlobalSettings } from './../shared/shared';
// import {LetterAvatarDirective} from '../directives/letter-avatar.directive';
// import {Push,PushToken} from '@ionic/cloud-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
// import { FCM } from '@ionic-native/fcm';
import {
  HomePage, MenuDetailsPage, LoginPage, RoplantMapPage,
  NewsGridPage, ActivityLogsPage, MonthlyLogsPage
} from '../pages/pages';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  dynamicMenus: any;
  // staticMenus: Array<{ pageId: number, title: string, icon: string, component: any }>;
  authorizedMenus: Array<{ pageId: number, title: string, icon: string, component: any }>;
  homeMenu: any;
  loginMenu: any;
  logoutMenu: any;
  isLoggedIn: boolean = false;
  user: { firstinitial: string, firstName: string, lastName: string } = { firstinitial: '', firstName: '', lastName: '' };
  // firstinitial: string;
  // userFirstName: string;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public localStorageService: LocalStorageService,
    public modalCtrl: ModalController,
    public boschApi: BoschApi,
    public globalSettings: GlobalSettings,
    public push: Push,
    public alertCtrl: AlertController) {

    this.init();
    this.events.subscribe('user:login', () => {
      this.initializeApp();
      this.authorizedUser();
      this.nav.setRoot(HomePage);
    });

  }

  init() {

    this.initializeApp();
    this.homeMenu = { pageId: 1, title: 'Home', icon: 'home', component: HomePage }

    // this.staticMenus = [
    //   { pageId: 2, title: 'CSR Maps', icon: 'clipboard', component: RoplantMapPage },
    //   { pageId: 3, title: 'News', icon: 'settings', component: NewsGridPage }
    // ];
    this.getDynamicMenus();
    this.authorizedUser();
  }

  initializeApp() {
    this.globalSettings.getStoredData();
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
      this.getUserNameAndInitial();


    });
  }

  getUserNameAndInitial() {
    this.user.firstName = this.globalSettings.firstName;
    this.user.lastName = this.globalSettings.lastName;
    if (this.user && this.user.firstName != '')
      this.user.firstinitial = this.user.firstName.substring(0, 1);

  }

  openPage(menu) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(menu.component);
  }
  // navigateStaticMenus($event, staticMenu) {
  //   this.nav.push(staticMenu.component, staticMenu);
  // }
  navigatePage($event, menu) {
    this.nav.push(MenuDetailsPage, menu);
  }

  authorizedNavigatePage($event, authorized) {
    this.nav.push(authorized.component, authorized);
  }

  showLogin(isSignIn) {
    if (isSignIn) {
      let modal = this.modalCtrl.create(LoginPage);
      modal.present();
    }
    else {
      this.localStorageService.remove('authorizationData');
      this.isLoggedIn = false;
      this.authorizedMenus = [];
      this.globalSettings.getStoredData();
      // for(let authMenu of this.authorizedMenus){
      //   this.dynamicMenus.splice(this.dynamicMenus.map(function(x) {return x.title}).indexOf(authMenu.title),1 );
      // }
      this.nav.setRoot(HomePage);
    }
  }

  authorizedUser() {
    if (this.globalSettings.isLoggedIn) {
      this.isLoggedIn = true;
      this.authorizedMenus = [
        { pageId: 1, title: 'Daily Logbook', icon: 'easel', component: ActivityLogsPage },
        { pageId: 2, title: 'Monthly Logbook', icon: 'easel', component: MonthlyLogsPage }
      ];
    }
  }

  getDynamicMenus() {
    this.boschApi.getPageMenus().then(data => {

      this.dynamicMenus = data;
      if (this.dynamicMenus && this.dynamicMenus.length > 0) {
        let aboutUs = this.dynamicMenus
                      .filter((x) => x.pageName.toLowerCase() === 'about us')
                      .map((x) => x);
          if(aboutUs){
          this.globalSettings.aboutUsPage = aboutUs[0];
          this.events.publish('aboutUs:loding');
        }
        this.dynamicMenus.splice(this.dynamicMenus.map(function(x) {return x.pageName}).indexOf('About Us'),1 );
      }
      
    });

  }


  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.log('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '733285509807'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      // console.log('device token -> ' + data.registrationId);
      let topic = "allNews";
      pushObject.subscribe(topic).then((res:any) => {
          
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      // console.log('message -> ' + data.message);
      if (data.additionalData.foreground) {
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              this.nav.push(NewsGridPage, { message: data.message });
            }
          }]
        });
        confirmAlert.present();
      } else {
        this.nav.push(NewsGridPage, { message: data.message });
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

}
