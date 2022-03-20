<template>
  <div class="flex flex-col text-center w-1/3 bg-white p-10 h-2/4">
    <p>登録が完了しました。</p>
    <NuxtLink class="flex justify-center" :to="{ path: '/' }">
      <t-button class="mt-4">利用を開始する</t-button>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  layout: 'auth-layout',
})
</script>
