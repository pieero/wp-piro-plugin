( function() {

    document.addEventListener("DOMContentLoaded", () => {

      // Look for any agenda to mount
      var agendas = document.querySelectorAll('[class*="wp-block-piro-plugin-agenda"]');
      agendas.forEach((agenda) => {
        var data = {
          tag: agenda.attributes?.getNamedItem('tags')?.value,
          categories: agenda.attributes?.getNamedItem('categories')?.value,
          nextTitle: agenda.attributes?.getNamedItem('nextTitle')?.value,
          previousTitle: agenda.attributes?.getNamedItem('previousTitle')?.value,
          bulletColor: agenda.attributes?.getNamedItem('bulletColor')?.value 
        };
        var el = agenda.querySelector("#mount");
        window.mountAgenda(el,data);
      });
      // Look for any count-down to mount
      var countdowns = document.querySelectorAll('[class*="wp-block-piro-plugin-countdown"]');
      countdowns.forEach((countdown) => {
        var data = {
          tag: agenda.attributes?.getNamedItem('tags')?.value,
          delay: agenda.attributes?.getNamedItem('delay')?.value,
          categories: agenda.attributes?.getNamedItem('categories')?.value,
        };
        var el = countdown.querySelector("#mount");
        window.mountCountdown(el,data);
      });

    });
  }
  
  )();
  
