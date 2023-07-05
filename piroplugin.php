<?php
/*
Plugin Name: Piro Blocks
Description: Event agenda
Version: 1.0
*/
/*
function handle_shortcode() {
    return '<div id="mount"></div>';
}
add_shortcode('latestPosts', 'handle_shortcode');

*/
/*
function enqueue_scripts(){
   global $post;
   if(has_shortcode($post->post_content, "latestPosts")){
                wp_enqueue_script('vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
   }           
}*/
//wp_enqueue_script('latest-posts', plugin_dir_url( __FILE__ ) . 'latest-posts.js', [], '1.0', true);

// automatically load dependencies and version
$asset_file = include( plugin_dir_path( __FILE__ ) . 'blocks/agenda/build/index.asset.php');

wp_register_script(
    'piroplugin_agenda_js',
    plugins_url( 'blocks/agenda/build/index.js', __FILE__ ),
    $asset_file['dependencies'],
    $asset_file['version']
);

wp_enqueue_script('vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
wp_enqueue_style('awesomefont', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', [], '4.5.0');

function piroplugin_enqueue_script_and_style() {
 
  /*  wp_register_script(
        'piroplugin_agenda_js',
        plugin_dir_url( __FILE__ ). '/blocks/agenda/build/index.js',
        array(
            'wp-blocks',
            'wp-i18n',
            'wp-element',
            'wp-components',
            'wp-editor'
        ),
        filemtime(__FILE__)
    );*/
 
    wp_enqueue_script('piroplugin_agenda_js', plugin_dir_url( __FILE__ ) . '/blocks/agenda/build/index.js', [], '1.0');
    wp_enqueue_script('piroplugin', plugin_dir_url( __FILE__ ) . 'piroplugin.js', [], '1.0', true);
}
add_action('wp_enqueue_scripts' , 'piroplugin_enqueue_script_and_style'); 

function piroplugin_block_init() {
    register_block_type( __DIR__ . '/blocks/agenda', [ 'title' => 'Mon Agenda' ] );
	
	// Additional blocks would be registered here
	//register_block_type( plugin_dir_path( __FILE__ ) . 'blocks/hero/' );


}
add_action( 'init', 'piroplugin_block_init' );
