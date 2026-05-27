import { useState, useEffect } from 'react'

const SSE_URL = "https://oficina.daviipkp.org/melanciaevents";

function Melancia() {
  const [winner, setWinner] = useState(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);

    eventSource.onopen = () => {
      console.log("► Conexão SSE Estabelecida com Melancia Events.");
      setStatus('online');
    };

    eventSource.onerror = (error) => {
      console.error("X Erro na conexão SSE:", error);
      setStatus('error');
    };

    eventSource.addEventListener("winner", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.winner) setWinner(data.winner);
        else setWinner(data);
      } catch (parseError) {
        setWinner(event.data); 
      }
    });

    eventSource.addEventListener("connected", () => {
      setStatus('online');
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono p-4 md:p-8 flex flex-col">
      <header className="border-b-2 border-emerald-800 pb-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-7xl md:text-9xl font-bold tracking-widest text-emerald-500">
            Desafio Melancia
          </h1>
          <p className="text-gray-500 mt-1">Status: <span className={`font-bold ${status === 'online' ? 'text-emerald-500' : 'text-red-500'}`}>{status.toUpperCase()}</span></p>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full max-w-4xl">
          {!winner ? (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-16 text-center text-gray-600 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-900 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
              <p className="text-2xl animate-pulse tracking-widest">AGUARDANDO RESULTADO...</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-emerald-500 rounded-lg p-12 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] transform transition-all scale-105">
              <h2 className="text-xl mb-2 text-emerald-600 tracking-widest border-b border-emerald-900 pb-4 inline-block px-8">
                VENCEDOR DO DESAFIO
              </h2>
              <div className="mt-8">
                <p className="text-6xl md:text-8xl font-black text-emerald-100 break-words drop-shadow-lg">
                  {winner}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Melancia