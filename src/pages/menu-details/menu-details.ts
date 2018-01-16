import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { BoschApi } from '../../shared/shared';

/**
 * Generated class for the MenuDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-menu-details',
  templateUrl: 'menu-details.html',
})
export class MenuDetailsPage {
  menu: any;
  selectedPage: any = {};
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private boschApi: BoschApi,
              private loadingCntrl: LoadingController) {
          this.menu = this.navParams.data;
          this.getPageContent(this.menu.id);
        }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad MenuDetailsPage');
  // }

  getPageContent(pageId) {
    this.boschApi.getPageContent(pageId).then(data => {
      if (data)
        this.selectedPage = data[0];
    });


    let loader = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    loader.present().then(() => {
      this.boschApi.getPageContent(pageId).then(data => {
        if (data)
          this.selectedPage = data[0];
        loader.dismiss();
      });
    });
    
  }

}
