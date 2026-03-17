<<<<<<< HEAD
# 🏥 MediSchedule — Hospital Appointment & Doctor Scheduling System
VERCEL FOR FRONTEND: https://hospital-management-system-wv3g-bmnrny2s1.vercel.app/
BACKEND ON RENDER : https://hospital-management-system-ohh9.onrender.com

> Problem Statement 7 | React + Spring Boot + MySQL (XAMPP)

---

## 📁 Project Structure

```
hospital-system/
├── backend/          # Spring Boot REST API
│   ├── src/main/java/com/hospital/
│   │   ├── controller/     # REST endpoints
│   │   ├── service/        # Business logic
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data access
│   │   ├── dto/            # DTOs
│   │   └── config/         # Security, JWT
│   └── pom.xml
├── frontend/         # React SPA
│   ├── src/
│   │   ├── App.jsx         # Full application (single file)
│   │   └── index.js
│   └── package.json
└── database/
    └── schema.sql    # MySQL schema + seed data
```

---

## ⚙️ Prerequisites

- **XAMPP** (Apache + MySQL) running
- **Java 17+** installed
- **Maven 3.8+** installed
- **Node.js 18+** and npm

---

## 🚀 Setup Instructions

### Step 1: Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL**
3. Open **phpMyAdmin** → http://localhost/phpmyadmin
4. Run the contents of `database/schema.sql` to create the database and seed data

> **Note:** Spring Boot will auto-create the tables on first run (ddl-auto=update). You only need to run the SQL if you want seed data.

---

### Step 2: Backend (Spring Boot)

```bash
cd backend

# Build and run
mvn spring-boot:run
```

The API will start at **http://localhost:8080**

**Verify:** http://localhost:8080/api/doctors/search

---

### Step 3: Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at **http://localhost:3000**

---

## 🔐 Default Test Accounts

| Role    | Email                        | Password     |
|---------|------------------------------|--------------|
| Admin   | admin@hospital.com           | password123  |
| Doctor  | sarah.johnson@hospital.com   | password123  |
| Doctor  | michael.chen@hospital.com    | password123  |
| Patient | patient@example.com          | password123  |

> Or register a new account from the app!

---

## 📡 API Reference

### Authentication
| Method | Endpoint            | Description        | Access |
|--------|---------------------|--------------------|--------|
| POST   | /api/auth/register  | Register user      | Public |
| POST   | /api/auth/login     | Login              | Public |

### Appointments
| Method | Endpoint                       | Description              | Access        |
|--------|--------------------------------|--------------------------|---------------|
| POST   | /api/appointments/book         | Book appointment         | PATIENT       |
| PATCH  | /api/appointments/{id}/confirm | Confirm appointment      | DOCTOR        |
| PATCH  | /api/appointments/{id}/cancel  | Cancel appointment       | PATIENT/ADMIN |
| PATCH  | /api/appointments/{id}/complete| Complete appointment     | DOCTOR        |
| GET    | /api/appointments/my           | Get my appointments      | All roles     |
| GET    | /api/appointments              | Get all appointments     | ADMIN         |

### Doctors
| Method | Endpoint               | Description          | Access  |
|--------|------------------------|----------------------|---------|
| GET    | /api/doctors/search    | Search doctors       | Public  |
| GET    | /api/doctors/{id}      | Get doctor details   | Auth    |
| GET    | /api/doctors/{id}/slots| Get doctor slots     | Auth    |
| POST   | /api/doctors/slots     | Add availability slot| DOCTOR  |
| DELETE | /api/doctors/slots/{id}| Remove slot          | DOCTOR  |

### Admin
| Method | Endpoint            | Description       | Access |
|--------|---------------------|-------------------|--------|
| GET    | /api/admin/stats    | Dashboard stats   | ADMIN  |
| GET    | /api/admin/doctors  | List all doctors  | ADMIN  |
| DELETE | /api/admin/users/{id}| Remove user      | ADMIN  |

---

## 📋 Business Rules Implemented

| Rule | Implementation |
|------|----------------|
| ✅ No overlapping doctor slots | SQL query checks time overlap before booking |
| ✅ No overlapping patient bookings | Patient can't double-book at same time |
| ✅ Doctor must be available | Checks availableSlots before allowing booking |
| ✅ Only DOCTOR can confirm | Role-based access on `/confirm` endpoint |
| ✅ Only ADMIN can cancel after confirmation | Role check in cancel service |
| ✅ Status flow: BOOKED→CONFIRMED→COMPLETED/CANCELLED | Enforced in service layer |

---

## 🎨 Frontend Features

### Patient
- 🔍 Search and filter doctors by specialization
- 📅 View doctor availability slots
- 📝 Book appointments with date/time selection
- 📋 View appointment history with status
- ❌ Cancel own booked appointments

### Doctor
- 📅 View all patient appointments
- ✅ Confirm pending appointments
- 🏁 Mark appointments as completed
- ⏰ Add/remove availability time slots

### Admin
- 📊 Dashboard with statistics
- 👥 View appointments per doctor
- 📈 Status breakdown charts
- ❌ Cancel any appointment

---

## 🛡️ Security

- **JWT Authentication** — Stateless, token-based
- **BCrypt** password hashing
- **Role-based access control** via Spring Security
- **CORS** configured for localhost:3000

---

## 🔧 Troubleshooting

**MySQL connection error:**
- Ensure XAMPP MySQL is running on port 3306
- Default credentials: root / (empty password)
- Edit `application.properties` if different

**CORS errors:**
- Backend must be running on port 8080
- Frontend proxy in `package.json` handles API calls

**Port conflicts:**
- Change `server.port` in `application.properties`
- Update `API` constant in `App.jsx`

---

## 🏆 Hackathon Checklist

- [x] Patients book appointments
- [x] Doctors manage availability
- [x] Prevent overlapping appointments
- [x] Appointment status flow (BOOKED→CONFIRMED→COMPLETED→CANCELLED)
- [x] Date & time overlap validation
- [x] Aggregation (appointments per doctor, status counts)
- [x] React frontend with all 3 roles
- [x] JWT authentication
- [x] MySQL (XAMPP) backend
=======
# Hospital_MS
>>>>>>> f970d8f3b11c9be365c7b3e9390709f956393ac9
