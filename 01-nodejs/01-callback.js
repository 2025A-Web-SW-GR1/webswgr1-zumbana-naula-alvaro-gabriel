// Estamos en el LADO SERVIDOR
const fs = require('fs'); // importar libreria fs
console.log("Primero");
fs.readFile( //file system
    './a.txt', // path
    'utf-8', // codificacion
    (errorLectura, contenido) => { //funcion callback!
        if(errorLectura){
            console.error('ERROR lectura 1');
        }else{
            console.log('TERCERO', contenido)
        }
    }
)

fs.writeFile( //file system
    './a.txt', // path
    'Hola!' + new Date().toString(), // nuevo contenido
    (errorEscritura, contenido) => { //funcion callback!
        if(errorEscritura){
            console.error('ERROR escritura');
        }else{
            console.log('Archivo escrito')
        }
    }
)
  


console.log("Segundo");
