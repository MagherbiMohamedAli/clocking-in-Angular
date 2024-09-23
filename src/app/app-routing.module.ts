import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { AddAbsenceComponent } from './add-absence/add-absence.component';
import { ManageAbsComponent } from './manage-abs/manage-abs.component';
import { MyAbsenceComponent } from './my-absence/my-absence.component';
import { UsersListComponent } from './users-list/users-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {path:"login", component: AuthComponent},
  {path:"", component: HomeComponent, canActivate:[authGuard]},
  {path:"home", component: HomeComponent, canActivate:[authGuard]},
  {path:"addUsers", component: AddUsersComponent, canActivate:[adminGuard]},
  {path:"addabs", component: AddAbsenceComponent, canActivate:[authGuard]},
  {path:"manageabs", component: ManageAbsComponent, canActivate:[adminGuard]},
  {path:"myabs", component: MyAbsenceComponent, canActivate:[authGuard]},
  {path:"users", component: UsersListComponent, canActivate:[adminGuard]},
  {path:"projects", component: ProjectsComponent, canActivate:[adminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
