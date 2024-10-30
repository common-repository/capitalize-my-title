<?php

/**
 * Renders the content of the awac options page  
 */
function cmt_options_display(){
	//Get the tabs that need to be displayed
	$tabs = $this->awac_get_tabs($this->awac_get_extension_settings());
	require plugin_dir_path( __FILE__ ) . 'partials/awac-options-display.php';
}

//main options group callback
function cmt_options_callback() {
	echo '<p class="cmt-subheading">' . __('Select which capitalization options you would like to enable.', 'cmt') . '</p>';
}

/**
 * Registers settings fields 
 */
function cmt_initialize_options(){
	
	if(get_option('title_styles') == false) {
		//echo "title_styles doesn't exist";
		add_option('title_styles', apply_filters('cmt_default_options', cmt_default_options())); 
	}
//options primary section
    add_settings_section('cmt_options', __('Options', 'cmt'), 'cmt_options_callback', 'cmt_options');

	add_settings_field(
		'title_styles', 
		__('Header Styles<p class="description">Choose the capitalization style you want for each header type. For more details <a href="https://plugin.capitalizemytitle.com/documentation/" target="_blank">see documentation</a>.</p>', "cmt" ), 
		'cmt_styles_display_table', 
		'cmt_options',
		'cmt_options'
	);
	register_setting(
		'cmt_options', 
		'title_styles'
	);

	add_settings_field(
		'cmt_all_post_types', 
		__('Exclude Post Types<p class="description">The widget will not show on post types that are checked</p>', "cmt" ), 
		'cmt_type_boxes_display', 
		'cmt_options',
		'cmt_options'
	);
	register_setting(
		'cmt_options', 
		'cmt_all_post_types'
	);
	
}


//options default values
function cmt_default_options() {

	
	$defaults = array(
		'TITLE' => array("style" => "apa", "substyle" => "title-case"),
		'H1' => array("style" => "apa", "substyle" => "title-case"),
		'H2' => array("style" => "apa", "substyle" => "title-case"),
		'H3' => array("style" => "apa", "substyle" => "title-case"),
		'H4' => array("style" => "apa", "substyle" => "sentence-case"),
		'H5' => array("style" => "apa", "substyle" => "sentence-case"),
		'H6' => array("style" => "apa", "substyle" => "sentence-case")
	);
	
	return apply_filters('cmt_default_options', $defaults);
}


/**
 * Display the checkboxes for each post format
 * 
 */
function cmt_formats_boxes_display(){
	
	if ( current_theme_supports( 'post-formats' ) ) {
		$post_formats = get_theme_support( 'post-formats' );
		if ( is_array( $post_formats[0] ) ) {       
		   foreach ($post_formats[0] as $post_format) {
				$formats[$post_format] = $post_format;
		   }
		}
	}else{
		echo 'Theme does not support post formats';
		return;
	}

	$options = (array)get_option('all_post_formats');
	
	foreach ( $formats as $format ) {
		if( !isset($options[$format]) )
		{
			$options[$format] = 0;
		}
		echo '<label><input name="all_post_formats['. $format .']" id="all_post_formats['. $format .']" type="checkbox" value="1" class="code" ' . checked( 1, $options[$format], false ) . ' />'. $format .'</label><br />' ;
		
	}

}


/**
 * Display the checkboxes for each post type
 * 
 */
function cmt_type_boxes_display(){
	$post_types = get_post_types();
	$options = (array)get_option('cmt_all_post_types');
	
	
	foreach ( $post_types as $type ) {
		if( !isset($options[$type]) ){
			$options[$type] = 0;
		}
		echo '<label><input name="cmt_all_post_types['. $type .']" id="cmt_all_post_types['. $type .']" type="checkbox" value="1" class="code" ' . checked( 1, $options[$type], false ) . ' />'. $type .'</label><br />' ;
		
	}

}

	

/**
 * Display the categories for posts
 * @doncullen 
 */
function cmt_postcategories_boxes_display(){
	$post_categories = get_categories(); 
	$options = (array)get_option('all_post_categories');
	
	
	foreach ( $post_categories as $category ) {
		$cat = $category->name;
		if( !isset($options[$cat]) ){
			$options[$cat] = 0;
		}
		echo '<label><input name="all_post_categories['. $cat .']" id="all_post_categories['. $cat .']" type="checkbox" value="1" class="code" ' . checked( 1, $options[$cat], false ) . ' />'. $cat .'</label><br />' ;
		
	}

}

/**
 * Display the categories for posts
 * @doncullen 
 */
function cmt_styles_display_table(){
	$headers = array("TITLE","H1","H2","H3","H4","H5","H6");
	
	$styles = array(array("UI"=>"APA","API"=>"apa"),array("UI"=>"Chicago","API"=>"chicago"),array("UI"=>"AP","API"=>"ap"),array("UI"=>"MLA","API"=>"mla"),array("UI"=>"NYT","API"=>"nyt"),array("UI"=>"Wikipedia","API"=>"wikipedia"),array("UI"=>"Email","API"=>"email"));

	$substyles = array(array("UI"=>"Title Case","API"=>"title-case"),array("UI"=>"Sentence case","API"=>"sentence-case"),array("UI"=>"UPPERCASE","API"=>"uppercase"),array("UI"=>"lowercase","API"=>"lowercase"),array("UI"=>"First Letter","API"=>"first-letter"),array("UI"=>"AlT CaSe","API"=>"alt-case"),array("UI"=>"tOGGLE cASE","API"=>"toggle-case"));
	
	$options = (array)get_option('title_styles');
	//echo json_encode($options);
	//$style_options = 
	//$sub_style_options = (array)get_option('title_sub_styles');
	
	echo "<table><tr><th>Header</th><th>Style</th><th>Sub-style</th></tr>";
	
	foreach ( $headers as $header ) {
		if( !isset($options[$header]["style"]) ){
			$options[$header]["style"] = "apa";
		}
		if( !isset($options[$header]["substyle"]) ){
			$options[$header]["substyle"] = "title-case";
		}
		//echo "settings: ". $options[$header]["style"];
//		print_r($styles);
		echo '<tr>';
		echo '<td>'.$header.'</td>';
		echo '<td><select name="title_styles['. $header .'][style]" id="title_styles['. $header .'][style]">';
		
		foreach($styles as $style) {
			echo '<option value="'.$style["API"].'" '.selected( $style["API"], $options[$header]["style"], false ) . ' >'. $style["UI"] .'</option>' ;
			
		}
		echo '</select></td>';

		echo '<td><select name="title_styles['. $header .'][substyle]" id="title_styles['. $header .'][substyle]">';
		
		foreach($substyles as $substyle) {
			echo '<option value="'.$substyle["API"].'" '.selected( $substyle["API"], $options[$header]["substyle"], false ) . ' >'. $substyle["UI"] .'</option>' ;
			
		}
		echo '</select></td>';
		echo '</tr>';
		//echo '<label><input name="all_post_categories['. $cat .']" id="all_post_categories['. $cat .']" type="checkbox" value="1" class="code" ' . checked( 1, $options[$cat], false ) . ' />'. $cat .'</label><br />' ;
	
		
	}
	
	echo "</table>";

}


add_action('admin_init', 'cmt_initialize_options');

//print tooltip
function cmt_tooltip($tooltip) {
    if(!empty($tooltip)) {
        echo "<span class='cmt-tooltip-text'>" . $tooltip . "<span class='cmt-tooltip-subtext'>" . sprintf(__("Click %s to view documentation.", 'cmt'), "<span class='cmt-tooltip-icon'>?</span>") . "</span></span>";
    }
}

//print title
function cmt_title($title, $id = false, $link = false) {

    if(!empty($title)) {

        $var = "<span class='cmt-title-wrapper'>";

            //label + title
            if(!empty($id)) {
                $var.= "<label for='" . $id . "'>" . $title . "</label>";
            }
            else {
                $var.= $title;
            }


        $var.= "</span>";

        return $var;
    }
}
