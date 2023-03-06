function generateRandomString(length: number) {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz132456789';
  const randomString = Array(length)
    .fill('')
    .map(() => possibleChars.charAt(Math.floor(Math.random() * possibleChars.length)))
    .join('');
  return randomString;
}

export default generateRandomString;
