import express, { Router, Request, Response } from 'express';
import { appendFile } from 'fs';

const router = Router();

router.get('/' , (req:Request, res: Response) => {
    res.send("hi home");
});

export default router