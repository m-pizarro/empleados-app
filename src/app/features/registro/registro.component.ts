import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { AuthService } from '@app/core/services/auth.service'
import { Usuario } from '@app/core/interfaces/usuario.interface.ts'

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private authService = inject(AuthService)
  private router = inject(Router)
  public formBuild = inject(FormBuilder)

  public formRegistro: FormGroup = this.formBuild.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  registrarse() {
    if (this.formRegistro.invalid) return

    const objeto: Usuario = {
      email: this.formRegistro.value.email,
      password: this.formRegistro.value.password,
    }

    this.authService.registrarse(objeto).subscribe({
      next: (data) => {
        if (data) {
          this.router.navigate([''])
        } else {
          alert('Hubo un error al regitrar el usuario.')
        }
      },
    })
  }

  volver() {
    this.router.navigate([''])
  }
}
