<template>
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Peran</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Category</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Dibuat</th>
                        <th class="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in paginatedRoles" :key="role.id" class="border-b border-gray-100 hover:bg-gray-50">
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Icon name="heroicons:shield-check-20-solid" class="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 text-sm">{{ role.name }}</div>
                                    <div class="text-xs text-gray-500">{{ role.description }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-6">
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ role.category }}
                            </span>
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-2">
                                <span 
                                    :class="[
                                        'px-2 py-1 rounded-full text-xs font-medium',
                                        role.active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    ]"
                                >
                                    {{ role.active ? 'Aktif' : 'Tidak Aktif' }}
                                </span>
                            </div>
                        </td>
                        <td class="py-4 px-6 text-sm text-gray-600">
                            {{ formatDate(role.created_at) }}
                        </td>
                        <td class="py-4 px-6">
                            <div class="flex items-center gap-1">
                                <button 
                                    @click="$emit('edit-role', role)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Edit"
                                >
                                    <Icon name="heroicons:pencil-20-solid" class="w-4 h-4 text-gray-600" />
                                </button>
                                <button 
                                    @click="$emit('delete-role', role)"
                                    class="p-1 hover:bg-gray-200 rounded"
                                    title="Hapus"
                                >
                                    <Icon name="heroicons:trash-20-solid" class="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    paginatedRoles: any[]
}

interface Emits {
    (e: 'view-role', role: any): void
    (e: 'edit-role', role: any): void
    (e: 'delete-role', role: any): void
    (e: 'toggle-status', role: any): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
</script>