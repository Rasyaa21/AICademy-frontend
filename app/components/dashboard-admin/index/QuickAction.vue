<template>
    <div class="bg-white rounded-2xl p-6 shadow-xl border">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
            <button class="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:plus-20-solid" class="w-5 h-5 text-primary" />
                </div>
                <div>
                    <div class="font-medium text-gray-900 text-sm">Create Challenge</div>
                    <div class="text-xs text-gray-500">Add new challenge</div>
                </div>
            </button>
            
            <button class="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:user-plus-20-solid" class="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <div class="font-medium text-gray-900 text-sm">Manage Users</div>
                    <div class="text-xs text-gray-500">View all users</div>
                </div>
            </button>
            
            <button class="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon name="heroicons:chart-bar-20-solid" class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <div class="font-medium text-gray-900 text-sm">View Reports</div>
                    <div class="text-xs text-gray-500">Analytics & reports</div>
                </div>
            </button>
        </div>
    </div>
</template>