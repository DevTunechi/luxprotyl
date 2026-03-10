import { Router } from 'express';
import authRoutes        from './auth.routes';
import propertiesRoutes  from './properties.routes';
import leasesRoutes      from './leases.routes';
import paymentsRoutes    from './payments.routes';
import bookingsRoutes    from './bookings.routes';
import noticesRoutes     from './notices.routes';
import maintenanceRoutes from './maintenance.routes';
import messagesRoutes    from './messages.routes';
import notificationsRoutes from './notifications.routes';
import calendarRoutes    from './calendar.routes';

export const router = Router();

router.use('/auth',          authRoutes);
router.use('/properties',    propertiesRoutes);
router.use('/leases',        leasesRoutes);
router.use('/payments',      paymentsRoutes);
router.use('/bookings',      bookingsRoutes);
router.use('/notices',       noticesRoutes);
router.use('/maintenance',   maintenanceRoutes);
router.use('/messages',      messagesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/calendar',      calendarRoutes);
