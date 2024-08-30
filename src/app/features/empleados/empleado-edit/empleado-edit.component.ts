import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatSelectModule } from '@angular/material/select'
import { EmpleadosService } from '@app/core/services/empleados.service'

export interface DialogData {
  _id: string
  nombre: string
  apellido: string
  puesto: string
  fechaNacimiento: Date
}

@Component({
  selector: 'app-empleado-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogClose,
    MatDialogTitle,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './empleado-edit.component.html',
  styleUrl: './empleado-edit.component.scss',
})
export class EmpleadoEditComponent implements OnInit {
  empleadoForm!: FormGroup
  puestos: string[] = []

  private empleadosService = inject(EmpleadosService)
  readonly dialogRef = inject(MatDialogRef<EmpleadoEditComponent>)
  readonly fb = inject(FormBuilder)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  readonly today = new Date()

  ngOnInit(): void {
    this.listarPuestos()
    this.empleadoForm = this.fb.group({
      _id: [this.data._id],
      nombre: [this.data.nombre, Validators.required],
      apellido: [
        { value: this.data.apellido, disabled: false },
        Validators.required,
      ],
      puesto: [this.data.puesto, Validators.required],
      fechaNacimiento: [
        {
          value: this.data.fechaNacimiento,
          disabled: false,
        },
        Validators.required,
      ],
    })
  }

  listarPuestos() {
    this.empleadosService.getPuestos().subscribe((data) => {
      this.puestos = data
    })
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSave(): void {
    if (this.empleadoForm?.valid) {
      this.dialogRef.close(this.empleadoForm.value)
    }
  }

  filtrarFechasFuturas = (d: Date | null): boolean => {
    const today = new Date()
    return d ? d <= today : false
  }
}
