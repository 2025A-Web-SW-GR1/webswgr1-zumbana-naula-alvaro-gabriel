## Autorizacion

En esta configuracion que vamos a usar vamos a poder revisar si el usuario tiene una sesion guardada en el servidor. Existen varios tipos de formas de guardar las sesiones en el servidor, pero la forma mas didactica de aprender es mediante archivos de sesion. Cada vez que un usuario se logee en el sistema y creemos una nueva sesion, el servidor va a crear un nuevo archivo con la informacion que nosotros guardemos en esa sesion. Normalmente se guarda el identificador del usuario y por cada peticion se necesita consultar los permisos que el usuario tiene en ese momento. 

## Instalacion de paquetes

Lo primero que vamos a realizar es instalar los paquetes necesarios:

```bash
npm install express-session session-file-store @types/express-session
```

## Configuracion en `main.ts`

Lo siguiente es habilitar la configuracion antes de levantar el servidor en el archivo `main.ts` para esto vamos a crear un nuevo FileStore session:

```typescript
  const FileStore = sessionFileStore(session); // Initialize FileStore
  app.use(
    session({
      secret: 'secreto-seguro',
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't save uninitialized sessions
      store: new FileStore({
        path: './sessions', // Directorio para guardar los archivos de sesion
        ttl: 3600, // tiempo de vida de las sesiones
      }),
      cookie: {
        maxAge: 3600000, // Cookie max age in milliseconds (e.g., 1 hour)
        secure: process.env.NODE_ENV === 'production', // Usar cookies seguras en prod
        httpOnly: true, // Prevent client-side JavaScript access
      },
    }),
  );
```

## Guardar una sesion o redirigir

Para guardar una sesion vamos a crear un metodo POST que va a recibir las peticiones para crear las sesions:

```typescript
  // LoginMetodo
  @Post('login')
  async login(
    @Body() login: { username: string; password: string; rest: boolean; },
    @Session() session: Record<string, any>,
    @Res() res: any
  ) { // Using @Session() decorator
    try {
      // buscamos al usuario
      const respuesta = await this.casaService.buscarUnoPorUsername(login.username);
      // Verificamos que el password sea el mismo
      if (respuesta.password === login.password) {
        session.user = {
          ...respuesta
        };
        // Si es rest respondemos con un JSON
        if (login.rest) {
          return {
            mensaje: 'Usuario logeado exitosamente'
          };
        }
        // Si es una peticion normal redirigimos a la pantalla de sesion
        res.redirect('/auth/sesion');
      } else {
        res.redirect('/auth/login-vista?mensaje="Usuario y password no coinciden"');
      }
    } catch (e) {
      console.error('No se encontro usuario');
      res.redirect('/auth/login-vista?mensaje="Usuario no encontrado"');
    }
  }
```

Cuando el usuario `cree una nueva sesion mediante el metodo POST` vamos a observar que dentro de la carpeta `sessions` se va a crear un nuevo archivo parecido a este nombre `SymvFSryrSEH8Hxpa-4dIBjalSw2Fz6i.json` y con este contenido:

```json
{
    "cookie": {
        "originalMaxAge": 3600000,
        "expires": "2025-07-18T11:55:19.318Z",
        "secure": false,
        "httpOnly": true,
        "path": "/"
    },
    "user": {
        "id": 4,
        "nombre": "casa actualizada",
        "valor": 23,
        "imagenURL": "http://www.google.com",
        "fileContentType": null,
        "filename": null,
        "fileID": null,
        "username": "adrianeguez",
        "password": "1234"
    },
    "__lastAccess": 1752836119323
}
```
En nuestro caso nosotros estamos guardando el objeto `user` con toda la informacion del registro, esto varia en cada aplicacion.

## Eliminar una sesion

Para eliminar una sesion vamos a crear un metodo `GET` para el logout:

```typescript

  // Eliminar la sesion
  @Get('logout')
  logout(
    @Req() req: any,
    @Res() res: any
  ) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });
    res.redirect('/auth/login-vista')
  }
```
Al momento de que el usuario acceda a esta url o se haga una peticion GET vamos a hacer que el servidor elimine el archivo `SymvFSryrSEH8Hxpa-4dIBjalSw2Fz6i.json` y cuando el sistema busque si tiene ese navegador sesion va a aparecer vacio y nos va a redigir a la pagina de login. Algo importante que notar en esto es que la sesion tambien se guarda en el navagador como una COOKIE, si  revisamos la cookie vamos a encontrar una cookie:

```dotenv
## Nombre
Nombre: connect.sid
## Valor encriptado
Value: s%3ASymvFSryrSEH8Hxpa-4dIBjalSw2Fz6i.fKcR6R4fhqayhA8LtN0NKWrl%2BPmiyOJinb1VtPhl7sQ
## Cuando expira la sesion
Expires: 2025-07-18T11:55:19.237Z
## etc...
```

Asi cuando el navegador ve que la cookie de sesion ya termino su tiempo de vida la elimina y el servidor tambien elimina el archivo de sesion.