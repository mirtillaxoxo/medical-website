```vue
<script setup lang="ts">
import type { BrandInfo } from "~/composables/UseBarndInfo";

const form = defineModel<BrandInfo>({ required: true });

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

const labelClass = "mb-1 block text-xs font-medium text-gray-600";

const cardClass =
  "space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

function addContact() {
  form.value.contacts.push({
    title: "",
    type: "email",
    value: "",
  });
}

function addAccount() {
  form.value.accounts.push({
    title: "",
    value: "",
    icon: "",
  });
}

type FormContact = BrandInfo["contacts"][number];

function normalizeContact(contact: FormContact) {
  if (contact.type !== "email") {
    contact.value = normalizePhone(contact.value);
  }
}

function onTypeChange(contact: FormContact) {
  nextTick(() => normalizeContact(contact));
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="text-xl font-bold text-gray-900">Brand Info</h2>

    <!-- Dati generali -->
    <section :class="cardClass" aria-labelledby="general-info-title">
      <div>
        <h3 id="general-info-title" class="text-lg font-medium text-gray-900">
          Dati generali
        </h3>
        <p class="mt-1 text-xs text-gray-500">
          Tutti i campi sono obbligatori.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label :class="labelClass" for="brand-name">
            Nome <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-name"
            v-model="form.name"
            name="name"
            :class="inputClass"
            type="text"
            autocomplete="given-name"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-surname">
            Cognome <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-surname"
            v-model="form.surname"
            name="surname"
            :class="inputClass"
            type="text"
            autocomplete="family-name"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-title">
            Titolo <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-title"
            v-model="form.title"
            name="title"
            :class="inputClass"
            type="text"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-title-short">
            Titolo breve <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-title-short"
            v-model="form.titleShort"
            name="titleShort"
            :class="inputClass"
            type="text"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-subtitle">
            Sottotitolo <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-subtitle"
            v-model="form.subtitle"
            name="subtitle"
            :class="inputClass"
            type="text"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-role">
            Qualifica <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-role"
            v-model="form.role"
            name="role"
            :class="inputClass"
            type="text"
            placeholder="Medico Chirurgo"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-description">
            Descrizione <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-description"
            v-model="form.description"
            name="description"
            :class="inputClass"
            type="text"
            required
          />
        </div>

        <div>
          <label :class="labelClass" for="brand-website-url">
            Sito web <span class="text-red-600">*</span>
          </label>
          <input
            id="brand-website-url"
            v-model="form.websiteUrl"
            name="websiteUrl"
            :class="inputClass"
            type="url"
            placeholder="https://..."
            required
          />
        </div>
      </div>
    </section>

    <!-- Iscrizione all'Albo -->
    <section :class="cardClass" aria-labelledby="registration-title">
      <div>
        <h3 id="registration-title" class="text-lg font-medium text-gray-900">
          Iscrizione all'Albo
        </h3>
        <p class="mt-1 text-xs text-gray-500">Mostrata nel footer del sito.</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label :class="labelClass" for="registration-province">
            Provincia
          </label>
          <input
            id="registration-province"
            v-model="form.registration.province"
            name="registrationProvince"
            :class="inputClass"
            type="text"
            placeholder="MILANO"
          />
        </div>

        <div>
          <label :class="labelClass" for="registration-date">
            Data di iscrizione
          </label>
          <input
            id="registration-date"
            v-model="form.registration.date"
            name="registrationDate"
            :class="inputClass"
            type="text"
            placeholder="13 Aprile 2021"
          />
        </div>

        <div>
          <label :class="labelClass" for="registration-number">
            Numero di iscrizione
          </label>
          <input
            id="registration-number"
            v-model="form.registration.number"
            name="registrationNumber"
            :class="inputClass"
            type="text"
            placeholder="47968"
          />
        </div>

        <div class="sm:col-span-2">
          <label :class="labelClass" for="registration-url">
            Link verifica Albo
          </label>
          <input
            id="registration-url"
            v-model="form.registration.url"
            name="registrationUrl"
            :class="inputClass"
            type="url"
            placeholder="https://..."
          />
        </div>
      </div>
    </section>

    <!-- Contatti -->
    <section :class="cardClass" aria-labelledby="contacts-title">
      <div class="flex items-center justify-between gap-3">
        <h3 id="contacts-title" class="text-lg font-medium text-gray-900">
          Contatti
        </h3>

        <button
          type="button"
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          @click="addContact"
        >
          + Aggiungi contatto
        </button>
      </div>

      <p v-if="!form.contacts.length" class="text-sm text-gray-400">
        Nessun contatto inserito.
      </p>

      <div
        v-for="(contact, i) in form.contacts"
        :key="i"
        class="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3"
      >
        <div>
          <label :class="labelClass" :for="`contact-title-${i}`">
            Titolo
          </label>
          <input
            :id="`contact-title-${i}`"
            v-model="contact.title"
            :name="`contacts[${i}][title]`"
            :class="inputClass"
            type="text"
          />
        </div>

        <div>
          <label :class="labelClass" :for="`contact-type-${i}`"> Tipo </label>
          <select
            :id="`contact-type-${i}`"
            v-model="contact.type"
            :name="`contacts[${i}][type]`"
            :class="inputClass"
            @change="onTypeChange(contact)"
          >
            <option value="phone">Telefono</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div>
          <label :class="labelClass" :for="`contact-value-${i}`">
            Valore
          </label>
          <input
            :id="`contact-value-${i}`"
            v-model="contact.value"
            :name="`contacts[${i}][value]`"
            :class="inputClass"
            :type="contact.type === 'email' ? 'email' : 'tel'"
            :autocomplete="contact.type === 'email' ? 'email' : 'tel'"
            :placeholder="
              contact.type === 'email' ? 'nome@dominio.it' : '+39 333 1234567'
            "
            @blur="normalizeContact(contact)"
          />
        </div>

        <div class="text-right sm:col-span-3">
          <button
            type="button"
            class="text-sm text-red-600 hover:underline"
            :aria-label="`Rimuovi contatto ${i + 1}`"
            @click="form.contacts.splice(i, 1)"
          >
            Rimuovi contatto
          </button>
        </div>
      </div>
    </section>

    <!-- Account / Social -->
    <section :class="cardClass" aria-labelledby="accounts-title">
      <div class="flex items-center justify-between gap-3">
        <h3 id="accounts-title" class="text-lg font-medium text-gray-900">
          Account / Social
        </h3>

        <button
          type="button"
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          @click="addAccount"
        >
          + Aggiungi account
        </button>
      </div>

      <p v-if="!form.accounts.length" class="text-sm text-gray-400">
        Nessun account inserito.
      </p>

      <div
        v-for="(account, i) in form.accounts"
        :key="i"
        class="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2"
      >
        <div>
          <label :class="labelClass" :for="`account-title-${i}`">
            Titolo
          </label>
          <input
            :id="`account-title-${i}`"
            v-model="account.title"
            :name="`accounts[${i}][title]`"
            :class="inputClass"
            type="text"
          />
        </div>

        <div>
          <label :class="labelClass" :for="`account-url-${i}`"> URL </label>
          <input
            :id="`account-url-${i}`"
            v-model="account.value"
            :name="`accounts[${i}][value]`"
            :class="inputClass"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div class="text-right sm:col-span-2">
          <button
            type="button"
            class="text-sm text-red-600 hover:underline"
            :aria-label="`Rimuovi account ${i + 1}`"
            @click="form.accounts.splice(i, 1)"
          >
            Rimuovi account
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
```
