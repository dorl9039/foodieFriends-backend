import { Router } from 'express';
import * as visitController from '../controllers/visitController';

const router = Router();


router.get('/', visitController.getAllVisits);

export default router;