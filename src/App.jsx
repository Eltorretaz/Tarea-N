import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Building2,
  Rocket,
  Gavel,
  CheckCircle2,
  Globe,
  UserCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Scale,
  CreditCard,
  Landmark,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración de la API de Gemini
  const apiKey = "AIzaSyBbDi5hB8hYIv6jCMrJK8Dbi-g-Kmpm5wo"
  const model = "gemini-2.5-flash-preview-09-2025";

  // Función de llamada a la API con Exponential Backoff (MANDATORIO)
  const callGemini = async (prompt, systemPrompt) => {
    setIsLoading(true);
    setError(null);
    let retries = 0;
    const maxRetries = 5;

    while (retries <= maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!response.ok) throw new Error('Error en la comunicación con la IA');

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setIsLoading(false);
        return text;
      } catch (err) {
        if (retries === maxRetries) {
          setError("No se pudo conectar con el asistente legal. Por favor, intenta más tarde.");
          setIsLoading(false);
          return null;
        }
        const delay = Math.pow(2, retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      }
    }
  };

  const handleConsultancy = async () => {
    if (!aiInput.trim()) return;
   
    const systemPrompt = `Eres un experto abogado mercantil venezolano.
    Analiza la idea de negocio del usuario y determina si le conviene:
    1. Ruta de Emprendimiento (Ley de Fomento 2021) para ideas nuevas/validación.
    2. Empresa Tradicional (Código de Comercio) para negocios maduros o mayor capital.
    Explica por qué basándote en la ley venezolana y sugiere un borrador de 'Objeto Social' formal.
    Responde en formato Markdown, sé profesional y didáctico. Usa términos del Código de Comercio de Venezuela.`;
   
    const result = await callGemini(`Mi idea de negocio es: ${aiInput}`, systemPrompt);
    if (result) setAiResponse(result);
  };

  const slides = [
    {
      type: 'title',
      title: "Rutas de Formalización Legal en Venezuela",
      subtitle: "Guía Didáctica: Emprendimiento vs. Empresa Tradicional",
      content: "Un análisis detallado basado en el Código de Comercio y la Gaceta Oficial N° 6.656",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      icon: <Scale className="w-16 h-16 text-blue-600" />
    },
    {
      type: 'section',
      category: 'RUTA 1',
      title: "Emprendimiento (Ley 2021)",
      description: "Enfoque en la Ley para el Fomento y Desarrollo de los Emprendimientos.",
      points: [
        "Definición: Actividad económica con fines de lucro ejercida por una o más personas.",
        "Duración: Máximo de 2 años en etapa inicial (Personalidad Jurídica Transitoria).",
        "Objetivo: Validar el modelo de negocio antes de la formalización mercantil definitiva."
      ],
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
      icon: <Rocket className="w-12 h-12 text-orange-500" />
    },
    {
      type: 'steps',
      title: "Pasos y Requisitos: Emprendimiento",
      steps: [
        { title: "Portal Digital", desc: "Ingresar a 'Emprender Juntos' (Plataforma única)." },
        { title: "Registro de Datos", desc: "Carga de datos personales y descripción del proyecto." },
        { title: "Certificado RNE", desc: "Obtención del Registro Nacional de Emprendimientos." }
      ],
      requirements: [
        "Cédula de Identidad",
        "Ubicación geográfica",
        "Descripción detallada del proyecto",
        "Registro fotográfico de la actividad"
      ],
      legal: "Ley de Emprendimientos (G.O. 6.656) Art. 14 y 15; Código de Comercio Art. 10.",
      icon: <UserCheck className="w-12 h-12 text-orange-500" />
    },
    {
      type: 'section',
      category: 'RUTA 2',
      title: "Empresa Tradicional (C.A. / S.R.L.)",
      description: "Enfoque en el Registro Mercantil (SAREN) y personalidad jurídica permanente.",
      points: [
        "Definición: Constitución de sociedad mercantil con patrimonio propio.",
        "Responsabilidad: Limitada al capital aportado por los socios.",
        "Permanencia: Estructura jurídica definitiva y de largo plazo."
      ],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      icon: <Building2 className="w-12 h-12 text-blue-700" />
    },
    {
      type: 'steps',
      title: "Proceso de Legalización Mercantil",
      steps: [
        { title: "Reserva de Nombre", desc: "Búsqueda y pago de tasas en el SAREN." },
        { title: "Constitución", desc: "Redacción y firma del acta ante el Registrador Mercantil." },
        { title: "Publicación", desc: "Difusión en periódico mercantil (Art. 215 C.Com)." }
      ],
      requirements: [
        "Acta Constitutiva visada por Abogado",
        "Cédulas de socios y Comisario",
        "Carta de aceptación del Comisario",
        "Reserva de nombre aprobada"
      ],
      legal: "Código de Comercio Art. 211-215.",
      icon: <FileText className="w-12 h-12 text-blue-700" />
    },
    {
      type: 'ai-tool',
      title: "Consultoría Legal con IA ✨",
      subtitle: "Define tu ruta legal en segundos",
      description: "Escribe tu idea de negocio y nuestra IA entrenada en leyes venezolanas te asesorará sobre la mejor ruta de registro.",
      icon: <Sparkles className="w-12 h-12 text-indigo-600" />
    },
    {
      type: 'entities',
      title: "Entes y Relación Mercantil Post-Registro",
      entities: [
        { name: "SENIAT", task: "RIF, Declaración de IVA e ISLR.", icon: <CreditCard className="text-red-600" /> },
        { name: "Alcaldía", task: "Patente de Industria y Comercio.", icon: <Landmark className="text-green-700" /> },
        { name: "IVSS/FAOV/INCES", task: "Registros Parafiscales obligatorios.", icon: <UserCheck className="text-blue-500" /> },
        { name: "SENCAMER", task: "Metrología y normas de calidad.", icon: <CheckCircle2 className="text-purple-600" /> }
      ],
      capital: "Capital Mínimo: Según el objeto social, fijado por el SAREN. Demostrable mediante depósito bancario o inventario (Art. 213 C.Com).",
      icon: <Globe className="w-12 h-12 text-blue-800" />
    },
    {
      type: 'legal',
      title: "Fundamentación Jurídica Comparada",
      content: [
        { art: "Art. 10 C.Com", desc: "Define quién es comerciante en la legislación venezolana." },
        { art: "Art. 200 C.Com", desc: "Establece la naturaleza de las sociedades mercantiles." },
        { art: "Art. 201 C.Com", desc: "Define las especies de sociedades (C.A., S.R.L., etc.)." },
        { art: "G.O. 6.656", desc: "Ley de Emprendimientos: Art. 14 (RNE) y Art. 15 (Vigencia temporal)." }
      ],
      icon: <Gavel className="w-12 h-12 text-slate-800" />
    }
  ];

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 min-h-[450px] md:min-h-[650px] flex flex-col">
       
        {/* Header / Progress */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold tracking-wide uppercase">Legislación Mercantil Venezuela</span>
          </div>
          <span className="text-xs text-slate-400">Diapositiva {currentSlide + 1} de {slides.length}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto max-h-none md:max-h-[550px]">
          {slide.type === 'title' && (
            <div className="text-center space-y-6 animate-in fade-in duration-700">
              <div className="flex justify-center mb-4">{slide.icon}</div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl text-blue-600 font-medium">{slide.subtitle}</p>
              <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
              <p className="text-slate-600 max-w-lg mx-auto">{slide.content}</p>
              <div className="mt-6 md:mt-8 rounded-xl overflow-hidden shadow-lg h-32 md:h-48 w-full bg-slate-200">
                <img src={slide.image} alt="Background" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>
          )}

          {slide.type === 'section' && (
            <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center animate-in slide-in-from-right duration-500">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest">
                  {slide.category}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  {slide.icon} {slide.title}
                </h2>
                <p className="text-slate-600 italic border-l-4 border-blue-600 pl-4">
                  {slide.description}
                </p>
                <ul className="space-y-3 mt-6">
                  {slide.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-700">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video md:aspect-square">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {slide.type === 'steps' && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-4">
                {slide.icon}
                <h2 className="text-2xl md:text-3xl font-bold">{slide.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slide.steps.map((s, i) => (
                  <div key={i} className="bg-slate-50 p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-slate-800">{s.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 text-white p-6 rounded-xl">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" /> Requisitos
                  </h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {slide.requirements.map((r, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col justify-center">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Base Legal
                  </h3>
                  <p className="text-blue-800 font-medium text-sm leading-relaxed">
                    {slide.legal}
                  </p>
                </div>
              </div>
            </div>
          )}

          {slide.type === 'ai-tool' && (
            <div className="space-y-6 animate-in zoom-in duration-500">
              <div className="flex items-center gap-4">
                {slide.icon}
                <div>
                  <h2 className="text-3xl font-bold">{slide.title}</h2>
                  <p className="text-indigo-600 font-medium">{slide.subtitle}</p>
                </div>
              </div>
             
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                <p className="text-sm text-slate-700">{slide.description}</p>
                <textarea
                  className="w-full p-4 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-24"
                  placeholder="Ej: Quiero abrir una pastelería artesanal desde mi casa con dos socios..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <button
                  onClick={handleConsultancy}
                  disabled={isLoading || !aiInput.trim()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Analizar mi Ruta ✨
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              {aiResponse && (
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-in slide-in-from-top duration-300">
                  <h4 className="font-bold text-slate-800 mb-2 border-b pb-2 flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-indigo-600" /> Recomendación Legal
                  </h4>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap prose prose-slate">
                    {aiResponse}
                  </div>
                </div>
              )}
            </div>
          )}

          {slide.type === 'entities' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                {slide.icon}
                <h2 className="text-3xl font-bold">{slide.title}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {slide.entities.map((e, i) => (
                  <div key={i} className="p-4 border rounded-xl flex flex-col items-center text-center space-y-2 hover:bg-slate-50 transition-colors">
                    {e.icon}
                    <h4 className="font-bold text-slate-900">{e.name}</h4>
                    <p className="text-xs text-slate-600">{e.task}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Landmark className="w-5 h-5" /> Instancias y Capital Mínimo
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  {slide.capital}
                </p>
              </div>
            </div>
          )}

          {slide.type === 'legal' && (
            <div className="space-y-8 animate-in slide-in-from-left duration-500">
              <div className="flex items-center gap-4">
                {slide.icon}
                <h2 className="text-3xl font-bold">{slide.title}</h2>
              </div>
              <div className="grid gap-3">
                {slide.content.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors group">
                    <div className="font-bold text-blue-700 min-w-[120px]">{item.art}</div>
                    <div className="text-slate-600 group-hover:text-slate-900">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-4">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  Documento redactado según leyes vigentes al 2024
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-3 md:p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={prev}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-slate-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-30 text-sm md:text-base"
              disabled={currentSlide === 0}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Anterior
          </button>
         
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all active:scale-95 text-sm md:text-base"
          >
            {currentSlide === slides.length - 1 ? 'Reiniciar' : 'Siguiente'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <footer className="mt-6 md:mt-8 text-slate-500 text-xs md:text-sm flex flex-col md:flex-row items-center gap-2 md:gap-4 px-4 text-center">
        <p>© 2024 Guía de Formalización Mercantil Venezolana</p>
        <span className="hidden md:inline text-slate-300">|</span>
        <div className="flex items-center gap-1">
          <Scale className="w-3 h-3 md:w-4 md:h-4" />
          <span>Impulsado por Gemini AI ✨</span>
        </div>
      </footer>
    </div>
  );
};

export default App;