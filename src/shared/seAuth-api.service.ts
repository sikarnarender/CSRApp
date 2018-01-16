import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/catch';
// import { GlobalSettings } from '../shared/shared';


@Injectable()
export class SeAuthApi {

    private baseApiUrl: string = 'http://webapi.boschjaipursocialengagement.com/';
    // private baseApiUrl: string = 'http://localhost:21089/';
    // private baseApiUrl: string;
    authentication = {
        isAuth: false,
        userName: '',
        useRefreshTokens: false,
        firstName: '',
        lastName: '',
        compCode: '',
        userType: '',
        activities:''
    };
    constructor(public http: Http
        , public localStorageService: LocalStorageService
        // , public globalSettings: GlobalSettings
    ) {
        // this.baseApiUrl = globalSettings.backendUrl;
    }

    login(user) {

        let params = this.serialize({
            username: user.userName,
            password: user.password,
            compCode: user.compCode,
            grant_type: 'password',
            client_id: ''
        });
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        return new Promise(resolve => {
            this.http.post(`${this.baseApiUrl}/token`,
                params,
                {
                    headers: headers
                })
                .subscribe(data => {
                    if (data.status === 200) {
                        this.setUser(user, data.json())
                        return resolve(this.authentication);
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

    serialize(obj): URLSearchParams {
        let params: URLSearchParams = new URLSearchParams();
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var element = obj[key];
                params.set(key, element);
            }
        }
        return params;
    }

    // save the token resonse in local storage.
    setUser(user, response) {

        if (user.useRefreshTokens) {
            this.localStorageService.set('authorizationData', {
                token: response,
                userName: user.userName,
                refreshToken: response.refresh_token,
                useRefreshTokens: true,
                firstName: response.firstName,
                lastName: response.lastName,
                compCode: response.compCode,
                userType: response.userType,
                activities: response.response
            });
        }
        else {
            this.localStorageService.set('authorizationData', {
                token: response,
                userName: user.userName,
                refreshToken: "",
                useRefreshTokens: false,
                firstName: response.firstName,
                lastName: response.lastName,
                compCode: response.compCode,
                userType: response.userType,
                activities: response.response
            });
        }
        this.authentication.isAuth = true;
        this.authentication.userName = user.userName;
        this.authentication.useRefreshTokens = user.useRefreshTokens;
        this.authentication.firstName = response.firstName;
        this.authentication.lastName = response.lastName;
        this.authentication.compCode = response.compCode;
        this.authentication.userType = response.userType;
        this.authentication.activities = response.activities;
        // console.log('authentication ', this.authentication);
    };
}
