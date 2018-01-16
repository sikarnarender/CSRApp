//import { TabsComponent } from './../components/tabs/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { LocalStorageModule } from 'angular-2-local-storage';
// import { VideoPlayer } from '@ionic-native/video-player';
// import { StreamingMedia } from '@ionic-native/streaming-media';
// import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { MyApp } from './app.component';
// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
import {
  HomePage, ListPage, NewsDetailsPage, MenuDetailsPage,NewsGridPage,
  LoginPage, RoplantMapPage, LogbookPage, ActivityLogsPage,MonthlyLogsPage,MonthlyLogBookPage,
  VideoGalleryPage
} from '../pages/pages';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BoschApi,SeAuthApi,GlobalSettings } from './../shared/shared';
import { Push} from '@ionic-native/push';

// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': '926a5d06',
//   },
//   'push': {
//     'sender_id': '597565287685',
//     'pluginConfig': {
//       'ios': {
//         'badge': true,
//         'sound': true
//       },
//       'android': {
//         'iconColor': '#ff0000'
//       }
//     }
//   }
// };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    NewsDetailsPage,
    MenuDetailsPage,
    NewsGridPage,
    LoginPage,
    RoplantMapPage,
    LogbookPage,
    ActivityLogsPage,
    MonthlyLogsPage,
    MonthlyLogBookPage,
    VideoGalleryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    //CloudModule.forRoot(cloudSettings),
    HttpModule,
    LocalStorageModule.withConfig({
      prefix: 'bosch-app',
      storageType: 'localStorage'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    NewsDetailsPage,
    MenuDetailsPage,
    NewsGridPage,
    LoginPage,
    RoplantMapPage,
    LogbookPage,
    ActivityLogsPage,
    MonthlyLogsPage,
    MonthlyLogBookPage,
    VideoGalleryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Push,
    GlobalSettings,
    BoschApi,
    SeAuthApi
    // VideoPlayer,
    // StreamingMedia
    
  ]
})
export class AppModule { }
