import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx'; // Asegúrate de tener esta librería

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nuevaPelicula: any = {
    titulo: '',
    descripcion: '',
    director: '',
    musica: '',
    duracion: '',
    precio: 0,
    fecha: '',
    imagenURL: ''  // Campo para la URL de la imagen
  };

  peliculas: any[] = [];
  imagenSelec: string = '';
  fechaValida: boolean = true;

  constructor(private firestore: AngularFirestore, private router: Router, private imagePicker: ImagePicker) { }

  ngOnInit() {
    this.firestore.collection('peliculas').snapshotChanges().subscribe((res) => {
      this.peliculas = res.map((t) => {
        return {
          id: t.payload.doc.id,
          data: t.payload.doc.data()
        };
      });
    });
  }

  // Función para seleccionar la imagen
  async seleccionarImagen() {
    try {
      const results = await this.imagePicker.getPictures({
        maximumImagesCount: 1,
        outputType: 1 // 1 = Base64
      });

      if (results.length > 0) {
        this.imagenSelec = "data:image/jpeg;base64," + results[0];
        console.log("Imagen seleccionada (Base64):", this.imagenSelec);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen', error);
    }
  }


  // Función para agregar la película a Firestore
  agregarPelicula() {

    this.nuevaPelicula.imagenURL = this.imagenSelec; // Asigna la imagen seleccionada a la nueva película

    this.firestore.collection('peliculas').add(this.nuevaPelicula).then(() => {
      this.nuevaPelicula = {
        titulo: '',
        descripcion: '',
        director: '',
        musica: '',
        duracion: '',
        precio: '',
        fecha: '',
        imagenURL: ''
      };
      this.imagenSelec = '';  // Reinicia la imagen seleccionada
    });
  }

  verDetalle(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  agregarNuevo() {
    this.router.navigate(['/detalle', 'nuevo']);
  }


}