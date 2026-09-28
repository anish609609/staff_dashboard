# Vamshi ENT Hospital – Doctor Dashboard & Outpatient Reception System

> **Powered by AshwiniCare** · Clinical Consultation Workspace, Outpatient Analytics & Reception Desk

A high-efficiency, mobile-optimized clinical consultation and outpatient department (OPD) queue management application tailored for **Vamshi ENT Hospital**. Designed for speed, privacy, and clinical clarity for both consulting doctors and front-desk reception staff.

---

## 📁 Project Directory Tree

```text
vamshi-ent-hospital-reception-desk/
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx                         # App entry point
    ├── App.tsx                          # Root application container & role-based view coordinator
    ├── index.css                        # Tailwind CSS styling directives
    ├── assets/
    │   └── images/
    │       ├── clinic_logo_mark_*.jpg   # Hospital logo mark
    │       └── receptionist_avatar_*.jpg# Receptionist profile avatar
    ├── types/
    │   └── clinic.ts                    # TypeScript models (OPDEntry, PatientRecord, ConsultationRecord, etc.)
    ├── data/
    │   ├── mockData.ts                  # Hospital details, doctors, initial patient directory & queue data
    │   └── prescriptionAssets.ts        # Sample high-fidelity SVG Rx preview assets
    ├── utils/
    │   ├── audioChime.ts                # Audio chime sound feedback for actions
    │   └── patientAge.ts                # Dynamic patient age calculation
    └── components/
        ├── Footer.tsx                   # Centered hospital branding and AshwiniCare attribution
        ├── LoginScreen.tsx              # Multi-role authentication (Doctor Console vs Reception Staff)
        ├── doctor-dashboard/            # Modularized Doctor Consultation & Analytics Workspace
        │   ├── DoctorDashboard.tsx      # Main doctor orchestrator (Greeting, OPDs vs Analytics tabs)
        │   ├── DoctorHeader.tsx         # Doctor console header with profile, role-switching & logout
        │   ├── OpdsConsultationTab.tsx  # Master-detail consultation workspace with modal triggers
        │   ├── DoctorQueue.tsx          # Real-time left-pane incoming patient queue with 2 states (Waiting, Consulted, All)
        │   ├── PatientConsultationModal.tsx # Comprehensive consultation modal with timestamped prescription uploader
        │   ├── PatientDetailCard.tsx    # Staff registration details, reason for visit & call action
        │   ├── PatientPastHistory.tsx   # Prior visit timeline with clickable Rx thumbnails & lightbox
        │   ├── PrescriptionUploader.tsx # Drag & drop / photo prescription upload & completion form
        │   ├── AnalyticsTab.tsx         # Date range filter, summary metric cards & volume trends
        │   └── StaffPerformanceTable.tsx# Reception staff registrations & throughput breakdown
        └── staff-dashboard/             # Modularized Staff Reception Desk
            ├── StaffDashboard.tsx       # Staff workspace container (Welcome banner, spot desk, live queue)
            ├── Header.tsx               # Staff top navigation bar with branding & profile
            ├── WelcomeBanner.tsx        # Daily inspirational rotation banner
            ├── LiveOpdQueueTable.tsx    # Mobile-first card-based live OPD queue with expandable cards
            ├── SpotAppointmentDesk.tsx  # Spot appointment booking container & validation orchestrator
            └── appointment-desk/        # Appointment creation sub-components
                ├── DoctorSessionFields.tsx
                ├── PatientInfoFields.tsx
                ├── ComplaintTags.tsx
                ├── ExtraNotesField.tsx
                └── FormActions.tsx
```

---

## 🩺 Doctor Dashboard Architecture (`src/components/doctor-dashboard/`)

| Component | Responsibility & Features |
| :--- | :--- |
| **`DoctorDashboard.tsx`** | Top-level container. Features dynamic time-based greeting, daily inspirational medical quotation, and prominent top tabs (`📋 OPDs` and `📊 Analytics`). |
| **`DoctorHeader.tsx`** | Preserves hospital brand styling with "Vamshi ENT Hospital" powered by "AshwiniCare", active doctor profile badge, fast role switch to Staff Desk, and Log Out action. |
| **`OpdsConsultationTab.tsx`** | Responsive master-detail layout: synchronizes incoming patient queue with detailed clinical review and completion workflow. |
| **`DoctorQueue.tsx`** | Real-time queue column showing token badges (`#M-01`, `#E-01`), patient names, demographic pills, complaint teasers, and status filters (`Waiting`, `Consulted`, `All`). |
| **`PatientConsultationModal.tsx`** | Clean, light pop-up modal launched on patient selection. Streamlined Section 3 with camera snapshot uploader, doctor's note, and follow-up review. |
| **`PatientDetailCard.tsx`** | Displays staff intake details: chief complaints, staff attribution, session slot, room, and notes. |
| **`PatientPastHistory.tsx`** | Comprehensive prior visits timeline with clickable thumbnail previews of previous handwritten/printed prescriptions and full document lightbox inspection. |
| **`PrescriptionUploader.tsx`** | Drag-and-drop & photo uploader for physical handwritten prescription slips (images/PDFs), test presets, diagnosis, internal remarks, and **"Complete Consultation & Save"** button. |
| **`AnalyticsTab.tsx`** | Date filtering (`Today`, `This Week`, `This Month`, `Custom Range`), OPD volume metrics, completed ratio, new vs. follow-up ratio, and daily throughput trend bar chart. |
| **`StaffPerformanceTable.tsx`** | Breakdown table tracking registrations per reception staff member, morning/evening volume, and consultation completion rates. |

---

## 🧩 Appointment Desk Architecture (`src/components/appointment-desk/`)

The spot appointment booking system in `SpotAppointmentDesk.tsx` is modularized into focused, reusable sub-components:

| Component | Responsibility & Features |
| :--- | :--- |
| **`SpotAppointmentDesk.tsx`** | Container orchestrator. Manages form state, real-time autocomplete search triggers, validation, 3-second timed toast notifications, audio chimes, and appointment submission. |
| **`PatientInfoFields.tsx`** | Manages patient full name, mobile number (+91), age, and gender selection. Features compact search suggestions (`max-h-48`) displaying Name + Phone (`Ramesh Kumar (+91 98450 12345)`), auto-fill, and full in-place editing of phone number and age for returning patients. |
| **`DoctorSessionFields.tsx`** | Provides `DoctorSelectDropdown` for assigning consulting doctors and `DateSessionRow` for date selection and auto-selected Morning/Evening OPD session slots. |
| **`ComplaintTags.tsx`** | Renders quick-toggle multi-select ENT tags (`Ear Pain`, `Throat Pain`, `Sinus & Cold`, `Hearing Check`, etc.) and a free-text input for custom chief complaints. |
| **`ExtraNotesField.tsx`** | Manages optional clinician notes, scan reports, wheelchair requirements, or special consultation instructions. |
| **`FormActions.tsx`** | Renders form controls: **"Clear Form"** reset button and the primary **"Schedule Appointment"** submit button with icon feedback. |

---

## ⚡ Key Workflow Capabilities

### 1. Mobile Card-Based Queue (`LiveOpdQueueTable.tsx`)
- **Card-Based View:** Replaces cumbersome tabular grids with high-density mobile cards showing Token badges (`#M-01`), patient names, demographic pills, and live statuses.
- **Privacy-First Collapsed Mode:** Phone numbers are hidden by default on collapsed cards to maintain patient privacy on reception monitors.
- **Expandable Detail Layer:** Tapping a card reveals visit reasons, extra notes, booked timestamp with staff attribution, consulting doctor name, and patient contact.

### 2. Tap-to-Call Phone Integration
- When expanding any patient's queue card, staff can tap the **Contact** button to trigger instant direct phone dialing (`tel:+91...`) on mobile devices without manual dialing errors.

### 3. Status Priority Sorting
- In the **"All Status"** queue view, patients in **`Waiting`** status are prioritized and displayed at the top, followed by **`Consulted`** patients at the bottom.
- Sequential token ordering (`#M-01`, `#M-02`, ...) is strictly preserved within each status group.

### 4. Timed Success Toast Alerts
- Scheduling an appointment triggers a subtle, auto-dismissing floating toast notification (`"Appointment scheduled successfully! #M-0X"`) at the top of the viewport.
- Automatically dismisses after **3 seconds** and includes an instant manual dismiss button.

### 5. Dynamic Age Calculation for Returning Patients
- When searching or auto-filling returning patient records, their age is dynamically calculated based on the elapsed time between registration/visit date and the current date:
  - Formula: `Current Age = Stored Age + (Current Year - Registration Year)`
- The updated age, gender, and phone number are populated into the appointment form.
- The age field remains fully editable for reception staff to adjust or fine-tune.

### 6. Centered Footer Layout (`Footer.tsx`)
- Replaced split edge alignment with a clean, single-column centered stack:
  - **Hospital Name:** **Vamshi ENT Hospital** in bold prominent typography.
  - **Attribution:** Centered subtext `powered by AshwiniCare`.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Startup
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build & Linting
```bash
# Type check and lint
npm run lint

# Build for production
npm run build
```
