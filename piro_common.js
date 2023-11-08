PiroCommon = {
    moment_locale_fr : {
        months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
        monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
        monthsParseExact : true,
        weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
        weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
        weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
          LT : 'HH:mm',
          LTS : 'HH:mm:ss',
          L : 'DD/MM/YYYY',
          LL : 'D MMMM YYYY',
          LLL : 'D MMMM YYYY HH:mm',
          LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
          sameDay : '[Aujourd\'hui à] LT',
          nextDay : '[Demain à] LT',
          nextWeek : 'dddd [à] LT',
          lastDay : '[Hier à] LT',
          lastWeek : 'dddd [dernier à] LT',
          sameElse : 'L'
        },
        relativeTime : {
          future : 'dans %s',
          past : 'il y a %s',
          s : 'quelques secondes',
          m : 'une minute',
          mm : '%d minutes',
          h : 'une heure',
          hh : '%d heures',
          d : 'un jour',
          dd : '%d jours',
          M : 'un mois',
          MM : '%d mois',
          y : 'un an',
          yy : '%d ans'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
        ordinal : function (number) {
          return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse : /PD|MD/,
        isPM : function (input) {
          return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem : function (hours, minutes, isLower) {
          return hours < 12 ? 'PD' : 'MD';
        },
        week : {
          dow : 1, // Monday is the first day of the week.
          doy : 4  // Used to determine first week of the year.
        }
      },
    event_metadata : {
        tag_list : null, 
        category_list : null 
    },
    fetching: false,
    getAllCSSVars: function() { return Array.from(document.styleSheets)
    .filter((styleSheet) => {
        let isLocal = !styleSheet.href || styleSheet.href.startsWith(window.location.origin)
        if (!isLocal) console.warn("Skipping remote style sheet due to cors: ", styleSheet.href);
        return isLocal;
    })
    .map((styleSheet) => Array.from(styleSheet.cssRules))
    .flat()
    .filter((cssRule) => cssRule.selectorText === ':root' || cssRule.selectorText === 'body' )
    .map((cssRule) => cssRule.cssText.split('{')[1].split('}')[0].trim().split(';'))
    .flat()
    .filter((text) => text !== '')
    .map((text) => text.split(':'))
    .map((parts) => {
        return {key: parts[0].trim(), value: parts[1].trim()}
    }); },
    getAllCssPresetColors: function() {
      return Array.from(new Set(Array.from(PiroCommon.getAllCSSVars().filter((v) => v.key.match(/--wp.*color.*/g)).map((v) => v.key)))).sort();
    },
    fetchEventMetaData : function() {
        if( PiroCommon.fetching ) return;
        PiroCommon.fetching = true;
    fetch("/wp-json/tribe/events/v1/tags")
      .then( (response) => response.json() )
      .then( (response) => {
        let TagsArray = { ...response }.tags;
        const tagsOptions = TagsArray.map((v) => { return { label: v.name, value: v.slug}; });
        //setTagsList(tagsOptions);
        PiroCommon.event_metadata.tag_list = tagsOptions;
      })
    .catch((err) => console.error(err));
  
    fetch("/wp-json/tribe/events/v1/categories")
      .then( (response) => response.json() )
      .then( (response) => {
      let CategoriesArray = { ...response }.categories;
      const categoriesOptions = CategoriesArray.map((v) => { return { label: v.name, value: v.slug}; });
      //setCategoriesList([{label: "(Any Category)", value: ""}].concat(categoriesOptions));
      PiroCommon.event_metadata.category_list = [{label: "(Any Category)", value: ""}].concat(categoriesOptions);
    })
    .catch((err) => console.error(err));
  },
  event_onmetadata: function(callback) {
    if ( PiroCommon.event_metadata?.tag_list && PiroCommon.event_metadata?.category_list ) {
        callback(PiroCommon.event_metadata);
    } else {
        var metadataInterval = setInterval(() => {
        if ( PiroCommon.event_metadata?.tag_list && PiroCommon.event_metadata?.category_list ) {
            callback(PiroCommon.event_metadata);
            clearInterval(metadataInterval);
            metadataInterval = null;
        }
        }, 100);
    }
  }
}