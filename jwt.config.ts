import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: 'lkdjkl3jlknlno08u0',
    signOptions: { expiresIn: '24h' },
  }),
);
