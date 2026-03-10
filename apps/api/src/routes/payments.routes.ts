import { Router } from 'express';
const router = Router();
router.get('/',             (req, res) => res.json({ message: 'list payments' }));
router.post('/',            (req, res) => res.json({ message: 'create payment' }));
router.get('/:id',          (req, res) => res.json({ message: `get payment ${req.params.id}` }));
router.post('/:id/verify',  (req, res) => res.json({ message: `verify payment ${req.params.id}` }));
router.post('/webhook',     (req, res) => res.json({ message: 'paystack webhook' }));
export default router;
