/* Interface is used to implement behaviours.
   "Mostrable" implements "mostrarInfo" as a public method  */
interface Mostrable
{
    mostrarInfo(): string;
}

class Main implements Mostrable
{
    // Implements mostrarInfo
    public mostrarInfo(): string { return "Estoy en el MAIN!";}
}

/*  This will be executed after all HTML is loaded... */
window.addEventListener("load" ,  () => 
{
    // Creation of 2 objets type of "Persona"
    let per2: Persona = new Persona("Juan",17654322);
    let per3: Persona = new Persona("Pedro", 18222194);

    // Creation of other object type of "Usuario" with +1 attribute (mail) compare to "Persona"
    let usr1: Usuario = new Usuario("Martin",38762123,"duartemartn@gmail.com");

    // New instance of class Main
    let main: Main = new Main();

    let personas: Array<Persona> = new Array();
    /* Push personas objects  */
    personas.push(per2); personas.push(per3);
    
    /* usr1 extends Persona, so can be added to <Persona> array */
    personas.push(usr1);

    /* Declaration of Mostrable interface array.  */
    let mostrables: Array<Mostrable> = new Array();
    mostrables.push(per2);
    mostrables.push(main);
    mostrables.push(usr1);
    
    for (let m of mostrables) { console.log(m.mostrarInfo())}




    /* Grab current value of textarea_1 and cast as HTMLInputElement  */
    let current_value = document.getElementById("textarea_1") as HTMLInputElement;

    /* Append text... */
    let new_value = "Hola mundo !!!" + "\n" + current_value.value;
    
    /* Assign new value */
    document.getElementById("textarea_1").innerHTML = new_value;

    /* Click event listener for button checking if it is not null.. */
    document.getElementById("btn_1")?.addEventListener("click", ()=>
    {
        for (let p of personas) 
        {
            if (p instanceof Usuario) 
            {
                let u = <Usuario>p;
                alert(u.obtenerDatos() + " is a user.");
            } 
            else 
            {
                alert(p.obtenerDatos() + " is not user.")
            }
        }
    });
});

