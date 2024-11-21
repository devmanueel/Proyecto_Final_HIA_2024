import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reunion } from '../models/reunion';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  URL: string;
  urlGoogleCalendar: string;
  
  constructor(private _http: HttpClient) { 
    this.URL = "http://localhost:8000/api/v1/reuniones/";
    this.urlGoogleCalendar = "https://www.googleapis.com/calendar/v3/calendars/bdilsomkl60pj67m0hpf687bt0@group.calendar.google.com/events";
  }

  public createEvent(event: any): Observable<any> { 
    const httpOptions = { 
      headers: new HttpHeaders({ 
        "Authorization": "Bearer ya29.a0ARrdaM8ynaeRbr1ebiO8T1WaAQT0j14bOmb5k-Cys7Csx2DI19YphEaw1BSlreWo1tlnwJfq8aZqcwAPcXgy7xPeke8WX7N3LxlKsnMsW8Qq7gaPgM7XY0Bh2d0b7p4730b9-jPMm8D1IwO2oZ0JLLtVDpte", 
        "Accept": "application/ecmascript", 
        "Content-Type": "application/json" 
      }) 
    }; 
    let body = JSON.stringify(event);
    console.log(body); 
    return this._http.post(this.urlGoogleCalendar, body , httpOptions);
  }

  public addReunion(reunion: Reunion): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(reunion);
    return this._http.post(this.URL, body, options);
  }

  public confirmReunion(id: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({})
    };
    return this._http.post(this.URL+ 'confirmar/' + id, null, options);
  }

  public getReuniones(): Observable<any> {
    const options = {
      headers: new HttpHeaders({})
    };
    return this._http.get(this.URL, options);
  }

  public getReunionesFiltradas(legajo: string): Observable<any>{
    const options = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
      .set('legajo',legajo)
    }
    return this._http.get(this.URL,options);
  }

  public getReunionesParticipantes(participantes: any): Observable<any>{
    const options = {
      headers: new HttpHeaders({}),
      params: new HttpParams()
      .set('participantes',participantes)
    }
    return this._http.get(this.URL,options);
  }


  public getReunionById(id: string): Observable<any> {
    const options = {headers: new HttpHeaders({})};
    return this._http.get(this.URL + id, options);
  }

  public getReunionesByFields(horaInicio: any, horaFinal: any): Observable<any> {
    let params = new HttpParams();
    params = params.append('horaInicio', horaInicio);
    params = params.append('horaFinal', horaFinal);

    const options = {
      headers: new HttpHeaders({}),
      params: params
    };
    return this._http.get(this.URL, options);
  }

  public updateReunion(reunion: Reunion): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(reunion);
    return this._http.put(this.URL + reunion._id, body, options);
  }

  public deleteReunion(id: string): Observable<any> {
    const options = {headers: new HttpHeaders({})};
    return this._http.delete(this.URL + id, options);
  }
  
}
