import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultReuniones = [];
    for(const reunion of value){
      if(reunion.tipoReunion.tipoReunion.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultReuniones.push(reunion);
      }
    }
    return resultReuniones;
  }

}
