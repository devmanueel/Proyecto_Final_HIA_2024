import { Injectable } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  elementType = NgxQrcodeElementTypes.URL
  correctionLevel = NgxQrcodeErrorCorrectionLevels.LOW;
  value: string = "";

  constructor() { 
    // obtiene la url actual del navegador
    this.value = window.location.href;
  }
  
  obtenerValoresQRCode() {
    return {
      elementType: this.elementType,
      correctionLevel: this.correctionLevel,
      value: this.value
    }
  }
}
