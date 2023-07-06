import he from "he";
import moment from "moment";

Vue.component("AgendaEvent", {
    template:`
    <li><span :title="description">{{tag}}{{startDate}}{{location}}
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
            var localMoment = moment(this.event.start_date, "YYYY-MM-DD HH:mm:ss");
            localMoment.locale('fr'); 
            return localMoment.format("dddd D MMMM [à] HH[h]mm");
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
