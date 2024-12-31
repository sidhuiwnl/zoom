import puppeteer from "puppeteer";
import * as path from "node:path";
import * as fs from "node:fs";


async function getBrowser(){
    const audioPath = path.resolve(__dirname,"../silent-audio.mp3");

    const browser = await puppeteer.launch({
        // executablePath : "/usr/bin/google-chrome-stable",

        headless: false,
        args : [
            "--disable-blink-features=AutomationControlled",
            "--auto-select-desktop-capture-source",
            "--use-fake-ui-for-media-stream",
            "--mute-audio",
            `--use-file-for-fake-audio-capture=${audioPath}`,
            "--window-position=-32000,-32000",
            "--start-minimized"
        ]
    })

    let page = await browser.newPage();
    await page.setViewport({
        width: 1280, height: 800
    })
    return page
}

async function getMeet(){
    const webscriptCode = fs.readFileSync("../spawner/dist/script.js","utf-8")
    const browser = await getBrowser();
    console.log("browser is present");
    await browser.goto("https://meet.google.com/cgn-iibp-hog")
    console.log("browser is rendered");
    await browser.locator('span ::-p-text(Got it)').click()
    console.log("the popup is clicked");
    await browser
        .locator("input[placeholder='Your name']")
        .fill("Meet Bot")
    await browser
        .locator("span ::-p-text('Ask to join')").click()

    const elementSelector = "div[jscontroller=\"yEvoid\"][jsname=\"NeC6gb\"]";

    try {
        await browser.waitForSelector(elementSelector, { timeout: 10000,visible : true });

        const buttonSelector = "button[aria-label=\"Leave call\"]"

        console.log("Element found!");
        await browser.evaluate(`${webscriptCode}webScript();`);
    }catch (error){
        console.log("Element not found within timeout. Skipping script execution.");
    }
}



getMeet()
