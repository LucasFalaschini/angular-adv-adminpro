import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';


import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [

    // path: '/dashboard' PagesRoutingModule
    // path: '/auth' AuthRoutingModule

    { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    { path: '**', component: PagenotfoundComponent }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
