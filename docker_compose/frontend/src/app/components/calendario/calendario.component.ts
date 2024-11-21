import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  events: any[] = [];
  options: any;

  constructor(private reunionesService: ReunionService) { }

  ngOnInit(): void {

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaulDate: new Date(),
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      editable: false
    }

    this.events = [
    ]

    if (sessionStorage.getItem("perfil") === "PARTICIPANTE") {
      const id = sessionStorage.getItem("userid")!;
      this.reunionesService.getReunionesParticipantes(JSON.stringify([id])).subscribe(
        ({ data }) => {

          this.events = data.reuniones.filter((r: any) => r.estado.nombreEstado === "Pendiente" || r.estado.nombreEstado === "En Proceso").map((r: any) => ({
            title: r.tipoReunion.tipoReunion,
            start: r.horaInicio,
            end: r.horaFinal,
            description: r.tipoReunion.tipoReunion,
          }))
        },
        (error) => {
          console.log(error);
        }
      )

      return;
    }

    this.reunionesService.getReuniones().subscribe(
      ({ data }) => {
        this.events = data.reuniones.filter((r: any) => r.estado.nombreEstado === "Pendiente" || r.estado.nombreEstado === "En Proceso").map((r: any) => ({
          title: r.tipoReunion.tipoReunion,
          start: r.horaInicio,
          end: r.horaFinal,
          description: r.tipoReunion.tipoReunion,
        }))
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
