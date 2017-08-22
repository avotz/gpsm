import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import {SERVER_URL} from '../../providers/config';

declare var cordova: any;




@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  serverUrl: String = SERVER_URL;
  accountForm: FormGroup;
  errorAuth;
  tags;
  user:any;
  lastImage: string = null;
 
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform,) {

  	   this.navCtrl = navCtrl;
       this.user = JSON.parse(window.localStorage.getItem('auth_user'));
       console.log(this.user);
       this.accountForm = formBuilder.group({
        name: [this.user.name,Validators.required],
        email: [this.user.email,Validators.required],
        password: ['',Validators.minLength(6)]
       
      });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Cargar desde la biblioteca',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar la Camara',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = `${this.serverUrl}/api/account/avatars`;
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;


    var options = {
      fileKey: "photo",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename},
      headers: {'Accept': 'application/json',
      'Authorization': 'Bearer '+ window.localStorage.getItem('token')}
    };
   
    const fileTransfer: TransferObject = this.transfer.create();
   
    let loader = this.loadingCtrl.create({
      content: 'Subiendo...',
    });
    loader.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      loader.dismissAll()
      this.presentToast('Imagen subida correctamente.');

      console.log(data);
      let d = new Date();
      this.user.photo = '/storage/'+data.response+'?'+d.getTime();
      window.localStorage.setItem('auth_user', JSON.stringify(this.user));
      this.lastImage = null;
    }, err => {
      loader.dismissAll()
      console.log(err);
      this.presentToast('Error mientras se subia el archivo.');
    });
  }

   update(){

     this.submitAttempt = true;
     let message ='Cuenta Actualizada Correctamente';
     let styleClass ='success';

    if(this.accountForm.valid){
      
 
     let loader = this.loadingCtrl.create({
        content: "Espere por favor...",
        //duration: 3000
      });

    loader.present();
   
     this.authService.update(this.accountForm.value)
            .then(data => {

               loader.dismiss();
               console.log(data);
               if(data.error)
              {
                this.errorAuth = data.error;
                return;
              }
      
             
             window.localStorage.setItem('auth_user', JSON.stringify(data));
             

              let toast = this.toastCtrl.create({
                message: message,
                cssClass: 'mytoast '+ styleClass,
                duration: 3000
            });
              toast.present(toast);
              this.errorAuth = "";
              this.clearForm(this.accountForm);
             
            

            })
            .catch(error => {

                alert(error)
              
               loader.dismiss();
            });
      }
  }

  clearForm(form){
    
     form.get('password').setValue('')
     
   
   }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



}
