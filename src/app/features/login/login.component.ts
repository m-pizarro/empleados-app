import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '@app/core/services/auth.service'
import { Login } from '@app/core/interfaces/login.interface'
import { AuthStoreService } from '@app/core/services/auth.store.service'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService)
  private authStoreService = inject(AuthStoreService)
  private router = inject(Router)
  public formBuild = inject(FormBuilder)
  readonly snackBar = inject(MatSnackBar)

  public formLogin: FormGroup = this.formBuild.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  iniciarSesion() {
    if (this.formLogin.invalid) return

    const request: Login = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    }

    this.authService.login(request).subscribe({
      next: (data) => {
        if (data) {
          this.authStoreService.setUserName(request.email)
          this.authStoreService.setAccessToken(data.access_token)
          this.authStoreService.setRefreshToken(data.refresh_token)

          this.router.navigate(['empleados'])
        }
      },
      error: (error) => {
        this.snackBar.open('Las credenciales son incorrectas', 'Cerrar', {
          duration: 3000,
        })
      },
    })
  }

  registrarse() {
    this.router.navigate(['registro'])
  }
}
