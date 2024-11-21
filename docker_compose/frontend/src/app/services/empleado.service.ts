import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  URL: string;

  constructor(private _http: HttpClient) { 
    this.URL = "http://localhost:8000/api/v1/empleados/";
  }

  public addEmpleado(empleado: Empleado): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(empleado);
    return this._http.post(this.URL, body, options);
  }

  public getEmpleados(): Observable<any> {
    const options = { headers: new HttpHeaders({}) };
    return this._http.get(this.URL, options);
  }

  public getEmpleadosByEstado(estaEnReunion: boolean): Observable<any> {
    const options = { 
      headers: new HttpHeaders({}),
      params: new HttpParams().set('estaEnReunion', estaEnReunion) 
    };
    return this._http.get(this.URL, options);
  }

  public getEmpleado(id: string): Observable<any> {
    const options = { headers: new HttpHeaders({}) };
    return this._http.get(this.URL + id, options);
  }

  public getEmpleadoLibres(horaInicio: any, horaFinal: any): Observable<any> {
    
    let params = new HttpParams();
    params = params.append('horaInicio', horaInicio);
    params = params.append('horaFinal', horaFinal);

    const options = { 
      headers: new HttpHeaders({}),
      params: params
    };
    return this._http.get(this.URL + "libres", options);
  }

  public updateEmpleado(empleado: Empleado): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(empleado);
    return this._http.put(this.URL + empleado._id, body, options);
  }

  public deleteEmpleado(id: string): Observable<any> {
    const options = {headers: new HttpHeaders({})};
    return this._http.delete(this.URL + id, options);
  }
}
