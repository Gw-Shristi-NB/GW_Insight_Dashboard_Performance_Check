const speakeasy = require('speakeasy');

export const secrets: Record<string, string> = {
  gw_admin_bluezone: 'CAE24Q7NPSEOWPOJ',

  gw_admin_RA: 'UH3Z3TEI44K337RU',
  gw_admin_Adora: 'PW3XROPEK6QRW2UI',
  gw_admin_qr: '7M6W7UIOEAD2U6FS',
  gw_admin_THCFA: '6LKG5F7BLHUZ3VKT',
  gw_admin_nhn: 'GHX7PMUBMNLYJXFE',

};

export function generateOTP(secretName: string): string {
  const secret = secrets[secretName];

    // console.log("DEBUG SECRETS KEYS:", Object.keys(secrets));

  if (!secret) {
    throw new Error(`OTP secret not found for: ${secretName}`);
  }

  return speakeasy.totp({
    secret,
    encoding: 'base32'
  });

}
