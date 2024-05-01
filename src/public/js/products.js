
const buy = async (idp,idc)=>{

    let respuesta=await fetch("/api/cart/"+idc+"/product/"+idp,
    {method:"post"})


    let datos= await respuesta.json()
    if(respuesta.status===200){
        //Agregando alerta con libreria toastify 
        Toastify({
            text: "Producto agregado a la canasta",
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "center", 
            stopOnFocus: true, 
            style: {
                background: "#ee9246",
                color:"#000000"
            }
        }).showToast();
    }else{
        alert("Error...")
    }

}