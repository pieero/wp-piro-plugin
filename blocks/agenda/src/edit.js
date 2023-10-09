/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';

import {registerAgenda, mountAgenda} from './agenda';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import { useState, useEffect } from 'react';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( props ) {
	var attr = {...useBlockProps() };
	registerAgenda(attr.id, props);

	const tags = props.attributes.tags?.split(',');
	const categories = props.attributes.categories;
	
	useEffect(() => {
        PiroCommon.fetchEventMetaData();
	}, []);

	var saveTags = function(tagList) {
		props.setAttributes({tags: tagList.join(",")});
	}
	var saveCategories = function(category) {
		props.setAttributes({categories: category});
	}

	var saveNextTitle = function(title) {
		props.setAttributes({nextTitle: title});
	}

	var savePreviousTitle = function(title) {
		props.setAttributes({previousTitle: title});
	}

	return (
		<div { ...attr }>
		<InspectorControls>
			<PanelBody
				title={__('General')}
				initialOpen={true}
			>
{ PiroCommon.event_metadata?.category_list && (
				<SelectControl
					label={__('Categories')}
					value={ categories }
					options={ PiroCommon.event_metadata?.category_list }
					onChange={ ( newCategories ) => saveCategories( newCategories ) }
					multiple={false}
					__nextHasNoMarginBottom
				/> )}
{ PiroCommon.event_metadata?.tag_list && (
				<SelectControl
					label={__('Tags')}
					value={ tags }
					options={ PiroCommon.event_metadata?.tag_list }
					onChange={ ( newTags ) => saveTags( newTags ) }
					multiple={true}
					__nextHasNoMarginBottom
				/> )}
			</PanelBody>
		</InspectorControls>
			<div id="mount" ></div>
		</div>
	);
}
