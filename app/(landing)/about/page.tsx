import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

export default function AboutPage() {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Innovación Constante',
      description: 'Actualizaciones continuas con las últimas tecnologías del mercado.',
      color: '#3B82F6',
    },
    {
      icon: SecurityIcon,
      title: 'Seguridad Garantizada',
      description: 'Cifrado de datos de nivel empresarial y cumplimiento normativo.',
      color: '#10B981',
    },
    {
      icon: SpeedIcon,
      title: 'Alto Rendimiento',
      description: 'Procesamiento rápido incluso con grandes volúmenes de datos.',
      color: '#F59E0B',
    },
    {
      icon: CloudIcon,
      title: '100% en la Nube',
      description: 'Acceso desde cualquier lugar, en cualquier momento y dispositivo.',
      color: '#06B6D4',
    },
    {
      icon: SupportAgentIcon,
      title: 'Soporte 24/7',
      description: 'Equipo de expertos disponible para ayudarte cuando lo necesites.',
      color: '#8B5CF6',
    },
    {
      icon: AutoGraphIcon,
      title: 'Analytics Avanzado',
      description: 'Reportes en tiempo real y visualización de datos inteligente.',
      color: '#EC4899',
    },
  ];

  const stats = [
    { value: '500+', label: 'Empresas Confían en Nosotros' },
    { value: '99.9%', label: 'Tiempo de Actividad' },
    { value: '24/7', label: 'Soporte Disponible' },
    { value: '50+', label: 'Países Alcanzados' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-300 text-sm md:text-base font-medium mb-4 tracking-widest uppercase">
            Sobre Nosotros
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Construyendo el Futuro de la Gestión Empresarial
          </h1>
          <p className="text-slate-300 text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Somos un equipo apasionado de profesionales dedicados a transformar la manera en que las empresas operan mediante soluciones tecnológicas innovadoras.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="group relative p-10 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-2xl"></div>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <RocketLaunchIcon sx={{ fontSize: 40, color: '#3B82F6' }} />
              Nuestra Misión
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Empoderar a las empresas con herramientas de gestión inteligentes y accesibles que simplifiquen sus operaciones, optimicen recursos y potencien el crecimiento sostenible en la era digital.
            </p>
          </div>

          <div className="group relative p-10 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-purple-600 rounded-l-2xl"></div>
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <AutoGraphIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />
              Nuestra Visión
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Ser la plataforma ERP líder a nivel global, reconocida por su innovación continua, facilidad de uso y compromiso con el éxito de nuestros clientes en todos los sectores empresariales.
            </p>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-20 px-6 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-white">
            ¿Por Qué Elegirnos?
          </h2>
          <p className="text-slate-400 text-center text-lg mb-16 max-w-2xl mx-auto">
            Características que nos hacen únicos en el mercado
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative flex flex-col p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${feature.color}15`,
                      border: `2px solid ${feature.color}40`,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 36,
                        color: feature.color,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative text-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
              >
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </p>
                <p className="text-slate-300 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl border border-blue-500/30 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Negocio?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya están optimizando sus operaciones con nuestra plataforma ERP.
            </p>
            <Link href="/login">
              <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl overflow-hidden shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105">
                <span className="relative z-10">Acceder al Sistema</span>
                <ArrowForwardIcon className="relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Columna 1: Logo y descripción */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1" fill="#3B82F6" fillOpacity="0.9"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.9"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" fill="#60A5FA" fillOpacity="0.9"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" fill="#93C5FD" fillOpacity="0.9"/>
                  <circle cx="6.5" cy="6.5" r="1.5" fill="white"/>
                  <circle cx="17.5" cy="17.5" r="1.5" fill="white"/>
                </svg>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent block">
                    Los Esmesmeris
                  </span>
                  <span className="text-xs text-blue-400 font-medium">ERP</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Transformando negocios con tecnología ERP de última generación.
              </p>
            </div>

            {/* Columna 2: Enlaces rápidos */}
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Contacto */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>Email: contacto@losesmesmeris.com</li>
                <li>Teléfono: +57 (123) 456-7890</li>
                <li>Soporte 24/7 disponible</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-6 text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-300">Los Esmesmeris ERP</span>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
