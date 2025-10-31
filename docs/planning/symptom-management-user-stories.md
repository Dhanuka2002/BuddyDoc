# Epic 2: Symptom Management System - User Stories

## Overview
The Symptom Management System is one of the core features of PatientPrep SL, enabling patients to comprehensively track, organize, and document their health symptoms for medical consultations.

**Epic Goal:** Enable patients to capture, organize, and present comprehensive symptom information to healthcare providers.

**Total User Stories:** 21 stories across 4 functional areas

---

## 🏥 2.1 Symptom Logging Interface (6 Stories)

### **SYM-001: Basic Symptom Entry**
**As a patient, I want to add new symptoms with descriptive names so that I can track all my health concerns accurately.**

**Acceptance Criteria:**
- User can create new symptom entries
- Symptom name field accepts text input
- Common symptoms available via autocomplete/suggestions
- User can add custom symptom names
- Symptom entries are saved locally and encrypted

**Priority:** Must Have (MVP)
**Sprint:** 1-2

---

### **SYM-002: Onset Date Tracking**
**As a patient, I want to record when each symptom started so that I can provide accurate timeline information to my doctor.**

**Acceptance Criteria:**
- Date picker available for symptom onset
- User can select specific date or indicate "approximate" timeframe
- Options for "today," "yesterday," "this week," "last week," etc.
- Date is stored and displayed clearly
- Validation prevents future dates

**Priority:** Must Have (MVP)
**Sprint:** 1-2

---

### **SYM-003: Duration Tracking**
**As a patient, I want to indicate how long symptoms have lasted so that my doctor understands the duration of my concerns.**

**Acceptance Criteria:**
- Options for ongoing vs. resolved symptoms
- Duration calculated automatically from onset date
- User can manually specify duration if preferred
- Clear indication of "still present" vs. "resolved"
- Duration displayed in user-friendly format (days, weeks, months)

**Priority:** Must Have (MVP)  
**Sprint:** 1-2

---

### **SYM-004: Severity Rating**
**As a patient, I want to rate the severity of each symptom so that I can communicate the impact on my daily life.**

**Acceptance Criteria:**
- Severity scale from 1-10 or mild/moderate/severe
- Visual slider or button interface for easy selection
- Clear labels explaining severity levels
- Option to change severity over time
- Severity prominently displayed in symptom lists

**Priority:** Must Have (MVP)
**Sprint:** 1-2

---

### **SYM-005: Detailed Descriptions**
**As a patient, I want to add detailed descriptions of my symptoms so that I don't forget important details during my consultation.**

**Acceptance Criteria:**
- Free-form text field for detailed symptom descriptions
- Character limit sufficient for comprehensive descriptions (500+ characters)
- Text formatting options (basic - bold, italics if needed)
- Auto-save functionality to prevent data loss
- Easy editing and updating of descriptions

**Priority:** Must Have (MVP)
**Sprint:** 1-2

---

### **SYM-006: Quick Symptom Entry**
**As a patient, I want to quickly add common symptoms from a suggested list so that I can log information efficiently.**

**Acceptance Criteria:**
- Database of common symptoms for quick selection
- Search functionality within symptom database
- Categorized symptom lists (headaches, pain, digestive, etc.)
- One-tap addition of common symptoms
- Ability to add custom symptoms not in database

**Priority:** Should Have (MVP)
**Sprint:** 2

---

## 🔍 2.2 Symptom Detail Tracking (6 Stories)

### **SYM-007: Aggravating Factors**
**As a patient, I want to record what makes my symptoms worse so that I can provide complete information to my doctor.**

**Acceptance Criteria:**
- Field for aggravating factors with text input
- Suggested common factors (stress, exercise, weather, food, etc.)
- Multiple factors can be selected/added
- Custom factors can be added
- Clear visual distinction from alleviating factors

**Priority:** Must Have (MVP)
**Sprint:** 2

---

### **SYM-008: Alleviating Factors**
**As a patient, I want to note what makes my symptoms better so that my doctor understands what treatments or activities help.**

**Acceptance Criteria:**
- Field for alleviating factors with text input
- Suggested common remedies (rest, medication, heat, cold, etc.)
- Multiple factors can be selected/added
- Custom factors can be added
- Clear visual distinction from aggravating factors

**Priority:** Must Have (MVP)
**Sprint:** 2

---

### **SYM-009: Associated Symptoms**
**As a patient, I want to track related symptoms that occur together so that my doctor can see the full picture of my condition.**

**Acceptance Criteria:**
- Link symptoms to each other as "related" or "associated"
- Visual indicators showing symptom relationships
- Easy selection from existing symptoms for association
- Ability to add new symptoms as associated
- Clear display of symptom clusters/groups

**Priority:** Should Have (MVP)
**Sprint:** 2-3

---

### **SYM-010: Frequency Patterns**
**As a patient, I want to indicate how often symptoms occur so that my doctor understands the frequency pattern.**

**Acceptance Criteria:**
- Options for frequency (constant, daily, weekly, occasional, etc.)
- Custom frequency descriptions allowed
- Visual indicators for different frequency types
- Ability to update frequency as patterns change
- Clear display in symptom summaries

**Priority:** Must Have (MVP)
**Sprint:** 2

---

### **SYM-011: Body Location Mapping**
**As a patient, I want to mark the location of symptoms on my body so that I can accurately describe where problems occur.**

**Acceptance Criteria:**
- Simple body diagram for location selection
- Multiple locations can be selected for one symptom
- Text input option for specific location descriptions
- Visual display of affected areas
- Clear indication of symptom locations in summaries

**Priority:** Could Have (Post-MVP)
**Sprint:** Future

---

### **SYM-012: Symptom Updates**
**As a patient, I want to update symptom information as it changes so that I can track progression or improvement.**

**Acceptance Criteria:**
- All symptom fields can be edited after creation
- Change history tracked for important fields (severity, status)
- Clear indication when symptom information was last updated
- Option to mark symptom as "improved," "worsened," or "unchanged"
- Visual indicators showing symptom progression over time

**Priority:** Must Have (MVP)
**Sprint:** 2

---

## 🤖 2.3 AI-Guided Symptom Documentation (4 Stories)

### **SYM-013: Contextual Prompts**
**As a patient, I want helpful prompts while entering symptoms so that I don't forget to include important details.**

**Acceptance Criteria:**
- Smart prompts appear based on symptom being entered
- Non-intrusive suggestions (tooltips, gentle reminders)
- Prompts for commonly forgotten details (onset, duration, severity)
- User can dismiss prompts if not needed
- Prompts are general, not medical advice

**Priority:** Should Have (MVP)
**Sprint:** 4

---

### **SYM-014: Detail Suggestions**
**As a patient, I want suggestions for additional symptom details based on what I've entered so that I can provide comprehensive information.**

**Acceptance Criteria:**
- AI suggests relevant detail fields based on symptom type
- Suggestions appear after basic symptom information entered
- User can accept or ignore suggestions
- Suggestions based on general patterns, not medical analysis
- Progressive disclosure - more details suggested as user provides information

**Priority:** Should Have (MVP)
**Sprint:** 4

---

### **SYM-015: Completeness Indicators**
**As a patient, I want to see completeness indicators for my symptom entries so that I know when I've provided thorough information.**

**Acceptance Criteria:**
- Visual progress indicators showing completeness of symptom entry
- Color coding or percentage showing how much detail provided
- Clear indication of optional vs. essential fields
- Encouragement to complete more details without being mandatory
- Overall completeness score for all symptoms

**Priority:** Should Have (MVP)
**Sprint:** 4

---

### **SYM-016: Documentation Guidance**
**As a patient, I want general guidance about symptom documentation so that I can become better at tracking my health.**

**Acceptance Criteria:**
- Educational tips about effective symptom tracking
- Best practices for describing symptoms to doctors
- General advice about what details are typically important
- Optional tutorial or help section
- Tips presented contextually when relevant

**Priority:** Could Have (Post-MVP)
**Sprint:** Future

---

## 📋 2.4 Symptom Organization & Management (5 Stories)

### **SYM-017: Symptom Grouping**
**As a patient, I want to group related symptoms together so that I can organize my health concerns logically.**

**Acceptance Criteria:**
- Create custom groups for related symptoms
- Drag-and-drop interface for grouping
- Visual organization by groups in symptom list
- Pre-defined categories available (headaches, pain, digestive, etc.)
- Easy regrouping and ungrouping of symptoms

**Priority:** Should Have (MVP)
**Sprint:** 3

---

### **SYM-018: Symptom Editing**
**As a patient, I want to edit existing symptom entries so that I can update information as my condition changes.**

**Acceptance Criteria:**
- All symptom fields are editable after creation
- Easy access to edit function from symptom list
- Clear save/cancel options for edits
- Confirmation before discarding unsaved changes
- Edit history maintained for important changes

**Priority:** Must Have (MVP)
**Sprint:** 2

---

### **SYM-019: Symptom Resolution**
**As a patient, I want to mark symptoms as resolved so that I can focus on current concerns while keeping historical records.**

**Acceptance Criteria:**
- Option to mark symptoms as "resolved" with date
- Resolved symptoms visually distinguished from active ones
- Filter options to show active vs. resolved vs. all symptoms
- Ability to reactivate resolved symptoms if they return
- Resolution date tracked and displayed

**Priority:** Must Have (MVP)
**Sprint:** 2-3

---

### **SYM-020: Symptom Search**
**As a patient, I want to search through my symptom history so that I can quickly find specific information.**

**Acceptance Criteria:**
- Text search across symptom names and descriptions
- Search results highlighted and clearly displayed
- Filter options (date range, severity, resolved/active)
- Fast search performance even with many symptoms
- Search within symptom details and associated factors

**Priority:** Should Have (MVP)
**Sprint:** 3

---

### **SYM-021: Timeline Organization**
**As a patient, I want to see my symptoms organized by date so that I can understand the timeline of my health issues.**

**Acceptance Criteria:**
- Chronological view of symptom onset dates
- Timeline visualization showing symptom progression
- Sort options (newest first, oldest first, by severity)
- Visual timeline with symptom duration indicators
- Easy navigation through symptom history by date

**Priority:** Should Have (MVP)
**Sprint:** 3

---

## 📊 Summary & Implementation Priority

### **Sprint Allocation Recommendation:**
- **Sprint 1-2 (Must Have):** SYM-001 through SYM-005, SYM-007, SYM-008, SYM-010, SYM-012, SYM-018, SYM-019
- **Sprint 2-3 (Should Have):** SYM-006, SYM-009, SYM-017, SYM-020, SYM-021  
- **Sprint 4 (AI Features):** SYM-013, SYM-014, SYM-015
- **Future/Post-MVP:** SYM-011, SYM-016

### **Technical Requirements:**
- Local SQLite database for symptom storage
- Encrypted storage for all symptom data
- Efficient search and filtering capabilities
- Real-time data validation and saving
- Intuitive user interface for complex data entry

### **Success Metrics:**
- Patients can log comprehensive symptom information in under 2 minutes
- 90%+ of users complete basic symptom details (name, onset, severity)
- Users find symptom search and organization features intuitive
- Symptom data integrates seamlessly with consultation summaries
- Zero data loss or corruption in local storage

These 21 user stories form the foundation for a comprehensive symptom management system that will enable patients to provide detailed, organized symptom information to their healthcare providers, significantly improving consultation quality and efficiency.