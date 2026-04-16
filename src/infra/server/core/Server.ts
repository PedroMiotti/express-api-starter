import Server from 'express';

const Router = Server.Router;

export type { Application, NextFunction, Response } from 'express';
export { json as BodyParser, Router as RouterType } from 'express';

export { Router, Server };
