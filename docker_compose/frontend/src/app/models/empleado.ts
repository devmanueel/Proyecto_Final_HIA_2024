import { Dependencia } from "./dependencia";

export class Empleado {
    _id!: string;
    apellido!: string;
    nombre!: string;
    legajo!: string;
    email!: string;
    clave!: string;
    rol!: string;
    dependencias!: Array<Dependencia>;

    constructor(){
        this.dependencias = new Array<Dependencia>();
    }
}
