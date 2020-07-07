import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContatosListComponent } from './pages/contatos-list/contatos-list.component';


const routes: Routes = [
  {
    path: 'home',
    component: ContatosListComponent
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
