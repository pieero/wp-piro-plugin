<?php
/*
Plugin Name: Piro Blocks
Description: Event agenda
Version: 1.2
*/
$PIRO_PLUGIN_VERSION="1.2";

wp_enqueue_script('vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.17');
wp_enqueue_style('awesomefont', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', [], '4.5.0');
wp_enqueue_script('piro_common_js', plugin_dir_url( __FILE__ ) . '/piro_common.js', [], $PIRO_PLUGIN_VERSION, true);

// automatically load dependencies and version
$asset_file = include( plugin_dir_path( __FILE__ ) . 'blocks/agenda/build/index.asset.php');

wp_register_script(
    'piroplugin_agenda_js',
    plugins_url( 'blocks/agenda/build/index.js', __FILE__ ),
    $asset_file['dependencies'],
    $asset_file['version']
);

$asset_file = include( plugin_dir_path( __FILE__ ) . 'blocks/countdown/build/index.asset.php');

wp_register_script(
    'piroplugin_countdown_js',
    plugins_url( 'blocks/countdown/build/index.js', __FILE__ ),
    $asset_file['dependencies'],
    $asset_file['version']
);

function piroplugin_enqueue_script_and_style() {
    global $PIRO_PLUGIN_VERSION;
    //init_events_in_scripts();
    wp_enqueue_script('piroplugin_agenda_js', plugin_dir_url( __FILE__ ) . '/blocks/agenda/build/index.js', [], $PIRO_PLUGIN_VERSION);
    wp_enqueue_script('piroplugin_countdown_js', plugin_dir_url( __FILE__ ) . '/blocks/countdown/build/index.js', [], $PIRO_PLUGIN_VERSION);
}
add_action('wp_enqueue_scripts' , 'piroplugin_enqueue_script_and_style'); 

wp_enqueue_script('piroplugin', plugin_dir_url( __FILE__ ) . '/piroplugin.js', [], $PIRO_PLUGIN_VERSION, true);

function piroplugin_block_init() {
    register_block_type( __DIR__ . '/blocks/agenda', [ 'title' => 'Mon Agenda' ] );
	// Additional blocks would be registered here
	register_block_type( __DIR__ . '/blocks/countdown', [ 'title' => 'Compte a rebours' ] );
}
add_action( 'init', 'piroplugin_block_init' );

function init_events_in_scripts() {
    print('<script id="piro_data">var piro_tce_events = { "test" = true };</script>');
    $post_events = tribe_get_events( [ 'posts_per_page' => -1 ] );

    global $post;
    $events = [];
    foreach( $post_events as $post) {
        if ( $post->post_status == "publish" ) {
            $cat_slugs = tribe_get_event_cat_slugs($post->id);
            $categories = [];
            foreach( $cat_slugs as $cat_slug ) {
                $category = [ "slug" => $cat_slug ];
                array_push( $categories, $category );
            }
            $tags = wp_get_post_tags($post->ID);
            $venue_id = tribe_get_venue_id( $post->ID );
            $venue = tribe_get_venue_object( $venue_id );
            $event = tribe_get_event( $post->ID);
            $start_date_details = ["year" => intval(substr( $event->start_date,0,4)) ];
            $featured_image = tribe_event_featured_image( $post->ID, 'full', true, false );
            $img_link = preg_replace('/<a.*>(.*)<\/a>/','\1', $featured_image );
            $image = $img_link ? [ "url" => $img_link ] : false;

            array_push($events, [ 
                "id" => $post->ID, 
                "title"=> $event->post_title,
                "description"=> $event->post_content,
                "start_date"=> $event->start_date,
                "start_date_details"=> $start_date_details,
                "end_date"=> $event->end_date,
                "all_day"=> $event->all_day,
                "categories"=> $categories,
                "tags"=> $tags,
                "venue"=> $venue,
                "image"=> $image
                ] );
        }
    }
    wp_add_inline_script('piro_common_js', 'var piro_tce_events = '. json_encode( $events ) .';' , 'before' );
}

add_action('wp_enqueue_scripts' , 'init_events_in_scripts'); 
