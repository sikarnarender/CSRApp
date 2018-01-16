import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { BoschApi, GlobalSettings } from '../../shared/shared';
import { LogbookPage } from '../pages';
// import { Moment } from 'moment/moment';
declare var require;
var moment = require('moment/moment');

@Component({
  selector: 'page-activity-logs',
  templateUrl: 'activity-logs.html',
})
export class ActivityLogsPage {
  logs: any;
  templogs: any;
  activityAttributes: any;
  isActivityAddedFortheDay: boolean = false;
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
    this.events.subscribe('logbook:refresh', () => {
      this.getCSRActivityLogDetails();
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
        this.getCSRActivityLogDetails();
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
      else {
        this.isActivityAddedFortheDay = false;
      }
    }
    else {
      this.isActivityAddedFortheDay = false;
    }
  }


  // fetch CSR Activity by User method of activities
  getCSRActivityLogDetails() {
    let loader = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });

    loader.present().then(() => {
      this.isActivityAddedFortheDay = false;
      this.boschApi.getCSRActivityLogDetails(this.globalSettings.userName).then((data: any) => {
        this.templogs = data.activities;
        this.logs = this.templogs.filter(x => x.activityId == this.selectedActivity.activityId);
        this.activityAttributes = data.activityAttributes;
        if (this.logs) {

          this.checkActivityStatus();
        }
        loader.dismiss();
      });

    });
  }

  checkActivityStatus() {
    let currentDate = moment().format('YYYY-MM-DD');
    for (var i = 0; i < this.logs.length; i++) {
      let activityDate = moment(this.logs[i].createdOn).format('YYYY-MM-DD');
      if (currentDate === activityDate && !this.isActivityAddedFortheDay) {
        this.isActivityAddedFortheDay = true;
      }
      if (currentDate > activityDate) {
        this.logs[i].isActivityDone = true;
      }
      else {
        this.logs[i].isActivityDone = false;
      }
    }
  }
  // Add/edit activity log details
  addEditLogDetails($event, isAdd, log) {
    let logDetails: any;
    if (isAdd === 'true') {
      logDetails = this.activityAttributes;
    }
    else {
      if (this.activityAttributes.length == log.activityLogDetails.length) {
        logDetails = log.activityLogDetails;
      }
      else {
        this.activityAttributes.forEach(element => {
          let filterData = log.activityLogDetails
            .filter(x => x.atrribName === element.atrribName)
            .map(x => x);
          if (filterData.length == 0) {
            let missingObj ={
              "atrribName": element.atrribName,
              "atrribValue":""
            }
            log.activityLogDetails.push(missingObj);
          }
        });
        logDetails = log.activityLogDetails;
      }
    }

    console.log('logDetails ',logDetails);
    this.navCtrl.push(LogbookPage, {
      'isAdd': isAdd,
      'logDetails': logDetails,
      'isActivityDone': log.isActivityDone ? true : false,
      'activityId': this.selectedActivity.activityId,
      'userName': this.globalSettings.userName
    });
  }

}
