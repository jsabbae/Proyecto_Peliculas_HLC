import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detalle/:id',
    loadChildren: () => import('./detalle/detalle.module').then(m => m.DetallePageModule)
  },
  // Para el ion-fab-button
  {
    path: 'detalle/new',
    loadChildren: () => import('./detalle/detalle.module').then(m => m.DetallePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  idTareaSelec: string = "";

  constructor(private router: Router) { }
  selectTarea() {
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }
}


