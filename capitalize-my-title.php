<?php
//ini_set('log_errors', true);
//ini_set('error_log', dirname(__FILE__).'/cmt_errors.log');

/**
 *
 * @link      https://plugin.capitalizemytitle.com/
 * @copyright Copyright (C) 2012-2021 Capitalize My Title
 *
 * Plugin Name: 		Capitalize My Title Free
 * Description: 		This plugin allows users to capitalize their headings using proper style rules.
 * Plugin URI: 			https://plugin.capitalizemytitle.com/
 * Author: 				Capitalize My Title
 * Author URI: 			https://capitalizemytitle.com/
 * Version: 			0.5.3
 * Text Domain: 		cmt
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path: /languages
 */

if (!defined('WPINC')) {
	die;
}

if (!class_exists("CapitalizeMyTitleMain")):

	/**
	 * Capitalize My Title
	 */
	class CapitalizeMyTitleMain {
	

		protected $settings;
		
		
		function __construct() {
			
			if(!function_exists('get_plugin_data'))
			{
				require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}
			$plugin_data = get_plugin_data(__FILE__);
			$plugin_version = $plugin_data['Version'];
			
			define('CMT_VERSION', $plugin_version);
			
		
			define('CMT_ITEM_NAME', 'WordPress Plugin');
			define("CMT_URL", WP_PLUGIN_URL . '/' . str_replace(basename(__FILE__) , "", plugin_basename(__FILE__)));
			
			define("CMT_PLUGIN_DIR", "capitalize-my-title");
			define("CMT_PLUGIN_URL", get_bloginfo('url') . "/wp-content/plugins/" . CMT_PLUGIN_DIR);
			
			register_activation_hook(__FILE__, array(__CLASS__,"plugin_activation"));
			add_action('admin_menu', array(
				__CLASS__,
				'menu'
			));
			add_action('add_meta_boxes', array(
					$this,
					'cmt_create_metabox'
			));
			
			add_action('init', array(
				__CLASS__,
				'cmt_settings_load'
			));
            
            add_action( 'admin_enqueue_scripts', array(
					$this,'cmt_admin_scripts' ));
            
		}

		/* Activate Plugin */

		public static function plugin_activation() {
		}
		
		public static function cmt_settings_load() {
			add_action('cmt_enqueue_scripts', 'cmt_initialize_options');
			
			
		}
		public static function isGutenberg() {
			return self::is_gutenberg_page();
		}
		
		public static function is_gutenberg_page() {
			if( function_exists('get_current_screen') && method_exists(get_current_screen(), 'is_block_editor') ) {
				return get_current_screen()->is_block_editor();
			}
			return false;
		}

        
		/**plugin admin scripts and styles**/
		public static function cmt_admin_scripts($hook) {
                global $cmt_settings_page;
                if( $hook != 'edit.php' && $hook != 'post.php' && $hook != 'post-new.php' && $hook != $cmt_settings_page)
		          return;
				wp_enqueue_script('tabs', CMT_PLUGIN_URL. '/js/tabs.js', array('jquery'), CMT_VERSION);
				wp_enqueue_script('lexicon', CMT_PLUGIN_URL. '/js/lexicon.js', array('jquery'), CMT_VERSION);
				wp_enqueue_script('tagCombined', CMT_PLUGIN_URL. '/js/tagCombined.js', array('jquery'), CMT_VERSION);
				wp_enqueue_script('core', CMT_PLUGIN_URL. '/js/core.js', array('jquery'), CMT_VERSION, true);
                wp_register_style('cmt-styles', CMT_PLUGIN_URL. '/css/style.css', array(), CMT_VERSION);
				wp_enqueue_style('cmt-styles');
                wp_register_style('cmt-font-awesome', CMT_PLUGIN_URL. '/fontawesome/css/all.min.css', array(), CMT_VERSION);
				wp_enqueue_style('cmt-font-awesome');
				
            
                $script = "loadCMTSettings(".json_encode((array)get_option('title_styles')).");\n\nvar gutenbergActive = ".(self::isGutenberg() ? "true": "false").";\n";
				//$script .= "fixQuoteSetting = ".json_encode(((array)get_option('cmt_fix_quotes'))[0]).";";
				if( $hook == 'edit.php' || $hook == 'post.php' || $hook == 'post-new.php') {
					$script .= "jQuery(\"#CMT_RefreshTitles\").on('click', function(e) {
								if(showDebug) console.log(\"Refreshing titles\");
								loading = false;
								updateTitles();
						});
			
						jQuery(\"#CMT_TitleTable\").after('<div align=\"center\" id=\"initialLoad\" class=\"fa-3x\"><i class=\"fas fa-spinner fa-pulse\"></i><br/><br/></div>');
			
			
						function beforeOnboard() {
							if(onloaded) {
								clearInterval(onboardLoop);
							} else {
								if((Date.now() - loadingTime)/1000 >= 10) {
								try {
									onchange = false;
									loading = false;
									updateTitles();
								} catch(err) {
									console.log(err.message);
			
									}
								} 
							}
						}
			
						jQuery(\"#title\").keyup(function(e) {
							processKeyUp(e, true);
						});
						jQuery(\".editor-post-title__input\").keyup(function(e) {
							processKeyUp(e, true);
						});
			

			
			
						var onboardLoop = setInterval(beforeOnboard, 10000);
			
			
						window.onload = function () {
							

			
							onloaded = true;
							jQuery('#CMT_SelectAll').click(function() {
							jQuery('#CMT_TitleTable input:checkbox[name=CMT_Select]').not(this).prop('checked', this.checked);
							});
			
		
			
								updateTitles();
			
			
								if(!isGutenberg()) {
									if(showDebug) console.log('loading tinymce listeners');
									var activeEditor = tinyMCE.get('content');
									if(activeEditor!==null){
										addTinyMCEListeners();
									} else {
										addTextEditorListeners();
									}
			
								} else {
									if(showDebug) console.log('loading gutenberg listeners');

									addGutenbergListeners();
								}
								
								addTitleListeners();
								addGlobalKeys();
								setInterval(function () {
									if(showDebug) console.log('setInterval run:',loadingTime, (Date.now() - loadingTime)/1000);
									if((Date.now() - loadingTime)/1000 >= 5 && !clickEventRunning) {
										loading = false;
										updateTitles();
									}
					
								}, 2000);
			
						}";
				}
				wp_add_inline_script('core', $script, 'after');			 
		}
        

		/**
		 * Add a meta box to admin pages that are not excluded
		 */
		public function cmt_create_metabox($post_type) {

			//get all excluded post types
			$exclude_type = (array)get_option('cmt_all_post_types');

			//get all excluded post formats
			$exclude_format = (array)get_option('cmt_all_post_formats');

			//get the current post format
			$format = get_post_format();

			//if not an excluded post type and not an excluded post format
			//TODO:: Metabox not shown on postformats that are excluded !isset( $exclude_format[$format] )
			if (!isset($exclude_type[$post_type])) {
				add_meta_box('cmt-meta', 'Capitalize My Title Free', array(
					$this,
					'cmt_metabox'
				) , $post_type, 'normal', 'high');
			}
			else {
				remove_meta_box('cmt-meta', $post_type, 'normal');
			}
		}
		
		/**
		 * Fills the CMT metabox with its content
		 * @param  object $post the post object for the post
		 */
		public function cmt_metabox($post) {	
			include plugin_dir_path(__FILE__) . '/inc/post.php';

		}

		
		
		public static function my_custom_format_enqueue_assets_editor() {
			wp_enqueue_script( 'my-custom-format-js' );
		}

		public static function menu() {

			   add_menu_page(
				__('Capitalize My Title Free', 'cmt'),
				__('Capitalize My Title Free', 'cmt'),
				'edit_posts',
				'capitalize-my-title',
				array(__CLASS__,'cmt_admin'),
				CMT_URL. 'images/cmt-icon-16x16.png'
			);
		}

		public static function cmt_admin() {
			include plugin_dir_path(__FILE__) . '/inc/admin.php';
		}
	}
	
    //uninstall plugin + delete options
    function cmt_uninstall() {

        //plugin options
        $cmt_settings = array(
            'cmt_options'
        );

        foreach($cmt_settings as $option) {
            delete_option($option);
        }
    }
    register_uninstall_hook(__FILE__, 'cmt_uninstall');


	require_once plugin_dir_path(__FILE__) . 'inc/settings.php';
	require_once plugin_dir_path(__FILE__) . 'inc/functions.php';
	


	
	$cmt = new CapitalizeMyTitleMain();

endif;
?>
