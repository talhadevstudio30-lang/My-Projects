export const encryptToken = (token) => {
  try {
    const encoded = btoa(token);
    return `v_${encoded.split('').reverse().join('')}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptToken = (encryptedToken) => {
  try {
    const encoded = encryptedToken.startsWith('v_') ? encryptedToken.slice(2) : encryptedToken;
    const reversed = encoded.split('').reverse().join('');
    return atob(reversed);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

export const getProjectUrl = (project) => {
  return project.targets?.production?.alias?.[0] || null;
};
