
/*  This will be executed after all HTML is loaded... */
window.addEventListener("load" ,  () => {
    
    /* Grab current value of textarea_1 and cast as HTMLInputElement  */
    let current_value = document.getElementById("textarea_1") as HTMLInputElement;

    /* Append text... */
    let new_value = "Hola mundo !!!" + "\n" + current_value.value;
    
    /* Assign new value */
    document.getElementById("textarea_1").innerHTML = new_value;

    /* Click event listener for button checking if it is not null.. */
    document.getElementById("btn_1")?.addEventListener("click", ()=>{alert("Se hizo click");});
});

