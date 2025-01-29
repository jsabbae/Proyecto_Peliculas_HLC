import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tarea } from '../tarea';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {
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
    private router: Router
  ) { }

  ngOnInit() {
    //  Se almacena en una variable el id que se ha recibido desde la página anterior
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
    } else {
      this.id = "";
    }

    //  Se hace la consulta a la base de datos para obtener los datos asociado a esa id
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
  cancelar() {
    this.router.navigate(['/home']);
  }

  editarPelicula() {
    console.log('Editar película');
  }

  eliminarPelicula() {
    if (!this.isNew) {
      this.firestore.collection('tareas').doc(this.id).delete().then(() => {
        this.router.navigate(['/home']);
      });
    }
    console.log('Eliminar película');
  }
}