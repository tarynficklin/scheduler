// Stripe Checkout sends the customer back to /?donation=success|cancelled[&trip=<id>]
// (see server/controllers/stripeController.js). This reads that once, removes it from
// the address bar, and points the hash router back at the trip the donation came from.
export function consumeDonationResult(location = window.location, history = window.history) {
  const params = new URLSearchParams(location.search);
  const status = params.get('donation');
  if (status !== 'success' && status !== 'cancelled') return null;

  const trip = params.get('trip');
  const hash = trip && /^\d+$/.test(trip) ? `#/trip/${trip}` : location.hash || '#/';
  history.replaceState(null, '', `${location.pathname}${hash}`);
  return status;
}

// Starts a donation: asks the API for a Checkout Session and redirects to Stripe.
// amount is in cents ($5.00 by default, like the old widget).
export async function startDonation(api, { amount = 500, tripId } = {}) {
  const { data } = await api.post('/api/payment', { amount, trip_id: tripId || undefined });
  window.location.assign(data.url);
}
