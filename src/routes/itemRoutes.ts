import { Router } from 'express';
import ItemController from '../controllers/ItemController';

const router = Router();

router.post('/', ItemController.createItem);

router.get('/', ItemController.getAllItems);

router.get('/:id', ItemController.getItemById);

router.put('/:id', ItemController.updateItem);

router.delete('/:id', ItemController.deleteItem);

export default router;