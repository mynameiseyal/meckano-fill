// const API_KEY = 'AIzaSyCeothTZedAnV0wJeE1kAVgFKbuqYZW37g'; // Replace with your API key
import fetch from 'node-fetch';

const SHEET_ID = '1tdmssFnwCacZvfYJH28IvTrHAjOMfr2va7obAMkdsfc'; // Your Google Sheet ID
const RANGE = 'Sheet1!A1:D'; // Adjust the range based on your sheet
const API_KEY = 'AIzaSyCeothTZedAnV0wJeE1kAVgFKbuqYZW37g'; // Replace with your API key

async function fetchGoogleSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Details: ${errorDetails}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    // Extract numbers from the last row's 4th column (Message Body)
    const lastRow = rows[rows.length - 1];
    const messageBody = lastRow[3] || ''; // Assuming column D is index 3
    const numbers = messageBody.match(/\d+/g) || [];
    console.log(numbers.join(','));
  } catch (error) {
    console.error(`Error fetching sheet data: ${error.message}`);
  }
}

fetchGoogleSheetData();
