/* eslint-disable no-undef */
function buildProfileObject(profile) {
  return {
    id: profile.getId(),
    full_name: profile.getName(),
    given_name: profile.getGivenName(),
    family_name: profile.getFamilyName(),
    image: profile.getImageUrl(),
    email: profile.getEmail(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onSignIn(googleUser) {
  const { id_token } = googleUser.getAuthResponse();
  const profile = googleUser.getBasicProfile();
  const builtProfile = buildProfileObject(profile);

  localStorage.setItem('profile', JSON.stringify(builtProfile));
  localStorage.setItem('id_token', id_token);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    // cleaning localStorage
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');

    // redirect to home
    window.location.href = '/';
  });
}
