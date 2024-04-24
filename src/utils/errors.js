export class CustomError extends Error{
    constructor(nombre, mensaje, codigo=500, descrip=""){
        super(mensaje)
        this.name=nombre
        this.codigo=codigo
        this.descrip=descrip
    }
}

export const TYPES_ERRORS={
    NOT_FOUND:404,
    ERROR_ARGUMENTOS:400, 
    ERROR_DATOS_ENVIADOS:400, 
    ERROR_AUTENTICACION:401,
    ERROR_AUTORIZACION:403,
    ERROR_INDETERMINADO:500,
    DATABASE:500, 
    ARGUMENTOS:200, 
    PERMISOS:300, 
    OTROs: 400
}

export const error2=async()=>{
    try {
        throw new CustomError("error", "error fn async anidada", TYPES_ERRORS.ERROR_ARGUMENTOS, "error descrip")
    } catch (error) {
        throw new CustomError(error.name?error.name:"error generico", error.message, error.codigo?error.codigo:TYPES_ERRORS.ERROR_INDETERMINADO, error.descrip?error.descrip:"Error indeterminado...")
    }
} 

export const error3=async()=>{
    try {
    } catch (error) {
        throw new CustomError(error.name?error.name:"error generico", error.message, error.codigo?error.codigo:TYPES_ERRORS.ERROR_INDETERMINADO, error.descrip?error.descrip:"Error indeterminado...")
    }
} 

export const error4=async()=>{
    throw new CustomError("Error validacion...", "Error validacion mensaje...", TYPES_ERRORS.ERROR_ARGUMENTOS, "descrip error validacion")
}