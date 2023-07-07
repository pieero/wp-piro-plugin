import './AgendaEvent';

Vue.component("AgendaYear", {
    template:`<div>
    <h4>{{year}}</h4>
    <ul>
    <AgendaEvent v-for="event in events" :event="event" v-bind:key="event.id" ></AgendaEvent>
    </ul>
    </div>
    `,
    props: ['year', 'events'],
    data: () => {
        return {
        };
    }
});
