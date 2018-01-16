import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { NewsDetailsPage } from '../pages';
import { BoschApi } from '../../shared/shared';

@Component({
  selector: 'page-news-grid',
  templateUrl: 'news-grid.html',
})
export class NewsGridPage {
  newses: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private boschApi: BoschApi,
    private loadingCntrl: LoadingController) {
    this.getAllNews();

  }

  getAllNews() {
    let loader = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    loader.present().then(() => {
      this.boschApi.getNews(0).then(data => {
        loader.dismiss();
        this.newses = data
      });
    });
  };

  getNewsbyId($event, news) {
    this.navCtrl.push(NewsDetailsPage, news)
  };
  ionViewDidLoad() {
  };
  refreshAll(refresher) {
    this.boschApi.getNews(0).then(data => {
      refresher.complete();
      this.newses = data
    });
  }
  ionViewLoaded() {
    // console.log('ionViewLoaded!');
  };

  ionViewWillEnter() {
    // console.log('ionViewWillEnter!');
  };

  ionViewWillLeave() {
    // console.log('ionViewWillLeave!');
  };

  ionViewDidUnload() {
    // console.log('ionViewDidUnload!');
  };
}
