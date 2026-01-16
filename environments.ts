// environments.ts

export type Account = {
  username: string;
  password: string;
  requiresAuth?: boolean; // optional: only true for accounts needing storageState
};

export type EnvName = 'live01' | 'live02' | 'live03' | 'live04' | 'live05'|'live06';

export const environments: Record<EnvName, { url: string; accounts: Account[] }> = {
  live01: {
    url: 'https://live01.guardware.com.au/ss4/webadmin/login',
    accounts: [
      // { username: 'shristi.d@guardware.com.au', password: 'Password@1234' }, 
    ],
  },
  live02: {
    url: 'https://live02.guardware.com.au/ss4/webadmin/login',
    accounts: [
      { username: 'gw_admin_sprojects', password: 'In$1ghtSP!Q@W', requiresAuth: false },
      { username: "gw_admin_bluezone", password: "1hb_amgJ4G!", requiresAuth: true },
      { username: "GW_admin_GME", password: "7bsUkzn$ GME", requiresAuth: true },
      { username: "gw_admin_energys", password: "kkdkJg7_", requiresAuth: true },
      { username: "gw_admin_Diamond", password: "P@ssw0rdDIAMOND", requiresAuth: true },
      { username: "gw_admin_qp", password: "P@ssw0rdQUALITY", requiresAuth: true },
      { username: "gw_admin_bridgeprojects", password: "In$1ghtBP!Q@W", requiresAuth: true },
      { username: "gw_admin_Ascension", password: "P@ssw0rdASCENSION", requiresAuth: true },
      { username: "gw_admin_phf", password: "P@ssw0rd_phf", requiresAuth: true },
      { username: "gw_admin_mla", password: "0rztwpT#", requiresAuth: true },
      { username: "Gw_admin_GOAL", password: "Pr0t3ctG0@L", requiresAuth: true },
      { username: "gw_admin_WaterTight", password: "P@ssw0rdWATERTIGHT", requiresAuth: true },
      { username: "gw_admin_zenviron", password: "P@ssw0rdZENVIRON", requiresAuth: true },
      { username: "gw_admin_swanhill", password: "xmt3xxC@", requiresAuth: true },
      { username: "gw_admin_calbah", password: "In$1ghtCBH!Q@W", requiresAuth: false },
    ],
  },
  live03: {
    url: 'https://live03.guardware.com.au/ss4/webadmin/login',
    accounts: [

      // { username: 'gw_admin_qr', password: 'In$1ghtQR!Q@W', requiresAuth: true },
      // { username: 'gw_admin_nhn', password: 'In$1ghtNHN!Q@W', requiresAuth: true },
      // { username: 'gw_admin_THCFA', password: 'In$1ghtTHCFA!Q@W', requiresAuth: true },
      // { username: 'gw_admin_RA', password: 'In$1ghtRA!Q@W#E', requiresAuth: true },
      // { username: 'gw_admin_Adora', password: 'In$1ghtADORA!Q@W#E', requiresAuth: true },

    ],
  },

  live04: {
    url: 'https://live04.guardware.com.au/ss4/webadmin/login',
    accounts: [

      // { username: 'gw_admin_ksbbl', password: 'In$1ghtKSBBL!Q@W', requiresAuth: true },
      // { username: 'gw_admin_ConektIT', password: 'In$1ghtCIT!Q@W#E', requiresAuth: true },
      // { username: 'rizwan@e-safesystems.com', password: 'fs', requiresAuth: true },
      // { username: 'gw_admin_Age', password: 'In$1ghtWYZE!Q@W#E', requiresAuth: true },
      // { username: 'gw_admin_exigotech', password: 'In$1ghtEXI!Q@W#E', requiresAuth: true },
      // { username: 'e-safe_Admin_ilo', password: 'nag6wRw!', requiresAuth: true },

    ],
  },

  live05: {
    url: 'https://live05.guardware.com.au/ss4/webadmin/login',
    accounts: [

      // { username: 'e-safe_Admin_Bathurst', password: 'In$1ghtBATH!Q@W', requiresAuth: true },
      // { username: 'gw_admin_ctc', password: 'In$1ghtCTC!Q@W', requiresAuth: true },
      // { username: 'gw_admin_boomrang', password: 'In$1ghtBR!Q@W', requiresAuth: true },
      // { username: 'gw_admin_powerearth', password: 'In$1ghtPE!Q@W#E', requiresAuth: true },
      // { username: 'gw_admin_rdah', password: 'In$1ghtRH!Q@W', requiresAuth: true },
      // { username: 'e-safe_admin_fairdeal', password: 'In$1ghtFD!Q@W', requiresAuth: true },
      // { username: 'e-safe_Admin_UFU', password: 'In$1ghtUFU!Q@W', requiresAuth: true },
      // { username: 'gw_admin_qit', password: 'In$1ghtQIT!Q@W#E', requiresAuth: true },
      // { username: 'gw_admin_K39', password: 'In$1ghtK39!Q@W', requiresAuth: true },
      // { username: 'gw_admin_plasmal', password: 'In$1ghtPL!Q@W', requiresAuth: true },
      // { username: 'e-safe_Admin_Rosebank', password: 'In$1ghtROSE!Q@W', requiresAuth: true },

    ],
  },

  live06: {
    url: 'https://live06.guardware.com.au/ss4/webadmin/login',
    accounts: [

      // { username: 'GW_admin_TribeTech', password: 'In$1ghtTT!Q@W#E', requiresAuth: false },
     
    ],
  },

} as const;
