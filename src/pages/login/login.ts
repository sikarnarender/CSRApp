import { Component } from '@angular/core';
import { App,NavController, NavParams, ViewController,Events,ToastController  } from 'ionic-angular';
import { SeAuthApi } from '../../shared/shared';

/**
 * Generated class for the LoginPage page.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // loginForm : FormGroup;
  user : {userName :string, password :string};
  compCode: string = 'solvent';
  userName: string;
  password: string;
  authentication :any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private seAuthApi: SeAuthApi,
              public app:App,
              public events: Events,
              public toastCtrl: ToastController
              ) {
  this.user = {userName : '',password :'' };
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
  }

  login() {
    if(this.userName === undefined || this.password === undefined|| this.userName ==='' || this.password==='') {
      this.presentToast('Please fill Username/Password correctly!','warning-toast-style');
      return;
    }
    this.user.userName = this.userName;
    this.user.password = this.password;
    this.seAuthApi.login(this.user).then(data  => {
      this.authentication = data;
      if(this.authentication.isAuth)
        {
          this.presentToast('You have successfully logged in!','warning-toast-style');
          this.dismiss(data);
          this.events.publish('user:login');
        }
        else
         {
          this.presentToast(this.authentication.error_description,'error-toast-style')
        }
    })
  }

  presentToast(msg,cssClassName) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      cssClass:"error-toast-style"
    });
    
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

}
