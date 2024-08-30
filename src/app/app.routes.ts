import { Routes } from '@angular/router'
import { LoginComponent } from './features/login/login.component'
import { RegistroComponent } from './features/registro/registro.component'
import { EmpleadosComponent } from './features/empleados/empleados-list/empleados.component'
import { authGuard } from './core/guards/auth.guard'

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'empleados',
    component: EmpleadosComponent,
    canActivate: [authGuard],
  },
]
