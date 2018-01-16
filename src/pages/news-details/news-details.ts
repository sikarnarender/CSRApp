import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewsDetailsPage page.
 */

// @IonicPage()
@Component({
  selector: 'page-news-details',
  templateUrl: 'news-details.html',
})
export class NewsDetailsPage {
  news :any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.news = navParams.data;
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad NewsDetailsPage');
  // }

}
