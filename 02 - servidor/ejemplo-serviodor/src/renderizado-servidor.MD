## Renderizado

Para el renderizado del servidor necesitamos un `motor de renderizado` en nuestro caso vamos a usar el mas simple (no el mejor que existe) por temas didacticos. Este tipo de renderizado se usa en casos especiales ya que frameworks como Angular, React o Vue ya ofrecen tambien renderizado en el servidor junto con otras tecnologias.

El motor que vamos a usar se llama `ejs` y usa `javascript` como lenguaje, asi que es el mas sencillo de entender.

## Instalacion paquetes

Para que funcione nuestro motor de renderizado necesitamos instalar un paquete:

```bash
npm install ejs
```

## Configuracion archivo `main.ts`

En el archivo `main.ts` vamos a realizar la configuracion del motor de renderizado, dentro de la funcion bootstrap:

```typescript
  // Setear el motor de renderizado del servidor
  app.set('view engine', 'ejs');
  // Donde van a estar los archivos de vista
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  // Donde van a estar los archivos publicos
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
```

## Logica

La logica que vamos a disenar es la siguiente:

-  Vamos a Tener una pantalla para login, que muestre mensajes en caso de errores
-  Vamos a mostrar una pagina de la sesion del usuario, donde mostremos los datos de sesion SOLAMENTE SI ESTA LOGEADO

### Vista Login controlador

Para la logica del controlador nosotros vamos a renderizar un nuevo archivo llamado `login.ejs` que va a estar dentro de la carpeta `views` que lo definimos en la configuracion dentro del `main.ts`

La logica de este template es simple, tenemos un formulario que va a enviar una peticion POST a nuestro controlador, y va a mostrar un mensaje en caso de existir un parametro de consultar con el nombre `mensaje` para esto vamos a configurar asi el controlador, la `url` que vamos a visitar es `/auth/login-vista` ya que esta logica la estamos guardando en el archivo `app.auth-controller.ts`:

```typescript
  @Get('login-vista')
  async loginVista(
    @Res() res: any,
    @Query() query: { mensaje?: string },
  ) {
    res.render('login', {
      mensaje: query.mensaje ?? ''
    });
  }
```

### Vista Login template

El template completo se encuentra en `/views/login.ejs` pero vamos a describir las partes mas importantes:

`Logica mostrar mensaje`

Para mostrar mensaje vamos a colocar un `if` para revisar si el mensaje es diferente de vacio '', que configuramos como valor por defecto en el controlador.

Para esto usamos etiquetas de esta forma:

```ejs
<% if (mensaje !=='' ) { %>
    <p>Contenido Ejemplo</p>
<% }%>
```

Para mostrar el valor de una variable es un poco diferente la etiqueta con un `=` al principio, de esta forma:


```ejs
<%= mensaje %>
```

El bloque completo estaria asi:

```ejs
        <div class="col-sm-12">
            <% if (mensaje !=='' ) { %>
                <div class="alert alert-warning" role="alert">
                    <%= mensaje %>
                </div>
                <% }%>
        </div>
```

`Logica enviar peticion`

Para enviar la paticion, no vamos a usar `javascript` sino vamos a usar la etiqueta `<form>` que tiene por defecto la logica de enviar peticiones HTTP, en este caso nuestra logica (a parte de los campos), seria la siguiente:

```html
<form method="POST" action="/auth/login">
    MAS CONTENIDO
</form>
```
En este caso el atributo `method` es el metodo HTTP que vamos a usar y el atributo `action` es la `URL` a la que vamos a enviar la peticion. Algo importante que destacar es el nombre de los `input`, estos nombres son los que vamos a recibir en el controlador:

```html
<form method="POST" action="/auth/login">
    <input type="text" name="username">
    <input type="password" name="password">
</form>
```

En este ejemplo, lo que llega en los `body params` en nuestro contolador seria `username` y `password` (el `name` de nuestros inputs dentro de la etiqueta `form`)

### Logica de recibir la peticion HTTP

Aunque ya escribimos la logica en el capitulo de sesiones, en este caso nosotros redirigimos a la vista con el error descriptivo dependiendo las acciones del usuario asi:

```typescript
        res.redirect('/auth/login-vista?mensaje=Usuario y password no coinciden');
        res.redirect('/auth/login-vista?mensaje=Usuario no encontrado');
```

Si todo sale bien vamos a `sesion.ejs`

```typescript
 res.redirect('/auth/sesion');
```



### Vista Sesion controlador

En la vista de sesion vamos a hacer esto:
-  Declarar una variable local de tipo arreglo de numeros e iterarla
-  Si el usuario tiene sesion, mostramos los datos de sesion y el boton de logout
-  Si el usuario NO tiene sesion, mostramos un mensaje

En el controlador vamos a obtener la sesion mediante el decorador `@Session`, el controlador seria asi:

```typescript
@Get('sesion')
  async sesion(
    @Res() res: any,
    @Session() session: Record<string, any>
  ) { // Using @Session() decorator
    let casa: any = {};
    // Si hay username continuamos
    if (session?.user?.username) {
        // buscamos la sesion
      try {
        casa = await this.casaService.buscarUnoPorUsername(session.user.username);
      } catch (e) {
        // si no hay sesion no hacemos nada
        
        console.error('No se encontro usuario');
      }
    }
    // sino renderizamos
    res.render('sesion', {
      casa,
    });
  }
```