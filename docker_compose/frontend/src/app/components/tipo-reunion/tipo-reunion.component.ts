import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TipoReunion } from 'src/app/models/tipo-reunion';
import { TipoReunionService } from 'src/app/services/tipo-reunion.service';

@Component({
  selector: 'app-tipo-reunion',
  templateUrl: './tipo-reunion.component.html',
  styleUrls: ['./tipo-reunion.component.css']
})
export class TipoReunionComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tipo!:TipoReunion;
  tipos:Array<TipoReunion>=[];
  respuesta:any;
  mensaje='';
  modificar=false
  constructor(private tipoReunion: TipoReunionService,
    private modalService: NgbModal, private router: Router) { 
      this.tipo = new TipoReunion();
    }

    agregarTipoReunion(content:any){
       
          this.tipoReunion.addTypeMeeting(this.tipo).subscribe(
            (result)=>{
              if(result.status==201){
               this.respuesta=result;
                this.open(content);
                this.getTiposReunion();
                this.rerender();
              }
            },
              (error) => {
            if(error.status == 500){
              this.respuesta = error;
              this.open(content);
            } 
          }
          )
        
    }

    open(content: any) {
      this.modalService.open(content, { centered: true }).result.then(
        (result) =>{
  
        }, (reason) => {
  
        }
      )
    }
    getTiposReunion(){
      this.tipoReunion.getTiposReunion().subscribe({
        next:(result) =>{
            this.tipos=[];
            this.tipos=result['data']['tiposReunion'];
            console.log(this.tipos);
            this.rerender();
            
        },
        error: () => {
          alert('Error en la peticion');
        },
      })
      }

    eliminarTipoReunion(id:string){
      this.tipoReunion.deleteTipoReunion(id).subscribe({
        next:(result)=>{
            this.mensaje=result;
            console.log(this.mensaje);
            this.getTiposReunion();
            this.rerender();
        },
        error: () => {
          alert('Error en la peticion');
        },
      })
    }
  
    cargarTipoReunion(_id:string){
      let result=this.tipos.filter(reunion => reunion._id == _id)[0];
      Object.assign(this.tipo, result);
      this.modificar=true;
    }

    modificarTipoReunion(content:any, form: NgForm){
      console.log(content)
      this.tipoReunion.updateTipoReunion(this.tipo).subscribe({
        next:(result)=>{
          if(result.status==200){
            this.respuesta=result;
            this.open(content);
            this.getTiposReunion();
            this.rerender();
            this.cancelarTipoReunion(form)
            }
          },
           error : () => {
            alert('Error en la peticion'); 
            //this.open(content);
          }
        })
    }

    cancelarTipoReunion(form: NgForm){
        this.modificar=false;
        this.tipo._id="";
        this.tipo.tipoReunion="";
        form.resetForm();
    }

    ngAfterViewInit(): void {
      this.dtTrigger.next(undefined);
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  
    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(undefined);     
      });
    }
  ngOnInit(): void {
    this.dtOptions = {
      autoWidth: false,
      pagingType: 'full_numbers',
      pageLength: 5,
      scrollX: true
    };
    this.getTiposReunion();
    console.log(this.tipo)
  }
  
}
