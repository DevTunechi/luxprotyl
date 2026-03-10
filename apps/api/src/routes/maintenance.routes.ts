import { Router } from 'express';
const router = Router();
router.get('/',             (req, res) => res.json({ message: 'list maintenance' }));
router.post('/',            (req, res) => res.json({ message: 'create request' }));
router.get('/:id',          (req, res) => res.json({ message: `get request ${req.params.id}` }));
router.put('/:id',          (req, res) => res.json({ message: `update request ${req.params.id}` }));
router.post('/:id/resolve', (req, res) => res.json({ message: `resolve ${req.params.id}` }));
export default router;
