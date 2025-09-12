<script setup lang="ts">
import MainTextfield from './MainTextfield.vue';

    const props = defineProps<{
        password?: string,
        confirm?: string,
    }> () 

    const emit = defineEmits<{
        (e: 'update:password', v: string):void
        (e: 'update:confirm', v: string):void
        (e: 'match', v: boolean):void
    }>()

    const password = ref(props.password ?? '')
    const confirm = ref(props.confirm ?? '')

    watch(() => props.password, value => {if ( value!== undefined && value !== password.value) password.value = value})
    watch(() => props.confirm, value => {if ( value!== undefined && value !== confirm.value) confirm.value = value})

    const isDirty = computed(() => password.value.length > 0 || confirm.value.length > 0)
    const isBothFilled = computed(() => confirm.value.length > 0 && confirm.value.length > 0)
    const isMatch = computed(() => isBothFilled.value && password.value === confirm.value)

    watch([password, confirm, isMatch], () => {
        emit('update:password', password.value)
        emit('update:confirm', confirm.value)
        emit('match', isMatch.value)
    })
</script>

<template>
  <div class="space-y-3">
    <MainTextfield
      v-model="password"
      name="password"
      label="Password"
      type="password"
      is-password
      placeholder="Masukan Password"
    >
      <template #icon>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M6 11V8a6 6 0 1112 0v3" stroke="currentColor" stroke-width="2"/>
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>
      </template>
    </MainTextfield>

    <MainTextfield
      v-model="confirm"
      name="confirm_password"
      label="Konfirmasi Password"
      type="password"
      is-password
      placeholder="Ulangi Password"
      :error="isBothFilled && !isMatch ? 'Konfirmasi password tidak sesuai dengan password' : undefined"
    >
      <template #icon>
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M6 11V8a6 6 0 1112 0v3" stroke="currentColor" stroke-width="2"/>
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
        </svg>
      </template>
    </MainTextfield>
  </div>
</template>