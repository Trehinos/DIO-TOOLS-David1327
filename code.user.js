// ==UserScript==
// @name		DIO-TOOLS-David1327
// @name:fr		DIO-TOOLS-David1327
// @namespace	https://www.tuto-de-david1327.com/pages/info/dio-tools-david1327.html
// @version		4.28.8
// @author		DIONY (changes and bug fixes by David1327)
// @description Version 2022. DIO-Tools + Quack is a small extension for the browser game Grepolis. (counter, displays, smilies, trade options, changes to the layout)
// @description:FR Version 2022. DIO-Tools + Quack est une petite extension du jeu par navigateur Grepolis. (compteur, affichages, smileys, options commerciales, modifications de la mise en page)
// @match		https://*.grepolis.com/game/*
// @match		https://*.forum.grepolis.com/*
// @match		https://*.tuto-de-david1327.com/*
// @updateURL   https://raw.githubusercontent.com/DIO-David1327/DIO-TOOLS-David1327/main/code.user.js
// @downloadURL	https://raw.githubusercontent.com/DIO-David1327/DIO-TOOLS-David1327/main/code.user.js
// @resource    Version_dio https://raw.githubusercontent.com/DIO-David1327/DIO-TOOLS-David1327/main/Version.js
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon		https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-bussi2.gif
// @icon64		https://www.tuto-de-david1327.com/medias/images/dio-tools-david1327.jpg
// @copyright	2013+, DIONY and 2019+, David1327
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant       GM_getResourceText
// @license     GPL-3.0-only
// ==/UserScript==

var dio_version = '4.29';

/*******************************************************************************************************************************
 * Global stuff
 *******************************************************************************************************************************/

var uw = unsafeWindow || window, $ = uw.jQuery, DATA, GM;

// GM-API?
GM = (typeof GM_info === 'object');

console.log('%c|= DIO-Tools-David1327 is active =|', 'color: green; font-size: 1em; font-weight: bolder; ');

function loadValue(name, default_val) {
    var value;
    if (GM) { value = GM_getValue(name, default_val); }
    else { value = localStorage.getItem(name) || default_val; }

    if (typeof (value) === "string") { value = JSON.parse(value) }
    return value;
}

// LOAD DATA
if (GM && (uw.location.pathname.indexOf("game") >= 0)) {
    var WID = uw.Game.world_id, MID = uw.Game.market_id, AID = uw.Game.alliance_id;

    DATA = {
        // GLOBAL
        options: loadValue("options", "{}"),

        test: loadValue("test", "{}"),

        user: loadValue("dio_user", "{}"),

        notification: loadValue('notif', '0'),
        update: loadValue('update', '0'),

        error: loadValue('error', '{}'),

        // WORLD
        townTypes: loadValue(WID + "_townTypes", "{}"),
        townAuto: loadValue(WID + "_townAuto", "{}"),
        sentUnits: loadValue(WID + "_sentUnits", '{ "attack": {}, "support": {} }'),

        biremes: loadValue(WID + "_biremes", "{}"), //old
        bullseyeUnit: loadValue(WID + "_bullseyeUnit", '{ "current_group" : -1 }'), // new

        worldWonder: loadValue(WID + "_wonder", '{ "ratio": {}, "storage": {}, "map": {} }'),

        Overviews: loadValue("Overviews", '{ "Buildings": "", "Culture": "", "Gods": "" }'),

        // MARKET
        worldWonderTypes: loadValue(MID + "_wonderTypes", '{}')
    };

    if (!DATA.worldWonder.map) { DATA.worldWonder.map = {}; }

    // Temporary:
    if (typeof DATA.options.dio_trd == 'boolean') { DATA.options.dio_per = DATA.options.dio_rec = DATA.options.dio_trd; delete DATA.options.dio_trd; }
    if (typeof DATA.options.dio_mov == 'boolean') { DATA.options.dio_act = DATA.options.dio_mov; delete DATA.options.dio_mov; }
    if (typeof DATA.options.dio_twn == 'boolean') { DATA.options.dio_tic = DATA.options.dio_til = DATA.options.dio_tim = DATA.options.dio_twn; delete DATA.options.dio_twn; }
    if (GM) GM_deleteValue("notification");
}

// GM: EXPORT FUNCTIONS
uw.saveValueGM = function (name, val) { setTimeout(function () { GM_setValue(name, val); }, 0); };
uw.deleteValueGM = function (name) { setTimeout(function () { GM_deleteValue(name); }, 0); };
/*uw.calculateConcaveHull = function () {
    var contour = [
        new poly2tri.Point(100, 100),
        new poly2tri.Point(100, 300),
        new poly2tri.Point(300, 300),
        new poly2tri.Point(300, 100)
    ];

    var swctx = new poly2tri.SweepContext(contour);

    swctx.triangulate();
    var triangles = swctx.getTriangles();

    // console.debug(triangles);
    return triangles;
};

if (typeof exportFunction == 'function') {
    // Firefox > 30
    //uw.DATA = cloneInto(DATA, unsafeWindow);
    exportFunction(uw.saveValueGM, unsafeWindow, { defineAs: "saveValueGM" });
    exportFunction(uw.deleteValueGM, unsafeWindow, { defineAs: "deleteValueGM" });
    exportFunction(uw.calculateConcaveHull, unsafeWindow, { defineAs: "calculateConcaveHull" });
} else {
    // Firefox < 30, Chrome, Opera, ...
    //uw.DATA = DATA;
}*/

var time_a, time_b;

// APPEND SCRIPT
function appendScript() {
    //console.log("GM-API: " + gm_bool);
    if (document.getElementsByTagName('body')[0]) {
        var dioscript = document.createElement('script');
        dioscript.type = 'text/javascript';
        dioscript.id = 'diotools';

        time_a = uw.Timestamp.client();
        dioscript.textContent = DIO_GAME.toString().replace(/uw\./g, "") + "\n DIO_GAME('" + dio_version + "', " + GM + ", '" + JSON.stringify(DATA).replace(/'/g, "##") + "', " + time_a + ");";
        document.body.appendChild(dioscript);

        var DIO_Version = document.createElement('script');
        DIO_Version.type = 'text/javascript';
        DIO_Version.innerHTML = GM_getResourceText('Version_dio');
        document.getElementsByTagName('head')[0].appendChild(DIO_Version);
    } else {
        setTimeout(function () { appendScript(); }, 500);
    }
}

if (location.host === "www.tuto-de-david1327.com") { DIO_PAGE(); } // PAGE
else if ((uw.location.pathname.indexOf("game") >= 0) && GM) { appendScript(); } // GAME
else { DIO_FORUM(); }

function DIO_PAGE() {
    document.getElementById("pied-de-page-pub-2").innerHTML = "";
}
function DIO_FORUM() {
    var Emots = {
        button: ["rollsmiliey", "smile"],
        standard: [
            "smilenew", "lol", "neutral-new", "afraid", "freddus-pacman", "auslachen2", "kolobok-sanduhr", "bussi2", "winken4", "flucht2", "panik4", "ins-auge-stechen", "seb-zunge", "fluch4-GREEN", "baby-junge2", "blush-reloaded6", "frown", "verlegen", "blush-pfeif", "stevieh-rolleyes", "daumendreh2", "baby-taptap",
            "sadnew", "hust", "confusednew", "idea2", "irre", "irre4", "sleep", "candle", "nicken", "no-sad", "thumbs-up-new", "kciuki", "thumbs-down-new", "bravo2", "oh-no2", "kaffee2", "drunk", "saufen", "freu-dance", "hecheln", "headstand", "rollsmiliey", "eazy-cool01", "motz", "cuinlove", "biggrin"
        ],
        nature: [
            "dinosaurier07", "flu-super-gau", "ben-cat", "schwein", "hundeleine01", "blume", "ben-sharky", "ben-cow", "charly-bissig", "gehirnschnecke-confused", "mttao-fische", "mttao-angler", "insel", "fliegeschnappen", "plapperhase", "ben-dumbo", "twitter", "elefant", "schildkroete", "elektroschocker", "spiderschwein", "oma-sessel-katze", "fred-elefant",
            "palmoel", "stevieh-teddy", "fips-aufsmaul", "marienkaefer", "mrkaktus", "kleeblatt2", "fred-blumenstauss", "hurra-fruehling1-lila", "fred-rasenmaeher", "fred-blumenbeet"
        ],
        grepolis: [
            "grepolis", "mttao-wassermann", "i-lovo-grepolis", "silvester-cuinlove", "mttao-schuetze", "kleeblatt2", "wallbash", "musketiere-fechtend", "palka", "lol-1", "mttao-waage2", "steckenpferd", "skullhaufen", "pferdehaufen", "pirat5", "seb-cowboy", "gw-ranger001",
            "barbar", "datz", "waffe01", "sarazene-bogen", "waffe02", "waffe14", "hoplit-sword1", "pfeildurchkopf02", "saladin", "hoplit-sword3"
        ],
        people: [
            "greenistan", "mttao-usa", "schal-usa", "mttao-grossbritannien", "seb-hut5", "opa-boese2", "star-wars-yoda1-gruen", "hexefliegend", "snob", "seb-detektiv-ani", "devil", "segen", "borg", "hexe3b", "eazy-polizei", "stars-elvis", "mttao-chefkoch", "nikolaus", "pirate3-biggrin", "batman-skeptisch", "tubbie1", "tubbie2", "tubbie3", "kosmita", "tubbie4"
        ],
        Party: [
            "torte1", "torte3", "bier", "party", "party2", "fans", "band", "klokotzen", "laola", "prost", "rave", "mcdonalds", "margarita", "geschenk", "sauf", "el", "trommler", "ozboss-gitarre2", "kaffee", "kaffee3", "caipirinha", "whiskey", "drunk", "fressen", "popcorn-essen", "saufen", "energydrink1", "leckerer", "prost2", "birthday"
        ],
        other: [
            "steinwerfen", "herzen02", "scream-if-you-can", "kolobok", "headbash", "liebeskummer", "bussi", "brautpaar-reis", "grab-schaufler2", "boxen2", "aufsmaul", "mttao-kehren", "sm", "weckruf", "klugscheisser2", "karte2-rot", "dagegen", "party", "dafuer", "outofthebox", "pokal-gold", "koepfler", "transformer", "eazy-senseo1"
        ],
        halloween: [
            "zombies-alien", "zombies-lol", "zombies-rolleyes", "zombie01", "zombies-smile", "zombie02", "zombies-skeptisch", "zombies-eek", "zombies-frown", "geistani", "scream-if-you-can", "pfeildurchkopf01", "grab-schaufler", "kuerbisleuchten", "mummy3",
            "kuerbishaufen", "halloweenskulljongleur", "fledermausvampir", "frankenstein-lol", "halloween-confused", "zombies-razz", "halloweenstars-freddykrueger", "zombies-cool", "geist2", "fledermaus2", "halloweenstars-dracula", "batman", "halloweenstars-lastsummer"
        ],
        xmas: [
            "i-love-grepolis", "santagrin", "xmas1-down", "xmas1-thumbs1", "xmas2-lol", "xmas1-frown", "xmas1-irre", "xmas1-razz", "xmas4-kaffee2", "xmas4-hurra2", "xmas4-aufsmaul", "schneeball", "schneeballwerfen", "xmas4-advent4", "nikolaus", "weihnachtsmann-junge", "schneewerfen-wald", "weihnachtsmann-nordpol", "xmas-kilroy-kamin",
            "xmas4-laola", "xmas3-smile", "xmas4-paketliebe", "3hlkoenige", "santa", "weihnachtsgeschenk2", "fred-weihnachten-ostern", "xmas4-wallbash", "xmas4-liebe", "xmas4-skullhaufen"
        ],
        easter: [
            "eier-bemalen-blau-hase-braun", "osterei-hase05", "osterei-bunt", "ostern-hurra2", "osterhasensmilie", "ostern-thumbs1", "ostern-nosmile", "ostern-lol", "ostern-irre", "ostern-frown", "ostern-down", "ostern-cuinlove", "ostern-confused", "ostern-blush", "ostern-biggrin"
        ],
        love: [
            "b-love2", "brautpaar-kinder", "brautpaar-reis", "cuinlove", "fips-herzen01", "heart", "herzen01", "herzen02", "herzen06", "kiss", "klk-tee", "liebesflagge", "love", "lovelove-light", "rose", "send-out-love", "teeglas-fruechtetee", "unknownauthor-knutsch", "valentinstag-biggrin", "valentinstag-confused",
            "valentinstag-down", "valentinstag-irre", "valentinstag-lol", "valentinstag-thumbs1", "wolke7"
        ],
    };

    var FDio = {
        Home: "https://www.tuto-de-david1327.com/",
        HomeImg: "https://www.tuto-de-david1327.com/medias/images/smiley-emoticons-",
        lasttab: 0,
        emots: !1,
        xfEdit: null,
        xfAvat: "n",

        GetEmotss: () => {
            FDio.emots || ($.ajax({
                timeout: 1e4,
                complete: () => {
                    FDio.emots = !0;
                    var e = $(".fr-element.fr-view:first");
                    function t(e, t, o) {
                        return $("<li/>", {
                            style: "float:left; width:35px; height:25; margin-top:4px; margin-left: 5px;"
                        }).click(function () {
                            $("#dio_emot_popup ul li").css("background", 'url("' + FDio.Home + 'medias/images/etabB.gif") no-repeat');
                            $(this).css("background", 'url("' + FDio.Home + 'medias/images/etabA.gif") no-repeat');
                            document.getElementById("dio_emots_poup_content").innerHTML = "";
                            $.each(o, (e, t) => {
                                (e = FDio.HomeImg + t + ".gif");
                                $("#dio_emots_poup_content").append($("<img/>", {
                                    src: e,
                                    title: "",
                                    class: ".Smilie",
                                    style: "margin-right: 5px; padding: 2px; border: 1px solid transparent; cursor: pointer;"
                                }).mouseover(function () {
                                    this.style.backgroundColor = "#08944d33";
                                    this.style.border = "1px solid #00800080";
                                }).mouseout(function () {
                                    this.style.backgroundColor = "transparent";
                                    this.style.border = "1px solid transparent";
                                }).click(function () {
                                    FDio.xfPasteImage($(this).attr("src"));
                                }));
                            });
                        }).html("<center>" + t + "<center>");
                    }
                    var dioEmots, dioEmotsbutton;
                    e.length && (FDio.xfEdit = e.closest("form"),
                        FDio.xfEdit.length && (dioEmots = $("<div/>", {
                            id: "dio_emot_popup",
                            class: "message",
                            style: "display:none; z-index:10;" //float: left;  margin: -5px 0 -40px 0;
                        }).append($("<ul/>", {
                            class: "emojiList js-emojiList",
                            style: "max-height: 27px; margin: 0px; background-color: #3f4745;border: .1px solid #f3b344;"
                        }).append(
                            t(0, "<img src='" + FDio.HomeImg + "smilenew.gif' style='padding: 2px;'</img>", Emots.standard)
                        ).append(
                            t(0, "<img src='" + FDio.HomeImg + "ben-cat.gif' style='padding: 2px;'</img>", Emots.nature)).append(
                                t(0, "<img src='" + FDio.HomeImg + "i-lovo-grepolis.gif' style='margin-top: -4px;'</img>", Emots.grepolis)).append(
                                    t(0, "<img src='" + FDio.HomeImg + "stars-elvis.gif' style=''</img>", Emots.people)).append(
                                        t(0, "<img src='" + FDio.HomeImg + "prost2.gif' style='padding: 2px; margin-right: -5px;'</img>", Emots.Party)).append(
                                            t(0, "<img src='" + FDio.HomeImg + "irre.gif' style='padding: 2px; margin-right: -5px;'</img>", Emots.other)).append(
                                                t(0, "<img src='" + FDio.HomeImg + "zombies-lol.gif' style='padding: 2px; margin-right: -5px;'</img>", Emots.halloween)).append(
                                                    t(0, "<img src='" + FDio.HomeImg + "santagrin.gif' style='margin-top: -4px;'</img>", Emots.xmas)).append(
                                                        t(0, "<img src='" + FDio.HomeImg + "osterhasensmilie.gif' style='margin-top: -4px;'</img>", Emots.easter)).append(
                                                            t(0, "<img src='" + FDio.HomeImg + "herzen02-1.gif' style='margin-top: -4px;'</img>", Emots.love))).append(
                                                                $("<div/>", {
                                                                    class: "js-emoji",
                                                                    style: 'clear:both; height:100px; border-left: .1px solid #f3b344; border-right: .1px solid #f3b344; margin-top: -5px;'
                                                                }).append($("<div/>", {
                                                                    class: "signature",
                                                                    style: "margin:5px;overflow-y: auto; max-height: 99px;"
                                                                }).append($("<div/>", {
                                                                    id: "dio_emots_poup_content",
                                                                })))).css({ "text-align": "left" }),
                            $(".fr-toolbar.fr-ltr.fr-desktop.fr-top.fr-basic").before(dioEmots), //'<div class="fr-separator fr-vs" role="separator" aria-orientation="vertical"></div>'+
                            dioEmots.parent().append("<br>"),
                            dioEmotsbutton = $('<button id="dio_smiley_butt" type="button" role="button" class="fr-command fr-btn" style="text-align: center;"><div id="dio_smiley_button" class="button"></div></button>', {
                            }).click(() => { $("#dio_emot_popup").toggle(); }),

                            ((!$('#dio_smiley_button').length) ? ($(".fr-toolbar").length && ($("#xfSmilie-1").after(dioEmotsbutton))) : ""),
                            $("#dio_emot_popup ul li:first").click()));

                    $('<style id="dio_emot_popup_style">' +
                        // Chrome Scroollbar Style
                        '#dio_smiley_button { z-index:2; height: 18px; border: transparent; background:url("' + FDio.HomeImg + 'smile.gif") no-repeat 0px 0px } ' +
                        '#dio_emot_popup ::-webkit-scrollbar { width: 13px; } ' +
                        '#dio_emot_popup ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
                        '#dio_emot_popup ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
                        '#dio_emot_popup ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +
                        '#dio_smiley_butt.fr-command.fr-btn.fr-disabled div#dio_smiley_button { filter: opacity(0.2); cursor: default;} ' +
                        '</style>').appendTo('head');
                },
                error: () => {
                    (FDio.emots = !1, setTimeout(() => { FDio.GetEmotss(); }, 1e4))
                }
            }),
                FDio.emots = !1,
                setTimeout(() => { FDio.GetEmotss(); }, 1e4)); //,
        },

        xfPasteImage: (e) => {
            var t;
            /*global XF*/
            if (!(t = XF.getEditorInContainer(FDio.xfEdit))) return !1;
            $('<img src="' + e + '" data-url="' + e + '" class="bbImage fr-fic fr-dii fr-draggable" alt="" title="">').insertBefore(".fr-element.fr-view:first p:last br:last")
            $("#dio_emot_popup").hide()
        },
    };
    FDio.GetEmotss();
    setInterval(() => { FDio.GetEmotss(); }, 10000);
}


function DIO_GAME(dio_version, gm, DATA, time_a) {

    var MutationObserver = uw.MutationObserver || window.MutationObserver,

        WID, MID, AID, PID, LID, Points, pName, tName;
    var Home = "https://www.tuto-de-david1327.com/";
    var Home_img = "https://www.tuto-de-david1327.com/medias/images/";
    var updateversion = dio_version.replace(/\./g, "-");
    var dio_sprite = Home_img + "dio-sprite-5.png"; // https://www.tuto-de-david1327.com/medias/images/dio-sprite-5.png
    var dio_spritetest = "https://www.tuto-de-david1327.com/medias/images/town-icons-test-54.png"

    //dio_icon
    var dio_img = Home_img + "icon.gif"; //Home_img + "icon.gif"
    var dio_icon = '<div class="dio_icon b"></div>';

    if (uw.location.pathname.indexOf("game") >= 0) {
        DATA = JSON.parse(DATA.replace(/##/g, "'"));

        WID = uw.Game.world_id;
        MID = uw.Game.market_id;
        AID = uw.Game.alliance_id;
        PID = uw.Game.player_id;
        LID = uw.Game.locale_lang.split("_")[0]; // LID ="es";
        Points = uw.Game.player_points;
        pName = uw.Game.player_name;
        tName = uw.Game.townName;

        // World with Artemis ??
        uw.Game.hasArtemis = true; //Game.constants.gods.length == 6;
    }
    var david1327 = (pName == "david1327");

    $.prototype.reverseList = [].reverse;

    // Implement old jQuery method (version < 1.9)
    $.fn.toggleClick = function () {
        var methods = arguments; // Store the passed arguments for future reference
        var count = methods.length; // Cache the number of methods

        // Use return this to maintain jQuery chainability
        // For each element you bind to
        return this.each(function (i, item) {
            // Create a local counter for that element
            var index = 0;

            // Bind a click handler to that element
            $(item).on('click', function () {
                // That when called will apply the 'index'th method to that element
                // the index % count means that we constrain our iterator between 0
                // and (count-1)
                return methods[index++ % count].apply(this, arguments);
            });
        });
    };

    function saveValue(name, val) {
        if (gm) { uw.saveValueGM(name, val); }
        else { localStorage.setItem(name, val); }
    }

    function deleteValue(name) {
        if (gm) { uw.deleteValueGM(name); }
        else { localStorage.removeItem(name); }
    }
    $('<script src="https://cdn.jsdelivr.net/npm/clipboard@2/dist/clipboard.min.js"></script>').appendTo("head");

    /*******************************************************************************************************************************
     * Graphic filters
     *******************************************************************************************************************************/
    if (uw.location.pathname.indexOf("game") >= 0) {
        $('<svg width="0%" height="0%">' +
            // GREYSCALE
            '<filter id="GrayScale">' +
            '<feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0">' +
            '</filter>' +
            // SEPIA
            '<filter id="Sepia">' +
            '<feColorMatrix type="matrix" values="0.343 0.669 0.119 0 0 0.249 0.626 0.130 0 0 0.172 0.334 0.111 0 0 0.000 0.000 0.000 1 0">' +
            '</filter>' +
            // SATURATION
            '<filter id="Saturation"><feColorMatrix type="saturate" values="0.2"></filter>' +
            '<filter id="Saturation1"><feColorMatrix type="saturate" values="1"></filter>' +
            '<filter id="Saturation2"><feColorMatrix type="saturate" values="2"></filter>' +
            // HUE
            '<filter id="Hue1"><feColorMatrix type="hueRotate" values= "65"></filter>' +
            '<filter id="Hue2"><feColorMatrix type="hueRotate" values="150"></filter>' +
            '<filter id="Hue3"><feColorMatrix type="hueRotate" values="-65"></filter>' +
            // BRIGHTNESS
            '<filter id="Brightness15">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.5"/><feFuncG type="linear" slope="1.5"/><feFuncB type="linear" slope="1.5"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness12">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.2"/><feFuncG type="linear" slope="1.2"/><feFuncB type="linear" slope="1.2"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness11">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.1"/><feFuncG type="linear" slope="1.1"/><feFuncB type="linear" slope="1.1"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness10">' +
            '<feComponentTransfer><feFuncR type="linear" slope="1.0"/><feFuncG type="linear" slope="1.0"/><feFuncB type="linear" slope="1.0"/></feComponentTransfer>' +
            '</filter>' +
            '<filter id="Brightness07">' +
            '<feComponentTransfer><feFuncR type="linear" slope="0.7"/><feFuncG type="linear" slope="0.7"/><feFuncB type="linear" slope="0.7"/></feComponentTransfer>' +
            '</filter>' +
            '</svg>').appendTo('#ui_box');
    }

    /*******************************************************************************************************************************
     * Language versions: German, Italian, English, French, Russian, Polish, Spanish, Romanian
     *******************************************************************************************************************************/
    var LANG = {
        //////////////////////////////////////////////
        //            Translation AUTO              //
        //////////////////////////////////////////////
        AUTO: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                //forum: "",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                //dsc: "DIO-Tools offres certains écrans, une boîte de smiley, les options <br>commerciales, des changements à la mise en page et d'autres choses.",
                //act: "Activation/Désactivation des fonctions:",
                //prv: "Aperçu des fonctions séparées:",

                //version_old: "La version n'est pas à jour",
                //version_new: "La version est à jour",
                //version_dev: "Version développeur",

                //version_update: "Mettre à jour",
                //Donate: "Faire un don",

                //forum: "",
                //Update: "Mise à jour " + dio_version,
                //Feature: "Nouvelle fonctionnalité",
                //Feature2: "Nouvelle version",
                //Learn_more: "En savoir plus",

                cat_units: uw.DM.getl10n("context_menu").titles.units_info, //"Unités"
                //cat_icons: "Icônes de la ville",
                cat_forum: uw.DM.getl10n("layout").main_menu.items.forum, //"Forum"
                cat_trade: uw.DM.getl10n("layout").premium_button.premium_menu.trade_overview, //"Commerce"
                //cat_wonders: "Merveille",
                //cat_layout: "Disposition",
                cat_other: uw.DM.getl10n("report").inbox.filter_types.misc, //"Divers"
                cat_Premium: uw.DM.getl10n("premium").common.window_title, //"Premium"
                //cat_Quack: "Quack",
            },
            Options: {
                //bir: ["Compteur de birèmes ", "Totalise l'ensemble des birèmes présentent en villes et les résume. (Remplace la mini carte dans le cadran)"],
                //ava: ["L'aperçu des unites", "Indique les unités de toutes les villes."],
                //ava2: ["Numéro de Mer", "Extension unité"], //uw.DM.getl10n("COMMON").ocean_number_tooltip
                //sml: ["Smileys", "Rajoutes une boite de smilies à la boite de bbcode"],
                //str: ["Force unitaire", "Ajoutes des tableaux de force unitaire dans les différentes armes"],
                //trd: [ "Commerce",				"Ajout d'une option par pourcentage, par troupes pour le commerce, ainsi qu'un affichage des limites pour les festivals" ],
                //tra: ["Capacité de transport", "Affiche la capacité de transport occupée et disponible dans le menu des l'unités"], //uw.DM.getl10n("barracks").tooltips.ship_transport.title
                //per: ["Commerce de pourcentage", "Prolonge la fenêtre du commerce par un commerce de pourcentage"],
                //rec: ["Commerce de recrutement", "Prolonge la fenêtre du commerce par un commerce de recrutement"],
                //cnt: ["Compteur conquête", "Comptabilise le nombre d'attaque et de soutien dans la fenêtre de conquête"],
                //way: ["Vitesse des troupes ", "Rajoutes le temps de trajet avec le bonus accélération"],
                //sim: ["Simulateur", "Modification de la présentation du simulateur et affichage permanent des options premium"],
                //act: ["Boîte d'activité", "Présentation améliorée du commerce et du recrutement (mémoire de position)"],
                //pop: ["Popup de faveur", 'Change la popup de faveur'],
                //tsk: ["Barre de tâches", "La barre de tâches augmente"],
                //rew: ["Récompenses journalières", "Minimise la fenêtre de récompense quotidienne au démarrage"], //uw.DM.getl10n("grepolis_score").categories.daily_awards
                //bbc: ["Formulaire de défense", "Ajout d'un bouton dans la barre BBCode pour un formulaire de défense automatique"],
                //com: ["Comparaison des unités", "Ajoutes des tableaux de comparaison des unités"],
                //tic: ["Icônes des villes", "Chaque ville reçoit une icône pour le type de ville (détection automatique)", "Des icônes supplémentaires sont disponibles pour la sélection manuelle"],
                //til: ["Liste de ville", "Ajoute les icônes de la ville à la liste de la ville"],
                //tim: ["Carte", "Définit les icônes de la ville sur la carte stratégique"],
                //tiw: ["Icônes Popup", ""],
                //wwc: ["Merveille du monde", "Compteur de ressource et calcul d'envoi + bouton précédent et suivant sur les merveilles finies"],
                //wwr: ["Classement", "Nouveau classement mondial des merveilles"],
                //wwi: ["Icônes", 'Ajoute des icônes de merveilles du monde sur la carte stratégique'],
                //con: ["Menu contextuel", 'Échangée "Sélectionner ville" et "Aperçu de la ville" dans le menu contextuel'],
                //sen: ["Unités envoyées", 'Affiche unités envoyées dans la fenêtre attaque/support'],
                //tov: ["Aperçu de ville", "Remplace la nouvelle aperçu de la ville avec l'ancien style de fenêtre"],
                //scr: ["Molette de la souris", 'Avec la molette de la souris vous pouvez changer les vues'],
                //Scr: ["Barre de défilement", 'Modifier le style de la barre de défilement (Non disponible sur Firefox)'],
                //tow: ["BBcode de la ville", "Ajoute le bbcode de la ville à la tab de la ville. Fonction Quack"],
                //Fdm: ["Sélectionner et supprimer plusieur messages", "Vous pouvez supprimer plus de un commentaire. Fonction Quack"],
                //Sel: ["Rajouter (Sans surcharge / Effacer)", "Amélioration de nouveaux outils sur la fenêtre d'attaque et de support. Fonction Quack"],
                //Cul: ["Aperçu de culture (Administrateur)", "Ajouter un compteur pour les fêtes dans la vue de la culture. Fonction Quack"],
                //Hot: ["Raccourcis clavier pour Windows", "Ça change votre vie"],
                //Isl: ["Visualisation de l'île", "Agrandir la hauteur de la liste des villes et des villages"],
                //Ish: ["L'aperçu des villages de paysans (Capitaine)", "Masquer automatiquement la ville. Fonction Quack"],
                //Hio: ["Aperçu des grottes (Administrateur)", "Permettre le tri des villes. Fonction Quack"],
                //Hid: ["Grotte", "Entrer l'argent au-dessus de 15.000 automatiquement dans le champ de saisie. Fonction Quack"], //uw.DM.getl10n("layout").premium_button.premium_menu.hides_overview
                //Tol: ["Liste des villes en BB-Code", "Copier & colle. Fonction Quack"],
                //Cib: ["Bouton vue sur la ville", "Ajouter un bouton pour ouvrir la vue sur la ville au menu de côté sur Grepolis. Fonction Quack"],
                //Ciw: ["Vue de la ville", "Afficher la ville dans une fenêtre. Fonction Quack"],
                //Tti: ["Commerce de ressources pour les festival", "Cliquer dessus et il ne s'échange que vers un festival. Fonction Quack"],
                //Mse: ["BB-Code messages", "Convertir les message en BB-Code. Fonction Quack"],
                //Rep: ["Rapports", "Rajout d'un filtre de couleur. Fonction Quack"], //uw.DM.getl10n("bbcodes").report.name
                //BBt: ["Bouton BBcode Infos joueur", "Ajout d'un bouton BBcode (joueur et alliance)"],
                //Rtt: ["Suppression des info-bulles de l'unité", ""],
                //Cup: ["Avancement de la culture (Administrateur)", "Modification de la présentation de la barre de progression et ajout d'une barre de progression pour les cultures. Fonction d'Akiway"],
                //Cuo: ["Points de Culture (Administrateur)", "Ajoutez un compteur pour les points de culture. Fonction Quack"],
                //Rct: ["Commerce -> Compteur de ressources (Administrateur)", "Un compteur de toutes les ressources de votre ville"],
                //FLASK: ["Non compatible à activer dans les paramètres de FLASK-TOOLS", ""],
                //Mole: ["Non compatible à activer dans les paramètres de Mole Hole", ""],

                //err: ["Envoyer des rapports de bogues automatiquement", "Si vous activez cette option, vous pouvez aider à identifier les bugs."],
            },
            movement: {
                //off: 'Attaque entrante',
                offs: uw.DM.getl10n("layout").toolbar_activities.incomming_attacks, //'Attaques entrantes'
                //def: 'Soutien entrant', //uw.DM.getl10n("context_menu").titles.support + ...
                //defs: 'Soutiens entrants',
            },
            Town_icons: {
                //LandOff: "Off terrestre",
                //LandDef: "Déf terrestre",
                //NavyOff: "Off naval",
                //NavyDef: "Déf naval",
                //FlyOff: "Unités Mythiques Off",
                //FlyDef: "Unités Mythiques Def",
                //Out: "À l'extérieur",
                //Emp: "Vide",
            },
            Color: {
                //Blue: 'Bleu',
                //Red: 'Rouge',
                //Green: 'Vert',
                //Pink: 'Rose',
                //White: "Blanc",
            },
            labels: {
                //uni: "Présentation des unités",
                //total: "Total",
                available: uw.DM.getl10n("hercules2014", "available"), //"Disponible"
                //outer: "Extérieur",
                con: uw.DM.getl10n("context_menu").titles.select_town, //"Sélectionner"
                sup: uw.DM.getl10n("context_menu").titles.support, //"Soutien"
                her: uw.DM.getl10n("heroes").collection.heroes, //"Héros"
                /// Smileys
                //std: "Standard",
                //gre: "Grepo",
                //nat: "Nature",
                //ppl: "Gens",
                //Par: "Fête",
                //oth: "Autres",
                //hal: "Halloween",
                //xma: "Noël",
                //eas: "Pâques",
                //lov: "Amour",
                /// Defense form
                //ttl: "Aperçu: Défense de ville",
                //inf: "Renseignements sur la ville:",
                //dev: "Différence",
                //det: "Unités terrestres détaillées",
                //prm: "Bonus premium",
                //sil: "Remplissage de la grotte",
                //mov: "Mouvements de troupes:",
                /// WW
                //leg: "Participation",
                //stg: "Niveau",
                //tot: "Total",
                /// Simulator
                //str: "Force unitaire",
                //los: "Pertes",
                //mod: "sans influence de modificateur",
                /// Comparison box
                //dsc: "Comparaison des unités",
                //hck: "Contond.",
                //prc: "Blanche",
                //dst: "Jet",
                //sea: "Navale",
                att: uw.DM.getl10n("context_menu", "titles").attack, //"Attaque"
                def: uw.DM.getl10n("place").tabs[0], //"Défense"
                //spd: "Vitesse",
                //bty: "Butin",
                //cap: "Capacité de transport",
                //res: "Coût de construction",
                //fav: "Faveur",
                //tim: "Temps de construction (s)",
                /// Trade
                //rat: "Ratio des ressources d'un type d'unité",
                //shr: "Part de la capacité de stockage de la ville cible",
                //per: "Commerce de pourcentage",
                /// Sent units box
                //lab: "Envoyée",
                //rec: "Ressources",
                //improved_movement: "Mouvement des troupes amélioré",
                //Tran: "Traductions",
                //donat: "Contribution (Dons)",
                //Happy: "Bonne année!",
                //Merry: "Ho! Ho! Ho! Joyeux Noël!",
                //tow: "BBCode ville",
                //ingame_name: ["N'hésitez pas à me contacter si vous préférez être appeler par votre pseudo.", "Comme il y a beaucoup à faire, et que cela peut demander beaucoup de temps, je suis toujours très reconnaissant pour tout type d'aide. De ce fait, j'aimerai remercier tous ceux qui sont offert de l'aide sur ce projet, que ce soit par des donations, en partageant des connaissances, des conseils créatifs, en rapportant des problèmes, ou simplement par des messages d'encouragement."],
            },
            tutoriel: {
                //tuto: "Informations utiles",
                //reme: ["", ""],

                //Trou: ["", ""],
                //util: ["", ""]
            },
            Quack: {
                /// delete multiple forum
                //delete_mul: "Supprimer plusieurs messages",
                //delete_sure: "Voulez vous réellement effacer ces messages?",
                //no_selection: "Aucun message sélectionnés",
                //mark_All: "Tout marquer",
                ///select unit shelper
                //no_overload: 'Sans surcharge',
                delete: uw.DM.getl10n("market").delete_all_market_offers, //"Effacer"
                ///culture Overview
                //cityfestivals: 'Festivals',
                //olympicgames: 'Jeux Olympiques',
                //triumph: 'Marche triomphales',
                //theater: 'Pièces de théâtre'
            },
            hotkeys: {
                //hotkeys: 'Raccourci',
                //Senate: 'Sénat',
                //city_select: 'Sélection ville',
                //last_city: 'Ville précédente',
                //next_city: 'Ville suivante',
                //jump_city: 'Attendre la ville actuelle',
                //administrator: 'Administrateur',
                //captain: 'Capitaine',
                //trade_ov: 'Aperçu du commerce',
                //command_ov: 'Aperçu des ordres',
                //recruitment_ov: 'Aperçu du recrutement',
                //troop_ov: 'Aperçu des troupes',
                //troops_outside: 'Troupes en dehors',
                //building_ov: 'Aperçu des bâtiments',
                //culture_ov: 'Aperçu culturel',
                //gods_ov: 'Aperçu des divinités',
                //cave_ov: 'Aperçu des grottes',
                //city_groups_ov: 'Aperçu des groupes de villes',
                //city_list: 'Liste des villes',
                //attack_planner: 'Planificateur',
                //farming_villages: 'Villages de paysans',
                //menu: 'Menu',
                city_view: uw.DM.getl10n("town_index").window_title, //'Vue de la ville'
                messages: uw.DM.getl10n("layout").main_menu.items.messages, //'Messages'
                reports: uw.DM.getl10n("layout").main_menu.items.reports, //'Rapports'
                alliance: uw.DM.getl10n("layout").main_menu.items.alliance, //'Alliance'
                alliance_forum: uw.DM.getl10n("layout").main_menu.items.allianceforum, //'Forum d\'alliance'
                settings: uw.DM.getl10n("layout").config_buttons.settings, //'Réglages'
                profile: uw.DM.getl10n("layout").main_menu.items.profile, //'Profil'
                //ranking: 'Classement',
                //notes: 'Notes',
                //chat: 'Chat',
                //council: 'Concile des héros'
            },
            messages: {
                ghosttown: uw.DM.getl10n("common").ghost_town, //'Ville fantôme'
                //no_cities: 'Aucune ville sur cette île',
                //all: 'Tous',
                //export: 'Convertir le message en BB-Code',
                //Tol: 'Copier & colle (Fonction Quack)',
                //copy: 'Copier',
                //bbmessages: 'BB-Code messages',
                //copybb: 'Le BBCode a été copié',
                //écrit: 'a écrit ce qui suit :',
            },
            caves: {
                //stored_silver: 'Capacité de stockage des pièces d\'argent',
                //silver_to_store: "Pièces d'argent stockables",
                //name: 'Nom',
                wood: uw.DM.getl10n("barracks").cost_details.wood, //'Bois'
                stone: uw.DM.getl10n("barracks").cost_details.stone, //'Pierre'
                silver: uw.DM.getl10n("barracks").cost_details.iron, //'Pièces d\'argent'
                search_for: uw.DM.getl10n("place").simulator.configuration.technologies //'Rechercher'
            },
            grepo_mainmenu: {
                city_view: uw.DM.getl10n("town_index").window_title, //'Vue de la ville'
                //island_view: "Vue île",
            },
            transport_calc: {
                //recruits: 'Nombre d\'unités dans la queue de recrutement',
                //slowtrans: 'Nombre de transporteurs lents',
                //fasttrans: 'Nombre de transporteurs rapides',
                //Lack: "Manque",
                //Still: "Encore",
                //pop: "de population disponible. Pour les",
                //Optipop: "Population optimale pour les",
                //army: "Tu n'as pas d'armée.",
            },
            reports: {
                //choose_folder: 'Choisissez un dossier',
                //enacted: 'lancé',
                //conquered: 'conquis',
                //spying: 'espionne',
                //spy: 'Espion',
                support: uw.DM.getl10n("context_menu").titles.support, //'soutien'
                //support2: 'ne peut pas soutenir',
                //supporting: 'stationnées',
                attacking: uw.DM.getl10n("context_menu", "titles").attack, //'attaque'
                //farming_village: 'village agricole',
                //gold: 'Vous avez reçu',
                //Quests: 'a expiré',
                //Reservations: 'Votre réservation pour',
            },
            translations: {
                //info: 'Info',
                //trans: 'Traduction pour la langue',
                //translations: 'Traductions',
                //trans_sure: 'Etes vous sur que votre traduction est prête à être générer ?',
                //trans_success: 'La traduction a été envoyée avec succès',
                //trans_fail: 'La traduction ne peut pas être envoyée',
                //trans_infotext1: 'Traduction disponible',
                //trans_infotext2: 'Pour modifier ou créer une nouvelle langue, choisissez la langue dans le menu déroulant',
                //trans_infotext3: 'Quand du texte contient des balises HTML (tout ce qui est entouré par des <> ) je vous demande de les laisser au même endroit où vous les avez trouvé',
                //trans_infotext4: 'Quand vous avez fini de traduire appuyer sur',
                //trans_infotext5: 'Afin de pouvoir vous ajouter aux crédits, votre pseudo sera générée',
                //trans_infotext6: 'Copier le message généré, et coller le dans un commentaire',
                //please_note: 'Notez',
                //credits: 'Credits',
                //no_translation: 'Traduction non trouvée',
                //choose_lang: 'Sélectionner la langue',
                //add_lang: 'Ajouter une langue',
                //language: 'Langue',
                //enter_lang_name: 'Entrer un nom de langue',
                //send: 'Générer message',
                //name: 'Nom',
            },
            buttons: {
                sav: uw.DM.getl10n("notes").btn_save/*"sauvegarder"*/, /*ins: "Insérer",*/ res: uw.DM.getl10n("academy").tabs[1]/*"Réinitialiser"*/,
            }
        },
        //////////////////////////////////////////////
        //      German Translation by Diony         //
        //////////////////////////////////////////////
        de: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://de.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.36671/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools bietet unter anderem einige Anzeigen, eine Smileyauswahlbox,<br>Handelsoptionen und einige Veränderungen des Layouts.",
                act: "Funktionen der Toolsammlung aktivieren/deaktivieren:",
                prv: "Vorschau einzelner Funktionen:",

                version_old: "DIO-Tools-Version ist nicht aktuell",
                version_new: "DIO-Tools-Version ist aktuell",
                version_dev: "DIO-Tools-Entwicklerversion",

                version_update: "Aktualisieren",
                Donate: "Spenden",

                //forum: "",
                Update: "Aktualisieren " + dio_version,
                Feature: "Neue Funktion",
                Feature2: "Neue Version",
                Learn_more: "Mehr erfahren",

                cat_units: "Einheiten",
                cat_icons: "Stadticons",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "Weltwunder",
                cat_layout: "Layout",
                cat_other: "Sonstiges",
                cat_Premium: "Premium",
                cat_Quack: "Quack",

                install: "installieren",
                reminder: "später erinnern",
                Available: "Neue Version verfügbar",
                reqreload: "Aktualisierung erforderlich",
                reload: "Aktualisierung",
            },
            Options: {
                //bir: ["Biremenzähler", "Zählt die jeweiligen Biremen einer Stadt und summiert diese.<br><br>Anzeige im Minimap-Bullauge oben links"],
                ava: ["Einheitenübersicht", "Zeigt die Einheiten aller Städte an"],
                ava2: ["Nummer des Meeres", "Erweiterungseinheit"],
                sml: ["Smileys", "Erweitert die BBCode-Leiste um eine Smileybox"],
                str: ["Einheitenstärke", "Fügt mehrere Einheitenstärketabellen in verschiedenen Bereichen hinzu"],
                tra: ["Transportkapazität", "Zeigt die belegte und verfügbare Transportkapazität im Einheitenmenu an"],
                per: ["Prozentualer Handel", "Erweitert das Handelsfenster um einen Prozentualen Handel"],
                rec: ["Rekrutierungshandel", "Erweitert das Handelsfenster um einen Rekrutierungshandel"],
                cnt: ["EO-Zähler", "Zählt die ATT/UT-Anzahl im EO-Fenster"],
                way: ["Laufzeit", "Zeigt im ATT/UT-Fenster die Laufzeit bei Verbesserter Truppenbewegung an"],
                sim: ["Simulator", "Anpassung des Simulatorlayouts & permanente Anzeige der Erweiterten Modifikatorbox"],
                act: ["Aktivitätsboxen", "Verbesserte Anzeige der Handels- und Rekrutierung (Positionsspeicherung)"],
                pop: ["Gunst-Popup", 'Ändert das Aussehen des Gunst-Popups'],
                tsk: ["Taskleiste", 'Vergrößert die Taskleiste'],
                rew: ["Tägliche Belohnung", 'Minimiert das "Tägliche Belohnung"-Fenster beim Start'],
                bbc: ["DEF-Formular", "Erweitert die BBCode-Leiste um ein automatisches DEF-Formular"],
                com: ["Einheitenvergleich", "Fügt Einheitenvergleichstabellen hinzu"],
                tic: ["Stadticons", "Jede Stadt erhält ein Icon für den Stadttyp (Automatische Erkennung)", "Zusätzliche Icons stehen bei der manuellen Auswahl zur Verfügung"],
                til: ["Stadtliste", "Fügt die Stadticons zur Stadtliste hinzu"],
                tim: ["Karte", "Setzt die Stadticons auf die strategische Karte"],
                tiw: ["Icons Popup", ""],
                wwc: ["Anteil", "Anteilsrechner & Rohstoffzähler + Vor- & Zurück-Buttons bei fertiggestellten WW's (momentan nicht deaktivierbar!)"],
                wwr: ["Rangliste", "Überarbeitete Weltwunderrangliste"],
                wwi: ["Icons", 'Fügt Weltwundericons auf der strategischen Karte hinzu'],
                con: ["Kontextmenu", 'Vertauscht "Stadt selektieren" und "Stadtübersicht" im Kontextmenu'],
                sen: ["Abgeschickte Einheiten", 'Zeigt im Angriffs-/Unterstützungsfenster abgeschickte Einheiten an'],
                tov: ["Stadtübersicht", 'Ersetzt die neue Stadtansicht mit der alten Fensteransicht'],
                scr: ["Mausrad-Zoom", 'Man kann mit dem Mausrad die 3 Ansichten wechseln'],
                Scr: ["Scrollleiste", 'Ändern Sie den Stil der Bildlaufleiste'],
                tow: ["Stadtbbcode", "Fügt den Stadt-BBCode zur Registerkarte Stadt hinzu"],
                Fdm: ["Mehrere Nachrichten auswählen und löschen", "Sie können mehr als eine Nachricht löschen. Quack funktion"],
                Sel: ["Hinzufügen (Kein überladen / Löschen)", "Verbesserung neuer Tools im Angriffs- und Unterstützungsfenster. Quack funktion"],
                Cul: ["Kulturübersicht (Verwalter)", "Fügen Sie in der Kulturansicht einen Zähler für die Feiertage hinzu. Quack funktion"],
                Hot: ["Tastaturkürzel für Windows", "Es verändert dein Leben"],
                Isl: ["Visualisierung der Insel", "Erhöhen Sie die Höhe der Liste der Städte und Dörfer"],
                Ish: ["Überblick über Bauerndörfer (Kapitän)", "Die Stadt automatisch verstecken. Quack funktion"],
                Hio: ["Höhlen Übersicht (Verwalter)", "Sortierung der Städte ermöglichen. Quack funktion"],
                Hid: ["Höhle", "Silber über 15000 automatisch in das Eingabefeld eintragen. Quack funktion"],
                Tol: ["Liste der Städte in BB-Code ", "Kopieren & Einfügen. Quack function"],
                Cib: ["Schaltfläche Stadtansicht", "Einen Button für die Stadtansicht dem Seitenmenü von Grepolis hinzufügen. Quack funktion"],
                Ciw: ["Stadtansicht", "Stadtansicht in einem Fenster anzeigen. Quack funktion"],
                Tti: ["Ressourcen für Festivals tauschen", "Klicken Sie darauf und es wird nur gegen ein Festival ausgetauscht. Quack funktion"],
                Mse: ["BB-Code-Nachrichten", "Nachrichten in BB-Code konvertieren. Quack Funktion"],
                Rep: ["Berichte", "Hinzufügen eines Farbfilters. Quack funktion"],
                BBt: ["BBcode-Schaltfläche Spielerinfo", "Hinzufügen einer BBcode-Schaltfläche (Spieler und Allianz)"],
                Rtt: ["Entfernen der Tooltips des Geräts", ""],
                Cup: ["Advancement of Culture (Administrator)", "Die Darstellung des Fortschrittsbalkens wurde geändert und ein Fortschrittsbalken für Ernten hinzugefügt. Funktion von Akiway"],
                Cuo: ["Kulturpunkte (Administrator)", "Fügen Sie einen Zähler für die Kulturpunkte hinzu. Quack funktion"],
                Rct: ["Handel -> Ressourcenzähler (Administrator)", "Eine Zählung aller Ressourcen in deiner Stadt"],
                FLASK: ["Nicht kompatibel zur Aktivierung in den Parametern von FLASK-TOOLS", ""],
                Mole: ["Nicht kompatibel zur Aktivierung in den Parametern von Mole Hole", ""],

                err: ["Automatische Fehlerberichte senden", "Wenn du diese Option aktivierst, kannst du dabei helfen Fehler zu identifizieren."],
                her: ["Thrakische Eroberung", "Verkleinerung der Karte der Thrakischen Eroberung."],
            },
            Town_icons: {
                LandOff: "Landeinheit Angriff",
                LandDef: "Landeinheit Verteidigung",
                NavyOff: "Seeeinheit Angriff",
                NavyDef: "Seeeinheit Verteidigung",
                FlyOff: "Mythischen Angriffseinheiten",
                FlyDef: "Mythischen Verteidigungseinheiten",
                Out: "Draußen",
                Emp: "Leer",
            },
            Color: {
                Blue: 'Blau',
                Red: 'rot',
                Green: 'Grün',
                Pink: 'Rosa',
                White: "Weiß",
            },
            labels: {
                uni: "Einheitenübersicht",
                total: "Gesamt",
                available: "Verfügbar",
                outer: "Außerhalb",
                con: "Selektierte Stadt",
                /// Smileys
                std: "Standard",
                gre: "Grepo",
                nat: "Natur",
                ppl: "Leute",
                //Par: "",
                oth: "Sonstige",
                //hal: "",
                xma: "Weihnachten",
                eas: "Ostern",
                lov: "Liebe",
                /// Defense form
                ttl: "Übersicht: Stadtverteidigung",
                inf: "Informationen zur Stadt:",
                dev: "Abweichung",
                det: "Detailierte Landeinheiten",
                prm: "Premiumboni",
                sil: "Silberstand",
                mov: "Truppenbewegungen:",
                /// WW
                leg: "WW-Anteil",
                stg: "Stufe",
                tot: "Gesamt",
                /// Simulator
                str: "Einheitenstärke",
                los: "Verluste",
                mod: "ohne Modifikatoreinfluss",
                /// Comparison box
                dsc: "Einheitenvergleich",
                hck: "Schlag",
                prc: "Stich",
                dst: "Distanz",
                sea: "See",
                att: "Angriff",
                def: "Verteidigung",
                spd: "Geschwindigkeit",
                bty: "Beute (Rohstoffe)",
                cap: "Transportkapazität",
                res: "Baukosten (Rohstoffe)",
                fav: "Gunst",
                tim: "Bauzeit (s)",
                /// Trade
                rat: "Ressourcenverhältnis eines Einheitentyps",
                shr: "Anteil an der Lagerkapazität der Zielstadt",
                per: "Prozentualer Handel",
                /// Sent units box
                lab: "Abgeschickt",
                rec: "Ressourcen",
                improved_movement: "Verbesserte Truppenbewegung",
                donat: "Spenden",
                Tran: "Übersetzungen",
                Happy: "Frohes neues Jahr!",
                Merry: "Ho Ho Ho frohe Weihnachten!",
                tow: "BBCode Stadt",
                ingame_name: ["Wer lieber via ingame Name genannt werden möchte, kann sich gerne bei mir melden", "Da dies mitunter viel Aufwand und Zeit beansprucht, freue ich mich immer sehr über jede Form von Unterstützung. Deshalb ein großes Danke an alle die dieses Projekt schon solange unterstützen - sei es durch eine Spende, Wissen, Kreativität, Bugberichte oder aufmunternde Worte."],
                con: "Einheitenstärke: Gesamteinheitenstärke der Belagerungstruppen",
            },
            tutoriel: {
                tuto: "Nützliche Info",
                reme: ["Mulțumesc tuturor celor care au contribuit dezvoltării DIO-Tools", ""],

                Trou: ["Tutorial Specializări Trupe Grepolis - Tutorialul lui david1327", "Tot ce trebuie să ști despre puterile / slăbiciunile trupelor de pe Grepolis"],
                util: ["Site-uri utilitare pentru Grepolis - Tutorialul lui david1327", "O multitudine de unelte pentru Grepolis: Statisticici, Hărți, Unelte, Scripturi, Forum ... toate sunt listate aici."]
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Löschen Sie mehrere Nachrichten",
                delete_sure: "Ausgewählte Beiträge wirklich löschen?",
                no_selection: "Es sind keine Beiträge markiert",
                mark_All: "Alles markieren",
                //select unit shelper
                no_overload: 'Kein überladen',
                delete: 'Löschen',
                //culture Overview
                cityfestivals: 'Stadtfeste',
                olympicgames: 'Olympische Spiele',
                triumph: 'Triumphzüge',
                theater: 'Theaterspiele'
            },
            hotkeys: {
                hotkeys: 'Hotkeys',
                Senate: 'Senat',
                city_select: 'Stadtauswahl',
                last_city: 'Letzte Stadt',
                next_city: 'Nächste Stadt',
                jump_city: 'Sprung zur aktuellen Stadt',
                administrator: 'Verwalter',
                captain: 'Kapitän',
                trade_ov: 'Handelsübersicht',
                command_ov: 'Befehlsübersicht',
                recruitment_ov: 'Rekrutierungsübersicht',
                troop_ov: 'Truppenübersicht',
                troops_outside: 'Truppen außerhalb',
                building_ov: 'Gebäudeübersicht',
                culture_ov: 'Kulturübersicht',
                gods_ov: 'Götterübersicht',
                cave_ov: 'Höhlenübersicht',
                city_groups_ov: 'Stadtgruppenübersicht',
                city_list: 'Städteliste',
                attack_planner: 'Angriffsplaner',
                farming_villages: 'Bauerndörfer',
                menu: 'Menü',
                city_view: 'Stadtansicht',
                messages: 'Nachrichten',
                reports: 'Berichte',
                alliance: 'Allianz',
                alliance_forum: 'Allianz-Forum',
                settings: 'Einstellungen',
                profile: 'Profil',
                ranking: 'Rangliste',
                notes: 'Notizen',
                //chat: '',
                council: 'Konzil der Helden'
            },
            messages: {
                ghosttown: 'Geisterstadt',
                no_cities: 'Keine Städte auf dieser Insel',
                all: 'Alle',
                export: 'Nachricht als BB-Code für das Forum',
                Tol: 'Kopieren & Einfügen (Quack funktion)',
                copy: 'Kopieren',
                bbmessages: 'BB-Code Nachrichten',
                copybb: 'BBCode wurde kopiert',
                écrit: 'hat folgendes geschrieben:',
            },
            caves: {
                stored_silver: 'Eingelagerte Silbermünzen',
                silver_to_store: 'Lagerbare Silbermünzen',
                name: 'Name',
                wood: 'Holz',
                stone: 'Stein',
                silver: 'Silbermünzen',
                search_for: 'Suchen nach'
            },
            grepo_mainmenu: {
                city_view: 'Stadtansicht',
                island_view: 'Inselansicht'
            },
            transport_calc: {
                recruits: 'Truppen in der Bauschleife',
                slowtrans: "Langsame Transportschiffe zählen",
                fasttrans: "Schnelle Transportschiffe zählen",
                Lack: "Mangel",
                Still: "Immer",
                pop: "verfügbare Bevölkerung. Für die",
                Optipop: "Optimale Bevölkerung für",
                army: "Du hast keine Armee.",
            },
            reports: {
                choose_folder: 'Ordner wählen',
                enacted: 'gewirkt',
                conquered: 'erobert',
                spying: 'spioniert',
                spy: 'Spion',
                support: 'stationierte',
                //support2: '',
                supporting: 'unterstützt',
                attacking: 'greift',
                farming_village: 'Bauerndorf',
                gold: "Du hast erhalten",
                Quests: '',
                Reservations: 'Reservierungen',
            },
            translations: {
                info: 'Info',
                trans: 'Übersetzung für Sprache',
                translations: 'Übersetzungen',
                trans_sure: 'Sind Sie sicher, dass Ihre Übersetzung zur Generierung bereit ist?',
                trans_success: 'Die Übersetzung wurde erfolgreich gesendet',
                trans_fail: 'Die Übersetzung konnte nicht gesendet werden',
                trans_infotext1: 'Übersetzung verfügbar',
                trans_infotext2: 'Um eine neue Sprache zu ändern oder zu erstellen, wählen Sie die Sprache im Dropdown-Menü',
                trans_infotext3: 'Wenn ein Text HTML-Tags enthält (also alles, was in <> Klammern steht), bitte ich Sie, sie dort zu belassen, wo Sie sie gefunden haben',
                trans_infotext4: 'Wenn Sie mit der Übersetzung fertig sind, drücken Sie',
                trans_infotext5: 'Um dich zu den Credits hinzufügen zu können, wird dein Spitzname generiert',
                trans_infotext6: 'Kopiere die generierte Nachricht und füge sie in einen Kommentar ein',
                please_note: 'Bitte beachten',
                credits: 'Credits',
                no_translation: 'Keine Übersetzung gefunden',
                choose_lang: 'Sprache wählen',
                add_lang: 'Neue Sprache hinzufügen',
                language: 'Sprache',
                enter_lang_name: 'Bitte geben Sie einen Sprachnamen ein',
                send: 'Nachricht generieren',
                name: 'Name',
            },
            buttons: {
                sav: "Speichern", ins: "Einfügen", res: "Zurücksetzen"
            }
        },
        //////////////////////////////////////////////
        //      English Translation                 //
        //////////////////////////////////////////////
        en: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                update: "https://www.tuto-de-david1327.com/annuaire/scripts/dio-tools-david1327.html",
                update_direct: "https://www.tuto-de-david1327.com/annuaire/scripts/dio-tools-david1327-js.html",
                ///donate:
                Donate: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7X8R9RK3TWGNN&source=url",
                ///autre
                Update: "https://www.tuto-de-david1327.com/en/annonces/dio-tools-david1327/update-to-version-" + updateversion + ".html",
                contact: "https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/",
                forum: "https://en.forum.grepolis.com/index.php?threads/dio-tools-david1327.62408/",
                link_troupes: "https://www.tuto-de-david1327.com/pages/troupes-grepolis.html",
                link_utile: "https://www.tuto-de-david1327.com/en/pages/info/utility-sites.html",
                ///help
                available_units: "https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/wiki/units-overview.html",
                UnitComparison: "https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/wiki/unit-comparison.html",
                MessageExport: "https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/wiki/bb-code-messages.html",
                Translations: "https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/wiki/translations.html",
            },
            Settings: {
                dsc: "DIO-Tools offers, among other things, some displays, a smiley box,<br>trade options and some changes to the layout.",
                act: "Activate/deactivate features of the toolset:",
                prv: "Preview of several features:",

                version_old: "Version is not up to date",
                version_new: "Version is up to date",
                version_dev: "Developer version",

                version_update: "Update",
                Donate: "Donate",

                forum: "Tuto de david1327",
                Update: "Update " + dio_version,
                Feature: "New Feature",
                Feature2: "New version",
                Learn_more: "Learn more",

                cat_units: "Units",
                cat_icons: "Town icons",
                cat_forum: "Forum",
                cat_trade: "Trade",
                cat_wonders: "World wonder",
                cat_layout: "Layout",
                cat_other: "Miscellaneous",
                cat_Premium: "Premium",
                cat_Quack: "Quack",

                install: "install",
                reminder: "Remind me later",
                Available: "New version Available",
                reqreload: "Refresh required",
                reload: "Refresh",
            },
            Options: {
                //bir: ["Bireme counter", "Counts the biremes of a city and sums these"],
                ava: ["Units overview", "Counts the units of all cities"],
                ava2: ["Ocean number", "Extension unit"],
                sml: ["Smilies", "Extends the bbcode bar by a smiley box"],
                str: ["Unit strength", "Adds unit strength tables in various areas"],
                tra: ["Transport capacity", "Shows the occupied and available transport capacity in the unit menu"],
                per: ["Percentual trade", "Extends the trade window by a percentual trade"],
                rec: ["Recruiting trade", "Extends the trade window by a recruiting trade"],
                cnt: ["Conquests", "Counts the attacks/supports in the conquest window"],
                way: ["Troop speed", "Displays improved troop speed in the attack/support window"],
                sim: ["Simulator", "Adaptation of the simulator layout & permanent display of the extended modifier box"],
                act: ["Activity boxes", "Improved display of trade and recruitment (position memory)"],
                pop: ["Favor popup", "Changes the favor popup"],
                tsk: ["Taskbar", "Increases the taskbar"],
                rew: ["Daily reward", "Minimizes the daily reward window on startup"],
                bbc: ["Defense form", "Extends the bbcode bar by an automatic defense form"],
                com: ["Unit Comparison", "Adds unit comparison tables"],
                tic: ["Town icons", "Each city receives an icon for the town type (automatic detection)", "Additional icons are available for manual selection"],
                tic2: ["Automatic detection", ""],
                til: ["Town list", "Adds the town icons to the town list"],
                tim: ["Map", "Sets the town icons on the strategic map"],
                tiw: ["Icons Popup", ""],
                wwc: ["Calculator", "Share calculation & resources counter + previous & next buttons on finished world wonders (currently not deactivatable!)"],
                wwr: ["Ranking", "Redesigned world wonder rankings"],
                wwi: ["Icons", 'Adds world wonder icons on the strategic map'],
                con: ["Context menu", 'Swaps "Select town" and "City overview" in the context menu'],
                sen: ["Sent units", 'Shows sent units in the attack/support window'],
                tov: ["Town overview", 'Replaces the new town overview with the old window style'],
                scr: ["Mouse wheel", 'You can change the views with the mouse wheel'],
                Scr: ["Scrollbar", 'Change the style of the scrollbar (Not available on firefox)'],
                tow: ["Town bbcode", "Adds the town bbcode to the town tab"],
                Fdm: ["Select and delete several messages", "You can delete more than one messages. Quack function"],
                Sel: ["Add (No overloading / Delete)", "Improvement of new tools on the attack and support window. Quack function"],
                Cul: ["Culture overview (Administrator)", "Add a counter for the party in the culture view. Quack function"],
                Hot: ["Keyboard shortcuts for Windows", "It changes your life"],
                Isl: ["Visualization of the island", "Increase the height of the list of cities and villages"],
                Ish: ["Overview of peasant villages (Captain)", "Automatically hide the city. Quack function"],
                Hio: ["Caves overview (Administrator)", "Allow sorting of cities. Quack function"],
                Hid: ["Cave", "Enter silver above 15000 automatically into the input field. Quack function"],
                Tol: ["List of cities in BB-Code", "Copy & Paste. Quack function"],
                Cib: ["City view button", 'Add a button for opening the city view to the sidemenu of Greplis. Quack function'],
                Ciw: ["City view", "Display the city view in a window. Quack function"],
                Tti: ["Trade resources for festivals", "Click on it and it is only exchanged towards a festival. Quack function"],
                Mse: ["BB-Code messages", "Convert messages to BB-Code. Quack function"],
                Rep: ["Reports", "Adding a color filter. Quack function"],
                BBt: ["BBcode button Player Info", "Addition of a BBcode button (player and alliance)"],
                Rtt: ["Removal of the unit tooltips", ""],
                Cup: ["Advancement of Culture (Administrator)", "Changed the presentation of the progress bar and added a progress bar for crops. Function of Akiway"],
                Cuo: ["Points of Culture (Administrator)", "Add a counter for the Points of Culture. Quack function"],
                Rct: ["Trade -> Resource counter (Administrator)", "A count of all the resources in your city"],
                FLASK: ["Not compatible to activate in the parameters of FLASK-TOOLS", ""],
                Mole: ["Not compatible to activate in the parameters of Mole Hole", ""],
                Cic: ["City view", "City view construction mode is selected by default"],

                err: ["Send bug reports automatically", "If you activate this option, you can help identify bugs."],
                //her: ["Thracian Conquest", "Downsizing of the map of the Thracian conquest."],
            },
            movement: {
                off: 'Incoming attack',
                offs: 'Incoming attacks',
                def: 'Incoming support',
                defs: 'Incoming support',
            },
            Town_icons: {
                LandOff: "Land Offensive",
                LandDef: "Land Defensive",
                NavyOff: "Navy Offensive",
                NavyDef: "Navy Defensive",
                FlyOff: "Fly Offensive",
                FlyDef: "Fly Defensive",
                Out: "Outside",
                Emp: "Empty",
            },
            Color: {
                Blue: 'Blue',
                Red: 'Red',
                Green: 'Green',
                Pink: 'Pink',
                White: "White",
            },
            labels: {
                uni: "Units overview",
                total: "Total",
                available: "Available",
                outer: "Outside",
                con: "Select town",
                /// Smileys
                std: "Standard",
                gre: "Grepo",
                nat: "Nature",
                ppl: "People",
                Par: "Party",
                oth: "Other",
                hal: "Halloween",
                xma: "Xmas",
                eas: "Easter",
                lov: "Love",
                /// Defense form
                ttl: "Overview: Town defense",
                inf: "Town information:",
                dev: "Deviation",
                det: "Detailed land units",
                prm: "Premium bonuses",
                sil: "Silver volume",
                mov: "Troop movements:",
                /// WW
                leg: "WW Share",
                stg: "Stage",
                tot: "Total",
                /// Simulator
                str: "Unit strength",
                los: "Loss",
                mod: "without modificator influence",
                /// Comparison box
                dsc: "Unit comparison",
                hck: "Blunt",
                prc: "Sharp",
                dst: "Distance",
                sea: "Sea",
                att: "Offensive",
                def: "Defensive",
                spd: "Speed",
                bty: "Booty (resources)",
                cap: "Transport capacity",
                res: "Costs (resources)",
                fav: "Favor",
                tim: "Recruiting time (s)",
                /// Trade
                rat: "Resource ratio of an unit type",
                shr: "Share of the storage capacity of the target city",
                per: "Percentage trade",
                /// Sent units box
                lab: "Sent units",
                rec: "Resources",
                improved_movement: "Improved troop movement",
                Tran: "Translations",
                donat: "Donations",
                Happy: "Happy new year!",
                Merry: "Ho Ho Ho, Merry Christmas!",
                tow: "BBCode city",
                loc: "Local",
                ingame_name: ["Do not hesitate to contact me if you prefer to be called by your ingame name", "Since this is a great deal of work that can be very time-consuming I am always very grateful for any type of support. Therefore I would like to thank everyone who has offered support for this project - whether through donations, knowledge, creativity, bug reports or just some encouraging words."],
                raf: "By confirming the page will refresh",
                con: "Unit strength: Total strength of siege troops",
            },
            tutoriel: {
                tuto: "Useful info",
                reme: ["I thank all those who contributed to the development of DIO tools", ""],

                Trou: ["Grepolis Troops Specialization Tutorial - tuto de david1327", "What you need to know about the troupe of grepolis Strengths / weaknesses of the units"],
                util: ["Utility sites for grepolis - Tuto de david1327", "A multitude of tools for Grepolis: Statistics, Maps, Tools, Script, Forum ... they are all listed here."],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Delete multiple messages",
                delete_sure: "Do you really want to delete these posts?",
                no_selection: "No posts selected",
                mark_All: "Mark All",
                //select unit shelper
                no_overload: 'No overloading',
                delete: 'Delete',
                //culture Overview
                cityfestivals: 'City festivals',
                olympicgames: 'Olympic Games',
                triumph: 'Victory processions',
                theater: 'Theater plays'
            },
            hotkeys: {
                hotkeys: 'Hotkeys',
                Senate: 'Senate',
                city_select: 'City selection',
                last_city: 'Last city',
                next_city: 'Next city',
                jump_city: 'Jump to current city',
                administrator: 'Administrator',
                captain: 'Captain',
                trade_ov: 'Trade',
                command_ov: 'Commands',
                recruitment_ov: 'Recruiting',
                troop_ov: 'Troop overview',
                troops_outside: 'Troops outside',
                building_ov: 'Buildings',
                culture_ov: 'Culture',
                gods_ov: 'Gods',
                cave_ov: 'hidesOverview',
                city_groups_ov: 'City groups',
                city_list: 'City list',
                attack_planner: 'Attack planner',
                farming_villages: 'Farming villages',
                menu: 'Menu',
                city_view: 'City view',
                messages: 'Messages',
                reports: 'Reports',
                alliance: 'Alliance',
                alliance_forum: 'Alliance forum',
                settings: 'Settings',
                profile: 'Profile',
                ranking: 'Ranking',
                notes: 'Notes',
                chat: 'Chat',
                council: 'Council of Heroes'
            },
            messages: {
                ghosttown: "Ghost town",
                no_cities: "No cities on this island",
                all: "all",
                export: "Convert message into BB-Code",
                Tol: "Copy & Paste (Quack function)",
                copy: "Copy",
                bbmessages: "BB-Code messages",
                copybb: "BBCode has been copied",
                écrit: "has written the following:",
                cli: "The message was not copied",
            },
            caves: {
                stored_silver: 'Stored silver coins',
                silver_to_store: 'Storable silver coins',
                name: 'Name',
                wood: 'Wood',
                stone: 'Stone',
                silver: 'Silver coins',
                search_for: 'Search for'
            },
            grepo_mainmenu: {
                city_view: "City view",
                island_view: "Island view"
            },
            transport_calc: {
                recruits: "Count units in recruitment queue",
                slowtrans: "Count slow transport ships",
                fasttrans: "Count fast transport ships",
                Lack: "Lack",
                Still: "Still",
                pop: "available population. For the",
                Optipop: "Optimal population for",
                army: "You don't have an army.",
            },
            reports: {
                choose_folder: 'Choose folder',
                enacted: 'enacted',
                conquered: 'conquered',
                spying: 'spying',
                spy: 'Spy',
                support: 'support',
                support2: "can't support", //???
                supporting: 'stationed',
                attacking: 'attacking',
                farming_village: 'farming village',
                gold: 'You have received',
                Quests: 'Quests',
                Reservations: 'Reservations',
            },
            translations: {
                info: 'Info',
                trans: 'Translation for language',
                translations: 'Translations',
                trans_sure: 'Are you sure that your translation is ready to be generated?',
                trans_success: 'The translation has been sent successfully',
                trans_fail: 'The translation could not be sent',
                trans_infotext1: 'Translation available',
                trans_infotext2: 'To modify or create a new language, choose the language in the drop-down menu',
                trans_infotext3: 'When a text contains HTML tags (thus everything which is surrounded by <> brackets) I ask you to keep them where you found them',
                trans_infotext4: 'When you have finished translating press',
                trans_infotext5: 'In order to be able to add you to the credits, your nickname will be generated',
                trans_infotext6: 'Copy the generated message, and paste it in a comment',
                please_note: 'Please note',
                credits: 'Credits',
                no_translation: 'No translation found',
                choose_lang: 'Choose language',
                add_lang: 'Add a new language',
                language: 'Language',
                enter_lang_name: 'Please enter a language name',
                send: 'Generate message',
                name: 'Name',
                add_edit: 'Add / edit',
            },
            buttons: {
                sav: "Save", ins: "Insert", res: "Reset"
            }
        },
        //////////////////////////////////////////////
        //      Italian Translation by amliam       //
        //////////////////////////////////////////////
        it: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://it.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.22111/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools offers, among other things, some displays, a smiley box,<br>trade options and some changes to the layout.",
                act: "Activate/deactivate features of the toolset:",
                prv: "Preview of several features:",

                version_old: "La versione non è aggiornata",
                version_new: "La versione è aggiornata",
                version_dev: "Versione per sviluppatori",

                version_update: "Aggiornare",
                Donate: "Donare",

                //forum: "",
                Update: "Aggiornare " + dio_version,
                Feature: "Nuova caratteristica",
                Feature2: "Nuova versione",
                Learn_more: "Per saperne di più",

                cat_units: "Unità",
                cat_icons: "Icone città",
                cat_forum: "Forum",
                cat_trade: "Commercio",
                cat_wonders: "Mondo meravigliarsi",
                cat_layout: "Disposizione",
                cat_other: "Altro",
                cat_Premium: "Premium",
                cat_Quack: "Quack",

                install: "installa",
                reminder: "Ricordamelo più tardi",
                Available: "Nuova versione disponibile",
                reqreload: "E' necessario aggiornare la pagina",
                reload: "Aggiorna",
            },
            Options: {
                bir: ["Conta biremi", "Conta le biremi di una città e le somma"],
                ava: ["Panoramica delle unità", "Conta le unità di tutte le città"],
                ava2: ["Numero del mare", ""],
                sml: ["Emojy", "Aggiunge una raccolta di emojy ai pulsanti bbcode"],
                str: ["Forza delle untià", "Aggiunge una tabella delle forze delle unità nelle varie aree"],
                tra: ["Capacità di trasporto", "Mostra la capacità di trasporto usata e disponibile nel menù unità"],
                per: ["Commercio percentuale", "Aggiunge alla finestra del commercio la funzione commercio percentuale"],
                rec: ["Commercio di reclutamento", "Aggiunge alla finestra del commercio il valore del reclutamento"],
                cnt: ["Conquista", "Conta gli attacchi/supporti nella finestra della conquista"],
                way: ["Movimento accelerato", "Mostra il movimento accelerato nalla finestra di attacco/supporto"],
                sim: ["Simulatore", "Adatta il layout del simulatore e aggiunge permanenti le modifiche della finestra box"],
                act: ["Box dei movimenti", "Importa sullo schermo una box di commercio e reclutamento (posizione memorizzata)"],
                pop: ["Popup favori", "Cambia il popup dei favori"],
                tsk: ["Taskbar", "Aumenta le dimensioni taskbar"],
                rew: ["Finestra della ricompensa", "Riduce la dimensione della finestra della ricompensa giornaliera all'avvio"],
                bbc: ["Form difensivo", "Aggiunge alla barra del bbcode un pulsante per un form difensivo automatico"],
                com: ["Paragone unità", "Aggiunge una tabella per la comparazione delle unità"],
                tic: ["Icone delle città", "Ogni città riceve una icona per il tipo di città(rilevamento automatico)", "Icone addizionali sono disponibili per la selezione automatica"],
                til: ["Lista città", "Aggiunge le icone delle città alla lista città"],
                tim: ["Mappa", "Aggiunge le icone città alla mappa strategica"],
                tiw: ["Popup icona", ""],
                //wwc: ["", ""],
                //wwr: ["", ""],
                //wwi: ["", ""],
                con: ["Menu selezione", 'Scambia il pulsante "Seleziona città" con "Panoramica città" nel menu selezione'],
                sen: ["Unità inviate", 'Mostra le unità inviate nella finestre di attacco/supporto'],
                tov: ["Panoramica città", 'Sostituisce la panoramica città con la vecchia finestra vecchio stile'],
                scr: ["Rotella del mouse", 'Puoi cambiare visuale con la rotella del mouse'],
                Scr: ["Barra di scorrimento", 'Cambia lo stile della barra di scorrimento'],
                tow: ["BBcode città", "Aggiunge il bbcode delle città alla tab della città"],
                Fdm: ["Seleziona ed elimina più messaggi", "Puoi eliminare più di un messaggio. Funzione Quack"],
                Sel: ["Aggiungi (Nessun sovraccarico / Elimina)", "Miglioramento di nuovi strumenti nella finestra di attacco e supporto. Funzione Quack"],
                Cul: ["Panoramica cultura (Amministratore)", "Aggiungi un contatore per la festa nella vista Cultura. Funzione Quack"],
                Hot: ["Scorciatoie da tastiera per Windows", "Ti cambia la vita"],
                Isl: ["Visualizzazione dell'isola", "Aumenta l'altezza dell'elenco delle città e dei villaggi. Funzione Quack"],
                Ish: ["Panoramica dei villaggi contadini (Capitano)", "Nascondi automaticamente la città. Funzione Quack"],
                Hio: ["Panoramica caverna (Amministratore)", "Consentire alle città di essere riordinate. Funzione Quack"],
                Hid: ["Caverna", "Inserisci denaro al di sopra di 15.000 automaticamente nel campo di inserimento. Funzione Quack"],
                Tol: ["Elenco delle città in BB-Code", "Copia e incolla. Funzione Quack"],
                Cib: ["Pulsante vista città", "Aggiungi un pulsante per aprire la vista della città nel menu laterale su Grepolis. Funzione Quack"],
                Ciw: ["Panoramica città", "Mostra la città in una finestra. Funzione Quack"],
                Tti: ["Scambia risorse per festival", "Fai clic su di esso e viene scambiato solo per un festival. Funzione Quack"],
                Mse: ["Messaggi BB-Code", "Converti messaggi in BB-Code. Funzione Quack"],
                Rep: ["Rapporti", "Aggiunta di un filtro colorato. Funzione Quack"],
                BBt: ["Informazioni sul giocatore del pulsante BBcode", "Aggiunta di un pulsante BBcode (giocatore e alleanza)"],
                Rtt: ["Rimozione dei tooltip dell'unità", ""],
                Cup: ["Advancement of Culture (Administrator)", "Cambiata la presentazione della barra di avanzamento e aggiunta una barra di avanzamento per le colture. Funzione di Akiway"],
                Cuo: ["Punti di Cultura (Amministratore)", "Aggiungi un segnalino per i Punti Cultura. Funzione Quack"],
                Rct: ["Commercio -> Contatore risorse (amministratore)", "Un conteggio di tutte le risorse nella tua città"],
                FLASK: ["Non compatibile per attivare nei parametri di FLASK-TOOLS", ""],
                Mole: ["Non compatibile per attivare nei parametri di Mole Hole", ""],

                err: ["Invia automaticamente il report dei bug", "Se attivi questa opzione, puoi aiutare a identificare i bug."],
                her: ["Conquista della Tracia", "Ridimensiona la mappa della conquista della Tracia"],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'Blu',
                Red: 'Rosso',
                Green: 'verde',
                Pink: 'Rosa',
                White: "bianca",
            },
            labels: {
                uni: "Panoramica unità",
                total: "Totali",
                available: "Disponibili",
                outer: "Fuori",
                con: "Seleziona città",
                /// Smileys
                std: "Standard",
                gre: "Grepo",
                nat: "Natura",
                ppl: "Persone",
                //Par: "",
                oth: "Altro",
                hal: "Halloween",
                xma: "Natale",
                eas: "Pasqua",
                lov: "Amore",
                /// Defense form
                ttl: "Panoramica: difesa della città",
                inf: "Informazioni città:",
                dev: "Errore",
                det: "Dettagli unità in città",
                prm: "Bonus premium",
                sil: "Argento in caverna",
                mov: "Movimenti truppi:",
                /// WW
                //leg: "",
                //stg: "",
                //tot: "",
                /// Simulator
                str: "Forza delle unità",
                los: "Perse",
                mod: "Senza influenza dei modificatori",
                /// Comparison box
                dsc: "Paragone unità",
                hck: "Contundente",
                prc: "Arma bianca",
                dst: "Distanza",
                sea: "Mare",
                att: "Offensiva",
                def: "Defensiva",
                spd: "Velocità",
                bty: "Bottino (risorse)",
                cap: "Capacità di trasporto",
                res: "Costi (risorse)",
                fav: "Favori",
                tim: "Tempo di reclutamento",
                /// Trade
                rat: "Quantità di risorse per tipo unità",
                shr: "Quantità della capacità del magazzino della città bersaglio",
                per: "Commercio percentuale",
                /// Sent units box
                lab: "Unità inviate",
                rec: "Risorse",
                improved_movement: "Movimento accelerato unità",
                Tran: "Traduzioni",
                donat: "donare",
                Happy: "Felice anno nuovo!",
                Merry: "Ho Ho Ho, buon Natale!",
                tow: "BBCode città",
                ingame_name: ["Non esitare a contattarmi se preferisci essere chiamato con il tuo nickname", "Dato che si tratta di una grande quantità di lavoro che può richiedere molto tempo, sono sempre molto grato per qualsiasi tipo di supporto. Pertanto, vorrei ringraziare tutti coloro che hanno offerto supporto per questo progetto, sia attraverso donazioni, conoscenze, creatività, segnalazioni di errori o solo alcune parole incoraggianti."]
            },
            tutoriel: {
                tuto: "Informazioni Utili",
                reme: ["Ringrazio tutti coloro che hanno contribuito allo sviluppo di DIO-Tools-david1327", ""],

                Trou: ["Specializzazione delle truppe di Grepolis lezione - tuto de david1327", "What you need to know about the troupe of grepolis Strengths / weaknesses of the units"],
                util: ["Utility sites for grepolis - Tuto de david1327", "A multitude of tools for Grepolis: Statistics, Maps, Tools, Script, Forum ... they are all listed here."]
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Cancella più messaggi",
                delete_sure: "Vuoi davvero cancellare questo post?",
                no_selection: "Nessun post selezionato",
                mark_All: "Segna tutto",
                //select unit shelper
                no_overload: 'Nessun sovraccarico',
                delete: 'Cancella',
                //culture Overview
                cityfestivals: 'Festa cittadina',
                olympicgames: 'Giochi Olimpici',
                triumph: 'Corteo trionfale',
                theater: 'Opere teatrali'
            },
            hotkeys: {
                hotkeys: 'Tasti di scelta rapida',
                Senate: 'Senato',
                city_select: 'Selezione città',
                last_city: 'Precedente città',
                next_city: 'Prossima città',
                jump_city: 'Salta alla città attuale',
                administrator: 'Amministratore',
                captain: 'Capitano',
                trade_ov: 'Panoramica commercio',
                command_ov: 'Panoramica ordini',
                recruitment_ov: 'Panoramica reclutamento',
                troop_ov: 'Panoramica truppe',
                troops_outside: 'Truppe esterne',
                building_ov: 'Panoramica edifici',
                culture_ov: 'Panoramica cultura',
                gods_ov: 'Panoramica dei',
                cave_ov: 'Panoramica caverne',
                city_groups_ov: 'Panoramica gruppi di città',
                city_list: 'Elenco città',
                attack_planner: 'Pianificatore attacchi',
                farming_villages: 'Villaggi rurali',
                menu: "",
                city_view: 'Panoramica città',
                messages: 'Messaggi',
                reports: 'Rapporti',
                alliance: 'Alleanza',
                alliance_forum: 'Forum-Alleanza',
                settings: 'Impostazioni',
                profile: 'Profilo',
                ranking: 'Classifica',
                notes: 'Note',
                //chat: "",
                council: 'Concilio degli eroi'
            },
            messages: {
                ghosttown: 'Città fantasma',
                no_cities: 'Nessuna città su quest\'isola',
                all: 'tutti',
                export: 'Converti messagi in BB-Code',
                Tol: 'Copia e incolla (Quack function)',
                copy: 'copia',
                bbmessages: 'Messaggi BB-Code',
                copybb: 'BBCode è stato copiato',
                écrit: 'ha scritto:',
            },
            caves: {
                stored_silver: 'Monete d\'argento incorporate',
                silver_to_store: 'Monete d\'argento immagazinabili',
                name: 'Nome',
                wood: 'Legname',
                stone: 'Pietre',
                silver: 'Monete d\'argento',
                search_for: 'Cerca per'
            },
            grepo_mainmenu: {
                city_view: 'Panoramica città',
                island_view: 'Visuale isola'
            },
            transport_calc: {
                recruits: 'Calcola le truppe in reclutamento',
                slowtrans: "Conta navi da trasporto lento",
                fasttrans: "Conta navi da trasporto veloce",
                Lack: "Mancanza",
                Still: "Ancora",
                pop: "popolazione disponibile. Per il",
                Optipop: "Popolazione ottimale per",
                army: "Non hai un esercito.",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'Info',
                trans: 'Traduzione per lingua',
                translations: 'Traduzioni',
                trans_sure: 'Sei sicuro che la tua traduzione sia pronta per essere generata?',
                trans_success: 'La traduzione è stata inviata con successo',
                trans_fail: 'Impossibile inviare la traduzione',
                trans_infotext1: 'Traduzione disponibile',
                trans_infotext2: 'Per modificare o creare una nuova lingua, scegli la lingua nel menu a discesa',
                trans_infotext3: 'Quando un testo contiene tag HTML (quindi tutto ciò che è racchiuso tra parentesi <>) ti chiedo di tenerli dove li hai trovati',
                trans_infotext4: 'Quando hai finito di tradurre, premi',
                trans_infotext5: 'Per poterti aggiungere ai crediti, verrà generato il tuo nickname',
                trans_infotext6: 'Copia il messaggio generato e incollalo in un commento',
                please_note: 'Nota',
                credits: 'Crediti',
                no_translation: 'Nessuna traduzione trovata',
                choose_lang: 'Scegli la lingua',
                add_lang: 'Aggiungi una nuova lingua',
                language: 'Lingua',
                enter_lang_name: 'Inserisci un nome per la lingua',
                send: 'Genera messaggio',
                name: 'Nome',
            },
            buttons: {
                sav: "Salva", ins: "Inserisci", res: "Reset"
            }
        },
        //////////////////////////////////////////////
        //      French Translation by eclat49       //
        //////////////////////////////////////////////
        fr: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                Update: "https://www.tuto-de-david1327.com/annonces/dio-tools-david1327/mise-a-jour-" + updateversion + ".html",
                contact: "https://www.tuto-de-david1327.com/pages/dio-tools-david1327/",
                forum: "https://fr.forum.grepolis.com/index.php?threads/dio-tools-david1327.79567/",
                link_troupes: "https://www.tuto-de-david1327.com/pages/troupes-grepolis.html",
                link_utile: "https://www.tuto-de-david1327.com/pages/info/sites-utilitaires.html",
                ///help
                available_units: "https://www.tuto-de-david1327.com/pages/dio-tools-david1327/wiki/apercu-des-unites.html",
                UnitComparison: "https://www.tuto-de-david1327.com/pages/dio-tools-david1327/wiki/comparaison-des-unites.html",
                MessageExport: "https://www.tuto-de-david1327.com/pages/dio-tools-david1327/wiki/bb-code-messages.html",
                Translations: "https://www.tuto-de-david1327.com/pages/dio-tools-david1327/wiki/traductions.html",
            },
            Settings: {
                dsc: "DIO-Tools offres certains écrans, une boîte de smiley, les options <br>commerciales, des changements à la mise en page et d'autres choses.",
                act: "Activation/Désactivation des fonctions:",
                prv: "Aperçu des fonctions séparées:",

                version_old: "La version n'est pas à jour",
                version_new: "La version est à jour",
                version_dev: "Version développeur",

                version_update: "Mettre à jour",
                Donate: "Faire un don",

                //forum: "",
                Update: "Mise à jour " + dio_version,
                Feature: "Nouvelle fonctionnalité",
                Feature2: "Nouvelle version",
                Learn_more: "En savoir plus",

                cat_units: "Unités", //uw.DM.getl10n("context_menu").titles.units_info
                cat_icons: "Icônes de la ville",
                cat_forum: "Forum", //uw.DM.getl10n("layout").main_menu.items.forum
                cat_trade: "Commerce", //uw.DM.getl10n("layout").premium_button.premium_menu.trade_overview
                //cat_wonders: "Merveille",
                cat_layout: "Disposition",
                cat_other: "Divers", //uw.DM.getl10n("report").inbox.filter_types.misc
                cat_Premium: "Premium", //uw.DM.getl10n("premium").common.window_title
                cat_Quack: "Quack",

                install: "installer",
                reminder: "Me rappeler plus tard",
                Available: "Nouvelle version disponible",
                reqreload: "Nécessite le raffraîchissement du site",
                reload: "Raffraîchir",
            },
            Options: {
                bir: ["Compteur de birèmes ", "Totalise l'ensemble des birèmes présentent en villes et les résume. (Remplace la mini carte dans le cadran)"],
                ava: ["L'aperçu des unites", "Indique les unités de toutes les villes."],
                ava2: ["Numéro de Mer", "Extension unité"], //uw.DM.getl10n("COMMON").ocean_number_tooltip
                sml: ["Smileys", "Rajoutes une boite de smilies à la boite de bbcode"],
                str: ["Force unitaire", "Ajoutes des tableaux de force unitaire dans les différentes armes"],
                //trd: [ "Commerce",				"Ajout d'une option par pourcentage, par troupes pour le commerce, ainsi qu'un affichage des limites pour les festivals" ],
                tra: ["Capacité de transport", "Affiche la capacité de transport occupée et disponible dans le menu des l'unités"], //uw.DM.getl10n("barracks").tooltips.ship_transport.title
                per: ["Commerce de pourcentage", "Prolonge la fenêtre du commerce par un commerce de pourcentage"],
                rec: ["Commerce de recrutement", "Prolonge la fenêtre du commerce par un commerce de recrutement"],
                cnt: ["Compteur conquête", "Comptabilise le nombre d'attaque et de soutien dans la fenêtre de conquête"],
                way: ["Vitesse des troupes ", "Rajoutes le temps de trajet avec le bonus accélération"],
                sim: ["Simulateur", "Modification de la présentation du simulateur et affichage permanent des options premium"],
                act: ["Boîte d'activité", "Présentation améliorée du commerce et du recrutement (mémoire de position)"],
                pop: ["Popup de faveur", 'Change la popup de faveur'],
                tsk: ["Barre de tâches", "La barre de tâches augmente"],
                rew: ["Récompenses journalières", "Minimise la fenêtre de récompense quotidienne au démarrage"], //uw.DM.getl10n("grepolis_score").categories.daily_awards
                bbc: ["Formulaire de défense", "Ajout d'un bouton dans la barre BBCode pour un formulaire de défense automatique"],
                com: ["Comparaison des unités", "Ajoutes des tableaux de comparaison des unités"],
                tic: ["Icônes des villes", "Chaque ville reçoit une icône pour le type de ville (détection automatique)", "Des icônes supplémentaires sont disponibles pour la sélection manuelle"],
                tic2: ["Détection automatique", ""],
                til: ["Liste de ville", "Ajoute les icônes de la ville à la liste de la ville"],
                tim: ["Carte", "Définit les icônes de la ville sur la carte stratégique"],
                tiw: ["Icônes Popup", ""],
                wwc: ["Merveille du monde", "Compteur de ressource et calcul d'envoi + bouton précédent et suivant sur les merveilles finies"],
                wwr: ["Classement", "Nouveau classement mondial des merveilles"],
                wwi: ["Icônes", 'Ajoute des icônes de merveilles du monde sur la carte stratégique'],
                con: ["Menu contextuel", 'Échangée "Sélectionner ville" et "Aperçu de la ville" dans le menu contextuel'],
                sen: ["Unités envoyées", 'Affiche unités envoyées dans la fenêtre attaque/support'],
                tov: ["Aperçu de ville", "Remplace la nouvelle aperçu de la ville avec l'ancien style de fenêtre"],
                scr: ["Molette de la souris", 'Avec la molette de la souris vous pouvez changer les vues'],
                Scr: ["Barre de défilement", 'Modifier le style de la barre de défilement (Non disponible sur Firefox)'],
                tow: ["BBcode de la ville", "Ajoute le bbcode de la ville à la tab de la ville. Fonction Quack"],
                Fdm: ["Sélectionner et supprimer plusieur messages", "Vous pouvez supprimer plus de un commentaire. Fonction Quack"],
                Sel: ["Rajouter (Sans surcharge / Effacer)", "Amélioration de nouveaux outils sur la fenêtre d'attaque et de support. Fonction Quack"],
                Cul: ["Aperçu de culture (Administrateur)", "Ajouter un compteur pour les fêtes dans la vue de la culture. Fonction Quack"],
                Hot: ["Raccourcis clavier pour Windows", "Ça change votre vie"],
                Isl: ["Visualisation de l'île", "Agrandir la hauteur de la liste des villes et des villages"],
                Ish: ["L'aperçu des villages de paysans (Capitaine)", "Masquer automatiquement la ville. Fonction Quack"],
                Hio: ["Aperçu des grottes (Administrateur)", "Permettre le tri des villes. Fonction Quack"],
                Hid: ["Grotte", "Entrer l'argent au-dessus de 15.000 automatiquement dans le champ de saisie. Fonction Quack"], //uw.DM.getl10n("layout").premium_button.premium_menu.hides_overview
                Tol: ["Liste des villes en BB-Code", "Copier & colle. Fonction Quack"],
                Cib: ["Bouton vue sur la ville", "Ajouter un bouton pour ouvrir la vue sur la ville au menu de côté sur Grepolis. Fonction Quack"],
                Ciw: ["Vue de la ville", "Afficher la ville dans une fenêtre. Fonction Quack"],
                Tti: ["Commerce de ressources pour les festival", "Cliquer dessus et il ne s'échange que vers un festival. Fonction Quack"],
                Mse: ["BB-Code messages", "Convertir les message en BB-Code. Fonction Quack"],
                Rep: ["Rapports", "Rajout d'un filtre de couleur. Fonction Quack"], //uw.DM.getl10n("bbcodes").report.name
                BBt: ["Bouton BBcode Infos joueur", "Ajout d'un bouton BBcode (joueur et alliance)"],
                Rtt: ["Suppression des info-bulles de l'unité", ""],
                Cup: ["Avancement de la culture (Administrateur)", "Modification de la présentation de la barre de progression et ajout d'une barre de progression pour les cultures. Fonction d'Akiway"],
                Cuo: ["Points de Culture (Administrateur)", "Ajoutez un compteur pour les points de culture. Fonction Quack"],
                Rct: ["Commerce -> Compteur de ressources (Administrateur)", "Un compteur de toutes les ressources de votre ville"],
                FLASK: ["Non compatible à activer dans les paramètres de FLASK-TOOLS", ""],
                Mole: ["Non compatible à activer dans les paramètres de Mole Hole", ""],
                Cic: ["Vue de la ville", "Le mode construction de la vue de la ville est sélectionné par défaut"],

                err: ["Envoyer des rapports de bogues automatiquement", "Si vous activez cette option, vous pouvez aider à identifier les bugs."],
            },
            movement: {
                off: 'Attaque entrante',
                offs: 'Attaques entrantes', //uw.DM.getl10n("layout").toolbar_activities.incomming_attacks
                def: 'Soutien entrant', //uw.DM.getl10n("context_menu").titles.support + ...
                defs: 'Soutiens entrants',
            },
            Town_icons: {
                LandOff: "Off terrestre",
                LandDef: "Déf terrestre",
                NavyOff: "Off naval",
                NavyDef: "Déf naval",
                FlyOff: "Unités Mythiques Off",
                FlyDef: "Unités Mythiques Def",
                Out: "À l'extérieur",
                Emp: "Vide",
            },
            Color: {
                Blue: 'Bleu',
                Red: 'Rouge',
                Green: 'Vert',
                Pink: 'Rose',
                White: "Blanc",
            },
            labels: {
                uni: "Présentation des unités",
                total: "Total",
                available: "Disponible", //uw.DM.getl10n("hercules2014", "available")
                outer: "Extérieur",
                con: "Sélectionner",
                sup: "Soutien",//uw.DM.getl10n("context_menu").titles.support
                her: "Héros", //uw.DM.getl10n("heroes").collection.heroes
                /// Smileys
                std: "Standard",
                gre: "Grepo",
                nat: "Nature",
                ppl: "Gens",
                Par: "Fête",
                oth: "Autres",
                hal: "Halloween",
                xma: "Noël",
                eas: "Pâques",
                lov: "Amour",
                /// Defense form
                ttl: "Aperçu: Défense de ville",
                inf: "Renseignements sur la ville:",
                dev: "Différence",
                det: "Unités terrestres détaillées",
                prm: "Bonus premium",
                sil: "Remplissage de la grotte",
                mov: "Mouvements de troupes:",
                /// WW
                leg: "Participation",
                stg: "Niveau",
                tot: "Total",
                /// Simulator
                str: "Force unitaire",
                los: "Pertes",
                mod: "sans influence de modificateur",
                /// Comparison box
                dsc: "Comparaison des unités",
                hck: "Contond.",
                prc: "Blanche",
                dst: "Jet",
                sea: "Navale",
                att: "Attaque", //uw.DM.getl10n("context_menu", "titles").attack
                def: "Défense", //
                spd: "Vitesse",
                bty: "Butin",
                cap: "Capacité de transport",
                res: "Coût de construction",
                fav: "Faveur",
                tim: "Temps de construction (s)",
                /// Trade
                rat: "Ratio des ressources d'un type d'unité",
                shr: "Part de la capacité de stockage de la ville cible",
                per: "Commerce de pourcentage",
                /// Sent units box
                lab: "Envoyée",
                rec: "Ressources",
                improved_movement: "Mouvement des troupes amélioré",
                Tran: "Traductions",
                donat: "Contribution (Dons)",
                Happy: "Bonne année!",
                Merry: "Ho! Ho! Ho! Joyeux Noël!",
                tow: "BBCode ville",
                ingame_name: ["N'hésitez pas à me contacter si vous préférez être appeler par votre pseudo.", "Comme il y a beaucoup à faire, et que cela peut demander beaucoup de temps, je suis toujours très reconnaissant pour tout type d'aide. De ce fait, j'aimerai remercier tous ceux qui sont offert de l'aide sur ce projet, que ce soit par des donations, en partageant des connaissances, des conseils créatifs, en rapportant des problèmes, ou simplement par des messages d'encouragement."],
                raf: "En confirmant la page sera rafraîchir",
                con: "Force unitaire: Effectif total des troupes de siège",
            },
            tutoriel: {
                tuto: "Informations utiles",
                reme: ["Je remercie tous ceux qui ont contribué au développement de DIO-Tools", ""],

                Trou: ["Tuto spécialisation Troupes Grepolis - tuto de david1327", "Tuto Troupes Grepolis se qui faux savoir sur les troupe de grepolis Point forts/faibles des unités"],
                util: ["Sites utilitaires pour grepolis - Tuto de david1327", "Une multitude d'outils pour Grepolis : Statistiques, Maps, Outils, Script, Forum... ils sont tous répertorié ici."]
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Supprimer plusieurs messages",
                delete_sure: "Voulez vous réellement effacer ces messages?",
                no_selection: "Aucun message sélectionnés",
                mark_All: "Tout marquer",
                //select unit shelper
                no_overload: 'Sans surcharge',
                delete: 'Effacer', //uw.DM.getl10n("market").delete_all_market_offers
                //culture Overview
                cityfestivals: 'Festivals',
                olympicgames: 'Jeux Olympiques',
                triumph: 'Marche triomphales',
                theater: 'Pièces de théâtre'
            },
            hotkeys: {
                hotkeys: 'Raccourci',
                Senate: 'Sénat',
                city_select: 'Sélection ville',
                last_city: 'Ville précédente',
                next_city: 'Ville suivante',
                jump_city: 'Attendre la ville actuelle',
                administrator: 'Administrateur',
                captain: 'Capitaine',
                trade_ov: 'Aperçu du commerce',
                command_ov: 'Aperçu des ordres',
                recruitment_ov: 'Aperçu du recrutement',
                troop_ov: 'Aperçu des troupes',
                troops_outside: 'Troupes en dehors',
                building_ov: 'Aperçu des bâtiments',
                culture_ov: 'Aperçu culturel',
                gods_ov: 'Aperçu des divinités',
                cave_ov: 'Aperçu des grottes',
                city_groups_ov: 'Aperçu des groupes de villes',
                city_list: 'Liste des villes',
                attack_planner: 'Planificateur',
                farming_villages: 'Villages de paysans',
                menu: 'Menu',
                city_view: 'Vue de la ville',
                messages: 'Messages',
                reports: 'Rapports',
                alliance: 'Alliance',
                alliance_forum: 'Forum d\'alliance',
                settings: 'Réglages',
                profile: 'Profil',
                ranking: 'Classement',
                notes: 'Notes',
                chat: 'Chat',
                council: 'Concile des héros'
            },
            messages: {
                ghosttown: 'Ville fantôme',
                no_cities: 'Aucune ville sur cette île',
                all: 'Tous',
                export: 'Convertir le message en BB-Code',
                Tol: 'Copier & colle (Fonction Quack)',
                copy: 'Copier',
                bbmessages: 'BB-Code messages',
                copybb: 'Le BBCode a été copié',
                écrit: 'a écrit ce qui suit :',
                cli: "Le message n'a pas été copié",
            },
            caves: {
                stored_silver: 'Capacité de stockage des pièces d\'argent',
                silver_to_store: "Pièces d'argent stockables",
                name: 'Nom',
                wood: 'Bois', //uw.DM.getl10n("barracks").cost_details.wood
                stone: 'Pierre', //uw.DM.getl10n("barracks").cost_details.stone
                silver: 'Pièces d\'argent', //uw.DM.getl10n("barracks").cost_details.iron
                search_for: 'Rechercher',
            },
            grepo_mainmenu: {
                city_view: 'Vue de la ville',
                island_view: "Vue île",
            },
            transport_calc: {
                recruits: 'Nombre d\'unités dans la queue de recrutement',
                slowtrans: 'Nombre de transporteurs lents',
                fasttrans: 'Nombre de transporteurs rapides',
                Lack: "Manque",
                Still: "Encore",
                pop: "de population disponible. Pour les",
                Optipop: "Population optimale pour les",
                army: "Tu n'as pas d'armée.",
            },
            reports: {
                choose_folder: 'Choisissez un dossier',
                enacted: 'lancé',
                conquered: 'conquis',
                spying: 'espionne',
                spy: 'Espion',
                support: 'soutien', ////uw.DM.getl10n("context_menu").titles.support
                support2: 'ne peut pas soutenir',
                supporting: 'stationnées',
                attacking: 'attaque', //uw.DM.getl10n("context_menu", "titles").attack
                farming_village: 'village agricole',
                gold: 'Vous avez reçu',
                Quests: 'a expiré',
                Reservations: 'Votre réservation pour',
            },
            translations: {
                info: 'Info',
                trans: 'Traduction pour la langue',
                translations: 'Traductions',
                trans_sure: 'Etes vous sur que votre traduction est prête à être générer ?',
                trans_success: 'La traduction a été envoyée avec succès',
                trans_fail: 'La traduction ne peut pas être envoyée',
                trans_infotext1: 'Traduction disponible',
                trans_infotext2: 'Pour modifier ou créer une nouvelle langue, choisissez la langue dans le menu déroulant',
                trans_infotext3: 'Quand du texte contient des balises HTML (tout ce qui est entouré par des <> ) je vous demande de les laisser au même endroit où vous les avez trouvé',
                trans_infotext4: 'Quand vous avez fini de traduire appuyer sur',
                trans_infotext5: 'Afin de pouvoir vous ajouter aux crédits, votre pseudo sera générée',
                trans_infotext6: 'Copier le message généré, et coller le dans un commentaire',
                please_note: 'Notez',
                credits: 'Credits',
                no_translation: 'Traduction non trouvée',
                choose_lang: 'Sélectionner la langue',
                add_lang: 'Ajouter une langue',
                language: 'Langue',
                enter_lang_name: 'Entrer un nom de langue',
                send: 'Générer message',
                name: 'Nom',
                add_edit: 'Ajouter / modifier',
            },
            buttons: {
                sav: "sauvegarder", ins: "Insérer", res: "Réinitialiser" //uw.DM.getl10n("notes").btn_save
            }
        },
        //////////////////////////////////////////////
        //      Russian Translation by MrBobr       //
        //////////////////////////////////////////////
        ru: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                //forum: "",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools изменяет некоторые окна, добавляет новые смайлы, отчёты,<br>улучшеные варианты торговли и другие функции.",
                act: "Включение/выключение функций:",
                prv: "Примеры внесённых изменений:",

                //version_old: "",
                //version_new: "",
                //version_dev: "",

                //version_update: "",
                Donate: "Пожертвовать",

                //forum: "",
                //Update: " "+ dio_version,
                //Feature: "",
                //Feature2: "",
                //Learn_more: "",

                //cat_units: "",
                //cat_icons: "",
                //cat_forum: "",
                //cat_trade: "",
                //cat_wonders: "",
                //cat_layout: "",
                //cat_other: "",
                //cat_Premium: "",
                cat_Quack: "Quack",

                install: "Установить",
                reminder: "Напомнить позже",
                Available: "Доступна новая версия",
                reqreload: "Требуется обновление",
                reload: "Обновление",
            },
            Options: {
                //bir: ["Счётчик бирем", "Показывает число бирем во всех городах"],
                ava: ["Обзор единиц", "Указывает единицы всех городов"],
                ava2: ["", ""],
                sml: ["Смайлы", "Добавляет кнопку для вставки смайлов в сообщения"],
                str: ["Сила отряда", "Добавляет таблицу общей силы отряда в некоторых окнах"],
                //tra: [ "", ""],
                per: ["Процент торговля", ""],
                rec: ["Рекрутинг торговля", ""],
                cnt: ["Завоевания", "Отображение общего числа атак/подкреплений в окне завоевания города"],
                way: ["30% ускорение", "Отображает примерное время движения отряда с 30% бонусом"],
                sim: ["Симулятор", "Изменение интерфейса симулятора, добавление новых функций"],
                act: ["Перемещения", "Показывает окна пересылки ресурсов и вербовка"],
                pop: ["Благосклонность", "Отображение окна с уровнем благосклонности богов"],
                tsk: ["Таскбар", "Увеличение ширины таскбара"],
                rew: ["Eжедневной награды", "Cворачивание окна ежедневной награды при входе в игру"],
                bbc: ["Форма обороны", "Добавляет кнопку для вставки в сообщение отчёта о городе"], // Beschreibung passt nicht ganz
                com: ["Сравнение юнитов", "Добавляет окно сравнения юнитов"],
                tic: ["Типы городов", "Каждый город получает значок для городского типа (автоматическое определение)", "Дополнительные иконки доступны для ручного выбора"], // ?
                til: ["Список город", "Добавляет значки городские в список города"], // ?
                tim: ["Карта", "Устанавливает городские иконки на стратегической карте"], // ?
                tiw: ["Всплывающий значок", ""],
                wwc: ["Чудо света", "Share calculation & resources counter + previous & next buttons on finished world wonders (currently not deactivatable!)"],
                //wwr: ["", ""],
                //wwi: ["", ''],
                //con: ["", ''],
                //sen: ["", ''],
                tov: ["Обзор Город", 'Заменяет новый обзор города с старом стиле окна'],  // ?
                scr: ["Колесо мыши", 'С помощью колеса мыши вы можете изменить взгляды'], // ?
                Scr: ["Полоса прокрутки", 'Изменить стиль полосы прокрутки'],
                tow: ["BBCode город", "Добавляет bbcode города на вкладку города"],
                Fdm: ["Выбрать и удалить несколько сообщений", "Вы можете удалить более одного сообщения. Функция Quack"],
                Sel: ["Добавить (Без перегрузки / Удалить)", "Улучшение новых инструментов в окне атаки и поддержки. Функция Quack"],
                Cul: ["Обзор культуры (Администратор)", "Добавить счетчик для партии в представлении культуры. Функция Quack"],
                Hot: ["Сочетания клавиш для Windows", "Это меняет вашу жизнь"],
                Isl: ["Визуализация острова", "Увеличение высоты списка городов и сел. Функция Quack"],
                Ish: ["Обзор крестьянских деревень (капитан)", "Автоматически скрыть город. Функция Quack"],
                Hio: ["Обзор пещеры (Администратор)", "Разрешить сортировку городов. Функция Quack"],
                Hid: ["Пещера", "Поместить 15000 серебра автоматически в поле ввода. Функция Quack"],
                Tol: ["Список городов в BB-коде", "Копировать и вставить. Функция Quack"],
                Cib: ["Кнопка просмотра города", 'Добавить кнопку для открытия Обзора города в подменю Grepolis. Функция Quack'],
                Ciw: ["Обзор города", "Показать город в окне. Функция Quack"],
                Tti: ["Торговые ресурсы для фестивалей", "Нажмите на него, и он будет обменен только на фестиваль. Функция Quack"],
                Mse: ["Сообщения BB-кода", "Преобразование сообщений в BB-код. Функция Quack"],
                Rep: ["Отчеты", "Добавление цветового фильтра. Функция Quack"],
                BBt: ["Информация об игроке, кнопка BBcode", "Добавление кнопки BBcode (игрок и альянс)"],
                Rtt: ["Удаление всплывающих подсказок для юнита", ""],
                //Cup: ["Advancement of Culture (Administrator)", "Changed the presentation of the progress bar and added a progress bar for crops. Function of Akiway"],
                //Cuo: ["Points de Culture (Administrateur)", "Ajoutez un compteur pour les points de culture. Fonction Quack"],
                //Rct: ["Trade -> Resource counter (Administrator)", "A count of all the resources in your city"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Отправить сообщения об ошибках автоматически", "Если вы включите эту опцию, вы можете помочь идентифицировать ошибки"],
                //her: ["", ""],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'Синий',
                Red: 'Красный',
                Green: 'Зеленый',
                Pink: 'Розовый',
                White: "Белый",
            },
            labels: {
                uni: "Обзор единиц",
                total: "Oбщий",
                available: "доступный",
                outer: "вне",
                con: "выбирать",
                /// Smileys
                //std: "",
                //gre: "",
                //nat: "",
                //ppl: "",
                //Par: "",
                //oth: "",
                //hal: "",
                //xma: "",
                //eas: "",
                //lov: "",
                /// Defense form
                ttl: "Обзор: Отчёт о городе",
                inf: "Информация о войсках и постройках:",
                dev: "Отклонение",
                det: "Детальный отчёт",
                prm: "Премиум-бонусы",
                sil: "Серебро в пещере",
                mov: "Перемещения",
                /// WW
                //leg: "",
                //stg: "",
                //tot: "",
                /// Simulator
                str: "Сила войск",
                los: "Потери",
                mod: "без учёта заклинаний, бонусов, исследований",
                /// Comparison box
                dsc: "Сравнение юнитов",
                hck: "Ударное",
                prc: "Колющее",
                dst: "Дальнего боя",
                sea: "Морские",
                att: "Атака",
                def: "Защита",
                spd: "Скорость",
                bty: "Добыча (ресурсы)",
                cap: "Вместимость транспортов",
                res: "Стоимость (ресурсы)",
                fav: "Благосклонность",
                tim: "Время найма (с)",
                /// Trade
                //rat: "",
                //shr: "",
                //per: "",
                /// Sent units box
                lab: "Отправлено",
                rec: "Ресурсы",
                improved_movement: "Улучшенная перемещение войск",
                Tran: "Переводы",
                donat: "Пожертвования",
                //Happy: "",
                //Merry: "",
                tow: "BBCode город",
                ingame_name: ["Не стесняйтесь обращаться ко мне, если вы предпочитаете, чтобы вас назвали в честь названия игры", "Я благодарен игрокам за советы и идеи, они дают мне силы работать дальше. К сожалению, проект отнимает очень много времени, поэтому я буду рад любой поддержке. Я хочу поблагодарить всех, кто помогал проекту, будь то Пожертвования, советы, отчеты с ошибками или просто добрые слова в мой адрес."]
            },
            tutoriel: {
                tuto: "Полезная информация",
                reme: ["Я благодарю всех, кто внес вклад в разработку DIO-TOOLS-David1327", ""],

                //Trou: ["", ""],
                //util: ["", ""],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Удалить несколько сообщений",
                delete_sure: "Вы действительно хотите удалить эти сообщения?",
                no_selection: "Сообщения не выбраны",
                mark_All: "Пометить все",
                //select unit shelper
                no_overload: 'Нет перезагрузки',
                delete: 'Удалить',
                //culture Overview
                cityfestivals: 'Фестиваль',
                olympicgames: 'Олимпийские игры',
                triumph: 'Шествие',
                theater: 'Представление'
            },
            hotkeys: {
                hotkeys: 'Горячие клавиши',
                Senate: 'Senate',
                city_select: 'Выбор города',
                last_city: 'Последний город',
                next_city: 'Следующий город',
                jump_city: 'Переход к текущему городу',
                administrator: 'Администратор',
                captain: 'Капитан',
                trade_ov: 'Обзор торговли',
                command_ov: 'Обзор приказов',
                recruitment_ov: 'Обзор вербовок',
                troop_ov: 'Обзор войск',
                troops_outside: 'Войска вне города',
                building_ov: 'Обзор зданий',
                culture_ov: 'Обзор культуры',
                gods_ov: 'Обзор богов',
                cave_ov: 'Обзор пещер',
                city_groups_ov: 'Обзор групп городов',
                city_list: 'Список городов',
                attack_planner: 'Планировщик',
                farming_villages: 'Селения земледельцев',
                menu: 'Меню',
                city_view: 'Обзор города',
                messages: 'Сообщения',
                reports: 'Отчеты',
                alliance: 'Союз',
                alliance_forum: 'Форум Союза',
                settings: 'Настройки',
                profile: 'Профиль',
                ranking: 'Рейтинг',
                notes: 'Заметки',
                chat: 'Чат',
                council: 'Совет героев'
            },
            messages: {
                ghosttown: 'Город-призрак',
                no_cities: 'На этом острове нет городов',
                all: 'Все',
                export: 'Конвертировать сообщение в BB-Код',
                Tol: 'Копировать и вставить (Функция Quack)',
                copy: 'копия',
                bbmessages: 'Сообщения BB-Код',
                copybb: 'BB-Код был скопирован',
                écrit: 'написал:',
            },
            caves: {
                stored_silver: 'Встроенные cереб. монеты',
                silver_to_store: "",
                name: 'название',
                wood: 'древесина',
                stone: 'камень',
                silver: 'Сереб. монеты',
                search_for: ""
            },
            grepo_mainmenu: {
                city_view: 'Обзор города',
                island_view: 'Обзор острова'
            },
            transport_calc: {
                recruits: 'Подсчитать юнитов в очереди обучения',
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army : "",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'информация',
                trans: 'Перевод для языка',
                translations: 'Переводы',
                trans_sure: 'Вы уверены, что ваш перевод готов к созданию?',
                trans_success: 'Перевод успешно отправлен',
                trans_fail: 'Перевод не может быть отправлен',
                trans_infotext1: 'Доступен перевод',
                trans_infotext2: 'Чтобы изменить или создать новый язык, выберите язык в раскрывающемся меню',
                trans_infotext3: 'Когда текст содержит теги HTML (то есть все, что заключено в скобки <>), я прошу вас сохранить их там, где вы их нашли.',
                trans_infotext4: 'Когда вы закончите перевод, нажмите',
                trans_infotext5: 'Для того, чтобы иметь возможность добавить вас к кредитам, ваш ник будет сгенерирован',
                trans_infotext6: 'Скопируйте сгенерированное сообщение и вставьте его в комментарий',
                please_note: 'Обратите внимание',
                credits: 'Кредиты',
                no_translation: 'Перевод не найден',
                choose_lang: 'Выбрать язык',
                add_lang: 'Добавить новый язык',
                language: 'Язык',
                enter_lang_name: 'Пожалуйста, введите название языка',
                send: 'Создать сообщение',
                name: 'Имя',
            },
            buttons: {
                sav: "Сохраниить", ins: "Вставка", res: "Сброс"
            }
        },
        //////////////////////////////////////////////
        //       Polish Translation by anpu         //
        //////////////////////////////////////////////
        pl: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://pl.forum.grepolis.com/index.php?threads/dio-tools-david1327.30016/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools oferuje (między innymi) poprawione widoki, nowe uśmieszki,<br>opcje handlu i zmiany w wyglądzie.",
                act: "Włącz/wyłącz funkcje skryptu:",
                prv: "podgląd poszczególnych opcji:",

                version_old: "Wersja nie jest aktualizowana",
                version_new: "Wersja jest zaktualizowana",
                version_dev: "Wersja dla programistów",

                version_update: "aktualizacja",
                Donate: "Podarować",

                //forum: "",
                Update: "Aktualizacja " + dio_version,
                Feature: "Nowa cecha",
                Feature2: "Nowa wersja",
                Learn_more: "Ucz się więcej",

                //cat_units: "",
                //cat_icons: "",
                //cat_forum: "",
                //cat_trade: "",
                //cat_wonders: "",
                //cat_layout: "",
                //cat_other: "",
                //cat_Premium: "",
                cat_Quack: "Quack",

                install: "Zainstaluj",
                reminder: "Przypomnij później",
                Available: "Dostępna nowa wersja",
                reqreload: "Wymagane odświeżenie strony",
                reload: "Odśwież",
            },
            Options: {
                //bir: ["Licznik birem", "Zlicza i sumuje biremy z miast"],
                ava: ["Przegląd jednostek", "Wskazuje jednostki wszystkich miast"], // ?
                //ava2: ["", ""],
                sml: ["Emotki", "Dodaje dodatkowe (zielone) emotikonki"],
                str: ["Siła jednostek", "dodaje tabelki z siłą jednostek w różnych miejscach gry"],
                //tra: [ "", ""],
                per: ["Handel procentowy", ""],
                rec: ["Handel rekrutacyjne", ""],
                cnt: ["Podboje", "Zlicza wsparcia/ataki w oknie podboju (tylko własne podboje)"],
                way: ["Prędkość wojsk", "Wyświetla dodatkowo czas jednostek dla bonusu przyspieszone ruchy wojsk"],
                sim: ["Symulator", "Dostosowanie wyglądu symulatora oraz dodanie szybkich pól wyboru"],
                act: ["Ramki aktywności", "Ulepszony widok rekrutacji i handlu (można umieścić w dowolnym miejscu ekranu. Zapamiętuje położenie.)"],
                pop: ["Łaski", "Zmienia wygląd ramki informacyjnej o ilości produkowanych łask"],
                tsk: ["Pasek skrótów", "Powiększa pasek skrótów"],
                rew: ["Bonusem dziennym", "Minimalizuje okienko z bonusem dziennym przy starcie"],
                bbc: ["Raportów obronnych", "Rozszerza pasek skrótów BBcode o generator raportów obronnych"],
                com: ["Porównianie", "Dodaje tabelki z porównaniem jednostek"],
                tic: ["Ikony miasta", "Każde miasto otrzyma ikonę typu miasta (automatyczne wykrywanie)", "Dodatkowe ikony są dostępne dla ręcznego wyboru"], // ?
                til: ["Lista miasto", "Dodaje ikony miasta do listy miasta"], // ?
                tim: ["Mapa", "Zestawy ikon miasta na mapie strategicznej"], // ?
                tiw: ["Wyskakująca ikona", ""],
                wwc: ["Cuda Świata", "Liczy udział w budowie oraz ilość wysłanych surowców na budowę Cudu Świata oraz dodaje przyciski do szybkiego przełączania między cudami (obecnie nie możliwe do wyłączenia)"],
                //wwr: ["", ""],
                //wwi: [ "World wonder icons",'Adds world wonder icons on the strategic map' ],
                con: ["menu kontekstowe", 'Zamiemia miejcami przycisk "wybierz miasto" z przyciskiem "podgląd miasta" po kliknięciu miasta na mapie'],
                sen: ["Wysłane jednostki", 'Pokaż wysłane jednostki w oknie wysyłania ataków/wsparć'],
                tov: ["Podgląd miasta", 'Zastępuje nowy podgląd miasta starym'],
                scr: ["Zoom", 'Możesz zmienić poziom przybliżenia mapy kółkiem myszy'],
                Scr: ["Pasek przewijania", 'Zmień styl paska przewijania'],
                tow: ["Miasto BBCode", "Dodaje bbcode miasta do karty miasta"],
                Fdm: ["Wybierz i usuń kilka wiadomości", "Możesz usunąć więcej niż jedną wiadomość. Funkcja Quack"],
                Sel: ["Dodaj (Bez przeciążania / Usuń)", "Udoskonalenie nowych narzędzi w oknie ataku i wsparcia. Funkcja Quack"],
                Cul: ["Przegląd kultury (Zarządca)", "Dodaj licznik imprezy w widoku kultury. Funkcja Quack"],
                Hot: ["Skróty klawiaturowe dla systemu Windows", "Zmienia twoje życie"],
                Isl: ["Wizualizacja wyspy", "Zwiększ wysokość listy miast i wsi. Funkcja Quack"],
                Ish: ["Przegląd wiosek chłopskich (Kapitan)", "Automatycznie ukryj miasto. Funkcja Quack"],
                Hio: ["Podgląd jaskiń (Zarządca)", "Możliwość sortowania miast. Funkcja Quack"],
                Hid: ["Jaskinia", "Wstaw automatycznie w pole wpisywania srebro powyżej 15000. Funkcja Quack"],
                Tol: ["Lista miast w BB-коде", "Kopiuj i wklej. Funkcja Quack"],
                Cib: ["Przycisk widoku miasta", 'Dodaj guzik "Podgląd Miasta" do menu. Funkcja Quack'],
                Ciw: ["Podgląd miasta", "Wyświetl podgląd miasta w oknie. Funkcja Quack"],
                Tti: ["Wymieniaj zasoby na festiwale", "Kliknij na niego, a zostanie on wymieniony tylko na festiwal. Funkcja Quack"],
                Mse: ["Wiadomości BB-Code", "Konwertuj wiadomości na BB-Code. Funkcja Quack"],
                Rep: ["Raporty", "Dodawanie filtra kolorów. Funkcja Quack"],
                BBt: ["BBcode button Informacje o graczu", "Dodanie przycisku BBcode (gracz i sojusz)"],
                Rtt: ["Usunięcie podpowiedzi jednostki", ""],
                Cup: ["Postęp Kultury (Administrator)", "Zmieniono prezentację paska postępu i dodano pasek postępu dla upraw. Funkcja Akiway"],
                Cuo: ["Punkty Kultury (Administrator)", "Dodaj licznik dla Punktów Kultury. Funkcja Quack"],
                Rct: ["Handel -> Licznik zasobów (Administrator)", "Licznik wszystkich zasobów w Twoim mieście"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Automatycznie wysyłać raporty o błędach", "Jeśli włączysz tę opcję, możesz pomóc zidentyfikować błędy"],
                //her: ["", ""],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'niebieski',
                Red: 'Czerwony',
                Green: 'Zielony',
                Pink: 'Różowy',
                White: "Biały",
            },
            labels: {
                uni: "Przegląd jednostek",
                total: "Ogólny",
                available: "Dostępny",
                outer: "Na zewnątrz",
                con: "Wybierz miasto",
                /// Smileys
                std: "Standard" /* "Standardowe" */,
                gre: "Grepo",
                nat: "Przyroda",
                ppl: "Ludzie",
                //Par: "",
                oth: "Inne",
                //hal: "",
                //xma: "",
                //eas: "",
                //lov: "",
                /// Defense form
                ttl: "Podgląd: Obrona miasta",
                inf: "Informacje o mieście:",
                dev: "Ochyłka",
                det: "jednostki lądowe",
                prm: "opcje Premium",
                sil: "Ilość srebra",
                mov: "Ruchy wojsk",
                /// WW
                leg: "Udział w Cudzie",
                stg: "Poziom",
                tot: "Łącznie",
                /// Simulator
                str: "Siła jednostek",
                los: "Straty",
                mod: "bez modyfikatorów",
                /// Comparison box
                dsc: "Porównianie jednostek",
                hck: "Obuchowa",
                prc: "Tnąca",
                dst: "Dystansowa",
                sea: "Morskie",
                att: "Offensywne",
                def: "Defensywne",
                spd: "Prędkość",
                bty: "Łup (surowce)",
                cap: "Pojemność transportu",
                res: "Koszta (surowce)",
                fav: "Łaski",
                tim: "Czas rekrutacji (s)",
                /// Trade
                rat: "Stosunek surowców dla wybranej jednostki",
                shr: "procent zapełnienia magazynu w docelowym mieście",
                per: "Handel procentowy",
                /// Sent units box
                lab: "Wysłane jednostki",
                rec: "Zasoby",
                improved_movement: "Przyspieszone ruchy wojsk",
                donat: "Darowizny",
                Tran: "Tłumaczenia",
                Happy: "Szczęśliwego Nowego Roku!",
                Merry: "Ho ho ho wesołych świąt!",
                tow: "Miasto BBCode",
                ingame_name: ["Nie wahaj się ze mną skontaktować, jeśli wolisz być nazywany tak jak w grze", "Ponieważ jest to bardzo dużo pracy, która może być bardzo czasochłonna, zawsze jestem bardzo wdzięczny za wszelkiego rodzaju wsparcie. Dlatego chciałbym podziękować wszystkim, którzy zaoferowali wsparcie dla tego projektu - czy to poprzez darowizny, wiedzę, kreatywność, raporty o błędach lub po prostu zachęcające słowa."]
            },
            tutoriel: {
                tuto: "Przydatna informacja",
                reme: ["Dziękuję wszystkim, którzy przyczynili się do rozwoju DIO-TOOLS-David1327", ""],

                //Trou: ["", ""],
                //util: ["", ""],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Usuń wiele wiadomości",
                delete_sure: "Czy na pewno chcesz usunąć te posty?",
                no_selection: "Brak zaznaczonych Postów",
                mark_All: "Zaznacz wszystko",
                //select unit shelper
                no_overload: 'Wybierz i napełnij łódki',
                delete: 'Wyczyść',
                //culture Overview
                cityfestivals: 'Festyn miejski',
                olympicgames: 'Igrzyska Olimpijskie',
                triumph: 'Pochód triumfalny',
                theater: 'Występy teatralne'
            },
            hotkeys: {
                hotkeys: 'Skróty',
                Senate: 'Senat',
                city_select: 'Wybór miasta',
                last_city: 'Poprzednie miasto',
                next_city: 'Następne miasto',
                jump_city: 'Przejdź do obecnego miasta',
                administrator: 'Zarządca',
                captain: 'Kapitan',
                trade_ov: 'Podgląd handlu',
                command_ov: 'Podgląd poleceń',
                recruitment_ov: 'Podgląd rekrutacji',
                troop_ov: 'Podgląd wojsk',
                troops_outside: 'Wojska poza miastem',
                building_ov: 'Podgląd budynków',
                culture_ov: 'Podgląd kultury',
                gods_ov: 'Podgląd bogów',
                cave_ov: 'Podgląd jaskini',
                city_groups_ov: 'Podglad grupy miast',
                city_list: 'Lista miast',
                attack_planner: 'Planer ataków',
                farming_villages: 'Wioski',
                menu: 'Menu',
                city_view: 'Podgląd miasta',
                messages: 'Wiadomości',
                reports: 'Raporty',
                alliance: 'Sojusz',
                alliance_forum: 'Forum sojuszu',
                settings: 'Ustawienia',
                profile: 'Profil',
                ranking: 'Ranking',
                notes: 'Notatnik',
                chat: 'Czat',
                council: 'Rada Bohaterów'
            },
            messages: {
                ghosttown: 'Opuszczone miasto',
                no_cities: 'Brak miast na tej wyspie',
                all: 'Całość',
                export: 'Zmień wiadomość na BB-Code',
                Tol: 'Kopiuj i wklej (Funkcja Quack)',
                copy: 'kopiuj',
                bbmessages: 'Wiadomości z BB-Code',
                copybb: 'BBCode został skopiowany',
                écrit: 'napisał(a):',
            },
            caves: {
                stored_silver: 'Przechowywane srebrne monety',
                //silver_to_store: "",
                name: 'Nazwa',
                wood: 'Drewno',
                stone: 'Kamień',
                silver: 'Srebrne monety',
                //search_for: ""
            },
            grepo_mainmenu: {
                city_view: 'Podgląd miasta',
                island_view: 'Podgląd wyspy'
            },
            transport_calc: {
                recruits: 'Uwzględniaj jednostki w kolejce rekrutacji',
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army : "",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'информация',
                trans: 'Tłumaczenie na język',
                translations: 'Tłumaczenia',
                trans_sure: 'Czy jesteś pewien, że twoje tłumaczenie jest gotowe do wygenerowania?',
                trans_success: 'Tłumaczenie zostało wysłane pomyślnie',
                trans_fail: 'Nie można wysłać tłumaczenia',
                trans_infotext1: 'Dostępne tłumaczenie',
                trans_infotext2: 'Aby zmodyfikować lub utworzyć nowy język, wybierz język z menu rozwijanego',
                trans_infotext3: 'Kiedy tekst zawiera znaczniki HTML (a więc wszystko, co jest otoczone nawiasami <>), proszę o zachowanie ich tam, gdzie je znalazłeś',
                trans_infotext4: 'Po zakończeniu tłumaczenia naciśnij',
                trans_infotext5: 'Aby móc dodać cię do kredytów, zostanie wygenerowany twój pseudonim',
                trans_infotext6: 'Skopiuj wygenerowaną wiadomość i wklej ją w komentarzu',
                please_note: 'Uwaga',
                credits: 'Kredyty',
                no_translation: 'Nie znaleziono tłumaczenia',
                choose_lang: 'Wybierz język',
                add_lang: 'Dodaj nowy język',
                language: 'Język',
                enter_lang_name: 'Proszę podać nazwę języka',
                send: 'Generuj wiadomość',
                name: 'Nazwa',
            },
            buttons: {
                sav: "Zapisz", ins: "Wstaw", res: "Anuluj"
            }
        },
        //////////////////////////////////////////////
        // Spanish Translation by Juana de Castilla //
        //////////////////////////////////////////////
        es: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://es.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.45017/"
                //link_troupes: "https://www.tuto-de-david1327.com/pages/troupes-grepolis.html",
                //link_utile: "https://www.tuto-de-david1327.com/en/pages/info/utility-sites.html",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools ofrece, entre otras cosas, varias pantallas, ventana de <br>emoticones, opciones de comercio y algunos cambios en el diseño.",
                act: "Activar/desactivar características de las herramientas:",
                prv: "Vista previa de varias características:",

                version_old: "La versión no está actualizada",
                version_new: "La versión está actualizada",
                version_dev: "Versión de desarrollador",

                version_update: "poner al día",
                Donate: "Donar",

                //forum: "",
                Update: "Actualizar " + dio_version,
                Feature: "Nueva caracteristica",
                Feature2: "Nueva versión",
                Learn_more: "Aprende más",

                //cat_units: "",
                //cat_icons: "",
                //cat_forum: "",
                //cat_trade: "",
                //cat_wonders: "",
                //cat_layout: "",
                //cat_other: "",
                cat_Premium: "Premium",
                cat_Quack: "Quack",

                install: "Instalar",
                reminder: "Recordármelo más tardee",
                Available: "Disponible nueva versión",
                reqreload: "Se necesita cargar de nuevo el sitio",
                reload: "Cargar de nuevo",
            },
            Options: {
                //bir: ["Contador de birremes", "Cuenta los birremes de una ciudad y los suma"],
                ava: ["Información general unidades", "Indica las unidades de todas las ciudades"], // ?
                //ava2: ["", ""],
                sml: ["Emoticones", "Código BB para emoticones"],
                str: ["Fortaleza de la Unidad", "Añade tabla de fortalezas de cada unidad en varias zonas"],
                trd: ["Comercio", "Añade en la pestaña de comercio un porcentaje de comercio y reclutamiento y limitadores de Mercado por cada ciudad"],
                per: ["Comercio de porcentual", ""],
                rec: ["Comercio de reclutamiento", ""],
                cnt: ["Conquistas", "contador de ataques y refuerzos en la pestaña de conquista"],
                way: ["Velocidad de tropas", "Muestra movimiento de tropas mejorado en la ventana de ataque/refuerzo"],
                sim: ["Simulador", "Adaptación de la ventana del simulador incluyendo recuadro de modificadores"],
                act: ["Ventana de actividad", "Mejora las ventanas de comercio y reclutamiento (memoria posicional)"],
                pop: ["Popup", "Cambia el popup de favores"],
                tsk: ["Barra de tareas", "Aumenta la barra de tareas"],
                rew: ["Recompensa diaria", "Minimice la recompensa diaria al inicio"],
                bbc: ["Formulario de defensa", "Añade en la barra de códigos bb un formulario de defensa"],
                com: ["Comparación", "añade ventana de comparación de unidades"],
                tic: ["Iconos de la ciudad", "Cada ciudad recibe un icono para el tipo de la ciudad (detección automática)", "Iconos adicionales están disponibles para la selección manual"],
                til: ["Lista de la ciudad", "Agrega los iconos de la ciudad a la lista de la ciudad"],
                tim: ["Map", "Establece los iconos de la ciudad en el mapa estratégico"],
                tiw: ["Ventana emergente de icono", ""],
                wwc: ["Maravillas", "Calcula participación & contador de recursos + antes y después teclas de maravillas terminadas (no desactibable ahora!)"],
                //wwr: ["", ""],
                //wwi: ["",''],
                con: ["menú contextual", 'Cambia "Elegir ciudad" y "vista de la ciudad" en el menú contextual '],
                sen: ["Unidades enviadas", 'Muestra las unidades enviadas en la ventana de ataque/refuerzos'],
                tov: ["Información de la ciudad", 'sustituye la vista nueva de ciudad por la ventana antigua'],
                scr: ["Rueda raton", 'Puede cambiar las vistas con la rueda del raton'],
                Scr: ["Barra de desplazamiento", 'Cambiar el estilo de la barra de desplazamiento'],
                tow: ["BBCode ciudad", "Agrega el bbcode de la ciudad a la pestaña de la ciudad"],
                Fdm: ["Seleccionar y eliminar varios mensajes", "Puede eliminar más de un mensaje. Función Quack"],
                Sel: ["Agregar (No cargar / Borrar)", "Mejora de nuevas herramientas en la ventana de ataque y soporte. Función Quack"],
                Cul: ["Resumen de cultura (Administrador)", "Agregue un contador para la fiesta en la vista de cultura. Función Quack"],
                Hot: ["Atajos de teclado para Windows", "Te cambia la vida"],
                Isl: ["Visualización de la isla", "Aumentar la altura de la lista de ciudades y pueblos. Función Quack"],
                Ish: ["Descripción general de las aldeas campesinas (Capitán)", "Ocultar automáticamente la ciudad. Función Quack"],
                Hio: ["Resumen de Cuevas (Administrador)", "Permitir la clasificación de las ciudades. Función Quack"],
                Hid: ["Cueva", "Introducir 15.000 monedas de plata automáticamente en el campo de entrada. Función Quack"],
                Tol: ["Lista de ciudades en código BB", "Copiar y pegar. Función Quack"],
                Cib: ["Botón de vista de la ciudad", "Agregar un botón para abrir la vista de la ciudad al menú lateral de Grepolis. Función Quack"],
                Ciw: ["Vista de la ciudad", "Mostrar la vista de la ciudad en una ventana. Función Quack"],
                Tti: ["Intercambie recursos para festivales", "Haga clic en él y solo se intercambiará hacia un festival. Función Quack"],
                Mse: ["Mensajes de código BB", "Convertir mensajes a código BB. Función Quack"],
                Rep: ["Informes", "Agregar un filtro de color. Función Quack"],
                BBt: ["Información del jugador del botón BBcode", "Adición de un botón BBcode (jugador y alianza)"],
                Rtt: ["Eliminación de la información sobre herramientas de la unidad", ""],
                Cup: ["Avance de la cultura (Administrador) ", " Se modificó la presentación de la barra de progreso y se agregó una barra de progreso para los cultivos. Función de Akiway"],
                Cuo: ["Puntos de Cultura (Administrador)", "Agrega un contador para los Puntos de Cultura. Función Quack"],
                Rct: ["Comercio -> Contador de recursos (Administrador) ", " Un recuento de todos los recursos de tu ciudad"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Enviar informes de errores automáticamente", "Si se activa esta opción, puede ayudar a identificar errores."],
                //her: ["", ""],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'Azul',
                Red: 'rojo',
                Green: 'Verde',
                Pink: 'Rosado',
                White: "Blanco",
            },
            labels: {
                uni: "Información general unidades",
                total: "Total",
                available: "Disponible",
                outer: "Fuera",
                con: "Escoger ciudad",
                // Smileys
                std: "Standard",
                gre: "Grepo",
                nat: "Natura",
                ppl: "Gente",
                ///Par: "",
                oth: "Otros",
                //hal: "",
                //xma: "",
                //eas: "",
                //lov: "",
                // Defense form
                ttl: "Vista general: Defensa de la ciudad",
                inf: "Información de la ciudad:",
                dev: "Desviación",
                det: "Unidades de tierra detalladas",
                prm: "Bonos Premium",
                sil: "Volumen de plata",
                mov: "Movimientos de tropas:",
                // WW
                leg: "WW cuota",
                stg: "Nivel",
                tot: "Total",
                // Simulator
                str: "Fortaleza de la Unidad",
                los: "Perdida",
                mod: "sin influencia del modificador",
                // Comparison box
                dsc: "Comparación de Unidades",
                hck: "Contundente",
                prc: "Punzante",
                dst: "Distancia",
                sea: "Mar",
                att: "Ataque",
                def: "Defensa",
                spd: "Velocidad",
                bty: "Botín (recursos)",
                cap: "Capacidad de transporte",
                res: "Costes (recursos)",
                fav: "Favor",
                tim: "Tiempo de reclutamiento (s)",
                // Trade
                rat: "Proporción de recursos de un tipo de unidad",
                shr: "Porcentaje de la capacidad de almacenamiento de la ciudad destino",
                per: "Porcentaje de comercio",
                // Sent units box
                lab: "Unidades enviadas",
                rec: "Recursos",
                improved_movement: "Movimiento de tropas mejorados",
                donat: "Donaciones",
                Tran: "Traducciones",
                Happy: "Feliz año nuevo!",
                Merry: "Ho ho ho Feliz Navidad!",
                tow: "código BB ciudad",
                ingame_name: ["No dudes en ponerte en contacto conmigo si prefieres que te llamen por tu nombre en el juego", "Dado que se trata de mucho trabajo y puede ser muy lento siempre estoy muy agradecido por cualquier tipo de soporte. Por lo tanto me gustaría dar las gracias a todos los que ofreció su apoyo para este proyecto -. Sea a través de donaciones, el conocimiento, la creatividad, los informes de error o sólo algunas palabras alentadoras bbcode"]
            },
            tutoriel: {
                tuto: "Información útil",
                reme: ["Agradezco a todos los que contribuyeron al desarrollo de DIO-TOOLS-David1327", ""],

                //Trou: ["", ""],
                //util: ["", ""],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Eliminar múltiples mensajes",
                delete_sure: "¿Realmente desea eliminar estos mensajes?",
                no_selection: "No hay posts seleccionados",
                mark_All: "Marca todas",
                //select unit shelper
                no_overload: 'No cargar',
                delete: 'Borrar',
                //culture Overview
                cityfestivals: 'Festival de la ciudad',
                olympicgames: 'Juegos Olímpicos',
                triumph: 'Marcha triunfal',
                theater: 'Obras de teatro'
            },
            hotkeys: {
                hotkeys: 'Atajos de teclado',
                Senate: 'Senado',
                city_select: 'Selección de la ciudad',
                last_city: 'Última ciudad',
                next_city: 'Próxima ciudad',
                jump_city: 'Saltar a la ciudad actual',
                administrator: 'Administrador',
                captain: 'Capitán',
                trade_ov: 'Vista general de comercio',
                command_ov: 'Vista general de órdenes',
                recruitment_ov: 'Vista general de reclutamiento',
                troop_ov: 'Vista de tropas',
                troops_outside: 'Tropas fuera',
                building_ov: 'Vista general de edificios',
                culture_ov: 'Vista de cultura',
                gods_ov: 'Vista general de dioses',
                cave_ov: 'Vista general de la cueva',
                city_groups_ov: 'Vista general de grupos de ciudades',
                city_list: 'Lista de ciudades',
                attack_planner: 'Programador de ataque',
                farming_villages: 'Aldeas',
                menu: 'Menú',
                city_view: 'Vista de la ciudad',
                messages: 'Mensajes',
                reports: 'Informes',
                alliance: 'Alianza',
                alliance_forum: 'Foro de la alianza',
                settings: 'Ajustes',
                profile: 'Perfil',
                ranking: 'Clasificación',
                notes: 'Notas',
                chat: 'Chat',
                council: 'Consejo de héroes'
            },
            messages: {
                ghosttown: 'Ciudad fantasma',
                no_cities: 'No hay ciudades en esta isla',
                all: 'Todo',
                export: 'Convertir mensaje en códigos BB',
                Tol: 'Copiar y pegar (Función Quack)',
                copy: 'copia',
                bbmessages: 'Mensajes de código BB',
                copybb: 'código BB ha sido copiado',
                écrit: 'ha escrito:',
            },
            caves: {
                stored_silver: 'Monedas de plata almacenables',
                silver_to_store: 'Monedas de plata Almacenadas',
                name: 'Nombre',
                wood: 'Madera',
                stone: 'Piedra',
                silver: 'Monedas de plata',
                //search_for: ''
            },
            grepo_mainmenu: {
                city_view: 'Vista de la ciudad',
                island_view: 'Vista de la isla'
            },
            transport_calc: {
                recruits: 'Contar unidades en cola de reclutamiento',
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army : "",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'информация',
                trans: 'Traducción para el idioma',
                translations: 'Traducciones',
                trans_sure: '¿Está seguro de que su traducción está lista para ser generada?',
                trans_success: 'La traducción se ha enviado correctamente',
                trans_fail: 'No se pudo enviar la traducción',
                trans_infotext1: 'Traducción disponible',
                trans_infotext2: 'Para modificar o crear un nuevo idioma, elija el idioma en el menú desplegable',
                trans_infotext3: 'Cuando un texto contiene etiquetas HTML (por lo tanto, todo lo que está entre <> corchetes) te pido que los guardes donde los encontraste',
                trans_infotext4: 'Cuando hayas terminado de traducir, presiona',
                trans_infotext5: 'Para poder agregarte a los créditos, se generará tu apodo',
                trans_infotext6: 'Copia el mensaje generado y pégalo en un comentario',
                please_note: 'Tenga en cuenta',
                credits: 'Créditos',
                no_translation: 'No se encontró traducción',
                choose_lang: 'Elegir idioma',
                add_lang: 'Agregar un nuevo idioma',
                language: 'Idioma',
                enter_lang_name: 'Por favor ingrese un nombre de idioma',
                send: 'Generar mensaje',
                name: 'nombre',
            },
            buttons: {
                sav: "Guardar", ins: "Insertar", res: "Reinicio"
            }
        },
        ar: {},
        //////////////////////////////////////////////
        //   Portuguese (BR) Translation by  HELL   //
        //////////////////////////////////////////////
        br: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://br.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.23781/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools oferece, entre outras coisas, algumas telas, uma caixa de smiley, opções de comércio <br> e algumas alterações no layout.",
                act: "Ativar/desativar recursos do conjunto de ferramentas:",
                prv: "Pré-visualização de vários recursos:",

                version_old: "Versão não está atualizada",
                version_new: "Versão está atualizada",
                version_dev: "Versão do desenvolvedor",

                version_update: "Atualização",
                Donate: "Doar",

                //forum: "",
                Update: "Atualizar " + dio_version,
                Feature: "Novo Recurso",
                Feature2: "Nova versão",
                Learn_more: "Saber mais",

                cat_units: "Unidades",
                cat_icons: "Ícones nas Cidades",
                cat_forum: "Forum",
                cat_trade: "Comércio",
                cat_wonders: "Maravilhas do Mundo",
                cat_layout: "Layout",
                cat_other: "Outros",
                cat_Premium: "Premium",
                cat_Quack: "Quack",

                install: "Instalar",
                reminder: "Lembrar mais tarde",
                Available: "Nova versão disponível",
                reqreload: "Atualização requerida",
                reload: "Atualizar",
            },
            Options: {
                // bir: ["Contador de Birremes", "Conta as biremes da cidade na cidade"],
                ava: ["Visão Geral da unidade", "Indica as unidades de todas as cidades"], // ?
                //ava2: ["", ""],
                sml: ["Smilies", "Estende o bbcode com uma caixa de smiley"],
                str: ["Força das Tropas", "Adiciona quadros de força das tropas em diversas áreas"],
                tra: ["Capacidade de Transporte", "Mostra a capacidade de transporte ocupado e disponível no menu de unidades"],
                per: ["Percentual de comércio", "Estende-se a janela de comércio com um percentual de comércio"],
                rec: ["Comércio para recrutamento", "Estende-se a janela de comércio com um comércio de recrutamento"],
                cnt: ["Conquistas", "Conta os ataques/apoios na janela de conquista"],
                way: ["Velocidade da Tropa", "Displays mostram a possivél velocidade de tropa na janela de ataque/suporte"],
                sim: ["Simulador", "Adaptação do layout simulador & exposição permanente da caixa poderes estendida"],
                act: ["Ativar caixas suspensas de comércio e ataque", "Melhorias da exibição de caixas de comércio e recrutamento (com memória de posição)"],
                pop: ["Caixa de favores divino", "Altera a caixa de favores divino por um novo layout"],
                tsk: ["Barra de tarefas", "Aumenta a barra de tarefas"],
                rew: ["Recompensa diária", "Minimiza a janela recompensa diária no inicio"],
                bbc: ["Pedido de Apoio", "Estende a barra de bbcode com uma forma de Pedido de Apoio Automática"],
                com: ["Comparação de Unidades", "Adiciona tabelas de comparação de unidade"],
                tic: ["Ícones nas Cidades", "Cada cidade recebe um ícone para o tipo de tropas na cidade (detecção automática) ", " Ícones adicionais estão disponíveis para seleção manual"],
                til: ["Lista das Cidades", "Adiciona os ícones da cidade na lista de cidades"],
                tim: ["Mapa", "Mostra os ícones das cidades no mapa estratégico"],
                tiw: ["Pop-up de ícone", ""],
                wwc: ["Calculadora de WW", "Cálculo compartilhado & contador de recursos + botões anterior e próxima maravilhas do mundo (atualmente não desactivável!)"],
                wwr: ["Classificação", "Classificação das maravilha do mundo redesenhadas"],
                wwi: ["Icones", 'Adiciona ícones nas maravilha do mundo no mapa estratégico'],
                con: ["Menu de Contexto", 'Troca da "Selecione cidade" e "Visão Geral da Cidade" no menu de contexto'],
                sen: ["Unidades Enviadas", 'Shows sent units in the attack/support window'],
                tov: ["Visão da Cidade", 'Substitui o novo panorama da cidade, com o estilo da janela antiga'],
                scr: ["Roda do Mouse", 'Você pode alterar os pontos de vista com a roda do mouse'],
                Scr: ["Barra de rolagem", 'Alterar o estilo da barra de rolagem'],
                tow: ["BBCode city", "Adiciona o bbcode da cidade à guia cidade"],
                Fdm: ["Selecione e exclua várias mensagens", "Você pode excluir mais de uma mensagem. Função Quack"],
                Sel: ["Adicionar (Sem sobrecarga / Excluir)", "Melhoria de novas ferramentas na janela de ataque e suporte. Função Quack"],
                Cul: ["Visão geral da cultura (Administrador)", "Adicionar um contador para a festa na visualização de cultura. Função Quack"],
                Hot: ["Atalhos do teclado para Windows", "Isso muda sua vida"],
                Isl: ["Visualização da ilha", "Aumentar a altura da lista de cidades e vilas. Função Quack"],
                Ish: ["Visão geral das aldeias camponesas (capitão)", "Ocultar automaticamente a cidade. Função Quack"],
                Hio: ["Visão geral das Grutas (Administrador)", "Permitir o filtro de cidades"],
                Hid: ["Gruta", "Digite prata acima 15000 automaticamente no campo. Função Quack"],
                Tol: ["Lista de cidades em BB-Code", "Copiar e colar. Função Quack"],
                Cib: ["Botão de vista da cidade", "Adicionar um botão para abrir a vista da cidade ao menu lateral. Função Quack"],
                Ciw: ["Vista da cidade", "Mostrar vista para a cidade em uma janela. Função Quack"],
                Tti: ["Troque recursos para festivais", "Clique nele e só será trocado por um festival. Função Quack"],
                Mse: ["Mensagens do Código BB", "Converter mensagens em Código BB. Função Quack"],
                Rep: ["Reports", "Adicionando um filtro de cores. Função Quack"],
                BBt: ["Κουμπί BBcode Πληροφορίες προγράμματος αναπαραγωγής", "Προσθήκη κουμπιού BBcode (player και alliance)"],
                Rtt: ["Remoção das dicas da unidade", ""],
                Cup: ["Avanço da Cultura (Administrador)", "Alterada a apresentação da barra de progresso e adicionada uma barra de progresso para as colheitas. Função de Akiway"],
                Cuo: ["Pontos de Cultura (Administrador)", "Adicione um contador para os Pontos de Cultura. Função Quack"],
                Rct: ["Comércio -> Contador de recursos (Administrador) ", " Uma contagem de todos os recursos em sua cidade"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Enviar automaticamente relatórios de erros", "Se você ativar essa opção, você pode ajudar a identificar erros."],
                //her: ["Conquista Thracian", "Redução de tamanho do mapa da conquista Thracian."],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'Azul',
                Red: 'Vermelho',
                Green: 'Verde',
                Pink: 'Rosa',
                White: "Blanco",
            },
            labels: {
                uni: "Visão Geral da unidade",
                total: "Global",
                available: "Disponível",
                outer: "Fora",
                con: "Selecionar cidade",
                /// Smileys
                std: "Padrão",
                gre: "Grepo",
                nat: "Natural",
                ppl: "Popular",
                //Par: "",
                oth: "Outros",
                hal: "Halloween",
                xma: "Natal",
                //eas: "",
                //lov: "",
                /// Defense form
                ttl: "Pedido de Apoio",
                inf: "Informação da cidade:",
                dev: "Desvio",
                det: "Unidades Detalhadas",
                prm: "Bônus Premium",
                sil: "Prata na Gruta",
                mov: "Movimentação de Tropas:",
                /// WW
                leg: "WW Maravilhas",
                stg: "Level",
                tot: "Total",
                /// Simulator
                str: "Força das Unidades",
                los: "Perdas",
                mod: "Sem modificador de influência",
                /// Comparison box
                dsc: "Comparação de unidades",
                hck: "Impacto",
                prc: "Corte",
                dst: "Arremço",
                sea: "Naval",
                att: "Ofensivo",
                def: "Defensivo",
                spd: "Velocidade",
                bty: "Saque (recursos)",
                cap: "Capacidade de trasporte",
                res: "Custo (recursos)",
                fav: "Favor",
                tim: "Tempo de recrutamento (s)",
                /// Trade
                rat: "Proporção de recursos de um tipo de unidade",
                shr: "A partir do armazenamento sobre a cidade de destino",
                per: "Percentual de comércio",
                /// Sent units box
                lab: "Unidades enviadas",
                rec: "Recursos",
                improved_movement: "Movimentação de tropas com ajuste de bônus",
                Tran: "Traduções",
                donat: "Doações",
                Happy: "Feliz Ano Novo!",
                Merry: "Ho ho ho feliz Natal!",
                //tow: "",
                ingame_name: ["Não hesite em me contatar se você prefere ser chamado pelo seu nick de jogo", "Como se trata de muito trabalho e pode ser muito Eu sou sempre muito grato por qualquer tipo de apoio demorado. Portanto, eu gostaria de agradecer a todos que ofereceram apoio para este projecto - seja através de doações , o conhecimento, a criatividade, relatórios de bugs ou apenas algumas palavras de incentivo."]
            },
            tutoriel: {
                tuto: "Informações úteis",
                reme: ["Agradeço a todos que contribuíram para o desenvolvimento de DIO-TOOLS-David1327", ""],

                //Trou: ["", ""],
                //util: ["", ""],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Excluir várias mensagens",
                delete_sure: "Você realmente quer apagar essas mensagens?",
                no_selection: "Nenhuma mensagem selecionada",
                mark_All: "Marcar todos",
                //select unit shelper
                no_overload: 'Sem sobrecarga',
                delete: 'Excluir',
                //culture Overview
                cityfestivals: 'Festival Urbano',
                olympicgames: 'Jogos Olímpicos',
                triumph: 'Desfile da Vitória',
                theater: 'Peças de Teatro'
            },
            hotkeys: {
                hotkeys: 'Teclas de atalho',
                Senate: 'Senado',
                city_select: 'Seleção Cidade',
                last_city: 'Última cidade',
                next_city: 'Próxima cidade',
                jump_city: 'Ir para a cidade atual',
                administrator: 'Administrador',
                captain: 'Capitão',
                trade_ov: 'Troca',
                command_ov: 'Comandos',
                recruitment_ov: 'Recrutamento',
                troop_ov: 'Visão geral das tropasa',
                troops_outside: 'Tropas no exterior',
                building_ov: 'Edifícios',
                culture_ov: 'Cultura',
                gods_ov: 'Deuses',
                cave_ov: 'Grutas',
                city_groups_ov: 'Grupos de cidades',
                city_list: 'Lista de cidades',
                attack_planner: 'Planejador de ataques',
                farming_villages: 'Aldeias bárbaras',
                menu: 'Menu',
                city_view: 'Vista da cidade',
                messages: 'Mensagens',
                reports: 'Relatórios',
                alliance: 'Aliança',
                alliance_forum: 'Fórum da aliança',
                settings: 'Configurações',
                profile: 'Perfil',
                ranking: 'Posição',
                notes: 'Notas',
                chat: 'Chat',
                council: 'Conselho de Heróis'
            },
            messages: {
                ghosttown: "Cidade-fantasma",
                no_cities: "Nenhuma cidade nesta ilha",
                all: "Tudo",
                export: "Converter mensagem em BB-Code",
                Tol: "Copiar e colar (Função Quack)",
                copy: "Copiar",
                bbmessages: "Mensagens do BB-Code",
                copybb: "BBCode foi copiado",
                écrit: "escreveu o seguinte:",
            },
            caves: {
                stored_silver: 'Moedas de prata armazenadss',
                silver_to_store: 'Moedas de prata armazenáveis',
                name: 'Nome',
                wood: 'Madeira',
                stone: 'Pedra',
                silver: 'Moedas de prata',
                //search_for: ""
            },
            grepo_mainmenu: {
                city_view: 'Vista da cidade',
                island_view: 'Vista Ilha'
            },
            transport_calc: {
                recruits: "Contagem das unidades na fila de recrutamento",
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army: "",
            },
            reports: {
                //choose_folder: "",
                //enacted: "",
                //conquered: "",
                //spying: "",
                //spy: "",
                //support: "",
                //support2: "",
                //supporting: "",
                //attacking: "",
                //farming_village: "",
                //gold: "",
                //Quests: "",
                //Reservations: "",
            },
            translations: {
                info: 'Info',
                trans: 'tradução para o idioma',
                translations: 'Traduções',
                trans_sure: 'Tem certeza de que sua tradução está pronta para ser gerada?',
                trans_success: 'A tradução foi enviada com sucesso',
                trans_fail: 'A tradução não pôde ser enviada',
                trans_infotext1: 'Tradução disponível',
                trans_infotext2: 'Para modificar ou criar um novo idioma, escolha o idioma no menu suspenso',
                trans_infotext3: 'Quando um texto contém tags HTML (portanto, tudo que está entre <> colchetes) eu peço que você os mantenha onde os encontrou',
                trans_infotext4: 'Quando você terminar de traduzir, pressione',
                trans_infotext5: 'Para poder adicionar você aos créditos, seu apelido será gerado',
                trans_infotext6: 'Copie a mensagem gerada e cole-a em um comentário',
                please_note: 'Por favor, note',
                credits: 'Créditos',
                no_translation: 'Nenhuma tradução encontrada',
                choose_lang: 'Escolha o idioma',
                add_lang: 'Adicionar um novo idioma',
                language: 'Idioma',
                enter_lang_name: 'Por favor, digite um nome de idioma',
                send: 'Gerar mensagem',
                name: 'Nome',
            },
            buttons: {
                sav: "Salvar", ins: "Inserir", res: "Resetar"
            }
        },
        pt: {},
        //////////////////////////////////////////////
        //       Czech Translation by Piwus         //
        //////////////////////////////////////////////
        cz: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://cz.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.8478/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools nabízí,mimo jiné,některá nová zobrazení,okénko smajlíků,<br>obchodní možnosti a některé změny v rozložení panelů.",
                act: "Aktivovat/Deaktivovat funkce  sady nástrojů:",
                prv: "Ukázka několika funkcí:",

                version_old: "Verze je zastaralá",
                version_new: "Verze je aktuální",
                version_dev: "Vývojářská verze",

                version_update: "Aktualizovat",
                Donate: "Darovat",

                //forum: "",
                Update: "Aktualizace " + dio_version,
                Feature: "Nová vlastnost",
                Feature2: "Nová verze",
                Learn_more: "Zjistit více",

                cat_units: "Jednotky",
                cat_icons: "Ikony měst",
                cat_forum: "Forum",
                cat_trade: "Obchod",
                cat_wonders: "Div světa",
                cat_layout: "Okna",
                cat_other: "Ostatní",
                cat_Premium: "Premium",
                cat_Quack: "Quack",
            },
            Options: {
                // bir: ["Počítadlo birém", "Spočítá každé birémy ve městech a sečte je."],
                ava: ["Jednotky Přehled", "Označuje jednotky všemi městy"], // ?
                //ava2: ["", ""],
                sml: ["Smajlíci", "Rozšiřuje panel BBkodů okénkem smajlíků"],
                str: ["Síla jednotek", "Přidává tabulku sil jednotek v různých  oblastech"],
                tra: ["Transportní kapacita", "Zobrazuje obsazenou a dostupnou transportní kapacitu v nabídce jednotek"],
                per: ["Procentuální obchod", "Rozšiřuje obchodní okno možností procentuálního obchodu"],
                rec: ["Obchod rekrutace", "Rozšiřuje obchodní okno možností obchodem pro rekrutaci"],
                cnt: ["Dobývání", "Počítá Útok/Obrana v okně dobývání (pouze vlastní dobývání zatím)"],
                way: ["Rychlost vojsk", "Zobrazuje vylepšenou rychlost vojsk v okně útoku/obrany"],
                sim: ["Simulátor", "Přizpůsobení rozložení simulátoru & permanentní zobrazování rozšířeného okna modifikátoru"],
                act: ["Aktivní okénka", "Zlepšený zobrazení obchodů a vojsk aktivními okénky (pozice paměti)"],
                pop: ["Vyskakovací okénko přízně", "Změní vyskakovací okno seznamu přízní"],
                tsk: ["Hlavní panel", "Zvyšuje hlavní panel"],
                rew: ["Denní odměny", "Minimalizuje bonus denní odměny po přihlášení"],
                bbc: ["Obranné hlášení", "Rozšiřuje panel BBkodů automatickém hlášení obrany města"],
                com: ["Porovnání jednotek", "Přidává tabulku porovnání jednotek"],
                tic: ["Ikony měst", "Každé město dostává svojí ikonku dle typu města (automatická detekce)", "Další ikonky jsou k dispozici manuálně"],
                til: ["Seznam měst", "Přidává ikony měst do seznamu měst"],
                tim: ["Mapa", "Přidává ikony měst na stategickou mapu"],
                tiw: ["Vyskakovací ikona", ""],
                wwc: ["Kalkulačka", "Výpočet podílu & počítadlo surovin  + předchozí & další tlačítka  na dokončených divech světa (aktuálně nelze deaktivovat!)"],
                wwr: ["Žebříček", "Předělaný žebříček divů světa"],
                wwi: ["Ikony", 'Přídává ikony divů světa na strategickou mapu'],
                con: ["Kontextové menu", 'Vyměňuje "Vybrat město" a "Přehled města" v kontextovém menu'],
                sen: ["Odeslané jednotky", 'Zobrazuje odeslané jednotky útoku/obrany v okně'],
                tov: ["Přehled města", 'Nahrazuje nový přehled měst starším stylem okna'],
                scr: ["Kolečko myši", 'Můžeš změnit pohledy s kolečkem myši'],
                Scr: ["Posuvník", 'Změňte styl posuvníku'],
                tow: ["BBCode město", "Přidá bbcode města na kartu města"],
                Fdm: ["Vyberte a smažte několik zpráv", "Můžete smazat více než jednu zprávu. Funkce Quack"],
                Sel: ["Přidat (Bez přeložení / Smazat)", "Vylepšení nových nástrojů v okně útoku a podpory. Funkce Quack"],
                Cul: ["Přehled kultury (Správce)", "Přidejte čítač strany v zobrazení kultury. Funkce Quack"],
                Hot: ["Klávesové zkratky pro Windows", "Změní to váš život"],
                Isl: ["Vizualizace ostrova", "Zvětšete výšku seznamu měst a vesnic. Quack funkce"],
                Ish: ["Přehled rolnických vesnic (kapitán)", "Automaticky skrýt město. Quack funkce"],
                Hio: ["Přehled jeskyní (Správce)", "Povolit řazení měst. Quack funkce"],
                Hid: ["Jeskyně", "Automaticky vkládat do vstupního pole stříbrné mince nad 15 000. Quack funkce"],
                Tol: ["Seznam měst v BB-Code", "Kopírovat a vložit. Quack funkce"],
                Cib: ["Botão de vista da cidade", "Přidat tlačítko pro otevírání přehledu města do postranní lišty Grepolisu. Quack funkce"],
                Ciw: ["Přehled města", "Exibir a cidade em uma janela. Quack funkce"],
                Tti: ["Obchodní zdroje pro festivaly", "Klikněte na něj a je vyměňováno pouze za festival. Quack funkce"],
                Mse: ["BB-Code messages", "Převést zprávy na BB-Code. Quack funkce"],
                Rep: ["Reports", "Přidání barevného filtru. Quack funkce"],
                BBt: ["Tlačítko BBcode Player Info", "Přidání tlačítka BBcode (hráč a spojenectví)"],
                Rtt: ["Odstranění popisů jednotky", ""],
                Cup: ["Rozvoj kultury (správce)", "Změnilo se zobrazení pruhu postupu a přidal se ukazatel průběhu pro plodiny. Funkce Akiway"],
                Cuo: ["Body kultury (správce)", "Přidejte počítadlo pro body kultury. Quack funkce"],
                Rct: ["Obchod -> Počítadlo zdrojů (správce)", "Počet všech zdrojů ve vašem městě"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Hlásit chyby automaticky", "Pokud aktivuješ tuto možnost,pomůžeš nám identifikovat chyby."],
                her: ["Thrácké dobývání", "Redukuje mapy Thráckého dobývání."],
            },
            Town_icons: {
                //LandOff: "",
                //LandDef: "",
                //NavyOff: "",
                //NavyDef: "",
                //FlyOff: "",
                //FlyDef: "",
                //Out: "",
                //Emp: "",
            },
            Color: {
                Blue: 'Modrý',
                Red: 'Červené',
                Green: 'Zelený',
                Pink: 'Růžový',
                White: "Bílý",
            },
            labels: {
                uni: "Jednotky Přehled",
                total: "Celkový",
                available: "K dispozici",
                outer: "Vně",
                con: "Zvolit město",
                /// Smileys
                std: "Standartní",
                gre: "Grepo",
                nat: "Příroda",
                ppl: "Lidi",
                //Par: "",
                oth: "Ostatní",
                hal: "Halloween",
                xma: "Vánoce",
                //eas: "",
                //lov: "",
                /// Defense form
                ttl: "Přehled: Obrana města",
                inf: "Informace o městě:",
                dev: "Odchylka",
                det: "Podrobné pozemní jednotky",
                prm: "Prémiové bonusy",
                sil: "Objem stříbra",
                mov: "Pohyby vojsk:",
                /// WW
                leg: "Podíl divu světa",
                stg: "Stupeň",
                tot: "Celkem",
                /// Simulator
                str: "Síla jednotek",
                los: "Ztráta",
                mod: "bez vlivu modifikátoru",
                /// Comparison box
                dsc: "Porovnání jednotek",
                hck: "Sečné",
                prc: "Bodné",
                dst: "Střelné",
                sea: "Moře",
                att: "Útočné",
                def: "Obranné",
                spd: "Rychlost",
                bty: "Kořist (suroviny)",
                cap: "Transportní kapacita",
                res: "Náklady (suroviny)",
                fav: "Přízeň",
                tim: "Doba rekrutování (s)",
                /// Trade
                rat: "Poměr surovin typu jednotky",
                shr: "Podíl na úložné kapacitě cílového města",
                per: "Procentuální obchod",
                /// Sent units box
                lab: "Odeslané jednotky",
                rec: "Zdroje",
                improved_movement: "Vylepšený pohyb jednotek",
                donat: "Dary",
                Tran: "Překlady",
                Happy: "Šťastný nový rok!",
                Merry: "Ho Ho Ho, Veselé Vánoce!",
                tow: "BBCode město",
                ingame_name: ["Neváhejte mě kontaktovat, pokud chcete být volán svým herním jménem", "Protože je tato práce náročná, a to i časově, jsem vždy vděčný za jakoukoliv Vaši podporu. Proto chci poděkovat každému, kdo tomuto projektu jakkoliv pomohl - buďto skrze dary nebo, znalostí, kreativitou, hlášením chyb nebo pouze povzbudivými slovy."]
            },
            tutoriel: {
                tuto: "Užitečné informace",
                reme: ["Děkuji všem, kteří se podíleli na vývoji DIO-TOOLS-David1327", ""],

                //Trou: ["", ""],
                //util: ["", ""],
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Odstraňte více zpráv",
                delete_sure: "Opravdu chcete smazat tyto příspěvky?",
                no_selection: "Nebyly vybrány žádné příspěvky",
                mark_All: "Označit vše",
                //select unit shelper
                no_overload: 'Bez přeložení',
                delete: 'Smazat',
                //culture Overview
                cityfestivals: 'Městské slavnosti',
                olympicgames: 'Olympijské hry',
                triumph: 'Slavnostní pochody',
                theater: 'Divadelní hry'
            },
            hotkeys: {
                hotkeys: 'Horké klávesy',
                Senate: 'Senát',
                city_select: 'Výběr města',
                last_city: 'Předchozí město',
                next_city: 'Následující město',
                jump_city: 'Přejít na aktuální město',
                administrator: 'Správce',
                captain: 'Kapitán',
                trade_ov: 'Obchod',
                command_ov: 'Rozkazy',
                recruitment_ov: 'Rekrutování',
                troop_ov: 'Přehled vojsk',
                troops_outside: 'Vojsko mimo',
                building_ov: 'Budovy',
                culture_ov: 'Kultura',
                gods_ov: 'Bohové',
                cave_ov: 'Jeskyně',
                city_groups_ov: 'Skupiny měst',
                city_list: 'Seznam měst',
                attack_planner: 'Plánovač útoků',
                farming_villages: 'Zemědělské vesnice',
                //menu: '',
                city_view: 'Přehled města',
                messages: 'Zprávy',
                reports: 'Hlášení',
                alliance: 'Aliance',
                alliance_forum: 'Fórum aliance',
                settings: 'Nastavení',
                profile: 'Profil',
                ranking: 'Žebříček',
                notes: 'Poznámky',
                //chat: '',
                council: 'Shromáždění hrdinů'
            },
            messages: {
                ghosttown: 'Město duchů',
                no_cities: 'Na tomto ostrově nejsou žádná města',
                all: 'vše',
                export: 'Zkonvertuj zprávu do BB-kódu',
                Tol: 'Kopírovat a vložit (Quack funkce)',
                copy: 'Pro kopírování',
                bbmessages: 'BB-kódu messages',
                copybb: 'BB-kódu byl zkopírován',
                écrit: 'napsal toto:',
            },
            caves: {
                stored_silver: 'Uložené stříbrné mince',
                //silver_to_store: '',
                name: 'Jméno',
                wood: 'Dřevo',
                stone: 'Kámen',
                silver: 'Stříbrné mince',
                //search_for: ''
            },
            grepo_mainmenu: {
                city_view: 'Přehled města',
                island_view: 'Ostrovní pohled'
            },
            transport_calc: {
                recruits: 'Započítej jednotky ve výstavbě',
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army : "",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'Info',
                trans: 'Překlad pro jazyk',
                translations: 'Překlady',
                trans_sure: 'Jste si jisti, že je váš překlad připraven k vygenerování?',
                trans_success: 'Překlad byl úspěšně odeslán',
                trans_fail: 'Překlad nelze odeslat',
                trans_infotext1: 'Překlad k dispozici',
                trans_infotext2: 'Chcete-li upravit nebo vytvořit nový jazyk, vyberte jazyk v rozevírací nabídce',
                trans_infotext3: 'Pokud text obsahuje značky HTML (tedy vše, co je obklopeno <> závorkami), požádám vás, abyste je ponechali tam, kde jste je našli.',
                trans_infotext4: 'Po dokončení překladu stiskněte',
                trans_infotext5: 'Abychom vás mohli přidat do kreditů, bude vygenerována vaše přezdívka',
                trans_infotext6: 'Zkopírujte vygenerovanou zprávu a vložte ji do komentáře',
                please_note: 'Vezměte prosím na vědomí',
                credits: 'Kredity',
                no_translation: 'Nebyl nalezen žádný překlad',
                choose_lang: 'Vyber jazyk',
                add_lang: 'Přidat nový jazyk',
                language: 'Jazyk',
                enter_lang_name: 'Zadejte prosím název jazyka',
                send: 'Generovat zprávu',
                name: 'Jméno',
            },
            buttons: {
                sav: "Uložit", ins: "Vložit", res: "Resetovat"
            }
        },
        //////////////////////////////////////////////
        //     Romanian Translation by Nicolae01    //
        //////////////////////////////////////////////
        ro: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://ro.forum.grepolis.com/index.php?threads/script-dio-tools-david1327.12961/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools oferă, printre altele, câteva afișaje, emoticoane, opțiuni de tranzacționare și unele modificări ale aspectului.",
                act: "Activați / dezactivați caracteristicile instrumentelor:",
                prv: "Previzualizarea mai multor funcții:",

                version_old: "Versiunea nu este la zi",
                version_new: "Versiunea este la zi",
                version_dev: "Versiunea dezvoltatorului",

                version_update: "Versiune la zi",
                Donate: "Donează",

                //forum: "",
                Update: "Actualizați " + dio_version,
                Feature: "Optiune noua",
                Feature2: "Versiune noua",
                Learn_more: "Aflați mai multe",

                cat_units: "Unități",
                cat_icons: "Iconițele pentru orașe",
                cat_forum: "Forum",
                cat_trade: "Magazin",
                cat_wonders: "Minunile Lumii",
                cat_layout: "Schemă",
                cat_other: "Diverse",
                //cat_Premium: "",
                cat_Quack: "Quack",

                install: "Instaleaza",
                reminder: "Adu-mi aminte mai tarziu",
                Available: "O noua versiune este disponibila",
                reqreload: "Reimprospatare nececsara",
                reload: "Reimprospateaza",
            },
            Options: {
                bir: ["Contor de bireme", "Numără câte bireme sunt în orașe și face suma lor"],
                ava: ["Vedere de ansamblu a unităților", "Numără unitățile din fiecare oraș și face suma lor"],
                ava2: ["Numărul mării", "Unitate de extensie"],
                sml: ["Emoticoane", "Extinde bb-cod-ul printr-o bară de emoticoane"],
                str: ["Puterea unității", "Adăugă tabele de rezistență a unității în diferite zone"],
                tra: ["Capacitate de transport", "Arată locurile de transport ocupate și libere în meniul unităților"],
                per: ["Comerț procentual", "Extinde în fereastra de comerț o tranzacție procentuală"],
                rec: ["Recrutarea comerțului", "Extinde în fereastra de comerț un comerț de recrutare"],
                cnt: ["Cuceriri", "Numără atacurile/suporturile din fereastra de cucerire"],
                way: ["Viteza unităților", "Afișează viteza îmbunătățită a trupelor în fereastra de atac / sprijin"],
                sim: ["Simulator", "Adaptarea simulatorului și afișarea permanentă a vrăjilor și bonusurilor"],
                act: ["Cutii de activitate", "Afișare îmbunătățită a ferestrelor de comerț și de activități (poziție memorată)"],
                pop: ["Fereastră Favoruri", "Modifică fereastra favorurilor"],
                tsk: ["Bara De Activități", "Crește bara de activități"],
                rew: ["Recompense zilnice", "Minimizează fereastra de recompense zilnice la pornire"],
                bbc: ["Forma de apărare", "Extinde fereastra bb-code-ului într-un formular de apărare automată"],
                com: ["Comparația unităților", "Adăugă tabele de comparare a unităților"],
                tic: ["Iconițele orașelor", "Fiecare oraș primește o iconiță pentru tipul orașului (detectare automată)", "Iconițe suplimentare sunt disponibile pentru selectarea manuală"],
                til: ["Lista orașelor", "Adds the town icons to the town list"],
                tim: ["Hartă", "Setează iconița orașului pe hartă"],
                tiw: ["Popup pictogramă", ""],
                wwc: ["Calculator", "Împarte calculul și contorizarea resurselor + butoanele anterioare și următoare pentru minunile lumii finalizate (momentan nu pot fi dezactivate!)"],
                wwr: ["Ranking", "Clasamentul minunilor lumii refăcut"],
                wwi: ["Iconițe", 'Adaugă iconița pentru minunile lumii pe hartă'],
                con: ["Meniu contextual", 'Schimbă „Selectați orașul” și „Prezentare generală a orașului” din meniul contextual'],
                sen: ["Unități trimise", 'Arată unitățile trimise în fereastra de atac/sprijin'],
                tov: ["Prezentare generală a orașului", 'Înlocuiește noua privire a orașului cu stilul vechi al ferestrei'],
                scr: ["Rotiță Mouse", 'Puteți schimba vizionările cu rotița mouse-ului'],
                Scr: ["Scrollbar", 'Schimbă stilul scrollbar-ului'],
                tow: ["Orașul BBCode", "Adăugați bbcode-ul orașului la fila localității"],
                Fdm: ["Selectați și ștergeți mai multe mesaje", "Puteți șterge mai multe mesaje. Funcția Quack"],
                Sel: ["Adăugare (Nu supraincarcati / Sterge)", "Îmbunătățirea noilor instrumente în fereastra de atac și sprijin. Funcția Quack"],
                Cul: ["Prezentare culturală (Administrator)", "Adăugați un contor pentru petrecere în vizualizarea culturii. Funcția Quack"],
                Hot: ["Comenzi rapide pentru tastatură pentru Windows", "Îți schimbă viața"],
                Isl: ["Vizualizarea insulei", "Creșterea înălțimii listei de orașe și sate. Funcția Quack"],
                Ish: ["Prezentare generală a satelor țărănești (căpitan)", "Ascundeți automat orașul. Funcția Quack"],
                Hio: ["Privire de ansamblu asupra pesterilor (Administrator)", "Permite sortarea oraselor. Funcția Quack"],
                Hid: ["Pestera", "Introdu 1500 monede de argint automat in campul selectat. Funcția Quack"],
                Tol: ["Lista orașelor din BB-Code", "Copiaza & lipeste. Funcția Quack"],
                Cib: ["Butonul vizualizare oraș", 'Adauga buton pentru deschiderea "vezi orasul" in meniul lateral al Grepolisului. Funcția Quack'],
                Ciw: ["Vezi oras", "Afiseaza vederea orasului in fereastra. Funcția Quack"],
                Tti: ["Resurse comerciale pentru festivaluri", "Faceți clic pe el și sunt schimbate doar către un festival. Funcția Quack"],
                Mse: ["Mesaje cu codul BB", "Conversia mesajelor în codul BB. Funcția Quack"],
                Rep: ["Rapoarte", "Adăugarea unui filtru de culori. Funcția Quack"],
                BBt: ["Butonul BBcode Informații jucător", "Adăugarea unui buton BBcode (jucător și alianță)"],
                Rtt: ["Îndepărtarea sfaturilor de instrumente ale unității", ""],
                Cup: ["Avansarea culturii (Administrator)", "A modificat prezentarea barei de progres și a adăugat o bară de progres pentru culturi. Funcția Akiway"],
                Cuo: ["Puncte de cultură (Administrator)", "Adăugați un contor pentru punctele de cultură. Funcția Quack"],
                Rct: ["Comerț -> Contor de resurse (Administrator)", "Un număr al tuturor resurselor din orașul dvs."],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Trimite rapoarte de eroare automatic", "Dacă activezi această opțiune, poți ajuta în identificarea erorilor."],
                her: ["Cucerirea Tracică", "Reducerea hărții cuceririi tracice."],
            },
            Town_icons: {
                LandOff: "Atac Terestru",
                LandDef: "Apărare Terestră",
                NavyOff: "Atac Naval",
                NavyDef: "Apărare Navală",
                FlyOff: "Zburătoare ofensive",
                FlyDef: "Zburătoare defensive",
                Out: "Afară",
                Emp: "Gol",
            },
            Color: {
                Blue: 'Albastru',
                Red: 'Roșu',
                Green: 'Verde',
                Pink: 'Roz',
                White: "alb",
            },
            labels: {
                uni: "Vedere de ansamblu unități",
                total: "Total",
                available: "Disponibile",
                outer: "Afară",
                con: "Alege orașul",
                /// Smileys
                std: "Standard",
                gre: "Grepolis",
                nat: "Natură",
                ppl: "Oameni",
                Par: "Petrecere",
                oth: "Altele",
                hal: "Halloween",
                xma: "Crăciun",
                eas: "Paște",
                lov: "Dragoste",
                /// Defense form
                ttl: "Vedere de ansamblu: Apărarea orașului",
                inf: "Informațiile orașului:",
                dev: "Deviere",
                det: "Detalii unități terestre",
                prm: "Bonusurile premium",
                sil: "Volumul argintului",
                mov: "Mișcările trupelor:",
                /// WW
                leg: "ML Participare",
                stg: "Stagiu",
                tot: "Total",
                /// Simulator
                str: "Puterea unităților",
                los: "Pierderi",
                mod: "fără modificator de influență",
                /// Comparison box
                dsc: "Comparare unități",
                hck: "Neascuțit",
                prc: "Ascuțit",
                dst: "Distanță",
                sea: "Naval",
                att: "Ofensiv",
                def: "Defensiv",
                spd: "Viteză",
                bty: "Pradă de război (resurse)",
                cap: "Capacitate de transport",
                res: "Cost (resurse)",
                fav: "Favoruri",
                tim: "Timp de recrutare (s)",
                /// Trade
                rat: "Raportul resurselor față de tipul de unitate",
                shr: "Ponderarea capacității de stocare a orașului țintă",
                per: "Procent resurse",
                /// Sent units box
                lab: "Unități trimise",
                rec: "Resurse",
                improved_movement: "Mișcare îmbunătățită a trupelor",
                donat: "Donații",
                Tran: "Traduceri",
                Happy: "An Nou Fericit!",
                Merry: "Ho Ho Ho, Crăciun fericit!",
                tow: "Orașul BBCode",
                ingame_name: ["Nu ezita sa ma contactezi daca preferi sa fi numit dupa numele de joc", ""]
            },
            tutoriel: {
                tuto: "Informații utile",
                reme: ["Mulțumesc tuturor celor care au contribuit dezvoltării DIO-Tools", ""],

                Trou: ["Tutorial Specializări Trupe Grepolis - Tutorialul lui david1327", "Tot ce trebuie să ști despre puterile / slăbiciunile trupelor de pe Grepolis"],
                util: ["Site-uri utilitare pentru Grepolis - Tutorialul lui david1327", "O multitudine de unelte pentru Grepolis: Statisticici, Hărți, Unelte, Scripturi, Forum ... toate sunt listate aici."]
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Ștergeți mai multe mesaje",
                delete_sure: "Esti sigur ca vrei sa stergi acest post?",
                no_selection: "Nici un post selectat",
                mark_All: "Marchează-le pe toate",
                //select unit shelper
                no_overload: 'Nu supraincarcati',
                delete: 'Sterge',
                //culture Overview
                cityfestivals: 'Festival oras',
                olympicgames: 'Jocuri olimpice',
                triumph: 'Parada triumfala',
                theater: 'Piese de teatru'
            },
            hotkeys: {
                hotkeys: 'Taste',
                Senate: 'Senat',
                city_select: 'Selectare oras',
                last_city: 'Ultimul oras',
                next_city: 'Urmatorul oras',
                jump_city: 'Salt la orasul curent',
                //administrator: "",
                captain: 'Capitan',
                trade_ov: 'Negot',
                command_ov: 'Comenzi',
                recruitment_ov: 'Recrutare',
                troop_ov: 'Privire de ansamblu a trupelor',
                troops_outside: 'Trupe din afara orasului',
                building_ov: 'Constructii',
                culture_ov: 'Cultura',
                gods_ov: 'Zei',
                cave_ov: 'Pesteri',
                city_groups_ov: 'Grupe orase',
                city_list: 'Lista orase',
                attack_planner: 'Planificator atacuri',
                farming_villages: 'Sate de farmat',
                menu: 'Meniu',
                city_view: 'Vezi oras ',
                messages: 'Mesaje',
                reports: 'Rapoarte',
                alliance: 'Alianta',
                alliance_forum: 'Forum Alianta',
                settings: 'Setari',
                profile: 'Profil',
                ranking: 'Clasament',
                notes: 'Notite',
                //chat: "",
                council: 'Consiliul eroilor'
            },
            messages: {
                ghosttown: 'Oras fantoma',
                no_cities: 'Nici un oras pe aceasta insula',
                all: 'toate',
                export: 'Converteste mesajul in BB-Code',
                Tol: 'Copiaza & lipeste (Funcția Quack)',
                copy: 'A copia',
                bbmessages: 'Mesaje ale BB-Code',
                copybb: 'BB-Code a fost copiat',
                écrit: 'a scris următoarele:',
            },
            caves: {
                stored_silver: 'Monede de argint stocate',
                silver_to_store: 'Monede de argint ce pot fi stocate',
                name: 'Nume',
                wood: 'Lemn',
                stone: 'Piatra',
                silver: 'Monede de argint ',
                //search_for: ""
            },
            grepo_mainmenu: {
                city_view: 'Vezi Oras',
                island_view: 'Vezi Insula'
            },
            transport_calc: {
                recruits: 'Numar unitati in asteptare de recrutare',
                //slowtrans : "",
                //fasttrans : "",
                //Lack: "",
                //Still: "",
                //pop: "",
                //Optipop : "",
                //army : "",
            },
            reports: {
                choose_folder: "",
                enacted: "",
                conquered: "",
                spying: "",
                spy: "",
                support: "",
                support2: "",
                supporting: "",
                attacking: "",
                farming_village: "",
                gold: "",
                Quests: "",
                Reservations: "",
            },
            translations: {
                info: 'Info',
                trans: 'Traducere pentru limbă',
                translations: 'Traduceri',
                trans_sure: 'Sunteți sigur că traducerea dvs. este gata să fie generată?',
                trans_success: 'Traducerea a fost trimisă cu succes',
                trans_fail: 'Traducerea nu a putut fi trimisă',
                trans_infotext1: 'Traducere disponibilă',
                trans_infotext2: 'Pentru a modifica sau a crea o nouă limbă, alegeți limba din meniul derulant',
                trans_infotext3: 'Când un text conține etichete HTML (deci tot ce este înconjurat de paranteze <>) vă rog să le păstrați acolo unde le-ați găsit',
                trans_infotext4: 'Când ați terminat traducerea, apăsați',
                trans_infotext5: 'Pentru a vă putea adăuga la credite, va fi generat porecla dvs.',
                trans_infotext6: 'Copiați mesajul generat și lipiți-l într-un comentariu',
                please_note: 'Vă rugăm să rețineți',
                credits: 'Credite',
                no_translation: 'Nu s-a găsit nicio traducere',
                choose_lang: 'Alege limba',
                add_lang: 'Adăugați o nouă limbă',
                language: 'Limba',
                enter_lang_name: 'Vă rugăm să introduceți un nume de limbă',
                send: 'Generați mesaj',
                name: 'Nume',
            },
            buttons: {
                sav: "Salvați", ins: "Introduceți", res: "Resetați"
            },
        },
        //////////////////////////////////////////////
        //   Néerlandais Translation by Firebloem   //
        //////////////////////////////////////////////
        nl: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                forum: "https://nl.forum.grepolis.com/index.php?threads/dio-tools-david1327.39609/",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: "DIO-Tools biedt onder andere, enkele displays, een smileybox,<br> handelsopties en enkele wijzigingen in de lay-out.",
                act: "Functies van de toolset activeren/deactiveren:",
                prv: "Voorbeeld van verschillende functies:",

                version_old: "Versie is niet actueel",
                version_new: "Versie is bijgewerkt",
                version_dev: "Ontwikkelaarsversie",

                version_update: "Update",
                Donate: "Doneer",

                //forum: "",
                Update: "Bijwerken " + dio_version,
                Feature: "Nieuwe functie",
                Feature2: "Nieuwe versie",
                Learn_more: "Kom meer te weten",

                cat_units: "Eenheden",
                cat_icons: "Stad pictogrammen",
                cat_forum: "Forum",
                cat_trade: "Handel",
                cat_wonders: "Wereld Wonder",
                cat_layout: "Lay-out",
                cat_other: "Diversen",
                //cat_Premium: "",
                cat_Quack: "Quack",

                install: "installeer",
                reminder: "Herinner mij later",
                Available: "Er is een nieuwe versie beschikbaar",
                reqreload: "Het is nodig om de site opnieuw te laden",
                reload: "Opnieuw laden",
            },
            Options: {
                //bir: ["Biremen teller", "Telt de biremen van een stad en somt deze op"],
                ava: ["Eenheden overzicht", "Telt de eenheden van alle steden"],
                ava2: ["Oceaan nummer", "Uitbreidingseenheid"],
                sml: ["Smileys", "Verlengt de bbcodebalk met een smileytabel"],
                str: ["Eenheidssterkte", "Voegt eenheidstabellen toe op verschillende gebieden"],
                tra: ["Transportcapaciteit", "Toont de bezette en beschikbare transportcapaciteit in het eenhedenmenu"],
                per: ["Procentuele handel", "Verlengt het handelsvenster met een procentuele transactie"],
                rec: ["Wervingshandel", "Vergroot het handelsvenster met een wervingshandel"],
                cnt: ["Verovering", "Telt de aanvallen/ondersteuningen in het veroveringsvenster"],
                way: ["Troepen snelheid", "Toont verbeterde troepsnelheid in het aanval/ondersteuningsvenster"],
                sim: ["Simulator", "Aanpassing van de simulatorlay-out & permanente weergave van de uitgebreide modificatietabel"],
                act: ["Activiteit vakken", "Verbeterde weergave van handels- en troep activiteitentabel (positiegeheugen)"],
                pop: ["Gunst pop-up", "Veranderd de gunst pop-up"],
                tsk: ["Taakbalk", "Vergroot de taakbalk"],
                rew: ["Beloning venster", 'Minimaliseert het dagelijkse belonings venster bij het opstarten'],
                bbc: ["Verdedigingsformulier", "Verlengt de bbcode-balk met een automatisch verdedigingsformulier"],
                com: ["Eenheidsvergelijking", "Voegt eenheid vergelijkingstabellen toe"],
                tic: ["Stad pictogrammen", "Elke stad ontvangt een pictogram voor het stadstype (automatische detectie)", " Extra pictogrammen zijn beschikbaar voor handmatige selectie"],
                til: ["Stedenlijst", "Voegt de stadspictogrammen toe aan de stedenlijst"],
                tim: ["Kaart", "Stelt de stadspictogrammen in op de strategische kaart"],
                tiw: ["Pictogram popup", ""],
                wwc: ["Calculator", "Deel berekening & grondstoffen teller + vorige & volgende knoppen op voltooide wereldwonderen (momenteel niet deactiveren!)"],
                wwr: ["Ranking", "Vernieuwde ranglijsten voor wereldwonderen"],
                wwi: ["Pictogrammen", 'Voegt wereldwonderpictogrammen toe op de strategische kaart'],
                con: ["Contextmenu", 'Wisselt "Selecteer stad" en "Stadsoverzicht" in het contextmenu'],
                sen: ["Verzonden eenheden", 'Toont verzonden eenheden in het aanval/ondersteuningsvenster'],
                tov: ["Stadsoverzicht", 'Vervangt het nieuwe stadsoverzicht door de oude vensterstijl'],
                scr: ["Muis wiel", 'U kunt de weergaven wijzigen met het muiswiel'],
                Scr: ["Scrollbar", 'Wijzig de stijl van de schuifbalk'],
                tow: ["Stad bbcode", "Voegt de stad bbcode toe aan het stadstabblad"],
                Fdm: ["Selecteer en verwijder meerdere berichten", "U kunt meer dan één bericht verwijderen. Quack-functie"],
                Sel: ["Toevoegen (niet overbelasten / Verwijderen)", "Verbetering van nieuwe tools in het aanvals- en ondersteuningsvenster. Quack-functie"],
                Cul: ["Cultuuroverzicht (Bestuurder)", "Voeg een teller toe voor het feest in de cultuurweergave. Kwakelfunctie"],
                Hot: ["Sneltoetsen voor Windows", "Het verandert je leven"],
                Isl: ["Visualisatie van het eiland", "Verhoog de hoogte van de lijst met steden en dorpen. Quack-functie"],
                Ish: ["Overzicht van boerendorpen (kapitein)", "Verberg automatisch de stad. Quack-functie"],
                Hio: ["Grottenoverzicht (Bestuurder)", "Het sorteren van steden mogelijk maken. Quack-functie"],
                Hid: ["Grot", "Zilver over 15000 automatisch in het invoerveld toevoegen. Quack-functie"],
                Tol: ["Lijst met steden in BB-Code", "Kopiëren & plakken. Quack-functie"],
                Cib: ["Stadszicht knop", "Een button voor het openen van de stadsoverzicht aan het zijkant menu toevoegen. Quack-functie"],
                Ciw: ["Stadsoverzicht", "Laat het stadsoverzicht zien in een scherm. Quack-functie"],
                Tti: ["Ruil bronnen voor festivals", "Klik erop en het wordt alleen uitgewisseld voor een festival. Quack-functie"],
                Mse: ["BB-Code-berichten", "Converteer berichten naar BB-Code. Quack-functie"],
                Rep: ["Reports", "Een kleurenfilter toevoegen. Quack-functie"],
                BBt: ["BBcode-knop Spelerinfo", "Toevoeging van een BBcode-knop (speler en alliantie)"],
                Rtt: ["Verwijderen van de tooltips van de unit", ""],
                Cup: ["Cultuurbevordering (Beheerder)", "De presentatie van de voortgangsbalk gewijzigd en een voortgangsbalk voor gewassen toegevoegd. Functie van Akiway"],
                Cuo: ["Cultuurpunten (Beheerder)", "Voeg een teller toe voor de Cultuurpunten. Quack-functie"],
                Rct: ["Handel -> Grondstoffenteller (Beheerder)", "Een telling van alle grondstoffen in je stad"],
                //FLASK : ["",""],
                //Mole : ["",""],

                err: ["Stuur automatisch bugrapporten", "Als u deze optie activeert, kunt u helpen bij het identificeren van bugs."],
                her: ["Thracische verovering", "Verkleinen van de kaart van de verovering van Thracië."],
            },
            movement: {
                //off: "",
                //offs: "",
                //def: "",
                //defs: "",
            },
            Town_icons: {
                LandOff: "Landoffensief",
                LandDef: "Landverdediging",
                NavyOff: "Zee-offensief",
                NavyDef: "Zee-verdediging",
                FlyOff: "Vliegend Offensief",
                FlyDef: "Vliegend Verdediging",
                Out: "Buiten",
                Emp: "Leeg",
            },
            Color: {
                Blue: 'Blauw',
                Red: 'Rood',
                Green: 'Groen',
                Pink: 'Roze',
                White: "Wit",
            },
            labels: {
                uni: "Eenheden overzicht",
                total: "Totaal",
                available: "Beschikbaar",
                outer: "Buiten",
                con: "Stad selecteren",
                /// Smileys
                std: "Standaard",
                gre: "Grepolis",
                nat: "Natuur",
                ppl: "Mensen",
                Par: "Feest",
                oth: "Anders",
                hal: "Halloween",
                xma: "Kerstmis",
                eas: "Pasen",
                lov: "Liefde",
                /// Defense form
                ttl: "Overzicht: Stadsverdediging",
                inf: "Stadsinformatie:",
                dev: "Afwijking",
                det: "Gedetailleerde landeenheden",
                prm: "Premium bonussen",
                sil: "Zilver volume",
                mov: "Troepenbewegingen:",
                /// WW
                leg: "WW Aandeel",
                stg: "Stadium",
                tot: "Totaal",
                /// Simulator
                str: "Eenheidssterkte",
                los: "Verloren",
                mod: "zonder invloed van modificator",
                /// Comparison box
                dsc: "Eenheidsvergelijking",
                hck: "Slag",
                prc: "Steek",
                dst: "Afstand",
                sea: "Zee",
                att: "Offensief",
                def: "Defensief",
                spd: "Snelheid",
                bty: "Buit (grondstoffen)",
                cap: "Transportcapaciteit",
                res: "Kosten (grondstoffen)",
                fav: "Gunst",
                tim: "Bouwtijd (s)",
                /// Trade
                rat: "Grondstoffenverhouding van een eenheidstype",
                shr: "Deel van de opslagcapaciteit van de doelstad",
                per: "Procentuele handel",
                /// Sent units box
                lab: "Verzonden eenheden",
                rec: "Middelen",
                improved_movement: "Verbeterde troepbeweging",
                Tran: "Vertalingen",
                donat: "Doneren",
                Happy: "Gelukkig nieuwjaar!",
                Merry: "Ho Ho Ho, Merry Christmas!",
                tow: "BBCode stad",
                loc: "Lokaal",
                ingame_name: ["Aarzel niet om contact met me op te nemen als je liever gebeld wordt met je bijnaam ", " Omdat het een grote hoeveelheid werk is die lang kan duren, ben ik altijd erg dankbaar voor elke vorm van ondersteuning. Daarom wil ik iedereen bedanken die ondersteuning heeft geboden voor dit project, hetzij door donaties, kennis, creativiteit, foutmeldingen of slechts enkele bemoedigende woorden."],
                raf: "Bij accepteren zal de pagina vernieuwen",
            },
            tutoriel: {
                tuto: "=Grepolis Gidsen=",
                reme: "Ik dank iedereen die heeft bijgedragen aan de ontwikkeling van DIO-Tools",

                Trou: ["Grepolis Troepen Specialisatie Tutorial - tuto de david1327", "Wat u moet weten over de troepen van grepolis, Sterke/zwakke punten van de eenheden"],
                util: ["Hulpprogramma's voor grepolis - Tuto de david1327", "Een veelheid aan tools voor Grepolis: Statistieken, Kaarten, Tools, Script, Forum ... ze worden hier allemaal vermeld."]
            },
            Quack: {
                // delete multiple forum
                delete_mul: "Verwijder meerdere berichten",
                delete_sure: "Wil je deze berichten echt verwijderen?",
                no_selection: "Geen berichten geselecteerd",
                mark_All: "Markeer alles",
                //select unit shelper
                no_overload: 'niet overbelasten',
                delete: 'Verwijderen',
                //culture Overview
                cityfestivals: 'Stadsfeest',
                olympicgames: 'Olympische Spelen',
                triumph: 'Zegetocht',
                theater: 'Theatervoorstellingen'
            },
            hotkeys: {
                hotkeys: 'Sneltoetsen',
                Senate: 'Senaat',
                city_select: 'Stedenkeuze',
                last_city: 'Vorige stad',
                next_city: 'Volgende stad',
                jump_city: 'Spring naar de huidige stad',
                administrator: 'Bestuurder',
                captain: 'Kapitein',
                trade_ov: 'Handel',
                command_ov: 'Bevelen',
                recruitment_ov: 'Rekrutering',
                troop_ov: 'Troepenoverzicht',
                troops_outside: 'Troepen buiten',
                building_ov: 'Gebouwen',
                culture_ov: 'Cultuur',
                gods_ov: 'Goden',
                cave_ov: 'Grotten',
                city_groups_ov: 'Stadsgroepen',
                city_list: 'Stedenlijst',
                attack_planner: 'Aanvalsplanner',
                farming_villages: 'Boerendorpen',
                //menu: "",
                city_view: 'Stadsoverzicht',
                messages: 'Berichten',
                reports: 'Rapporten',
                alliance: 'Alliantie',
                alliance_forum: 'Alliantieforum',
                settings: 'Instellingen',
                profile: 'Profiel',
                ranking: 'Ranglijst',
                notes: 'Notities',
                //chat: "",
                council: 'Raad van Helden'
            },
            messages: {
                ghosttown: 'Spookstad',
                no_cities: 'Geen steden op dit eiland',
                all: 'alle',
                export: 'Converteer bericht in BB-code',
                Tol: 'Kopiëren & plakken (Quack-functie)',
                copy: 'kopiëren',
                bbmessages: 'BB-Code-berichten',
                copybb: 'BBCode is gekopieerd',
                écrit: 'heeft het volgende geschreven:',
                cli: "Dit bericht is niet gekopieerd",
            },
            caves: {
                stored_silver: 'Opgeslagen zilverstukken',
                silver_to_store: 'Maximaal op te slaan zilverstukken',
                name: 'Naam',
                wood: 'Hout',
                stone: 'Steen',
                silver: 'Zilverstukken',
                search_for: "Zoeken naar"
            },
            grepo_mainmenu: {
                city_view: 'Stadsoverzicht',
                island_view: 'Eilandoverzicht'
            },
            transport_calc: {
                recruits: 'Eenheden in de rekruteringsrij meetellen',
                slowtrans: "Tel trage transport schepen",
                fasttrans: "Tel snelle transport schepen",
                Lack: "Gebrek",
                Still: "Nog steeds",
                pop: "Vrij inwoners. Voor de",
                Optipop: "Optimale bevolking voor",
                army: "Je hebt geen troepen",
            },
            reports: {
                choose_folder: "Kies map",
                enacted: "uitgevaardigd",
                conquered: "Veroverd",
                spying: "Spioneren",
                spy: "Spion",
                support: "Ondersteunen",
                support2: "Kan niet ondersteunen",
                supporting: "Gestationeerd",
                attacking: "Aanval",
                farming_village: "Booerendorp",
                gold: "Je hebt ontvangen",
                Quests: "Quests",
                Reservations: "Reserveringen",
            },
            translations: {
                info: 'Info',
                trans: 'Vertaling voor taal',
                translations: 'Vertalingen',
                trans_sure: 'Weet u zeker dat uw vertaling klaar is om gegenereerd te worden?',
                trans_success: 'De vertaling is succesvol verzonden',
                trans_fail: 'De vertaling kon niet verzonden worden',
                trans_infotext1: 'Vertaling beschikbaar',
                trans_infotext2: 'Om een nieuwe taal te wijzigen of aan te maken, kiest u de taal in het drop-down menu',
                trans_infotext3: 'Als een tekst HTML-tags bevat (dus alles wat tussen <> haakjes staat), vraag ik je om ze te bewaren waar je ze hebt gevonden',
                trans_infotext4: 'Als je klaar bent met vertalen, druk dan op',
                trans_infotext5: 'Om u aan de aftiteling te kunnen toevoegen, wordt uw nickname gegenereerd',
                trans_infotext6: 'Kopieer het gegenereerde bericht en plak het in een opmerking',
                please_note: 'Let op',
                credits: 'Credits',
                no_translation: 'Geen vertaling gevonden',
                choose_lang: 'Kies taal',
                add_lang: 'Voeg een nieuwe taal toe',
                language: 'Taal',
                enter_lang_name: 'Voer een taalnaam in',
                send: 'Genereer bericht',
                name: 'naam',
            },
            buttons: {
                sav: "Opslaan", ins: "Invoegen", res: "Reset"
            }
        },
        //////////////////////////////////////////////
        //      GREEK Translation by AbstractGR     //
        //////////////////////////////////////////////
        gr: {
            Notification: {
                //A: "",
                //B: "",
                //C: "",
            },
            link: {
                ///update
                //update: "",
                //update_direct: "",
                ///donate:
                //Donate: "",
                ///autre
                //Update: "",
                //contact: "",
                //forum: "",
                //link_troupes: "",
                //link_utile: "",
                ///help
                //available_units: "",
                //UnitComparison: "",
                //MessageExport: "",
                //Translations: "",
            },
            Settings: {
                dsc: 'Το DIO-Tools προσφέρει, ανάμεσα σε άλλα πράγματα, κάποιες νέες απεικονίσεις, μενού με smiley, επιλογές εμπορίου και κάποιες αλλαγές στο σχέδιο του παιχνιδιού.',
                act: 'Ενεργοποίησε/απενεργοποίησε τα χαρακτηριστικά του συνόλου των εργαλείων:',
                prv: 'Προεπισκόπηση μερικών χαρακτηριστικών:',

                version_old: 'Η έκδοση δεν είναι ενημερωμένη',
                version_new: 'Η έκδοση είναι ενημερωμένη',
                version_dev: 'Έκδοση προγραμματιστή',

                version_update: 'Αναβάθμιση',
                Donate: 'Δωρεά',

                //forum: "",
                Update: 'Έκδοση' + dio_version,
                Feature: 'Νέο χαρακτηριστικό',
                Feature2: 'Νέα έκδοση',
                Learn_more: 'Μάθε περισσότερα',

                cat_units: 'Μονάδες',
                cat_icons: 'Εικονίδια πόλεων',
                cat_forum: 'Φόρουμ',
                cat_trade: 'Εμπόριο',
                cat_wonders: 'Θαύμα του κόσμου',
                cat_layout: 'Σχέδιο',
                cat_other: 'Διάφορα',
                //cat_Premium: "",
                cat_Quack: "Quack",
            },
            Options: {
                //bir: ["", ""],
                ava: ['Επισκόπηση μονάδων', 'Μετράει όλες τις μονάδες από όλες τις πόλεις'],
                ava2: ['Αριθμός ωκεανού', 'Μονάδα επέκτασης'],
                sml: ['Smilies', 'Επεκτείνει τη μπάρα bbcode ανά μενού με smilies'],
                str: ['Δύναμη μονάδας', 'Προσθέτει τους πίνακες με τις δυνάμεις των μονάδων σε πολλά σημε'],
                tra: ['Χωρητικότητα μεταφορικών', 'Δείχνει τα χρησιμοποιούμενη και διαθέσιμη χωρητικότητα των μεταφορικών στο μενού με τις μονάδες'],
                per: ['Ποσοστιαίο εμπόριο', 'Επεκτείνει το παράθυρο του εμπορίου με μια επιλογή ποσοστιαίου εμπορίου'],
                rec: ['Κόστος στρατολόγησης', 'Επεκτείνει το παράθυρο εμπορίου με μια επιλογή για το κόστος στρατολόγησης'],
                cnt: ['Κατακτήσεις', 'Μετράει τις επιθέσεις/υποστηρίξεις στο παράθυρο κατάκτησης'],
                way: ['Ταχύτητα μονάδας', 'Παρουσιάζει τη βελτιωμένη ταχύτητα μονάδας στο παράθυρο επίθεσης/υποστήριξης'],
                sim: ['Προσομοιωτής', 'Προσαρμογή του προσομοιωτή & μόνιμη παρουσίαση του μενού τροποποίησης σαν επέκταση'],
                act: ['Μενού δραστηριότητας', 'Βελτιωμένη παρουσίαση του εμπορίου και της στρατολόγησης(μνήμη θέσης)'],
                pop: ['Αναδυόμενο μενού εύνοιας', 'Αλλάζει το αναδυόμενο μενού εύνοιας'],
                tsk: ['Μπάρα έργων', 'Αυξάνει τη μπάρα έργων'],
                rew: ['Καθημερινή ανταμοιβή', 'Ελαχιστοποιεί το παράθυρο καθημερινής ανταμοιβής κατά την εκκίνηση'],
                bbc: ['Φόρμα άμυνας', 'Επεκτείνει τη μπάρα κωδικών bb με μια αυτοματοποιημένη φόρμα άμυνας'],
                com: ['Σύγκριση μονάδων', 'Προσθέτει πίνακες με συγκρίσεις μονάδων'],
                tic: ['Εικονίδια πόλεων', 'Κάθε πόλη αποκτά ένα εικονίδιο ανάλογα το τύπο πόλης (αυτόματη αναγνώριση),Επιπρόσθετα εικονίδια είναι διαθέσιμα για χειροκίνητη επιλογή'],
                til: ['Λίστα πόλεων', 'Προσθέτει τα εικονίδια πόλεων στη λίστα πόλεων'],
                tim: ['Χάρτης', 'Θέτει τα εικονίδια πόλεων στο στρατηγικό χάρτη'],
                tiw: ['Αναδυόμενα παράθυρα εικονιδίων', ''],
                wwc: ['Αριθμομηχανή', 'Κοινοποιεί τους υπολογισμούς & τους μετρητές πόρων + κουμπιά για προηγούμενο & επόμενο σε τελειωμένα θαύματα του κόσμου (προσωρινά δεν μπορεί να απενεργοποιηθεί!)'],
                wwr: ['Κατάταξη', 'Εκ νέου σχεδιασμός για τις κατατάξεις των θαυμάτων του κόσμου'],
                wwi: ['Εικονίδια', 'Προσθέτει εικονίδια για θαύμα του κόσμου στο στρατηγικό χάρτη'],
                con: ['Μενού περιεχομένου', 'Ανταλλάσει την "Επιλογή πόλης" με την "Προεπισκόπηση πόλης" στο μενού περιεχομένου'],
                sen: ['Σταλμένες μονάδες', 'Δείχνει τις μονάδες που έχουν αποσταλεί στο παράθυρο επίθεσης/υποστήριξης'],
                tov: ['Επισκόπηση πόλης', 'Αντικαθιστά την νέα επισκόπηση πόλης με το παλιό στύλ παραθύρου'],
                scr: ['Ροδέλα ποντικιού', 'Μπορείς να αλλάξεις τις όψεις της πόλης με τη ροδέλα του ποντικιού'],
                Scr: ['Scrollbar', 'Άλλαξε το στυλ του scrollbar (Δεν είναι διαθέσιμο στο firefox)'],
                tow: ['bbcode πόλης', 'Προσθέτει τον bbcode της πόλης στο παράθυρο επιλογής πόλης'],
                Fdm: ['Διάλεξε και σβήσε πολλά μηνύματα', 'Μπορείς να σβήσεις περισσότερα από ένα μηνύματα. Λειτουργία Quack'],
                Sel: ['Πρόσθεσε (Όχι υπερχείλιση/Σβήσιμο)', ' Βελτίωση των νέων εργαλείων στο παράθυρο επίθεσης και άμυνας. Λειτουργία Quack'],
                Cul: ['Επισκόπηση πολιτιστικού επιπέδου (Διαχειριστής)', 'Προσθέτει μετρητή για την ομάδα στην επισκόπηση πολιτιστικού επιπέδου. Λειτουργία Quack'],
                Hot: ['Κουμπιά για συντομία ενεργειών για τα Windows', 'Αλλάζει τη ζωή σου'],
                Isl: ['Απεικόνιση του νησιού', 'Αυξάνει το ύψος της λίστας των πόλεων και των χωριών του νησιού'],
                Ish: ['Επισκόπηση αγροτικών χωριών (Καπετάνιος)', 'Αυτόματα κρύβει τη πόλη. Λειτουργία Quack'],
                Hio: ['Επισκόπηση σπηλιών (Διαχειριστής)', 'Επιτρέπει στην ταξινόμηση των πόλεων. Λειτουργία Quack'],
                Hid: ['Σπηλιά', 'Εισάγει αυτόματα ασήμι στο πεδίο εισαγωγής της σπηλιάς αν είναι πάνω από 15000. Λειτουργία Quack'],
                Tol: ['Λίστα από πόλεις σε κωδικούς BB', 'Αντιγραφή & επικόλληση. Λειτουργία Quack'],
                Cib: ['Κουμπί επισκόπησης πόλης', 'Προσθέτει ένα κουμπί για το άνοιγμα της επισκόπησης της πόλης στο πλάγιο μενού του Grepolis. Λειτουργία Quack'],
                Ciw: ['Επισκόπηση πόλης', 'Παρουσίαση της επισκόπησης της πόλης σε παράθυρο. Λειτουργία Quack'],
                Tti: ['Εμπόριο πόρων για γιορτές', 'Κλίκαρε πάνω του και θα ανταλλάξει πόρους ώστε να φτάσουν για γιορτή πόλης. Λειτουργία Quack'],
                Mse: ['Μηνύματα σε bbcode', 'Μετατροπή μηνυμάτων σε bbcode. Λειτουργία Quack'],
                Rep: ['Αναφορές', 'Πρόσθεση φίλτρου χρώματος. Λειτουργία Quack'],
                BBt: ['Κουμπί bbcode για πληροφορίες παίχτη', 'Προσθήκη κουμπιού με bbcode (παίχτη και συμμαχίας)'],
                Rtt: ['Αφαίρεση του μηνύματος επεξήγησης των μονάδων', ''],
                Cup: ['Προβιβασμός επιπέδου Πολιτισμού (Διαχειριστής)', 'Άλλαξε την παρουσίαση της μπάρας προόδου και πρόσθεσε μια μπάρα προόδου για τους πόρους. Λειτουργία του Akiway'],
                Cuo: ["Σημεία Πολιτισμού (Διαχειριστής)", "Προσθέστε έναν μετρητή για τα Σημεία Πολιτισμού. Λειτουργία Quack"],
                Rct: ['Εμπόριο -> Μετρητής πόρων (Διαχειριστής)', 'Μια μέτρηση όλων των πόρων στην πόλη σου'],
                FLASK: 'Μη συμβατή η ενεργοποίηση των παραμέτρων του FLASK-TOOLS',
                Mole: 'Μη συμβατή η ενεργοποίηση των παραμέτρων του Mole Hole',

                err: ['Στείλε αναφορές για bug αυτόματα', 'Αν ενεργοποιήσεις αυτή την επιλογή, μπορείς να βοηθήσεις στην εύρεση προβλημάτων του παιχνιδιού.'],
                //her: ["", ""],
            },
            Town_icons: {
                LandOff: 'Επιθετικά ξηράς',
                LandDef: 'Αμυντικά ξηράς',
                NavyOff: 'Επιθετικός στόλος',
                NavyDef: 'Αμυντικός στόλος',
                FlyOff: 'Ιπτάμενα επιθετικά',
                FlyDef: 'Ιπτάμενα αμυντικά',
                Out: 'Εξωτερικά',
                Emp: 'Άδειο',
            },
            Color: {
                Blue: 'Μπλε',
                Red: 'Κόκκινο',
                Green: 'Πράσινο',
                Pink: 'Ροζ',
                White: 'Άσπρο',
            },
            labels: {
                uni: 'Προεπισκόπηση μονάδων',
                total: 'Σύνολο',
                available: 'Διαθέσιμα',
                outer: 'Έξω',
                con: 'Διάλεξε πόλη',
                /// Smileys
                std: 'Πρότυπο',
                //gre: "",
                nat: 'Φύση',
                ppl: 'Άνθρωποι',
                Par: 'Party',
                oth: 'Άλλα',
                hal: 'Απόκριες',
                xma: 'Χριστούγεννα',
                eas: 'Πάσχα',
                lov: 'Αγάπη',
                /// Defense form
                ttl: 'Προεπισκόπηση: Άμυνα πόλης',
                inf: 'Πληροφορίες πόλης:',
                dev: 'Απόκλιση',
                det: 'Λεπτομερής μονάδες ξηράς',
                prm: 'Δώρα premium',
                sil: 'Όγκος ασημιού',
                mov: 'Κινήσεις στρατευμάτων:',
                /// WW
                leg: 'Μερίδιο θαύματος του κόσμου',
                stg: 'Στάδιο',
                tot: 'Σύνολο',
                /// Simulator
                str: 'Δύναμη μονάδας',
                los: 'Ήττα',
                mod: 'χωρίς επιρροή τροποποίησης',
                /// Comparison box
                dsc: 'Σύγκριση μονάδων',
                hck: 'Κρουστικό',
                prc: 'Διατρητικό',
                dst: 'Εκήβολο',
                sea: 'Θάλασσα',
                att: 'Επιθετικά',
                def: 'Αμυντικά',
                spd: 'Ταχύτητα',
                bty: 'Λεία (πόροι)',
                cap: 'Χωρητικότητα μεταφορικών',
                res: 'Κόστη (πόροι)',
                fav: 'Εύνοια',
                tim: 'Χρόνος στρατολόγησης (δ)',
                /// Trade
                rat: 'Αναλογία πόρων ενός τύπου μονάδων',
                shr: 'Μερίδιο της χωρητικότητας της αποθήκης του στοχευμένης πόλης',
                per: 'Ποσοστιαίο εμπόριο',
                /// Sent units box
                lab: 'Σταλμένες μονάδες',
                rec: 'Πόροι',
                improved_movement: 'Βελτιωμένη κίνηση στρατευμάτων',
                Tran: 'Μεταφράσεις',
                donat: 'Δωρεές',
                Happy: 'Χαρούμενο το νέο έτος!',
                Merry: 'Χο χο χο, Καλά Χριστούγεννα!',
                tow: 'Κωδικός BB πόλης',
                ingame_name: ['Μη διστάσετε να επικοινωνήσετε μαζί μου αν προτιμάτε να καλείστε με το όνομα του παιχνιδιού που έχετε', 'Καθώς είναι μεγάλο το έργο και μπορεί να είναι αρκετά χρονοβόρο προσπαθώ πάντα να είμαι ευγνώμων με κάθε είδους υποστήριξη. Για αυτό θα ήθελα να ευχαριστήσω όλους που με έχουν υποστηρίξει σε αυτό το έργο- είτε από δωρεές, γνώση, δημιουργηκότητα, αναφορές προβλημάτων ή με λίγα ενθαρρυντικά λόγια.'],
            },
            tutoriel: {
                tuto: 'Χρήσιμες πληροφορίες',
                reme: 'Ευχαριστώ όλους εκείνους που συνείσφεραν στην ανάπτυξη του DIO tools,',

                Trou: ['Φροντιστήριο για τις ειδικότητες των μονάδων του Grepolis - tuto de david1327', 'Ό,τι χρειάζεται να ξέρεις για τα στρατεύματα του grepolis Δυνάμεις/αδυναμίες των μονάδων'],
                util: ['Χρήσιμες ιστοσελίδες για το grepolis - tuto de david1327', 'Ένα πλήθος από εργαλεία για το Grepolis: Στατιστικά,Χάρτες,Εργαλεία,Σκριπτς,Φόρουμ ... αναφέρονται όλα εδώ.'],
            },
            Quack: {
                // delete multiple forum
                delete_mul: 'Διαγραφή πολλαπλών μηνυμάτων',
                delete_sure: 'Θες να διαγράψεις αυτά τα μηνύματα;',
                no_selection: 'Δεν έχουν επιλεγεί μηνύματα',
                mark_All: 'Σημείωσε τα όλα',
                //select unit shelper
                no_overload: 'Χωρίς υπερφόρτωση',
                delete: 'Διέγραψε',
                //culture Overview
                cityfestivals: 'Γιορτές πόλης',
                olympicgames: 'Ολυμπιακοί αγώνες',
                triumph: 'Παρελάσεις θριάμβου',
                theater: 'Θεατρικές παραστάσεις',
            },
            hotkeys: {
                hotkeys: 'Πλήκτρα γρήγορης πρόσβασης',
                Senate: 'Σύγκλητος',
                city_select: 'Επιλογή πόλης',
                last_city: 'Τελευταία πόλη',
                next_city: 'Επόμενη πόλη',
                jump_city: 'Πήγαινε στη τρέχουσα πόλη',
                administrator: 'Διαχειριστής',
                captain: 'Καπετάνιος',
                trade_ov: 'Εμπόριο',
                command_ov: 'Εντολές',
                recruitment_ov: 'Στρατολόγηση',
                troop_ov: 'Επισκόπηση στρατευμάτων',
                troops_outside: 'Εξωτερικά στρατεύματα',
                building_ov: 'Κτήρια',
                culture_ov: 'Πολιτισμός',
                gods_ov: 'Θεοί',
                cave_ov: 'Κρύψιμο προεπισκόπησης',
                city_groups_ov: 'Ομάδες πόλεων',
                city_list: 'Λίστα πόλεων',
                attack_planner: 'Συντονιστής επίθεσης',
                farming_villages: 'Αγροτικά χωριά',
                menu: 'Μενού',
                city_view: 'Επισκόπηση πόλης',
                messages: 'Μηνύματα',
                reports: 'Αναφορές',
                alliance: 'Συμμαχία',
                alliance_forum: 'Φόρουμ συμμαχίας',
                settings: 'Ρυθμίσεις',
                profile: 'Προφίλ',
                ranking: 'Κατάταξη',
                notes: 'Σημειώσεις',
                chat: 'Συνομιλία',
                council: 'Συμβούλιο των Ηρώων',
            },
            messages: {
                ghosttown: 'Πόλη φάντασμα',
                no_cities: 'Δεν υπάρχουν πόλεις σε αυτό το νησί',
                all: 'όλα',
                export: 'Μετατροπή μηνύματα σε κωδικούς BB',
                Tol: 'Αντιγραφή & Επικόλληση (Λειτουργία Quack)',
                copy: 'Αντιγραφή',
                bbmessages: 'Μηνύματα κωδικών BB ',
                copybb: 'Ο κωδικός BB έχει αντιγραφεί',
                écrit: 'έχει γράψει τα παρακάτω:',
            },
            caves: {
                stored_silver: 'Αποθηκευμένα ασημένα νομίσματα',
                silver_to_store: 'Ασημένια νομίσματα που μπορούν να αποθηκευτούν',
                name: 'Όνομα',
                wood: 'Ξύλο',
                stone: 'Πέτρα',
                silver: 'Ασημένια νομίσματα',
                search_for: 'Ψάξε για',
            },
            grepo_mainmenu: {
                city_view: 'Επισκόπηση πόλης',
                island_view: 'Επισκόπηση νησιού',
            },
            transport_calc: {
                recruits: 'Μέτρημα μονάδες στην ουρά στρατολόγησης',
                slowtrans: 'Μέτρημα αργών μεταφορικών πλοίων',
                fasttrans: 'Μέτρημα γρήγορων μεταφορικών πλοίων',
                Lack: 'Έλλειψη',
                Still: 'Ακίνητος',
                pop: 'διαθέσιμος πληθυσμός. Για την',
                Optipop: 'Βέλτιστος πληθυσμός για',
                army: 'Δεν έχεις στρατό.',
            },
            reports: {
                choose_folder: 'Διάλεξε φάκελο',
                enacted: 'εκτέλεσε',
                conquered: 'κατάκτησε',
                spying: 'κατασκοπεύει',
                spy: 'Κατάσκοπος',
                support: 'υποστήριξη',
                support2: "", //???
                supporting: 'υποστηρίζει',
                attacking: 'επιτίθεται',
                farming_village: 'αγροτικό χωριό',
                gold: 'Έχεις λάβει',
                Quests: 'Αποστολές',
                Reservations: 'Κρατήσεις',
            },
            translations: {
                info: 'Πληροφορίες',
                trans: 'Μετάφραση για γλώσσα',
                translations: 'Μεταφράσεις',
                trans_sure: 'Είσαι σίγουρος ότι η μετάφραση σου είναι έτοιμη να δημιουργηθεί;',
                trans_success: 'Η μετάφραση έχει σταλεί επιτυχώς',
                trans_fail: 'Η μετάφραση δεν μπορούσε να σταλεί',
                trans_infotext1: 'Διαθέσιμη μετάφραση',
                trans_infotext2: 'Για να τροποποιήσεις ή δημιουργήσεις μια νέα γλώσσα,διάλεξε τη γλώσσα στο αναπτυσσόμενο μενού',
                trans_infotext3: 'Όταν ένα κείμενο περιέχει ετικέτες HTML (δηλαδή όλα τα κείμενα που περιέχουν πριν και μετά <> αγκύλες) σου ζητώ να τις αφήσεις όπως τις βρήκες ',
                trans_infotext4: 'Όταν έχεις τελειώσει με τη μετάφραση πάτα',
                trans_infotext5: 'Για να είναι δυνατόν να προστεθείς στη λίστα συντελεστών,το ψευδώνυμο σου θα παραχθεί',
                trans_infotext6: 'Αντέγραψε το παραγμένο μήνυμα, και επικόλλησε το σε ένα σχόλιο',
                please_note: 'Παρακαλώ λάβε υπόψιν',
                credits: 'Λίστα συντελεστών',
                no_translation: 'Δεν βρέθηκε μετάφραση',
                choose_lang: 'Διάλεξε γλώσσα',
                add_lang: 'Πρόσθεσε νέα γλώσσα',
                language: 'Γλώσσα',
                enter_lang_name: 'Παρακαλώ εισήγαγε το νέο όνομα γλώσσας',
                send: 'Πάραγε μήνυμα',
                name: 'Όνομα',
            },
            buttons: {
                sav: 'Αποθήκευση', ins: 'Εισαγωγή', res: 'Επαναφορά',
            },
        },
    };

    LANG.ar = LANG.es;
    LANG.pt = LANG.br;

    console.debug("SPRACHE", MID);
    // Translation GET

    function getTexts(category, name, data) {
        var txt = "???", lang = MID;
        if (DATA.test.lang && !data) { lang = DATA.test.lang }
        if (LANG[lang]) {
            if (LANG[lang][category]) {
                if (LANG[lang][category][name]) { txt = LANG[lang][category][name]; }
                else {
                    if (LANG.en[category]) {
                        if (LANG.AUTO[category][name]) { txt = LANG.AUTO[category][name]; }
                        else if (LANG.en[category][name]) { txt = LANG.en[category][name]; }
                    }
                }
            } else {
                if (LANG.en[category]) {
                    if (LANG.AUTO[category][name]) { txt = LANG.AUTO[category][name]; }
                    else if (LANG.en[category][name]) { txt = LANG.en[category][name]; }
                }
            }
        } else {
            if (LANG.en[category]) {
                if (LANG.AUTO[category][name]) { txt = LANG.AUTO[category][name]; }
                else if (LANG.en[category][name]) { txt = LANG.en[category][name]; }
            }
        }
        return txt;
    }

    /*******************************************************************************************************************************
     * Settings
     *******************************************************************************************************************************/

    // (De)activation of the features
    var Options_def = {
        dio_bir: true,	// Biremes counter
        dio_ava: true,	// Available units
        dio_ava2: true,	// Available units
        dio_sml: true,	// Smileys
        dio_str: true,	// Unit strength
        dio_tra: true,	// Transport capacity
        dio_per: true,	// Percentual Trade
        dio_rec: true,	// Recruiting Trade
        dio_way: true,	// Troop speed
        dio_cnt: true,	// Attack/support counter
        dio_sim: true,	// Simulator
        dio_act: true,	// Activity boxes
        dio_tsk: true,	// Task bar
        dio_pop: true,	// Favor popup
        dio_bbc: true,	// BBCode bar
        dio_com: true,	// Unit comparison
        dio_TEST: false,// Unit comparison
        dio_tic: true,	// Town icons
        dio_tic2: true,	// Town icons
        dio_til: true,	// Town icons: Town list
        dio_tim: true,	// Town icons: Map
        dio_tiw: true,	// Town Popup
        dio_tpt: true,	// Town Popup troop
        dio_tis: true,	// Town Popup support
        dio_tih: true,	// Town Popup Hero
        dio_tir: true,	// Town Popup Resource
        dio_wwc: true,	// World wonder counter
        dio_wwr: false,	// World wonder ranking
        dio_wwi: false,	// World wonder icons
        dio_con: true,	// Context menu
        dio_sen: true,	// Sent units
        dio_tov: false,	// Town overview
        dio_scr: true,	// Mausrad,
        dio_Scr: true,	// Scrollbar Style
        dio_Tow: true,	// town bb
        dio_Rew: true,	// minimize Daily Reward
        dio_Fdm: true,	// ForumDeleteMultiple
        dio_Sel: true,	// selectunitshelper
        dio_Cul: true,	// cultureOverview
        dio_Cup: true,	// cultureProgress
        dio_Cuo: true,	// culturePoints
        dio_Hot: (system() ? (false) : (true)), // hotkeys
        dio_Isl: true,	// islandFarmingVillages
        dio_Ish: true,	// farmingvillageshelper
        dio_Hio: true,	// hidesOverview
        dio_Hid: true,	// hidesIndexIron
        dio_Tol: true,	// townslist
        dio_Cib: true,	// city_view_btn
        dio_Ciw: false,	// city_view_window
        dio_Cic: false,	// city_btn_construction
        dio_Tti: true,	// townTradeImprovement
        dio_Mse: true,	// MessageExport
        dio_Rep: true,	// reports
        dio_Rct: true,	// resCounter
        dio_BBt: true,	// BBtowninfo
        dio_Rtt: false,	// removeTooltipps
        dio_Buo: true,	// BuildingOverview
        dio_Cuc: true,	// cultureControl

        dio_err: false,	// Error Reports
        dio_her: true,	// Thrakische Eroberung

        //color
        dio_aaa: true,
        dio_bbb: false,
        dio_ccc: false,
        dio_ddd: false,
        dio_eee: false
    };

    if (!uw.Game.features.end_game_type == "end_game_type_world_wonder") {
        delete Options_def.dio_wwc;
        delete Options_def.dio_wwr;
        delete Options_def.dio_wwi;
    }

    if (!typeof (uw.MoleHoleOnBoard) == "undefined") {
        delete Options_def.dio_Ciw;
    }

    if (!typeof (uw.FLASK_GAME) == "undefined") {
        delete Options_def.dio_til;
        delete Options_def.dio_Sel;
    }

    if (uw.location.pathname.indexOf("game") >= 0) {
        for (var opt in Options_def) {
            if (Options_def.hasOwnProperty(opt)) { if (DATA.options[opt] === undefined) { DATA.options[opt] = Options_def[opt]; } }
        }
    }
    var version_text = '', version_color = 'black';
    $('<style id="dio_version">' +
        '#dio_version_info .version_icon { background: url(' + dio_sprite + ') -50px -50px no-repeat; width:25px; height:25px; float:left; z-index: 5; } ' +
        '#dio_version_info .version_icon.red { filter:hue-rotate(-100deg); -webkit-filter: hue-rotate(-100deg); } ' +
        '#dio_version_info .version_icon.green { filter:hue-rotate(0deg); -webkit-filter: hue-rotate(0deg); } ' +
        '#dio_version_info .version_icon.blue { filter:hue-rotate(120deg); -webkit-filter: hue-rotate(120deg); } ' +
        '#dio_version_info .version_text { line-height: 2; margin: 0px 6px 0px 6px; float: left;} ' +
        '</style>').appendTo("head");
    function getLatestVersion() {
        var version_latest = "??";
        try { version_latest = uw.dio_latest_version; } catch (error) { errorHandling(error, "dio_latest_version"); }
        var v_info = $('#dio_version_info');
        try {
            if (version_text === '') {
                if (dio_version > version_latest) {
                    version_text = "<a href='" + getTexts('link', 'update') + "' target='_blank' style='color:darkblue'><div class='version_icon blue'></div><div class='version_text'>" + getTexts("Settings", 'version_dev') + "</div><div class='version_icon blue'></div></a>";
                    version_color = 'darkblue';
                    $('.dio_settings .dio_icon').css({ filter: "hue-rotate(100deg)" });
                    tooltip_settings();
                } else if (dio_version == version_latest) {
                    version_text = "<a href='" + getTexts('link', 'update') + "' target='_blank' style='color:darkgreen'><div class='version_icon green'></div><div class='version_text'>" + getTexts("Settings", 'version_new') + "</div><div class='version_icon green'></div></a>";
                } else {
                    version_text = "<a href='" + getTexts('link', 'update') + "' target='_blank' style='color:crimson'><div class='version_icon red'></div><div class='version_text'>" + getTexts("Settings", 'version_old') + "</div><div class='version_icon red'></div></a>" +
                        "<a class='version_text' href='" + getTexts('link', 'update_direct') + "' target='_blank'>--> " + getTexts("Settings", 'version_update') + "</a>";
                    version_color = 'crimson';
                    $('.dio_settings .dio_icon').css({ filter: "hue-rotate(260deg)" });
                    tooltip_settings();
                }
                v_info.html(version_text).css({ color: version_color });
            }
            else { v_info.html(version_text).css({ color: version_color }); }

        } catch (error) {
            errorHandling(error, "getLatestVersion");
            if (version_text === '') {
                version_text = "<a href='" + getTexts('link', 'update') + "' target='_blank' style='color:crimson'><div class='version_icon red'></div><div class='version_text'>" + getTexts("Settings", 'version_old') + "</div><div class='version_icon red'></div></a>" +
                    "<a class='version_text' href='" + getTexts('link', 'update_direct') + "' target='_blank'>--> " + getTexts("Settings", 'version_update') + "</a>";
                version_color = 'crimson';
                $('.dio_settings .dio_icon').css({ filter: "hue-rotate(260deg)" });
                v_info.html(version_text).css({ color: version_color });
            }
            else { v_info.html(version_text).css({ color: version_color }); }
        }
    }

    /*******************************************************************************************************************************
     * Add DIO-Tools to grepo settings
     *******************************************************************************************************************************/

    // Styles
    $('<style id="dio_settings_style">' +
        // Chrome Scroollbar Style
        '#dio_settings ::-webkit-scrollbar { width: 13px; } ' +
        '#dio_settings ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
        '#dio_settings ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
        '#dio_settings ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +
        /* Button Up */
        '#dio_settings ::-webkit-scrollbar-button:single-button:vertical:decrement {height: 16px; background-image: url(' + Home_img + 'scroll-up-green.png);} ' +
        '#dio_settings ::-webkit-scrollbar-button:single-button:vertical:decrement:hover {height: 16px; background-image: url(' + Home_img + 'scroll-up-green-hover.png);} ' +
        /* Button Down */
        '#dio_settings ::-webkit-scrollbar-button:single-button:vertical:increment {height: 16px; background-image: url(' + Home_img + 'scroll-down-green.png);} ' +
        '#dio_settings ::-webkit-scrollbar-button:vertical:single-button:increment:hover {height: 16px; background-image: url(' + Home_img + 'scroll-down-green-hover.png);} ' +

        '#dio_settings table tr :first-child { text-align:center; vertical-align:top; } ' +

        '#dio_settings #dio_version_info { font-weight:bold; height: 40px; margin: -10px 0px -6px 10px; } ' +
        '#dio_settings #dio_version_info img { margin:-1px 2px -8px 0px; } ' +


        '#dio_settings .icon_types_table { font-size:0.7em; line-height:2.5; border:1px solid green; border-spacing:10px 2px; border-radius:5px; } ' +
        '#dio_settings .icon_types_table td { text-align:left; } ' +

        '#dio_settings table p { margin:0.2em 0em; } ' +

        '#dio_settings .checkbox_new .cbx_caption { white-space:nowrap; margin-right:10px; font-weight:bold; } ' +

        '#dio_settings .dio_settings_tabs {width:auto; border:2px solid darkgreen; background:#2B241A; padding:1px 1px 0px 1px; right:auto; border-top-left-radius:5px; border-top-right-radius:5px; border-bottom:0px;} ' +

        '#dio_settings .submenu_link {color: #000;} ' +

        '#dio_settings .dio_settings_tabs li { float:left; } ' +

        '#dio_settings .dio_icon_small { margin:0px; } ' +

        '#dio_settings img { max-width:90px; max-height:90px; margin-right:10px; } ' +

        '#dio_settings .content { border:2px solid darkgreen; border-radius:5px; border-top-left-radius:0px; background:rgba(31, 25, 12, 0.1); top:23px; position:relative; padding:10px 5px 10px 10px; height:392px; overflow-y:auto; margin-right:12px;} ' +
        '#dio_settings .content .content_category { display:none; } ' +

        '#dio_settings .dio_options_table legend { font-weight:bold; } ' +
        '#dio_settings .dio_options_table p { margin:0px; } ' +
        '#dio_settings #dio_donate_btn { filter: hue-rotate(45deg); -webkit-filter: hue-rotate(45deg); } ' +

        '#dio_hall table { border-spacing: 9px 3px; } ' +
        '#dio_hall table th { text-align:left !important;color:green;text-decoration:underline;padding-bottom:10px; } ' +
        '#dio_hall table td.value { text-align: right; } ' +

        '#dio_hall table td.laurel.green { background: url("/images/game/ally/founder.png") no-repeat; height:18px; width:18px; background-size:100%; } ' +
        '#dio_hall table td.laurel.green2 { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 0%; height:18px; width:18px; } ' +
        '#dio_hall table td.laurel.bronze { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 25%; height:18px; width:18px; } ' +
        '#dio_hall table td.laurel.silver { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 50%; height:18px; width:18px; } ' +
        '#dio_hall table td.laurel.gold { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 75%; height:18px; width:18px; } ' +
        '#dio_hall table td.laurel.blue { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 100%; height:18px; width:18px; } ' +
        '#dio_settings .radiobutton .disabled { color: #000000; } ' +

        '#dio_settings .défaut_s { background:url(' + Home_img + 'reset-icon.png) no-repeat; width:30px; height:30px; position: absolute; bottom: -19px; left: 3px; z-index: 100; cursor:pointer;} ' +
        '</style>').appendTo('head');

    function settings() {
        var wid = $(".settings-menu").get(0).parentNode.id;

        if (!$("#dio_tools").get(0)) {
            $(".settings-menu ul:last").append('<li id="dio_li"><img id="dio_icon" src="' + Home_img + 'smiley-emoticons-smile.gif"></div> <a id="dio_tools"> DIO-Tools-David1327</a></li>');
        }

        $(".settings-link").click(function () {
            $('.section').each(function () {
                this.style.display = "block";
            });
            $('.settings-container').removeClass("dio_overflow");

            $('#dio_bg_medusa').css({ display: "none" });

            if ($('#dio_settings').get(0)) {
                $('#dio_settings').get(0).style.display = "none";
            }
        });

        $("#dio_tools").click(function () {
            if ($('.email').get(0)) {
                $('.settings-container').removeClass("email");
            }

            $('.settings-container').addClass("dio_overflow");

            $('#dio_bg_medusa').css({ display: "block" });

            if (!$('#dio_settings').get(0)) {

                var Browser = getBrowser().replace(/(1|2|3|4|5|6|7|8|9|\ )/gm, "");
                var Navigator = navigator.language[0] + navigator.language[1];
                var trans = [(DATA.test.lang ? "Actuel " + (DATA.test.lang).toUpperCase() : getTexts("translations", "translations")), getTexts("buttons", "res") + " (" + (MID).toUpperCase() + ")"];
                (typeof (navigator) ? (LANG[Navigator] ? trans.push(getTexts("labels", "loc") + " " + Navigator.toUpperCase()) : "") : "");
                var dio_supported_lang = [getTexts("translations", "add_edit")];
                $.each(LANG, function (a, b) {
                    if (a != "AUTO") {
                        dio_supported_lang.push(a);
                    }
                });

                $('.settings-container').append(
                    '<div id="dio_settings" class="player_settings section"><div id="dio_bg_medusa"></div><div id="dio_bg_david1327"></div>' +
                    '<div class="game_header bold"><a href="' + getTexts("link", "update") + '" target="_blank" style="color:white">DIO-TOOLS-David1327 (v' + dio_version + ')</a>' +

                    '<div style="float: right; margin-top: -2px; margin-right: -5px">' + dio.grepo_dropdown_flag("dio_langdiv", dio_supported_lang, trans, null, getTexts("translations", "language"))[0].outerHTML + '</div>' +
                    '<div style="float: right; margin-right: 90px;" id="tuto2"><a target="_blank" style="color:white">BUG</a></div></div>' +

                    // Check latest version
                    '<div id="dio_version_info"><img src="' + Home_img + 'restricted.gif" /></div>' +

                    // Donate button
                    '<div id="dio_donate_btn" style="position:absolute; right: 50px;top: 28px;">' + dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate")) + '</div>' +
                    //
                    '<div class="défaut_s"></div>' +

                    // Settings navigation
                    '<ul class="menu_inner dio_settings_tabs">' +
                    '<li><a class="submenu_link active" id="dio_units"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_units") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_icons"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_icons") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_forum"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_forum") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_trade"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_trade") + '</span></span></span></a></li>' +
                    //((!$('.temple_commands').is(':visible')) ? (
                    //    '<li><a class="submenu_link" id="dio_wonder"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_wonders") + '</span></span></span></a></li>' ) : "") +
                    '<li><a class="submenu_link" id="dio_layout"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_layout") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_reports"><span class="left"><span class="right"><span class="middle">' + getTexts("labels", "att") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_other"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_other") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_Premium"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_Premium") + '</span></span></span></a></li>' +
                    '<li><a class="submenu_link" id="dio_Quack"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "cat_Quack") + '</span></span></span></a></li>' +
                    '</ul>' +

                    // Settings content
                    '<DIV class="content">' +
                    // Units tab
                    '<table id="dio_units_table" class="content_category visible"><tr>' +
                    '<td><img src="' + Home_img + 'available-units.90px.png" alt="available_units" /></td>' +
                    '<td><div id="dio_ava" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "ava")[0] + '</div></div><br>' +
                    '<div id="dio_ava2" style="display:none; margin-top: 5px;" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "ava2")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "ava")[1] + '</p>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'unites-envoyees.90px.png" alt="sent_units" /></td>' +
                    '<td><div id="dio_sen" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "sen")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "sen")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'force-unitaire.90px.png" alt="unit_strength" /></td>' +
                    '<td><div id="dio_str" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "str")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "str")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'transport-capacity.png" alt="transport_capacity" /></td>' +
                    '<td><div id="dio_tra" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tra")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "tra")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'comparaison-des-unites.90px.png" alt="unit_comparison" /></td>' +
                    '<td><div id="dio_com" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "com")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "com")[1] + '  ' +
                    '<a href=' + getTexts("link", "UnitComparison") + ' target="_blank">' + getTexts("Settings", "Learn_more") + '</a></p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Rtt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Rtt")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Rtt")[1] + '</p></td>' +
                    '</tr></table>' +

                    // Icons tab
                    '<table id="dio_icons_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'icones-des-villes.90px.png" alt="townicons" style="transform: scale(1.25); margin-top: 10px;" /></td>' +
                    '<td><div id="dio_tic" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tic")[0] + '</div></div><br>' +
                    '<div id="dio_tic2" style="display:none; margin-top: 5px;" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tic2")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "tic")[1] + '</p>' +
                    '<table class="icon_types_table">' +
                    '<tr><td style="width:115px"><div class="dio_icon_small townicon_lo"></div>' + getTexts("Town_icons", "LandOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_fo"></div>' + getTexts("Town_icons", "FlyOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_so"></div>' + getTexts("Town_icons", "NavyOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_no"></div>' + getTexts("Town_icons", "Out") + '</td></tr>' +
                    '<tr><td><div class="dio_icon_small townicon_ld"></div>' + getTexts("Town_icons", "LandDef") + '</td>' +
                    '<td><div class="dio_icon_small townicon_fd"></div>' + getTexts("Town_icons", "FlyDef") +
                    '<td><div class="dio_icon_small townicon_sd"></div>' + getTexts("Town_icons", "NavyDef") + '</td>' +
                    '<td><div class="dio_icon_small townicon_po"></div>' + getTexts("Town_icons", "Emp") + '</td></tr>' +
                    '</table>' +
                    '<p>' + getTexts("Options", "tic")[2] + ':</p>' +
                    '<div class="dio_icon_small townicon_sh"></div><div class="dio_icon_small townicon_di"></div><div class="dio_icon_small townicon_un"></div><div class="dio_icon_small townicon_ko"></div>' +
                    '<div class="dio_icon_small townicon_ti"></div><div class="dio_icon_small townicon_gr"></div><div class="dio_icon_small townicon_dp"></div><div class="dio_icon_small townicon_re"></div>' +
                    '<div class="dio_icon_small townicon_wd"></div><div class="dio_icon_small townicon_st"></div><div class="dio_icon_small townicon_si"></div><div class="dio_icon_small townicon_bu"></div>' +
                    '<div class="dio_icon_small townicon_he"></div><div class="dio_icon_small townicon_ch"></div><div class="dio_icon_small townicon_bo"></div><div class="dio_icon_small townicon_fa"></div>' +
                    '<div class="dio_icon_small townicon_wo"></div>' +
                    '</td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'liste-de-ville.90px.png" alt="townlist" style="border: 1px solid rgb(158, 133, 78);" /></td>' +
                    '<td>' + (typeof (uw.FLASK_GAME) !== "undefined" ? ('<div class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "til")[0] + '</div></div><p style="font-weight: bold;">' + getTexts("Options", "FLASK")[0] + '</p>') : (
                        '<div id="dio_til" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "til")[0] + '</div></div>')) +
                    '<p>' + getTexts("Options", "til")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'map.90px.png" alt="map" /></td>' +
                    '<td><div id="dio_tim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tim")[0] + '</div></div><div id="dio_tiw" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tiw")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "tim")[1] + '</p>' +
                    '<table id="Town_Popup" width="60%" style="display:none;"><tr>' +
                    '<td width="20%"><div id="dio_tpt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Settings", "cat_units") + '</div></div></td>' +
                    '<td width="20%"><div id="dio_tis" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "sup") + '</div></div></td>' +
                    '<td width="20%"><div id="dio_tih" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "her") + '</div></div></td>' +
                    '<td width="20%"><div id="dio_tir" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "rec") + '</div></div></td>' +
                    '</tr></table></td>' +
                    '</td></tr><tr>' +
                    '<td><img src="' + Home_img + 'bbcode-ville.jpg" alt="map" style="transform: scale(1.25); margin: 10px 12px 16px 2px;" /></td>' +
                    '<td><div id="dio_Tow" class="checkbox_new"><div class="cbx_icon" style="top: -1px;"></div><div class="cbx_caption">' + getTexts("Options", "tow")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "tow")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Tol" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Tol")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Tol")[1] + '</p></td>' +
                    '</tr></table>' +

                    // Forum tab
                    '<table id="dio_forum_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'smiley-box.90px.png" alt="dio_smiley_box" ></td>' +
                    '<td><div id="dio_sml" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "sml")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "sml")[1] + '</p>' +
                    '<img src="' + Home_img + 'smiley-emoticons-mttao-wassermann.gif" /> <img src="' + Home_img + 'smiley-emoticons-cigrqlp2odi2kqo24.gif" /> ' +
                    '<img src="' + Home_img + 'smiley-emoticons-cigmv8wnffb3v0ifg.gif" /> ' +
                    '<img src="' + Home_img + 'smiley-emoticons-cj2byjendffymp88t.gif" alt="" /> <img src="' + Home_img + 'smiley-emoticons-cj1l9gndtu3nduyvi.gif" /> ' +
                    '<img src="' + Home_img + 'smiley-emoticons-cigrmpfofys5xtiks.gif" alt="" />' + //'<img src="' + Home_img + 'smiley-emoticons-i-lovo-grepolis.gif" />'+
                    '<br><br><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'formulaire-de-defense.90px.png" alt="def_formular" ></td>' +
                    '<td><div id="dio_bbc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "bbc")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "bbc")[1] + '</p><br><img src="' + Home_img + 'formulaire-de-defense-1.png" alt="" style="max-width:none !important;" /></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'deletemultiple.png" alt="def_formular" ></td>' +
                    '<td><div id="dio_Fdm" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Fdm")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Fdm")[1] + '</p><br></td>' +
                    '</tr></table>' +

                    // Trade tab
                    '<table id="dio_trade_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'recruiting-trade.90px.png" alt="recruiting_trade" /></td>' +
                    '<td><div id="dio_rec" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "rec")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "rec")[1] + '</p><br><img src="' + Home_img + 'commerce-de-pourcentage.png" style="border: 2px solid rgb(158, 133, 78); max-height:none; max-width:none;" /></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'percentage-trade.png" alt="percentage_trade" /></td>' +
                    '<td><div id="dio_per" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "per")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "per")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'towntradeimprovement.jpg" alt="" style="border: 2px solid rgb(158, 133, 78);"/></td>' +
                    '<td><div id="dio_Tti" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Tti")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Tti")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '</tr></table>' +

                    // Layout tab
                    '<table id="dio_layout_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'simulateur.png" alt="simulator" ></td>' +
                    '<td><div id="dio_sim" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "sim")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "sim")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'barre-de-taches.png" alt="taskbar" ></td>' +
                    '<td><div id="dio_tsk" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "tsk")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "tsk")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'popup-de-faveur.90px.png" alt="favor_popup" ></td>' +
                    '<td><div id="dio_pop" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "pop")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "pop")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'contextmenu.90px.png" alt="contextmenu" /></td>' +
                    '<td><div id="dio_con" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "con")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "con")[1] + '</p></td>' +
                    '</tr>' +
                    ((Browser !== 'Firefox') ? ('<tr>' +
                        '<td><img src="' + Home_img + 'scrollbar-2.png" alt="scrollbar" style="border: 1px solid rgb(158, 133, 78);"/></td>' +
                        '<td><div id="dio_Scr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Scr")[0] + '</div></div>' +
                        '<p>' + getTexts("Options", "Scr")[1] + '</p>' +
                        '<table id="scrollbar" width="90%" class="radiobutton horizontal rbtn_visibility" style="display:none;"><tr>' +
                        '<td width="20%"><div class="option js-option" id="dio_aaa"><div class="pointer"></div>' + getTexts("Color", "Blue") + '</div></td>' +
                        '<td width="20%"><div class="option js-option" id="dio_bbb"><div class="pointer"></div>' + getTexts("Color", "Red") + '</div></td>' +
                        '<td width="20%"><div class="option js-option" id="dio_ccc"><div class="pointer"></div>' + getTexts("Color", "Green") + '</div></td>' +
                        '<td width="20%"><div class="option js-option" id="dio_ddd"><div class="pointer"></div>' + getTexts("Color", "Pink") + '</div></td>' +
                        '<td width="20%"><div class="option js-option" id="dio_eee"><div class="pointer"></div>' + getTexts("Color", "White") + '</div></td>' +
                        '</tr></table></td>' +
                        '</tr>') : "") +
                    '<tr>' +
                    '<td><img src="' + Home_img + 'boites-d-activites.90px.png" alt="activity_boxes" ></td>' +
                    '<td><div id="dio_act" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "act")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "act")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Cic" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Cic")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cic")[1] + '</p></td>' +
                    '</tr></table>' +

                    //reports
                    '<table id="dio_reports_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'troop-speed.png" style="border: 1px solid rgb(158, 133, 78);" alt="troop_speed" /></td>' +
                    '<td><div id="dio_way" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "way")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "way")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'conquered-counter.png" style="border: 1px solid rgb(158, 133, 78);" alt="conquer_counter" /></td>' +
                    '<td><div id="dio_cnt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "cnt")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "cnt")[1] + '</p>' +
                    '<img src="' + Home_img + 'conquests-2.png" style="border: 2px solid rgb(158, 133, 78); max-height:none; max-width:400px;" ><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'sans-surcharge.png" alt="" style="border: 1px solid rgb(158, 133, 78);" /></td>' +

                    '<td>' + (typeof (uw.FLASK_GAME) !== "undefined" ? ('<div class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Sel")[0] + '</div></div><p style="font-weight: bold;">' + getTexts("Options", "FLASK")[0] + '</p>') : (
                        '<div id="dio_Sel" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Sel")[0] + '</div></div>')) +
                    '<p>' + getTexts("Options", "Sel")[1] + '</p><br></td>' +
                    '</tr></table>' +

                    // Other Stuff tab
                    '<table id="dio_other_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'mousewheel-zoom.png" alt="" /></td>' +
                    '<td><div id="dio_scr" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "scr")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "scr")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'bbcode-button.png" alt="" /></td>' +
                    '<td><div id="dio_BBt" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "BBt")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "BBt")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'smiley-emoticons-kciuki.gif" alt="" /></td>' +
                    '<td><div id="dio_Rew" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "rew")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "rew")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    /*'<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_err" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "err")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "err")[1] + '</p></td>' +*/
                    //((Game.features.is_domination_active = false) ? (
                    ((uw.Game.features.end_game_type == "end_game_type_world_wonder") ? (
                        '<td><img src="' + Home_img + 'temple-d-artemiss.gif" alt="share" /></td>' +
                        '<td><div id="dio_wwc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Settings", "cat_wonders") + getTexts("Options", "wwc")[0] + '</div></div>' +
                        '<p>' + getTexts("Options", "wwc")[1] + '</p><br/>' +
                        '<img src="' + Home_img + 'merveille-du-monde.png" alt="share_calculator" style="border: 2px solid rgb(158, 133, 78); max-height:none; max-width:none;" ></td>' +
                        '</tr><tr>') : "") +
                    '</tr></table>' +

                    // Premium
                    '<table id="dio_Premium_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'culture.png" alt="" ></td>' +
                    '<td><div id="dio_Cul" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Cul")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cul")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'advancement-of-culture.png" style="border: 1px solid rgb(158, 133, 78);" alt="advancement of culture" /></td>' +
                    '<td><div id="dio_Cup" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Cup")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cup")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'culturepoints.png" style="border: 1px solid rgb(158, 133, 78);" alt="advancement of culture" /></td>' +
                    '<td><div id="dio_Cuo" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Cuo")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cuo")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'caves.jpg" alt="" /></td>' +
                    '<td><div id="dio_Hio" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Hio")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Hio")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'resource-counter-1.png" alt="resource counter" /></td>' +
                    '<td><div id="dio_Rct" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Rct")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Rct")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'overview-of-peasant-villages.jpg" alt="" /></td>' +
                    '<td><div id="dio_Ish" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Ish")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Ish")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Cuc" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">Cuc' + getTexts("Options", "Cuc")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cuc")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Buo" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">Buo' + getTexts("Options", "Buo")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Buo")[1] + '</p></td>' +
                    '</tr></table>' +

                    // Quack
                    '<table id="dio_Quack_table" class="content_category"><tr>' +
                    '<td><img src="' + Home_img + 'bb-code-messages.png" alt="" /></td>' +
                    '<td><div id="dio_Mse" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Mse")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Mse")[1] + '  ' +
                    '<a href=' + getTexts("link", "MessageExport") + ' target="_blank">' + getTexts("Settings", "Learn_more") + '</a></p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'hotkeys.png" alt="" /></td>' +
                    '<td><div id="dio_Hot" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Hot")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Hot")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Isl" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Isl")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Isl")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td><div id="dio_Hid" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Hid")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Hid")[1] + '</p><br></td>' +
                    '</tr><tr>' +
                    '<td><img src="' + Home_img + 'city-view-button-1.png" alt="" /></td>' +
                    '<td><div id="dio_Cib" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Cib")[0] + '</div></div>' +
                    '<p>' + getTexts("Options", "Cib")[1] + '</p></td>' +
                    '</tr><tr>' +
                    '<td><img src="" alt="" /></td>' +
                    '<td>' + (typeof (uw.MoleHoleOnBoard) !== "undefined" ? ('<div class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Ciw")[0] + '</div></div><p style="font-weight: bold;">' + getTexts("Options", "Mole")[0] + '</p>') : (
                        '<div id="dio_Ciw" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Ciw")[0] + '</div></div>')) +
                    '<p>' + getTexts("Options", "Ciw")[1] + '</p></td>' +
                    '</tr><tr>' +
                    ((MID == 'fr' || MID == 'de' || MID == 'en' || MID == 'zz') ? (
                        '<td><img src="" alt="" /></td>' +
                        '<td><div id="dio_Rep" class="checkbox_new"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("Options", "Rep")[0] + '</div></div>' +
                        '<p>' + getTexts("Options", "Rep")[1] + '</p><br></td>') : "") +
                    '</tr></table>' +

                    '</DIV>' +

                    // Links (Forum, PM, ...)
                    '<div style="bottom: -42px;font-weight: bold;position: absolute;width: 99%;">' +

                    '<a id="tuto" style="font-weight:bold; float:left">' +
                    '<img src="/images/game/ally/founder.png" alt="" style="float:left;height:19px;margin:0px 5px -3px;"><span>' + getTexts("tutoriel", "tuto") + '</span></a>' +

                    '<span class="" style="font-weight:bold; float:right; margin-left:20px;">' + getTexts("Settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getTexts("link", "forum") + ' target="_blank">DIO-TOOLS-David1327</a></span>' +

                    '<a id="link_forum" href=' + getTexts("link", "contact") + ' target="_blank" style="font-weight:bold; float:right">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '</div>' +

                    '</div></div>');

                getLatestVersion();

                $("#dio_langdiv").change(function () {
                    let lang = $(this).val().toLowerCase();
                    //console.log($(this));

                    if ($(this).val() === (DATA.test.lang ? (DATA.test.lang).toUpperCase() : getTexts("translations", "translations"))) {
                        return;
                    }
                    else if ($(this).val() === getTexts("translations", "add_edit")) {
                        dio.add_lang = true;
                        Notification.activate();
                        uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_PLAYER_SETTINGS).close();
                        return;
                    }
                    else if ($(this).val() === getTexts("labels", "loc") + " " + Navigator.toUpperCase()) {
                        DATA.test.lang = Navigator;
                        saveValue("test", JSON.stringify(DATA.test));
                        uw.HumanMessage.success(getTexts("translations", "translations") + " " + getTexts("labels", "loc") + " " + Navigator.toUpperCase());
                    }
                    else if ($(this).val() === getTexts("buttons", "res") + " (" + (MID).toUpperCase() + ")") {
                        DATA.test.lang = "";
                        deleteValue("test", JSON.stringify(DATA.test));
                        uw.HumanMessage.success(getTexts("translations", "translations") + " " + getTexts("buttons", "res") + " (" + MID + ")");
                    } else {
                        DATA.test.lang = lang;
                        saveValue("test", JSON.stringify(DATA.test));
                        uw.HumanMessage.success(getTexts("translations", "translations") + " " + lang);
                    }
                    uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_PLAYER_SETTINGS).close();
                    openSettings();
                    //var tooltip_str = "DIO-Tools-David1327: " + (uw.DM.getl10n("layout", "config_buttons").settings || "Settings") + "<br/> v" + dio_version + " [" + (DATA.test.lang ? (DATA.test.lang === "zz" ? "EN" : (DATA.test.lang).toUpperCase()) : (MID === "zz" ? "EN" : MID)) + "]";
                    tooltip_settings();
                    return;
                });

                // Tab event handler
                $('#dio_settings .dio_settings_tabs .submenu_link').click(function () {
                    if (!$(this).hasClass("active")) {
                        $('#dio_settings .dio_settings_tabs .submenu_link.active').removeClass("active");
                        $(this).addClass("active");
                        $("#dio_settings .visible").removeClass("visible");
                        $("#" + this.id + "_table").addClass("visible");
                    }
                });

                //
                $('#tuto').tooltip(getTexts("Settings", "Update") + " / " + getTexts("labels", "donat") + " / " + getTexts("translations", "translations") + " / BUG");
                $('#tuto').click(() => { Notification.activate(); });

                $('#dio_settings .défaut_s').tooltip(dio_icon + getTexts("buttons", "res"));
                $("#dio_settings .défaut_s").click(() => {
                    uw.hOpenWindow.showConfirmDialog(getTexts("buttons", "res"), getTexts("labels", "raf"), function () {
                        deleteValue("options");
                        location.reload();
                    });
                });

                $('#tuto2').click(() => {
                    dio.bug = true;
                    Notification.activate();
                });

                $("#dio_settings .checkbox_new").click(function () {
                    $(this).toggleClass("checked").toggleClass("disabled").toggleClass("green");
                    toggleActivation(this.id);

                    DATA.options[this.id] = $(this).hasClass("checked");

                    saveValue("options", JSON.stringify(DATA.options));
                });

                $('#dio_settings .radiobutton .option').click(function () {
                    $('#dio_settings .radiobutton .option').removeClass("checked").addClass("disabled").removeClass("green");
                    DATA.options.dio_aaa = false;
                    DATA.options.dio_bbb = false;
                    DATA.options.dio_ccc = false;
                    DATA.options.dio_ddd = false;
                    DATA.options.dio_eee = false;
                    $(this).toggleClass("checked").toggleClass("disabled").toggleClass("green");
                    toggleActivation(this.id);

                    DATA.options[this.id] = $(this).hasClass("checked");
                    saveValue("options", JSON.stringify(DATA.options));
                    if (DATA.options.dio_Scr) { Scrollbar.add(); };
                });
                for (var e in DATA.options) {
                    if (DATA.options.hasOwnProperty(e)) {
                        if (DATA.options[e] === true) { $("#" + e).addClass("checked").addClass("green"); }
                        else { $("#" + e).addClass("disabled"); }
                    }
                }

                $('#dio_save').click(function () {
                    $('#dio_settings .checkbox_new').each(function () {
                        var act = false;
                        if ($("#" + this.id).hasClass("checked")) { act = true; }
                        DATA.options[this.id] = act;
                    });
                    $('#dio_settings .radiobutton .option').each(function () {
                        var act = false;
                        if ($(this.id).hasClass("checked")) { act = true; }
                        DATA.options[this.id] = act;
                    });
                    saveValue("options", JSON.stringify(DATA.options));
                });
            }
            $('.section').each(function () { this.style.display = "none"; });
            $('#dio_settings').get(0).style.display = "block";
        });
    }

    function toggleActivation(opt) {
        var FEATURE, activation = true;
        switch (opt) {
            case "dio_sml":
                FEATURE = SmileyBox;
                break;
            case "dio_str":
                FEATURE = UnitStrength.Menu;
                break;
            case "dio_tra":
                FEATURE = TransportCapacity;
                break;
            case "dio_ava":
                FEATURE = AvailableUnits;
                break;
            case "dio_ava2":
                FEATURE = AvailableUnits.ocean;
                break;
            case "dio_sim":
                FEATURE = Simulator;
                break;
            case "dio_tsk":
                FEATURE = Taskbar;
                break;
            case "dio_scr":
                FEATURE = MouseWheelZoom;
                break;
            case "dio_com":
                FEATURE = UnitComparison;
                break;
            case "dio_pop":
                FEATURE = FavorPopup;
                break;
            case "dio_con":
                FEATURE = ContextMenu;
                break;
            case "dio_tic":
                FEATURE = TownIcons;
                break;
            case "dio_tic2":
                FEATURE = TownIcons.auto;
                break;
            case "dio_tiw":
                FEATURE = TownPopup;
                break;
            case "dio_tim":
                FEATURE = Map;
                break;
            case "dio_til":
                if (typeof (uw.FLASK_GAME) == "undefined") { FEATURE = TownList; }
                break;
            case "dio_sen":
                FEATURE = SentUnits;
                break;
            case "dio_act":
                FEATURE = ActivityBoxes;
                break;
            case "dio_wwc":
                FEATURE = WorldWonderCalculator;
                break;
            /*case "dio_wwr":
                FEATURE = WorldWonderRanking;
                break;*/
            case "dio_wwi":
                FEATURE = WorldWonderIcons;
                break;
            case "dio_rec":
                FEATURE = RecruitingTrade;
                break;
            case "dio_way":
                FEATURE = ShortDuration;
                break;
            case "dio_Scr":
                FEATURE = Scrollbar;
                break;
            case "dio_Tow":
                FEATURE = Townbb;
                break;
            case "dio_Rew":
                FEATURE = Reward;
                break;
            case "dio_Fdm":
                FEATURE = ForumDeleteMultiple;
                break;
            case "dio_Sel":
                if (typeof (uw.FLASK_GAME) == "undefined") { FEATURE = selectunitshelper; }
                break;
            case "dio_Cul":
                FEATURE = cultureOverview;
                break;
            case "dio_Cup":
                FEATURE = cultureProgress;
                break;
            case "dio_Cuo":
                FEATURE = culturePoints;
                break;
            case "dio_Hot":
                FEATURE = hotkeys;
                break;
            case "dio_Isl":
                FEATURE = islandFarmingVillages;
                break;
            case "dio_Ish":
                FEATURE = farmingvillageshelper;
                break;
            case "dio_Hio":
                FEATURE = hidesOverview;
                break;
            case "dio_Hid":
                FEATURE = hidesIndexIron;
                break;
            case "dio_Tol":
                FEATURE = townslist;
                break;
            case "dio_Cib":
                FEATURE = city_view_btn;
                break;
            case "dio_Ciw":
                if (typeof (uw.MoleHoleOnBoard) == "undefined") { FEATURE = city_view_window; }
                break;
            case "dio_Cic":
                FEATURE = city_btn_construction;
                break;
            case "dio_Tti":
                FEATURE = townTradeImprovement;
                break;
            case "dio_Mse":
                FEATURE = MessageExport;
                break;
            case "dio_Rep":
                FEATURE = reports;
                break;
            case "dio_Rct":
                FEATURE = resCounter;
                break;
            case "dio_BBt":
                FEATURE = BBtowninfo;
                break;
            case "dio_Rtt":
                FEATURE = removetooltipps;
                break;
            case "dio_Buo":
                FEATURE = BuildingOverview;
                break;
            case "dio_Cuc":
                FEATURE = cultureControl;
                break;

            default:
                activation = false;
                break;
        }
        if (activation) {
            if (DATA.options[opt]) { FEATURE.deactivate(); }
            else { FEATURE.activate(); }
        }
    }

    function tooltip_settings() {
        var tooltip_str = "DIO-Tools-David1327: " + getTexts("hotkeys", "settings") + "<br/> v" + dio_version + " [" + (DATA.test.lang ? (DATA.test.lang === "zz" ? "EN" : (DATA.test.lang).toUpperCase()) : (MID === "zz" ? "EN" : MID)) + "]";
        var version_latest = "??"; try { version_latest = uw.dio_latest_version; } catch (error) { errorHandling(error, "dio_latest_version"); }
        if (version_latest !== "??") {
            if (dio_version < version_latest) { tooltip_str += "<br/>" + getTexts("Settings", 'version_old'); }
            else if (dio_version > version_latest) { tooltip_str += "<br/>" + getTexts("Settings", 'version_dev') }
        }
        return $('.dio_settings').tooltip(tooltip_str);
    }
    function addSettingsButton() {
        $('<div class="btn_settings circle_button dio_settings"><div class="dio_icon js-caption"></div></div><div class="dio_settings_test"></div>').appendTo(".gods_area");

        // Style
        $('<style id="dio_settings_button" type="text/css">' +
            '#ui_box .btn_settings.dio_settings { top:86px!important; right:106px!important; z-index:11; } ' +
            '#ui_box .dio_settings .dio_icon { margin:7px 0px 0px 4px; width:24px; height:24px; } ' +
            '#ui_box .dio_settings .dio_icon.click { margin-top:8px; }' +
            '.dio_settings_test { width:24px; height:24px; } ' +
            '</style>').appendTo('head');

        // Tooltip
        tooltip_settings();

        // Mouse Events
        $('.dio_settings').on('mousedown', function () { $('.dio_icon').addClass('click'); });
        $('.dio_settings').on('mouseup', function () { $('.dio_icon').removeClass('click'); });
        $('.dio_settings').click(openSettings);
    }

    var diosettings = false;

    function openSettings() {
        if (!uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_PLAYER_SETTINGS)) { diosettings = true; }
        else { $('#dio_tools').click(); }
        uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_PLAYER_SETTINGS, getTexts("hotkeys", "settings"));
    }

    var exc = false, sum = 0, ch = ["IGCCJB"], alpha = 'ABCDEFGHIJ';

    function a() {
        var pA = PID.toString(), pB = "";

        for (var c in pA) { if (pA.hasOwnProperty(c)) { pB += alpha[pA[parseInt(c, 10)]]; } }

        sum = 0;
        for (var b in ch) {
            if (ch.hasOwnProperty(b)) {
                if (pB !== ch[b]) { exc = true; }
                else { exc = false; return; }
                for (var s in ch[b]) { if (ch[b].hasOwnProperty(s)) { sum += alpha.indexOf(ch[b][s]); } }
            }
        }
    }


    var autoTownTypes, manuTownTypes, manuTownAuto, population, sentUnitsArray, biriArray, wonder, wonderTypes, Overviews;

    function setStyle() {
        // Settings
        $('<style id="dio_settings_style" type="text/css">' +
            '#dio_bg_david1327{ background: url(' + dio_sprite + '); background-position: -211px -300px; height: 20px; width: 412px; left: 410px; top: 280px; position: absolute; transform: rotate(90deg);} ' +
            '#dio_bg_medusa { background:url(' + Home_img + 'medusa-transp.png) no-repeat; height: 510px; width: 380px; right: -10px; top:6px; z-index: -1; position: absolute;} ' +
            '.dio_overflow  { overflow: hidden; } ' +
            '#dio_icon  { width:15px; vertical-align:middle; margin-top:-2px; } ' +
            '#quackicon { width:15px !important; vertical-align:middle !important; margin-top:-2px; height:12px !important; } ' +
            '#dio_settings .green { color: green; } ' +
            '#dio_settings .visible { display:block !important; } ' +
            '.town_name_area .button GMHADD { left: -120px !important; } ' +
            '</style>').appendTo('head');

        // Town Icons
        $('<style id="dio_icons" type="text/css">.dio_icon_small { position:relative; right:-2px; height:20px; width:25px; } </style>').appendTo('head');

        // Tutorial-Quest Container
        $('<style id="dio_quest_container" type="text/css"> #tutorial_quest_container { top: 130px } </style>').appendTo('head');

        // Velerios
        $('<style id="dio_velerios" type="text/css"> #ph_trader_image { background-image: url(' + Home_img + 'marchand-phenicien.jpg); } </style>').appendTo('head');

        // Specific player wishes
        if (PID == 1212083) { $('<style id="dio_wishes" type="text/css"> #world_end_info { display: none; } </style>').appendTo('head'); }
    }

    function loadFeatures() {
        if (typeof (ITowns) !== "undefined") {

            autoTownTypes = {};
            manuTownTypes = DATA.townTypes;
            manuTownAuto = DATA.townAuto;
            population = {};

            sentUnitsArray = DATA.sentUnits;
            biriArray = DATA.biremes;

            wonder = DATA.worldWonder;
            wonderTypes = DATA.worldWonderTypes;

            Overviews = DATA.Overviews

            var DIO_USER = { 'name': uw.Game.player_name, 'market': MID };
            saveValue("dio_user", JSON.stringify(DIO_USER));

            if (Overviews.Culture == "") {
                Overviews.Culture = uw.DM.getl10n("mass_recruit").sort_by.name;
                Overviews.Culture_Dif = ">";
                Overviews.Buildings = uw.DM.getl10n("mass_recruit").sort_by.name;
                Overviews.Buildings_Dif = ">";
                Overviews.Gods = uw.DM.getl10n("mass_recruit").sort_by.name;
                saveValue("Overviews", JSON.stringify(Overviews));
            }

            $.Observer(uw.GameEvents.game.load).subscribe('DIO_START', function (e, data) {
                a();

                // English => default language
                if (!LANG[LID]) { LID = "en"; }

                if ((ch.length == 1) && exc && (sum == 28)) {
                    // AJAX-EVENTS
                    setTimeout(function () { ajaxObserver(); }, 0);

                    addSettingsButton();

                    addFunctionToITowns();

                    if (DATA.options.dio_tsk) { setTimeout(function () { Taskbar.activate(); }, 0); }
                    //addStatsButton();

                    fixUnitValues();

                    setTimeout(function () {
                        var waitCount = 0;

                        // No comment... it's Grepolis... i don't know... *rolleyes*
                        function waitForGrepoLazyLoading() {
                            if (typeof (uw.ITowns.townGroups.getGroupsDIO()[-1]) !== "undefined" && typeof (uw.ITowns.getTown(uw.Game.townId).getBuildings) !== "undefined") {

                                try {
                                    // Funktion wird manchmal nicht ausgeführt:
                                    var units = uw.ITowns.getTown(uw.Game.townId).units();

                                    getAllUnits();

                                    setInterval(() => { getAllUnits(); }, 5000); // 15min

                                    /*setInterval(() => {
                                        UnitCounter.count();
                                    }, 600000); // 10min*/
                                    setTimeout(() => { getLatestVersion(); }, 2000);
                                    if (DATA.options.dio_ava) {
                                        setTimeout(() => { AvailableUnits.activate(); }, 0);
                                    }
                                    if (DATA.options.dio_ava2) {
                                        setTimeout(() => { AvailableUnits.ocean.activate(); }, 0);
                                    }
                                    if (DATA.options.dio_tic) {
                                        setTimeout(() => { TownIcons.activate(); }, 0);
                                    }
                                    if (DATA.options.dio_tic) {
                                        setTimeout(() => { TownIcons.auto.activate(); }, 0);
                                    }
                                    if (DATA.options.dio_tiw) {
                                        setTimeout(() => { TownPopup.activate(); }, 0);
                                    }
                                    if (DATA.options.dio_tim) {
                                        setTimeout(() => { Map.activate(); }, 100);
                                    }
                                    if (DATA.options.dio_til & (typeof (uw.FLASK_GAME) == "undefined")) {
                                        setTimeout(() => { TownList.activate(); }, 0);
                                    }

                                } catch (e) {
                                    if (waitCount < 12) {
                                        waitCount++;

                                        console.warn("DIO-Tools | Fehler | getAllUnits | units() fehlerhaft ausgeführt?", e);

                                        // Ausführung wiederholen
                                        setTimeout(() => { waitForGrepoLazyLoading(); }, 5000); // 5s
                                    }
                                    else { errorHandling(e, "waitForGrepoLazyLoading2"); }
                                }
                            }
                            else {
                                var e = { "stack": "getGroups() = " + typeof (uw.ITowns.townGroups.getGroupsDIO()[-1]) + ", getBuildings() = " + typeof (uw.ITowns.getTown(uw.Game.townId).getBuildings) };

                                if (waitCount < 12) {
                                    waitCount++;

                                    console.warn("DIO-Tools | Fehler | getAllUnits | " + e.stack);

                                    // Ausführung wiederholen
                                    setTimeout(() => { waitForGrepoLazyLoading(); }, 5000); // 5s
                                }
                                else { errorHandling(e, "waitForGrepoLazyLoading2"); }
                            }
                        }

                        waitForGrepoLazyLoading();

                    }, 0);

                    if (DATA.options.dio_pop) {
                        setTimeout(() => { FavorPopup.activate(); }, 0);
                    }

                    imageSelectionProtection();

                    if (DATA.options.dio_con) {
                        setTimeout(() => { ContextMenu.activate(); }, 0);
                    }

                    if (DATA.options.dio_act) {
                        setTimeout(() => { ActivityBoxes.activate(); }, 0);
                    }

                    if (DATA.options.dio_str) {
                        setTimeout(() => { UnitStrength.Menu.activate(); }, 0);
                    }

                    if (DATA.options.dio_tra) {
                        setTimeout(() => { TransportCapacity.activate(); }, 0);
                    }

                    if (DATA.options.dio_com) {
                        setTimeout(() => { UnitComparison.activate(); }, 0);
                    }

                    if (DATA.options.dio_sml) {
                        setTimeout(() => { SmileyBox.activate(); }, 0);
                    }

                    if (DATA.options.dio_scr) {
                        setTimeout(() => { MouseWheelZoom.activate(); }, 0);
                    }

                    if (DATA.options.dio_sim) {
                        setTimeout(() => { Simulator.activate(); }, 0);
                    }

                    if (DATA.options.dio_sen) {
                        setTimeout(() => { SentUnits.activate(); }, 0);
                    }
                    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
                        if (DATA.options.dio_wwc) {
                            setTimeout(() => { WorldWonderCalculator.activate(); }, 0);
                        }
                    }
                    if (DATA.options.dio_rec) {
                        setTimeout(() => { RecruitingTrade.activate(); }, 0);
                    }

                    if (DATA.options.dio_way) {
                        setTimeout(() => { ShortDuration.activate(); }, 0);
                    }
                    if (DATA.options.dio_Scr) {
                        setTimeout(() => { Scrollbar.activate(); }, 0);
                    }
                    if (DATA.options.dio_Tow) {
                        setTimeout(() => { Townbb.activate(); }, 100);
                    }
                    if (DATA.options.dio_Hot) {
                        setTimeout(() => { hotkeys.activate(); }, 3000);
                    }
                    if (DATA.options.dio_Isl) {
                        setTimeout(() => { islandFarmingVillages.activate(); }, 500);
                    }
                    if (DATA.options.dio_Rew) {
                        setTimeout(() => { Reward.activate(); }, 100);
                    }
                    if (DATA.options.dio_Cib) {
                        setTimeout(() => { city_view_btn.activate(); }, 1000);
                    }
                    if (DATA.options.dio_Ciw & (typeof (uw.MoleHoleOnBoard) == "undefined")) {
                        setTimeout(() => { city_view_window.activate(); }, 1000);
                    }
                    if (DATA.options.dio_Cic) {
                        setTimeout(() => { city_btn_construction.activate(); }, 1000);
                    }
                    if (DATA.options.dio_Hio) {
                        setTimeout(() => { hidesOverview.activate(); }, 1000);
                    }
                    if (DATA.options.dio_Rtt) {
                        setTimeout(() => { removetooltipps.activate(); }, 100);
                    }
                    if (DATA.options.dio_Rct) {
                        setTimeout(() => { resCounter.activate(); }, 0);
                    }
                    if (DATA.options.dio_Hid) {
                        setTimeout(() => { hidesIndexIron.activate(); }, 0);
                    }
                    if (DATA.options.dio_Tol) {
                        setTimeout(() => { townslist.activate(); }, 100);
                    }
                    if (DATA.options.dio_BBt) {
                        setTimeout(() => { BBtowninfo.activate(); }, 100);
                    }
                    if (DATA.options.dio_Cul) {
                        setTimeout(() => { cultureOverview.activate(); }, 100);
                    }
                    if (DATA.options.dio_Cuc) {
                        setTimeout(() => { cultureControl.activate(); }, 100);
                    }
                    if (DATA.options.dio_Buo) {
                        setTimeout(() => { BuildingOverview.activate(); }, 100);
                    }

                    // compatibility flask-tools ?
                    if (typeof (uw.FLASK_GAME) !== "undefined") {
                        setTimeout(() => { compatibility.flask_tools(); }, 2000);
                    };

                    /*setTimeout(() => {
                        counter(uw.Timestamp.server());
                        setInterval(() => { counter(uw.Timestamp.server()); }, 21600000);
                    }, 60000);*/

                    // Notifications
                    setTimeout(() => { Notification.init(); }, 0);

                    setTimeout(() => { HolidaySpecial.activate(); }, 0);

                    setTimeout(() => { dio.style(); }, 0);

                    // Execute once to get the world wonder types and coordinates
                    /*setTimeout(() => {
                        if (!wonderTypes.great_pyramid_of_giza) {
                            getWorldWonderTypes();
                        }
                        if (wonderTypes.great_pyramid_of_giza) {
                            setTimeout(() => {
                                if (!wonder.map.mausoleum_of_halicarnassus) {
                                    getWorldWonders();
                                } else {
                                    if (DATA.options.dio_wwi) {
                                        WorldWonderIcons.activate();
                                    }
                                }
                            }, 2000);
                        }
                    }, 3000);*/

                    // Execute once to get alliance ratio
                    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
                        cache();
                        setTimeout(() => { uw.getPointRatioFromCache() }, 10000);
                    }
                }
                time_b = uw.Timestamp.client();
                //console.log("Gebrauchte Zeit:" + (time_b - time_a));
            });
        } else {
            setTimeout(() => { loadFeatures(); }, 100);
        }
    }

    if (uw.location.pathname.indexOf("game") >= 0) {
        setStyle();
        loadFeatures();
    }

    /*******************************************************************************************************************************
     * HTTP-Requests
     * *****************************************************************************************************************************/
    function ajaxObserver() {
        $(document).ajaxComplete(function (e, xhr, opt) {
            var url = opt.url.split("?"), action = "";
            //console.debug("0: ", url[0]);
            //console.debug("1: ", url[1]);

            if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
                action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
            }


            if (PID == 84367 || PID == 104769 || PID == 1577066) {
                console.log(action);
            }
            var wnd = uw.GPWindowMgr.getFocusedWindow() || false;
            if (wnd) {
                dio.wndId = wnd.getID();
                dio.wnd = wnd.getJQElement().find(".gpwindow_content");
            }

            switch (action) {
                case "/frontend_bridge/fetch": // Daily Reward
                    if (DATA.options.dio_Rew) {
                        Reward.activate();
                    }
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("place");
                        dio.removeTooltipps("sidebar");
                    }
                    /*if (DATA.options.dio_Hid) {
                        hidesIndexIron.add();
                    }*/
                    break;
                case "/player/index":
                    settings();
                    if (diosettings) {
                        $('#dio_tools').click();
                        diosettings = false;
                    }
                    break;
                // Ab Grepolis Version 2.114 ist der Ajax-Request: /frontend_bridge/execute
                case "/frontend_bridge/execute":
                case "/index/switch_town":
                    if (DATA.options.dio_str) {
                        setTimeout(() => { UnitStrength.Menu.update(); }, 0);
                    }
                    if (DATA.options.dio_tra) {
                        setTimeout(() => { TransportCapacity.update(); }, 0);
                    }
                    if (DATA.options.dio_tic) {
                        setTimeout(() => { TownIcons.changeTownIcon(); }, 0);
                    }
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("sidebar");
                    }
                    break;
                case "/building_hide/index":
                    break;
                case "/building_barracks/index":
                case "/building_barracks/build":
                    if (DATA.options.dio_str) {
                        UnitStrength.Barracks.add();
                    }
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("barracks");
                        dio.removeTooltipps("hero90x90");
                    }
                    break;
                case "/building_docks/index":
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("docks");
                        dio.removeTooltipps("hero90x90");
                    }
                    break;
                case "/building_barracks/cancel":
                case "/building_docks/build":
                case "/building_docks/cancel":
                case "/building_barracks/units":
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("docks");
                        dio.removeTooltipps("barracks");
                        dio.removeTooltipps("hero90x90");
                    }
                    break;
                case "/building_place/index":
                case "/building_place/units_beyond":
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("agora");
                    }
                    //addTransporterBackButtons();
                    break;
                case "/building_place/simulator":
                    if (DATA.options.dio_sim) {
                        setStrengthSimulator();
                    }
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("simulator");
                    }
                    break;
                case "/building_place/simulate":
                case "/building_place/insertSurvivesDefUnitsAsNewDefender":
                    if (DATA.options.dio_sim) {
                        afterSimulation();
                    }
                    break;
                case "/town_overviews/building_overview":
                    if (DATA.options.dio_Buo) {
                        BuildingOverview.init();
                    }
                    break;
                case "/town_overviews/culture_overview":
                case "/town_overviews/start_celebration":
                case "/town_overviews/start_all_celebrations":
                    if (DATA.options.dio_Cul) {
                        cultureOverview.add();
                    }
                    if (DATA.options.dio_Cuc) {
                        cultureControl.init();
                    }
                // eslint no-fallthrough: "error"
                case "/building_place/culture":
                    if (DATA.options.dio_Cup) {
                        cultureProgress.activate();
                    }
                    if (DATA.options.dio_Cuo) {
                        culturePoints.activate();
                    }
                    break;
                case "/farm_town_overviews/index":
                    if (DATA.options.dio_Ish) {
                        farmingvillageshelper.islandHeader();
                    }
                    break;
                case "/farm_town_overviews/claim_loads":
                    if (DATA.options.dio_Ish) {
                        farmingvillageshelper.rememberloot();
                        farmingvillageshelper.indicateLoot();
                    }
                    break;
                case "/island_info/index":
                    if (DATA.options.dio_Isl) {
                        islandFarmingVillages.activate();
                    }
                    break;
                case "/message/new":
                case "/message/forward":
                case "/message/view":
                    if (DATA.options.dio_Mse) {
                        MessageExport.add();
                    }
                // eslint no-fallthrough: "error"
                case "/alliance_forum/forum":
                case "/player_memo/load_memo_content":
                    if (DATA.options.dio_sml) {
                        SmileyBox.add(action);
                    }
                    if (DATA.options.dio_bbc) {
                        addForm(action);
                    }
                    if (DATA.options.dio_Fdm) {
                        ForumDeleteMultiple.activate();
                    }
                    break;
                case "/wonders/index":
                    if (DATA.options.dio_per & (uw.Game.features.end_game_type == "end_game_type_world_wonder")) {
                        WWTradeHandler();
                    }
                    if (DATA.options.dio_wwc) {
                        getResWW(); /*global getResWW*/
                    }
                    break;
                case "/wonders/send_resources":
                    if (DATA.options.dio_wwc & (uw.Game.features.end_game_type == "end_game_type_world_wonder")) {
                        getResWW();
                    }
                    break;
                case "/ranking/alliance":
                    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
                        getPointRatioFromAllianceRanking(); /*global getPointRatioFromAllianceRanking*/
                    }
                    break;
                case "/ranking/wonder_alliance":
                    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
                        getPointRatioFromAllianceRanking();
                    }
                    /*if (DATA.options.dio_wwr & (uw.Game.features.end_game_type == "end_game_type_world_wonder")) {
                        WorldWonderRanking.change(JSON.parse(xhr.responseText).plain.html);
                    }*/
                    if (DATA.options.dio_wwi & (uw.Game.features.end_game_type == "end_game_type_world_wonder")) {
                        WorldWonderIcons.activate();
                    }
                    break;
                case "/alliance/members_show":
                    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
                        getPointRatioFromAllianceMembers(); /*global getPointRatioFromAllianceMembers*/
                    }
                    break;
                case "/town_overviews/trade_overview":
                    if (DATA.options.dio_Rct) {
                        resCounter.init();
                    }
                    addPercentTrade(1234, false); // TODO
                    break;
                case "/farm_town_overviews/get_farm_towns_for_town":
                    if (DATA.options.dio_Ish && typeof activeFarm != 'undefined') {
                        farmingvillageshelper.setloot();
                    }
                    changeResColor();
                    break;
                case "/command_info/conquest_info":
                    if (DATA.options.dio_str) {
                        UnitStrength.Conquest.add();
                    }
                    break;
                case "/command_info/conquest_movements":
                case "/conquest_info/getinfo":
                    if (DATA.options.dio_cnt) {
                        countMovements();
                    }
                    break;
                case "/player/get_profile_html":
                    if (DATA.options.dio_BBt) {
                        BBtowninfo.profile();
                    }
                    break;
                case "/town_info/trading":
                    addTradeMarks(15, 18, 15, "red");
                    TownTabHandler(action.split("/")[2]);
                    if (DATA.options.dio_Tti) {
                        townTradeImprovement.add();
                    }
                    break;
                case "/town_info/info":
                case "/town_info/attack":
                case "/town_info/support":
                    //console.debug(JSON.parse(xhr.responseText));
                    TownTabHandler(action.split("/")[2]);
                    if (DATA.options.dio_Sel & typeof (uw.FLASK_GAME) == "undefined") {
                        selectunitshelper.activate();
                    }
                    if (DATA.options.dio_Rtt) {
                        dio.removeTooltipps("town_info");
                    }
                    break;
                case "/report/index":
                case "/report/default":
                case "/report/move":
                case "/report/delete_many":
                    changeDropDownButton();
                    if (DATA.options.dio_Rep) {
                        //reports.reportFoldersort();
                        reports.reportsColor();
                        //reports.reportsMove();
                        reports.reportsFilter();
                    }
                    break;
                case "/report/view":
                    $("#mhUnRes").remove();
                    break;
                case "/message/default":
                case "/message/index":
                    break;
                case "/town_info/go_to_town":
                    /*
                     //console.log(uw.Layout.wnd);
                     var windo = uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).getID();
                     //console.log(uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX));
                     uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).setPosition([100,400]);
                     //console.log(windo);
                     //console.log(uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_TOWNINDEX).getPosition());
                     */
                    break;
                case "/town_overviews/store_iron":
                    if (DATA.options.dio_Hio) {
                        hidesOverview.refresh_silver_total(xhr);
                    }
                    break;
                case "/town_overviews/hides_overview":
                    if (DATA.options.dio_Hio) {
                        hidesOverview.init();
                    }
                    if (DATA.options.dio_Hid) {
                        setTimeout(() => { hidesIndexIron.add(); }, 100);
                    }
                    break;
            }
        });
    }


    function test() {
        console.debug("STADTGRUPPEN", uw.Game.constants.ui.town_group);
    }

    /*******************************************************************************************************************************
     * Helping functions
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● fixUnitValues: Get unit values and overwrite some wrong values
     * | ● getMaxZIndex: Get the highest z-index of "ui-dialog"-class elements
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var dio = {
        style: () => {
            $('<style id="createButton">' + //style="color: #fc6;"
                '.don { height: 26px; display: block; background: url(' + Home_img + 'donate-btn.png) 0 0 no-repeat; position: relative; z-index: -1; } ' +
                '.don.dio-left { background-position: left 0px; } ' +
                '.don.dio-right { background-position: right -54px; } ' +
                '.don.dio-middle { color: #33268a;padding: 0 4px;margin: 0 12px;background-position: 0 -27px;background-repeat: repeat-x;line-height: 25px;min-width: 10px;cursor: pointer;font-style: italic;font-size: 14px; } ' +
                '</style>').appendTo('head');

            // Xmas -> 28 days
            dio.img_Xmas = dio.daystamp(334, 361); // 1. Dezember (334) / 28. Dezember (361)
            // Easter-Smileys -> 23 days
            dio.img_Easter = dio.daystamp(88, 110); // 30. march (88) / 21. april (110)
            // Halloween -> 15 days
            dio.img_Halloween = dio.daystamp(295, 321); // 23. Oktober / 8. November

            if (dio.img_Xmas) { dio_img = Home_img + "icon-xmas.gif"; }
            if (dio.img_Easter) { dio_img = Home_img + "icon-paques.png"; }
            //if (dio.img_Halloween) { dio_img = Home_img + "icon-paques.png"; }

            $('<style id="dio_BBplayer_style"> ' +
                '.dio_icon { background:url(' + dio_img + ') no-repeat 0px 0px; background-size: 100%;} ' +
                '.dio_icon.b { width: 26px; height: 22px; float: left; margin: -2px 5px 0 0;} ' +
                '</style>').appendTo("head");
        },
        createButton: (Text, ID, Class, i) => { //dio.createButton(getTexts("messages", "copy"), "dio-copy-message-quote", null, 'data-clipboard-target="#expTextarea"')
            return "<a " + (i = void 0 === i ? "" : i) + ' class="button ' + (Class = null == Class || void 0 === Class ? "" : Class) + '"  ' + (ID = null == ID ? "" : 'id="' + ID + '"') + '><span class="left"><span class="right"><span style="color: #fc6;" class="middle">' + dio_icon + '' + Text + '</span></span></span><span style="clear:both;"></span></a>'
        },
        createBtnDonate: (Text, ID, Class, i, h) => { //dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate"))
            return "<a " + (i = void 0 === i ? "" : i) + ' class="dio-button button ' + (Class = null == Class || void 0 === Class ? "" : Class) + '" ' + (h = null == h ? "" : 'href="' + h + '"target="_blank"') + (ID = null == ID ? "" : 'id="' + ID + '"') + '><span class="don dio-left"><span class="don dio-right"><span class="don dio-middle">' + Text + '</span></span></span><span style="clear:both;"></span></a>'
        },
        grepo_btn: (ID, Text) => {
            return $('<a id="' + ID + '" href="#" class="button"><span class="left"><span class="right"><span class="middle"><small>' + Text + '</small></span></span></span></a>');
        },
        grepo_dropdown_flag: (ID, Options, label, group, group2) => {
            var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">' + (group = null == group ? "" : '<optgroup label="' + group + '">');
            var option_image = "";
            if (label != null) {
                $.each(label, (a, b) => {
                    str += '<option value="' + b + '">' + b + '</option>'
                });
            };
            str += (group = null == group ? "" : '</optgroup>') + (group2 = null == group2 ? "" : '<optgroup label="' + group2 + '">');
            $.each(Options, (a, b) => {
                if (LANG[b]) { option_image = '' + Home_img + 'flag.16.' + b + '.png'; }
                else { option_image = ""; }
                var option_name = (LANG[b]) ? b.toUpperCase() : b;
                str += '<option style="background: url(' + option_image + ') no-repeat scroll left center #EEDDBB; padding-left: 22px" value="' + b + '">' + option_name + '</option>'
            });
            str += ((group = null == group) || (group2 = null == group2) ? "" : '</optgroup>') + '</select></span></span></span>';
            return $(str);
        },
        grepo_dropdown: (ID, Class, Options, sel) => {
            var str = '<div id="' + ID + '" class="' + Class + ' dropdown-list default"><div class="item-list">';
            $.each(Options, function (a, b, c) { //class, name, ><
                console.log(sel)
                if (b[2]) { str += '<div class="' + b[0] + (sel == null ? "" : (sel == b[1] ? " sel" : "")) + '" name="' + b[1] + '">' + (b[2] == true ? b[1] : b[2]) + '</div>' }
                else if (b[1]) { str += '<div class="' + b[0] + (sel == null ? "" : (sel == b[1] ? " sel" : "")) + '" name="' + b[1] + '"></div>' }
                else { str += '<div class="' + (sel == null ? "" : (sel == b[0] ? " sel" : "")) + '" name="' + b[0] + '"></div>' }
            });
            str += '</div></div>';
            return str;
        },
        grepo_submenu: (ID, Title) => {
            return $('<li><a id="' + ID + '" class="submenu_link" ><span class="left"><span class="right"><span class="middle" title="' + Title + '" style="color: #000;">' + Title + '</span></span></span></a></li>');
        },
        drop_menu(This, Class, onglet) {
            $(This).parent().find(".sel").toggleClass("sel");
            $(This).toggleClass("sel");

            Overviews[onglet] = $(This).attr("name");
            var buil = Overviews[onglet];
            $(Class + ' .caption').attr("name", buil);
            $(Class + ' .caption').each(function () {
                this.innerHTML = buil;
            });

            $($(This).parent().parent().get(0)).removeClass("open");
            $(Class + ' .caption').change();

            saveValue("Overviews", JSON.stringify(Overviews));
        },
        daystamp: (start, end) => { //dio.daystamp(start, end)
            var daystamp = 1000 * 60 * 60 * 24, today = new Date((new Date()) % (daystamp * (365 + 1 / 4))), // without year
                // Xmas -> 28 days
                Start = daystamp * start,
                End = daystamp * end,
                ID = (today >= Start) ? (today <= End) : false;
            return ID;
        },
        removeTooltipps: (type) => {
            var a;
            switch (type) {
                case "agora":
                    a = dio.wnd.find(".place_unit");
                    break;
                case "barracks":
                case "docks":
                    a = dio.wnd.find("#units DIV");
                    break;
                case "place":
                    a = $(".classic_window.place .supporters_list").find(".units_list DIV");
                    break;
                case "sidebar":
                    a = $("#ui_box").find(".units_wrapper DIV");
                    break;
                case "town_info":
                    a = dio.wnd.find(".unit_icon40x40");
                    break;
                case "simulator":
                    a = dio.wnd.find(".index_unit");
                    break;
                case "hero90x90":
                    a = dio.wnd.find("#unit_order_unit_big_image");
                    break;
            }
            a.each((index) => {
                $(this).off('mouseenter mouseleave');
            });
        },
        clipboard: (IDbutton, input, error, Text) => {
            try {
                var clipboard = new uw.ClipboardJS(IDbutton);
                clipboard.on("success", () => {
                    setTimeout(() => {
                        uw.HumanMessage.success(dio_icon + getTexts("messages", "copybb"))
                        if (input !== null) {
                            $(IDbutton).css({ "display": "none" })
                            $(input).css({ "display": "none" })
                        }
                        if (Text !== null) {
                            if (uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE)) {
                                uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE).close();
                            }
                        }
                    }, 50)
                });
                clipboard.on('error', (e) => {
                    return uw.HumanMessage.error(dio_icon + getTexts("messages", "cli")); errorHandling(e, "clipboard error");
                });
            } catch (error) {
                return errorHandling(error, "clipboard");
            }
        },
    };

    // Fix buggy grepolis values
    function fixUnitValues() {
        //uw.GameData.units.small_transporter.attack = uw.GameData.units.big_transporter.attack = uw.GameData.units.demolition_ship.attack = uw.GameData.units.militia.attack = 0;
        //uw.GameData.units.small_transporter.defense = uw.GameData.units.big_transporter.defense = uw.GameData.units.demolition_ship.defense = uw.GameData.units.colonize_ship.defense = 0;
        uw.GameData.units.militia.resources = { wood: 0, stone: 0, iron: 0 };
    }

    function getMaxZIndex() {
        var maxZ = Math.max.apply(null, $.map($("div[class^='ui-dialog']"), function (e, n) {
            if ($(e).css('position') == 'absolute') { return parseInt($(e).css('z-index'), 10) || 1000; }
        }));
        return (maxZ !== -Infinity) ? maxZ + 1 : 1000;
    }

    function getBrowser() {
        var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|maxthon|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            M[1] = 'IE';
            M[2] = tem[1] || '';
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/);
            if (tem !== null) {
                M[1] = 'Opera';
                M[2] = tem[1];
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);

        return M.join(' ');
    }

    function system() {
        let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0,
            isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false,
            system = false;
        if (isMacLike || isMac) { system = true }
        return system;
    };

    function cache() {
        var c, h = {}, k = {};
        if ("object" != typeof uw.MM.DIO) { setTimeout(function () { cache(); }, 1E4); }
        else {
            /*try {
                $.ajax({method:"get", url:"/data/players.txt"}).done(function(m) {
                    try {
                        $.each(m.split(/\r\n|\n/), function(C, K) {
                            c = K.split(/,/);
                            h[c[0]] = {id:c[0], name:decodeURIComponent(c[1] + ""), Points:decodeURIComponent(c[2] + "").replace(/\+/g, " "), alliance_id:c[2]};
                        });
                        uw.MM.DIO.cachePlayers = h;
                    } catch (error) { errorHandling(error, "cache players done"); }
                });
            } catch (error) { errorHandling(error, "cache players"); }*/
            try {
                $.ajax({ method: "get", url: "/data/alliances.txt", }).done(function (m) {
                    try {
                        $.each(m.split(/\r\n|\n/), function (C, K) {
                            c = K.split(/,/);
                            k[c[0]] = { id: c[0], name: decodeURIComponent(c[1] + ""), Points: decodeURIComponent(c[2] + "").replace(/\+/g, " ") };
                        });
                        uw.MM.DIO.cacheAlliances = k;
                    } catch (error) { errorHandling(error, "cache alliances done"); }
                });
            } catch (error) { errorHandling(error, "cache alliances"); }
        }
    }

    // Error Handling / Remote diagnosis / Automatic bug reports
    function errorHandling(e, fn) {
        var error = 1;
        if (PID === 1538932 || PID === 100144) {
            uw.HumanMessage.error(dio_icon + "DIO-TOOLS(" + dio_version + ")-ERROR: " + e.message);
            console.log("DIO-TOOLS | Error-Stack | " + [fn] + " | ", e.stack);
            //console.log("DIO-TOOLS | Error-Stack | "+[fn]+" | ", e.name + ": " + e.toString());
            //DATA.error[version][fn] = true;
            //saveValue("error", JSON.stringify(uw.MM.DIO.error));
        } else {
            //if (!DATA.error[dio_version]) {
            //    DATA.error[dio_version] = {};
            //}
            console.log("DIO-TOOLS | Error-Stack | " + [fn] + " | ", e.toString());

            //saveValue("error", JSON.stringify(DATA.error));

            /*if (DATA.options.dio_err && !DATA.error[dio_version][fn]) {
                $.ajax({
                    type: "POST",
                    url: "https://diotools.de/game/error.php",
                    data: {error: e.stack.replace(/'/g, '"'), "function": fn, browser: getBrowser(), version: dio_version},
                    success: function (text) {
                        DATA.error[version][fn] = true;
                        saveValue("error", JSON.stringify(DATA.error));
                    }
                });
            }*/
        }
        try {
            let nb = 1;
            var errordio = uw.MM.DIO.errorDio, nb2 = 0, nb_error = 1;

            if (typeof (errordio[fn]) !== "undefined") {
                nb = nb + errordio[fn].nb;
            }

            var date = new Date();
            errordio[fn] = {
                "function": fn,
                message: e.toString().replace(/'|\"/g, ''),
                error: e.stack.replace(/'/g, '"'),
                version: dio_version,
                browser: getBrowser(),
                system: ((system()) ? "Mac" : "Windows"),
                nb: nb,
                date: date.toLocaleString("fr-FR", { timeZone: 'UTC' }),
            };

            $.each(errordio, function (name) {
                if (name !== "nb") {
                    nb2++;
                }
                errordio.nb = nb2;
            });

            if (!DATA.error[dio_version]) { DATA.error[dio_version] = {}; }
            if (typeof (DATA.error[dio_version][fn]) !== "undefined") {
                DATA.error[dio_version][fn].nb = DATA.error[dio_version][fn].nb + 1;
                DATA.error[dio_version][fn].date_fin = date.toLocaleString("fr-FR", { timeZone: 'UTC' });
            }
            if (!DATA.error[dio_version][fn]) {
                DATA.error[dio_version][fn] = {
                    "function": fn,
                    message: e.toString().replace(/"/g, '\''),
                    //error: JSON.stringify(e.stack.replace(/'|\"/g, ''),),
                    version: dio_version,
                    browser: getBrowser(),
                    system: ((system()) ? "Mac" : "Windows"),
                    nb: 1,
                    date: date.toLocaleString("fr-FR", { timeZone: 'UTC' }),
                    date_fin: "",
                };
            };
            nb = 0;
            $.each(DATA.error[dio_version], function (name) {
                if (name !== "nb") {
                    nb++;
                }
                DATA.error[dio_version].nb = nb;
            });
            saveValue("error", JSON.stringify(DATA.error));
        } catch (e) { }
    }
    var dio_bug = true;
    $('<style id="dio_window">' +
        '.dio_title_img { height:18px; float:left; margin-right:3px; } ' +
        '.dio_title { margin:1px 6px 13px 23px; color:rgb(126,223,126); } ' +
        '</style>').appendTo('head');
    function createWindowType(name, title, width, height, minimizable, position) {
        // Create Window Type
        function WndHandler(wndhandle) {
            this.wnd = wndhandle;
        }
        Function.prototype.inherits.call(WndHandler, uw.WndHandlerDefault);
        WndHandler.prototype.getDefaultWindowOptions = function () {
            if (MID == 'zz' || dio_bug) {
                return {
                    //position: "10px",
                    hidden: !1,
                    left: 297,
                    top: 101,
                    width: width,
                    height: height,
                    minimizable: minimizable,
                    title: title,
                };
            } else {
                return {
                    position: position,
                    width: width,
                    height: height,
                    minimizable: minimizable,
                    title: "<img class='dio_title_img' src='" + dio_img + "' /><div class='dio_title'>" + title + "</div>"
                };
            }
        };
        uw.GPWindowMgr.addWndType(name, "75623", WndHandler, 1);
    }

    // Adds points to numbers
    function pointNumber(number) {
        var sep;
        if (LID === "de") { sep = "."; }
        else { sep = ","; }

        number = number.toString();
        if (number.length > 3) {
            var mod = number.length % 3;
            var output = (mod > 0 ? (number.substring(0, mod)) : '');

            for (var i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0)) { output += number.substring(mod + 3 * i, mod + 3 * i + 3); }
                else { output += sep + number.substring(mod + 3 * i, mod + 3 * i + 3); }
            }
            number = output;
        }
        return number;
    }

    // Notification
    var Notification = {
        REMINDER: false,
        init: function () {

            // Window
            createWindowType("DIO_Notification", getTexts("tutoriel", "tuto"), 820, 550, true, ["center", "center", 100, 100]);
            createWindowType("DIO_Notification_v", getTexts("Settings", "version_old"), 450, 150, true);

            // Style
            $('<style id="dio_notification" type="text/css">' +
                '#notification_area .diotools .icon { background: url(' + dio_img + ') 4px 7px no-repeat !important;} ' +
                '#notification_area .diotools_v .icon { background: url(' + dio_img + ') 4px 7px no-repeat !important; filter: hue-rotate(260deg);} ' +
                '#notification_area .diotools, #notification_area .diotools_v { cursor:pointer; } ' +
                '#NotifText {overflow-y: auto !important; height: 435px; margin-left: 5px; } ' +
                '#NotifText img { max-width:780px; text-align: center; margin:5px; } ' +

                '#NotifText .green { color: green; } ' +
                '#NotifText table { border-spacing: 9px 3px; } ' +
                '#NotifText table th { text-align:left !important;color:green;text-decoration:underline;padding-bottom:10px; } ' +
                '#NotifText table td.value { text-align: right; } ' +

                '#NotifText table td.laurel.green { background: url("/images/game/ally/founder.png") no-repeat; height:17px; width:17px; background-size:100%; } ' +
                '#NotifText table td.laurel.green2 { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 0%; height:17px; width:17px; } ' +
                '#NotifText table td.laurel.bronze { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 25%; height:17px; width:17px; } ' +
                '#NotifText table td.laurel.silver { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 50%; height:17px; width:17px; } ' +
                '#NotifText table td.laurel.gold { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 75%; height:17px; width:17px; } ' +
                '#NotifText table td.laurel.blue { background: url("' + Home_img + 'laurel-sprite.png") no-repeat 100%; height:17px; width:17px; } ' +
                '</style>').appendTo('head');

            // NotificationType
            uw.NotificationType.DIO_TOOLS = "diotools";
            uw.NotificationType.DIO_TOOLS_V = "diotools_v";

            var notifN = 29;
            var titreN =
                //	0; // nouvelles fonctionnalités
                1; // Nouvelle version
            //	2; // ""
            var featureN =
                0; // nouvelles fonctionnalités
            //	1; // nouvelles fonctionnalités + titre
            //	2; // ""

            var titre = [getTexts("Settings", "Feature"), getTexts("Settings", "Feature2"), ""];
            var feature = [getTexts("Settings", "Feature"), getTexts("Settings", "Feature") + ' (' + getTexts("Options", "")[0] + ')', ""];

            var notif = DATA.notification;
            if (notif <= notifN || david1327) {
                Notification.create(titre[titreN], feature[featureN], "DIO_TOOLS", "#3f0"); //;

                // Click Event
                $('.diotools .icon').click(function () {
                    Notification.activate();
                    $(this).parent().find(".close").click();
                });
                saveValue('notif', notifN + 1);
            }

            var version_latest = dio_version;
            var update = DATA.update;
            try { version_latest = uw.dio_latest_version; } catch (error) { errorHandling(error, "dio_latest_version"); }

            if (update !== 0 && dio_version === version_latest) { saveValue('update', 0); }
            if (dio_version < version_latest && update <= 7) {
                Notification.create(getTexts("Settings", "version_old"), getTexts("Settings", "Available"), "DIO_TOOLS_V", "#f22");

                // Click Event
                $('.diotools_v .icon').click(function () {
                    Notification.update();
                    $(this).parent().find(".close").click();
                });
                saveValue('update', update + 1);
            }
        },
        update: function () {
            if (Notification.REMINDER == false) {
                var expRahmen_a = '<div id="dio_notif" class="main_dialog_text_area">' +
                    '<p class="confirm_dialog_text">' + getTexts("Settings", "Available") + '</p><div class="dialog_buttons">' +
                    '<a class="button confirmm" href="' + getTexts("link", "update_direct") + '"><span class="left"><span class="right"><span class="middle">' + getTexts("Settings", "install") + '</span></span></span><span style="clear:both;"></span></a>' +
                    '<a class="button cancell"><span class="left"><span class="right"><span class="middle" style="color: #fc6";>' + getTexts("Settings", "reminder") + '</span></span></span><span style="clear:both;"></span></a>' +
                    '</div></div>';
                var BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_Notification_v) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close();
                BBwnd.setContent(expRahmen_a);
            } else { confirmm(); }
            var update = DATA.update;
            // Click Event
            $('#dio_notif .confirmm').click(function () { setTimeout(() => { confirmm(); }, 2000); });
            function confirmm() {
                if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v)) { uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close(); }
                var expRahmen_a = '<div id="dio_notif" class="main_dialog_text_area">' +
                    '<p class="confirm_dialog_text">' + getTexts("Settings", "reqreload") + '</p><div class="dialog_buttons">' +
                    '<a class="button reloadd"><span class="left"><span class="right"><span class="middle" style="color: #fc6";>' + getTexts("Settings", "reload") + '</span></span></span><span style="clear:both;"></span></a>' +
                    '<a class="button reminder"><span class="left"><span class="right"><span class="middle" style="color: #fc6";>' + getTexts("Settings", "reminder") + '</span></span></span><span style="clear:both;"></span></a>' +
                    '</div></div>';
                var BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_Notification_v) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close();
                BBwnd.setContent(expRahmen_a);
                $("#dio_notif .reloadd").click(() => {
                    if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v)) { uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close(); }
                    uw.hOpenWindow.showConfirmDialog(getTexts("buttons", "res"), getTexts("labels", "raf"), function () { location.reload(); });
                });
                $("#dio_notif .reminder").click(() => {
                    if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v)) { uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close(); };
                    Notification.REMINDER = true;
                    setTimeout(() => { Notification.update(); }, 180000);
                });
            }
            $('#dio_notif .cancell').click(function () {
                if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v)) { uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification_v).close(); }
                setTimeout(() => {
                    Notification.create(getTexts("Settings", "version_old"), getTexts("Settings", "Feature2"), "DIO_TOOLS_V", "#f22");
                    // Click Event
                    $('.diotools_v .icon').click(function () { Notification.update(); $(this).parent().find(".close").click(); }); saveValue('update', update + 1);
                }, 18000000);
                saveValue('update', update - 1);
            });
        },
        activate: function () {

            var grepoGameBorder = '<div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div>' +
                '<div class="game_border_right"></div><div class="game_border_corner corner1"></div>' +
                '<div class="game_border_corner corner2"></div><div class="game_border_corner corner3">' +
                '</div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;padding:3px 11px">';
            var inhalte = {
                dioset_tab1: tab1(),
                dioset_tab2: tab2(),
                dioset_tab3: tab3(),
                dioset_tab4: tab4()
            };

            //Mise à jour
            function tab1() {

                var HTML_tab1 = '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '</div>' +
                    '<div style="bottom: 1px;position: absolute; font-weight: bold;">' +

                    '<span class="" style="font-weight:bold; float:left; margin-left:20px;">' + getTexts("Settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getTexts("link", "forum") + ' target="_blank">DIO-TOOLS-David1327</a></span>' +

                    '<a id="link_forum" href=' + getTexts("link", "contact") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '<a id="link_forum" href=' + getTexts("link", "Update") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "Update") + '</span></a>' +

                    '</div>' +

                    '<div style="top: -37px;position: absolute; right: 92px;">' +
                    '<a class="ui-dialog-titlebar-help ui-corner-all" id="dio_help" href=' + getTexts("link", "Update") + ' target="_blank"></a>' +
                    '<div id="dio_donate_btn" style="position:relative; right: -94px; top: 484px; -webkit-filter: hue-rotate(45deg);">' + dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate")) + '</div>' +
                    '</div>';

                HTML_tab1 += grepoGameBorder + getTexts("Settings", "Update") + '</div>';

                //
                var version = dio_version[2] += dio_version[3]
                var beforeversion = dio_version.replace(version, version - 1);
                if (DATA.error[beforeversion]) { deleteValue("error"); }
                HTML_tab1 += '<div id="NotifText">' +
                    //'<p>- '+ getTexts("Notification", "A") +'.</p>' +

                    '<center style="text-align: left;"><span style="color:#006400;"><strong><span style="font-size:20px;"></span><span style="font-size:20px;">Join me on discord</span><span style="font-size:20px;"></span> -&gt;&nbsp;</strong><span><br />' +
                    '<span style="text-decoration: underline;"><span style="color: #008000;"><strong><a href="https://discord.gg/Q7WXtmRNRW">https://discord.gg/Q7WXtmRNRW</a></strong></span></span></span></span></center>' +

                    '<div style="height: 45px;padding: 25px 0px 0px 110px;font-size: 18px;color: #FFF;background: url(' + Home_img + 'gpcl-tip.png) no-repeat;font-weight: bold;">News and changes</div>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- View of the city<span style="font-size:18px;"> :</span></span></span></span><br />' +
                    '-&gt; The city view construction mode is selected by default (The option will be activated manually in the settings.). -&gt; Idea from @Arphox (<a href="https://discord.com/invite/Q7WXtmRNRW" target="_blank">Discord</a>)</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- Icons of cities<span style="font-size:18px;">&nbsp;;</span></span></span></span><br />' +
                    '-&gt; Added more icons. -&gt; Idea of Sytix (forum en)<br />' +
                    '-&gt; After several requests, it is possible to disable the automatic mode in the settings (The automatic default mode will be disabled, but it will still be possible to use it manually.)<br />' +
                    '-&gt; The Reset button is to remove the manual auto mode.<br />' +
                    '<img alt="Capture d ecran 2022 07 24 171600" height="371" src="https://www.tuto-de-david1327.com/medias/images/capture-d-ecran-2022-07-24-171600.png" width="264" /></p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- <span style="font-size:18px;">Culture preview (Administrator)&nbsp;:</span></span></span></span><br />' +
                    '-&gt; The numbers are again in full</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- Setting<span style="font-size:18px;">&nbsp;:</span></span></span></span><br />' +
                    '-&gt; Images are sharper.<br />' +
                    '-&gt; A button to reset settings has been added.<br />' +
                    '<img alt="Capture d ecran 2022 07 25 183246" class="img-circle" height="64" src="https://www.tuto-de-david1327.com/medias/images/capture-d-ecran-2022-07-25-183246.png" width="51" /></p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- Scrollbar<span style="font-size:18px;">&nbsp;:</span></span></span></span><br />' +
                    '-&gt; The function has been simplified.</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;">-&nbsp;</span><span style="font-size:18px;">List of cities in BB-Code :</span></span><br />' +
                    '-&gt; Function optimization (close window after copier and city list close)</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- Version is not up to date<span style="font-size:18px;">&nbsp;:</span></span></span></span><br />' +
                    '-&gt; You will be notified of upcoming updates on an icon at the bottom right. Clicking will prompt you to install the new update.<br />' +
                    '<em>The notification automatically turns off after 7 loads.</em><br />' +
                    '<img alt="Capture d ecran 2022 09 13 190741" height="50" src="https://www.tuto-de-david1327.com/medias/images/capture-d-ecran-2022-09-13-190741.png" width="479" /><br />' +
                    '<img alt="Capture d ecran 2022 09 13 190813" class="rounded" height="167" src="https://www.tuto-de-david1327.com/medias/images/capture-d-ecran-2022-09-13-190813.png" width="499" /><span style="font-size:18px;"></span></p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;"><span style="font-size:18px;">- Script optimization<span style="font-size:18px;"></span></span></span></span></p>' +

                    '<div style="height: 45px;padding: 25px 0px 0px 110px;font-size: 18px;color: #FFF;background: url(' + Home_img + 'gpcl-bug.png) no-repeat;font-weight: bold;">Bug fixes</div>' +

                    '<p><span style="font-size:18px;"></span><span style="font-size:18px;"></span><span style="font-size:18px;"></span></p>' +

                    '<p><span style="color:#c0392b;"><span style="font-size:18px;">- </span><span style="font-size:18px;"> Unit overview / Unit comparison :</span></span><br />' +
                    '-&gt; Icons have been fixed when closing windows<br />' +
                    '&nbsp;<img alt="Capture d ecran 2022 07 25 182951" class="img-circle" height="73" src="https://www.tuto-de-david1327.com/medias/images/capture-d-ecran-2022-07-25-182951.png" width="38" /></p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;">-&nbsp;</span><span style="font-size:18px;">Useful information :</span></span><br />' +
                    '&nbsp;-&gt; The menu was off.</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;">-&nbsp;</span><span style="font-size:18px;">Reports / Defense Form :</span></span><br />' +
                    '&nbsp;-&gt; Due to manual translation errors were occurring.</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;">-&nbsp;</span><span style="font-size:18px;">Smilies / Defense Form :</span></span><br />' +
                    '&nbsp;-&gt; In the alliance forum, the icons are duplicated.</p>' +

                    '<p><span style="font-size:18px;"></span><span style="color:#c0392b;"><span style="font-size:18px;">- </span><span style="font-size:18px;">Header buttons :</span></span><br />' +
                    '&nbsp;-&gt; The script adapted to the Grepolis update.</p>' +

                    '<div style="height: 30px;background: url(' + Home_img + 'gpcl-line.png) no-repeat;font-weight: bold;">&nbsp;</div>' +

                    '<p>Please feel free to report any bugs and <a href="' + getTexts("link", "Update") + '" target="_blank">comment</a> on this update!</p>' +

                    '<p><br />' +
                    '<p>To see all the modifications I invite you to go to this link<br />' +
                    '<a href="https://github.com/DIO-David1327/DIO-TOOLS-David1327/compare/' + beforeversion + '...' + dio_version + '">https://github.com/DIO-David1327/DIO-TOOLS-David1327/compare/' + beforeversion + '...' + dio_version + '</a></p>' +
                    '<p><br />' +
                    'Good evening and good game.<br />' +
                    'Regards,</p>';

                return HTML_tab1;

            }
            //Contribution
            function tab2() {

                var HTML_tab2 = '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '</div>' +
                    '<div style="bottom: 1px;position: absolute; font-weight: bold;">' +

                    '<span class="" style="font-weight:bold; float:left; margin-left:20px;">' + getTexts("Settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getTexts("link", "forum") + ' target="_blank">DIO-TOOLS-David1327</a></span>' +

                    '<a id="link_forum" href=' + getTexts("link", "contact") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '<a id="link_forum" href=' + getTexts("link", "Update") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "Update") + '</span></a>' +

                    '</div>' +

                    '<div style="top: -37px;position: absolute; right: 92px;">' +
                    '<a class="ui-dialog-titlebar-help ui-corner-all" id="dio_help" href="https://www.tuto-de-david1327.com/en/pages/dio-tools-david1327/donations-received.html" target="_blank"></a>' +
                    '<div id="dio_donate_btn" style="position:relative; right: -94px; top: 484px; -webkit-filter: hue-rotate(45deg);">' + dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate")) + '</div>' +
                    '</div>';

                HTML_tab2 += grepoGameBorder + getTexts("labels", "donat") + '</div>';

                var don, donNb = 0, reste, donationsListe = [
                    [1, 5, 60, 56.51, 'Christiane G'],
                    [2, 1, 50, 47.2, 'Nepomuk P'],
                    [3, 1, 30, 28.78, 'glaglatoulle'],
                    [3, 3, 30, 27.48, 'Eli M'],
                    [4, 2, 22, 20.66, 'Ulla R'],
                    [5, 1, 20, 19.07, 'Elwira G'],
                    [5, 1, 20, 19.07, 'Sven K'],
                    [5, 1, 20, 19.07, 'kanokwan s'],
                    [5, 1, 20, 19.07, 'Artur Z'],
                    [5, 2, 20, 18.32, 'Ines L'],
                    [6, 1, 15, 14.21, 'Attila'],
                    [7, 1, 10, 9.16, 'Eric A'],
                    [7, 1, 10, 9.36, 'Christian P'],
                    [7, 1, 10, 9.36, 'Ocaso'],
                    [7, 1, 10, 9.36, 'Andreas A'],
                    [7, 1, 10, 9.36, 'SABINE B'],
                    [7, 1, 10, 9.36, 'Herbert L'],
                    [7, 1, 10, 9.36, 'Jean-Paul B'],
                    [7, 1, 10, 9.36, 'Uwe J'],
                    [7, 1, 10, 9.36, 'filippo v'],
                    [7, 1, 10, 9.36, 'benoit A'],
                    [7, 1, 10, 9.36, 'Doris H'],
                    [7, 1, 10, 9.36, 'Gabory A'],
                    [7, 1, 10, 9.36, 'etienne1306'],
                    [7, 1, 10, 9.36, 'Andreas S'],
                    [8, 1, 5.55, 5.04, 'Susi K'],
                    [8, 1, 5.55, 5.04, 'Annette H'],
                    [9, 1, 5.51, 5, 'Laurent R'],
                    [9, 1, 5.51, 5, 'Arphox'],
                    [10, 2, 5.3, 4.44, 'adriano g'],
                    [11, 1, 5, 4.5, 'Detlef Z'],
                    [11, 1, 5, 4.5, 'José-Miguel A'],
                    [11, 1, 5, 4.5, 'Raul-Garcia C'],
                    [11, 1, 5, 4.5, 'Swen A'],
                    [11, 1, 5, 4.5, 'Thomas C'],
                    [11, 1, 5, 4.5, 'Comte M'],
                    [11, 1, 5, 4.5, 'Antonio-Acuña B'],
                    [11, 1, 5, 4.5, 'Kallerberg'],
                    [11, 1, 5, 4.5, 'Denai'],
                    [11, 1, 5, 4.5, 'Sven O'],
                    [11, 1, 5, 4.5, 'Mateusz O'],
                    [11, 1, 5, 4.5, 'Dorthe D'],
                    [11, 1, 5, 4.5, 'Societatea-d-S B'],
                    [11, 1, 5, 4.5, 'Dylan D'],
                    [11, 1, 5, 4.5, 'Petr M'],
                    [11, 1, 5, 4.5, 'Diana S'],
                    [11, 1, 5, 4.4, 'Therese S'],
                    [11, 1, 5, 4.5, 'Kornelia M'],
                    [11, 1, 5, 5.5, 'Max P'],
                    [12, 3, 3.39, 2.24, 'Gyorgy C'],
                    [13, 1, 2.5, 2.08, 'Martin G'],
                    [14, 1, 2, 1.59, 'Marie-Laure D'],
                    [15, 1, 1.39, 1, 'Eduard B'],
                    [16, 1, 1, 0.38, 'Francesco L'],
                ];
                $.each(donationsListe, function () {
                    donNb++;
                });
                don = Math.round(donNb / 4)
                reste = (donNb - 4 * don)
                if (reste < 0) reste = 0

                HTML_tab2 += '<div id="NotifText">' +

                    '<p>' + getTexts("labels", "ingame_name")[0] + '</p>' +
                    '<p>' + getTexts("labels", "ingame_name")[1] + '</p>' +
                    '<table style="float:left; margin-right: 8px; margin-left: -5px;">' +
                    '<tr><th colspan="3">' + getTexts("labels", "donat") + '</th></tr>' +
                    (function () {
                        var donNb2 = -1, donations = [], donations2 = [], donations3 = [], donations4 = [], donation_table = "", donation_table2 = "", donation_table3 = "", donation_table4 = "";
                        $.each(donationsListe, function (a) {
                            donNb2++;
                            if (donNb2 < (don + (reste > 0 ? 1 : 0))) { donations.push(donationsListe[donNb2]) }
                            else if (donNb2 < (don + don + (reste > 1 ? 2 : reste))) { donations2.push(donationsListe[donNb2]) }
                            else if (donNb2 < (don + don + don + (reste > 2 ? 3 : reste))) { donations3.push(donationsListe[donNb2]) }
                            else { donations4.push(donationsListe[donNb2]) }
                        })

                        var d = 0;
                        for (d = 0; d < donations.length; d++) {

                            var donation_class = "";

                            switch (donations[d][0]) {
                                case 1: donation_class = "gold"; break;
                                case 2: donation_class = "silver"; break;
                                case 3: donation_class = "bronze"; break;
                                default: donation_class = "green2"; break;
                            }
                            donation_table += '<tr class="donation"><td class="laurel ' + donation_class + '"></td><td>' + donations[d][4] + '</td><td class="value">' + donations[d][2] + '€</td></tr>';
                        }
                        for (d = 0; d < donations2.length; d++) { donation_table2 += '<tr class="donation"><td class="laurel green2"></td><td>' + donations2[d][4] + '</td><td class="value">' + donations2[d][2] + '€</td></tr>'; }
                        for (d = 0; d < donations3.length; d++) { donation_table3 += '<tr class="donation"><td class="laurel green2"></td><td>' + donations3[d][4] + '</td><td class="value">' + donations3[d][2] + '€</td></tr>'; }
                        for (d = 0; d < donations4.length; d++) { donation_table4 += '<tr class="donation"><td class="laurel green2"></td><td>' + donations4[d][4] + '</td><td class="value">' + donations4[d][2] + '€</td></tr>'; }

                        return donation_table + '</table><table style="float:left; margin-right: 8px; margin-top: 30px;">' + donation_table2 + '</table><table style="float:left; margin-right: 8px; margin-top: 30px;">' + donation_table3 + '</table><table style="float:left; margin-top: 30px;">' + donation_table4;
                    })() +
                    '</table>' +
                    '</div>';
                return HTML_tab2;
            }
            //Traductions
            function tab3() {
                var HTML_tab3 = "";
                var supported_lang = [getTexts("translations", "info"), getTexts("translations", "add_lang")];
                $.each(LANG, function (a, b) {
                    if (a != "AUTO") { supported_lang.push(a); }
                });

                HTML_tab3 += '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '</div>' +
                    '<div style="bottom: -1px;position: absolute; font-weight: bold;">' +

                    '<div id="diomenu_einstellungen_sendmail" style=" float: left; margin: -5px 0 -5px 10px;">' + dio.createButton(getTexts("translations", "send")) + '</div>' +

                    '<span class="" style="font-weight:bold; float:left; margin-left:20px;">' + getTexts("Settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getTexts("link", "forum") + ' target="_blank">DIO-TOOLS-David1327</a></span>' +

                    '<a id="link_forum" href=' + getTexts("link", "contact") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '</div>' +

                    '<div style="top: -37px;position: absolute; right: 92px;">' +
                    '<a class="ui-dialog-titlebar-help ui-corner-all" id="dio_help" href=' + getTexts("link", "Translations") + ' target="_blank"></a>' +
                    '<div id="dio_donate_btn" style="position:relative; right: -94px; top: 484px; -webkit-filter: hue-rotate(45deg);">' + dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate")) + '</div>' +
                    '</div>';

                HTML_tab3 += grepoGameBorder + getTexts("labels", "Tran") + '<div style="float: right; margin-top: -2px; margin-right: -5px">' + dio.grepo_dropdown_flag("langdiv", supported_lang, null, null, null)[0].outerHTML + '</div></div>';

                //var lngFlags = "";

                HTML_tab3 += '<div id="trans_content" class="contentDiv" style="padding:5px 10px; overflow: auto; height:425px"><b>' + getTexts("translations", "please_note") + ':</b>' +
                    '<br/><ul style="list-style:square outside;padding-left: 13px">' +
                    '<li>' + getTexts("translations", "trans_infotext1") + '</li>' +
                    '<div id="langdiv" sel="0">'; // style="opacity:0.30;"

                $.each(LANG, function (a) {
                    if (a != "AUTO") { HTML_tab3 += '<img value="' + a + '" src="' + Home_img + 'flag.16.' + a + '.png" style="margin:0 5px;">'; }
                });

                HTML_tab3 += '</div>' +
                    '<li>' + getTexts("translations", "trans_infotext2") + '</li>' +
                    '<img src="' + Home_img + 'translations-tuto-1.png" style="margin:0 5px;">' +
                    '<li>' + getTexts("translations", "trans_infotext3") +
                    '<li>' + getTexts("translations", "trans_infotext4") + '</li>' +
                    '<div>' + dio.createButton(getTexts("translations", "send")) + '</div></li>' +
                    '<li>' + getTexts("translations", "trans_infotext5") + '</li>' +
                    '<li>' + getTexts("translations", "trans_infotext6") + '</li>' +

                    '<a id="link_forum" href=' + getTexts("link", "forum") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "cat_forum") + '</span></a>' +

                    '<a id="link_forum" href=' + getTexts("link", "Translations") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '<a id="link_forum" href="https://discord.gg/Q7WXtmRNRW" target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>Discord</span></a>' +

                    '</ul><div style="margin-top:30px"><b>' + getTexts("translations", "credits") + ':</b><ul style="list-style:square outside;">';

                HTML_tab3 += '<table>' +
                    (function () {
                        var translations = [
                            ["DE", "Diony / Krieger des Lichts"],
                            ["EN", "Diony"],
                            ["IT", "amliam / Pyrux"],
                            ["FR", "eclat49 / David1327"],
                            ["RU", "MrBobr"],
                            ["PL", "anpu"],
                            ["ES", "Juana de Castilla"],
                            ["BR", "HELL / BUGS"],
                            ["CZ", "Piwus"],
                            ["RO", "Nicolae01"],
                            ["NL", "Firebloem / Analist434343"],
                            ["GR", "AbstractGR"],
                        ];

                        var translation_table = "";
                        for (var d = 0; d < translations.length; d++) {
                            translation_table += '<tr class="translation"><td style="list-style:square outside;padding-right: 5px"></td><td><img src="' + Home_img + 'flag.16.' + translations[d][0] + '.png" style="margin:0 5px;"></td><td>' + translations[d][0] + ':</td><td class="value">' + translations[d][1] + '</td></tr>';
                        }
                        return translation_table;
                    })() +
                    '</table></div>';
                HTML_tab3 += '</div>';
                //HTML_tab3 += dio.grepo_btn("diomenu_einstellungen_sendmail", getTexts("Settings", "send"))[0].outerHTML;
                return HTML_tab3;
            }
            //???
            function tab4() {

                var HTML_tab4 = '<div style="overflow-x: hidden; padding-left: 5px; position: relative;"></div>' +
                    '</div>' +

                    '<div id="dio_res" style="position: absolute; right: 3px; top: 3px;">' + dio.createButton(getTexts("buttons", "res")) + '</div>' +

                    '<div style="bottom: -1px;position: absolute; font-weight: bold;">' +

                    '<div id="dioerrordio" style=" float: left; margin: -5px 0 -5px 10px;">' + dio.createButton(getTexts("translations", "send")) + '</div>' +

                    '<span class="" style="font-weight:bold; float:left; margin-left:20px;">' + getTexts("Settings", "cat_forum") + ': ' +
                    '<a id="link_contact" href=' + getTexts("link", "forum") + ' target="_blank">DIO-TOOLS-David1327</a></span>' +

                    '<a id="link_forum" href=' + getTexts("link", "contact") + ' target="_blank" style="font-weight:bold; float:left; margin-left:20px;">' +
                    '<img src="' + Home + 'medias/album/lien-1-png" alt="" style="margin: 0px 5px -3px 5px;" /><span>' + getTexts("Settings", "forum") + '</span></a>' +

                    '</div>' +

                    '<div style="top: -37px;position: absolute; right: 92px;">' +
                    '<a style="display: none;" class="ui-dialog-titlebar-help ui-corner-all" id="dio_help" href=' + getTexts("link", "Update") + ' target="_blank"></a>' +
                    '<div id="dio_donate_btn" style="position:relative; right: -94px; top: 504px; -webkit-filter: hue-rotate(45deg);">' + dio.createBtnDonate(getTexts("Settings", "Donate"), null, null, 0, getTexts("link", "Donate")) + '</div>' +
                    '</div>';

                HTML_tab4 += grepoGameBorder + 'BUG</div>';

                var name_a = "", errordio = DATA.error[dio_version], script = uw.MM.DIO.info_dio.script, errorr = uw.MM.DIO.errorDio;

                HTML_tab4 += '<div id="NotifText"><p>' +
                    (script.grcrt ? '<b>Grcrt:</b> true; ' : "") +
                    (script.HMole ? '<b>HMole:</b> true; ' : "") +
                    (script.Gt ? '<b>Gt:</b> true; ' : "") +
                    (script.FLASK ? '<b>FLASK:</b> true; ' : "") +
                    (script.Quack ? '<b>Quack:</b> true; ' : "") +
                    (script.GrepoData ? '<b>GrepoData:</b> true; ' : "") + '</p>';

                $.each(errordio, function (name) {
                    if (name !== "nb") {
                        name_a += '<p><b>Function:</b> ' + errordio[name].function + '<br />' +
                            '<b>Message:</b> ' + errordio[name].message + '<br />' +
                            (typeof (errorr[name]) !== "undefined" ? ('<b>Error:</b> ' + errorr[name].error + '<br />') : "") +
                            '<b>Version:</b> ' + errordio[name].version + '<br />' +
                            '<b>latest_version:</b> ' + uw.MM.DIO.info_dio.latest_version + '<br />' +
                            '<b>Browser:</b> ' + errordio[name].browser + '<br />' +
                            '<b>System:</b> ' + errordio[name].system + '<br />' +
                            '<b>Nb:</b> ' + errordio[name].nb + '<br />' +
                            '<b>Date:</b> ' + errordio[name].date + '<br />' +
                            '<b>Date fin:</b> ' + errordio[name].date_fin + '</p>';
                    }
                });

                HTML_tab4 += name_a;
                if (name_a === "") { HTML_tab4 += "no bug"; }
                HTML_tab4 += '</div>';
                return HTML_tab4;
            }

            function handle_and_style() {

                dio.clipboard("#dio-copy-Traductions-quote", null, "handle_and_style", true)

                $("#dioerrordio").click(() => {
                    var name_a = "", errordio = DATA.error[dio_version], script = uw.MM.DIO.info_dio.script, errorr = uw.MM.DIO.errorDio;
                    var name_b = '' +
                        'Grcrt: ' + (script.grcrt ? true : false) + "; " +
                        'HMole: ' + (script.HMole ? true : false) + "; " +
                        'Gt: ' + (script.Gt ? true : false) + "; " +
                        'FLASK: ' + (script.FLASK ? true : false) + "; " +
                        'Quack: ' + (script.Quack ? true : false) + "; " +
                        'GrepoData: ' + (script.GrepoData ? true : false);

                    $.each(errordio, function (name) {
                        if (name !== "nb") {
                            name_a += 'Function: ' + errordio[name].function + "\n" +
                                'Message: ' + errordio[name].message + "\n" +
                                (typeof (errorr[name]) !== "undefined" ? ('Error: ' + errorr[name].error + "\n") : "") +
                                'Version: ' + errordio[name].version + "\n" +
                                'latest_version ' + uw.MM.DIO.info_dio.latest_version + "\n" +
                                'Browser: ' + errordio[name].browser + "\n" +
                                'System: ' + errordio[name].system + "\n" +
                                'Nb: ' + errordio[name].nb + "\n" +
                                'Date: ' + errordio[name].date + "\n" +
                                'Date fin: ' + errordio[name].date_fin + "\n\n";
                        }
                    });
                    if (name_a === "") {
                        uw.HumanMessage.error(dio_icon + "no bug");
                        return;
                    }
                    uw.hOpenWindow.showConfirmDialog('', getTexts("translations", "send"), function () {
                        var trans_HTML_send = pName + '<br/>' + PID + '<br/>' + WID + '<p/>';

                        var trans_BBcode_send = pName + "\n" + WID + "\n\n";
                        trans_BBcode_send += "`" + name_b + "\n" + name_a + "`\n";

                        createWindowType("DIO_BBCODEE", getTexts("messages", "bbmessages"), 700, 350, true, ["center", "center", 100, 100]);
                        var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div>" +
                            "<div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div>" +
                            "<div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div>" +
                            "<div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
                        //var expRahmen_b = "<div style=\"height: 225px; width: 685px;\">" + trans_HTML_send + "</div>";
                        var expRahmen_c = "</div><textarea id='expTextarea' style=\"height: 225px; width: 685px;\">";
                        var expRahmen_d = "</textarea></div><center>" + dio.createButton(getTexts("messages", "copy"), "dio-copy-Traductions-quote", null, 'data-clipboard-target="#expTextarea"') + "</center>";
                        var expRahmen_e = "<div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";

                        var expTitel = getTexts("messages", "Tol");
                        var BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_BBCODEE) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE).close();
                        //BBwnd.setTitle(getTexts("qtoolbox", "bb_codes") + " - " + getTexts("bbcode", "messages"));
                        BBwnd.setContent(expRahmen_a + expTitel + expRahmen_c + trans_BBcode_send + expRahmen_d + expRahmen_e);

                    });
                });

                $("#dio_res").click(() => {
                    uw.hOpenWindow.showConfirmDialog('', getTexts("labels", "raf"), function () {
                        deleteValue("error");
                        location.reload();
                    });
                });

                $("#diomenu_einstellungen_sendmail").css({ "margin-left": "1px" });

                $("#diomenu_einstellungen_sendmail").click(function () {
                    if ($("#trans_lang").length && !$.trim($("#trans_lang").val())) {
                        uw.HumanMessage.error(dio_icon + getTexts("translations", "enter_lang_name"));
                        return;
                    } else if ($("#langdiv").val() === getTexts("Settings", "info")) {
                        uw.HumanMessage.error(dio_icon + getTexts("translations", "choose_lang"));
                        return;
                    } else if ($("#trans_content .toSend").length === 0) {
                        uw.HumanMessage.error(dio_icon + getTexts("translations", "no_translation"));
                        return;
                    }
                    uw.hOpenWindow.showConfirmDialog('', getTexts("translations", "trans_sure"), function () {
                        //$("#ajax_loader").css({"visibility":"visible"});
                        var trans_HTML_send = pName + '<br/>' + PID + '<br/>' + WID + '<p/>';
                        $('#trans_content > DIV').each(function (i) {
                            if ($('.toSend', this).length != 0) {
                                trans_HTML_send += '<b>' + $('SPAN', this).text() + ': {</b><br/>';
                                $('.toSend', this).each(function (index) {
                                    trans_HTML_send += $(this).data('name') + ': "' + $('td:last textarea', this).val() + '",<br/>';
                                });
                                trans_HTML_send += '},<br/>';
                            }
                        });
                        /*var trans_BBcode_send = pName + '\n';
                        trans_BBcode_send += '\n' + $("#diolang").text().toLowerCase() + ' : {\n';
                        $('#trans_content > DIV').each(function (i) {
                            if ($('.toSend', this).length != 0) {
                                trans_BBcode_send += '\n' + $('SPAN', this).text() + ' : {\n';
                                $('.toSend', this).each(function (index) {
                                    trans_BBcode_send += $(this).data('name') + ' : "' + $("td:last textarea", this).val() + '",\n';
                                });
                                trans_BBcode_send += '},\n';
                            }
                        });
                        trans_BBcode_send += "\n},\n";*/

                        var trans_BBcode_send = pName + '\n';
                        trans_BBcode_send += '\n' + $("#diolang").text().toLowerCase() + ' : {\n';
                        $('#trans_content > DIV').each(function (i) {
                            if ($('.toSend', this).length != 0) {
                                trans_BBcode_send += '\n' + $('SPAN', this).text() + ' : {\n';
                                if ($('SPAN', this).text() != "Options") {
                                    $('.toSend', this).each(function (index) {
                                        trans_BBcode_send += $(this).data('name') + ' : "' + $("td:last textarea", this).val() + '",\n';
                                    });
                                } else {
                                    $('.toSend', this).each(function (index) {
                                        trans_BBcode_send += $(this).data('name') + ' : ["' + $("#diobb1 textarea", this).val() + '","' + $("#diobb2 textarea", this).val() + '"],\n';
                                    });
                                }
                                trans_BBcode_send += '},\n';
                            }
                        });
                        trans_BBcode_send += "\n},\n";

                        createWindowType("DIO_BBCODEE", getTexts("messages", "bbmessages"), 700, 350, true, ["center", "center", 100, 100]);
                        var expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div>" +
                            "<div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div><div class='game_border_corner corner1'></div>" +
                            "<div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div>" +
                            "<div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
                        //var expRahmen_b = "<div style=\"height: 225px; width: 685px;\">" + trans_HTML_send + "</div>";
                        var expRahmen_c = "</div><textarea id='expTextarea' style=\"height: 225px; width: 685px;\">";
                        var expRahmen_d = "</textarea></div><center>" + dio.createButton(getTexts("messages", "copy"), "dio-copy-Traductions-quote", null, 'data-clipboard-target="#expTextarea"') + "</center>";
                        var expRahmen_e = "<div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";

                        var expTitel = getTexts("messages", "Tol");
                        var BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_BBCODEE) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE).close();
                        //BBwnd.setTitle(getTexts("qtoolbox", "bb_codes") + " - " + getTexts("bbcode", "messages"));
                        BBwnd.setContent(expRahmen_a + expTitel + expRahmen_c + trans_BBcode_send + expRahmen_d + expRahmen_e);

                    });
                });

                /*$("#diomenu_einstellungen_sendmail").click(function () {
                    if ($("#trans_lang").length && !$.trim($("#trans_lang").val())) {
                        uw.HumanMessage.error(dio_icon + getTexts("Settings", "enter_lang_name"));
                        return;
                    } else if ($("#langdiv").val() === getTexts("Settings", "info")) {
                        uw.HumanMessage.error(dio_icon + getTexts("Settings", "choose_lang"));
                        return;
                    } else if ($("#trans_content .toSend").length === 0) {
                        uw.HumanMessage.error(dio_icon + getTexts("Settings", "no_translation"));
                        return;
                    }
                    hOpenWindow.showConfirmDialog('', getTexts("Settings", "trans_sure"), function () {
                        $("#ajax_loader").css({"visibility":"visible"});
                        var trans_HTML_send = pName + "<br/>" + PID + "<br/>" + WID + "<p/>";
                        $("#trans_content > DIV").each(function (i) {
                            if ($(".toSend", this).length != 0) {
                                trans_HTML_send += "<b>" + $("SPAN", this).text() + " : {</b><br/>";
                                $(".toSend", this).each(function (index) {
                                    trans_HTML_send += $(this).data("name") + " : '" + $("td:last textarea", this).val() + "',<br/>";
                                });
                                trans_HTML_send += "},<br/>";
                            }
                        });
                        var xhr = $.ajax({
                            type : 'POST',
                            url : "smtp-relay.sendinblue.com",
                            dataType : 'json',
                            data : {
                                key : 'QfLaN1Yh4ctSUApK',
                                message : {
                                    html : trans_HTML_send,
                                    subject : 'Quack Toolsammlung Translation ' + $("#langdiv").val(),
                                    from_email : "123@cuvox.de",
                                    to : [{
                                        "email" : "124@cuvox.de",
                                    }
                                         ]
                                }
                            }
                        });
                        xhr.done(function (data) {
                            $("#ajax_loader").css({"visibility":"hidden"});
                            uw.HumanMessage.success(dio_icon + getTexts("Settings", "trans_success"));

                        });
                        xhr.fail(function (jqXHR, textStatus, errorThrown) {
                            $("#dioajaxloader").css({
                                "display" : "none"
                            });
                            uw.HumanMessage.error(dio_icon + getTexts("Settings", "trans_fail"));
                        });
                    });
                });*/

                $(".contentDiv > DIV:last-child").css({
                    "margin-bottom": "5px"
                });
                $("#langdiv").change(function () {
                    var lang_tab3 = $(this).val().toLowerCase();
                    var langHTML_tab3 = "";
                    langHTML_tab3 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><div><b>' + getTexts("translations", "trans") + ': </b><b id="diolang">' + lang_tab3.toUpperCase() + '</b>';
                    if ($(this).val() === getTexts("translations", "add_lang")) {
                        langHTML_tab3 += '</div></div>';
                    } else langHTML_tab3 += '<img src="' + Home_img + 'flag.48.' + lang_tab3 + '.png" style="margin: 0 5px; position: relative; top: -13px; float: right; right: -13px;"></div></div>';

                    if ($(this).val() === getTexts("translations", "info")) {
                        BBwnd.setContent(inhalte.dioset_tab3);
                        handle_and_style();
                        return;
                    } else if ($(this).val() === getTexts("translations", "add_lang")) {
                        langHTML_tab3 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + getTexts("translations", "language") + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
                        langHTML_tab3 += '<tr><td style="width:50%"><div style="max-height:100px; overflow:auto">' + getTexts("translations", "name") + '</div></td>';
                        langHTML_tab3 += '<td style="width:50%"><textarea id="trans_lang"></textarea></td>';
                        langHTML_tab3 += '</tr></tbody></table></div>';
                    }
                    $.each(LANG.en, function (a, b) {
                        if (a != "Notification" && a != "link") {

                            langHTML_tab3 += '<div style="margin-top: 5px; padding: 5px; border: 1px solid #B48F45"><span><b>' + a + '</b></span><br /><table width="100%" cellspacing="1" border="0"><tbody>';
                            $.each(b, function (c, d) {
                                var text = (LANG[lang_tab3] != undefined && LANG[lang_tab3][a] != undefined && LANG[lang_tab3][a][c] != undefined) ? (LANG[lang_tab3][a][c] === "" ? "salmon" : "#fff0cf") : "salmon";
                                langHTML_tab3 += '<tr data-name="' + c + '">';
                                if (a != "Options") {
                                    langHTML_tab3 += '<td style="width:40%"><div style="max-height:100px; overflow:auto">' + d + '</div></td>';
                                    langHTML_tab3 += (LANG[lang_tab3] != undefined && LANG[lang_tab3][a] != undefined && LANG[lang_tab3][a][c] != undefined) ?
                                        '<td style="width:60%"><textarea style="background-color: ' + text + ';">' + LANG[lang_tab3][a][c] + '</textarea></td>' : '<td style="width:60%"><textarea style="background-color: ' + text + ';">' + LANG.en[a][c] + '</textarea></td>';
                                    langHTML_tab3 += '</tr>';
                                }
                                else {
                                    langHTML_tab3 += '<td style="width:40%"><div style="max-height:100px; overflow:auto">' + d[0] + '\n</div><div style="max-height:100px; overflow:auto">' + d[1] + '</div></td>';
                                    langHTML_tab3 += (LANG[lang_tab3] != undefined && LANG[lang_tab3][a] != undefined && LANG[lang_tab3][a][c] != undefined) ?
                                        '<td id="diobb1" style="width:30%"><textarea style="background-color: ' + text + ';">' + LANG[lang_tab3][a][c][0] + '</textarea></td>' : '<td id="diobb1" style="width:30%"><textarea style="background-color: ' + text + ';">' + LANG.en[a][c][0] + '</textarea></td>';
                                    langHTML_tab3 += (LANG[lang_tab3] != undefined && LANG[lang_tab3][a] != undefined && LANG[lang_tab3][a][c] != undefined) ?
                                        '<td id="diobb2" style="width:30%"><textarea style="background-color: ' + text + ';">' + LANG[lang_tab3][a][c][1] + '</textarea></td>' : '<td id="diobb2" style="width:30%"><textarea style="background-color: ' + text + ';">' + LANG.en[a][c][1] + '</textarea></td>';
                                    langHTML_tab3 += '</tr>';
                                }
                            });
                            langHTML_tab3 += '</tbody></table></div>';
                        }
                    });
                    $("#trans_content").html(langHTML_tab3);
                    $("#trans_content td").css({ "border-top": "1px solid grey" });
                    $("#trans_content textarea").css({
                        //"height" : "18px",
                        "width": "99%",
                        "resize": "vertical",
                        "margin": "0",
                        "padding": "0"
                    });
                    $("#trans_content textarea").on("change", function () {
                        $(this).parent().css({ "border": "1px solid green" });
                        $(this).parent().parent().addClass("toSend");
                        $(this).val($(this).val());
                    });
                    $(".contentDiv div:last-child").css({ "margin-bottom": "5px" });
                });
            }
            var BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_Notification) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_Notification);
            //BBwnd.setTitle(getTexts("qtoolbox", "settings"));
            if (dio.bug) { BBwnd.setContent(inhalte.dioset_tab4); }
            else if (dio.add_lang) { BBwnd.setContent(inhalte.dioset_tab3); }
            else { BBwnd.setContent(inhalte.dioset_tab1); }
            if ($("#diomenu_settings_tabs").length === 0) {
                BBwnd.getJQElement().append('<ul id="diomenu_settings_tabs" class="menu_inner" style="top: 7px;right: 144px;">' +
                    dio.grepo_submenu("dioset_tab4", "BUG")[0].outerHTML +
                    dio.grepo_submenu("dioset_tab3", getTexts("translations", "translations"))[0].outerHTML +
                    dio.grepo_submenu("dioset_tab2", getTexts("labels", "donat"))[0].outerHTML +
                    dio.grepo_submenu("dioset_tab1", getTexts("Settings", "Update"))[0].outerHTML + '</ul>');
            }
            $("#diomenu_settings_tabs li a").removeClass("active");
            if (dio.bug) {
                $("#dioset_tab4").addClass("active");
                dio.bug = false
            } else if (dio.add_lang) {
                $("#dioset_tab3").addClass("active");
                dio.add_lang = false
            } else { $("#dioset_tab1").addClass("active"); }
            handle_and_style();
            $("#diomenu_settings_tabs li a").click(function () {
                $("#diomenu_settings_tabs li a").removeClass("active");
                $(this).addClass("active");
                BBwnd.setContent(inhalte[this.id]);
                handle_and_style();
            });
        },
        create: function (titre, feature, DIO, color) {
            var Notification = new uw.NotificationHandler();
            Notification.notify($('#notification_area>.notification').length + 1, uw.NotificationType[DIO],
                "<span style='color:" + color + "'><b><u>" + titre + "!</u></b></span>" + feature + "<span class='small notification_date'>DIO-Tools-david1327: v" + dio_version + "</span>");
        },
        addCopyListener: function () {
            dio.clipboard("#dio-copy-Traductions-quote", null, "handle_and_style", true)
        },
    };

    /*******************************************************************************************************************************
        * compatibility Script
        *******************************************************************************************************************************/
    var compatibility = {
        flask_tools: function () {
            // compatibility flask-tools
            if (typeof (uw.FLASK_GAME) !== "undefined") {
                uw.HumanMessage.error(dio_icon + "flask");
                //Units overview
                $('#available_units_bullseye').remove();
                $('#available_units_bullseye_addition').remove();
                $('#flask_available_units_style').remove();
                $('#flask_available_units_style_addition').remove();

                //Unit Comparison
                $('#btn_available_units').remove();

                if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_FLASK_UNITS)) {
                    uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_FLASK_UNITS).close();
                }

                //Unit strength
                $('#strength').remove();
                $('#flask_strength_style').remove();

                //Simulator
                $('#flask_simulator_strength_style').remove();
                $('#flask_simulator_strength').remove();

                //Recruiting trade
                $('#flask_style_recruiting_trade').remove();

                //Transport capacity
                $('#transporter').remove();

                //Map
                $("#flask_game_list_header_style").remove();
                $("#flask_town_popup_style").remove();

                //style
                $('<style>' +
                    '#ui_box .btn_settings.flask_settings { top: 52px; right: 110px; } ' +
                    '#flask_townbb { left: 182px; } ' +
                    '#flask_simulator_strength {display: none; } ' +
                    //
                    '.btn.btn_trade {display: none!important; } ' +
                    //Recruiting trade
                    '.rec_trade {display: none!important; } ' +
                    //Defense form
                    '.flask_bbcode_option {display: none!important; } ' +
                    //
                    '#pop_baracks, #strength_baracks {display: none!important; } ' +

                    '</style>').appendTo('head');
            };
        },
    };

    /*******************************************************************************************************************************
     * Mousewheel Zoom
     *******************************************************************************************************************************/

    var MouseWheelZoom = {
        activate: function () {
            // Agora
            $('<style id="dio_Agora_style">#dio_Agora {position: absolute; width: 144px; height: 26px; left: 1px; z-index: 5;}</style>').appendTo('head');
            $('<a id="dio_Agora"></a>').appendTo('.nui_battlepoints_container');
            $("#dio_Agora").click(() => { uw.PlaceWindowFactory.openPlaceWindow(); });

            // Scroll trough the views
            $('#main_area, #dio_political_map, .viewport, .sjs-city-overview-viewport').bind('mousewheel', function (e) {
                e.stopPropagation();
                var current = $('.bull_eye_buttons .checked').get(0).getAttribute("name"), delta = 0, scroll, sub_scroll = 6;

                switch (current) {
                    case 'strategic_map':
                        scroll = 3;
                        break;
                    case 'island_view':
                        scroll = 2;
                        break;
                    case 'city_overview':
                        scroll = 1;
                        break;
                }
                delta = -e.originalEvent.detail || e.originalEvent.wheelDelta; // Firefox || Chrome & Opera

                //console.debug("cursor_pos", e.pageX, e.pageY);

                if (scroll !== 4) {
                    if (delta < 0) { scroll += 1; }
                    else { scroll -= 1; }
                } else {
                    // Zoomstufen bei der Politischen Karte
                    sub_scroll = $('.zoom_select').get(0).selectedIndex;

                    if (delta < 0) { sub_scroll -= 1; }
                    else { sub_scroll += 1; }
                    if (sub_scroll === -1) { sub_scroll = 0; }
                    if (sub_scroll === 7) { scroll = 3; }
                }
                switch (scroll) {
                    case 3:
                        $('.bull_eye_buttons .strategic_map').click();
                        $('#popup_div').css('display', 'none');
                        break;
                    case 2:
                        $('.bull_eye_buttons .island_view').click();
                        TownPopup.remove();
                        break;
                    case 1:
                        $('.bull_eye_buttons .city_overview').click();
                        break;
                }

                // Prevent page from scrolling
                return false;
            });
        },
        deactivate: function () {
            $('#main_area, .ui_city_overview').unbind('mousewheel');
            $('#dio_Agora').remove();
            $('#dio_Agora_style').remove();
        }
    };

    /*******************************************************************************************************************************
     * Body Handler
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Town icon
     * | ● Town icon (Map)
     * | ● Town Popup
     * | ● Town list: Adds town type to the town list
     * | ● Swap Context Icons
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // Fix icon update when switching cities
    function updateIcon() {
        setTimeout(function () {
            var townType = (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")));
            $('#town_icon .icon_big').removeClass().addClass('icon_big townicon_' + townType + " auto");
            $('#town_icon .icon_big').css({ backgroundPosition: TownIcons.types[townType] * -25 + 'px 0px' });
        }, 200);
    };

    /*******************************************************************************************************************************
     * Town icon
     *******************************************************************************************************************************/
    var TownIcons = {
        timeout: null,
        types: {
            // Automatic Icons
            lo: 0,
            ld: 3,
            so: 6,
            sd: 7,
            fo: 10,
            fd: 9,
            bu: 14, /* Building */
            po: 22,
            no: 12,

            // Manual Icons
            fa: 20, /* Favor */
            re: 15, /* Resources */
            di: 2, 	/* Distance */
            sh: 1, 	/* Pierce */
            lu: 13, /* ?? */
            dp: 11, /* Diplomacy */
            ha: 15, /* ? */
            si: 18, /* Silber */
            ra: 17,
            ch: 19, /* Research */
            ti: 23, /* Time */
            un: 5,
            wd: 16, /* Wood */
            wo: 24, /* World */
            bo: 13, /* Booty */
            gr: 21, /* Lorbeer */
            st: 17, /* Stone */
            is: 26, /* ?? */
            he: 4, 	/* Helmet */
            ko: 8, 	/* Kolo */
            O1: 58,
            O2: 59,
            O3: 60,
            O4: 61,
            O5: 62,
            O6: 63,

            OO: 25,	/* Kolo */

            SL: 26,	// Slinger
            CB: 27,	// Cerberus
            SW: 28,	// Chariot
            CE: 29,	// Colony ship
            CY: 30,	// Calydonian boar
            DS: 31,	// Fire ship
            FS: 32,	// Light ship
            BI: 33,	// Bireme
            TR: 34,	// Trireme
            GF: 35,	// Griffin
            MN: 36,	// Manticore
            MD: 37,	// Medusa
            EY: 38,	// Erinys
            HP: 39,	// Harpy
            HD: 40,	// Hydra
            CT: 41,	// Centaur
            PG: 42,	// Pegasus
            RE: 43,	// Horseman
            HO: 44,	// Hoplite
            CA: 45,	// Catapult
            ee: 46, //
            SK: 47,	// Swordsman
            BS: 48,	// Archer
            MT: 49,	// Minotaur
            CL: 50,	// Cyclop
            SE: 51,	// Siren
            ST: 52,	// Satyr
            LD: 53,	// Ladon
            SR: 54,	// Spartoi
            BT: 55,
            BE: 56,
            Bo: 57,

            a1: 64,
            a2: 65,
            a3: 66,
            a4: 67,
            a5: 68,
            a6: 69,
            a7: 70,
            a8: 71,
        },
        deactivate: function () {
            $('#town_icon').remove();
            $('#dio_townicons_field').remove();
            clearTimeout(TownIcons.timeout);
            TownIcons.timeout = null;
        },
        activate: function () {
            try {
                TownIcons.timeout = setInterval(() => { updateIcon(); }, 800);

                $('<div id="town_icon"><div class="town_icon_bg"><div class="icon_big townicon_' + (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no") + " auto")) + '"></div></div></div>').appendTo('.town_name_area');

                // Town Icon Style
                $('#town_icon .icon_big').css({ backgroundPosition: TownIcons.types[(manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")))] * -25 + 'px 0px' });
                //console.debug(dio_sprite);
                $('<style id="dio_townicons_field" type="text/css">' +
                    '#town_icon { background:url(' + dio_sprite + ') 0 -125px no-repeat; position:absolute; width:69px; height:61px; left:-47px; top:0px; z-index: auto; } ' +
                    '#town_icon .town_icon_bg { background:url(' + dio_sprite + ') -76px -129px no-repeat; width:43px; height:43px; left:25px; top:4px; cursor:pointer; position: relative; } ' +
                    '#town_icon .town_icon_bg:hover { filter:url(#Brightness11); -webkit-filter:brightness(1.1); box-shadow: 0px 0px 15px rgb(1, 197, 33); } ' +
                    '#town_icon .icon_big	{ position:absolute; left:9px; top:9px; height:25px; width:25px; } ' +

                    '#town_icon .select_town_icon {position: absolute; top:47px; left:23px; width:236px; display:none; padding:2px; border:3px inset rgb(7, 99, 12); box-shadow:rgba(0, 0, 0, 0.5) 4px 4px 6px; border-radius:0px 10px 10px 10px; z-index: 5003;' +
                    'background:url(https://gpall.innogamescdn.com/images/game/popup/middle_middle.png); } ' +
                    '#town_icon .item-list {max-height: none; align: right; overflow: hidden; } ' +

                    '#town_icon .option_s { cursor:pointer; width:20px; height:20px; margin:0px; padding:2px 2px 3px 3px; border:2px solid rgba(0,0,0,0); border-radius:5px; background-origin:content-box; background-clip:content-box;} ' +
                    '#town_icon .option_s:hover { border: 2px solid rgb(59, 121, 81) !important;-webkit-filter: brightness(1.3); } ' +
                    '#town_icon .sel { border: 2px solid rgb(202, 176, 109); } ' +
                    '#town_icon hr { width:265px; margin:0px 0px 7px 0px; position:relative; top:3px; border:0px; border-top:2px dotted #000; float:left} ' +
                    '#town_icon .auto_s { width:160px; height:16px; float:left; margin-right: 3px;} ' +
                    '#town_icon .dio_icon.b { width: 26px; height: 22px; float: right; margin: 0;  margin-right: 3px;} ' +
                    '#town_icon .défaut_s { background:url(' + Home_img + 'arrows-20px-1.png) no-repeat; width:17px; height:17px; float: right; margin-right: 3px;} ' +

                    // Quickbar modification
                    '.ui_quickbar .left, .ui_quickbar .right { width:46%; } ' +

                    // because of Kapsonfires Script and Beta Worlds bug report bar:
                    '.town_name_area { z-index:11; left:52%; } ' +
                    '.town_name_area .left { z-index:20; left:-39px; } ' +
                    '.town_name_area .button.GMHADD {left: -134px !important; z-index: 100 !important;}' +
                    '#town_groups_list {margin-left: -20px;}' +

                    '#dio_tic2 { display:block!important; }' +

                    '</style>').appendTo('head');

                var icoArray = [
                    'lo', 'ld', 'fo', 'fd', 'so', 'sd', 'no', 'po',
                    'sh', 'di', 'un', 'ko', 'ti', 'gr', 'dp', 're',
                    'wd', 'st', 'si', 'bu', 'he', 'ch', 'bo', 'fa',
                    'wo', 'OO', 'O1', 'O2', 'O3', 'O4', 'O5', 'O6',
                    'hr',
                    'FS', 'BI', 'TR', 'BT', 'BE', 'CE', 'DS', 'SK',
                    'SL', 'BS', 'HO', 'RE', 'SW', 'CA', 'CT', 'CB',
                    'CL', 'EY', 'MD', 'MT', 'HD', 'HP', 'MN', 'PG',
                    'GF', 'CY', 'SE', 'ST', 'LD', 'SR', 'ee', 'Bo',
                    'hr',
                    'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
                ];

                // Fill select box with town icons
                $('<div class="select_town_icon dropdown-list default active"><div class="item-list"></div></div>').appendTo("#town_icon");
                for (var i in icoArray) {
                    if (icoArray.hasOwnProperty(i)) {
                        if (icoArray[i] === 'hr') { $('.select_town_icon .item-list').append('<hr>'); }
                        else { $('.select_town_icon .item-list').append('<div class="option_s dio_icon_small townicon_' + icoArray[i] + '" name="' + icoArray[i] + '"></div>'); }
                    }
                }
                $('<hr><div class="option_s auto_s" name="auto"><b>Auto</b></div>' +
                    '<div class="option_s défaut_s" name="défaut"></div>' +
                    '<div class="dio_icon b"></div>').appendTo('.select_town_icon .item-list');

                $('#town_icon .auto_s').tooltip('<table style="width:600px" class="">' +
                    '<tr><td><div class="dio_icon_small townicon_lo"></div>' + getTexts("Town_icons", "LandOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_fo"></div>' + getTexts("Town_icons", "FlyOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_so"></div>' + getTexts("Town_icons", "NavyOff") + '</td>' +
                    '<td><div class="dio_icon_small townicon_no"></div>' + getTexts("Town_icons", "Out") + '</td></tr>' +
                    '<tr><td><div class="dio_icon_small townicon_ld"></div>' + getTexts("Town_icons", "LandDef") + '</td>' +
                    '<td><div class="dio_icon_small townicon_fd"></div>' + getTexts("Town_icons", "FlyDef") +
                    '<td><div class="dio_icon_small townicon_sd"></div>' + getTexts("Town_icons", "NavyDef") + '</td>' +
                    '<td><div class="dio_icon_small townicon_po"></div>' + getTexts("Town_icons", "Emp") + '</td></tr>' +
                    '</table>');
                $('#town_icon .défaut_s').tooltip(dio_icon + getTexts("buttons", "res"));

                $('#town_icon .option_s').click(function () {
                    $("#town_icon .sel").removeClass("sel");
                    $(this).addClass("sel");

                    if ($(this).attr("name") === "auto") {
                        delete manuTownTypes[uw.Game.townId];
                        manuTownAuto[uw.Game.townId] = true;
                        //getAllUnits();
                    } else if ($(this).attr("name") === "défaut") {
                        delete manuTownTypes[uw.Game.townId];
                        delete manuTownAuto[uw.Game.townId];
                        //getAllUnits();
                    } else {
                        manuTownTypes[uw.Game.townId] = $(this).attr("name");
                    }
                    TownIcons.changeTownIcon();
                    getAllUnits();
                    TownList.change();

                    // Update town icons on the map
                    if (DATA.options.dio_tim) { Map.add(); } //setOnMap();

                    saveValue(WID + "_townTypes", JSON.stringify(manuTownTypes));
                    saveValue(WID + "_townAuto", JSON.stringify(manuTownAuto));
                });

                // Show & hide drop menus on click
                $('#town_icon .town_icon_bg').click(() => {
                    var el = $('#town_icon .select_town_icon').get(0);
                    if (el.style.display === "none") { el.style.display = "block"; }
                    else { el.style.display = "none"; }
                });

                $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "")) + '"]').addClass("sel");

            } catch (error) { errorHandling(error, "addTownIcon"); }
        },
        changeTownIcon: function () {
            var townType = (manuTownTypes[uw.Game.townId] || ((autoTownTypes[uw.Game.townId] || "no")));
            $('#town_icon .icon_big').removeClass().addClass('icon_big townicon_' + townType + " auto");
            $('#town_icon .sel').removeClass("sel");
            $('#town_icon .select_town_icon [name="' + (manuTownTypes[uw.Game.townId] || (autoTownTypes[uw.Game.townId] ? "auto" : "")) + '"]').addClass("sel");

            $('#town_icon .icon_big').css({ backgroundPosition: TownIcons.types[townType] * -25 + 'px 0px' });

            $('#town_icon .select_town_icon').get(0).style.display = "none";

        },
        auto: {
            activate: function () {
                setTimeout(function () {
                    getAllUnits();
                    TownIcons.changeTownIcon();
                }, 100);
            },
            deactivate: function () {
                setTimeout(function () {
                    getAllUnits();
                    TownIcons.changeTownIcon();
                }, 100);
            },
        },
    };

    // Style for town icons
    var style_str = '<style id="dio_townicons" type="text/css">';
    for (var s in TownIcons.types) {
        if (TownIcons.types.hasOwnProperty(s)) {
            style_str += '.townicon_' + s + ' { background:url(' + dio_spritetest + ') ' + (TownIcons.types[s] * -25) + 'px -26px repeat;float:left;} ';
        }
    }
    style_str += '</style>';
    $(style_str).appendTo('head');

    /*******************************************************************************************************************************
     * Town icon (Map)
     *******************************************************************************************************************************/
    var Map = {
        timeout: null,
        // TODO: activate aufspliten in activate und add
        activate: function () {
            Map.timeout = setInterval(() => { Map.add(); }, 800);

            //style
            $("<style id='dio_townicons_map' type='text/css'>" +
                ".own_town .flagpole, #main_area .m_town.player_" + PID + " { z-index: 100; width:19px!important; height:19px!important; border-radius: 11px; border: 3px solid rgb(16, 133, 0); margin: -4px !important; font-size: 0em !important; box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5); } " +
                "#dio_town_popup .count { position: absolute; bottom: 1px; right: 1px; font-size: 10px; } " +
                "#minimap_islands_layer .m_town { text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.7); } " +
                "#minimap_canvas.expanded.night, #map.night .flagpole { filter: brightness(0.7); -webkit-filter: brightness(0.7); } " +
                "#minimap_click_layer { display:none; }" +
                "</style>").appendTo("head");
            Map.add();
        },
        add: function () {
            try {
                // Style for own towns (town icons)
                for (var e in autoTownTypes) {
                    if (autoTownTypes.hasOwnProperty(e)) {
                        $("#mini_t" + e + ", #town_flag_" + e + " .flagpole").css({
                            "background": "rgb(255, 187, 0) url(" + dio_spritetest + ") repeat",
                            "background-position": (TownIcons.types[(manuTownTypes[e] || autoTownTypes[e])] * -25) + "px -27px",
                        });
                    }

                    $('#minimap_islands_layer').off("mousedown");
                    $('#minimap_islands_layer').on("mousedown", function () {
                        if (typeof ($('#context_menu').get(0)) !== "undefined") {
                            $('#context_menu').get(0).remove();
                        }
                    });
                }
            } catch (error) { errorHandling(error, "Map.add"); }
        },
        deactivate: function () {
            $('#dio_townicons_map').remove();
            clearTimeout(Map.timeout);
            Map.timeout = null;
            $(".own_town .flagpole, #main_area .m_town").css({ "background": "" });
        }
    };

    /*******************************************************************************************************************************
     * Town Popup
     *******************************************************************************************************************************/
    var TownPopup = {
        activate: function () {

            $('<style id="dio_town_popup_style" type="text/css">' +
                '#Town_Popup { display:block!important;} ' +
                '#dio_town_popup { position:absolute; z-index:6003; max-width: 173px;} ' +

                '#dio_town_popup .title { margin:5px;font-weight: bold; margin-right: 15px;} ' +

                '#dio_town_popup .dio_icon { position:absolute; right:12px; top:8px; height: 22px; width: 25px; filter:sepia(1); -webkit-filter:sepia(1); opacity:0.5; } ' +

                '#dio_town_popup .unit_content, ' +
                '#dio_town_popup .move_counter_content, ' +
                '#dio_town_popup .spy_content, ' +
                '#dio_town_popup .god_content, ' +
                '#dio_town_popup .hero_content, ' +
                '#dio_town_popup .resources_content { background-color: #ffe2a1; border: 1px solid #e1af55; margin-top:2px; padding: 4px; font-family: Arial;font-weight: 700;font-size: 0.8em; } ' +
                '#dio_town_popup .resources_content { text-align: right; margin-top:3px; } ' +

                '#dio_town_popup .resources_content table { min-width:95% } ' +

                '#dio_town_popup .footer_content { margin-top:3px;  } ' +
                '#dio_town_popup .footer_content table { width:100%; } ' +

                '#dio_town_popup .spy_content { height:25px; margin-right:3px; } ' +
                '#dio_town_popup .god_content { width:25px; } ' +
                '#dio_town_popup .hero_content { width:25px; } ' +

                '#dio_town_popup .god_mini { transform:scale(0.4); margin: -19px; } ' +

                '#dio_town_popup .count { position: absolute; bottom: -2px; right: 2px; font-size: 10px; font-family: Verdana,Arial,Helvetica,sans-serif; } ' +
                '#dio_town_popup .four_digit_number .count { font-size:8px !important; } ' +
                '#dio_town_popup .unit_icon25x25 { border: 1px solid #6e4b0b; margin: 1px; } ' +
                '#dio_town_popup .wall { width:25px; height:25px; background-image:url(https://gpde.innogamescdn.com/images/game/main/wall.png); border: 1px solid #6e4b0b; margin: 1px; display: inline-block; vertical-align: middle; background-size: 100%; } ' +

                // Spy Icon
                '#dio_town_popup .support_filter { margin: 0px 4px 0px 0px; float:left; } ' +
                '#dio_town_popup .spy_text { line-height: 2.3em; float:left; } ' +

                // fury Icon
                '#dio_town_popup .fury_icon { width:22px; height:15px; background: url(' + Home_img + 'fury.png) no-repeat; margin-left:2px; display: inline-block; vertical-align: middle; background-size: 75%;} ' +

                // support Icon
                '#dio_town_popup .support_icon { width:16px; height:16px; background: url(' + Home_img + 'support-16px.png); margin: 1px; margin-bottom: 2px; display: inline-block; vertical-align: middle; background-size: 100%;} ' +
                // attack Icon
                '#dio_town_popup .attack_icon { width:16px; height:16px; background: url(' + Home_img + 'attack-16px.png); margin: 1px; margin-bottom: 2px; display: inline-block; vertical-align: middle; background-size: 100%;} ' +

                // Bei langen Stadtnamen wird sonst der Rand abgeschnitten:
                '#dio_town_popup .popup_middle_right { min-width: 11px; } ' +

                // Mouseover Effect
                '.own_town .flagpole:hover, .m_town:hover { z-index: 101 !important; filter: brightness(1.2); -webkit-filter: brightness(1.2); font-size: 2em; margin-top: -1px; } ' +
                '.own_town .flagpole, #main_area .m_town { cursor: pointer; } ' +

                // Context menu on mouse click
                '#minimap_islands_layer .m_town { z-index: 99; cursor: pointer; } ' +

                '</style>').appendTo('head');
            // Town Popups on Strategic map
            $('#minimap_islands_layer').off('mouseout', '.m_town');
            $('#minimap_islands_layer').on('mouseout', '.m_town', function () { TownPopup.remove(); });
            $('#minimap_islands_layer').off('mouseover', '.m_town');
            $('#minimap_islands_layer').on('mouseover', '.m_town', function () { TownPopup.add(this); });

            // Town Popups on island view
            $('#map_towns').off('mouseout', '.own_town .flagpole');
            $('#map_towns').on('mouseout', '.own_town .flagpole', function () { TownPopup.remove(); });
            $('#map_towns').off('mouseover', '.own_town .flagpole');
            $('#map_towns').on('mouseover', '.own_town .flagpole', function () { TownPopup.add(this); });

        },
        deactivate: function () {
            $("#dio_town_popup_style").remove();
            // Events entfernen
            $('#minimap_islands_layer').off('click', '.m_town');
            $('#minimap_islands_layer').off("mousedown");

            $('#minimap_islands_layer').off('mouseout', '.m_town');
            $('#minimap_islands_layer').off('mouseover', '.m_town');
        },
        add: function (that) {
            var townID = 0;
            var popup_left = 0, popup_top = 0, classSize = "";
            //console.debug("TOWN", $(that).offset(), that.id);

            if (that.id === "") {
                // Island view
                townID = parseInt($(that).parent()[0].id.substring(10), 10);
                if (DATA.options.dio_tim) {
                    popup_left = ($(that).offset().left + 20);
                    popup_top = ($(that).offset().top + 20);
                } else {
                    popup_left = ($(that).offset().left + 15);
                    popup_top = ($(that).offset().top + 15);
                }
            }
            else {
                // Strategic map
                townID = parseInt(that.id.substring(6), 10);
                if (DATA.options.dio_tim) {
                    popup_left = ($(that).offset().left - 150);
                    popup_top = ($(that).offset().top + 20);
                } else {
                    popup_left = ($(that).offset().left - 145);
                    popup_top = ($(that).offset().top + 15);
                }
            }
            // Own town?
            if (typeof (uw.ITowns.getTown(townID)) !== "undefined") {

                var units = uw.ITowns.getTowns()[townID].units();
                var unitsSupport = uw.ITowns.getTowns()[townID].unitsSupport();

                TownPopup.remove();
                // var popup = "<div id='dio_town_popup' style='left:" + ($(that).offset().left + 20) + "px; top:" + ($(that).offset().top + 20) + "px; '>";
                var popup = "<table class='popup' id='dio_town_popup' style='left:" + popup_left + "px; top:" + popup_top + "px; ' cellspacing='0px' cellpadding='0px'>";

                popup += "<tr class='popup_top'><td class='popup_top_left'></td><td class='popup_top_middle'></td><td class='popup_top_right'></td></tr>";

                popup += "<tr><td class='popup_middle_left'>&nbsp;</td><td style='width: auto;' class='popup_middle_middle'>";

                // Town Groups \\
                var Group_name = "";
                if (uw.Game.premium_features.curator >= uw.Timestamp.now()) {
                    var Groups_town = uw.MM.DIO.getPlayer.Groups_town()[townID].groups, Group = 0;

                    for (var group in Groups_town) {
                        if (Groups_town.hasOwnProperty(group)) {
                            if (group == -1 || group == 0) {
                            } else {
                                if (Group < 1) {
                                    Group_name += " (" + uw.ITowns.town_groups._byId[group].attributes.name;
                                    Group++
                                } else if (Group == 1) {
                                    Group_name += " / " + uw.ITowns.town_groups._byId[group].attributes.name;
                                    Group++
                                } else Group_name = " (..."
                            }
                        }
                    };
                    if (Group != 0) Group_name += ")";
                }

                popup += "<h4><span>" + uw.ITowns.getTown(townID).name + "</span><span style='color: green;'>" + Group_name + "</span></h4>";

                // Count movement \\
                var sup = 0, att = 0;
                var e, t = 0, a = uw.MM.getModels().MovementsUnits;
                for (e in a) {
                    if (a.hasOwnProperty(e)) {
                        if ((t = a[e].attributes).target_town_id == townID) {
                            "attack" == t.type && att++;
                            "support" == t.type && sup++;
                        }
                    }
                }
                if (sup > 0 || att > 0) {
                    popup += "<div class='move_counter_content' style=''><div style='float:left;margin-right:5px;'></div>" +
                        ((att > 0) ? (
                            "<div class='movement off'></div>" +
                            "<div style='font-size: 12px;'><div class='attack_icon'></div><span class='movement' style='color:red;'> " + att + "</span> " + (att > 1 ? getTexts("movement", "offs") : getTexts("movement", "off")) + "</div>") : "") +
                        ((sup > 0) ? (
                            "<div class='movement def'></div>" +
                            "<div style='font-size: 12px;'><div class='support_icon'></div><span class='movement' style='color:green;'> " + sup + "</span> " + (sup > 1 ? getTexts("movement", "defs") : getTexts("movement", "def")) + "</div>") : "") +
                        "</div>";
                }

                // Unit Container \\
                if (DATA.options.dio_tpt) {
                    popup += "<div class='unit_content'>";
                    if (!$.isEmptyObject(units)) {
                        for (var unit_id in units) {
                            if (units.hasOwnProperty(unit_id)) {
                                if (units[unit_id] > 1000) { classSize = "four_digit_number"; }
                                // - Unit
                                popup += '<div class="unit_icon25x25 ' + unit_id + ' ' + classSize + '"><span class="count text_shadow">' + units[unit_id] + '</span></div>';
                            }
                        }
                    }

                    // - Wall
                    var wallLevel = uw.ITowns.getTowns()[townID].getBuildings().attributes.wall;
                    popup += '<div class="wall image bold"><span class="count text_shadow">' + wallLevel + '</span></div>';

                    popup += "</div>";
                }

                // Support \\
                if (!$.isEmptyObject(unitsSupport) & DATA.options.dio_tis) {
                    // Title (support name)
                    popup += "<h4><span style='white-space: nowrap;margin-right:35px;'>" + getTexts("reports", "support") + "</span></h4>";

                    // - Unit support
                    popup += "<div class='unit_content'>";

                    for (var unitSupport_id in unitsSupport) {
                        if (unitsSupport.hasOwnProperty(unitSupport_id)) {
                            if (unitsSupport[unitSupport_id] > 1000) { classSize = "four_digit_number"; }
                            // Unit
                            popup += '<div class="unit_icon25x25 ' + unitSupport_id + ' ' + classSize + '"><span class="count text_shadow">' + unitsSupport[unitSupport_id] + '</span></div>';
                        }
                    }
                }

                popup += "</div>";

                // Resources Container \\
                if (DATA.options.dio_tir) {
                    popup += "<div class='resources_content'><table cellspacing='2px' cellpadding='0px'><tr>";

                    var resources = uw.ITowns.getTowns()[townID].resources();
                    var storage = uw.ITowns.getTowns()[townID].getStorage();
                    var maxFavor = uw.ITowns.getTowns()[townID].getMaxFavor();
                    var Fury = uw.ITowns.player_gods.attributes.fury;
                    var fury_max = uw.ITowns.player_gods.attributes.max_fury;

                    // - Wood
                    var textColor = (resources.wood === storage) ? textColor = "color:red;" : textColor = "";
                    popup += '<td class="resources_small wood"></td><td style="' + textColor + '; width:1%;">' + resources.wood + '</td>';

                    // - Population
                    textColor = (resources.population === 0) ? textColor = "color:red;" : textColor = "";
                    popup += '<td style="min-width:15px;"></td>';
                    popup += '<td class="resources_small population"></td><td style="' + textColor + ' width:1%">' + resources.population + '</td>';

                    // - Stone
                    textColor = (resources.stone === storage) ? textColor = "color:red;" : textColor = "";
                    popup += '</tr><tr>';
                    popup += '<td class="resources_small stone"></td><td style="' + textColor + '">' + resources.stone + '</td>';

                    // - favor
                    textColor = (resources.favor === maxFavor) ? textColor = "color:red;" : textColor = "";
                    popup += '<td style="min-width:15px;"></td>';
                    popup += '<td class="resources_small favor"></td><td style="' + textColor + '; width:1%">' + resources.favor + '</td>';

                    // - Iron
                    textColor = (resources.iron === storage) ? textColor = "color:red;" : textColor = "";
                    popup += '</tr><tr>';
                    popup += '<td class="resources_small iron"></td><td style="' + textColor + '">' + resources.iron + '</td>';

                    // - fury
                    if (uw.ITowns.getTowns()[townID].god() == "ares") {
                        textColor = (Fury === fury_max) ? textColor = "color:red;" : textColor = "";
                        popup += '<td style="min-width:15px;"></td>';
                        popup += '<td class="fury_icon"></td><td style="' + textColor + '; width:1%">' + Fury + '</td>';
                    }
                    popup += '</tr></table></div>';
                }

                // Spy and God Container \\
                popup += "<div class='footer_content'><table cellspacing='0px'><tr>";

                // - Spy content
                var spy_storage = uw.ITowns.getTowns()[townID].getEspionageStorage();
                popup += "<td class='spy_content'>";
                popup += '<div class="support_filter attack_spy"></div><div class="spy_text">' + pointNumber(spy_storage) + '</div>';
                popup += "</td>";


                // - hero Content
                if (DATA.options.dio_tih) {
                    var HeroArray = uw.ITowns.getHeroDIO()[townID];
                    if (HeroArray) {
                        popup += "<td></td><td class='hero_content'>";
                        popup += '<div class="hero_icon hero25x25 ' + HeroArray.hero_name + '"><span class="count text_shadow">' + HeroArray.hero_level + '</span></div>';
                        popup += "</td>";
                    }
                };

                // - God Content
                var god = uw.ITowns.getTowns()[townID].god();
                if (god) {
                    popup += "<td></td><td class='god_content'>";
                    popup += '<div class="god_mini ' + god + '"></div>';
                    popup += "</td>";
                }

                popup += "</tr></table></div>";

                popup += "</td><td class='popup_middle_right'>&nbsp;</td></tr>";

                popup += "<tr class='popup_bottom'><td class='popup_bottom_left'></td><td class='popup_bottom_middle'></td><td class='popup_bottom_right'></td></tr>";

                popup += "</table>";

                $(popup).appendTo("#popup_div_curtain");
            }
        },
        remove: function () {
            $('#dio_town_popup').remove();
        }
    };

    /*******************************************************************************************************************************
     * Town list: Adds town type to the town list
     *******************************************************************************************************************************/
    var TownList = {
        activate: function () {
            // Style town list
            $('<style id="dio_town_list" type="text/css">' +
                '#town_groups_list .item { text-align: left; } ' +
                '#town_groups_list .inner_column { border: 1px solid rgba(100, 100, 0, 0.3);margin: -2px 0px 0px 2px; } ' +
                '#town_groups_list .island_quest_icon { position: absolute; right: 37px; top: 3px; } ' +
                '#town_groups_list .island_quest_icon.hidden_icon { display:none; } ' +
                // Quacks Zentrier-Button verschieben
                '#town_groups_list .jump_town { right: 36px !important; } ' +
                // Population percentage
                '#town_groups_list .pop_percent { position: absolute; right: 6px; top:0px; font-size: 0.7em; display:block !important;} ' +
                '#town_groups_list .full { color: green; } ' +
                '#town_groups_list .threequarter { color: darkgoldenrod; } ' +
                '#town_groups_list .half { color: darkred; } ' +
                '#town_groups_list .quarter { color: red; } ' +
                '#town_groups_list .dio_icon_small { display:block !important;} ' +
                '</style>').appendTo('head');

            // Open town list: hook to grepolis function render()
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }

            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old = uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render;

            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = function () {
                uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old();
                TownList.change();
            };

            // Town List open?
            if ($('#town_groups_list').get(0)) { TownList.change(); }
        },
        deactivate: function () {
            var i = 0;
            while (uw.layout_main_controller.sub_controllers[i].name != 'town_name_area') {
                i++;
            }

            uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render = uw.layout_main_controller.sub_controllers[i].controller.town_groups_list_view.render_old;

            $('#dio_town_list').remove();
            $('#town_groups_list .dio_icon_small, #town_groups_list .pop_percent').css({ display: 'none' });
            $("#town_groups_list .town_group_town").unbind('mouseenter mouseleave');
        },
        change: function () {
            if (!$('#town_groups_list .dio_icon_small').get(0)) {
                $("#town_groups_list .town_group_town").each(function () {
                    try {
                        var town_item = $(this), town_id = town_item.attr('name'), townicon_div, percent_div = "", percent = -1, pop_space = "full";

                        if (population[town_id]) { percent = population[town_id].percent; }
                        if (percent < 75) { pop_space = "threequarter"; }
                        if (percent < 50) { pop_space = "half"; }
                        if (percent < 25) { pop_space = "quarter"; }

                        if (!town_item.find('dio_icon_small').length) {
                            townicon_div = '<div class="dio_icon_small townicon_' + (manuTownTypes[town_id] || autoTownTypes[town_id] || "no") + '"></div>';
                            // TODO: Notlösung...
                            if (percent != -1) { percent_div = '<div class="pop_percent ' + pop_space + '">' + percent + '%</div>'; }
                            town_item.prepend(townicon_div + percent_div);
                        }
                    } catch (error) { errorHandling(error, "TownList.change"); }
                });

            }

            // Hover Effect for Quacks Tool:
            $("#town_groups_list .town_group_town").hover(
                function () { $(this).find('.island_quest_icon').addClass("hidden_icon"); },
                function () { $(this).find('.island_quest_icon').removeClass("hidden_icon"); }
            );
        }
    };

    /*******************************************************************************************************************************
     * Swap Context Icons
     *******************************************************************************************************************************/
    var ContextMenu = {
        activate: function () {
            // Set context menu event handler
            $.Observer(uw.GameEvents.map.context_menu.click).subscribe('DIO_CONTEXT', function (e, data) {
                if (DATA.options.dio_con && $('#context_menu').children().length == 4) {
                    // Clear animation
                    $('#context_menu div#goToTown').css({
                        left: '0px',
                        top: '0px',
                        WebkitAnimation: 'none', //'A 0s linear',
                        animation: 'none' //'B 0s linear'
                    });
                }
                // Replace german label of 'select town' button
                if (LID === "de" && $('#select_town').get(0)) { $("#select_town .caption").get(0).innerHTML = "Selektieren"; }
                $("#select_town").click(updateIcon);
            });

            // Set context menu animation
            $('<style id="dio_context_menu" type="text/css">' +
                // set fixed position of 'select town' button
                '#select_town { left: 0px !important; top: 0px !important; z-index: 6; } ' +
                // set animation of 'goToTown' button
                '#context_menu div#goToTown { left: 30px; top: -51px; ' +
                '-webkit-animation: A 0.115s linear; animation: B 0.2s;} ' +
                '@-webkit-keyframes A { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '@keyframes B { from {left: 0px; top: 0px;} to {left: 30px; top: -51px;} }' +
                '</style>').appendTo('head');
            updateIcon();
        },
        deactivate: function () {
            $.Observer(uw.GameEvents.map.context_menu.click).unsubscribe('DIO_CONTEXT');
            $('#dio_context_menu').remove();
        }
    };

    /*******************************************************************************************************************************
     * Temporary replacement grcrt "City Command Overview"
     *******************************************************************************************************************************/
    $('<style id="Temporary-replacement-grcrt" type="text/css">' +
        '#place_defense {display: block;} ' +
        '#dd_commands_select_town_group { width: 110px;} ' +
        '#txt_commands_search { width: 100px;} ' +
        '#dd_commands_sort_command { max-width: 280px; min-width: 269px; z-index: 1; } ' +
        '#dd_commands_sort_command .caption { padding: 4px 19px 0 2px; } ' +

        '#grcrt_command_filter { position: absolute; top: 0px; right: 0px; } ' +
        '#grcrt_towns width: { width: 170px; } ' +
        '#grcrt_towns_list: { width: 180px; } ' +

        '#place_defense #dd_filter_type .arrow, .select_rec_unit .arrow, .dropdown.default .arrow {' +
        'width: 18px; height: 17px ; background: url("' + Home_img + 'drop-out.png") no-repeat 0px -1px;' +
        'top: 2px; right: 3px; } ' +

        '#place_defense #dd_filter_type .arrow:hover, .select_rec_unit .arrow, .dropdown.default .arrow:hover {background: url("' + Home_img + 'drop-over.png") no-repeat 0px -1px; } ' +

        '</style>').appendTo('head');

    /*******************************************************************************************************************************
     * Available units
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● GetAllUnits
     * | ● Shows all available units
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var groupUnitArray = {};
    // TODO: split Function (getUnits, calcUnitsSum, availableUnits, countBiremes, getTownTypes)?

    // Alter Einheitenzähler
    function getAllUnits() {
        try {
            var townArray = uw.ITowns.getTowns(), groupArray = uw.ITowns.townGroups.getGroupsDIO(),

                unitArray = { "sword": 0, "archer": 0, "hoplite": 0, "chariot": 0, "godsent": 0, "rider": 0, "slinger": 0, "catapult": 0, "small_transporter": 0, "big_transporter": 0, "manticore": 0, "harpy": 0, "pegasus": 0, "cerberus": 0, "minotaur": 0, "medusa": 0, "zyklop": 0, "centaur": 0, "fury": 0, "sea_monster": 0 },
                unitArraySea = { "bireme": 0, "trireme": 0, "attack_ship": 0, "demolition_ship": 0, "colonize_ship": 0 };

            if (uw.Game.hasArtemis) { unitArray = $.extend(unitArray, { "griffin": 0, "calydonian_boar": 0 }); }
            if (uw.Game.gods_active.aphrodite) { unitArray = $.extend(unitArray, { "siren": 0, "satyr": 0 }); }
            if (uw.Game.gods_active.ares) { unitArray = $.extend(unitArray, { "spartoi": 0, "ladon": 0 }); }
            unitArray = $.extend(unitArray, unitArraySea);

            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {

                    groupUnitArray[group] = Object.create(unitArray);

                    for (var town in groupArray[group].towns) {
                        if (groupArray[group].towns.hasOwnProperty(town)) {
                            var type = { lo: 0, ld: 0, so: 0, sd: 0, fo: 0, fd: 0 }; // Type for TownList

                            for (var unit in unitArray) {
                                if (unitArray.hasOwnProperty(unit)) {
                                    // All Groups: Available units
                                    var tmp = parseInt(uw.ITowns.getTown(town).units()[unit], 10);
                                    groupUnitArray[group][unit] += tmp || 0;
                                    // Only for group "All"
                                    if (group == -1) {
                                        // Bireme counter // old
                                        if (unit === "bireme" && ((biriArray[townArray[town].id] || 0) < (tmp || 0))) {
                                            biriArray[townArray[town].id] = tmp;
                                        }
                                        //TownTypes
                                        if (!uw.GameData.units[unit].is_naval) {
                                            if (uw.GameData.units[unit].flying) {
                                                type.fd += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.fo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            } else {
                                                type.ld += ((uw.GameData.units[unit].def_hack + uw.GameData.units[unit].def_pierce + uw.GameData.units[unit].def_distance) / 3 * (tmp || 0));
                                                type.lo += (uw.GameData.units[unit].attack * (tmp || 0));
                                            }
                                        } else {
                                            type.sd += (uw.GameData.units[unit].defense * (tmp || 0));
                                            type.so += (uw.GameData.units[unit].attack * (tmp || 0));
                                        }
                                    }
                                }
                            }
                            // Only for group "All"
                            if (group == -1) {
                                // Icon: DEF or OFF?
                                var z = ((type.sd + type.ld + type.fd) <= (type.so + type.lo + type.fo)) ? "o" : "d",
                                    temp = 0;

                                for (var t in type) {
                                    if (type.hasOwnProperty(t)) {
                                        // Icon: Land/Sea/Fly (t[0]) + OFF/DEF (z)
                                        if (temp < type[t]) {
                                            autoTownTypes[townArray[town].id] = t[0] + z;
                                            temp = type[t];
                                        }
                                        // Icon: Troops Outside (overwrite)
                                        if (temp < 1000) {
                                            autoTownTypes[townArray[town].id] = "no";
                                        }
                                    }
                                }
                                // Icon: Empty Town (overwrite)
                                var popBuilding = 0, buildVal = uw.GameData.buildings, levelArray = townArray[town].buildings().getLevels(),
                                    popMax = Math.floor(buildVal.farm.farm_factor * Math.pow(townArray[town].buildings().getBuildingLevel("farm"), buildVal.farm.farm_pow)), // Population from farm level
                                    popPlow = townArray[town].getResearches().attributes.plow ? 200 : 0,
                                    popFactor = townArray[town].getBuildings().getBuildingLevel("thermal") ? 1.1 : 1.0, // Thermal
                                    popExtra = townArray[town].getPopulationExtra();

                                for (var b in levelArray) {
                                    if (levelArray.hasOwnProperty(b)) {
                                        popBuilding += Math.round(buildVal[b].pop * Math.pow(levelArray[b], buildVal[b].pop_factor));
                                    }
                                }
                                population[town] = {};

                                population[town].max = popMax * popFactor + popPlow + popExtra;
                                population[town].buildings = popBuilding;
                                population[town].units = parseInt((population[town].max - (popBuilding + townArray[town].getAvailablePopulation())), 10);

                                if (population[town].units < 300) {
                                    autoTownTypes[townArray[town].id] = "po";
                                }

                                population[town].percent = Math.round(100 / (population[town].max - popBuilding) * population[town].units);

                                if (!manuTownAuto[townArray[town].id] && DATA.options.dio_tic && !DATA.options.dio_tic2) {
                                    autoTownTypes[townArray[town].id] = "OO";
                                }
                            }
                        }
                    }
                }
            }

            // Update Available Units
            AvailableUnits.updateBullseye();
            if (uw.GPWindowMgr.TYPE_DIO_UNITS) {
                if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS)) { AvailableUnits.updateWindow(); }
            }
        } catch (error) { errorHandling(error, "getAllUnits"); } // TODO: Eventueller Fehler in Funktion
    }

    function addFunctionToITowns() {
        try {
            var version_latest = "??";
            try { version_latest = uw.dio_latest_version; } catch (error) { errorHandling(error, "dio_latest_version"); }
            // Copy function and prevent an error
            uw.MM.DIO = {
                getPlayer: {},
                info_dio: {
                    name: "DIO-TOOLS-David1327",
                    version: dio_version,
                    latest_version: version_latest,
                    script: {
                        grcrt: "",
                        HMole: "",
                        Gt: "",
                        FLASK: "",
                        Quack: "",
                        GrepoData: "",
                    },
                },
                errorDio: { nb: 0 },
                lang: uw.Game.market_id,
                land: uw.Game.world_id.substring(0, 2),
            };

            var script = uw.MM.DIO.info_dio.script;
            setTimeout(function () {
                script.grcrt = (typeof (uw.GRCRT_Notifications) !== "undefined" ? true : false);
                script.HMole = (typeof (uw.MH) !== "undefined" ? true : false);
                script.Gt = (typeof (uw.GtkAbout) !== "undefined" ? true : false);
                script.FLASK = (typeof (uw.FLASK_GAME) !== "undefined" ? true : false);
                script.Quack = (typeof (uw.main_script) !== "undefined" ? true : false);
                script.GrepoData = (typeof (uw.gd_version) !== "undefined" ? true : false);
            }, 10000);

            uw.MM.DIO.getPlayer.Groups = function () {
                var town_groups_towns, town_groups, groups = {};

                // #Grepolis Fix: 2.75 -> 2.76
                if (uw.MM.collections) {
                    town_groups_towns = uw.MM.collections.TownGroupTown[0];
                    town_groups = uw.MM.collections.TownGroup[0];
                } else {
                    town_groups_towns = uw.MM.getCollections().TownGroupTown[0];
                    town_groups = uw.MM.getCollections().TownGroup[0];
                }

                town_groups_towns.each(function (town_group_town) {
                    var gid = town_group_town.getGroupId(),
                        group = groups[gid],
                        town_id = town_group_town.getTownId();

                    if (!group) {
                        groups[gid] = group = {
                            id: gid,
                            //name: town_groups.get(gid).getName(), // hier tritt manchmal ein Fehler auf: TypeError: Cannot read property "getName" of undefined at https://_.grepolis.com/cache/js/merged/game.js?1407322916:8298:525
                            towns: {}
                        };
                    }

                    group.towns[town_id] = { id: town_id };
                    //groups[gid].towns[town_id]={id:town_id};
                });
                //console.log(groups);
                return groups;
            };

            uw.MM.DIO.getPlayer.Groups_town = function () {
                var town_groups_towns, town_groups, groups = {};

                // #Grepolis Fix: 2.75 -> 2.76
                if (uw.MM.collections) {
                    town_groups_towns = uw.MM.collections.TownGroupTown[0];
                    town_groups = uw.MM.collections.TownGroup[0];
                } else {
                    town_groups_towns = uw.MM.getCollections().TownGroupTown[0];
                    town_groups = uw.MM.getCollections().TownGroup[0];
                }

                town_groups_towns.each(function (town_group_town) {
                    var gid = town_group_town.getGroupId(),
                        town_id = town_group_town.getTownId(),
                        group = groups[town_id];

                    if (!group) {
                        groups[town_id] = group = {
                            id: town_id,
                            //name: town_groups.get(gid).getName(), // hier tritt manchmal ein Fehler auf: TypeError: Cannot read property "getName" of undefined at https://_.grepolis.com/cache/js/merged/game.js?1407322916:8298:525
                            groups: {}
                        };
                    }
                    if (town_id !== 0 || town_id !== -1) {
                        group.groups[gid] = {
                            id: gid,
                            name: uw.ITowns.town_groups._byId[gid].attributes.name
                        }
                    };
                    //groups[gid].towns[town_id]={id:town_id};
                });
                //console.log(groups);
                return groups;
            };

            uw.MM.DIO.getPlayer.Hero = function () {
                var PlayerHero, heros = {};

                // #Grepolis Fix: 2.75 -> 2.76
                if (uw.MM.collections) { PlayerHero = uw.MM.collections.PlayerHero[0]; }
                else { PlayerHero = uw.MM.getCollections().PlayerHero[0]; }

                PlayerHero.each(function (PlayerHero) {
                    var hero_name = PlayerHero.getId(),
                        hero_level = PlayerHero.getLevel(),
                        town_id = PlayerHero.getHomeTownId(),
                        town_name = PlayerHero.getOriginTownName(),
                        hero = heros[town_id];

                    if (!hero) {
                        heros[town_id] = hero = {
                            town_id: town_id,
                            town: town_name,
                            hero_name,
                            hero_level: hero_level
                        };
                    }
                });
                return heros;
            };

            uw.ITowns.townGroups.getGroupsDIO = function () {
                var town_groups_towns, town_groups, groups = {};

                // #Grepolis Fix: 2.75 -> 2.76
                if (uw.MM.collections) {
                    town_groups_towns = uw.MM.collections.TownGroupTown[0];
                    town_groups = uw.MM.collections.TownGroup[0];
                } else {
                    town_groups_towns = uw.MM.getCollections().TownGroupTown[0];
                    town_groups = uw.MM.getCollections().TownGroup[0];
                }

                town_groups_towns.each(function (town_group_town) {
                    var gid = town_group_town.getGroupId(),
                        group = groups[gid],
                        town_id = town_group_town.getTownId();

                    if (!group) {
                        groups[gid] = group = {
                            id: gid,
                            //name: town_groups.get(gid).getName(), // hier tritt manchmal ein Fehler auf: TypeError: Cannot read property "getName" of undefined at https://_.grepolis.com/cache/js/merged/game.js?1407322916:8298:525
                            towns: {}
                        };
                    }

                    group.towns[town_id] = { id: town_id };
                    //groups[gid].towns[town_id]={id:town_id};
                });
                //console.log(groups);
                return groups;
            };

            uw.ITowns.getHeroDIO = function () {
                var town_groups_towns, town_groups, groups = {};

                // #Grepolis Fix: 2.75 -> 2.76
                var PlayerHero;
                if (uw.MM.collections) { PlayerHero = uw.MM.collections.PlayerHero[0]; }
                else { PlayerHero = uw.MM.getCollections().PlayerHero[0]; }

                PlayerHero.each(function (PlayerHero) {
                    var hero_name = PlayerHero.getId(),
                        hero_level = PlayerHero.getLevel(),
                        town_id = PlayerHero.getHomeTownId(),
                        town_name = PlayerHero.getOriginTownName(),
                        group = groups[town_id];

                    if (!group) {
                        groups[town_id] = group = {
                            town_id: town_id,
                            town: town_name,
                            hero_name,
                            hero_level: hero_level
                        };
                    }
                });
                return groups;
            };
        } catch (error) { errorHandling(error, "addFunctionToITowns"); }
    }


    // Neuer Einheitenzähler
    var UnitCounter = {
        units: { "total": {}, "available": {}, "outer": {}, "foreign": {}, "support": {} },

        count: function () {
            var tooltipHelper = uw.require("helpers/units_tooltip_helper");

            var groups = uw.ITowns.townGroups.getGroupsDIO();

            for (var groupId in groups) {
                if (groups.hasOwnProperty(groupId)) {

                    UnitCounter.units.total[groupId] = {};
                    UnitCounter.units.available[groupId] = {};
                    UnitCounter.units.outer[groupId] = {};
                    UnitCounter.units.support[groupId] = {};


                    for (var townId in groups[groupId].towns) {
                        if (groups[groupId].towns.hasOwnProperty(townId)) {

                            // Einheiten gesamt
                            UnitCounter.units.total[groupId][townId] = uw.ITowns.towns[townId].units();
                            // Einheiten verfügbar
                            UnitCounter.units.available[groupId][townId] = uw.ITowns.towns[townId].units();
                            // Einheiten außerhalb
                            UnitCounter.units.outer[groupId][townId] = {};
                            // Einheiten außerhalb
                            UnitCounter.units.support[groupId][townId] = uw.ITowns.towns[townId].unitsSupport();

                            var supports = tooltipHelper.getDataForSupportingUnitsInOtherTownFromCollection(uw.MM.getTownAgnosticCollectionsByName("Units")[1].fragments[townId], uw.MM.getOnlyCollectionByName("Town"));

                            for (var supportId in supports) {
                                if (supports.hasOwnProperty(supportId)) {

                                    for (var attributeId in supports[supportId].attributes) {
                                        if (supports[supportId].attributes.hasOwnProperty(attributeId)) {

                                            // Attribut ist eine Einheit?
                                            if (typeof (uw.GameData.units[attributeId]) !== "undefined" && supports[supportId].attributes[attributeId] > 0) {

                                                UnitCounter.units.outer[groupId][townId][attributeId] = (UnitCounter.units.outer[groupId][townId][attributeId] || 0) + supports[supportId].attributes[attributeId];
                                                UnitCounter.units.total[groupId][townId][attributeId] = (UnitCounter.units.total[groupId][townId][attributeId] || 0) + supports[supportId].attributes[attributeId];

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Summen aller Städte berechnen
                    UnitCounter.summarize(groupId);
                }
            }

            return UnitCounter.units;
        },

        summarize: function (groupId) {
            var tooltipHelper = uw.require("helpers/units_tooltip_helper");

            UnitCounter.units.total[groupId].all = {};
            UnitCounter.units.available[groupId].all = {};
            UnitCounter.units.outer[groupId].all = {};
            UnitCounter.units.support[groupId].all = {};

            for (var townId in UnitCounter.units.total[groupId]) {
                if (UnitCounter.units.total[groupId].hasOwnProperty(townId) && townId !== "all") {
                    var unitId;

                    // Einheiten gesamt
                    for (unitId in UnitCounter.units.total[groupId][townId]) {
                        if (UnitCounter.units.total[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.total[groupId].all[unitId] = (UnitCounter.units.total[groupId].all[unitId] || 0) + UnitCounter.units.total[groupId][townId][unitId];
                        }
                    }

                    // Einheiten verfügbar
                    for (unitId in UnitCounter.units.available[groupId][townId]) {
                        if (UnitCounter.units.available[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.available[groupId].all[unitId] = (UnitCounter.units.available[groupId].all[unitId] || 0) + UnitCounter.units.available[groupId][townId][unitId];
                        }
                    }

                    // Einheiten außerhalb
                    for (unitId in UnitCounter.units.outer[groupId][townId]) {
                        if (UnitCounter.units.outer[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.outer[groupId].all[unitId] = (UnitCounter.units.outer[groupId].all[unitId] || 0) + UnitCounter.units.outer[groupId][townId][unitId];
                        }
                    }

                    // Einheiten außerhalb
                    for (unitId in UnitCounter.units.support[groupId][townId]) {
                        if (UnitCounter.units.support[groupId][townId].hasOwnProperty(unitId)) {
                            UnitCounter.units.support[groupId].all[unitId] = (UnitCounter.units.support[groupId].all[unitId] || 0) + UnitCounter.units.support[groupId][townId][unitId];
                        }
                    }
                }
            }
        }
    };

    var AvailableUnits = {
        timeout: null,
        activate: function () {
            AvailableUnits.timeout = setInterval(() => {
                UnitCounter.count();
            }, 1000);
            var DioMenuFix = !1;
            $("#dio_available_units_bullseye").length && 0 == DioMenuFix && (
                DioMenuFix = !0,
                $("#HMoleM").css({ top: $("#ui_box .nui_left_box:first").offset().top + $("#ui_box .nui_left_box:first")[0].scrollHeight - 6 }),
                uw.MH.nui_main_menu()
            );

            $('<style>available_units_bullseye_addition { display:none!important; }</style>').appendTo('head');

            var default_title = uw.DM.getl10n("place", "support_overview").options.troop_count + " (" + getTexts("labels", "available") + ")";

            $(".dio_picomap_container").prepend("<div id='dio_available_units_bullseye' class='unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme") + "'><div class='amount'></div></div>");

            // Ab version 2.115
            if ($(".topleft_navigation_area").get(0)) {

                $(".topleft_navigation_area").prepend("<div id='available_units_bullseye' style='display: none;'></div><div id='dio_available_units_bullseye_addition' class='picomap_area'><div class='dio_picomap_container'><div id='dio_available_units_bullseye' class='unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme") + "'><div class='amount'></div></div></div><div class='dio_picomap_overlayer'></div></div>");

                $('<style id="dio_available_units_style_addition">' +

                    '#dio_ava2 { display:block!important; }' +

                    //'#grcrt_mnu_list .nui_main_menu {top: 0px !important; }'+
                    '.bull_eye_buttons, .rb_map { height:38px !important; }' +
                    '.coords_box { top: 117px !important; } ' +

                    '#ui_box .btn_change_colors { top: 31px !important; }' +

                    '.picomap_area { position: absolute; overflow: visible; top: 0; left: 0; width: 156px; height: 161px; z-index: 5; }' +
                    '.picomap_area .dio_picomap_container, .picomap_area .dio_picomap_overlayer { position: absolute; top: 33px; left: -3px; width: 147px; height: 101px; }' +
                    //'.picomap_area .dio_picomap_overlayer { background: url(https://gpde.innogamescdn.com/images/game/autogenerated/layout/layout_2.107.png) -145px -208px no-repeat; width: 147px; height: 101px; z-index: 5;} '+
                    '.picomap_area .dio_picomap_overlayer { background: url(' + dio_sprite + ');background-position: 473px 250px; width: 147px; z-index: 6;} ' +
                    '</style>').appendTo('head');
                AvailableUnits.autre();
            }

            // Style
            $('<style id="dio_available_units_style">' +

                '#dio_available_units .unit.index_unit.bold.unit_icon40x40:hover {-webkit-filter: brightness(1.1); box-shadow: 0px 0px 6px rgb(0 252 18);}' +
                '@-webkit-keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +
                '@keyframes Z { 0% { opacity: 0; } 100% { opacity: 1; } } ' +

                '@-webkit-keyframes blurr { 0% { -webkit-filter: blur(5px); } 100% { -webkit-filter: blur(0px); } } ' +

                '.dio_picomap_overlayer { cursor:pointer; } ' +

                '.picomap_area .bull_eye_buttons { height: 55px; } ' +

                '#sea_id { background: none; font-size:25px; cursor:default; height:50px; width:50px; position:absolute; top:70px; left:157px; z-index: 30; } ' +

                // Available bullseye unit
                '#dio_available_units_bullseye { margin: 10px 28px 0px 28px; -webkit-animation: blur 2s; animation: Z 1s; } ' +

                '#dio_available_units_bullseye .amount { color:#826021; position:relative; top:28px; font-style:italic; width:79px; font-weight: bold; text-shadow: 0px 0px 2px black, 1px 1px 2px black, 0px 2px 2px black; -webkit-animation: blur 3s; } ' +

                '#dio_available_units_bullseye.big_number { font-size: 0.90em; line-height: 1.4; } ' +

                '#dio_available_units_bullseye.blur { -webkit-animation: blurr 0.6s; } ' +

                // Land units
                '#dio_available_units_bullseye.sword	.amount	{ color:#E2D9C1; top:57px; width:90px;	} ' +
                '#dio_available_units_bullseye.hoplite	.amount	{ color:#E2D9C1; top:57px; width:90px;	} ' +
                '#dio_available_units_bullseye.archer	.amount	{ color:#E2D0C1; top:47px; width:70px;	} ' +
                '#dio_available_units_bullseye.chariot			{ margin-top: 15px; } ' +
                '#dio_available_units_bullseye.chariot	.amount	{ color:#F5E8B4; top:38px; width:91px;  } ' +
                '#dio_available_units_bullseye.rider	.amount	{ color:#DFCC6C; top:52px; width:105px;	} ' +
                '#dio_available_units_bullseye.slinger	.amount	{ color:#F5E8B4; top:53px; width:91px;	} ' +
                '#dio_available_units_bullseye.catapult	.amount	{ color:#F5F6C5; top:36px; width:87px;	} ' +
                '#dio_available_units_bullseye.godsent	.amount	{ color:#F5F6C5; top:57px; width:92px;	} ' +

                // Mythic units
                '#dio_available_units_bullseye.medusa			.amount	{ color:#FBFFBB; top:50px; width:65px;	} ' +
                '#dio_available_units_bullseye.manticore		.amount	{ color:#ECD181; top:50px; width:55px; 	} ' +
                '#dio_available_units_bullseye.pegasus					{ margin-top: 16px;	} ' +
                '#dio_available_units_bullseye.pegasus			.amount	{ color:#F7F8E3; top:36px; width:90px;	} ' +
                '#dio_available_units_bullseye.minotaur			        { margin-top: 10px; } ' +
                '#dio_available_units_bullseye.minotaur		    .amount	{ color:#EAD88A; top:48px; width:78px;	} ' +
                '#dio_available_units_bullseye.zyklop					{ margin-top: 3px;	} ' +
                '#dio_available_units_bullseye.zyklop			.amount	{ color:#EDE0B0; top:50px; width:95px;	} ' +
                '#dio_available_units_bullseye.harpy					{ margin-top: 16px;	} ' +
                '#dio_available_units_bullseye.harpy			.amount	{ color:#E7DB79; top:30px; width:78px;	} ' +
                '#dio_available_units_bullseye.sea_monster		.amount	{ color:#D8EA84; top:58px; width:91px;	} ' +
                '#dio_available_units_bullseye.cerberus		    .amount	{ color:#EC7445; top:25px; width:101px;	} ' +
                '#dio_available_units_bullseye.centaur					{ margin-top: 15px;	} ' +
                '#dio_available_units_bullseye.centaur			.amount	{ color:#ECE0A8; top:29px; width:83px;	} ' +
                '#dio_available_units_bullseye.fury			    .amount	{ color:#E0E0BC; top:57px; width:95px;	} ' +
                '#dio_available_units_bullseye.griffin					{ margin-top: 15px;	} ' +
                '#dio_available_units_bullseye.griffin			.amount	{ color:#FFDC9D; top:40px; width:98px;	} ' +
                '#dio_available_units_bullseye.calydonian_boar	.amount	{ color:#FFDC9D; top:17px; width:85px;	} ' +
                '#dio_available_units_bullseye.siren		    .amount	{ color:#EAD88A; top:50px; width:78px;	} ' +
                '#dio_available_units_bullseye.satyr			        { margin-top: 15px; } ' +
                '#dio_available_units_bullseye.satyr		    .amount	{ color:#EAD88A; top:48px; width:78px;	} ' +
                '#dio_available_units_bullseye.spartoi			        { margin-top: 10px; } ' +
                '#dio_available_units_bullseye.spartoi		    .amount	{ color:#EAD88A; top:48px; width:78px;	} ' +
                '#dio_available_units_bullseye.ladon			        { margin-top: 10px; } ' +
                '#dio_available_units_bullseye.ladon		    .amount	{ color:#EAD88A; top:48px; width:78px;	} ' +

                // Naval units
                '#dio_available_units_bullseye.attack_ship		    .amount	{ color:#FFCB00; top:26px; width:99px;	} ' +
                '#dio_available_units_bullseye.bireme			    .amount	{ color:#DFC677; color:azure; top:28px; width:79px;	} ' +
                '#dio_available_units_bullseye.trireme			    .amount	{ color:#F4FFD4; top:24px; width:90px;	} ' +
                '#dio_available_units_bullseye.small_transporter	.amount { color:#F5F6C5; top:26px; width:84px;	} ' +
                '#dio_available_units_bullseye.big_transporter	    .amount { color:#FFDC9D; top:27px; width:78px;	} ' +
                '#dio_available_units_bullseye.colonize_ship		.amount { color:#F5F6C5; top:29px; width:76px;	} ' +
                '#dio_available_units_bullseye.colonize_ship		.amount { color:#F5F6C5; top:29px; width:76px;	} ' +
                '#dio_available_units_bullseye.demolition_ship	    .amount { color:#F5F6C5; top:35px; width:90px;	} ' +

                // Available units window
                '#dio_available_units { overflow: auto;  } ' +
                '#dio_available_units .unit { margin: 5px; cursor:pointer; overflow:visible; display: -webkit-inline-box; float: none; } ' +
                '#dio_available_units .unit.active { border: 2px solid #7f653a; border-radius:30px; margin:4px; } ' +
                '#dio_available_units .unit span { text-shadow: 1px 1px 1px black, 1px 1px 2px black;} ' +
                '#dio_available_units hr { margin: 5px 0px 5px 0px; } ' +
                '#dio_available_units .drop_box .option { float: left; margin-right: 30px; width:100%; } ' +
                '#dio_available_units .drop_box { position:absolute; top: -38px; right: 98px; width:173px; z-index:10; } ' +
                '#dio_available_units .drop_box .drop_group { width: 130px; } ' +
                '#dio_available_units .drop_box .select_group.open { display:block; } ' +
                '#dio_available_units .drop_box .item-list { overflow: auto; overflow-x: hidden; } ' +
                '#dio_available_units .drop_box .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +

                // Available units button
                '#dio_btn_available_units { top:84px; left:120px; z-index:15; position:absolute; } ' +
                '#dio_btn_available_units .ico_available_units { margin:5px 0px 0px 4px; width:24px; height:24px; ' +
                'background:url(' + Home_img + 'couteau.png) no-repeat 0px 0px;background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(100deg);  } ' +

                '</style>').appendTo('head');
            if (uw.Game.gods_active.aphrodite || uw.Game.gods_active.ares) { createWindowType("DIO_UNITS", (LANG.hasOwnProperty(LID) ? getTexts("Options", "ava")[0] : default_title), 430, 315, true, [240, 70]); }
            else { createWindowType("DIO_UNITS", (LANG.hasOwnProperty(LID) ? getTexts("Options", "ava")[0] : default_title), 378, 315, true, [240, 70]); }

            // Set Sea-ID beside the bull eye
            $('#sea_id').prependTo('#ui_box');

            AvailableUnits.addButton();

            UnitCounter.count();
            AvailableUnits.updateBullseye();

            $('.dio_picomap_overlayer').tooltip(dio_icon + getTexts("Options", "ava")[0]);
        },

        autre: function () {
            if ($(".topleft_navigation_area").get(0)) {
                $('#dio_available_units_style_oceanautre').remove()
                $('#dio_available_units_style_oceanaut').remove();
                if (DATA.options.dio_ava2) {
                    $('<style id="dio_available_units_style_oceanautre">' +
                        '.nui_grepo_score { top: 167px!important; } ' +
                        '.nui_left_box { top: 119px ; } ' +
                        '.nui_main_menu { top: 276px ; }' +

                        '#HMoleM {top: 270px !important;}' +
                        '#ui_box .ocean_number_box { position: absolute; top: 151px; left: 45px; }' +
                        '#ui_box .ocean_number_box .ocean_number { font-weight: 700; z-index: 5; width: 100px; left: -13px;}' +
                        '.picomap_area .dio_picomap_overlayer { height: 135px ; } ' +
                        '</style>').appendTo('head');
                } else if (!DATA.options.dio_ava2) {
                    $('<style id="dio_available_units_style_oceanaut">' +
                        '.nui_grepo_score { top: 150px!important; } ' +
                        '.nui_left_box { top: 102px ; } ' +
                        '.nui_main_menu { top: 260px ; }' +

                        '#HMoleM {top: 253px !important;}' +
                        '#ui_box .ocean_number_box { position: absolute; top: 65px; left: 44px; }' +
                        '#ui_box .ocean_number_box .ocean_number { font-weight: 500; z-index: 1;}' +
                        '.picomap_area .dio_picomap_overlayer { height: 101px;} ' +
                        '</style>').appendTo('head');
                };
            }
        },

        ocean: {
            activate: function () {
                if (DATA.options.dio_ava) {
                    setTimeout(function () { AvailableUnits.autre(); }, 10);
                }
            },
            deactivate: function () {
                if (DATA.options.dio_ava) {
                    setTimeout(function () { AvailableUnits.autre(); }, 10);
                }
            },
        },
        deactivate: function () {
            $('#dio_available_units_bullseye').remove();
            $('#dio_available_units_bullseye_addition').remove();
            $('#dio_available_units_style_addition_main_menu').remove();
            $('#dio_available_units_style_oceanautre').remove();
            $('#dio_available_units_style_oceanaut').remove();

            $('<style id="dio_HMoleM">#HMoleM {top: 210px !important;}</style>').appendTo('head');
            $('#dio_available_units_style').remove();
            $('#dio_available_units_style_addition').remove();

            $('#dio_btn_available_units').remove();

            if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS)) {
                uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS).close();
            }

            $('.dio_picomap_overlayer').unbind();

            $('#sea_id').appendTo('.dio_picomap_container')
            $('#dio_available_units_style_ocean').remove()
            clearTimeout(AvailableUnits.timeout);
            AvailableUnits.timeout = null;
        },
        addButton: function () {
            var default_title = uw.DM.getl10n("place", "support_overview").options.troop_count + " (" + getTexts("labels", "available") + ")";

            $('<div id="dio_btn_available_units" class="circle_button"><div class="ico_available_units js-caption"></div></div>').appendTo(".bull_eye_buttons");

            // Events
            $('#dio_btn_available_units').on('mousedown', function () {
                $('#dio_btn_available_units, .ico_available_units').addClass("checked");
            }).on('mouseup', function () {
                $('#dio_btn_available_units, .ico_available_units').removeClass("checked");
            });

            $('#dio_btn_available_units, .dio_picomap_overlayer').click(() => {
                if (!uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS)) {
                    AvailableUnits.openWindow();
                    $('#dio_btn_available_units, .ico_available_units').addClass("checked");
                } else {
                    AvailableUnits.closeWindow();
                    $('#dio_btn_available_units, .ico_available_units').removeClass("checked");
                }
            });

            $('.close_all').click(() => { $('#dio_btn_available_units, .ico_available_units').removeClass("checked"); });

            // Tooltip
            $('#dio_btn_available_units').tooltip(LANG.hasOwnProperty(LID) ? dio_icon + getTexts("labels", "uni") : default_title);

        },
        openWindow: function () {
            var groupArray = uw.ITowns.townGroups.getGroupsDIO(),

                unitArray = {
                    "sword": 0, "archer": 0, "hoplite": 0, "slinger": 0, "rider": 0, "chariot": 0, "catapult": 0, "godsent": 0,
                    "manticore": 0, "harpy": 0, "pegasus": 0, "griffin": 0, "cerberus": 0, "minotaur": 0, "medusa": 0, "zyklop": 0, "centaur": 0, "calydonian_boar": 0, "fury": 0, "sea_monster": 0, "spartoi": 0, "ladon": 0, "satyr": 0, "siren": 0,
                    "small_transporter": 0, "big_transporter": 0, "bireme": 0, "attack_ship": 0, "trireme": 0, "demolition_ship": 0, "colonize_ship": 0
                };

            if (!groupArray[DATA.bullseyeUnit.current_group]) {
                DATA.bullseyeUnit.current_group = -1;
            }

            if (!uw.Game.hasArtemis) {
                delete unitArray.calydonian_boar;
                delete unitArray.griffin;
            }
            if (!uw.Game.gods_active.aphrodite) {
                delete unitArray.siren;
                delete unitArray.satyr;
            }
            if (!uw.Game.gods_active.ares) {
                delete unitArray.spartoi;
                delete unitArray.ladon;
            }
            var land_units_str = "", content =
                '<div id="dio_available_units">' +
                // Dropdown menu
                '<div class="drop_box">' +
                '<div class="drop_group dropdown default">' +
                '<div class="border-left"></div><div class="border-right"></div>' +
                '<div class="caption" name="' + DATA.bullseyeUnit.current_group + '">' + uw.ITowns.town_groups._byId[DATA.bullseyeUnit.current_group].attributes.name + '</div>' +
                //'<div class="caption" name="' + groupArray[DATA.bullseyeUnit.current_group].name + '">dfghjk</div>' +
                '<div class="arrow"></div>' +
                '</div>' +
                '<div class="select_group dropdown-list default active"><div class="item-list"></div></div>' +
                '</div>' +
                '<table width="100%" class="radiobutton horizontal rbtn_visibility"><tr>' +
                '<td width="25%"><div class="option js-option" name="total"><div class="pointer"></div>' + getTexts("labels", "total") + '</div></td>' +
                '<td width="25%"><div class="option js-option" name="available"><div class="pointer"></div>' + getTexts("labels", "available") + '</div></td>' +
                '<td width="25%"><div class="option js-option" name="outer"><div class="pointer"></div>' + getTexts("labels", "outer") + '</div></td>' +
                '<td width="25%"><div class="option js-option" name="support"><div class="pointer"></div>' + getTexts("labels", "sup") + '</div></td>' +
                '</tr></table>' +
                '<hr>' +

                '<div id="dio_help_available_units" style="top: -37px;position: absolute; right: 92px;">' +
                '<a class="ui-dialog-titlebar-help ui-corner-all" href=' + getTexts("link", "available_units") + ' target="_blank"></a>' +
                '</div>' +
                '<button id="dio_close_available_units" role="button" class="available_units ui-dialog-titlebar-close" style="top: -37px;position: absolute; right: -8px;"></button>' +
                // Content
                '<div class="box_content">';

            for (var unit in unitArray) {
                if (unitArray.hasOwnProperty(unit)) {
                    land_units_str += '<div id="dio' + unit + '" class="unit index_unit bold unit_icon40x40 ' + unit + '"></div>';
                    if (uw.Game.gods_active.aphrodite) {
                        if (unit == "siren") { land_units_str += '<div style="clear:left;"></div>'; } // break
                    }
                    else if (uw.Game.gods_active.ares) {
                        if (unit == "ladon") { land_units_str += '<div style="clear:left;"></div>'; }
                    }
                    else if (unit == "sea_monster") {
                        land_units_str += '<div style="clear:left;"></div>';
                    }
                }
            }
            content += land_units_str + '</div></div>';

            AvailableUnits.wnd = uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_DIO_UNITS);

            AvailableUnits.wnd.setContent(content);

            /*global Timestamp*/
            if (uw.Game.premium_features.curator <= Timestamp.now()) {
                $('#dio_available_units .drop_box').css({ display: 'none' });
                DATA.bullseyeUnit.current_group = -1;
            }

            // Add groups to dropdown menu
            for (var group in groupArray) {
                if (groupArray.hasOwnProperty(group)) {
                    if (uw.ITowns.town_groups._byId[group]) {
                        var group_name = uw.ITowns.town_groups._byId[group].attributes.name;
                        $('<div class="option' + (group == -1 ? " sel" : "") + '" name="' + group + '">' + group_name + '</div>').appendTo('#dio_available_units .item-list');
                    }
                }
            }

            // Set active mode
            if (typeof (DATA.bullseyeUnit.mode) !== "undefined") {
                $('#dio_available_units .radiobutton .option[name="' + DATA.bullseyeUnit.mode + '"]').addClass("checked");
            }
            else {
                $('#dio_available_units .radiobutton .option[name="available"]').addClass("checked");
            }

            // Update
            AvailableUnits.updateWindow();

            // Dropdown menu Handler
            $('#dio_available_units .drop_group').click(() => { $('#dio_available_units .select_group').toggleClass('open'); });
            // Change group
            $('#dio_available_units .select_group .option').click(function () {
                DATA.bullseyeUnit.current_group = $(this).attr("name");
                $('#dio_available_units .select_group').removeClass('open');
                $('#dio_available_units .select_group .option.sel').removeClass("sel");
                $(this).addClass("sel");

                $('#dio_available_units .drop_group .caption').attr("name", DATA.bullseyeUnit.current_group);
                $('#dio_available_units .drop_group .caption').get(0).innerHTML = this.innerHTML;

                $('#dio_available_units .unit.active').removeClass("active");
                $('#dio_available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");

                UnitCounter.count();

                AvailableUnits.updateWindow();
                AvailableUnits.updateBullseye();
                AvailableUnits.save();
            });

            // Change mode (total, available, outer)
            $('#dio_available_units .radiobutton .option').click(function () {

                DATA.bullseyeUnit.mode = $(this).attr("name");

                $('#dio_available_units .radiobutton .option.checked').removeClass("checked");
                $(this).addClass("checked");

                UnitCounter.count();

                AvailableUnits.updateWindow();
                AvailableUnits.updateBullseye();
                AvailableUnits.save();
            });

            // Set active bullseye unit
            $('#dio_available_units .unit.' + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")).addClass("active");

            // Change bullseye unit
            $('#dio_available_units .unit').click(function () {
                DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] = this.className.split(" ")[4].trim();

                $('#dio_available_units .unit.active').removeClass("active");
                $(this).addClass("active");

                AvailableUnits.updateBullseye();
                AvailableUnits.save();

            });

            //tooltip

            $('#dio_help_available_units').tooltip('Wiki (' + dio_icon + getTexts("Options", "ava")[0] + ')');
            for (unit in unitArray) {
                if (unitArray.hasOwnProperty(unit)) {
                    $('#dio' + unit).tooltip(uw.GameData.units[unit].name);
                }
            }
            $('#dio_close_available_units').click(() => {
                if (!uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS)) {
                    AvailableUnits.openWindow();
                    $('#dio_btn_available_units, .ico_available_units').addClass("checked");
                } else {
                    AvailableUnits.closeWindow();
                    $('#dio_btn_available_units, .ico_available_units').removeClass("checked");
                }
            });
        },
        closeWindow: function () {
            uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_UNITS).close();
        },
        save: function () {
            // console.debug("BULLSEYE SAVE", DATA.bullseyeUnit);

            saveValue(WID + "_bullseyeUnit", JSON.stringify(DATA.bullseyeUnit));
        },
        updateBullseye: function () {

            var sum = 0, str = "", fsize = ['1.4em', '1.2em', '1.15em', '1.1em', '1.0em', '0.95em'], i;

            if ($('#dio_available_units_bullseye').get(0)) {
                $('#dio_available_units_bullseye').get(0).className = "unit_icon90x90 " + (DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme");

                if (UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group]) {
                    sum = UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group].all[(DATA.bullseyeUnit[DATA.bullseyeUnit.current_group] || "bireme")] || 0;
                }
                sum = sum.toString();

                for (i = 0; i < sum.length; i++) {
                    str += "<span style='font-size:" + fsize[i] + "'>" + sum[i] + "</span>";
                }
                $('#dio_available_units_bullseye .amount').get(0).innerHTML = str;

                if (sum >= 100000) { $('#dio_available_units_bullseye').addClass("big_number"); }
                else { $('#dio_available_units_bullseye').removeClass("big_number"); }
            }
        },
        updateWindow: function () {

            $('#dio_available_units .box_content .unit').each(function () {
                var unit = this.className.split(" ")[4];

                // TODO: Alte Variante entfernen
                // Alte Variante:
                //this.innerHTML = '<span style="font-size:0.9em">' + groupUnitArray[DATA.bullseyeUnit.current_group][unit] + '</span>';

                // Neue Variante
                this.innerHTML = '<span style="font-size:0.9em">' + (UnitCounter.units[DATA.bullseyeUnit.mode || "available"][DATA.bullseyeUnit.current_group].all[unit] || 0) + '</span>';
            });
        }
    };

    /*******************************************************************************************************************************
     * Comparison box
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Compares the units of each unit type
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var UnitComparison = {
        activate: function () {
            //UnitComparison.addBox();
            UnitComparison.addButton();

            // Create Window Type
            createWindowType("DIO_COMPARISON", getTexts("labels", "dsc"), 500, 405, true, ["center", "center", 100, 100]);
            //Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON).setHeight('800');

            // Style
            $('<style id="dio_comparison_style"> ' +

                // Button
                '#dio_comparison_button { top:51px; left:120px; z-index:11; position:absolute; } ' +
                '#dio_comparison_button .ico_comparison { margin:5px 0px 0px 4px; width:24px; height:24px; z-index: 15;' +
                'background:url(' + Home_img + 'casque.png) no-repeat 0px 0px; background-size:100%; filter:url(#Hue1); -webkit-filter:hue-rotate(60deg); } ' +
                '#dio_comparison_button.checked .ico_comparison { margin-top:6px; } ' +

                // Window
                '#dio_comparison a { float:left; background-repeat:no-repeat; background-size:25px; line-height:2; margin-right:10px; } ' +
                '#dio_comparison .box_content { text-align:center; font-style:normal; } ' +

                // Menu tabs
                '#dio_comparison_menu .tab_icon { left: 23px;} ' +
                '#dio_comparison_menu .tab_label { margin-left: 18px; } ' +

                '#dio_comparison_menu {top: -36px; right: 142px;} ' +
                '#dio_comparison_menu .submenu_link {color: #000;} ' +
                '#dio_comparison_menu li { float:left; } ' +

                // Content
                '#dio_comparison .hidden { display:none; } ' +
                '#dio_comparison table { width:500px; } ' +
                '#dio_comparison .hack .t_hack, #dio_comparison .pierce .t_pierce, #dio_comparison .distance .t_distance, #dio_comparison .sea .t_sea { display:inline-table; } ' +

                '#dio_comparison .box_content { background:url(' + Home_img + 'casque-1.png) 94% 94% no-repeat; background-size:140px; } ' +

                '#dio_comparison .compare_type_icon { height:25px; width:25px; background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.booty { background:url(' + Home_img + 'butin-sac.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.time { background:url(https://gpall.innogamescdn.com/images/game/res/time.png); background-size:100%; } ' + //   // ' + Home_img + 'time.png
                '#dio_comparison .compare_type_icon.favor { background:url(https://gpall.innogamescdn.com/images/game/res/favor.png); background-size:100%; } ' + // ' + Home_img + 'faveur.png
                '#dio_comparison .compare_type_icon.wood { background:url(https://gpall.innogamescdn.com/images/game/res/wood.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.stone { background:url(https://gpall.innogamescdn.com/images/game/res/stone.png); background-size:100%; } ' +
                '#dio_comparison .compare_type_icon.iron { background:url(https://gpall.innogamescdn.com/images/game/res/iron.png); background-size:100%; } ' +
                '.dio_icon_small2 { position:relative; height:20px; width:25px; margin-left:-25px; }' +

                '</style>').appendTo("head");
        },
        deactivate: function () {
            $('#dio_comparison_button').remove();
            $('#dio_comparison_style').remove();

            if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON)) {
                uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON).close();
            }
        },
        addButton: function () {
            $('<div id="dio_comparison_button" class="circle_button"><div class="ico_comparison js-caption"></div></div>').appendTo(".bull_eye_buttons");

            // Events
            $('#dio_comparison_button').on('click', function () {
                if (!uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON)) {
                    UnitComparison.openWindow();
                    $('#dio_comparison_button').addClass("checked");
                } else {
                    UnitComparison.closeWindow();
                    $('#dio_comparison_button').removeClass("checked");
                }
            });

            $('.close_all').click(() => { $('#dio_comparison_button').removeClass("checked"); });

            // Tooltip
            $('#dio_comparison_button').tooltip(dio_icon + getTexts("labels", "dsc"));
        },
        openWindow: function () {
            var content =
                // Title tabs
                '<ul id="dio_comparison_menu" class="menu_inner">' +
                '<li><a class="submenu_link sea" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon dio_icon_small2 townicon_so"></span><span class="tab_label">' + getTexts("labels", "sea") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link distance" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon dio_icon_small2 townicon_di"></span><span class="tab_label">' + getTexts("labels", "dst") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link pierce" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon dio_icon_small2 townicon_sh"></span><span class="tab_label">' + getTexts("labels", "prc") + '</span>' +
                '</span></span></span></a></li>' +
                '<li><a class="submenu_link hack active" href="#"><span class="left"><span class="right"><span class="middle">' +
                '<span class="tab_icon dio_icon_small2 townicon_lo"></span><span class="tab_label">' + getTexts("labels", "hck") + '</span>' +
                '</span></span></span></a></li>' +
                '</ul>' +

                '<div id="dio_help_UnitComparison" style="top: -37px;position: absolute; right: 92px;">' +
                '<a class="ui-dialog-titlebar-help ui-corner-all" href=' + getTexts("link", "UnitComparison") + ' target="_blank"></a>' +
                '</div>' +
                '<button id="dio_close_UnitComparison" role="button" class="available_units ui-dialog-titlebar-close" style="top: -37px;position: absolute; right: -8px;"></button>' +
                // Content
                '<div id="dio_comparison" style="margin-bottom:5px; font-style:italic;"><div class="box_content hack"></div></div>';

            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_DIO_COMPARISON).setContent(content);

            UnitComparison.addComparisonTable("hack");
            UnitComparison.addComparisonTable("pierce");
            UnitComparison.addComparisonTable("distance");
            UnitComparison.addComparisonTable("sea");

            // Tooltips
            var labelArray = uw.DM.getl10n("barracks"),
                labelAttack = uw.DM.getl10n("context_menu", "titles").attack,
                labelDefense = uw.DM.getl10n("place", "tabs")[0];

            $('.tr_att').tooltip(labelAttack);
            $('.tr_def').tooltip(labelDefense + " (Ø)");
            $('.tr_def_sea').tooltip(labelDefense);
            $('.tr_spd').tooltip(labelArray.tooltips.speed);
            $('.tr_bty').tooltip(labelArray.tooltips.booty.title);
            $('.tr_bty_sea').tooltip(labelArray.tooltips.ship_transport.title);
            $('.tr_res').tooltip(labelArray.costs + " (" +
                labelArray.cost_details.wood + " + " +
                labelArray.cost_details.stone + " + " +
                labelArray.cost_details.iron + ")");
            $('.tr_woo').tooltip(labelArray.costs + " (" + labelArray.cost_details.wood + ")");
            $('.tr_sto').tooltip(labelArray.costs + " (" + labelArray.cost_details.stone + ")");
            $('.tr_iro').tooltip(labelArray.costs + " (" + labelArray.cost_details.iron + ")");
            $('.tr_fav').tooltip(labelArray.costs + " (" + labelArray.cost_details.favor + ")");
            $('.tr_tim').tooltip(labelArray.cost_details.buildtime_barracks + " (s)");
            $('.tr_tim_sea').tooltip(labelArray.cost_details.buildtime_docks + " (s)");

            UnitComparison.switchComparisonTables();

            // Close button event - uncheck available units button

            /*if (typeof uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON).getJQCloseButton() != 'undefined') {


            uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON).getJQCloseButton().get(0).onclick = function () {
                $('#dio_comparison_button').removeClass("checked");
                $('.ico_comparison').get(0).style.marginTop = "5px";
            };
            };*/

            $('#dio_close_UnitComparison').on('click', function () {
                if (uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON)) {
                    UnitComparison.closeWindow();
                    $('#dio_comparison_button').removeClass("checked");
                }
            });

        },
        closeWindow: function () {
            uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_COMPARISON).close();
        },
        switchComparisonTables: function () {
            $('#dio_comparison_menu .hack, #dio_comparison_menu .pierce, #dio_comparison_menu .distance, #dio_comparison_menu .sea').click(function () {
                $('#dio_comparison .box_content').removeClass($('#dio_comparison .box_content').get(0).className.split(" ")[1]);
                //console.debug(this.className.split(" ")[1]);
                $('#dio_comparison .box_content').addClass(this.className.split(" ")[1]);

                $('#dio_comparison_menu .active').removeClass("active");
                $(this).addClass("active");
            });
        },

        tooltips: [], t: 0,

        addComparisonTable: function (type) {
            var pos = {
                att: { hack: "36%", pierce: "27%", distance: "45.5%", sea: "72.5%" },
                def: { hack: "18%", pierce: "18%", distance: "18%", sea: "81.5%" }
            };
            var unitIMG = "https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png";
            var strArray = [
                "<td></td>",
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.att[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% ' + pos.def[type] + ';"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 63%;"></div></td>',
                (type !== "sea") ? '<td><div class="compare_type_icon booty"></div></td>' : '<td><div class="compare_type_icon" style="background-position: 0% 91%;"></div></td>',
                '<td><div class="compare_type_icon" style="background-position: 0% 54%;"></div></td>',
                '<td><div class="compare_type_icon favor"></div></td>',
                '<td><div class="compare_type_icon time"></div></td>',
                '<td><div class="compare_type_icon wood"></div></td>',
                '<td><div class="compare_type_icon stone"></div></td>',
                '<td><div class="compare_type_icon iron"></div></td>'
            ];

            for (var e in uw.GameData.units) {
                if (uw.GameData.units.hasOwnProperty(e)) {
                    var valArray = [];

                    if (type === (uw.GameData.units[e].attack_type || "sea") && (e !== "militia")) {
                        valArray.att = Math.round(uw.GameData.units[e].attack * 10 / uw.GameData.units[e].population) / 10;
                        valArray.def = Math.round(((uw.GameData.units[e].def_hack + uw.GameData.units[e].def_pierce + uw.GameData.units[e].def_distance) * 10) / (3 * uw.GameData.units[e].population)) / 10;
                        valArray.def = valArray.def || Math.round(uw.GameData.units[e].defense * 10 / uw.GameData.units[e].population) / 10;
                        valArray.speed = uw.GameData.units[e].speed;
                        valArray.booty = Math.round(((uw.GameData.units[e].booty) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.booty = valArray.booty || Math.round(((uw.GameData.units[e].capacity ? uw.GameData.units[e].capacity + 6 : 0) * 10) / uw.GameData.units[e].population) / 10;
                        valArray.res = Math.round((uw.GameData.units[e].resources.wood + uw.GameData.units[e].resources.stone + uw.GameData.units[e].resources.iron) / (uw.GameData.units[e].population));
                        valArray.wood = Math.round((uw.GameData.units[e].resources.wood) / (uw.GameData.units[e].population));
                        valArray.stone = Math.round((uw.GameData.units[e].resources.stone) / (uw.GameData.units[e].population));
                        valArray.iron = Math.round((uw.GameData.units[e].resources.iron) / (uw.GameData.units[e].population));
                        valArray.favor = Math.round((uw.GameData.units[e].favor * 10) / uw.GameData.units[e].population) / 10;
                        valArray.time = Math.round(uw.GameData.units[e].build_time / uw.GameData.units[e].population);

                        // World without Artemis? -> grey griffin and boar
                        valArray.heroStyle = "";
                        valArray.heroStyleIMG = "";

                        if (!uw.Game.hasArtemis && ((e === "griffin") || (e === "calydonian_boar"))) {
                            valArray.heroStyle = "color:black;opacity: 0.4;";
                            valArray.heroStyleIMG = "filter: url(#GrayScale); -webkit-filter:grayscale(100%);";
                        }
                        if (!uw.Game.gods_active.aphrodite && ((e === "siren") || (e === "satyr"))) {
                            valArray.heroStyle = "display: none;";
                        }
                        if (!uw.Game.gods_active.ares && ((e === "spartoi") || (e === "ladon"))) {
                            valArray.heroStyle = "display: none;";
                        }

                        strArray[0] += '<td class="un' + (UnitComparison.t) + '"style="' + valArray.heroStyle + '"><span class="unit index_unit unit_icon40x40 ' + e + '" style="' + valArray.heroStyle + valArray.heroStyleIMG + '"></span></td>';
                        strArray[1] += '<td class="bold" style="color:' + ((valArray.att > 19) ? 'green;' : ((valArray.att < 10 && valArray.att !== 0) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.att + '</td>';
                        strArray[2] += '<td class="bold" style="color:' + ((valArray.def > 19) ? 'green;' : ((valArray.def < 10 && valArray.def !== 0) ? 'red;' : 'black;')) + valArray.heroStyle + '">' + valArray.def + '</td>';
                        strArray[3] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.speed + '</td>';
                        strArray[4] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.booty + '</td>';
                        strArray[5] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.res + '</td>';
                        strArray[8] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.wood + '</td>';
                        strArray[9] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.stone + '</td>';
                        strArray[10] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.iron + '</td>';
                        strArray[6] += '<td class="bold" style="color:' + ((valArray.favor > 0) ? 'rgb(0, 0, 214);' : 'black;') + valArray.heroStyle + ';">' + valArray.favor + '</td>';
                        strArray[7] += '<td class="bold" style="' + valArray.heroStyle + '">' + valArray.time + '</td>';

                        UnitComparison.tooltips[UnitComparison.t] = uw.GameData.units[e].name;
                        UnitComparison.t++;
                        $('#dio_help_UnitComparison').tooltip('Wiki (' + dio_icon + getTexts("Options", "com")[0] + ')');
                    }
                }
            }

            $('<table class="hidden t_' + type + '" cellpadding="1px">' +
                '<tr>' + strArray[0] + '</tr>' +
                '<tr class="tr_att">' + strArray[1] + '</tr><tr class="tr_def' + (type == "sea" ? "_sea" : "") + '">' + strArray[2] + '</tr>' +
                '<tr class="tr_spd">' + strArray[3] + '</tr><tr class="tr_bty' + (type == "sea" ? "_sea" : "") + '">' + strArray[4] + '</tr>' +
                '<tr class="tr_res">' + strArray[5] + '</tr><tr class="tr_woo">' + strArray[8] + '</tr>' +
                '<tr class="tr_sto">' + strArray[9] + '</tr><tr class="tr_iro">' + strArray[10] + '</tr>' +
                '<tr class="tr_fav">' + strArray[6] + '</tr><tr class="tr_tim' + (type == "sea" ? "_sea" : "") + '">' + strArray[7] + '</tr>' +
                '</table>').appendTo('#dio_comparison .box_content');

            for (var i = 0; i <= UnitComparison.t; i++) {
                $('.un' + i).tooltip(UnitComparison.tooltips[i]);
            }
        }
    };

    /*******************************************************************************************************************************
     * Reports
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Adding a color filter. Quack function
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var reports = {
        activate: function () {

        },
        reportsColor: function () {
            var b = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_REPORT);
            if (b.length == 0) return console.log("OK");
            var wnd = b[b.length - 1];
            var c = wnd.getID();
            $("DIV#gpwnd_" + c + " #report_list li").each(function () {
                $(this).css({ "border-left": "5px solid rgb(128, 64, 0)" }).addClass("farm");
            });
            // attaques
            $("DIV#gpwnd_" + c + " #report_list .color_highlight ").each(function () {
                $(this).css({ "border-left": "5px solid red" }).removeClass("farm").addClass("angriffe");
            });
            // troupes stationnées
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "supporting", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid green" }).removeClass("farm").addClass("unterstützungen");
            });
            // soutient
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "support", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid green" }).removeClass("farm").addClass("unterstützungen");
            });
            // ne peut pas soutenir
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + uw.DM.getl10n("report", true).inbox.filter_types.support.toLowerCase() + "')").each(function () {
                $(this).css({ "border-left": "5px solid green" }).removeClass("farm").addClass("unterstützungen");
            });
            // Espion provenant
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "spy", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid blue" }).removeClass("farm").addClass("spios");
            });
            // espionne
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "spying", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid blue" }).removeClass("farm").addClass("spios");
            });
            // conquered
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "conquered", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid black" }).removeClass("farm");
            });
            // (lancé)
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "enacted", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid purple" }).removeClass("farm").addClass("zauber");
            });
            // (Vous avez reçu) gold
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "gold", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid rgba(123, 128, 0, 0.89)" }).addClass("farm");
            });
            //réservation (Votre réservation pour)
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "Reservations", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid yellow" }).addClass("farm");
            });
            //Alliance (parrainé)
            $("DIV#gpwnd_" + c + " #report_list li:contains('" + getTexts("reports", "parrainé", true) + "')").each(function () {
                $(this).css({ "border-left": "5px solid yellow" }).addClass("farm");
            });
        },
        reportsFilter: function () {
            if (MID == 'fr' || MID == 'de' || MID == 'en' || MID == 'zz') {
                var b = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_REPORT);
                if (b.length != 0) {
                    var wnd = b[b.length - 1];
                    var c = wnd.getID();
                    if (!$("#dio_menu_berichte_icon_wrapper").is(":visible")) {
                        $('<div id="dio_menu_berichte_icon_wrapper" style="display:inline;position:absolute;margin-top:-1px;margin-left:120px"></div>').appendTo("DIV#gpwnd_" + c + " #es_page_reports");
                        $('<label id="angriffe" class="dio_menu_berichte_Icon" style="background-position: -22px 0; border-right:3px solid red;"><input type="checkbox" id="angriffe" class="dio_menu_berichte_checkbox"></label>').appendTo('#dio_menu_berichte_icon_wrapper');
                        $('<label id="unterstützungen" class="dio_menu_berichte_Icon" style="background-position: -44px 0; border-right:3px solid green;"><input type="checkbox" id="unterstützungen" class="dio_menu_berichte_checkbox"></label>').appendTo('#dio_menu_berichte_icon_wrapper');
                        $('<label id="zauber" class="dio_menu_berichte_Icon" style="background-position: -88px 0; border-right:3px solid purple;"><input type="checkbox" id="zauber" class="dio_menu_berichte_checkbox"></label>').appendTo('#dio_menu_berichte_icon_wrapper');
                        $('<label id="spios" class="dio_menu_berichte_Icon" style="background-position: -66px 0; border-right:3px solid blue;"><input type="checkbox" id="spios" class="dio_menu_berichte_checkbox"></label>').appendTo('#dio_menu_berichte_icon_wrapper');
                        $('<label id="farm" class="dio_menu_berichte_Icon" style="background-position: -176px 0; border-right:3px solid rgb(128, 64, 0);"><input type="checkbox" id="farm" class="dio_menu_berichte_checkbox"></label>').appendTo('#dio_menu_berichte_icon_wrapper');
                        $(".dio_menu_berichte_Icon").css({
                            'display': 'inline-block',
                            'background-image': 'url(' + Home_img + 'reportsfilter.gif)',
                            'background-repeat': 'repeat scroll',
                            'width': '22px',
                            'height': '22px',
                            'position': 'relative',
                            'float': 'left',
                            'margin-left': '22px'
                        });
                        $(".dio_menu_berichte_checkbox").css({
                            'margin-top': '5px',
                            'margin-left': '31px'
                        });
                        $(".dio_menu_berichte_checkbox").click(function () {
                            var classid = this.id;
                            var checkBoxes = $("li." + classid + " INPUT[type='checkbox']");
                            checkBoxes.attr("checked", !checkBoxes.attr("checked"));
                        });
                    }
                    var ReportTooltip = uw.DM.getl10n("report").inbox.filter_types;
                    //tooltip
                    $('#angriffe').tooltip(dio_icon + ReportTooltip.attacks);
                    $('#unterstützungen').tooltip(dio_icon + ReportTooltip.support);
                    $('#zauber').tooltip(dio_icon + ReportTooltip.divine_powers);
                    $('#spios').tooltip(dio_icon + ReportTooltip.espionage);
                    $('#farm').tooltip(dio_icon + ReportTooltip.misc);
                }
            }
        },
        deactivate: function () {
            $('dio_menu_berichte_icon_wrapper').remove();
        },
    };

    /*******************************************************************************************************************************
     * World Wonder
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● worldWonderIcon
     * | ● WorldWonderIcons
     * | ● World Wonder Ranking - Change
     * | ● click adjustment
     * | ● Share calculation (= ratio of player points to alliance points)
     * | ● Resources calculation & counter (stores amount)
     * | ● Adds missing previous & next buttons on finished world wonders (better browsing through world wonders)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    function imageSelectionProtection() {
        $('<style id="dio_image_selection" type="text/css"> img { -moz-user-select: -moz-none; -khtml-user-select: none; -webkit-user-select: none;} </style>').appendTo('head');
    }

    var worldWonderIcon = {
        colossus_of_rhodes: "url(https://gpall.innogamescdn.com/images/game/map/wonder_colossus_of_rhodes.png) 38px -1px;",
        great_pyramid_of_giza: "url(https://gpall.innogamescdn.com/images/game/map/wonder_great_pyramid_of_giza.png) 34px -6px;",
        hanging_gardens_of_babylon: "url(https://gpall.innogamescdn.com/images/game/map/wonder_hanging_gardens_of_babylon.png) 34px -5px;",
        lighthouse_of_alexandria: "url(https://gpall.innogamescdn.com/images/game/map/wonder_lighthouse_of_alexandria.png) 37px -1px;",
        mausoleum_of_halicarnassus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_mausoleum_of_halicarnassus.png) 37px -4px;",
        statue_of_zeus_at_olympia: "url(https://gpall.innogamescdn.com/images/game/map/wonder_statue_of_zeus_at_olympia.png) 36px -3px;",
        temple_of_artemis_at_ephesus: "url(https://gpall.innogamescdn.com/images/game/map/wonder_temple_of_artemis_at_ephesus.png) 34px -5px;"
    };

    var WorldWonderIcons = {
        activate: function () {
            try {
                if (!$('#dio_wondericons').get(0)) {
                    var color = "orange";

                    // style for world wonder icons
                    var style_str = "<style id='dio_wondericons' type='text/css'>";
                    for (var ww_type in wonder.map) {
                        if (wonder.map.hasOwnProperty(ww_type)) {
                            for (var ww in wonder.map[ww_type]) {
                                if (wonder.map[ww_type].hasOwnProperty(ww)) {
                                    /*
                                     if(wonder.map[ww_type][ww] !== AID){
                                     color = "rgb(192, 109, 54)";
                                     } else {
                                     color = "orange";
                                     }
                                     */
                                    style_str += "#mini_i" + ww + ":before {" +
                                        "content: '';" +
                                        "background:" + color + " " + worldWonderIcon[ww_type] +
                                        "background-size: auto 97%;" +
                                        "padding: 8px 16px;" +
                                        "top: 50px;" +
                                        "position: relative;" +
                                        "border-radius: 40px;" +
                                        "z-index: 200;" +
                                        "cursor: pointer;" +
                                        "box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);" +
                                        "border: 2px solid green; } " +
                                        "#mini_i" + ww + ":hover:before { z-index: 201; " +
                                        "filter: url(#Brightness12);" +
                                        "-webkit-filter: brightness(1.2); } ";
                                }
                            }
                        }
                    }
                    $(style_str + "</style>").appendTo('head');

                    // Context menu on mouseclick
                    $('#minimap_islands_layer').on('click', '.m_island', function (e) {
                        var ww_coords = this.id.split("i")[3].split("_");
                        uw.Layout.contextMenu(e, 'wonder', { ix: ww_coords[0], iy: ww_coords[1] });
                    });


                }
            } catch (error) { errorHandling(error, "setWonderIconsOnMap"); }
        },
        deactivate: function () {
            $('#dio_wondericons').remove();
        }
    };

    /*******************************************************************************************************************************
     * World Wonder Ranking - Change
     *******************************************************************************************************************************/
    /*function getWorldWonderTypes() {
        $.ajax({
            type: "GET",
            url: "/game/alliance?town_id=" + uw.Game.town_id + "&action=world_wonders&h=" + uw.Game.csrfToken + "&json=%7B%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A" + uw.Game.notification_last_requested_id +
            "%7D&_=" + uw.Game.server_time,
            success: function (text) {
                try {
                    //console.log(JSON.parse(text));
                    temp = JSON.parse(text).json.data.world_wonders;
                    for (var t in temp) {
                        if (temp.hasOwnProperty(t)) {
                            wonderTypes[temp[t].wonder_type] = temp[t].full_name;
                        }
                    }
                    temp = JSON.parse(text).json.data.buildable_wonders;
                    for (var x in temp) {
                        if (temp.hasOwnProperty(x)) {
                            wonderTypes[x] = temp[x].name;
                        }
                    }
                    saveValue(MID + "_wonderTypes", JSON.stringify(wonderTypes));
                } catch (error) { errorHandling(error, "getWorldWonderTypes"); }
            }
        });
    }

    function getWorldWonders() {
        $.ajax({
            type: "GET",
            url: "/game/ranking?town_id=" + uw.Game.town_id + "&action=wonder_alliance&h=" + uw.Game.csrfToken + "&json=%7B%22type%22%3A%22all%22%2C%22town_id%22%3A" + uw.Game.town_id + "%2C%22nlreq_id%22%3A3" + uw.Game.notification_last_requested_id +
            "%7D&_=" + uw.Game.server_time
        });
    }

    var WorldWonderRanking = {
        activate: function () {
            if ($('#dio_wonder_ranking').get(0)) {
                $('#dio_wonder_ranking').remove();
            }
            $('<style id="dio_wonder_ranking" type="text/css"> .wonder_ranking { display: none; } </style>').appendTo('head');
        },
        deactivate: function () {
            if ($('#dio_wonder_ranking').get(0)) {
                $('#dio_wonder_ranking').remove();
            }
            $('<style id="dio_wonder_ranking" type="text/css"> .wonder_ranking { display: block; } </style>').appendTo('head');
        },
        change: function (html) {
            if ($('#ranking_inner tr', html)[0].children.length !== 1) { // world wonders exist?
                try {
                    var ranking = {}, temp_ally, temp_ally_id, temp_ally_link;

                    // Save world wonder ranking into array
                    $('#ranking_inner tr', html).each(function () {
                        try {
                            if (this.children[0].innerHTML) {
                                temp_ally = this.children[1].children[0].innerHTML; // das hier

                                temp_ally_id = this.children[1].children[0].onclick.toString();
                                temp_ally_id = temp_ally_id.substring(temp_ally_id.indexOf(",") + 1);
                                temp_ally_id = temp_ally_id.substring(0, temp_ally_id.indexOf(")"));

                                temp_ally_link = this.children[1].innerHTML;

                            } else {
                                //World wonder name
                                var wonder_name = this.children[3].children[0].innerHTML;

                                for (var w in wonderTypes) {
                                    if (wonderTypes.hasOwnProperty(w)) {
                                        if (wonder_name == wonderTypes[w]) {
                                            var level = this.children[4].innerHTML, // world wonder level
                                                ww_data = JSON.parse(atob(this.children[3].children[0].href.split("#")[1])), wonder_link;
                                            //console.log(ww_data);

                                            if (!ranking.hasOwnProperty(level)) {
                                                // add wonder types
                                                ranking[level] = {
                                                    colossus_of_rhodes: {},
                                                    great_pyramid_of_giza: {},
                                                    hanging_gardens_of_babylon: {},
                                                    lighthouse_of_alexandria: {},
                                                    mausoleum_of_halicarnassus: {},
                                                    statue_of_zeus_at_olympia: {},
                                                    temple_of_artemis_at_ephesus: {}
                                                };
                                            }

                                            if (!ranking[level][w].hasOwnProperty(temp_ally_id)) {
                                                ranking[level][w][temp_ally_id] = {}; // add alliance array
                                            }
                                            // island coordinates of the world wonder:
                                            ranking[level][w][temp_ally_id].ix = ww_data.ix;
                                            ranking[level][w][temp_ally_id].iy = ww_data.iy;
                                            ranking[level][w][temp_ally_id].sea = this.children[5].innerHTML; // world wonder sea

                                            wonder_link = this.children[3].innerHTML;
                                            if (temp_ally.length > 15) {
                                                temp_ally = temp_ally.substring(0, 15) + '.';
                                            }
                                            wonder_link = wonder_link.substr(0, wonder_link.indexOf(">") + 1) + temp_ally + '</a>';

                                            ranking[level][w][temp_ally_id].ww_link = wonder_link;

                                            // other data of the world wonder
                                            ranking[level][w][temp_ally_id].ally_link = temp_ally_link;
                                            ranking[level][w][temp_ally_id].ally_name = temp_ally; // alliance name
                                            ranking[level][w][temp_ally_id].name = wonder_name; // world wonder name

                                            // Save wonder coordinates for wonder icons on map
                                            if (!wonder.map[w]) {
                                                wonder.map[w] = {};
                                            }
                                            wonder.map[w][ww_data.ix + "_" + ww_data.iy] = level;
                                            saveValue(WID + "_wonder", JSON.stringify(wonder));

                                        }
                                    }
                                }
                            }
                        } catch (error) { errorHandling(error, "WorldWonderRanking.change(function)"); }
                    });

                    if ($('#ranking_table_wrapper').get(0)) {
                        $('#ranking_fixed_table_header').get(0).innerHTML = '<tr>' +
                            '<td style="width:10px">#</td>' +
                            '<td>Colossus</td>' +
                            '<td>Pyramid</td>' +
                            '<td>Garden</td>' +
                            '<td>Lighthouse</td>' +
                            '<td>Mausoleum</td>' +
                            '<td>Statue</td>' +
                            '<td>Temple</td>' +
                            '</tr>';

                        $('#ranking_fixed_table_header').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            //paddingLeft: '0px',
                            paddingRight: '15px'
                        });

                        var ranking_substr = '', z = 0;
                        for (var level = 10; level >= 1; level--) {
                            if (ranking.hasOwnProperty(level)) {
                                var complete = "";
                                if (level == 10) {
                                    complete = "background: rgba(255, 236, 108, 0.36);";
                                }

                                // Alternate table background color
                                if (z === 0) {
                                    ranking_substr += '<tr class="game_table_odd" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 1;
                                } else {
                                    ranking_substr += '<tr class="game_table_even" style="' + complete + '"><td style="border-right: 1px solid #d0be97;">' + level + '</td>';
                                    z = 0;
                                }
                                for (var w in ranking[level]) {
                                    if (ranking[level].hasOwnProperty(w)) {
                                        ranking_substr += '<td>';

                                        for (var a in ranking[level][w]) {
                                            if (ranking[level][w].hasOwnProperty(a)) {
                                                ranking_substr += '<nobr>' + ranking[level][w][a].ww_link + '</nobr><br />'; // ww link
                                            }
                                        }
                                        ranking_substr += '</td>';
                                    }
                                }
                                ranking_substr += '</tr>';
                            }
                        }

                        var ranking_str = '<table id="ranking_endless_scroll" class="game_table" cellspacing="0"><tr>' +
                            '<td style="width:10px;border-right: 1px solid #d0be97;"></td>' +
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.colossus_of_rhodes + ';margin-left:26px"></div></td>' +	// Colossus
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.great_pyramid_of_giza + ';margin-left:19px"></div></td>' +	// Pyramid
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.hanging_gardens_of_babylon + ';margin-left:19px"></div></td>' +	// Garden
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.lighthouse_of_alexandria + ';margin-left:24px"></div></td>' +	// Lighthouse
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.mausoleum_of_halicarnassus + ';margin-left:25px"></div></td>' +	// Mausoleum
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.statue_of_zeus_at_olympia + ';margin-left:25px"></div></td>' +	// Statue
                            '<td><div class="dio_wonder" style="background:' + worldWonderIcon.temple_of_artemis_at_ephesus + ';margin-left:22px"></div></td>' +	// Temple
                            '</tr>' + ranking_substr + '</table>';

                        $('#ranking_table_wrapper').get(0).innerHTML = ranking_str;

                        $('#ranking_endless_scroll .dio_wonder').css({
                            width: "65px", height: "60px",
                            backgroundSize: "auto 100%",
                            backgroundPosition: "64px 0px"
                        });

                        $('#ranking_endless_scroll').css({
                            tableLayout: 'fixed',
                            width: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            fontSize: '0.7em',
                            lineHeight: '2'
                        });
                        $('#ranking_endless_scroll tbody').css({
                            verticalAlign: 'text-top'
                        });

                        $('#ranking_table_wrapper img').css({
                            width: "60px"
                        });
                        $('#ranking_table_wrapper').css({
                            overflowY: 'scroll'
                        });
                    }
                } catch (error) { errorHandling(error, "WorldWonderRanking.change"); }
            }
            if ($('.wonder_ranking').get(0)) {
                $('.wonder_ranking').get(0).style.display = "block";
            }
        }

    };*/

    /*******************************************************************************************************************************
     * getPointRatio: Default
     *******************************************************************************************************************************/
    if (uw.Game.features.end_game_type == "end_game_type_world_wonder") {
        function getPointRatioFromCache() {
            if (AID) {
                if ("object" != typeof uw.MM.DIO) { setTimeout(function () { getPointRatioFromCache(); }, 1E4); }
                else {
                    try {
                        var AP = uw.MM.DIO.cacheAlliances[uw.Game.alliance_id].Points;
                        wonder.ratio[AID] = 100 / AP * uw.Game.player_points;
                        saveValue(WID + "_wonder", JSON.stringify(wonder));
                    } catch (error) { errorHandling(error, "getPointRatioFromCache"); }
                }
            } else {
                wonder.ratio[AID] = -1;
                saveValue(WID + "_wonder", JSON.stringify(wonder));
            }
        }

        function getPointRatioFromAllianceRanking() {
            try {
                if (AID && $('.current_player .r_points').get(0)) {
                    wonder.ratio[AID] = 100 / parseInt($('.current_player .r_points').get(0).innerHTML, 10) * uw.Game.player_points;
                    saveValue(WID + "_wonder", JSON.stringify(wonder));
                }
            } catch (error) { errorHandling(error, "getPointRatioFromAllianceRaking"); }
        }

        function getPointRatioFromAllianceMembers() {
            try {
                var ally_points = 0;
                $('#ally_members_body tr').each(function () {
                    ally_points += parseInt($(this).children().eq(2).text(), 10) || 0;
                });
                wonder.ratio[AID] = 100 / ally_points * uw.Game.player_points;
                saveValue(WID + "_wonder", JSON.stringify(wonder));
            } catch (error) { errorHandling(error, "getPointRatioFromAllianceMembers"); }
        }

        var WorldWonderCalculator = {
            activate: function () {
                // Style
                $('<style id="dio_wonder_calculator"> ' +
                    '.wonder_controls { height:380px; } ' +
                    '.wonder_controls .wonder_progress { margin: 0px auto 5px; } ' +
                    '.wonder_controls .wonder_header { text-align:left; margin:10px -8px 12px 3px; }' +
                    '.wonder_controls .build_wonder_icon { top:25px !important; }' +
                    '.wonder_controls .wonder_progress_bar { top:54px; }' +
                    '.wonder_controls .trade fieldset { float:right; } ' +
                    '.wonder_controls .wonder_res_container { right:29px; } ' +
                    '.wonder_controls .ww_ratio {position:relative; height:auto; } ' +
                    '.wonder_controls fieldset.next_level_res {  height:auto; } ' +
                    '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +

                    '.wonder_controls .ww_ratio .progress { line-height:1; color:white; font-size:0.8em; } ' +
                    '.wonder_controls .ww_perc { position:absolute; width:242px; text-align:center; } ' +
                    '.wonder_controls .indicator3 { z-index:0; } ' +
                    '.wonder_controls .indicator3.red { background-position:right -203px; height:10px; width:242px; } ' +
                    '.wonder_controls .indicator3.green { background-position:right -355px; height:10px; width:242px; } ' +
                    '.wonder_controls .all_res { background:url(https://gpall.innogamescdn.com/images/game/layout/resources_2.32.png) no-repeat 0 -90px; width:30px; height:30px; margin:0 auto; margin-left:5px; } ' +
                    '.wonder_controls .town-capacity-indicator { margin-top:0px; } ' +
                    '</style>').appendTo('head');
            },
            deactivate: function () {
                $('#dio_wonder_calculator').remove();
            },
        };

        // TODO: Split function...
        function getResWW() {
            try {
                var wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_WONDERS);

                for (var e in wndArray) {
                    if (wndArray.hasOwnProperty(e)) {
                        var wndID = "#gpwnd_" + wndArray[e].getID() + " ";

                        if ($(wndID + '.wonder_progress').get(0)) {
                            var res = 0,
                                ww_share = { total: { share: 0, sum: 0 }, stage: { share: 0, sum: 0 } },
                                ww_type = $(wndID + '.finished_image_small').attr('src').split("/")[6].split("_")[0], // Which world wonder?
                                res_stages = [2, 4, 6, 10, 16, 28, 48, 82, 140, 238], // Rohstoffmenge pro Rohstofftyp in 100.000 Einheiten
                                stage = parseInt($(wndID + '.wonder_expansion_stage span').get(0).innerHTML.split("/")[0], 10) + 1, // Derzeitige Füllstufe
                                speed = uw.Game.game_speed;

                            wonder.storage[AID] = wonder.storage[AID] || {};

                            wonder.storage[AID][ww_type] = wonder.storage[AID][ww_type] || {};

                            wonder.storage[AID][ww_type][stage] = wonder.storage[AID][ww_type][stage] || 0;

                            if (!$(wndID + '.ww_ratio').get(0)) {
                                $('<fieldset class="ww_ratio"></fieldset>').appendTo(wndID + '.wonder_res_container .trade');
                                $(wndID + '.wonder_header').prependTo(wndID + '.wonder_progress');
                                $(wndID + '.wonder_res_container .send_res').insertBefore(wndID + '.wonder_res_container .next_level_res');
                            }

                            for (var d in res_stages) {
                                if (res_stages.hasOwnProperty(d)) {
                                    ww_share.total.sum += res_stages[d];
                                }
                            }

                            ww_share.total.sum *= speed * 300000;
                            ww_share.total.share = parseInt(wonder.ratio[AID] * (ww_share.total.sum / 100), 10);
                            ww_share.stage.sum = speed * res_stages[stage - 1] * 300000;
                            ww_share.stage.share = parseInt(wonder.ratio[AID] * (ww_share.stage.sum / 100), 10); // ( 3000 = 3 Rohstofftypen * 100000 Rohstoffe / 100 Prozent)
                            setResWW(stage, ww_type, ww_share, wndID);

                            $(wndID + '.wonder_res_container .send_resources_btn').click(() => {
                                try {
                                    wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_wood input:text').get(0).value, 10);
                                    wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_stone input:text').get(0).value, 10);
                                    wonder.storage[AID][ww_type][stage] += parseInt($(wndID + '#ww_trade_type_iron input:text').get(0).value, 10);

                                    setResWW(stage, ww_type, ww_share, wndID);
                                    saveValue(WID + "_wonder", JSON.stringify(wonder));
                                } catch (error) { errorHandling(error, "getResWW_Click"); }
                            });

                        } else {
                            $('<div class="prev_ww pos_Y"></div><div class="next_ww pos_Y"></div>').appendTo(wndID + '.wonder_controls');

                            $(wndID + '.wonder_finished').css({ width: '100%' });
                            $(wndID + '.pos_Y').css({ top: '-266px' });
                        }
                    }
                }
            } catch (error) { errorHandling(error, "getResWW"); }
        }

        function setResWW(stage, ww_type, ww_share, wndID) {
            try {
                var stage_width, total_width, res_total = 0, stage_color = "red", total_color = "red";

                for (var z in wonder.storage[AID][ww_type]) {
                    if (wonder.storage[AID][ww_type].hasOwnProperty(z)) {
                        res_total += wonder.storage[AID][ww_type][z];
                    }
                }

                // Progressbar
                if (ww_share.stage.share > wonder.storage[AID][ww_type][stage]) {
                    stage_width = (242 / ww_share.stage.share) * wonder.storage[AID][ww_type][stage];
                    stage_color = "red";
                } else {
                    stage_width = 242;
                    stage_color = "green"
                }
                if (ww_share.total.share > res_total) {
                    total_color = "red";
                    total_width = (242 / ww_share.total.share) * res_total;
                } else {
                    total_width = 242;
                    total_color = "green"
                }

                $(wndID + '.ww_ratio').get(0).innerHTML = "";
                $(wndID + '.ww_ratio').append(
                    '<legend>' + getTexts("labels", "leg") + ' (<span style="color:#090">' + (Math.round(wonder.ratio[AID] * 100) / 100) + '%</span>):</legend>' +
                    '<div class="town-capacity-indicator">' +
                    '<div class="icon all_res"></div>' +
                    '<div id="ww_town_capacity_stadium" class="tripple-progress-progressbar">' +
                    '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                    '<div class="progress overloaded">' +
                    '<div class="indicator3 ' + stage_color + '" style="width:' + stage_width + 'px"></div>' +
                    '<span class="ww_perc">' + Math.round(wonder.storage[AID][ww_type][stage] / ww_share.stage.share * 100) + '%</span>' +
                    '</div>' +
                    '<div class="amounts">' + getTexts("labels", "stg") + ': <span class="curr">' + pointNumber(wonder.storage[AID][ww_type][stage]) + '</span> / ' +
                    '<span class="max">' + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + '</span></div>' +
                    '</div></div>' +
                    '<div class="town-capacity-indicator">' +
                    '<div class="icon all_res"></div>' +
                    '<div id="ww_town_capacity_total" class="tripple-progress-progressbar">' +
                    '<div class="border_l"></div><div class="border_r"></div><div class="body"></div>' +
                    '<div class="progress overloaded">' +
                    '<div class="indicator3 ' + total_color + '" style="width:' + total_width + 'px;"></div>' +
                    '<span class="ww_perc">' + Math.round(res_total / ww_share.total.share * 100) + '%</span>' +
                    '</div>' +
                    '<div class="amounts">' + getTexts("labels", "tot") + ': <span class="curr">' + pointNumber(res_total) + '</span> / ' +
                    '<span class="max">' + pointNumber((Math.round(ww_share.total.share / 1000) * 1000)) + '</span></div>' +
                    '</div></div>');

                $(wndID + '.ww_ratio').tooltip(
                    "<table style='border-spacing:0px; text-align:right' cellpadding='5px'><tr>" +
                    "<td align='right' style='border-right: 1px solid;border-bottom: 1px solid'></td>" +
                    "<td style='border-right: 1px solid; border-bottom: 1px solid'><span class='bbcodes_player bold'>(" + (Math.round((wonder.ratio[AID]) * 100) / 100) + "%)</span></td>" +
                    "<td style='border-bottom: 1px solid'><span class='bbcodes_ally bold'>(100%)</span></td></tr>" +
                    "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getTexts("labels", "stg") + "&nbsp;" + stage + "</td>" +
                    "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.stage.share / 1000) * 1000) + "</td>" +
                    "<td>" + pointNumber(Math.round(ww_share.stage.sum / 1000) * 1000) + "</td></tr>" +
                    "<tr><td class='bold' style='border-right:1px solid;text-align:center'>" + getTexts("labels", "tot") + "</td>" +
                    "<td style='border-right: 1px solid'>" + pointNumber(Math.round(ww_share.total.share / 1000) * 1000) + "</td>" +
                    "<td>" + pointNumber(Math.round(ww_share.total.sum / 1000) * 1000) + "</td>" +
                    "</tr></table>");

            } catch (error) { errorHandling(error, "setResWW"); }
        }

    }

    /*******************************************************************************************************************************
     * Farming Village Overview
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Color change on possibility of city festivals
     * | ● farmingvillageshelper : Automatically hide the city. Quack function
     * ----------------------------------------------------------------------------------------------------------------------------
     * *****************************************************************************************************************************/

    /*******************************************************************************************************************************
     * Color change on possibility of city festivals
     *******************************************************************************************************************************/
    function changeResColor() {
        var res, res_min, i = 0;
        $('#fto_town_list .fto_resource_count :last-child').reverseList().each(function () {
            if ($(this).parent().hasClass("stone")) {
                res_min = 18000;
            } else {
                res_min = 15000;
            }
            res = parseInt(this.innerHTML, 10);
            if ((res >= res_min) && !($(this).hasClass("town_storage_full"))) {
                this.style.color = '#0A0';
            }
            if (res < res_min) {
                this.style.color = '#000';
            }
        });
    }

    /*******************************************************************************************************************************
     * ● farming villages helper
     *******************************************************************************************************************************/
    var farmingvillageshelper = {
        activate: function () {
        },
        rememberloot: function () {
            var activeFarmClass = $('#time_options_wrapper .active').attr('class').split(' ');
            var activeFarm = activeFarmClass[1];
        },
        setloot: function () {
            setTimeout(function () {
                $('#time_options_wrapper .' + activeFarm).click(); /*global activeFarm*/
            }, 500);
        },
        islandHeader: function () {
            $('#fto_town_list li').each(function (index) {
                if (this.classList.length == 2) {
                    $(this).addClass("dio_li_island");
                    $(this).append(
                        '<div class="dio_colordivider" style="background-image: url(' + Home_img + '13-4.jpg); display: block; height: 24px; margin: -4px -2px;"></div>' +
                        '<div class="checkbox_new checked disabled" style="position: absolute; right: 2px; top: 5px"><div class="cbx_icon"></div></div>'
                    );
                    $(this).find("span").css({
                        "margin-left": "2px"
                    });
                    $(this).find("a").css({
                        "color": "rgb(238, 221, 187)"
                    });
                }
            });
            $('.dio_colordivider').click(function () {
                var el = $(this).parent().nextUntil(".dio_li_island");
                if ($('#fto_town_list li:first[style*="border-right"]').length == 0) {
                    el.slideToggle();
                } else {
                    el.toggleClass("hidden");
                }
            });
            $('<style type="text/css">#fto_town_list li.active {background: rgba(208, 190, 151, 0.60)} .dio_autoHideCitiesOff {background-position: 0px -11px}</style>').appendTo('head');
        },
        indicateLoot: function () {
            var activeIsland = $('#fto_town_list li.active').prevAll(".dio_li_island").first();
            activeIsland.find("div.checkbox_new").removeClass("disabled");
            activeIsland.find("div.dio_colordivider").trigger("click");
        },
        switchTown: function (direction) {
            var el;
            if (direction === "up") {
                el = $('#fto_town_list li.active').prevAll("li:not(.dio_li_island):visible").first();
            } else {
                el = $('#fto_town_list li.active').nextAll("li:not(.dio_li_island):visible").first();
            }
            el.click();
            if (el.get(0)) {
                el.get(0).scrollIntoView();
                var scrollPosition = el.get(0).parentNode.scrollTop;
                var scrollMax = scrollPosition += 405;
                var scrollContainer = el.get(0).parentNode.scrollHeight;
                if (scrollMax != scrollContainer) {
                    el.get(0).parentNode.scrollTop -= 160;
                }
            }
        },
        deactivate: function () {
            $("#dio_toggleAutohide").addClass('dio_autoHideCitiesOff');
        },
    };

    /********************************************************************************************************************************
     * Conquest Info
     * -----------------------------------------------------------------------------------------------------------------------------
     * | ● Amount of supports und attacks in the conquest window
     * | ● Layout adjustment (for reasons of clarity)
     * | - TODO: conquest window of own cities
     * -----------------------------------------------------------------------------------------------------------------------------
     * ******************************************************************************************************************************/

    function countMovements() {
        var sup = 0, att = 0;
        $('.tab_content #unit_movements .support').each(function () {
            sup++;
        });
        $('.tab_content #unit_movements .attack_land, .tab_content #unit_movements .attack_sea, .tab_content #unit_movements .attack_takeover').each(function () {
            att++;
        });

        var str = "<div id='move_counter' style=''><div style='float:left;margin-right:5px;'></div>" +
            "<div class='movement def'></div>" +
            "<div class='movement' style='color:green;'> " + sup + "</div>" +
            "<div class='movement off'> </div>" +
            "<div style='color:red;'> " + att + "</div></div>" +
            "<hr class='move_hr'>";

        if ($('.gpwindow_content .tab_content .bold').get(0)) { $('.gpwindow_content .tab_content .bold').append(str); }
        else { $('.gpwindow_content h4:eq(1)').append(str); }

        $('<style id="dio_conquest"> ' +
            '.move_hr { margin:7px 0px 0px 0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
            // Smaller movements
            '#unit_movements { font-size: 0.80em; } ' +
            '#unit_movements .incoming { width:150px; height:45px; float:left; } ' +
            // Counter
            '#move_counter { position:relative; width:100px; margin-top:-16px; left: 40%; } ' +
            '#move_counter .movement { float:left; margin:0px 5px 0px 0px; height:23px; width:23px; position:relative; } ' +
            '#move_counter .def { background:url(https://gpzz.innogamescdn.com/images/game/autogenerated/olympus/sprite_images/olympus_temple_info_16afe3f.png) no-repeat -327px -289px; margin-top: -2px; } ' +
            '#move_counter .off { background:url(https://gpzz.innogamescdn.com/images/game/autogenerated/olympus/sprite_images/olympus_temple_info_16afe3f.png) no-repeat -303px -289px; margin-top: -2px; }' +
            '</style>').appendTo("head");
    }

    /*******************************************************************************************************************************
     * Town window
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● TownTabHandler (trade, attack, support,...)
     * | ● Sent units box
     * | ● Short duration: Display of 30% troop speed improvement in attack/support tab
     * | ● Trade options:
     * |    - Ressource marks on possibility of city festivals
     * |    - Percentual Trade: Trade button
     * |    - Recruiting Trade: Selection boxes (ressource ratio of unit type + share of the warehouse capacity of the target town)
     * | ● Town Trade Improvement : Click on it and it is only exchanged towards a festival. Quack function
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var arrival_interval = {};
    // TODO: Change both functions in MultipleWindowHandler()
    function TownTabHandler(action) {
        try {
            var wndArray, wndID, wndA, wnd;
            wndArray = uw.Layout.wnd.getOpen(uw.Layout.wnd.TYPE_TOWN);
            for (var e in wndArray) {
                if (wndArray.hasOwnProperty(e)) {
                    wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                    wnd = wndArray[e].getID();
                    if (!$(wndID).get(0)) {
                        wndID = "#gpwnd_" + (wndArray[e].getID() + 1) + " ";
                        wnd = wndArray[e].getID() + 1;
                    }
                    switch (action) {
                        case "trading":
                            if ($(wndID + '#trade_tab').get(0)) {
                                if (!$(wndID + '.dio_rec_trade').get(0) && DATA.options.dio_rec) {
                                    RecruitingTrade.add(wndID);
                                }
                                if (!$(wndID + '.dio_btn_trade').get(0) && DATA.options.dio_per) {
                                    addPercentTrade(wndID, false);
                                }
                            }
                            break;
                        case "info":
                            if (DATA.options.dio_BBt) {
                                BBtowninfo.towninfo(wnd);
                            }
                            break;
                        case "support":
                        case "attack":
                            if (DATA.options.dio_way && !($('.js-casted-powers-viewport .unit_movement_boost').get(0) || $(wndID + '.short_duration').get(0))) {
                                ShortDuration.add(wndID);
                            } else $("#dio_short_duration_stylee").remove();
                            if (DATA.options.dio_sen) {
                                SentUnits.add(wndID, action);
                            }
                            break;
                        case "rec_mark":
                            break;
                    }
                }
            }
        } catch (error) { errorHandling(error, "TownTabHandler"); }
    }

    function WWTradeHandler() {
        var wndArray, wndID, wndA;
        wndArray = uw.GPWindowMgr.getOpen(uw.GPWindowMgr.TYPE_WONDERS);
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if (DATA.options.dio_per && !($(wndID + '.dio_btn_trade').get(0) || $(wndID + '.next_building_phase').get(0) || $(wndID + '#ww_time_progressbar').get(0))) {
                    addPercentTrade(wndID, true);
                }
            }
        }
    }

    /*******************************************************************************************************************************
     * ● Sent units box
     *******************************************************************************************************************************/

    var SentUnits = {
        activate: function () {
            $.Observer(uw.GameEvents.command.send_unit).subscribe('DIO_SEND_UNITS', function (e, data) {
                for (var z in data.params) {
                    if (data.params.hasOwnProperty(z) && (data.sending_type !== "")) {
                        if (uw.GameData.units[z]) {
                            sentUnitsArray[data.sending_type][z] = (sentUnitsArray[data.sending_type][z] == undefined ? 0 : sentUnitsArray[data.sending_type][z]);
                            sentUnitsArray[data.sending_type][z] += data.params[z];
                        }
                    }
                }
            });

        },
        deactivate: function () {
            $.Observer(uw.GameEvents.command.send_unit).unsubscribe('DIO_SEND_UNITS');
            $('#dio_table_box').remove();
            $('#dio_table_box2').remove();
            $('#dio_table_box3').remove();
            $('#dio_table_box4').remove();
        },
        add: function (wndID, action) {

            $('<style id="dio_table_box">' +
                '.attack_support_window .send_units_form .button_wrapper { text-align:left; padding-left:70px; }' +
                //'#btn_attack_town { margin-left: 55px; } ' +
                '#gt_delete { display: none; }' +
                '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt { min-height: 50px;; } ' +
                '.attack_support_window .additional_info_wrapper .town_info_duration_pos { min-height: 62px!important; } ' +
                '</style>').appendTo(wndID + '.attack_support_window');

            if ((uw.ITowns.getTown(uw.Game.townId).researches().attributes.breach == true || uw.ITowns.getTown(uw.Game.townId).researches().attributes.stone_storm == true) & DATA.options.dio_sen) {
                $('<style id="dio_table_box3">' +
                    '.attack_support_window .send_units_form .attack_type_wrapper .attack_table_box { text-align:left;  transform:scale(0.94); margin: -5px 0px -5px -20px;}' +
                    '.attack_support_window .table_box .table_box_content .content_box { min-width:137px ; }' +
                    '</style>').appendTo(wndID + '.attack_support_window');
            } else {
                $('<style id="dio_table_box4">' +
                    '.attack_support_window .send_units_form .attack_type_wrapper .attack_table_box { text-align:left; transform:scale(1); margin: -8px 0px -2px 12px;}' +
                    '.attack_support_window .table_box .table_box_content .content_box { min-width:180px; }' +
                    '</style>').appendTo(wndID + '.attack_support_window');
            };
            if (!$(wndID + '.sent_units_box').get(0)) {
                $('<div id="dio_table_box2">' +
                    '<div class="game_inner_box sent_units_box ' + action + '"><div class="game_border ">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<div class="game_header bold">' +
                    '<div class="dio_icon b" style="opacity: 0.7;"></div>' +
                    '<div class="icon_sent townicon_' + (action == "attack" ? "lo" : "ld") + '"></div><span>' + getTexts("labels", "lab") + ' (' + (action == "attack" ? "OFF" : "DEF") + ')</span>' +
                    '</div>' +
                    '<div class="troops"><div class="units_list"></div><hr style="width: 172px;border: 1px solid rgb(185, 142, 93);margin: 3px 0px 2px -1px;">' +
                    '<div id="btn_sent_units_reset" class="button_new">' +
                    '<div class="left"></div>' +
                    '<div class="right"></div>' +
                    '<div class="caption js-caption">' + getTexts("buttons", "res") + '<div class="effect js-effect"></div></div>' +
                    '</div>' +
                    '</div></div></div>').appendTo(wndID + '.attack_support_window');

                SentUnits.update(action);

                $(wndID + '.icon_sent').css({
                    height: '20px',
                    marginTop: '-2px',
                    width: '20px',
                    backgroundPositionY: '-26px',
                    paddingLeft: '0px',
                    marginLeft: '0px'
                });

                $(wndID + '.sent_units_box').css({
                    position: 'absolute',
                    right: '0px',
                    bottom: '26px',
                    width: '192px'
                });
                $(wndID + '.troops').css({ padding: '6px 0px 6px 6px' });

                $(wndID + '#btn_sent_units_reset').click(() => {
                    // Overwrite old array
                    sentUnitsArray[action] = {};
                    SentUnits.update(action);
                });
            }
        },
        update: function (action) {
            try {
                // Remove old unit list
                $('.sent_units_box.' + action + ' .units_list').each(function () {
                    this.innerHTML = "";
                });
                // Add new unit list
                for (var x in sentUnitsArray[action]) {
                    if (sentUnitsArray[action].hasOwnProperty(x)) {
                        if ((sentUnitsArray[action][x] || 0) > 0) {
                            $('.sent_units_box.' + action + ' .units_list').each(function () {
                                $(this).append('<div class="unit_icon25x25 ' + x +
                                    (sentUnitsArray[action][x] >= 1000 ? (sentUnitsArray[action][x] >= 10000 ? " five_digit_number" : " four_digit_number") : "") + '">' +
                                    '<span class="count text_shadow">' + sentUnitsArray[action][x] + '</span>' +
                                    '</div>');
                            });
                        }
                    }
                }
                saveValue(WID + "_sentUnits", JSON.stringify(sentUnitsArray));
            } catch (error) { errorHandling(error, "updateSentUnitsBox"); }
        }
    };

    /*******************************************************************************************************************************
     * ● Short duration
     *******************************************************************************************************************************/
    var ShortDuration = {
        activate: function () {

            $('<style id="dio_short_duration_style">' +
                '.attack_support_window .dio_duration { border-spacing:0px; margin-bottom:2px; float: left; } ' +

                '.attack_support_window .way_icon { padding:30px 0px 0px 30px; background:transparent url(https://gpall.innogamescdn.com/images/game/towninfo/traveltime.png) no-repeat 0 0; } ' +
                '.attack_support_window .arrival_icon { padding:30px 0px 0px 30px; background:transparent url(https://gpall.innogamescdn.com/images/game/towninfo/arrival.png) no-repeat 0 0; } ' +

                '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt { min-height: 50px;; } ' +
                '.attack_support_window .additional_info_wrapper .town_info_duration_pos { min-height: 55px; } ' +
                '</style>').appendTo('head');
        },
        deactivate: function () {
            $("#dio_short_duration_style").remove();
            $("#dio_short_duration_stylee").remove();
            $("#dio_duration").remove();
        },
        add: function (wndID) {
            //console.log($(wndID + ".duration_container").get(0));
            try {
                var tooltip = (LANG.hasOwnProperty(LID) ? dio_icon + getTexts("labels", "improved_movement") : "") + " (+30% " + uw.DM.getl10n("barracks", "tooltips").speed.trim() + ")";

                $('<style id="dio_short_duration_stylee">' +
                    '.attack_support_window .additional_info_wrapper .nightbonus { margin-left: 10px; } ' +
                    '.attack_support_window .fight_bonus.morale {  margin-top: -23px !important; margin-left: 222px; } ' +
                    '.attack_support_window span.max_booty { width:5px !important; margin-left: 14px; } ' +

                    '.attack_support_window .way_duration, ' +
                    '.attack_support_window .arrival_time { padding:0px 0px 0px 0px; background:none; } ' +
                    '</style>').appendTo(wndID + '.attack_support_window');

                $('<table class="dio_duration">' +
                    '<tr><td class="way_icon"></td><td class="dio_way"></td><td class="arrival_icon"></td><td class="dio_arrival"></td><td colspan="2" class="dio_night"></td></tr>' +
                    '<tr class="short_duration_row" style="color:darkgreen">' +
                    '<td>&nbsp;╚&gt;&nbsp;</td><td><span class="short_duration">~0:00:00</span></td>' +
                    '<td>&nbsp;&nbsp;&nbsp;╚&gt;</td><td><span class="short_arrival">~00:00:00</span></td>' +
                    '<td class="short_icon"></td><td></td></tr>' +
                    '</table>').prependTo(wndID + ".duration_container");

                $(wndID + ".nightbonus").appendTo(wndID + ".dio_night");
                $(wndID + '.way_duration').appendTo(wndID + ".dio_way");
                $(wndID + ".arrival_time").appendTo(wndID + ".dio_arrival");

                // Tooltip
                $(wndID + '.short_duration_row').tooltip(tooltip);

                // Detection of changes
                ShortDuration.change(wndID);
                ShortDuration.calculate(wndID);

            } catch (error) { errorHandling(error, "addShortDuration"); }
        },
        change: function (wndID) {
            var duration = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0]) {
                        ShortDuration.calculate(wndID);
                    }
                });
            });
            if ($(wndID + '.way_duration').get(0)) {
                duration.observe($(wndID + '.way_duration').get(0), {
                    attributes: false,
                    childList: true,
                    characterData: false
                });
            }
        },
        calculate: function (wndID) {
            try {
                var setup_time = 900 / uw.Game.game_speed,
                    duration_time = $(wndID + '.duration_container .way_duration').get(0).innerHTML.replace("~", "").split(":"),
                    // TODO: hier tritt manchmal Fehler auf TypeError: Cannot read property "innerHTML" of undefined at calcShortDuration (<anonymous>:3073:86)
                    arrival_time,
                    h, m, s,
                    atalanta_factor = 0;

                var hasCartography = uw.ITowns.getTown(uw.Game.townId).getResearches().get("cartography");
                var hasMeteorology = uw.ITowns.getTown(uw.Game.townId).getResearches().get("meteorology");
                var hasSetSail = uw.ITowns.getTown(uw.Game.townId).getResearches().get("set_sail");

                var hasLighthouse = uw.ITowns.getTown(uw.Game.townId).buildings().get("lighthouse");
                // Atalanta aktiviert?
                if ($(wndID + '.unit_container.heroes_pickup .atalanta').get(0)) {
                    if ($(wndID + '.cbx_include_hero').hasClass("checked")) {
                        // Beschleunigung hängt vom Level ab, Level 1 = 11%, Level 20 = 30%
                        var atalanta_level = uw.MM.getCollections().PlayerHero[0].models[1].get("level");
                        atalanta_factor = (atalanta_level + 10) / 100;
                    }
                }

                // Sekunden, Minuten und Stunden zusammenrechnen (-> in Sekunden)
                duration_time = ((parseInt(duration_time[0], 10) * 60 + parseInt(duration_time[1], 10)) * 60 + parseInt(duration_time[2], 10));

                // Verkürzte Laufzeit berechnen
                duration_time = ((duration_time - setup_time) * (1 + atalanta_factor)) / (1 + 0.3 + atalanta_factor) + setup_time;


                h = Math.floor(duration_time / 3600);
                m = Math.floor((duration_time - h * 3600) / 60);
                s = Math.floor(duration_time - h * 3600 - m * 60);

                if (m < 10) { m = "0" + m; }
                if (s < 10) { s = "0" + s; }

                $(wndID + '.short_duration').get(0).innerHTML = "~" + h + ":" + m + ":" + s;

                // Ankunftszeit errechnen
                arrival_time = Math.round((Timestamp.server() + uw.Game.server_gmt_offset)) + duration_time;

                h = Math.floor(arrival_time / 3600);
                m = Math.floor((arrival_time - h * 3600) / 60);
                s = Math.floor(arrival_time - h * 3600 - m * 60);

                h %= 24;

                if (m < 10) { m = "0" + m; }
                if (s < 10) { s = "0" + s; }

                $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;

                clearInterval(arrival_interval[wndID]);

                arrival_interval[wndID] = setInterval(function () {
                    arrival_time += 1;

                    h = Math.floor(arrival_time / 3600);
                    m = Math.floor((arrival_time - h * 3600) / 60);
                    s = Math.floor(arrival_time - h * 3600 - m * 60);

                    h %= 24;

                    if (m < 10) { m = "0" + m; }
                    if (s < 10) { s = "0" + s; }

                    if ($(wndID + '.short_arrival').get(0)) {
                        $(wndID + '.short_arrival').get(0).innerHTML = "~" + h + ":" + m + ":" + s;
                    } else {
                        clearInterval(arrival_interval[wndID]);
                    }
                }, 1000);

            } catch (error) { errorHandling(error, "ShortDuration.calculate"); }
        }
    };

    /*******************************************************************************************************************************
     * ● Dropdown menu
     *******************************************************************************************************************************/

    // TODO: Umstellen!
    // Preload images for drop down arrow buttons
    var drop_over = new Image();
    drop_over.src = Home_img + "drop-over.png";
    var drop_out = new Image();
    drop_out.src = Home_img + "drop-out.png";

    function changeDropDownButton() {
        $('<style id="dio_style_arrow" type="text/css">' +
            '#dd_filter_type .arrow, .select_rec_unit .arrow, .dropdown.default .arrow {' +
            'width: 18px !important; height: 17px !important; background: url("' + Home_img + 'drop-out.png") no-repeat 0px -1px !important;' +
            'position: absolute; top: 2px !important; right: 3px; } ' +
            '</style>').appendTo('head');

    }

    /*******************************************************************************************************************************
     * ● Recruiting Trade
     * *****************************************************************************************************************************/
    var trade_count = 0, unit = "FS", percent = "0.0"; // Recruiting Trade

    // TODO: Funktion umformen, Style anpassen!
    var RecruitingTrade = {
        activate: function () {
            $('<style id="dio_style_recruiting_trade" type="text/css">' +
                '#dio_recruiting_trade .option_s { filter:grayscale(85%); -webkit-filter:grayscale(85%); margin:0px; cursor:pointer; } ' +
                '#dio_recruiting_trade .option_s:hover { filter:unset !important; -webkit-filter:unset !important; } ' +
                '#dio_recruiting_trade .select_rec_unit .sel { filter:sepia(100%); -webkit-filter:sepia(100%); } ' +

                '#dio_recruiting_trade .option {color:#000; background:#FFEEC7; } ' +
                '#dio_recruiting_trade .option:hover {color:#fff; background:#328BF1; } ' +

                '#dio_recruiting_trade { position:absolute; left:30px; top:70px; z-index: 200px; } ' +
                '#dio_recruiting_trade .select_rec_unit { position:absolute; top:20px; width:147px; display:none; left:-31px; } ' +
                '#dio_recruiting_trade .select_rec_perc { position:absolute; top:20px; width:50px; display:none; left:50px; } ' +

                '#dio_recruiting_trade .open { display:block !important; } ' +

                '#dio_recruiting_trade .item-list { max-height:237px; } ' +

                '#dio_recruiting_trade .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +

                '#trade_tab .content { height:320px;  } ' +

                '#dio_recruiting_trade .dio_drop_rec_unit { position:absolute; display:block; width:50px; overflow:visible; } ' +
                '#dio_recruiting_trade .dio_drop_rec_perc { position:absolute; display:block; width:55px; left:49px; color:#000; } ' +

                '</style>').appendTo('head');
        },
        deactivate: function () {
            $('#dio_style_recruiting_trade').remove();
            $('#dio_recruiting_trade').remove();
        },
        add: function (wndID) {
            var max_amount;

            $('<div id="dio_recruiting_trade" class="dio_rec_trade">' +
                // DropDown-Button for unit
                '<div class="dio_drop_rec_unit dropdown default">' +
                '<div class="border-left"></div>' +
                '<div class="border-right"></div>' +
                '<div class="caption" name="' + unit + '">' + unit + '</div>' +
                '<div class="arrow"></div>' +
                '</div>' +
                '<div class="dio_drop_rec_perc dropdown default">' +
                // DropDown-Button for ratio
                '<div class="border-left"></div>' +
                '<div class="border-right"></div>' +
                '<div class="caption" name="' + percent + '">' + Math.round(percent * 100) + '%</div>' +
                '<div class="arrow"></div>' +
                '</div><span class="dio_rec_count">(' + trade_count + ')</span></div>').appendTo(wndID + ".content"); //<span class="dio_rec_count">(' + trade_count + ')</span></div>

            $(".dio_cultureB").css({
                "cursor": "pointer",
                "width": "25px",
                "height": "27px",
                "float": "right",
                "position": "relative",
                "margin-left": "3px",
                "border": "2px groove gray",
                "background": "url(https://gpfr.innogamescdn.com/images/game/overviews/celebration_bg_new.png)"
            });

            // Select boxes for unit and ratio
            $('<div id="dio_Select_boxes" class="select_rec_unit dropdown-list default active">' +
                '<div class="item-list">' +
                //Ship
                '<div id="dioattack_ship" class="option_s unit index_unit unit_icon40x40 attack_ship" 		name="FS"></div>' +			// Light ship
                '<div id="diobireme"		class="option_s unit index_unit unit_icon40x40 bireme" 			name="BI"></div>' +			// Bireme
                '<div id="diotrireme" 	class="option_s unit index_unit unit_icon40x40 trireme" 			name="TR"></div>' +			// Trireme
                '<div id="diotransporter" class="option_s unit index_unit unit_icon40x40 big_transporter" 	name="BT"></div>' +			// Transport boat
                '<div id="diosmall_trans" class="option_s unit index_unit unit_icon40x40 small_transporter" name="BE"></div>' +			// Fast transport ship
                '<div id="diocolonize" 	class="option_s unit index_unit unit_icon40x40 colonize_ship" 		name="CE"></div>' +			// Colony ship
                '<div id="diodemolition" 	class="option_s unit index_unit unit_icon40x40 demolition_ship" name="DS"></div>' +			// Fire ship
                //Troop
                '<div id="diosword" 		class="option_s unit index_unit unit_icon40x40 sword" 			name="SK"></div>' +			// Swordsman
                '<div id="dioslinger" 	class="option_s unit index_unit unit_icon40x40 slinger" 			name="SL"></div>' +			// Slinger
                '<div id="dioarcher" 		class="option_s unit index_unit unit_icon40x40 archer" 			name="BS"></div>' +			// Archer
                '<div id="diohoplite" 	class="option_s unit index_unit unit_icon40x40 hoplite" 			name="HO"></div>' +			// Hoplite
                '<div id="diorider" 		class="option_s unit index_unit unit_icon40x40 rider" 			name="RE"></div>' +			// Horseman
                '<div id="diochariot" 	class="option_s unit index_unit unit_icon40x40 chariot" 			name="SW"></div>' +			// Chariot
                '<div id="diocatapult" 	class="option_s unit index_unit unit_icon40x40 catapult" 			name="CA"></div>' +			// catapult
                //Fly
                '<div id="diocentaur" 	class="option_s unit index_unit unit_icon40x40 centaur" 			name="CT"></div>' +			// Centaur
                '<div id="diocerberus" 	class="option_s unit index_unit unit_icon40x40 cerberus" 			name="CB"></div>' +			// Cerberus
                '<div id="diozyklop" 		class="option_s unit index_unit unit_icon40x40 zyklop" 			name="CL"></div>' +			// Cyclop
                '<div id="diofury" 		class="option_s unit index_unit unit_icon40x40 fury" 				name="EY"></div>' +			// Erinys
                '<div id="diomedusa" 		class="option_s unit index_unit unit_icon40x40 medusa" 			name="MD"></div>' +			// Medusa
                '<div id="diominotaur" 	class="option_s unit index_unit unit_icon40x40 minotaur" 			name="MT"></div>' +			// Minotaur
                '<div id="diosea_monster" class="option_s unit index_unit unit_icon40x40 sea_monster" 		name="HD"></div>' +			// Hydra
                '<div id="dioharpy" 		class="option_s unit index_unit unit_icon40x40 harpy" 			name="HP"></div>' +			// Harpy
                '<div id="diomanticore" 	class="option_s unit index_unit unit_icon40x40 manticore" 		name="MN"></div>' +			// Manticore
                '<div id="diopegasus" 	class="option_s unit index_unit unit_icon40x40 pegasus" 			name="PG"></div>' +			// Pegasus
                '<div id="diogriffin" 	class="option_s unit index_unit unit_icon40x40 griffin" 			name="GF"></div>' +			// Griffin
                '<div id="diocalydonian" 	class="option_s unit index_unit unit_icon40x40 calydonian_boar" name="CY"></div>' +			// Calydonian boar
                ((uw.Game.gods_active.aphrodite) ? (
                    '<div id="diosiren" 	class="option_s unit index_unit unit_icon40x40 siren" 			name="SE"></div>' +			// Siren
                    '<div id="diosatyr" 	class="option_s unit index_unit unit_icon40x40 satyr" 			name="ST"></div>') : "") +	// Satyr
                ((uw.Game.gods_active.ares) ? (
                    '<div id="dioladon" 	class="option_s unit index_unit unit_icon40x40 ladon" 			name="LD"></div>' +			// Ladon
                    '<div id="diospartoi" 	class="option_s unit index_unit unit_icon40x40 spartoi" 		name="SR"></div>') : "") +	// Spartoi
                //Other
                '<div id="diowall" 		class="option_s unit index_unit place_image wall_level" 			name="WA"></div>' +			// City wall Lv 5
                '<div id="diowall2" 		class="option_s unit index_unit place_image wall_level" 		name="WA2"></div>' +		// City wall Lv 15
                '<div id="diofestivals" 	class="option_s unit index_unit place_image morale" 			name="FE"></div>' +			// City festival
                '</div></div>').appendTo(wndID + ".dio_rec_trade");

            $('<div class="select_rec_perc dropdown-list default inactive">' +
                '<div class="item-list">' +
                '<div class="option sel" name="0.0">&nbsp;&nbsp;0%</div>' +
                '<div class="option" name="0.01">&nbsp;&nbsp;1%</div>' +
                '<div class="option" name="0.02">&nbsp;&nbsp;2%</div>' +
                '<div class="option" name="0.04">&nbsp;&nbsp;4%</div>' +
                '<div class="option" name="0.05">&nbsp;&nbsp;5%</div>' +
                '<div class="option" name="0.06">&nbsp;&nbsp;6%</div>' +
                '<div class="option" name="0.08">&nbsp;&nbsp;8%</div>' +
                '<div class="option" name="0.10">10%</div>' +
                '<div class="option" name="0.14">14%</div>' +
                '<div class="option" name="0.17">17%</div>' +
                '<div class="option" name="0.20">20%</div>' +
                '<div class="option" name="0.25">25%</div>' +
                '<div class="option" name="0.33">33%</div>' +
                '<div class="option" name="0.50">50%</div>' +
                '</div></div>').appendTo(wndID + ".dio_rec_trade");

            $(wndID + ".dio_rec_trade [name='" + unit + "']").toggleClass("sel");

            // click events of the drop menu
            $(wndID + ' .select_rec_unit .option_s').each(function () {
                $(this).click(function (e) {
                    $(".select_rec_unit .sel").toggleClass("sel");
                    $("." + this.className.split(" ")[4]).toggleClass("sel");

                    unit = $(this).attr("name");
                    $('.dio_drop_rec_unit .caption').attr("name", unit);
                    $('.dio_drop_rec_unit .caption').each(function () {
                        this.innerHTML = unit;
                    });
                    $($(this).parent().parent().get(0)).removeClass("open");
                    $('.dio_drop_rec_unit .caption').change();
                });
            });
            $(wndID + ' .select_rec_perc .option').each(function () {
                $(this).click(function (e) {
                    $(this).parent().find(".sel").toggleClass("sel");
                    $(this).toggleClass("sel");

                    percent = $(this).attr("name");
                    $('.dio_drop_rec_perc .caption').attr("name", percent);
                    $('.dio_drop_rec_perc .caption').each(function () {
                        this.innerHTML = Math.round(percent * 100) + "%";
                    });
                    $($(this).parent().parent().get(0)).removeClass("open")
                    $('.dio_drop_rec_perc .caption').change();
                });
            });

            // show & hide drop menus on click
            $(wndID + '.dio_drop_rec_perc').click(function (e) {

                if (!$($(e.target)[0].parentNode.parentNode.childNodes[4]).hasClass("open")) {
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).addClass("open");
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).removeClass("open");
                } else {
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).removeClass("open");
                }
            });
            $(wndID + '.dio_drop_rec_unit').click(function (e) {

                if (!$($(e.target)[0].parentNode.parentNode.childNodes[3]).hasClass("open")) {
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).addClass("open");
                    $($(e.target)[0].parentNode.parentNode.childNodes[4]).removeClass("open");
                } else {
                    $($(e.target)[0].parentNode.parentNode.childNodes[3]).removeClass("open");
                }
            });

            $(wndID).click(function (e) {
                var clicked = $(e.target), element = $('#' + this.id + ' .dropdown-list.open').get(0);
                if ((clicked[0].parentNode.className.split(" ")[1] !== "dropdown") && element) {
                    $(element).removeClass("open");
                }
            });

            // hover arrow change
            $(wndID + '.dropdown').hover(function (e) {
                $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_over.src + "') no-repeat -1px -1px";
            }, function (e) {
                $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_out.src + "') no-repeat -1px -1px";
            });

            $(wndID + ".dio_drop_rec_unit .caption").attr("name", unit);
            $(wndID + ".dio_drop_rec_perc .caption").attr("name", percent);

            $(wndID + '.dio_drop_rec_unit').tooltip(dio_icon + getTexts("labels", "rat"));
            $(wndID + '.dio_drop_rec_perc').tooltip(dio_icon + getTexts("labels", "shr"));

            var res = RecruitingTrade.resources;
            var ratio = {
                //MO: RecruitingTrade.addd(""),
                //Ship
                FS: res("attack_ship"),		// Light ship
                BI: res("bireme"),			// Bireme
                TR: res("trireme"),			// Trireme
                BT: res("big_transporter"),	// Transport boat
                BE: res("small_transporter"),// Fast transport ship
                CE: res("colonize_ship"),	// Colony ship
                DS: res("demolition_ship"),	// Fire ship
                //Troop
                SK: res("sword"),			// Swordsman
                SL: res("slinger"),			// Slinger
                BS: res("archer"),			// Archer
                HO: res("hoplite"),			// Hoplite
                RE: res("rider"),			// Horseman
                SW: res("chariot"),			// Chariot
                CA: res("catapult"),		// Catapult
                //Fly
                CT: res("centaur"),			// Centaur
                CB: res("cerberus"),		// Cerberus
                CL: res("zyklop"),			// Cyclop
                EY: res("fury"),			// Erinys
                MD: res("medusa"),			// Medusa
                MT: res("minotaur"),		// Minotaur
                HD: res("sea_monster"),		// Hydra
                HP: res("harpy"),			// Harpy
                MN: res("manticore"),		// Manticore
                PG: res("pegasus"),			// Pegasus
                GF: res("griffin"),			// Griffin
                SE: res("siren"),			// Siren
                ST: res("satyr"),			// Satyr
                LD: res("ladon"),			// Ladon
                SR: res("spartoi"),			// Spartoi
                CY: res("calydonian_boar"),	// Calydonian boar
                //Other
                WA: { w: 0.2286, s: 1, i: 0.6714 },	 // City wall Lv 5
                WA2: { w: 0.0762, s: 1, i: 0.7491 }, // City wall Lv 15
                FE: { w: 0.8333, s: 1, i: 0.8333 },	 // City festival
            };


            if ($('#town_capacity_wood .max').get(0)) { max_amount = parseInt($('#town_capacity_wood .max').get(0).innerHTML, 10); }
            else { max_amount = 25500; }

            $(wndID + '.caption').change(function (e) {
                if (!(($(this).attr('name') === unit) || ($(this).attr('name') === percent))) { $('.dio_rec_count').get(0).innerHTML = "(" + trade_count + ")"; }

                var tmp = $(this).attr('name');

                if ($(this).parent().attr('class').split(" ")[0] === "dio_drop_rec_unit") { unit = tmp; }
                else { percent = tmp; }

                var max = (max_amount - 100) / 1000;
                addTradeMarks(max * ratio[unit].w, max * ratio[unit].s, max * ratio[unit].i, "lime");

                var part = (max_amount - 1000) * parseFloat(percent); // -1000 als Puffer (sonst Überlauf wegen Restressies, die nicht eingesetzt werden können, vorallem bei FS und Biremen)
                var rArray = uw.ITowns.getTown(uw.Game.townId).getCurrentResources();
                var tradeCapacity = uw.ITowns.getTown(uw.Game.townId).getAvailableTradeCapacity();

                var wood = ratio[unit].w * part;
                var stone = ratio[unit].s * part;
                var iron = ratio[unit].i * part;

                if ((wood > rArray.wood) || (stone > rArray.stone) || (iron > rArray.iron) || ((wood + stone + iron) > tradeCapacity)) {
                    wood = stone = iron = 0;
                    $('.dio_drop_rec_perc .caption').css({ color: '#f00' });
                } else {
                    $('.' + e.target.parentNode.parentNode.className + ' .dio_drop_rec_perc .caption').css({ color: '#000' });
                }
                $("#trade_type_wood [type='text']").select().val(wood).blur();
                $("#trade_type_stone [type='text']").select().val(stone).blur();
                $("#trade_type_iron [type='text']").select().val(iron).blur();
            });

            $('#trade_button').click(() => {
                trade_count++;
                $('.dio_rec_count').get(0).innerHTML = "(" + trade_count + ")";
            });

            $(wndID + '.dio_drop_rec_perc .caption').change();

            // Tooltip \\
            var units = uw.GameData.units;
            //Ship
            $('#dioattack_ship').tooltip(units.attack_ship.name);
            $('#diobireme').tooltip(units.bireme.name);
            $('#diotrireme').tooltip(units.trireme.name);
            $('#diotransporter').tooltip(units.big_transporter.name);
            $('#diosmall_trans').tooltip(units.small_transporter.name);
            $('#diocolonize').tooltip(units.colonize_ship.name);
            $('#diodemolition').tooltip(units.demolition_ship.name);
            $('#diosword').tooltip(units.sword.name);
            //Troop
            $('#dioslinger').tooltip(units.slinger.name);
            $('#dioarcher').tooltip(units.archer.name);
            $('#diohoplite').tooltip(units.hoplite.name);
            $('#diorider').tooltip(units.rider.name);
            $('#diochariot').tooltip(units.chariot.name);
            $('#diocatapult').tooltip(units.catapult.name);
            //Fly
            $('#diocentaur').tooltip(units.centaur.name);
            $('#diocerberus').tooltip(units.cerberus.name);
            $('#diozyklop').tooltip(units.zyklop.name);
            $('#diofury').tooltip(units.fury.name);
            $('#diomedusa').tooltip(units.medusa.name);
            $('#diominotaur').tooltip(units.minotaur.name);
            $('#diosea_monster').tooltip(units.sea_monster.name);
            $('#dioharpy').tooltip(units.harpy.name);
            $('#diomanticore').tooltip(units.manticore.name);
            $('#diopegasus').tooltip(units.pegasus.name);
            $('#diogriffin').tooltip(units.griffin.name);
            $('#diocalydonian').tooltip(units.calydonian_boar.name);
            $('#diospartoi').tooltip(units.spartoi.name);
            $('#diosatyr').tooltip(units.satyr.name);
            $('#dioladon').tooltip(units.ladon.name);
            $('#diosiren').tooltip(units.siren.name);
            //Other
            $('#diowall').tooltip(uw.GameData.buildings.wall.name + " Lv 5");
            $('#diowall2').tooltip(uw.GameData.buildings.wall.name + " Lv 15");
            $('#diofestivals').tooltip(getTexts("Quack", "cityfestivals"));
        },
        resources: function (res) {
            let w, s, i, a;
            a = uw.GameData.units[res].resources;
            w = a.wood; s = a.stone; i = a.iron;
            a = Math.max(w, s, i);
            w = w / a; s = s / a; i = i / a;
            return ({ w: w, s: s, i: i });
        },
    };

    /*******************************************************************************************************************************
     * ● Ressources marks
     *******************************************************************************************************************************/
    function addTradeMarks(woodmark, stonemark, ironmark, color) {
        var max_amount, limit, wndArray = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_TOWN), wndID;
        for (var e in wndArray) {
            if (wndArray.hasOwnProperty(e)) {
                wndID = "#gpwnd_" + wndArray[e].getID() + " ";
                if ($(wndID + '.town-capacity-indicator').get(0)) {

                    max_amount = $(wndID + '.amounts .max').get(0).innerHTML;

                    $('#trade_tab .c_' + color).each(function () {
                        this.remove();
                    });
                    $('#trade_tab .progress').each(function () {
                        if ($("p", this).length < 3) {
                            if ($(this).parent().get(0).id != "big_progressbar") {
                                limit = 1000 * (242 / parseInt(max_amount, 10));

                                switch ($(this).parent().get(0).id.split("_")[2]) {
                                    case "wood":
                                        limit = limit * woodmark;
                                        break;
                                    case "stone":
                                        limit = limit * stonemark;
                                        break;
                                    case "iron":
                                        limit = limit * ironmark;
                                        break;
                                }
                                $('<p class="c_' + color + '"style="position:absolute;left: ' + limit + 'px; background:' + color + ';width:2px;height:100%;margin:0px"></p>').appendTo(this);
                            }
                        }
                    });
                }
            }
        }
    }

    /*******************************************************************************************************************************
     * ● Percentual Trade
     *******************************************************************************************************************************/
    var rest_count = 0;

    function addPercentTrade(wndID, ww) {

        var a, b = "";
        var content = wndID + ".content .btn_trade_button.button_new";
        if (ww) {
            a = "ww_"; b = "_ww";
            content = wndID + '.trade .send_res .button.send_resources_btn';
        }

        $(content).after('<div id="dio_Percentual_trade' + b + '" class="btn dio_btn_trade"><a class="button">' +
            '<span class="left"><span class="right">' +
            '<span class="middle mid">' +
            '<span class="img_trade"></span></span></span></span>' +
            '<span style="clear:both;"></span>' +
            '</a></div>');

        $(wndID + '.dio_btn_trade').tooltip(dio_icon + getTexts("labels", "per"));

        setPercentTrade(wndID, ww);

        // Style
        $('div.wonder_res_container fieldset.send_res .button').css({ "margin-top": "0px" });
        $('#trade_tab #duration_container').css({ "margin-bottom": "-15px" });
        $(wndID + '.dio_btn_trade').css({
            "position": "relative",
            "top": "13px",
            "display": "inline",
            "margin-left": "10px"
        });

        $(wndID + '.mid').css({ minWidth: '26px' });

        $(wndID + '.img_trade').css({
            width: '27px',
            height: '27px',
            top: '-3px',
            float: 'left',
            position: 'relative',
            background: 'url("' + Home_img + 'echange.png") no-repeat'
        });
    }

    var res = {};

    function setPercentTrade(wndID, ww) {
        try {
            var a = ww ? "ww_" : "", own_town = $(wndID + '.town_info').get(0) ? true : false;

            $(wndID + '.dio_btn_trade').toggleClick(function () {
                res.wood = {};
                res.stone = {};
                res.iron = {};
                res.sum = {};

                res.sum.amount = 0;
                // Set amount of resources to 0
                setAmount(true, a, wndID);
                // Total amount of resources // TODO: ITowns.getTown(Game.townId).getCurrentResources(); ?
                for (var e in res) {
                    if (res.hasOwnProperty(e) && e != "sum") {
                        res[e].rest = false;
                        res[e].amount = parseInt($('.ui_resources_bar .' + e + ' .amount').get(0).innerHTML, 10);
                        res.sum.amount += res[e].amount;
                    }
                }
                // Percentage of total resources
                res.wood.percent = 100 / res.sum.amount * res.wood.amount;
                res.stone.percent = 100 / res.sum.amount * res.stone.amount;
                res.iron.percent = 100 / res.sum.amount * res.iron.amount;

                // Total trading capacity
                res.sum.cur = parseInt($(wndID + '#' + a + 'big_progressbar .caption .curr').get(0).innerHTML, 10);

                // Amount of resources on the percentage of trading capacity (%)
                res.wood.part = parseInt(res.sum.cur / 100 * res.wood.percent, 10);
                res.stone.part = parseInt(res.sum.cur / 100 * res.stone.percent, 10);
                res.iron.part = parseInt(res.sum.cur / 100 * res.iron.percent, 10);

                // Get rest warehouse capacity of each resource type
                for (var f in res) {
                    if (res.hasOwnProperty(f) && f != "sum") {
                        if (!ww && own_town) { // Own town
                            var curr = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                                curr2 = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .curr2').get(0).innerHTML.replace('+', '').trim(), 10) || 0,
                                max = parseInt($(wndID + '#town_capacity_' + f + ' .amounts .max').get(0).innerHTML.replace('+', '').trim(), 10) || 0;

                            res[f].cur = curr + curr2;
                            res[f].max = max - res[f].cur;

                            if (res[f].max < 0) { res[f].max = 0; }

                        } else { // World wonder or foreign town
                            res[f].max = 30000;
                        }
                    }
                }
                // Rest of fraction (0-2 units) add to stone amount
                res.stone.part += res.sum.cur - (res.wood.part + res.stone.part + res.iron.part);

                res.sum.rest = 0;
                rest_count = 0;
                calcRestAmount();
                setAmount(false, a, wndID);
            }, function () {
                setAmount(true, a, wndID);
            });
        } catch (error) { errorHandling(error, "setPercentTrade"); }
    }

    function calcRestAmount() {
        // Subdivide rest
        if (res.sum.rest > 0) {
            for (var e in res) {
                if (res.hasOwnProperty(e) && e != "sum" && res[e].rest != true) {
                    res[e].part += res.sum.rest / (3 - rest_count);
                }
            }
            res.sum.rest = 0;
        }
        // Calculate new rest
        for (var f in res) {
            if (res.hasOwnProperty(f) && f != "sum" && res[f].rest != true) {
                if (res[f].max <= res[f].part) {
                    res[f].rest = true;
                    res.sum.rest += res[f].part - res[f].max;
                    rest_count += 1;
                    res[f].part = res[f].max;
                }
            }
        }
        // Recursion
        if (res.sum.rest > 0 && rest_count < 3) {
            calcRestAmount();
        }
    }

    function setAmount(clear, a, wndID) {
        for (var e in res) {
            if (res.hasOwnProperty(e) && e != "sum") {
                if (clear == true) {
                    res[e].part = 0;
                }
                $(wndID + "#" + a + "trade_type_" + e + ' [type="text"]').select().val(res[e].part).blur();
            }
        }
    }

    /*******************************************************************************************************************************
     * ● Town Trade Improvement : Click on it and it is only exchanged towards a festival. Quack function
     *******************************************************************************************************************************/

    var townTradeImprovement = {
        activate: function () {
        },
        add: function () {
            try {
                if (dio.wnd.find(".dio_needed").length > 0 || dio.wnd.find(".town-capacity-indicator").length == 0);
                else {
                    function getRes(res_type, wnd_id, mode) {
                        var res = {};
                        res.wnd = $("DIV#gpwnd_" + wnd_id);
                        res.selector = res.wnd.find("#town_capacity_" + res_type);
                        res.caption = {
                            curr: parseInt(res.wnd.find("#big_progressbar .caption .curr").html()),
                            max: parseInt(res.wnd.find("#big_progressbar .caption .max").html()),
                            now: parseInt(res.wnd.find("#trade_type_" + res_type + " input").val())
                        }
                        res.amounts = {
                            curr: parseInt(res.selector.find(".curr").html()) || 0,
                            curr2: parseInt(res.selector.find(".curr2").html().substring(3)) || 0,
                            curr3: parseInt(res.selector.find(".curr3").html().substring(3)) || 0,
                            max: parseInt(res.selector.find(".max").html()) || 0
                        }
                        if (mode === "cult" || mode === "cultreverse") {
                            res.amounts.max = (res_type === "stone") ? 18000 : 15000;
                        }
                        if (mode === "cultreverse") {
                            var townrescurrent = $("div#ui_box div.ui_resources_bar div.indicator[data-type='" + res_type + "'] div.amount").text();
                            res.needed = townrescurrent - res.amounts.max;
                        } else {
                            res.needed = res.amounts.max - res.amounts.curr - res.amounts.curr2;
                        }
                        return res;
                    }

                    dio.wnd.find(".tripple-progress-progressbar").each(function () {
                        var res_type = this.id.split("_")[2];
                        var res = getRes(res_type, dio.wndId);
                        $(this).find(".amounts").append('<span class="dio_needed_' + res_type + '_' + dio.wndId + '"> &#9658; ' + res.needed + '</span>');
                    });

                    dio.wnd.find("#trade_tab").append(
                        '<div id="dio_Improvement_trade">' +
                        '<a id="dio_wood_' + dio.wndId + '_max" 	class="dio_trade dio_max" 		style="top:200px"></a>' +
                        '<a id="dio_stone_' + dio.wndId + '_max" 	class="dio_trade dio_max" 		style="top:234px"></a>' +
                        '<a id="dio_iron_' + dio.wndId + '_max" 	class="dio_trade dio_max" 		style="top:268px"></a>' +
                        '<a id="dio_wood_' + dio.wndId + '_cult" 	class="dio_trade dio_send_cult" style="top:200px"></a>' +
                        '<a id="dio_stone_' + dio.wndId + '_cult" 	class="dio_trade dio_send_cult" style="top:234px"></a>' +
                        '<a id="dio_iron_' + dio.wndId + '_cult" 	class="dio_trade dio_send_cult" style="top:268px"></a>' +
                        /*'<a id="dio_wood_'+dio.wndId+'_cultreverse" 	class="dio_trade dio_send_cult_reverse" style="top:200px"></a>' +
                        '<a id="dio_stone_'+dio.wndId+'_cultreverse" 	class="dio_trade dio_send_cult_reverse" style="top:234px"></a>' +
                        '<a id="dio_iron_'+dio.wndId+'_cultreverse" 	class="dio_trade dio_send_cult_reverse" style="top:268px"></a>'*/'</div>'
                    );

                    dio.wnd.find(".dio_send_cult").css({
                        "right": "84px",
                        "position": "absolute",
                        "height": "16px",
                        "width": "22px",
                        "background-image": "url(" + Home_img + "trade-cult.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "0px -1px"
                    });
                    dio.wnd.find(".dio_send_cult_reverse").css({
                        "left": "105px",
                        "position": "absolute",
                        "height": "16px",
                        "width": "22px",
                        "background-image": "url(" + Home_img + "trade-cultr.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "0px -1px"
                    });
                    dio.wnd.find(".dio_max").css({
                        "right": "105px",
                        "position": "absolute",
                        "height": "16px",
                        "width": "22px",
                        "background-image": "url(" + Home_img + "trade-arrow.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "0px -1px"
                    });

                    dio.wnd.find(".dio_trade").hover(
                        function () { $(this).css({ "background-position": "0px -17px" }); },
                        function () { $(this).css({ "background-position": "0px -1px" }); }
                    );

                    dio.wnd.find(".dio_trade").click(function () {
                        var id = this.id.split("_");
                        var res = getRes(id[1], id[2], id[3]);
                        if (res.needed - res.amounts.curr3 <= 0 || res.caption.curr <= 0 || res.amounts.curr3 > 0) {
                            res.send = 0;
                        } else if (res.needed - res.amounts.curr3 > res.caption.curr) {
                            res.send = res.caption.curr + res.amounts.curr3
                        } else {
                            res.send = res.needed;
                        }
                        res.wnd.find("#trade_type_" + id[1] + " input").val(res.send).select().blur();
                    });

                    // Tooltip
                    $('.dio_max').tooltip(dio_icon + "max");
                    $('.dio_send_cult').tooltip(dio_icon + getTexts("Quack", "cityfestivals"));
                    //$('.dio_send_cult_reverse').tooltip(getTexts("Quack", "delete"));
                }
            } catch (error) { errorHandling(error, "townTradeImprovement"); }
        },
        deactivate: function () {
            $('#dio_Improvement_trade').remove();
        },
    };

    /********************************************************************************************************************************
     * Unit strength (blunt/sharp/distance) and Transport Capacity
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Unit strength: Menu
     * |	- Switching of def/off display with buttons
     * |	- Possible Selection of certain unit types
     * | ● Unit strength: Conquest
     * | ● Unit strength: Barracks
     * | ● Transport capacity: Menu
     * |	- Switching of transporter speed (+/- big transporter)
     * ----------------------------------------------------------------------------------------------------------------------------
     * ******************************************************************************************************************************/

    var def = true, blunt = 0, sharp = 0, dist = 0, shipsize = false;

    var UnitStrength = {
        // Calculate defensive strength
        calcDef: (units) => {
            var e;
            blunt = sharp = dist = 0;
            for (e in units) {
                if (units.hasOwnProperty(e)) {
                    blunt += units[e] * (uw.GameData.units[e].def_hack || 0);
                    sharp += units[e] * (uw.GameData.units[e].def_pierce || 0);
                    dist += units[e] * (uw.GameData.units[e].def_distance || 0);
                }
            }
        },
        // Calculate offensive strength
        calcOff: (units, selectedUnits) => {
            var e;
            blunt = sharp = dist = 0;
            for (e in selectedUnits) {
                if (selectedUnits.hasOwnProperty(e)) {
                    var attack = (units[e] || 0) * uw.GameData.units[e].attack;
                    switch (uw.GameData.units[e].attack_type) {
                        case 'hack':
                            blunt += attack;
                            break;
                        case 'pierce':
                            sharp += attack;
                            break;
                        case 'distance':
                            dist += attack;
                            break;
                    }
                }
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Unit menu
         *******************************************************************************************************************************/
        Menu: {
            timeout: null,
            activate: () => {
                UnitStrength.Menu.timeout = setInterval(() => {
                    if ($("#dio_strength").css('display') != 'none') {
                        UnitStrength.Menu.update()
                    }
                }, 500);
                $('<div id="dio_strength" class="cont def" style="display:none;",><hr>' +
                    '<span class="bold text_shadow cont_left strength_font">' +
                    '<table style="margin:0px;">' +
                    '<tr><td><div class="ico units_info_sprite img_hack"></td><td id="dio_blunt">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></td><td id="dio_sharp">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></td><td id="dio_dist">0</td></tr>' +
                    '</table>' +
                    '</span>' +
                    '<div class="cont_right">' +
                    '<img id="dio_def_button" class="active img" src="https://gpall.innogamescdn.com/images/game/unit_overview/support.png">' +
                    '<img id="dio_off_button" class="img" src="https://gpall.innogamescdn.com/images/game/unit_overview/attack.png">' +
                    '</div></div>' +
                    '<div id= "dio_tr_btn" class="">' + getTexts("Options", "str")[0] + '</div>').appendTo('.units_land .content');

                $(".units_land .nav .border_top").click(() => { uw.BarracksWindowFactory.openBarracksWindow(); });

                $("#dio_tr_btn").click(() => {
                    if ($("#dio_strength").css('display') == 'none') {
                        UnitStrength.Menu.update();
                    }
                    $("#dio_strength").slideToggle();
                });
                $("#dio_tr_btn").hover(
                    function () { $("#dio_tr_btn").css({ "color": "#ECB44D" }); },
                    function () { $("#dio_tr_btn").css({ "color": "#EEDDBB" }); }
                );

                $("#dio_strength").click(() => {
                    UnitStrength.Menu.update();
                });
                $("#dio_tr_btn").css({
                    "cursor": "pointer",
                    //"position" : "relative",
                    "height": "12px",
                    "width": "127px",
                    "font-size": "10px",
                    "font-weight": "bold",
                    "color": "#EEDDBB",
                    "background": "url(https://gpfr.innogamescdn.com/images/game/layout/progressbars-sprite_2.90_compressed.png) no-repeat 0 -100px"
                });

                // Style
                $('<style id="dio_strength_style">' +
                    '#dio_strength.def #off_button, #dio_strength.off #def_button { filter:url(#Sepia); -webkit-filter:sepia(1); }' +
                    '#dio_strength.off #off_button, #dio_strength.def #def_button { filter:none; -webkit-filter:none; } ' +

                    '#dio_strength.off .img_hack 	{ background-position:0% 36%;} ' +
                    '#dio_strength.def .img_hack 	{ background-position:0%  0%;} ' +
                    '#dio_strength.off .img_pierce 	{ background-position:0% 27%;} ' +
                    '#dio_strength.def .img_pierce 	{ background-position:0%  9%;} ' +
                    '#dio_strength.off .img_dist 	{ background-position:0% 45%;} ' +
                    '#dio_strength.def .img_dist 	{ background-position:0% 18%;} ' +

                    '#dio_strength .strength_font 		{ font-size: 0.8em; } ' +
                    '#dio_strength.off .strength_font 	{ color:#edb;} ' +
                    '#dio_strength.def .strength_font 	{ color:#fc6;} ' +

                    '#dio_strength .ico 				{ height:20px; width:20px; } ' +
                    '#dio_strength .units_info_sprite 	{ background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +

                    '#dio_strength .img_pierce 	{ background-position:0px -20px; } ' +
                    '#dio_strength .img_dist 	{ background-position:0px -40px; } ' +
                    '#dio_strength hr 		 	{ margin:0px; background-color:#5F5242; height:2px; border:0px solid; } ' +
                    '#dio_strength .cont_left  	{ width:65%;  display:table-cell; } ' +

                    '#dio_strength.cont { background:url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png); } ' +

                    '#dio_strength .cont_right 	{ width:30%; display:table-cell; vertical-align:middle; } ' +
                    '#dio_strength .img 		{ float:right; background:none; margin:2px 8px 2px 0px; } ' +

                    '</style>').appendTo("head");

                // Button events
                $('.units_land .units_wrapper, .btn_gods_spells .checked').click(() => {
                    setTimeout(function () { UnitStrength.Menu.update(); }, 100);
                });

                $('#dio_off_button').click(() => {
                    $('#dio_strength').addClass('off').removeClass('def');

                    def = false;
                    UnitStrength.Menu.update();
                });
                $('#dio_def_button').click(() => {
                    $('#dio_strength').addClass('def').removeClass('off');

                    def = true;
                    UnitStrength.Menu.update();
                });
                $('#dio_def_button, #dio_off_button').hover(function () {
                    $(this).css('cursor', 'pointer');
                });

                UnitStrength.Menu.update();
            },
            deactivate: () => {
                $('#dio_strength').remove();
                $('#dio_strength_style').remove();
                $('#dio_Caserne').remove();
                $('#dio_tr_btn').remove();
                clearTimeout(UnitStrength.Menu.timeout);
                UnitStrength.Menu.timeout = null;
            },
            update: () => {
                //console.log("test");
                var unitsIn = uw.ITowns.getTown(uw.Game.townId).units(), units = UnitStrength.Menu.getSelected();

                // Calculation
                if (def === true) { UnitStrength.calcDef(units); }
                else { UnitStrength.calcOff(unitsIn, units); }
                $('#dio_blunt').get(0).innerHTML = blunt;
                $('#dio_sharp').get(0).innerHTML = sharp;
                $('#dio_dist').get(0).innerHTML = dist;
            },
            getSelected: () => {
                var units = [];
                if ($(".units_land .units_wrapper .selected").length > 0) {
                    $(".units_land .units_wrapper .selected").each(function () {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                } else {
                    $(".units_land .units_wrapper .unit").each(function () {
                        units[this.className.split(" ")[1]] = this.children[0].innerHTML;
                    });
                }
                return units;
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Conquest
         *******************************************************************************************************************************/
        Conquest: {
            add: () => {
                var units = [], str;

                // units of the siege
                $('#conqueror_units_in_town .unit').each(function () {
                    str = $(this).attr("class").split(" ")[4];
                    if (!uw.GameData.units[str].is_naval) {
                        units[str] = parseInt(this.children[0].innerHTML, 10);
                    }
                });
                // calculation
                UnitStrength.calcDef(units);

                $('<div id="dio_strength_eo" class="game_border" style="width:90px; margin: 20px; align:center;">' +
                    '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                    '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                    '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                    '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                    '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                    '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="dio_bl" align="center" width="100%">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="dio_sh" align="center">0</td></tr>' +
                    '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="dio_di" align="center">0</td></tr>' +
                    '</table></span>' +
                    '</div>').appendTo('#conqueror_units_in_town');

                $('#dio_strength_eo').tooltip('Gesamteinheitenstärke der Belagerungstruppen');

                // Veröffentlichung-Button-Text
                $('#conqueror_units_in_town .publish_conquest_public_id_wrap').css({ marginLeft: '130px' });

                $('#dio_strength_eo .ico').css({
                    height: '20px',
                    width: '20px'
                });
                $('#dio_strength_eo .units_info_sprite').css({
                    background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                    backgroundSize: '100%'
                });
                $('#dio_strength_eo .img_pierce').css({ backgroundPosition: '0% 9%' });
                $('#dio_strength_eo .img_dist').css({ backgroundPosition: '0% 18%' });

                $('#dio_bl').get(0).innerHTML = blunt;
                $('#dio_sh').get(0).innerHTML = sharp;
                $('#dio_di').get(0).innerHTML = dist;
            }
        },
        /*******************************************************************************************************************************
         * ● Unit strength: Barracks
         *******************************************************************************************************************************/
        Barracks: {
            add: () => {
                if (!$('#dio_strength_baracks').get(0)) {
                    var units = [], pop = 0;

                    // whole units of the town
                    $('#units .unit_order_total').each(function () {
                        units[$(this).parent().parent().attr("id")] = this.innerHTML;
                    });
                    // calculation
                    UnitStrength.calcDef(units);

                    // population space of the units
                    for (var e in units) {
                        if (units.hasOwnProperty(e)) {
                            pop += units[e] * uw.GameData.units[e].population;
                        }
                    }
                    $('<div id="dio_strength_baracks" class="game_border" style="float:right; width:70px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><div class="ico units_info_sprite img_hack"></div></td><td id="dio_b" align="center" width="100%">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_pierce"></div></td><td id="dio_s" align="center">0</td></tr>' +
                        '<tr><td><div class="ico units_info_sprite img_dist"></div></td><td id="dio_d" align="center">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');

                    $('<div id="dio_pop_baracks" class="game_border" style="float:right; width:60px; align:center;">' +
                        '<div class="game_border_top"></div><div class="game_border_bottom"></div>' +
                        '<div class="game_border_left"></div><div class="game_border_right"></div>' +
                        '<div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div>' +
                        '<div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>' +
                        '<span class="bold" style="color:#000;font-size: 0.8em;"><table style="margin:0px;background:#f7dca2;width:100%;align:center;">' +
                        '<tr><td width="1%"><img class="ico" src="https://gpall.innogamescdn.com/images/game/res/pop.png"></td><td id="dio_p" align="center" width="100%">0</td></tr>' +
                        '</table></span>' +
                        '</div>').appendTo('.ui-dialog #units');

                    $('.ui-dialog #units .ico').css({
                        height: '20px',
                        width: '20px'
                    });
                    $('.ui-dialog #units .units_info_sprite').css({
                        background: 'url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)',
                        backgroundSize: '100%'
                    });
                    $('.ui-dialog #units .img_pierce').css({ backgroundPosition: '0% 9%' });
                    $('.ui-dialog #units .img_dist').css({ backgroundPosition: '0% 18%' });

                    $('#dio_b').get(0).innerHTML = blunt;
                    $('#dio_s').get(0).innerHTML = sharp;
                    $('#dio_d').get(0).innerHTML = dist;
                    $('#dio_p').get(0).innerHTML = pop;
                }
            }
        }
    };

    /*******************************************************************************************************************************
     * ● Transporter capacity
     *******************************************************************************************************************************/
    var TransportCapacity = {
        timeout: null,
        activate: () => {
            try {
                // transporter display
                $(
                    '<div id="dio_tr_recruit" class="checkbox_new checked" style="right: 10px; bottom: 2px; position: absolute;"><div class="dio_tr_recruit"></div><div class="cbx_icon" style="margin-top:2px"></div></div></tr></table>' +
                    //'<a id="dio_Port" style="position: absolute; width: 60px; height: 26px;"></a>' +
                    '<div id="dio_transporter" class="cont" style="height:25px;">' +
                    '<table style=" margin:0px;"><tr align="center" >' +
                    '<td><img id="dio_ship_img" class="ico" src="' + Home_img + 'mini-bateau.png"></td>' +
                    '<td><span id="dio_ship" class="bold text_shadow" style="color:#FFCC66;font-size: 10px;line-height: 2.1;"></span></td></tr>' +
                    '<tr align="center"><td></td>' +
                    '<td><span id="dio_ship-def" class="bold text_shadow" style="color:#FFCC66;font-size: 10px;line-height: 2.1;"></span></td></tr>' +
                    //'<div id="tr_recruit" class="checkbox_new checked" style="margin-left:-1px"><div class="tr_options tr_recruit"></div><div class="cbx_icon" style="margin-top:2px"></div></div>' +
                    "</div>"
                ).appendTo(".units_naval .content");

                $(".units_naval .nav .border_top").click(() => { uw.DocksWindowFactory.openDocksWindow(); });

                $(".dio_tr_recruit").css({
                    background:
                        "url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png)",
                    "background-position-y": "0px",
                    "background-size": "100%",
                    width: "18px",
                    height: "18px",
                    float: "left",
                });

                $("#dio_transporter.cont").css({ background: "url(https://gpall.innogamescdn.com/images/game/layout/layout_units_nav_border.png)" });

                $("#dio_transporter").hover(function () { $(this).css("cursor", "pointer"); });

                $("#dio_tr_recruit.checkbox_new").click(function () {
                    if ($(this).find("DIV.tr_deactivated").length === 0) {
                        $(this).toggleClass("checked");
                    }
                });

                TransportCapacity.timeout = setInterval(() => { TransportCapacity.update(); }, 800);

                $("#dio_tr_recruit").toggleClick(function () { TransportCapacity.update(); });
                $("#dio_transporter").toggleClick(
                    function () {
                        $("#dio_ship_img").get(0).src = Home_img + "mini-bateau-red.png";
                        shipsize = true
                        TransportCapacity.update();
                    },
                    function () {
                        $("#dio_ship_img").get(0).src = Home_img + "mini-bateau.png";
                        shipsize = false
                        TransportCapacity.update();
                    }
                );
                TransportCapacity.update();

                $("#dio_tr_recruit").tooltip(dio_icon + getTexts("transport_calc", "recruits"));
            } catch (error) { errorHandling(error, "TransportCapacity (activate)"); }
        },
        deactivate: () => {
            $("#dio_transporter").remove();
            $("#dio_Port").remove();
            $("#dio_tr_recruit").remove();
            clearTimeout(TransportCapacity.timeout);
            TransportCapacity.timeout = null;
        },
        update: () => {
            try {
                const selected_town = uw.ITowns.getTown(uw.Game.townId),
                    GD_units = uw.GameData.units,
                    GD_heroes = uw.GameData.heroes,
                    trans_small = GD_units.small_transporter,
                    trans_big = GD_units.big_transporter;
                let bigTransp = 0, smallTransp = 0, pop = 0, pop_def = 0, ship = 0, unit, berth, units = [];

                // Ship space (available)
                smallTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().small_transporter, 10);
                if (isNaN(smallTransp)) smallTransp = 0;
                if (shipsize) {
                    bigTransp = parseInt(uw.ITowns.getTown(parseInt(uw.Game.townId, 10)).units().big_transporter, 10);
                    if (isNaN(bigTransp)) bigTransp = 0;
                }

                // Checking: Research berth
                berth = 0;
                if (uw.ITowns.getTown(uw.Game.townId).researches().hasBerth()) {
                    berth = uw.GameData.research_bonus.berth;
                }
                ship = bigTransp * (trans_big.capacity + berth) + smallTransp * (trans_small.capacity + berth);

                units = uw.ITowns.getTown(uw.Game.townId).units();

                function isOff(name) { return GD_units[name].unit_function === "function_off" || GD_units[name].unit_function === "function_both" }
                function isDef(name) { return GD_units[name].unit_function === "function_def" || GD_units[name].unit_function === "function_both" }

                // Ship space (required)
                for (var e in units) {
                    if (units.hasOwnProperty(e)) {
                        if (GD_units[e]) {
                            if (isOff(e)) {
                                if (e === "spartoi") {
                                    pop += units[e];
                                } else if (
                                    !(GD_units[e].is_naval || GD_units[e].flying)
                                ) {
                                    pop += units[e] * GD_units[e].population;
                                }
                            }

                            if (isDef(e)) {
                                if (!(GD_units[e].is_naval || GD_units[e].flying)) {
                                    pop_def += units[e] * GD_units[e].population;
                                }
                            }
                        }
                    }
                }

                if ($(".dio_tr_recruit").parent().hasClass("checked")) {
                    const recruits = selected_town.getUnitOrdersCollection().models;
                    for (let i = 0; i < recruits.length; ++i) {
                        const unitt = recruits[i].attributes.unit_type,
                            number = recruits[i].attributes.units_left;

                        // Landtruppen
                        if (!(unitt in GD_heroes) && units[unitt] != 0 && !GD_units[unitt].flying && GD_units[unitt].capacity == undefined) {
                            if (isOff(unitt)) {
                                if (unitt === "spartoi") { pop += number; }
                                else { pop += number * GD_units[unitt].population; }
                            }

                            if (isDef(unitt)) {
                                if (unitt === "spartoi") { pop_def += number; }
                                else { pop_def += number * GD_units[unitt].population; }
                            }
                        }
                        // Transportschiffe
                        else if (!(unitt in GD_heroes) && units[unitt] != 0 && !GD_units[unitt].flying && GD_units[unitt].capacity != 0) {
                            if (!shipsize) {
                                if (unitt === "small_transporter") { ship += number * (GD_units[unitt].capacity + berth); }
                                else return
                            }
                            if (shipsize) { ship += number * (GD_units[unitt].capacity + berth); }
                        }
                    }
                }

                $(".dio_tr_recruit").css({ "background-position-y": pop_def > pop ? "-36px" : "0px" });

                if (pop_def > pop) { pop = pop_def; }

                let newHTML = `<span style="color:${pop === 0 & ship === 0 ? "#FFCC66" : (pop > ship ? "#ffb4b4" : "#6eff5c")
                    }">${pop}/${ship}</span>`;

                if ($("#dio_ship").get(0).innerHTML !== newHTML) { $("#dio_ship").get(0).innerHTML = newHTML; }
                const popDiff = Math.abs(pop - ship);

                if (pop > ship) {
                    let missing = Math.ceil(popDiff / (trans_small.capacity + berth));
                    name = missing === 1 ? trans_small.name : trans_small.name_plural;

                    if (shipsize) {
                        missing = Math.ceil(popDiff / (trans_big.capacity + berth));
                        name = missing === 1 ? trans_big.name : trans_big.name_plural;
                    }
                    $("#dio_transporter").tooltip(dio_icon + getTexts("transport_calc", "Lack") + " " + missing + " " + name);

                } else {
                    name = trans_small.name_plural;
                    if (shipsize) { name = trans_big.name_plural };

                    $("#dio_transporter").tooltip(dio_icon + getTexts("transport_calc", "Still") + " " + popDiff + " " + getTexts("transport_calc", "pop") + " " + name + ".");

                    if (pop === 0 & ship === 0) { $("#dio_transporter").tooltip(dio_icon + getTexts("transport_calc", "army")); }
                    else if (popDiff === 0) { $("#dio_transporter").tooltip(dio_icon + getTexts("transport_calc", "Optipop") + " " + name + "."); }
                }
            } catch (error) { errorHandling(error, "TransportCapacity (update)"); }
        },
    };

    /*******************************************************************************************************************************
     * Simulator
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Layout adjustment
     * | ● Unit strength for entered units (without modificator influence yet)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/
    var Simulator = {
        activate: () => {
            $('<style id="dio_simulator_style" type="text/css">' +

                '#place_simulator { overflow: hidden !important} ' +
                '#place_simulator .place_sim_bonuses_heroes .place_symbol.place_def_losts { margin-bottom: 27px; } ' +
                '#place_simulator_form .game_body { padding: 0px 1px;!important; } ' +
                '#place_simulator .place_sim_heroes_container .place_simulator_table { height: 64px!important; } ' +

                // Bonus container
                '#place_simulator .place_sim_wrap_mods { margin-bottom: 0px!important; } ' + // Hide modifier box button
                '.place_sim_wrap_mods .place_simulator_table tbody tr:last-child { height: 47px; vertical-align: top; } ' +

                // Sea unit box
                '#place_sim_naval_units tbody tr:last-child { height:auto !important;}' +
                '#place_sim_naval_units { margin-bottom: 91px;}' +

                // Select boxes
                '.place_sim_select_gods_wrap { position:absolute; bottom: 178px; left: 160px;} ' +
                '.place_sim_select_gods_wrap .place_symbol, .place_sim_select_strategies .place_symbol { margin: 1px 2px 0px 5px !important} ' +
                '.place_sim_select_gods_wrap select { max-width: 200px; width: auto!important;} ' +

                //adaptation of the layout
                '.place_sim_hero_container { width: 73px}' +
                '.place_sim_hero_choose { width: 50px;' +

                '</style>').appendTo('head');

            if ($('#place_simulator').get(0)) { setStrengthSimulator(); }
            SimulatorStrength.activate();

        },
        deactivate: () => {
            $('#dio_simulator_style').remove();
            if ($('#simu_table').get(0)) { $('#simu_table').remove(); }
            SimulatorStrength.deactivate();
        }
    };

    function afterSimulation() {
        try {
            let lossArray = { att: { res: 0, fav: 0, pop: 0 }, def: { res: 0, fav: 0, pop: 0 } },
                wall_level = parseInt($('.place_sim_wrap_mods .place_insert_field[name="sim[mods][def][wall_level]"]').val(), 10),
                wall_damage = parseInt($('#building_place_def_losses_wall_level').get(0).innerHTML, 10),
                wall_iron = [0, 200, 429, 670, 919, 1175, 1435, 1701, 1970, 2242, 2518, 2796, 3077, 3360, 3646, 3933, 4222, 4514, 4807, 5101, 5397, 5695, 5994, 6294, 6596, 6899];

            // Calculate unit losses
            $('#place_sim_ground_units .place_losses, #place_sim_naval_units .place_losses').each(function () {
                const loss = parseInt(this.innerHTML, 10) || 0;
                //console.log(this.innerHTML);
                if (loss > 0) {
                    const unit = this.id.substring(26);
                    const side = this.id.split("_")[2]; // att / def
                    lossArray[side].res += loss * (uw.GameData.units[unit].resources.wood + uw.GameData.units[unit].resources.stone + uw.GameData.units[unit].resources.iron);
                    lossArray[side].fav += loss * uw.GameData.units[unit].favor;
                    lossArray[side].pop += loss * uw.GameData.units[unit].population;
                }
            });
            // Calculate wall resource losses
            for (let w = wall_level; w > wall_level - wall_damage; w--) {
                lossArray.def.res += 400 + w * 350 + wall_iron[w]; // wood amount is constant, stone amount is multiplicative and iron amount is irregular for wall levels
            }

            // Insert losses into table
            for (let x in lossArray) {
                if (lossArray.hasOwnProperty(x)) {
                    for (var z in lossArray[x]) {
                        if (lossArray[x].hasOwnProperty(z)) {
                            //console.log(((z === "res") && (lossArray[x][z] > 10000)) ? (Math.round(lossArray[x][z] / 1000) + "k") : lossArray[x][z]);
                            $("#dio_" + x + "_" + z).get(0).innerHTML = ((z === "res") && (lossArray[x][z] > 10000)) ? (Math.round(lossArray[x][z] / 1000) + "k") : lossArray[x][z];

                        }
                    }
                }
            }
        } catch (error) { errorHandling(error, "afterSimulation"); }
    }

    // Stärkeanzeige: Simulator
    let unitsGround = { att: {}, def: {} }, unitsNaval = { att: {}, def: {} }, name = "";

    var SimulatorStrength = {
        timeout: null,
        unitsGround: { att: {}, def: {} },
        unitsNaval: { att: {}, def: {} },
        activate: () => {
            $('<style id="dio_simulator_strength_style">' +
                '#dio_simulator_strength { position:absolute; top:188px; font-size:0.8em; width:63%; } ' +
                '#dio_simulator_strength .ico { height:20px; width:20px; margin:auto; } ' +
                '#dio_simulator_strength .units_info_sprite { background:url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png); background-size:100%; } ' +

                '#dio_simulator_strength .img_hack { background-position:0% 36%; } ' +
                '#dio_simulator_strength .img_pierce { background-position:0% 27%; } ' +
                '#dio_simulator_strength .img_dist { background-position:0% 45% !important; } ' +
                '#dio_simulator_strength .img_ship { background-position:0% 72%; } ' +

                '#dio_simulator_strength .img_fav { background: url(https://gpall.innogamescdn.com/images/game/res/favor.png) !important; background-size: 100%; } ' +
                '#dio_simulator_strength .img_res { background: url(https://gpall.innogamescdn.com/images/game/units/units_info_sprite2.51.png) 0% 54%; background-size: 100%; } ' +
                '#dio_simulator_strength .img_pop { background: url(https://gpall.innogamescdn.com/images/game/res/pop.png); background-size:100%; } ' +

                '#dio_simulator_strength .left_border { width: 48px; } ' +
                '</style>'
            ).appendTo('head');

            SimulatorStrength.timeout = setInterval(() => {
                if ($('#dio_simulator_strength').length) {
                    afterSimulation();
                }
            }, 900);

        },
        deactivate: () => {
            $('#dio_simulator_strength_style').remove();
            $('#dio_simulator_strength').remove();
            clearTimeout(SimulatorStrength.timeout);
            SimulatorStrength.timeout = null;
        }
    }

    function setStrengthSimulator() {
        try {
            $('<div id="dio_simulator_strength" style="width: 49%;">' +
                '<div style="float:left; margin-right: -6px;"><h4>' + getTexts("labels", "str") + '</h4>' +
                '<table class="place_simulator_table strength" cellpadding="0px" cellspacing="0px" style="align:center;">' +
                '<tr>' +
                '<td class="place_simulator_even"></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_hack"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_pierce"></div></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_dist"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_ship"></div></td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_att"></div></td>' +
                '<td class="left_border place_simulator_odd" id="dio_att_b">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_att_s">0</td>' +
                '<td class="left_border place_simulator_odd" id="dio_att_d">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_att_ship">0</td>' +
                '</tr><tr>' +
                '<td class="place_simulator_even"><div class="place_symbol place_def"></div></td>' +
                '<td class="left_border place_simulator_odd" id="dio_def_b">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_def_s">0</td>' +
                '<td class="left_border place_simulator_odd" id="dio_def_d">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_def_ship">0</td>' +
                '</tr>' +
                '</table>' +
                '</div><div><h4 style="left: 6px; position: relative;">' + getTexts("labels", "los") + '</h4>' +
                '<table class="place_simulator_table loss" cellpadding="0px" cellspacing="0px" style="align:center; height: 64px;">' +
                '<tr>' +
                '<td></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_res"></div></td>' +
                '<td class="left_border place_simulator_even"><div class="ico units_info_sprite img_fav"></div></td>' +
                '<td class="left_border place_simulator_odd"><div class="ico units_info_sprite img_pop"></div></td>' +
                '</tr><tr>' +
                '<td></td>' +
                '<td class="left_border place_simulator_odd" id="dio_att_res">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_att_fav">0</td>' +
                '<td class="left_border place_simulator_odd" id="dio_att_pop">0</td>' +
                '</tr><tr>' +
                '<td></td>' +
                '<td class="left_border place_simulator_odd" id="dio_def_res">0</td>' +
                '<td class="left_border place_simulator_even" id="dio_def_fav">0</td>' +
                '<td class="left_border place_simulator_odd" id="dio_def_pop">0</td>' +
                '</tr>' +
                '</table>' +
                '</div></div>').appendTo('#simulator_body');


            $('#dio_simulator_strength .left_border').each(function () {
                $(this)[0].align = 'center';
            });

            $('#dio_simulator_strength .strength').tooltip(dio_icon + getTexts("labels", "str") + " (" + getTexts("labels", "mod") + ")");
            $('#dio_simulator_strength .loss').tooltip(dio_icon + getTexts("labels", "los"));

            // Klick auf Einheitenbild
            $('.index_unit').click(function () {
                const type = $(this).attr('class').split(" ")[4];
                $('.place_insert_field[name="sim[units][att][' + type + ']"]').change();
            });

            $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').on('input change', function () {
                name = $(this).attr("name").replace(/\]/g, "").split("[");
                const str = this;
                setTimeout(function () {
                    const unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2];
                    let val, e;

                    val = parseInt($(str).val(), 10);
                    val = val || 0;

                    if (unit_type == "ground") {
                        unitsGround[name[2]][name[3]] = val;

                        if (name[2] == "def") {
                            UnitStrength.calcDef(unitsGround.def);
                        } else {
                            UnitStrength.calcOff(unitsGround.att, unitsGround.att);
                        }
                        $('#dio_' + name[2] + '_b').get(0).innerHTML = blunt;
                        $('#dio_' + name[2] + '_s').get(0).innerHTML = sharp;
                        $('#dio_' + name[2] + '_d').get(0).innerHTML = dist;

                    } else {
                        let att = 0, def = 0;
                        unitsNaval[name[2]][name[3]] = val;

                        if (name[2] == "def") {
                            for (e in unitsNaval.def) {
                                if (unitsNaval.def.hasOwnProperty(e)) {
                                    def += unitsNaval.def[e] * uw.GameData.units[e].defense;
                                }
                            }
                            $('#dio_def_ship').get(0).innerHTML = def;

                        } else {
                            for (e in unitsNaval.att) {
                                if (unitsNaval.att.hasOwnProperty(e)) {
                                    att += unitsNaval.att[e] * uw.GameData.units[e].attack;
                                }
                            }
                            $('#dio_att_ship').get(0).innerHTML = att;
                        }
                    }
                }, 100);
            });

            // Abfrage wegen eventueller Spionageweiterleitung
            getUnitInputs();
            setTimeout(function () { setChangeUnitInputs("def"); }, 100);

            $('#select_insert_units').change(function () {
                var side = $(this).find('option:selected').val();

                setTimeout(function () {
                    getUnitInputs();
                    if (side === "att" || side === "def") {
                        setChangeUnitInputs(side);
                    }
                }, 200);
            });
        } catch (error) { errorHandling(error, "setStrengthSimulator"); }
    }

    function getUnitInputs() {
        try {
            $('#place_sim_ground_units .place_insert_field, #place_sim_naval_units .place_insert_field').each(function () {
                name = $(this).attr("name").replace(/\]/g, "").split("[");

                const str = this;

                const unit_type = $(str).closest('.place_simulator_table').attr("id").split("_")[2];

                let val = parseInt($(str).val(), 10);

                val = val || 0;

                if (unit_type === "ground") { unitsGround[name[2]][name[3]] = val; }
                else { unitsNaval[name[2]][name[3]] = val; }
            });
        } catch (error) { errorHandling(error, "getUnitInputs"); }
    }

    function setChangeUnitInputs(side) {
        $('.place_insert_field[name="sim[units][' + side + '][godsent]"]').change();
        setTimeout(function () { $('.place_insert_field[name="sim[units][' + side + '][colonize_ship]"]').change(); }, 100);
    }

    /*******************************************************************************************************************************
     * Defense form
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Adds a defense form to the bbcode bar
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // Funktion aufteilen...
    function addForm(e) {
        try {
            var textareaId = "", bbcodeBarId = "";

            switch (e) {
                case "/alliance_forum/forum":
                    textareaId = "#forum_post_textarea";
                    bbcodeBarId = "#forum";
                    break;
                case "/message/forward":
                    textareaId = "#message_message";
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/new":
                    textareaId = "#message_new_message";
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/message/view":
                    textareaId = "#message_reply_message";
                    bbcodeBarId = "#message_bbcodes";
                    break;
                case "/player_memo/load_memo_content":
                    textareaId = "#memo_text_area";
                    bbcodeBarId = "#memo_edit";
                    break;
            }


            if (!$(bbcodeBarId + ' .bb_button_wrapper .dio_bbcode_option.dio_def_form').get(0)) {
                $('<a title="' + getTexts("Options", "bbc")[0] + '" href="#" class="dio_bbcode_option dio_def_form" name="dio_def_form"></a>').appendTo(bbcodeBarId + ' .bb_button_wrapper');
            }

            $('.dio_def_form_button').css({
                cursor: 'pointer',
                marginTop: '3px'
            });

            $(bbcodeBarId + ' .dio_bbcode_option').css({
                background: 'url("' + Home_img + 'bbcodebarid.png")',
                display: 'block',
                float: 'left',
                width: '22px',
                height: '23px',
                margin: '0 3px 0 0',
                position: 'relative'
            });
            $(bbcodeBarId + ' .dio_def_form').css({ backgroundPosition: '-89px 0px' });
            var imgArray = {
                wall: Home_img + '40px-remparts.png', 	// 'https://gpall.innogamescdn.com/images/game/main/wall.png',
                tower: Home_img + '40px-tour.png', 		// 'https://gpall.innogamescdn.com/images/game/main/tower.png',
                hide: Home_img + '40px-grotte.png', 		// 'https://gpall.innogamescdn.com/images/game/main/hide.png'

                spy: Home_img + '40px-spy.png',
                pop: Home_img + '40px-pop.png',

                rev1: Home_img + '40px-rev1.png',
                rev0: Home_img + '40px-rev0.png',
                eo1: Home_img + '40px-eo1.png',
                eo0: Home_img + '40px-eo0.png',
                att: Home_img + '40px-att.png',
                sup: Home_img + '40px-sup.png',

                zeus: Home_img + '40px-zeus.png',
                hera: Home_img + '40px-hera.png',
                athena: Home_img + '40px-athena.png',
                poseidon: Home_img + '40px-poseidon.png',
                hades: Home_img + '40px-hades.png',
                artemis: Home_img + '40px-artemis.png',
                nogod: Home_img + '40px-nogod.png',
                aphrodite: Home_img + '40px-aphrodite.png',
                ares: Home_img + '40px-ares.png',

                captain: Home_img + '40px-captain.png',
                commander: Home_img + '40px-commander.png',
                priest: Home_img + '40px-priest.png',

                phalanx: Home_img + '40px-phalange.png',
                ram: Home_img + '40px-belier.png',

                militia: Home_img + '40px-milice.png', 				// 'https://wiki.en.grepolis.com/images/9/9b/Militia_40x40.png',
                sword: Home_img + 'combattant-a-l-epee-1.png', 	// 'https://wiki.en.grepolis.com/images/9/9c/Sword_40x40.png',
                slinger: Home_img + 'frondeur-1.png', 				// 'https://wiki.en.grepolis.com/images/d/dc/Slinger_40x40.png',
                archer: Home_img + 'archer-1.png', 				// 'https://wiki.en.grepolis.com/images/1/1a/Archer_40x40.png',
                hoplite: Home_img + 'hoplite-1.png', 				// 'https://wiki.en.grepolis.com/images/b/bd/Hoplite_40x40.png',
                rider: Home_img + 'cavalier-1.png', 				// 'https://wiki.en.grepolis.com/images/e/e9/Rider_40x40.png',
                chariot: Home_img + 'char-1.png', 					// 'https://wiki.en.grepolis.com/images/b/b8/Chariot_40x40.png',
                catapult: Home_img + 'catapulte-1.png', 				// 'https://wiki.en.grepolis.com/images/f/f0/Catapult_40x40.png',
                godsent: Home_img + '40px-ed.png', 					// 'https://wiki.de.grepolis.com/images/6/6e/Grepolis_Wiki_225.png',

                def_sum: Home_img + '40px-def-sum.png',

                minotaur: Home_img + '40px-minotaure.jpg', 	// 'https://wiki.de.grepolis.com/images/7/70/Minotaur_40x40.png',
                manticore: Home_img + '40px-manticore.jpg', 	// 'https://wiki.de.grepolis.com/images/5/5e/Manticore_40x40.png',
                zyclop: Home_img + '40px-cyclope.jpg', 	// 'https://wiki.de.grepolis.com/images/6/66/Zyklop_40x40.png',
                sea_monster: Home_img + '40px-hydre.jpg', 		// 'https://wiki.de.grepolis.com/images/7/70/Sea_monster_40x40.png',
                harpy: Home_img + '40px-harpie.jpg', 		// 'https://wiki.de.grepolis.com/images/8/80/Harpy_40x40.png',
                medusa: Home_img + '40px-meduse.jpg', 		// 'https://wiki.de.grepolis.com/images/d/db/Medusa_40x40.png',
                centaur: Home_img + '40px-centaure.jpg', 	// 'https://wiki.de.grepolis.com/images/5/53/Centaur_40x40.png',
                pegasus: Home_img + '40px-pegase.jpg', 		// 'https://wiki.de.grepolis.com/images/5/54/Pegasus_40x40.png',
                cerberus: Home_img + '40px-cerbere.jpg', 	// 'https://wiki.de.grepolis.com/images/6/67/Zerberus_40x40.png',
                fury: Home_img + '40px-erinye.jpg', 		// 'https://wiki.de.grepolis.com/images/6/67/Erinys_40x40.png',
                griffin: Home_img + '40px-griffon.jpg', 	// 'https://wiki.de.grepolis.com/images/d/d1/Unit_greif.png',
                calydonian_boar: Home_img + '40px-sc.jpg', 	// 'https://wiki.de.grepolis.com/images/9/93/Unit_eber.png',
                spartoi: Home_img + '40px-spartoi.png',
                siren: Home_img + '40px-siren-1.png',
                satyr: Home_img + '40px-satyr.png',
                ladon: Home_img + '40px-ladon.png',

                big_transporter: Home_img + '40px-bt.png', 		// 'https://wiki.en.grepolis.com/images/0/04/Big_transporter_40x40.png',
                bireme: Home_img + '40px-bireme.png', 	// 'https://wiki.en.grepolis.com/images/4/44/Bireme_40x40.png',
                attack_ship: Home_img + '40px-bf.png', 		// 'https://wiki.en.grepolis.com/images/e/e6/Attack_ship_40x40.png',
                demolition_ship: Home_img + '40px-brulot.png', 	// 'https://wiki.en.grepolis.com/images/e/ec/Demolition_ship_40x40.png',
                small_transporter: Home_img + '40px-btr.png', 	// 'https://wiki.en.grepolis.com/images/8/85/Small_transporter_40x40.png',
                trireme: Home_img + '40px-triere.png', 	// 'https://wiki.en.grepolis.com/images/a/ad/Trireme_40x40.png',
                colonize_ship: Home_img + '40px-bc.png', 		// 'https://wiki.en.grepolis.com/images/d/d1/Colonize_ship_40x40.png',

                move_icon: 'https://gpall.innogamescdn.com/images/game/unit_overview/', // '?',

                bordure: Home_img + 'transition-mini.png' // Home_img + 'bordure.png'
            };

            $('<div class="dio_bb_def_chooser">' +
                '<div class="bbcode_box middle_center">' +
                '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div>' +
                '<div class="bbcode_box top_center"></div><div class="bbcode_box bottom_center"></div>' +
                '<div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
                '<div class="bbcode_box middle_left"></div><div class="bbcode_box middle_right"></div>' +
                '<div class="bbcode_box content clearfix" style="padding:5px">' +
                '<div id="f_uni" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "det") + '</div></div><br><br>' +
                '<div id="f_prm" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "prm") + '</div></div><br><br>' +
                '<div id="f_sil" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "sil") + '</div></div><br><br>' +
                /*'<div id="f_mov" class="checkbox_new checked"><div class="cbx_icon"></div><div class="cbx_caption">' + getTexts("labels", "mov") + '</div></div><br><br>' +*/
                '<div><a class="button" id="dio_insert" href="#"><span class="left"><span class="right"><span class="middle"><small>' + dio_icon + '' + getTexts("buttons", "ins") + '</small></span></span></span><span></span></a></div>' +
                '</div></div></div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');

            $('.dio_bb_def_chooser').css({
                display: 'none',
                top: '38px',
                left: '510px',
                position: 'absolute',
                width: '190px',
                zIndex: 10000
            });

            $(bbcodeBarId + " .dio_bb_def_chooser .checkbox_new").click(function () { $(this).toggleClass("checked"); });

            $(bbcodeBarId + ' .dio_def_form').toggleClick(
                function () { $(this).parent().find(".dio_bb_def_chooser").get(0).style.display = "block"; },
                function () { $(this).parent().find(".dio_bb_def_chooser").get(0).style.display = "none"; }
            );

            $(bbcodeBarId + ' #dio_insert').click(function () {
                var textarea = $(textareaId).get(0), text = $(textarea).val(), troop_table = "", troop_img = "", troop_count = "", separator = "", move_table = "", landunit_sum = 0;

                $('.dio_def_form').click();

                if ($('#f_uni').hasClass("checked")) {
                    $('.units_land .unit, .units_naval .unit').each(function () {
                        troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                        troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                        separator = "[||]";
                    });
                } else {
                    $('.units_land .unit').each(function () {
                        var a = this.className.split(" ")[1], def = (uw.GameData.units[a].def_hack + uw.GameData.units[a].def_pierce + uw.GameData.units[a].def_distance) / (3 * uw.GameData.units[a].population);
                        if (def > 10) {
                            landunit_sum += parseInt($(this).find(".value").get(0).innerHTML, 10) * uw.GameData.units[a].population * ((def > 20) ? 2 : 1);
                        }
                    });
                    landunit_sum = (landunit_sum > 10000) ? ((Math.round(landunit_sum / 100)) / 10) + "k" : landunit_sum;

                    troop_img += '[img]' + imgArray.def_sum + '[/img]';
                    troop_count += '[center]' + landunit_sum + '[/center]';
                    separator = "[||]";
                    $('.units_naval .unit').each(function () {
                        troop_img += separator + '[img]' + imgArray[this.className.split(" ")[1]] + '[/img]';
                        troop_count += separator + '[center]' + $(this).find(".value").get(0).innerHTML + '[/center]';
                    });
                }
                if (troop_img !== "") { troop_table = "\n[table][**]" + troop_img + "[/**][**]" + troop_count + "[/**][/table]\n"; }

                var str = '[img]' + imgArray.bordure + '[/img]' +
                    '\n[color=#006B00][size=12][u][b]' + getTexts("labels", "ttl", true) + '[/b][/u][/size][/color]\n\n' +
                    //'[table][**][img]'+ imgArray.sup +'[/img][||]'+
                    '[size=12][town]' + uw.ITowns.getTown(uw.Game.townId).getId() + '[/town] ([player]' + uw.Game.player_name + '[/player])[/size]' +
                    '\n[size=8][url=' + Home + 'en/pages/dio-tools-david1327/]DIO-TOOLS-David1327[/url] - v.' + dio_version + '[/size]' +
                    //'[||][img]'+ imgArray['rev' + (uw.ITowns.getTown(uw.Game.townId).hasConqueror()?1:0)] +'[/img][/**][/table]'+
                    '\n\n[i][b]' + getTexts("labels", "inf", true) + '[/b][/i]' + troop_table +
                    '[table][*]' +
                    '[img]' + imgArray.wall + '[/img][|]\n' +
                    '[img]' + imgArray.tower + '[/img][|]\n' +
                    '[img]' + imgArray.phalanx + '[/img][|]\n' +
                    '[img]' + imgArray.ram + '[/img][|]\n' +
                    ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.commander + '[/img][|]\n' : ' ') +
                    ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.captain + '[/img][|]\n' : ' ') +
                    ($('#f_prm').hasClass("checked") ? '[img]' + imgArray.priest + '[/img][|]\n' : ' ') +
                    ($('#f_sil').hasClass("checked") ? '[center][img]' + imgArray.spy + '[/img][/center][|]\n' : ' ') +
                    '[img]' + imgArray.pop + '[/img][|]\n' +
                    '[img]' + imgArray[(uw.ITowns.getTown(uw.Game.townId).god() || "nogod")] + '[/img][/*]\n' +
                    '[**][center]' + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("wall") + '[/center][||]' +
                    '[center]' + uw.ITowns.getTown(uw.Game.townId).buildings().getBuildingLevel("tower") + '[/center][||]' +
                    '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.phalanx ? '✔️' : '❌') + '[/center][||]' +
                    '[center]' + (uw.ITowns.getTown(uw.Game.townId).researches().attributes.ram ? '✔️' : '❌') + '[/center][||]' +
                    ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.commander >= uw.Timestamp.now()) ? '✔️' : '❌') + '[/center][||]' : ' ') +
                    ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.captain >= uw.Timestamp.now()) ? '✔️' : '❌') + '[/center][||]' : ' ') +
                    ($('#f_prm').hasClass("checked") ? '[center]' + ((uw.Game.premium_features.priest >= uw.Timestamp.now()) ? '✔️' : '❌') + '[/center][||]' : ' ') +
                    ($('#f_sil').hasClass("checked") ? '[center]' + Math.round(uw.ITowns.getTown(uw.Game.townId).getEspionageStorage() / 1000) + 'k[/center][||]' : ' ') +
                    '[center]' + uw.ITowns.getTown(uw.Game.townId).getAvailablePopulation() + '[/center][||]' +
                    '[center]' + $('.favor_amount').get(0).innerHTML + '[/center]' +
                    '[/**][/table]';

                var bb_count_str = parseInt(str.match(/\[/g).length, 10), bb_count_move = 0;

                var i = 0;
                /*if ($('#f_mov').hasClass("checked")) {
                move_table += '\n[i][b]' + getTexts("labels", "mov", true) + '[/b][/i]\n[table]';

                $('#toolbar_activity_commands').mouseover();

                $('#toolbar_activity_commands_list .content .command').each(function () {
                    var cl = $(this).children()[0].className.split(" ");
                    if ((cl[cl.length - 1] === "returning" || cl[cl.length - 1] === "revolt_arising" || cl[cl.length - 1] === "revolt_running") && ((bb_count_str + bb_count_move) < 480)) {
                        move_table += (i % 1) ? "" : "[**]";
                        i++;
                        move_table += "[img]" + imgArray.move_icon + cl[2] + ".png[/img][||]";
                        move_table += getArrivalTime($(this).children()[1].innerHTML) + (uw.Game.market_id === "de" ? " Uhr[||]" : " [||]");
                        move_table += "[town]" + JSON.parse(atob($(this).children()[2].firstChild.href.split("#")[1])).id + "[/town]";
                        move_table += (i % 1) ? "[||]" : "[/**]";
                    }
                    bb_count_move = parseInt(move_table.match(/\[/g).length, 10);
                });
                if ((bb_count_str + bb_count_move) > 480) {
                    move_table += '[**]...[/**]';
                }

                $('#toolbar_activity_commands').mouseout();

                //console.log((bb_count_str + bb_count_move));
                move_table += (i % 1) ? "[/**]" : "";
                move_table += "[*][|][color=#800000][size=6][i] (" + getTexts("labels", "dev", true) + ": ±1s)[/i][/size][/color][/*][/table]\n";
            }*/

                str += move_table + '[img]' + imgArray.bordure + '[/img]\n';

                $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + str + text.substring($(textarea).get(0).selectionEnd));
            });
        } catch (error) { errorHandling(error, "addForm"); }
    }

    function getArrivalTime(duration_time) {
        try {
            var server_time = $('.server_time_area').get(0).innerHTML.split(" ")[0].split(":"), arrival_time, s, m, h;
            duration_time = duration_time.split(":");

            s = parseInt(server_time[2], 10) + parseInt(duration_time[2], 10);
            m = parseInt(server_time[1], 10) + parseInt(duration_time[1], 10) + ((s >= 60) ? 1 : 0);
            h = parseInt(server_time[0], 10) + parseInt(duration_time[0], 10) + ((m >= 60) ? 1 : 0);

            s = s % 60;
            m = m % 60;
            h = h % 24;

            s = ((s < 10) ? "0" : "") + s;
            m = ((m < 10) ? "0" : "") + m;
            h = ((h < 10) ? "0" : "") + h;

            arrival_time = h + ":" + m + ":" + s;

            return arrival_time;

        } catch (error) { errorHandling(error, "getArrivalTime"); }
    }


    /*******************************************************************************************************************************
     * Smiley box
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Display of a smiley selection box for text input fields (forum, messages, notes):
     * | ● Used smileys: http://www.greensmilies.com/smilie-album/
     * | + Own Grepolis smileys
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var smileyArray = {};

    var SmileyBox = {
        loading_error: false, isHalloween: false, isXmas: false, isEaster: false, isLove: false,
        activate: () => {
            $('<style id="dio_smiley">' +
                '.dio_smiley_button { cursor:pointer; margin:3px 2px 2px 2px; } ' +

                '.dio_smiley_box.game { z-index:5000; position:absolute; top:27px; left:410px; min-width:350px; display:none; } ' +

                // Smiley categories
                '.dio_smiley_box .dio_box_header { display: table; width: 100%; text-align:center; } ' +
                '.dio_smiley_box .dio_group { display:table-cell; color: #0c450c; cursor: pointer; font-weight:bold; padding: 0px 2px 0px 2px; } ' +
                '.dio_smiley_box .dio_group.active { color: #089421; text-decoration:underline;} ' +
                '.dio_smiley_box .dio_group:hover { color: #14999E; } ' + // #11AD6C

                // Special smiley categories
                '.dio_smiley_box .halloween { color: #E25E00; } ' +
                '.dio_smiley_box .xmas { color: darkred; } ' +

                '.dio_smiley_box hr { margin:3px 0px 0px 0px; color:#086b18; border:1px solid; } ' +

                // Smilies
                '.dio_smiley_box .dio_box_content { overflow-y: auto !important; max-height: 120px; } ' +
                '.dio_smiley_box .dio_box_content .smiley { border: 1px solid rgba(0,0,0,0); border-radius: 5px;} ' +
                '.dio_smiley_box .dio_box_content .smiley:hover { background: rgba(8, 148, 77, 0.2); border: 1px solid rgba(0, 128, 0, 0.5); } ' +

                // Scrollbar Style: Chrome, opera, safari
                '.dio_smiley_box ::-webkit-scrollbar { width: 13px; } ' +
                '.dio_smiley_box ::-webkit-scrollbar-track { background-color: rgba(130, 186, 135, 0.5); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
                '.dio_smiley_box ::-webkit-scrollbar-thumb { background-color: rgba(87, 121, 45, 0.5); border-radius: 3px; } ' +
                '.dio_smiley_box ::-webkit-scrollbar-thumb:hover { background-color: rgba(87, 121, 45, 0.8); } ' +
                /* Button Up */
                '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:decrement {height: 16px; background-image: url(' + Home_img + 'scroll-up-green.png);} ' +
                '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:decrement:hover {height: 16px; background-image: url(' + Home_img + 'scroll-up-green-hover.png);} ' +
                /* Button Down */
                '.dio_smiley_box ::-webkit-scrollbar-button:single-button:vertical:increment {height: 16px; background-image: url(' + Home_img + 'scroll-down-green.png);} ' +
                '.dio_smiley_box ::-webkit-scrollbar-button:vertical:single-button:increment:hover {height: 16px; background-image: url(' + Home_img + 'scroll-down-green-hover.png);} ' +

                // Smiley page link
                '.dio_smiley_box .box_footer { text-align:center; margin-top:4px; } ' +
                '.dio_smiley_box a:link, .dio_smiley_box a:visited { color: #086b18; font-size: 0.7em; } ' +
                '.dio_smiley_box a:hover { color: #14999E; } ' +

                // TODO Forum ...
                '.dio_smiley_box.forum .dio_box_header_left { float:left; } ' +
                //'.dio_smiley_box.forum .dio_group { padding-right: 10px; } '+
                '.dio_smiley_box.forum .dio_box_header_right { text-align:right; margin-top:2px; } ' +

                '.dio_smiley_box.forum { max-height:90px; margin-left:5px; width:99%; min-height:10px; } ' +
                '.dio_smiley_box.forum .dio_box_content { overflow:overlay; min-height:70px; margin-bottom:10px; } ' +

                '.dio_smiley_box.forum a:link, .dio_smiley_box.forum a:visited { font-size: 1em; } ' +

                '</style>').appendTo('head');


            // Smiley categories
            smileyArray.button = ["rollsmiliey", "smile"];

            smileyArray.standard = [
                "smilenew", "lol", "neutral-new", "afraid", "freddus-pacman", "auslachen2", "kolobok-sanduhr", "bussi2", "winken4", "flucht2", "panik4", "ins-auge-stechen", "seb-zunge", "fluch4-GREEN", "baby-junge2", "blush-reloaded6", "frown", "verlegen", "blush-pfeif", "stevieh-rolleyes", "daumendreh2", "baby-taptap",
                "sadnew", "hust", "confusednew", "idea2", "irre", "irre4", "sleep", "candle", "nicken", "no-sad", "thumbs-up-new", "kciuki", "thumbs-down-new", "bravo2", "oh-no2", "kaffee2", "drunk", "saufen", "freu-dance", "hecheln", "headstand", "rollsmiliey", "eazy-cool01", "motz", "cuinlove", "biggrin"
            ];
            smileyArray.nature = [
                "dinosaurier07", "flu-super-gau", "ben-cat", "schwein", "hundeleine01", "blume", "ben-sharky", "ben-cow", "charly-bissig", "gehirnschnecke-confused", "mttao-fische", "mttao-angler", "insel", "fliegeschnappen", "plapperhase", "ben-dumbo", "twitter", "elefant", "schildkroete", "elektroschocker", "spiderschwein", "oma-sessel-katze", "fred-elefant",
                "palmoel", "stevieh-teddy", "fips-aufsmaul", "marienkaefer", "mrkaktus", "kleeblatt2", "fred-blumenstauss", "hurra-fruehling1-lila", "fred-rasenmaeher", "fred-blumenbeet"

            ];
            smileyArray.grepolis = [
                "grepolis", "mttao-wassermann", "i-lovo-grepolis", "silvester-cuinlove", "mttao-schuetze", "kleeblatt2", "wallbash", "musketiere-fechtend", "palka", "lol-1", "mttao-waage2", "steckenpferd", "skullhaufen", "pferdehaufen", "pirat5", "seb-cowboy", "gw-ranger001",
                "barbar", "datz", "waffe01", "sarazene-bogen", "waffe02", "waffe14", "hoplit-sword1", "pfeildurchkopf02", "saladin", "hoplit-sword3"
            ];
            smileyArray.people = [
                "greenistan", "mttao-usa", "schal-usa", "mttao-grossbritannien", "seb-hut5", "opa-boese2", "star-wars-yoda1-gruen", "hexefliegend", "snob", "seb-detektiv-ani", "devil", "segen", "borg", "hexe3b", "eazy-polizei", "stars-elvis", "mttao-chefkoch", "nikolaus", "pirate3-biggrin", "batman-skeptisch", "tubbie1", "tubbie2", "tubbie3", "kosmita", "tubbie4"
            ];
            smileyArray.Party = [
                "torte1", "torte3", "bier", "party", "party2", "fans", "band", "klokotzen", "laola", "prost", "rave", "mcdonalds", "margarita", "geschenk", "sauf", "el", "trommler", "ozboss-gitarre2", "kaffee", "kaffee3", "caipirinha", "whiskey", "drunk", "fressen", "popcorn-essen", "saufen", "energydrink1", "leckerer", "prost2", "birthday"
            ];
            smileyArray.other = [
                "steinwerfen", "herzen02", "scream-if-you-can", "kolobok", "headbash", "liebeskummer", "bussi", "brautpaar-reis", "grab-schaufler2", "boxen2", "aufsmaul", "mttao-kehren", "sm", "weckruf", "klugscheisser2", "karte2-rot", "dagegen", "party", "dafuer", "outofthebox", "pokal-gold", "koepfler", "transformer", "eazy-senseo1"
            ];

            // TODO: HolidayChecker benutzen!
            SmileyBox.checkHolidaySeason();

            if (SmileyBox.isHalloween) {
                smileyArray.halloween = [
                    "zombies-alien", "zombies-lol", "zombies-rolleyes", "zombie01", "zombies-smile", "zombie02", "zombies-skeptisch", "zombies-eek", "zombies-frown", "geistani", "scream-if-you-can", "pfeildurchkopf01", "grab-schaufler", "kuerbisleuchten", "mummy3",
                    "kuerbishaufen", "halloweenskulljongleur", "fledermausvampir", "frankenstein-lol", "halloween-confused", "zombies-razz", "halloweenstars-freddykrueger", "zombies-cool", "geist2", "fledermaus2", "halloweenstars-dracula", "batman", "halloweenstars-lastsummer"
                ];
            }
            if (SmileyBox.isXmas) {
                smileyArray.xmas = [
                    "i-love-grepolis", "santagrin", "xmas1-down", "xmas1-thumbs1", "xmas2-lol", "xmas1-frown", "xmas1-irre", "xmas1-razz", "xmas4-kaffee2", "xmas4-hurra2", "xmas4-aufsmaul", "schneeball", "schneeballwerfen", "xmas4-advent4", "nikolaus", "weihnachtsmann-junge", "schneewerfen-wald", "weihnachtsmann-nordpol", "xmas-kilroy-kamin",
                    "xmas4-laola", "xmas3-smile", "xmas4-paketliebe", "3hlkoenige", "santa", "weihnachtsgeschenk2", "fred-weihnachten-ostern", "xmas4-wallbash", "xmas4-liebe", "xmas4-skullhaufen"
                ];
            }
            if (SmileyBox.isEaster) {
                smileyArray.easter = [
                    "eier-bemalen-blau-hase-braun", "osterei-hase05", "osterei-bunt", "ostern-hurra2", "osterhasensmilie", "ostern-thumbs1", "ostern-nosmile", "ostern-lol", "ostern-irre", "ostern-frown", "ostern-down", "ostern-cuinlove", "ostern-confused", "ostern-blush", "ostern-biggrin"
                ];
            }
            if (SmileyBox.isLove) {
                smileyArray.love = [
                    "b-love2", "brautpaar-kinder", "brautpaar-reis", "cuinlove", "fips-herzen01", "heart", "herzen01", "herzen02", "herzen06", "kiss", "klk-tee", "liebesflagge", "love", "lovelove-light", "rose", "send-out-love", "teeglas-fruechtetee", "unknownauthor-knutsch", "valentinstag-biggrin", "valentinstag-confused",
                    "valentinstag-down", "valentinstag-irre", "valentinstag-lol", "valentinstag-thumbs1", "wolke7"
                ];
            }

            SmileyBox.loadSmileys();
        },
        deactivate: () => {
            $('#dio_smiley').remove();
        },
        checkHolidaySeason: () => {
            // Halloween-Smileys ->21 days
            SmileyBox.isHalloween = dio.daystamp(295, 316); // 21. Oktober (295) / 12. November (316)
            // Xmas-Smileys -> 28 days
            SmileyBox.isXmas = dio.daystamp(334, 361); // 1. Dezember (334) / 28. Dezember (361)
            // Easter-Smileys -> 23 days
            SmileyBox.isEaster = dio.daystamp(88, 110); // 30. march (88) / 21. april (110)
            // Valentine's Day-Smileys -> 11 days
            SmileyBox.isLove = dio.daystamp(37, 50); // 9. february (37) / 20. february (50)
        },
        // preload images
        loadSmileys: () => {
            try {
                // Replace german sign smilies
                if (MID == "de") {
                    smileyArray.standard[-1] = "land-germany";
                    smileyArray.standard[-2] = "land-germany2";
                    smileyArray.standard[-3] = "land-germany3";
                    smileyArray.standard[-4] = "land-germany-kings";
                    smileyArray.people[2] = "mttao-deutschland";
                    smileyArray.people[3] = "schal-deutschland";
                    smileyArray.other[-1] = "dagegen2";
                    smileyArray.other[-2] = "dafuer2";
                }
                if (MID == "fr") {
                    smileyArray.people[2] = "mttao-frankreich";
                    smileyArray.people[3] = "schal-frankreich";
                    smileyArray.standard[-1] = "land-france";
                    smileyArray.standard[-2] = "land-france2";
                    smileyArray.standard[-3] = "land-france3";
                }
                if (MID == "it") {
                    smileyArray.people[2] = "mttao-italien";
                    smileyArray.people[3] = "schal-italien";
                    smileyArray.standard[-1] = "land-italy";
                    smileyArray.standard[-2] = "land-italy2";
                    smileyArray.standard[-3] = "land-italy3";
                }
                if (MID == "ro") {
                    smileyArray.people[3] = "mttao-rumaenien";
                    smileyArray.standard[-1] = "land-romania";
                    smileyArray.standard[-2] = "land-romania2";
                    smileyArray.standard[-3] = "land-romania3";
                }
                if (MID == "br") {
                    smileyArray.people[2] = "mttao-portugal";
                    smileyArray.people[3] = "schal-portugal";
                    smileyArray.standard[-1] = "land-portugal";
                    smileyArray.standard[-2] = "land-portugal2";
                    smileyArray.standard[-3] = "land-portugal3";
                }
                if (MID == "pl") {
                    smileyArray.people[3] = "mttao-polen";
                    smileyArray.standard[-1] = "land-poland";
                    smileyArray.standard[-2] = "land-poland2";
                    smileyArray.standard[-3] = "land-poland3";
                }
                if (MID == "es") {
                    smileyArray.people[2] = "mttao-spanien";
                    smileyArray.people[3] = "schal-spanien";
                    smileyArray.standard[-1] = "land-spain";
                    smileyArray.standard[-2] = "land-spain2";
                    smileyArray.standard[-3] = "land-spain3";
                }
                if (MID == "sk") {
                    smileyArray.people[2] = "mttao-slowakei";
                    smileyArray.people[3] = "schal-slowakei";
                }

                for (var e in smileyArray) {
                    if (smileyArray.hasOwnProperty(e)) {
                        for (var f in smileyArray[e]) {
                            if (smileyArray[e].hasOwnProperty(f)) {
                                var src = smileyArray[e][f];

                                smileyArray[e][f] = new Image();
                                smileyArray[e][f].className = "smiley";

                                if (src.substring(0, 2) == "i/") {
                                    smileyArray[e][f].src = Home_img + "smiley-emoticons-" + src + ".gif";
                                } else {
                                    if (SmileyBox.loading_error == false) {
                                        smileyArray[e][f].src = Home_img + "smiley-emoticons-" + src + ".gif";
                                        //console.debug("Smiley", e);
                                    } else {
                                        smileyArray[e][f].src = 'https://i.imgur.com/VdjJJgk.gif';
                                    }
                                }
                                smileyArray[e][f].onerror = function () {
                                    this.src = 'https://i.imgur.com/VdjJJgk.gif';
                                };
                            }
                        }
                    }
                }
            } catch (error) { errorHandling(error, "SmileyBox (loadSmileys)"); }
        },
        // add smiley box
        add: (e) => {
            try {
                var bbcodeBarId = "";
                switch (e) {
                    case "/alliance_forum/forum":
                        bbcodeBarId = "#forum";
                        break;
                    case "/message/forward":
                        bbcodeBarId = "#message_bbcodes";
                        break;
                    case "/message/new":
                        bbcodeBarId = "#message_bbcodes";
                        break;
                    case "/message/view":
                        bbcodeBarId = "#message_bbcodes";//setWonderIconsOnMap
                        break;
                    case "/player_memo/load_memo_content":
                        bbcodeBarId = "#memo_edit"; // old notes
                        break;
                    case "/frontend_bridge/fetch":
                        bbcodeBarId = ".notes_container"; // TODO: new notes
                        break;
                }
                if (($(bbcodeBarId + ' #emots_popup_7').get(0) || $(bbcodeBarId + ' #emots_popup_15').get(0)) && (PID == 1538932 || PID === 100144)) {
                    $(bbcodeBarId + " .bb_button_wrapper").get(0).lastChild.remove();
                }
                if (!$(bbcodeBarId + ' .bb_button_wrapper .dio_smiley_button').get(0)) {
                    $('<img title="' + getTexts("Options", "sml")[0] + ' DIO-TOOLS-David1327" class="dio_smiley_button" src="' + Home_img + 'smiley-emoticons-smile.gif">').appendTo(bbcodeBarId + ' .bb_button_wrapper');
                }

                $('<div class="dio_smiley_box game">' +
                    '<div class="bbcode_box middle_center"><div class="bbcode_box middle_right"></div><div class="bbcode_box middle_left"></div>' +
                    '<div class="bbcode_box top_left"></div><div class="bbcode_box top_right"></div><div class="bbcode_box top_center"></div>' +
                    '<div class="bbcode_box bottom_center"></div><div class="bbcode_box bottom_right"></div><div class="bbcode_box bottom_left"></div>' +
                    '<div class="dio_box_header">' +
                    '<span class="dio_group standard active">' + getTexts("labels", "std") + '</span>' +
                    '<span class="dio_group grepolis">' + getTexts("labels", "gre") + '</span>' +
                    '<span class="dio_group nature">' + getTexts("labels", "nat") + '</span>' +
                    '<span class="dio_group people">' + getTexts("labels", "ppl") + '</span>' +
                    '<span class="dio_group Party">' + getTexts("labels", "Par") + '</span>' +
                    '<span class="dio_group ' + (SmileyBox.isHalloween ? 'halloween' : (SmileyBox.isXmas ? 'xmas' : (SmileyBox.isEaster ? 'easter' : (SmileyBox.isLove ? 'love' : 'other')))) +
                    '">' + getTexts("labels", (SmileyBox.isHalloween ? 'hal' : (SmileyBox.isXmas ? 'xma' : (SmileyBox.isEaster ? 'eas' : (SmileyBox.isLove ? 'lov' : 'oth'))))) + '</span>' +
                    '</div>' +
                    '<hr>' +
                    '<div class="dio_box_content"></div>' +
                    '<hr>' +
                    '<div class="box_footer">' + getTexts("Options", "sml")[0] + ' DIO-TOOLS-David1327</div>' +
                    /*'<div class="box_footer"><a href="http://www.greensmilies.com/smilie-album/" target="_blank">WWW.GREENSMILIES.COM</a></div>' +*/
                    '</div>').appendTo(bbcodeBarId + ' .bb_button_wrapper');


                $(bbcodeBarId + ' .dio_group').click(function () {
                    $('.dio_group.active').removeClass("active");
                    $(this).addClass("active");
                    // Change smiley group
                    SmileyBox.addSmileys(this.className.split(" ")[1], "#" + $(this).closest('.bb_button_wrapper').parent().get(0).id);
                });

                SmileyBox.addSmileys("standard", bbcodeBarId);

                // smiley box toggle
                $(bbcodeBarId + " .dio_smiley_button").toggleClick(
                    function () {
                        this.src = smileyArray.button[0].src;
                        $(this).closest('.bb_button_wrapper').find(".dio_smiley_box").get(0).style.display = "block";
                    },
                    function () {
                        this.src = smileyArray.button[1].src;
                        $(this).closest('.bb_button_wrapper').find(".dio_smiley_box").get(0).style.display = "none";
                    }
                );
            } catch (error) { errorHandling(error, "SmileyBox (add)"); }
        },
        // insert smileys from arrays into smiley box
        addSmileys: (type, bbcodeBarId) => {
            try {
                // reset smilies
                if ($(bbcodeBarId + " .dio_box_content").get(0)) {
                    $(bbcodeBarId + " .dio_box_content").get(0).innerHTML = '';
                }
                // add smilies
                for (var e in smileyArray[type]) {
                    if (smileyArray[type].hasOwnProperty(e)) {
                        $(smileyArray[type][e]).clone().appendTo(bbcodeBarId + " .dio_box_content");
                        //$('<img class="smiley" src="' + smileyArray[type][e].src + '" alt="" />').appendTo(bbcodeBarId + " .dio_box_content");
                    }
                }
                $('.smiley').css({ margin: '0px', padding: '2px', maxHeight: '35px', cursor: 'pointer' });

                $(bbcodeBarId + " .dio_box_content .smiley").click(function () {
                    var textarea;
                    if (uw.location.pathname.indexOf("game") >= 0) {
                        // hide smiley box
                        $(this).closest('.bb_button_wrapper').find(".dio_smiley_button").click();
                        // find textarea
                        textarea = $(this).closest('.gpwindow_content').find("textarea").get(0);
                    } else {

                        if ($('.editor_textbox_container').get(0)) {
                            textarea = $('.editor_textbox_container .cke_contents textarea').get(0);
                        } else {
                            $(this).appendTo('iframe .forum');
                        }
                    }
                    var text = $(textarea).val();
                    $(textarea).val(text.substring(0, $(textarea).get(0).selectionStart) + "[img]" + this.src + "[/img]" + text.substring($(textarea).get(0).selectionEnd));
                });
            } catch (error) { errorHandling(error, "SmileyBox (addSmileys)"); }
        }
    };

    /*******************************************************************************************************************************
     * Favor Popup
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Improved favor popup
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var FavorPopup = {
        godArray: {
            zeus: 'zeus',
            athena: 'athena',
            poseidon: 'poseidon',
            hera: 'hera',
            hades: 'hades',
            artemis: 'artemis',
            aphrodite: 'aphrodite',
            ares: 'ares',
        },
        activate: () => {
            $('.gods_area').bind('mouseover', function () { FavorPopup.setFavorPopup(); });

            //Update 2.231
            $('<div id="dio_FavorPopup" style="width: 100px; height: 33px; position: absolute; left: 35px; top: 2px;"></div>').appendTo('.gods_favor_amount');
            $('<div id="dio_FuryPopup" class="fury_amount" style="width: 67px; height: 33px; position: absolute; right: 50px; top: 2px;"></div>').appendTo('.gods_favor_amount');
        },
        setFavorPopup: () => {
            try {
                var pic_row = "", fav_row = "", prod_row = "", tooltip_str, textColor, tooltip_fury;

                for (var g in FavorPopup.godArray) {
                    if (FavorPopup.godArray.hasOwnProperty(g)) {
                        if (uw.ITowns.player_gods.attributes.temples_for_gods[g]) {
                            pic_row += '<td><div style="transform:scale(0.8); margin: -6px;"; class="god_mini ' + [g] + '";></td>';
                            textColor = ((uw.ITowns.player_gods.attributes[g + "_favor"]) == uw.ITowns.player_gods.attributes.max_favor) ? textColor = "color:red;" : textColor = "color:blue";
                            fav_row += '<td class="bold" style="' + textColor + '">' + uw.ITowns.player_gods.attributes[g + "_favor"] + '</td>';
                            prod_row += '<td class="bold">' + uw.ITowns.player_gods.attributes.production_overview[g].production + '</td>';
                        }
                    }
                }

                var fury_row = ""
                var fury_max = uw.ITowns.player_gods.attributes.max_fury

                textColor = ((uw.ITowns.player_gods.attributes.fury) == fury_max) ? textColor = "color:red;" : textColor = "color:blue";
                fury_row = '<td class="bold" style="' + textColor + '">' + uw.ITowns.player_gods.attributes.fury + '/' + fury_max + '</td>';

                tooltip_str = $('<div id"tooltip"><table><tr><td><div class="dio_icon b" style="opacity: 0.30; width: 35px; height: 35px;"></td>' + pic_row + '</tr>' +
                    '<tr align="center"><td><img src="https://gpall.innogamescdn.com/images/game/res/favor.png"></td>' + fav_row + '</tr>' +
                    '<tr align="center"><td>+</td>' + prod_row + '</tr>' +
                    '</table></div>');

                tooltip_fury = $('<div id"tooltip"><table><tr align="center"><td><img src="' + Home_img + 'fury.png"></td>' + fury_row + '</tr></table></div>');

                //Update 2.231
                $('#dio_FavorPopup').tooltip(tooltip_str);
                $('#dio_FuryPopup').tooltip(tooltip_fury);
            } catch (error) { errorHandling(error, "FavorPopup (setFavorPopup)"); }
        },
        deactivate: () => {
            $('.gods_area').unbind('mouseover');
            $('#dio_FavorPopup').remove();
            $('#dio_FuryPopup').remove();
            $('#dio-amount').remove();
        },
    };

    /*******************************************************************************************************************************
     * GUI Optimization
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Minimize daily reward-window on startup
     * | ● Larger taskbar
     * | ● Improved display of troops and trade activity boxes (movable with position memory on startup)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    // Minimize Daily reward window on startup
    var Reward = {
        activate: () => {
            if (MutationObserver) {
                var startup = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.addedNodes[0]) {
                            if ($('.daily_login').get(0)) { //  && !uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_SHOW_ON_LOGIN).isMinimized()
                                $('.daily_login').find(".minimize").click();
                                //uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_SHOW_ON_LOGIN).minimize();
                            }
                        }
                    });
                });
                startup.observe($('body').get(0), { attributes: false, childList: true, characterData: false });

                setTimeout(function () {
                    startup.disconnect();
                }, 3000);
            }
        },
        deactivate: () => {
        },
    };

    // Larger taskbar
    var Taskbar = {
        activate: () => {
            $('.minimized_windows_area').get(0).style.width = "150%";
            $('.minimized_windows_area').get(0).style.left = "-25%";
        },
        deactivate: () => {
            $('.minimized_windows_area').get(0).style.width = "100%";
            $('.minimized_windows_area').get(0).style.left = "0%";
        }
    };

    /*******************************************************************************************************************************
     * Activity boxes
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Show troops and trade activity boxes
     * | ● Boxes are magnetic & movable (position memory)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var ActivityBoxes = {
        activate: () => {
            try {
                $("#toolbar_activity_recruits_list").hover(
                    function () {
                        if ($("#dio_plusmenuRecruits").length == 0) {
                            $("#toolbar_activity_recruits_list").append('<div id="dio_plusmenuRecruits" class="dio_plusmenu"><div id="dio_plusdraghandleRecruits" class="dio_plusdraghandle"></div><a class="dio_plusback"></a></div>');
                            $('#dio_plusmenuRecruits .dio_plusback').click(() => { dio_plus_destroy("dio_plusmenuRecruits"); });
                        }
                    }, function () { $('#dio_plusmenuRecruits').remove(); }
                );
                /*$("#toolbar_activity_commands_list").hover(
                function () {
                if ($("#dio_plusmenuCommands").length == 0) {
                    $("#toolbar_activity_commands_list").append('<div id="dio_plusmenuCommands" class="dio_plusmenu"><div id="dio_plusdraghandleCommands" class="dio_plusdraghandle"></div><a class="dio_plusback"></a></div>');
                    $('#dio_plusmenuCommands .dio_plusback').click(() => {
                        dio_plus_destroy("dio_plusmenuCommands");
                    });
                }
            }, function () {
                $('#dio_plusmenuCommands').remove();
            });*/
                $("#toolbar_activity_trades_list").hover(
                    function () {
                        if ($("#dio_plusmenuTrades").length == 0) {
                            $("#toolbar_activity_trades_list").append('<div id="dio_plusmenuTrades" class="dio_plusmenu"><div id="dio_plusdraghandleTrades" class="dio_plusdraghandle"></div><a class="dio_plusback"></a></div>');
                            $('#dio_plusmenuTrades .dio_plusback').click(() => {
                                dio_plus_destroy("dio_plusmenuTrades");
                            });
                        }
                    }, function () { $('#dio_plusmenuTrades').remove(); }
                );
                $("#toolbar_activity_temple_commands_list").hover(
                    function () {
                        if ($("#dio_plusmenuTemple_commands").length == 0) {
                            $("#toolbar_activity_temple_commands_list").append('<div id="dio_plusmenuTemple_commands" class="dio_plusmenu"><div id="dio_plusdraghandleTemple_commands" class="dio_plusdraghandle"></div><a class="dio_plusback"></a></div>');
                            $('#dio_plusmenuTemple_commands .dio_plusback').click(() => {
                                dio_plus_destroy("dio_plusmenuTemple_commands");
                            });
                        }
                    }, function () { $('#dio_plusmenuTemple_commands').remove(); }
                );

                $('<style id="dio_plusmenustyle" type="text/css">' +
                    '.displayImp {display: block !important;}' +
                    '.dio_plusmenu {margin:6px 22px 2px 5px;height:11px;display:block;position:relative;}' +
                    '.dio_plusdraghandle {cursor:-webkit-grab; width:100%;height:11px;position:absolute;background:url(' + Home_img + 'draghandle.png)}' +
                    '.dio_plusback {right:-18px;margin-top:-1px;width:16px;height:12px;position:absolute;background:url(' + Home_img + 'plusback.png)}' +
                    '#toolbar_activity_recruits_list {min-width: 113px;}' +
                    '.dropdown-list .item_no_results, .dropdown-list.ui-draggable>div {cursor:text!important;}' +
                    '</style>').appendTo('head');

                $('#toolbar_activity_recruits_list').draggable({
                    cursor: "move",
                    handle: ".dio_plusdraghandle",
                    start: function () {
                        $("#dio_plusmenuRecruitsSTYLE").remove();
                        $('#toolbar_activity_recruits_list').addClass("displayImp");
                    },
                    stop: function () {
                        var dio_position = $('#toolbar_activity_recruits_list').position();
                        $('<style id="dio_plusmenuRecruitsSTYLE" type="text/css">#toolbar_activity_recruits_list {left: ' + dio_position.left + 'px !important;top: ' + dio_position.top + 'px !important}</style>').appendTo('head');
                    }
                });
                /*$('#toolbar_activity_commands_list').draggable({
                cursor : "move",
                handle : ".dio_plusdraghandle",
                start : function () {
                    $("#dio_plusmenuCommandsSTYLE").remove();
                    $('#toolbar_activity_commands_list').addClass("displayImp");
                },
                stop : function () {
                    var dio_position = $('#toolbar_activity_commands_list').position();
                    $('<style id="dio_plusmenuCommandsSTYLE" type="text/css">#toolbar_activity_commands_list {left: ' + dio_position.left + 'px !important;top: ' + dio_position.top + 'px !important}</style>').appendTo('head');
                }
            });*/
                $('#toolbar_activity_trades_list').draggable({
                    cursor: "move",
                    handle: ".dio_plusdraghandle",
                    start: function () {
                        $("#dio_plusmenuTradesSTYLE").remove();
                        $('#toolbar_activity_trades_list').addClass("displayImp");
                    },
                    stop: function () {
                        var dio_position = $('#toolbar_activity_trades_list').position();
                        $('<style id="dio_plusmenuTradesSTYLE" type="text/css">#toolbar_activity_trades_list {left: ' + dio_position.left + 'px !important;top: ' + dio_position.top + 'px !important}</style>').appendTo('head');
                    }
                });
                $('#toolbar_activity_temple_commands_list').draggable({
                    cursor: "move",
                    handle: ".dio_plusdraghandle",
                    start: function () {
                        $("#dio_plusmenuTemple_commandsSTYLE").remove();
                        $('#toolbar_activity_temple_commands_list').addClass("displayImp");
                    },
                    stop: function () {
                        var dio_position = $('#toolbar_activity_temple_commands_list').position();
                        $('<style id="dio_plusmenuTemple_commandsSTYLE" type="text/css">#toolbar_activity_temple_commands_list {left: ' + dio_position.left + 'px !important;top: ' + dio_position.top + 'px !important}</style>').appendTo('head');
                    }
                });

                function dio_plus_destroy(dioJQselector) {
                    /*if (dioJQselector == "dio_plusmenuCommands") {
                    $('#toolbar_activity_commands_list').hide();
                    $('#toolbar_activity_commands_list').on("mouseleave", function () {
                        $('#toolbar_activity_commands_list').hide();
                    });
                    $('#toolbar_activity_recruits, #toolbar_activity_trades').on("mouseenter", function () {
                        $('#toolbar_activity_commands_list').hide();
                    });
                }*/
                    $("#" + dioJQselector).parent().removeClass("displayImp");
                    $("#" + dioJQselector + "STYLE").remove();
                }
            } catch (error) { errorHandling(error, "ActivityBoxes"); }
        },
        deactivate: () => {// toolbar_activity_temple_commands
            $('#dio_plusmenustyle').remove();

            $('#dio_plusmenuRecruits').remove();
            $("#dio_plusmenuRecruitsSTYLE").remove();

            //$('#dio_plusmenuCommands').remove();
            //$("#dio_plusmenuCommandsSTYLE").remove();

            $('#dio_plusmenuTrades').remove();
            $('#dio_plusmenuTradesSTYLE').remove();

            $('#dio_plusmenuTemple_commands').remove();
            $("#dio_plusmenuTemple_commandsSTYLE").remove();

            $('#toolbar_activity_recruits_list').click(() => {
                dio_plus_destroy("dio_plusmenuRecruits");
            });
            $('#toolbar_activity_trades_list').click(() => {
                dio_plus_destroy("dio_plusmenuTrades");
            });
            $('#toolbar_activity_temple_commands_list').click(() => {
                dio_plus_destroy("dio_plusmenuTemple_commands");
            });

            function dio_plus_destroy(dioJQselector) {
                $("#" + dioJQselector).parent().removeClass("displayImp");
                $("#" + dioJQselector + "STYLE").remove();
            }
        },
    };

    /*******************************************************************************************************************************
     * BBCode
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Town BBCode : Adds the town bbcode to the town tab
     * | ● BBcode button Player Info : Addition of a BBcode button (player and alliance)
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var Townbb = {
        activate: () => {
            Townbb.addButton();

            // Style
            $('<style id="dio_townbb_style"> ' +
                // Button
                '#dio_townbb { background: url("' + Home_img + 'logo-grepolis.png") -23px 0px!important; position:absolute; height: 22px; width: 21px; top:26px; left:184px; z-index:5002; } ' +
                '#dio_townbb:hover { background: url("' + Home_img + 'logo-grepolis.png") -23px -23px!important; position:absolute; height: 22px; width: 21px; top:26px; left:184px; z-index:5002; } ' +
                '#dio_townbb_logo { background: url("' + Home_img + 'logo-vile-2.png"); position: absolute; height: 30px; width: 30px; left:180px; top:27px; z-index:5001; } ' +
                // Style
                '#input_townbb { background-color: #ffe2a0; display: none; position: absolute; left: 23px; top: 29px; width: 153px; height: 12px; text-align: center; z-index: 6; } ' +
                // clipboard
                '#dio_townbb-clipboard { background: url(' + Home_img + 'icon-add-to-clipboard.png); background-size: 99%; position:absolute; height: 18px; width: 18px; z-index: 6; top:29px ;left: 167px; display: none;} ' +
                '</style>').appendTo("head");
        },
        deactivate: () => {
            $('#dio_townbb').remove();
            $('#dio_townbb_style').remove();
            $('#input_townbb').remove();
        },
        addButton: () => {
            try {
                $('<a id="dio_townbb"></a><input id="input_townbb" type="text" onfocus="this.select();" onclick="this.select();"><div id="dio_townbb_logo"></div>').appendTo('.town_name_area');
                $('<a id="dio_townbb-clipboard" data-clipboard-action="cut" data-clipboard-target="#input_townbb"></a>').appendTo('.town_name_area').tooltip(dio_icon + getTexts("messages", "copy"));
                $("#dio_townbb").click(() => {
                    $('#dio_townbb-clipboard').toggle();
                    $("#input_townbb").toggle();
                    $("#input_townbb").val("[town]" + uw.Game.townId + "[/town]");
                });

                // clipboard
                setTimeout(() => {
                    dio.clipboard('#dio_townbb-clipboard', '#input_townbb', "Townbb (addButton clipboard)", null);
                }, 2000)

                // Tooltip
                $('#dio_townbb').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("market").city);
                $('#dio_townbb-clipboard').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("market").city);
            } catch (error) { errorHandling(error, "Townbb (addButton)"); }
        },
    };

    /*******************************************************************************************************************************
     * ● BBcode button Player Info : Addition of a BBcode button (player and alliance)
     *******************************************************************************************************************************/

    var BBtowninfo = {
        activate: () => {

            if ($('.dio_BBplayer').get(0)) { $('div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img, div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix').css({ "padding-left": "23px" }); }
            $('<style id="dio_BBtowninfo_style"> ' +
                // Button
                '.dio_BBplayer { background: url(https://gpfr.innogamescdn.com/images/game/autogenerated/common/bbcodes/bbcodes_6e4f630.png) no-repeat -207px -28px; height: 22px; width: 21px; } ' +
                '.dio_BBalliance { background: url(https://gpfr.innogamescdn.com/images/game/autogenerated/common/bbcodes/bbcodes_6e4f630.png) no-repeat -207px -5px; height: 22px; width: 21px; } ' +
                // clipboard
                '.dio_clipboard-player { background: url(' + Home_img + 'icon-add-to-clipboard.png) #ffedc5; background-size: 99%; position:absolute; height: 18px; width: 18px; z-index: 553; display: none;} ' +
                '.dio_clipboard-alliance { background: url(' + Home_img + 'icon-add-to-clipboard.png) #ffe9b7; background-size: 99%; position:absolute; height: 18px; width: 18px; z-index: 553; display: none;} ' +
                '.dio_clipboard-town { background: url(' + Home_img + 'icon-add-to-clipboard.png) #ffe9b7; background-size: 99%; position:absolute; height: 18px; width: 18px; z-index: 553; display: none;} ' +
                // Style (text)
                '.input_BBplayer { background-color: #ffe2a0; display: none; position: absolute; width: 180px; height: 14px; text-align: center; z-index: 554; } ' +
                '.input_BBalliance { background-color: #ffe2a0; display: none; position: absolute; width: 180px; height: 14px; text-align: center; z-index: 554; } ' +
                '#town_bbcode_id { background-color: #ffe2a0; } ' +

                '</style>').appendTo("head");
        },
        profile: () => {
            try {
                var c = dio.wndId;
                BBtowninfo.add(c);

                var grcrt = false, num = 2;
                //grcrt ?
                if (typeof (uw.GRCRT_Notifications) !== "undefined") { grcrt = true; num += 2; }
                //Mole Hole ?
                if (typeof (uw.mhCol) !== "undefined") { num += 1; }

                // Function
                if (!$('#dio_gpwnd_' + c + '_BBplayer').get(0)) {

                    // BBCode player
                    $('<a id="dio_gpwnd_' + c + '_BBplayer" class="dio_BBplayer" style="float: left; margin-right: 2px;"></a><input id="input_gpwnd_' + c + '_BBplayer" class="input_BBplayer" style="top:25px;' + (grcrt ? "left: 63px;" : "left: 40px;") + '" type="text" onfocus="this.select();" onclick="this.select();"></div>').appendTo("div#gpwnd_" + c + " div#player_info h3");
                    $('<a id="dio_gpwnd_' + c + '_clipboard-player" class="dio_clipboard-player" style="top:27px;' + (grcrt ? "left: 249px;" : "left: 226px;") + '" data-clipboard-target="#input_gpwnd_' + c + '_BBplayer"></a>').appendTo("div#gpwnd_" + c + " div#player_info h3").tooltip(dio_icon + getTexts("messages", "copy"));
                    $('#dio_gpwnd_' + c + '_BBplayer').click(() => {
                        $('#dio_gpwnd_' + c + '_clipboard-player').toggle();
                        $('#input_gpwnd_' + c + '_BBplayer').toggle();
                        $('#input_gpwnd_' + c + '_BBplayer').val("[player]" + $("div#gpwnd_" + c + " div#player_info h3").text().trim() + "[/player]");
                    });

                    // BBCode alliance
                    if ($("div#gpwnd_" + c + " div#player_info a").text().trim() !== "") {
                        $("div#gpwnd_" + c + " div#player_info div#player_points").before('<a id="dio_gpwnd_' + c + '_BBalliance" class="dio_BBalliance" style="position: relative; top: -2px; float: left; margin-right: 1px; left: -1px;"></a><input id="input_gpwnd_' + c + '_BBalliance" class="input_BBalliance" style="top:50px;' + (grcrt ? "left: 63px;" : "left: 40px;") + '" onclick="this.select();" onfocus="this.select();"></div>');
                        $("div#gpwnd_" + c + " div#player_info div#player_points").after('<a id="dio_gpwnd_' + c + '_clipboard-alliance" class="dio_clipboard-alliance" style="top:51px;' + (grcrt ? "left: 249px;" : "left: 226px;") + '" data-clipboard-target="#input_gpwnd_' + c + '_BBalliance"></a>');
                        $('#dio_gpwnd_' + c + '_BBalliance').click(() => {
                            $('#dio_gpwnd_' + c + '_clipboard-alliance').toggle();
                            //alliance name ?
                            var text = $("div#gpwnd_" + c + " div#player_info.bold")[0].children[num].attributes[2].textContent,
                                re = /Layout.allianceProfile.open\('(.*?)',(.*?)\)/mg,
                                alliance_id = text.replace(re, "$2"); var alliance_name = text.replace(re, "$1").replace(/\\/mg, "");
                            $('#input_gpwnd_' + c + '_BBalliance').toggle();
                            $('#input_gpwnd_' + c + '_BBalliance').val("[ally]" + alliance_name + "[/ally]");
                        });
                    }
                };
                // Tooltip
                $('#dio_gpwnd_' + c + '_BBplayer').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("bbcodes").player.name);
                $('#dio_gpwnd_' + c + '_BBalliance').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("bbcodes").ally.name);
                $('#dio_gpwnd_' + c + '_clipboard-alliance').tooltip(dio_icon + getTexts("messages", "copy"));
            } catch (error) { errorHandling(error, "BBtowninfo (profile)"); }
        },
        towninfo: (c) => {
            try {
                BBtowninfo.add(c);

                var MH = false;
                if (typeof (uw.mhCol) !== "undefined") {
                    MH = true;
                    $('div#gpwnd_' + c + ' #town_bbcode_id').css({ "margin-right": "22px" });
                }

                // Function
                if (!$('#dio_gpwnd_' + c + '_BBplayer').get(0)) {
                    $('div#gpwnd_' + c + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img, div#gpwnd_' + c + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix').css({ "padding-left": "23px" });

                    // BBCode player
                    if ($("div#gpwnd_" + c + " div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even div.list_item_left a.gp_player_link").is(':visible')) {
                        $('<a id="dio_gpwnd_' + c + '_BBplayer" class="dio_BBplayer" style="top:1px ;left: 0px; position:absolute;"></a><input id="input_gpwnd_' + c + '_BBplayer" class="input_BBplayer" style="left: 20px; top: 3px;" onfocus="this.select();" onclick="this.select();"></div>').appendTo('div#gpwnd_' + c + ' div#info_tab_content li.even div.list_item_left');
                        $('<a id="dio_gpwnd_' + c + '_clipboard-player" class="dio_clipboard-player" style="top:4px ; left: 206px;" data-clipboard-target="#input_gpwnd_' + c + '_BBplayer"></a>').appendTo('div#gpwnd_' + c + ' div#info_tab_content li.even div.list_item_left').tooltip(dio_icon + getTexts("messages", "copy"));
                        $('#dio_gpwnd_' + c + '_BBplayer').click(() => {
                            $('#dio_gpwnd_' + c + '_clipboard-player').toggle();
                            $('#input_gpwnd_' + c + '_BBplayer').toggle();
                            $('#input_gpwnd_' + c + '_BBplayer').val("[player]" + $("div#gpwnd_" + c + " div#info_tab_content li.even div.list_item_left a.gp_player_link").text().trim() + "[/player]");
                        });

                        // BBCode alliance
                        $('<a id="dio_gpwnd_' + c + '_BBalliance" class="dio_BBalliance" style="top: 1px; left: 0px; position: absolute;"></a><input id="input_gpwnd_' + c + '_BBalliance" class="input_BBalliance" style="left: 20px; top: 3px;" onclick="this.select();" onfocus="this.select();"></div>').appendTo('div#gpwnd_' + c + ' ul.game_list li.odd.clearfix');
                        $('<a id="dio_gpwnd_' + c + '_clipboard-alliance" class="dio_clipboard-alliance" style="top:4px ; left: 206px;" data-clipboard-target="#input_gpwnd_' + c + '_BBalliance"></a>').appendTo('div#gpwnd_' + c + ' div#info_tab_content li.odd.clearfix').tooltip(dio_icon + getTexts("messages", "copy"));
                        $('#dio_gpwnd_' + c + '_BBalliance').click(() => {
                            $('#dio_gpwnd_' + c + '_clipboard-alliance').toggle();
                            $('#input_gpwnd_' + c + '_BBalliance').toggle();
                            $('#input_gpwnd_' + c + '_BBalliance').val("[ally]" + $("div#gpwnd_" + c + " div#info_tab_content li.odd.clearfix a").text().trim() + "[/ally]");
                        });
                    } else { $('div#gpwnd_' + c + ' div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img').css({ "padding-left": "0px" }); }

                    // clipboard town
                    $('div#gpwnd_' + c + ' #town_bbcode_link').append('<a id="dio_gpwnd_' + c + '_clipboard-town" class="dio_clipboard-town" style="top:3px; ' + (MH ? "left: 171px;" : "right: 169px;") + '" data-clipboard-text="' + $('div#gpwnd_' + c + ' #town_bbcode_id').val() + '"></a>');
                    $('div#gpwnd_' + c + ' #town_bbcode_link').click(() => {
                        $('#dio_gpwnd_' + c + '_clipboard-town').toggle();
                    });
                };

                // Tooltip
                $('#dio_gpwnd_' + c + '_BBplayer').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("bbcodes").player.name);
                $('#dio_gpwnd_' + c + '_BBalliance').tooltip(dio_icon + 'BBCode ' + uw.DM.getl10n("bbcodes").ally.name);
            } catch (error) { errorHandling(error, "BBtowninfo (towninfo)"); }
        },
        add: (c) => {
            try {
                // Clipboard
                dio.clipboard('#dio_gpwnd_' + c + '_clipboard-player', '#input_gpwnd_' + c + '_BBplayer', "BBtowninfo (add)", null);
                dio.clipboard('#dio_gpwnd_' + c + '_clipboard-alliance', '#input_gpwnd_' + c + '_BBalliance', "BBtowninfo (add)", null);
                dio.clipboard('#dio_gpwnd_' + c + '_clipboard-town', '#div#gpwnd_' + c + ' #town_bbcode_id', "BBtowninfo (add)", null);
            } catch (error) { errorHandling(error, "BBtowninfo (add)"); }
        },
        deactivate: () => {
            $('#dio_BBtowninfo_style').remove();
            $('.input_BBplayer,.input_BBalliance').css({ "display": "none" });
            $('div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.even img, div#info_tab_content div#towninfo_towninfo div.game_border ul.game_list li.odd.clearfix').css({ "padding-left": "0px" });
        },
    };

    /*******************************************************************************************************************************
     * culture Overview
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● Culture overview : Add a counter for the party in the culture view. Quack function
     * | ● Culture Progress :
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var BuildingOverview = {
        activate: () => {
            $('<style id="dio_BuildingOverview_style"> ' +
                '#dio_building_overview .option_s { margin:0px; cursor:pointer; } ' +
                '#dio_building_overview .option_s.building_icon40x40 { margin:0px; cursor:pointer; border: 0.5px solid #000; } ' +
                '#dio_building_overview .option_s:hover { filter:unset !important; -webkit-filter:unset; } ' +
                '#dio_building_overview .option_s.resource { margin:0.7px; position: relative; display: block; float: left; text-align: right; } ' +
                '#dio_building_overview #dio_Select_boxes .sel { color: #fff; background-color: #444444; } ' +
                '#dio_building_overview #dio_Select_boxes .building_icon40x40.sel { filter:sepia(100000%); -webkit-filter:sepia(100000%); background-color: initial;} ' +
                '#dio_building_overview #dio_Select_boxes .resource.sel { border-radius: 30%;} ' +

                '#dio_building_overview .option {color:#000; background:#FFEEC7; } ' +
                '#dio_building_overview .option:hover {color:#fff; background:#328BF1; } ' +

                '#dio_building_overview .select_rec { position:absolute; top:20px; width:126px; display:none; } ' +
                '#dio_building_overview .select_rec_diff { position:absolute; top:20px; width:17px; display:none; left:88px; } ' +

                '#dio_building_overview .open { display:block !important; } ' +

                '#dio_building_overview .item-list { max-height:none; } ' +

                '#dio_building_overview .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +

                '#dio_building_overview .dio_drop_Select { width:80px; float: left; margin: 2px 0 2px 2px; overflow: inherit; } ' +
                '#dio_building_overview .dio_drop_diff { width:40px; float: left; margin: 2px 0 2px 5px; } ' +

                '#dio_building_sort_control { left: -2px; top: -2px; } ' +
                '#dio_building_sort_control #test.building_icon50x50 { left: -2px; top: -2px; position: absolute; border: 5px solid #fad588; cursor:pointer; } ' +
                '#dio_building_sort_control #test.resource { left: -3px; top: -2px; position: absolute; cursor: pointer; background-color: #fad588; border-left: 18px solid #fad588; border-right: 17px solid #fad588; height: 26px; transform: scale(0.9); }' +
                '#dio_building_sort_control #dio_button_sort{ margin: 2px 0 0 3px; } ' +
                '#dio_building_sort_control #dio_button_filter { margin: 3px 0 0 3px; } ' +

                '#fixed_table_header .testt { border-left: 2px solid rgb(255, 0, 0); border-right: 2px solid rgb(255, 0, 0); width: 38px; cursor: auto!important;}' +
                '#fixed_table_header .building_header { cursor: pointer; }' +

                //sort
                '#dio_sort { cursor: pointer; filter: contrast(200%); background-repeat: no-repeat; background-position: bottom right; }' +
                '#dio_sort.sorting {background-image: url("' + Home_img + 'sort-both.png");}' +
                '#dio_sort.sorting_asc {background-image: url("' + Home_img + 'sort-asc.png") !important;}' +
                '#dio_sort.sorting_desc {background-image: url("' + Home_img + 'sort-desc.png") !important;}' +
                '#dio_sort.sorting_asc_disabled {background-image: url("' + Home_img + 'sort-asc-disabled.png");}' +
                '#dio_sort.sorting_desc_disabled {background-image: url("' + Home_img + 'sort-desc-disabled.png");}' +
                '</style>').appendTo("head");

            if ($('#building_overview_table_wrapper').length) { BuildingOverview.init(); }
        },
        init: () => {
            try {
                var buil = Overviews.Buildings, diff = Overviews.Buildings_Dif;
                var sort_options = [
                    ["option_s", uw.DM.getl10n("mass_recruit").sort_by.name, true],
                    ["option_s", uw.DM.getl10n("mass_recruit").sort_by.points, true],
                    ["option_s resource wood_img", "wood"],
                    ["option_s resource stone_img", "stone"],
                    ["option_s resource iron_img", "iron"],
                    ["option_s resource pop_img", "pop"],
                    ["option_s unit building_icon40x40 main", "main"],
                    ["option_s unit building_icon40x40 hide", "hide"],
                    ["option_s unit building_icon40x40 lumber", "lumber"],
                    ["option_s unit building_icon40x40 stoner", "stoner"],
                    ["option_s unit building_icon40x40 ironer", "ironer"],
                    ["option_s unit building_icon40x40 market", "market"],
                    ["option_s unit building_icon40x40 docks", "docks"],
                    ["option_s unit building_icon40x40 barracks", "barracks"],
                    ["option_s unit building_icon40x40 wall", "wall"],
                    ["option_s unit building_icon40x40 storage", "storage"],
                    ["option_s unit building_icon40x40 farm", "farm"],
                    ["option_s unit building_icon40x40 academy", "academy"],
                    ["option_s unit building_icon40x40 temple", "temple"],
                    ["option_s unit building_icon40x40 theater", "theater"],
                    ["option_s unit building_icon40x40 thermal", "thermal"],
                    ["option_s unit building_icon40x40 library", "library"],
                    ["option_s unit building_icon40x40 lighthouse", "lighthouse"],
                    ["option_s unit building_icon40x40 tower", "tower"],
                    ["option_s unit building_icon40x40 statue", "statue"],
                    ["option_s unit building_icon40x40 oracle", "oracle"],
                    ["option_s unit building_icon40x40 trade_office", "trade_office"],
                ];

                var diff_options = [["option", ">", true], ["option", "=", true], ["option", "<", true],];

                $("#fixed_table_header").parent().append('<div id="dio_building_sort_control" class="overview_search_bar">' +
                    '<div id="dio_building_overview" class="dio_rec_trade">' +
                    // DropDown-Button for unit
                    '<div class="dio_drop_Select dropdown default">' +
                    '<div class="border-left"></div>' +
                    '<div class="border-right"></div>' +
                    '<div class="caption" name="' + buil + '">' + buil + '</div>' +
                    '<div class="arrow"></div>' +
                    '<div id="test"></div>' +
                    '</div>' + dio.grepo_dropdown("dio_Select_boxes", "select_rec", sort_options, buil) +
                    '<div class="dio_drop_diff dropdown default">' +
                    // DropDown-Button for ratio
                    '<div class="border-left"></div>' +
                    '<div class="border-right"></div>' +
                    '<div class="caption" name="' + diff + '">' + diff + '</div>' +
                    '<div class="arrow"></div>' +
                    '</div>' + dio.grepo_dropdown("dio_Select_boxes", "select_rec_diff", diff_options, diff) +
                    '</div>' + BuildingOverview.grepo_input("margin-top:0px", "dio_sortfilterbox", "")[0].outerHTML +
                    '<div id="dio_button_sort" class="jump_button"></div>' +
                    '<div id="dio_button_filter" class="button_order_by active"></div>' +
                    '</div>');


                Classtest(buil)

                setTimeout(() => {
                    $('#fixed_table_header .' + buil).addClass("testt")
                    $('#fixed_table_header .building_icon40x40').append('<div id="dio_sort" class="sorting"></div>')
                }, 50);

                $('#fixed_table_header').each(function () {
                    $(this).click(function (e) {
                        if ($(e.target)[0].id == "fixed_table_header" || $(e.target)[0].parentNode.className.split(" ")[0] == "game_arrow_left" || $(e.target)[0].parentNode.className.split(" ")[0] == "game_arrow_right") { }
                        else {
                            selection = $(e.target)[0].parentNode.className.split(" ")[2];
                            if ($(e.target)[0].className.split(" ")[1] == undefined) sort(selection, true, true);
                            else sort(selection, true);
                            saveValue("Overviews", JSON.stringify(Overviews));
                        }
                    });
                });

                function Classtest(buil) {
                    $('#test').removeClass();
                    if (buil == uw.DM.getl10n("mass_recruit").sort_by.name || buil == uw.DM.getl10n("mass_recruit").sort_by.points) { }
                    else if (buil == "wood" || buil == "stone" || buil == "iron" || buil == "pop") {
                        $('#test').addClass("resource " + buil + "_img");
                    }
                    else { $('#test').addClass("building_icon50x50 " + buil); }

                    $('#fixed_table_header .testt').removeClass("testt");
                    $('#fixed_table_header .' + buil).addClass("testt")
                }

                // click events of the drop menu
                $('#dio_building_overview .select_rec .option_s').each(function () {
                    $(this).click(function (e) {
                        dio.drop_menu(this, '.dio_drop_Select', "Buildings")
                        Classtest(Overviews.Buildings)
                    });
                });
                $('#dio_building_overview .select_rec_diff .option').each(function () {
                    $(this).click(function (e) {
                        dio.drop_menu(this, '.dio_drop_diff', "Buildings_Dif")
                    });
                });

                // show & hide drop menus on click
                $('#dio_building_overview .dio_drop_Select').click(function (e) {
                    if (!$($('.select_rec')).hasClass("open")) {
                        $($('.select_rec')).addClass("open");
                        $($('.select_rec_diff')).removeClass("open");
                    } else {
                        $($('.select_rec')).removeClass("open");
                    }
                });
                $('#dio_building_overview .dio_drop_diff').click(function (e) {
                    if (!$($('.select_rec_diff')).hasClass("open")) {
                        $($('.select_rec_diff')).addClass("open");
                        $($('.select_rec')).removeClass("open");
                    } else {
                        $($('.select_rec_diff')).removeClass("open");
                    }
                });

                $("#dio_building_overview").click(function (e) {
                    var clicked = $(e.target), element = $('#' + this.id + ' .dropdown-list.open').get(0);
                    if ((clicked[0].parentNode.className.split(" ")[1] !== "dropdown") && element) {
                        $(element).removeClass("open");
                    }
                });
                // hover arrow change
                $('.dropdown').hover(function (e) {
                    $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_over.src + "') no-repeat -1px -1px";
                }, function (e) {
                    $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_out.src + "') no-repeat -1px -1px";
                });

                $("#dio_building_overview .caption").attr("name", buil);

                $('#dio_building_overview .dio_drop_Select').tooltip(dio_icon);
                $('#dio_sort').tooltip(dio_icon);

                var selection, order;

                $('#dio_button_sort').tooltip(dio_icon + getTexts("caves", "search_for"));
                $('#dio_button_sort').tooltip(uw.DM.getl10n("heroes").transfer.sort_by);

                function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

                function setfilter(selection) {
                    $('#building_overview>tbody>tr').show();
                    if (isNumber($('#dio_sortfilterbox').val())) {
                        var dif = $("#dio_building_overview .dio_drop_diff")[0].innerText
                        var numericfilter = parseInt($('#dio_sortfilterbox').val());
                        $('#building_overview>tbody>tr').each(function (i, e) {
                            var selectedSort = "";
                            if (selection == 'a.gp_town_link') {
                                selectedSort = $(e).find(selection).text();
                                if (!(selectedSort.indexOf(numericfilter) >= 0)) {
                                    $(e).hide();
                                }
                            } else if (selection == '.Points') {
                                selectedSort = parseInt($(e).find(selection).text().split(" ")[0]) || 0;
                            } else {
                                selectedSort = parseInt($(e).find(selection).text()) || 0;
                            }
                            if (numericfilter < selectedSort & dif == "<") { $(e).hide(); }
                            if (numericfilter != selectedSort & dif == "=") { $(e).hide(); }
                            if (numericfilter > selectedSort & dif == ">") { $(e).hide(); }
                        });
                    } else {
                        var namefilter = $('#dio_sortfilterbox').val();
                        $('#building_overview>tbody>tr').each(function (i, e) {
                            var townname = $(e).find('a.gp_town_link').text();
                            if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) { $(e).hide(); }
                        });
                    }
                };
                var dio_ArrayUnsorted = $('#building_overview>tbody>tr').get();
                dio_ArrayUnsorted.sort(function (a, b) {
                    $($(a).find('.towninfo_wrapper')[0].childNodes[3]).addClass("Points")
                    $($(b).find('.towninfo_wrapper')[0].childNodes[3]).addClass("Points")
                });
                function sort(selection, filter, Sort) {
                    if (!Sort) order = !order;
                    switch (selection) {
                        case uw.DM.getl10n("mass_recruit").sort_by.name:
                            selection = 'a.gp_town_link';
                            break;
                        case uw.DM.getl10n("mass_recruit").sort_by.points:
                            selection = '.Points';
                            break;
                        case "wood":
                            selection = '.wood span.count';
                            break;
                        case "stone":
                            selection = '.stone span.count';
                            break;
                        case "iron":
                            selection = '.iron span.count';
                            break;
                        case "pop":
                            selection = '.town_population span.count';
                            break;
                        default:
                            selection = '.' + selection + ' a.current_level';
                    }
                    $('#fixed_table_header .building_icon40x40 #dio_sort').attr("Class", "");
                    $('#fixed_table_header .building_icon40x40 #dio_sort').addClass('sorting')
                    if (!Sort) $("#dio_button_filter").toggleClass('active')

                    if (selection !== 'a.gp_town_link' || selection !== '.Points') {
                        if (!order) {
                            $(selection.split(" ")[0] + ' #dio_sort').removeClass("sorting_desc");
                            $(selection.split(" ")[0] + ' #dio_sort').addClass("sorting_asc");
                        }
                        else {
                            $(selection.split(" ")[0] + ' #dio_sort').removeClass("sorting_asc");
                            $(selection.split(" ")[0] + ' #dio_sort').addClass("sorting_desc");
                        }
                    }

                    if (!filter) setfilter(selection);
                    //if (Sort) return
                    var dio_ArrayUnsorted = $('#building_overview>tbody>tr').get();
                    dio_ArrayUnsorted.sort(function (a, b) {
                        if (selection == '.Points') {
                            a = parseInt($(a).find(selection).text().split(" ")[0]) || 0;
                            b = parseInt($(b).find(selection).text().split(" ")[0]) || 0;
                        } else if (selection !== 'a.gp_town_link') {
                            a = parseInt($(a).find(selection).text()) || 0;
                            b = parseInt($(b).find(selection).text()) || 0;
                        } else {
                            a = $(a).find(selection).text().toLowerCase();
                            b = $(b).find(selection).text().toLowerCase();
                            if (order) { return a.localeCompare(b); }
                            else { return b.localeCompare(a); }
                        }
                        if (order) { return b - a }
                        else { return a - b }
                    });
                    for (var i = 0; i < dio_ArrayUnsorted.length; i++) {
                        dio_ArrayUnsorted[i].parentNode.appendChild(dio_ArrayUnsorted[i]);
                    }
                }

                $("#dio_button_filter").click(function (e) {
                    sort($("#dio_building_overview .dio_drop_Select")[0].innerText, true);
                });
                $("#dio_button_sort").click(function (e) {
                    sort($("#dio_building_overview .dio_drop_Select")[0].innerText, false, true);
                });

            } catch (error) { errorHandling(error, "BuildingOverview (init)"); }
        },
        grepo_input: (Style, ID, Text) => {
            return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
        },
        deactivate: () => {
            $('#dio_BuildingOverview_style').remove();
            $('#dio_building_sort_control').remove();
            $('#dio_building_overview').remove();
        },
    };

    var cultureOverview = {
        timeout: null,
        activate: () => {
            if ($('#culture_points_overview_bottom').length) { cultureOverview.add(); }
            cultureOverview.timeout = setInterval(() => {
                if ($('#culture_points_overview_bottom').length) { cultureOverview.add(); }
            }, 50000); //0.
        },
        add: () => {
            try {
                var a = $("ul#cultur_overview_towns");
                var b, c, d, e, f, i, j, k;
                f = 0;

                var g = $("ul#culture_overview_towns span.eta");
                var h = $("#culture_points_overview_bottom #place_culture_count").text();

                e = 0;
                b = $('a[class~="confirm"][class~="type_triumph"]');
                d = $('a[class~="confirm"][class~="type_triumph"][class~="disabled"]');
                if (d.length > 0) {
                    for (f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        var eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }

                e = 0;
                b = $('a[class~="confirm"][class~="type_theater"]');
                d = $('a[class~="confirm"][class~="type_theater"][class~="disabled"]');
                if (d.length > 0) {
                    for (f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }

                e = 0;
                b = $('a[class~="confirm"][class~="type_party"]');
                d = $('a[class~="confirm"][class~="type_party"][class~="disabled"]');
                if (d.length > 0) {
                    for (f = 0; f < b.length; f++) {
                        if ($(b[f]).attr("class").indexOf("disabled") > 1)
                            continue;
                        c = $(b[f]).parents('li[id^="ov_town_"]');
                        eltext = c[0].previousSibling;
                        $(c).insertBefore($(d[0]).parents('li[id^="ov_town_"]'));
                        $(eltext).insertBefore($(d[0]).parents('li[id^="ov_town_"]'))
                    }
                }
                ///////
                if ($('#dio_cultureBTN_wrapper').length == 0) {
                    $("#culture_overview_wrapper").parent().append('<div id="dio_cultureBTN_wrapper"><div class="dio_cultureBTN_wrapper_right"><div id="dio_cultureBTN_theather_r" class="dio_cultureBTN_r dio_cultureBTN_theather"></div>' +
                        '<div id="dio_cultureBTN_triumph_r" class="dio_cultureBTN_r dio_cultureBTN_triumph"></div><div id="dio_cultureBTN_olympicgames_r" class="dio_cultureBTN_r dio_cultureBTN_olympicgames"></div>' +
                        '<div id="dio_cultureBTN_cityfestival_r" class="dio_cultureBTN_r dio_cultureBTN_cityfestival"></div></div></div>');

                    if (!$("#dio_culture_sort_control").is(":visible")) $("#culture_overview_wrapper").css({ "top": "35px", "height": "+=-35px" });
                    $("#dio_cultureBTN_wrapper").css({
                        "color": "white",
                        "font-family": "Verdana",
                        "font-weight": "bold",
                        "font-size": "12px",
                        "text-align": "center",
                        "line-height": "25px",
                        "text-shadow": "1px 1px 0 #000000"
                    });
                    $(".dio_cultureBTN_wrapper_left").css({
                        "position": "absolute",
                        "top": "0px",
                        "left": "0px",
                        "margin-left": "7px"
                    });
                    $(".dio_cultureBTN_wrapper_right").css({
                        "position": "absolute",
                        "top": "0px",
                        "right": "0px",
                        "z-index": "2000"
                    });
                    $(".dio_cultureBTN_l, .dio_cultureBTN_r").css({
                        "cursor": "pointer",
                        "max-width": "40px",
                        "min-width": "25px",
                        //"height": "27px",
                        "float": "right",
                        "position": "relative",
                        "margin-left": "3px",
                        "border": "2px groove gray",
                        "background": "url(https://gpfr.innogamescdn.com/images/game/overviews/celebration_bg_new.png)"
                    });
                    $(".dio_cultureBTN_cityfestival").css({ "background-position": "0 -110px" });
                    $(".dio_cultureBTN_olympicgames").css({ "background-position": "0 -140px" });
                    $(".dio_cultureBTN_triumph").css({ "background-position": "0 -201px" });
                    $(".dio_cultureBTN_theather").css({ "background-position": "0 -170px" });

                    var dio_cultureBTN_r_clicked_last = "";
                    function hideTownElements(JQelement) {
                        var dio_cultureBTN_mode = "";
                        switch (JQelement.id) {
                            case "dio_cultureBTN_cityfestival_r":
                                dio_cultureBTN_mode = "ul li:eq(0)";
                                break;
                            case "dio_cultureBTN_olympicgames_r":
                                dio_cultureBTN_mode = "ul li:eq(1)";
                                break;
                            case "dio_cultureBTN_triumph_r":
                                dio_cultureBTN_mode = "ul li:eq(2)";
                                break;
                            case "dio_cultureBTN_theather_r":
                                dio_cultureBTN_mode = "ul li:eq(3)";
                                break;
                            default:
                                setTimeout(function () { uw.HumanMessage.error(dio_icon + "Error"); }, 0);
                                break;
                        }
                        if (dio_cultureBTN_r_clicked_last === JQelement.id) {
                            $("ul#culture_overview_towns li").filter(function () { return !!$(dio_cultureBTN_mode, this).find('.eta').length; }).toggle();
                            $("ul#culture_overview_towns li").filter(function () { return !!$(dio_cultureBTN_mode, this).find('.celebration_progressbar:not(:has(>.eta))').length; }).removeClass('hidden');
                            $(JQelement).toggleClass("culture_red");
                        } else {
                            $("ul#culture_overview_towns li").show().filter(function () { return !!$(dio_cultureBTN_mode, this).find('.eta').length; }).hide();
                            $(".dio_cultureBTN_r").removeClass("culture_red");
                            $(JQelement).addClass("culture_red");
                        }
                        dio_cultureBTN_r_clicked_last = JQelement.id;
                        $(".dio_cultureBTN_r").css({ border: "2px groove #808080" });
                        $(".culture_red").css({ border: "2px groove #CC0000" });
                    }
                    $(".dio_cultureBTN_r").click(function () { hideTownElements(this); });
                }

                var dio_cultureCounter = {
                    cityfestivals: 0,
                    olympicgames: 0,
                    triumph: 0,
                    theather: 0
                };

                var dio_bashpoints = $("#culture_points_overview_bottom .points_count").text().split("/");
                var dio_goldforgames = Math.floor($("#ui_box .gold_amount").text() / 50);
                dio_cultureCounter.triumph = Math.floor((parseInt(dio_bashpoints[0]) - parseInt(dio_bashpoints[1])) / 300) + 1;
                if (dio_cultureCounter.triumph < 0) {
                    dio_cultureCounter.triumph = 0;
                }
                dio_cultureCounter.cityfestivals = $('a[class~="confirm"][class~="type_party"]:not(.disabled)').length;
                dio_cultureCounter.olympicgames = $('a[class~="confirm"][class~="type_games"]:not(.disabled)').length;
                if (dio_goldforgames < dio_cultureCounter.olympicgames) {
                    dio_cultureCounter.olympicgames = dio_goldforgames;
                }
                dio_cultureCounter.theather = $('a[class~="confirm"][class~="type_theater"]:not(.disabled)').length;

                $("#dio_cultureBTN_cityfestival_r").text(dio_cultureCounter.cityfestivals);
                $("#dio_cultureBTN_olympicgames_r").text(dio_cultureCounter.olympicgames);
                $("#dio_cultureBTN_triumph_r").text(dio_cultureCounter.triumph);
                $("#dio_cultureBTN_theather_r").text(dio_cultureCounter.theather);
                $(".dio_cultureBTN_cityfestival").tooltip(dio_icon + getTexts("Quack", "cityfestivals") + " (" + pointNumber(dio_cultureCounter.cityfestivals) + ") ");
                $(".dio_cultureBTN_olympicgames").tooltip(dio_icon + getTexts("Quack", "olympicgames") + " (" + pointNumber(dio_cultureCounter.olympicgames) + ") ");
                $(".dio_cultureBTN_triumph").tooltip(dio_icon + getTexts("Quack", "triumph") + " (" + pointNumber(dio_cultureCounter.triumph) + ") ");
                $(".dio_cultureBTN_theather").tooltip(dio_icon + getTexts("Quack", "theater") + " (" + pointNumber(dio_cultureCounter.theather) + ") ");

            } catch (error) { errorHandling(error, "cultureOverview (add)"); }
        },
        deactivate: () => {
            $(".dio_cultureBTN_cityfestival").remove();
            $(".dio_cultureBTN_olympicgames").remove();
            $(".dio_cultureBTN_triumph").remove();
            $(".dio_cultureBTN_theather").remove();
            $("#dio_cultureBTN_wrapper").remove();
            clearTimeout(cultureOverview.timeout);
            cultureOverview.timeout = null;
            if (!$("#dio_culture_sort_control").is(":visible")) $("#culture_overview_wrapper").css({ "top": "0px", "height": "+=35px" });
        },
    };

    var culturePoints = {
        timeout: null,
        activate: () => {
            if ($('#culture_points_overview_bottom').length || $("#place_container").length) { culturePoints.add(); }
            culturePoints.timeout = setInterval(() => {
                if ($('#culture_points_overview_bottom').length || $("#place_container").length) { culturePoints.add(); }
            }, 50000); //0.
        },
        add: () => {
            try {
                let f, i, j, k, g, h;
                //let test = false;
                let test = 100;
                if ($("#culture_points_overview_bottom").length) {
                    g = $("ul#culture_overview_towns span.eta");
                    h = $("#culture_points_overview_bottom #place_culture_count").text();
                    i = h.split("/");
                    j = parseInt(i[0]) + g.length;
                    k = parseInt(i[1]) - j;
                    //console.log(k);
                    if (test != 100) { k = k - test; }
                    if (h.indexOf("[") < 1) {
                        if (k > 0) { $("#culture_points_overview_bottom #place_culture_count").append(" <span id='dio_culture'>[-" + k + "]</span><span id='dio_cultureplus' style='color: #ECB44D'></span>"); }
                        else { $("#culture_points_overview_bottom #place_culture_count").append(" [<span id='dio_culture'></span>]<span id='dio_cultureplus' style='color: #ECB44D'> +" + k * -1 + "</span>").find("span#dio_culture").countdown(culturePoints.heure(g, h, test)); }
                    } else {
                        if (k > 0) {
                            $("#dio_culture").text("[-" + k + "]");
                            $("#dio_cultureplus").text("");
                        } else {
                            $("#dio_culture").countdown(culturePoints.heure(g, h, test))
                            $("#dio_cultureplus").text(" +" + k * -1);
                        }
                    }
                    h = $("#place_battle_points .points_background .points_count").text();
                    i = h.split("/");
                    j = parseInt(i[0]);
                    k = parseInt(i[1]) - j;
                    if (k > 0) {
                        if (h.indexOf("[") < 1) { $("#place_battle_points .points_background .points_count").append(" <span id='dio_battle_points'>[-" + k + "]</span>"); }
                        else { $("#dio_battle_points").text("[-" + k + "]"); }
                    }
                };
                if ($("#place_container").length) {
                    let h = $("#place_container #place_culture_count").text();
                    let g = 0;
                    let inProgress = parseInt($('#place_culture_in_progress').text().match(/[0-9]+/));
                    if (inProgress > 0) { g = inProgress; }
                    i = h.split("/");
                    j = parseInt(i[0]) + g;
                    k = parseInt(i[1]) - j;
                    if (test != 100) { k = k - test; }
                    if (h.indexOf("[") < 1) {
                        if (k > 0) { $("#place_container #place_culture_count").append("<span id='dio_cultureA'>[-" + k + "]</span>"); }
                        else { $("#place_container #place_culture_count").append("<span id='dio_cultureplusA' style='color: #ECB44D'> [+" + k * -1 + "]</span>"); }
                    } else {
                        if (k > 0) { $("#dio_cultureA").text("[-" + k + "]"); }
                        else { $("#dio_cultureplusA").text(" [+" + k * -1 + "]"); }
                    }
                }
                $('#dio_culture, #dio_cultureplus, #dio_cultureA, #dio_cultureplusA, #dio_battle_points, #dio_battle_pointsA').tooltip(dio_icon);
            } catch (error) { errorHandling(error, "culturePoints (add)"); }
        },
        heure: (g, h, test) => {
            try {
                var f, i, j, k;
                i = h.split("/");
                j = parseInt(i[0]) + g.length;
                k = parseInt(i[1]) - j;
                if (test != 100) { k = k - test; }
                if (k <= 0) {
                    var l = new Array;
                    for (f = 0; f < g.length; f++) {
                        l.push(g[f].dataset.timestamp);
                    }
                    l.sort();
                    var m = l[l.length + k - 1];
                } else { m = ""; culturePoints.add(); }
            } catch (error) {
                errorHandling(error, "culturePoints (heure)");
                m = "";
            }
            return m;
        },
        deactivate: () => {
            $("#dio_culture").remove();
            $("#dio_cultureplus").remove();
            //
            $("#dio_cultureA").remove();
            $("#dio_cultureplusA").remove();

            clearTimeout(culturePoints.timeout);
            culturePoints.timeout = null;

            $("#place_container #place_triumph .game_footer span").text(300);;
        },
    };

    var cultureProgress = {
        activate: () => {
            try {
                if ($("#place_culture_towns").is(":visible")) {

                    let level = parseInt($('#place_culture_towns').text().split('/')[1]);
                    let [currentCount, totalCount] = $('#place_culture_count').text().match(/[0-9]+/g);
                    let inProgress = parseInt($('#place_culture_in_progress').text().match(/[0-9]+/));

                    let nbNeeded = (level - 1) * 3;
                    let nbLeft = totalCount - currentCount;
                    let percentLeft = 100 - nbLeft / nbNeeded * 100;
                    let percentInProgress = inProgress / nbNeeded * 100;

                    //Progress Bar
                    if (!$("#culture_points_overview_bottom #dio-ProgressBar").length) {
                        $('<div id="dio-ProgressBar">').insertBefore("#culture_points_overview_bottom #place_culture_bar");
                        $('<div id="dio-Bar">').insertBefore("#culture_points_overview_bottom #place_culture_bar");
                        $('<style id="dio-ProgressBar-style">' +
                            '#culture_points_overview_bottom #dio-ProgressBar {position: absolute; height: 25px; top: 30px; background:url("https://gpfr.innogamescdn.com/images/game/place/culture_bar-2.99.png") no-repeat 0px 0px;filter: hue-rotate(-40deg) brightness(2);}' +
                            '#culture_points_overview_bottom #dio-Bar {position: absolute; height: 25px; top: 30px; background:url("https://gpfr.innogamescdn.com/images/game/place/culture_bar-2.99.png") no-repeat 0px 0px;}' +
                            '</style>').appendTo('head');
                    }

                    if (!$("#place_container #dio-ProgressBar").length) {
                        $('<div id="dio-ProgressBar">').insertBefore("#place_container #place_culture_bar");
                        $('<div id="dio-Bar">').insertBefore("#place_container #place_culture_bar");
                        $('<style id="dio-ProgressBar-style">' +
                            '#place_container #dio-ProgressBar {position: absolute; height: 25px; top: 30px; background:url("https://gpfr.innogamescdn.com/images/game/place/culture_bar-2.99.png") no-repeat 0px 0px;filter: hue-rotate(-40deg) brightness(2);}' +
                            '#place_container #dio-Bar {position: absolute; height: 25px; top: 30px; background:url("https://gpfr.innogamescdn.com/images/game/place/culture_bar-2.99.png") no-repeat 0px 0px;}' +
                            '</style>').appendTo('head');
                    }

                    $("#culture_points_overview_bottom #place_culture_bar, #place_container #place_culture_bar").css({ "display": "none" });
                    $("#culture_points_overview_bottom #dio-Bar, #place_container #dio-Bar").css({ "width": "calc(" + percentLeft + "% - 1px)" });
                    $("#culture_points_overview_bottom #dio-ProgressBar, #place_container #dio-ProgressBar").css({
                        "width": percentInProgress + "%",
                        "left": "calc(" + percentLeft + "% + 2px)",
                        "max-width": "calc(" + (100 - percentLeft) + "% - 4px)"
                    });

                }
            } catch (error) { errorHandling(error, "cultureProgress"); }
        },
        deactivate: () => {
            $("#dio-ProgressBar-style").remove();
            $("#dio-ProgressBar").remove();
            $("#dio-Bar").remove();
            $("#culture_points_overview_bottom #place_culture_bar, #place_container #place_culture_bar").css({ "display": "block" });
        },
    };

    var cultureControl = {
        activate: () => {
            $('<style id="dio_cultureOverview_style"> ' +
                '#dio_culture_overview .option {color:#000; background:#FFEEC7; } ' +
                '#dio_culture_overview .option:hover {color:#fff; background:#328BF1; } ' +

                '#dio_culture_overview #dio_sort_towns { position:absolute; top:20px; width:126px; display:none; } ' +
                '#dio_culture_overview #dio_diff_towns { position:absolute; top:20px; width:17px; display:none; left:88px; } ' +
                '#dio_culture_overview .sel { color: #fff; background: #444444; } ' +

                '#dio_culture_overview .open { display:block !important; } ' +

                '#dio_culture_overview .item-list { max-height:none; } ' +

                '#dio_culture_overview .arrow { width:18px; height:18px; background:url(' + drop_out.src + ') no-repeat -1px -1px; position:absolute; } ' +

                '#dio_culture_overview .dio_drop_Select { width:80px; float: left; margin: 2px 0 2px 2px; overflow: inherit; } ' +
                '#dio_culture_overview .dio_drop_diff { width:40px; float: left; margin: 2px 0 2px 5px; } ' +

                '#dio_culture_sort_control #dio_button_sort{ margin: 2px 0 0 3px; } ' +
                '#dio_culture_sort_control #dio_button_filter { margin: 3px 0 0 3px; } ' +

                '#fixed_table_header .building_header { cursor: pointer; }' +
                '</style>').appendTo("head");

            if ($('#culture_points_overview_bottom').length) { cultureControl.init(); }
        },
        init: () => {
            try {
                if (!$("#dio_cultureBTN_wrapper").is(":visible")) $("#culture_overview_wrapper").css({ "top": "35px", "height": "+=-35px" });
                var buil = Overviews.Culture, diff = Overviews.Culture_Dif;
                var selection, order;
                var sort_options = [
                    ["option", uw.DM.getl10n("mass_recruit").sort_by.name, true],
                    ["option", uw.DM.getl10n("inventory").tooltip.hours, true],
                    ["option", "Minutes", true],
                ];

                var diff_options = [["option", ">", true], ["option", "=", true], ["option", "<", true],];

                function dateDiff(date1, date2) {
                    var diff = {}
                    var tmp = date2 - date1;
                    tmp = Math.floor(tmp / 1000);
                    diff.sec = tmp % 60;
                    tmp = Math.floor((tmp - diff.sec) / 60);
                    diff.min = tmp % 60;
                    tmp = Math.floor((tmp - diff.min) / 60);
                    diff.hour = tmp % 24;
                    tmp = Math.floor((tmp - diff.hour) / 24);
                    diff.day = tmp;
                    return diff;
                }

                $("#culture_overview_wrapper").parent().append('<div id="dio_culture_sort_control" class="overview_search_bar">' +
                    '<div id="dio_culture_overview" class="dio_rec_trade">' +
                    // DropDown-Button for unit
                    '<div class="dio_drop_Select dropdown default">' +
                    '<div class="border-left"></div>' +
                    '<div class="border-right"></div>' +
                    '<div class="caption" name="' + buil + '">' + buil + '</div>' +
                    '<div class="arrow"></div>' +
                    '<div id="test"></div>' +
                    '</div>' + dio.grepo_dropdown("dio_sort_towns", "", sort_options, buil) +
                    '<div class="dio_drop_diff dropdown default">' +
                    // DropDown-Button for ratio
                    '<div class="border-left"></div>' +
                    '<div class="border-right"></div>' +
                    '<div class="caption" name="' + diff + '">' + diff + '</div>' +
                    '<div class="arrow"></div>' +
                    '</div>' + dio.grepo_dropdown("dio_diff_towns", "", diff_options, diff) +
                    '</div>' + cultureControl.grepo_input("margin-top:0px", "dio_sortfilterbox", "")[0].outerHTML +
                    '<div id="dio_button_sort" class="jump_button"></div>' +
                    '<div id="dio_button_filter" class="button_order_by active"></div>' +
                    '</div>');

                // click events of the drop menu
                $('#dio_culture_overview #dio_sort_towns .option').each(function () {
                    $(this).click(function (e) {
                        dio.drop_menu(this, '.dio_drop_Select', "Culture")
                    });
                });
                $('#dio_culture_overview #dio_diff_towns .option').each(function () {
                    $(this).click(function (e) {
                        dio.drop_menu(this, '.dio_drop_diff', "Culture_Dif")
                    });
                });

                // show & hide drop menus on click
                $('#dio_culture_overview .dio_drop_Select').click(function (e) {
                    if (!$($('#dio_sort_towns')).hasClass("open")) {
                        $($('#dio_sort_towns')).addClass("open");
                        $($('#dio_diff_towns')).removeClass("open");
                    } else {
                        $($('#dio_sort_towns')).removeClass("open");
                    }
                });
                $('#dio_culture_overview .dio_drop_diff').click(function (e) {
                    if (!$($('#dio_diff_towns')).hasClass("open")) {
                        $($('#dio_diff_towns')).addClass("open");
                        $($('#dio_sort_towns')).removeClass("open");
                    } else {
                        $($('#dio_diff_towns')).removeClass("open");
                    }
                });

                $("#dio_Culture_overview").click(function (e) {
                    var clicked = $(e.target), element = $('#' + this.id + ' .dropdown-list.open').get(0);
                    if ((clicked[0].parentNode.className.split(" ")[1] !== "dropdown") && element) {
                        $(element).removeClass("open");
                    }
                });
                // hover arrow change
                $('.dropdown').hover(function (e) {
                    $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_over.src + "') no-repeat -1px -1px";
                }, function (e) {
                    $(e.target)[0].parentNode.childNodes[3].style.background = "url('" + drop_out.src + "') no-repeat -1px -1px";
                });


                $('#dio_button_sort').tooltip(dio_icon + getTexts("caves", "search_for"));
                $('#dio_button_sort').tooltip(uw.DM.getl10n("heroes").transfer.sort_by);

                function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

                function setfilter(selection) {
                    $('#culture_overview_towns>li').show();
                    if (isNumber($('#dio_sortfilterbox').val())) {
                        var regexpInS = RegExp(/eta/);
                        var numericfilter = parseInt($('#dio_sortfilterbox').val());
                        var diff = $("#dio_diff_towns").val();
                        var date = $("#dio_sort_towns").val();
                        $('#culture_overview_towns>li').each(function (i, e) {
                            var selectedSort = "";
                            if (regexpInS.test(selection)) {
                                try {
                                    const diffIn = dateDiff(new Date(), new Date(parseInt($(e).find(selection)[0].dataset.timestamp) * 1000));
                                    if (date != "Minutes") selectedSort = diffIn.hour
                                    else selectedSort = (diffIn.min + 60 * diffIn.hour)
                                } catch { selectedSort = -1 }

                            } else {
                                selectedSort = $(e).find(selection).text();
                                if (!(selectedSort.indexOf(numericfilter) >= 0)) {
                                    $(e).hide();
                                }
                            }
                            //if (numericfilter < selectedSort) { $(e).hide();}
                            if (selectedSort != -1) {
                                if (numericfilter < selectedSort & diff == "<") { $(e).hide(); }
                                if (numericfilter != selectedSort & diff == "=") { $(e).hide(); }
                                if (numericfilter > selectedSort & diff == ">") { $(e).hide(); }
                            }
                            else { $(e).hide(); }
                        });
                    } else {
                        var namefilter = $('#dio_sortfilterbox').val();
                        $('#culture_overview_towns>li').each(function (i, e) {
                            var townname = $(e).find('a.gp_town_link').text();
                            if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) { $(e).hide(); }
                        });
                    }
                };

                function sort(selection, filter, Sort) {
                    if (!Sort) order = !order;
                    switch (selection) {
                        case uw.DM.getl10n("inventory").tooltip.hours:
                        case "Minutes":
                            selection = 'span.eta';
                            break;
                        case uw.DM.getl10n("mass_recruit").sort_by.name:
                            selection = 'a.gp_town_link';
                            break;
                    }
                    if (!filter) setfilter(selection);
                    var dio_ArrayUnsorted = $('#culture_overview_towns>li').get();
                    dio_ArrayUnsorted.sort(function (a, b) {
                        var regexpInS = RegExp(/eta/);
                        if (regexpInS.test(selection)) {
                            //try {console.log(parseInt($(a).find(selection)[0].dataset.timestamp)) || 0} catch { }
                            try { a = parseInt($(a).find(selection)[0].dataset.timestamp) || 0 } catch { a = 0 }
                            try { b = parseInt($(b).find(selection)[0].dataset.timestamp) || 0 } catch { b = 0 }
                        } else {
                            a = $(a).find(selection).text().toLowerCase();
                            b = $(b).find(selection).text().toLowerCase();
                            if (order) { return a.localeCompare(b); }
                            else { return b.localeCompare(a); }
                        }
                        if (order) { return b - a }
                        else { return a - b }
                    });
                    for (var i = 0; i < dio_ArrayUnsorted.length; i++) {
                        dio_ArrayUnsorted[i].parentNode.appendChild(dio_ArrayUnsorted[i]);
                    }
                }

                $("#dio_button_filter").click(function (e) {
                    sort($("#dio_culture_overview .dio_drop_Select")[0].innerText, true);
                });
                $("#dio_button_sort").click(function (e) {
                    sort($("#dio_culture_overview .dio_drop_Select")[0].innerText, false, true);
                });

            } catch (error) { errorHandling(error, "cultureControl (init)"); }
        },
        grepo_input: (Style, ID, Text) => {
            return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
        },
        deactivate: () => {
            $('#dio_cultureControl_style').remove();
            $('#dio_culture_sort_control').remove();
            $('#dio_cultureOverview_style').remove();
            if (!$("#dio_cultureBTN_wrapper").is(":visible")) $("#culture_overview_wrapper").css({ "top": "0px", "height": "+=35px" });
        },
    };

    /*******************************************************************************************************************************
     * Hides Overview
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● City view button : Add a button for opening the city view to the sidemenu of Greplis. Quack function
     * | ● City view : Display the city view in a window. Quack function
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var hidesIndexIron = {
        timeout: null,
        activate: () => {
            hidesIndexIron.timeout = setInterval(() => {
                if ($('#hide_espionage').length || $('#hides_overview_wrapper').length) {
                    if ($('#hide_espionage').length & !$('#dio_hidesIndexIron').get(0)) { hidesIndexIron.add2(); }
                    if ($('#hides_overview_wrapper').length & !$('#dio_hidesIndexIron2').get(0)) {
                        hidesIndexIron.add();
                        setTimeout(function () { $('#dio_hidesIndexIron2').remove(); }, 50000);
                    }
                }
            }, 800);
        },
        add: () => {
            try {
                if (!$("#dio_hidesIndexIron2").is(":visible") & $('#hides_overview_wrapper').length) {
                    $('<div id="dio_hidesIndexIron2" style="width: 100px; height: 33px; position: absolute; left: 22px; top: 170px;"></div>').appendTo('#hides_overview_wrapper');
                }
                var silver_total = 0;
                var city_boxes = $("#hides_overview_towns").find(".town_item");
                function silverToInt(str) { return parseInt(str.split("/")[0].replace(/\D/g, "")) || 0; }
                if (silver_total === 0) {
                    for (var a = 0; a < city_boxes.length; a++) {
                        silver_total += silverToInt($(city_boxes[a]).find(".hide_progressbar").text());
                    }
                }
                for (var d = 0; d < city_boxes.length; d++) {
                    var e = $(city_boxes[d]);
                    silver_total += silverToInt(e.find(".hide_progressbar").text());
                    var f = e.find(".iron");
                    var g = Number(f.text().trim());
                    var h = e.find("input");
                    if (null != h.val() && g > 15e3) {
                        h.val(g - 15e3).change();
                        e.find(".iron_img").click();
                        var i = uw.HidesOverview.spinners[e.find(".iron_img").attr("name")];
                        i.setValue(g - 15e3)
                    }
                }
            } catch (error) { errorHandling(error, "hidesIndexIron 'add"); }
        },
        add2: () => {
            try {
                if (!$("#dio_hidesIndexIron").is(":visible") & ('#hide_espionage').length) {
                    $('<div id="dio_hidesIndexIron" style="width: 100px; height: 33px; position: absolute; left: 22px; top: 170px;"></div>').appendTo('#hide_espionage');
                }
                var b = uw.ITowns.getTown(parseInt(uw.Game.townId)).getCurrentResources().iron;
                if (b > 15e3) {
                    $("#hide_espionage :input").val(b - 15e3);
                    setTimeout(function () {
                        $("#hide_espionage :input").select().blur();
                    }, 10);
                } else {
                    $("#hide_espionage :input").val("0");
                    setTimeout(function () {
                        $("#hide_espionage :input").select().blur();
                    }, 10);
                }
            } catch (error) { errorHandling(error, "hidesIndexIron (add2)"); }
        },
        deactivate: () => {
            $('#dio_hidesIndexIron').remove();
            $('#dio_hidesIndexIron2').remove();
            clearTimeout(hidesIndexIron.timeout);
            hidesIndexIron.timeout = null;
        },
    };

    var hidesOverview = {
        activate: () => {
            $('<style id="dio_hidesOverview_style"> ' +

                // style
                //'#dio_hides_sort_control { bottom: -8px; left: -9px; padding: 0 2px; right: -9px; top: -9px; z-index: 30;} ' +
                '#dio_button_table_resize { background-image: url("' + Home_img + 'button-table-resize.png"); background-repeat: no-repeat; display: block !important; float: left; width: 22px; height: 23px; margin-right: 5px; margin-top: 2px; cursor: pointer;} ' +
                '#dio_button_table_resize:hover { background-position: 0px -23px !important;} ' +
                '#dio_button_table_resize.active { background-position: 0px -46px !important;} ' +
                '#dio_sortinit { margin: 3px 0 0 3px;} ' +
                '#dio_hides_sort_control .border { border-bottom: 1px solid #222; left: -2px; position: absolute; right: -2px; top: 28px;} ' +
                '#hides_overview_wrapper { top: 39px;} ' +
                '#hides_overview_bottom { margin-top: 39px;} ' +
                '#hides_overview_towns { border-top: 0px;} ' +
                '#dio_hides_silver_total { background: #ffe2a1 none repeat scroll 0 0; border: 1px solid #e1af55; font-size: 10px; padding: 0 4px 2px 1px; position: absolute; right: 2px; top: 3px;} ' +
                '#dio_hides_silver_total .resource_iron_icon { padding-left: 25px; width: auto;} ' +
                '#dio_hides_silver_total .silver_amount { display: block; padding-top: 1px;} ' +
                '.dio_res_plenty, .dio_res_rare { background: url(https://gpde.innogamescdn.com/images/game/layout/resources_deposit.png) no-repeat scroll 0 0; height: 10px; width: 10px; position: absolute; left: 29px;} ' +
                '.dio_res_rare { background-position: 0 -10px;} ' +
                '#hides_overview_towns.dio_resize .box_content { display: none;} ' +
                '#hides_overview_towns.dio_resize .hide_buttons, #hides_overview_towns.dio_resize .spinner { top: 23px;} ' +
                '</style>').appendTo("head");

            if ($('#hides_overview_wrapper').length) { hidesOverview.init(); }
        },
        init: () => {
            try {
                //$("#wrapper.game_inner_box").css({ "top": "39px" });
                $("#hides_overview_wrapper").css({ "height": "+=-39px" });
                var silver_total = 0;
                var selection, order;
                var city_boxes = $("#hides_overview_towns").find(".town_item");

                function silverToInt(str) { return parseInt(str.split("/")[0].replace(/\D/g, "")) || 0; }

                //if (QT.Settings.values.qmenu_settings_hidessort) {
                if (silver_total === 0) {
                    for (var a = 0; a < city_boxes.length; a++) {
                        silver_total += silverToInt($(city_boxes[a]).find(".hide_progressbar").text());
                    }
                }

                var sort_options = [
                    ["ironinstore", getTexts("caves", "stored_silver")],
                    ["name", uw.DM.getl10n("mass_recruit").sort_by.name],
                    ["wood", uw.DM.getl10n("mass_recruit").sort_by.wood],
                    ["stone", uw.DM.getl10n("mass_recruit").sort_by.stone],
                    ["iron", uw.DM.getl10n("mass_recruit").sort_by.iron]
                ];

                $("#wrapper.game_inner_box").after('<div id="dio_hides_sort_control" class="overview_search_bar"><div id="dio_button_table_resize"></div>' + hidesOverview.grepo_dropdown("dio_sort_towns", sort_options) + hidesOverview.grepo_input("margin-top:0px", "dio_sortfilterbox", "")[0].outerHTML +
                    '<div id="dio_sortinit" class="button_order_by active"></div><div id="dio_hides_silver_total"><span class="resource_iron_icon iron"><span class="silver_amount">' + silver_total + '</span></span></div><div class="border"></div></div>');
                $('#dio_button_table_resize').tooltip(dio_icon);
                $('#dio_sortinit').tooltip(dio_icon + getTexts("caves", "search_for"));
                function table_resize_handler1() {
                    $(this).addClass("active");
                    $("#hides_overview_towns").addClass("dio_resize");
                    city_boxes.each(function (index) {
                        var iron_span_class = $(this).find(".box_content.res_box .iron SPAN:first-child").prop("class");
                        if (iron_span_class == "res_rare") { $(this).find(".iron_img").append('<span class="dio_res_rare"></span>'); }
                        else if (iron_span_class == "res_plenty") { $(this).find(".iron_img").append('<span class="dio_res_plenty"></span>'); }
                    });
                    $(this).one("click", table_resize_handler2);
                }

                function table_resize_handler2() {
                    $(this).removeClass("active");
                    $("#hides_overview_towns").removeClass("dio_resize");
                    city_boxes.find(".dio_res_plenty, .dio_res_rare").remove();
                    $(this).one("click", table_resize_handler1);
                }

                $('#dio_button_table_resize').one("click", table_resize_handler1);

                function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

                function setfilter(selection) {
                    $('#hides_overview_towns>li').show();
                    if (isNumber($('#dio_sortfilterbox').val())) {
                        var regexpRES = RegExp(/wood|stone|iron/);
                        var regexpInS = RegExp(/eta/);
                        var regexpNoT = RegExp(/gp_town_link/);
                        var numericfilter = parseInt($('#dio_sortfilterbox').val());
                        $('#hides_overview_towns>li').each(function (i, e) {
                            var selectedSort = "";
                            if (regexpRES.test(selection)) {
                                selectedSort = parseInt($(e).find(selection).text()) || 0;
                            } else if (regexpInS.test(selection)) {
                                selectedSort = parseInt($(e).find(selection).text().substr(1)) || 0;
                            } else {
                                selectedSort = $(e).find(selection).text();
                                if (!(selectedSort.indexOf(numericfilter) >= 0)) {
                                    $(e).hide();
                                }
                            }
                            if (numericfilter > selectedSort) {
                                $(e).hide();
                            }
                        });
                    } else {
                        var namefilter = $('#dio_sortfilterbox').val();
                        $('#hides_overview_towns>li').each(function (i, e) {
                            var townname = $(e).find('a.gp_town_link').text();
                            if (namefilter.length > 0 && !(townname.indexOf(namefilter) >= 0)) { $(e).hide(); }
                        });
                    }
                };

                function sort(selection) {
                    order = !order;
                    switch (selection) {
                        case "ironinstore":
                            selection = 'span.eta';
                            break;
                        case "name":
                            selection = 'a.gp_town_link';
                            break;
                        case "wood":
                            selection = 'span.wood span.count';
                            break;
                        case "stone":
                            selection = 'span.stone span.count';
                            break;
                        case "iron":
                            selection = 'span.iron span.count';
                            break;
                    }
                    setfilter(selection);
                    var dio_ArrayUnsorted = $('#hides_overview_towns>li').get();
                    dio_ArrayUnsorted.sort(function (a, b) {
                        var regexpRES = RegExp(/wood|stone|iron/);
                        var regexpInS = RegExp(/eta/);
                        if (regexpRES.test(selection)) {
                            a = parseInt($(a).find(selection).text()) || 0;
                            b = parseInt($(b).find(selection).text()) || 0;
                        } else if (regexpInS.test(selection)) {
                            a = parseInt($(a).find(selection).text().substr(1)) || 0;
                            b = parseInt($(b).find(selection).text().substr(1)) || 0;
                        } else {
                            a = $(a).find(selection).text().toLowerCase();
                            b = $(b).find(selection).text().toLowerCase();
                            if (order) { return a.localeCompare(b); }
                            else { return b.localeCompare(a); }
                        }
                        if (order) { return b - a }
                        else { return a - b }
                    });
                    for (var i = 0; i < dio_ArrayUnsorted.length; i++) {
                        dio_ArrayUnsorted[i].parentNode.appendChild(dio_ArrayUnsorted[i]);
                    }
                }

                $("#dio_sortinit").click(function () {
                    sort($("#dio_sort_towns").val());
                    $(this).toggleClass('active')
                });
            } catch (error) { errorHandling(error, "hidesOverview (init)"); }
        },
        refresh_silver_total: (xhr) => {
            var JQ_silver_total = $('#dio_hides_silver_total .silver_amount');
            var silver_total = parseInt(JQ_silver_total.text());
            var silver_stored = $.parseJSON(xhr.responseText).json.iron_stored;
            silver_total += silver_stored;
            JQ_silver_total.text(silver_total);
        },
        grepo_dropdown: (ID, Options) => {
            var str = '<span class="grepo_input"><span class="left"><span class="right"><select name="' + ID + '" id="' + ID + '" type="text">';
            $.each(Options, function (a, b) {
                if (b[1]) { str += '<option value="' + b[0] + '">' + b[1] + '</option>' }
                else { str += '<option value="' + b + '">' + b + '</option>' }
            });
            str += '</select></span></span></span>';
            return str;
        },
        grepo_input: (Style, ID, Text) => {
            return $('<div class="input_box" style="' + Style + '"><span class="grepo_input"><span class="left"><span class="right"><input id="' + ID + '" type="text" value="' + Text + '"></span></span></span></div>');
        },
        deactivate: () => {
            $('#dio_hidesOverview_style').remove();
            $('#dio_hides_sort_control').remove();
        },
    };

    /*******************************************************************************************************************************
     * City view
     * ----------------------------------------------------------------------------------------------------------------------------
     * | ● City view button : Add a button for opening the city view to the sidemenu of Greplis. Quack function
     * | ● City view : Display the city view in a window. Quack function
     * ----------------------------------------------------------------------------------------------------------------------------
     *******************************************************************************************************************************/

    var city_view_btn = {
        activate: () => {
            try {
                $('<style id="dio_cityview_style">.nui_main_menu ul { height:auto !important; }</style>').appendTo('head');
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=cityview]').remove();
                //$('<style id="dio_cityview_style"> height:+=34px; </style>').appendTo('#ui_box .nui_main_menu .middle .content ul').not("ul li ul");
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').removeClass("first");
                //$('#ui_box .nui_main_menu .middle .content ul li[data-option-id=GRM_button]').addClass("messages main_menu_item first");
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').before('<div id="dio_cityview_style"><li data-option-id="dio_cityview" class="messages main_menu_item first"><span class="content_wrapper"><span class="button_wrapper" style="opacity: 1;">' +
                    '<span class="button"><span class="icon" style="background:url(' + Home_img + 'city-view.png) no-repeat -36px -0px"></span>' +
                    '<span class="indicator" style="display: none;">0</span></span></span><span class="name_wrapper" style="opacity: 1;"><span class="name">' + getTexts("grepo_mainmenu", "island_view") + '</span></span></span></li></div>');

                if ($("#GRM_button").is(":visible")) {
                    $("#GRM_button").addClass('first');
                    $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview]').removeClass("first");
                    $('<style id="dio_cityview_style">#GRM_button { margin-bottom: 0px; }</style>').appendTo('head');
                }

                function dio_island_overview() {
                    $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview] .icon').css({
                        "background": "url(" + Home_img + "city-view.png) no-repeat -36px -0px", ///****
                        "top": "8px",
                        "left": "5px"
                    });
                    $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview] .name').text(getTexts("grepo_mainmenu", "island_view"));
                }
                function dio_city_overview() {
                    $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview] .icon').css({
                        "background": "url(" + Home_img + "city-view.png) no-repeat -3px 1px",
                        "top": "6px",
                        "left": "6px"
                    });
                    $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview] .name').text(uw.DM.getl10n("town_index").window_title);
                }

                $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('dio_city_overview', (e, data) => { dio_island_overview(); });
                $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.island_view.click).subscribe('dio_island_view', (e, data) => { dio_city_overview(); });
                $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.strategic_map.click).subscribe('dio_strategic_map', (e, data) => { dio_city_overview(); });

                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview]').click(() => {
                    if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) { $("#ui_box .bull_eye_buttons .city_overview").click(); }
                    else { $("#ui_box .bull_eye_buttons .island_view").click(); }
                });
            } catch (error) { errorHandling(error, "city_view_btn"); }
        },
        deactivate: () => {
            $('#dio_cityview').remove();
            $('#dio_cityview_style').remove();
            $("#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]").addClass('first');
            $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=dio_cityview]').remove();
            if ($("#GRM_button").is(":visible")) {
                $("#GRM_button").addClass('first');
                $('#ui_box .nui_main_menu .middle .content ul li[data-option-id=messages]').removeClass("first");
                $('<style id="dio_cityview_style">#GRM_button { margin-bottom: 0px; }</style>').appendTo('head');
            }
        },
    };

    var city_view_window = {
        activate: () => {
            try {
                if (DATA.options.dio_Ciw & (typeof (uw.MoleHoleOnBoard) == "undefined")) {
                    $('<style id="dio_city_view_style"> ' +
                        '#ui_box.city-overview-enabled .skip_tutorial.minimized_windows {bottom: 35px; } ' +
                        '#ui_box.city-overview-enabled .skip_tutorial {bottom: 0px; } ' +
                        '.ui_construction_queue.minimized_windows {bottom: -3px; } ' +
                        '</style>').appendTo("head");
                    function WndHandlerDIOtownoverview(wndhandle) { this.wnd = wndhandle; }
                    Function.prototype.inherits.call(WndHandlerDIOtownoverview, uw.WndHandlerDefault);
                    WndHandlerDIOtownoverview.prototype.getDefaultWindowOptions = () => {
                        return {
                            height: 600,
                            width: 800,
                            minimizable: true,
                        };
                    };
                    WndHandlerDIOtownoverview.prototype.onClose = () => {
                        $('#ui_box').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));
                        if ($("#minimap_canvas").hasClass('expanded')) { $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.strategic_map.click).publish({}); }
                        else { $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.island_view.click).publish({}); }
                    };
                    uw.GPWindowMgr.addWndType("DIO_TOWNOVERVIEW", "dio_townoverview", WndHandlerDIOtownoverview, 1);

                    $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('dio_city_overview_window', (e, data) => {
                        if (DATA.options.dio_Ciw & (typeof (uw.MoleHoleOnBoard) == "undefined")) {
                            var wnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_TOWNOVERVIEW) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_TOWNOVERVIEW);

                            if (MID == 'zz' || dio_bug) { wnd.setTitle(getTexts("grepo_mainmenu", "city_view") + " - " + tName); }
                            else { wnd.setTitle("<img class='dio_title_img' src='" + dio_img + "' /><div class='dio_title'>" + getTexts("grepo_mainmenu", "city_view") + " - " + tName + "</div>"); }

                            var html = '<div id="dio_townoverview"></div>';
                            wnd.setContent(html);
                            var JQel = wnd.getJQElement();
                            JQel.find(".gpwindow_content").css({
                                "overflow": "hidden",
                                "border": "1px solid black"
                            });

                            JQel.find('#dio_townoverview').append($('DIV.ui_city_overview')).append($('DIV.ui_construction_queue'));

                            $('DIV.ui_city_overview .town_background').css({ "transform": "translate(-597px, -315px)" });
                        }
                    });

                    $("#ui_box .bull_eye_buttons .rb_map").on("rb:change:value", (e, value, old_value) => {
                        if (value === 'island_view' || value === 'strategic_map') {
                            var wnd = uw.GPWindowMgr.getOpenFirst(uw.Layout.wnd.TYPE_DIO_TOWNOVERVIEW);
                            if (wnd) wnd.close();
                        }
                    });
                }
            } catch (error) { errorHandling(error, "city_view_window"); }
        },
        deactivate: () => {
            $('#dio_city_view_style').remove();
            if (uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_TOWNOVERVIEW)) {
                uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_TOWNOVERVIEW).close();
            }
            city_btn_construction.deactivate();
        },
    };

    var city_btn_construction = {
        activate: () => {
            if (!$('.city_overview_overlay.main').length) {
                setTimeout(() => { $(".construction_queue_sprite.queue_button-idle.queue_button.btn_construction_mode.js-tutorial-btn-construction-mode").click(); }, 20);
            }
            $.Observer(uw.GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe('dio_city_overview', () => {
                if (DATA.options.dio_Cic && !$('.city_overview_overlay.main').length) {
                    setTimeout(() => { $(".construction_queue_sprite.queue_button-idle.queue_button.btn_construction_mode.js-tutorial-btn-construction-mode").click(); }, 20);
                }
            });
        },
        deactivate: () => {
            if ($('.city_overview_overlay.main').length) { $(".construction_queue_sprite.queue_button-idle.queue_button.btn_construction_mode.js-tutorial-btn-construction-mode").click(); }
        },
    };

    /*******************************************************************************************************************************
     * Holiday Special
     *******************************************************************************************************************************/

    var HolidaySpecial = {
        isHalloween: false, isXmas: false, isNewYear: false, isEaster: false,
        activate: () => {
            // Xmas-Smileys -> 18 days
            HolidaySpecial.isXmas = dio.daystamp(344, 361); // 10. Dezember (344) / 28. Dezember (361)
            // NewYear -> 7 days
            HolidaySpecial.isNewYear = dio.daystamp(0, 7); // 1. Januar / 7. Januar

            if (HolidaySpecial.isXmas) { HolidaySpecial.XMas.add(); }
            if (HolidaySpecial.isNewYear) { HolidaySpecial.NewYear.add(); }
        },
        XMas: {
            add: () => {
                if (MID == 'fr') { $('<a href="' + Home + 'pages/dio-tools-david1327" target="_blank"><div id="dio_xmas"></div></a>').appendTo('#ui_box'); }
                else $('<a href="' + Home + 'en/pages/dio-tools-david1327" target="_blank"><div id="dio_xmas"></div></a>').appendTo('#ui_box');

                var dioXMAS = $('#dio_xmas');

                dioXMAS.css({
                    background: 'url("' + Home_img + 'smiley-emoticons-weihnachtsmann-nordpol.gif") no-repeat',
                    height: '51px',
                    width: '61px',
                    position: 'absolute',
                    bottom: '10px',
                    left: '60px',
                    zIndex: '4'
                });
                dioXMAS.tooltip(getTexts("labels", "Merry"));
            }
        },
        NewYear: {
            add: () => {
                var Year = new Date().getFullYear() + "";

                // TODO: Jahreszahl dynamisch setzen
                $('<a href="' + Home + 'en/pages/dio-tools-david1327/" target="_blank"><div id="dio_newYear">' +
                    '<img src="' + Home_img + 'sign2-' + Year.substr(0, 1) + '.gif">' +
                    '<img src="' + Home_img + 'sign2-' + Year.substr(1, 1) + '.gif">' +
                    '<img src="' + Home_img + 'sign2-' + Year.substr(2, 1) + '.gif">' +
                    '<img src="' + Home_img + 'sign2-' + Year.substr(3, 1) + '.gif">' +
                    '</div></a>').appendTo('#ui_box');

                var dioNewYear = $('#dio_newYear');

                dioNewYear.css({
                    position: 'absolute',
                    bottom: '10px',
                    left: '70px',
                    zIndex: '10'
                });
                dioNewYear.tooltip('<img src="' + Home_img + 'smiley-emoticons-party.gif">  ' + getTexts("labels", "Happy"));
            }
        }
    };

    /*******************************************************************************************************************************
     * Scrollbar Style: Chrome, opera, safari
     *******************************************************************************************************************************/
    var Scrollbar = {
        activate: () => {
            $('<style id="dio_Scrollbar_display">#scrollbar { display:block!important; }</style>').appendTo('head');
            Scrollbar.add();
        },
        add: () => {
            try {
                $('#dio_Scrollbar').remove();
                //Blue (Bleu)
                if (DATA.options.dio_aaa) { Scrollbar.collor([145, 165, 193, 0.5], [37, 82, 188, 0.5], [37, 82, 188, 0.8], 'blue') }
                //Red (Rouge)
                else if (DATA.options.dio_bbb) { Scrollbar.collor([193, 145, 145, 0.5], [188, 37, 37, 0.5], [188, 37, 37, 0.8], 'red') }
                //Green (Vert)
                else if (DATA.options.dio_ccc) { Scrollbar.collor([147, 193, 145, 0.5], [37, 188, 46, 0.5], [37, 188, 46, 0.8], 'green') }
                //Pink (Rose)
                else if (DATA.options.dio_ddd) { Scrollbar.collor([165, 145, 193, 0.5], [162, 37, 188, 0.5], [162, 37, 188, 0.8], 'pink') }
                //White (Blanc)
                else if (DATA.options.dio_eee) { Scrollbar.collor([255, 255, 255, 0.5], [152, 152, 152, 0.5], [152, 152, 152, 0.8], 'white') }

                else { Scrollbar.collor([145, 165, 193, 0.5], [37, 82, 188, 0.5], [37, 82, 188, 0.8], 'blue') }
            } catch (error) { errorHandling(error, "Scrollbar"); }
        },
        collor: (a, b, c, collor) => {
            //button
            var scroll_vertical = "height: 16px; background-image: url(" + Home_img + "scroll-", scroll_horizontal = "width: 16px; background-image: url(" + Home_img + "scroll-";
            return $('<style id="dio_Scrollbar">' +
                // Style
                '::-webkit-scrollbar { width: 12px; height: 12px; } ' +
                '::-webkit-scrollbar-track { background-color: rgba(' + a + '); border-top-right-radius: 4px; border-bottom-right-radius: 4px; } ' +
                '::-webkit-scrollbar-thumb { background-color: rgba(' + b + '); border-radius: 3px; } ' +
                '::-webkit-scrollbar-thumb:hover { background-color: rgba(' + c + '); } ' +
                // Button Up
                '::-webkit-scrollbar-button:single-button:vertical:decrement {' + scroll_vertical + 'up-' + collor + '.png);} ' +
                '::-webkit-scrollbar-button:single-button:vertical:decrement:hover {' + scroll_vertical + 'up-' + collor + '-hover.png);} ' +
                // Button Down
                '::-webkit-scrollbar-button:single-button:vertical:increment {' + scroll_vertical + 'down-' + collor + '.png);} ' +
                '::-webkit-scrollbar-button:vertical:single-button:increment:hover {' + scroll_vertical + 'down-' + collor + '-hover.png);} ' +
                // Button Left
                '::-webkit-scrollbar-button:single-button:horizontal:decrement {' + scroll_horizontal + 'left-' + collor + '.png);} ' +
                '::-webkit-scrollbar-button:single-button:horizontal:decrement:hover {' + scroll_horizontal + 'left-' + collor + '-hover.png);} ' +
                // Button Right
                '::-webkit-scrollbar-button:single-button:horizontal:increment {' + scroll_horizontal + 'right-' + collor + '.png);} ' +
                '::-webkit-scrollbar-button:horizontal:single-button:increment:hover {' + scroll_horizontal + 'right-' + collor + '-hover.png);} ' +

                '</style>').appendTo('head');
        },
        deactivate: () => {
            $('#dio_Scrollbar').remove();
            $('#dio_Scrollbar_display').remove();
        },
    };

    /*******************************************************************************************************************************
     * Forum Delete Multiple
     *******************************************************************************************************************************/

    var ForumDeleteMultiple = {
        activate: () => {
            try {
                if ($('.post_functions').length > 1) {
                    if (!$('#dio_deleteAllcheckbox').length) {
                        if ($('div.forum_footer').length) { $("div.forum_footer").append('<input id="dio_deleteAllcheckbox" type="checkbox"  style="margin:0px -7px 0 12px">'); }
                        else { $("#forum div.game_list_footer").append('<input id="dio_deleteAllcheckbox" type="checkbox"  style="float:right; margin:7px 3px; right: 6px;">'); }
                    }
                }
                $('#dio_deleteAllcheckbox').click(function () { $('#forum input[type="checkbox"]').prop('checked', this.checked) });

                // Tooltip
                $('#dio_deleteAllcheckbox').tooltip(dio_icon + getTexts("Quack", "mark_All"));
            } catch (error) { errorHandling(error, "ForumDeleteMultiple"); }
        },
        deactivate: () => { $('#dio_deleteAllcheckbox').remove(); },
    };

    /*******************************************************************************************************************************
     * select unit shelper
     *******************************************************************************************************************************/

    var selectunitshelper = {
        activate: () => {
            try {
                var wnds = uw.GPWindowMgr.getOpen(uw.Layout.wnd.TYPE_TOWN);
                for (var e in wnds) {
                    if (wnds.hasOwnProperty(e)) {
                        var wndid = wnds[e].getID();

                        var testel = $('DIV#gpwnd_' + wndid + ' A.dio_balanced');
                        if (testel.length > 0) continue;

                        var handler = wnds[e].getHandler();

                        $('DIV#gpwnd_' + wndid + ' A.select_all_units').after(' | <a class="dio_balanced" style="position:relative; top:4px" href="#">' + getTexts("Quack", "no_overload") + '</a> | <a class="dio_delete" style="position:relative; top:4px" href="#">' + uw.DM.getl10n("market").delete_all_market_offers + '</a>');

                        $('.gtk-deselect-units').css({ "display": "none" });
                        $('.attack_support_window .town_units_wrapper .ship_count').css({ "margin-left": "0px" });

                        var dio_bl_groundUnits = new Array('sword', 'slinger', 'archer', 'hoplite', 'rider', 'chariot', 'catapult', 'minotaur', 'zyklop', 'medusa', 'cerberus', 'fury', 'centaur', 'calydonian_boar', 'godsent');

                        $('DIV#gpwnd_' + wndid + ' A.dio_balanced').click(function () {
                            var units = new Array();
                            var item;

                            for (var i = 0; i < dio_bl_groundUnits.length; i++) {
                                if (handler.data.units[dio_bl_groundUnits[i]]) {
                                    item = { name: dio_bl_groundUnits[i], count: handler.data.units[dio_bl_groundUnits[i]].count, population: handler.data.units[dio_bl_groundUnits[i]].population };
                                    units.push(item);
                                }
                            }
                            var berth = "";
                            if (handler.data.researches && handler.data.researches.berth) {
                                berth = handler.data.researches.berth;
                            } else {
                                berth = 0;
                            }

                            var totalCap = handler.data.units.big_transporter.count * (handler.data.units.big_transporter.capacity + berth) + handler.data.units.small_transporter.count * (handler.data.units.small_transporter.capacity + berth);
                            units.sort(function (a, b) {
                                return b.population - a.population;
                            });

                            for (i = 0; i < units.length; i++) {
                                if (units[i].count == 0) {
                                    units.splice(i, 1);
                                    i = i - 1;
                                };
                            }

                            var restCap = totalCap;
                            var sendUnits = new Array();
                            for (i = 0; i < units.length; i++) {
                                item = { name: units[i].name, count: 0 };
                                sendUnits[units[i].name] = item;
                            };

                            var hasSent;
                            var k = 0;
                            while (units.length > 0) {
                                hasSent = false;
                                k = k + 1;
                                for (i = 0; i < units.length; i++) {
                                    if (units[i].population <= restCap) {
                                        hasSent = true;
                                        units[i].count = units[i].count - 1;
                                        sendUnits[units[i].name].count = sendUnits[units[i].name].count + 1;
                                        restCap = restCap - units[i].population;
                                    }
                                }
                                for (i = 0; i < units.length; i++) {
                                    if (units[i].count == 0) {
                                        units.splice(i, 1);
                                        i = i - 1;
                                    };
                                }
                                if (!hasSent) {
                                    break;
                                }
                            }

                            handler.getUnitInputs().each(function () {
                                if (!sendUnits[this.name]) {
                                    if (handler.data.units[this.name].count > 0) {
                                        this.value = handler.data.units[this.name].count;
                                    } else {
                                        this.value = '';
                                    }
                                }
                            });

                            for (i = 0; i < dio_bl_groundUnits.length; i++) {
                                if (sendUnits[dio_bl_groundUnits[i]]) {
                                    if (sendUnits[dio_bl_groundUnits[i]].count > 0) {
                                        $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_' + dio_bl_groundUnits[i]).val(sendUnits[dio_bl_groundUnits[i]].count);
                                    } else {
                                        $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_' + dio_bl_groundUnits[i]).val('');
                                    }
                                }
                            }

                            $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_sword').trigger('change');
                        });

                        $('DIV#gpwnd_' + wndid + ' A.dio_delete').click(function () {
                            handler.getUnitInputs().each(function () {
                                this.value = '';
                            });
                            $('DIV#gpwnd_' + wndid + ' INPUT.unit_type_sword').trigger('change');
                        });

                    }
                }
            } catch (error) { errorHandling(error, "selectunitshelper"); }
        },
        deactivate: () => { $('#dio-ship_count').remove(); },
    };

    /*******************************************************************************************************************************
     * hotkeys
     *******************************************************************************************************************************/

    var hotkeys = {
        ImagesHotkeys: {
            key: Home_img + 'dj4uootz.jpg',
            city_select: Home_img + 'nzhgrbzm.png',
            administrator: Home_img + 'j4kvrnok.png',
            captain: Home_img + '8r8ty3md.png',
            menu: Home_img + 'giiagnrp.png'
        },
        activate: () => {
            $('.toolbar_activities .right').before('<a id="dio_BTN_HK" style="z-index: 6; top: -27px; left: 24px; float: right; position: relative;"><img src="' + Home_img + 'hotkeys.png" style="float:left; border-width: 0px"></a></a>');

            $('<style id="dio_hotkeys_style">.town_name_area {z-index: 6}</style>').appendTo('head');
            if ($('#gsa_shortcutOverview').is(':visible')) {
                if ($('.temple_commands').is(':visible')) { $('<style id="dio_MH_attsup_style">#MH_attsup {left:422px !important;}</style>').appendTo('head'); }
                else { $('<style id="dio_MH_attsup_style">#MH_attsup {left:422px !important;}</style>').appendTo('head'); }
            }
            else {
                if ($('.temple_commands').is(':visible')) { $('<style id="dio_MH_attsup_style">#MH_attsup {left:413px !important;}</style>').appendTo('head'); }
                else { $('<style id="dio_MH_attsup_style">#MH_attsup {left:384px !important;}</style>').appendTo('head'); }
            }
            var mousePopupHTML = '<span style="margin-bottom:3px; display:inline-block">' + dio_icon + '<b>' + getTexts("hotkeys", "hotkeys") + ':</b></span>';
            var mousePopupArray = {};
            mousePopupArray[getTexts("hotkeys", "city_select")] = [
                [hotkeys.ImagesHotkeys.city_select],
                ["<span style='display:block;margin-top:-2px'>&#8592;</span>", getTexts("hotkeys", "last_city")],
                ["<span style='display:block;margin-top:-2px'>&#8594;</span>", getTexts("hotkeys", "next_city")],
                ["<span style='display:block;font-size:9px;margin-top:2px'>Sp</span>", getTexts("hotkeys", "jump_city")] //&#8629;
            ];
            /*A, alliance
                B, // reports (de)
                C, en=city_view (fr V) fr=Caserne
                D, // ?en dehors
                E, settings
                F, alliance_forum
                G, Grotte
                H, heroes
                I, // Culture (Agora) 73
                J, //
                K, // !!!
                L, //
                M, messages
                N, notes
                O, en=Caserne
                P, Port ?PROFILE
                Q, //
                R, Rapports
                S, Senate
                T, //Défense (Agora 84
                U, // Simulateur (Agora) 85
                V, // fr=city_view (en c)
                W, //
                X, farming_villages
                Y, // En dehors (Agora) 89
                Z, Académie*/
            var Text_premium = uw.DM.getl10n("layout").premium_button.premium_menu;
            mousePopupArray[getTexts("hotkeys", "menu")] = [
                [hotkeys.ImagesHotkeys.menu],
                ["S", getTexts("hotkeys", "Senate")],
                [(MID == 'fr') ? "V" : "C", uw.DM.getl10n("town_index").window_title],
                [(MID == 'de') ? "N" : "M", uw.DM.getl10n("layout").main_menu.items.messages],
                [(MID == 'de') ? "B" : "R", uw.DM.getl10n("layout").main_menu.items.reports],
                ["A", uw.DM.getl10n("layout").main_menu.items.alliance],
                ["F", uw.DM.getl10n("layout").main_menu.items.allianceforum],
                ["E", uw.DM.getl10n("layout").main_menu.items.settings],
                [(MID == 'de') ? "M" : "N", uw.DM.getl10n("notes").window_title]
            ];
            mousePopupArray[uw.DM.getl10n("docks").buildings] = [
                [hotkeys.ImagesHotkeys.city_select],
                ["G", uw.DM.getl10n("hide").index.hide],
                ["Z", "Académie"],
                ["P", uw.DM.getl10n("layout").units.harbor],
                [(MID == 'fr') ? "C" : "O", uw.DM.getl10n("layout").units.barracks],
                ["T", uw.DM.getl10n("place").tabs[0] + " (Agora)"],
                ["Y", Text_premium.outer_units + " (Agora)"],
                ["U", getTexts("Options", "sim")[0] + " (Agora)"],
                ["I", Text_premium.culture_overview + " (Agora)"]
            ];
            mousePopupArray[uw.DM.getl10n("advisor").curator] = [
                [hotkeys.ImagesHotkeys.administrator],
                ["1", Text_premium.trade_overview],
                ["2", Text_premium.command_overview],
                ["3", Text_premium.recruit_overview],
                ["4", Text_premium.unit_overview],
                ["5", Text_premium.outer_units],
                ["6", Text_premium.building_overview],
                ["7", Text_premium.culture_overview],
                ["8", Text_premium.gods_overview],
                ["9", Text_premium.hides_overview],
                ["0", Text_premium.town_group_overview],
                [(MID == 'de') ? "&szlig;" : "-", Text_premium.towns_overview]
            ];
            mousePopupArray[getTexts("hotkeys", "captain")] = [
                [hotkeys.ImagesHotkeys.captain],
                [(MID == 'de') ? "´" : "=", Text_premium.attack_planer],
                ["X", Text_premium.farm_town_overview]
            ];
            if ($('.ui_heroes_overview_container').is(':visible')) {
                mousePopupArray[getTexts("hotkeys", "menu")].push(["H", getTexts("hotkeys", "council")]);
            }

            $.each(mousePopupArray, function (a, b) {
                mousePopupHTML += '<p/><span style="margin-bottom:-11px;margin-top:-8px;border-bottom:1px solid #B48F45; width:100%;display:block"><span style="display:inline-block;height:17px;width:17px;vertical-align:middle;margin-right:5px;background-image:url(' + b[0] + ')"></span><span style="display:inline-block;height:17px;vertical-align:middle">' + a + ':</span></span><br/>';
                $.each(b, function (c, d) {
                    if (c != 0) mousePopupHTML += '<span style="display:inline-block;height:17px;width:17px;text-align:center;vertical-align:middle;margin-right:5px;background-image:url(' + hotkeys.ImagesHotkeys.key + ')"><span style="display:block;margin-top:-1px">' + d[0] + '</span></span><span style="display:inline-block;margin-bottom:1px;height:17px;vertical-align:middle">' + d[1] + '</span><br/>';
                });
            });
            $('#dio_BTN_HK').tooltip(mousePopupHTML);

            $("#dio_BTN_HK").click(() => { hotkeys.add() });
            hotkeys.add();
        },
        add: () => {
            try {
                var ctrlDown = false;

                document.onkeyup = function (e) { if (e.keyCode == "17") ctrlDown = false; };
                document.onkeydown = function (e) {
                    e = e || window.event;
                    var target = e.target.tagName.toLowerCase();

                    // Détection du CTRL pressé ou non
                    if ((e.keyCode == "17" || e.keyCode == "91")) ctrlDown = true;

                    // Si pas dans une case texte
                    if (!$(e.target).is('textarea') && !$(e.target).is('input') && !ctrlDown) {
                        // Flèches directionnelles
                        /*if (e.keyCode == '37' || e.keyCode == '39') {
                            setTimeout(function () {
                                updateIcon();
                                updatehides();
                            }, 200);
                        }*/
                        if (((MID == 'fr') ? e.keyCode == "86" : e.keyCode == '67') && (DATA.options.dio_Hot)) {
                            if (!$("#ui_box .bull_eye_buttons .city_overview").hasClass('checked')) {
                                $("#ui_box .bull_eye_buttons .city_overview").click();
                            } else {
                                $("#ui_box .bull_eye_buttons .island_view").click();
                            }
                        }
                        // Agora !!!
                        if (e.keyCode == '73' && (DATA.options.dio_Hot)) {
                            uw.PlaceWindowFactory.openPlaceWindow('culture');
                        }
                        // simulator
                        if (e.keyCode == "85" && (DATA.options.dio_Hot)) {
                            uw.PlaceWindowFactory.openPlaceWindow('simulator', open);
                        }
                        // Troupes en dehors
                        if (e.keyCode == "89" && (DATA.options.dio_Hot)) {
                            uw.PlaceWindowFactory.openPlaceWindow('units_beyond');
                        }
                        // Défense (Agora)
                        if (e.keyCode == "84" && (DATA.options.dio_Hot)) {
                            uw.PlaceWindowFactory.openPlaceWindow('index');
                        }
                        // Sénat
                        if (e.keyCode == '83' && (DATA.options.dio_Hot)) {
                            uw.MainWindowFactory.openMainWindow();
                        }
                        // Caserne
                        if (((MID == 'fr') ? e.keyCode == "67" : e.keyCode == '79') && (DATA.options.dio_Hot)) {
                            uw.BarracksWindowFactory.openBarracksWindow();
                        }
                        // Grotte
                        if (e.keyCode == '71' && (DATA.options.dio_Hot)) {
                            uw.HideWindowFactory.openHideWindow();
                        }
                        // Port
                        if (e.keyCode == '80' && (DATA.options.dio_Hot)) {
                            uw.DocksWindowFactory.openDocksWindow();
                        }
                        // Académie
                        if (e.keyCode == "90" && (DATA.options.dio_Hot)) {
                            uw.AcademyWindowFactory.openAcademyWindow();
                        }
                        // Rapports
                        if (((MID == 'de') ? e.keyCode == "66" : e.keyCode == "82") && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_REPORT, uw.DM.getl10n("layout").main_menu.items.reports || "Reports");
                        }
                        // Forum
                        if (e.keyCode == "70" && ((DATA.options.dio_Hot))) {
                            uw.Layout.allianceForum.open();
                        }
                        //
                        if (e.keyCode == "69" && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_PLAYER_SETTINGS, getTexts("hotkeys", "settings"));
                        }
                        /*/ PROFILE
                        if (e.keyCode == "80" && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_PLAYER_PROFILE_EDIT, ' ');
                        }*/
                        // Remparts
                        if (e.keyCode == "102" && (DATA.options.dio_Hot)) {
                            uw.BuildingWindowFactory.open('wall');
                        }
                        // Ferme
                        /*if (e.keyCode == "70" && (DATA.options.dio_Hot)) {
                            uw.FarmWindowFactory.openFarmWindow();
                        }*/
                        /*/ Entrepôt
                        if (e.keyCode == "69" && (DATA.options.dio_Hot)) {
                           uw.BuildingWindowFactory.open('storage');
                        }*/
                        // Scierie
                        if (e.keyCode == "97" && (DATA.options.dio_Hot)) {
                            uw.LumberWindowFactory.openLumberWindow();
                        }
                        // Carrière
                        if (e.keyCode == "98" && (DATA.options.dio_Hot)) {
                            uw.StonerWindowFactory.openStonerWindow();
                        }
                        // Grotte
                        if (e.keyCode == "71" && (DATA.options.dio_Hot)) {
                            uw.BuildingWindowFactory.open('hide');
                        }
                        // Mine d'argent
                        if (e.keyCode == "99" && (DATA.options.dio_Hot)) {
                            uw.IronerWindowFactory.openIronerWindow();
                        }
                        // Marché
                        if (e.keyCode == "100" && (DATA.options.dio_Hot)) {
                            uw.MarketWindowFactory.openMarketWindow();
                        }
                        // ALLIANCE
                        if (e.keyCode == "65" && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_ALLIANCE);
                        }
                        // Messages
                        if (((MID == 'de') ? e.keyCode == "78" : e.keyCode == "77") && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_MESSAGE, uw.DM.getl10n("layout").main_menu.items.messages || "Messages")
                        }
                        // Forum
                        if (e.keyCode == "70" && (DATA.options.dio_Hot)) {
                            uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_ALLIANCEFORUM)
                        }
                        /*/ Rang
                        if (e.keyCode == "82" && (DATA.options.dio_Hot)) {
                            RankingWindowFactory.openRankingWindow();
                        }*/
                        // RACOURCI Administrateur
                        if (e.keyCode == "49" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openTradeOverview();
                        }
                        if (e.keyCode == "50" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openCommandOverview();
                        }
                        if (e.keyCode == "51" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openMassRecruitOverview();
                        }
                        if (e.keyCode == "52" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openUnitsOverview();
                        }
                        if (e.keyCode == "53" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openOuterUnitsOverview();
                        }
                        if (e.keyCode == "54" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openBuildingsOverview();
                        }
                        if (e.keyCode == "55" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openCultureOverview();
                        }
                        if (e.keyCode == "56" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openGodsOverview();
                        }
                        if (e.keyCode == "57" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openHidesOverview();
                        }
                        if (e.keyCode == "48" && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openTownGroupOverview();
                        }
                        if ((e.keyCode == "63" || e.keyCode == "219" || e.keyCode == "109" || e.keyCode == "189") && (DATA.options.dio_Hot)) {
                            uw.TownOverviewWindowFactory.openTownsOverview();
                        }
                        // Villages de paysans
                        if (e.keyCode == "88" && (DATA.options.dio_Hot)) {
                            uw.FarmTownOverviewWindowFactory.openFarmTownOverview();
                        }
                        // Plannificateur
                        if ((e.keyCode == "192" || e.keyCode == "221" || e.keyCode == "187" || e.keyCode == "61") && (DATA.options.dio_Hot)) {
                            uw.AttackPlannerWindowFactory.openAttackPlannerWindow();
                        }
                        // Outil de réservation
                        if (e.keyCode == "16" && (DATA.options.dio_Hot)) {
                            uw.hOpenWindow.openReservationList(); void (0);
                        }
                        // Notes
                        if (((MID == 'de') ? e.keyCode == "77" : e.keyCode == "78") && (DATA.options.dio_Hot)) {
                            uw.NotesWindowFactory.openNotesWindow();
                        }
                        //
                        if (e.keyCode == "13" && (DATA.options.dio_Hot)) {
                            uw.WMap.mapJump({
                                'id': + uw.Game.townId,
                                'ix': uw.WMap.islandPosition.x,
                                'iy': uw.WMap.islandPosition.y
                            });
                        }
                        //
                        if (e.keyCode == "72" && $('.ui_heroes_overview_container').is(':visible') && (DATA.options.dio_Hot)) {
                            uw.HeroesWindowFactory.openHeroesWindow();
                        }
                        if (e.keyCode == "38" && (DATA.options.dio_Hot) && $(e.target).find("ul#fto_town_list").length) {
                            uw.farmingvillageshelper.switchTown("up");
                        }
                        if (e.keyCode == "40" && (DATA.options.dio_Hot) && $(e.target).find("ul#fto_town_list").length) {
                            uw.farmingvillageshelper.switchTown("down");
                        }
                    }
                }
            } catch (error) { errorHandling(error, "hotkeys"); }
        },
        deactivate: () => {
            $('#dio_BTN_HK').remove();
            $('#dio_MH_attsup_style').remove();
        },
    };

    /*******************************************************************************************************************************
     * island Farming Villages
     *******************************************************************************************************************************/

    var islandFarmingVillages = {
        activate: () => {
            try {
                $('<style id="dio_message_recipients_style">' +
                    '#message_recipients { width:630px ; }' +
                    '#message_subject { width:630px ; }' +
                    '#message_alliance { position:absolute; right: 3px; top: 6px; }' +
                    'div.island_info_wrapper div.center1 { left:239px; width: 466px; top: 0px; }' +
                    'div.island_info_left { bottom: 0px; left: 0px; position: absolute; }' +
                    'div.island_info_towns ul#island_info_towns_left_sorted_by_name { height: 347px; }' +
                    'div.island_info_right { bottom: 0px; right: 0px; position: absolute; }' +
                    'div.island_info_right UL.game_list { height: 378px; }' +
                    '#farm_town_overview_btn { top: 465px; right: 9px; }' +
                    '#dio_message_island { float: right; right: 3px; height: 23px; width: 22px; background: url("' + Home_img + 'islandmessage.png") no-repeat; 0px 0px; }' +
                    '</style>').appendTo('head');

                $("#island_towns_controls").append('<a id="dio_message_island"></a>');

                $("#dio_message_island").hover(
                    function () { $(this).css({ "background-position": "0px -23px" }); },
                    function () { $(this).css({ "background-position": "0px 0px" }); }
                );
                $("#dio_message_island").click(function () {
                    var spielernamen = "";
                    if (!$("#island_info_towns_left_sorted_by_name li span.player_name a.gp_player_link").is(":visible")) {
                        $("#island_info_towns_left_sorted_by_name li span.player_name").each(function () {
                            if ($(this).text() != pName && $(this).text() != uw.DM.getl10n("alliance").profile.tooltip_msg_no_recipients && $(this).text() != getTexts("messages", "no_cities") + "." && spielernamen.indexOf($(this).text()) < 0) {
                                spielernamen += $(this).text() + ";";
                            }
                        });
                    } else {
                        $("#island_info_towns_left_sorted_by_name li span.player_name a.gp_player_link").each(function () {
                            if ($(this).text() != pName && $(this).text() != uw.DM.getl10n("alliance").profile.tooltip_msg_no_recipients && $(this).text() != getTexts("messages", "no_cities") + "." && spielernamen.indexOf($(this).text()) < 0) {
                                spielernamen += $(this).text() + ";";
                            }
                        });
                    }
                    uw.Layout.newMessage.open({ recipients: spielernamen });
                });

                // Tooltip
                $('#dio_message_island').tooltip(dio_icon + uw.DM.getl10n("layout").main_menu.items.messages + " " + uw.DM.getl10n("bbcodes").island.name);
            } catch (error) { errorHandling(error, "islandFarmingVillages"); }
        },
        deactivate: () => {
            $('#dio_message_island').remove();
            $('#dio_message_recipients_style').remove();
        },
    };

    /*******************************************************************************************************************************
     * towns list
     *******************************************************************************************************************************/

    var townslist = {
        timeout: null,
        activate: () => {
            townslist.timeout = setInterval(() => {
                if ($('#town_groups_list').length) {
                    if (!$('.dio_town_bb').get(0)) { townslist.add(); }
                }
            }, 100); //0.1s
            dio.clipboard("#dio-copy-townslist", null, "townslist", null)
            createWindowType("DIO_BBCODE", getTexts("labels", "tow"), 470, 375, true, [240, 70]); //[240, 70]
            $('<style id="dio_town_list_bb_style"> ' +
                '#dio_town_list_bb { background: url("' + Home_img + 'subforum-old.png") no-repeat; height: 15px; width: 15px; position: absolute; right: 6px; top: 2px;} ' +
                '.dio_town_bb { position: absolute; top: 2px; right: 20px; width: 30px; height: 20px; } ' +
                '.dio_title_bb { margin:1px 6px 13px 3px; color:rgb(126,223,126); } ' +
                '#dio_close_bb { display: inline-block; float: none; position: relative; top: 5px; margin-left: 10px; } ' +
                '#dio_close_bb.close_b { position: absolute; top: -37px; right: -8px; } ' +
                '</style>').appendTo('head');
        },
        add: () => {
            try {
                if (!$('#town_groups_list a.town_bb').length != 0) {
                    $('.content .group_name .name').append('<a class="dio_town_bb"><div id="dio_town_list_bb"></div></a>');
                    $('.dio_town_bb').click(function (e) {
                        $('.button.js-button-caption').click();
                        let towngrp_id = $(this).parent().data('groupid');
                        if (uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE)) {
                            uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE).close();
                        }
                        let cities_towngroup = uw.ITowns.town_group_towns.getTowns(towngrp_id)
                        let bb_contentP1 = "[quote][size=9][player]" + pName + "[/player][/size] ";
                        let bb_contentP2 = bb_contentP1, bb_contentP3 = bb_contentP1, bb_contentP4 = bb_contentP1, bb_contentP5 = bb_contentP1;
                        let bb_premium = 0, bb_premiumb = "", bb_premiumc = false;

                        if (uw.Game.premium_features.curator >= uw.Timestamp.now()) {
                            bb_premium = uw.DM.getl10n("layout").premium_button.premium_menu.town_group_overview + ": " + uw.MM.getCollections().TownGroup[0]._byId[towngrp_id].attributes.name + " ";
                            bb_contentP1 += bb_premium; bb_contentP2 += bb_premium; bb_contentP3 += bb_premium; bb_contentP4 += bb_premium; bb_contentP5 += bb_premium;
                            bb_premiumb = "(" + bb_premium + ")";
                            bb_premiumc = true;
                        }
                        let bb_count = 0, bb_nombre_ville = 0, bb_nonbre = 0;
                        const bb_ville = uw.DM.getl10n("market").city;

                        $.each(cities_towngroup, function (key, town) {
                            bb_nombre_ville++;
                        });

                        if (bb_nombre_ville < 61) { bb_nonbre = 1; }
                        else if (bb_nombre_ville < 121) { bb_nonbre = 2; }
                        else if (bb_nombre_ville < 181) { bb_nonbre = 3; }
                        else if (bb_nombre_ville < 241) { bb_nonbre = 4; }
                        else { bb_nonbre = 5; }

                        if (bb_nombre_ville < 301) {
                            bb_contentP1 += "(" + bb_nombre_ville + " " + bb_ville + ") " + (bb_nombre_ville < 61 ? "" : "(1/" + bb_nonbre + ")");
                            bb_contentP2 += "(" + bb_nombre_ville + " " + bb_ville + ") (2/" + bb_nonbre + ")";
                            bb_contentP3 += "(" + bb_nombre_ville + " " + bb_ville + ") (3/" + bb_nonbre + ")";
                            bb_contentP4 += "(" + bb_nombre_ville + " " + bb_ville + ") (4/" + bb_nonbre + ")";
                            bb_contentP5 += "(" + bb_nombre_ville + " " + bb_ville + ") (5/" + bb_nonbre + ")";
                        } else {
                            bb_contentP1 += "(" + bb_ville + " 300/" + bb_nombre_ville + ") (1/5)";
                            bb_contentP2 += "(" + bb_ville + " 300/" + bb_nombre_ville + ") (2/5)";
                            bb_contentP3 += "(" + bb_ville + " 300/" + bb_nombre_ville + ") (3/5)";
                            bb_contentP4 += "(" + bb_ville + " 300/" + bb_nombre_ville + ") (4/5)";
                            bb_contentP5 += "(" + bb_ville + " 300/" + bb_nombre_ville + ") (5/5)";
                            bb_nonbre = 5;
                        }

                        bb_contentP1 += "\n[table]\n"; bb_contentP2 += "\n[table]\n"; bb_contentP3 += "\n[table]\n"; bb_contentP4 += "\n[table]\n"; bb_contentP5 += "\n[table]\n";
                        $.each(cities_towngroup, function (key, town) {

                            bb_count++;
                            if (bb_count < 61) { bb_contentP1 += townslist.content(bb_count, town); }
                            else if (bb_count < 121) { bb_contentP2 += townslist.content(bb_count, town); }
                            else if (bb_count < 181) { bb_contentP3 += townslist.content(bb_count, town); }
                            else if (bb_count < 241) { bb_contentP4 += townslist.content(bb_count, town); }
                            else if (bb_count < 301) { bb_contentP5 += townslist.content(bb_count, town); }
                            else { }
                        });
                        const wnd = uw.Layout.wnd.Create(uw.GPWindowMgr.TYPE_DIO_BBCODE) || uw.Layout.wnd.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE).close();
                        const dio_version_PUB = "[url=" + Home + "en/pages/dio-tools-david1327/]DIO-TOOLS-David1327[/url] - v." + dio_version + "[/quote]";
                        bb_contentP1 += "[/table]" + dio_version_PUB; bb_contentP2 += "[/table]" + dio_version_PUB; bb_contentP3 += "[/table]" + dio_version_PUB; bb_contentP4 += "[/table]" + dio_version_PUB; bb_contentP5 += "[/table]" + dio_version_PUB;
                        const expRahmen_a = "<button id='dio_close_bb' role='button' class='close_a close_b ui-dialog-titlebar-close'></button><div id='dio_townslist' class='inner_box'><div class='game_border'><div class='game_border_top'></div>" +
                            "<div class='game_border_bottom'></div><div class='game_border_left'></div>" +
                            "<div class='game_border_right'></div><div class='game_border_corner corner1'></div>" +
                            "<div class='game_border_corner corner2'></div><div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div><div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
                        let expRahmen_bP1 = "<div style='height: 280px; overflow-x: hidden;'><textarea id='expTextareaP1' style='height: 120px; width: 99%;'>";
                        if (bb_nombre_ville < 61) {
                            expRahmen_bP1 = "<div style='height: 280px; overflow-x: hidden;'><textarea id='expTextareaP1' style='height: 235px; width: 99%;'>";
                        }
                        const expRahmen_bP2 = "<textarea id='expTextareaP2' style='height: 120px; width: 98%;'>";
                        const expRahmen_bP3 = "<textarea id='expTextareaP3' style='height: 120px; width: 98%;'>";
                        const expRahmen_bP4 = "<textarea id='expTextareaP4' style='height: 120px; width: 98%;'>";
                        const expRahmen_bP5 = "<textarea id='expTextareaP5' style='height: 120px; width: 98%;'>";
                        const expRahmen_cP1 = "</textarea><div style='text-align: center;'>" + dio.createButton(getTexts("messages", "copy") + (bb_nombre_ville < 61 ? "" : " (1/" + bb_nonbre + ")"), "dio-copy-townslist", null, 'data-clipboard-target="#expTextareaP1"') + "</div>";
                        const expRahmen_cP2 = "</textarea><div style='text-align: center;'>" + dio.createButton(getTexts("messages", "copy") + " (2/" + bb_nonbre + ")", "dio-copy-townslist", null, 'data-clipboard-target="#expTextareaP2"') + "</div>";
                        const expRahmen_cP3 = "</textarea><div style='text-align: center;'>" + dio.createButton(getTexts("messages", "copy") + " (3/" + bb_nonbre + ")", "dio-copy-townslist", null, 'data-clipboard-target="#expTextareaP3"') + "</div>";
                        const expRahmen_cP4 = "</textarea><div style='text-align: center;'>" + dio.createButton(getTexts("messages", "copy") + " (4/" + bb_nonbre + ")", "dio-copy-townslist", null, 'data-clipboard-target="#expTextareaP4"') + "</div>";
                        const expRahmen_cP5 = "</textarea><div style='text-align: center;'>" + dio.createButton(getTexts("messages", "copy") + " (5/" + bb_nonbre + ")", "dio-copy-townslist", null, 'data-clipboard-target="#expTextareaP5"') + "</div>";

                        const expRahmen_d = "</div><div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
                        const expRahmen_e = "<div style='font-weight: bold; margin-left: 5px;'>" + uw.DM.getl10n("layout").town_name_area.no_towns_in_group + " " + bb_premiumb + "</div>";

                        let expTitel = "";

                        if (bb_nombre_ville > 300) {
                            expTitel = (bb_premiumc ? bb_premium + "(" + bb_ville + " 300/" + bb_nombre_ville + ")" : bb_ville + " 300/" + bb_nombre_ville) + "</div>";
                        } else {
                            expTitel = (bb_premiumc ? bb_premium + "(" + bb_nombre_ville + " " + bb_ville + ")" : bb_nombre_ville + " " + bb_ville) + "</div>";
                        }

                        wnd.setContent(expRahmen_a + expTitel +
                            (bb_nombre_ville > 0 ? (expRahmen_bP1 + bb_contentP1 + expRahmen_cP1) : expRahmen_e) +
                            (bb_nombre_ville > 60 ? (expRahmen_bP2 + bb_contentP2 + expRahmen_cP2) : "") +
                            (bb_nombre_ville > 120 ? (expRahmen_bP3 + bb_contentP3 + expRahmen_cP3) : "") +
                            (bb_nombre_ville > 180 ? (expRahmen_bP4 + bb_contentP4 + expRahmen_cP4) : "") +
                            (bb_nombre_ville > 240 ? (expRahmen_bP5 + bb_contentP5 + expRahmen_cP5) : "") +
                            expRahmen_d);

                        $('.close_a').click(() => { uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE).close(); });

                        $('#dio-copy-townslist').click(() => {
                            if ($('#town_groups_list').length) { $('.button.js-button-caption').click(); }
                            setTimeout(() => { uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE).close(); }, 300)
                        });
                    });

                }
                $('#dio_town_list_bb').tooltip(dio_icon + getTexts("Options", "Tol")[0]);
            } catch (error) { errorHandling(error, "townslist"); }
        },
        content: (bb_count, town) => {
            return "[*]" + bb_count + ".[|][town]" + town.attributes.town_id + "[/town][|]" + town.town_model.attributes.points + " " + uw.DM.getl10n("mass_recruit").sort_by.points + "[|]" + uw.DM.getl10n("tooltips").ocean + " " + town.town_model.attributes.sea_id + "[/*]\n";
        },
        deactivate: () => {
            $('#dio_town_list_bb_style').remove();
            if (uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE)) {
                uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODE).close();
            }
            clearTimeout(townslist.timeout);
            townslist.timeout = null;
        },
    };

    /*******************************************************************************************************************************
     * Message Exporter
     *******************************************************************************************************************************/

    var MessageExport = {
        activate: () => {
            if ($('#message_message_list').length) { MessageExport.add(); }
        },
        add: () => {
            try {
                dio.clipboard("#dio-copy-message-quote", null, "MessageExport", true)
                createWindowType("DIO_BBCODEE", getTexts("messages", "bbmessages"), 700, 350, true, ["center", "center", 100, 100]);
                const wnd = uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_MESSAGE);
                const wndid = wnd.getID();
                if (!$("#dio_messageExport").is(":visible")) {
                    $('#qt_messageExport').remove();
                    $("DIV#gpwnd_" + wndid + " DIV#message_message_list .game_header:first").append('<div id="dio_messageExport" style="float:right; margin-right:-5px; margin-top:-21px; cursor:pointer;">' + dio.createButton(getTexts("messages", "bbmessages")) + '</div><div id="dio_messageExportTMP" style="display:none"></div>');
                    $("#dio_messageExport").tooltip(getTexts("messages", "export"));
                    $("#dio_messageExport").click(function () {

                        let bb_content = "[quote]";

                        // Titre
                        let author, alliance, title, i;
                        (title = $("#message_message_list .game_header").clone()).find("*").remove();
                        title = title.html().trim();
                        author = '[player]' + $("#message_partner a.gp_player_link").text().trim() + '[/player]';
                        alliance = $("#message_partner span a").text().trim();

                        if (author === "[player][/player]") author = "Grepolis";

                        if (alliance) { i = "(" + author + " [ally]" + alliance + "[/ally])" }
                        else { i = "(" + author + ")" };

                        bb_content += "[b]" + uw.DM.getl10n("layout").main_menu.items.messages + ":[/b] " + title + " " + i + "\n";
                        bb_content += '[img]' + Home_img + 'transition-mini.png[/img]';


                        let format_search = [
                            /<s>/mg,
                            /<\/s>/mg,
                            /<u>/mg,
                            /<\/u>/mg,
                            /<i>/mg,
                            /<\/i>/mg,
                            /<b>/mg,
                            /<\/b>/mg,
                            /<center>/mg,
                            /<\/center>/mg,
                            /\<a class="bbcodes bbcodes_url".+href.+url=(.*?)".+\>(.*?)\<\/a>/ig,
                            /\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)" (.*?)>(.*?)<\/a><\/span>/ig,
                            /\<span class="bbcodes bbcodes_temple"\>\<a href=\"#(.*?)" (.*?)>(.*?)<\/a><\/span>/ig,
                            /\<img(.*?)src="https:\/\/gp-img.innogamescdn.com\/(.*?)?s=(.*?)"(.*?)>/ig,
                            /\<img src="(.*?)" alt="(.*?)">/ig,
                            /\<span class="bbcodes bbcodes_color" style="color:(.*?)"\>(.*?)\<\/span\>/ig,
                            /\<span class="bbcodes bbcodes_island"><a href="(.*?)" (.*?)>(.*?) (.*?)<\/a><\/span>/ig,
                            /\<table.+\>\<tbody\>(.*?)\<\/tbody\>\<\/table\>/ig,
                            /\<a href="javascript.+\>(.*?)\<\/a\>/ig,
                            /\<tr\>\<td\>/ig,
                            /\<tr\>\<th\>/ig,
                            /\<\/td\>\<\/tr\>/ig,
                            /\<\/th\>\<\/tr\>/ig,
                            /\<\/td\>/ig,
                            /\<\/th\>/ig,
                            /\<td\>/ig,
                            /\<th\>/ig,
                            /\<span class="bbcodes bbcodes_font monospace">(.*?)<\/span>/ig,
                        ];
                        let format_replace = [
                            '[s]',
                            '[/s]',
                            '[u]',
                            '[/u]',
                            '[i]',
                            '[/i]',
                            '[b]',
                            '[/b]',
                            '[center]',
                            '[/center]',
                            '[url=$1]$2[/url]',
                            replaceBBtowns,
                            replaceBBtemple,
                            '[img]$2[/img]',
                            '[img]$1[/img]',
                            '[color=$1]$2[/color]',
                            '[island]$4[/island]',
                            '[table]$1[/table]',
                            '[b][color=#804000]$1[/color][/b]',
                            '[*]',
                            '[**]',
                            '[/*]',
                            '[/**]',
                            '[|]',
                            '[||]',
                            '',
                            '',
                            '[font=monospace]$1[/font]',
                        ];
                        function replaceBBtemple(match, p1, offset, string) {
                            const a = $.parseJSON(atob(p1));
                            return '[temple]' + a.id + '[/temple]'
                        };
                        function replaceBBtowns(match, p1, offset, string) {
                            const a = $.parseJSON(atob(p1));
                            return '[town]' + a.id + '[/town]'
                        };
                        function replaceBBislands(match, p1, offset, string) {
                            const a = $.parseJSON(atob(p1));
                            return '[island]' + a.id + '[/island]'
                        };

                        $(".message_post_container .message_post").each(function (index, element) {
                            const dio_messageExportTMP = $("#dio_messageExportTMP");
                            dio_messageExportTMP.empty();

                            let i, e, n = dio_messageExportTMP.html();
                            $(this).clone().appendTo(dio_messageExportTMP);
                            e = $(this)[0].outerHTML
                            i = e
                            $(this).hasClass("bbcodes_town") && (i = MessageExport.replaceTownNameById($(this).find("a"), i));


                            dio_messageExportTMP.find(".published_report").replaceWith("[report][/report]"); //replace reports
                            dio_messageExportTMP.find(".bbcode_awards").replaceWith("[img]" + Home_img + "award.gif[/img]"); //replace awards
                            dio_messageExportTMP.find(".reservation_list").replaceWith(function () { //replace reservations
                                if (MessageExport.bbcodes_town_id($(this).find("a.gp_town_link")) == false) {
                                    dio_messageExportTMP.find(".reservation_list").replaceWith(function () { return '[reservation]9999999[/reservation]'; })
                                }
                                else {
                                    dio_messageExportTMP.find(".reservation_list").replaceWith(function () { return "[reservation]" + MessageExport.bbcodes_town_id($(this).find("a.gp_town_link")) + "[/reservation]"; })
                                }
                            });
                            dio_messageExportTMP.find(".bbcodes_spoiler").replaceWith(function () { //replace spoiler
                                $(this).find(".button").remove();
                                return '[spoiler=' + $("b:first", this).text() + ']' + $(".bbcodes_spoiler_text", this).html() + '[/spoiler]';
                            });
                            dio_messageExportTMP.find(".bbcodes_quote").replaceWith(function () { //replace quotes
                                return '[quote=' + $('.quote_author', this).text().replace(' ' + getTexts("messages", "écrit", true), '') + ']' + $(".quote_message", this).html() + '[/quote]';
                            });
                            dio_messageExportTMP.find(".bbcodes_size").replaceWith(function () { //replace size
                                return '[size=' + $(this)[0].style.fontSize + ']' + $(this).html() + '[/size]';
                            });
                            dio_messageExportTMP.find(".bbcodes_player").replaceWith(function () { //replace player
                                return '[player]' + $(this).text() + '[/player]';
                            });
                            dio_messageExportTMP.find(".bbcodes_ally").replaceWith(function () { //replace ally
                                return '[ally]' + $(this).text() + '[/ally]';
                            });
                            dio_messageExportTMP.find(".bbcodes_ally_deleted").replaceWith(function () { //replace ally
                                return '[ally]' + $(this).text() + '[/ally]';
                            });
                            dio_messageExportTMP.find(".bbcodes_font").replaceWith(function () { //replace font
                                return '[font=' + $(this).attr('class').split(' ').pop() + ']' + $(this).html() + '[/font]';
                            });
                            dio_messageExportTMP.find(".grepolis_score").replaceWith(function () { //replace score
                                return '[score]' + $(".bbcode_playername", this).text().trim() + '[/score]';
                            });
                            dio_messageExportTMP.find(".bbcode_application").replaceWith(function () { //replace invitation à rejoindre l'alliance
                                return '[center][img]' + Home_img + 'horizontal-separator.png[/img][/center][center][b]' + $(this).text().trim().replace(/            /mg, "[img]" + Home_img + "espace-1.png[/img]") + '[/b][/center]';
                            });
                            dio_messageExportTMP.find("table").replaceWith(function () { //replace table
                                return '[table]' + $(this)[0].outerHTML + '[/table]';
                            });
                            dio_messageExportTMP.find("table").replaceWith(function () { //replace table
                                return $("tbody", this).html();
                            });
                            dio_messageExportTMP.find("script").remove(); //remove script tags

                            author = '[player]' + $(".message_poster .gp_player_link", this).text() + '[/player]';
                            if (author === "[player][/player]") author = "Grepolis";
                            const postDate = $(".message_poster .message_date", this).text().trim();
                            bb_content += '[size=7]' + author + ' ' + postDate + '[/size]\n';
                            bb_content += '[img]' + Home_img + 'transition-mini2.png[/img]\n';
                            let postHTML = $("#dio_messageExportTMP .message_post_content").html().trim();
                            postHTML = postHTML.replace(e, i)
                            postHTML = postHTML.replace(/(\r\n|\n|\r|\t)/gm, ""); //remove line-breaks, tab characters
                            postHTML = postHTML.replace(/<br\s*\/?>/mg, "\n"); //add line-breaks instead of <br>
                            postHTML = postHTML.replace(/%2B/mg, "+"); //replace %2B (url)
                            postHTML = postHTML.replace(/%2F/mg, "/"); //replace %2F (url)
                            postHTML = postHTML.replace(/%3A/mg, ":"); //replace %3A (url)
                            postHTML = postHTML.replace(/%3B/mg, ";"); //replace %3B (url)
                            postHTML = postHTML.replace(/%3D/mg, "="); //replace %3D (url)
                            postHTML = postHTML.replace(/%3F/mg, "?"); //replace %3F (url)
                            postHTML = postHTML.replace(/%23/mg, "#"); //replace %23 (url)
                            postHTML = postHTML.replace(/%26/mg, "&"); //replace %26 (url)
                            postHTML = postHTML.replace(/&nbsp;/mg, " "); //replace &nbsp
                            //postHTML = postHTML.replace(/\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)\".+\<\/span\>/ig, replaceBBtowns); //replace &nbsp
                            for (i = 0; i < format_search.length; i++) {
                                postHTML = postHTML.replace(format_search[i], format_replace[i]);
                            }
                            bb_content += postHTML + "\n";
                            bb_content += '[img]' + Home_img + 'transition-mini.png[/img]';
                            bb_content += "\n";
                        });

                        //bb_content = bb_content.slice(0, -1);
                        bb_content += "[url=" + Home + "en/pages/dio-tools-david1327/]DIO-TOOLS-David1327[/url] - v." + dio_version;
                        bb_content += "[/quote]";

                        let expRahmen_a = "<div class='inner_box'><div class='game_border'><div class='game_border_top'></div>" +
                            "<div class='game_border_bottom'></div><div class='game_border_left'></div><div class='game_border_right'></div>" +
                            "<div class='game_border_corner corner1'></div><div class='game_border_corner corner2'></div>" +
                            "<div class='game_border_corner corner3'></div><div class='game_border_corner corner4'></div>" +
                            "<div class='game_header bold' style='height:18px;'><div style='float:left; padding-right:10px;'></div>";
                        let expRahmen_b = "</div><textarea id='expTextarea' style=\"height: 225px; width: 685px;\">";
                        let expRahmen_c = "</textarea></div><center>" + dio.createButton(getTexts("messages", "copy"), "dio-copy-message-quote", null, 'data-clipboard-target="#expTextarea"') + "</center>";
                        let expRahmen_d = "<div style='overflow-x: hidden; padding-left: 5px; position: relative;'></div></div></div>";
                        let expRahmen_e = '<div id="dio_help_MessageExport" style="top: -37px;position: absolute; right: 92px;"><a class="ui-dialog-titlebar-help ui-corner-all" href=' + getTexts("link", "MessageExport") + ' target="_blank"></a></div>';
                        //"<center>" + dio.createButton(getTexts("labels", "dsc"), "dio-copy-message-quote", null, 'data-clipboard-target="#expTextarea"') + "</center>";
                        let expTitel = getTexts("messages", "Tol");

                        const BBwnd = uw.GPWindowMgr.Create(uw.GPWindowMgr.TYPE_DIO_BBCODEE) || uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE).close();

                        BBwnd.setContent(expRahmen_a + expTitel + expRahmen_b + bb_content + expRahmen_c + expRahmen_d + expRahmen_e);
                        $('#dio_help_MessageExport').tooltip('Wiki (' + dio_icon + getTexts("Options", "Mse")[0] + ')');
                        $("#expTextarea").focus(function () {
                            const that = this;
                            setTimeout(function () {
                                $(that).select();
                            }, 10);
                        });
                    });
                }
            } catch (error) { errorHandling(error, "MessageExport"); }
        },
        bbcodes_town_id: (e) => {
            let t = $(e).attr("href");
            return void 0 !== t && !1 !== t && "undefined" != (t = MessageExport.Link2Struct(t)).id && (t = parseInt(t.id),
                !isNaN(t)) && t
        },
        Link2Struct: (l) => {
            let ret = {};
            try {
                l = l.split(/#/)
                eval("ret=" + atob(l[1] || l[0]))
            } catch (e) { }
            return ret
        },
        replaceTownNameById: (t, e) => {
            const n = t.attr("href")
                , i = t.text();
            if (null != n && 0 <= n.indexOf("#")) {
                var o = JSON.parse(atob(n.replace("#", ""))).id;
                e = e.replace(">" + i + "<", ">" + o + "<")
            }
            return e
        },
        deactivate: () => {
            $('#dio_messageExport').remove();
            if (uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE)) {
                uw.GPWindowMgr.getOpenFirst(uw.GPWindowMgr.TYPE_DIO_BBCODEE).close();
            }
        },
    };

    /*******************************************************************************************************************************
     * Remove Tooltipps
     *******************************************************************************************************************************/

    var removetooltipps = {
        activate: () => {
            dio.removeTooltipps("sidebar");
        },
        deactivate: () => {
        },
    };

    /*******************************************************************************************************************************
     * Resource Counter
     * Adding total resource counter to trade overview
     *******************************************************************************************************************************/
    var resCounter = {
        activate: () => {
            $('<style id="dio_trade_overview_style">' +
                '#dio_resource_counter {position: absolute; right: 40px; margin-top: 4px; height: 16px; background-color: #ffe2a1; border: 1px solid #e1af55; display: inline-block}' +
                '#dio_wood_counter {float: left;}' +
                '#dio_wood_counter .resource_wood_icon {padding-left: 24px; width: auto;}' +
                '#dio_wood_counter .wood_amount {display: inline; padding-bottom: 1px; padding-right: 5px; font-size: 10px}' +
                '#dio_stone_counter {float: left;}' +
                '#dio_stone_counter .resource_stone_icon {padding-left: 24px; width: auto;}' +
                '#dio_stone_counter .stone_amount {display: inline; padding-right: 5px; font-size: 10px}' +
                '#dio_silver_counter {float: left; margin-right: 3px;}' +
                '#dio_silver_counter .resource_iron_icon {padding-left: 24px; width: auto;}' +
                '#dio_silver_counter .iron_amount {display: inline; padding-right: 2px; font-size: 10px}' +
                '</style>').appendTo("head");
            if ($('#trade_overview_wrapper').length) { resCounter.init(); }
        },
        //Counting resources in town right now
        init: () => {
            try {
                let wood_total = 0;
                let stone_total = 0;
                let silver_total = 0;
                const city_boxes = $('#trade_overview_wrapper').find(".trade_town");
                for (var a = 0; a < city_boxes.length - 2; a++) {
                    wood_total += parseInt($(city_boxes[a]).find(".resource_wood_icon").text());
                    stone_total += parseInt($(city_boxes[a]).find(".resource_stone_icon").text());
                    silver_total += parseInt($(city_boxes[a]).find(".resource_iron_icon").text());
                }

                //Appending counter to trade window
                const wnd = uw.GPWindowMgr.getFocusedWindow() || false;
                const dio_wnd = wnd.getJQElement().find(".overview_search_bar");
                dio_wnd.append('<div id="dio_resource_counter" nobr><div id="dio_wood_counter"><span class="resource_wood_icon wood"><span class="wood_amount">' + wood_total + '</span></span></div>' +
                    '<div id="dio_stone_counter"><span class="resource_stone_icon stone"><span class="stone_amount">' + stone_total + '</span></span></div>' +
                    '<div id="dio_silver_counter"><span class="resource_iron_icon iron"><span class="iron_amount">' + silver_total + '</span></span></div></div>');
            } catch (error) { errorHandling(error, "resCounter"); }
        },
        deactivate: () => {
            $('#dio_trade_overview_style').remove();
            $('#dio_resource_counter').remove();
        },
    };

    /*******************************************************************************************************************************
     * autre
     *******************************************************************************************************************************/

    /*var Raccourci = {
        activate: () => {
        },
        deactivate: () => {
        },
    };*/

    /*try {
           } catch (error) { errorHandling(error, "MessageExport"); }*/
}
