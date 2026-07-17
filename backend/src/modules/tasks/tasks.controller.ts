import { Request, Response } from 'express';
import * as tasksService from './tasks.service';

export async function listTasksHandler(req: Request, res: Response) {
  const result = await tasksService.listTasks(req.user!, req.query as any);
  res.status(200).json(result);
}

export async function getTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const task = await tasksService.getTask(req.user!, id);
  res.status(200).json({ data: task });
}

export async function createTaskHandler(req: Request, res: Response) {
  const task = await tasksService.createTask(req.user!, req.body);
  res.status(201).json({ data: task });
}

export async function updateTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const task = await tasksService.updateTask(req.user!, id, req.body);
  res.status(200).json({ data: task });
}

export async function changeTaskStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  const task = await tasksService.changeTaskStatus(req.user!, id, req.body);
  res.status(200).json({ data: task });
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  await tasksService.deleteTask(req.user!, id);
  res.status(204).send();
}
