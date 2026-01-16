const speakeasy = require('speakeasy');

export const secrets: Record<string, string> = {
  gw_admin_bluezone: 'CAE24Q7NPSEOWPOJ',
  GW_admin_GME: 'N2DKHFNAW2RW2OSY',
  gw_admin_energys: 'E3EA7ZM7YQPTKO56',
  gw_admin_Diamond: 'OMK26J73TMLYMHXD',
  gw_admin_qp: 'D2ZN7PMGY6V4EZAS',
  gw_admin_bridgeprojects: '6PA3TGWF6VQJB55X',
  gw_admin_Ascension: 'VX5XE36NV2IIZYBF',
  gw_admin_phf: 'DREIZLFQHIBBZ4DR',
  gw_admin_mla: 'UWQTZGJXXFINCQZH',
  Gw_admin_GOAL: 'MSXEJKPINEFC2O55',
  gw_admin_WaterTight: 'GF4RF6DYA2QBPRPR',
  gw_admin_zenviron: '4DZXXFM4ZJDI3TW6',
  gw_admin_swanhill: 'U7FKA3Q47IAGQPQ6',
  gw_admin_calbah: 'GHX7PMUBMNLYJXFE',

  gw_admin_RA: 'UH3Z3TEI44K337RU',
  gw_admin_Adora: 'PW3XROPEK6QRW2UI',
  gw_admin_qr: '7M6W7UIOEAD2U6FS',
  gw_admin_THCFA: '6LKG5F7BLHUZ3VKT',
  gw_admin_nhn: 'GHX7PMUBMNLYJXFE',


  gw_admin_ksbbl: 'BLOMTOPXKMEM2OJV',
  'e-safe_Admin_ilo': 'BSK5MMIWYSZCCUS4',
  gw_admin_ConektIT: '4MRLPEC5DDWMV4RD',
  gw_admin_Age: 'R5TLLZW5VEVXERTN',
  'rizwan@e-safesystems.com': 'AW4VXUOUPKIFYTJQ',
  gw_admin_exigotech: 'HMOYQDZUXFSJAZYG',



  gw_admin_ctc: 'QEOCMINCJB2NBZEK',
  gw_admin_boomrang: 'BXSWJSD2LSNOQEEI',
  gw_admin_plasmal: '2UCBFUN7K6U2WRQR',
  gw_admin_rdah: 'OTTLH3IYBCQHIKAY',
  gw_admin_K39: 'CSZ7CBYL2JKTYMLE',
  'e-safe_admin_fairdeal': 'RQ6PHNQI5233MUTF',
  'e-safe_Admin_UFU': 'KQ4KJQTFOV5LMXU7',
  gw_admin_qit: 'JBZOD3K2OPXTOSQM',
  gw_admin_powerearth: 'TWNQ2PUG7ITAFWPV',
  'e-safe_Admin_Bathurst': 'MAEH3ZBTVAJVJD7X',
  'e-safe_Admin_Rosebank': 'ECSGEUE4QQPCGXMK',






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
