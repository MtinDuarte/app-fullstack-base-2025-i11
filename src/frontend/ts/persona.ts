class Persona
{
  // Atributes 
  public nombre: string;
  private dni: number;

  // Constructor
  constructor(nombre:string,dni:number) {this.nombre = nombre; this.dni = dni;}

  // Methods
  //public mostrarInfo(): string {return this.obtenerDatos();}

  public obtenerDatos():string { return "Name: " + this.nombre + " - DNI:" + this.dni;}
}