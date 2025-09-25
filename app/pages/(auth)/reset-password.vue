<template>
    <AlertModal 
        v-model:isOpen="alertModal.isOpen"
        :type="alertModal.type"
        :title="alertModal.title"
        :message="alertModal.message"
        @ok="handleAlertOk"
    />
    <section class="flex overflow-hidden relative justify-center items-center py-8 w-full min-h-screen bg-gradient-to-b to-red-700 from-primary">
        <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl bg-white/10"></div>
        <div class="absolute -right-10 -bottom-20 w-96 h-96 rounded-full blur-3xl bg-pink-400/20"></div>
        
        <div class="absolute top-32 right-32 w-16 h-16 rounded-lg rotate-45 bg-white/5"></div>
        <div class="absolute bottom-32 left-48 w-20 h-20 rounded-full bg-white/5"></div>
        <div class="absolute left-8 top-1/2 w-8 h-8 rounded-full bg-white/10"></div>
        <div class="absolute right-16 top-1/4 w-12 h-12 rounded-lg rotate-12 bg-white/5"></div>

        <div class="absolute top-24 left-32 lg:left-48 animate-float">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/home-icon.png" alt="Home" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>

        <div class="absolute right-24 top-1/3 lg:right-32 animate-float-delayed">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/book-icon.png" alt="Book" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>

        <div class="absolute left-16 bottom-40 animate-float-slow">
            <div class="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <img src="/assets/images/gear-icon.png" alt="Settings" class="object-contain w-full h-full opacity-80" />
            </div>
        </div>


        <div class="relative z-10 px-6 mx-auto w-full max-w-2xl">
            <div class="flex flex-col justify-center items-center px-8 py-12 mx-auto mb-4 bg-white rounded-2xl backdrop-blur-xl bg-primary/10">
                <div class="text-center">
                    <div class="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-primary/10">
                        <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V14L13 16L15 14V11C16.1 11 17 10.1 17 9H21ZM6 12C7.1 12 8 11.1 8 10S7.1 8 6 8 4 8.9 4 10 4.9 12 6 12ZM18 12C19.1 12 20 11.1 20 10S19.1 8 18 8 16 8.9 16 10 16.9 12 18 12ZM4 18C4 16.9 4.9 16 6 16S8 16.9 8 18 7.1 20 6 20 4 19.1 4 18ZM16 18C16 16.9 16.9 16 18 16S20 16.9 20 18 19.1 20 18 20 16 19.1 16 18Z"/>
                        </svg>
                    </div>
                    <h1 class="mb-3 text-4xl font-bold text-secondary">Reset Password</h1>
                    <p class="mx-auto mb-4 max-w-md text-lg leading-relaxed text-gray-500">
                        Silahkan masukan password baru anda
                    </p>
                </div>

                <form  class="space-y-5 w-full max-w-md" @submit.prevent="handleReset">
                    <PasswordTextfield/>

                    <UniversalButton type="submit" text="Reset Password"/>

                    
                    <div class="text-center">
                        <span class="text-gray-600">Kembali ke halaman </span>
                        <a href="/login" class="font-semibold transition-colors text-primary hover:text-primary/80">
                            Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import PasswordTextfield from '~/components/textfield/PasswordTextfield.vue'
import AlertModal from '~/components/modal/basic-modal/AlertModal.vue'
import UniversalButton from '~/components/button/UniversalButton.vue'

definePageMeta({
    layout: false
})

const config = useRuntimeConfig()

const form = ref({
    password: '',
})

const alertModal = ref({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
})

// Alert modal handlers
const showSuccessModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'success',
        title: 'Reset Password Berhasil',
        message: message
    }
}

const showErrorModal = (message: string) => {
    alertModal.value = {
        isOpen: true,
        type: 'error',
        title: 'Reset Password Gagal',
        message: message
    }
}

const handleAlertOk = () => {
    alertModal.value.isOpen = false
    if (alertModal.value.type === 'success') {
        // Redirect to login after successful password reset
        navigateTo('/login')
    }
}

const handleReset = async () => {

    const payload = {          
        password: form.value.password,
    }

    try {
        //todo passwing token
        await $fetch('reset-password/RESET_TOKEN_FROM_EMAIL', {
            method: 'POST',
            body: payload,
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            baseURL: config.public.apiBase
        });
        
        showSuccessModal('Password berhasil direset! Anda akan dialihkan ke halaman login')
    } catch (error: unknown) {
        const err = error as { status?: number; statusCode?: number; data?: { message?: string; error?: string }; message?: string }
        
        let errorMessage = 'Terjadi kesalahan saat mereset password'
        
        if (err.status === 400 || err.statusCode === 400) {
            errorMessage = 'Token reset password tidak valid atau sudah kadaluarsa'
        } else if (err.data?.message) {
            errorMessage = err.data.message
        } else if (err.message) {
            errorMessage = err.message
        }
        
        showErrorModal(errorMessage)
        console.error('Error submitting post:', error)
    }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}
</style>