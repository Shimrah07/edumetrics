/**
 * Storage and resolution utilities for EduMetrics institution memberships and sessions.
 */

export const ACTIVE_INSTITUTION_KEY = 'edumetrics_active_institution_id';

const getStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage;
  }
  return null;
};

/**
 * Read the stored active institution ID from localStorage.
 * @returns {string | null}
 */
export const getStoredInstitutionId = () => {
  const storage = getStorage();
  return storage ? storage.getItem(ACTIVE_INSTITUTION_KEY) : null;
};

/**
 * Persist the active institution ID to localStorage.
 * @param {string | null} id
 */
export const setStoredInstitutionId = (id) => {
  const storage = getStorage();
  if (storage) {
    if (id) {
      storage.setItem(ACTIVE_INSTITUTION_KEY, String(id));
    } else {
      storage.removeItem(ACTIVE_INSTITUTION_KEY);
    }
  }
};

/**
 * Remove the stored active institution ID from localStorage.
 */
export const removeStoredInstitutionId = () => {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(ACTIVE_INSTITUTION_KEY);
  }
};

/**
 * Determine the active institution membership according to system rules:
 * - Filter strictly for active memberships (is_active === true).
 * - If no active memberships exist -> null.
 * - If preferred ID matches an active membership -> select it.
 * - Otherwise -> select the first active membership.
 *
 * @param {Array} [memberships=[]] - List of InstitutionMembershipSummary objects
 * @param {string | null} [preferredId=null] - Optional preferred institution ID
 * @returns {Object | null} Resolved membership object or null
 */
export const resolveActiveInstitution = (memberships = [], preferredId = null) => {
  const activeMemberships = (memberships || []).filter(
    (m) => m && m.is_active === true,
  );

  if (activeMemberships.length === 0) {
    return null;
  }

  if (preferredId) {
    const matched = activeMemberships.find(
      (m) => String(m.institution_id) === String(preferredId),
    );
    if (matched) {
      return matched;
    }
  }

  return activeMemberships[0];
};
