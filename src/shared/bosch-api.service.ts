import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { GlobalSettings } from '../shared/shared';

@Injectable()
export class BoschApi {
    // private baseApiUrl: string = 'http://localhost:21089/api';
    private baseApiUrl: string = 'http://webapi.boschjaipursocialengagement.com/api';
    constructor(public http: Http) {
        // this.baseApiUrl = globalSettings.backendUrl + 'api';
    }

    getNews(recordCount) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/News/${recordCount}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    getCSRActivities(activityType) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/CSRActivity/${activityType}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    getPageContent(pageId) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/Page/${pageId}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    getPageMenus() {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/Page`)
                .subscribe(res => resolve(res.json()));
        });
    };

    // Get CSR Activty Log Details
    getCSRActivityLogDetails(userName) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/CSRActivityLog/${userName}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    //Save CSR Activity logs
    saveCSRActivityLogDetails(params) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return new Promise(resolve => {
            this.http.post(`${this.baseApiUrl}/CSRActivityLog`,
                params,
                {
                    headers: headers
                })
                .subscribe(data => {
                    if (data.status === 200) {
                        return resolve(data.json());
                    }
                    // console.log('response ',data.json());
                },
                err => {
                    if (err.status === 400) {
                        return resolve(err.json());
                    }
                });
        });
    }

    getCSRActivityByUser(userName) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/CSRActivityLog/activities/${userName}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    // Get CSR Monthly Log Details
    getCSRMonthlyLogDetails(userName) {
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/CSRMonthlyLog/${userName}`)
                .subscribe(res => resolve(res.json()));
        });
    };

    //Save CSR Monthly logs
    saveCSRMonthlyLogDetails(params) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return new Promise(resolve => {
            this.http.post(`${this.baseApiUrl}/CSRMonthlyLog`,
                params,
                {
                    headers: headers
                })
                .subscribe(data => {
                    if (data.status === 200) {
                        return resolve(data.json());
                    }
                    // console.log('response ',data.json());
                },
                err => {
                    if (err.status === 400) {
                        return resolve(err.json());
                    }
                });
        });
    }

    // Get Video Gallery
    getVideos(){
        return new Promise(resolve => {
            this.http.get(`${this.baseApiUrl}/Document`)
                .subscribe(res => resolve(res.json()));
        });
    }
}
