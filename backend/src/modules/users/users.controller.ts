import { Request, Response } from 'express';
import * as usersService from './users.service';

export async function listUsersHandler(req: Request, res: Response) {
  const result = await usersService.listUsers(req.query as any);
  res.status(200).json(result);
}

export async function getUserHandler(req: Request, res: Response) {
  const user = await usersService.getUser(Number(req.params.id));
  res.status(200).json({ data: user });
}

export async function updateUserRoleHandler(req: Request, res: Response) {
  const user = await usersService.updateUserRole(Number(req.params.id), req.body);
  res.status(200).json({ data: user });
}

export async function deleteUserHandler(req: Request, res: Response) {
  await usersService.deleteUser(Number(req.params.id));
  res.status(204).send();
}
