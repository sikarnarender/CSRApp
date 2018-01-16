import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BoschApi } from '../../shared/shared';
declare var google;
@Component({
  selector: 'page-roplant-map',
  templateUrl: 'roplant-map.html',

})

export class RoplantMapPage {
  @ViewChild('map') mapElement;
  map: any;
  defaultlatitude: any;
  defaultlongitude: any;
  infoWindows: any = [];
  locations: any = [];
  selectedROPlantlocation: any = {};
  oldCenter: any;

  constructor(public nacCtrl: NavController,
    private boschApi: BoschApi) {
    this.infoWindows = [];
    this.defaultlatitude = 26.876753;
    this.defaultlongitude = 75.816456;
  }

  ionViewDidLoad() {
    this.getRoPlantLocations();

  };
  getRoPlantLocations() {
    this.boschApi.getCSRActivities(1).then(data => {
      this.locations = data;
      if (this.locations) {
        this.defaultlatitude = this.locations[0].latitude;
        this.defaultlongitude = this.locations[0].longitude;
      }
      this.initMap(this.defaultlatitude, this.defaultlongitude);
    });
  }

  initMap(lat, lang) {
    let latLang = new google.maps.LatLng(lat, lang);
    let mapOptions = {
      center: latLang,
      disableDefaultUI: true,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker, i;
    let markers = [];
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var labelIndex = 0;
    let image ='assets/images/Marker_img.png'
    for (i = 0; i < this.locations.length; i++) {
      var infoWindowContent = '<div id="content">' +
      '<h3>' + this.locations[i].activityName + '</h3>' +
      '<p>' + this.locations[i].address + ', ' + this.locations[i].zipCode + '</p>' +
      '<p>' + this.locations[i].city + ', ' + this.locations[i].state + '</p>'
    '</div>';
      let infowindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.locations[i].latitude, this.locations[i].longitude),
        map: map,
        title: this.locations[i].activityName,
        optimized: false,
        // icon: image,
        animation: google.maps.Animation.DROP,
        infowindow:infowindow,
        componentRestrictions: {country: 'in'}
      });
     
      let infoWindows: any = [];
      markers.push(marker);
      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          hideAllInfoWindows(map);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

    let hideAllInfoWindows = function(map){
      markers.forEach(function (marker) {
        marker.infowindow.close(map, marker);
      });
      
    }

    let toggleBounce =function () {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
          marker.setAnimation(google.maps.Animation.DROP);
      }
    }

    //Strict boundary to Rajashthan
    var strictBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(28.5929, 77.0346),
      new google.maps.LatLng(25.5736,93.2473)
    );
    // var strictBounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(27.0238, 74.2179),
    //   new google.maps.LatLng(27.0238,74.2179)
    // );
    // google.maps.event.addListener(this.map, 'bounds_changed', function () {
    //   alert(this.map.getBounds());
    // });
    // google.maps.event.addListenerOnce(map, "center_changed", function () {
    //   console.log('center_changed varMap ', varMap);
    //   this.oldCenter = map.getCenter();
    //   console.log('center_changed oldCenter', this.oldCenter);
    // });

    // Listen for the dragend event
    // google.maps.event.addListener(map, 'dragend', function () {
    //   if (strictBounds.contains(map.getCenter()))
    //     {
    //       console.log('dragend return');
    //       return;
    //     } 
    //   // We're out of bounds - Move the map back within the bounds
    //   console.log('dragend bounds');
    //   var c = map.getCenter(),
    //     x = c.lng(),
    //     y = c.lat(),
    //     maxX = strictBounds.getNorthEast().lng(),
    //     maxY = strictBounds.getNorthEast().lat(),
    //     minX = strictBounds.getSouthWest().lng(),
    //     minY = strictBounds.getSouthWest().lat();
    //   if (x < minX) x = minX;
    //   if (x > maxX) x = maxX;
    //   if (y < minY) y = minY;
    //   if (y > maxY) y = maxY;
    //   map.setCenter(new google.maps.LatLng(y, x));
    // });

    // google.maps.event.addListener(map, 'zoom_changed', function () {
    //   if (strictBounds.contains(map.getCenter()))
    //     {
    //       console.log('zoom_changed return');
    //       return;
    //     } 
    //   // We're out of bounds - Move the map back within the bounds
    //   console.log('zoom_changed bounds');
    //   var c = map.getCenter(),
    //     x = c.lng(),
    //     y = c.lat(),
    //     maxX = strictBounds.getNorthEast().lng(),
    //     maxY = strictBounds.getNorthEast().lat(),
    //     minX = strictBounds.getSouthWest().lng(),
    //     minY = strictBounds.getSouthWest().lat();
    //   if (x < minX) x = minX;
    //   if (x > maxX) x = maxX;
    //   if (y < minY) y = minY;
    //   if (y > maxY) y = maxY;
    //   // map.setCenter(new google.maps.LatLng(y, x));
    //   map.setCenter(new google.maps.LatLng(this.defaultlatitude, this.defaultlongitude));
    // });

  }

  refreshMap() {
    this.selectedROPlantlocation = {};
    this.initMap(this.defaultlatitude, this.defaultlongitude);
  }

  getSelectedROPlantLocation($event) {
    // console.log('Ok location>', this.selectedROPlantlocation);
    if (this.selectedROPlantlocation && this.selectedROPlantlocation.latitude)
      this.initMap(this.selectedROPlantlocation.latitude, this.selectedROPlantlocation.longitude);
  }

  closeAllInfoWindows(infoWindows) {
    // console.log('closeAllInfoWindows');
    for (let window of infoWindows) {
      window.close();
    }
  }

}