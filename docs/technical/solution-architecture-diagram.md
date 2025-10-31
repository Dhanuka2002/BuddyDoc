# PatientPrep SL - Solution Architecture Diagram

## Architecture Overview

The PatientPrep SL architecture is a **multi-layered intelligent system** combining React Native frontend, Python FastAPI backend, additional SpringBoot/Node.js services, and sophisticated **Agentic AI** powered by Google Vertex AI, LangChain, and Neo4j ontology database with orchestration agents.

---

## 🏗️ High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S MOBILE DEVICE                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                     PATIENTPREP SL FRONTEND                         │  │
│  │                  (React Native + Expo Go)                          │  │
│  │                                                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │  │
│  │  │ Symptom      │  │ Medication   │  │ Question     │            │  │
│  │  │ Management   │  │ Management   │  │ Builder      │            │  │
│  │  │ Module       │  │ Module       │  │ Module       │            │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │  │
│  │                                                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │  │
│  │  │ Summary      │  │ Appointment  │  │ AI Chat      │            │  │
│  │  │ Generator    │  │ Manager      │  │ Interface    │            │  │
│  │  │ Module       │  │ Module       │  │ Module       │            │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘            │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                 STATE MANAGEMENT                            │  │  │
│  │  │  • Redux/Context API    • Real-time Updates                │  │  │
│  │  │  • Offline Sync         • Agent Communication              │  │  │
│  │  │  • Local Caching        • Session Management               │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                   LOCAL STORAGE                             │  │  │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │  │
│  │  │  │        ENCRYPTED LOCAL DATABASE (SQLite)            │  │  │  │
│  │  │  │  • User Sessions     • Chat History                 │  │  │  │
│  │  │  │  • Cached Responses  • Agent Interactions           │  │  │  │
│  │  │  │  • Offline Data      • Preferences                  │  │  │  │
│  │  │  │         🔒 AES-256 ENCRYPTION                       │  │  │  │
│  │  │  └──────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              HTTPS/WebSocket API
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PYTHON FASTAPI BACKEND                             │
│                        (Unicorn Web Server)                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                         API GATEWAY                                 │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Authentication│ │ Rate Limiting│ │ Request      │             │  │
│  │  │ Middleware    │ │ & Throttling │ │ Validation   │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ CORS Handling│ │ Error        │ │ Logging &    │             │  │
│  │  │              │ │ Management   │ │ Monitoring   │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      FASTAPI SERVICES                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ User         │  │ Consultation │  │ AI Agent     │             │  │
│  │  │ Management   │  │ Services     │  │ Orchestrator │             │  │
│  │  │ API          │  │ API          │  │ API          │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Health Data  │  │ Notification │  │ Analytics    │             │  │
│  │  │ Processing   │  │ Service      │  │ Service      │             │  │
│  │  │ API          │  │ API          │  │ API          │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC LAYER                            │  │
│  │  • Patient Data Processing   • Consultation Preparation            │  │
│  │  • Medical Question Analysis • Summary Generation                  │  │
│  │  • Appointment Scheduling    • Agent Communication                 │  │
│  │  • Privacy & PDPA Compliance • Real-time Updates                   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                            HTTPS/gRPC/WebSocket
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPRINGBOOT / NODE.JS BACKEND                            │
│                         (Microservices Layer)                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      SPRINGBOOT SERVICES                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Medical      │  │ Appointment  │  │ Integration  │             │  │
│  │  │ Knowledge    │  │ Management   │  │ Service      │             │  │
│  │  │ Service      │  │ Service      │  │ (External)   │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                       NODE.JS SERVICES                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Real-time    │  │ File         │  │ Email/SMS    │             │  │
│  │  │ Communication│  │ Processing   │  │ Service      │             │  │
│  │  │ (Socket.IO)  │  │ Service      │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                           API Calls & Message Queues
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC AI SYSTEM                                │
│                      (Google Cloud + Firebase)                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │               ORCHESTRATION AGENT (MASTER)                         │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                   LANGCHAIN CORE                           │  │  │
│  │  │  • Agent Framework      • Chain Management                │  │  │
│  │  │  • Task Orchestration   • Memory Management               │  │  │
│  │  │  • Decision Making      • Context Switching               │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                 ORCHESTRATOR LOGIC                        │  │  │
│  │  │  • Route User Queries to Appropriate Sub-Agents           │  │  │
│  │  │  • Coordinate Multi-Agent Workflows                       │  │  │
│  │  │  • Aggregate Responses from Sub-Agents                    │  │  │
│  │  │  • Manage Conversation Context & State                    │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                  │                                          │
│                            Coordinates                                      │
│                                  │                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                         SUB-AGENTS                                  │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │               MEDICAL CONSULTATION AGENT                   │   │ │
│  │  │  ┌─────────────────────────────────────────────────────┐   │   │ │
│  │  │  │              VERTEX AI INTEGRATION              │   │   │ │
│  │  │  │  • Gemini Pro/Ultra for Medical Analysis       │   │   │ │
│  │  │  │  • Medical-specific Fine-tuning                │   │   │ │
│  │  │  │  • Symptom Analysis & Classification            │   │   │ │
│  │  │  │  • Medical Question Generation                  │   │   │ │
│  │  │  └─────────────────────────────────────────────────────┘   │   │ │
│  │  │  ┌─────────────────────────────────────────────────────┐   │   │ │
│  │  │  │              SPECIALIZED FUNCTIONS              │   │   │ │
│  │  │  │  • Symptom-to-Question Mapping                 │   │   │ │
│  │  │  │  • Medical Terminology Processing              │   │   │ │
│  │  │  │  • Consultation Preparation Guidance           │   │   │ │
│  │  │  │  • Sri Lankan Medical Context Awareness        │   │   │ │
│  │  │  └─────────────────────────────────────────────────────┘   │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  │                                                                     │ │
│  │  ┌─────────────────────────────────────────────────────────────┐   │ │
│  │  │              APPOINTMENT SCHEDULING AGENT                  │   │ │
│  │  │  ┌─────────────────────────────────────────────────────┐   │   │ │
│  │  │  │              VERTEX AI INTEGRATION              │   │   │ │
│  │  │  │  • Natural Language Processing for Appointments│   │   │ │
│  │  │  │  • Schedule Optimization                        │   │   │ │
│  │  │  │  • Doctor-Patient Matching                     │   │   │ │
│  │  │  │  • Calendar Integration                         │   │   │ │
│  │  │  └─────────────────────────────────────────────────────┘   │   │ │
│  │  │  ┌─────────────────────────────────────────────────────┐   │   │ │
│  │  │  │              SPECIALIZED FUNCTIONS              │   │   │ │
│  │  │  │  • Availability Management                      │   │   │ │
│  │  │  │  • Reminder Generation                          │   │   │ │
│  │  │  │  • Appointment Optimization                     │   │   │ │
│  │  │  │  • Healthcare Provider Integration              │   │   │ │
│  │  │  └─────────────────────────────────────────────────────┘   │   │ │
│  │  └─────────────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                         GOOGLE VERTEX AI                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Gemini Pro   │  │ Custom       │  │ Medical      │             │  │
│  │  │ Model        │  │ Fine-tuned   │  │ Knowledge    │             │  │
│  │  │              │  │ Models       │  │ Base         │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Vector       │  │ Text         │  │ Classification│             │  │
│  │  │ Embeddings   │  │ Generation   │  │ Models       │             │  │
│  │  │ API          │  │ API          │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                     LANGCHAIN FRAMEWORK                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Agent        │  │ Chain        │  │ Memory       │             │  │
│  │  │ Executor     │  │ Management   │  │ Management   │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Tool         │  │ Prompt       │  │ Document     │             │  │
│  │  │ Integration  │  │ Templates    │  │ Loaders      │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                        FIREBASE SERVICES                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Cloud        │  │ Authentication│ │ Cloud        │             │  │
│  │  │ Functions    │  │ Service      │  │ Firestore    │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Pub/Sub      │  │ Cloud        │  │ Firebase     │             │  │
│  │  │ Messaging    │  │ Storage      │  │ ML           │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                              Graph Database API
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEO4J ONTOLOGY DATABASE                            │
│                        (Knowledge Graph System)                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                       MEDICAL ONTOLOGY                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                    KNOWLEDGE GRAPH                         │  │  │
│  │  │                                                            │  │  │
│  │  │    (Symptom)──[INDICATES]──>(Condition)──[TREATED_BY]──>  │  │  │
│  │  │        │                        │                         │  │  │
│  │  │   [PART_OF]              [REQUIRES]                      │  │  │
│  │  │        │                        │                         │  │  │
│  │  │    (BodyPart)            (Medication)──[HAS_SIDE_EFFECT] │  │  │
│  │  │        │                        │             │          │  │  │
│  │  │   [CONNECTED_TO]           [CONTRAINDICATED] [CAUSES]    │  │  │
│  │  │        │                        │             │          │  │  │
│  │  │    (System)               (Allergy)      (Symptom)       │  │  │
│  │  │                                                            │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  Node Types:                                                       │  │
│  │  • Symptoms (வலி, காய்ச்சல், தலைவலி - Tamil/English)                │  │
│  │  • Medical Conditions (நீரிழிவு, இரத்த அழுத்தம்)                     │  │
│  │  • Medications (மருந்துகள், பக்க விளைவுகள்)                           │  │
│  │  • Body Parts & Systems (உறுப்புகள், அமைப்புகள்)                     │  │
│  │  • Doctors & Specializations (வல்லுநர்கள்)                          │  │
│  │  • Treatments & Procedures (சிகிச்சை முறைகள்)                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                   SRI LANKAN MEDICAL CONTEXT                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │              LOCALIZED KNOWLEDGE BASE                      │  │  │
│  │  │  • Tamil/Sinhala Medical Terminology                       │  │  │
│  │  │  • Sri Lankan Healthcare System                            │  │  │
│  │  │  • Local Doctor Networks & Specializations                 │  │  │
│  │  │  • Regional Disease Patterns                               │  │  │
│  │  │  • Cultural Health Practices                               │  │  │
│  │  │  • Government Hospital Systems                             │  │  │
│  │  │  • Private Healthcare Providers                            │  │  │
│  │  │  • Insurance & Payment Methods                             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                      GRAPH OPERATIONS                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Cypher       │  │ Semantic     │  │ Pattern      │             │  │
│  │  │ Queries      │  │ Search       │  │ Matching     │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Relationship │  │ Graph        │  │ Knowledge    │             │  │
│  │  │ Traversal    │  │ Analytics    │  │ Inference    │             │  │
│  │  │              │  │              │  │              │             │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

                             EXTERNAL INTEGRATIONS
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Hospital     │  │ Doctor       │  │ Pharmacy     │  │ Insurance    │   │
│  │ Management   │  │ Scheduling   │  │ Systems      │  │ Providers    │   │
│  │ Systems      │  │ APIs         │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Government   │  │ Email/SMS    │  │ Payment      │  │ Health       │   │
│  │ Health APIs  │  │ Gateways     │  │ Gateways     │  │ Records      │   │
│  │              │  │              │  │              │  │ Systems      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Architecture Principles

### 1. **Multi-Agent Intelligence System**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ ORCHESTRATION   │    │ MEDICAL         │    │ APPOINTMENT     │
│ AGENT           │    │ CONSULTATION    │    │ SCHEDULING      │
│ (Master)        │    │ AGENT           │    │ AGENT           │
│                 │    │                 │    │                 │
│ • Coordinates   │◄──►│ • Symptom       │◄──►│ • Schedule      │
│ • Routes Tasks  │    │   Analysis      │    │   Optimization  │
│ • Manages State │    │ • Question Gen  │    │ • Doctor Match  │
│ • Aggregates    │    │ • Medical AI    │    │ • Reminders     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. **Intelligent Data Flow**
```
User Input → FastAPI → SpringBoot/Node.js → Orchestration Agent
     ↓                                              ↓
AI Analysis ← Neo4j Knowledge Graph ← Sub-Agents ← Vertex AI
     ↓                                              ↓
Frontend ← Real-time Updates ← LangChain ← Agent Responses
```

### 3. **Technology Stack Integration**
```
🏗️ Frontend: React Native + Expo Go
� API Layer: Python FastAPI + Unicorn
⚡ Microservices: SpringBoot + Node.js
🤖 AI Engine: Vertex AI + LangChain
� Knowledge: Neo4j Graph Database
☁️ Infrastructure: Google Firebase
```

---

## 🏗️ Detailed Component Architecture

### Frontend Architecture (React Native + Expo Go)

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Symptom     │ │ Medication  │ │ Question    │        │
│  │ Screens     │ │ Screens     │ │ Builder     │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ AI Chat     │ │ Appointment │ │ Settings    │        │
│  │ Interface   │ │ Manager     │ │ Dashboard   │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
├─────────────────────────────────────────────────────────┤
│                   NAVIGATION LAYER                      │
├─────────────────────────────────────────────────────────┤
│  • React Navigation (Stack + Tab + Drawer)             │
│  • Deep Linking Support                                │
│  • Agent Conversation Flow                             │
│  • Multi-Agent Navigation                              │
├─────────────────────────────────────────────────────────┤
│                   COMPONENT LAYER                       │
├─────────────────────────────────────────────────────────┤
│  • AI Chat Components       • Agent Response UI        │
│  • Medical Form Components  • Real-time Updates        │
│  • Knowledge Graph Viz     • Graph Relationship UI     │
│  • Agentic Flow Components • Multi-Agent Coordination  │
├─────────────────────────────────────────────────────────┤
│                   SERVICE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Agent       │ │ Real-time   │ │ Knowledge   │        │
│  │ Communication│ │ WebSocket   │ │ Graph       │        │
│  │ Service     │ │ Service     │ │ Service     │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ FastAPI     │ │ Auth        │ │ Cache       │        │
│  │ Client      │ │ Service     │ │ Manager     │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
├─────────────────────────────────────────────────────────┤
│                   STORAGE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  • Local SQLite Database (User Sessions, Chat History) │
│  • Agent State Management                              │
│  • Real-time Data Synchronization                      │
│  • Neo4j Query Results Caching                         │
└─────────────────────────────────────────────────────────┘
```

### Backend Architecture - FastAPI Layer (Python + Unicorn)

```
┌─────────────────────────────────────────────────────────┐
│                     API GATEWAY                         │
├─────────────────────────────────────────────────────────┤
│  • FastAPI Framework                                   │
│  • Unicorn ASGI Server                                │
│  • WebSocket Support (Real-time Agent Communication)   │
│  • OpenAPI Documentation                               │
├─────────────────────────────────────────────────────────┤
│                  MIDDLEWARE LAYER                       │
├─────────────────────────────────────────────────────────┤
│  • Authentication Middleware                           │
│  • CORS Handling                                       │
│  • Rate Limiting                                       │
│  • Request/Response Logging                            │
├─────────────────────────────────────────────────────────┤
│                   ROUTE HANDLERS                        │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Agent       │ │ Medical     │ │ User        │        │
│  │ Orchestration│ │ Consultation│ │ Management  │        │
│  │ Routes      │ │ Routes      │ │ Routes      │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Neo4j       │ │ Vertex AI   │ │ WebSocket   │        │
│  │ Graph       │ │ Integration │ │ Endpoints   │        │
│  │ Routes      │ │ Routes      │ │             │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
├─────────────────────────────────────────────────────────┤
│                   BUSINESS LOGIC                        │
├─────────────────────────────────────────────────────────┤
│  • Agent Orchestration Logic                           │
│  • LangChain Integration                                │
│  • Neo4j Query Processing                               │
│  • Vertex AI API Integration                            │
│  • Real-time Communication Management                   │
└─────────────────────────────────────────────────────────┘
```

### Backend Architecture - Microservices Layer (SpringBoot + Node.js)

```
┌─────────────────────────────────────────────────────────┐
│                   SPRINGBOOT SERVICES                   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Medical     │ │ Knowledge   │ │ Integration │        │
│  │ Knowledge   │ │ Graph       │ │ Service     │        │
│  │ Service     │ │ Management  │ │ (External)  │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                         │
│  • JPA/Hibernate for Data Persistence                  │
│  • Spring Security for Authentication                   │
│  • Spring Cloud for Microservices Communication        │
│  • Netflix Hystrix for Circuit Breaker                 │
├─────────────────────────────────────────────────────────┤
│                     NODE.JS SERVICES                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ Real-time   │ │ File        │ │ Notification│        │
│  │ Communication│ │ Processing  │ │ Service     │        │
│  │ (Socket.IO) │ │ Service     │ │             │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                         │
│  • Express.js Framework                                │
│  • Socket.IO for Real-time Communication               │
│  • Bull Queue for Background Jobs                      │
│  • Passport.js for Authentication                      │
└─────────────────────────────────────────────────────────┘
```

### Agentic AI Architecture (Vertex AI + LangChain + Firebase)

```
┌─────────────────────────────────────────────────────────┐
│                ORCHESTRATION AGENT                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐│
│  │              LANGCHAIN ORCHESTRATOR                 ││
│  │                                                     ││
│  │  • Agent Executor Framework                         ││
│  │  • Chain Management (Sequential/Parallel)          ││
│  │  • Memory Management (Conversation Context)        ││
│  │  • Tool Integration (Neo4j, Vertex AI, APIs)       ││
│  │  • Decision Tree Logic                              ││
│  │  • Multi-Agent Coordination                         ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  Master Agent Responsibilities:                         │
│  • Route user queries to appropriate sub-agents        │
│  • Coordinate multi-step workflows                     │
│  • Aggregate and synthesize responses                  │
│  • Maintain conversation context and state             │
│  • Handle agent handoffs and escalations               │
├─────────────────────────────────────────────────────────┤
│                    SUB-AGENTS                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐│
│  │           MEDICAL CONSULTATION AGENT               ││
│  │                                                     ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │           VERTEX AI INTEGRATION             │   ││
│  │  │                                             │   ││
│  │  │  • Gemini Pro/Ultra Models                 │   ││
│  │  │  • Medical-specific Fine-tuning            │   ││
│  │  │  • Symptom Analysis & Classification       │   ││
│  │  │  • Medical Question Generation             │   ││
│  │  │  • Treatment Recommendation Logic          │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │         NEO4J KNOWLEDGE INTEGRATION        │   ││
│  │  │                                             │   ││
│  │  │  • Medical Ontology Queries                │   ││
│  │  │  • Symptom-Condition Mapping               │   ││
│  │  │  • Drug Interaction Analysis               │   ││
│  │  │  • Sri Lankan Medical Context              │   ││
│  │  │  • Relationship Traversal                  │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  Specialized Functions:                             ││
│  │  • Tamil/Sinhala Language Support                  ││
│  │  • Cultural Medical Practices Integration          ││
│  │  • Local Healthcare System Knowledge               ││
│  │  • Government Hospital Integration                 ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │          APPOINTMENT SCHEDULING AGENT              ││
│  │                                                     ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │           VERTEX AI INTEGRATION             │   ││
│  │  │                                             │   ││
│  │  │  • Natural Language Processing             │   ││
│  │  │  • Schedule Optimization Algorithms        │   ││
│  │  │  • Doctor-Patient Matching                 │   ││
│  │  │  • Calendar Integration Logic              │   ││
│  │  │  • Appointment Conflict Resolution         │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  ┌─────────────────────────────────────────────┐   ││
│  │  │         EXTERNAL SYSTEM INTEGRATION        │   ││
│  │  │                                             │   ││
│  │  │  • Hospital Management Systems             │   ││
│  │  │  • Doctor Scheduling APIs                  │   ││
│  │  │  • Payment Gateway Integration             │   ││
│  │  │  • Insurance Verification                  │   ││
│  │  │  • SMS/Email Notification Systems          │   ││
│  │  └─────────────────────────────────────────────┘   ││
│  │                                                     ││
│  │  Specialized Functions:                             ││
│  │  • Multi-language Support (Tamil/Sinhala/English)  ││
│  │  • Sri Lankan Healthcare Provider Network          ││
│  │  • Government Hospital Scheduling                  ││
│  │  • Private Practice Integration                    ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Neo4j Knowledge Graph Architecture

```
┌─────────────────────────────────────────────────────────┐
│                NEO4J ONTOLOGY DATABASE                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐│
│  │              MEDICAL KNOWLEDGE GRAPH               ││
│  │                                                     ││
│  │    (Patient)──[HAS_SYMPTOM]──>(Symptom)            ││
│  │        │                         │                 ││
│  │   [TAKES_MEDICATION]        [INDICATES]            ││
│  │        │                         │                 ││
│  │    (Medication)──[TREATS]──>(Condition)            ││
│  │        │                         │                 ││
│  │   [HAS_SIDE_EFFECT]         [REQUIRES]             ││
│  │        │                         │                 ││
│  │    (SideEffect)         (Specialist)──[WORKS_AT]──>││
│  │                                │                   ││
│  │                         (Hospital/Clinic)          ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  Node Categories:                                       │
│  • Medical Entities (Symptoms, Conditions, Treatments) │
│  • Healthcare Providers (Doctors, Specialists, Clinics)│
│  • Medications (Drugs, Side Effects, Interactions)     │
│  • Anatomical (Body Parts, Systems, Organs)            │
│  • Cultural/Local (Sri Lankan Medical Practices)       │
│  • Administrative (Insurance, Payments, Scheduling)    │
├─────────────────────────────────────────────────────────┤
│                 SRI LANKAN LOCALIZATION                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐│
│  │            MULTILINGUAL SUPPORT                     ││
│  │                                                     ││
│  │  Tamil Nodes:                                       ││
│  │  • வலி (Pain) ──[TRANSLATION]──> (Pain)            ││
│  │  • காய்ச்சல் (Fever) ──[EQUIVALENT]──> (Fever)      ││
│  │  • மருந்து (Medicine) ──[RELATES_TO]──> (Drug)      ││
│  │                                                     ││
│  │  Sinhala Nodes:                                     ││
│  │  • රෝග (Disease) ──[TRANSLATION]──> (Disease)       ││
│  │  • වෛද්‍යවරුන් (Doctor) ──[EQUIVALENT]──> (Doctor)    ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │          LOCAL HEALTHCARE INTEGRATION               ││
│  │                                                     ││
│  │  Government Hospitals:                              ││
│  │  • Colombo National Hospital                        ││
│  │  • Teaching Hospital Kandy                          ││
│  │  • Provincial Hospitals                             ││
│  │                                                     ││
│  │  Private Healthcare:                                ││
│  │  • Nawaloka Hospitals                               ││
│  │  • Asiri Hospital Group                             ││
│  │  • Private Medical Practitioners                    ││
│  │                                                     ││
│  │  Insurance Integration:                             ││
│  │  • Sri Lankan Insurance Companies                   ││
│  │  • Government Health Schemes                        ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                   GRAPH OPERATIONS                      │
├─────────────────────────────────────────────────────────┤
│  • Cypher Query Processing                              │
│  • Real-time Graph Traversal                           │
│  • Semantic Search across Medical Entities             │
│  • Pattern Matching for Diagnosis Suggestions          │
│  • Relationship Analysis for Drug Interactions         │
│  • Path Finding for Referral Networks                  │
│  • Graph Analytics for Medical Insights                │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Advanced Data Flow Patterns

### 1. Multi-Agent Consultation Flow
```
User Question → FastAPI → Orchestration Agent → Decision Tree
     ↓
   Route to Medical Agent → Vertex AI Analysis → Neo4j Query
     ↓
   Generate Medical Response → Return to Orchestrator → Format Response
     ↓
   Send to Frontend → Display to User → Store in Local Cache
```

### 2. Appointment Scheduling Flow
```
User Request → FastAPI → Orchestration Agent → Scheduling Agent
     ↓
   Vertex AI Processing → Neo4j Doctor Query → External API Calls
     ↓
   Check Availability → Optimization Algorithm → Book Appointment
     ↓
   Confirmation → Notification Service → Update Frontend
```

### 3. Real-time Agent Communication
```
Frontend WebSocket ←→ FastAPI WebSocket ←→ Agent Orchestrator
     ↓                                            ↓
   Live Updates        ←→         Agent State Management
     ↓                                            ↓
   User Interface      ←→         Multi-Agent Coordination
```

### 4. Knowledge Graph Integration
```
User Symptom Input → Medical Agent → Neo4j Cypher Query
     ↓
   Graph Traversal → Relationship Analysis → Medical Context
     ↓
   Vertex AI Enhancement → LangChain Processing → Response Generation
```

---

## 🛡️ Security & Scalability Architecture

### Security Layers
```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND SECURITY                      │
│  • React Native Security Best Practices                │
│  • Secure Storage for Tokens                           │
│  • API Key Management                                  │
│  • WebSocket Security                                  │
├─────────────────────────────────────────────────────────┤
│                  API LAYER SECURITY                     │
│  • FastAPI Security Middleware                         │
│  • JWT Token Validation                                │
│  • Rate Limiting & DDoS Protection                     │
│  • Request Validation & Sanitization                   │
├─────────────────────────────────────────────────────────┤
│                MICROSERVICES SECURITY                   │
│  • SpringBoot Security Framework                       │
│  • Node.js Helmet.js Security                          │
│  • Service-to-Service Authentication                    │
│  • Circuit Breaker Patterns                            │
├─────────────────────────────────────────────────────────┤
│                   AI LAYER SECURITY                     │
│  • Vertex AI IAM Controls                              │
│  • LangChain Security Practices                        │
│  • Agent Communication Encryption                      │
│  • Knowledge Base Access Controls                      │
├─────────────────────────────────────────────────────────┤
│                DATABASE LAYER SECURITY                  │
│  • Neo4j Authentication & Authorization                │
│  • Encrypted Data Transmission                         │
│  • Graph Database Access Controls                      │
│  • Audit Logging & Monitoring                          │
└─────────────────────────────────────────────────────────┘
```

### Performance & Scalability
```
Frontend:
• React Native Performance Optimization
• Lazy Loading & Code Splitting
• Local Caching Strategies
• Efficient State Management

FastAPI Backend:
• Asynchronous Request Processing
• Connection Pooling
• Caching Layers (Redis)
• Load Balancing

Microservices:
• Horizontal Scaling
• Auto-scaling Policies
• Load Distribution
• Health Checks & Monitoring

AI & Knowledge:
• Vertex AI Auto-scaling
• Neo4j Clustering
• LangChain Optimization
• Agent Pool Management
```

---

This updated architecture reflects your sophisticated multi-layered system with Python FastAPI, SpringBoot/Node.js microservices, advanced Agentic AI using Vertex AI and LangChain, and Neo4j as the intelligent knowledge graph for Sri Lankan medical context. The orchestration agent coordinates two specialized sub-agents for medical consultation and appointment scheduling, creating a truly intelligent healthcare preparation system.

