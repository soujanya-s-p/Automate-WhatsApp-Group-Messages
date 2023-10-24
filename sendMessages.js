const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); 

  try {
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com/');
    await page.waitForSelector('._1lpto');
    await page.type('._1lpto input', 'Your Group Name');
    await page.waitForSelector('._3j7s9');
    const groupName = 'Your Group Name';
    await page.evaluate((groupName) => {
      const chats = document.querySelectorAll('._3j7s9 span[title]');
      for (const chat of chats) {
        if (chat.innerText === groupName) {
          chat.click();
          break;
        }
      }
    }, groupName);

    await page.waitForSelector('._210SC');

    const contacts = await page.evaluate(() => {
      const contactElements = document.querySelectorAll('._210SC span[title]');
      const contactsArray = Array.from(contactElements);
      return contactsArray.map(element => element.title);
    });

    for (const contact of contacts) {
      await page.click('._2S1VP');
      await page.type('._2S1VP input', contact);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      await page.type('div[data-tab="1"]', 'Your message');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
