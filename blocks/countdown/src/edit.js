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
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

import {registerCountdown, mountCountdown} from './countdown';

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
	registerCountdown(attr.id, props);

	const tags = props.attributes.tags.split(',');
	const category = props.attributes.category;

	useEffect(() => {
        PiroCommon.fetchEventMetaData();
	}, []);

	var saveTags = function(tagList) {
		props.setAttributes({tags: tagList.join(",")});
	}

	var saveCategory = function(cat) {
		props.setAttributes({category: cat});
	}

	return (
		<div { ...attr }>
			<InspectorControls>
			<PanelBody
				title={__('General')}
				initialOpen={true}
			>
				<RangeControl
					value={ props.attributes.delay }
					label={__('Delay')}
					onChange={ ( value ) => props.setAttributes({ delay: value }) }
					min={ 0 }
					max={ 60 }
						/>
				{ PiroCommon.event_metadata?.tag_list && (
				<SelectControl
					label={__('Tags')}
					value={ tags }
					options={ PiroCommon.event_metadata?.tag_list }
					onChange={ ( newSize ) => saveTags( newSize ) }
					multiple={true}
					__nextHasNoMarginBottom
				/> )}
				{ PiroCommon.event_metadata?.category_list && (
					<SelectControl
						label={__('Category')}
						value={ category }
						options={ PiroCommon.event_metadata?.category_list }
						onChange={ ( newSize ) => saveCategory( newSize ) }
						multiple={false}
						__nextHasNoMarginBottom
					/> )}
			
			</PanelBody>
		</InspectorControls>
			<div id="mount" ></div>
		</div>
		
	);
}
