const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const path = require('path');
const urlList = fs.readFileSync('list.txt', 'utf-8').split('\n').map(url => url.trim());

let executionCount = + 1; // Inisialisasi hitungan eksekusi di luar blok writeFile

//ini tambahannya
async function scrapeWebsitesSequentially() {
  for (const url of urlList) {
    await scrapeWebsite(url);
  }
}
async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract databaseId from the URL
    const databaseIdMatch = url.match(/\/(\d+)\/?$/);
    const databaseId = databaseIdMatch ? parseInt(databaseIdMatch[1]) : null;

    const subjectName = $("a.sg-text.sg-text--xsmall.sg-text--link").text().trim().split('\n')[0];

    const authorLink = $("[data-testid='question_box_header_author_link']");
    const authorID = 'dXNlcjo1NDEyNzY='; // Example author ID
    //const authorNick = authorLink.find("span").text().trim();
    const authorNick = authorLink.find("span").contents().first().text().trim();


    const authorAvatar = {
      thumbnailUrl: null, // Example avatar thumbnail URL
      url: null, // Example avatar URL
    };






    const scrapedData = {
      "answers": {
        "nodes": [
          {
            "attachments": [],
            "content": $("div[data-testid='answer_box_text']").text().trim(),
            "created": $('time').attr('datetime'),
            "databaseId": databaseId,
            "points": 0,
            "rating": 0,
            "ratesCount": 0,
            "author": {
              "id": "dxnlcjo1ndeynzy=",
              "avatar": null,
              "nick": 'Pengguna'
            }
          }
        ]
      },
      "attachments": [],
      "content": $("[data-testid='question_box_text']").text().trim(),
      "created": $('time').attr('datetime'),
      "databaseId": databaseId,
      "grade": {
        "databaseId": 2,
        "id": "z3jhzgu6mg==",
        "name": "collège"
      },
      "id": "cxvlc3rpb246otk1ntex",
      "subject": {
        "id": "c3viamvjddox",
        "name": subjectName,
        "slug": subjectName,
      },
      "similar": [],
      "next": {
        "databaseId": 995512
      },
      "previous": {
        "databaseId": 995507
      },
      "lastActivity": null,
      "author": {
        "id": "dxnlcjo1ndeynzy=",
        "avatar": {
          "thumbnailUrl": null
        },
        "nick": authorNick,
      }
    };

    // Create a folder named 'output' if it doesn't exist
    const outputFolder = path.join(__dirname, 'output');
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    // Write the scraped data to a JSON file in the 'output' folder
    const outputFileName = `${databaseId}.json`;
 
    const filePath = path.join(outputFolder, outputFileName);
    fs.writeFile(filePath, JSON.stringify(scrapedData, null, 0), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('\x1b[32m',`Berhasil Eksekusi ${executionCount++}`);
      }
    });
    

  } catch (error) {
    console.error("Error fetching website data:", error);
  }
}

// for (const url of urlList) {
//     scrapeWebsite(url);
// }
//scrapeWebsite("https://brainly.co.id/tugas/53694992");
//sama ini
scrapeWebsitesSequentially();