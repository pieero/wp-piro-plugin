//import { __ } from '@wordpress/i18n';
var piro_plugin_agenda_to_register = new Map();
var piro_plugin_agenda_vms = new Map();
var piro_plugin_agenda_reg_interval = null;

import './components/AgendaYear';
import './components/Agenda';

const piro_plugin_mount_agendas = function() {
    const agendas = piro_plugin_agenda_to_register.keys();//document.querySelectorAll(`[data-type="piro-plugin/agenda"]`);
    var id = agendas.next().value;
    do {
        const props = piro_plugin_agenda_to_register.get(id);
        const agenda = document.querySelector(`#`+id+` #mount`);
        if( agenda ) {
            var vm = new Vue({
                saverFunc: (data) => {
                },
                el: agenda,
                template: `<Agenda 
                    :tags="tags" 
                    :categories="categories" 
                    :nextTitle="nextTitle" 
                    :previousTitle="previousTitle" 
                    :edit="true" 
                    id="mount" 
                    class="vue-mounted" 
                    @titleSaved="saveTitles" >
                </Agenda>`,
                data: {
                    id: id,
                    props: props,
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
                    categories: {
                        get: function() {
                            return this.props.attributes.categories;
                        },
                        set: function(val) {
                            this.props.setAttributes({categories: val});
                        }
                    },
                    nextTitle: {
                        get: function() {
                            return this.props.attributes.nextTitle;
                        },
                        set: function(val) {
                            this.props.setAttributes({nextTitle: val});
                        }
                    },
                    previousTitle: {
                        get: function() {
                            return this.props.attributes.previousTitle;
                        },
                        set: function(val) {
                            this.props.setAttributes({previousTitle: val});
                        }
                    }
                },
                methods: {
                    updateProps(val) {
                        this.props = val;
                        this.categories = this.props.attributes.categories;
                        this.nextTitle = this.props.attributes.nextTitle;
                        this.previousTitle = this.props.attributes.previousTitle;
                        this.tags = this.props.attributes.tags;
                    },
                    saveTitles(titles) {
                        this.nextTitle = titles.next;
                        this.previousTitle = titles.prev;
                        this.props.setAttributes({nextTitle: titles.next});
                        this.props.setAttributes({previousTitle: titles.prev});
                    }
                },
                mounted: function(){
                    this.$on("updateProps", this.updateProps);
                }
            });
            piro_plugin_agenda_vms.set(id,vm);
            piro_plugin_agenda_to_register.delete(id);
        }
    } while(id = agendas.next().value)
    if ( piro_plugin_agenda_to_register.size == 0 ) {
        clearInterval(piro_plugin_agenda_reg_interval);
        piro_plugin_agenda_reg_interval = null;
    }
};

const registerAgenda = function(id, props, saver) {
    const agenda = document.querySelector(`#`+id+` #mount`);
    if ( agenda && agenda.attributes.getNamedItem("class")?.value === "vue-mounted" ) {
            const vm = piro_plugin_agenda_vms.get(id);
            vm.$emit("updateProps",props);
            return;
    }
    piro_plugin_agenda_to_register.set(id, props);
    if ( ! piro_plugin_agenda_reg_interval ) {
        piro_plugin_agenda_reg_interval = setInterval(piro_plugin_mount_agendas,200);
    }
    
};

const mountAgenda = function(el,data) {
    var vm = new Vue({
        el: el,
        template: `
<Agenda id="mount" :tags="tags" :categories="categories" :nextTitle="nextTitle" :previousTitle="previousTitle" class="vue-mounted">
</Agenda>`,
        data: () => {
            return {
                tags: data.tags,
                categories: data.categories,
                nextTitle: data.nextTitle,
                previousTitle: data.previousTitle
            };
        }/*,
        computed: {
            tag_list() {
                if ( this.tags.trim().length > 0 ) {
                    return this.tags.split(/[\s,]+/).map((v) => v.trim());
                } else {
                    return [];
                }
            }
        }*/
    });

}

window.mountAgenda = mountAgenda;
window.registerAgenda = registerAgenda;
export { registerAgenda, mountAgenda };