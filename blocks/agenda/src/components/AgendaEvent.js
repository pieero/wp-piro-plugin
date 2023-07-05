import he from "he";

Vue.component("AgendaEvent", {
    template:`
    <li><span :title="description">{{tag}}{{startDate}} à {{startTime}}{{location}}
    <br/><span class="description">{{title}}</span></span>
    </li>
    `,
    props: ['event'],
    data: () => {
        return {
        };
    },
    computed: {
        startDate() {
            const sd = this.event.start_date_details;
            const date = new Date(Date.UTC(sd.year, sd.month+1, sd.day));

            const options = {
               hour12: false,
               weekday: 'long',
               day: 'numeric',
               month: 'long',
            };
            
            return new Intl.DateTimeFormat("fr", options).format(date);
        },
        startTime() {
            const sd = this.event.start_date_details;
            var retVal = sd.hour+"H";
            if ( sd.minute ) {
                retVal += sd.minute;
            }
            return retVal;
        },
        title() {
            return he.decode(this.event.title);
        },
        location() {
           var retVal = "";
           if ( this.event.venue?.address ) {
            retVal += " - "+this.event.venue?.address;
           }
           if ( this.event.venue?.city ) {
            retVal += " - "+this.event.venue?.city;
           }
           return retVal;
        },
        description() {
            return he.decode(this.event.description);
        },
        tag() {
            if (this.event.tags.length > 0 )
            {
                return this.event.tags[0].name+ " ";
            }
            return "";
        }
    }
});
