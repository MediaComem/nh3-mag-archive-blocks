const { __ } = wp.i18n;

export function Credit({ title, userName }) {
  return (
    <p class="nh3-mag-archive-blocks-credit">
      <span>{`"${title ? title : __('Untitled')}" ${__('published by')} ${userName}`}</span>
    </p>
  )
}