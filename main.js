// main.js

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
let loadURL;

let mainWindow;
async function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    //frame: false,
    resizable: false,
    fullscreen: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
    },
    icon: !app.isPackaged
      ? path.join(process.cwd(), 'public/logo512.png')
      : path.join(__dirname, 'build/logo512.png'),
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000/');
  } else {
    mainWindow.loadURL('file://' + __dirname + '/build/index.html');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  ////
  mainWindow.on('closed', () => {
    app.quit();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle('write-file', async (event, filePath, jsonData) => {
  try {
    fs.writeFile(filePath, jsonData);
    return { success: true };
  } catch (error) {
    return { succes: false };
  }
});

ipcMain.handle('quit-app', () => {
  app.quit();
});

ipcMain.handle('sabis-api', async (event, un, pw) => {
  let way = 0;
  let result = [];
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();

  //console.log('yeni tarayıcı açıldı --> ', un, ' : ', pw);

  try {
    await page.goto('https://www.google.com/', { timeout: 5000 });
  } catch (error) {
    await browser.close();
    return -3000;
  }

  await page.goto('https://obs.sabis.sakarya.edu.tr/Ders');

  await page.type('#Username', un);
  await page.type('#Password', pw);

  await page.click('#kt_login_form > div.kt-login__actions > button');

  //await page.waitForNavigation();

  try {
    await page.waitForSelector('#kt_login_form > div.alert.alert-danger', {
      timeout: 3000,
    });

    //console.log('Giriş başarısız');
    way = -1;
  } catch (error) {
    try {
      await page.waitForSelector(
        '#kt_header > div > div.topbar > div > div.topbar-item > div > span.symbol.symbol-35.symbol-light-success > img',
        {
          timeout: 5000,
        }
      );
      //console.log('giriş başarılı');
      way = 1;
    } catch (error) {
      //console.log('giriş yapılamadı');
      console.log(error);
      way = 0;
    }
  }

  if (way == -1 || way == 0) {
    await browser.close();
    return way;
  } else if (way == 1) {
    try {
      const lTitles = await page.evaluate(() => {
        const titles = Array.from(
          document.getElementsByClassName(
            'text-dark font-weight-bolder text-hover-primary font-size-h5'
          )
        );
        return titles.map((el) => el.textContent.trim());
      });
      const grades = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('td'));
        let lesson = '';
        let organizedLesson = [];
        let i = 0;
        tds.map((td) => {
          const one = td.textContent.trim();
          if (one !== '') lesson += one;
          else lesson += '0';
          if ((i + 1) % 3 === 0) {
            organizedLesson.push(lesson);
            lesson = '';
          } else {
            lesson += '-';
          }
          i++;
        });
        return organizedLesson;
      });

      await page.goto('https://obs.sabis.sakarya.edu.tr');

      const profile = await page.evaluate(() => {
        const photo = document.querySelector(
          '#kt_profile_aside > div.card.card-custom.gutter-b > div > div > div > div.d-flex.flex-column.flex-center > div.symbol.symbol-120.symbol-success.overflow-hidden > span > img'
        ).src;
        const name = document
          .querySelector(
            '#kt_profile_aside > div.card.card-custom.gutter-b > div > div > div > div.d-flex.flex-column.flex-center > div.font-weight-bold.text-dark-50.font-size-sm.pb-6'
          )
          .textContent.trim();
        const schoolNumber = document
          .querySelector(
            '#kt_profile_aside > div.card.card-custom.gutter-b > div > div > div > div.d-flex.flex-column.flex-center > a'
          )
          .textContent.trim();
        const details = Array.from(
          document.getElementsByClassName('text-dark-65 font-weight-bold')
        ).map((el) => el.textContent.trim());
        const lastArray = [photo, name, schoolNumber, ...details];
        return lastArray;
      });
      await browser.close();

      const organizeGrade = () => {
        let bigArray = [];
        let array = [];
        let i = 0;
        let av = 0;
        grades.map((line) => {
          if (line.includes('Ara Sınav')) {
            if (i !== 0) {
              array[array.length - 1] += '-' + av.toFixed(2);
              bigArray.push(array);
              array = [];
              av = 0;
            }
            array.push(lTitles[i]);
            i++;
          } else {
          }
          if (!line.includes('Başarı Notu')) {
            const linePart = line.split('-');
            const contribution = parseFloat(linePart[0].replace(/,/g, '.'));
            const grade = parseFloat(linePart[2].replace(/,/g, '.'));
            const lineAv = (grade / 100) * contribution;
            if (!isNaN(lineAv)) {
              av += lineAv;
              line += '-' + lineAv.toFixed(2);
            } else {
              line += '-' + grade;
            }
          } else {
            line = 'x' + line.slice(1);
          }
          array.push(line);
        });
        array[array.length - 1] += '-' + av.toFixed(2);
        bigArray.push(array);

        return bigArray;
      };

      const tableGrades = organizeGrade();
      result = [profile, tableGrades];
    } catch (error) {
      way = 0;
      console.log(error);
      await browser.close();
      return way;
    }
  }
  //console.log(result);
  return JSON.stringify(result);
});
