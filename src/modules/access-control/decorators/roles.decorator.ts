import { SetMetadata } from '@nestjs/common';

import { ROLES_DECORATOR_KEY } from '../constants/roles.constants';

export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_DECORATOR_KEY, roles);
