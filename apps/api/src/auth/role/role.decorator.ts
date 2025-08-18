import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
