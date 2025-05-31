// Estamos en el LADO SERVIDOR
const fs = require('fs'); // importar libreria fs

fs.readFile( //file system
    './a.txt', // path
    'utf-8', // codificacion
    (errorLectura, contenido) => { //funcion callback!
        if(errorLectura){
            console.error('ERROR lectura 1');
        }else{
            console.log(contenido)            
            fs.writeFile(

                './a.txt', // path
                contenido + ' '+new Date().toString(), // nuevo contenido
                (errorEscritura,contenido) => {
                    if(errorEscritura){
                        console.error('ERROR escritura');
                    }else{
                        console.log('Archivo concatenado ')
                    }
                }
            )
            
        }
    }
)
  