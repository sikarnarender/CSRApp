import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { BoschApi } from '../../shared/shared';

/**
 * Generated class for the LogbookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-logbook',
  templateUrl: 'logbook.html',
})
export class LogbookPage {
  menu: any;
  logDetails: any;
  resultLogDetails: any = {};
  paramName: any;
  paramValue: any;
  res: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private boschApi: BoschApi,
    public toastCtrl: ToastController,
    public events: Events) {
    this.res = this.navParams.data;
    this.logDetails = this.res.logDetails;
    this.pivotArray();
  }

  ionViewDidLoad() {
  };

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  pivotArray() {
    for (var i = 0; i < this.logDetails.length; i++) {
      this.resultLogDetails[this.logDetails[i]['atrribName'].toLowerCase()] = this.logDetails[i];
    }
  };

  getAttribValues() {
    for (var i = 0; i < this.logDetails.length; i++) {
      this.paramName = this.paramName + '`' + this.resultLogDetails[this.logDetails[i]['atrribName'].toLowerCase()].atrribName;
      this.paramValue = this.paramValue + '`' + this.resultLogDetails[this.logDetails[i]['atrribName'].toLowerCase()].atrribValue;
    }
    this.paramName =    this.paramName.slice(1);
    this.paramValue = this.paramValue.slice(1);
  }
  close() {
    this.navCtrl.pop();

  }
  save() {
    this.paramName = '';
    this.paramValue = '';
    this.getAttribValues();
    let param: any = {
      logId: 0,
      activityId: this.res.activityId,
      paramName: this.paramName,
      paramValue: this.paramValue,
      userName: this.res.userName
    };
    param.logId = this.res.isAdd === 'true' ? 0 : this.logDetails[0].logId;

    // if (this.res.isAdd === 'true') {
    //    param = {
    //     logId: 0,
    //     activityId: this.res.activityId,
    //     paramName: this.paramName,
    //     paramValue: this.paramValue,
    //     userName: this.res.userName
    //   }
    // }
    // else {
    //    param = {
    //     logId: this.logDetails[0].logId,
    //     activityId: this.res.activityId,
    //     paramName: this.paramName,
    //     paramValue: this.paramValue,
    //     userName: this.res.userName
    //   }
    // }
    console.log('param', param);
    this.boschApi.saveCSRActivityLogDetails(param).then(data => {
      this.presentToast('Logbook saved successfully!');
      this.close();
      this.events.publish('logbook:refresh');
      // this.navCtrl.push(ActivityLogsPage);

    });

  }
}
