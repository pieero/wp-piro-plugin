
( function() {
    document.addEventListener("DOMContentLoaded", () => {
        // Look for any agenda to mount
        var agendas = document.querySelectorAll('[class="wp-block-piro-plugin-agenda"]');
        agendas.forEach((agenda) => {
          var tags = agenda.attributes?.getNamedItem('tags')?.value;
          var el = agenda.querySelector("#mount");
          window.mountAgenda(el,tags);
        });
        // Look for any count-down to mount

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
  
