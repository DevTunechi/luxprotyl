import { Router } from 'express';
const router = Router();
router.get('/',    (req, res) => res.json({ message: 'list leases' }));
router.post('/',   (req, res) => res.json({ message: 'create lease' }));
router.get('/:id', (req, res) => res.json({ message: `get lease ${req.params.id}` }));
router.put('/:id', (req, res) => res.json({ message: `update lease ${req.params.id}` }));
export default router;
