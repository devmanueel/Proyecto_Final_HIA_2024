import { Empleado } from "./empleado";
import { Estado } from "./estado";
import { Oficina } from "./oficina";
import { Prioridad } from "./prioridad";
import { RecursoDigital } from "./recurso-digital";
import { RecursoFisico } from "./recurso-fisico";
import { TipoReunion } from "./tipo-reunion";

export class Reunion {

    _id!: string;
    horaInicio!: string;
    horaFinal!: string;
    prioridad!: any;
    tipoReunion!: any;
    oficina!: any;
    participantes!: any;
    recursosDigitales!: Array<RecursoDigital>;
    recursos!: Array<RecursoFisico>;
    estado!: any;
    estaDeshabilitada!: boolean;
    reunionConfirmada!: boolean;

    constructor() {}

}
