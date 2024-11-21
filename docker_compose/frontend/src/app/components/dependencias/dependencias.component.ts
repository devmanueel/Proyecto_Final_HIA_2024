import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Dependencia } from 'src/app/models/dependencia';
import { DependenciaService } from 'src/app/services/dependencia.service';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dependenciaForm = new FormGroup({
    tipo: new FormControl('', [Validators.required])
  });
  dependencias!: Array<Dependencia>;
  dependencia!: Dependencia;
  respuesta: any;
  accion!: string;
  modalReference: any;
  
  constructor(private dependenciaService: DependenciaService,
              private modalService: NgbModal,) { 
    
    this.iniciarDependencia();
  }

  get tipo(){ return this.dependenciaForm.get('tipo'); }

  iniciarDependencia(): void {
    this.dependencia = new Dependencia();
  }

  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      scrollX: true
    };
    this.cargarDependencias();
  }

  cargarDependencias(): void {
    this.dependenciaService.getDependencias().subscribe(
      result => {
        this.dependencias = new Array<Dependencia>();
        result.data.dependencias.forEach((element: any) => {
          let dependencia = new Dependencia();
          Object.assign(dependencia, element);
          this.dependencias.push(dependencia);
        });
        this.rerender();
      }
    )
  }

  agregar(formContent: any) {
    this.accion = 'new';
    this.openForm(formContent);
  }

  agregarDependencia(content: any): void {
    this.iniciarDependencia();
    Object.assign(this.dependencia, this.dependenciaForm.value);
    this.dependenciaService.addDependencia(this.dependencia).subscribe(
      result => {
        this.respuesta = result;
      },
      error => {
        this.respuesta = error;
      }
    )
    this.open(content);
  }

  actualizar(dependencia: Dependencia, formContent: any): void {
    this.dependenciaForm.setValue({
      tipo: dependencia.tipo
    })
    this.iniciarDependencia();
    this.dependencia._id = dependencia._id;
    this.accion = 'update';
    this.openForm(formContent);
  }

  actualizarDependencia(content: any): void {
    console.log(this.dependenciaForm.value);
    Object.assign(this.dependencia, this.dependenciaForm.value);
    console.log(this.dependencia);
    this.dependenciaService.updateDependencia(this.dependencia).subscribe(
      result => {
        this.respuesta = result;
      },
      error => {
        this.respuesta = error;
      }
    )
    this.open(content);
  }

  eliminarDependencia(id: string, content: any): void {
    this.dependenciaService.deleteDependencia(id).subscribe(
      result => {
        this.respuesta = result;
      },
      error => {
        this.respuesta = error;
      }
    )
    this.open(content);
  }

  openForm(formContent: any) {
    this.modalReference = this.modalService.open(formContent, { centered: true });
    this.modalReference.result.then((result: any) => {
      this.dependenciaForm.reset();
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.cargarDependencias();
      this.modalReference.close();
    });
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
}
