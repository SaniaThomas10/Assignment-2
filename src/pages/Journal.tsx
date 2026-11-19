
import { useEffect, useState } from "react";
import QuickJournal from "../components/QuickJournal";
import "./Journal.css";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  favorite: boolean;
};

const STORAGE_KEY = "lyfe-check-journal";

function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Load saved journal entries.
  function loadEntries() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      setEntries(Array.isArray(parsed) ? parsed : []);
    } catch {
      setEntries([]);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  // Delete a journal entry.
  function deleteEntry(id: string) {
    const updated = entries.filter((entry) => entry.id !== id);

    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Favorite or unfavorite an entry.
  function toggleFavorite(id: string) {
    const updated = entries.map((entry) =>
      entry.id === id
        ? { ...entry, favorite: !entry.favorite }
        : entry
    );

    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Filter entries by search, favorites, and date.
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase());

    const matchesFavorite =
      !showFavoritesOnly || entry.favorite;

    // Convert the saved date to the user's local date.
    const entryDate = new Date(entry.date);
    const year = entryDate.getFullYear();
    const month = String(entryDate.getMonth() + 1).padStart(2, "0");
    const day = String(entryDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const matchesDate =
      selectedDate === "" || formattedDate === selectedDate;

    return matchesSearch && matchesFavorite && matchesDate;
  });

  return (
    <section className="journal-page">
      <header className="journal-page-header">
        <h1>My Journal</h1>
        <p>
          Reflect on your thoughts, record your experiences,
          and revisit your personal growth.
        </p>
      </header>

      <div className="journal-layout">
        {/* Existing journal form */}
        <section className="journal-write-section">
          <QuickJournal />

          <button
            type="button"
            className="journal-refresh-button"
            onClick={loadEntries}
          >
            Refresh Journal Entries
          </button>
        </section>

        {/* Saved journal entries */}
        <section className="journal-history-section">
          <div className="journal-history-header">
            <h2>Journal History</h2>
            <span>{entries.length} entries</span>
          </div>

          {/* Journal search and filters */}
          <div className="journal-filters">
            <input
              type="search"
              placeholder="Search journal entries..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search journal entries"
            />

            {/* Filter journal entries by date */}
            <div className="journal-date-filter">
              <label htmlFor="journal-date">
                Filter by Date
              </label>

              <input
                id="journal-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />

              <button
                type="button"
                className="journal-clear-date"
                onClick={() => setSelectedDate("")}
                disabled={selectedDate === ""}
              >
                Clear Date
              </button>
            </div>

            {/* Show favorite entries only */}
            <label className="journal-favorites-filter">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(event) =>
                  setShowFavoritesOnly(event.target.checked)
                }
              />
              Favorites only
            </label>
          </div>

          {/* Message when no entries match */}
          {filteredEntries.length === 0 ? (
            <p className="journal-empty">
              {entries.length === 0
                ? "No journal entries yet. Write your first entry!"
                : "No journal entries match your filters."}
            </p>
          ) : (
            <div className="journal-entry-list">
              {filteredEntries.map((entry) => (
                <article className="journal-entry-card" key={entry.id}>
                  <div className="journal-entry-header">
                    <div>
                      <h3>{entry.title}</h3>
                      <time dateTime={entry.date}>
                        {new Date(entry.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    <button
                      type="button"
                      className="journal-favorite-button"
                      onClick={() => toggleFavorite(entry.id)}
                      aria-label={
                        entry.favorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {entry.favorite ? "★" : "☆"}
                    </button>
                  </div>

                  <p className="journal-entry-content">
                    {entry.content}
                  </p>

                  <button
                    type="button"
                    className="journal-delete-button"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Journal;
