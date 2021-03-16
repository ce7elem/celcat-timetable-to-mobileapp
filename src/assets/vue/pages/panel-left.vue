<template>
  <f7-page>
    <f7-block-title>Left Panel</f7-block-title>
    <f7-block>
      <p>
        This is a left side panel. You can close it by clicking outsite or on this link:
        <f7-link panel-close>close me</f7-link>. You can put here anything.
      </p>
    </f7-block>
    <f7-block-title>Main View Navigation</f7-block-title>
    <f7-list>
      <f7-list-item link="/about/" title="About" panel-close></f7-list-item>
      <f7-list-item link="/form/" title="Form" panel-close></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
export default {
  components: {}
};
</script>
