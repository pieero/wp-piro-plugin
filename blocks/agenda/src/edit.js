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
import { PanelBody, SelectControl } from '@wordpress/components';

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

	const [tagsList, setTagsList] = useState(null);
	const tags = props.attributes.tags.split(',');

	useEffect(() => {
	  fetch("/wp-json/tribe/events/v1/tags")
		.then( (response) => response.json() )
		.then( (response) => {
		  let TagsArray = { ...response }.tags;
		  const tagsOptions = TagsArray.map((v) => { return { label: v.name, value: v.name}; });
		  setTagsList(tagsOptions);
		})
	  .catch((err) => console.error(err));
	}, []);


	var saveTags = function(tagList) {
		props.setAttributes({tags: tagList.join(",")});
	}

	return (
		<div { ...attr }>
		<InspectorControls>
			<PanelBody
				title={__('General')}
				initialOpen={true}
			>
{ tagsList && (
				<SelectControl
					label={__('Tags')}
					value={ tags }
					options={ tagsList }
					onChange={ ( newSize ) => saveTags( newSize ) }
					multiple={true}
					__nextHasNoMarginBottom
				/> )}
			</PanelBody>
		</InspectorControls>
			<div id="mount" ></div>
		</div>
	);
}

/**
 * 
 * 					options={ [
						{ label: 'Big', value: '100%' },
						{ label: 'Medium', value: '50%' },
						{ label: 'Small', value: '25%' },
					] }
*/ 