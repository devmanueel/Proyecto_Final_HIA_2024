import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { EmpleadoFormComponent } from './components/empleado-form/empleado-form.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { DependenciasComponent } from './components/dependencias/dependencias.component';
import { TipoReunionComponent } from './components/tipo-reunion/tipo-reunion.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { ReunionFormComponent } from './components/reunion-form/reunion-form.component';
import { OficinaComponent } from './components/oficina/oficina.component';
import { AuthGuard } from './services/auth.guard';
import { AudienciasComponent } from './components/audiencias/audiencias.component';
import { BuscarAudienciaComponent } from './components/buscar-audiencia/buscar-audiencia.component';
import { ReunionesComponent } from './components/reuniones/reuniones.component';
import { BusquedaAvanzadaComponent } from './components/busqueda-avanzada/busqueda-avanzada.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { EstadisticaPartComponent } from './components/estadistica-part/estadistica-part.component';
import { ReunionDetalleParticipanteComponent } from "./components/reunion-detalle-participante/reunion-detalle-participante.component";
import { ReunionDetalleComponent } from './components/reunion-detalle/reunion-detalle.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'empleado-form/:id', component: EmpleadoFormComponent, canActivate: [AuthGuard]},
    { path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard]},
    { path: 'tipo-reunion', component: TipoReunionComponent, canActivate: [AuthGuard]},
    { path: 'recursos', component: RecursosComponent, canActivate: [AuthGuard]},
    { path: 'dependencias', component: DependenciasComponent, canActivate: [AuthGuard]},
    { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard]},
    { path: 'reunion-form/:id', component: ReunionFormComponent, canActivate: [AuthGuard]},
    { path: 'reuniones', component: ReunionesComponent, canActivate: [AuthGuard]},
    { path: 'audiencias', component: AudienciasComponent, canActivate: [AuthGuard]},
    { path: 'buscar-audiencia', component: BuscarAudienciaComponent, canActivate: [AuthGuard]},
    { path: 'oficinas', component: OficinaComponent, canActivate: [AuthGuard]},
    { path: 'busqueda-avanzada', component: BusquedaAvanzadaComponent},
    { path: 'estadisticas', component: EstadisticasComponent},
    { path: 'estadisticaP',component:EstadisticaPartComponent},
    { path: 'reunion-detalle/:id', component: ReunionDetalleComponent},
    { path: 'detalles/:id', component: ReunionDetalleParticipanteComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { };
export const routingComponents = [
  HeaderComponent, 
  LoginComponent, 
  EmpleadoFormComponent,
  EmpleadosComponent,
  TipoReunionComponent,
  RecursosComponent,
  DependenciasComponent,
  CalendarioComponent,
  ReunionFormComponent,
  ReunionesComponent,
  OficinaComponent,
  AudienciasComponent,
  BuscarAudienciaComponent,
  EstadisticasComponent,
  BusquedaAvanzadaComponent,
  EstadisticaPartComponent,
  ReunionDetalleComponent,
  ReunionDetalleParticipanteComponent
];
