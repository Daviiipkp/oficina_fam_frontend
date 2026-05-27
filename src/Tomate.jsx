import { useState, useEffect } from 'react'

const SSE_URL = "https://oficina.daviipkp.org/tomateevents";

function Tomate() {
  const [winners, setWinners] = useState([])
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);

    eventSource.onopen = () => {
      setStatus('online');
    };

    eventSource.onerror = () => {
      setStatus('error');
    };

    eventSource.addEventListener("winner", (event) => {
      let newWinner = event.data;
      try {
        const data = JSON.parse(event.data);
        if (data.winner) newWinner = data.winner;
      } catch (parseError) {
        newWinner = event.data;
      }
      
      setWinners(prev => {
        if (!prev.includes(newWinner)) {
          return [...prev, newWinner];
        }
        return prev;
      });
    });

    eventSource.addEventListener("connected", () => {
      setStatus('online');
    });

    return () => eventSource.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-red-400 font-mono p-4 md:p-8 flex flex-col">
      <header className="border-b-2 border-red-900 pb-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-7xl md:text-9xl font-bold tracking-widest text-red-600">
            Desafio Tomate
          </h1>
          <p className="text-gray-500 mt-1">Status: <span className={`font-bold ${status === 'online' ? 'text-red-500' : 'text-red-800'}`}>{status.toUpperCase()}</span></p>
        </div>
        <div className="text-right border border-red-900 p-2 rounded bg-gray-900">
          <div className="text-xs text-gray-500">Vencedores</div>
          <div className="text-4xl font-extrabold text-red-100">{winners.length}</div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full">
          {winners.length === 0 ? (
            <div className="border-2 border-dashed border-gray-800 rounded-lg p-16 text-center text-gray-600 flex flex-col items-center justify-center mt-12 max-w-4xl mx-auto">
              <div className="w-16 h-16 border-4 border-red-900 border-t-red-600 rounded-full animate-spin mb-6"></div>
              <p className="text-2xl animate-pulse tracking-widest">AGUARDANDO VENCEDORES...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {winners.map((username, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900 border border-red-900 rounded-md p-4 hover:border-red-500 hover:bg-black transition-all group shadow-md hover:shadow-red-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-red-300 font-bold group-hover:bg-red-600 group-hover:text-black">
                      {username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-gray-600">VENCEDOR #{index + 1}</p>
                      <p className="text-lg font-semibold text-red-100 truncate group-hover:text-red-400">
                        {username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Tomate