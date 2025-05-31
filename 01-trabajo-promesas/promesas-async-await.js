const fs = require('fs');     

function leerArchivoPromesa(nombreArchivo){
    return new Promise(
        (res, rej)=>{ 
            fs.readFile(
                nombreArchivo, // path
                'utf-8', // codificacion
                (errorLectura, contenido) => {
                    if(errorLectura){
                        rej(errorLectura);
                    }else{
                        res(contenido);
                    }
                }
            );
        }
    );
}

function escribirArchivoPromesa(nombreArchivo, contenido){
    return new Promise(
        (res, rej) => {
            fs.writeFile(
                nombreArchivo,
                contenido + " " + new Date().toString(),
                error => {
                    if (error) {
                        rej('ERROR escritura:', error);
                    } else {
                        res('Contenido escrito con éxito');
                    }
                }
            );
    })
}

async function correrLogicaPromesas(){
    try {
        const respuestaLeerArchivo = await leerArchivoPromesa('./a.txt');
        console.log('1) Respuesta archivo: ', respuestaLeerArchivo);
        await escribirArchivoPromesa('./a.txt', respuestaLeerArchivo);
    
    } catch(error){
        console.log('3) ERROR', error);
    }
}
correrLogicaPromesas().then().catch(); 