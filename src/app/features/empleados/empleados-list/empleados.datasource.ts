/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource } from '@angular/cdk/collections'
import { Empleado } from '@app/core/interfaces/empleado.interface'
import { EmpleadosFilter } from '@app/core/interfaces/empleados-filter'
import { EmpleadosService } from '@app/core/services/empleados.service'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, finalize } from 'rxjs/operators'

export class EmpleadosDataSource implements DataSource<Empleado[]> {
  private dataSubject = new BehaviorSubject<any[]>([])
  private totalCountSubject = new BehaviorSubject<number>(0)
  private loadingSubject = new BehaviorSubject<boolean>(false)

  public loading$ = this.loadingSubject.asObservable()
  public totalCount$ = this.totalCountSubject.asObservable()
  public data$ = this.dataSubject

  constructor(private empleadosService: EmpleadosService) {}

  connect(): Observable<any[]> {
    return this.dataSubject.asObservable()
  }

  disconnect(): void {
    this.dataSubject.complete()
    this.loadingSubject.complete()
  }

  loadData(filters: EmpleadosFilter) {
    this.loadingSubject.next(true)
    this.empleadosService
      .getAll(filters)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((data) => {
        this.dataSubject.next(data)
      })
  }
}
