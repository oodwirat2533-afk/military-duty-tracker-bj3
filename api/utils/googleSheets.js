import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1uwLHN0Id4ue3PnUcrJGc32YmgxzNz0rC9pId3ikalik'

// For Vercel deployment, we need to handle credentials differently
let credentials
try {
  // Try to read from file (for local development)
  const { readFileSync } = await import('fs')
  const { fileURLToPath } = await import('url')
  const { dirname, join } = await import('path')
  
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const credentialsPath = join(__dirname, '../../army-bj3-2d78011d0c1a.json')
  credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'))
} catch (error) {
  // For Vercel, use environment variable
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
  } else {
    throw new Error('Google Sheets credentials not found')
  }
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

// Tab names
const TABS = {
  CLASSROOMS: 'ห้องชั้นปี',
  STUDENTS: 'นักศึกษา',
  DUTIES: 'งาน',
  STATUS: 'สถานะการปฏิบัติหน้าที่',
  ADMINS: 'Admin'
}

// Initialize tabs if they don't exist
export async function initializeTabs() {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    })

    const existingTabs = spreadsheet.data.sheets.map(sheet => sheet.properties.title)
    const tabNames = Object.values(TABS)

    for (const tabName of tabNames) {
      if (!existingTabs.includes(tabName)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: tabName
                  }
                }
              }
            ]
          }
        })
      }
    }

    // Add headers to each tab
    const headers = {
      [TABS.CLASSROOMS]: ['รหัสห้องชั้นปี', 'ชื่อห้องชั้นปี', 'ปีการศึกษา', 'วันที่สร้าง'],
      [TABS.STUDENTS]: ['รหัสประจำตัวนักเรียน', 'ชื่อ-นามสกุล', 'ชั้นปี', 'ห้องเรียน', 'เลขที่', 'วันที่เพิ่ม'],
      [TABS.DUTIES]: ['รหัสงาน', 'ชื่องาน', 'วันที่', 'คำอธิบาย', 'สถานะงาน'],
      [TABS.STATUS]: ['รหัสประจำตัวนักเรียน', 'รหัสงาน', 'สถานะ', 'วันที่บันทึก'],
      [TABS.ADMINS]: ['Email', 'บทบาท', 'ชั้นปีที่รับผิดชอบ', 'วันที่เพิ่ม']
    }

    for (const [tabName, headerRow] of Object.entries(headers)) {
      const range = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${tabName}!A1:Z1`
      })

      if (!range.data.values || range.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${tabName}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headerRow]
          }
        })
      }
    }

    console.log('Tabs initialized successfully')
  } catch (error) {
    console.error('Error initializing tabs:', error)
    throw error
  }
}

// Read data from a tab
export async function readTab(tabName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A:Z`
    })
    const rows = response.data.values || []
    const headers = rows[0] || []
    const data = rows.slice(1).map(row => {
      const obj = {}
      headers.forEach((header, index) => {
        obj[header] = row[index] || ''
      })
      return obj
    })
    return data
  } catch (error) {
    console.error(`Error reading tab ${tabName}:`, error)
    throw error
  }
}

// Append data to a tab
export async function appendToTab(tabName, data) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [data]
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error appending to tab ${tabName}:`, error)
    throw error
  }
}

// Update data in a tab
export async function updateTab(tabName, range, data) {
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: data
      }
    })
    return response.data
  } catch (error) {
    console.error(`Error updating tab ${tabName}:`, error)
    throw error
  }
}

// Delete row from a tab
export async function deleteRow(tabName, rowIndex) {
  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetId(tabName),
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1
              }
            }
          }
        ]
      }
    })
  } catch (error) {
    console.error(`Error deleting row from tab ${tabName}:`, error)
    throw error
  }
}

// Get sheet ID by name
async function getSheetId(tabName) {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    })
    const sheet = spreadsheet.data.sheets.find(s => s.properties.title === tabName)
    return sheet ? sheet.properties.sheetId : null
  } catch (error) {
    console.error('Error getting sheet ID:', error)
    throw error
  }
}

export { TABS }
