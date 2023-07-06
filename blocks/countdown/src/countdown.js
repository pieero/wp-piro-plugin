//import { __ } from '@wordpress/i18n';
var piro_plugin_countdown_to_register = new Map();
var piro_plugin_countdown_vms = new Map();
var piro_plugin_countdown_reg_interval = null;

import './components/Countdown';
import './components/CountdownControls';

const piro_plugin_mount_countdowns = function() {
    const countdowns = piro_plugin_countdown_to_register.keys();//document.querySelectorAll(`[data-type="piro-plugin/countdown"]`);
    var id = countdowns.next().value;
    do {
        const props = piro_plugin_countdown_to_register.get(id);
        const countdown = document.querySelector(`#`+id+` #mount`);
        if( countdown ) {
            var vm = new Vue({
                el: countdown,
                template: `
<div id="mount" class="vue-mounted">
    <CountdownControls v-if="selected" :props="props" />
    <Countdown :delay="delay" :tags="tags" />
</div>`,
                data: {
                    id: id,
                    props: props,
                    selected: false
                },
                computed: {
                    tag_list() {
                        if ( this.delay.trim().length > 0 ) {
                            return this.delay.split(/[\s,]+/).map((v) => v.trim());
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
                        this.selected = this.props.isSelected;
                        this.delay = this.props.attributes.delay;
                        this.tags = this.props.attributes.tags;
                    },
                },
                mounted: function(){
                    this.$on("updateProps", this.updateProps);
                }
            });
            piro_plugin_countdown_vms.set(id,vm);
            piro_plugin_countdown_to_register.delete(id);
        }
    } while(id = countdowns.next().value)
    if ( piro_plugin_countdown_to_register.size == 0 ) {
        clearInterval(piro_plugin_countdown_reg_interval);
        piro_plugin_countdown_reg_interval = null;
    }
};

const registerCountdown = function(id, props) {
    const countdown = document.querySelector(`#`+id+` #mount`);
    if ( countdown && countdown.attributes.getNamedItem("class")?.value === "vue-mounted" ) {
            const vm = piro_plugin_countdown_vms.get(id);
            vm.$emit("updateProps",props);
            return;
    }
    piro_plugin_countdown_to_register.set(id, props);
    if ( ! piro_plugin_countdown_reg_interval ) {
        piro_plugin_countdown_reg_interval = setInterval(piro_plugin_mount_countdowns,200);
    }
    
};

const mountCountdown = function(el,data) {
    var vm = new Vue({
        el: el,
        template: `
<Countdown id="mount" :delay="delay" :tags="tags" class="vue-mounted">
</Countdown>`,
        data: () => {
            return {
                delay: data.delay,
                tags: data.tags
            };
        }
    });

}

window.mountCountdown = mountCountdown;
window.registerCountdown = registerCountdown;
export { registerCountdown, mountCountdown };