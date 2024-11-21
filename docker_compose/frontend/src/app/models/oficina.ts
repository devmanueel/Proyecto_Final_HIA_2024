import { Reunion } from "./reunion";

export class Oficina {

    _id!: string;
    nombre!: string;
    reunionesActivas!: Array<Reunion>;
    historialDeReuniones!: Array<Reunion>;
}
