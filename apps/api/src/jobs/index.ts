import cron from 'node-cron';
import { checkExpiringLeases } from './lease-alerts.job';
import { syncAirbnbCalendars } from './airbnb-sync.job';
import { markOverduePayments } from './overdue-payments.job';

export function startCronJobs() {
  // Every day at 8am — check expiring leases
  cron.schedule('0 8 * * *', () => {
    console.log('⏰ Running: lease expiry check');
    checkExpiringLeases();
  });

  // Every 4 hours — sync Airbnb iCal calendars
  cron.schedule('0 */4 * * *', () => {
    console.log('🔄 Running: Airbnb calendar sync');
    syncAirbnbCalendars();
  });

  // Every day at 9am — mark overdue payments
  cron.schedule('0 9 * * *', () => {
    console.log('⚠️  Running: overdue payment check');
    markOverduePayments();
  });

  console.log('✅ Cron jobs started');
}
