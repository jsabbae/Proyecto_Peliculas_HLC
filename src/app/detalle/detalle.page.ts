import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../pelicula';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../firestore.service';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';



@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {

  //  Función  de respuesta a la alerta de eliminación de la película seleccionada
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.eliminarPelicula();
      },
    },
  ];


  id: string = "";
  document: any = {
    id: "",
    data: {} as Pelicula
  };
  /*
  isNew nos servirá para determinar si estamos creando un nuevo elemento
  o editando uno existente. Si es true, estamos creando un nuevo elemento.
  Si es false, estamos editando un elemento existente.
  */
  isNew: boolean = false

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService,
    private router: Router, private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker,
    private alertController: AlertController
  ) { }

  //  Mensaje si deseas eliminar la película
  async presentAlert() {
    var alert = await this.alertController.create({ //  Creación de la alerta
      header: 'Confirmar',  //  Cabecera de la alerta
      message: '¿Estás seguro de que deseas borrar esta película?', //  Mensaje de la alerta
      buttons: this.alertButtons, //  El botón de alerta definido
    });

    await alert.present();  //  Muestra la alerta
  }


  ngOnInit() {
    //  Se almacena en una variable el id que se ha recibido desde la página anterior
    var idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      this.isNew = this.id === 'nuevo';
    } else {
      this.id = "";
    }

    //  Se hace la consulta a la base de datos para obtener los datos asociado a esa id
    if (!this.isNew) {
      this.firestore.collection('peliculas').doc(this.id).get().subscribe((resultado: any) => {
        if (resultado.exists) { // Verifica si existe el docuemnto
          this.document.id = resultado.id;
          this.document.data = resultado.data();
          console.log(this.document.data.titulo);
        } else {
          this.document.data = {} as Pelicula;
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  editarPelicula() {
    if (this.isNew) { //  Introduce una nueva película del botón <ion-fab-button>
      this.firestore.collection('peliculas').add(this.document.data).then(() => {
        //  Navega de regreso a la lista
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido creada`);
      });
    } else {  //  Edita una película existente
      this.firestore.collection('peliculas').doc(this.id).update(this.document.data).then(() => {
        //  Navega de regreso a la lista
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido editada`);
      });
    }
  }

  eliminarPelicula() {
    if (!this.isNew) {
      this.firestore.collection('peliculas').doc(this.id).delete().then(() => {
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido eliminada`);
      });
    }
  }


  imagenSelec: string = "";

  async seleccionarImagen() {
    //  Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        //  Si no tiene permiso de lectura se solicitará al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          //  Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  //  Permitir sólo 1 imagen
            outputType: 1 //  1 = Base64
          }).then(
            (results) => {  //  En la variable de results se tiene las imágenes seleccionadas
              if (results.length > 0) { //  Si el usuario ha elegido alguna imagen
                //  EN LA VARIABLE imagenSelec  QUEDA ALMACENADA LA IMAGEN SELECCIONADA
                this.imagenSelec = "data:image/jpeg;base64," + results[0];
                console.log("Imagen que se ha seleccionado (en Base64):" + this.imagenSelec);
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  async subirImagen() {
    //  Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait ...'
    });
    //  Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    //  Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    //  Mostrar el mensaje de espera
    loading.present();
    //  Asignar el nombre de la imagen en función  de la hora actual para
    //  evitar duplicidades de nombres
    let nombreImagen = `${new Date().getTime()}`;
    //  Llamar al método que subbe la imagen al Storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            //  EN LA VARIABLE donloadURL SE OBTIENE LA DIRECCIÓN URL DE LA IMAGEN
            console.log("downloadURL:" + downloadURL);
            //  this.document.data.imagenURL = downloadURL;
            //  Mostrar el mensaje de finalización de la subida
            toast.present();
            //  Ocultar mensaje  de espera
            loading.dismiss();
          })
      })
  }

  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.eliminarArchivoPorURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

}
