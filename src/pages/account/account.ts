import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SERVER_URL } from '../../providers/config';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { normalizeURL } from 'ionic-angular';
import { LandingPage } from '../landing/landing';
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
  user: any;
  lastImage: string = null;

  submitAttempt: boolean = false;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.user = JSON.parse(window.localStorage.getItem('auth_user'));

    this.accountForm = formBuilder.group({
      name: [this.user.name, Validators.required],
      phone_country_code: [this.user.phone_country_code, Validators.required],
      phone_number: [this.user.phone_number, Validators.required],
      email: [this.user.email],
      password: ['', Validators.minLength(6)]

    });
    
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();

      this.authService.getUser()
        .then(resp => {

          this.user = resp;
          
          //let d = new Date();
          //this.user.avatar_path = this.user.avatar_path + '?' + d.getTime()
          console.log(this.user.avatar_path)

          window.localStorage.setItem('auth_user', JSON.stringify(resp));


          this.accountForm.get('name').setValue(this.user.name)
          this.accountForm.get('email').setValue(this.user.email)
          this.accountForm.get('phone_country_code').setValue(this.user.phone_country_code)
          this.accountForm.get('phone_number').setValue(this.user.phone_number)
      

          loader.dismissAll();
        })
        .catch(error => {

          let message = 'Ha ocurrido un error en obteniendo informacion de la cuenta';

          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
          loader.dismiss();

        });
    }
   
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
      quality: 50,
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
      newFileName = n + ".jpg";
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
      return normalizeURL(cordova.file.dataDirectory + img);
    }
  }

  public uploadImage() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      // Destination URL
      var url = `${this.serverUrl}/api/account/avatars`;

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      var filename = this.lastImage;


      var options = {
        fileKey: "avatar",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename },
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }
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

      
        // let d = new Date();
        // this.user.photo = '/storage/' + data.response + '?' + d.getTime();
        // window.localStorage.setItem('auth_user', JSON.stringify(this.user));
        // this.lastImage = null;
      }, err => {
        loader.dismissAll()
        console.log(err);
        this.presentToast('Error mientras se subia el archivo.');
      });
    }
  }
  cancelAccount(){

    let alert = this.alertCtrl.create({
      title: 'Eliminar cuenta',
      message: 'Esta seguro que quieres eliminar esta cuenta?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.cancelCuenta()
          }
        }
      ]
    });
    alert.present();
  }
  
  cancelCuenta(){
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Cuenta Eliminada Correctamente';
      let styleClass = 'success';

     

        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

        loader.present();

        this.authService.cancelAccount()
          .then(data => {

            loader.dismiss();
            console.log(data);
           
            window.localStorage.removeItem('auth_user');
            window.localStorage.removeItem('token');

            this.navCtrl.setRoot(LandingPage);
    


            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast ' + styleClass,
              duration: 3000
            });
            toast.present(toast);
            this.errorAuth = "";
            



          })
          .catch(error => {

            let message = 'Ha ocurrido un error eliminando la cuenta.';
            let errorSaveText = error.statusText;
            let errorSaveTextPhone = error.statusText;

           
            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 4500
            });

            toast.present(toast);
            loader.dismiss();
          });
      
    }

  }
  update() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Cuenta Actualizada Correctamente';
      let styleClass = 'success';

      if (this.accountForm.valid) {


        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

        loader.present();

        this.authService.update(this.accountForm.value)
          .then(data => {

            loader.dismiss();
            console.log(data);
            if (data.error) {
              this.errorAuth = data.error;
              return;
            }


            window.localStorage.setItem('auth_user', JSON.stringify(data));


            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast ' + styleClass,
              duration: 3000
            });
            toast.present(toast);
            this.errorAuth = "";
            this.clearForm(this.accountForm);



          })
          .catch(error => {

            let message = 'Ha ocurrido un error actualizando la cuenta.';
           

            if (error.status == 422) {
              let errorSaveText = "";
              let errorSaveTextPhone = "";
              let body = JSON.parse(error._body)

              if (body.errors.email)
                errorSaveText = body.errors.email[0]
              if (body.errors.phone_number)
                errorSaveTextPhone = body.errors.phone_number[0]

              message = message + errorSaveText + ' ' + errorSaveTextPhone

            }

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 4500
            });

            toast.present(toast);
            loader.dismiss();
          });
      }
    }
  }

  clearForm(form) {

    form.get('password').setValue('')


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



}
