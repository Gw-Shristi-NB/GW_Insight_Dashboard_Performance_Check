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
import { generateOTP } from './secrets';

// Pick environment dynamically
const envName: EnvName = (process.env.ENV ?? 'live03') as EnvName;
const env = environments[envName];

// Log file for this environment
const logFile = `${envName}_dashboard_log.txt`;

// Remove previous logs
if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

test.describe(`Dashboard load tests for ${envName}`, () => {

    for (const account of env.accounts) {

        test(`Dashboard performance for user ${account.username}`, async ({ page }) => {

            test.setTimeout(1_000_000);

            let report = `\n\n===============================================================\n`;
            report += ` Dashboard Performance - ${envName} - USER: ${account.username}\n`;
            report += `===============================================================\n`;

            const dashboards = [
                { name: "Risk Summary Dashboard", tabSelector: "//a[@href='#/tab=SPEmailRisk']", widgets: Risk_Summary_Dashboard_Widgets },
                { name: "General Dashboard", tabSelector: "//a[@href='#/tab=General']", widgets: General_Dashboard_Widgets },
                { name: "Risk Dashboard", tabSelector: "//a[@href='#/tab=Risks']", widgets: Risk_Dashboard_Widgets },
                { name: "SharePoint Dashboard", tabSelector: "//a[@href='#/tab=SharePoint']", widgets: Sharepoint_Dashboard_Widgets }
            ];

            // ---------------------------------------------------------------------
            // FUNCTION: OPEN FIRST DASHBOARD (UI-BASED LOAD, NO WIDGET LOCATORS)
            // ---------------------------------------------------------------------
            async function openFirstDashboard(page: any) {
                const firstDash = dashboards[0];

                await page.click(firstDash.tabSelector);

                await page.waitForSelector(
                    '//div[contains(@class,"dashboard") or contains(@id,"dashboard")]',
                    { state: 'visible', timeout: 30_000 }
                );

                const loaders = [
                    '//div[contains(@class,"spinner")]',
                    '//div[contains(@class,"loading")]',
                    '//div[contains(@class,"skeleton")]'
                ];

                for (const loader of loaders) {
                    try {
                        await page.waitForSelector(loader, {
                            state: 'hidden',
                            timeout: 30_000
                        });
                    } catch {
                        // Loader not present → continue safely
                    }
                }

                await page.waitForLoadState('networkidle');
            }

            // ---------------------------------------------------------------------
            // FUNCTION: APPLY LAST 30 DAYS FILTER
            // ---------------------------------------------------------------------
            async function setupSearchForLatestMonth(page: any) {

                await openFirstDashboard(page);

                // 1️⃣ Open dropdown
                await page.click('//a[@class="nav-link dropdown-toggle"]', { force: true });

                // 2️⃣ Wait until "All Dashboard" is actually visible (TypeScript-safe)
                const allDashboardItem =
                    '//a[.//i[contains(@class,"lnr-laptop")] and contains(.,"All Dashboard")]';

                await page.waitForFunction(
                    (selector: string) => {
                        const el = document.evaluate(
                            selector,
                            document,
                            null,
                            XPathResult.FIRST_ORDERED_NODE_TYPE,
                            null
                        ).singleNodeValue as HTMLElement | null;
                        return el?.offsetParent !== null; // ensures element is visible
                    },
                    allDashboardItem,
                    { timeout: 5000 }
                );

                // 3️⃣ Click "All Dashboard"
                await page.click(allDashboardItem, { force: true });

                // 4️⃣ Open search filter
                await page.click('//i[@class="lnr lnr-magnifier text-success font-weight-bolder"]');

                const startInput = page.locator('(//input[@class="form-control"])[1]');
                const endInput = page.locator('(//input[@class="form-control"])[2]');

                await startInput.waitFor({ state: 'visible', timeout: 10_000 });
                await endInput.waitFor({ state: 'visible', timeout: 10_000 });

                const today = new Date();
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);

                const startDay = last30Days.getDate();
                const endDay = today.getDate();

                await startInput.click();
                await page.click('//button[contains(@class,"react-datepicker__navigation--previous")]');
                await page.click(
                    `//div[contains(@class,"react-datepicker__day") and not(contains(@class,"outside-month")) and text()="${startDay}"]`
                );

                await endInput.click();
                await page.click(
                    `//div[contains(@class,"react-datepicker__day") and not(contains(@class,"outside-month")) and text()="${endDay}"]`
                );

                const searchBtn = page.locator('//button[@class="btn btn-success w-100"]');
                await searchBtn.waitFor({ state: 'visible', timeout: 5000 });
                await searchBtn.click();
            }

            // ---------------------------------------------------------------------
            // FUNCTION: LOAD DASHBOARD WIDGETS + MEASURE TIME
            // ---------------------------------------------------------------------
            async function loadDashboard(
                page: any,
                name: string,
                tabSelector: string,
                widgets: any[],
                report: string
            ) {

                const longestName = Math.max(...widgets.map(w => w.name.length));
                const nameColWidth = Math.max(longestName + 2, 40);
                const divider = "-".repeat(nameColWidth + 26);

                report += `\n${name}\n`;
                report += `${divider}\n`;
                report += `| ${"Widget Name".padEnd(nameColWidth)} | Load Time (seconds) |\n`;
                report += `${divider}\n`;

                await page.click(tabSelector);

                const dashboardStart = Date.now();
                const MAX_TIME = 300_000;

                for (const widget of widgets) {
                    const widgetStart = Date.now();

                    try {
                        const remainingTime = MAX_TIME - (Date.now() - dashboardStart);
                        if (remainingTime <= 0) break;

                        await page.waitForSelector(widget.selector, {
                            state: 'visible',
                            timeout: remainingTime
                        });

                        const loadTime = ((Date.now() - widgetStart) / 1000)
                            .toFixed(2)
                            .padStart(6);

                        report += `| ${widget.name.padEnd(nameColWidth)} | ${loadTime} |\n`;

                    } catch {
                        report += `| ${widget.name.padEnd(nameColWidth)} |   TIMEOUT   |\n`;
                        break;
                    }
                }

                const totalTime = ((Date.now() - dashboardStart) / 1000).toFixed(2);
                report += `${divider}\n`;
                report += `${name} Total Load Time: ${totalTime} seconds\n\n`;

                return report;
            }

            // ---------------------------------------------------------------------
            // MAIN EXECUTION
            // ---------------------------------------------------------------------
            try {
                const loginPage = new LoginPage(page);

                await page.goto(env.url);
                await loginPage.login(account.username, account.password);

                if (account.requiresAuth) {
                    const otpInput = page.locator('//input[@id="code"]');
                    await otpInput.waitFor({ state: 'visible', timeout: 10_000 });

                    const otp = generateOTP(account.username);
                    await otpInput.fill(otp);

                    await page.click('//button[@type="submit"]');
                }

                await setupSearchForLatestMonth(page);

                for (const dash of dashboards) {
                    report = await loadDashboard(
                        page,
                        dash.name,
                        dash.tabSelector,
                        dash.widgets,
                        report
                    );
                }

            } catch (error: any) {
                report += `\n❌ ERROR FOR USER ${account.username}: ${error.message}\n`;
            }

            fs.appendFileSync(logFile, report);
            await page.close();
        });
    }
});
