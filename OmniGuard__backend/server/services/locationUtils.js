/**
 * OmniGuard Backend — Location Utils
 * Provides geospatial utility functions.
 */

/**
 * Calculates the distance between two coordinates in kilometers.
 * Uses the Haversine Formula.
 * 
 * @param {{lat: number, lng: number}} coord1 
 * @param {{lat: number, lng: number}} coord2 
 * @returns {number|null} Distance in km, or null if coordinates are invalid.
 */
function calculateDistance(coord1, coord2) {
  if (!coord1 || !coord2) return null;
  if (coord1.lat == null || coord1.lng == null || coord2.lat == null || coord2.lng == null) return null;

  const R = 6371; // Radius of the Earth in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const lat1 = coord1.lat * (Math.PI / 180);
  const lat2 = coord2.lat * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates whether the distance between two coordinates is within the given radius.
 * 
 * @param {{lat: number, lng: number}} coord1 
 * @param {{lat: number, lng: number}} coord2 
 * @param {number} [radiusKm=5] - Radius in kilometers
 * @returns {boolean} True if within range, false otherwise.
 */
function isWithinRange(coord1, coord2, radiusKm = 5) {
  const distance = calculateDistance(coord1, coord2);
  if (distance === null) return false;
  return distance <= radiusKm;
}

module.exports = { calculateDistance, isWithinRange };
