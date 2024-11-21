import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { EstadosService } from 'src/app/services/estados.service';
import { Estado } from 'src/app/models/estado';

@Component({
  selector: 'app-reuniones',
  templateUrl: './reuniones.component.html',
  styleUrls: ['./reuniones.component.css']
})
export class ReunionesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  reunion!: Reunion;
  reuniones!: Array<Reunion>;
  estados!: Array<Estado>;
  ver: boolean = false;
  respuesta!: any;

  

  constructor(private reunionService: ReunionService,
              private estadoServices: EstadosService,
              private router: Router,
              private modalService: NgbModal) { 

    
  }

  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      scrollX: true
    };
    this.iniciarReunion();
    this.obtenerEstados();
    this.cargarReuniones();
  }

  iniciarReunion() {
    this.reunion = new Reunion();
  }

  obtenerEstados() {
    this.estadoServices.getEstados().subscribe(
      result => {
        this.estados = new Array<Estado>();
        result.data.estados.forEach((element: any) => {
          let estado = new Estado();
          Object.assign(estado, element);
          this.estados.push(estado);
        });
      }
    )
  }

  async deshabilitarReuniones() {
    this.reunionService.getReuniones().subscribe(
      result => {
        result.data.reuniones.forEach((r: any) => {
          let horaFinal = new Date(r.horaFinal).getTime();
          let fechaActual = new Date().getTime();
          if(horaFinal < fechaActual){
            if(r.reunionConfirmada){
              this.iniciarReunion();
              Object.assign(this.reunion, r);
              let estado = this.estados.find(e => e.nombreEstado === "Celebrada");
              this.reunion.estado = estado?._id;
              this.reunion.estaDeshabilitada = true;
              this.modificarReunion();
            }
          }
        });
      }
    )
  }

  modificarReunion() {
    this.reunionService.updateReunion(this.reunion).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    )
  }

  async cargarReuniones() {
    await this.deshabilitarReuniones();
    this.reunionService.getReuniones().subscribe(
      result => {
        this.reuniones = new Array<Reunion>();
        result.data.reuniones.forEach((element: any) => {
          let reunion = new Reunion();
          Object.assign(reunion, element);
          this.reuniones.push(reunion);
        });
        this.rerender();
      }
    )
  }

  verReunion(reunion: Reunion) {
    this.router.navigate(['reunion-detalle', reunion._id]);
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
