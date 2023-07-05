
Vue.component("AgendaControls", {
    template:`<div class="agenda_controls" >
    <label name="tag" >Tags: </label>
    <input type="text"
    label="tag"
    v-model="tags"
    />
</div>`,
    props: ['props'],
    data: () => {
        return {
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
        tags: {
            get: function() {
                return this.props.attributes.tags;
            },
            set: function(val) {
                this.props.setAttributes({tags: val});
            }
        },
    },
    methods: {
        updateProps(val) {
            this.props = val;
            this.tags = this.props.attributes.tags;
        },
    },
});
