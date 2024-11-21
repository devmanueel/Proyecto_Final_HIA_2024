import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Empleado } from 'src/app/models/empleado';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login!: Login;
  empleado!: Empleado;
  respuesta!: any;
  message!: string;
  token!: any;

  indice!: number;
  constructor(private loginService: LoginService,
              private router: Router,
              private modalService: NgbModal) {
    this.login = new Login();
  }

  ngOnInit(): void {
  }
  
  ingresar(content: any){
    this.loginService.autenticacion(this.login).subscribe(
      (result) => {
        this.respuesta = result;
        if(result.status == 200){
          this.empleado = new Empleado();
          this.empleado = result.data.empleado;
          this.token = result.data.token;
          sessionStorage.setItem("token",result.data.token);
          sessionStorage.setItem("user", this.empleado.apellido + " " + this.empleado.nombre);
          sessionStorage.setItem("userid", this.empleado._id);
          sessionStorage.setItem("perfil", this.empleado.rol);
          this.message = "Autenticación Exitosa"
          if(this.empleado.rol=="ADMINISTRADOR"){
            this.open(content, 'empleados');
          }else if(this.empleado.rol=="PARTICIPANTE"){
            this.open(content,'calendario');
          }
        }
      },
      (error) =>{
        if(error.status == 401){
          this.respuesta = error;
          this.message = "Email o contraseña incorrecta";
          this.open(content,'')
        }
      }
    )
  }

  open(content: any, page: string) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) =>{
        this.router.navigate([page])
      }, (reason) => {
        this.router.navigate([page])
      }
    )
  }

  isLogin(){
    return this.loginService.userLoggedIn();
  }

}
