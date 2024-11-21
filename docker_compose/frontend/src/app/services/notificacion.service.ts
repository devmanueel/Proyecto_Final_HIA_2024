import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  URL: string;

  constructor(private _http: HttpClient) {
    this.URL = "http://localhost:8000/api/v1/notificaciones/";
  }

  public getNotificaiones(empleado: Empleado): Observable<any>{
    const options = { headers: new HttpHeaders({})};
    return this._http.get(this.URL,options)
  }

  public getNotificaionById(id: string): Observable<any>{
    const options = { headers: new HttpHeaders({})};
    return this._http.get(this.URL + id, options);
  }
}
