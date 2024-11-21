import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dependencia } from '../models/dependencia';

@Injectable({
  providedIn: 'root'
})
export class DependenciaService {

  URL: string;

  constructor(private _http: HttpClient) { 
    this.URL = "http://localhost:8000/api/v1/dependencias/";
  }

  public addDependencia(dependencia: Dependencia): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(dependencia);
    return this._http.post(this.URL, body, options);
  }

  public getDependencias(): Observable<any> {
    const options = { headers: new HttpHeaders({}) };
    return this._http.get(this.URL, options);
  }

  public updateDependencia(dependencia: Dependencia): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(dependencia);
    return this._http.put(this.URL + dependencia._id, body, options);
  }

  public deleteDependencia(id :string): Observable<any> {
    const options = { headers: new HttpHeaders({}) };
    return this._http.delete(this.URL + id, options);
  }
}
