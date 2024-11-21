import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Oficina } from 'src/app/models/oficina';
import { OficinaService } from 'src/app/services/oficina.service';

@Component({
  selector: 'app-oficina',
  templateUrl: './oficina.component.html',
  styleUrls: ['./oficina.component.css']
})
export class OficinaComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  oficina!:Oficina;
  oficinas:Array<Oficina>=[];
  selectedItems!: Array<any>;
  respuesta: any;
  mensaje='';
  modificar=false;
  constructor(private oficinaService: OficinaService,
     private modalService: NgbModal,
     ) {
      this.oficina= new Oficina();
   }


  ngOnInit(): void {
    
    this.dtOptions = {
      autoWidth: false,
      pagingType: 'full_numbers',
      pageLength: 3,
      scrollX: true
    };
    this.getOficinas();
  
  }
  
  agregarOficina(content: any, form: NgForm): void {
    this.oficinaService.addOficina(this.oficina).subscribe({
      next:(result)=>{
         if(result.status==201){
          this.respuesta=result;
          this.open(content);
          this.getOficinas();
          this.rerender();
          form.resetForm();
         }
      },
      error: (error) => {
        this.respuesta = error.error;
       this.open(content);
      },
    })
  }
  cargarOficina(_id:string){
    let result=this.oficinas.filter(office => office._id == _id)[0];
    Object.assign(this.oficina, result);
    this.modificar=true;
  }

  open(content: any) {
    this.modalService.open(content, { centered: true }).result.then(
      (result) =>{

      }, (reason) => {

      }
    )
  }
  
  getOficinas(){
    this.oficinaService.getOficinas().subscribe({
      next:(result)=>{
        this.oficinas=[];
        this.oficinas=result['data']['oficinas'];
        console.log(this.oficinas);
        this.rerender();
      },
      error: () => {
        alert('Error en la peticion');
      },
    })
  }
 
  modificarOficina(content:any, form: NgForm){
    console.log(content)
    this.oficinaService.updateOficina(this.oficina).subscribe({
      next:(result)=>{
        if(result.status==200){
          this.respuesta=result;
          this.open(content);
          this.getOficinas();
          this.rerender();
          this.cancelarOficina(form)
          }
        },
         error : () => {
          alert('Error en la peticion'); 
          
        }
      })
  }
  cancelarOficina(form: NgForm){
    this.modificar=false;
    this.oficina._id="";
    this.oficina.nombre="";
    form.resetForm();
}
eliminarOficina(id:string){
  this.oficinaService.deleteOficina(id).subscribe({
    next:(result)=>{
        this.mensaje=result;
        console.log(this.mensaje);
        this.getOficinas();
        this.rerender();
    },
    error: () => {
      alert('Error en la peticion');
    },
  })
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
}
