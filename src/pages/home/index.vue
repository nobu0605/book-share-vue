<template>
  <div class="flex flex-col w-1/3 bg-white p-10 h-2/4">
    <p>name</p>
    <p>email</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from '@vue/composition-api'
import axios from '@/helpers/axios'

const defaultNumberOfTimelines = 20
const defaultPageNumber = 0

export default defineComponent({
  components: {},
  layout: 'auth-layout',
  setup() {
    const data = reactive({
      username: '',
      email: '',
      password: '',
      errors: {
        isRequired: {
          email: false,
          password: false,
        },
        isInvalid: {
          email: false,
          password: false,
        },
      },
    })

    const timelines = ref([])
    const hasMore = ref(true)

    const methods = {
      async getTimelines(authUserId: number, page: number = defaultPageNumber) {
        let currentPage = page
        if (page > 0) {
          // The page number starts from 0 in backend. So I subtract 1.
          currentPage = page - 1
        }
        await axios
          .post(`/api/get_posts`, {
            auth_user_id: authUserId,
            page: currentPage,
          })
          .then((response: any) => {
            if (response.data.length < defaultNumberOfTimelines) {
              hasMore.value = false
            }
            if (timelines.value.length === 0) {
              timelines.value = response.data
              return
            }
            timelines.value = timelines.value.concat(response.data)
          })
          .catch((e) => {
            console.error(e)
          })
      },
    }

    onMounted(() => {})

    return {
      data,
      ...methods,
    }
  },
})
</script>
