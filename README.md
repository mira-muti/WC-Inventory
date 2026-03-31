# WC Inventory — Smart Booking & Inventory Management System

[![Netlify Status](https://api.netlify.com/api/v1/badges/d4f6c68a-954f-42f8-b172-9fb6e3a79b9f/deploy-status)](https://app.netlify.com/sites/wc-inventory/deploys)

> A full-stack system designed to optimize booking workflows, resource allocation, and operational visibility for service-based environments.

---

## 🚀 Overview

WC Inventory is a production-style system built to simulate real-world service operations.

It enables seamless coordination between **customers, staff, and resources**, while leveraging structured data and optimized queries to support efficient decision-making.

This project focuses on **system design, database optimization, and workflow automation** — not just frontend features.

---

## ✨ Key Features

- Booking creation with **conflict detection**
- Intelligent **staff assignment** based on availability & qualifications
- **Rescheduling engine** with smart alternatives
- Centralized management of **services, employees, and equipment**
- **Operational analytics dashboards**
  - Studio utilization
  - Employee workload
  - Booking trends
- Performance optimization using:
  - **SQL indexing**
  - **Efficient query design**
  - **Stored procedures**

---

## 🧠 System Design Highlights

- Designed using **ER modeling → relational schema transformation**
- Implemented **normalized database structure** for scalability
- Encapsulated business logic with **stored procedures**
- Built workflows that reflect **real operational constraints**
- Separated concerns across:
  - Data layer
  - Application logic
  - Frontend interface

---

## 🏗️ Architecture

```txt
web-collective-inventory/
├── new-frontend/        # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/             # Application logic (Java / services)
├── database/            # SQL schema, queries, procedures
```

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- React Query

### Backend & Data
- SQL (DB2 / PostgreSQL)
- Stored Procedures
- Indexing & Query Optimization

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)

### Run the Frontend

```bash
cd new-frontend
npm install
npm run dev
```

App will be available at:
```
http://localhost:3000
```

---

## 📊 What This Project Demonstrates

- Strong **database design (ER → relational schema)**
- Real-world **workflow modeling (booking, scheduling, allocation)**
- Backend logic implemented directly in **SQL**
- Performance-focused thinking via **indexing strategies**
- Ability to design **scalable, structured systems**

---

## 📈 Potential Improvements

- Full backend API layer (Node.js / Spring Boot)
- Role-based authentication system
- Cloud deployment (AWS / Docker)
- Advanced analytics & forecasting
- Real-time availability updates

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Open a pull request  

---

## 👤 Author

Built as part of a full-stack systems project focused on scalable service operations.
