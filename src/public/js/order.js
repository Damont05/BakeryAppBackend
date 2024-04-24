
console.log("ESTOY EN ORDER.JS");

const order = async (email,amount)=>{

    console.log("email: " + email);
    console.log("amount: " + amount);

    let respuesta=await fetch("/api/sessions/"+email+"/order/"+amount,
     {method:"POST"});
    
    if(respuesta.status === 200){


        let respuesta2=await fetch("/products",
        {method:"GET"});



        let respuesta3=await fetch("/api/cart/products/cart/"+email,
        {method:"DELETE"});


        console.log('respuesta3: ' + respuesta3);

        
        if(respuesta2.status === 200){
            Toastify({
                text: "Correo enviado con la descripcion de tu pedido",
                duration: 10000,
                newWindow: true,
                close: true,
                gravity: "buttom", 
                position: "center", 
                stopOnFocus: true, 
                style: {
                    background: "#ee9246",
                    color:"#000000"
                }
            }).showToast();


        }
          

    }

}
