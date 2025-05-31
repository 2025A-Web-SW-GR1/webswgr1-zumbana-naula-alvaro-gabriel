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



leerArchivoPromesa('./a.txt')
    .then(
        (contenidoArchivo)=>{
            console.log('Contenido:', contenidoArchivo);
            return escribirArchivoPromesa('./a.txt', contenidoArchivo)
        }
    ).catch(
        (error)=>{
            console.error('ERROR:', error);
        }
    )