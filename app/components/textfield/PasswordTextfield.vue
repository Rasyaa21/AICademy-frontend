<script setup lang="ts">
import MainTextfield from './MainTextfield.vue';

const props = defineProps<{
    password?: string,
    confirm?: string,
    showConfirm?: boolean
}>() 

const emit = defineEmits<{
    (e: 'update:password', v: string):void
    (e: 'update:confirm', v: string):void
    (e: 'match', v: boolean):void
    (e: 'valid', v: boolean):void
}>()

const password = ref(props.password ?? '')
const confirm = ref(props.confirm ?? '')

// Password regex pattern - at least 8 chars, 1 lowercase, 1 uppercase, 1 digit, 1 special char
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

watch(() => props.password, value => {if ( value!== undefined && value !== password.value) password.value = value})
watch(() => props.confirm, value => {if ( value!== undefined && value !== confirm.value) confirm.value = value})

const isDirty = computed(() => password.value.length > 0 || confirm.value.length > 0)
const isBothFilled = computed(() => password.value.length > 0 && confirm.value.length > 0)
const isMatch = computed(() => isBothFilled.value && password.value === confirm.value)
const isPasswordValid = computed(() => passwordPattern.test(password.value))

// Password strength indicators
const passwordChecks = computed(() => {
    const checks = [
        { label: 'Minimal 8 karakter', valid: password.value.length >= 8 },
        { label: 'Mengandung huruf kecil', valid: /[a-z]/.test(password.value) },
        { label: 'Mengandung huruf besar', valid: /[A-Z]/.test(password.value) },
        { label: 'Mengandung angka', valid: /\d/.test(password.value) },
        { label: 'Mengandung karakter khusus (@$!%*?&)', valid: /[@$!%*?&]/.test(password.value) }
    ]
    return checks
})

const showPasswordHints = computed(() => password.value.length > 0 && !isPasswordValid.value)

// Get password error message
const passwordError = computed(() => {
    if (password.value.length === 0) return undefined
    if (!isPasswordValid.value) {
        return 'Password tidak memenuhi kriteria keamanan'
    }
    return undefined
})

// Get confirm password error message
const confirmError = computed(() => {
    if (!props.showConfirm) return undefined
    if (confirm.value.length === 0) return undefined
    if (isBothFilled.value && !isMatch.value) {
        return 'Konfirmasi password tidak sesuai'
    }
    return undefined
})

watch([password, confirm, isMatch, isPasswordValid], () => {
    emit('update:password', password.value)
    emit('update:confirm', confirm.value)
    emit('match', isMatch.value)
    emit('valid', props.showConfirm ? (isPasswordValid.value && isMatch.value) : isPasswordValid.value)
})
</script>

<template>
  <div class="space-y-3">
    <div>
      <MainTextfield
        v-model="password"
        name="password"
        label="Password"
        type="password"
        is-password
        placeholder="Masukan Password"
        :error="passwordError"
        required
      >
        <template #icon>
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M6 11V8a6 6 0 1112 0v3" stroke="currentColor" stroke-width="2"/>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </template>
      </MainTextfield>
      
      <div v-if="showPasswordHints" class="p-3 mt-2 bg-gray-50 rounded-lg border">
        <p class="mb-2 text-xs font-medium text-gray-700">Password harus memenuhi kriteria berikut:</p>
        <div class="space-y-1">
          <div 
            v-for="check in passwordChecks" 
            :key="check.label"
            class="flex gap-2 items-center text-xs"
          >
            <div class="flex-shrink-0">
              <Icon 
                v-if="check.valid" 
                name="heroicons:check-circle-20-solid" 
                class="w-4 h-4 text-green-500" 
              />
              <Icon 
                v-else 
                name="heroicons:x-circle-20-solid" 
                class="w-4 h-4 text-gray-400" 
              />
            </div>
            <span :class="check.valid ? 'text-green-700' : 'text-gray-600'">
              {{ check.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Password (only show if showConfirm is true) -->
    <MainTextfield
      v-if="showConfirm"
      v-model="confirm"
      name="confirm_password"
      label="Konfirmasi Password"
      type="password"
      is-password
      placeholder="Ulangi Password"
      :error="confirmError"
      required
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