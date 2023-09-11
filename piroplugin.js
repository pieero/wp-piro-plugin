var moment_locale_fr = {
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
    sameDay : '[Aujourd’hui à] LT',
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
};

( function() {

    window.moment_locale_fr = moment_locale_fr;

    document.addEventListener("DOMContentLoaded", () => {
        // Look for any agenda to mount
        var agendas = document.querySelectorAll('[class*="wp-block-piro-plugin-agenda"]');
        agendas.forEach((agenda) => {
          var tags = agenda.attributes?.getNamedItem('tags')?.value;
          var categories = agenda.attributes?.getNamedItem('categories')?.value;
          var el = agenda.querySelector("#mount");
          window.mountAgenda(el,{tags:tags,categories:categories});
        });
        // Look for any count-down to mount
        var countdowns = document.querySelectorAll('[class*="wp-block-piro-plugin-countdown"]');
        countdowns.forEach((countdown) => {
          var tags = countdown.attributes?.getNamedItem('tags')?.value;
          var delay = countdown.attributes?.getNamedItem('delay')?.value;
          var el = countdown.querySelector("#mount");
          window.mountCountdown(el,{tags:tags,delay:delay});
        });

    });
/*
    var vm = new Vue({
        el: document.querySelector('#mount'),
        template: `<div><h1>My Latest Posts</h1>
        <div>
          <p v-for="post in posts">
            <a v-bind:href="post.link">{{post.title.rendered}}</span></a>
          </p>
        </div>
      </div>`,
        data: {
            posts: []
           },
        mounted: function(){
        console.log("Hello Vue!");
        var url = '/wp-json/wp/v2/posts?filter[orderby]=date';
        fetch(url).then((response)=>{
           return response.json()
         }).then((data)=>{
           this.posts = data;
         })       
      }
     });*/
  }
  
  )();
  
