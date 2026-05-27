import { useState, useEffect } from 'react'

const SSE_URL = "https://oficina.daviipkp.org/checkinevents";

function Checkin() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const eventSource = new EventSource(SSE_URL);

    eventSource.onopen = () => {
      console.log("► Conexão SSE Estabelecida com a Oficina.");
      setStatus('online');
    };

    eventSource.onerror = (error) => {
      console.error("X Erro na conexão SSE:", error);
      setStatus('error');
    };

    eventSource.addEventListener("users", (event) => {
      try {
        const userDataArray = JSON.parse(event.data);
        console.log("Usuários recebidos:", userDataArray);
        setUsers(userDataArray);
      } catch (parseError) {
        console.error("X Erro ao processar JSON de usuários:", parseError, event.data);
      }
    });

    return () => {
      console.log("■ Fechando conexão SSE.");
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono p-4 md:p-8">
      <header className="border-b-2 border-green-800 pb-4 mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-9xl font-bold tracking-widest text-green-500">
            Oficina Python - CHECK-IN
          </h1>
          <p className="text-gray-500 mt-1">Status: <span className={`font-bold ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>{status.toUpperCase()}</span></p>
        </div>
        <div className="text-right border border-green-800 p-2 rounded">
          <div className="text-xs text-gray-500">Quantidade de check-ins</div>
          <div className="text-4xl font-extrabold text-green-100">{users.length}</div>
        </div>
      </header>
      <main>
        <section>
          <h2 className="text-xl mb-6 text-green-400 border-l-4 border-green-500 pl-3">
            Lista de nomes que fizeram check-in
          </h2>
          {users.length === 0 ? (
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center text-gray-600">
              <p className="text-5xl mb-4">∅</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {users.map((username, index) => (
                <div 
                  key={index} 
                  className="bg-gray-900 border border-green-900 rounded-md p-4 hover:border-green-500 hover:bg-black transition-all group shadow-md hover:shadow-green-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-950 border border-green-800 flex items-center justify-center text-green-300 font-bold group-hover:bg-green-500 group-hover:text-black">
                      {username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs text-gray-600">NOME</p>
                      <p className="text-lg font-semibold text-green-100 truncate group-hover:text-green-400">
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

export default Checkin