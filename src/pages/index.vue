<template>
  <div class="flex flex-col w-1/3 bg-white p-10 h-2/4">
    <span class="text-blue-500 text-center text-2xl font-bold">ログイン</span>
    <label class="mt-3">メールアドレス</label>
    <t-input
      v-model="data.email"
      class="mt-3 p-2.5"
      placeholder="E-mail address"
      name="email"
      type="text"
      @blur="onBlur"
    />
    <error-message
      :error-message="'メールアドレスは入力必須項目です。'"
      :is-error="data.errors.isRequired.email"
    />
    <error-message
      :error-message="'無効なメールアドレスです。'"
      :is-error="data.errors.isInvalid.email"
    />
    <label class="mt-3">パスワード</label>
    <t-input
      v-model="data.password"
      class="mt-3 p-2.5"
      placeholder="Password"
      name="password"
      type="password"
      @blur="onBlur"
    />
    <error-message
      :error-message="'パスワードは入力必須項目です。'"
      :is-error="data.errors.isRequired.password"
    />
    <error-message
      :error-message="'無効なパスワードです。'"
      :is-error="data.errors.isInvalid.password"
    />
    <t-button class="mt-4" @click="onSubmit">送信</t-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { isEmpty, isValidEmail, isValidPassword } from '@/helpers/validations'
import axios from '@/helpers/axios'

interface isRequired {
  email: boolean
  password: boolean
  [key: string]: boolean
}

interface isInvalid {
  email: boolean
  password: boolean
  [key: string]: boolean
}

interface Data {
  username: string
  email: string
  password: string
  errors: {
    isRequired: isRequired
    isInvalid: isInvalid
  }
  [key: string]: any
}

export default defineComponent({
  components: {
    ErrorMessage,
  },
  layout: 'auth-layout',
  setup() {
    const data: Data = reactive({
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

    const methods = {
      onBlur(e: Event): void {
        if (e.target instanceof HTMLInputElement) {
          const name = e.target.name
          const value = e.target.value

          data.errors.isRequired[name] = false
          if (isEmpty(value)) {
            data.errors.isRequired[name] = true
          }

          data.errors.isInvalid[name] = false
          if (name === 'email' && !isValidEmail(value)) {
            data.errors.isInvalid[name] = true
          }
          if (name === 'password') {
            if (!isValidPassword(value)) {
              data.errors.isInvalid[name] = true
            }
          }
        }
      },
      async onSubmit(): Promise<void> {
        if (
          Object.values(data.errors.isRequired).includes(true) ||
          Object.values(data.errors.isInvalid).includes(true)
        ) {
          return
        }

        const { email, password } = data

        await axios
          .post(`/api/auth/sign_in`, {
            email,
            password,
          })
          .then((response: any) => {
            localStorage.setItem(
              'access-token',
              response.headers['access-token']
            )
            localStorage.setItem('client', response.headers.client)
            localStorage.setItem('uid', response.headers.uid)
            // @ts-ignore TODO
            this.$router.push('/home')
          })
          .catch((e) => {
            console.error(e)
            // setIsLoading(false)
            if (e.response.status === 401) {
              return alert('メールアドレスもしくはパスワードが間違っています。')
            }
            return alert(
              '何らかのエラーが発生しています。申し訳ありませんが時間を空けて再度お試し下さい。'
            )
          })
      },
    }

    return {
      data,
      ...methods,
    }
  },
})
</script>

<style scoped>
.drop {
  top: -999999;
  z-index: 1300;
}
</style>
