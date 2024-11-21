import { Component, OnInit, ViewChild } from '@angular/core';
import{DataTableDirective} from 'angular-datatables';
import { Subject } from 'rxjs';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Empleado } from 'src/app/models/empleado';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  empleados:Array<Empleado>=[];
  mensaje='';
  constructor(private empleadoService:EmpleadoService,private router: Router) { }

  getAllEmpleados(){
  this.empleadoService.getEmpleados().subscribe({
    next:(result) =>{
        this.empleados=result['data']['empleados'];
        console.log(this.empleados);
        this.rerender();
        
    },
    error: () => {
      alert('Error en la peticion');
    },
  })
  }

  eliminarEmpleados(id:string){
    this.empleadoService.deleteEmpleado(id).subscribe({
      next:(result)=>{
          this.mensaje=result;
          console.log(this.mensaje);
          this.getAllEmpleados();
          this.rerender();
      },
      error: () => {
        alert('Error en la peticion');
      },
    })
  }

  modificar(_id:string){
    this.router.navigate(['empleado-form',_id])
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(undefined);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(undefined);     
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      scrollX: true
    };
    this.getAllEmpleados();
  }

}
