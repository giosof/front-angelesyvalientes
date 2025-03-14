import Image from "next/image";

export default function Login() {
  return (
    <div>
      <main>
        <div className="flex h-screen w-full">
          {/* Imagen a la izquierda */}
          <Image 
            className="w-2/3 h-full bg-cover bg-center" 
            src="/logo-corporacion.jpeg"
            alt="Logo Corporacion Angeles y Valientes"
            width={800}
            height={800}/>
          
          {/* Formulario a la derecha */}
          <div className="w-1/3 flex items-center justify-center">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
              <h2 className="text-2xl text-gray-700 font-bold mb-6 text-center">Iniciar Sesión</h2>
              <form action="/main">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Usuario</label>
                  <input className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" type="text" id="username" placeholder="Ingrese su usuario" required />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Clave</label>
                  <input className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" type="password" id="password" placeholder="Ingrese su clave" required />
                </div>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" type="submit">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
