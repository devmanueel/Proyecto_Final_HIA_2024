import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empleado } from 'src/app/models/empleado';
import { Notificacion } from 'src/app/models/notificacion';
import { Oficina } from 'src/app/models/oficina';
import { Reunion } from 'src/app/models/reunion';
import { TipoReunion } from 'src/app/models/tipo-reunion';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { OficinaService } from 'src/app/services/oficina.service';
import { TipoReunionService } from 'src/app/services/tipo-reunion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  empleado!: Empleado;
  reunion!: Reunion;
  reuniones!: Array<Reunion>;
  participante!: any;
  notificacion!: Notificacion;
  notificaciones!: Array<Notificacion>;
  oficinas!: Array<Oficina>;
  tipoReuniones!: Array<TipoReunion>;
  id!: any;
  leido!: Array<boolean>;
  espera!: any;

  constructor(public loginService: LoginService,
              public empleadoService: EmpleadoService,
              public notificacionService: NotificacionService,
              public oficinaService: OficinaService,
              public tipoReunionService: TipoReunionService,
              public router: Router) {
                this.obtenerOficinas();
                this.obtenerEmpealdo();
                this.obtenerTipoReuniones();
                this.obtenerNotificaiones();
              }

  ngOnInit(): void {
  }

  actualizarNotificaciones(){
    console.log("entra")
    
  }

  logout(){
    this.loginService.logout();
  }
   
  obtenerEmpealdo(){
    this.id = this.loginService.idLogged();
    this.empleadoService.getEmpleado(this.id).subscribe(
      (result) => {
        this.empleado = new Empleado();
        this.empleado = result['data']['empleado']
      }
    )
    
  }

  obtenerNotificaiones(){
    this.reuniones = new Array<Reunion>();
    this.notificacionService.getNotificaiones(this.empleado).subscribe(
    (result) => {
      console.log(result['data']['notificaciones'])
      for(let i=0;i<result.data.notificaciones.length;i++){
        this.participante = result['data']['notificaciones'][i]['empleado'];
        if(this.participante._id == this.id){
          this.reunion = new Reunion();
          Object.assign(this.reunion,result['data']['notificaciones'][i].reunion);
          this.reunion.oficina = this.oficinas.find(o => o._id == result['data']['notificaciones'][i]['reunion']['oficina']);
          this.reunion.tipoReunion = this.tipoReuniones.find(tr => tr._id == result['data']['notificaciones'][i]['reunion']['tipoReunion']);
          this.reuniones.push(this.reunion);
        }
      }
      console.log(this.reuniones)
    },
    (error) => {
      console.log(error);
    }
    )
  }

  obtenerOficinas(){
    this.oficinas = new Array<Oficina>;
    this.oficinaService.getOficinas().subscribe(
      (result) => {
        this.oficinas = result['data']['oficinas'];
      }
    )
  }

  obtenerTipoReuniones(){
    this.tipoReuniones = new Array<TipoReunion>();
    this.tipoReunionService.getTiposReunion().subscribe(
      (result) => {
        console.log(result.data.tiposReunion)
        this.tipoReuniones = result['data']['tiposReunion'];
      }
    )
  }

  prueba(reunion: Reunion){
    this.router.navigate(['reunion-detalle', reunion._id]);
    console.log(reunion)
  }
}
