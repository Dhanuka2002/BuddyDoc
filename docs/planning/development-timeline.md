# Development Timeline and Sprint Planning

## Project Timeline Overview
**Total Duration:** 14 weeks (2 weeks planning + 12 weeks development)  
**Start Date:** June 27, 2025  
**Target Launch:** October 3, 2025

---

## Sprint 0: Planning & Documentation (2 Weeks)
**Duration:** June 27 - July 11, 2025  
**Status:** Current Phase  

### Week 1: June 27 - July 4, 2025
- [x] Business Case finalization  
- [ ] Product Backlog creation and prioritization  
- [ ] User Stories development for all MVP features  
- [ ] Use Case Diagrams for main user flows  
- [ ] Preliminary UI/UX Wireframes  

### Week 2: July 5 - July 11, 2025  
- [ ] UI/UX Wireframe refinement  
- [ ] Technical Stack justification and setup  
- [ ] Granular task breakdown with time estimates  
- [ ] Risk Assessment and mitigation strategies  
- [ ] Sprint 1 preparation and planning  

---

## MVP Development Phase (12 Weeks)
**Duration:** July 12 - October 3, 2025  
**Structure:** 6 bi-weekly sprints

### Month 1: Core Foundations (July 12 - August 8, 2025)

#### Sprint 1: Infrastructure & Authentication (July 12-25, 2025)
**Goal:** Establish core app infrastructure and secure user authentication

**Deliverables:**
- React Native/Expo project setup with TypeScript
- Firebase Authentication integration
- Local storage architecture (SecureStore + SQLite)
- Basic app navigation structure
- User authentication screens (login/signup)
- Privacy-focused onboarding flow

**Key Features:**
- User registration and login
- Secure local data storage setup
- Clear privacy communication to users
- Basic app structure and navigation

**Success Criteria:**
- Users can create accounts and log in securely
- Local storage encryption working properly
- Privacy policy and disclaimers prominently displayed
- App foundation ready for feature development

#### Sprint 2: Core Data Input (July 26 - August 8, 2025)
**Goal:** Implement symptom and medication logging with local storage

**Deliverables:**
- Symptom logging UI with date, duration, severity tracking
- Medication list management interface
- Local SQLite database implementation
- Data encryption for all health information
- Form validation and user input handling

**Key Features:**
- Comprehensive symptom logging
- Medication list with dosage and frequency
- Encrypted local data storage
- Intuitive data input forms

**Success Criteria:**
- Users can log symptoms with comprehensive details
- Medication management working properly
- All health data encrypted and stored locally
- Smooth user experience for data input

### Month 2: Preparation Tools (August 9 - September 5, 2025)

#### Sprint 3: Question Builder & Summary (August 9-22, 2025)
**Goal:** Build question preparation and consultation summary features

**Deliverables:**
- Question builder interface with priority management
- Consultation summary generator
- Appointment planner with doctor details
- Consolidated data view for pre-consultation review
- Export/sharing options (device-only)

**Key Features:**
- Doctor question preparation tool
- Comprehensive consultation summary
- Appointment scheduling and tracking
- Organized information presentation

**Success Criteria:**
- Users can prepare comprehensive question lists
- Summary view consolidates all relevant information
- Appointment management working effectively
- Information well-organized for consultation use

#### Sprint 4: Basic AI Guidance (August 23 - September 5, 2025)
**Goal:** Implement agentic nudges and general preparation guidance

**Deliverables:**
- Rule-based AI guidance system
- General preparation prompts for symptom logging
- Question suggestions based on common patterns
- Appointment reminder system via FCM
- Smart nudges for comprehensive data entry

**Key Features:**
- Intelligent preparation prompts
- General question suggestions
- Helpful reminders and nudges
- Enhanced user guidance throughout preparation

**Success Criteria:**
- AI guidance improves preparation comprehensiveness
- Users receive helpful, non-medical suggestions
- Reminder system functioning properly
- Agentic features enhance user experience

### Month 3: Polish & Launch (September 6 - October 3, 2025)

#### Sprint 5: Enhancement & Testing (September 6-19, 2025)
**Goal:** Refine agentic features and conduct comprehensive testing

**Deliverables:**
- Enhanced agentic logic with improved suggestions
- Post-consultation notes functionality
- Comprehensive internal testing across all features
- Bug fixes and performance optimizations
- User experience improvements

**Key Features:**
- Refined AI guidance system
- Post-consultation note-taking
- Polished user interface
- Optimized app performance

**Success Criteria:**
- All features working reliably
- User interface polished and intuitive
- Performance optimized for smooth experience
- Internal testing completed successfully

#### Sprint 6: Launch Preparation (September 20 - October 3, 2025)
**Goal:** Final testing, legal compliance, and Google Play Store launch

**Deliverables:**
- User Acceptance Testing with trusted patient group
- Final bug fixes and app polishing
- Google Play Store assets preparation
- Privacy Policy and Terms of Service finalization
- App store submission and review

**Key Features:**
- Production-ready application
- Complete legal compliance documentation
- Professional app store presence
- User feedback integration

**Success Criteria:**
- UAT completed with positive feedback
- All compliance requirements met
- Google Play Store submission successful
- App ready for public launch

---

## Risk Management and Contingency Planning

### High-Risk Items with Mitigation
1. **Local Storage Complexity**
   - Risk: Data encryption and management challenges
   - Mitigation: Allocate extra time in Sprint 1-2, prototype early

2. **Compliance Requirements**
   - Risk: PDPA and medical disclaimer adequacy
   - Mitigation: Legal consultation by Sprint 4, buffer time in Sprint 6

3. **Solo Developer Burnout**
   - Risk: Overwhelming workload leading to delays
   - Mitigation: Realistic sprint planning, 20% time buffer, strict scope management

4. **Agentic Logic Complexity**
   - Risk: AI features taking longer than expected
   - Mitigation: Start with simple rules, enhance iteratively

### Timeline Buffer Management
- **Sprint Buffer:** Each sprint includes 20% time buffer
- **Testing Buffer:** Extra time allocated for Sprint 5 testing
- **Launch Buffer:** Sprint 6 includes extra time for app store approval process

### Scope Management
- **Core Features:** Must-have features identified and protected
- **Nice-to-Have:** Features that can be deferred to post-MVP
- **Feature Freeze:** After Sprint 4, no new features added

---

## Success Metrics and Milestones

### Sprint Success Metrics
Each sprint will be evaluated based on:
- Feature completion rate
- Code quality and test coverage
- User experience validation
- Performance benchmarks
- Compliance adherence

### Major Milestones
- **July 25:** Core infrastructure complete
- **August 8:** Basic data input working
- **August 22:** Preparation tools functional
- **September 5:** AI guidance implemented
- **September 19:** App fully tested and polished
- **October 3:** Google Play Store launch

### Launch Readiness Criteria
- [ ] All MVP features implemented and tested
- [ ] Privacy compliance fully verified
- [ ] Legal disclaimers reviewed and approved
- [ ] Google Play Store policies met
- [ ] User acceptance testing completed
- [ ] Performance requirements satisfied

---

## Post-Launch Phase (October 2025 - December 2025)

### Immediate Post-Launch (October 2025)
- Monitor app performance and user feedback
- Address any critical issues or bugs
- Analyze user adoption and usage patterns
- Prepare for first app update if needed

### Month 2-3 Post-Launch (November-December 2025)
- Gather comprehensive user feedback
- Plan Phase 2 features based on usage data
- Consider premium features development
- Evaluate success metrics and pivot if necessary

### Success Validation
- User adoption rates
- User retention and engagement
- Feedback on consultation improvement
- Technical performance metrics
- Compliance audit results