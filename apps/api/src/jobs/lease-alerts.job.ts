import { supabase } from '../utils/supabase';

export async function checkExpiringLeases() {
  const { data: leases, error } = await supabase
    .from('v_expiring_leases')
    .select('*');

  if (error || !leases) return;

  for (const lease of leases) {
    const days = Math.floor(lease.days_remaining);

    // 90-day alert
    if (days <= 90 && days > 30 && !lease.alert_90_sent) {
      await sendLeaseAlert(lease, 90);
      await supabase.from('leases').update({ alert_90_sent: true }).eq('id', lease.lease_id);
    }

    // 30-day alert
    if (days <= 30 && !lease.alert_30_sent) {
      await sendLeaseAlert(lease, 30);
      await supabase.from('leases').update({ alert_30_sent: true }).eq('id', lease.lease_id);
    }
  }
}

async function sendLeaseAlert(lease: any, days: number) {
  // Create notification for landlord
  await supabase.from('notifications').insert([
    {
      user_id: lease.owner_id,
      title: `Lease expiring in ${days} days`,
      body: `${lease.tenant_name}'s lease at ${lease.property_name} expires on ${lease.end_date}`,
      type: 'lease_expiry',
      entity_id: lease.lease_id,
      entity_type: 'lease',
    },
    {
      user_id: lease.tenant_id,
      title: `Your lease expires in ${days} days`,
      body: `Your tenancy at ${lease.property_name} expires on ${lease.end_date}. Please contact your landlord.`,
      type: 'lease_expiry',
      entity_id: lease.lease_id,
      entity_type: 'lease',
    }
  ]);
  console.log(`📬 Lease alert sent: ${days} days — ${lease.property_name}`);
}
