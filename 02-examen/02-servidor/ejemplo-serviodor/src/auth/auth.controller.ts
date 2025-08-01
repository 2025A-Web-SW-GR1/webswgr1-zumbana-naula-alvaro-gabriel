import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Session, 
  Res, 
  Req,
  Query // Agregar este import
} from '@nestjs/common';
import { CasaService } from '../casa/casa.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly casaService: CasaService) {}

  // Vista de login (NUEVO)
  @Get('login-vista')
  async loginVista(
    @Res() res: any,
    @Query() query: { mensaje?: string },
  ) {
    res.render('login', {
      mensaje: query.mensaje ?? ''
    });
  }

  // Método POST para login (ACTUALIZADO)
  @Post('login')
  async login(
    @Body() login: { username: string; password: string; rest?: boolean; },
    @Session() session: Record<string, any>,
    @Res() res: any
  ) {
    try {
      const respuesta = await this.casaService.buscarUnoPorUsername(login.username);
      
      if (respuesta.password === login.password) {
        session.user = {
          ...respuesta
        };
        
        if (login.rest) {
          return {
            mensaje: 'Usuario logeado exitosamente'
          };
        }
        
        // Redirigir a sesión (renderizada)
        res.redirect('/auth/sesion');
      } else {
        res.redirect('/auth/login-vista?mensaje=Usuario y password no coinciden');
      }
    } catch (e) {
      console.error('No se encontró usuario');
      res.redirect('/auth/login-vista?mensaje=Usuario no encontrado');
    }
  }

  // Método GET para logout (ACTUALIZADO)
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
    res.redirect('/auth/login-vista'); // Cambiar a login-vista
  }

  // Vista de sesión (ACTUALIZADO)
  @Get('sesion')
  async sesion(
    @Res() res: any,
    @Session() session: Record<string, any>
  ) {
    let casa: any = {};
    
    if (session?.user?.username) {
      try {
        casa = await this.casaService.buscarUnoPorUsername(session.user.username);
      } catch (e) {
        console.error('No se encontró usuario');
      }
    }
    
    // Renderizar la vista en lugar de devolver JSON
    res.render('sesion', {
      casa,
    });
  }
}
