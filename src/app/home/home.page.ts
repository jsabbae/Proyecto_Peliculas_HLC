import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

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
    precio: '',
    fecha: ''
  };

  peliculas: any[] = [];

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit() {
    this.firestore.collection('tareas').snapshotChanges().subscribe((res) => {
      this.peliculas = res.map((t) => {
        return {
          id: t.payload.doc.id,
          data: t.payload.doc.data()
        };
      });
    });
  }

  agregarPelicula() {
    this.firestore.collection('tareas').add(this.nuevaPelicula).then(() => {
      this.nuevaPelicula = {
        titulo: '',
        descripcion: '',
        director: '',
        musica: '',
        duracion: '',
        precio: '',
        fecha: ''
      };
    });
  }

  verDetalle(id: string) {
    this.router.navigate(['/detalle', id]);
  }

  agregarNuevo() {
    this.router.navigate(['/detalle', 'nuevo']);
  }
}