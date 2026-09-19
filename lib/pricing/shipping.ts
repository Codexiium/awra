// Single source of truth for the shipping policy's two numbers, imported by
// the client-side display copy in app/store/useCartStore.ts. The actual
// charged amount is computed server-side inside the place_order() Postgres
// function (supabase/migrations/20260919043808_*.sql), which can't import
// this file — keep the literals there in sync with these if the policy ever
// changes.
export const FREE_SHIPPING_THRESHOLD_INR = 250;
export const FLAT_SHIPPING_COST_INR = 25;
