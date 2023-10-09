( function() {

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
        var categories = countdown.attributes?.getNamedItem('categories')?.value;
        var el = countdown.querySelector("#mount");
        window.mountCountdown(el,{tags:tags,delay:delay,categories:categories});
      });

    });
  }
  
  )();
  
