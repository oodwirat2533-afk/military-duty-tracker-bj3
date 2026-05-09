# ระบบเช็คสถานะการปฏิบัติหน้าที่นักศึกษาวิชาทหาร
โรงเรียนบรรหารแจ่มใสวิทยา 3

ระบบสำหรับตรวจสอบและบันทึกสถานะการปฏิบัติหน้าที่ของนักศึกษาวิชาทหาร โดยใช้ Google Sheets เป็นฐานข้อมูล

## คุณสมบัติ

- **จัดการห้องชั้นปี**: สร้างและจัดการห้องชั้นปี (ปีที่ 1, 2, 3)
- **จัดการนักศึกษา**: เพิ่มนักศึกษาวิชาทหารใหม่และกำหนดห้องชั้นปี
- **จัดการงาน**: สร้างงานสำหรับบันทึกสถานะการปฏิบัติหน้าที่
- **บันทึกสถานะ**: บันทึกสถานะการปฏิบัติหน้าที่ (ปฏิบัติหน้าที่/ไม่ได้ปฏิบัติหน้าที่)
- **ดูรายงาน**: ดูและส่งออกรายงานเป็น CSV
- **จัดการ Admin**: Super Admin สามารถเพิ่ม/ลบ/แก้ไข Admin
- **ดูสถานะนักศึกษา**: นักศึกษาสามารถดูสถานะการปฏิบัติหน้าที่ของตนเอง

## เทคโนโลยีที่ใช้

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: Google Sheets API
- **Authentication**: Google OAuth 2.0

## การติดตั้ง

### 1. Clone repository

```bash
git clone https://github.com/your-username/military-duty-tracker-bj3.git
cd military-duty-tracker-bj3
```

### 2. ติดตั้ง dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env` และกรอกข้อมูล:

```bash
cp .env.example .env
```

แก้ไข `.env` ด้วยข้อมูลของคุณ:

```
VITE_API_URL=http://localhost:5000
GOOGLE_SHEETS_API_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"your-private-key","client_email":"your-client-email","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-client-email"}
GOOGLE_SHEET_ID=1uwLHN0Id4ue3PnUcrJGc32YmgxzNz0rC9pId3ikalik
GOOGLE_OAUTH_CLIENT_ID=your-oauth-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-oauth-client-secret
SUPER_ADMIN_EMAIL=ood.wirat2533@gmail.com
```

### 4. ตั้งค่า Google Sheets API

#### 4.1 สร้าง Google Cloud Project

1. เข้า https://console.cloud.google.com/
2. สร้าง project ใหม่

#### 4.2 เปิดใช้งาน Google Sheets API

1. ไปที่ "APIs & Services" > "Library"
2. ค้นหา "Google Sheets API"
3. กด "Enable"

#### 4.3 สร้าง Service Account

1. ไปที่ "APIs & Services" > "Credentials"
2. กด "Create Credentials" > "Service Account"
3. กรอกข้อมูล:
   - Service account name: `military-duty-tracker`
   - Service account description: `Service account for accessing Google Sheets`
4. กด "Create and Continue"

#### 4.4 ดาวน์โหลด Credentials

1. คลิกที่ Service Account ที่สร้าง
2. ไปที่ "Keys" tab
3. กด "Add Key" > "Create New Key"
4. เลือก "JSON"
5. ดาวน์โหลดไฟล์ JSON
6. คัดลอกเนื้อหาไฟล์ JSON และวางใน `GOOGLE_SHEETS_API_CREDENTIALS` ในไฟล์ `.env`

#### 4.5 แชร์ Google Sheet

1. เข้า https://docs.google.com/spreadsheets/d/1uwLHN0Id4ue3PnUcrJGc32YmgxzNz0rC9pId3ikalik/edit
2. กดปุ่ม "Share"
3. ในช่อง "Add people and groups" วาง Service Account email (จะอยู่ในไฟล์ JSON credentials)
4. ในส่วน "Permission" เลือก "Editor"
5. กด "Send"

### 5. ตั้งค่า Google OAuth

#### 5.1 สร้าง OAuth 2.0 Credentials

1. ไปที่ "APIs & Services" > "Credentials"
2. กด "Create Credentials" > "OAuth client ID"
3. เลือก "Web application"
4. ตั้งค่า "Authorized redirect URIs":
   - http://localhost:3000
   - https://your-github-pages-url.com
5. กด "Create"
6. คัดลอก Client ID และ Client Secret ไปใส่ในไฟล์ `.env`

## การใช้งาน

### เริ่มต้น Backend Server

```bash
npm run server
```

Backend จะทำงานที่ port 5000

### เริ่มต้น Frontend Development Server

```bash
npm run dev
```

Frontend จะทำงานที่ http://localhost:3000

### การ Build สำหรับ Production

```bash
npm run build
```

## โครงสร้างโปรเจกต์

```
military-duty-tracker-bj3/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManageClassrooms.jsx
│   │   ├── AddStudent.jsx
│   │   ├── AddDuty.jsx
│   │   ├── RecordStatus.jsx
│   │   ├── ManageAdmins.jsx
│   │   ├── Reports.jsx
│   │   └── StudentStatus.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── classrooms.js
│   │   ├── students.js
│   │   ├── duties.js
│   │   ├── status.js
│   │   └── admins.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── googleSheets.js
│   └── index.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## การใช้งานระบบ

### สำหรับ Admin

1. เข้า http://localhost:3000
2. กด "เข้าสู่ระบบ Admin"
3. Login ด้วย Google Account (ต้องเป็น email ที่ถูกเพิ่มในระบบ)
4. จัดการห้องชั้นปี, นักศึกษา, งาน, และบันทึกสถานะ

### สำหรับนักศึกษา

1. เข้า http://localhost:3000/student-status
2. กรอกรหัสประจำตัวนักเรียน
3. ดูสถานะการปฏิบัติหน้าที่ของตนเอง

## การ Deploy

### GitHub Pages

1. Push code ขึ้น GitHub
2. ไปที่ Settings > Pages
3. เลือก Source: Deploy from a branch
4. เลือก Branch: main
5. กด Save

**หมายเหตุ**: Backend API จะต้อง deploy แยก (เช่น Render, Railway) เนื่องจาก GitHub Pages เป็น static hosting เท่านั้น

## การสนับสนุน

หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อ:
- Email: ood.wirat2533@gmail.com

## License

© 2026 โรงเรียนบรรหารแจ่มใสวิทยา 3
