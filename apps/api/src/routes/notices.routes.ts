import { Router } from 'express';
const router = Router();
router.get('/',    (req, res) => res.json({ message: 'list notices' }));
router.post('/',   (req, res) => res.json({ message: 'create notice' }));
router.get('/:id', (req, res) => res.json({ message: `get notice ${req.params.id}` }));
export default router;
