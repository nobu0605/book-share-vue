<template>
  <div class="flex flex-col w-1/3 bg-white p-10 h-2/4">
    <span class="text-blue-500 text-center text-2xl font-bold"
      >アカウント登録</span
    >
    <label class="mt-3">ユーザーネーム</label>
    <t-input
      v-model="data.username"
      class="mt-3 p-2.5"
      placeholder="Username"
      name="username"
      type="text"
      @blur="onBlur"
    />
    <error-message
      :error-message="'ユーザーネームは入力必須項目です。'"
      :is-error="data.errors.isRequired.username"
    />
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
    <error-message
      :error-message="'パスワードとパスワード(確認)が一致しません。'"
      :is-error="data.errors.isMismatch.password"
    />
    <label class="mt-3">パスワード（確認）</label>
    <t-input
      v-model="data.confirmPassword"
      class="mt-3 p-2.5"
      placeholder="Confirm password"
      name="confirmPassword"
      type="password"
      @blur="onBlur"
    />
    <error-message
      :error-message="'パスワードは入力必須項目です。'"
      :is-error="data.errors.isRequired.confirmPassword"
    />
    <error-message
      :error-message="'無効なパスワードです。'"
      :is-error="data.errors.isInvalid.confirmPassword"
    />
    <error-message
      :error-message="'パスワードとパスワード(確認)が一致しません。'"
      :is-error="data.errors.isMismatch.confirmPassword"
    />
    <t-button class="mt-4" @click="onSubmit">送信</t-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api'
import { isEmpty, isValidEmail, isValidPassword } from '@/helpers/validations'
import axios from '@/helpers/axios'
import ErrorMessage from '@/components/ErrorMessage.vue'

interface isRequired {
  email: boolean
  password: boolean
  username: boolean
  confirmPassword: boolean
  [key: string]: boolean
}

interface isMismatch {
  password: boolean
  confirmPassword: boolean
  [key: string]: boolean
}

interface isInvalid {
  email: boolean
  password: boolean
  confirmPassword: boolean
  [key: string]: boolean
}

interface Data {
  username: string
  email: string
  password: string
  confirmPassword: string
  errors: {
    isRequired: isRequired
    isMismatch: isMismatch
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
      confirmPassword: '',
      errors: {
        isRequired: {
          email: false,
          password: false,
          username: false,
          confirmPassword: false,
        },
        isMismatch: {
          password: false,
          confirmPassword: false,
        },
        isInvalid: {
          email: false,
          password: false,
          confirmPassword: false,
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
          if (name === 'password' || name === 'confirmPassword') {
            data.errors.isMismatch.password = false
            data.errors.isMismatch.confirmPassword = false

            if (!isValidPassword(value)) {
              data.errors.isInvalid[name] = true
            }
          }
        }
      },
      async onSubmit(): Promise<void> {
        if (
          data.errors.isMismatch.password !==
          data.errors.isMismatch.confirmPassword
        ) {
          data.errors.isMismatch.password = true
          data.errors.isMismatch.confirmPassword = true
          return
        }

        if (
          Object.values(data.errors.isRequired).includes(true) ||
          Object.values(data.errors.isMismatch).includes(true) ||
          Object.values(data.errors.isInvalid).includes(true)
        ) {
          return
        }

        const { username, email, password } = data

        await axios
          .post(`/api/auth`, {
            username,
            email,
            password,
          })
          .then(() => {
            // @ts-ignore TODO
            this.$router.push('/completed')
          })
          .catch((e) => {
            console.error(e)
            if (e.response.status === 422) {
              alert('このメールアドレスは既に登録されています。')
              return
            }
            alert(
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
