import { Builder, Browser, By, until, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/chrome'
import * as fs from "node:fs";
import express from 'express';
import cors from 'cors';



const app = express()
app.use(express.json());
app.use(cors())


// async function openZoom(driver  :WebDriver){
//     try {
//         await driver.get("https://us05web.zoom.us/j/4457645279?pwd=rvTwrguDvjFHg6qS4RMjnV3bBXFHTK.1");
//         const launchMeetingButton = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"Launch Meeting")]')),12000);
//         if(launchMeetingButton){
//             await launchMeetingButton.click();
//
//             const joinAtag = await driver.wait(until.elementLocated(By.xpath('//a[contains(text(),"Join from your browser")]')),5000);
//             await joinAtag.click();
//
//             const nameinput = await driver.wait(until.elementLocated(By.xpath('//input[@class="preview-meeting-info-field-input"]')),3000)
//             await nameinput.clear();
//             await nameinput.click();
//             await nameinput.sendKeys("Sidharth");
//
//             const joinButton = await driver.wait(until.elementLocated(By.xpath('//div[contains(text(),"Join")]')),1000);
//             await joinButton.click();
//         }
//     }catch (error) {
//         console.error("WebDriver error:", error);
//     }
// }

// app.post("/getMeetId",async (req,res) =>{
//     const meetId = req.body;
//     console.log(meetId.link);
//     try {
//        if(meetId){
//           await main(meetId.meetId);
//        }
//        res.status(200).json({
//            message  :" Got meet link"
//        })
//     }catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message:"Something went wrong"
//         })
//     }
// })

async function openMeet(driver: WebDriver,id  :string) {

    try {
        await driver.get(id);
    const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
        await popupButton.click()
    const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
        await nameInput.clear();
        await nameInput.click();
        await nameInput.sendKeys('value', "Meeting bot");
        await driver.sleep(1000)
    const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
        buttonInput.click();
    } catch (error) {
        console.error("WebDriver error:", error);
    }
}

async function getDriver() {

    const options = new Options({})

    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--mute-audio");
    options.addArguments("--window-size=1080,720")
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--enable-usermedia-screen-capturing');
    options.addArguments('--auto-select-tab-capture-source-by-title="Meet"')
    options.addArguments('--allow-running-insecure-content');
    options.addArguments("--remote-debugging-port=9222");




    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    return driver;
}



async function startScreenshare(driver: WebDriver) {
    const webscriptCode = fs.readFileSync("../spawner/dist/script.js","utf-8")
    console.log("startScreensharecalled")
    const response = await driver.executeScript(
        `${webscriptCode}webScript();`
    )
    console.log(response)

}

async function whenMeetPage(driver : WebDriver) {

    const element = await driver.wait(until.elementLocated(By.css('div[jscontroller="yEvoid"][jsname="NeC6gb"]')),10000);


    if(element){

        console.log("element appeared",element);
        await startScreenshare(driver);

        console.log("Leave call button found. Waiting for click...");

        await driver.executeScript(`
            const button = document.querySelector('button[aria-label="Leave call"]');
            if (button) {
                button.addEventListener('click', () => {
                    window.leaveCallButtonClicked = true;
                });
            }
        `);
        let isClicked = false;
        while (!isClicked) {
            isClicked = await driver.executeScript(`
                return window.leaveCallButtonClicked || false;
            `);

            if (isClicked) {
                await driver.close()
                console.log("The 'Leave call' button was clicked!");
                break;
            }


            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }else{
        console.log("Element not found");
    }
}




async function main( id : string) {
    try{
        const driver = await getDriver();
        await openMeet(driver,id);
        await whenMeetPage(driver);
    }catch (error){
        console.error(error);
    }

}



app.listen(3000,() =>{
    main("https://meet.google.com/cgn-iibp-hog")
    console.log("Listening on port 3000");
})

