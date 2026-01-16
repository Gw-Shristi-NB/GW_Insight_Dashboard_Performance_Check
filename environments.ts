// environments.ts

export type Account = {
  username: string;
  password: string;
  requiresAuth?: boolean; // optional: only true for accounts needing storageState
};

export type EnvName = 'live01' | 'live02' | 'live03'| 'live06';

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

      { username: 'gw_admin_qr', password: 'In$1ghtQR!Q@W', requiresAuth: true },
      { username: 'gw_admin_nhn', password: 'In$1ghtNHN!Q@W', requiresAuth: true },
      { username: 'gw_admin_THCFA', password: 'In$1ghtTHCFA!Q@W', requiresAuth: true },
      { username: 'gw_admin_RA', password: 'In$1ghtRA!Q@W#E', requiresAuth: true },
      { username: 'gw_admin_Adora', password: 'In$1ghtADORA!Q@W#E', requiresAuth: true },

    ],
  },

  live06: {
    url: 'https://live03.guardware.com.au/ss4/webadmin/login',
    accounts: [

      // { username: 'GW_admin_TribeTech', password: '', requiresAuth: false },

    ],
  },


} as const;
