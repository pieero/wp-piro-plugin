
Vue.component("CountdownControls", {
    template:`<div class="control_banner" >CountDown
    <div class="piro_controls" >
    <label name="tag" >Tags: </label>
    <input type="text"
    label="tag"
    v-model="tags"
    /><br/>
    <label name="delay" >Delay: </label>
    <input type="number"
    min="0" max="40"
    label="delay"
    v-model="delay"
    />
    </div></div>`,
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
        delay: {
            get: function() {
                return this.props.attributes.delay;
            },
            set: function(val) {
                this.props.setAttributes({delay: val});
            }
        }
    },
    methods: {
        updateProps(val) {
            this.props = val;
            this.tags = this.props.attributes.tags;
            this.delay = this.props.attributes.delay;
        },
    },
});
