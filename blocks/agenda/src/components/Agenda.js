import dateFormat from "dateformat";

Vue.component("Agenda", {
    template:`<div><h3 v-if="next_events_by_years.length > 0" >Prochainement</h3>
    <AgendaYear v-for="yevents in next_events_by_years" :year="yevents[0].start_date_details.year" :events="yevents" v-bind:key="yevents[0].id" />
    <h3 v-if="past_events_by_years.length > 0" >Evenements passés</h3>
    <AgendaYear v-for="yevents in past_events_by_years" :year="yevents[0].start_date_details.year" :events="yevents" v-bind:key="yevents[0].id" />
    <p v-if="past_events_by_years.length == 0 && next_events_by_years.length == 0">Aucun evenement! verifiez les tags.</p>
    </div>`,
    props: ['tags'],
    data: () => {
        return {
            past_events : [],
            next_events : [],
        };
    },
    computed: {
        tag_list() {
            if ( this.tags.trim().length > 0 ) {
                return this.tags.split(/[,]+/).map((v) => v.trim());
            } else {
                return [];
            }
        },
        past_events_by_years() {
            return this.getEventsByYears(this.past_events.sort((a,b) => { return a.start_date < b.start_date }));
        },
        next_events_by_years() {
            return this.getEventsByYears(this.next_events.sort((a,b) => { return a.start_date > b.start_date }));
        }
    },
    methods: {
        matchTag(event) {
            if ( this.tag_list.length > 0 ) {
                for(var jt=0; jt < event.tags.length; ++jt) {
                    const tag = event.tags[jt];
                    for(var it=0; it<this.tag_list.length; ++it) {
                        if( tag.name === this.tag_list[it] ) {
                            return true;
                        }
                    }
                }
                return false;
            }
            return true;
        },
        getEventsByYears(events) {
            var years = new Map();
            for(var i=0; i< events.length; ++i) {
                var y = events[i].start_date_details.year;
                var event = events[i];
                if( ! this.matchTag(event) ) {
                    continue;
                }
                if (!years.has(y)) {
                    years.set(y,[]);
                }
                years.get(y).push(events[i]);
            }
            var retVal = Array.from(years.values());
            return retVal;
        },
        async fetchEvents(page=1) {
            var maintenant = dateFormat(Date(), "yyyy-mm-dd HH:MM:ss");
            var url = '/wp-json/tribe/events/v1/events?starts_after=1990-01-01&page='+page;
            fetch(url).then((response)=>{
            return response.json()
            }).then((data)=>{
                if ( data?.events ) {
                    const tmp_past_events = data.events.filter((e)=> e.end_date < maintenant);
                    const tmp_next_events = data.events.filter((e)=> e.end_date >= maintenant);

                    if ( page == 1 ) {
                        this.past_events = tmp_past_events;
                        this.next_events = tmp_next_events;
                    } else {
                        this.past_events = this.past_events.concat(tmp_past_events);
                        this.next_events = this.next_events.concat(tmp_next_events);
                    }
                    if( this.past_events.length + this.next_events.length < data.total && page < data.total_pages) {
                        this.fetchEvents(page+1);
                    }
                } else {
                    if ( page == 1 ) {
                        this.past_events = [];
                        this.next_events = [];
                    }
                }
            })
    
        }
    },
    mounted: function(){
        this.fetchEvents();
    }
});
