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

const envName: EnvName = (process.env.ENV ?? 'live04') as EnvName;
const env = environments[envName];

const logFile = `${envName}_dashboard_log.txt`;
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

            /* -------------------------------------------------------------
               TIME FORMATTER
            ------------------------------------------------------------- */
            function formatTime(ms: number): string {
                const seconds = ms / 1000;
                if (seconds < 60) return `${seconds.toFixed(2)}s`;
                const mins = Math.floor(seconds / 60);
                const secs = (seconds % 60).toFixed(2);
                return `${mins}m ${secs}s`;
            }

            /* -------------------------------------------------------------
               FIRST DASHBOARD – PAGE STABILITY ONLY (NO WIDGET CHECK)
            ------------------------------------------------------------- */
            async function openFirstDashboard(page: any) {
                const firstDash = dashboards[0];

                // Click first dashboard tab
                await page.click(firstDash.tabSelector);

                // Dashboard container visible
                await page.waitForSelector(
                    '//div[contains(@class,"dashboard") or contains(@id,"dashboard")]',
                    { state: 'visible', timeout: 180_000 }
                );

                // Wait for loaders to disappear
                const loaders = [
                    '//div[contains(@class,"spinner")]',
                    '//div[contains(@class,"loading")]',
                    '//div[contains(@class,"skeleton")]',
                    '//div[contains(@class,"overlay")]'
                ];

                for (const loader of loaders) {
                    await page.waitForSelector(loader, {
                        state: 'hidden',
                        timeout: 180_000
                    }).catch(() => {});
                }

                // Network idle (all API calls finished)
                await page.waitForLoadState('networkidle', {
                    timeout: 180_000
                });

                // Small safety buffer
                await page.waitForTimeout(1000);
            }

            /* -------------------------------------------------------------
               SET DATE RANGE AFTER FIRST DASHBOARD PAGE IS READY
            ------------------------------------------------------------- */
            async function setupSearchForLatestMonth(page: any) {

                // Ensure first dashboard page is fully stable
                await openFirstDashboard(page);

                // Open dropdown
                const dropdown = '//a[@class="nav-link dropdown-toggle"]';
                await page.waitForSelector(dropdown, {
                    state: 'visible',
                    timeout: 30_000
                });
                await page.click(dropdown);

                // Click All Dashboard
                const allDashboardItem =
                    '//a[.//i[contains(@class,"lnr-laptop")] and contains(.,"All Dashboard")]';

                await page.waitForSelector(allDashboardItem, {
                    state: 'visible',
                    timeout: 30_000
                });
                await page.click(allDashboardItem);

                // Open date filter
                const searchIcon = '//i[contains(@class,"lnr-magnifier")]';
                await page.waitForSelector(searchIcon, {
                    state: 'visible',
                    timeout: 20_000
                });
                await page.click(searchIcon);

                // Date inputs
                const startInput = page.locator('(//input[@class="form-control"])[1]');
                const endInput = page.locator('(//input[@class="form-control"])[2]');

                await startInput.waitFor({ state: 'visible', timeout: 20_000 });
                await endInput.waitFor({ state: 'visible', timeout: 20_000 });

                const today = new Date();
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);

                // Start date
                await startInput.click();
                await page.click('//button[contains(@class,"react-datepicker__navigation--previous")]');
                await page.click(
                    `//div[contains(@class,"react-datepicker__day") and not(contains(@class,"outside-month")) and text()="${last30Days.getDate()}"]`
                );

                // End date
                await endInput.click();
                await page.click(
                    `//div[contains(@class,"react-datepicker__day") and not(contains(@class,"outside-month")) and text()="${today.getDate()}"]`
                );

                // Apply
                await page.click('//button[@class="btn btn-success w-100"]');
            }

            /* -------------------------------------------------------------
               LOAD DASHBOARD & MEASURE WIDGET TIME
            ------------------------------------------------------------- */
            async function loadDashboard(
                page: any,
                name: string,
                tabSelector: string,
                widgets: any[],
                report: string
            ) {
                const longestName = Math.max(...widgets.map(w => w.name.length));
                const nameColWidth = Math.max(longestName + 2, 40);
                const divider = "-".repeat(nameColWidth + 32);

                report += `\n${name}\n`;
                report += `${divider}\n`;
                report += `| ${"Widget Name".padEnd(nameColWidth)} | Load Time |\n`;
                report += `${divider}\n`;

                await page.click(tabSelector);

                const dashboardStart = Date.now();
                const WIDGET_TIMEOUT = 180_000;

                for (const widget of widgets) {
                    const widgetStart = Date.now();

                    try {
                        await page.waitForSelector(widget.selector, {
                            state: 'visible',
                            timeout: WIDGET_TIMEOUT
                        });

                        const elapsed = Date.now() - widgetStart;
                        report += `| ${widget.name.padEnd(nameColWidth)} | ${formatTime(elapsed)} |\n`;
                    } catch {
                        const waited = Date.now() - widgetStart;
                        report += `| ${widget.name.padEnd(nameColWidth)} | Still Loading after ${formatTime(waited)} |\n`;
                    }
                }

                const totalTime = Date.now() - dashboardStart;
                report += `${divider}\n`;
                report += `${name} Total Load Time: ${formatTime(totalTime)}\n\n`;

                return report;
            }

            /* -------------------------------------------------------------
               TEST EXECUTION
            ------------------------------------------------------------- */
            try {
                const loginPage = new LoginPage(page);

                await page.goto(env.url);
                await loginPage.login(account.username, account.password);

                if (account.requiresAuth) {
                    const otpInput = page.locator('//input[@id="code"]');
                    await otpInput.waitFor({ state: 'visible', timeout: 10_000 });
                    await otpInput.fill(generateOTP(account.username));
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
