<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { get, post, put, del } from '@/services/apiServices'
const form = reactive({
  userName: '',
  password: ''
})

const userNameError = ref(null)
const passwordError = ref(null)
const error = ref(true)
const resetError = () => {
  error.value = !error.value
}
const errorMessege = ref('same thing went wrong')

const router = useRouter()
const submit = async () => {
  userNameError.value = form.userName === '' ? 'User Name can not be empty' : null
  passwordError.value = form.password === '' ? 'Password can not be empty' : null
  if (passwordError.value !== userNameError.value) return
  post('api/UserManagement/Login', form)
    .then((respons) => {
      localStorage.setItem('user-token', respons.data.token)
      localStorage.setItem('pages',JSON.stringify(respons.data.pages))
      router.push('/profile')
    })
    .catch((e) => {
      error.value = !error.value
      errorMessege.value = e?.response?.data?.message
    })
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox v-if="error" :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login" :error="userNameError">
          <FormControl
            v-model="form.userName"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
            :placeholder="'login'"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password" :error="passwordError">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
            :placeholder="'password'"
          />
        </FormField>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
          </BaseButtons>
        </template>
      </CardBox>
      <CardBox v-else :class="cardClass">
        <div class="space-y-3">
          <h1 class="text-2xl">Login faild</h1>

          <p>{{ errorMessege }}</p>
        </div>

        <template #footer>
          <BaseButtons>
            <BaseButton label="Done" color="danger" @click="resetError" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
