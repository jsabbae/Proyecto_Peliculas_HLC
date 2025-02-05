import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarea } from '../tarea';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';



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
    data: {} as Tarea
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
    private router: Router,
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
      this.firestore.collection('tareas').doc(this.id).get().subscribe((resultado: any) => {
        if (resultado.exists) { // Verifica si existe el docuemnto
          this.document.id = resultado.id;
          this.document.data = resultado.data();
          console.log(this.document.data.titulo);
        } else {
          this.document.data = {} as Tarea;
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  editarPelicula() {
    if (this.isNew) { //  Introduce una nueva película del botón <ion-fab-button>
      this.firestore.collection('tareas').add(this.document.data).then(() => {
        //  Navega de regreso a la lista
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido creada`);
      });
    } else {  //  EDita una película existente
      this.firestore.collection('tareas').doc(this.id).update(this.document.data).then(() => {
        //  Navega de regreso a la lista
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido editada`);
      });
    }
  }

  eliminarPelicula() {
    if (!this.isNew) {
      this.firestore.collection('tareas').doc(this.id).delete().then(() => {
        this.router.navigate(['/home']);
        console.log(`La película ${this.document.data.titulo} ha sido eliminada`);
      });
    }
  }
}