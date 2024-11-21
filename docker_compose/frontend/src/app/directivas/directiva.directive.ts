import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

function validarArchivo(c: AbstractControl){ 
    
  if(c.value == null || c.value.length == 0){ 
    return { requireFile: true } 
  }
  return null; 
}

@Directive({
  selector: '[requireFile]',
  providers:[ { provide: NG_VALIDATORS, multi: true, useValue: validarArchivo } ]
})
export class RequireFile {

  constructor() { }

}
