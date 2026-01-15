// environments.ts

export type Account = {
  username: string;
  password: string;
  requiresAuth?: boolean; // optional: only true for accounts needing storageState
};

export type EnvName = 'live01' | 'live02' | 'live03';

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
      // { username: 'gw_admin_sprojects', password: 'In$1ghtSP!Q@W', requiresAuth: false },
      // { username: "gw_admin_bluezone", password: "1hb_amgJ4G!", requiresAuth: true },


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


} as const;
