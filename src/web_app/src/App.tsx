import { useState } from 'react';
import type { FormEvent } from 'react';
import { askFinanceQuestion } from './services/financeApi';
import './App.css';

const agents = [
  { id: 'finance', name: 'Finance Q&A', icon: '☷' },
  { id: 'portfolio', name: 'Portfolio Analysis', icon: '◷' },
  { id: 'market', name: 'Market Analysis', icon: '↗' },
  { id: 'goals', name: 'Goal Planning', icon: '⚑' },
  { id: 'news', name: 'News Synthesizer', icon: '▤' },
  { id: 'tax', name: 'Tax Education', icon: '▥' },
];

type Message = {
  id: string;
  text: string;
  agent: string;
  role: 'user' | 'assistant';
};

function App() {
  const [activeAgent, setActiveAgent] = useState(agents[0].id);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');

  const selectedAgent =
    agents.find((agent) => agent.id === activeAgent) ?? agents[0];

 function startConversation() {
  if (isLoading) return;

  setMessages([]);
  setQuestion('');
  setError('');
}

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const text = question.trim();

  if (!text || isLoading) return;

  if (activeAgent !== 'finance') {
    setError('Select Finance Q&A to ask a question.');
    return;
  }

  setError('');
  setIsLoading(true);
  setQuestion('');

  setMessages((previous) => [
    ...previous,
    {
      id: crypto.randomUUID(),
      text,
      agent: 'Finance Q&A',
      role: 'user',
    },
  ]);

  try {
    const answer = await askFinanceQuestion(text);

    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        text: answer,
        agent: 'Finance Q&A',
        role: 'assistant',
      },
    ]);
  } catch (error: unknown) {
    setError(
      error instanceof Error
        ? error.message
        : 'Unable to connect to the backend.',
    );
    setQuestion(text);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Finnie home">
          <span className="brand-mark">✧</span>
          <span>finnie</span>
          <small>AI</small>
        </a>

        <button
          className="new-conversation"
          type="button"
          onClick={startConversation}
        >
          <span aria-hidden="true">＋</span>
          New conversation
        </button>

        <nav className="agent-navigation" aria-label="Finance agents">
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              className={`agent-button ${
                activeAgent === agent.id ? 'active' : ''
              }`}
              aria-pressed={activeAgent === agent.id}
              onClick={() => setActiveAgent(agent.id)}
            >
              <span className="agent-icon" aria-hidden="true">
                {agent.icon}
              </span>
              {agent.name}
            </button>
          ))}
        </nav>

        <section className="conversation-history">
          <h2>Your conversations</h2>
          <p>Your conversations will appear here.</p>
        </section>

        <div className="sidebar-bottom">
          <section className="learning-card">
            <span className="leaf-icon" aria-hidden="true">♧</span>
            <h2>A little learning, every day.</h2>
            <p>
              There’s no rush. Build your confidence at your own pace.
            </p>
          </section>

          <div className="profile">
            <span className="avatar">VK</span>
            <div>
              <strong>Vandna</strong>
              <span>Curious beginner</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            Your learning space
            <span className="breadcrumb-divider">/</span>
            <strong>Home</strong>
          </div>
          <span className="topbar-description">
            Your AI finance assistant
          </span>
        </header>

        <main className="main-content">
          <section className="welcome-section">
            <div className="welcome-copy">
              <p className="eyebrow">Welcome back, Vandna</p>
              <h1>What do you want to learn today?</h1>
              <p className="welcome-description">
                Choose an agent from the sidebar or just ask a question.
              </p>
            </div>

            <div className="plant-card" aria-hidden="true">
              <svg viewBox="0 0 280 180" fill="none">
                <ellipse
                  cx="140" cy="155" rx="78" ry="10"
                  fill="#d8ceba"
                />
                <path
                  d="M135 120V48M105 120V72M170 120V61"
                  stroke="#71845c" strokeWidth="4"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="122" cy="63" rx="11" ry="23"
                  transform="rotate(-40 122 63)" fill="#9aaa77"
                />
                <ellipse
                  cx="149" cy="48" rx="10" ry="24"
                  transform="rotate(30 149 48)" fill="#7f9463"
                />
                <ellipse
                  cx="94" cy="80" rx="12" ry="20"
                  transform="rotate(-45 94 80)" fill="#a9b889"
                />
                <ellipse
                  cx="117" cy="88" rx="10" ry="20"
                  transform="rotate(40 117 88)" fill="#8c9d6c"
                />
                <ellipse
                  cx="157" cy="79" rx="10" ry="21"
                  transform="rotate(-35 157 79)" fill="#a0af7c"
                />
                <ellipse
                  cx="182" cy="67" rx="10" ry="20"
                  transform="rotate(35 182 67)" fill="#899b69"
                />
                <path
                  d="M74 119H206L197 143Q140 164 83 143Z"
                  fill="#e1d6be"
                  stroke="#c6b99d"
                  strokeWidth="2"
                />
                <ellipse
                  cx="140" cy="119" rx="66" ry="13"
                  fill="#b0a17b"
                />
              </svg>
            </div>
          </section>

         <section
  className="message-list"
  aria-label="Conversation"
  aria-live="polite"
>
  {messages.map((message) => (
    <article
      key={message.id}
      className={`message-card ${message.role}`}
    >
      <span className="message-agent">
        {message.role === 'user' ? 'You' : 'Finnie · Finance Q&A'}
      </span>

      <p>{message.text}</p>
    </article>
  ))}

  {isLoading && <p role="status">Finnie is thinking…</p>}
</section>

{error && (
  <p className="error-message" role="alert">
    {error}
  </p>
)}
          <form className="question-form" onSubmit={handleSubmit}>
            <span className="input-mark" aria-hidden="true">✧</span>

            <label className="sr-only" htmlFor="question">
              Ask {selectedAgent.name}
            </label>

            <input
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="What would you like to understand about money?"
              maxLength={4000}
            />

            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !question.trim()}
              aria-label={`Send question to ${selectedAgent.name}`}
            >
              ↑
            </button>
          </form>

          <p className="education-note">
            ♡ &nbsp; Here to help you learn, not to give financial advice.
            AI can make mistakes.
          </p>
        </main>
      </div>
    </div>
  );
}

export default App;