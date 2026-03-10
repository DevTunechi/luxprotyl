import { Router } from 'express';
const router = Router();
router.get('/',          (req, res) => res.json({ message: 'list notifications' }));
router.put('/:id/read',  (req, res) => res.json({ message: `mark read ${req.params.id}` }));
router.put('/read-all',  (req, res) => res.json({ message: 'mark all read' }));
export default router;
