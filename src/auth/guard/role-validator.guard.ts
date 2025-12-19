import { Role } from '@prisma/client';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleValidatorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) return false;

    if (user.role === Role.ADMIN) return true;

    const targetUserId = Number(req.params.id);
    return user.sub === targetUserId;
  }
}
