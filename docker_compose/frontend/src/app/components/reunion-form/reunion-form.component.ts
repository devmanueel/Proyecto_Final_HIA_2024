import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Oficina } from 'src/app/models/oficina';
import { Prioridad } from 'src/app/models/prioridad';
import { RecursoDigital } from 'src/app/models/recurso-digital';
import { RecursoFisico } from 'src/app/models/recurso-fisico';
import { Reunion } from 'src/app/models/reunion';
import { TipoReunion } from 'src/app/models/tipo-reunion';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { OficinaService } from 'src/app/services/oficina.service';
import { PrioridadService } from 'src/app/services/prioridad.service';
import { RecursoService } from 'src/app/services/recurso.service';
import { ReunionService } from 'src/app/services/reunion.service';
import { TipoReunionService } from 'src/app/services/tipo-reunion.service';

@Component({
  selector: 'app-reunion-form',
  templateUrl: './reunion-form.component.html',
  styleUrls: ['./reunion-form.component.css']
})
export class ReunionFormComponent implements OnInit {

  reunion: Reunion = new Reunion();
  reuniones: Array<Reunion>;
  prioridades: Array<Prioridad> = new Array<Prioridad>();
  tiposReuniones: Array<TipoReunion> = new Array<TipoReunion>();
  oficinas: Array<any> = new Array<any>();
  empleados: Array<any> = new Array<any>();
  recursosFisicos: Array<RecursoFisico> = new Array<RecursoFisico>();
  recursosDigitales: Array<RecursoDigital> = new Array<RecursoDigital>();
  selectedItemsParticipantes: Array<any> = new Array<any>();
  selectedItemsDigitales: Array<any> = new Array<any>();
  selectedItemsFisicos: Array<any> = new Array<any>();
  dropdownSettingsParticipantes: IDropdownSettings;
  dropdownSettingsDigitales: IDropdownSettings;
  dropdownSettingsFisicos: IDropdownSettings;
  horaInicio: any;
  horaFinal: any;
  respuesta: any;
  icon: any;
  accion!: string;
  event: any;

  constructor(private reunionService: ReunionService,
    private empleadoService: EmpleadoService,
    private prioridadService: PrioridadService,
    private recursoService: RecursoService,
    private tipoReunionService: TipoReunionService,
    private oficinaService: OficinaService,
    private dp: DatePipe,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.dropdownSettingsParticipantes = {
      singleSelection: false,
      idField: '_id',
      textField: 'nombreCompleto',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };
    this.dropdownSettingsDigitales = {
      singleSelection: false,
      idField: '_id',
      textField: 'nombre',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };
    this.dropdownSettingsFisicos = {
      singleSelection: false,
      idField: '_id',
      textField: 'nombre',
      enableCheckAll: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar'
    };
    this.event = {
      kind: "calendar#event",
      status: "confirmed",
      summary: "summary",
      creator: {
        email: "eventos.grupo9@gmail.com"
      },
      start: {
        dateTime: "2022-06-26T13:30:00-03:00",
        timeZone: "America/Argentina/Jujuy"
      },
      end: {
        dateTime: "2022-06-26T14:30:00-03:00",
        timeZone: "America/Argentina/Jujuy"
      }
    };
    this.reuniones = new Array<Reunion>();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        if (params['id'] == '0') {
          this.accion = 'new';
          this.iniciarReunion();
          this.cargarPrioridades();
          this.cargarParticipantes();
          this.cargarRecursosDigitales();
          this.cargarRecursosFisicos();
          this.cargarTiposReuniones();
          this.cargarOficinas();
        } else {
          this.accion = 'update';
          this.cargarReunion(params['id']);
        }

      }
    )
  }

  iniciarReunion(): void {
    this.reunion = new Reunion();
    this.selectedItemsParticipantes = new Array<any>();
    this.selectedItemsDigitales = new Array<any>();
    this.selectedItemsFisicos = new Array<any>();
    this.reuniones = new Array<Reunion>();
  }

  //TODO: corregir
  agregarReunion() {
    this.setReunion();
    if (this.esReprogramada()) {
      Swal.fire({
        title: '<p>Seleccionó prioridad ALTA. Algunas reuniones serán reprogramadas. ¿Quiere proceder?</p>',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.reunionService.addReunion(this.reunion).subscribe(
            result => {
              console.log(result);
              Swal.fire(result.message, '', 'success').then(
                result => {
                  if (result.isConfirmed)
                    this.router.navigate(['calendario']);
                }
              )
            },
            error => {
              console.log(error);
              this.respuesta = error.error;
            }
          )
          if (this.respuesta.status == 200) {
            Swal.fire({
              title: `<strong>${this.respuesta.message}</strong>`,
              icon: 'success',
              html: `${this.respuesta.reunionReprogramada}`,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: 'OK'
            })
          } else {
            Swal.fire('Operación cancelada', '', 'info')
          }
        } else if (result.isDenied) {
          Swal.fire(this.respuesta.message, '', 'error')
        }
      })
    } else {
      this.reunionService.addReunion(this.reunion).subscribe(
        result => {
          Swal.fire(result.message, '', 'success').then(
            result => {
              if (result.isConfirmed) {
                this.router.navigate(['calendario']);
              }
            }
          )
        },
        error => {
          Swal.fire(error.error.message, '', 'error')
        }
      )
    }
  }

  //TODO: corregir
  esReprogramada(): boolean {
    let esReprogramada = false;
    let esPrioridadAlta = false;
    let prioridad = this.obtenerPrioridad();

    this.oficinas.forEach(o => {
      if (o._id === this.reunion.oficina) {
        o.reunionesActivas.forEach((ra: any) => {
          if (ra.prioridad == prioridad.tipoPrioridad) {
            esPrioridadAlta = true;
            return;
          }
        });
        return;
      }
    });
    if (prioridad.tipoPrioridad === "ALTA" && !esPrioridadAlta) {
      esReprogramada = true;
    }
    return esReprogramada;
  }

  async cargarReunion(id: string) {
    await this.cargarParticipantes();
    await this.cargarRecursosDigitales();
    await this.cargarRecursosFisicos();
    await this.cargarPrioridades();
    await this.cargarTiposReuniones();
    await this.cargarOficinas();
    this.reunionService.getReunionById(id).subscribe(
      result => {
        this.iniciarReunion();

        let horaInicio = new Date(result.data.reunion.horaInicio);
        horaInicio.setMinutes(horaInicio.getMinutes() - horaInicio.getTimezoneOffset());
        this.reunion.horaInicio = horaInicio.toISOString().slice(0, -8);

        let horaFinal = new Date(result.data.reunion.horaFinal);
        horaFinal.setMinutes(horaFinal.getMinutes() - horaFinal.getTimezoneOffset());
        this.reunion.horaFinal = horaFinal.toISOString().slice(0, -8);

        this.selectedItemsDigitales = result.data.reunion.recursosDigitales;
        this.selectedItemsFisicos = result.data.reunion.recursos;
        this.selectedItemsParticipantes = this.crearListaParticipantes(result.data.reunion.participantes);
        this.reunion.prioridad = result.data.reunion.prioridad._id;
        this.reunion.tipoReunion = result.data.reunion.tipoReunion._id;
        this.reunion.oficina = result.data.reunion.oficina._id;
        this.reunion.estado = result.data.reunion.estado._id;
        this.reunion._id = result.data.reunion._id;
        console.log(this.reunion);
      },
      error => {
        this.respuesta = error.error;
      },
    )
  }

  modificarReunion(): void {
    this.setReunion();
    console.log(this.reunion);
    this.reunionService.updateReunion(this.reunion).subscribe(
      result => {
        Swal.fire(result.message, '', 'success').then(
          result => {
            if (result.isConfirmed) {
              this.router.navigate(['calendario']);
            }
          }
        )
      },
      error => {
        Swal.fire(error.error.message, '', 'error');
      }
    )
  }

  async cargarParticipantes() {
    this.empleadoService.getEmpleadosByEstado(false).subscribe(
      result => {
        this.empleados = new Array<any>();
        this.empleados = this.crearListaParticipantes(result.data.empleados);
      }
    )
  }

  async cargarParticipantesLibres() {
    this.empleadoService.getEmpleadoLibres(this.horaInicio, this.horaFinal).subscribe(
      result => {
        this.empleados = new Array<any>();
        this.empleados = this.crearListaParticipantes(result.data.empleadosLibres);
      }
    )
  }

  async cargarPrioridades() {
    this.prioridadService.getPrioridades().subscribe(
      result => {
        this.prioridades = new Array<Prioridad>();
        result.data.prioridades.forEach((element: any) => {
          let prioridad = new Prioridad();
          Object.assign(prioridad, element);
          this.prioridades.push(prioridad);
        });
      }
    )
  }

  async cargarRecursosFisicos() {
    this.recursoService.getRecursosFisicos().subscribe(
      result => {
        this.recursosFisicos = new Array<RecursoFisico>();
        result.data.recursos.forEach((element: any) => {
          let recurso = new RecursoFisico();
          Object.assign(recurso, element);
          this.recursosFisicos.push(recurso);
        });
      }
    )
  }

  async cargarRecursosFisicosLibres() {
    this.recursoService.getRecursosFisicosLibres(this.horaInicio, this.horaFinal).subscribe(
      result => {
        this.recursosFisicos = new Array<RecursoFisico>();
        result.data.recursosLibres.forEach((element: any) => {
          let recurso = new RecursoFisico();
          Object.assign(recurso, element);
          this.recursosFisicos.push(recurso);
        });
      }
    )
  }

  async cargarRecursosDigitales() {
    this.recursoService.getRecursosDigitales().subscribe(
      result => {
        this.recursosDigitales = new Array<RecursoDigital>();
        result.data.recursos.forEach((element: any) => {
          let recurso = new RecursoDigital();
          Object.assign(recurso, element);
          this.recursosDigitales.push(recurso);
        });
      }
    )
  }

  async cargarTiposReuniones() {
    this.tipoReunionService.getTiposReunion().subscribe(
      result => {
        this.tiposReuniones = new Array<TipoReunion>();
        result.data.tiposReunion.forEach((element: any) => {
          let tipoReunion = new TipoReunion();
          Object.assign(tipoReunion, element);
          this.tiposReuniones.push(tipoReunion);
        });
      }
    )
  }

  async cargarOficinas() {
    this.oficinaService.getOficinas().subscribe(
      result => {
        this.oficinas = new Array<Oficina>();
        result.data.oficinas.forEach((element: any) => {
          let oficina = new Oficina();
          Object.assign(oficina, element);
          this.oficinas.push(oficina);
        });
      }
    )
  }
  async cargarOficinasLibres() {
    this.oficinaService.getEOficinasLibres(this.horaInicio, this.horaFinal).subscribe(
      result => {
        this.oficinas = new Array<Oficina>();
        result.data.oficinasLibres.forEach((element: any) => {
          let oficina = new Oficina();
          Object.assign(oficina, element);
          this.oficinas.push(oficina);
        });
      }
    )
  }


  async obtenerReuniones() {
    this.reunionService.getReunionesByFields(this.horaInicio, this.horaFinal).subscribe(
      result => {
        this.reuniones = new Array<Reunion>();
        result.data.reuniones.forEach((element: any) => {
          let reunion = new Reunion();
          Object.assign(reunion, element);
          this.reuniones.push(reunion);
        });
      }
    )
  }

  crearListaParticipantes(arr: any): Array<any> {
    let participantes: Array<any> = new Array<any>;
    arr.forEach((element: any) => {
      let participante = {
        _id: element._id,
        nombreCompleto: `${element.apellido}, ${element.nombre}`
      }
      participantes.push(participante);
    });
    return participantes;
  }

  setReunion(): void {

    // this.event.start.dateTime = this.toIsoString(new Date(this.reunion.horaInicio)); 
    // this.event.end.dateTime = this.toIsoString(new Date(this.reunion.horaFinal));
    // this.event.summary = this.tiposReuniones.find((t: any) => t._id = this.reunion.tipoReunion)?.tipoReunion;

    let participantes: string[] = [];
    this.selectedItemsParticipantes.forEach(element => {
      participantes.push(element._id);
    });
    this.reunion.participantes = participantes;
    this.reunion.recursos = this.selectedItemsFisicos;
    this.reunion.recursosDigitales = this.selectedItemsDigitales;
  }

  toIsoString(date: Date) {
    var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num: any) {
        return (num < 10 ? '0' : '') + num;
      };
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
  }

  onChangeFecha() {
    this.horaInicio = this.obtenerFechaFormateada(this.reunion.horaInicio);
    this.horaFinal = this.obtenerFechaFormateada(this.reunion.horaFinal);
    let prioridad = this.obtenerPrioridad();
    if (prioridad === undefined || prioridad.tipoPrioridad !== "ALTA") {
      this.obtenerReuniones();
      this.cargarParticipantesLibres();
      this.cargarRecursosFisicosLibres();
      this.cargarOficinasLibres();
      this.selectedItemsParticipantes = [];
      this.selectedItemsFisicos = [];
    }
  }

  onChangePrioridad() {
    let prioridad = this.obtenerPrioridad();
    if (prioridad !== undefined && prioridad.tipoPrioridad === "ALTA") {
      this.cargarParticipantes();
      this.cargarOficinas();
      this.cargarRecursosFisicos();
    } else {
      this.cargarParticipantesLibres();
      this.cargarRecursosFisicosLibres();
      this.cargarOficinasLibres();
      this.selectedItemsParticipantes = [];
      this.selectedItemsFisicos = [];
    }
  }

  obtenerFechaFormateada(date: string): string {
    let dateAux = new Date(date);
    dateAux.setMinutes(dateAux.getMinutes() - dateAux.getTimezoneOffset());

    return dateAux.toISOString().slice(0, -8);
  }

  obtenerPrioridad(): any {
    return this.prioridades.find((p: any) => p._id == this.reunion.prioridad);
  }

  obtenerOficina(): any {
    let oficinas = new Array<Oficina>();
    this.oficinaService.getOficinas().subscribe(
      result => {
        oficinas = result.data.oficinas;
      }
    )
    return oficinas.find((of: any) => of._id == this.reunion.oficina);
  }

  cancelar(): void {
    this.router.navigate(['reuniones']);
  }
}
