import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import fs from 'fs';
import { environments, EnvName } from '../environments';
import {
  Risk_Summary_Dashboard_Widgets,
  General_Dashboard_Widgets,
  Risk_Dashboard_Widgets,
  Sharepoint_Dashboard_Widgets
} from './dashboard-locators';

// Pick environment dynamically
const envName: EnvName = (process.env.ENV ?? 'live01') as EnvName;
const env = environments[envName];


test.describe(`Dashboard load tests for ${envName}`, () => {

  for (const account of env.accounts) {

    test(`Dashboard performance for user ${account.username}`, async ({ page }) => {
      test.setTimeout(300_000);

      const logFile = `${envName}_dashboard_log.txt`;
      let report = `Dashboard Performance Test Results - ${envName} - ${account.username}\n\n`;

      const dashboards = [
        { name: "Risk Summary Dashboard", tabSelector: "//a[@href='#/tab=SPEmailRisk']", widgets: Risk_Summary_Dashboard_Widgets },
        { name: "General Dashboard", tabSelector: "//a[@href='#/tab=General']", widgets: General_Dashboard_Widgets },
        { name: "Risk Dashboard", tabSelector: "//a[@href='#/tab=Risks']", widgets: Risk_Dashboard_Widgets },
        { name: "SharePoint Dashboard", tabSelector: "//a[@href='#/tab=SharePoint']", widgets: Sharepoint_Dashboard_Widgets }
      ];

      async function loadDashboard(page: any, name: any, tabSelector: any, widgets: any) {

        report += `\n${name}\n`;
        report += `---------------------------------------------------------------\n`;
        report += `| Widget Name                                               | Load Time (seconds) |\n`;
        report += `---------------------------------------------------------------\n`;

        await page.click(tabSelector);
        const dashboardStart = Date.now();

        for (const widget of widgets) {
          const start = Date.now();
          await page.waitForSelector(widget.selector, { state: 'visible', timeout: 60_000 });
          const end = Date.now();
          report += `| ${widget.name.padEnd(59)} | ${((end - start) / 1000).toFixed(2)} |\n`;
        }

        report += `${name} Total Load Time: ${((Date.now() - dashboardStart) / 1000).toFixed(2)} seconds\n\n`;
      }

      try {
        const loginPage = new LoginPage(page);
        await page.goto(env.url);
        await loginPage.login(account.username, account.password);

        for (const dash of dashboards) {
          await loadDashboard(page, dash.name, dash.tabSelector, dash.widgets);
        }

      } catch (error: any) {
        report += `\n❌ ERROR OCCURRED: ${error.message}\n`;
      }

      fs.writeFileSync(logFile, report);

      await page.close();    // close current page
    });

  }


});
