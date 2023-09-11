import he from "he";
import moment from 'moment';

Vue.component("AgendaEvent", {
    template:`
    <li><span :title="description">{{tag}} - {{startDate}}{{location}}
    <br/><span ref="desc" class="description">{{title}}</span></span>
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
            localMoment.locale("fr"); 
            if ( this.event.all_day ) {
                var localEndMoment = moment(this.event.end_date, "YYYY-MM-DD HH:mm:ss");
                if ( localMoment.year() != localEndMoment.year()) {
                    return localMoment.format("dddd D MMMM YYYY") + " au " + localEndMoment.format("dddd D MMMM YYYY");
                }
                if ( localMoment.month() != localEndMoment.month()) {
                    return localMoment.format("dddd D MMMM") + " au " + localEndMoment.format("dddd D MMMM");
                }
                if ( localMoment.day() != localEndMoment.day()) {
                    return localMoment.format("dddd D") + " au " + localEndMoment.format("dddd D MMMM");
                }
                return localMoment.format("dddd D MMMM");
            } else {
                return localMoment.format("dddd D MMMM [à] HH[h]mm");
            }
        },
        title() {
            return he.decode(this.event.title);
        },
        location() {
           var retVal = "";
           if ( this.event.venue?.description ) {
            retVal += " - "+ he.decode(this.event.venue?.description).replaceAll(/<\/?[^>]+>/g,"");
           }
           else if ( this.event.venue?.address ) {
            retVal += " - "+this.event.venue?.address;
           }
           if ( this.event.venue?.city ) {
            retVal += " - "+this.event.venue?.city;
           }
           return retVal;
        },
        description() {
            return he.decode(this.event.description).replaceAll(/<\/?[^>]+>/g,"");
        },
        tag() {
            if (this.event.tags.length > 0 )
            {
                return this.event.tags[0].name+ " ";
            }
            return "";
        }
    },
    mounted: function(){
        var desc = this.title;
        var d = this.description;
        if ( d ) desc += " - " + this.description;
        this.$refs.desc.innerHTML = desc;
        return true;
    }
});
