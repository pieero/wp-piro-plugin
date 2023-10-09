import he from "he";
import moment from "moment/moment";

Vue.component("Countdown", {
    template:`<div>
    <p v-if="edit" >Countdown</p>
    <h2 v-if="show" class="wp-block has-text-align-center wp-block-heading rich-text"><span>{{next_event.tags[0].name}} {{startDate}}</span><span>{{location}}</span></h2>
    <h3 v-if="show" class="wp-block has-text-align-center wp-block-heading rich-text">{{title}}</h3>
    <div class="eb-cd-inner" v-if="show" >
        <div class="box cd-box-day">
            <span class="eb-cd-digit">{{days}}</span><span class="eb-cd-label">Jours</span>
        </div>
        <div class="box cd-box-hour">
            <span class="eb-cd-digit">{{hours}}</span><span class="eb-cd-label">Heures</span>
        </div>
        <div class="box cd-box-minute">
            <span class="eb-cd-digit">{{minutes}}</span><span class="eb-cd-label">Minutes</span>
        </div>
        <div class="box cd-box-second">
            <span class="eb-cd-digit">{{seconds}}</span><span class="eb-cd-label">Secondes</span>
        </div>
    </div>
    <figure v-if="image" class="wp-block-image size-large">
        <img decoding="async" fetchpriority="high" width="1024" height="576" :src="image" alt="" class="wp-image-95" />
    </figure>
    </div>`,
    props: ['tags', 'category', 'delay', 'edit'],
    data: () => {
        return {
            next_event : null,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };
    },
    computed: {
        tag_list() {
            if ( this.tags.trim().length > 0 ) {
                return this.tags.split(/[\s,]+/).map((v) => v.trim());
            } else {
                return [];
            }
        },
        startDate() {
            var localMoment = moment(this.next_event?.start_date, "YYYY-MM-DD HH:mm:ss");
            localMoment.locale('fr'); 
            if( this.next_event?.all_day ) {
                return localMoment.format("dddd D MMMM");
            } else {
                return localMoment.format("dddd D MMMM [à] HH[h]mm");
            }
        },
        location() {
            var retVal = "";
            if ( this.next_event?.venue?.description ) {
             retVal += " - "+ he.decode(this.next_event.venue?.description).replaceAll(/<\/?[^>]+>/g,"");
            }
            else if ( this.next_event?.venue?.address ) {
             retVal += " - "+this.next_event.venue?.address;
            }
            if ( this.next_event?.venue?.city ) {
             retVal += " - "+this.next_event.venue?.city;
            }
            return retVal;
         },
         title() {
            return he ? he.decode(this.next_event?.title) : this.next_event?.title ;
         },
         remainingDays() {
            if( this.next_event ) {
                const edate = moment(this.next_event.start_date, "YYYY-MM-DD HH:mm:ss");
                const now = moment();
                return edate.diff(now, "days");
            } return 0;
         },
         show() {
            return this.next_event && (this.delay == 0 || this.delay > this.remainingDays);
         },
         image() {
            return this.next_event?.image?.url;
         }
    },
    methods: {
        tick() {
            if( this.next_event ) {
                const edate = moment(this.next_event.start_date, "YYYY-MM-DD HH:mm:ss");
                const now = moment();
                this.days = edate.diff(now, "days");
                this.hours = edate.diff(now, "hours") - 24*this.days ;
                this.minutes = edate.diff(now, "minutes") - 60*(24*this.days + this.hours);
                this.seconds = edate.diff(now, "seconds") - 60*(60*(24*this.days + this.hours) + this.minutes) ;
                if(edate.diff(now, "seconds") == -1) {
                    this.fetchNextEvent();
                }
            }
        },
        matchTag(event) {
            if ( this.tag_list.length > 0 ) {
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
            if ( this.category?.length > 0 ) {
                for(var jt=0; jt < event.categories.length; ++jt) {
                    const category = event.categories[jt];
                    if( category.slug === this.category ) {
                        return true;
                    }
                }
                return false;
            }
            return true;
        },
        fetchNextEvent() {
            var mnow = moment();
            var hier = moment().subtract(1, "days").format("YYYY-MM-DD");
            var maintenant = mnow.format("YYYY-MM-DD HH:mm:ss");
            var url = '/wp-json/tribe/events/v1/events?starts_after='+hier;
            if ( this.category?.length > 0 ) {
                url += '&categories='+this.category;
            }
            if ( this.tag_list.length == 1 ) {
                url += '&tags='+this.tag_list[0];
            }
            var that = this;
            fetch(url).then((response)=>{
            return response.json()
            }).then((data)=>{
                var tmp_next_event = null;
                if ( data?.events ) {
                    var next_events = data.events.filter((e)=> 
                    e.start_date >= maintenant 
                    && that.matchTag(e) 
                    //&& that.matchCategory(e)
                    );
                    if ( next_events.length > 0 ) {
                        tmp_next_event = next_events[0];
                    }
                } 
                that.next_event = tmp_next_event;
            })    
        }
    },
    mounted: function(){
        this.fetchNextEvent();
        // Update counter every seconds
        setInterval(this.tick, 1000);
        // Refetch events every 10 minutes
        setInterval(this.fetchNextEvent, 600000);
    }
});
