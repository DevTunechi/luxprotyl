import { supabase } from '../utils/supabase';

export async function markOverduePayments() {
  const { error } = await supabase
    .from('payments')
    .update({ status: 'overdue' })
    .eq('status', 'pending')
    .lt('due_date', new Date().toISOString().split('T')[0]);

  if (!error) console.log('✅ Overdue payments updated');
}
