import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule
} from '@angular/material';
import { NgxsModule } from '@ngxs/store';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthState } from './auth.state';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // material
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,

    // ngxs
    NgxsModule.forFeature([AuthState]),

    // local
    AuthRoutingModule
  ],
  declarations: [LoginComponent],
  providers: [AuthService, AuthGuard, LoginGuard]
})
export class AuthModule {}
