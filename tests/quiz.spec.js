const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = path.resolve(__dirname, '..', 'index.html');

  await page.goto('file://' + filePath);
  await page.click('.start-button');

  for (let i = 0; i < 10; i++) {
    const correctIndex = await page.evaluate(() => quizData[currentQuestion].correct);
    await page.click(`.options .option:nth-child(${correctIndex + 1})`);
    await page.waitForSelector('#feedback.show');
    await page.click('#nextButton');
  }

  const scoreText = await page.textContent('#scoreDisplay');
  const scoreMessage = await page.textContent('#scoreMessage');

  if (scoreText !== '10/10') {
    throw new Error(`Expected score 10/10 but got ${scoreText}`);
  }

  if (!scoreMessage.includes('Perfect Score')) {
    throw new Error(`Expected perfect score message but got: ${scoreMessage}`);
  }

  console.log('Playwright test passed: full quiz scores correctly.');
  await browser.close();
})();
