'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, { useState } from 'react';
import { useGeminiChat } from '../hooks/useGeminiChat';

export default function Home() {
  const { aiResponse, isLoading, sendMessage, sendCondenseMessage, resetConvo, history, error } = useGeminiChat();
  const [prompt, setPrompt] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleClick = async () => {
    await sendMessage(prompt);
    setPrompt('');
    
  };

  const condensePrompt = "Summarize this conversation in one paragraph"
  const condenseConvo = async ()=> {
   await sendCondenseMessage(condensePrompt);
     setPrompt('');
  }

   const reset = async ()=> {
        setPrompt('');
      resetConvo();

  }


  return (
     <div className={styles.page}>
        <main className={styles.main}>
           <div className={styles.center}>
              <Image
                 className={styles.logo}
                 src="/next.svg"
                 alt="Next.js logo"
                 width={180}
                 height={38}
                 priority
              />
           </div>
           <section>
              <h1 className={`${styles.center} ${styles.h1}`}>Ask AI</h1>

              <h2 className={`${styles.center} ${styles.h2}`}> Using Gemini API</h2>

              <div>
                 <input
                    className={`${styles.input} ${styles.center}`}
                    value={prompt}
                    onChange={handleInputChange}
                 ></input>
              </div>

              {error && <div className="error">{error}</div>}
              {!prompt ? (
                 <ol>
                    <li>
                       Ask Gemini AI anything and click <code>button</code>.
                    </li>
                    <li>See your response above.</li>
                 </ol>
              ) : (
                 <div>
                    <br />
                    <br />
                 </div>
              )}

              <div className={`${styles.center}`}>
                 {isLoading ? (
                    'Loading'
                 ) : (
                    <button
                       className={`${styles.center}`}
                       onClick={handleClick}
                       title="Submit AI Request"
                    >
                       Click me to get AI response
                    </button>
                 )}
              </div>

              <div className={styles.response}>
                 <div>
                    {aiResponse.split('**').map((item, index) => {
                       return (
                          <div key={index} className={styles.response}>
                             {item}
                          </div>
                       );
                    })}
                 </div>
              </div>
           </section>

           <div className={styles.ctas}>
              <a
                 className={styles.primary}
                 href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                 target="_blank"
                 rel="noopener noreferrer"
              >
                 <Image
                    className={styles.logo}
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={20}
                    height={20}
                 />
                 Deploy to Vercel
              </a>
              <a
                 href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                 target="_blank"
                 rel="noopener noreferrer"
                 className={styles.secondary}
              >
                 Read Next.js docs
              </a>
           </div>
           <div>
              <h2 className="center">History</h2>
              <button
                 onClick={() => condenseConvo()}
                 title="Reset Context, but keep summary"
              >
                 Condense conversation to reset context
              </button>
              <button onClick={() => reset()} title="Reset">
                 Start new chat
              </button>
              <div className=" history">
                 <ol>
                    {history.map((item, index) => (
                       <React.Fragment key={index}>
                          <li>
                             <strong>{item?.role}</strong> <br />
                             {item?.parts[0]?.text}
                          </li>
                          {item?.role === 'model' && <br />}
                       </React.Fragment>
                    ))}
                 </ol>
              </div>
           </div>
        </main>

        <footer className={styles.footer}>
           <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
           >
              <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
              Learn
           </a>
           <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
           >
              <Image
                 aria-hidden
                 src="/window.svg"
                 alt="Window icon"
                 width={16}
                 height={16}
              />
              Examples
           </a>
           <a
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
           >
              <Image
                 aria-hidden
                 src="/globe.svg"
                 alt="Globe icon"
                 width={16}
                 height={16}
              />
              Go to nextjs.org →
           </a>
        </footer>
     </div>
  );
}
