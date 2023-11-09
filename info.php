<?php 

// Ensure the global $post variable is in scope
global $post;
 
// Retrieve the next 5 upcoming events
$events = tribe_get_events( [ 'posts_per_page' => 5 ] );
 
// Loop through the events: set up each one as
// the current post then use template tags to
// display the title and content
foreach ( $events as $post ) {
   setup_postdata( $post );
 
   // This time, let's throw in an event-specific
   // template tag to show the date after the title!
   echo '<h4>' . $post->post_title . '</h4>';
   echo ' ' . tribe_get_start_date( $post ) . ' ';
}