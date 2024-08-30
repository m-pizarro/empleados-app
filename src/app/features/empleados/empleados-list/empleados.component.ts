import { Component, inject, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { EditarEmpleado } from '@app/core/interfaces/empleado-edit.interface'
import { Empleado } from '@app/core/interfaces/empleado.interface'
import { EmpleadosFilter } from '@app/core/interfaces/empleados-filter'
import { EmpleadosService } from '@app/core/services/empleados.service'
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component'
import { EmpleadoEditComponent } from '../empleado-edit/empleado-edit.component'
import { EmpleadosDataSource } from './empleados.datasource'
import { debounceTime, filter } from 'rxjs'
import { MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss',
})
export class EmpleadosComponent implements OnInit {
  private empleadosService = inject(EmpleadosService)
  readonly dialog = inject(MatDialog)
  readonly snackBar = inject(MatSnackBar)

  public displayedColumns: string[] = [
    'nombre',
    'apellido',
    'puesto',
    'fechaNacimiento',
    'accion',
  ]

  filters: EmpleadosFilter = { nombre: '' }
  dataSource: EmpleadosDataSource = {} as EmpleadosDataSource // = new MatTableDataSource([] as Empleado[])

  searchControl = new FormControl('')

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(
          (value): value is string => !value || (!!value && value.length >= 3),
        ),
      )
      .subscribe((value) => {
        this.applyFilter(value)
      })

    this.dataSource = new EmpleadosDataSource(this.empleadosService)
    this.listarEmpleados()
  }

  applyFilter(value: string) {
    this.filters.nombre = value?.trim().toLowerCase()
    this.listarEmpleados()
  }

  listarEmpleados() {
    this.dataSource.loadData(this.filters)
  }

  nuevoEmpleado(): void {
    const dialogRef = this.dialog.open(EmpleadoEditComponent, {
      width: '500px',
      data: { name: '', surname: '', position: '' },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empleadosService.add(result).subscribe(() => {
          this.snackBar.open('Empleado agregado', 'Cerrar', {
            duration: 3000,
          })
          this.listarEmpleados()
        })
      }
    })
  }

  editarEmpleado(empleado: EditarEmpleado): void {
    const dialogRef = this.dialog.open(EmpleadoEditComponent, {
      width: '500px',
      data: { ...empleado },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.empleadosService.edit(result).subscribe(() => {
          this.snackBar.open('Empleado editado', 'Cerrar', {
            duration: 3000,
          })
          this.listarEmpleados()
        })
      }
    })
  }

  eliminarEmpleado(empleado: Empleado): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Eliminar empleado',
        message: `¿Estás seguro que quieres eliminar al empleado ${empleado.nombre}, ${empleado.apellido}?`,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.empleadosService.delete(empleado._id).subscribe(() => {
          this.snackBar.open('Empleado eliminado', 'Cerrar', {
            duration: 3000,
          })
          this.listarEmpleados()
        })
      }
    })
  }
}
