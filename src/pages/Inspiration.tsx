
import { useEffect, useState } from "react";
import Papa from "papaparse";
import QuoteCard from "../components/QuoteCard";
import "./Inspiration.css";

/* Quote from the CSV dataset */
type Quote = {
  Quote: string;
  Author: string;
  Page_Number: string;
};

/* Quote from the API */
type ApiQuote = {
  quote: string;
  author: string;
};

function Inspiration() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [authorQuotes, setAuthorQuotes] = useState<ApiQuote[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [datasetLoading, setDatasetLoading] = useState(true);

  /* Loads the CSV dataset */
  useEffect(() => {
    async function loadDataset() {
      try {
        const response = await fetch(
          "/data/all_instagram_quotes_dataset.csv"
        );

        if (!response.ok) {
          throw new Error("Could not load the dataset");
        }

        const csvText = await response.text();

        const results = Papa.parse<Quote>(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const data = results.data.filter(
          (item) => item.Quote && item.Author
        );

        setQuotes(data);

        if (data.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * data.length
          );

          setCurrentQuote(data[randomIndex]);
        }
      } catch {
        setError("Could not load the quotes dataset.");
      }

      setDatasetLoading(false);
    }

    loadDataset();
  }, []);

  /* Selects a new random quote */
  function newRandomQuote() {
    if (quotes.length === 0) {
      return;
    }

    let randomIndex = Math.floor(
      Math.random() * quotes.length
    );

    if (quotes.length > 1 && currentQuote) {
      while (quotes[randomIndex] === currentQuote) {
        randomIndex = Math.floor(
          Math.random() * quotes.length
        );
      }
    }

    setCurrentQuote(quotes[randomIndex]);
    setAuthorQuotes([]);
    setShowMore(false);
    setError("");
  }

  /* Gets more quotes from the author */
  async function loadAuthorQuotes() {
    if (!currentQuote) {
      return;
    }

    if (showMore) {
      setShowMore(false);
      return;
    }

    setShowMore(true);

    if (authorQuotes.length > 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const author = encodeURIComponent(
        currentQuote.Author
      );

      const url =
        `https://quoteslate.vercel.app/api/quotes/random?authors=${author}&count=10`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Could not load author quotes");
      }

      const data = await response.json();

      const results: ApiQuote[] = Array.isArray(data)
        ? data
        : [data];

      /* Keeps quotes from the selected author */
      const filteredQuotes = results.filter(
        (item) =>
          typeof item.quote === "string" &&
          typeof item.author === "string" &&
          item.author.toLowerCase() ===
            currentQuote.Author.toLowerCase() &&
          item.quote.toLowerCase() !==
            currentQuote.Quote.toLowerCase()
      );

      /* Removes repeated quotes */
      const uniqueQuotes = filteredQuotes.filter(
        (item, index, array) =>
          array.findIndex(
            (other) => other.quote === item.quote
          ) === index
      );

      setAuthorQuotes(uniqueQuotes.slice(0, 5));
    } catch {
      setError("Could not load more quotes from this author.");
    }

    setLoading(false);
  }

  return (
    <section className="inspiration-page">
      {/* Page heading */}
      <header className="inspiration-header">
        <h1>Daily Inspiration</h1>
        <p>Find a little motivation for your day.</p>
      </header>

      {/* Dataset loading message */}
      {datasetLoading && <p>Loading quotes...</p>}

      {/* Main random quote */}
      {!datasetLoading && currentQuote && (
        <>
          <QuoteCard
            quote={currentQuote.Quote}
            author={currentQuote.Author}
          />

          {/* Quote buttons */}
          <div className="inspiration-buttons">
            <button
              className="inspiration-new-button"
              onClick={newRandomQuote}
              disabled={loading}
            >
              New Random Quote
            </button>

            <button
              className="inspiration-more-button"
              onClick={loadAuthorQuotes}
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : showMore
                  ? "Hide Additional Quotes"
                  : "Want to hear more from this author?"}
            </button>
          </div>
        </>
      )}

      {/* Error message */}
      {error && (
        <p className="inspiration-error">{error}</p>
      )}

      {/* Additional quotes from the API */}
      {showMore && currentQuote && (
        <section className="inspiration-results">
          <h2>More from {currentQuote.Author}</h2>

          {loading && <p>Loading additional quotes...</p>}

          {!loading &&
            !error &&
            authorQuotes.length === 0 && (
              <p>No additional quotes found for this author.</p>
            )}

          {!loading &&
            authorQuotes.map((item, index) => (
              <QuoteCard
                key={index}
                quote={item.quote}
                author={item.author}
              />
            ))}
        </section>
      )}
    </section>
  );
}

export default Inspiration;
