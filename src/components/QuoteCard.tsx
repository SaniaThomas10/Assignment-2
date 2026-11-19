
import "./QuoteCard.css";

function QuoteCard(props: {
  quote: string;
  author: string;
}) {
  return (
    <div className="quote-card">
      <p className="quote-card-text">"{props.quote}"</p>
      <p className="quote-card-author">— {props.author}</p>
    </div>
  );
}

export default QuoteCard;
