import { Controller, Get, Session, Post, Body, Req, Request, Res, Query } from '@nestjs/common';
import session from 'express-session';
import { CasaService } from './casa/casa.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly casaService: CasaService
  ) { }



  @Get('login-vista')
  async loginVista(
    @Res() res: any,
    @Query() query: { mensaje?: string },
  ) {
    res.render('login', {
      mensaje: query.mensaje ?? ''
    });
  }

  // LoginMetodo
  @Post('login')
  async login(
    @Body() login: { username: string; password: string; rest: boolean; },
    @Session() session: Record<string, any>,
    @Res() res: any
  ) { // Using @Session() decorator
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
        res.redirect('/auth/sesion');
      } else {
        res.redirect('/auth/login-vista?mensaje=Usuario y password no coinciden');
      }
    } catch (e) {
      console.error('No se encontro usuario');
      res.redirect('/auth/login-vista?mensaje=Usuario no encontrado');
    }
  }

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

  @Get('sesion')
  async sesion(
    @Res() res: any,
    @Session() session: Record<string, any>
  ) { // Using @Session() decorator
    let casa: any = {};
    if (session?.user?.username) {
      try {
        casa = await this.casaService.buscarUnoPorUsername(session.user.username);
      } catch (e) {
        console.error('No se encontro usuario');
      }
    }
    res.render('sesion', {
      casa,
    });
  }
}