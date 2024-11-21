import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Dependencia } from 'src/app/models/dependencia';
import { Empleado } from 'src/app/models/empleado';
import { DependenciaService } from 'src/app/services/dependencia.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeScale } from 'chart.js';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
})
export class EmpleadoFormComponent implements OnInit {

  empleado!: Empleado;
  dependencias!: Array<Dependencia>;
  selectedItems!: Array<any>;
  dropdownSettings: IDropdownSettings;
  respuesta: any;
  accion: string;

  constructor(private empleadoService: EmpleadoService, 
              private dependenciaService: DependenciaService, 
              private modalService: NgbModal,
              private router: Router,
              private activatedRoute: ActivatedRoute) { 
    
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'tipo',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };
    this.accion = '';
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        if(params['id'] == '0'){
          this.accion = 'new';
          this.iniciarEmpleado();
          this.cargarDependencias();
        } else {
          this.accion = 'update';
          this.cargarEmpleado(params['id']);
          this.cargarDependencias();
        }
      }
    )
  }

  iniciarEmpleado(): void {
    this.empleado = new Empleado();
    this.empleado.rol = '';
    this.selectedItems = new Array<any>();
  }

  agregarEmpleado(content: any): void {
    this.empleado.dependencias = this.assignDependencias(this.selectedItems);
    this.empleadoService.addEmpleado(this.empleado).subscribe(
      (result) => {
        if(result.status == 201) {
          this.respuesta = result;
        }
      },
      (error) => {
        this.respuesta = error.error;
      }
    )
    this.open(content);
  }

  cargarEmpleado(id: string): void {
    this.empleadoService.getEmpleado(id).subscribe({
      next:(result)=>{
          this.iniciarEmpleado();
          Object.assign(this.empleado, result['data']['empleado']);
          this.selectedItems = this.assignDependencias(this.empleado.dependencias);
      },
      error: (error) => {
        this.respuesta = error.error;
      },
    })
  }

  cargarDependencias(): void {
    this.dependenciaService.getDependencias().subscribe(
      (result) => {
        this.dependencias = new Array<Dependencia>();
        this.dependencias = this.assignDependencias(result.data.dependencias);
      }
    )
  }

  assignDependencias(arr: any): Array<Dependencia> {
    let dependencias = new Array<Dependencia>();
    arr.forEach((element: any) => {
      let dependencia = new Dependencia();
      Object.assign(dependencia, element);
      dependencias.push(dependencia);
    });
    return dependencias;
  }

  modificarEmpleado(content: any): void {
    this.empleado.dependencias = this.assignDependencias(this.selectedItems);
    this.empleadoService.updateEmpleado(this.empleado).subscribe(
      (result) => {
        if(result.status == 200) {
          this.respuesta = result;
        }
      },
      (error) => {
        this.respuesta = error.error;
      }
    )
    this.open(content);
  }

  open(content: any): void {
    this.modalService.open(content, { centered: true }).result.then(()=>{
      if(this.respuesta.status == 201 || this.respuesta.status == 200){
        this.router.navigate(['empleados']);
      }
      else if(this.respuesta.status == 400) {
        this.empleado.email = '';
      }
    });
  }

  cancelar(): void{
    this.router.navigate(['empleados']);
  }
}
