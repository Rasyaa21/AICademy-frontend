<template>
    <div class="profile">
        <h1>{{ profile.username }}</h1>
        <p>{{ profile.fullName }}</p>
        <p>{{ profile.email }}</p>
        <p>{{ profile.bio }}</p>
    </div>
</template>

<script>
    export default {
        async asyncData({ params }) {
        const nis = params.nis;  
    
        const response = await fetch(`https://your-api-endpoint.com/api/profile/${nis}`);
        const profile = await response.json();
    
        return { profile };
        },
    };
    </script>
    
    <style scoped>
    .profile {
        font-size: 1.5rem;
        padding: 20px;
    }
</style>