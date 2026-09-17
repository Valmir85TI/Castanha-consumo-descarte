import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, MapPin, Trash2, CheckCircle, AlertCircle, RefreshCcw,
  User, Clock, ShieldCheck, Lock, LogIn, LogOut
} from 'lucide-react';
import './App.css';

// Ficheiros de imagem fornecidos
const LOGO_URL = 'LogoCastanha.png';
const FAVICON_URL = 'Castanha.ico';
const POWERED_BY = 'powered by Valmir Oliveira Ramos';

const PoweredBy = ({ className = '' }) => (
  <p className={`text-[10px] text-slate-500 font-semibold tracking-[0.18em] ${className}`}>
    {POWERED_BY}
  </p>
);

// --- COMPONENTE DE LOGIN ---
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, pswd: password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.detail || "Erro ao realizar login.");
      }
    } catch {
      setError("Erro de conexão com o servidor. Verifique se o backend está a correr.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 flex items-center justify-center p-3 sm:p-4 safe-area-page">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-white/5 rounded-2xl">
              <img 
                src={LOGO_URL} 
                alt="Logo Castanha" 
                className="h-16 w-auto object-contain"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Castanha'}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter text-center">
              SISTEMA <span className="text-red-500 italic">CASTANHA</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-3">Acesso Restrito</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Login</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full min-h-14 bg-black border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-base text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  placeholder="Introduza o seu ID"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Senha (PIN)</label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-14 bg-black border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-base text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  placeholder="••••••"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tight disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="animate-spin" size={20} /> : <LogIn size={20} />}
              Autenticar
            </button>
          </form>

          {error && (
            <div className="mt-8 bg-red-950/30 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 text-red-200 animate-in slide-in-from-top-2">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium leading-tight">{error}</p>
            </div>
          )}
        </div>
        <div className="bg-slate-800/30 p-4 text-center border-t border-slate-800">
          <PoweredBy className="mb-2" />
          <p className="text-[9px] leading-relaxed text-slate-600 font-bold uppercase tracking-wider sm:tracking-widest">Departamento de TI Supermercado Castanha • 2026</p>
        </div>
      </div>
    </div>
  );
};

const SYSTEM_CONFIG = {
  insumo: {
    title: 'INSUMO',
    documentTitle: 'Castanha Insumo',
    endpoint: '/consumo',
    destinationLabel: 'Destino da Operação',
    quantityLabel: 'Quantidade a Consumir',
    confirmLabel: 'Confirmar Envio',
    errorLabel: 'Erro ao registrar insumo.',
    footerLabel: 'SISTEMA DE INSUMO INTERNO v2.5.0',
    tableLabel: 'Tabela de Insumo',
    tableUrl: 'http://192.168.0.35:80/Consumo_Castanha/consumo.php',
    confirmIcon: CheckCircle,
    selectorIcon: CheckCircle,
    selectorDescription: 'Acessar a tela atual de insumo interno.',
    styles: {
      accentText: 'text-red-500',
      accentBg: 'bg-red-600',
      accentHover: 'hover:bg-red-500',
      accentBorder: 'border-red-500',
      accentFocus: 'focus:border-red-600',
      loginFocus: 'focus:border-red-500 focus:ring-red-500',
      iconFocus: 'group-focus-within:text-red-500',
      sectorActive: 'bg-red-600 border-red-500 text-white shadow-lg',
      badge: 'bg-red-600 text-white',
      iconText: 'text-red-500',
      logoutHover: 'hover:bg-red-900/40 hover:text-red-400',
      selectorRing: 'hover:border-red-500/70 hover:shadow-red-950/30',
    },
  },
  consumo: {
    title: 'CONSUMO',
    documentTitle: 'Castanha Consumo',
    endpoint: '/consumo',
    destinationLabel: 'Destino da Opera\u00e7\u00e3o',
    quantityLabel: 'Quantidade a Consumir',
    confirmLabel: 'Confirmar Envio',
    errorLabel: 'Erro ao registrar consumo.',
    footerLabel: 'SISTEMA DE CONSUMO INTERNO v2.5.0',
    tableLabel: 'Tabela de Consumo',
    tableUrl: 'http://192.168.0.35:80/Consumo_Castanha/consumo.php',
    confirmIcon: CheckCircle,
    selectorIcon: CheckCircle,
    selectorDescription: 'Acessar a tela de consumo interno.',
    styles: {
      accentText: 'text-red-500',
      accentBg: 'bg-red-600',
      accentHover: 'hover:bg-red-500',
      accentBorder: 'border-red-500',
      accentFocus: 'focus:border-red-600',
      loginFocus: 'focus:border-red-500 focus:ring-red-500',
      iconFocus: 'group-focus-within:text-red-500',
      sectorActive: 'bg-red-600 border-red-500 text-white shadow-lg',
      badge: 'bg-red-600 text-white',
      iconText: 'text-red-500',
      logoutHover: 'hover:bg-red-900/40 hover:text-red-400',
      selectorRing: 'hover:border-red-500/70 hover:shadow-red-950/30',
    },
  },
  descarte: {
    title: 'DESCARTE',
    documentTitle: 'Castanha Descarte',
    endpoint: '/descarte',
    destinationLabel: 'Destino do Descarte',
    quantityLabel: 'Quantidade a Descartar',
    confirmLabel: 'Confirmar Descarte',
    errorLabel: 'Erro ao registrar descarte.',
    footerLabel: 'SISTEMA DE DESCARTE INTERNO v2.0.0',
    tableLabel: 'Tabela de Descarte',
    tableUrl: 'http://192.168.0.35/Castanha_descarte/descarte.php',
    confirmIcon: Trash2,
    selectorIcon: Trash2,
    selectorDescription: 'Acessar a nova tela de lançamento de descarte.',
    styles: {
      accentText: 'text-amber-400',
      accentBg: 'bg-amber-500',
      accentHover: 'hover:bg-amber-400',
      accentBorder: 'border-amber-400',
      accentFocus: 'focus:border-amber-500',
      loginFocus: 'focus:border-amber-500 focus:ring-amber-500',
      iconFocus: 'group-focus-within:text-amber-400',
      sectorActive: 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg',
      badge: 'bg-amber-400 text-slate-950',
      iconText: 'text-amber-400',
      logoutHover: 'hover:bg-amber-900/40 hover:text-amber-300',
      selectorRing: 'hover:border-amber-400/70 hover:shadow-amber-950/30',
    },
  },
};

const SYSTEMS_BY_USER_TYPE = {
  adm: ['insumo', 'consumo', 'descarte'],
  lider_insumo: ['insumo', 'descarte'],
  lider_descarte: ['descarte'],
};

const getAccessibleSystems = (tipo) => (
  SYSTEMS_BY_USER_TYPE[String(tipo ?? '').trim().toLowerCase()] || []
);

const SystemSelector = ({ user, onSelect, onLogout }) => {
  const accessibleSystems = getAccessibleSystems(user.tipo);

  return (
  <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 flex items-center justify-center p-3 sm:p-5 lg:p-8 safe-area-page">
    <div className="w-full max-w-5xl min-w-0 animate-in fade-in zoom-in-95 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 lg:mb-8 bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl gap-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="bg-white p-2 rounded-xl shadow-inner">
            <img src={LOGO_URL} alt="Logo Castanha" className="h-10 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black tracking-tighter">SELECIONE O SISTEMA</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider sm:tracking-widest min-w-0">
              <ShieldCheck size={12} className="text-green-500 shrink-0" /> <span className="truncate">Operador: {user.nome}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full sm:w-auto min-h-12 px-5 py-3 bg-slate-800 hover:bg-red-900/40 hover:text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-slate-700"
        >
          <LogOut size={16} /> Encerrar
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {Object.entries(SYSTEM_CONFIG)
          .filter(([key]) => accessibleSystems.includes(key))
          .map(([key, config]) => {
          const SelectorIcon = config.selectorIcon;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`group bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-left shadow-2xl transition-all active:scale-[0.98] ${config.styles.selectorRing}`}
            >
              <div className="flex items-start justify-between gap-4 sm:gap-6 min-w-0">
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.28em] mb-3 sm:mb-4">Módulo operacional</p>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white break-words">
                    Sistema de <span className={config.styles.accentText}>{config.title}</span>
                  </h2>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider sm:tracking-widest leading-relaxed">
                    {config.selectorDescription}
                  </p>
                </div>
                <div className={`shrink-0 p-3 sm:p-4 rounded-2xl bg-slate-800 border border-slate-700 ${config.styles.iconText}`}>
                  <SelectorIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
            </button>
          );
        })}
      </main>

      <footer className="mt-6 sm:mt-8 py-5 border-t border-slate-900 text-center opacity-60 hover:opacity-100 transition-opacity">
        <PoweredBy />
      </footer>
    </div>
  </div>
  );
};

// --- COMPONENTE DE OPERAÇÃO ---
const OperationScreen = ({ user, system, onLogout }) => {
  const config = SYSTEM_CONFIG[system];
  const styles = config.styles;
  const ConfirmIcon = config.confirmIcon;
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState('ROTISSERIE');
  const [quantidade, setQuantidade] = useState('');
  const inputRef = useRef(null);

  // Configuração dinâmica do Favicon e Title
  useEffect(() => {
    document.title = config.documentTitle;
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = FAVICON_URL;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [config.documentTitle]);

  // Mantém o foco automático em computadores/leitores, sem reabrir o teclado no celular.
  useEffect(() => {
    if (user && !product) {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      if (!hasFinePointer) return;

      const timer = setInterval(() => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
        }
      }, 1500);
      return () => clearInterval(timer);
    }
  }, [user, product]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!barcode) return;
    
    // Processamento de código de balança (ex: 2338300344776)
    // Se começar com '2' e tiver 13 dígitos, extrai os 4 dígitos após o '2'
    const scannedBarcode = barcode;
    let codigoBusca = barcode;
    if (barcode.startsWith('2') && barcode.length === 13) {
      codigoBusca = parseInt(barcode.substring(1, 5), 10).toString();
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/products/${codigoBusca}`);
      if (!response.ok) throw new Error('Produto não localizado na Bluesoft.');
      const data = await response.json();
      setProduct(data);
      
      if (scannedBarcode.startsWith('2') && scannedBarcode.length === 13 && data.embalagemKey === 'KG' && data.precoEmVigor > 0) {
        const precoEtiqueta = parseInt(scannedBarcode.substring(5, 12), 10) / 100;
        const qtdCalculada = precoEtiqueta / data.precoEmVigor;
        setQuantidade(qtdCalculada.toFixed(3).replace('.', ','));
      } else {
        setQuantidade('');
      }

    } catch (err) {
      setError(err.message);
      setProduct(null);
      setQuantidade('');
    } finally {
      setLoading(false);
      setBarcode('');
    }
  };

  /**
   * Envia os dados da operação para o backend e registra no banco de dados.
   */
  const handleEnviarOperacao = async () => {
    if (!product || !quantidade) return;
    
    const qtd = parseFloat(quantidade.replace(',', '.'));
    if (isNaN(qtd) || qtd <= 0) {
      setError("Por favor, insira uma quantidade válida.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_produto: product.gtinPrincipal,
          gtin: product.gtinPrincipal,
          produtoKey: product.produtoKey,
          codigo_interno: String(product.produtoKey),
          produto: product.descricao,
          quantidade: qtd,
          setor: sector,
          usuario: user.nome,
          tipo: product.embalagemKey
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || config.errorLabel);
      }
      
      // Limpa os campos após registro bem-sucedido
      setProduct(null);
      setBarcode('');
      setQuantidade('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      // Foca no input do código de barras novamente após um breve intervalo
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto p-3 sm:p-5 lg:p-8 safe-area-page">
        
        {/* Header Profissional */}
        <header className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 lg:mb-8 bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl gap-4">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <img src={LOGO_URL} alt="Logo Castanha" className="h-10 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black tracking-tighter flex flex-wrap items-center gap-x-2">
                CASTANHA <span className={styles.accentText}>{config.title}</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider sm:tracking-widest min-w-0">
                <ShieldCheck size={12} className="text-green-500 shrink-0" /> <span className="truncate">Operador: {user.nome}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:shrink-0">
            <div className="hidden md:block text-right pr-4 border-r border-slate-800">
              <p className="text-[10px] font-bold text-slate-600 uppercase">Sessão Ativa</p>
              <p className="text-xs font-mono">{new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
            <button 
              onClick={onLogout}
              className={`w-full sm:w-auto min-h-12 px-5 py-3 bg-slate-800 ${styles.logoutHover} rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-slate-700`}
            >
              <LogOut size={16} /> Encerrar
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Painel Esquerdo: Entrada */}
          <div className="lg:col-span-5 flex flex-col h-full min-w-0 gap-4">
            <div className="bg-slate-900 p-4 sm:p-6 xl:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-800 shadow-2xl flex-grow flex flex-col justify-center">
              <form onSubmit={handleSearch} className="space-y-5 sm:space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aguardando Scanner</label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={13}
                      pattern="[0-9]*"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value.replace(/[^0-9]/g, '').slice(0, 13))}
                      placeholder="Escaneie um produto..."
                      className={`w-full min-h-16 bg-black border-2 border-slate-800 rounded-2xl py-4 sm:py-5 pl-12 sm:pl-14 pr-12 sm:pr-14 text-base sm:text-xl xl:text-2xl font-mono ${styles.accentFocus} focus:ring-0 outline-none transition-all placeholder:text-slate-700`}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={24} />
                    {loading && <RefreshCcw className={`absolute right-5 top-1/2 -translate-y-1/2 ${styles.iconText} animate-spin`} size={24} />}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{config.destinationLabel}</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['ROTISSERIE', 'PADARIA', 'FRIOS', 'CONFEITARIA', 'SUSHI'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSector(s)}
                        className={`min-h-12 px-2 py-3 sm:py-4 rounded-xl text-[9px] sm:text-[10px] font-black tracking-wide sm:tracking-widest transition-all border-2 ${
                          sector === s 
                          ? styles.sectorActive 
                          : 'bg-slate-800 border-transparent text-slate-500 hover:bg-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button type="submit" className="w-full min-h-14 bg-blue-600 hover:bg-blue-500 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 transition-all">
                     Consultar
                  </button>
                  <button 
                    type="button"
                    onClick={() => window.open(config.tableUrl, '_blank')}
                    className="w-full min-h-14 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black text-slate-300 uppercase tracking-tighter flex items-center justify-center gap-3 transition-all border border-slate-700"
                  >
                     {config.tableLabel}
                  </button>
                </div>
              </form>
            </div>
            
            {error && (
              <div className="bg-red-950/30 border border-red-500/50 p-5 rounded-2xl flex items-center gap-4 text-red-400 animate-in slide-in-from-left-4">
                <AlertCircle size={24} className="shrink-0" />
                <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}
          </div>

          {/* Painel Direito: Resultado */}
          <div className="lg:col-span-7 h-full min-w-0">
            {product ? (
              <div className="h-full bg-white text-slate-950 rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col min-w-0">
                <div className="bg-slate-900 p-5 sm:p-8 flex justify-between items-start gap-4 shrink-0 min-w-0">
                  <div className="min-w-0">
                    <span className={`px-3 py-1 ${styles.badge} text-[9px] font-black uppercase rounded-full tracking-widest`}>Bluesoft</span>
                    <h2 className="text-lg sm:text-2xl font-black text-white uppercase mt-3 sm:mt-4 leading-tight break-words">{product.descricao}</h2>
                  </div>
                  <div className="bg-white p-2 rounded-lg shrink-0 ml-4">
                    <img src={FAVICON_URL} alt="Mini Logo" className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 xl:p-8 flex-grow flex flex-col justify-between gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 border-b border-slate-100 pb-5 sm:pb-6">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Unidade de medida</p>
                      <p className="text-3xl xl:text-4xl font-black text-blue-700 tracking-tighter break-all">{product.embalagemKey}</p>
                    </div>
                    <div className="text-left sm:text-right space-y-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">GTIN Principal</p>
                      <p className="text-2xl sm:text-3xl xl:text-4xl font-black text-blue-700 tracking-tighter break-all">{product.gtinPrincipal}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center shadow-inner gap-5 min-w-0">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Código Interno</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl xl:text-4xl font-black text-blue-700 tracking-tighter break-all">
                          {product.produtoKey}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right space-y-2 min-w-0">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-1">Setor</p>
                      <div className="inline-flex max-w-full items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                        <MapPin size={22} className={`${styles.iconText} shrink-0`} />
                        <span className="text-xl sm:text-2xl xl:text-4xl font-black text-blue-700 tracking-tighter uppercase break-all">{sector}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center justify-start sm:justify-end gap-1">
                        <Clock size={10} /> Sincronizado agora
                      </p>
                    </div>
                  </div>

                  {/* Formulário de Quantidade e Envio */}
                  <div className="bg-slate-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-end shadow-inner gap-4">
                    <div className="space-y-2 w-full sm:w-auto sm:flex-1">
                      <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">{config.quantityLabel}</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={8}
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value.replace(/[^0-9.,]/g, ''))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = parseFloat(quantidade.replace(',', '.'));
                            if (!loading && quantidade && !isNaN(val) && val > 0) {
                              handleEnviarOperacao();
                            }
                          }
                        }}
                        placeholder="Ex: 1"
                        className="w-full sm:max-w-48 min-h-16 bg-white border-2 border-slate-300 rounded-2xl py-4 sm:py-5 px-5 sm:px-6 text-2xl sm:text-3xl font-black font-mono text-center text-slate-800 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <button
                      onClick={handleEnviarOperacao}
                      disabled={loading || !quantidade || parseFloat(quantidade.replace(',', '.')) <= 0 || isNaN(parseFloat(quantidade.replace(',', '.')))}
                      className="w-full sm:w-auto min-h-16 bg-green-600 hover:bg-green-500 disabled:bg-slate-400 disabled:scale-100 text-white py-4 sm:py-5 px-5 lg:px-7 xl:px-10 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all active:scale-95"
                    >
                      {loading ? <RefreshCcw className="animate-spin" size={24} /> : <ConfirmIcon size={24} />}
                      {config.confirmLabel}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[280px] sm:min-h-[380px] lg:min-h-[450px] p-6 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-slate-800 text-slate-700 transition-all hover:border-slate-700">
                <div className="bg-slate-800/30 p-6 sm:p-10 rounded-full mb-5 sm:mb-8">
                  <img src={LOGO_URL} alt="Logo Castanha" className="h-16 opacity-10 grayscale" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Aguardando Scanner</h3>
                <p className="text-xs max-w-[280px] text-center font-medium opacity-40 uppercase tracking-widest leading-loose">
                  Por favor, posicione o código de barras em frente ao leitor para iniciar a consulta.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-5 sm:gap-6 opacity-60 hover:opacity-100 transition-opacity text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <img src={LOGO_URL} alt="Logo Footer" className="h-6 w-auto" />
             <div className="h-4 w-px bg-slate-800 mx-2" />
             <p className="text-[9px] font-bold uppercase tracking-[0.2em]">{config.footerLabel}</p>
          </div>
          <PoweredBy />
          <div className="flex gap-4">
             <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">API Online</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">DB Conectado</span>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setSelectedSystem(null);
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setSelectedSystem(null);
  };

  useEffect(() => {
    document.title = selectedSystem
      ? SYSTEM_CONFIG[selectedSystem].documentTitle
      : 'Sistema Castanha';

    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = FAVICON_URL;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [selectedSystem]);

  useEffect(() => {
    if (!user) return;

    const TIMEOUT_MS = 180 * 1000;
    let inactivityTimer = setTimeout(logout, TIMEOUT_MS);

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logout, TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [user, logout]);

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (!selectedSystem) {
    return (
      <SystemSelector
        user={user}
        onSelect={setSelectedSystem}
        onLogout={logout}
      />
    );
  }

  return (
    <OperationScreen
      user={user}
      system={selectedSystem}
      onLogout={logout}
    />
  );
};

export default App;
