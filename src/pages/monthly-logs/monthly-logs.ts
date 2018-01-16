import { Component } from '@angular/core';
import { NavController, NavParams,Events, LoadingController  } from 'ionic-angular';
import { BoschApi, GlobalSettings } from '../../shared/shared';
import { MonthlyLogBookPage } from '../pages';

declare var require;
var moment = require('moment/moment');

/**
 * Generated class for the MonthlyLogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-monthly-logs',
  templateUrl: 'monthly-logs.html',
})
export class MonthlyLogsPage {
  logs: any;
  templogs: any;
  isExpenseAddedFortheMonth: boolean = false;
  isCSRActivityAvailable: boolean = true;
  userActivityList: any;
  selectedActivity: any = {};

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private boschApi: BoschApi,
    public events: Events,
    private loadingCntrl: LoadingController,
    public globalSettings: GlobalSettings) {

      this.globalSettings.getStoredData();
      this.events.subscribe('monthlylogbook:refresh', () => {
        this.getCSRMonthlyLogDetails();
      });
  }

  ionViewDidLoad() {
    this.getCSRActivityByUser();
  }

  //get CSR Activity for the logedIn User

  getCSRActivityByUser() {
    this.boschApi.getCSRActivityByUser(this.globalSettings.userName).then((data: any) => {
      if (data.length > 0) {
        this.userActivityList = data;
        this.isCSRActivityAvailable = true;
        this.selectedActivity = this.userActivityList[0];
        this.getCSRMonthlyLogDetails();
      }
      else {
        this.isCSRActivityAvailable = false;
      }
    });
  }

  // change method of activities

  getSelectedActivity($event) {
    if (this.templogs && this.templogs.length > 0) {
      this.logs = this.templogs.filter(x => x.activityId == this.selectedActivity.activityId);
      if (this.logs && this.logs.length > 0) {
        this.checkActivityStatus();
      }
      else
        {
          this.isExpenseAddedFortheMonth = false;
        }
    }
    else{
      this.isExpenseAddedFortheMonth = false;
    }
  }

  // fetch CSR Activity by User method of activities
  getCSRMonthlyLogDetails() {
    let loader = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.isExpenseAddedFortheMonth = false;
      this.boschApi.getCSRMonthlyLogDetails(this.globalSettings.userName).then((data: any) => {
        this.templogs = data;
        console.log('this.templogs>>',this.templogs);
        this.logs = this.templogs.filter(x => x.activityId == this.selectedActivity.activityId);
        if (this.logs) {
          this.checkActivityStatus();
        }
        loader.dismiss();
      });

    });
  }

checkActivityStatus(){
  // let currentDate = moment().format('YYYY-MM-DD');
  let startDate =  moment().startOf('month').format("YYYY-DD-MM");
  let endDate =  moment().endOf("month").format("YYYY-DD-MM");
  for (var i = 0; i < this.logs.length; i++) {
    let activityDate = moment(this.logs[i].createdOn).format('YYYY-MM-DD');
    if (activityDate >= startDate && activityDate <= endDate &&  !this.isExpenseAddedFortheMonth) {
      this.isExpenseAddedFortheMonth = true;
    }
    if (activityDate >= startDate && activityDate <= endDate) {
      this.logs[i].isActivityDone = false;
    }
    else {
      this.logs[i].isActivityDone = true;
    }
  }
}
  // Add/edit activity log details
  addEditLogDetails($event, isAdd, log) {
    let monthlyLogDetails: any;
    if (isAdd === 'false') {
      monthlyLogDetails = log;
    }
    this.navCtrl.push(MonthlyLogBookPage, {
      'isAdd': isAdd,
      'monthlyLogDetails': monthlyLogDetails,
      'isActivityDone': log.isActivityDone ? true : false,
      'activityId':this.selectedActivity.activityId,
      'userName':this.globalSettings.userName
    });
  }

}
