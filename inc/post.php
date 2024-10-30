<?php

$ps_hide_widget = get_post_meta( $post->ID, '_cmt_hide_widget', true ); 
$status = checked( $ps_hide_widget, 1, false );

$current = json_encode((array)get_option('title_styles'));

$html = __( 'Capitalize your headings for this post. For help, see <a href="https://plugin.capitalizemytitle.com/documentation/" target="_blank">documentation</a>.<br/><br/>', CMT_PLUGIN_DIR );

$site_url = json_encode(home_url());

ob_start(); ?>


<div class="cmt_styles">



<button type="button" class="page-title-action refresh-button fa-3x" id="CMT_RefreshTitles" title="Refresh Titles" aria-label="Refresh Titles"><i class="fa fa-refresh" aria-hidden="true"></i>
</button>

<table id="CMT_TitleTable">
<thead>
  <tr>

		<th class="CMT_TH_Header">
			Header
		</th>
        <th class="CMT_TH_Button">
			Fixed?
		</th>
		<th class="CMT_TH_Original">
			Current Title
		</th>
		<th class="CMT_TH_CapitalizedTitle">
			Capitalized Title
		</th>
		<th class="CMT_TH_Button">
			
		</th>
	</tr>
</thead>
  <tbody>
  </tbody>
</table>

</div>


<?php
$html .=  ob_get_clean();


echo apply_filters( 'cmt_metabox_content', $html ); 