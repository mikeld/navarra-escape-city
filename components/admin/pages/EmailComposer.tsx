import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
}

/**
 * Email Composer Page
 * Compose and send custom emails to newsletter subscribers
 */
export const EmailComposer: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [sending, setSending] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const templates: EmailTemplate[] = [
        {
            id: 'weekly_enigma',
            name: 'Enigma Semanal',
            subject: '🔍 Nuevo Enigma de la Semana - Navarra Escape City',
            body: `¡Hola {{name}}! 🕵️‍♂️✨

**Semana del [Día] al [Día] de [Mes], [Año]**

¿Cómo va esa mente hoy? ¿Lista para estrujarse un poco? Después de ver cómo superasteis los retos anteriores, ¡aquí os traemos un nuevo misterio que os hará viajar al pasado de nuestra querida Navarra!

---

### 🔍 El Reto de esta Semana: [NOMBRE DEL ENIGMA]

[Danos una breve y misteriosa introducción sobre el enigma aquí. Por ejemplo: "Cuentan las leyendas que bajo los muros de la ciudad se esconde un secreto que solo los más observadores podrán descifrar..."]

[Explica aquí los detalles del enigma o la pista principal]

¿Crees tener la respuesta? No esperes más y pon a prueba tu ingenio en nuestra web:
👉 **[ENLACE AL ENIGMA: https://estellaescapecity.com/enigmas/X]**

---

### ✅ Solución del Enigma Anterior: [NOMBRE DEL ENIGMA ANTERIOR]

Para los que os quedasteis con la duda... la respuesta era: **[SOLUCIÓN]**

[Breve explicación de por qué esa era la solución o algún dato curioso relacionado]

---

¡Disfruta del desafío y nos vemos recorriendo las calles de Navarra! 🚶‍♀️🏰

Mikel de Navarra Escape City
`,
        },
        {
            id: 'announcement',
            name: 'Anuncio General',
            subject: '📢 Novedades en Navarra Escape City',
            body: `¡Hola {{name}}!

Tenemos noticias emocionantes para compartir contigo:

[Tu mensaje aquí]

¡Gracias por formar parte de nuestra comunidad!

Mikel de Navarra Escape City
`,
        },
    ];

    useEffect(() => {
        loadSubscriberCount();
    }, []);

    const loadSubscriberCount = async () => {
        try {
            const newsletterRef = collection(db, 'newsletter');
            const snapshot = await getDocs(newsletterRef);
            setSubscriberCount(snapshot.size);
        } catch (error) {
            console.error('Error loading subscribers:', error);
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find((t) => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setSubject(template.subject);
            setBody(template.body);
        }
    };

    const handleSendEmail = async () => {
        if (!subject || !body) {
            alert('Por favor completa el asunto y el cuerpo del email');
            return;
        }

        if (!window.confirm(`¿Enviar este email a ${subscriberCount} suscriptores?`)) {
            return;
        }

        setSending(true);
        try {
            const functions = getFunctions();
            const sendEmailFn = httpsCallable(functions, 'sendEmail');

            const result = await sendEmailFn({ subject, body, testMode: false });

            alert(`✅ Email enviado correctamente a ${subscriberCount} suscriptores!`);

            // Clear form
            setSubject('');
            setBody('');
            setSelectedTemplate('');
        } catch (error: any) {
            console.error('Error sending email:', error);
            alert(`❌ Error al enviar el email: ${error.message}\n\nAsegúrate de que las Functions están desplegadas.`);
        } finally {
            setSending(false);
        }
    };

    const handleSendTest = async () => {
        if (!subject || !body) {
            alert('Por favor completa el asunto y el cuerpo del email');
            return;
        }

        try {
            const functions = getFunctions();
            const sendTestEmailFn = httpsCallable(functions, 'sendTestEmail');

            await sendTestEmailFn({ subject, body });

            alert('✅ Email de prueba enviado a mikeldiaz0@gmail.com\n\nRevisa tu bandeja de entrada.');
        } catch (error: any) {
            console.error('Error sending test email:', error);
            alert(`❌ Error: ${error.message}\n\nAsegúrate de que las Functions están desplegadas.`);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-white mb-2">Email Composer</h1>
                <p className="text-gray-400">
                    Crea y envía emails a {subscriberCount} suscriptores
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Composer */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Template Selection */}
                    <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Plantillas</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${selectedTemplate === template.id
                                        ? 'border-navarra-gold bg-navarra-gold/10 text-white'
                                        : 'border-gray-700 bg-black/30 text-gray-400 hover:border-navarra-gold/50'
                                        }`}
                                >
                                    <p className="font-semibold text-sm">{template.name}</p>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setSelectedTemplate('');
                                    setSubject('');
                                    setBody('');
                                }}
                                className="p-4 rounded-lg border-2 border-gray-700 bg-black/30 text-gray-400 hover:border-navarra-gold/50 transition-all text-left"
                            >
                                <p className="font-semibold text-sm">✏️ Email Personalizado</p>
                            </button>
                        </div>
                    </div>

                    {/* Email Form */}
                    <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Asunto
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Escribe el asunto del email..."
                                className="w-full px-4 py-2 bg-black/50 border border-navarra-gold/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-navarra-gold"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Cuerpo del Email
                            </label>
                            <textarea
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Escribe tu mensaje aquí...

Puedes usar estas variables:
{{name}} - Nombre del suscriptor
{{email}} - Email del suscriptor"
                                rows={16}
                                className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-navarra-gold font-mono text-sm"
                            />
                        </div>

                        <div className="text-xs text-gray-400 bg-blue-900/10 border border-blue-500/30 rounded p-3 space-y-2">
                            <p>💡 <strong>Tip:</strong> Ahora puedes usar <strong>Markdown</strong> para el formato:</p>
                            <ul className="list-disc ml-4 space-y-1">
                                <li><code>### Título</code> para encabezados</li>
                                <li><code>**negrita**</code> y <code>*cursiva*</code></li>
                                <li><code>[texto](url)</code> para enlaces</li>
                                <li><code>- lista</code> para viñetas</li>
                            </ul>
                            <p className="pt-1">👤 La variable <code>{{ name }}</code> será reemplazada automáticamente por el nombre del suscriptor.</p>
                            <p className="text-[10px] text-gray-500 italic">Nota: El pie de página con branding y enlace de baja se añade automáticamente.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Actions & Info */}
                <div className="space-y-6">
                    {/* Send Actions */}
                    <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>

                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="w-full px-4 py-3 bg-blue-900/20 border border-blue-500/50 text-blue-400 rounded-md hover:bg-blue-900/40 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            {showPreview ? 'Ocultar' : 'Ver'} Preview
                        </button>

                        <button
                            onClick={handleSendTest}
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
                        >
                            Enviar Email de Prueba
                        </button>

                        <button
                            onClick={handleSendEmail}
                            disabled={sending || !subject || !body}
                            className="w-full px-4 py-3 bg-navarra-gold text-black font-bold rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {sending ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Enviar a {subscriberCount} suscriptores
                                </>
                            )}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Destinatarios:</span>
                                <span className="text-white font-bold">{subscriberCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Longitud asunto:</span>
                                <span className="text-white">{subject.length} chars</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Longitud cuerpo:</span>
                                <span className="text-white">{body.length} chars</span>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
                        <p className="text-yellow-400 text-xs">
                            ⚠️ <strong>Importante:</strong> Los emails se enviarán inmediatamente.
                            Verifica el contenido antes de enviar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
                        <div className="sticky top-0 bg-gray-100 p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Preview del Email</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4 pb-4 border-b">
                                <p className="text-sm text-gray-600 mb-1">Asunto:</p>
                                <p className="text-lg font-semibold text-gray-900">{subject}</p>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                                    {body.replace('{{name}}', 'Juan Pérez').replace('{{email}}', 'ejemplo@email.com')}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
