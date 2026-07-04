# 01-Discovery: User Story Map w naszym przypadku

Dokument ten opisuje analizę tablicy Miro (etap `01-discovery`) oraz propozycję adaptacji tego podejścia (User Story Map) do naszego systemu rozwiązywania problemów wynalazczych za pomocą metod TRIZ i LLM (projekt **Amazons**).

---

## 1. Analiza tablicy Miro (stan zastany)

Na udostępnionej tablicy Miro znajduje się szablon **User Story Mapping** zawierający podział na:
*   **User activities** (Aktywności użytkownika – najwyższy poziom)
*   **User tasks** (Zadania użytkownika – średni poziom szczegółowości)
*   **Releases** (Wydania: Release 1 / MVP, Release 2, Release 3)

### Zaobserwowana treść
Tablica zawiera hybrydę dwóch aplikacji:
1.  **Aplikacja edukacyjna (zarządzanie nauką do sprawdzianów)** – wprowadzona w języku polskim w pierwszych trzech kolumnach:
    *   **Aktywności:** Zarządzanie planem nauki, Zarządzanie postępem, Funkcje społecznościowe.
    *   **Zadania:** Wyznaczenie celu, Śledzenie postępu, Dzielenie się danymi o nauce.
    *   **Wydania (R1/R2):** Dodanie daty sprawdzianu, przypomnienia, potwierdzenie nauki, wgląd w czas do sprawdzianu, pochwalenie się wynikiem.
2.  **Szablon aplikacji bankowej** – pozostałości w języku angielskim w kolumnach 4–8 (funkcje depozytów, przelewów, kalkulatorów, historii transakcji, wyszukiwania bankomatów itp.).

Naszym celem jest **zastąpienie tego szablonu kompletnym procesem dla naszego systemu TRIZ**.

---

## 2. Propozycja User Story Map dla naszego systemu (TRIZ & LLM Engine)

Nasz system ma za zadanie:
1. Przyjąć opis problemu wynalazczego (np. jednego z 7 problemów SDG z `THE CONTEST HACKATHON TASK.md`).
2. Sformułować sprzeczność techniczną (parametr ulepszany vs pogarszany).
3. Wygenerować min. 3 rozwiązania za pomocą matrycy sprzeczności TRIZ.
4. Wygenerować min. 3 rozwiązania za pomocą alternatywnej metody (np. 5 Whys, SCAMPER).
5. Dokonać ewaluacji rozwiązań i wybrać najlepsze, prezentując pełny ścieżkę decyzyjną (reasoning trail) w przejrzysty sposób.

Poniżej znajduje się propozycja mapowania tego procesu na strukturę aktywności, zadań i wydań.

### Struktura Kolumn i Wierszy (User Story Map)

| Aktywność (User Activity) | Zadanie (User Task) | Release 1 (MVP) | Release 2 | Release 3 |
| :--- | :--- | :--- | :--- | :--- |
| **1. Definiowanie problemu** | Wprowadzenie opisu wyzwania | Ręczne wpisanie tekstu problemu w formularzu | Wybór jednego z 7 predefiniowanych problemów SDG | Pobieranie dodatkowego kontekstu (pliki raportów SDG, linki zewnętrzne) |
| | Sformułowanie sprzeczności technicznej | Automatyczna identyfikacja sprzeczności przez LLM (prosty prompt) | Edytowalny formularz pozwalający użytkownikowi skorygować parametry ulepszane/pogarszane | Wizualny interaktywny edytor sprzeczności (diagram relacji) |
| **2. Generowanie pomysłów** | Rozwiązanie za pomocą TRIZ | Automatyczne zapytanie LLM o matrycę sprzeczności TRIZ i wygenerowanie 3 pomysłów | Interaktywny podgląd matrycy TRIZ (wybór parametrów i zasad wynalazczych w UI) | Integracja z dedykowanym serwerem MCP TRIZ (`pytriz`) dla zaawansowanej optymalizacji |
| | Rozwiązanie metodą alternatywną | Wygenerowanie 3 pomysłów prostą metodą (np. Burza mózgów LLM) | Integracja ustrukturyzowanej metody (np. 5 Whys z drzewem przyczynowo-skutkowym w UI) | Możliwość wyboru spośród wielu metod (SCAMPER, Analiza Morfologiczna) |
| **3. Ocena i Wybór** | Ewaluacja kandydatów | Automatyczna ocena punktowa (skala 1-5) każdego pomysłu przez LLM na podstawie opisu | Formularz ręcznej korekty ocen oraz definiowanie wag kryteriów przez użytkownika | Zaawansowany panel decyzyjny (Wielokryteriowa Analiza Decyzyjna – MCDA) |
| | Prezentacja wyboru | Wyświetlenie najlepszego rozwiązania wraz z krótkim uzasadnieniem | Interaktywny graf/diagram (użycie `ng-diagram`) pokazujący ścieżkę decyzyjną | Porównanie alternatywnych ścieżek decyzyjnych obok siebie (wariantowanie) |
| **4. Prezentacja i Audyt** | Śledzenie ścieżki (Reasoning Trail) | Podgląd kolejnych kroków w formie logu tekstowego (Problem -> Sprzeczność -> Pomysły -> Ocena -> Wybór) | Podział na dedykowane, inspectowalne podstrony dla każdego kroku (zgodnie z OpenAPI/Swagger) | Generowanie raportu PDF dla inwestora/działu R&D |
| | Współdzielenie | Zapis historii analiz w lokalnej bazie danych (Sequelize + Postgres w Dockerze) | Udostępnianie unikalnego linku do przeprowadzonej analizy | Eksport wyników bezpośrednio do zewnętrznych narzędzi (np. tablica Miro, Google Sheets) |

---

## 3. Powiązanie z architekturą i deliverablami hackathonu

Aby ten proces był zgodny z resztą wytycznych (`PRODUCT.md` oraz `agent_doc/`):

1.  **Frontend (Angular + Signal State):**
    *   Wszystkie kroki (kreator analizy) powinny być zarządzane reaktywnym stanem opartym na sygnałach (`SignalState`).
    *   Prezentacja ścieżki decyzyjnej oraz drzewa 5 Whys powinna wykorzystywać komponenty z `ng-diagram` w celu uzyskania wysokich punktów za **Design** i **Usability**.
2.  **Backend (NestJS + Sequelize + Swagger):**
    *   Każdy kroku procesu (identyfikacja, generowanie TRIZ, generowanie alternatywne, ewaluacja, zapis) musi posiadać dedykowany endpoint w NestJS z pełną dokumentacją Swagger.
    *   Operacje muszą być "inspectable", co oznacza, że backend powinien logować i przechowywać pośrednie stany LLM, aby użytkownik mógł prześledzić każdy krok.
3.  **TRIZ MCP Server (`pytriz`):**
    *   Algorytm matrycy sprzeczności i zasad wynalazczych będzie wspierany przez customowy serwer MCP uruchomiony lokalnie/w chmurze, który dostarcza poprawne parametry TRIZ.
4.  **Ewaluacja (Day 4 Deliverable):**
    *   Nasza aplikacja bezpośrednio realizuje cel Dnia 4 – raport z ewaluacji ścieżki od problemu do metryk i wyboru.

---

## 4. Rekomendowane następne kroki w procesie Discovery

Zgodnie z naszymi krokami walidacyjnymi w `agent_doc/1-discovery/`:
1.  **Krok 1 (Idea):** Zatwierdźmy jednozdaniowy opis produktu (np. *"System wspomagania R&D automatyzujący proces TRIZ i alternatywnej analizy problemów SDG za pomocą LLM"*).
2.  **Krok 2 (Persona):** Określmy inżyniera R&D lub analityka SDG jako naszą główną personę.
3.  **Krok 3 (Problem Statement):** Sformułujmy problem wg szablonu: *"Inżynier R&D potrzebuje sposobu na szybką, ustrukturyzowaną ewaluację pomysłów TRIZ, ponieważ ręczna analiza matrycy sprzeczności i SDG zajmuje zbyt wiele czasu."*
4.  **Krok 4 (Process Map):** Zaprojektujmy Event Storming procesu w oparciu o powyższą tabelę.
5.  **Krok 5 (MVP Scope):** Skupmy się w pierwszej kolejności na wdrożeniu pełnej ścieżki (Release 1) bez zaawansowanych wizualizacji grafowych.
6.  **Krok 6 (Kanban):** Wygenerujmy zadania do `todo.md` za pomocą `npx kanban-lite`.
