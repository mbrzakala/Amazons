---
version: 1
id: "4"
status: "todo"
priority: "high"
assignee: null
dueDate: null
created: "2026-07-04T10:56:00.000Z"
modified: "2026-07-04T10:56:00.000Z"
completedAt: null
labels: ["backend", "stage-4"]
attachments: []
order: "a3"
---

# Stage 4: Backend & Logic (Logika i Integracja LLM)

**Harmonogram:** 13:45 - 15:15
**Cel:** Logika NestJS, baza Sequelize PostgreSQL, integracja pętli LLM oraz customowego serwera TRIZ MCP.

### Zadania i Kroki:
- [ ] **Krok 1: NestJS Feature Module** - moduły NestJS do obsługi analiz i TRIZ.
- [ ] **Krok 2: API Contract (OpenAPI/Swagger)** - endpointy Swagger z pełną walidacją DTO.
- [ ] **Krok 3: Docker Postgres + Sequelize** - baza w Dockerze, Sequelize ORM, migracje danych.
- [ ] **Krok 4: Integracja Kontraktu** - powiązanie frontendu HTTP z endpointami backendowymi.
- [ ] **Krok 5: Ewaluacja i Scoreboardy** - logika punktowania pomysłów (wagi i ocena 1-5).
- [ ] **Krok 6: Pętle Agentowe z Tool Calling** - stopniowe, przejrzyste wywoływanie LLM (sprzeczność -> TRIZ -> alternatywy -> ewaluacja).
- [ ] **Krok 7: Prompt Engineering & Context** - optymalizacja promptów pod TRIZ.
