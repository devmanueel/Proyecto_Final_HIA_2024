import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import * as printJS from 'print-js';
import { Reunion } from 'src/app/models/reunion';
import { LoginService } from 'src/app/services/login.service';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-reunion-detalle-participante',
  templateUrl: './reunion-detalle-participante.component.html',
  styleUrls: ['./reunion-detalle-participante.component.css']
})
export class ReunionDetalleParticipanteComponent implements OnInit {

  reunion: Reunion = new Reunion();

  elementType: any;
  correctionLevel: any;
  value: string = "";

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private reunionService: ReunionService,
              public loginService: LoginService) { 

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

  volver() {
    this.router.navigate(['audiencias']);
  }
}
