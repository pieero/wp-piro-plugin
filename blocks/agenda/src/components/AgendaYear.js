import './AgendaEvent';

Vue.component("AgendaYear", {
    template:`<div>
    <h4>{{year}}</h4>
    <ul>
    <AgendaEvent v-for="event in events" :event="event" v-bind:key="event.id" :bulletColor="bulletColor" :icon="icon" ></AgendaEvent>
    </ul>
    </div>
    `,
    props: ['year', 'events', 'bulletColor', 'icon'],
    data: () => {
        return {
        };
    }
});
