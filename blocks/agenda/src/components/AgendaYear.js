import './AgendaEvent';

Vue.component("AgendaYear", {
    template:`<div>
    <h2>{{year}}</h2>
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
