import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]; // Remove "Bearer "
    
        return { ...request.user, token };
    }
)