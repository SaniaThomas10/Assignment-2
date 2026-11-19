
import DailyTasks from "../components/DailyTasks";
import "./Todo.css";

// To-Do page for LYFE CHECK.
function Todo() {
  return (
    <section className="todo-page">

      {/* Page heading */}
      <header className="todo-page-header">
        <h1>My To-Do List</h1>
        <p>
          Stay organized, manage your daily responsibilities,
          and keep track of your progress.
        </p>
      </header>

      {/* Reuse the DailyTasks component */}
      <div className="todo-page-content">
        <DailyTasks />
      </div>

    </section>
  );
}

export default Todo;
