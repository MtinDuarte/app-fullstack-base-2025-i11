let SPA_URL: string =  "http://localhost:8000";

//#region Edition
function devices_cancelEdition(id: number) 
{
    const form = document.getElementById(`edit_form_${id}`);
    form?.remove();
}
function device_saveChanges(id: number) 
{
    const nameInput = <HTMLInputElement>document.getElementById(`edit_name_${id}`);
    const descInput = <HTMLTextAreaElement>document.getElementById(`edit_desc_${id}`);
    const typeSelect= <HTMLInputElement>document.getElementById(`edit_type_${id}`);

    const updatedName = nameInput.value;
    const updatedDesc = descInput.value;
    const updatedType = parseInt(typeSelect.value);

    console.log(`Guardar ${id}:`, updatedName, updatedDesc);

    /* Update database */
    device_updateAllFields(id,updatedName,updatedDesc,0,updatedType);

    /* Remove edition form */
    devices_cancelEdition(id);
}
function device_updateAllFields(id: number, name: string, description: string, state: number, type: number) 
{
  const xmlReq = new XMLHttpRequest();

  xmlReq.onreadystatechange = () => {
    if (xmlReq.readyState === 4) {
      if (xmlReq.status === 200) {
        console.log("Dispositivo actualizado correctamente");
      } else {
        console.error("Error al actualizar dispositivo:", xmlReq.statusText);
      }
    }
  };

  // Codificar parámetros para que la URL sea válida
  const url = `${SPA_URL}/devices/${id}/${encodeURIComponent(name)}/${encodeURIComponent(description)}/${state}/${type}`;

  xmlReq.open("PUT", url, true);
  xmlReq.send();
}
function device_updateValue(id: number, value: number)
{
  const xmlReq = new XMLHttpRequest();
  
  xmlReq.onreadystatechange = () => {
    if (xmlReq.readyState === 4) {
      if (xmlReq.status === 200) {
        console.log("Dispositivo actualizado correctamente");
      } else {
        console.error("Error al actualizar dispositivo:", xmlReq.statusText);
      }
    }
  };

  // Codificar parámetros para que la URL sea válida
  const url = `${SPA_URL}/devices/${id}/state/${value}`;

  xmlReq.open("PATCH", url, true);
  xmlReq.send();    
}
//#endregion

//#region  Utils
function devices_getIcon(type) {
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
function devices_getWidget(device) {
  switch (device.type) {
    case 0: // Luz
    case 1: // Cortina
    case 4: // TV
      /* @ToDo: code handleSwitchChange    */
      return `
        <div class="switch">
          <label class="white-text">
            Off
            <input type="checkbox" id="switch_${device.id}" ${device.state ? 'checked' : ''}>
            <span class="lever"></span>
            On
          </label>
        </div>`;
    case 2: // AC
    case 3: // Musica(volumen)
    case 5: // Ventliador
     /* @ToDo: code handleSliderChange    */
      return `
        <p class="range-field">
          <input type="range" id="slider_${device.id}" min="0" max="100" value="${device.state}" />
        </p>`;
    default:
      return '';
  }
}
function devices_getTypeSelect(device)
{
  const typeLabels = [
    "Luz", "Persiana", "Aire", "Música", "TV", "Ventilador"
  ];
  const label = typeLabels[device.type] ?? "Otro";

  return `<div><span class="chip white black-text z-depth-1">${label}</span></div>`;
}
//#endregion

//#region Deletion
function device_deleteDevice(id: number)
{
  const xmlReq = new XMLHttpRequest();

  xmlReq.onreadystatechange = () => {
    if (xmlReq.readyState === 4) {
      if (xmlReq.status === 200) {
        console.log("Dispositivo eliminado correctamente");
      } else {
        console.error("Error al eliminar dispositivo:", xmlReq.statusText);
      }
    }
  };

  // Codificar parámetros para que la URL sea válida
  const url = `${SPA_URL}/devices/${id}`;

  xmlReq.open("DELETE", url, true);
  xmlReq.send();    
}
//#endregion

//#region Creation
function devices_createDevice(name: string, description: string, type: number) {
  const xmlReq = new XMLHttpRequest();

  xmlReq.onreadystatechange = () => {
    if (xmlReq.readyState === 4) {
      if (xmlReq.status === 201 || xmlReq.status === 200) {
        console.log("Dispositivo creado correctamente");
      } else {
        console.error("Error al crear dispositivo:", xmlReq.statusText);
      }
    }
  };

  // Estado inicial en 0 (apagado)
  const url = `${SPA_URL}/devices/${encodeURIComponent(name)}/${encodeURIComponent(description)}/0/${type}`;

  xmlReq.open("POST", url, true);
  xmlReq.send();
}
//#endregion


function devices_createCard(device) 
{
  
  /* Map materialize icon for each type (integer) */
  const icon = devices_getIcon(device.type);

  /* Get widget in order to show a mechanism of controlling the device  */
  const controlHtml = devices_getWidget(device);

  /* Get Device type field  */
  const typeSelectHtml = devices_getTypeSelect(device);


  /* @ToDo: code editDevice, deleteDevice */

  return `
    <div class="col s12 m6 l3">
      <div class="card blue white-text" id="device_card_${device.id}">
        <div class="card-content">
          <span class="card-title">
            <i class="material-icons left">${icon}</i>${device.name}
          </span>
            <p>${device.description}</p>
            ${typeSelectHtml}
           ${controlHtml}  
        </div>
        <div class="card-action">
            <a id="edit_${device.id}" class="btn-flat white-text">EDITAR</a>
            <a id="delete_${device.id}" class="btn-flat white-text">ELIMINAR</a>
        </div>        
      </div>
    </div>
  `;
}



class Main implements EventListenerObject
{
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
                    
                    if(container != null)
                    {
                        /* Clean container   */
                        container.innerHTML = "";
                        
                        /* Create 1 card for each device */
                        for (let device of devices) 
                            container.innerHTML += devices_createCard(device);                        
                    }                    
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

    private device_edit(id: number) 
    {
        const card = document.getElementById(`device_card_${id}`);
        if (!card) return;

        // Evitar múltiples formularios de edición
        if (document.getElementById(`edit_form_${id}`)) return;

        const formHtml = `
            <div id="edit_form_${id}">

                <div class="input-field">
                    <input id="edit_name_${id}" type="text" value="">
                    <label class="active white-text" for="edit_name_${id}">Nombre</label>
                </div>

                <div class="input-field">
                    <textarea id="edit_desc_${id}" class="materialize-textarea"></textarea>
                    <label class="active  white-text" for="edit_desc_${id}">Descripción</label>
                </div>
            
                <div class="input-field white-text">
                <select id="edit_type_${id}" class="browser-default">
                    <option value="" disabled selected>Seleccione tipo</option>
                    <option value="0">Luz</option>
                    <option value="1">Persiana</option>
                    <option value="2">Aire</option>
                    <option value="3">Música</option>
                    <option value="4">TV</option>
                    <option value="5">Ventilador</option>
                </select>
                </div>
                
                <div class="right-align">
                    <button class="btn green" onclick="device_saveChanges(${id})">Guardar</button>
                    <button class="btn red" onclick="devices_cancelEdition(${id})">Cancelar</button>
                </div>
            </div>
        `;

        card?.insertAdjacentHTML("beforeend", formHtml);   
    }

    private device_delete(id: number) 
    {           
        const confirmar = window.confirm("¿Está seguro que desea eliminar el dispositivo?");

        if (confirmar) 
        {
            device_deleteDevice(id);
            console.log(`Dispositivo ${id} eliminado`);
        } 
        else 
        {
            console.log("Eliminación cancelada.");
        }
    }
    private device_showNewDeviceForm(): void 
    {
            // Evitar múltiples formularios abiertos
        if (document.getElementById("add_form")) return;

        const container = document.getElementById("devices");
        if (!container) return;

        const formHtml = `
            <div id="add_form" class="card-panel blue lighten-5">
            <div class="input-field">
                <input id="add_name" type="text">
                <label class="active" for="add_name">Nombre</label>
            </div>

            <div class="input-field">
                <textarea id="add_desc" class="materialize-textarea"></textarea>
                <label class="active" for="add_desc">Descripción</label>
            </div>

            <div class="input-field">
                <label class="active">Tipo</label>
                <select id="add_type" class="browser-default">
                <option value="" disabled selected>Seleccionar tipo</option>
                <option value="0">Luz</option>
                <option value="1">Persiana</option>
                <option value="2">Aire</option>
                <option value="3">Música</option>
                <option value="4">TV</option>
                <option value="5">Ventilador</option>
                </select>
            </div>

            <div class="right-align">
                <button id="btn_add_confirm" class="btn green">Crear</button>
                <button id="btn_add_cancel" class="btn red">Cancelar</button>
            </div>
            </div>
        `;

        container.insertAdjacentHTML("beforebegin", formHtml);
    }

    private handleSwitchChange(id: number, state: boolean) 
    {
        console.log(`SWITCH dispositivo ${id}: ${state ? 'On' : 'Off'}`);
        
        device_updateValue( id , state == false ? 0 : 1);

    }

    private handleSliderChange(id: number, value: number) 
    {
        console.log(`SLIDER dispositivo ${id}: ${value}`);

        device_updateValue( id , value);
    }


    handleEvent(event: Event): void {
        const target = <HTMLElement>event.target;
        const id = target.id;

        if (!id) return;

        if (id.startsWith('edit_'))
        {
        const deviceId = parseInt(id.slice(5));
        this.device_edit(deviceId);
        }
        else if (id.startsWith('delete_')) 
        {
        const deviceId = parseInt(id.slice(7));
        this.device_delete(deviceId);
        }
        else if (id.startsWith('switch_') && event.type === 'change') 
        {
        const deviceId = parseInt(id.slice(7));
        const input = <HTMLInputElement>target;
        this.handleSwitchChange(deviceId, input.checked);
        } 
        else if (id.startsWith('slider_') && event.type === 'change') 
        {
        const deviceId = parseInt(id.slice(7));
        const input = <HTMLInputElement>target;
        this.handleSliderChange(deviceId, parseInt(input.value));
        }
        else if (id === 'btn' && event.type === 'click') {
            this.device_showNewDeviceForm();
        }
        else if (id === 'btn_add_confirm') {
            
            console.log("Boton crear");

            const name = (<HTMLInputElement>document.getElementById("add_name")).value;
            const desc = (<HTMLTextAreaElement>document.getElementById("add_desc")).value;
            const type = parseInt((<HTMLSelectElement>document.getElementById("add_type")).value);

            if (!name || !desc || isNaN(type)) {
                alert("Completar todos los campos.");
                return;
            }

            devices_createDevice(name, desc, type);
        }
        else if (id === 'btn_add_cancel') {
        document.getElementById("add_form")?.remove();
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

    /* Register eventListenerHandlers */
    document.getElementById('devices')?.addEventListener('click', (e) => main.handleEvent(e));
    document.getElementById('devices')?.addEventListener('change', (e) => main.handleEvent(e));
    document.getElementById("btn")?.addEventListener("click", (e) => main.handleEvent(e));
    document.addEventListener('click', main);
    main.queryServer();    
});

