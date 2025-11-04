import Link from 'next/link';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-white font-sans">
      {/* Sección Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-white-200 text-lg mb-3 tracking-wider">
            La Plataforma Líder en Optimización de Costos Empresariales
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8 drop-shadow-lg">
            Transformando Negocios con Nuestro ERP Basado en la Nube
          </h1>
          <p className="text-blue-200 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Impulsa la eficiencia, reduce gastos y optimiza tus operaciones con nuestra solución ERP integral.
          </p>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#9EC8B9', 
                '&:hover': {
                  backgroundColor: '#82B4A7',
                },
                color: '#1A2E4B',
                fontWeight: 'bold',
                padding: '12px 30px',
                fontSize: '1.1rem',
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Sección de Módulos */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-blue-100">Nuestros Módulos Clave</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {/* Tarjeta de Módulo Ejemplo */}
            {[
              { name: 'Contabilidad Financiera' },
              { name: 'Recursos Humanos' },
              { name: 'Adquisiciones Avanzadas' },
              { name: 'Inventario y Almacén' },
              { name: 'Gestión de Producción' },
              { name: 'Gestión de Transporte' },
              { name: 'Facturación de Ventas' },
            ].map((module, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-blue-800 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-600"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-blue-100 text-3xl">
                  {/* Aquí se puede poner un icono de Material-UI o SVG */}
                  {index === 0 && '📊'}
                  {index === 1 && '👥'}
                  {index === 2 && '🛒'}
                  {index === 3 && '📦'}
                  {index === 4 && '🏭'}
                  {index === 5 && '🚚'}
                  {index === 6 && '💰'}
                </div>
                <p className="text-blue-100 text-center text-lg font-semibold">{module.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Video/Testimonio (Adaptación) */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-blue-800 rounded-lg shadow-2xl p-8 md:p-12">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h2 className="text-4xl font-bold text-blue-100 mb-6">
              Impulsando el Futuro de tus Operaciones
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed">
              Descubre cómo nuestra plataforma ha transformado a cientos de empresas. Mira nuestro video introductorio para conocer todas las funcionalidades y beneficios que podemos ofrecerte.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            {/* Aquí se puede incrustar un reproductor de video (ej. YouTube) o una imagen con un botón de play */}
            <div className="w-full h-64 bg-blue-700 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden">
              <span className="text-white text-3xl font-bold">Video Placeholder</span>
              {/* Para un botón de play: */}
              <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all">
                <svg className="w-20 h-20 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 text-center text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Nombre de tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}