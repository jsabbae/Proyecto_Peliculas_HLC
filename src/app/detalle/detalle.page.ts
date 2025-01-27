import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  document: any = {
    id: "",
    data: {} as Tarea
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestore: AngularFirestore 
  ) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = "";
    }

    this.firestore.collection('tareas').doc(this.id).get().subscribe((resultado: any) => {
      if (resultado.exists) {
        this.document.id = resultado.id;
        this.document.data = resultado.data();
        console.log(this.document.data.titulo);
      } else {
        this.document.data = {} as Tarea;
      }
    });
  }

  editarPelicula() {
    // Lógica para editar la película
    console.log('Editar película');
  }

  eliminarPelicula() {
    // Lógica para eliminar la película
    console.log('Eliminar película');
  }
}