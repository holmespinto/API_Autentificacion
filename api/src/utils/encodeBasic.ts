function encodeBasic(username: string, password: string) {
  return Buffer.from(`${username}:${password}`).toString('base64');
}

export default encodeBasic;
