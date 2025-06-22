let SPA_URL: string =  "http://localhost:8000";
let collectionItemAvatar: string = "<li class='collection-item avatar'>";
let image_lightbulb : string = `<i class="material-icons left">lightbulb</i>`;
let image_window : string = `<i class="material-icons left">settings_overscan</i>`;

function getDeviceIcon(type) {
  switch (type) {
    case 0: return 'lightbulb';         // Luz
    case 1: return 'window';            // Cortina / persiana
    case 2: return 'ac_unit';           // Aire
    case 3: return 'music_note';        // Música
    case 4: return 'tv';                // Televisor
    case 5: return 'toys_fan';          // Ventilador (alternativa: fan en sharp)
    default: return 'devices';          // Genérico
  }
}
function getDeviceControl(device) {
  switch (device.type) {
    case 0: // Luz
    case 1: // Persiana

      /* @ToDo: code handleSwitchChange    */
      return `
        <div class="switch">
           <label class="white-text">
            Off
            <input type="checkbox" id="switch_${device.id}" ${device.state ? 'checked' : ''} 
              onchange="handleSwitchChange(${device.id}, this.checked)">
            <span class="lever"></span>
            On
          </label>
        </div>`;
    case 2: // Aire acondicionado
    case 3: // Ventilador
     /* @ToDo: code handleSliderChange    */
      return `
        <p class="range-field">
          <input type="range" id="slider_${device.id}" min="0" max="100" value="${device.state}"
            onchange="handleSliderChange(${device.id}, this.value)" />
        </p>`;
    default:
      return '';
  }
}
function createDeviceCard(device) 
{
  
  /* Map materialize icon for each type (integer) */
  const icon = getDeviceIcon(device.type);

  /* Get widget in order to show a mechanism of controlling the device  */
  const controlHtml = getDeviceControl(device);

  /* @ToDo: code editDevice, deleteDevice */

  return `
    <div class="col s12 m6 l3">
      <div class="card blue white-text" id="device_card_${device.id}">
        <div class="card-content">
          <span class="card-title">
            <i class="material-icons left">${icon}</i>${device.name}
          </span>
          <p>${device.description}</p>
           ${controlHtml}
        </div>
        <div class="card-action">
          <a href="#!" class="btn-flat white-text" onclick="editDevice(${device.id})">EDITAR</a>
          <a href="#!" class="btn-flat white-text" onclick="deleteDevice(${device.id})">ELIMINAR</a>
        </div>        
      </div>
    </div>
  `;
}


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
                    
                    /* Get container element from HTML   */
                    let container = document.getElementById("devices");
                    
                    /* Clean container   */
                    container.innerHTML = "";
                    
                    /* Create 1 card for each device */
                    for (let device of devices) 
                        container.innerHTML += createDeviceCard(device);
                    
                    
                }
                else 
                {
                    alert("Query failed.");
                }
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
    
    main.queryServer();
    
});

