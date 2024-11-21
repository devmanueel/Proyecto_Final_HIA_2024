import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecursoDigital } from '../models/recurso-digital';
import { RecursoFisico } from '../models/recurso-fisico';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  urlRecursosFisicos: string;
  urlRecursosDigitales: string;

  constructor(private _http: HttpClient) {
    
    this.urlRecursosFisicos = "http://localhost:8000/api/v1/recursos/";
    this.urlRecursosDigitales = "http://localhost:8000/api/v1/recursos-digitales/";
  }

  public addRecursoFisico(recFisico: RecursoFisico): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(recFisico);
    return this._http.post(this.urlRecursosFisicos, body, options);
  }

  public getRecursosFisicos(): Observable<any>{
    const options = {headers: new HttpHeaders({})};
    return this._http.get(this.urlRecursosFisicos, options);
  }

  public getRecursosFisicosLibres(horaInicio: any, horaFinal: any): Observable<any>{
    
    let params = new HttpParams();
    params = params.append('horaInicio', horaInicio);
    params = params.append('horaFinal', horaFinal);

    const options = {
      headers: new HttpHeaders({}),
      params: params
    };
    return this._http.get(this.urlRecursosFisicos + 'libres', options);
  }

  public updateRecursosFisicos(recFisico: RecursoFisico): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(recFisico);
    return this._http.put(this.urlRecursosFisicos + recFisico._id, body, options)
  }

  public deleteRecursoFisico(id: string): Observable<any> {
    const options = {headers: new HttpHeaders ({})};
    return this._http.delete(this.urlRecursosFisicos + id, options);
  }

  public addRecursoDigital(recDigital: RecursoDigital): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(recDigital);
    return this._http.post(this.urlRecursosDigitales, body, options);
  }

  public getRecursosDigitales(): Observable<any>{
    const options = {headers: new HttpHeaders({})};
    return this._http.get(this.urlRecursosDigitales, options);
  }

  public updateRecursosDigital(recDigital: RecursoDigital): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(recDigital);
    return this._http.put(this.urlRecursosDigitales + recDigital._id,body, options)
  }

  public deleteRecursoDigital(id: string): Observable<any> {
    const options = {headers: new HttpHeaders ({})};
    return this._http.delete(this.urlRecursosDigitales + id, options);
  }

}
