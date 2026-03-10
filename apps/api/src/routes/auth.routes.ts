import { Router } from 'express';
const router = Router();
router.post('/register', (req, res) => { res.json({ message: 'register' }); });
router.post('/login',    (req, res) => { res.json({ message: 'login' }); });
router.post('/logout',   (req, res) => { res.json({ message: 'logout' }); });
router.get('/me',        (req, res) => { res.json({ message: 'me' }); });
export default router;
