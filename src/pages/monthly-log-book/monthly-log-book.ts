import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,Events } from 'ionic-angular';
import { BoschApi } from '../../shared/shared';

/**
 * Generated class for the MonthlyLogBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-monthly-log-book',
  templateUrl: 'monthly-log-book.html',
})
export class MonthlyLogBookPage {

  result:any;
  monthlyLogDetails: any;
  monthlyLogItemModel = {"monthlyLogId":0,"activityId":0,"superwiserSalary":'',"serviceCharge":'',"waterTestingReport":'',"roFilter":'',"enveterSabhariya":'',
                           "saneteryItem":'', "canvece":'',"laberChargePlumber" :'',"accountinCharges":'',"poojaItem" :'',"flaxLaberStagerCharge":'',};
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private boschApi: BoschApi,
    public toastCtrl: ToastController,
    public events:Events) {
    this.result = this.navParams.data;
    console.log('this.result ',this.result);
    this.monthlyLogDetails =(this.result.monthlyLogDetails) ? this.result.monthlyLogDetails : this.monthlyLogItemModel;
    this.monthlyLogDetails.activityId =this.result.activityId;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MonthlyLogBookPage');
  }

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


  save() {
    console.log('before parse this.monthlyLogDetails ',this.monthlyLogDetails);

    for (var prop in this.monthlyLogDetails) {
      if (this.monthlyLogDetails.hasOwnProperty(prop)) {
        if(typeof this.monthlyLogDetails[prop] === 'string')
          {
            if(isNaN(parseFloat(this.monthlyLogDetails[prop]))){
            this.monthlyLogDetails[prop] = null;
          }
          else
            {
              this.monthlyLogDetails[prop] = parseFloat(this.monthlyLogDetails[prop]);
            }
          }
      }
  }
  this.monthlyLogDetails.userName =this.result.userName;
      this.boschApi.saveCSRMonthlyLogDetails(this.monthlyLogDetails).then(data => {
        this.presentToast('Monthly Logbook saved successfully!');
        this.close();
        this.events.publish('monthlylogbook:refresh');
        // this.navCtrl.push(ActivityLogsPage);

      });

    }

    close() {
      this.navCtrl.pop();
      
    }

}
