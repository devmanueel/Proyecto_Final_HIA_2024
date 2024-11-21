import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
/* Gráficos */
import { NgChartsModule } from "ng2-charts";
/* Calendario */
import { CalendarModule, DateAdapter } from "angular-calendar";
import { FullCalendarModule } from "primeng/fullcalendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
/* Código QR */
import { NgxQRCodeModule } from "@techiediaries/ngx-qrcode";
/* Notificaciones */
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
/* alife-file-to-base64 */
import { AlifeFileToBase64Module } from "alife-file-to-base64";

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { LoginService } from './services/login.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthGuard } from './services/auth.guard';
import { EstadisticaPartComponent } from './components/estadistica-part/estadistica-part.component';
import { DatePipe } from '@angular/common';
import { FechaValidaDirective } from './directivas/fecha-valida.directive';
import { RequireFile } from './directivas/directiva.directive';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    YesNoPipe,
    FilterPipe,
    EstadisticaPartComponent,
    FechaValidaDirective,
    RequireFile,
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    NgbModalModule,
    NgbModule,
    AlifeFileToBase64Module,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FullCalendarModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    CustomFormsModule,
    [SweetAlert2Module.forRoot()]
  ],
  providers: [
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    AuthGuard,
    DatePipe,
    AlifeFileToBase64Module,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
