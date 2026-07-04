# Finalny flow produktu - Notatka z nagrania Loom

[Link do nagrania (Loom)](https://www.loom.com/share/bcab2fbe3c21484099cc8bdc88c6c9f4)

## Główne założenia systemu
- System ma za zadanie **ewaluować wszystkich kandydatów (rozwiązania)** wygenerowanych przez różne metody analityczne i na podstawie przyjętych kryteriów wyłonić ostateczne **Top 1**.
- Aktualnie zakłada się użycie dwóch metod: **TRIZ** oraz **Five Whys** (5x Dlaczego). Każda z nich generuje po 3 propozycje rozwiązania problemu, co daje łącznie **6 pomysłów** do ewaluacji.
- Architektura powinna być elastyczna – w przyszłości narzędzie może obsługiwać znacznie więcej metod (np. 8–15), z których każda będzie generować swoje "Top 3".

## Krok po kroku - Flow działania
1. **User Input** – proces rozpoczyna się od danych podanych przez użytkownika.
2. **Ekstrakcja problemu** – z wejścia użytkownika wydobywany jest główny problem (tzw. _core problem_).
3. **Generowanie rozwiązań** – zdefiniowany problem trafia do metod analitycznych:
   - **TRIZ** – generuje 3 propozycje rozwiązań.
   - **Five Whys** – generuje kolejne 3 propozycje rozwiązań.
4. **Final Scoring (Ocena końcowa)** – wszystkie wygenerowane pomysły trafiają do ostatecznej ewaluacji na podstawie zdefiniowanych przez Was kryteriów. To Wasze zadanie, aby ten system oceny dobrze przemyśleć i zaimplementować.
5. **Wybór Top 1** – wynikiem całego procesu ma być bezwzględnie wskazanie jednego, ostatecznie zwycięskiego rozwiązania.

## Wskazówki dotyczące Ewaluacji (Evals)
Podczas weryfikacji poprawnego działania poszczególnych komponentów systemu, autor nagrania zaleca sprawdzenie następujących elementów:
- **Core problem i komunikacja z LLM**: Czy główny problem został poprawnie wyodrębniony i przekazany (request) do modelu LLM? Czy model zwrócił sensowny wynik?
- **Zgodność z metodyką**:
  - Czy metoda **TRIZ** wykonała się poprawnie i zgodnie z jej teoretycznymi założeniami?
  - Czy w metodzie **Five Whys** faktycznie padło 5 kolejnych pytań "dlaczego"?
  - Jeśli użyto innych metod – czy ich specyficzne kryteria zostały należycie spełnione.
- **Scoring**: Czy stworzony przez Was mechanizm oceniający działa poprawnie i czy ostateczny wynik na nim bazuje?
- **Finalny output**: Ostateczny test sprawdzający, czy system zawsze potrafi na końcu wyłonić i "wypluć" jeden zwycięski pomysł.
