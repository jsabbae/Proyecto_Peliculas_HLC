import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireStorage: AngularFireStorage) { }

  public insertar(coleccion: string, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }
  public consultar(coleccion: string) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }
  public consultarPorId(coleccion: string, id: string) {
    return this.angularFirestore.collection(coleccion).doc(id).snapshotChanges();
  }

  //  Fase 6

  public subirImagenBase64(nombreCarpeta: string, nombreArchivo: string, imagenBase64: string) {
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  public eliminarArchivoPorURL(url: string) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }


}
