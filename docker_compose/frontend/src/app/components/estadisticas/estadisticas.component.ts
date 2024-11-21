import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OficinaService } from 'src/app/services/oficina.service';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit {
  constructor(private oficinaService: OficinaService) {}
  oficinas: Array<any> = [];
  valores: Array<any> = [];
  data:Array<any> =[]
  dataPie:Array<any> =[]
  fechas = ['2022-07', '2022-08', '2022-09']
  ngOnInit(): void {
    this.getEstadisticasOficinas();
    this.update();
  }
  getEstadisticasOficinas() {
    this.oficinaService.getOficinas().subscribe({
      next: (result) => {
        this.oficinas = [];
        this.oficinas = result['data']['oficinas'];
        this.filterValues();
        this.getLabelsBarOficina()
        this.getLabelsPieOficina()
        this.update();
      },
      error: () => {
        alert('Error en la peticion');
      },
    });
  }
  filterValues() {
    this.valores = this.oficinas.map((x: any) => ({
      nombre: x['nombre'],
      historial: x['historialDeReuniones'].map((y: any) => ({
        fecha: y['horaInicio'].slice(0, 7),
        participantes: y['participantes'].length,
      })),
    }));
    this.fechas.forEach((i) =>
      this.valores.forEach((obj: any) => {
        obj[i] = {
          usos: obj['historial'].filter((x: any) => x.fecha == i).length,
          participantes: obj['historial']
            .filter((x: any) => x.fecha == i)
            .reduce((count: number, current: any) => {
              count = count + current['participantes'];
              return count;
            }, 0),
        };
      })
    );
    this.valores.forEach((obj: any) => delete obj['historial']);
  }
  getLabelsBarOficina(){
    let array:Array<any> =[]
    this.valores.forEach((x:any)=>{ let arr:Array<any>=[]; this.fechas.forEach(i => {
        arr.push(x[i].usos)});
        array.push(arr);
        })
    this.valores.forEach((x:any, index:number)=>(this.data.push({label:x["nombre"], data:array[index]})))
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: this.fechas,
    datasets: this.data,
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public update(): void {

    this.valores = [];
    this.filterValues();

    this.chart?.update();
  }
  
  //ESTADISTICA TIPO TORTA

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.fechas,
    datasets: [ {
      data: this.dataPie
    } ]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DataLabelsPlugin];

  changeLegendPosition(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.position =
        this.pieChartOptions.plugins.legend.position === 'left'
          ? 'top'
          : 'left';
    }

    this.chart?.render();
  }

  toggleLegend(): void {
    if (this.pieChartOptions?.plugins?.legend) {
      this.pieChartOptions.plugins.legend.display =
        !this.pieChartOptions.plugins.legend.display;
    }

    this.chart?.render();
  }
  getLabelsPieOficina(){
    this.fechas.forEach(i => {let count=0;
      this.valores.forEach((x:any)=>{   
          count+=x[i].usos
          }
          );
          this.dataPie.push(count);
          })

  }

}


/*
  getLabelsPieOficina(){
    this.fechas.forEach(i => {let count=0;
      this.valores.forEach((x:any)=>{   
          count+=x[i].usos

          }
          );
          this.dataPie.push(count);
          })
  }
*/