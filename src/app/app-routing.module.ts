import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {path:"login", component: AuthComponent},
  {path:"", component: HomeComponent, canActivate:[authGuard]},
  {path:"home", component: HomeComponent, canActivate:[authGuard]},
  {path:"addUsers", component: AddUsersComponent, canActivate:[adminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]

})
export class AppRoutingModule { }
