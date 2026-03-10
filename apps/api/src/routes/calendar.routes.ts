import { Router } from 'express';
const router = Router();
router.get('/:propertyId',        (req, res) => res.json({ message: `calendar for ${req.params.propertyId}` }));
router.post('/sync/:propertyId',  (req, res) => res.json({ message: `sync airbnb for ${req.params.propertyId}` }));
router.post('/block',             (req, res) => res.json({ message: 'create block' }));
router.delete('/block/:id',       (req, res) => res.json({ message: `delete block ${req.params.id}` }));
export default router;
