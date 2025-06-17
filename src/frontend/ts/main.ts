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
              
                    /* Parse response as JSON */                    
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    let div = document.getElementById("lista");
                    div.innerHTML = "";
                    let listado: string = ""
                    
                    for (let o of devices)
                    {
                        listado+="<div class='col s12 m6 l6 xl4'>"
                        listado += `<h3>${o.name}</h3><p>${o.description}</p>`
                        listado += "<input type='button' value='On/OFF'>"
                        listado += "</div>";
                    }
                    div.innerHTML = listado;
                }else {alert("Query failed.");}
            }
        }
        
        /* Complete with the following:
            1- HTTP REQUEST 
            2- URL 
            3- Async?
        */
        xmlReq.open("GET", SPA_URL + "/devices", true);
        xmlReq.send();
    }


    handleEvent(object: Event): void{
        console.log(object)
        let elementoClick =<HTMLInputElement> object.target;

        switch(elementoClick.id)
        {
            case "ClickAca":
            {
                /* Grab name input element  */
                let NameInput =<HTMLInputElement> document.getElementById("NameInput");            
                
                /* Configure as hidden */
                NameInput.hidden = true;

                /* Save value of the input element   */
                let nombre = NameInput.value;
                
                /* Alert */
                alert("el usuario es " + nombre);
                
                /* if necessary this title can be changed */
                //document.getElementById("titulo1").innerHTML = " titulo nuevo";
                
                /* hide all list  */
                let div = document.getElementById("lista");
                div.hidden = true;
            }break;
            case "btnMostrar":
            {
                if(object.type=="click")
                    this.queryServer();
            }break;
            default:
                console.log("pase por el boton!");

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
     
    document.getElementById("ClickAca")?.addEventListener("click", main); 
    document.getElementById("btnMostrar")?.addEventListener("click", main);
});

