import { TextareaControl } from '@wordpress/components';

import { LinkContent } from '../components/link-content';
import { uniqLink } from './misc';
import { AreaLabel } from '../components/area-label';
import { getLinkContentPromise } from './link-management';

/**
 * Generates the definition object for On Topic Links Blocks.
 * You can pass it an options object to customize the component behavior
 * @param {Object} options An object to customize the component
 * @param {string} options.title The component title
 */
export function makeOnTopicBlockDefinition({ title, sectionTitle }) {
  return {
    title,
    icon: 'admin-links',
    category: 'nh3-mag-blocks',
    parent: [ 'nh3/on-topic-section' ],
    supports: {
      multiple: false
    },
    attributes: {
      data:
        { type: 'string' }
    },
    edit({ className, attributes, setAttributes }) {

      // Utility to set the component data serialization
      const setData = dataObj => setAttributes({ data: JSON.stringify(dataObj) });
      // Initialize the data to an empty array to avoid a JSON parser error when no data
      const getData = () => attributes.data ? JSON.parse(attributes.data) : [];

      const linksData = getData();

      if (!attributes.init) {
        // When init, replace dev URLs by production URLs
        linksData.forEach(link => {
          link.url = link.url.replace(/^(https:\/\/)dev(2)?\./, '$1');
          return link;
        });
        // When init, rebuild the textarea content from the component's data and refetch the documents
        onLinkStringChange(linksData.map(link => link.url).join('\n'));
        setAttributes({ init: true });
      }

      /**
       * When the content of the text area changes,
       * Tests each line of the content and fetch the corresponding resource if necessary.
       * Then, set the component's data with the resulting data structure.
       * @param {string} value Content of the textarea
       */
      async function onLinkStringChange(value) {
        const links = uniqLink(value.split(/\n/));
        setAttributes({ linkString: links.join('\n') });
        // links.filter(Boolean) removes empty lines befores trying to fetch the links content
        let apiResults = await Promise.all(links.filter(Boolean).map(getLinkContentPromise));
        setData(apiResults);
      }

      return (
        <div className={className}>
          <h3>{sectionTitle}</h3>
          <TextareaControl onChange={onLinkStringChange} label={<AreaLabel />} value={attributes.linkString} />
          {linksData.map(link => <LinkContent value={link} />)}
        </div>
      )
    },
    /**
     * Server-side rendered.
     * @see {@link ../../templates/on-topic-nh3-links.php}
     * @see {@link ../../templates/on-topic-ssr-links.php}
     */
    save() {
      return null;
    }
  }
}
