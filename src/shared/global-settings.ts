import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer'
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class GlobalSettings {

  //public backendUrl: string = 'http://localhost:21089/';
  public backendUrl: string = 'http://webapi.boschjaipursocialengagement.com/';
  public data: any;
  public dataChangeObserver: Observer<any>;
  public dataChange: Observable<any>;
  public activities: any;
  public firstName: string;
  public lastName: string;
  public isLoggedIn: boolean = false;
  public userName:string;
  public aboutUsPage :any ;
  constructor(private localStorageService: LocalStorageService, ) {
    this.getStoredData();
    this.dataChange = new Observable((observer: Observer<any>) => {
      this.dataChangeObserver = observer;
    });
  }

  updateValue(value) {
    // console.log('value', value);
    if (this.dataChangeObserver) {
      this.dataChangeObserver.next(value);
    }
  }

  getStoredData() {
    let authorizationData: any = this.localStorageService.get('authorizationData');
    // console.log('authorizationData', authorizationData);
    if (authorizationData && authorizationData.token && authorizationData.token.access_token) {
      this.activities = authorizationData.token.activities;
      this.firstName = authorizationData.token.firstName;
      this.lastName = authorizationData.token.lastName;
      this.userName = authorizationData.token.userName;
      this.isLoggedIn = true;
    }
    else {
      this.activities = '';
      this.firstName = '';
      this.lastName = '';
      this.userName ='';
      this.isLoggedIn = false;

    }
  }

}