import { supabase } from '../utils/supabase';

export async function syncAirbnbCalendars() {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, airbnb_ical_url')
    .eq('mode', 'short_stay')
    .not('airbnb_ical_url', 'is', null);

  if (!properties) return;

  for (const property of properties) {
    try {
      // Fetch iCal from Airbnb and parse blocks
      // Full implementation: parse ical events → upsert calendar_blocks
      console.log(`🔄 Syncing Airbnb calendar for property ${property.id}`);
      await supabase
        .from('properties')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', property.id);
    } catch (err) {
      console.error(`Airbnb sync error for ${property.id}:`, err);
    }
  }
}
