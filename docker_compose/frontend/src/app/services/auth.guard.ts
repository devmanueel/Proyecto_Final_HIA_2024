import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService,
              private router: Router){

  }

  canActivate(): boolean{
    if(this.loginService.loggedIn()){
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
  
}
