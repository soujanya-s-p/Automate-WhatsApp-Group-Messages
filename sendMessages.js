const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    // Set headless to true for a background process

  try {
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com/');
    
    // Wait for user to scan QR code manually
    await page.waitForSelector('._1lpto');
    await page.waitForSelector('._3j7s9'); // Wait for the list of chats to load
    const groupName = 'Your Group Name'; // Replace with actual group name
    await page.evaluate((groupName) => {
      const chats = document.querySelectorAll('._3j7s9 span[title]');
      for (const chat of chats) {
        if (chat.innerText === groupName) {
          chat.click();
          break;
        }
      }
    }, groupName);
    

    // Wait for the contacts to load
    await page.waitForSelector('._210SC');

    // Extract contacts
    const contacts = await page.evaluate(() => {
      const contactElements = document.querySelectorAll('._210SC span[title]');
      const contactsArray = Array.from(contactElements);
      return contactsArray.map(element => element.title);
    });

    // Iterate through contacts and send messages
    for (const contact of contacts) {
      await page.click('._2S1VP');
      await page.type('._2S1VP input', contact);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(90000); // Wait for contact to load

      // Type and send your message here
      await page.type('div[data-tab="1"]', 'Good morning');
      await page.keyboard.press('Enter');

      // Wait for the message to be sent
      await page.waitForTimeout(90000);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
