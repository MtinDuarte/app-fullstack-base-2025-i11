let SPA_URL: string =  "http://localhost:8000";
let collectionItemAvatar: string = "<li class='collection-item avatar'>";
let image_lightbulb : string = `<img src="./static/images/lightbulb.png" alt="" class="circle">`;
let image_window : string = `<img src="./static/images/window.png" alt="" class="circle">`;

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
                        listado += collectionItemAvatar

                        if (o.type == 1)                                                     
                            listado += image_lightbulb
                         else 
                            listado += image_window
                        
                        listado += `<span class="title">${o.name}</span>`
                        listado += ` <p>${o.description}</p>`
                        
                        listado += `<a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                Off`;
                                
                        if (o.state) 
                        {
                            listado += `
                                <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">`
                        }
                        else 
                        {
                            listado += `<input id='cb_${o.id}' type="checkbox">`
                        }
                        listado += `<span class="lever"></span>
                                    On
                                    </label>
                                    </div>
                                    </a>`
                        listado += '</li>';
                    }
                    div.innerHTML = listado;

                    for (let o of devices) {
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }

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
            {
                if(elementoClick.id.startsWith("cb_"))
                {                
                    // <input id='cb_1' type="checkbox"> // true //cb_1
                    console.log("pase por el check!!", elementoClick.checked, elementoClick.id)
                    console.log(elementoClick.id.substring(3, elementoClick.id.length));
                    console.log(elementoClick)
                    console.log(elementoClick.getAttribute("miIdBd"));
                }else
                    console.log("pase por el boton!");
            }break;
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

