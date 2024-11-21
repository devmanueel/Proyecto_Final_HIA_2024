import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

function validarFechaMinima(c: AbstractControl) {

  const fechaMinima = new Date(c.value).getTime();
  const fechaActual = new Date().getTime();

  if(fechaMinima < fechaActual) {
    return { minima: true };
  }
  return null;
}

@Directive({
  selector: '[minima]',
  providers: [{ provide: NG_VALIDATORS, multi: true, useValue: validarFechaMinima }]
})
export class FechaValidaDirective {

  constructor() { }

}
