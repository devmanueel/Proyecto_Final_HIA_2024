import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoReunion } from '../models/tipo-reunion';

@Injectable({
  providedIn: 'root'
})
export class TipoReunionService {

  URL :string;
  constructor(private _http:HttpClient) {
    this.URL = "http://localhost:8000/api/v1/tipo-reunion/";
   }

  public addTypeMeeting(tipoReunion: TipoReunion):Observable<any>{
    const options ={
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    const body = JSON.stringify(tipoReunion);
    return this._http.post(this.URL,body,options);
  }

  public getTiposReunion(): Observable<any> {
    const options = { headers: new HttpHeaders({}) };
    return this._http.get(this.URL, options);
  }

  public updateTipoReunion(tipoReunion:TipoReunion):Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    const body = JSON.stringify(tipoReunion);
    return this._http.put(this.URL+tipoReunion._id,body,options);
  }

  public deleteTipoReunion(id: string): Observable<any> {
    const options = {headers: new HttpHeaders({})};
    return this._http.delete(this.URL + id, options);
  }

}
