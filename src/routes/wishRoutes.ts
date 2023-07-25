import { Router } from 'express';
import * as wishController from '../controllers/wishController';

const router = Router();


router.get('/:wishId', wishController.getWish);
router.patch('/:wishId', wishController.editWish);
router.delete('/:wishId', wishController.deleteWish);

export default router;