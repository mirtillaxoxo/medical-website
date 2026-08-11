```vue
<script lang="ts" setup>
const props = defineProps<{
  formSubmitted: boolean;
  formError: boolean;
}>();

const messages = {
  successTitle: "Prenotazione inviata",
  successMessage: "Verrai ricontattato al più presto per la conferma.",
  errorTitle: "Errore nell'invio",
  errorMessage:
    "Si è verificato un problema durante l'invio. Riprova più tardi.",
};
</script>

<template>
  <div class="w-full flex justify-center py-10">
    <!-- SUCCESS -->
    <div
      v-if="props.formSubmitted && !props.formError"
      class="max-w-md w-full bg-primary/10 border border-primary/30 rounded-md p-6 text-center shadow-sm"
    >
      <div
        class="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-primary/20"
      >
        <Icon name="ph:check-bold" class="text-2xl text-primary" />
      </div>

      <h2 class="text-lg font-semibold text-primary mb-2">
        {{ messages.successTitle }}
      </h2>

      <p class="text-sm text-dark">
        {{ messages.successMessage }}
      </p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="props.formError"
      class="max-w-md w-full bg-red-50 border border-red-200 rounded-md p-6 text-center shadow-sm"
    >
      <div
        class="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-red-100"
      >
        <Icon name="ph:x-bold" class="text-2xl text-red-800" />
      </div>

      <h2 class="text-lg font-semibold text-red-800 mb-2">
        {{ messages.errorTitle }}
      </h2>

      <p class="text-sm text-red-700">
        {{ messages.errorMessage }}
      </p>
    </div>
  </div>
</template>
```
