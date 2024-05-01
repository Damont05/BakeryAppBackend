
//btn sumar
const btnSum = async (idp,idc)=>{

    let sum = 'sum';

    let respuesta=await fetch("/api/cart/"+idc+"/product/"+idp+"/op/"+sum,
    {method:"post"})


    if(respuesta.status === 200){

        window.location.reload();
    }

}

//btn restar
const btnRest = async (idp,idc)=>{

    let res = 'res';

    let respuesta=await fetch("/api/cart/"+idc+"/product/"+idp+"/op/"+res,
    {method:"post"})


    if(respuesta.status === 200){

        window.location.reload();
    }

}

//btn delete
const btnDelete = async (idp,idc)=>{

    let respuesta=await fetch("/api/cart/"+idc+"/prod/"+idp,
     {method:"delete"});
    
    if(respuesta.status === 200){
        
        Toastify({
            text: "Eliminado de la canasta",
            duration: 4000,
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

        window.location.reload();
    }
}
