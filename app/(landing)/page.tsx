import Link from 'next/link';
import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function LandingPage() {
  const modules = [
    { name: 'Contabilidad Financiera', icon: AccountBalanceIcon, color: '#60A5FA' },
    { name: 'Recursos Humanos', icon: GroupsIcon, color: '#34D399' },
    { name: 'Adquisiciones Avanzadas', icon: ShoppingCartIcon, color: '#F59E0B' },
    { name: 'Inventario y Almacén', icon: InventoryIcon, color: '#8B5CF6' },
    { name: 'Gestión de Producción', icon: FactoryIcon, color: '#EC4899' },
    { name: 'Gestión de Transporte', icon: LocalShippingIcon, color: '#10B981' },
    { name: 'Facturación de Ventas', icon: ReceiptIcon, color: '#F97316' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sección Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[75vh] text-center px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-300 text-sm md:text-base font-medium mb-4 tracking-widest uppercase">
            Plataforma Empresarial de Nueva Generación
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Transformando Negocios con Nuestro ERP en la Nube
          </h1>
          <p className="text-slate-300 text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Impulsa la eficiencia, reduce costos y optimiza tus operaciones con nuestra solución ERP integral diseñada para el futuro.
          </p>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#3B82F6',
                '&:hover': {
                  backgroundColor: '#2563EB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
                },
                color: '#FFFFFF',
                fontWeight: '600',
                padding: '14px 40px',
                fontSize: '1.125rem',
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Sección de Módulos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-white">
            Módulos Integrados
          </h2>
          <p className="text-slate-400 text-center text-lg mb-16 max-w-2xl mx-auto">
            Soluciones completas para cada área de tu empresa
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  className="group relative flex flex-col items-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${module.color}15`,
                      border: `2px solid ${module.color}40`
                    }}
                  >
                    <Icon 
                      sx={{ 
                        fontSize: 40, 
                        color: module.color,
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                      }} 
                    />
                  </div>
                  <p className="text-slate-100 text-center text-base font-semibold leading-snug">
                    {module.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección de Video/Demostración */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="lg:w-1/2 p-10 lg:p-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Impulsando el Futuro de tus Operaciones
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                Descubre cómo nuestra plataforma ha transformado a cientos de empresas. 
              </p>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Mira nuestro video introductorio para conocer todas las funcionalidades y beneficios que podemos ofrecerte.
              </p>
            </div>
            
            <div className="lg:w-1/2 p-10 lg:p-16 flex justify-center items-center">
              <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <span className="text-slate-300 text-xl md:text-2xl font-semibold">Video Demo</span>
                </div>
                <button className="absolute inset-0 flex items-center justify-center hover:bg-black/30 transition-all duration-300 group">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                    <PlayCircleOutlineIcon 
                      sx={{ 
                        fontSize: { xs: 48, md: 60 }, 
                        color: 'white' 
                      }} 
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm md:text-base">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-300">ERP Los Esmeraldes</span>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}