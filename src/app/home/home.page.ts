import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  peliculas: any[] = [];
  nuevaPelicula: any = {
    titulo: '',
    descripcion: ''
  };

  constructor(
    private router: Router,
    private firestore: AngularFirestore
  ) { }

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
    if (this.nuevaPelicula.titulo && this.nuevaPelicula.descripcion) {
      this.firestore.collection('tareas').add(this.nuevaPelicula).then(() => {
        this.nuevaPelicula = { titulo: '', descripcion: '' }; // Limpia el formulario
      });
    }
  }

  verDetalle(id: string) {
    this.router.navigate(['/detalle', id]);
  }
}