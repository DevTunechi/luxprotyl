import { Router } from 'express';
const router = Router();
router.get('/',    (req, res) => res.json({ message: 'list bookings' }));
router.post('/',   (req, res) => res.json({ message: 'create booking' }));
router.get('/:id', (req, res) => res.json({ message: `get booking ${req.params.id}` }));
router.put('/:id', (req, res) => res.json({ message: `update booking ${req.params.id}` }));
export default router;
