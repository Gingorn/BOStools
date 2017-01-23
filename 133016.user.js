// ==UserScript==
// @name           COTG BoS
// @description    Additions to Crown of the Gods: summary, food calculator, recruitment speed calculator, combat calculator and various other features
// @namespace      BoS
// @author         Urthadar
// @include        http://prodgame*.lordofultima.com/*/index.aspx*
// @version        1.5.3
// @require        http://sizzlemctwizzle.com/updater.php?id=84343&days=1
// ==/UserScript==

(function wholeBosScriptFunc(){

var main = function bosMainFunc() {

function bosStartIfQooxoodoIsAvailable() {
	if (qx === undefined) {
		window.setTimeout(bosStartIfQooxoodoIsAvailable, 5000);
	} else {
		bosScript();		
	}
}

window.setTimeout(bosStartIfQooxoodoIsAvailable, 5000);

var bosScript = function() {

qx.Class.define("bos.Const", {
	statics: {	
		DEBUG_VERSION: true,
	
		TRADE_TRANSPORT_CART: 1,
		TRADE_TRANSPORT_SHIP: 2,
		TRADE_TRANSPORT_CART_FIRST: 3,
		TRADE_TRANSPORT_SHIP_FIRST: 4,
		
		CART_CAPACITY: 1000,
		SHIP_CAPACITY: 10000,
		
		TRADE_STATE_TRANSPORT: 1,
		TRADE_STATE_RETURN: 2,

		GOLD: 0,
		WOOD: 1,
		STONE: 2,
		IRON: 3,
		FOOD: 4,

		ORDER_ATTACK: 0,
		ORDER_DEFEND: 1,
		ORDER_SUPPORT: 2,

		MOONSTONE_COST: 1000,
		
		TABLE_SUMMARY_ROW_BORDER: "2px solid #E8D3AE",
		TABLE_BORDER: "1px dotted rgb(77, 79, 70)",
		TABLE_DEFAULT_COLOR: "#F3D298",
		RESOURCE_GREEN: "#40C849",
		RESOURCE_YELLOW: "#FFE400",
		RESOURCE_RED: "#FF0000",
		
		INF: 1000000000,
		
		REGION_CITY: 0,
		REGION_CASTLE: 1,
		REGION_LAWLESS_CITY: 2,
		REGION_LAWLESS_CASTLE: 3,
		REGION_RUINS: 4,
		REGION_UNKNOWN: 5,

		EXTRA_WIDE_OVERLAY: 999,
		
		FAKE_ATTACK_TS: 4000,
		
		//flood control
		MIN_SEND_COMMAND_INTERVAL: 500,
		
		//server peridically sends new data with new resource levels, updated city orders -> it causes summary to refresh but better not to refresh if very recently there was another refresh
		MIN_INTERVAL_BETWEEN_AUTO_REFRESHES: 5000,
		
		MAX_POPUPS: 10
	}
});

var server;
var locale = qx.locale.Manager.getInstance().getLocale();

var bosLocalizedStrings = {
  "en": {
	"summary": "Summary",
	"combat calculator": "Combat calculator",
	"food calculator": "Food calculator",
	"recruitment speed calculator": "Recruitment speed calculator",
	"jump to coords": "Jump to coords",
	"jump to city": "Jump to city",
	"please enter city coordinates": "Please enter city coordinates (for example 12:34) :",
	"jump to player": "Jump to player",
	"please enter player name:": "Please enter player name:",
	"jump to alliance": "Jump to alliance",
	"please enter alliance name:": "Please enter alliance name:",
	"error during BOS Tools menu creation: ": "Error during BOS Tools menu creation: ",
	"id": "Id", 
	"cityId": "City Id", 
	"from": "From", 
	"type": "Type", 
	"transport": "Transport", 
	"state": "State", 
	"start": "Start", 
	"end": "End", 
	"position": "Position", 
	"target": "Target", 
	"lastUpdated": "Last Updated", 
	"resources": "Resources",
	"filter by trade type": "Filter by: <b>trade type</b>",
	"filter by: transport type": "Filter by: <b>transport type</b>",
	"filter by: resources receiver": "Filter by: <b>resources receiver</b>",
	"you": "You",
	"someone else": "Someone else",
	"filter by: state": "Filter by: <b>state</b>",
	"trade route": "Trade route",
	"OK": "OK",
	"clear": "Clear",
	"max": "Max",
	"please enter some resources amount": "Please enter some resources amount",
	"invalid destination": "Invalid destination",
	"to": "To",
	"ships then carts": "Ships then carts",
	"carts then ships": "Carts then ships",
	"only carts": "Only carts",
	"only ships": "Only ships",
	"group": "Group",
	"resourceMultiplierNotice": "if resourceCount < 10000 then resourceCount = resourceCount * 1000",
	"trade routes": "Trade Routes",
	"fromTo": "From/To",
	"action": "Action",
	"status": "Status",
	"wood": "Wood", 
	"stone": "Stone", 
	"iron": "Iron", 
	"food": "Food", 
	"land/sea": "Land/Sea", 
	"edit": "Edit",	
	"options": "Options",
	"table settings": "Table settings",
	"load table settings at start": "Load tables settings at start",
	"table name": "Table name",
	"cities": "Cities",
	"military": "Military",
	"btnLoadTableSettings": "Load table settings",
	"btnLoadTableSettings_toolTip": "Loads previously saved table settings (column order, widths, visibility, sort order)",
	"btnSaveTableSettings": "Save table settings",
	"btnSaveTableSettings_toolTip": "Saves table settings: column order, widths, visibility, sort order",
	"saving cities data": "Saving cities data",
	"cbPersistCities": "Save cities data",
	"cbPersistCities_toolTip": "After navigating to next city previous city is saved to browser local storage.",
	"cbLoadPersistedCitiesAtStart": "Load saved cities data at game start",
	"btnLoadCities": "Manually load saved cities data",
	"btnLoadCities_toolTip": "Manually loads cities data saved during previous game sessions",
	"btnDeleteAllSavedData": "Delete all saved data",
	"btnDeleteAllSavedData_confirmation": "All saved data has been deleted",
	"persistHelp": "When web browser session ends all data about visited cities are lost. Because of that on next game session summary widget doesn't contain a lot data. To enable better game experience there is possibility to save in persistent browser storage all data about visited cities and load them manually or automaticaly before showing summary. This feature works best if used together with 'Refresh resources' button.",	
	"all": "All",
	"building": "Building",
	"castles": "Castles",
	"defensive": "Defensive",
	"warehouses": "Warehouses",
	"moonstones": "Moonstones",
	"gold": "Gold",
	"name": "Name",
	"reference": "Reference",
	"btnRefreshResources": "Refresh resources",
	"btnRefreshResources_toolTip": "Uses 'Request resources' functionality to get current resource levels.<br/>It won't be able to fetch information about cities without any <b>available</b> cart or ship.<br/>Processing request can take some time because it waits until server will respond.<br>Resources refreshed at: never",	
	"purify resources": "Purify Resources",
	"btnPurifyAll": "Purify All",
	"btnPurifyAll_toolTip": "Purify resources for cities with <b>marked Moonglow Tower</b>.<br/>When Building Minister is present it will try not to purify food in city with negative food balance or in castles.<br/>If there is no Building Minister then it will skip castles.",
	"confirmation": "Confirmation",
	"are you sure?": "Are you sure?",
	"btnMarkMoonglowTower": "Mark Moonglow Tower",
	"btnMarkMoonglowTower_toolTip": "Finds in current city <b>Moonglow Tower</b> and saves it's id for later use",
	"btnUnmarkMoonglowTower": "Unmark Moonglow Tower",
	"btnUnmarkMoonglowTower_toolTip": "Unmarks previously saved <b>Moonglow Tower</b> in current city",
	"help": "Help",	
	"_minimumResLevelInput_toolTip": "% of max storage that has to remain in each city after mass purification<br/>Manual purification is not affected by this setting",
	"_minimumResLevelInput_absolute_toolTip": "number of resources that has to remain in each city after mass purification<br/>Manual purification is not affected by this setting",
	"purificationHelp": "1. put *M* in city reference, by doing so city will be displayed in table below<br/>2. mark Moonglow Tower in cities enabled for 'Purify All'<br/>3. Use Purify all button or click in cell one of purified resource types",
	"purifiable": "Purifiable",
	"darkwood": "Darkwood",
	"runestone": "Runestone",
	"veritum": "Veritum",
	"trueseed": "Trueseed",
	"refresh": "Refresh",
	"sbSourceContinent_toolTip": "Filter by: <b>source continent</b>",
	"sbDestinationContinent_toolTip": "Filter by: <b>destination continent</b>",
	"defender": "Defender",
	"attacker": "Attacker",
	"btnUpdateView_toolTip": "Refresh View",
	"cbShowFakeAttacks": "Show fake attacks",
	"cbShowFakeAttacks_toolTip": "Fake attack is: plunder or siege or assault with TS < 4000",
	"unit orders": "Unit Orders",
	"incoming attacks": "Incoming attacks",
	"btnCsvExport": "Export Csv",
	"you need to be in city": "You need to be in city",
	"food calculator": "Food calculator",
	"mass recruitment": "Mass Recruitment",
	"bos.gui.MassRecruitmentPage.help": "Currently requires Building Minister and War Minister. Persisting of cities and loading them on start have to be enabled or there will be popups saying to visit some city. Recruitment time is updated when enabling city for mass recruitment, if it changes enable it again. List of error codes:", 
	"bos.gui.MassRecruitmentPage.help2": "I - Invalid, R - not enough Resources, Q - recruitment Queue is full, T - Troop limit exceeded, B - missing Building, G - not enough Gold",
	"city/order": "City / Orders",
	"missing": "Missing",
	"resourcesFor": "Resources for",
	"recruiting": "Recruiting",
	"available": "Available",
	"btnEnableMassRecruitment": "Enable",
	"btnEnableMassRecruitment_toolTip": "Enables current city for mass recruitment",
	"btnDisableMassRecruitment": "Disable",
	"btnDisableMassRecruitment_toolTip": "Disables current city from mass recruitment",
	"recruitmentTime": "Recruitment Time [s]",
	"btnRefreshView": "Refresh",
	"btnRefreshView_toolTip": "Refresh View",
	"btnRecruitAll": "Recruit All",
	"btnRecruitAll_toolTip": "Recruits all possible units",
	"filter by: city types": "Filter by: <b>city types</b>",
	"purify": "Purify",
	"recruitment": "Recruitment",
	"carts": "Carts",
	"orders": "Orders",
	"wood/h": "Wood/h",
	"woodMax": "Wood max",
	"woodFree": "Wood free",					
	"woodIncoming": "Wood incoming",
	"woodFullAt": "Wood full at",
	"stone/h": "Stone/h",
	"stoneMax": "Stone max",
	"stoneFree": "Stone free",					
	"stoneIncoming": "Stone incoming",
	"stoneFullAt": "Stone full at",
	"iron/h": "Iron/h",
	"ironMax": "Iron max",
	"ironFree": "Iron free",					
	"ironIncoming": "Iron incoming",
	"ironFullAt": "Iron full at",
	"food/h": "Food/h",
	"foodMax": "Food max",
	"foodFree": "Food free",					
	"foodIncoming": "Food incoming",
	"foodFullAt": "Food full at",
	"gold/h": "Gold/h",
	"ships": "Ships",
	"buildQueue": "Build Queue",
	"unitQueue": "Unit Queue",	
	"cbTweakReportAtStart": "Tweak reports at start",
	"cbTweakReportAtStart_toolTip": "When option is checked reports are tweaked at start",
	"recruit": "Recruit",
	"in city:": "Recruited: ",
	"add city units": "Add city units",
	"purify options": "Purify Options",
	"cbIncludeCastles": "Include castles",
	"cbIncludeCastles_toolTip": "Includes castles in mass purification.<br/>Without Building Minister it won't purify food in castle, with minister it can purify food as long as food balance is > 0",
	"cbUseRecruitmentData": "Uses Recruitment tab data",
	"cbUseRecruitmentData_toolTip": "Uses <strong>Recruitment</strong> tab data to check if some resource type is needed in castle to recruit missing troops",
	"btnPurifyOptions": "Options",
	
	"role": "Role",
	"lastLogin": "Last Login",
	"title": "Title",
	"rank": "Rank",
	"score": "Score",
	"continent": "Continent",
	"player name": "Player name",
	"land": "Land",
	"water": "Water",
	"palaces": "Palaces",
	"player": "Player",
	"my alliance": "My Alliance",
	"extra summary": "Extra Summary",
	"minScoreInput_toolTip": "Minimum score",
	"alliance": "Alliance",
	"zoom in": "Zoom in",
	"zoom out": "Zoom out",
	"jump to continent": "Jump to continent",
	"btnExportSettings": "Export settings", 
	"btnExportSettings_toolTip": "Exports settings to text form",
	"btnImportSettings": "Import settings",			
	"btnImportSettings_toolTip": "Imports settings. Currently saved settings will be discarded",	
	"fetching resources, please wait": "Fetching resources, please wait",
	"btnFetchCities": "Fetch cities",
	"btnFetchCities_toolTip": "Simulates visiting city to fetch it's data. Function is called every 0.5s so it's slow",
	"btnTxtExport": "Text Export",
	
	"btnMarkAllMoonglowTowers": "Mark all MTs",
	"btnMarkAllMoonglowTowers_toolTip": "Marks moonglow towers in all cities",
	
	"btnAddIntel": "Add intel",
	"btnAddIntel_toolTip": "Add intelligence connected with enemy city",
	"isLandlocked": "Landlocked?",
	"hasCastle": "Castle?",
	"intelligence": "Intelligence",
	"delete": "Delete",
	"owner": "Owner",
	
	"fill with": "Fill with",
	"fill with resources": "Fill with resources",
	"resource type": "Resource type",
	"max resources to send": "Max resources to send",
	"max travel time": "Max travel time (h)",
	"cbAllowSameContinent": "Include cities from the same continent as target",
	"cbAllowOtherContinent": "Include cities from other continents than target",
	"cbPalaceSupport": "Palace delivery",
	"cbPalaceSupport_toolTip": "Sends resources as palace deliver (wood and stone only)",
	"current city": "Current city",
	"search": "Search",
	"request resources": "Request resources",
	
	"defenders": "Defenders",
	"btnSaveAllCities": "Save all cities",
	"save summary position": "Save summary position",
	
	"targetCityName": "Target City",
	"targetPosition": "Target Pos",
	"attackerCityName": "Attacker City",
	"attackerPosition": "Attacker Pos",
	"playerName": "Attacker",
	"allianceName": "Alliance",
	"attackerTS": "Attacker TS",
	"attackerUnits": "Attacker Units",
	"spotted": "Spotted", 
	"claim": "Claim",
	"show intel": "Show intel",
	
	"btnCopyCityType2Group": "Assign",
	"btnCopyCityType2Group_toolTip": "For each city of given BOS type (set in reference) assigns EA city group",
	
	"": ""
  },
"de": {
	"summary": "Ãœbersicht",
	"combat calculator": "Kampf Kalkulator",
	"food calculator": "Nahrungsberechner",
	"recruitment speed calculator": "Rekrutiergeschwinigkeitsberechnung",
	"jump to coords": "Gehe zu",
	"jump to city": "Gehe zu City",
	"please enter city coordinates": "Bitte gebe Stadtkoordinaten (z.B.: 12:34) ein",
	"jump to player": "Gehe zu Spieler",
	"please enter player name:": "Bitte gebe einen Spielernamen ein",
	"jump to alliance": "Gehe zu Allianz",
	"please enter alliance name:": "Bitte gib den Namen der Allianz ein",
	"error during BOS Tools menu creation: ": "Error bei der Erstellung des BOS-Tool MenÃ¼s:",
	"id": "Id", 
	"cityId": "Stadt Id", 
	"from": "von", 
	"type": "Handelstyp", 
	"transport": "Transporttyp", 
	"state": "Status", 
	"start": "Aufbruchszeit", 
	"end": "Ankunft", 
	"position": "Pos", 
	"target": "Ziel", 
	"lastUpdated": "Zuletzt aktualisiert", 
	"resources": "Ressourcen",
	"filter by trade type": "Filtere nach <b>Transportart</b> ",
	"filter by: transport type": "Filtere nach <b>Transporttyp</b>",
	"filter by: resources receiver": "Filtere nach <b>RessourcenempfÃ¤nger</b>",
	"you": "Du",
	"someone else": "Jemand andres",
	"filter by: state": "Filtere nach <b>Status</b>",
	"trade route": "Handelsroute",
	"OK": "OK",
	"clear": "LÃ¶schen",
	"max": "Max",
	"please enter some resources amount": "Bitte gib die Anzahl der Ressourcen ein",
	"invalid destination": "UngÃ¼ltiges Ziel",
	"to": "zu",
	"ships then carts": "Schiffe Ã¼ber Karren", /* 100% accurate translation would be "erst Handelschiffe, dann Marktkarren" there was soneone else who  
	translated things too maybe you should let him check what to do*/
	"carts then ships": "Karren vor Schiffen", /*same as above just inversed*/
	"only carts": "Nur Karren",
	"only ships": "Nur Schiffe",
	"group": "Gruppe",
	"resourceMultiplierNotice": "if resourceCount < 10000 then resourceCount = resourceCount * 1000",
	"trade routes": "Handelsrouten",
	"fromTo": "Von/Zu",
	"action": "Aktion",
	"status": "Status",
	"wood": "Holz", 
	"stone": "Stein", 
	"iron": "Eisen", 
	"food": "Nahrung", 
	"land/sea": "Land/See", 
	"edit": "Bearbeiten",
	
	"options": "Optionen",
	"table settings": "Tabelleneinstellungen",
	"load table settings at start": "Lade Tabelleneinstellungen beim Start",
	"table name": "Tabellenname",
	"cities": "StÃ¤dte",
	"military": "MilitÃ¤r",
	"btnLoadTableSettings": "Lade Tabelleneinstellungen",
	"btnLoadTableSettings_toolTip": "LÃ¤dt die (vorher) gespeicherten Einstellungen fÃ¼r die Tabelle (Spaltenordnung, Spaltenbreite, angezeigte Felder, Sortierordnung",
	"btnSaveTableSettings": "Speichern der Tabelleneigenschaften",
	"btnSaveTableSettings_toolTip": "Speichert die Tabelleneigenschaften: Spaltenordnung, Spaltenbreite, Angezeigte Spalten, Sortierordnung",
	"saving cities data": "Speichern der Stadtdaten",
	"cbPersistCities": "Speicher Stadtdaten",
	"cbPersistCities_toolTip": "Wenn du zur nÃ¤chsten Stadt wechselst, werden die Daten der vorherigen im lokalen Speicher des Browers gespeichert.",
	"cbLoadPersistedCitiesAtStart": "Lade gespeicherte Stadtdaten beim Start des Spieles",
	"btnLoadCities": "Lade gespeicherte Stadtdaten manuell",
	"btnLoadCities_toolTip": "LÃ¤d manuell die Stadtdaten einer verherigen LoU-Session ",
	"btnDeleteAllSavedData": "LÃ¶sche alle gespeicherten Daten",
	"btnDeleteAllSavedData_confirmation": "Alle gespeicherten Daten wurden gelÃ¶scht!",
	"persistHelp": "Wenn Lord of Ultima beendet wird gehen alle Daten der besuchten StÃ¤dte verloren. Deswegen sind beim nÃ¤chsten Start von LoU nicht viele bzw. keine Daten im der Tabelle. Dies kann man verhindern, indem man die Daten der StÃ¤dte im lokalen Speicher des Browsers speichert und sie automatisch oder manuell laden lÃ¤sst. Diese Einstellung funktioniert am besten, wenn sie zusammen mit `Ressourcen aktualisieren` verwendet wird.",	
	"all": "Alle",
	"building": "In Bau/Aufbau",
	"castles": "Burgen",
	"defensive": "Defensive",
	"warehouses": "Lager",
	"moonstones": "Mondsteine",
	"gold": "Geld",
	"name": "Name",
	"reference": "Referenz",
	"btnRefreshResources": "Ressourcen aktualisieren",
	"btnRefreshResources_toolTip": "Benutzt die 'Request resources' Funktion umd die momentanen Ressourcen der StÃ¤dte zu bekommen.<br/>Dies funktioniert nur bei StÃ¤dten mit <b>vorhandenen</b> Marktkarren oder Handelsschiffen.<br/>Das sammeln aller Ressourcen kann einige Zeit dauern, da immer auf Antwort des Servers gewartet wird.<br/>Ressourcen wurden aktualisiert am: nie",	
	"purify resources": "Ressourcen veredeln",
	"btnPurifyAll": "Veredele alle",
	"btnPurifyAll_toolTip": "Veredelt Ressurcen in StÃ¤dten mit <b>markiertem Mondschein-Turm</b>.<br/>Falls ein Bauminister aktiv ist, so wird versucht keine Ressurcen zu veredeln in StÃ¤dten/Burgen mit negativer Nahrungbalance.<br/>Wenn kein Bauminister aktiv ist werden Burgen Ã¼bersprungen.",
	"confirmation": "BestÃ¤tigung",
	"are you sure?": "Bist du sicher?",
	"btnMarkMoonglowTower": "Markiere einen Mondschein-Turm",
	"btnMarkMoonglowTower_toolTip": "Sucht in der Stadt nach einem <b>Mondschein-Turm</b> und speichert die ID fÃ¼r die weitere Benutzung",
	"btnUnmarkMoonglowTower": "LÃ¶sche Mondstein-Turm Markierung",
	"btnUnmarkMoonglowTower_toolTip": "LÃ¶scht alle markierten<b>Mondstein-TÃ¼rme</b> in dieser Stadt<br/>",
	
	"_minimumResLevelInput_toolTip": "% der max. LagerkapzitÃ¤t, welche in jeder Stadt nach der Massenveredlung bestehen bleiben muss.<br/>Manuelle Veredlung ist hiervon nicht betroffen",
	"_minimumResLevelInput_absolute_toolTip": "Anzahl der Ressurcen,  welche in jeder Stadt nach der Massenveredlung bestehen bleiben muss.<br/>Manuelle Veredlung ist hiervon nicht betroffen",
	"purificationHelp": "1. schreibe *M* in die Stadtreferenz, damit die Stadt in der Veredelungstabelle angezeigt wird.<br/>2. Markiere den Monddstein-Turm in der Stadt umd diese Stadt fÃ¼r die Massenveredelung freizuschalten<br/>3. Klicke den Veredele alle \"Button\" oder klicke in das KÃ¤stchen des zuveredelnden Ressourcentypes",
	"purifiable": "veredeDunkelholzDarkwood",
	"runestone": "Runensteine",
	"veritum": "Veritum",
	"trueseed": "Trueseed",	
	"refresh": "Aktualisieren",
	"sbSourceContinent_toolTip": "Filtern nach: <b>Herrkunftskontinent</b>",
	"sbDestinationContinent_toolTip": "Filtern nach: <b>Zielkontinent</b>",
	"defender": "Verteidiger",
	"attacker": "Angreifer",
	"btnUpdateView_toolTip": "Ansicht aktualisieren",
	"cbShowFakeAttacks": "Zeige Fake-Angriffe",
	"cbShowFakeAttacks_toolTip": "Fake-Angriffe sind: PlÃ¼nderungen/ÃœberfÃ¤lle/Belagerungen mit einer TS < 1000",	
	"unit orders": "Einheitenbefehle",
	"incoming attacks": "Eingehende Angriffe",
	"btnCsvExport": "Export Csv",
	"you need to be in city": "Du musst in der Stadt sein um die Verteidigung und die Verteidiger zu erhalten!", 
	"food calculator": "Nahrungsberechner",
	"mass recruitment": "Massrekrutierung",
	"bos.gui.MassRecruitmentPage.help": "BenÃ¶tigt zur Zeit einen Bau- und Kiegsminister. Persisting of cities and 'Lade bei Start' muss aktiviert werden oder es werden Popups erscheinen, welche bvesagen, dass eine Stadt besucht werden soll. Rekruierzeiten werden aktualiesiert wenn die Massenrekrutierung fÃ¼r die jeweilige Stadt aktiviert wird, falls die Zeiten sich Ã¤ndern, aktiviere die Massenrekrutierung erneut. Liste der Errormeldungen:",
	"bos.gui.MassRecruitmentPage.help2": "I - UngÃ¼ltig (Invalid), R - nicht genÃ¼gend Resourcen, Q - Rekrutierliste ist voll (recruitment Queue), T - Truppenlimit erreicht, B - Fehlendes EinheitengebÃ¤ude, G - nicht genug Gold",	
	"city/order": "Stadt / Befehle",
	"missing": "Fehlend",
	"resourcesFor": "Ressourcen fÃ¼r",
	"recruiting": "Rekrutiert",
	"available": "VerfÃ¼gbar",
	"btnEnableMassRecruitment": "Aktivieren",
	"btnEnableMassRecruitment_toolTip": "Schaltet die momentane Stadt fÃ¼r Massenrekrutierung",
	"btnDisableMassRecruitment": "Deaktivierung",
	"btnDisableMassRecruitment_toolTip": "Deaktiviert Massenrekrutierung fÃ¼r die momentane Stadt",	
	"recruitmentTime": "Rekrutierzeit [s]",
	"btnRefreshView": "Aktualisieren",
	"btnRefreshView_toolTip": "Ansicht aktualisieren",
	"btnRecruitAll": "Rekrutiere alle",
	"btnRecruitAll_toolTip": "Rekrutiert alle VerfÃ¼gbaren Einheiten",
	"filter by: city types": "Filtern nach: <b>Stadttyp</b>",
	"purify": "Veredeln",
	"recruitment": "Rekrutieren",
	"carts": "Karren",
	"orders": "Orders",
	"wood/h": "Holz/h",
	"woodMax": "max. Holz",
	"woodFree": "freie HolzkapazitÃ¤t",					
	"woodIncoming": "eintreffendes Holz",
	"woodFullAt": "Holz voll am/um",
	"stone/h": "Stein/h",
	"stoneMax": "max. Stein",
	"stoneFree": "freie SteinkapazitÃ¤t",					
	"stoneIncoming": "eintreffende Steine",
	"stoneFullAt": "Stein voll am/um",
	"iron/h": "Eisen/h",
	"ironMax": "max. Eisen",
	"ironFree": "freie EisenkapazitÃ¤t",					
	"ironIncoming": "eiintreffendes Eisen",
	"ironFullAt": "Eisen voll am/um",
	"food/h": "Nahrung/h",
	"foodMax": "max. Nahrung",
	"foodFree": "freie NahrungskapazitÃ¤t",					
	"foodIncoming": "eintreffende Nahrung",
	"foodFullAt": "Nahrung voll am/um",
	"gold/h": "Gold/h",
	"ships": "Handelsschiffe",
	"buildQueue": "Bauliste",
	"unitQueue": "Rekrutierliste",
	"cbTweakReportAtStart": "Tweak Report beim Start",
	"cbTweakReportAtStart_toolTip": "LÃ¤d die Tweak-Reports beim Start",
	"recruit": "Rekrutiere",
	"in city:": "Rekrutiert: ",
	"add city units": "FÃ¼ge Einheiten dieser Stadt hinzu",
	"purify options": "Veredelungsoptionen",
	"cbIncludeCastles": "SchlieÃŸe Burgen mit ein",
	"cbIncludeCastles_toolTip": "SchlieÃŸt Burgen in die Massenveredelung ein.<br/>Ohne Bauminister wird keine Nahrung ist Burgen veredelt. Falls vorhanden wird Nahrung nur in Burgen mit positiver Nahrungsbalance veredelt",
	"cbUseRecruitmentData": "Uses Recruitment tab data",
	"cbUseRecruitmentData_toolTip": "Benutzt die <strong>Rekrutiertab</strong>-Daten um zu kontrollieren ob Ressourcen fÃ¼r die fehlenden Einheiten in der Burg benÃ¶tigt werden",
	"btnPurifyOptions": "Optionen",
	
	"role": "Role",
	"lastLogin": "Last Login",
	"title": "Title",
	"rank": "Rank",
	"score": "Score",
	"continent": "Continent",
	"player name": "Player name",
	"land": "Land",
	"water": "Water",
	"palaces": "Palaces",
	"player": "Player",
	"my alliance": "My Allianz",	
	"extra summary": "Extra Summary",
	"minScoreInput_toolTip": "Minimum score",
	"alliance": "Allianz",
	"zoom in": "Zoom in",
	"zoom out": "Zoom out",
	"btnExportSettings": "Export settings", 
	"btnExportSettings_toolTip": "Exports settings to text form",
	"btnImportSettings": "Import settings",			
	"btnImportSettings_toolTip": "Imports settings. Currently saved settings will be discarded",	
	"fetching resources, please wait": "Lade Ressourcen..",
	"btnFetchCities": "Fetch cities",
	"btnFetchCities_toolTip": "Simulates visiting city to fetch it's data. Function is called every 0.5s so it's slow",
	"btnTxtExport": "Text Export",
	
	"": ""
  },
  "pl": {
	"summary": "BOS PrzeglÄ…d",
	"combat calculator": "Kalkulator bitew",
	"food calculator": "Kalkulator jedzenia",
	"recruitment speed calculator": "Kalkulator szybkoÅ›ci rekrutacji",
	"jump to coords": "Skocz do wspÃ³Å‚rzÄ™dnych",
	"jump to city": "Skocz do miasta",
	"please enter city coordinates": "WprowadÅº wspÃ³Å‚rzÄ™dne (np. 12:34) :",
	"jump to player": "Skocz do gracza",
	"please enter player name:": "WprowadÅº nazwÄ™ gracza:",
	"jump to alliance": "Skocz do sojuszu",
	"please enter alliance name:": "WprowadÅº nazwÄ™ sojuszu:",
	"error during BOS Tools menu creation: ": "BÅ‚Ä…d podczas tworzenia BOS Tools: ",
	"id": "Id", 
	"cityId": "Miasto Id", 
	"from": "SkÄ…d", 
	"type": "Typ", 
	"transport": "Transport", 
	"state": "Stan", 
	"start": "Start", 
	"end": "Koniec", 
	"position": "Pozycja", 
	"target": "Cel", 
	"lastUpdated": "Ost. Aktualizacja", 
	"resources": "Zasoby",
	"filter by trade type": "Filtruj po: <b>typie handlu</b>",
	"filter by: transport type": "Filtruj po: <b>typie transportu</b>",
	"filter by: resources receiver": "Filtruj po: <b>odbiorcy zasobÃ³w</b>",
	"you": "Ty",
	"someone else": "KtoÅ› inny",
	"filter by: state": "Filtruj po: <b>stanie</b>",
	"trade route": "Szlak handlowy",
	"OK": "OK",
	"clear": "WyczyÅ›Ä‡",
	"max": "Max",
	"please enter some resources amount": "WprowadÅº liczbÄ™ surowcÃ³w",
	"invalid destination": "NieprawidÅ‚owe miejsce docelowe",
	"to": "Do",
	"ships then carts": "Statki pÃ³Åºniej wozy",
	"carts then ships": "Wozy pÃ³Åºniej statki",
	"only carts": "Tylko wozy",
	"only ships": "Tylko statki",
	"group": "Grupa",
	"resourceMultiplierNotice": "jeÅ¼eli liczbaZasobÃ³w < 10000 to liczbaZasobÃ³w = liczbaZasobÃ³w * 1000",
	"trade routes": "Szlaki Handlowe",
	"fromTo": "SkÄ…d/DokÄ…d",
	"action": "Akcja",
	"status": "Status",
	"wood": "Drewno", 
	"stone": "KamieÅ„", 
	"iron": "Å»elazo", 
	"food": "Jedzenie", 
	"land/sea": "LÄ…d/Morze", 
	"edit": "Edycja",	
	"options": "Opcje",
	"table settings": "Ustawienia tabel",
	"load table settings at start": "Å?aduj ustawienia tabel przy starcie",
	"table name": "Nazwa tabeli",
	"cities": "Miasta",
	"military": "Wojsko",
	"btnLoadTableSettings": "Wczytaj ustawienia tabeli",
	"btnLoadTableSettings_toolTip": "Å?aduje poprzednio zapisane ustawienia tabel (porzÄ…dek kolumn, szerokoÅ›ci, widocznoÅ›Ä‡, porzÄ…dek sortowania)",
	"btnSaveTableSettings": "Zapisz ustawienia tabeli",
	"btnSaveTableSettings_toolTip": "Zapisuje ustawienia tabeli: porzÄ…dek kolumn, szerokoÅ›ci, widocznoÅ›Ä‡, porzÄ…dek sortowania.<br/>CiÄ…gle musisz kliknÄ…Ä‡ przycisk <b>Zapisz</b> celem zapisania tego na staÅ‚e",
	"saving cities data": "Zapisuje dane miast",
	"cbPersistCities": "Zapisz dane miast",
	"cbPersistCities_toolTip": "Po udaniu siÄ™ do kolejnego miasta stan poprzedniego miasta zapisany jest w local storage przeglÄ…darki.",
	"cbLoadPersistedCitiesAtStart": "ZaÅ‚aduj zapisane miasta przy starcie gry",
	"btnLoadCities": "Manualnie zaÅ‚aduj dane miast",
	"btnLoadCities_toolTip": "Manualnie Å‚aduje dane miast zapisane podczas poprzednich sesji z grÄ…",
	"btnDeleteAllSavedData": "Skasuj wszystkie zapisane dane",
	"btnDeleteAllSavedData_confirmation": "Wszystkie dane zostaÅ‚y skasowane",
	"persistHelp": "Normalnie kiedy sesja przeglÄ…darki zostaje zakoÅ„czona wszystkie informacje o odwiedzonych miastach sÄ… tracone. Z tego powodu podsuwanie nie bÄ™dzie zawieraÄ‡ wielu danych. Z tego powodu moÅ¼liwe jest zapisanie informacji o odwiedzonych miastach w lokalnej bazie danych dostÄ™pnej w nowoczesnej przeglÄ…darce internetowej.",	
	"all": "Wszystko",
	"building": "W budowie",
	"castles": "Zamki",
	"defensive": "Defensywne",
	"warehouses": "SkÅ‚ady",
	"moonstones": "Moonstones",
	"gold": "ZÅ‚oto",
	"name": "Nazwa",
	"reference": "Uwagi",
	"btnRefreshResources": "OdÅ›wieÅ¼ surowce",
	"btnRefreshResources_toolTip": "UÅ¼ywa funkcjonalnoÅ›ci 'PoproÅ› o surowce' celem otrzymania aktualnych iloÅ›ci surowcÃ³w.<br/>Nie bÄ™dzie w stanie poobraÄ‡ informacji dla miast nie posiadajÄ…cych Å¼adnych <b>dostÄ™pnych</b> statkÃ³w lub wozÃ³w.<br/>Przetwarzanie Å¼Ä…dania moÅ¼e zabraÄ‡ trochÄ™ czasu z uwagi na czas odpowiedzi serwera.<br>Zasoby odÅ›wieÅ¼ono: nigdy",	
	"purify resources": "Oczyszczanie zasobÃ³w",
	"btnPurifyAll": "OczyÅ›Ä‡ wszystko",
	"btnPurifyAll_toolTip": "Oczyszcza zasoby w miastach posiadajÄ…cych <b>oznaczonÄ… WieÅ¼Ä™ KsiÄ™Å¼ycowÄ…</b>.<br/>Gdy dostÄ™pny jest Minister Budownictwa jedzenie nie zostanie oczywszczone w miastach o ujemnym bilansie jedzenia oraz w zamkach.<br/>JeÅ¼eli gracz nie posiada Ministra Budownictwa podczas oczyszczania pominiÄ™te zostanÄ… zamki.",
	"confirmation": "Potwierdzenie",
	"are you sure?": "Czy jesteÅ› pewien?",
	"btnMarkMoonglowTower": "Oznacz WieÅ¼Ä™ KsiÄ™Å¼ycowÄ…",
	"btnMarkMoonglowTower_toolTip": "Znajduje w aktualnym mieÅ›cie <b>WieÅ¼Ä™ KsiÄ™Å¼ycowÄ…</b> i zapisuje jÄ… celem pÃ³Åºniejszego uÅ¼ycia",
	"btnUnmarkMoonglowTower": "Odznacz WieÅ¼Ä™ KsiÄ™Å¼ycowÄ…",
	"btnUnmarkMoonglowTower_toolTip": "Dla aktualnego miasta odznacza uprzednio zaznaczonÄ… <b>WieÅ¼Ä™ KsiÄ™Å¼ycowÄ…<b>",
	"help": "Pomoc",	
	"_minimumResLevelInput_toolTip": "% of max storage that has to remain in each city after mass purification<br/>Manual purification is not affected by this setting",
	"_minimumResLevelInput_absolute_toolTip": "number of resources that has to remain in each city after mass purification<br/>Manual purification is not affected by this setting",
	"purificationHelp": "1. umieÅ›Ä‡ *M* uwagach dotyczÄ…cych miasta dziÄ™ki czemu miasto bÄ™dzie widoczne w poniÅ¼ej tabeli<br/>2. Oznacz WieÅ¼Ä™ KsiÄ™Å¼ycowÄ… dla miast majÄ…cych braÄ‡ udziaÅ‚ w 'OczyÅ›Ä‡ wszystko'<br/>3. UÅ¼yj przycisku 'OczyÅ›Ä‡ wszystko' lub kliknij w komÃ³rce odpowiadajÄ…cej oczyszczonym typom surowcÃ³w",
	"purifiable": "Oczyszczalne",
	"darkwood": "Ciemnolas",
	"runestone": "KamieÅ„ runiczny",
	"veritum": "Veritum",
	"trueseed": "Magiczny pokarm",
	"refresh": "OdÅ›wieÅ¼",
	"sbSourceContinent_toolTip": "Filtruj po: <b>kontynencie ÅºrÃ³dÅ‚owym</b>",
	"sbDestinationContinent_toolTip": "Filtruj po: <b>kontynencie docelowym</b>",
	"defender": "ObroÅ„ca",
	"attacker": "AtakujÄ…cy",
	"btnUpdateView_toolTip": "OdÅ›wieÅ¼ widok",
	"cbShowFakeAttacks": "Pokazuj ataki pozorowane",
	"cbShowFakeAttacks_toolTip": "Atak pozorowany to: grabieÅ¼, oblÄ™Å¼enie lub szturm o SO < 1000",
	"unit orders": "Rozkazy",
	"incoming attacks": "NadchodzÄ…ce ataki",
	"btnCsvExport": "Export Csv",
	"you need to be in city": "Musisz byÄ‡ w mieÅ›cie",
	"food calculator": "Kalkulator jedzenia",
	"mass recruitment": "Masowa rekrutacja",
	"bos.gui.MassRecruitmentPage.help": "Aktualnie wymaga Ministra Budownictwa i Ministra Wojny. Zapisywane miast i Å‚adowanie ich na stracie musi byÄ‡ zaÅ‚Ä…czone. W przyciwnym razie bÄ™dÄ… wyskakiwaÄ‡ bÅ‚Ä™du nakazujÄ…ce odwiedziÄ‡ jakieÅ› miasto. Czas rekrutacji jest aktualizowany podczas zaÅ‚Ä…czania miasta miasto do masowej rekrutacji, jeÅ›li ulegnie zmianie - dodaj miasto raz jeszcze. Lista kodÃ³w bÅ‚Ä™du:", 
	"bos.gui.MassRecruitmentPage.help2": "I - NieprawidÅ‚owy, R - za maÅ‚o surowcÃ³w, Q - kolejka rekrutacji jest peÅ‚na, T - przekroczono SO, B - brakuje budynku, G - za maÅ‚o zÅ‚ota",
	"city/order": "Miasto / Rozkazy",
	"missing": "Brakuje",
	"resourcesFor": "SurowcÃ³w dla",
	"recruiting": "Rekrutuje",
	"available": "DostÄ™pne",
	"btnEnableMassRecruitment": "ZaÅ‚Ä…cz",
	"btnEnableMassRecruitment_toolTip": "ZaÅ‚Ä…cza miasto do masowej rekrutacji",
	"btnDisableMassRecruitment": "WyÅ‚Ä…cz",
	"btnDisableMassRecruitment_toolTip": "WyÅ‚Ä…cza miasto z masowej rekrutacji",
	"recruitmentTime": "Czas rekrutacji [s]",
	"btnRefreshView": "OdÅ›wieÅ¼",
	"btnRefreshView_toolTip": "OdÅ›wieÅ¼ widok",
	"btnRecruitAll": "Rekrutuj Wszystko",
	"btnRecruitAll_toolTip": "Rekrutuje wszystkie moÅ¼liwe jednostki",
	"filter by: city types": "Filtruj po: <b>typach miast</b>",
	"purify": "OczyÅ›Ä‡",
	"recruitment": "Rekrutacja",
	"carts": "Wozy",
	"orders": "Rozkazy",
	"wood/h": "Drewno/h",
	"woodMax": "Drewno max",
	"woodFree": "Drewno wolne",					
	"woodIncoming": "Drewno nadchodzi",
	"woodFullAt": "Drewno peÅ‚ne",
	"stone/h": "KamieÅ„/h",
	"stoneMax": "KamieÅ„ max",
	"stoneFree": "KamieÅ„ wolne",					
	"stoneIncoming": "KamieÅ„ nadchodzi",
	"stoneFullAt": "KamieÅ„ peÅ‚ne",
	"iron/h": "Å»elazo/h",
	"ironMax": "Å»elazo max",
	"ironFree": "Å»elazo wolne",					
	"ironIncoming": "Å»elazo nadchodzi",
	"ironFullAt": "Å»elazo peÅ‚ne",
	"food/h": "Jedzenie/h",
	"foodMax": "Jedzenie max",
	"foodFree": "Jedzenie wolne",					
	"foodIncoming": "Jedzenie nadchodzi",
	"foodFullAt": "Jedzenie peÅ‚ne",
	"gold/h": "ZÅ‚oto/h",
	"ships": "Statki",
	"buildQueue": "Kolejka Budowy",
	"unitQueue": "Kolejka Rekrutacji",	
	"cbTweakReportAtStart": "Podrasuj raporty na starcie",
	"cbTweakReportAtStart_toolTip": "Gdy zaÅ‚Ä…czone raporty sÄ… podrasowane na starcie",
	"recruit": "Rekrutuj",
	"in city:": "Zrekrutowano: ",
	"add city units": "Dodaj jednostki miasta",
	"purify options": "Opcje Oczyszczania",
	"cbIncludeCastles": "ZaÅ‚Ä…cz zamki",
	"cbIncludeCastles_toolTip": "ZaÅ‚Ä…cza zamki do masowego oczyszczania.<br/>Bez Ministra Handlu nie oczyÅ›ci jedzenia w zamku, z ministrem zrobi to o ile bilans jedzenia jest dodatni",
	"cbUseRecruitmentData": "UÅ¼ywaj masowÄ… rekrutacjÄ™",
	"cbUseRecruitmentData_toolTip": "UÅ¼ywa zakÅ‚adki <strong>Rekrutacja</strong> do sprawdzenia jakie typy surowcÃ³w sÄ… potrzebne celem rekrutacji brakujÄ…cych jednostek",
	"btnPurifyOptions": "Opcje",
	
	"role": "Rola",
	"lastLogin": "Ostatnie Logowanie",
	"title": "TytuÅ‚",
	"rank": "Ranga",
	"score": "Punkty",
	"continent": "Kontynent",
	"player name": "Nazwa gracza",
	"land": "LÄ…d",
	"water": "Woda",
	"palaces": "PaÅ‚ace",
	"player": "Gracz",
	"my alliance": "MÃ³j sojusz",
	"extra summary": "Extra PrzeglÄ…d",
	"minScoreInput_toolTip": "Minimalna liczba punktÃ³w",
	"alliance": "Sojusz",
	"zoom in": "PrzybliÅ¼",
	"zoom out": "Oddal",
	"jump to continent": "Skocz do kontynentu",
	"btnExportSettings": "Eksportuj ustawienia", 
	"btnExportSettings_toolTip": "Eksportuje ustawienia do postaci tekstowej",
	"btnImportSettings": "Importyj ustawienia",			
	"btnImportSettings_toolTip": "Importuje ustawienia. Aktualne ustawienia zostanÄ… usuniÄ™te",	
	"fetching resources, please wait": "Pobieram zasoby, proszÄ™ czekaÄ‡",
	"btnFetchCities": "Pobierz miasta",
	"btnFetchCities_toolTip": "Symuluje odwiedziny miast, aby pobraÄ‡ ich dane. Funkcja wywoÅ‚ywan jest co 0.5s tak wiÄ™c jest to wolne przy duÅ¼ej liczbie miast",
	"btnTxtExport": "Eksport tekstowy",
	
	"": ""
  }
  
};

function tr(messageId) {
	var locale = qx.locale.Manager.getInstance().getLocale();
	
	if (bosLocalizedStrings[locale] != undefined && bosLocalizedStrings[locale][messageId] != undefined) {
		return bosLocalizedStrings[locale][messageId];
	}
	
	if (bosLocalizedStrings["en"][messageId] != undefined) {
		return bosLocalizedStrings["en"][messageId];
	}
	
	return messageId;
}

qx.Class.define("bos.gui.ResourcesFillerWidget", {
	type: "singleton",
	extend: qx.ui.window.Window,
	construct: function() {
		qx.ui.window.Window.call(this);
		this.setLayout(new qx.ui.layout.Dock());
		
		this.set({
			width: 500,
			minWidth: 200,
			maxWidth: 600,
			height: 350,
			minHeight: 200,
			maxHeight: 600,
			allowMaximize: false,
			allowMinimize: false,
			showMaximize: false,
			showMinimize: false,
			showStatusbar: false,
			showClose: false,
			caption: (tr("fill with resources")),
			resizeSensitivity: 7,
			contentPadding: 0
		});

		var container = new qx.ui.container.Composite();
		container.setLayout(new qx.ui.layout.VBox(5));

		var res = webfrontend.res.Main.getInstance();
		var scroll = new qx.ui.container.Scroll();
		container.add(scroll, {flex: true});
		
		scroll.add(this.createForm());		

		container.add(this.createFooter());
		
		this.add(container);
		
		webfrontend.gui.Util.formatWinClose(this);
		
		this.moveTo(400, 200);

	}, 
	members: {
		toX: null,
		toY: null,
		sbResType: null,
		maxResourcesInput: null,
		maxTravelTimeInput: null,
		cbAllowSameContinent: null,
		cbAllowOtherContinent: null,
		cbPalaceSupport: null,
		lblTarget: null,
		cityInfos: {},
		activateOverlay: function(activated) {
			//nothing
		}, 
		createFooter: function() {
			var container = new qx.ui.groupbox.GroupBox();					
			container.setLayout(new qx.ui.layout.Flow(5, 5));

			var btnAdd = new qx.ui.form.Button(tr("request resources"));
			btnAdd.setWidth(160);					
			container.add(btnAdd);
			btnAdd.addListener("click", this.fillResources, this);
			
			return container;
		}, 
		fillResources: function() {

			var toX = parseInt(this.toX.getValue(), 10);
			var toY = parseInt(this.toY.getValue(), 10);
			if (toX == 0 && toY == 0) {
				bos.Utils.handleWarning(tr("invalid destination"));
				return;					
			}			
			
			var cityId = bos.Utils.convertCoordinatesToId(toX, toY);
			if (this.cityInfos[cityId] == undefined || this.cityInfos[cityId] == null) {
				alert("Please click search button");
				return;
			}			
			var targetCityInfo = this.cityInfos[cityId];			
						
			var req = {
				maxResourcesToBeSent: parseInt(this.maxResourcesInput.getValue()),
				cityId: cityId,
				maxTravelTime: parseInt(this.maxTravelTimeInput.getValue()),
				targetPlayer: targetCityInfo.pn,
				palaceSupport: this.cbPalaceSupport.getValue(),
				resType: parseInt(this.sbResType.getSelection()[0].getModel()),
				allowSameContinent: this.cbAllowSameContinent.getValue(),
				allowOtherContinent: this.cbAllowOtherContinent.getValue()
			}
			bos.ResourcesFiller.getInstance().populateCityWithResources(req);
						
			//this.close();			
		}, 
		createForm: function() {
			var box = new qx.ui.container.Composite(new qx.ui.layout.Dock());
		
			var container = new qx.ui.groupbox.GroupBox();
			container.setLayout(new qx.ui.layout.Grid(20, 10));
			
			box.add(container);
			
			var selectWidth = 320;		
			var row = 0;
			
			container.add(new qx.ui.basic.Label(tr("resource type")), {
				row: row, 
				column : 0
			});					
			this.sbResType = new qx.ui.form.SelectBox().set({
				width: selectWidth,
				height: 28
			});				
			this.sbResType.add(new qx.ui.form.ListItem(tr("wood"), null, bos.Const.WOOD));
			this.sbResType.add(new qx.ui.form.ListItem(tr("stone"), null, bos.Const.STONE));
			this.sbResType.add(new qx.ui.form.ListItem(tr("iron"), null, bos.Const.IRON));
			this.sbResType.add(new qx.ui.form.ListItem(tr("food"), null, bos.Const.FOOD));
			container.add(this.sbResType, {
				row: row,
				column: 1
			});
			row++;

			container.add(new qx.ui.basic.Label(tr("to")), {
				row: row, 
				column : 0
			});	
			var containerXY = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
			
			this.toX = new qx.ui.form.TextField("");
			this.toX.setWidth(40);			
			containerXY.add(this.toX);
			this.toY = new qx.ui.form.TextField("");
			this.toY.setWidth(40);			
			containerXY.add(this.toY);
			
			var btnSearchTarget = new qx.ui.form.Button(tr("search"));
			btnSearchTarget.setWidth(80);					
			container.add(btnSearchTarget);
			btnSearchTarget.addListener("click", this.searchTarget, this);
			containerXY.add(btnSearchTarget);
			
			var btnCurrentCity = new qx.ui.form.Button(tr("current city"));
			btnCurrentCity.setWidth(120);					
			container.add(btnCurrentCity);
			btnCurrentCity.addListener("click", this.setCurrentCityAsTarget, this);
			containerXY.add(btnCurrentCity);			
			
			container.add(containerXY, {
				row: row, 
				column : 1
			});
			row++;
			
			/*
			this.lblTarget = new qx.ui.basic.Label("");
			container.add(this.lblTarget, {
				row: row, 
				column : 1
			});			
			row++;
			*/
			
			container.add(new qx.ui.basic.Label(tr("max resources to send")), {
				row: row, 
				column : 0
			});
			
			var resContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
			this.maxResourcesInput = new webfrontend.gui.SpinnerInt(0, 0, 100000000);
			this.maxResourcesInput.setWidth(100);
			resContainer.add(this.maxResourcesInput);
			
			resContainer.add(this._createIncreaseAmountBtn("500k", 500000));
			resContainer.add(this._createIncreaseAmountBtn("1M", 1000000));
			resContainer.add(this._createIncreaseAmountBtn("5M", 5000000));
			resContainer.add(this._createIncreaseAmountBtn("10M", 10000000));		
			
			container.add(resContainer, {
				row: row,
				column: 1
			});		
			row++;
			
			container.add(new qx.ui.basic.Label(tr("max travel time")), {
				row: row, 
				column : 0
			});
			var timeContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
			this.maxTravelTimeInput = new webfrontend.gui.SpinnerInt(24, 1, 96);
			this.maxTravelTimeInput.setWidth(100);
			timeContainer.add(this.maxTravelTimeInput);
			
			timeContainer.add(this._createMaxTravelTimeBtn("24h", 24));
			timeContainer.add(this._createMaxTravelTimeBtn("48h", 48));
			timeContainer.add(this._createMaxTravelTimeBtn("96h", 96));
			
			container.add(timeContainer, {
				row: row,
				column: 1
			});		
			row++;			

			this.cbAllowSameContinent = new qx.ui.form.CheckBox(tr("cbAllowSameContinent"));
			this.cbAllowSameContinent.setToolTipText(tr("cbAllowSameContinent_toolTip"));
			this.cbAllowSameContinent.setValue(true);
			container.add(this.cbAllowSameContinent, {
				row: row,
				column: 1
			});
			row++;
			
			this.cbAllowOtherContinent = new qx.ui.form.CheckBox(tr("cbAllowOtherContinent"));
			this.cbAllowOtherContinent.setToolTipText(tr("cbAllowOtherContinent_toolTip"));
			this.cbAllowOtherContinent.setValue(true);
			container.add(this.cbAllowOtherContinent, {
				row: row,
				column: 1
			});	
			row++;

			this.cbPalaceSupport = new qx.ui.form.CheckBox(tr("cbPalaceSupport"));
			this.cbPalaceSupport.setToolTipText(tr("cbPalaceSupport_toolTip"));
			this.cbPalaceSupport.setValue(false);
			container.add(this.cbPalaceSupport, {
				row: row,
				column: 1
			});	
			row++;			
					
			return box;
		}, 
		_createMaxTravelTimeBtn: function(label, amount) {
			var btn = new qx.ui.form.Button(label).set({
				appearance: "button-recruiting", 
				font: "bold",
				width: 50
			});
			
			btn.addListener("click", function(event) {
				this.maxTravelTimeInput.setValue(amount);
			}, this);
			return btn;
		},
		_createIncreaseAmountBtn: function(label, amount) {
			var btn = new qx.ui.form.Button(label).set({
				appearance: "button-recruiting", 
				font: "bold",
				width: 50
			});
			
			btn.addListener("click", function(event) {
				this.maxResourcesInput.setValue(this.maxResourcesInput.getValue() + amount);
			}, this);
			return btn;
		},
		searchTarget: function() {
			
			var toX = parseInt(this.toX.getValue(), 10);
			var toY = parseInt(this.toY.getValue(), 10);
			
			var cityId = bos.Utils.convertCoordinatesToId(toX, toY);
			
			bos.net.CommandManager.getInstance().sendCommand("GetPublicCityInfo", {
				id: cityId
			}, this, this._onCityInfo, cityId);
		},
		_onCityInfo: function(isOk, result, cityId) {
			if (isOk && result != null) {
				this.cityInfos[cityId] = result;
			}
		},
		setCurrentCityAsTarget: function() {
			this.editedRoute = null;
			var city = webfrontend.data.City.getInstance();
			var coords = bos.Utils.convertIdToCoordinatesObject(city.getId());
			this.toX.setValue("" + coords.xPos);
			this.toY.setValue("" + coords.yPos);
			this.cityInfos[city.getId()] = {
				pn: webfrontend.data.Player.getInstance().getName()
			}			
			
			var resType = parseInt(this.sbResType.getSelection()[0].getModel());
			
			var server = bos.Server.getInstance();
			var bosCity = server.cities[city.getId()];
			if (bosCity != null) {			
				var freeSpace = Math.max(0, parseInt(bosCity.getResourceMaxStorage(resType)) - parseInt(bosCity.getTradeIncomingResources(resType)) - parseInt(bosCity.getResourceCount(resType)));			
				this.maxResourcesInput.setValue(freeSpace);			
			}
		}
	}
});

qx.Class.define("bos.BatchResourcesFiller", {
	type: "singleton",
	extend: qx.core.Object,
	construct: function() {
		this.timer = new qx.event.Timer(1000);
		this.timer.addListener("interval", this._sendPendingFillRequest, this);	
	},
	properties: {

	},
	members: {
		timer: null,
		_progressDialog: null,
		fillRequests: new Array(),
		fillCitiesWithResources: function(cities, resType) {
			var server = bos.Server.getInstance();
			for (var i = 0, count = cities.length; i < count; i++) {
				var cityId = cities[i];
				var city = server.cities[cityId];
				if (city == null) {
					continue;
				}
				this.fillRequests.push({
					city: city,
					resType: resType
				});
			}
			
			this._disposeProgressDialog();

			this._progressDialog = new webfrontend.gui.ConfirmationWidget();
			this._progressDialog.showInProgressBox(tr("cities to be filled: ") + this.fillRequests.length);
			qx.core.Init.getApplication().getDesktop().add(this._progressDialog, {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			});
			this._progressDialog.show();
			this.timer.start();
		},
		_sendPendingFillRequest: function() {
			if (this.fillRequests.length == 0) {
				this.timer.stop();
				this._disposeProgressDialog();
				return;
			}
			if (bos.net.CommandManager.getInstance().getNumberOfPendingCommands() == 0 && bos.ResourcesFiller.getInstance().getNumberOfMessagesWaitingForResponse() == 0) {
				this._progressDialog.showInProgressBox(tr("cities to be filled: ") + this.fillRequests.length);
				
				var req = this.fillRequests[0];
				this.fillRequests.splice(0, 1);
				this.fillCityWithResources(req.city, req.resType);				
			}
		},
		fillCityWithResources: function(city, resType) {
				
			var cityId = city.getId();
			var playerName = webfrontend.data.Player.getInstance().getName();			
			
			var freeSpace = Math.max(0, parseInt(city.getResourceMaxStorage(resType)) - parseInt(city.getTradeIncomingResources(resType)) - parseInt(city.getResourceCount(resType)));
			if (freeSpace < bos.Const.SHIP_CAPACITY) {
				return;
			}
			
			var req = {
				maxResourcesToBeSent: freeSpace,
				cityId: cityId,
				maxTravelTime: 48,
				targetPlayer: playerName,
				palaceSupport: false,
				resType: resType,
				allowSameContinent: true,
				allowOtherContinent: true
			}
			bos.ResourcesFiller.getInstance().populateCityWithResources(req);			
		},
		_disposeProgressDialog: function() {
			if (this._progressDialog != null) {
				this._progressDialog.disable();
				this._progressDialog.destroy();
				this._progressDialog = null;
			}
		}	
	}
});

qx.Class.define("bos.ResourcesFiller", {
	type: "singleton",
	extend: qx.core.Object,
	construct: function() {
		
	},
	properties: {
		numberOfMessagesWaitingForResponse: {
			init: 0
		}
	},
	members: {
		lastStatus: null,		
		populateCityWithResources: function(request) {
			this.setNumberOfMessagesWaitingForResponse(this.getNumberOfMessagesWaitingForResponse() + 1);
			bos.net.CommandManager.getInstance().sendCommand("TradeSearchResources", {
				cityid: request.cityId,
				resType: request.resType,
				minResource: bos.Const.SHIP_CAPACITY,
				maxTime: request.maxTravelTime * webfrontend.data.ServerTime.getInstance().getStepsPerHour()
			}, this, this._processTradeSearchResources, request);			
		}, 
		_processTradeSearchResources: function(result, n, request) {
			this.setNumberOfMessagesWaitingForResponse(this.getNumberOfMessagesWaitingForResponse() - 1);
			
			if (result == false || n == null) return;

			var cities = new Array();
			var transports = new Array();
			
			var destCoords = bos.Utils.convertIdToCoordinatesObject(request.cityId);

			for (var i = 0; i < n.length; i++) {
				var city = n[i];
				var srcCoords = bos.Utils.convertIdToCoordinatesObject(city.i);
				
				if (city.i == request.cityId || city.sg) {
					continue;
				}
				if (destCoords.cont == srcCoords.cont && !request.allowSameContinent) {
					continue;
				} else if (destCoords.cont != srcCoords.cont && !request.allowOtherContinent) {
					continue;
				}
				
				if (request.resType == bos.Const.FOOD) {
					var playerCities = webfrontend.data.Player.getInstance().cities;					
					var type = bos.CityTypes.getInstance().parseReference(playerCities[city.i].reference);
					if (type.isCastle) {
						continue;
					}
				}
				
				cities.push(city);
				
				if (city.lt > 0) {
					transports.push({
						cityIndex: cities.length - 1,
						capacity: city.la,
						travelTime: city.lt,
						land: true
					});
				}
				if (city.st > 0) {
					transports.push({
						cityIndex: cities.length - 1,
						capacity: city.sa,
						travelTime: city.st,
						land: false
					});					
				}

			}

			transports.sort(function(a, b) {
				if (a.travelTime > b.travelTime) {
					return 1;
				} else if (a.travelTime < b.travelTime) {
					return -1;
				} else {
					return 0;
				}
			});

			var toBeSent = request.maxResourcesToBeSent;			
			for (var i = 0, count = transports.length; i < count; i++) {
				var transport = transports[i];
				var city = cities[transport.cityIndex];
				var srcCoords = bos.Utils.convertIdToCoordinatesObject(city.i);
				
				if (toBeSent <= 0) {
					break;
				}
				
				var resCount = Math.min(city.rc, transport.capacity, toBeSent);				
				if (resCount <= 0) {
					continue;
				}
								
				var trade = {
					cityid: city.i,
					tradeTransportType: transport.land ? 1 : 2,
					targetPlayer: request.targetPlayer,
					targetCity: destCoords.xPos + ":" + destCoords.yPos,
					palaceSupport: request.palaceSupport,
					res: new Array()
				};
				
				trade.res.push({
					t: request.resType,
					c: resCount					
				});				
				
				city.rc -= resCount;
				toBeSent -= resCount;
				
				bos.net.CommandManager.getInstance().sendCommand("TradeDirect", trade, this, this._onTradeDirectSendDone, trade);	
			}

		},
		_onTradeDirectSendDone: function(isOk, result, param) {
			this.lastStatus = result;
			//console.log(isOk + " " + result + " " + param);
		}		
	}
});


qx.Class.define("bos.Server", {
	extend: qx.core.Object,
	type: "singleton",
	construct: function() {
		//webfrontend.base.Timer.getInstance().addListener("uiTick", this.updateCity, this);
		//webfrontend.data.City.getInstance().addListener("changeCity", this.onCityChanged, this);
		webfrontend.data.City.getInstance().addListener("changeVersion", this.updateCity, this);
				
		this.persistCityTimer = new qx.event.Timer(5500);
		this.persistCityTimer.addListener("interval", this._persistPendingCity, this);	
		this.persistCityTimer.start();

		this._pollCityTimer = new qx.event.Timer(bos.Const.MIN_SEND_COMMAND_INTERVAL);
		this._pollCityTimer.addListener("interval", this._pollNextCity, this);		
	}, 
	properties: {
		lastUpdatedCityId: {
			init: false,
			event: "bos.data.changeLastUpdatedCityId"
		}, 
		lastUpdatedCityAt: {
			init: false
		}, 
		cityResourcesUpdateTime: {
			init: null,
			event: "bos.data.changeCityResourcesUpdateTime"
		}
	}, 
	members: {
		cities: new Object(),
		cityResources: new Object(),
		como: new Object(),
		_citiesToPoll: new Array(),
		_citiesToPersist: new Array(),
		_dirtyCities: new Object(),
		persistCityTimer: null,
		_pollCitiesProgressDialog: null,
		sectors: new Object(),
		onCityChanged: function() {
			var city = webfrontend.data.City.getInstance();

			if (city.getId() == -1) {
				return;
			}
			this.markCityDirty(city.getId());			
		},
		markCityDirty: function(s) {
			var cityId = parseInt(s, 10);
			var dirty = this._dirtyCities[cityId] || false;
			if (!dirty) {
				this._dirtyCities[cityId] = true;
				this._citiesToPersist.push(cityId);
			}
		},
		_persistPendingCity: function() {
			if (this._citiesToPersist.length == 0) {
				return;
			}
			var cityId = this._citiesToPersist[0];
			this._dirtyCities[cityId] = false;
			this._citiesToPersist.splice(0, 1);
			this.persistCity(cityId);
			return;
		},
		persistCity: function(cityId) {
			if (!bos.Storage.getInstance().getPersistingCitiesEnabled()) {
				return;
			}
			var prevCity = this.cities[cityId];
			if (prevCity != null) {
				try {
					bos.Storage.getInstance().saveCity(prevCity);
				} catch (e) {
					bos.Storage.getInstance().setPersistingCitiesEnabled(false);
					bos.Utils.handleError("Error when trying to persist city " + prevCity.getName() + ". Persisting has been disabled. Error: " + e);
				}
			}
		},
		persistAllPendingCities: function() {
			if (confirm("there are " + this._citiesToPersist.length + " cities to be saved, continue?")) {
				var count = 0;
				while (this._citiesToPersist.length > 0) {
					this._persistPendingCity();
					count++;
				}
				alert("Persisted " + count + " cities");
			}
		},
		pollCities: function(citiesToPoll) {
			this._citiesToPoll = citiesToPoll;
			
			this._disposePollCitiesProgressDialog();
			this._pollCitiesProgressDialog = new webfrontend.gui.ConfirmationWidget();
			this._pollCitiesProgressDialog.showInProgressBox(tr("cities to fetch: ") + this._citiesToPoll.length);
			qx.core.Init.getApplication().getDesktop().add(this._pollCitiesProgressDialog, {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			});
			this._pollCitiesProgressDialog.show();
		
			this._pollCityTimer.start();
		},
		pollAllCities: function() {
			var citiesToPoll = [];		
		
			var cities = webfrontend.data.Player.getInstance().cities;
			for (var cityId in cities) {
				if (qx.lang.Type.isNumber(cityId)) {
					citiesToPoll.push(cityId);
				}
			}
			
			this.pollCities(citiesToPoll);
		},
		_disposePollCitiesProgressDialog: function() {
			if (this._pollCitiesProgressDialog != null) {
				this._pollCitiesProgressDialog.disable();
				this._pollCitiesProgressDialog.destroy();
				this._pollCitiesProgressDialog = null;
			}
		}, 		
		_pollNextCity: function() {
			if (this._citiesToPoll.length > 0) {
				var cityId = this._citiesToPoll[0];
				this._citiesToPoll.splice(0, 1);
				bos.net.CommandManager.getInstance().pollCity(cityId);
				
				this._pollCitiesProgressDialog.showInProgressBox(tr("cities to fetch: ") + this._citiesToPoll.length);
			} else {
				this._pollCityTimer.stop();
				this._disposePollCitiesProgressDialog();
			}
		},
		updateCity: function() {
			var city = webfrontend.data.City.getInstance();

			if (city.getId() == -1) {
				return;
			}

//bos.Utils.handleError(city.getId() + " " + city.getVersion());			
			
			//do not update the same city too often
			/*
			if (this.getLastUpdatedCityId() != null && this.getLastUpdatedCityId() == city.getId()) {
				var diff = new Date() - this.getLastUpdatedCityAt();
				if (diff < 10) {
					return;
				}
			}
*/
			var c = new bos.City();
			c.populate(city);
			if (this.cities[c.getId()] != undefined) {
				//alert("DELETE");
				this.cities[c.getId()].dispose();
				//this._disposeObjects(this.cities[c.getId()]);
				//delete this.cities[c.getId()];
			}
			this.cities[c.getId()] = c;

			this.setLastUpdatedCityId(c.getId());
			this.setLastUpdatedCityAt(new Date());
			
			this.markCityDirty(city.getId());
		},
		addCOMOItem: function(item) {
			this.como[item.i] = item;
			this.updateCityFromCOMOItem(item);
		},
		updateCityFromCOMOItem: function(item) {
			if (this.cities[item.i] == undefined) {
				return;
			}
			var city = this.cities[item.i];
			city.units = new Object();
			city.unitOrders = new Array();
			
			for (var i = 0; i < item.c.length; i++) {
				var command = item.c[i];
				var units = new Array();
				for (var j = 0; j < command.u.length; j++) {
					var unit = command.u[j];
					
					if (command.i == 0) {						
						city.units[unit.t] = {
							count: unit.c,
							total: unit.c,
							speed: -1
						};
					} else {
						var cityUnits = city.units[unit.t];
						if (cityUnits == undefined) {
							city.units[unit.t] = {
								count: 0,
								total: 0,
								speed: -1							
							}
							cityUnits = city.units[unit.t];
						}
						if (command.d == 0) {
							//delayed order cannot increase troop count
							cityUnits.total += unit.c;
						}
					}
					
					units.push({
						type: unit.t,
						count: unit.c
					});
				}
				
				if (command.i != 0) {
				//{"i":26722474,"t":8,"s":2,"cn":"Mountain:9","c":7995428,"pn":"","p":0,"e":19024467,"d":0,"q":0,"r":1,"u":[{"t":6,"c":129237}]}]},
				
					var order = {
						id: command.i,
						type: command.t,
						state: command.s,
						//start: command.ss,
						start: null,
						end: command.e,
						city: command.c,
						cityName: command.cn,
						player: command.p,
						playerName: command.pn,
						//alliance: command.a,
						//allianceName: command.an,
						units: units,
						isDelayed: command.d,
						recurringType: command.r,
						//recurringEndStep: command.rs,
						quickSupport: command.q
					};
					city.unitOrders.push(order);				
				}
			}			
		}		
	}
});

qx.Class.define("bos.Storage", {
	type: "singleton",
	extend: qx.core.Object,
	construct: function() {
		try {
			qx.Bootstrap.setDisplayName(this, "bos.Storageoooo");
			this._player = webfrontend.data.Player.getInstance().getId();
			
			var options = this._loadOptions();
			if (options != null) {
				if (options.optionsFormatVersion != bos.Storage.OPTIONS_FORMAT_VERSION) {
					bos.Utils.handleError("This script version requires options to be in new format. Default values has been applied. Please set options again. Sorry for inconvenience");
					this.deleteAllSavedData();
					this.saveOptions(); //force saving defaults
				} else {
					this._applyOptions(options);
				}
			}

			var saved = this.getSavedCities();
			this._savedCities = [];
			for (var i = 0; i < saved.length; i++) {
				var cityId = saved[i];

				this._savedCities["c" + cityId] = cityId;
			}			
		} catch (e) {
			bos.Utils.handleError("Error loading LoU BOS settings: " + e + ".\nIt may mean that you browser has disabled local storage.\nTo turn local storage on - in Firefox please open page 'about:config' and make sure that in 'dom.storage.enabled' you have true value. For Firefox please make sure that you have cookies enabled");
		}
	}, 
	statics: {
		OPTIONS_FORMAT_VERSION: 0
	}, 
	properties: {
		persistingCitiesEnabled: {
			init: true
		}, 
		loadPersistedCitiesAtStart: {
			init: true
		}, 
		optionsFormatVersion: {
			init: 0
		}, 
		loadTableSettingsAtStart: {
			init: false
		}, 
		citiesTableSettings: {
			init: null
		}, 
		militaryTableSettings: {
			init: null
		}, 
		moonstonesTableSettings: {
			init: null
		}, 
		moonglowTowers: {
			init: []
		}, 
		customCityTypes: {
			init: []
		}, 
		summaryPosition: {
			init: null
		}, 
		tradeRoutesVersion: {
			init: 0,
			event: "changeTradeRoutesVersion"
		},
		recruitmentOrdersVersion: {
			init: 0,
			event: "changeRecruitmentOrdersVersion"
		},
		intelligenceVersion: {
			init: 0,
			event: "changeIntelligenceVersion"
		},
		customCityTypesVersion: {
			init: 0,
			event: "changeCustomCityTypesVersion"
		},		
		tweakReportAtStart: {
			init: false	
		}, 
		tweakChatAtStart: {
			init: false
		}, 
		startRefreshingResourcesAtStart: {
			init: false
		}
	}, members: {
		_savedCities: null,		
		_citiesWithMooglowTower: null,
		_tradeRoutes: null,
		_recruitmentOrders: null,
		_intelligence: null,
		_player: "",
		_getValue: function(key, namespace) {
			var result = GM_getValue(this._calculateKey(key, namespace, true));
			if (result == null) {
				result = GM_getValue(this._calculateKey(key, namespace, false));
			}
			return result;
		}, 
		_setValue: function(key, value, namespace) {
			GM_setValue(this._calculateKey(key, namespace, true), value);		
		}, 
		_calculateKey: function(key, namespace, withPlayer) {
			if (namespace == undefined) {
				namespace = "Storage";
			}		
			if (withPlayer == undefined) {
				withPlayer = true;
			}
			if (withPlayer) {
				return "bos." + this._player + "." + namespace + "." + key;				
			} else {
				return "bos." + namespace + "." + key;
			}
		}, 
		_loadOptions: function() {
			var json = this._getValue("options");
			var options = null;
			if (json != null) {
				options = qx.util.Json.parse(json);
			}
			return options;
		}, 
		_applyOptions: function(options) {
			this.setOptionsFormatVersion(options.optionsFormatVersion);
			this.setPersistingCitiesEnabled(options.persistingCitiesEnabled);
			this.setLoadPersistedCitiesAtStart(options.loadPersistedCitiesAtStart);
			this.setCitiesTableSettings(options.citiesTableSettings);
			this.setMilitaryTableSettings(options.militaryTableSettings);
			if (options.moonstonesTableSettings != undefined) {
				this.setMoonstonesTableSettings(options.moonstonesTableSettings);
			}
			if (options.loadTableSettingsAtStart != undefined) {
				this.setLoadTableSettingsAtStart(options.loadTableSettingsAtStart);
			}
			if (options.moonglowTowers != undefined) {
				this.setMoonglowTowers(options.moonglowTowers);
			}
			if (options.customCityTypes != undefined) {
				this.setCustomCityTypes(options.customCityTypes);
			}
			if (options.summaryPosition != undefined) {
				this.setSummaryPosition(options.summaryPosition);
			}
			if (options.tweakReportAtStart != undefined) {
				this.setTweakReportAtStart(options.tweakReportAtStart);
			}
			if (options.tweakChatAtStart != undefined) {
				this.setTweakChatAtStart(options.tweakChatAtStart);
			}
			if (options.startRefreshingResourcesAtStart != undefined) {
				this.setStartRefreshingResourcesAtStart(options.startRefreshingResourcesAtStart);
			}						
		}, 
		saveCity: function(city) {
			var simple = city.toSimpleObject();
			var json = qx.util.Json.stringify(simple);
			this._setValue(city.getId(), json, "City");

			this._savedCities["c" + city.getId()] = city.getId();
			this._saveSavedCities();
		}, 
		loadCity: function(cityId) {
			var json = this._getValue(cityId, "City");
			if (json == null)
				return null;
			var parsed = qx.util.Json.parse(json);
			var city = bos.City.createFromSimpleObject(parsed);
			return city;
		}, 
		_calculateCityKey: function(cityId) {			
			return "bos.City." + cityId;			
		}, 
		getSavedCities: function() {
			var s = this._getValue("index", "City");
			var cities = [];
			if (s != null) {
				cities = qx.util.Json.parse(s);
			}
			return cities;
		}, 
		_saveSavedCities: function() {
			var cities = [];
			for (var key in this._savedCities) {
				var cityId = parseInt(key.substring(1));
				if (!isNaN(cityId)) {
					cityId = parseInt(this._savedCities[key]);
					if (!isNaN(cityId)) {
							cities.push(cityId);
					}
				}
			}

			var json = qx.util.Json.stringify(cities);
			this._setValue("index", json, "City");
		}, 
		deleteAllSavedData: function() {
			var saved = this.getSavedCities();
			for (var i = 0; i < saved.length; i++) {
				var cityId = saved[i];
				GM_deleteValue(this._calculateKey(cityId, "City"));
			}
			GM_deleteValue(this._calculateKey("index", "City"));

			this._savedCities = [];
		}, 
		saveOptions: function() {
			var o = {
				persistingCitiesEnabled: this.getPersistingCitiesEnabled(),
				loadPersistedCitiesAtStart: this.getLoadPersistedCitiesAtStart(),
				tweakChatAtStart: this.getTweakChatAtStart(),				
				tweakReportAtStart: this.getTweakReportAtStart(),
				startRefreshingResourcesAtStart: this.getStartRefreshingResourcesAtStart(),
				
				loadTableSettingsAtStart: this.getLoadTableSettingsAtStart(),							
				citiesTableSettings: this.getCitiesTableSettings(),
				militaryTableSettings: this.getMilitaryTableSettings(),
				moonstonesTableSettings: this.getMoonstonesTableSettings(),
				summaryPosition: this.getSummaryPosition(),
									
				moonglowTowers: this.getMoonglowTowers(),
				customCityTypes: this.getCustomCityTypes(),
				optionsFormatVersion: bos.Storage.OPTIONS_FORMAT_VERSION
			}
			var json = qx.util.Json.stringify(o);
			this._setValue("options", json);
						
		}, 
		setTableSettings: function(settings, tableName) {
			//not the best way to do it
			switch (tableName) {
				case "cities":
					this.setCitiesTableSettings(settings);
					break;
				case "military":
					this.setMilitaryTableSettings(settings);
					break;
				case "moonstones":
					this.setMoonstonesTableSettings(settings);
					break;
				default:
					bos.Utils.handleError("Unknown table name " + tableName);
					break;
			}
		}, 
		addMoonglowTower: function(cityId, towerId) {		
			for (var i = 0; i < this.getMoonglowTowers().length; i++) {
				var o = this.getMoonglowTowers()[i];
				if (o.cityId == cityId) {
					o.towerId = towerId;
					this.saveOptions();
					return;
				}
			}
			var t = {
				cityId: cityId,
				towerId: towerId
			};
			this.getMoonglowTowers().push(t);
			this._citiesWithMooglowTower = null;
			this.saveOptions();
		}, 
		removeMoonglowTower: function(cityId) {
			for (var i = 0; i < this.getMoonglowTowers().length; i++) {
				var o = this.getMoonglowTowers()[i];
				if (o.cityId == cityId) {
					this.getMoonglowTowers().splice(i, 1);
					this._citiesWithMooglowTower = null;
					this.saveOptions();
					return;
				}
			}								
		}, 
		findMoonglowTowerId: function(cityId) {
			var withMoonglow = this.getCitiesWithMooglowTower();
			if (withMoonglow["c" + cityId] == undefined) {
				return -1;
			} else {
				return withMoonglow["c" + cityId];
			}
			/*
			for (var i = 0; i < this.getMoonglowTowers().length; i++) {
				var o = this.getMoonglowTowers()[i];
				if (o.cityId == cityId) {											
					return o.towerId;
				}
			}
			return -1;
			*/
		}, 
		getCitiesWithMooglowTower: function() {
			if (this._citiesWithMooglowTower == null) {
				this._citiesWithMooglowTower = [];
				for (var i = 0; i < this.getMoonglowTowers().length; i++) {
					var o = this.getMoonglowTowers()[i];
					this._citiesWithMooglowTower["c" + o.cityId] = o.towerId;
				}										
			}
			return this._citiesWithMooglowTower;
		}, 
		addCustomCityType: function(letter, description) {
			for (var i = 0; i < this.getCustomCityTypes().length; i++) {
				var o = this.getCustomCityTypes()[i];
				if (o.letter == letter) {
					o.description = description;
					return;
				}
			}
			var t = {
				letter: letter,
				description: description
			};
			this.getCustomCityTypes().push(t);

			this.setCustomCityTypesVersion(this.getCustomCityTypesVersion() + 1);			
		}, 
		removeCustomCityType: function(letter) {
			for (var i = 0; i < this.getCustomCityTypes().length; i++) {
				var o = this.getCustomCityTypes()[i];
				if (o.letter == letter) {
					this.getCustomCityTypes().splice(i, 1);							
					return;
				}
			}

			this.setCustomCityTypesVersion(this.getCustomCityTypesVersion() + 1);			
		}, 
		loadTradeRoutes: function() {
			this._tradeRoutes = [];
			var json = this._getValue("tradeRoutes");			
			if (json != null) {
				this._tradeRoutes = qx.util.Json.parse(json);
			}
			return this._tradeRoutes;
		}, 
		getTradeRoutes: function() {
			if (this._tradeRoutes == null) {
				this.loadTradeRoutes();
			}
			return this._tradeRoutes;		
		}, 
		saveTradeRoutes: function() {
			var json = qx.util.Json.stringify(this._tradeRoutes);
			this._setValue("tradeRoutes", json);			
		}, 
		addTradeRoute: function(route) {
			route.id = this._tradeRoutes.length + 1;
			this._tradeRoutes.push(route);
			this.setTradeRoutesVersion(this.getTradeRoutesVersion() + 1);
			this.saveTradeRoutes();
			return route.id;
		}, 
		removeTradeRoute: function(routeId) {
			for (var i = 0; i < this._tradeRoutes.length; i++) {
				var r = this._tradeRoutes[i];
				if (r.id == routeId) {
					this._tradeRoutes.splice(i, 1);
					this.setTradeRoutesVersion(this.getTradeRoutesVersion() + 1);
					this.saveTradeRoutes();
					return true;
				}
			}
			return false;
		},
		findTradeRouteById: function(routeId) {
			for (var i = 0; i < this._tradeRoutes.length; i++) {
				var r = this._tradeRoutes[i];
				if (r.id == routeId) {					
					return r;
				}
			}
			return null;			
		},
		importTradeRoutes: function(json) {
			try {
				var required = ["from", "to", "wood", "stone", "iron", "food", "transport", "group"];
				var orders = qx.util.Json.parse(json);
				for (var i = 0; i < orders.length; i++) {
					var order = orders[i];
					for (var j = 0; j < required.length; j++) {
						var prop = required[j];
						if (!order.hasOwnProperty(prop)) {
							bos.Utils.handleError("Element " + i + " is missing required property " + prop);
							dumpObject(order);
							return;
						}
					}
				}				
				
				this._tradeRoutes = orders;
				this.saveTradeRoutes();
			} catch (e) {
				bos.Utils.handleError(e);
			}
		},		
		loadRecruitmentOrders: function() {
			this._recruitmentOrders = [];
			var json = this._getValue("recruitmentOrders");			
			if (json != null) {
				this._recruitmentOrders = qx.util.Json.parse(json);
			}
			return this._recruitmentOrders;
		}, 
		getRecruitmentOrders: function() {
			if (this._recruitmentOrders == null) {
				this.loadRecruitmentOrders();
			}
			return this._recruitmentOrders;		
		}, 
		saveRecruitmentOrders: function() {
			var json = qx.util.Json.stringify(this._recruitmentOrders);
			this._setValue("recruitmentOrders", json);			
		}, 
		addRecruitmentOrder: function(order) {			
			this._recruitmentOrders.push(order);
			this.setRecruitmentOrdersVersion(this.getRecruitmentOrdersVersion() + 1);
			this.saveRecruitmentOrders();
		}, 
		removeRecruitmentOrder: function(cityId) {
			for (var i = 0; i < this._recruitmentOrders.length; i++) {
				var o = this._recruitmentOrders[i];
				if (o.cityId == cityId) {
					this._recruitmentOrders.splice(i, 1);
					this.setRecruitmentOrdersVersion(this.getRecruitmentOrdersVersion() + 1);
					this.saveRecruitmentOrders();
					return true;
				}
			}
			return false;
		},
		findRecruitmentOrderById: function(cityId) {
			for (var i = 0; i < this.getRecruitmentOrders().length; i++) {
				var o = this.getRecruitmentOrders()[i];
				if (o.cityId == cityId) {					
					return o;
				}
			}
			return null;			
		},
		importRecruitmentOrders: function(json) {
			try {
				var required = ["cityId", "units"];
				var orders = qx.util.Json.parse(json);
				for (var i = 0; i < orders.length; i++) {
					var order = orders[i];
					for (var j = 0; j < required.length; j++) {
						var prop = required[j];
						if (!order.hasOwnProperty(prop)) {
							bos.Utils.handleError("Element " + i + " is missing required property " + prop);
							dumpObject(order);
							return;
						}
					}
				}				
				
				this._recruitmentOrders = orders;
				this.saveRecruitmentOrders();
			} catch (e) {
				bos.Utils.handleError(e);
			}
		},

		loadIntelligence: function() {
			this._intelligence = [];
			var json = this._getValue("intelligence");			
			if (json != null) {
				this._intelligence = qx.util.Json.parse(json);
			}
			return this._intelligence;
		}, 
		getIntelligence: function() {
			if (this._intelligence == null) {
				this.loadIntelligence();
			}
			return this._intelligence;		
		}, 
		saveIntelligence: function() {
			var json = qx.util.Json.stringify(this._intelligence);
			this._setValue("intelligence", json);			
		}, 
		addIntelligence: function(intel) {			
			this.getIntelligence().push(intel);
			this.setIntelligenceVersion(this.getIntelligenceVersion() + 1);
			this.saveIntelligence();
		}, 
		removeIntelligence: function(cityId) {
			for (var i = 0; i < this._intelligence.length; i++) {
				var o = this._intelligence[i];
				if (o.cityId == cityId) {
					this._intelligence.splice(i, 1);
					this.setIntelligenceVersion(this.getIntelligenceVersion() + 1);
					this.saveIntelligence();
					return true;
				}
			}
			return false;
		},
		findIntelligenceById: function(cityId) {
			for (var i = 0; i < this.getIntelligence().length; i++) {
				var o = this.getIntelligence()[i];
				if (o.cityId == cityId) {					
					return o;
				}
			}
			return null;			
		},
		mergeIntelligence: function(json) {
			try {
				var required = ["cityId", "name", "isLandlocked", "hasCastle", "owner", "description", "lastModified", "modifiedBy"];
				var intelligence = qx.util.Json.parse(json);
				for (var i = 0; i < intelligence.length; i++) {
					var intel = intelligence[i];
					for (var j = 0; j < required.length; j++) {
						var prop = required[j];
						if (!intel.hasOwnProperty(prop)) {
							bos.Utils.handleError("Element " + i + " is missing required property " + prop);
							dumpObject(intel);
							return;
						}
					}
				}

				for (var i = 0; i < intelligence.length; i++) {
					var intel = intelligence[i];
					var old = this.findIntelligenceById(intel.cityId);
					if (old == null) {
						this.addIntelligence(intel);
					} else if (intel.lastModified > old.lastModified) {
						if (confirm("Would you like to replace intel for '" + old.name + "' - '" + old.description + "' with '" + intel.description + "'?")) {
							for (var j = 0; j < this.getIntelligence().length; j++) {
								var o = this.getIntelligence()[j];
								if (o.cityId == intel.cityId) {					
									this.getIntelligence()[j] = intel;								
									break;
								}
							}
						}						
					}
				}
				
				this.saveIntelligence();
				this.setIntelligenceVersion(this.getIntelligenceVersion() + 1);
			} catch (e) {
				bos.Utils.handleError(e);
			}
		},		
		getPurifyOptions: function() {
			var json = this._getValue("purifyOptions");
			var options;
			if (json != null) {
				options = qx.util.Json.parse(json);
			} else {
				options = {					
					includeCastles: false,
					useRecruitmentData: false,
					ministerBuildPresent: webfrontend.data.Player.getInstance().getMinisterTradePresent()
				};
				
				if (options.ministerBuildPresent) {
					options.minimumResLevels = [0, 20, 20, 20, 20];
				} else {
					options.minimumResLevels = [0, 50000, 50000, 50000, 50000];
				}
			}
			return options;
		},
		savePurifyOptions: function(options) {
			options.ministerBuildPresent = webfrontend.data.Player.getInstance().getMinisterTradePresent();
			var json = qx.util.Json.stringify(options);
			this._setValue("purifyOptions", json);
		}
	}
});

qx.Class.define("bos.net.CommandManager", {
	type: "singleton",
	extend: qx.core.Object,
	construct: function() {
		this._sendTimer = new qx.event.Timer(bos.Const.MIN_SEND_COMMAND_INTERVAL);
		this._sendTimer.addListener("interval", this.sendPendingCommand, this);	
		this._sendTimer.start();		
	},
	properties: {
		lastSendCommand: {
			init: 0
		}
	},
	members: {
		_toSend: [],
		_sendTimer: null,
		sendCommand: function(endPoint, request, context, onSendDone, extraValue) {
			var now = (new Date()).getTime();
			if (now - this.getLastSendCommand() >= bos.Const.MIN_SEND_COMMAND_INTERVAL) {
				this.forcedSendCommand(endPoint, request, context, onSendDone, extraValue);
			} else {
				this._toSend.push({
					endPoint: endPoint, 
					request: request, 
					context: context, 
					onSendDone: onSendDone, 
					extraValue: extraValue
				});
			}
		},
		getNumberOfPendingCommands: function() {
			return this._toSend.length;
		},
		forcedSendCommand: function(endPoint, request, context, onSendDone, extraValue) {
			var now = (new Date()).getTime();
			webfrontend.net.CommandManager.getInstance().sendCommand(endPoint, request, context, onSendDone, extraValue);			
			this.setLastSendCommand(now);		
		}, 
		sendPendingCommand: function() {
			if (this._toSend.length > 0) {
				var o = this._toSend[0];
				this._toSend.splice(0, 1);
				this.forcedSendCommand(o.endPoint, o.request, o.context, o.onSendDone, o.extraValue);
			}
		},
		pollCity: function(cityId) {
			var sb = new qx.util.StringBuilder(2048);
			sb.add("CITY", ":", cityId, '\f');
			this.poll(sb.get(), cityId);
		},
		pollWorld: function(sectorIds) {
			var sb = new qx.util.StringBuilder(2048);
			sb.add("WORLD", ":");
			
			for (var i = 0; i < sectorIds.length; i++) {
				var sectorId = sectorIds[i];
				var s = I_KEB_MEB(sectorId) + I_KEB_REB(0);
				sb.add(s);
			}
			
			sb.add('\f');
			this.poll(sb.get(), sectorIds);
		},
		poll: function(requests, callbackArg) {
			this.requestCounter = 0;
			
			var updateManager = webfrontend.net.UpdateManager.getInstance();
			
			var data = new qx.util.StringBuilder(2048);
			data.add('{"session":"', updateManager.getInstanceGuid(), '","requestid":"', updateManager.requestCounter, '","requests":', qx.util.Json.stringify(requests), "}");
			updateManager.requestCounter++;			
			
			var req = new qx.io.remote.Request(updateManager.getUpdateService() + "/Service.svc/ajaxEndpoint/Poll", "POST", "application/json");
			req.setProhibitCaching(false);
			req.setRequestHeader("Content-Type", "application/json");
			req.setData(data.get());
			req.setTimeout(10000);
			req.addListener("completed", function(e) {
				this.completeRequest(e, callbackArg);
			}, this);
			req.addListener("failed", this.failRequest, this);
			req.addListener("timeout", this.timeoutRequest, this);
			req.send();			
		},
		completeRequest: function(e, obj) {
		
			if (e.getContent() == null) return;
			
			for (var i = 0; i < e.getContent().length; i++) {
				var item = e.getContent()[i];
				var type = item.C;
				if (type == "CITY") {
					this.parseCity(obj, item.D);
				} else if (type == "WORLD") {
					this.parseWorld(item.D);
				} else if (type == "OA") {
					this.parseOA(item.D);
				}
			}
		}, 
		failRequest: function(e) {
			
		}, 
		timeoutRequest: function(e) {
			
		},
		parseOA: function(data) {
			if (data == null || data.a == null) {
				return;
			}
			try {
				var sum = 0;
				for (var i = 0; i < data.a.length; i++) {
					var a = data.a[i];
					sum += a.ta;					
				}
				console.log(sum);
			} catch (e) {
				bos.Utils.handleError(e);
			}			
		},
		parseWorld: function(data) {
			if (data == null || data.s == null) {
				return;
			}
			try {
				var server = bos.Server.getInstance();
				for (var i = 0; i < data.s.length; i++) {
					var d = data.s[i];
					
					var sector;
					if (server.sectors[d.i] != null) {
						sector = server.sectors[d.i];
					} else {
						sector = new bosSector();
					}
					sector.init(d);

					server.sectors[d.i] = sector;
				}
			} catch (e) {
				bos.Utils.handleError(e);
			}
		},
		parseCity: function(cityId, data) {
			try {
				var server = bos.Server.getInstance();
				var city = server.cities[cityId];
				var store = false;
				if (city == undefined) {
					city = new bos.City();
					store = true;
				}
				city.dispatchResults(data);
				if (store) {
					city.setId(cityId);
					server.cities[cityId] = city;
				}
				server.markCityDirty(cityId);
			} catch (e) {
				bos.Utils.handleError(e);
			}
		}
	}
});


qx.Class.define("bos.Tweaks", {
	type: "singleton",
	extend: qx.core.Object,
	members: {
		gameStarted: function() {
			trace("In gameStarted");

			this.tweakErrorReporting();
			var res = webfrontend.res.Main.getInstance();		

			try {
				var container = a.title.reportButton.getLayoutParent();
				var btnSummary = new qx.ui.form.Button(tr("summary")).set({
					marginLeft: 10
				});
				btnSummary.setWidth(78);
				btnSummary.setHeight(32);
				container._add(btnSummary, {
					row: 0,
					column: 11
				});
				btnSummary.addListener("click", function (event) {
					bos.Tweaks.getInstance().showSummary();
				}, this);			

				var menu = new qx.ui.menu.Menu();

				var btnCombatCalc = new qx.ui.menu.Button(tr("combat calculator"), null);
				btnCombatCalc.addListener("execute", function(event) {
					bos.Tweaks.getInstance().showCombatCalc();
				});

				var btnFoodCalc = new qx.ui.menu.Button(tr("food calculator"), null);
				btnFoodCalc.addListener("execute", function(event) {
					bos.Tweaks.getInstance().showFoodCalc();
				});
				
				var btnRecruitmentSpeedCalc = new qx.ui.menu.Button(tr("recruitment speed calculator"), null);
				btnRecruitmentSpeedCalc.addListener("execute", function(event) {
					bos.Tweaks.getInstance().showRecruitmentSpeedCalc();
				});								

				var btnJumpCoords = new qx.ui.menu.Button(tr("jump to coords"), null);
				btnJumpCoords.addListener("execute", function(event) {
					bos.Tweaks.getInstance().showJumpToCoordsDialog();
				});

				var btnJumpToCity = new qx.ui.menu.Button(tr("jump to city"), null);
				btnJumpToCity.addListener("execute", function(event) {
					var s = prompt(tr("please enter city coordinates"), "");
					if (s != null && s != "") {
						s.match(/^(\d{1,3}):(\d{1,3})$/);
						var x = parseInt(RegExp.$1, 10);
						var y = parseInt(RegExp.$2, 10);
						webfrontend.gui.Util.openCityProfile(x, y);
					}
				});

				var btnJumpPlayer = new qx.ui.menu.Button(tr("jump to player"), null);
				btnJumpPlayer.addListener("execute", function(event) {
					var name = prompt(tr("please enter player name:"), "");
					if (name != null && name != "") {
						//webfrontend.gui.Util.openPlayerProfile(name);					        
						a.showInfoPage(a.getPlayerInfoPage(), {
							name: name
						});
					}
				});

				var btnJumpAlliance = new qx.ui.menu.Button(tr("jump to alliance"), null);
				btnJumpAlliance.addListener("execute", function(event) {
					var name = prompt(tr("please enter alliance name:"), "");
					if (name != null && name != "") {
						//webfrontend.gui.Util.openAllianceProfile(name);
				        a.showInfoPage(a.getAllianceInfoPage(), {
							name: name
						});
					}
				});
				
				var btnJumpContinent = new qx.ui.menu.Button(tr("jump to continent"), null);
				btnJumpContinent.addListener("execute", function(event) {
					var s = prompt(tr("please enter continent:"), "");
					if (s != null && s != "") {
						var cont = parseInt(s, 10);
						var col = Math.floor(cont % 10);
						var row = Math.floor(cont / 10);						
						var srv = webfrontend.data.Server.getInstance();
						var height = srv.getContinentHeight();
						var width = srv.getContinentWidth();
						
						var x = Math.floor(col * width + 0.5 * width);
						var y = Math.floor(row * height + 0.5 * height);
						
						a.setMainView('r', 0, x * a.visMain.getTileWidth(), y * a.visMain.getTileHeight());
					}
				});
				
				var btnExtraSummary = new qx.ui.menu.Button(tr("extra summary"), null);
				btnExtraSummary.addListener("execute", this.extraSummary);
				
				menu.add(btnCombatCalc);
				menu.add(btnFoodCalc);
				menu.add(btnRecruitmentSpeedCalc);
				menu.addSeparator();
				menu.add(btnJumpCoords);
				menu.add(btnJumpToCity);
				menu.add(btnJumpPlayer);
				menu.add(btnJumpAlliance);
				menu.add(btnJumpContinent);
				
				menu.addSeparator();
				menu.add(btnExtraSummary);
				menu.addSeparator();
				
				var btnZoomOut = new qx.ui.menu.Button(tr("zoom out"), null);
				btnZoomOut.addListener("execute", function(event) {
					this.setZoom(0.5);					
				}, this);				
				
				menu.add(btnZoomOut);
				
				var btnZoomIn = new qx.ui.menu.Button(tr("zoom in"), null);
				btnZoomIn.addListener("execute", function(event) {				
					this.setZoom(1.0);
				}, this);								
				menu.add(btnZoomIn);
				
				menu.addSeparator();
				
				var btnFillWithResources = new qx.ui.menu.Button(tr("fill with resources"), null);
				btnFillWithResources.addListener("execute", function(event) {
					bos.gui.ResourcesFillerWidget.getInstance().open();
					bos.gui.ResourcesFillerWidget.getInstance().setCurrentCityAsTarget();
				}, this);
				menu.add(btnFillWithResources);				
												
				var btnMenu = new qx.ui.form.MenuButton("BOS Tools", null, menu).set({
					marginLeft: 10
				});
				container._add(btnMenu, {
					row: 0,
					column: 12
				});
								
				var zoomSlider = new qx.ui.form.Slider().set({
					minimum: 25,
					maximum: 200,
					singleStep: 5,
					pageStep: 1,
					value: 100,
					width: 200
				});
				zoomSlider.addListener("changeValue", function(e) {
					this.setZoom(zoomSlider.getValue() / 100.0);
				}, this);
				
				var btnZoomReset = new qx.ui.form.Button("R");
				btnZoomReset.addListener("execute", function(e) {
					this.setZoom(1);
					zoomSlider.setValue(100);
				}, this);
				
				var zoomBox = new qx.ui.container.Composite().set({
					width: 250,
					height: 28
				});
				zoomBox.setLayout(new qx.ui.layout.HBox(0));
				zoomBox.add(zoomSlider);
				zoomBox.add(btnZoomReset);
				
				qx.core.Init.getApplication().getDesktop().add(zoomBox, {
					  left: 400 + 300,
					  top: 70,
					  right: null
				});
						
			} catch (e) {
				bos.Utils.handleError(tr("error during BOS Tools menu creation: ") + e);
			}

			a.overlaySizes[bos.Const.EXTRA_WIDE_OVERLAY] = {
					width: 0,
					height: 0
			};

			var pos = a.overlayPositions[0];
			a.overlayPositions[bos.Const.EXTRA_WIDE_OVERLAY] = {
				left: pos.left,
				top: pos.top,
				bottom: pos.bottom
			};

			server = bos.Server.getInstance();
			
			try {
				this.applyPersistedTweaks();
			} catch (e) {
				bos.Utils.handleError("applyPersistedTweaks failed " + e);
			}
			
			trace("after gameStarted");
			
		},
		sentResourcesCounter: {},
		countSentResources: function(x, y) {
			this.sentResourcesCounter = new Object();
			var cityId = bos.Utils.convertCoordinatesToId(x, y);
			bos.net.CommandManager.getInstance().sendCommand("ReportGetCount", {
				"folder": 0,
				"city": cityId,
				"mask": 197119
			}, this, this.processReportGetCount, cityId);
		},
		processReportGetCount: function(isOk, result, cityId) {
			if (isOk && result != null) {
				var count = result;
				
				bos.net.CommandManager.getInstance().sendCommand("ReportGetHeader", {
					"folder": 0,
					"city": cityId,
					"start": 0,
					"end": count, 
					"sort": 0,
					"ascending": false,
					"mask": 197119
				}, this, this.processReportGetHeader, cityId);				
								
			}
		},
		processReportGetHeader: function(isOk, result, cityId) {
			if (isOk && result != null) {
				this.sentResourcesCounter = {
					reports: 0,
					ok: 0,
					errors: 0,
					players: {}
				};
				for (var i = 0; i < result.length; i++) {
					var report = result[i];
					if (report.t == "02010" || report.t == "02110") {
						//resources arrived
						this.sentResourcesCounter.reports++;
						bos.net.CommandManager.getInstance().sendCommand("GetReport", {
							"id": report.i,
						}, this, this.processGetReport, {cityId: cityId, state: this.sentResourcesCounter});						
					}
				}			
			}
		},
		processGetReport: function(isOk, result, params) {
			if (isOk && result != null) {
				params.state.ok++;
				var players = params.state.players;
				if (players[result.h.p] == undefined) {
					players[result.h.p] = {
						1: 0,
						2: 0,
						3: 0,
						4: 0
					};
				}
				var res = players[result.h.p];
				
				for (var i = 0; i < result.r.length; i++) {
					var item = result.r[i];
					res[item.t] += item.v;
				}
			} else {
				params.state.errors++;
			}
			
			if (params.state.errors + params.state.ok >= params.state.reports) {
				var json = qx.util.Json.stringify(params);
				bos.Utils.displayLongText(json);
			}
		},
		setZoom: function(zoom) {
			//for region and world
			var visMain = ClientLib.Vis.VisMain.GetInstance();
			visMain.set_ZoomFactor(zoom);
			
			//for city view
			try {
				if (qx.bom.client.Engine.GECKO) {
					a.visMain.scene.domRoot.style.MozTransform = "scale(" + zoom + ")";
					a.visMain.scene.domRoot.style["overflow"] = "hidden";
				} else {
					a.visMain.scene.domRoot.style["zoom"] = zoom;
				}
			} catch (ex) {
				//ignore any exception
			}
		},
		extraSummary: function() {
			var widget = bos.gui.ExtraSummaryWidget.getInstance();
			widget.open();
		},
		tweakErrorReporting: function() {
			if (bos.Const.DEBUG_VERSION) {
				//qx.event.GlobalError.setErrorHandler(null, this);
				//window.onerror = null;
				qx.event.GlobalError.setErrorHandler(handleError, this);
				//qx.event.GlobalError.setErrorHandler(null, this);
			}
		}, 
		bosTest: function() {
			//webfrontend.net.UpdateManager.getInstance().completeRequest = this.test_completeRequest;
		},
		tweakReports: function() {

			if (reportsTweaked) {
				return;
			}

			trace("in tweakReports");
			//a.title.reportButton.removeListener(a.title.reportButton, reportsBtnListener);

			//webfrontend.gui.ReportListWidget
			var rep = a.title.report;
			if (rep == null) {
				debug("rep is NULL");
				return;
			}

			rep.selectAllBtn.set({
				width: 90
			});

			rep.deleteBtn.set({
				width: 90
			});

			var left = 110;
			var step = 35;
			var bottom = 7;

			var selectDropdown = new qx.ui.form.SelectBox().set({
				width: 100,
				height: 28
			});

			var locale = qx.locale.Manager.getInstance().getLocale();
			if (locale == "de") {
				selectDropdown.add(new qx.ui.form.ListItem("Keine", null, null));
				selectDropdown.add(new qx.ui.form.ListItem("Alle", null, ""));
				selectDropdown.add(new qx.ui.form.ListItem("Spionage", null, "Spionage: "));
				selectDropdown.add(new qx.ui.form.ListItem("PlÃ¼nderung", null, "PlÃ¼nderung: "));
				selectDropdown.add(new qx.ui.form.ListItem("Ãœberfall", null, "Ãœberfall: "));
				selectDropdown.add(new qx.ui.form.ListItem("Belagerung", null, "Belagerung: "));
				selectDropdown.add(new qx.ui.form.ListItem("UnterstÃ¼tzung", null, "UnterstÃ¼tzung: "));
				selectDropdown.add(new qx.ui.form.ListItem("Waren", null, "Waren: "));
				selectDropdown.add(new qx.ui.form.ListItem("Handel", null, "Handel: "));
				selectDropdown.add(new qx.ui.form.ListItem("Jagd", null, "Jagd: "));
				selectDropdown.add(new qx.ui.form.ListItem("Schatzsuche", null, "Schatzsuche: "));
			} else {
				selectDropdown.add(new qx.ui.form.ListItem("None", null, null));
				selectDropdown.add(new qx.ui.form.ListItem("All", null, ""));
				selectDropdown.add(new qx.ui.form.ListItem("Assault", null, "Assault: |: Assaulted by "));
				selectDropdown.add(new qx.ui.form.ListItem("Goods", null, "Goods: "));
				selectDropdown.add(new qx.ui.form.ListItem("Plunder", null, "Plunder: |: Plundered by "));
				selectDropdown.add(new qx.ui.form.ListItem("Raids", null, "Raid: "));
				selectDropdown.add(new qx.ui.form.ListItem("Scout", null, "Scout: |: Scouted by "));
				selectDropdown.add(new qx.ui.form.ListItem("Siege", null, "Siege: |: Siege canceled by |: Sieged by |Reinforcement: Joins Siege vs."));
				selectDropdown.add(new qx.ui.form.ListItem("Support", null, ": Support sent for your city |: Support from |Support: Your troops arrived at |: Support retreat by |Support: Sent home by "));
				selectDropdown.add(new qx.ui.form.ListItem("Trade", null, "Trade: "));
			}

			selectDropdown.addListener("changeSelection", function onReportSelectFilter() {
				var sel = selectDropdown.getSelection()[0].getModel();
				selectReports(sel);
			}, false);


			rep.clientArea.add(selectDropdown, {
				bottom: 1,
				right: 1
			});
			//right = 100 + 1;

			var btnExport = new qx.ui.form.Button("Export");
			btnExport.set({width: 60, appearance: "button-text-small", toolTipText: locale =="de" ? "Exportieren den ausgewÃ¤hlten Report" : "Export selected reports."});
			btnExport.addListener("click", exportSelectedReports, false);
			rep.clientArea.add(btnExport, {
				bottom: 1,
				right: 110
			});
			//right += step;

			var tcm = rep.headers.getTableColumnModel();
			var behavior = tcm.getBehavior();
			behavior.setWidth(2, 90);

			//webfrontend.gui.ReportPage
			var reportPage = a.getReportPage();
			var widgets = reportPage.getChildren();
			var container = widgets[widgets.length - 1];
			var btnExportThisReport = new qx.ui.form.Button("Export");
			btnExportThisReport.addListener("execute", function(event) {
					//XXX after maintaince search for "checkAttackersLeft: function(" and look below in private method, to get name of private field with id
					var id = reportPage.__AV;
					var counter = 1;
					bos.net.CommandManager.getInstance().sendCommand("GetReport", {
						id: id
					}, this, parseReport, counter);
					counter++;
			}, this);
			container.add(btnExportThisReport);
			
			var btnExportToCombatCalc = new qx.ui.form.Button(locale == "de" ? "Zum Kampfkalk hinzuf." : "To Combat calc");
			btnExportToCombatCalc.setToolTipText(locale == "de" ? "FÃ¼gt den Spionage Report zum Kampfkalkulator hinzu." : "Adds <b>scout</b> report to combat calculator");
			btnExportToCombatCalc.addListener("execute", function(event) {
					//XXX after maintaince search for "checkAttackersLeft: function(" and look below in private method, to get name of private field with id
					var id = reportPage.__AV;
					onCombatCalc();
					var combat = getCombatCalculatorWidget();
					combat.addDefendersFromReport = true;
					var counter = 1;
					bos.net.CommandManager.getInstance().sendCommand("GetReport", {
						id: id
					}, combat, combat.parseReport, counter);
					counter++;
			}, this);
			container.add(btnExportToCombatCalc);						
			
			trace("after tweakReports");

			reportsTweaked = true;
			
		}, 
		applyPersistedTweaks: function() {
			var storage = bos.Storage.getInstance();
						
			if (storage.getTweakReportAtStart()) {
				this.tweakReport();
			}
			
			if (storage.getTweakChatAtStart()) {
				this.tweakChat();
			}	
			
		}, 
		tweakChat: function() {		
			var cls = a.chat;
			if (cls.oldOnNewMessage != undefined) {
				//already applied
				return;
			}
			
			a.chat.tabView.addListener("changeSelection", this._onChatChangeTab, this);
			a.chat.tabView.setSelection([a.chat.tabView.getChildren()[1]]);
			
			this._onChatChangeTab();
			
			cls.oldOnNewMessage = cls._onNewMessage;			
					
		}, 
		_onChatChangeTab: function(event) {
			var chatId = a.chat.tabView.getSelection()[0].getUserData("ID");
			var ch = a.chat.chatLine;
			
			switch (chatId) {
				case 0:
					ch.setBackgroundColor("red");
					break;
				case 1:
					ch.setBackgroundColor("");
					break;
				case 99:
					ch.setBackgroundColor("");
					break;
			}
									
		},
		showJumpToCoordsDialog: function() {
			var cwac = jumpCoordsDialog();
			cwac.askCoords();
			a.allowHotKey = false;
			qx.core.Init.getApplication().getDesktop().add(cwac, {left: 0, right: 0, top: 0, bottom: 0});
			cwac.show();
		},
		showSummary: function() {
			var server = bos.Server.getInstance();
			server.updateCity();
			
			var summary = getSummaryWidget();
			if (summary.isVisible()) {
			  summary.close();
			} else {
			  summary.open();
			  summary.updateView();
			}
		},		
		showCombatCalc: function() {
			var server = bos.Server.getInstance();
			server.updateCity();
			var widget = this.getCombatCalculatorWidget();
			//widget.updateView();
			if (a.getCurrentOverlay() == widget) {
				a.switchOverlay(null);
			} else {
				a.switchOverlay(widget, bos.Const.EXTRA_WIDE_OVERLAY);
			}
		},
		showFoodCalc: function() {
			var server = bos.Server.getInstance();
			server.updateCity();
			var widget = this.getFoodCalculatorWidget();
			if (a.getCurrentOverlay() == widget) {
				a.switchOverlay(null);
			} else {
				a.switchOverlay(widget);
			}
		},
		showRecruitmentSpeedCalc: function () {
			var server = bos.Server.getInstance();
			server.updateCity();
			var widget = this.getRecruitmentSpeedCalculatorWidget();
			if (a.getCurrentOverlay() == widget) {
				a.switchOverlay(null);
			} else {
				a.switchOverlay(widget);
			}
		},	
		getCombatCalculatorWidget: function() {
			if (this.combatCalculatorWidget == null) {
				this.combatCalculatorWidget = new bos.gui.CombatCalculatorWidget();
			}
			return this.combatCalculatorWidget;
		},
		getFoodCalculatorWidget: function() {
			if (this.foodCalculatorWidget == null) {
				this.foodCalculatorWidget = new bos.gui.FoodCalculatorWidget();
			}
			return this.foodCalculatorWidget;
		},
		getRecruitmentSpeedCalculatorWidget: function () {
			if (this.recruitmentSpeedCalculatorWidget == null) {
				this.recruitmentSpeedCalculatorWidget = new bos.gui.RecruitmentSpeedCalculatorWidget();
			}
			return this.recruitmentSpeedCalculatorWidget;
		}		
	}
});

/** code by XyFreak and Secusion */
qx.Class.define("bos.SharestringConverter", {
	type: "singleton",
	extend: qx.core.Object,
	statics: {
		fieldmask:"########################-------#-------#####--------#--------###---------#---------##---------#---------##------#######------##-----##-----##-----##----##-------##----##----#---------#----##----#---------#----#######----T----#######----#---------#----##----#---------#----##----##-------##----##-----##-----##-----##------#######--VV--##---------#----V--V-##---------#----V---V###--------#-----V-######-------#------V########################",
		fcp: new Array("B","A","C","D","2","3","5","O","J","4","K","N","1","L","M","E","P","S","Q","U","V","Y","Z","X","T","R","W","","0","F","G","H","I"),
		ncp: new Array(":",".",",",";","2","3","1","C","P","4","L","M","H","A","D","U","B","K","G","E","Y","V","S","X","R","J","Z","#","-","W","Q","I","F")

	},
	construct: function(inputstring) {
		raw = this._convert(inputstring);
	},
	members: {
		raw: null,
		_convert: function(inputstring) {
			var letter = inputstring[0];

			if (letter =="h") {
				var tmp = inputstring.split("=");
				var raw = tmp[1];
			
				if (raw.length == 294){
					return this.fcp2ncp(raw);
				} else {
					throw new Exception("Incorrect length of raw string " + raw.length);
				}
			} else if (letter=="[") {
				var pos = inputstring.indexOf("]");
				var raw = inputstring.slice(pos + 1, pos + 443);					
				return this.ncp2fcp(raw);
			}	
				
			throw new Exception("Incorrect sharestring format");			
		},
		fcp2ncp: function(str) {

			var watercity;
						
			if (str.length != 294) {
				throw new Exception("Incorrect sharestring length");
			}
			
			var out  = "[ShareString.1.3]";
			if (str[0] == 'W') {
				out += ";";
				watercity = true;
			} else if (str[0] == 'L') {
				out += ":";
				watercity = false;
			} else {
				throw new Exception("Incorrect sharestring format");
			}
			
			var i,j, iswater = false;
			for (i = 0, j = 1; i < bos.SharestringConverter.fieldmask.length; i++ ) {
				var mask = bos.SharestringConverter.fieldmask[i];
				if (watercity && mask == 'V') {
					iswater = !iswater;
				}

				if (mask == '#') {
					out += "#";
					iswater = false;
				} else if (mask == 'T') {
					j++;
					out += "T";
				} else if (watercity && str[j] == '0' && mask == 'V' ) {
					j++;
					out += '_';
				} else if(watercity && iswater && str[j] == '0') {
					j ++;
					out += "#";
				} else {
					out += this._convertFCPtoNCPchar(str[j++]);
				}
			}			
			return out;
		},
		_convertFCPtoNCPchar: function(str) {
			for(var i = 0; i < fcp.length; i ++) {
				if(fcp[i] == str) {
					return ncp[i];
				}
			}
			return "@";
		},
		ncp2fcp: function(rawstring){		
			var watercity = false;
			var tempstring = "http://www.lou-fcp.co.uk/map.php?map=";
			for(var i = 1; i < 442; i++) {
				if(i==1 && rawstring.charAt(0) == ";"){
					tempstring = tempstring + "W";
					watercity = true;
				}
				if(i==1 && rawstring.charAt(0)==":"){
					tempstring=tempstring+"L";
				}

				if(i==221 && watercity){
					tempstring+="0";
					continue;
				}
				else if(i==353 && watercity){
					tempstring+="0";
					continue;
				} 
				else if(i==354 && watercity){
					tempstring+="0"; 
					continue;
				} 
				else if(i==374 && watercity){
					tempstring+="0"; 
					continue;
				}
				else if(i==375 && watercity){
					tempstring+="0"; 
					continue;
				} 
				else if(i==376 && watercity){
					tempstring+="0"; 
					continue;
				} 
				else if(i==396 && watercity){
					tempstring+="0"; 
					continue;
				} 
				else if(i==397 && watercity){
					tempstring+="0"; 
					continue;
				}
				else if(rawstring[i]='T'){
					tempstring+="0";
					continue;
				}
				for(var a=0; a < ncp.length; a++){
					if(rawstring[i] == ncp[a]) {
						tempstring += fcp[a];
					}
				}
					
			}
				
			return tempstring;
		}		
	}
});

qx.Class.define("bos.Utils", {
	type: "singleton",
	extend: qx.core.Object,
	statics: {
		_popupsCount: 0,
		convertCoordinatesToId: function(x, y) {
			var id = parseInt(x, 10) | (parseInt(y, 10) << 16);
			return id;
		},
		convertIdToCoodrinates: function(id) {
			var o = this.convertIdToCoordinatesObject(id);
			return o.xPos + ":" + o.yPos;
		},
		convertIdToCoordinatesObject: function(id) {
			var o = {
				xPos: (id & 0xFFFF),
				yPos: (id >> 16),				
			}
			o.cont = webfrontend.data.Server.getInstance().getContinentFromCoords(o.xPos, o.yPos);
			return o;
		},
		extractCoordsFromClickableLook: function(pos) {
			if (pos == null)
				return null;

			if (pos.substring != undefined) {
				var startPos = pos.indexOf("\">");
				var endPos = pos.indexOf("</div>");
				if (startPos < endPos) {
					var coords = pos.substring(startPos + 2, endPos);
					var spacePos = pos.indexOf(" ");
					if (spacePos > 0) {
						coords = coords.substring(spacePos);
					}
					return coords;
				} else {
					return pos;
				}
			}
			return pos;
		}, 
		translateOrderType: function(type) {
			switch(type) {
				case 0:
					return qx.locale.Manager.tr("tnf:unknown");
				case 1:
					return qx.locale.Manager.tr("tnf:scout");
				case 2:
					return qx.locale.Manager.tr("tnf:plunder");
				case 3:
					return qx.locale.Manager.tr("tnf:assult");
				case 4:
					return qx.locale.Manager.tr("tnf:support");
				case 5:
					return qx.locale.Manager.tr("tnf:siege");
				case 8:
					return qx.locale.Manager.tr("tnf:raid");
				case 9:
					return qx.locale.Manager.tr("tnf:settle");
				case 10:
					return qx.locale.Manager.tr("tnf:boss raid");
				case -2:
					return "PvP";
			}
			return "??? " + type;
		}, 
		translateArray: function(arr) {
			var translated = [];
			for (var i = 0; i < arr.length; i++) {
				translated.push(tr(arr[i]));
			}
			return translated;
		},
		createCitiesGroupsSelectBox: function() {
			var sb = new qx.ui.form.SelectBox().set({
				width: 120,
				height: 28
			});

			sb.setToolTipText(tr("filter by: city group"));
				
			return sb;
		},
		populateCitiesGroupsSelectBox: function(sb) {
			if (sb == null) {
				return;
			}
			sb.removeAll();
			if (webfrontend.data.Player.getInstance().citygroups != undefined) {
				var groups = webfrontend.data.Player.getInstance().citygroups;
				for (var i = 0, iCount = groups.length; i < iCount; i++) {
					var item = groups[i];
					sb.add(new qx.ui.form.ListItem(item.n, null, "cg" + item.i));
				}
			}
		},		
		createCitiesTypesSelectBox: function() {
			var sb = new qx.ui.form.SelectBox().set({
				width: 120,
				height: 28
			});

			sb.setToolTipText(tr("filter by: city types"));
				
			return sb;
		}, 
		populateCitiesTypesSelectBox: function(sb, onlyMilitary, onlyBosTypes) {					
			if (sb == null) {
				return;
			}
			
			if (onlyMilitary == undefined) {
				onlyMilitary = false;
			}
			
			if (onlyBosTypes == undefined) {
				onlyBosTypes = false;
			}
			
			sb.removeAll();

			sb.add(new qx.ui.form.ListItem(tr("all"), null, "A"));
			
			if (!onlyBosTypes && webfrontend.data.Player.getInstance().citygroups != undefined) {
				var groups = webfrontend.data.Player.getInstance().citygroups;
				for (var i = 0, iCount = groups.length; i < iCount; i++) {
					var item = groups[i];
					sb.add(new qx.ui.form.ListItem(item.n, null, "cg" + item.i));
				}
			}
			
			if (!onlyMilitary) {
				sb.add(new qx.ui.form.ListItem(tr("building"), null, "B"));
			}
			sb.add(new qx.ui.form.ListItem(tr("castles"), null, "C"));
			sb.add(new qx.ui.form.ListItem(tr("defensive"), null, "D"));
			
			if (!onlyMilitary) {
				sb.add(new qx.ui.form.ListItem(tr("warehouses"), null, "W"));
				sb.add(new qx.ui.form.ListItem(tr("moonstones"), null, "M"));
				sb.add(new qx.ui.form.ListItem(tr("gold"), null, "G"));
				var list = bos.Storage.getInstance().getCustomCityTypes();
				for (var i = 0; i < list.length; i++) {
					var item = list[i];
					sb.add(new qx.ui.form.ListItem(item.description, null, item.letter));
				}
			}
		},
		isCityInCityGroup: function(cityId, groupId) {
			if (webfrontend.data.Player.getInstance().citygroups == undefined) {
				return false;
			}
			var groups = webfrontend.data.Player.getInstance().citygroups;
			for (var i = 0, iCount = groups.length; i < iCount; i++) {
				var item = groups[i];
				if (item.i == groupId) {
					for (var j = 0, jCount = item.c.length; j < jCount; j++) {
						if (item.c[j] == cityId) {
							return true;
						}						
					}
					break;
				}
			}
			
			return false;
		},
		shouldCityBeIncluded: function(city, selectedCityType, selectedContinent) {

			if (selectedCityType != null && selectedCityType != "A") {
				if (selectedCityType.indexOf("cg") == 0) {
					var groupId = parseInt(selectedCityType.substring(2));
					var cityId = bos.Utils.convertCoordinatesToId(city.xPos, city.yPos);
					if (bos.Utils.isCityInCityGroup(cityId, groupId) == false) {
						return false;
					}
				} else {
					var type = bos.CityTypes.getInstance().parseReference(city.reference);
					switch (selectedCityType) {
						case 'C':
							if (!type.isCastle) return false;
							break;
						case 'B':
							if (!type.isBuildInProgress) return false;
							break;
						case 'W':
							if (!type.isWarehouse) return false;
							break;
						case 'M':
							if (!type.hasMoonglowTower) return false;
							break;
						case 'G':
							if (!type.isGold) return false;
							break;
						case 'D':
							if (!type.isDefensive) return false;
							break;
						default:
							if (type.customTypes.indexOf(selectedCityType) < 0) return false;
							break;
					}
				}				
			}
			
			if (selectedContinent != null && selectedContinent != "A") {
				var cont = webfrontend.data.Server.getInstance().getContinentFromCoords(city.xPos, city.yPos);
				if (parseInt(selectedContinent) != cont) {
					return false;
				}
			}

			return true;
		},
		createCitiesContinentsSelectBox: function() {
			var sb = new qx.ui.form.SelectBox().set({
				width: 60,
				height: 28
			});
			var cities = webfrontend.data.Player.getInstance().cities;

			sb.setToolTipText("Filter by: <b>continents</b>");

			var continents = [];
			for (var cityId in cities) {
				var city = cities[cityId];

				var cont = webfrontend.data.Server.getInstance().getContinentFromCoords(city.xPos, city.yPos);
				continents["c" + cont] = true;
			}

			var list = [];
			for (var key in continents) {
				if (key.substring != undefined && qx.lang.Type.isString(key)) {
					var cont = parseInt(key.substring(1), 10);
					if (!isNaN(cont)) {
						list.push(cont);
					}
				}
			}
			list.sort();

			sb.add(new qx.ui.form.ListItem(tr("all"), null, "A"));
			for (var i = 0; i < list.length; i++) {
				var cont = list[i];
				sb.add(new qx.ui.form.ListItem(sprintf("C%02d", cont), null, cont));
			}

			return sb;
		},		
		makeClickable: function(msg, color) {
			return qx.lang.String.format("<div style=\"cursor:pointer;color:%1\">%2</div>", [color, msg]);			
		},
		makeColorful: function(msg, color) {
			return qx.lang.String.format("<font color=\"%1\">%2</font>", [color, msg]);			
		},
		handleError: function(message) {
			//TODO make it nicer than alert box (webfrontend.gui.ConfirmationWidget)
			bos.Utils._alert(message);
		},
		handleWarning: function(message) {
			bos.Utils._alert(message);
		},
		handleInfo: function(message) {
			alert(message);
		},
		_alert: function(message) {
			if (bos.Utils._popupsCount < bos.Const.MAX_POPUPS) {
				alert(message);
				bos.Utils._popupsCount++;
			}
		},
		displayLongText: function(body) {
			var dialog = new webfrontend.gui.ConfirmationWidget();
			//dialog.setZIndex(100000);
			var bgImg = new qx.ui.basic.Image("webfrontend/ui/bgr_popup_survey.gif");
			dialog.dialogBackground._add(bgImg, {left: 0, top: 0});
			var shrStr = new qx.ui.form.TextArea(body).set({allowGrowY: true, tabIndex: 303});
			dialog.dialogBackground._add(shrStr, {left: 30, top: 50, width: 90, height: 45});
			shrStr.selectAllText();
			var okButton = new qx.ui.form.Button("OK");
			okButton.setWidth(120);
			okButton.addListener("click", function(){dialog.disable();}, false);
			dialog.dialogBackground._add(okButton, {left: 445, top: 190});
			qx.core.Init.getApplication().getDesktop().add(dialog, {left: 0, right: 0, top: 0, bottom: 0});	
			dialog.show();
		},
		inputLongText: function(callback) {
			var dialog = new webfrontend.gui.ConfirmationWidget();
			//dialog.setZIndex(100000);
			var bgImg = new qx.ui.basic.Image("webfrontend/ui/bgr_popup_survey.gif");
			dialog.dialogBackground._add(bgImg, {left: 0, top: 0});
			var shrStr = new qx.ui.form.TextArea("").set({allowGrowY: true, tabIndex: 303});
			dialog.dialogBackground._add(shrStr, {left: 30, top: 50, width: 90, height: 45});
			shrStr.selectAllText();
			var okButton = new qx.ui.form.Button("OK");
			okButton.setWidth(120);
			okButton.addListener("click", function(){dialog.disable(); callback(shrStr.getValue()) }, false);
			dialog.dialogBackground._add(okButton, {left: 445, top: 190});
			qx.core.Init.getApplication().getDesktop().add(dialog, {left: 0, right: 0, top: 0, bottom: 0});
			dialog.show();
		},
		getDistance: function(x1, y1, x2, y2) {
			var diffX = Math.abs(x1 - x2);
			var diffY = Math.abs(y1 - y2);
			return Math.sqrt(diffX * diffX + diffY * diffY);
		},
		getDistanceUsingIds: function(id1, id2) {
			var c1 = this.convertIdToCoodrinates(id1);
			var c2 = this.convertIdToCoodrinates(id2);
			return this.getDistance(c1.xPos, c1.yPos, c2.xPos, c2.yPos);
		},		
		summaryWidget: function() { 
			return summaryWidget; 
		}		
	}
});

qx.Class.define("bos.CityTypes", {
	type: "singleton",
	extend: qx.core.Object,
	construct: function() {
		//nothing to do
	}, 
	members: {
		parseReference: function(ref) {
			var result = {
				isCastle: false,
				isBuildInProgress: false,
				isWarehouse: false,
				hasMoonglowTower: false,
				isGold: false,
				isDefensive: false,
				customTypes: new qx.data.Array([])
			};

			if (ref == null) {
				return result;
			}

			var insideOptions = false;
			for (var i = 0; i < ref.length; i++) {
				var c = ref.charAt(i);
				if (c == '*') {
					insideOptions = !insideOptions;
				} else if (insideOptions) {
					switch (c) {
						case 'C':
							result.isCastle = true;
							break;
						case 'B':
							result.isBuildInProgress = true;
							break;
						case 'W':
							result.isWarehouse = true;
							break;
						case 'M':
							result.hasMoonglowTower = true;
							break;
						case 'G':
							result.isGold = true;
							break;
						case 'D':
							result.isDefensive = true;
							break;
						default:
							result.customTypes.push(c);
							break;
					}
				}
			}

			return result;

		}, 
		getCastles: function() {
			return this._getCitiesByType("isCastle");
		}, 
		getCitiesWithMoonglowTower: function() {
			return this._getCitiesByType("hasMoonglowTower");
		}, 
		getCitiesBuildInProgress: function() {
			return this._getCitiesByType("isBuildInProgress");
		}, _getCitiesByType: function(typeName) {
			var list = [];

			var cities = webfrontend.data.Player.getInstance().cities;
			for (var cityId in cities) {
				var city = cities[cityId];

				var types = this.parseReference(city.reference);
				if (types[typeName]) {
					list.push(cityId);
				}
			}

			return list;
		}, 
		isReservedLetter: function(letter) {
			switch (letter) {
				case 'A':
				case 'C':
				case 'B':
				case 'W':
				case 'M':
				case 'G':
				case 'D':
					return true;
			}
			return false;
		}
	}
});

/** most of code of this class is taken from game source code */
qx.Class.define("bos.City", {
	extend: qx.core.Object,
	construct: function() {
		qx.Bootstrap.setDisplayName(this, "bos.City");
		this.resources = new Object();
		this.setId(-1);
		//this.setRequestId(-1);
	}, destruct: function() {
		//alert("Destroying " + this.getId());
	
		delete this.resources;
		delete this.buildQueue;
		delete this.units;
		delete this.traders;

		delete this.unitOrders;
		delete this.tradeOrders;
		
		delete this.unitQueue;
		delete this.recruitingSpeed;
		delete this.incomingUnitOrders;
		delete this.supportOrders, 
		delete this.tradeIncoming; 

	}, 
	statics: {
		SERIALIZABLE_MEMBERS: ["resources", "units", "buildQueue", "unitQueue", "recruitingSpeed", "unitOrders", "incomingUnitOrders", "supportOrders", "traders" /*XXX trades are useless to save, "tradeOrders", "tradeIncoming"*/],
		createFromSimpleObject: function(o) {
			var c = new bos.City();
			var props = qx.Class.getProperties(c.constructor);

			o["lastUpdated"] = new Date(o["lastUpdated"]);

			for (var prop in props) {
				var name = props[prop];
				try {
					if (o[name] != undefined) {
						c.set(name, o[name]);
					}
				} catch (e) {
					debug(name + " " + e);
				}
			}

			var members = bos.City.SERIALIZABLE_MEMBERS;
			for (var key in members) {
				var m = members[key];
				c[m] = o[m];
			}

			return c;
		}
	}, properties: {
		id: {
			init: -1
		},
		lastUpdated: {
			init: null
		},
		requestId: {
			init: -1
		}, 
		version: {
			init: -1
		},
		//id: {
		//        event: bK
		// }, version: {
		//        init: -1,
		//        event: ba
		onWater: {
				init: false
		}, unitCount: {
				init: 0
		}, unitLimit: {
				init: 0
		}, unitsInQueue: {
				init: 0
		}, buildingCount: {
				init: 0
		}, buildingLimit: {
				init: 0
		}, buildingsInQueue: {
				init: 0
		}, strongHold: {
				init: false
		}, sieged: {
				init: false
		}, canRecruit: {
				init: false
		}, canCommand: {
				init: false
		}, orderLimit: {
				init: 0
		}, barracksLevel: {
				init: 0
		}, townhallLevel: {
				init: 0
		}, marketplaceLevel: {
				init: 0
		}, harborLevel: {
				init: 0
		}, wallLevel: {
				init: 0
		}, hideoutSize: {
				init: 0
		}, foodConsumption: {
				init: 0
		}, foodConsumptionSupporter: {
				init: 0
		}, foodConsumptionQueue: {
				init: 0
		}, buildTimeAbsMod: {
				init: 0
		}, buildTimePercentMod: {
				init: 0
		}, plunderProtection: {
				init: 0
		}, goldProduction: {
				init: 0
		}, name: {
				init: ""
		}, reference: {
				reference: ""
		}, text: {
				init: ""
		}, buildingQueueStart: {
			init: 0
		}, buildingQueueEnd: {
			init: 0		
		}
	}, members: {
		resources: null,
		units: null,
		buildQueue: null,
		unitQueue: null,
		recruitingSpeed: null,
		unitOrders: null,
		incomingUnitOrders: null,
		tradeOrders: null,
		tradeIncoming: null,
			//----------------
		toSimpleObject : function() {
				var o = new Object();

				var props = qx.Class.getProperties(this.constructor);
				for (var prop in props) {
					var name = props[prop];
					try {
						if (qx.lang.Type.isString(name) && name.indexOf("function ") != 0) {
							o[name] = this.get(name);
						}
					} catch (e) {
						debug(name + " " + e);
					}
				}

				//qx does strange things for date object when serializing to JSON, below is workaround
				o["lastUpdated"] = this.getLastUpdated().getTime();

				var members = bos.City.SERIALIZABLE_MEMBERS;
				for (var key in members) {
					var m = members[key];
					o[m] = this[m];
				}

				return o;
			},
			//----------------
			populate: function(other) {

					this.setLastUpdated(new Date());

					this.resources = new Object();
					this.setId(-1);
					//this.setRequestId(-1);

					var props = qx.Class.getProperties(this.constructor);
					for (var prop = 0; prop < props.length; prop++) {
					//for (var prop in props) {
						var name = props[prop];
						try {
							if (qx.lang.Type.isString(name)) {
									this.set(name, other.get(name));
							}
						} catch (e) {
							//debug(name + " " + e);
						}
					}

					this.setId(parseInt(this.getId()));

					for (var res = 1; res <= 4; res++) {

						this.resources[res] = {
							step: 0,
							base: 0,
							delta: 0,
							max: 0
						};

						if (other.resources.hasOwnProperty(res)) {
							var thisRes = this.resources[res];
							var otherRes = other.resources[res];
							thisRes.step = otherRes.step;
							thisRes.base = otherRes.base;
							thisRes.delta = otherRes.delta;
							thisRes.max = otherRes.max;
						}
					}

					this.buildQueue = new Array();

					if (other.hasBuildQueue()) {
						for (var i = 0; i < other.buildQueue.length; i++) {
							var item = other.buildQueue[i];
							this.buildQueue[i] = {
								id: item.id,
								building: item.building,
								state: item.state,
								start: item.start,
								end: item.end,
								type: item.type,
								level: item.level,
								x: item.x,
								y: item.y,
								isPaid: item.isPaid
							};
						}
					}

					this.units = new Object();
					if (other.getUnits() != null) {
						for (var key in other.getUnits()) {
							var item = (other.getUnits())[key];
							this.units[key] = {
								count: item.count,
								total: item.total,
								speed: item.speed
							};
						}
					}

					this.unitQueue = new Array();
					if (other.hasUnitQueue()) {
						for (var i = 0; i < other.unitQueue.length; i++) {
							var item = other.unitQueue[i];
							this.unitQueue[i] = {
								id: item.id,
								type: item.type,
								count: item.count,
								batch: item.batch,
								left: item.left,
								start: item.start,
								end: item.end,
								isPaid: item.isPaid
							};
						}
					}

					this.traders = new Object();
					if (other.traders != null) {
						for (var key in other.traders) {
							var item = other.traders[key];
							this.traders[key] = {
								count: item.count,
								total: item.total,
								order: item.order
							};
						}
					}


					this.unitOrders = new Array();
					if (other.unitOrders != null) {
						for (var i = 0; i < other.unitOrders.length; i++) {
							var item = other.unitOrders[i];
							this.unitOrders[i] = {
								id: item.id,
								type: item.type,
								state: item.state,
								start: item.start,
								end: item.end,
								city: item.city,
								cityName: item.cityName,
								player: item.player,
								playerName: item.playerName,
								alliance: item.alliance,
								allianceName: item.allianceName,
								units: item.units,
								isDelayed: item.isDelayed,
								recurringType: item.recurringType,
								recurringEndStep: item.recurringEndStep,
								quickSupport: item.quickSupport
							};
						}
					}

					this.supportOrders = new Array();
					if (other.supportOrders != null) {
						for (var i = 0; i < other.supportOrders.length; i++) {
							var item = other.supportOrders[i];

							this.supportOrders[i] = {
								id: item.id,
								type: item.type,
								state: item.state,
								end: item.end,
								city: item.city,
								cityName: item.cityName,
								player: item.player,
								playerName: item.playerName,
								alliance: item.alliance,
								allianceName: item.allianceName,
								units: new Array(),
								quickSupport: item.quickSupport
							};

							for (var u = 0; u < item.units.length; u++) {
								this.supportOrders[i].units[u] = {
									type: item.units[u].type,
									count: item.units[u].count
								};
							}
						}
					}

					this.tradeOrders = new Array();
					if (other.tradeOrders != null) {
						for (var i = 0; i < other.tradeOrders.length; i++) {
							var item = other.tradeOrders[i];
						
							this.tradeOrders[i] = {
								id: item.id,
								type: item.type,
								transport: item.transport,
								state: item.state,
								start: item.start,
								end: item.end,
								city: item.city,
								cityName: item.cityName,
								player: item.player,
								playerName: item.playerName,
								alliance: item.alliance,
								allianceName: item.allianceName,
								resources: new Array()
							};
							for (var u = 0; u < item.resources.length; u++) {
								this.tradeOrders[i].resources[u] = {
									type: item.resources[u].type,
									count: item.resources[u].count
								};
							}					
						}
					}
					
					this.tradeIncoming = new Array();
					if (other.tradeIncoming != null) {
						for (var i = 0; i < other.tradeIncoming.length; i++) {
							var item = other.tradeIncoming[i];
						
							this.tradeIncoming[i] = {
								id: item.id,
								type: item.type,
								transport: item.transport,
								state: item.state,
								start: item.start,
								end: item.end,
								city: item.city,
								cityName: item.cityName,
								player: item.player,
								playerName: item.playerName,
								alliance: item.alliance,
								allianceName: item.allianceName,
								resources: new Array()
							};
							for (var u = 0; u < item.resources.length; u++) {
								this.tradeIncoming[i].resources[u] = {
									type: item.resources[u].type,
									count: item.resources[u].count
								};
							}					
						}
					}		
			},
			//----------------
			
			dispatchResults: function(K) {
			
			  this.setLastUpdated(new Date());
			
			  var bh = "changeVersion",
				bg = "",
				bf = "CITY",
				be = "s",
				bd = "m",
				bc = "psr",
				bb = "at",
				ba = "bl",
				Y = "hrl",
				X = "rs",
				ch = "to",
				cg = "v",
				cf = "iuo",
				ce = "t",
				cd = "nr",
				cc = "changeCity",
				cb = "r",
				ca = "singleton",
				bY = "f",
				bX = "sh",
				bo = "q",
				bp = "btam",
				bm = "d",
				bn = "tl",
				bk = "ts",
				bl = "webfrontend.data.City",
				bi = "bc",
				bj = "pl",
				bu = "b",
				bv = "pp",
				bD = "mtl",
				bB = "ae",
				bL = "su",
				bG = "n",
				bT = "mpl",
				bQ = "wl",
				bx = "btpm",
				bW = "uq",
				bV = "_applyId",
				bU = "ol",
				bw = "st",
				bz = "cpr",
				bA = "i",
				bC = "fc",
				bE = "cr",
				bH = "w",
				bN = "pd",
				bS = "bbl",
				bq = "tf",
				br = "u",
				by = "ul",
				bK = "pwr",
				bJ = "g",
				bI = "uo",
				bP = "et",
				bO = "uc",
				bF = "fcs",
				bM = "ns",
				W = "hs",
				bR = "fcq",
				bs = "ad",
				bt = "ti";			
			
				var O = webfrontend.res.Main.getInstance();
				var P = webfrontend.data.Server.getInstance();
				if (K.hasOwnProperty(bz)) {
				  //this.setCanPurifyResources(K.cpr);
				}
				if (K.hasOwnProperty(bA)) {
				  //if (this.getRequestId() != K.i) return;
				}
				if (K.hasOwnProperty(bG)) this.setName(K.n);
				if (K.hasOwnProperty(cb) && K.r != null) {
				  for (var i = 0; i < K.r.length; i++) {
					var M = K.r[i].i;
					if (!this.resources.hasOwnProperty(M)) this.resources[M] = {
					  step: 0,
					  base: 0,
					  delta: 0,
					  max: 0
					};
					if (K.r[i].hasOwnProperty(be)) this.resources[M].step = K.r[i].s;
					if (K.r[i].hasOwnProperty(bu)) this.resources[M].base = K.r[i].b;
					if (K.r[i].hasOwnProperty(bm)) this.resources[M].delta = K.r[i].d;
					if (K.r[i].hasOwnProperty(bd)) this.resources[M].max = K.r[i].m;
				  }
				}
				//if (K.hasOwnProperty(bK)) this.palaceWoodResources = K.pwr;
				//if (K.hasOwnProperty(bc)) this.palaceStoneResources = K.psr;
				if (K.hasOwnProperty(W)) this.setHideoutSize(K.hs);
				if (K.hasOwnProperty(bC)) this.setFoodConsumption(K.fc);
				if (K.hasOwnProperty(bF)) this.setFoodConsumptionSupporter(K.fcs);
				if (K.hasOwnProperty(bR)) this.setFoodConsumptionQueue(K.fcq);
				if (K.hasOwnProperty(bH)) this.setOnWater(K.w != 0);
				if (K.hasOwnProperty(bJ)) this.setGoldProduction(K.g);
				//if (K.hasOwnProperty(bk)) this.setTypeSlots(K.ts);
				var R = 0;
				if (K.hasOwnProperty(bo)) {
				  if (K.q != null && K.q.length > 0) {
					if (this.buildQueue == null) this.buildQueue = new Array();
					else qx.lang.Array.removeAll(this.buildQueue);
					for (var i = 0; i < K.q.length; i++) {
					   var item = K.q[i];
					   this.buildQueue[i] = {
						id: item.i,
						building: item.b,
						state: item.s,
						type: item.t,
						l: item.l,
						x: item.x,
						y: item.y,
						isPaid: item.p,
						warnings: item.w,
						time: -1
					  };

					  if (K.q[i].l == 1 && K.q[i].s == 1) R++;
					}
				  } else {
					if (this.buildQueue != null) delete this.buildQueue;
				  }
				  this.setBuildingsInQueue(R);
				}
				R = 0;
				if (K.hasOwnProperty(bW)) {
				  if (K.uq != null && K.uq.length > 0) {
					if (this.unitQueue == null) this.unitQueue = new Array();
					else qx.lang.Array.removeAll(this.unitQueue);
					for (var i = 0; i < K.uq.length; i++) {
					  this.unitQueue[i] = {
						id: K.uq[i].i,
						type: K.uq[i].t,
						count: K.uq[i].o,
						batch: K.uq[i].c,
						left: K.uq[i].l,
						start: K.uq[i].ss,
						end: K.uq[i].es,
						isPaid: K.uq[i].p
					  };
					  R += K.uq[i].l * O.units[K.uq[i].t].uc;
					}
				  } else {
					if (this.unitQueue != null) delete this.unitQueue;
				  }
				  this.setUnitsInQueue(R);
				}
				if (K.hasOwnProperty(br)) {
				  if (K.u != null && K.u.length > 0) {
					if (this.units == null) this.units = new Object();
					else qx.lang.Object.empty(this.units);
					for (var i = 0; i < K.u.length; i++) this.units[K.u[i].t] = {
					  count: K.u[i].c,
					  total: K.u[i].tc,
					  speed: K.u[i].s
					};
				  } else {
					if (this.units != null) delete this.units;
				  }
				}
				if (K.hasOwnProperty(cf)) {
				  if (K.iuo != null && K.iuo.length > 0) {
					if (this.incomingUnitOrders == null) this.incomingUnitOrders = new Array();
					else qx.lang.Array.removeAll(this.incomingUnitOrders);
					for (var i = 0; i < K.iuo.length; i++) {
					  this.incomingUnitOrders[i] = {
						id: K.iuo[i].i,
						type: K.iuo[i].t,
						state: K.iuo[i].s,
						end: K.iuo[i].es,
						city: K.iuo[i].c,
						cityName: K.iuo[i].cn,
						player: K.iuo[i].p,
						playerName: K.iuo[i].pn,
						alliance: K.iuo[i].a,
						allianceName: K.iuo[i].an
					  };
					}
				  } else {
					if (this.incomingUnitOrders != null) delete this.incomingUnitOrders;
				  }
				}
				if (K.hasOwnProperty(ce)) {
				  if (K.t != null && K.t.length > 0) {
					if (this.traders == null) this.traders = new Object();
					else qx.lang.Object.empty(this.traders);
					for (var i = 0; i < K.t.length; i++) this.traders[K.t[i].t] = {
					  count: K.t[i].c,
					  total: K.t[i].tc,
					  order: 0
					};
				  } else {
					if (this.traders != null) delete this.traders;
				  }
				}
				if (K.hasOwnProperty(bI)) {
				  if (K.uo != null && K.uo.length > 0) {
					if (this.unitOrders == null) this.unitOrders = new Array();
					else qx.lang.Array.removeAll(this.unitOrders);
					for (var i = 0; i < K.uo.length; i++) {
					  var U = null;
					  if (K.uo[i].u != null && K.uo[i].u.length > 0) {
						U = new Array();
						for (var j = 0; j < K.uo[i].u.length; j++) U.push({
						  type: K.uo[i].u[j].t,
						  count: K.uo[i].u[j].c
						});
					  }
					  this.unitOrders[i] = {
						id: K.uo[i].i,
						type: K.uo[i].t,
						state: K.uo[i].s,
						start: K.uo[i].ss,
						end: K.uo[i].es,
						city: K.uo[i].c,
						cityName: K.uo[i].cn,
						player: K.uo[i].p,
						playerName: K.uo[i].pn,
						alliance: K.uo[i].a,
						allianceName: K.uo[i].an,
						units: U,
						isDelayed: K.uo[i].d,
						recurringType: K.uo[i].rt,
						recurringEndStep: K.uo[i].rs,
						quickSupport: K.uo[i].q
					  };
					}
				  } else {
					if (this.unitOrders != null) delete this.unitOrders;
				  }
				}
				if (K.hasOwnProperty(bL)) {
				  if (K.su != null && K.su.length > 0) {
					if (this.supportOrders == null) this.supportOrders = new Array();
					else qx.lang.Array.removeAll(this.supportOrders);
					for (var i = 0; i < K.su.length; i++) {
					  var U = null;
					  if (K.su[i].u != null && K.su[i].u.length > 0) {
						U = new Array();
						for (var j = 0; j < K.su[i].u.length; j++) U.push({
						  type: K.su[i].u[j].t,
						  count: K.su[i].u[j].c
						});
					  }
					  this.supportOrders[i] = {
						id: K.su[i].i,
						type: K.su[i].t,
						state: K.su[i].s,
						end: K.su[i].es,
						city: K.su[i].c,
						cityName: K.su[i].cn,
						player: K.su[i].p,
						playerName: K.su[i].pn,
						alliance: K.su[i].a,
						allianceName: K.su[i].an,
						units: U,
						quickSupport: K.su[i].q
					  };
					}
				  } else {
					if (this.supportOrders != null) delete this.supportOrders;
				  }
				}
				if (K.hasOwnProperty(ch)) {
				  if (K.to != null && K.to.length > 0) {
					if (this.tradeOrders == null) this.tradeOrders = new Array();
					else qx.lang.Array.removeAll(this.tradeOrders);
					for (var i = 0; i < K.to.length; i++) {
					  var U = null;
					  var T = 0;
					  if (K.to[i].r != null && K.to[i].r.length > 0) {
						var O = new Array();
						for (var j = 0; j < K.to[i].r.length; j++) {
						  O.push({
							type: K.to[i].r[j].t,
							count: K.to[i].r[j].c
						  });
						  T += K.to[i].r[j].c;
						}
						this.traders[K.to[i].tt].order += Math.ceil(T / P.getTradeCapacity(K.to[i].tt));
					  }
					  this.tradeOrders[i] = {
						id: K.to[i].i,
						type: K.to[i].t,
						transport: K.to[i].tt,
						state: K.to[i].s,
						start: K.to[i].ss,
						end: K.to[i].es,
						city: K.to[i].c,
						cityName: K.to[i].cn,
						player: K.to[i].p,
						playerName: K.to[i].pn,
						alliance: K.to[i].a,
						allianceName: K.to[i].an,
						resources: O
					  };
					}
				  } else {
					if (this.tradeOrders != null) delete this.tradeOrders;
				  }
				}
				if (K.hasOwnProperty(bq)) {
				  if (K.tf != null && K.tf.length > 0) {
					if (this.tradeOffers == null) this.tradeOffers = new Array();
					else qx.lang.Array.removeAll(this.tradeOffers);
					for (var i = 0; i < K.tf.length; i++) {
					  this.tradeOffers[i] = {
						id: K.tf[i].i,
						transport: K.tf[i].t,
						deliverTime: K.tf[i].d,
						price: K.tf[i].p,
						resourceType: K.tf[i].r,
						amountTradeUnit: K.tf[i].a
					  };
					}
				  } else {
					if (this.tradeOffers != null) delete this.tradeOffers;
				  }
				}
				if (K.hasOwnProperty(bt)) {
				  if (K.ti != null && K.ti.length > 0) {
					if (this.tradeIncoming == null) this.tradeIncoming = new Array();
					else qx.lang.Array.removeAll(this.tradeIncoming);
					for (var i = 0; i < K.ti.length; i++) {
					  if (K.ti[i].r != null && K.ti[i].r.length > 0) {
						var O = new Array();
						for (var j = 0; j < K.ti[i].r.length; j++) O.push({
						  type: K.ti[i].r[j].t,
						  count: K.ti[i].r[j].c
						});
					  }
					  this.tradeIncoming[i] = {
						id: K.ti[i].i,
						type: K.ti[i].t,
						transport: K.ti[i].tt,
						state: K.ti[i].s,
						start: K.ti[i].ss,
						end: K.ti[i].es,
						city: K.ti[i].c,
						cityName: K.ti[i].cn,
						player: K.ti[i].p,
						playerName: K.ti[i].pn,
						alliance: K.ti[i].a,
						allianceName: K.ti[i].an,
						resources: O
					  };
					}
				  } else {
					if (this.tradeIncoming != null) delete this.tradeIncoming;
		
