import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddUsersComponent } from './add-users/add-users.component';
import { authInterceptorProviders } from './services/interceptor/interceptor';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddAbsenceComponent } from './add-absence/add-absence.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // <-- Import this
import { MatInputModule } from '@angular/material/input';
import { ManageAbsComponent } from './manage-abs/manage-abs.component';
import { MyAbsenceComponent } from './my-absence/my-absence.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserUpdateComponent } from './user-update/user-update.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AddUsersComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    AddAbsenceComponent,
    ManageAbsComponent,
    MyAbsenceComponent,
    UsersListComponent,
    UserUpdateComponent
    ],
  imports: [
    MatTableModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    AppRoutingModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    RouterModule.forRoot([]),
    FormsModule,
    ReactiveFormsModule,
    CommonModule

  ],
  providers: [authInterceptorProviders, provideAnimationsAsync(), MatNativeDateModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
