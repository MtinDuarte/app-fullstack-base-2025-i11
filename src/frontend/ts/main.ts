let SPA_URL: string =  "http://localhost:8000";

class Main implements EventListenerObject
{
    nombre: string = "Martin";
    per: Persona = new Persona("", 3);

    /* Generic showinConsole */
    public showInConsole( mensaje: string) {console.log(mensaje);}
    
    public queryServer() 
    {
        /* Create an instance of XMLHTTP request */
        let xmlReq = new XMLHttpRequest();
        
        /* Wait onreadyState */
        xmlReq.onreadystatechange = () => {
            /* Check ready */
            if (xmlReq.readyState == 4) {
                /* Check STATUS_OK HTTP REQUEST */
                if (xmlReq.status == 200) 
                {
                    /* Log in console    */
                    console.log(xmlReq.responseText);

                    /* Get input element to put the server response */
                    document.getElementById("textarea_1").innerHTML = xmlReq.responseText;
                    
                    /* Parse response as JSON */
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    
                    /* Log devices in console */
                    for (let o of devices) 
                    {
                        console.log(o.id);    
                        console.log(o.name);    
                        console.log(o.description); 
                        console.log(o.state);
                    }
                    
                    /*   Grab list element in HTML */
                    let div = document.getElementById("lista");
                    
                    /* Insert H1 header */
                    div.innerHTML = "<h1>Titulo</h1>"
                    
                    /* Insert description as body */
                    div.innerHTML += "<p> descripcion</p>"

                    /* Button */
                    div.innerHTML+="<input type='button'>"
                    
                } else {alert("Query failed.");}
            }
        }
        
        /* Complete with the following:
            1- HTTP REQUEST 
            2- URL 
            3- Async?
        */
        xmlReq.open("GET", SPA_URL + "/devices", true);

        xmlReq.send(JSON.stringify({name:"",passwo:""}));
    }


    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;

        if(elementoClick.id=="btn_1"){
           this.per.obtenerDatos()
            
        } else if(elementoClick.id=="btnMostrar" && object.type=="click"){
            this.queryServer();
        } else {
            console.log("pase por el boton!")
        }

    }
    // Implements mostrarInfo
    public mostrarInfo(): string {console.log("Main Class - executing mostrarInfo()");return "";}
}

/*  This will be executed after all HTML is loaded... */
window.addEventListener("load" ,  () => 
{
    // New instance of main
    let main: Main = new Main();
     
    document.getElementById("btn_1")?.addEventListener("click", main); 
    document.getElementById("btnMostrar")?.addEventListener("click", main);
});

