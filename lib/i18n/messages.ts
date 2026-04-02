import type { Locale } from "@/lib/i18n/config";

type MessageDictionary = Record<string, string>;

const en = {
  "Packmap": "Packmap",
  "Trip-first packing": "Trip-first packing",
  "Start a trip.": "Start a trip.",
  "Pack only what this leg needs.": "Pack only what this leg needs.",
  "Jump straight into the trip builder, set your route, and get a live checklist instead of a lecture about internal setup.":
    "Jump straight into the trip builder, set your route, and get a live checklist instead of a lecture about internal setup.",
  "No account required": "No account required",
  "Opens the trip builder": "Opens the trip builder",
  "Google stays optional": "Google stays optional",
  "Preview": "Preview",
  "Lisbon weekend": "Lisbon weekend",
  "Current leg: Home to Lisbon": "Current leg: Home to Lisbon",
  "Live": "Live",
  "Route": "Route",
  "Checklist": "Checklist",
  "Passport": "Passport",
  "Phone charger": "Phone charger",
  "Socks": "Socks",
  "Toothbrush": "Toothbrush",
  "Start in under a minute": "Start in under a minute",
  "Open the trip builder now": "Open the trip builder now",
  "One click opens the route planner immediately. No account wall, no template jargon first.":
    "One click opens the route planner immediately. No account wall, no template jargon first.",
  "Start a trip now": "Start a trip now",
  "You will land in the trip builder right away and can connect Google later if you want the same trip on another device.":
    "You will land in the trip builder right away and can connect Google later if you want the same trip on another device.",
  "Prefer to keep it synced?": "Prefer to keep it synced?",
  "Start with Google and we will bring you to the same place.":
    "Start with Google and we will bring you to the same place.",
  "Start with Google": "Start with Google",
  "Google sign-in is not ready in this environment yet, but guest mode still opens the full trip flow.":
    "Google sign-in is not ready in this environment yet, but guest mode still opens the full trip flow.",
  "Set the route": "Set the route",
  "We open the trip builder immediately, so you can add where you are going first.":
    "We open the trip builder immediately, so you can add where you are going first.",
  "Get the checklist": "Get the checklist",
  "Your essentials are ready when the trip is created, and the first leg starts right away.":
    "Your essentials are ready when the trip is created, and the first leg starts right away.",
  "Keep it anywhere": "Keep it anywhere",
  "Start as a guest now, then connect Google later if you want the same trip on another device.":
    "Start as a guest now, then connect Google later if you want the same trip on another device.",
  "Step {step}": "Step {step}",
  "Home": "Home",
  "Templates": "Templates",
  "Trips": "Trips",
  "Add Google sign-in": "Add Google sign-in",
  "Log out": "Log out",
  "Switch to guest": "Switch to guest",
  "Google sign-in is not configured here yet":
    "Google sign-in is not configured here yet",
  "Traveler": "Traveler",
  "Dashboard": "Dashboard",
  "Back": "Back",
  "Profile": "Profile",
  "Not provided": "Not provided",
  "Continue with Google": "Continue with Google",
  "Supabase is not configured yet, so Google sign-in is unavailable in this environment.":
    "Supabase is not configured yet, so Google sign-in is unavailable in this environment.",
  "Google sign-in could not start because no redirect URL was returned.":
    "Google sign-in could not start because no redirect URL was returned.",
  "Wrapping up Google sign-in": "Wrapping up Google sign-in",
  "Finishing Google sign-in...": "Finishing Google sign-in...",
  "Back to home": "Back to home",
  "Loading callback details...": "Loading callback details...",
  "Google sign-in returned without an authorization code.":
    "Google sign-in returned without an authorization code.",
  "Supabase is not configured yet, so Google sign-in cannot complete.":
    "Supabase is not configured yet, so Google sign-in cannot complete.",
  "Google sign-in completed, but no session was created.":
    "Google sign-in completed, but no session was created.",
  "English": "English",
  "Spanish": "Spanish",
  "Catalan": "Catalan",
  "Russian": "Russian",
  "Language": "Language",
  "This is the main list most trips should start from.":
    "This is the main list most trips should start from.",
  "Start here": "Start here",
  "Your starter template should appear here automatically.":
    "Your starter template should appear here automatically.",
  "Other templates": "Other templates",
  "Keep extras only for clearly different trip styles.":
    "Keep extras only for clearly different trip styles.",
  "No extra templates yet.": "No extra templates yet.",
  "Create another template": "Create another template",
  "Use this for a real variation like winter gear or work travel.":
    "Use this for a real variation like winter gear or work travel.",
  "Extra template name": "Extra template name",
  "Winter carry-on": "Winter carry-on",
  "Create extra template": "Create extra template",
  "Cancel": "Cancel",
  "Create a template now": "Create a template now",
  "If the starter template is delayed, create one here so you can keep going.":
    "If the starter template is delayed, create one here so you can keep going.",
  "Template name": "Template name",
  "Weekend carry-on": "Weekend carry-on",
  "Create template": "Create template",
  "Plan the route and start packing from leg one.":
    "Plan the route and start packing from leg one.",
  "Add where you are going and your checklist becomes live as soon as the trip is created.":
    "Add where you are going and your checklist becomes live as soon as the trip is created.",
  "Quick view": "Quick view",
  "Active trips stay on top, and new ones start immediately.":
    "Active trips stay on top, and new ones start immediately.",
  "Active trip": "Active trip",
  "Live in the list below": "Live in the list below",
  "None yet": "None yet",
  "Templates available": "Templates available",
  "Saved trips": "Saved trips",
  "No templates yet": "No templates yet",
  "Create or recover a template before planning a trip.":
    "Create or recover a template before planning a trip.",
  "Open any trip to keep packing or review the route.":
    "Open any trip to keep packing or review the route.",
  "Open your default list and edit it fast.": "Open your default list and edit it fast.",
  "Keep one trusted main template. Add another only when the trip really needs its own version.":
    "Keep one trusted main template. Add another only when the trip really needs its own version.",
  "Starter template not ready yet": "Starter template not ready yet",
  "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.":
    "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.",
  "Template not found": "Template not found",
  "This template may have been deleted, or this workspace does not own it.":
    "This template may have been deleted, or this workspace does not own it.",
  "Pick the default template on the left to keep going.":
    "Pick the default template on the left to keep going.",
  "No trips yet": "No trips yet",
  "Your saved trips will appear here once you create the first route.":
    "Your saved trips will appear here once you create the first route.",
  "Active now": "Active now",
  "Template": "Template",
  "Snapshot only": "Snapshot only",
  "Journey": "Journey",
  "legs done": "legs done",
  "Created": "Created",
  "Current route": "Current route",
  "Route pending": "Route pending",
  "Checklist becomes active once the trip starts.":
    "Checklist becomes active once the trip starts.",
  "Open trip": "Open trip",
  "Start your trip": "Start your trip",
  "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.":
    "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.",
  "Main list selected first": "Main list selected first",
  "Trip name (optional)": "Trip name (optional)",
  "Spring city break": "Spring city break",
  "Leave blank to use:": "Leave blank to use:",
  "Leave blank to generate the trip name from your destinations.":
    "Leave blank to generate the trip name from your destinations.",
  "Packing list": "Packing list",
  "default": "default",
  "items": "items",
  "Your main saved list is selected first.":
    "Your main saved list is selected first.",
  "Choose any saved list for this trip.": "Choose any saved list for this trip.",
  "Route mode": "Route mode",
  "Selected": "Selected",
  "Home → Destination → Home": "Home → Destination → Home",
  "Home → Stop 1 → Stop 2 → Home": "Home → Stop 1 → Stop 2 → Home",
  "Destination": "Destination",
  "Stops": "Stops",
  "Add stop": "Add stop",
  "Stop": "Stop",
  "Route preview": "Route preview",
  "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.":
    "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.",
  "Unable to create the trip right now.": "Unable to create the trip right now.",
  "Creating and starting trip...": "Creating and starting trip...",
  "Create and start trip": "Create and start trip",
  "No checklist yet.": "No checklist yet.",
  "Back to trips": "Back to trips",
  "Unable to start the trip.": "Unable to start the trip.",
  "Start trip": "Start trip",
  "Unable to complete the leg.": "Unable to complete the leg.",
  "Arrived": "Arrived",
  "Unable to reroute home right now.": "Unable to reroute home right now.",
  "Go home now": "Go home now",
  "Current leg": "Current leg",
  "Not started yet": "Not started yet",
  "Journey legs": "Journey legs",
  "Each leg keeps its own checklist.": "Each leg keeps its own checklist.",
  "Leg": "Leg",
  "This trip doesn't have any snapshot items yet.":
    "This trip doesn't have any snapshot items yet.",
  "Unable to update the checklist item.":
    "Unable to update the checklist item.",
  "Start the trip to activate the first leg checklist.":
    "Start the trip to activate the first leg checklist.",
  "This trip is complete, so the checklist is read-only.":
    "This trip is complete, so the checklist is read-only.",
  "This checklist is shown for history, not editing.":
    "This checklist is shown for history, not editing.",
  "Need to cut the route short?": "Need to cut the route short?",
  "Skip the remaining stops and switch to a direct leg home.":
    "Skip the remaining stops and switch to a direct leg home.",
  "Skip ahead and head home": "Skip ahead and head home",
  "At a glance": "At a glance",
  "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.":
    "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.",
} satisfies MessageDictionary;

const es: typeof en = {
  "Packmap": "Packmap",
  "Trip-first packing": "Equipaje pensado para el viaje",
  "Start a trip.": "Empieza un viaje.",
  "Pack only what this leg needs.": "Empaca solo lo que necesita este tramo.",
  "Jump straight into the trip builder, set your route, and get a live checklist instead of a lecture about internal setup.":
    "Entra directamente al creador de viajes, define tu ruta y obtén una lista activa en lugar de una explicación sobre la configuración interna.",
  "No account required": "Sin cuenta",
  "Opens the trip builder": "Abre el planificador",
  "Google stays optional": "Google sigue siendo opcional",
  "Preview": "Vista previa",
  "Lisbon weekend": "Fin de semana en Lisboa",
  "Current leg: Home to Lisbon": "Tramo actual: Casa a Lisboa",
  "Live": "En vivo",
  "Route": "Ruta",
  "Checklist": "Lista",
  "Passport": "Pasaporte",
  "Phone charger": "Cargador del móvil",
  "Socks": "Calcetines",
  "Toothbrush": "Cepillo de dientes",
  "Start in under a minute": "Empieza en menos de un minuto",
  "Open the trip builder now": "Abre el planificador ahora",
  "One click opens the route planner immediately. No account wall, no template jargon first.":
    "Un clic abre el planificador de ruta al instante. Sin muro de cuenta ni jerga de plantillas.",
  "Start a trip now": "Empieza un viaje ahora",
  "You will land in the trip builder right away and can connect Google later if you want the same trip on another device.":
    "Entrarás directamente al planificador y podrás conectar Google después si quieres el mismo viaje en otro dispositivo.",
  "Prefer to keep it synced?": "Quieres mantenerlo sincronizado?",
  "Start with Google and we will bring you to the same place.":
    "Empieza con Google y te llevaremos al mismo punto.",
  "Start with Google": "Empezar con Google",
  "Google sign-in is not ready in this environment yet, but guest mode still opens the full trip flow.":
    "El acceso con Google aún no está listo en este entorno, pero el modo invitado sí abre todo el flujo del viaje.",
  "Set the route": "Define la ruta",
  "We open the trip builder immediately, so you can add where you are going first.":
    "Abrimos el planificador de viaje inmediatamente para que primero añadas adónde vas.",
  "Get the checklist": "Obtén la lista",
  "Your essentials are ready when the trip is created, and the first leg starts right away.":
    "Tus básicos estarán listos cuando se cree el viaje y el primer tramo empezará enseguida.",
  "Keep it anywhere": "Llévalo contigo",
  "Start as a guest now, then connect Google later if you want the same trip on another device.":
    "Empieza ahora como invitado y conecta Google más tarde si quieres el mismo viaje en otro dispositivo.",
  "Step {step}": "Paso {step}",
  "Home": "Inicio",
  "Templates": "Plantillas",
  "Trips": "Viajes",
  "Add Google sign-in": "Añadir acceso con Google",
  "Log out": "Cerrar sesión",
  "Switch to guest": "Pasar a invitado",
  "Google sign-in is not configured here yet":
    "El acceso con Google aún no está configurado aquí",
  "Traveler": "Viajero",
  "Dashboard": "Panel",
  "Back": "Volver",
  "Profile": "Perfil",
  "Not provided": "No indicado",
  "Continue with Google": "Continuar con Google",
  "Supabase is not configured yet, so Google sign-in is unavailable in this environment.":
    "Supabase aún no está configurado, así que el acceso con Google no está disponible en este entorno.",
  "Google sign-in could not start because no redirect URL was returned.":
    "No se pudo iniciar el acceso con Google porque no se devolvió ninguna URL de redirección.",
  "Wrapping up Google sign-in": "Terminando el acceso con Google",
  "Finishing Google sign-in...": "Terminando el acceso con Google...",
  "Back to home": "Volver al inicio",
  "Loading callback details...": "Cargando detalles del callback...",
  "Google sign-in returned without an authorization code.":
    "El acceso con Google volvió sin un código de autorización.",
  "Supabase is not configured yet, so Google sign-in cannot complete.":
    "Supabase aún no está configurado, así que el acceso con Google no puede completarse.",
  "Google sign-in completed, but no session was created.":
    "El acceso con Google se completó, pero no se creó ninguna sesión.",
  "English": "Inglés",
  "Spanish": "Español",
  "Catalan": "Catalán",
  "Russian": "Ruso",
  "Language": "Idioma",
  "This is the main list most trips should start from.":
    "Esta es la lista principal desde la que deberían empezar la mayoría de los viajes.",
  "Start here": "Empieza aquí",
  "Your starter template should appear here automatically.":
    "Tu plantilla inicial debería aparecer aquí automáticamente.",
  "Other templates": "Otras plantillas",
  "Keep extras only for clearly different trip styles.":
    "Guarda extras solo para estilos de viaje claramente distintos.",
  "No extra templates yet.": "Todavía no hay plantillas extra.",
  "Create another template": "Crear otra plantilla",
  "Use this for a real variation like winter gear or work travel.":
    "Úsalo para una variación real, como equipo de invierno o viajes de trabajo.",
  "Extra template name": "Nombre de la plantilla extra",
  "Winter carry-on": "Equipaje de mano de invierno",
  "Create extra template": "Crear plantilla extra",
  "Cancel": "Cancelar",
  "Create a template now": "Crear una plantilla ahora",
  "If the starter template is delayed, create one here so you can keep going.":
    "Si la plantilla inicial se retrasa, crea una aquí para poder seguir.",
  "Template name": "Nombre de la plantilla",
  "Weekend carry-on": "Equipaje de mano de fin de semana",
  "Create template": "Crear plantilla",
  "Plan the route and start packing from leg one.":
    "Planifica la ruta y empieza a preparar el equipaje desde el primer tramo.",
  "Add where you are going and your checklist becomes live as soon as the trip is created.":
    "Añade adónde vas y tu lista se activará en cuanto se cree el viaje.",
  "Quick view": "Vista rápida",
  "Active trips stay on top, and new ones start immediately.":
    "Los viajes activos se quedan arriba y los nuevos empiezan al instante.",
  "Active trip": "Viaje activo",
  "Live in the list below": "Activo en la lista de abajo",
  "None yet": "Todavía ninguno",
  "Templates available": "Plantillas disponibles",
  "Saved trips": "Viajes guardados",
  "No templates yet": "Todavía no hay plantillas",
  "Create or recover a template before planning a trip.":
    "Crea o recupera una plantilla antes de planificar un viaje.",
  "Open any trip to keep packing or review the route.":
    "Abre cualquier viaje para seguir preparando el equipaje o revisar la ruta.",
  "Open your default list and edit it fast.":
    "Abre tu lista por defecto y edítala rápido.",
  "Keep one trusted main template. Add another only when the trip really needs its own version.":
    "Mantén una plantilla principal de confianza. Añade otra solo cuando el viaje necesite una versión propia.",
  "Starter template not ready yet": "La plantilla inicial todavía no está lista",
  "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.":
    "Los espacios nuevos deberían abrir directamente la lista de equipaje por defecto, así que no deberías necesitar crear una plantilla antes de empezar.",
  "Template not found": "Plantilla no encontrada",
  "This template may have been deleted, or this workspace does not own it.":
    "Puede que esta plantilla se haya eliminado o que este espacio no sea su propietario.",
  "Pick the default template on the left to keep going.":
    "Elige la plantilla por defecto de la izquierda para seguir.",
  "No trips yet": "Todavía no hay viajes",
  "Your saved trips will appear here once you create the first route.":
    "Tus viajes guardados aparecerán aquí cuando crees la primera ruta.",
  "Active now": "Activo ahora",
  "Template": "Plantilla",
  "Snapshot only": "Solo instantánea",
  "Journey": "Trayecto",
  "legs done": "tramos completados",
  "Created": "Creado",
  "Current route": "Ruta actual",
  "Route pending": "Ruta pendiente",
  "Checklist becomes active once the trip starts.":
    "La lista se activa cuando empieza el viaje.",
  "Open trip": "Abrir viaje",
  "Start your trip": "Empieza tu viaje",
  "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.":
    "Añade tus paradas y traeremos tu lista habitual automáticamente. Si tienes listas extra guardadas, puedes cambiarlas aquí.",
  "Main list selected first": "La lista principal se selecciona primero",
  "Trip name (optional)": "Nombre del viaje (opcional)",
  "Spring city break": "Escapada urbana de primavera",
  "Leave blank to use:": "Déjalo vacío para usar:",
  "Leave blank to generate the trip name from your destinations.":
    "Déjalo vacío para generar el nombre del viaje a partir de tus destinos.",
  "Packing list": "Lista de equipaje",
  "default": "por defecto",
  "items": "elementos",
  "Your main saved list is selected first.":
    "Tu lista principal guardada se selecciona primero.",
  "Choose any saved list for this trip.": "Elige cualquier lista guardada para este viaje.",
  "Route mode": "Modo de ruta",
  "Selected": "Seleccionado",
  "Home → Destination → Home": "Casa → Destino → Casa",
  "Home → Stop 1 → Stop 2 → Home": "Casa → Parada 1 → Parada 2 → Casa",
  "Destination": "Destino",
  "Stops": "Paradas",
  "Add stop": "Añadir parada",
  "Stop": "Parada",
  "Route preview": "Vista previa de la ruta",
  "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.":
    "Los elementos se copian cuando creas el viaje y el primer tramo de la lista empieza enseguida, así que los cambios posteriores en la plantilla no cambiarán esta lista.",
  "Unable to create the trip right now.": "No se puede crear el viaje ahora mismo.",
  "Creating and starting trip...": "Creando e iniciando el viaje...",
  "Create and start trip": "Crear e iniciar viaje",
  "No checklist yet.": "Todavía no hay checklist.",
  "Back to trips": "Volver a viajes",
  "Unable to start the trip.": "No se puede iniciar el viaje.",
  "Start trip": "Iniciar viaje",
  "Unable to complete the leg.": "No se puede completar el tramo.",
  "Arrived": "Llegado",
  "Unable to reroute home right now.": "No se puede redirigir a casa ahora mismo.",
  "Go home now": "Volver a casa ahora",
  "Current leg": "Tramo actual",
  "Not started yet": "Aún no ha empezado",
  "Journey legs": "Tramos del viaje",
  "Each leg keeps its own checklist.": "Cada tramo mantiene su propia lista.",
  "Leg": "Tramo",
  "This trip doesn't have any snapshot items yet.":
    "Este viaje todavía no tiene elementos de instantánea.",
  "Unable to update the checklist item.":
    "No se puede actualizar el elemento de la lista.",
  "Start the trip to activate the first leg checklist.":
    "Inicia el viaje para activar la lista del primer tramo.",
  "This trip is complete, so the checklist is read-only.":
    "Este viaje está completo, así que la lista es de solo lectura.",
  "This checklist is shown for history, not editing.":
    "Esta lista se muestra como historial, no para editar.",
  "Need to cut the route short?": "¿Necesitas acortar la ruta?",
  "Skip the remaining stops and switch to a direct leg home.":
    "Omite las paradas restantes y cambia a un tramo directo a casa.",
  "Skip ahead and head home": "Saltar y volver a casa",
  "At a glance": "De un vistazo",
  "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.":
    "El acceso con Google todavía no está configurado aquí. El modo invitado sigue permitiendo todo el flujo de equipaje.",
};

const ca: typeof en = {
  "Packmap": "Packmap",
  "Trip-first packing": "Equipatge pensat per al viatge",
  "Start a trip.": "Comença un viatge.",
  "Pack only what this leg needs.": "Empaca només el que necessita aquest tram.",
  "Jump straight into the trip builder, set your route, and get a live checklist instead of a lecture about internal setup.":
    "Entra directament al creador de viatges, defineix la ruta i obtén una llista activa en lloc d'una explicació sobre la configuració interna.",
  "No account required": "Sense compte",
  "Opens the trip builder": "Obre el planificador",
  "Google stays optional": "Google continua sent opcional",
  "Preview": "Vista prèvia",
  "Lisbon weekend": "Cap de setmana a Lisboa",
  "Current leg: Home to Lisbon": "Tram actual: Casa a Lisboa",
  "Live": "En directe",
  "Route": "Ruta",
  "Checklist": "Llista",
  "Passport": "Passaport",
  "Phone charger": "Carregador del mòbil",
  "Socks": "Mitjons",
  "Toothbrush": "Raspall de dents",
  "Start in under a minute": "Comença en menys d'un minut",
  "Open the trip builder now": "Obre el planificador ara",
  "One click opens the route planner immediately. No account wall, no template jargon first.":
    "Un clic obre el planificador de rutes immediatament. Sense mur de compte ni jerga de plantilles.",
  "Start a trip now": "Comença un viatge ara",
  "You will land in the trip builder right away and can connect Google later if you want the same trip on another device.":
    "Entraràs directament al planificador i podràs connectar Google després si vols el mateix viatge en un altre dispositiu.",
  "Prefer to keep it synced?": "Vols mantenir-ho sincronitzat?",
  "Start with Google and we will bring you to the same place.":
    "Comença amb Google i et portarem al mateix punt.",
  "Start with Google": "Començar amb Google",
  "Google sign-in is not ready in this environment yet, but guest mode still opens the full trip flow.":
    "L'accés amb Google encara no està preparat en aquest entorn, però el mode convidat sí que obre tot el flux del viatge.",
  "Set the route": "Defineix la ruta",
  "We open the trip builder immediately, so you can add where you are going first.":
    "Obrim el planificador de viatge immediatament perquè primer puguis afegir on vas.",
  "Get the checklist": "Obté la llista",
  "Your essentials are ready when the trip is created, and the first leg starts right away.":
    "Els teus bàsics estaran preparats quan es creï el viatge i el primer tram començarà de seguida.",
  "Keep it anywhere": "Porta-ho a tot arreu",
  "Start as a guest now, then connect Google later if you want the same trip on another device.":
    "Comença ara com a convidat i connecta Google més tard si vols el mateix viatge en un altre dispositiu.",
  "Step {step}": "Pas {step}",
  "Home": "Inici",
  "Templates": "Plantilles",
  "Trips": "Viatges",
  "Add Google sign-in": "Afegir accés amb Google",
  "Log out": "Tancar sessió",
  "Switch to guest": "Canviar a convidat",
  "Google sign-in is not configured here yet":
    "L'accés amb Google encara no està configurat aquí",
  "Traveler": "Viatger",
  "Dashboard": "Tauler",
  "Back": "Tornar",
  "Profile": "Perfil",
  "Not provided": "No indicat",
  "Continue with Google": "Continuar amb Google",
  "Supabase is not configured yet, so Google sign-in is unavailable in this environment.":
    "Supabase encara no està configurat, així que l'accés amb Google no està disponible en aquest entorn.",
  "Google sign-in could not start because no redirect URL was returned.":
    "No s'ha pogut iniciar l'accés amb Google perquè no s'ha retornat cap URL de redirecció.",
  "Wrapping up Google sign-in": "Acabant l'accés amb Google",
  "Finishing Google sign-in...": "Acabant l'accés amb Google...",
  "Back to home": "Tornar a l'inici",
  "Loading callback details...": "Carregant detalls del callback...",
  "Google sign-in returned without an authorization code.":
    "L'accés amb Google ha tornat sense codi d'autorització.",
  "Supabase is not configured yet, so Google sign-in cannot complete.":
    "Supabase encara no està configurat, així que l'accés amb Google no es pot completar.",
  "Google sign-in completed, but no session was created.":
    "L'accés amb Google s'ha completat, però no s'ha creat cap sessió.",
  "English": "Anglès",
  "Spanish": "Espanyol",
  "Catalan": "Català",
  "Russian": "Rus",
  "Language": "Idioma",
  "This is the main list most trips should start from.":
    "Aquesta és la llista principal des d'on haurien de començar la majoria de viatges.",
  "Start here": "Comença aquí",
  "Your starter template should appear here automatically.":
    "La plantilla inicial hauria d'aparèixer aquí automàticament.",
  "Other templates": "Altres plantilles",
  "Keep extras only for clearly different trip styles.":
    "Guarda extres només per a estils de viatge clarament diferents.",
  "No extra templates yet.": "Encara no hi ha plantilles extra.",
  "Create another template": "Crear una altra plantilla",
  "Use this for a real variation like winter gear or work travel.":
    "Fes servir això per a una variació real, com equip d'hivern o viatges de feina.",
  "Extra template name": "Nom de la plantilla extra",
  "Winter carry-on": "Equipatge de mà d'hivern",
  "Create extra template": "Crear plantilla extra",
  "Cancel": "Cancel·lar",
  "Create a template now": "Crear una plantilla ara",
  "If the starter template is delayed, create one here so you can keep going.":
    "Si la plantilla inicial es retarda, crea'n una aquí per poder continuar.",
  "Template name": "Nom de la plantilla",
  "Weekend carry-on": "Equipatge de mà de cap de setmana",
  "Create template": "Crear plantilla",
  "Plan the route and start packing from leg one.":
    "Planifica la ruta i comença a preparar l'equipatge des del primer tram.",
  "Add where you are going and your checklist becomes live as soon as the trip is created.":
    "Afegeix on vas i la llista s'activarà tan bon punt es creï el viatge.",
  "Quick view": "Vista ràpida",
  "Active trips stay on top, and new ones start immediately.":
    "Els viatges actius es queden a dalt i els nous comencen immediatament.",
  "Active trip": "Viatge actiu",
  "Live in the list below": "Actiu a la llista de sota",
  "None yet": "Encara cap",
  "Templates available": "Plantilles disponibles",
  "Saved trips": "Viatges desats",
  "No templates yet": "Encara no hi ha plantilles",
  "Create or recover a template before planning a trip.":
    "Crea o recupera una plantilla abans de planificar un viatge.",
  "Open any trip to keep packing or review the route.":
    "Obre qualsevol viatge per continuar preparant l'equipatge o revisar la ruta.",
  "Open your default list and edit it fast.": "Obre la teva llista per defecte i edita-la ràpid.",
  "Keep one trusted main template. Add another only when the trip really needs its own version.":
    "Mantén una plantilla principal de confiança. Afegeix-ne una altra només quan el viatge realment necessiti una versió pròpia.",
  "Starter template not ready yet": "La plantilla inicial encara no està a punt",
  "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.":
    "Els espais nous haurien d'obrir directament la llista d'equipatge per defecte, així que no hauries de necessitar crear una plantilla abans de començar.",
  "Template not found": "Plantilla no trobada",
  "This template may have been deleted, or this workspace does not own it.":
    "Pot ser que aquesta plantilla s'hagi eliminat o que aquest espai no en sigui el propietari.",
  "Pick the default template on the left to keep going.":
    "Tria la plantilla per defecte de l'esquerra per continuar.",
  "No trips yet": "Encara no hi ha viatges",
  "Your saved trips will appear here once you create the first route.":
    "Els teus viatges desats apareixeran aquí quan creïs la primera ruta.",
  "Active now": "Actiu ara",
  "Template": "Plantilla",
  "Snapshot only": "Només instantània",
  "Journey": "Trajecte",
  "legs done": "trams fets",
  "Created": "Creat",
  "Current route": "Ruta actual",
  "Route pending": "Ruta pendent",
  "Checklist becomes active once the trip starts.":
    "La llista s'activa quan comença el viatge.",
  "Open trip": "Obrir viatge",
  "Start your trip": "Comença el teu viatge",
  "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.":
    "Afegeix les teves parades i portarem la teva llista habitual automàticament. Si tens llistes extra desades, les pots canviar aquí.",
  "Main list selected first": "La llista principal se selecciona primer",
  "Trip name (optional)": "Nom del viatge (opcional)",
  "Spring city break": "Escapada urbana de primavera",
  "Leave blank to use:": "Deixa-ho en blanc per fer servir:",
  "Leave blank to generate the trip name from your destinations.":
    "Deixa-ho en blanc per generar el nom del viatge a partir de les teves destinacions.",
  "Packing list": "Llista d'equipatge",
  "default": "per defecte",
  "items": "elements",
  "Your main saved list is selected first.":
    "La teva llista principal desada se selecciona primer.",
  "Choose any saved list for this trip.": "Tria qualsevol llista desada per a aquest viatge.",
  "Route mode": "Mode de ruta",
  "Selected": "Seleccionat",
  "Home → Destination → Home": "Casa → Destinació → Casa",
  "Home → Stop 1 → Stop 2 → Home": "Casa → Parada 1 → Parada 2 → Casa",
  "Destination": "Destinació",
  "Stops": "Parades",
  "Add stop": "Afegir parada",
  "Stop": "Parada",
  "Route preview": "Vista prèvia de la ruta",
  "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.":
    "Els elements es copien quan crees el viatge i el primer tram de la llista comença de seguida, de manera que els canvis posteriors a la plantilla no modificaran aquesta llista.",
  "Unable to create the trip right now.":
    "Ara mateix no es pot crear el viatge.",
  "Creating and starting trip...": "Creant i iniciant el viatge...",
  "Create and start trip": "Crear i iniciar viatge",
  "No checklist yet.": "Encara no hi ha checklist.",
  "Back to trips": "Tornar als viatges",
  "Unable to start the trip.": "No es pot iniciar el viatge.",
  "Start trip": "Iniciar viatge",
  "Unable to complete the leg.": "No es pot completar el tram.",
  "Arrived": "Arribat",
  "Unable to reroute home right now.":
    "Ara mateix no es pot redirigir cap a casa.",
  "Go home now": "Tornar a casa ara",
  "Current leg": "Tram actual",
  "Not started yet": "Encara no ha començat",
  "Journey legs": "Trams del viatge",
  "Each leg keeps its own checklist.": "Cada tram manté la seva pròpia llista.",
  "Leg": "Tram",
  "This trip doesn't have any snapshot items yet.":
    "Aquest viatge encara no té elements d'instantània.",
  "Unable to update the checklist item.":
    "No es pot actualitzar l'element de la llista.",
  "Start the trip to activate the first leg checklist.":
    "Inicia el viatge per activar la llista del primer tram.",
  "This trip is complete, so the checklist is read-only.":
    "Aquest viatge s'ha completat, així que la llista és només de lectura.",
  "This checklist is shown for history, not editing.":
    "Aquesta llista es mostra per a historial, no per editar.",
  "Need to cut the route short?": "Cal escurçar la ruta?",
  "Skip the remaining stops and switch to a direct leg home.":
    "Salta les parades restants i passa a un tram directe cap a casa.",
  "Skip ahead and head home": "Saltar i tornar a casa",
  "At a glance": "D'un cop d'ull",
  "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.":
    "L'accés amb Google encara no està configurat aquí. El mode convidat continua permetent tot el flux d'equipatge.",
};

const ru: typeof en = {
  "Packmap": "Packmap",
  "Trip-first packing": "Сборы вокруг поездки",
  "Start a trip.": "Начните поездку.",
  "Pack only what this leg needs.": "Берите только то, что нужно на этот этап.",
  "Jump straight into the trip builder, set your route, and get a live checklist instead of a lecture about internal setup.":
    "Сразу переходите к созданию поездки, задавайте маршрут и получайте живой чеклист без лекции о внутренней настройке.",
  "No account required": "Без аккаунта",
  "Opens the trip builder": "Открывает планировщик",
  "Google stays optional": "Google остаётся необязательным",
  "Preview": "Превью",
  "Lisbon weekend": "Выходные в Лиссабоне",
  "Current leg: Home to Lisbon": "Текущий этап: Дом в Лиссабон",
  "Live": "Активно",
  "Route": "Маршрут",
  "Checklist": "Чеклист",
  "Passport": "Паспорт",
  "Phone charger": "Зарядка для телефона",
  "Socks": "Носки",
  "Toothbrush": "Зубная щётка",
  "Start in under a minute": "Начните меньше чем за минуту",
  "Open the trip builder now": "Открыть планировщик сейчас",
  "One click opens the route planner immediately. No account wall, no template jargon first.":
    "Один клик сразу открывает планировщик маршрута. Без стены входа и без терминов про шаблоны.",
  "Start a trip now": "Начать поездку сейчас",
  "You will land in the trip builder right away and can connect Google later if you want the same trip on another device.":
    "Вы сразу попадёте в планировщик поездки и сможете подключить Google позже, если захотите продолжить ту же поездку на другом устройстве.",
  "Prefer to keep it synced?": "Хотите синхронизацию?",
  "Start with Google and we will bring you to the same place.":
    "Начните через Google, и мы вернём вас в то же место.",
  "Start with Google": "Начать с Google",
  "Google sign-in is not ready in this environment yet, but guest mode still opens the full trip flow.":
    "Вход через Google в этом окружении пока не настроен, но гостевой режим всё равно открывает полный сценарий поездки.",
  "Set the route": "Задайте маршрут",
  "We open the trip builder immediately, so you can add where you are going first.":
    "Мы сразу открываем планировщик поездки, чтобы вы сначала указали, куда едете.",
  "Get the checklist": "Получите чеклист",
  "Your essentials are ready when the trip is created, and the first leg starts right away.":
    "Ваши основные вещи будут готовы при создании поездки, а первый этап начнётся сразу.",
  "Keep it anywhere": "Держите всё под рукой",
  "Start as a guest now, then connect Google later if you want the same trip on another device.":
    "Сейчас начните как гость, а Google подключите позже, если захотите ту же поездку на другом устройстве.",
  "Step {step}": "Шаг {step}",
  "Home": "Главная",
  "Templates": "Шаблоны",
  "Trips": "Поездки",
  "Add Google sign-in": "Добавить вход через Google",
  "Log out": "Выйти",
  "Switch to guest": "Переключиться на гостя",
  "Google sign-in is not configured here yet":
    "Вход через Google здесь пока не настроен",
  "Traveler": "Путешественник",
  "Dashboard": "Панель",
  "Back": "Назад",
  "Profile": "Профиль",
  "Not provided": "Не указано",
  "Continue with Google": "Продолжить с Google",
  "Supabase is not configured yet, so Google sign-in is unavailable in this environment.":
    "Supabase пока не настроен, поэтому вход через Google в этом окружении недоступен.",
  "Google sign-in could not start because no redirect URL was returned.":
    "Не удалось начать вход через Google, потому что не был возвращён URL для перенаправления.",
  "Wrapping up Google sign-in": "Завершаем вход через Google",
  "Finishing Google sign-in...": "Завершаем вход через Google...",
  "Back to home": "Вернуться на главную",
  "Loading callback details...": "Загружаем данные callback...",
  "Google sign-in returned without an authorization code.":
    "Вход через Google вернулся без кода авторизации.",
  "Supabase is not configured yet, so Google sign-in cannot complete.":
    "Supabase пока не настроен, поэтому вход через Google не может завершиться.",
  "Google sign-in completed, but no session was created.":
    "Вход через Google завершился, но сессия не была создана.",
  "English": "Английский",
  "Spanish": "Испанский",
  "Catalan": "Каталанский",
  "Russian": "Русский",
  "Language": "Язык",
  "This is the main list most trips should start from.":
    "Это основной список, с которого должна начинаться большинство поездок.",
  "Start here": "Начните здесь",
  "Your starter template should appear here automatically.":
    "Ваш стартовый шаблон должен появиться здесь автоматически.",
  "Other templates": "Другие шаблоны",
  "Keep extras only for clearly different trip styles.":
    "Оставляйте дополнительные шаблоны только для действительно отличающихся типов поездок.",
  "No extra templates yet.": "Дополнительных шаблонов пока нет.",
  "Create another template": "Создать ещё один шаблон",
  "Use this for a real variation like winter gear or work travel.":
    "Используйте это для реального варианта вроде зимних вещей или рабочих поездок.",
  "Extra template name": "Название дополнительного шаблона",
  "Winter carry-on": "Зимняя ручная кладь",
  "Create extra template": "Создать дополнительный шаблон",
  "Cancel": "Отмена",
  "Create a template now": "Создать шаблон сейчас",
  "If the starter template is delayed, create one here so you can keep going.":
    "Если стартовый шаблон задерживается, создайте его здесь, чтобы продолжить.",
  "Template name": "Название шаблона",
  "Weekend carry-on": "Ручная кладь на выходные",
  "Create template": "Создать шаблон",
  "Plan the route and start packing from leg one.":
    "Спланируйте маршрут и начните собираться с первого этапа.",
  "Add where you are going and your checklist becomes live as soon as the trip is created.":
    "Добавьте, куда вы едете, и чеклист станет активным сразу после создания поездки.",
  "Quick view": "Быстрый обзор",
  "Active trips stay on top, and new ones start immediately.":
    "Активные поездки остаются сверху, а новые начинаются сразу.",
  "Active trip": "Активная поездка",
  "Live in the list below": "Активна в списке ниже",
  "None yet": "Пока нет",
  "Templates available": "Доступные шаблоны",
  "Saved trips": "Сохранённые поездки",
  "No templates yet": "Шаблонов пока нет",
  "Create or recover a template before planning a trip.":
    "Создайте или восстановите шаблон перед планированием поездки.",
  "Open any trip to keep packing or review the route.":
    "Откройте любую поездку, чтобы продолжить сборы или проверить маршрут.",
  "Open your default list and edit it fast.":
    "Откройте ваш список по умолчанию и быстро отредактируйте его.",
  "Keep one trusted main template. Add another only when the trip really needs its own version.":
    "Держите один основной надёжный шаблон. Добавляйте другой только когда поездке действительно нужен свой вариант.",
  "Starter template not ready yet": "Стартовый шаблон ещё не готов",
  "New workspaces should open straight into the default packing list, so you should not need to create a template before you can start.":
    "Новые рабочие пространства должны сразу открывать список вещей по умолчанию, поэтому создавать шаблон перед началом не должно понадобиться.",
  "Template not found": "Шаблон не найден",
  "This template may have been deleted, or this workspace does not own it.":
    "Возможно, этот шаблон был удалён или это рабочее пространство им не владеет.",
  "Pick the default template on the left to keep going.":
    "Выберите слева шаблон по умолчанию, чтобы продолжить.",
  "No trips yet": "Поездок пока нет",
  "Your saved trips will appear here once you create the first route.":
    "Ваши сохранённые поездки появятся здесь после создания первого маршрута.",
  "Active now": "Активно сейчас",
  "Template": "Шаблон",
  "Snapshot only": "Только снимок",
  "Journey": "Маршрут",
  "legs done": "этапов завершено",
  "Created": "Создано",
  "Current route": "Текущий маршрут",
  "Route pending": "Маршрут ещё не начат",
  "Checklist becomes active once the trip starts.":
    "Чеклист станет активным, когда поездка начнётся.",
  "Open trip": "Открыть поездку",
  "Start your trip": "Начните поездку",
  "Add your stops and we'll bring in your usual packing list automatically. If you have extra saved lists, you can switch them here.":
    "Добавьте остановки, и мы автоматически подключим ваш обычный список вещей. Если у вас есть дополнительные сохранённые списки, их можно выбрать здесь.",
  "Main list selected first": "Сначала выбран основной список",
  "Trip name (optional)": "Название поездки (необязательно)",
  "Spring city break": "Весенний выезд в город",
  "Leave blank to use:": "Оставьте пустым, чтобы использовать:",
  "Leave blank to generate the trip name from your destinations.":
    "Оставьте пустым, чтобы сгенерировать название поездки по направлениям.",
  "Packing list": "Список вещей",
  "default": "по умолчанию",
  "items": "вещей",
  "Your main saved list is selected first.":
    "Ваш основной сохранённый список выбирается первым.",
  "Choose any saved list for this trip.": "Выберите любой сохранённый список для этой поездки.",
  "Route mode": "Режим маршрута",
  "Selected": "Выбрано",
  "Home → Destination → Home": "Дом → Пункт назначения → Дом",
  "Home → Stop 1 → Stop 2 → Home": "Дом → Остановка 1 → Остановка 2 → Дом",
  "Destination": "Пункт назначения",
  "Stops": "Остановки",
  "Add stop": "Добавить остановку",
  "Stop": "Остановка",
  "Route preview": "Предпросмотр маршрута",
  "Items are copied when you create the trip, and the first checklist leg starts right away, so later template edits won't change this checklist.":
    "Вещи копируются при создании поездки, и чеклист первого этапа начинается сразу, поэтому последующие изменения шаблона не изменят этот чеклист.",
  "Unable to create the trip right now.": "Сейчас не удаётся создать поездку.",
  "Creating and starting trip...": "Создаём и запускаем поездку...",
  "Create and start trip": "Создать и начать поездку",
  "No checklist yet.": "Чеклиста пока нет.",
  "Back to trips": "Назад к поездкам",
  "Unable to start the trip.": "Не удалось начать поездку.",
  "Start trip": "Начать поездку",
  "Unable to complete the leg.": "Не удалось завершить этап.",
  "Arrived": "Прибыли",
  "Unable to reroute home right now.": "Сейчас не удаётся перестроить путь домой.",
  "Go home now": "Поехать домой сейчас",
  "Current leg": "Текущий этап",
  "Not started yet": "Пока не начато",
  "Journey legs": "Этапы маршрута",
  "Each leg keeps its own checklist.": "У каждого этапа свой чеклист.",
  "Leg": "Этап",
  "This trip doesn't have any snapshot items yet.":
    "В этой поездке пока нет элементов снимка.",
  "Unable to update the checklist item.":
    "Не удалось обновить пункт чеклиста.",
  "Start the trip to activate the first leg checklist.":
    "Начните поездку, чтобы активировать чеклист первого этапа.",
  "This trip is complete, so the checklist is read-only.":
    "Эта поездка завершена, поэтому чеклист доступен только для чтения.",
  "This checklist is shown for history, not editing.":
    "Этот чеклист показывается для истории, а не для редактирования.",
  "Need to cut the route short?": "Нужно сократить маршрут?",
  "Skip the remaining stops and switch to a direct leg home.":
    "Пропустите оставшиеся остановки и переключитесь на прямой этап домой.",
  "Skip ahead and head home": "Пропустить и поехать домой",
  "At a glance": "Кратко",
  "Google sign-in is not configured here yet. Guest mode still supports the full packing flow.":
    "Вход через Google здесь пока не настроен. Гостевой режим всё ещё поддерживает полный сценарий сборов.",
};

export const MESSAGES: Record<Locale, typeof en> = {
  en,
  es,
  ca,
  ru,
};

export type MessageKey = keyof typeof en;
