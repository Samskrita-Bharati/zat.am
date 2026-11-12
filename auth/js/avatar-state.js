/**
 * Display-state resolver shared by Zat.am profile and navbar.
 * No Firebase/Cloudinary dependencies; handles accounts created before
 * avatarSource/customPhotoURL existed, without rewriting their data.
 */
export function safePhotoURL(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export function cloudinaryPhotoURL(value) {
  const url = safePhotoURL(value);
  if (!url) return '';
  return new URL(url).hostname === 'res.cloudinary.com' ? url : '';
}

export function resolveAvatarState(user, profile = {}) {
  const data = profile || {};
  const googleProvider = user?.providerData?.find(
    (provider) => provider?.providerId === 'google.com',
  );
  // Provider-specific data is separate from Firebase Auth's editable photoURL.
  // Retain a previously saved provider URL as a fallback if Firebase's provider
  // object temporarily lacks a photo.
  const googlePhotoURL = googleProvider
    ? safePhotoURL(googleProvider.photoURL) || safePhotoURL(data.googlePhotoURL)
    : '';

  // Backward compatibility with V2: its custom photo was kept only in
  // profile.photoURL and user.photoURL. Preserve that image on first V3 use.
  const customPhotoURL = cloudinaryPhotoURL(data.customPhotoURL)
    || cloudinaryPhotoURL(data.photoURL)
    || cloudinaryPhotoURL(user?.photoURL);

  const storedSource = ['custom', 'google', 'default'].includes(data.avatarSource)
    ? data.avatarSource : '';
  const legacyPhoto = safePhotoURL(data.photoURL) || safePhotoURL(user?.photoURL);
  let source;
  let photoURL;

  if (storedSource === 'default') {
    source = 'default';
    photoURL = '';
  } else if (storedSource === 'custom' && customPhotoURL) {
    source = 'custom';
    photoURL = customPhotoURL;
  } else if (storedSource === 'google' && googlePhotoURL) {
    source = 'google';
    photoURL = googlePhotoURL;
  } else if (cloudinaryPhotoURL(legacyPhoto)) {
    source = 'custom';
    photoURL = cloudinaryPhotoURL(legacyPhoto);
  } else if (googlePhotoURL && (legacyPhoto === googlePhotoURL || !legacyPhoto)) {
    source = 'google';
    photoURL = googlePhotoURL;
  } else if (legacyPhoto) {
    // Preserve a non-Cloudinary picture from older accounts.
    source = 'legacy';
    photoURL = legacyPhoto;
  } else if (googlePhotoURL) {
    source = 'google';
    photoURL = googlePhotoURL;
  } else {
    source = 'default';
    photoURL = '';
  }

  return { source, photoURL, customPhotoURL, googlePhotoURL };
}
