import { Component,ViewChild  } from '@angular/core';
import { NavController, ModalController,Events } from 'ionic-angular';
import { NewsDetailsPage, LoginPage,RoplantMapPage,NewsGridPage,MenuDetailsPage,VideoGalleryPage } from '../pages';
import { BoschApi, GlobalSettings } from '../../shared/shared';
import { LocalStorageService } from 'angular-2-local-storage';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {

  // newses: Array<{heading: string, shortDesc: string,detail:newsContent}>=[];
  @ViewChild('homeSlider') homeSlider: any;
  newses: any = [];
  icons: string[];
  homePageSlides: any = [
      //{ image: "assets/images/menu.png" }
      //, { image: "assets/images/menuwitouttext.png" }
      { image: "assets/images/header.png" },
      { image: "assets/images/background_2.jpg" },
      { image: "assets/images/background_3.jpg" },
      { image: "assets/images/background_4.jpg" },
      { image: "assets/images/background_5.jpg" }
  ];
  slideOptions: any = {};
  bottomTabs :any = [
     {title: 'News', icon: 'newspaper-o', component: NewsGridPage },
     {title: 'Video', icon: 'video-camera', component: VideoGalleryPage },
     {title: 'Maps', icon: 'street-view', component: RoplantMapPage },
     { title: 'About Us', icon: 'address-book-o', component: MenuDetailsPage }
   ];
  isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController,
    private boschApi: BoschApi,
    public modalCtrl: ModalController,
    private localStorageService: LocalStorageService,
    public globalSettings: GlobalSettings,
    private loadingCntrl: LoadingController,
    public events: Events) {

      this.events.subscribe('aboutUs:loding', () => {
        console.log('this.globalSettings.aboutUsPage ',  this.globalSettings);
      });
   
}

ionViewDidLoad() {
  this.homeSlider.autoHeight = true;
  // Getting local storage data 
  this.globalSettings.getStoredData();
  if (this.globalSettings.isLoggedIn) {
    this.isLoggedIn = true;
  }
  this.getHomePageNews(3);
 
};

ionViewWillEnter() {
  this.homeSlider.startAutoplay();
}

ionViewWillLeave(){
  this.homeSlider.stopAutoplay();
}

getHomePageNews(newsCount) {

  let loader = this.loadingCntrl.create({
    content: 'Please Wait...',
    spinner: 'dots'
  });

  loader.present().then(() => {
    this.boschApi.getNews(newsCount).then(data => {
      loader.dismiss();
      this.newses = data;
    });
  });
}

getNewsbyId($event, news) {
  this.navCtrl.push(NewsDetailsPage, news)
};
showLogin() {
  let modal = this.modalCtrl.create(LoginPage, null, {
    enableBackdropDismiss: false
  });
  modal.present();
}

navigateBottomTabs(tab){
  if(tab.title.toLowerCase() === 'about us')
  {
    this.navCtrl.push(MenuDetailsPage,this.globalSettings.aboutUsPage);
  }
  else{
  this.navCtrl.push(tab.component);
}

}

}

