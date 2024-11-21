import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  URL: string;

  constructor(private _http: HttpClient) { 
    this.URL = "http://localhost:8000/api/v1/estados/";
  }

  public getEstados(): Observable<any>{
    const options = {
      headers: new HttpHeaders({})
    };
    return this._http.get(this.URL, options);
  }
}
