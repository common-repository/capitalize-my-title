<?php
//if no tab is set, default to options tab
$tab =  'cmt_options';


if(isset($_GET['restore_defaults']) && $_GET['restore_defaults']) {
	$defaults = cmt_default_options();
		if(!empty($defaults)) {
			update_option("title_styles", $defaults);
		}
}

$current = json_encode((array)get_option('title_styles'));


//plugin settings wrapper
echo "<div id='cmt-admin' class='wrap'>";

		
	?>
		<form method="post" action="options.php">
					<?php
					settings_fields( $tab );
					$section = ('cmt_options' == $tab) ? 'cmt_options' : $tab;
					do_settings_sections( $section );

					submit_button();

					?>
		 </form>
	