import { Router } from 'express';
const router = Router();
router.get('/',       (req, res) => res.json({ message: 'list properties' }));
router.post('/',      (req, res) => res.json({ message: 'create property' }));
router.get('/:id',    (req, res) => res.json({ message: `get property ${req.params.id}` }));
router.put('/:id',    (req, res) => res.json({ message: `update property ${req.params.id}` }));
router.delete('/:id', (req, res) => res.json({ message: `delete property ${req.params.id}` }));
export default router;
