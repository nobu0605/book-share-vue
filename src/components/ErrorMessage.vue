<template>
  <span
    v-if="isError"
    style="color: red; margin-bottom: 13px; word-break: break-word; width: 80%"
  >
    {{ errorMessage }}
  </span>
  <span v-else></span>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    isError: {
      type: Boolean,
      required: true,
    },
    errorMessage: {
      type: String,
      required: true,
    },
  },
  setup() {},
})
</script>
