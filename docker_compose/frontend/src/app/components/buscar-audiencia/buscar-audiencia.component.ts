import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Reunion } from 'src/app/models/reunion';
import { LoginService } from 'src/app/services/login.service';
import { ReunionService } from 'src/app/services/reunion.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-buscar-audiencia',
  templateUrl: './buscar-audiencia.component.html',
  styleUrls: ['./buscar-audiencia.component.css']
})
export class BuscarAudienciaComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  reuniones!: Array<Reunion>;
  consulta: string ='';

  constructor(private reunionService: ReunionService, 
              public loginService: LoginService,
              private modalService: NgbModal) { 

    this.cargarReuniones();
  }

  ngOnInit(): void {
  }

  cargarReuniones() {
    this.reunionService.getReuniones().subscribe(
      result => {
        this.reuniones = new Array<Reunion>();
        result.data.reuniones.forEach((element: any) => {
          let reunion = new Reunion();
          Object.assign(reunion, element);
          this.reuniones.push(reunion);
        });
        console.log(this.reuniones);
      }
    )
  }

  cargarReunionesPorParticipante() {
    this.reunionService.getReuniones().subscribe(
      result => {
        this.reuniones = new Array<Reunion>();
        result.data.reuniones.forEach((element: any) => {
          let participante = element.participantes.find((p: any) => p._id == this.loginService.idLogged());
          if(participante != undefined){
            let reunion = new Reunion();
            Object.assign(reunion, element);
            this.reuniones.push(reunion);
          }
        });
      }
    )
  }

  esParticipante(arr: any) {
    return arr.find((item: any) => item._id == this.loginService.idLogged()) == undefined;
  }

  buscar(){

  }
}
