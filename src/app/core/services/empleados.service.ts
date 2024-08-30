import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment.development'
import * as _ from 'lodash'
import { Observable } from 'rxjs'
import { AgregarEmpleado } from '../interfaces/empleado-add.interface'
import { Empleado } from '../interfaces/empleado.interface'
import { EmpleadosFilter } from '../interfaces/empleados-filter'

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  private http = inject(HttpClient)
  private baseUrl: string = environment.apiUrl

  getAll(filters?: EmpleadosFilter): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleados`, {
      params: _.omitBy(filters, _.isUndefined),
    })
  }

  add(empleado: AgregarEmpleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.baseUrl}/empleados`, empleado)
  }

  edit(empleado: Empleado): Observable<Empleado> {
    return this.http.patch<Empleado>(
      `${this.baseUrl}/empleados/${empleado._id}`,
      empleado,
    )
  }

  delete(id: string): Observable<Empleado> {
    return this.http.delete<Empleado>(`${this.baseUrl}/empleados/${id}`)
  }

  getPuestos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/empleados/puestos`)
  }
}
