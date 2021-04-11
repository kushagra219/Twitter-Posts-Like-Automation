const pup = require('puppeteer');
const scrollPageToBottom = require('puppeteer-autoscroll-down');
let email = "terorev483@yncyjs.com";
let username = "";
let password = "";
let twitterLink = "https://www.twitter.com";

let hashtagToUse = "#ipl2021";
let baseLink = "https://twitter.com";

const scrollStep = 100 // default
const scrollDelay = 100 // default

async function main() {
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    })

    let pages = await browser.pages();
    tab = pages[0];

    await tab.goto("https://twitter.com/login");
    // await tab.waitForNavigation({ waitUntil: "networkidle2" });
    await tab.waitForSelector("input[type='text']", { visible: true });
    await tab.type("input[type='text']", username);
    await tab.waitForSelector("input[type='password']", { visible: true });
    await tab.type("input[type='password']", password);
    
    await tab.waitForSelector("div[data-testid='LoginForm_Login_Button']", { visible: true });
    await tab.click("div[data-testid='LoginForm_Login_Button']");

    await tab.waitForSelector("a[data-testid='AppTabBar_Explore_Link']", { visible: true });
    await tab.click("a[data-testid='AppTabBar_Explore_Link']");

    await tab.waitForSelector("input[data-testid='SearchBox_Search_Input']", { visible: true });
    await tab.type("input[data-testid='SearchBox_Search_Input']", hashtagToUse);

    
    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 3000);
    })
    // await tab.click(".css-1dbjc4n.r-ymttw5.r-1yzf0co");
    await tab.waitForSelector(".css-1dbjc4n.r-ymttw5.r-1yzf0co", { visible: true });
    let iplHashtags = await tab.$$(".css-1dbjc4n.r-ymttw5.r-1yzf0co");
    iplHashtags[0].click();
    
    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 1000);
    })
    let aTags = await tab.$$("a");
    let links = [];
    for(let i of aTags){
        let urlFetchPromise = await tab.evaluate(function(ele){
            return ele.getAttribute('href');
        }, i)
        links.push(urlFetchPromise);
    }

    let latest = links[11];
    let people = links[12];
    
    // await followPeople(people);
    await likePosts(latest);
    
    await browser.close();
}


async function followPeople(url) {
    await tab.goto(baseLink + url);

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 2000);
    })

    
    await tab.waitForSelector(".css-1dbjc4n.r-j7yic.r-qklmqi.r-1adg3ll.r-1ny4l3l", { visible: true });
    let counter = 0;

    while(counter < 25) {
        let allHandles = await tab.$$(".css-1dbjc4n.r-j7yic.r-qklmqi.r-1adg3ll.r-1ny4l3l");
        for(let i in allHandles) {
            console.log("Person " + (counter+1) + " Followed");
            let handle = allHandles[counter];
            let followButtons = await handle.$$("div[role='button']");
            await followButtons[1].click();
            counter++;

            await new Promise(function(resolve, reject){
                setTimeout(function() {
                    resolve();
                }, 500);
            })
        }

        if(counter > 50)
            break;

        await autoScroll(tab);
    }

    console.log("Happy Following!")
}


async function likePosts(url) {
    await tab.goto(baseLink + url);

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 2000);
    })
    await tab.waitForSelector(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu", { visible: true });
    let allPosts = await tab.$$(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu");
    let firstPost = allPosts[0];
    let likeButton = await firstPost.$$(".r-4qtqp9.r-yyyyoo.r-1xvli5t.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr.r-1hdv0qi");
    await likeButton[3].click();

    await tab.waitForSelector(".css-1dbjc4n.r-14lw9ot.r-16y2uox.r-1dqxon3.r-16wqof", { visible: true });
    // await tab.click("a[herf='/login']");
    await tab.goto(baseLink + url);

    await new Promise(function(resolve, reject){
        setTimeout(function() {
            resolve();
        }, 2000);
    })
    await tab.waitForSelector("div[data-testid='tweet']", { visible: true });

    let counter = 0;
    while(counter < 50) {
        let allPosts2 = await tab.$$("div[data-testid='tweet']");
        
        for(let i in allPosts2) {      
            let firstPost2 = allPosts2[i];
            let likeButton2 = await firstPost2.$$(".r-4qtqp9.r-yyyyoo.r-1xvli5t.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr.r-1hdv0qi");
            await likeButton2[3].click();
            counter++;

            await new Promise(function(resolve, reject){
                setTimeout(function() {
                    resolve();
                }, 100);
            })
        }
        
        if(counter >= 50)
            break;

        window.scrollBy(0, 100);
    }
    
    console.log("Happy Liking!")
}


// async function autoScroll(page){
//     await page.evaluate(async () => {
//         await new Promise((resolve, reject) => {
//             var totalHeight = 0;
//             var distance = 100;
//             var timer = setInterval(() => {
//                 var scrollHeight = document.body.scrollHeight;
//                 window.scrollBy(0, distance);
//                 totalHeight += distance;
//                 if(totalHeight >= scrollHeight){
//                     clearInterval(timer);
//                     resolve();
//                 }
//             }, 100);
//         });
//     });
// }


main();





