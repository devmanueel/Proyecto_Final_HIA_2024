import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  URL: string;

  constructor( private _http: HttpClient) {
    this.URL = "http://localhost:8000/api/v1/autenticacion/login";
  }

  public autenticacion(login: Login): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const body = JSON.stringify(login)
    return this._http.post(this.URL+"/",body,options);
  }

  public logout(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("perfil");
    sessionStorage.removeItem("userid");
  }

  public userLoggedIn(){
    var resultado = false;
    var usuario = sessionStorage.getItem("user");
    
    if(usuario!=null){
      resultado = true;
    }
    
    return resultado;
  }

  public userLogged(){
    var usuario = sessionStorage.getItem("user");
    return usuario;
  }

  public idLogged(){
    var id = sessionStorage.getItem("userid");
    return id;
  }

  public userRole(){
    var role = sessionStorage.getItem("perfil");
    return role;
  }

  getToken(){
    if(sessionStorage.getItem("token") != null){
      return sessionStorage.getItem("token")!;
    }else{
      return "";
    }
  }

  loggedIn(){
    return !!sessionStorage.getItem("token");
  }
}
