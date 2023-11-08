import dateFormat from "dateformat";

Vue.component("Agenda", {
    template:`<div>
    <p v-if="edit" >Agenda</p>
    <h3 class="wp-block has-text-align-center wp-block-heading rich-text" :contenteditable="edit" @input="changeNextTitle" v-if="next_events_by_years.length > 0 || edit" >{{editableNextTitle}}</h3>
    <AgendaYear v-for="yevents in next_events_by_years" :year="yevents[0].start_date_details.year" :events="yevents" v-bind:key="yevents[0].id" :bulletColor="bulletColor" :icon="icon" />
    <h3 class="wp-block has-text-align-center wp-block-heading rich-text" :contenteditable="edit" @input="changePreviousTitle" v-if="past_events_by_years.length > 0 || edit" >{{editablePreviousTitle}}</h3>
    <AgendaYear v-for="yevents in past_events_by_years" :year="yevents[0].start_date_details.year" :events="yevents" v-bind:key="yevents[0].id" :bulletColor="bulletColor" :icon="icon" />
    <p v-if="past_events_by_years.length == 0 && next_events_by_years.length == 0">Aucun evenement! verifiez les tags.</p>
    </div>`,
    props: ['tags', 'categories', 'nextTitle', 'previousTitle', 'bulletColor', 'edit' ],
    data: () => {
        return {
            past_events : [],
            next_events : [],
            editableNextTitle: null,
            editablePreviousTitle: null,
            editedPreviousTitle: null,
            editedNextTitle: null,
            icon: "&#xf058"
        };
    },
    computed: {
        tag_list() {
            if ( this.tags?.trim().length > 0 ) {
                return this.tags.split(/[,]+/).map((v) => v.trim());
            } else {
                return [];
            }
        },
        category_list() {
            if ( this.categories?.trim().length > 0 ) {
                return this.categories.split(/[,]+/).map((v) => v.trim());
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
        emitSaveTitles() {
            this.$emit("titleSaved", {next: this.editedNextTitle, prev: this.editedPreviousTitle});
        },
        changeNextTitle(inputEvent) {
            this.editedNextTitle = inputEvent.currentTarget.textContent;
            this.emitSaveTitles();
        },
        changePreviousTitle(inputEvent) {
            this.editedPreviousTitle = inputEvent.currentTarget.textContent;
            this.emitSaveTitles();
        },
        /*saveTitles() {
            this.editedNextTitle = this.editableNextTitle = this.nextTitle ? this.nextTitle : "Prochainement";
            this.editedPreviousTitle = this.editablePreviousTitle = this.previousTitle ? this.previousTitle : "Evénements passés";    
        },*/
        matchTag(event) {
            if ( this.tag_list?.length > 0 ) {
                for(var jt=0; jt < event.tags.length; ++jt) {
                    const tag = event.tags[jt];
                    for(var it=0; it<this.tag_list.length; ++it) {
                        if( tag.slug === this.tag_list[it] ) {
                            return true;
                        }
                    }
                }
                return false;
            }
            return true;
        },
        matchCategory(event) {
            if ( this.category_list?.length > 0 ) {
                for(var jt=0; jt < event.categories.length; ++jt) {
                    const category = event.categories[jt];
                    for(var it=0; it<this.category_list.length; ++it) {
                        if( category.slug === this.category_list[it] ) {
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
                if( ! this.matchCategory(event) ) {
                    continue;
                }
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
        this.editedNextTitle = this.editableNextTitle = this.nextTitle ? this.nextTitle : "Prochainement";
        this.editedPreviousTitle = this.editablePreviousTitle = this.previousTitle ? this.previousTitle : "Evénements passés";
    }
});
