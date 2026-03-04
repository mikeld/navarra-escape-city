import { Fragment } from '../types';

export const FRAGMENTS: Fragment[] = [
    {
        id: 1,
        title: 'El Palacio Real',
        content: 'El Palacio de Navarra fue la sede real más lujosa de su época, un capricho de piedra y cristal.',
        author: 'Cronista de la Corte'
    }
];

export const TIMELINE_EVENTS = [];
export const FLASHCARD_DATA = [];
export const WOMEN_HISTORY = [];
export const CASTLES_DATA = [];

export const GLOSSARY_TERMS = [
    { term: 'Reyno', defKey: 'glossary.reyno' },
    { term: 'Fueros', defKey: 'glossary.fueros' },
    { term: 'Merindad', defKey: 'glossary.merindad' },
    { term: 'Burgo', defKey: 'glossary.burgo' },
    { term: 'Crismón', defKey: 'glossary.crismon' },
    { term: 'Cadenas de Navarra', defKey: 'glossary.cadenas' },
    { term: 'Camino de Santiago', defKey: 'glossary.camino' },
    { term: 'Peregrino', defKey: 'glossary.peregrino' },
    { term: 'Agramonteses y Beaumonteses', defKey: 'glossary.facciones' },
    { term: 'Jus del Castillo', defKey: 'glossary.jus_castillo' },
    { term: 'Sinagoga de Elgacena', defKey: 'glossary.sinagoga' },
    { term: 'Románico', defKey: 'glossary.romanico' },
    { term: 'Infanzón', defKey: 'glossary.infanzon' },
    { term: 'Almirante del Reyno', defKey: 'glossary.almirante' },
    { term: 'Javierada', defKey: 'glossary.javierada' },
    { term: 'Navas de Tolosa', defKey: 'glossary.navas' },
    // Conceptos Institucionales y Políticos
    { term: 'Ley Paccionada (1841)', defKey: 'glossary.ley_paccionada' },
    { term: 'Convenio Económico', defKey: 'glossary.convenio_economico' },
    { term: 'LORAFNA', defKey: 'glossary.lorafna' },
    { term: 'Pactismo', defKey: 'glossary.pactismo' },
    { term: 'Cámara de Comptos', defKey: 'glossary.camara_comptos' },
    { term: 'Sobrecarta', defKey: 'glossary.sobrecarta' },
    // Términos de la Administración Medieval
    { term: 'Tenencia', defKey: 'glossary.tenencia' },
    { term: 'Ricohombre', defKey: 'glossary.ricohombre' },
    { term: 'Cendea', defKey: 'glossary.cendea' },
    { term: 'Almiradío', defKey: 'glossary.almiradio' },
    { term: 'Congozante', defKey: 'glossary.congozante' },
    // Historia y Patrimonio
    { term: 'Gamazada', defKey: 'glossary.gamazada' },
    { term: 'Privilegio de la Unión (1423)', defKey: 'glossary.privilegio_union' },
    { term: 'Hórreo', defKey: 'glossary.horreo' },
    { term: 'Romance Navarro', defKey: 'glossary.romance_navarro' },
    { term: 'Arqueta de Leyre', defKey: 'glossary.arqueta_leyre' },
    { term: 'Junta de Infanzones de Obanos', defKey: 'glossary.junta_infanzones' },
];

export const NAVARRA_QUIZ_QUESTIONS = [
    {
        id: 1,
        question: '¿En qué año tuvo lugar la Batalla de las Navas de Tolosa?',
        options: ['1212', '1134', '1324', '1035'],
        correctAnswer: 0,
        explanation: 'La Batalla de las Navas de Tolosa se libró en 1212. La victoria de los reinos cristianos contra el califato almohade fue decisiva para la Reconquista y Sancho VII el Fuerte rompió las cadenas del campamento del califa, hecho que quedó plasmado en el escudo de Navarra.'
    },
    {
        id: 2,
        question: '¿Quién fundó el Palacio Real de Olite?',
        options: ['Juana I', 'Sancho III el Mayor', 'Carlos III el Noble', 'Teobaldo I'],
        correctAnswer: 2,
        explanation: 'Carlos III el Noble (1387-1425) transformó y engrandeció el Palacio Real de Olite hasta convertirlo en una de las residencias más fastuosas de Europa, con jardines exóticos, zoológico y torres majestuosas.'
    },
    {
        id: 3,
        question: '¿De qué ciudad navarra era originario San Francisco Javier?',
        options: ['Estella', 'Pamplona', 'Sangüesa', 'Javier'],
        correctAnswer: 3,
        explanation: 'San Francisco Javier (1506-1552) nació en el Castillo de Javier, en la Merindad de Sangüesa. Es Patrón de Navarra y uno de los misioneros más importantes de la historia.'
    },
    {
        id: 4,
        question: '¿Qué simbolizan las cadenas del escudo de Navarra?',
        options: ['La opresión romana', 'La victoria en las Navas de Tolosa', 'La alianza con Castilla', 'El dominio sobre los vascos'],
        correctAnswer: 1,
        explanation: 'Las cadenas del escudo de Navarra representan las cadenas del campamento del califa almohade Muhammad al-Nasir, que Sancho VII el Fuerte rompió en la Batalla de las Navas de Tolosa (1212).'
    },
    {
        id: 5,
        question: '¿Quién es considerado el primer caudillo o rey independiente de Pamplona hacia el año 824?',
        options: ['Sancho Garcés I', 'Íñigo Arista', 'García Íñiguez'],
        correctAnswer: 1,
        explanation: 'Íñigo Arista es considerado el primer rey independiente del reino de Pamplona hacia el año 824, liderando la resistencia de los vascones frente a francos y musulmanes.'
    },
    {
        id: 6,
        question: '¿En qué año tuvo lugar la Batalla de Roncesvalles donde los vascones derrotaron a la retaguardia de Carlomagno?',
        options: ['824', '1212', '778'],
        correctAnswer: 2,
        explanation: 'La Batalla de Roncesvalles tuvo lugar en el año 778. Los vascones tendieron una emboscada a la retaguardia del ejército de Carlomagno en el paso pirenaico, derrotándola. Este hecho dio origen a la leyenda de Roldán.'
    },
    {
        id: 7,
        question: '¿Bajo qué monarca alcanzó el Reino de Pamplona su cenit de influencia y hegemonía en el siglo XI?',
        options: ['Sancho VI el Sabio', 'Sancho III el Mayor', 'Carlos III el Noble'],
        correctAnswer: 1,
        explanation: 'Bajo el reinado de Sancho III el Mayor (1004-1035), el reino alcanzó su máxima extensión e influencia, ejerciendo una hegemonía sobre la mayor parte de los reinos cristianos de la Península Ibérica.'
    },
    {
        id: 8,
        question: '¿Qué monarca abandonó el título de "Rey de los Pamploneses" para titularse "Rey de Navarra" en 1162?',
        options: ['Sancho VII el Fuerte', 'García Ramírez el Restaurador', 'Sancho VI el Sabio'],
        correctAnswer: 2,
        explanation: 'Sancho VI el Sabio fue el primer monarca en utilizar oficialmente el título de "Rey de Navarra" en 1162, consolidando la idea del monarca como señor de un territorio definido.'
    },
    {
        id: 9,
        question: '¿Cuál fue el principal legado urbanístico de Carlos III el Noble en Pamplona en 1423?',
        options: ['La construcción de las murallas', 'El Privilegio de la Unión', 'La fundación de la Navarrería'],
        correctAnswer: 1,
        explanation: 'El Privilegio de la Unión (1423) fue el decreto de Carlos III el Noble que unificó los tres burgos medievales de Pamplona (Navarrería, San Cernin y San Nicolás) en una sola ciudad.'
    },
    {
        id: 10,
        question: '¿Qué reforma eclesiástica fue introducida en Navarra gracias al apoyo de Sancho III el Mayor?',
        options: ['La fundación de los Jesuitas', 'La reforma cluniacense', 'La creación de los Teatinos'],
        correctAnswer: 1,
        explanation: 'Sancho III el Mayor impulsó la reforma cluniacense en Navarra, introduciendo los monjes de Cluny y renovando la organización de la Iglesia en el reino, lo que también dinamizó el Camino de Santiago.'
    },
    {
        id: 11,
        question: '¿Qué reina gobernó Navarra entre 1425 y 1441 tras haber sido regente en Sicilia?',
        options: ['Catalina de Foix', 'Juana II', 'Blanca I de Navarra'],
        correctAnswer: 2,
        explanation: 'Blanca I de Navarra heredó el trono de su padre Carlos III el Noble y reinó entre 1425 y 1441 después de haber ejercido como regente en Sicilia. Su matrimonio con Juan II de Aragón desencadenó la guerra civil navarra.'
    },
    {
        id: 12,
        question: '¿Qué conflicto interno debilitó al reino en el siglo XV antes de la conquista castellana?',
        options: ['La invasión de los vikingos', 'La guerra civil entre agramonteses y beamonteses', 'La revuelta de los bagaudas'],
        correctAnswer: 1,
        explanation: 'La guerra civil entre las facciones nobiliarias de los agramonteses y los beamonteses desangró al reino durante décadas en el siglo XV, facilitando la conquista de Fernando el Católico en 1512.'
    },
    {
        id: 13,
        question: '¿En qué año se produjo la invasión de Navarra por las tropas del Duque de Alba?',
        options: ['1515', '1512'],
        correctAnswer: 1,
        explanation: 'En 1512, las tropas castellanas al mando del Duque de Alba invadieron Navarra por orden de Fernando el Católico. La conquista fue consumada sin apenas resistencia en pocos meses.'
    },
    {
        id: 14,
        question: '¿Cuál fue la última monarca titular del Reino de Navarra antes de la pérdida de su independencia?',
        options: ['Blanca I', 'Leonor de Trastámara', 'Catalina de Foix'],
        correctAnswer: 2,
        explanation: 'Catalina de Foix fue la última reina titular del Reino de Navarra. Bajo su reinado (junto a Juan de Albret), Navarra fue conquistada por Fernando el Católico en 1512.'
    },
    {
        id: 15,
        question: '¿Qué institución fue creada en 1365 por Carlos II para controlar las finanzas reales?',
        options: ['El Consejo Real', 'La Cámara de Comptos', 'La Diputación del Reino'],
        correctAnswer: 1,
        explanation: 'La Cámara de Comptos fue creada en 1365 por Carlos II el Malo. Es el tribunal de cuentas histórico de Navarra, encargado de fiscalizar los fondos públicos. Su sede en Pamplona es el único edificio gótico civil que sobrevive en la ciudad.'
    },
    {
        id: 16,
        question: '¿En qué año se incorporó formalmente la Alta Navarra a la Corona de Castilla?',
        options: ['1512', '1515'],
        correctAnswer: 1,
        explanation: 'Aunque la invasión militar fue en 1512, la incorporación formal de la Alta Navarra a la Corona de Castilla tuvo lugar en 1515, mediante las Cortes de Burgos, manteniendo Navarra sus instituciones propias.'
    },
    {
        id: 17,
        question: '¿Cómo se llama la ley de 1841 que transformó a Navarra de Reino a Provincia Foral?',
        options: ['Ley Paccionada', 'LORAFNA', 'Decreto de Nueva Planta'],
        correctAnswer: 0,
        explanation: 'La Ley Paccionada de 1841 transformó a Navarra de Reino en Provincia Foral tras la Primera Guerra Carlista. Supuso perder la soberanía política pero conservar una amplia autonomía administrativa y fiscal.'
    },
    {
        id: 18,
        question: '¿Qué evento de 1893 fue una protesta masiva en defensa de la autonomía fiscal navarra?',
        options: ['La Javierada', 'La Gamazada', 'La Guerra de los Tres Sanchos'],
        correctAnswer: 1,
        explanation: 'La Gamazada fue la gran protesta popular de 1893 contra el intento del ministro Germán Gamazo de suprimir la autonomía fiscal navarra. Llegó a reunir a más de 100.000 personas en defensa de los fueros.'
    },
    {
        id: 19,
        question: '¿Qué sistema regula la potestad de Navarra para recaudar sus propios impuestos?',
        options: ['Régimen Común', 'Convenio Económico', 'Ley de Presupuestos'],
        correctAnswer: 1,
        explanation: 'El Convenio Económico es el sistema único por el cual Navarra tiene potestad para establecer y recaudar sus propios tributos, pagando al Estado una aportación por las competencias no asumidas como defensa o asuntos exteriores.'
    },
    {
        id: 20,
        question: '¿Qué monarca navarro destacó por su heroísmo en la Batalla de las Navas de Tolosa (1212)?',
        options: ['Sancho VI el Sabio', 'Sancho VII el Fuerte'],
        correctAnswer: 1,
        explanation: 'Sancho VII el Fuerte protagonizó uno de los momentos más épicos de la batalla al romper las cadenas que protegían el campamento del califa almohade. Esta hazaña quedó inmortalizada en el escudo de armas del Reino de Navarra.'
    },
    {
        id: 21,
        question: '¿Qué ciudad riojana fue residencia principal de los reyes navarros durante los siglos X y XI?',
        options: ['Logroño', 'Nájera', 'Calahorra'],
        correctAnswer: 1,
        explanation: 'Nájera fue la capital y residencia preferida de los reyes de Pamplona durante los siglos X y XI, cuando el reino controlaba gran parte de La Rioja. Allí fundó Sancho III el mayor panteón monástico de la dinastía.'
    },
    {
        id: 22,
        question: '¿En qué lugar nació San Francisco Javier, copatrón de Navarra?',
        options: ['Pamplona', 'Castillo de Javier', 'Olite'],
        correctAnswer: 1,
        explanation: 'San Francisco Javier nació en 1506 en el Castillo de Javier, en la Merindad de Sangüesa. Cofundador de la Compañía de Jesús, fue misionero en Asia y es proclamado Patrón de Navarra junto a San Fermín.'
    },
    {
        id: 23,
        question: '¿Qué nombre recibe la norma institucional básica de Navarra aprobada en 1982?',
        options: ['LORAFNA (Amejoramiento del Fuero)', 'Constitución de Navarra', 'Fuero General'],
        correctAnswer: 0,
        explanation: 'La LORAFNA (Ley Orgánica de Reintegración y Amejoramiento del Régimen Foral de Navarra) de 1982 es la norma fundamental que integra los derechos históricos de los fueros navarros en el marco constitucional actual.'
    },
    {
        id: 24,
        question: '¿Quién fundó la ciudad romana de Pompelo (Pamplona) en el año 75 a. C.?',
        options: ['Augusto', 'Julio César', 'Cneo Pompeyo Magno'],
        correctAnswer: 2,
        explanation: 'Cneo Pompeyo Magno fundó Pompelo (Pamplona) en el año 75 a. C. como campamento base durante las Guerras Sertorianas. El nombre de la ciudad deriva directamente del nombre de su fundador.'
    },
    {
        id: 25,
        question: '¿Qué bando nobiliario apoyaba al Príncipe de Viana en la guerra civil navarra?',
        options: ['Agramonteses', 'Beamonteses'],
        correctAnswer: 1,
        explanation: 'Los Beamonteses apoyaban al Príncipe de Viana y a sus derechos al trono de Navarra, mientras que los Agramonteses apoyaban a su padre Juan II de Aragón. Ambas facciones desangraron el reino durante décadas.'
    },
    {
        id: 26,
        question: '¿Cuál es el edificio gótico civil más importante de Olite y sede de la corte de Carlos III?',
        options: ['Castillo de Javier', 'Palacio Real de Olite', 'Cámara de Comptos'],
        correctAnswer: 1,
        explanation: 'El Palacio Real de Olite fue la residencia favorita de Carlos III el Noble y uno de los conjuntos civiles góticos más interesantes de Europa, con torres caprichosas, jardines y hasta un zoológico con leones y camellos.'
    },
    {
        id: 27,
        question: '¿Qué nombre recibían los barrios de inmigrantes franceses que se asentaron en el Camino de Santiago?',
        options: ['Merindades', 'Burgos de Francos', 'Tenencias'],
        correctAnswer: 1,
        explanation: 'Los "burgos de francos" eran los barrios habitados por inmigrantes francos (del norte de los Pirineos) en las ciudades del Camino. Ciudades como Estella o Pamplona tenían varios burgos con leyes y fueros propios.'
    },
    {
        id: 28,
        question: '¿En qué monasterio se encuentra el panteón de los primeros reyes de Pamplona?',
        options: ['Monasterio de la Oliva', 'Monasterio de Leyre', 'Monasterio de Fitero'],
        correctAnswer: 1,
        explanation: 'El Monasterio de Leyre es el panteón de los primeros reyes de Navarra y uno de los monumentos románicos más importantes de la Península. Fue el centro espiritual del reino en sus orígenes y tiene una cripta del siglo XI de gran belleza.'
    },
    {
        id: 29,
        question: '¿Qué parte del reino permaneció independiente y se unió dinásticamente a Francia en el siglo XVI?',
        options: ['La Ribera', 'La Baja Navarra (continental)', 'Tierra Estella'],
        correctAnswer: 1,
        explanation: 'La Baja Navarra o Navarra continental (al norte de los Pirineos) no fue conquistada por Fernando el Católico y permaneció bajo los reyes navarros Juan de Albret y Catalina de Foix. Finalmente fue incorporada a Francia con Enrique IV.'
    },
    {
        id: 30,
        question: '¿Qué derecho permitía a las instituciones navarras revisar las leyes reales para ver si vulneraban sus fueros?',
        options: ['Derecho de Veto', 'Derecho de Sobrecarta', 'Derecho de Pecha'],
        correctAnswer: 1,
        explanation: 'La Sobrecarta era el mecanismo por el que el Consejo Real de Navarra podía revisar las disposiciones del rey. Si una orden real vulneraba los fueros propios, podía ser declarada "contrafuero" y no tenía validez sin este permiso.'
    },
    {
        id: 31,
        question: '¿Qué batalla de 1521 supuso el último gran intento militar por recuperar la independencia del reino?',
        options: ['Batalla de Atapuerca', 'Batalla de Noáin', 'Batalla de Velate'],
        correctAnswer: 1,
        explanation: 'La Batalla de Noáin (1521) fue el último gran intento de los reyes navarros y sus aliados franceses por recuperar el reino. La derrota definitiva frente a las tropas castellanas selló la incorporación de Navarra a la corona española.'
    },
    {
        id: 32,
        question: '¿Quién instaló la primera imprenta en Pamplona en 1490?',
        options: ['Pablo Sarasate', 'Arnao Guillén de Brocar', 'Martín de Azpilcueta'],
        correctAnswer: 1,
        explanation: 'Arnao Guillén de Brocar instaló la primera imprenta en Pamplona en 1490, lo que permitió editar obras fundamentales como el "Manuale Pampilonense". Fue un pionero de la difusión del conocimiento impreso en Navarra y España.'
    },
    {
        id: 33,
        question: '¿Qué figura representaba al monarca español en Navarra tras la conquista de 1512?',
        options: ['El Corregidor', 'El Virrey', 'El Justicia Mayor'],
        correctAnswer: 1,
        explanation: 'Tras la conquista, Navarra mantuvo sus instituciones propias incluyendo un Virrey que gobernaba en nombre del rey de España. Esta figura reflejaba el estatus especial de Navarra como reino anexionado con autonomía propia.'
    },
    {
        id: 34,
        question: '¿Cuál es la lengua administrativa y literaria predominante en la Navarra medieval junto al latín y el euskera?',
        options: ['Castellano moderno', 'Romance Navarro', 'Francés antiguo'],
        correctAnswer: 1,
        explanation: 'El Romance Navarro fue la lengua derivada del latín que se impuso como idioma principal de la administración, la justicia y la literatura en el Reino de Navarra durante la Edad Media, antes de ser desplazado paulatinamente por el castellano.'
    },
];
