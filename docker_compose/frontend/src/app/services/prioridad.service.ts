import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prioridad } from '../models/prioridad';

@Injectable({
  providedIn: 'root'
})
export class PrioridadService {

  URL: string;
  
  constructor(private _http: HttpClient) { 
    this.URL = "http://localhost:8000/api/v1/prioridades/";
  }

  addPrioridad(prioridad: Prioridad): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(prioridad);
    return this._http.post(this.URL, body, options);
  }

  getPrioridades(): Observable<any> {
    const options = {
      headers: new HttpHeaders({})
    };
    return this._http.get(this.URL, options);
  }
}
