import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import * as printJS from "print-js";
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reunion-detalle',
  templateUrl: './reunion-detalle.component.html',
  styleUrls: ['./reunion-detalle.component.css']
})
export class ReunionDetalleComponent implements OnInit {

  reunion: Reunion = new Reunion();

  elementType: any;
  correctionLevel: any;
  value: string = "";

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private reunionService: ReunionService) { 

    this.reunion = new Reunion();
    this.elementType = NgxQrcodeElementTypes.URL;
    this.correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
    this.value = window.location.href;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params =>{
        this.cargarReunion(params['id']);
      }
    );
  }

  cargarReunion(id: string) {
    this.reunionService.getReunionById(id).subscribe(
      result => {
        Object.assign(this.reunion, result.data.reunion);
      }
    )
  }

  imprimir() {
    printJS({
      printable: 'reunion',
      type: 'html',
      targetStyles: ['*'],
      header: 'Reunión',
      headerStyle: 'font-size: 40px; text-align: center'
    })
  }

  modificar(reunion: Reunion): void {
    this.router.navigate(['reunion-form', reunion._id]);
  }

  eliminar(reunion: Reunion): void {
    Swal.fire({
      title: '<p>¿Esta seguro de que desea deshabilitar esta reunion?</p>',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reunionService.deleteReunion(reunion._id).subscribe(
          result => {
            Swal.fire(result.message, '', 'success').then(
              result => {
                if(result.isConfirmed)
                this.router.navigate(['reunion-detalle']);
              }
            )
          },
          error => {
            Swal.fire(error.error.message, '', 'error')
          }
        )
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info')
      }
    })
    
  }

  confirmarReunion(reunion: Reunion) {
    Swal.fire({
      title: '<p>¿Esta seguro de que desea confirmar esta reunion?</p>',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reunionService.confirmReunion(reunion._id).subscribe(
          result => {
            Swal.fire(result.message, '', 'success');
            location.reload();
          },
          error => {
            Swal.fire(error.error.message, '', 'error')
          }
        )
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info')
      }
    })
  }

  volver() {
    this.router.navigate(['reuniones']);
  }
}
