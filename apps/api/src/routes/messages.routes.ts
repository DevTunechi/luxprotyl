import { Router } from 'express';
const router = Router();
router.get('/',    (req, res) => res.json({ message: 'list messages' }));
router.post('/',   (req, res) => res.json({ message: 'send message' }));
router.get('/:id', (req, res) => res.json({ message: `get message ${req.params.id}` }));
export default router;
