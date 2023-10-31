import { Router } from 'express';
import InvoiceController from '../controllers/InvoiceController';

const router = Router();

router.post('/', InvoiceController.createInvoice);

router.get('/', InvoiceController.getAllInvoices);

router.get('/:id', InvoiceController.getInvoiceById);

router.put('/:id', InvoiceController.updateInvoice);

router.delete('/:id', InvoiceController.deleteInvoice);

export default router;
