import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/modules/auth/roles.enum';

export const Roles = (role: Role) => SetMetadata('role', role);
