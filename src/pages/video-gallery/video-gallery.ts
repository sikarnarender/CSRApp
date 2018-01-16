import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BoschApi } from '../../shared/shared';
// import { VideoPlayer } from '@ionic-native/video-player';
// import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
@Component({
  selector: 'page-video-gallery',
  templateUrl: 'video-gallery.html',
})
export class VideoGalleryPage {
 
  // public videoLocation: any = 'http://localhost:21089/UploadedDocuments/';
  public videoLocation: any = 'http://webapi.boschjaipursocialengagement.com/UploadedDocuments/';
  public videos: any =[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private boschApi: BoschApi,
    private loadingCntrl: LoadingController
    // private videoPlayer: VideoPlayer,
    // private streamingMedia: StreamingMedia
  ) {
  }

  ionViewDidLoad() {
    this.getVideoGallery();
    // let options: StreamingVideoOptions = {
    //   successCallback: () => { console.log('Video played') },
    //   errorCallback: (e) => { console.log('Error streaming') },
    //   orientation: 'landscape'
    // };

    // this.streamingMedia.playVideo('/assets/videos/38 Property-Binding-final.mov', options);

    // this.videoPlayer.play('/assets/videos/38 Property-Binding-final.mov').then(() => {
    //   console.log('video completed');
    //  }).catch(err => {
    //   console.log(err);
    //  });
  }

  getVideoGallery() {
    let loader = this.loadingCntrl.create({
      content: 'Please wait...',
      spinner: 'bubbles'
    });
    loader.present().then(() => {
      this.boschApi.getVideos().then((data: any) => {
        data.forEach(element => {
          element.fileUrl = this.videoLocation + element.fileUrl;
          this.videos.push(element);
        });
        loader.dismiss();
      });
    });

  }

}
